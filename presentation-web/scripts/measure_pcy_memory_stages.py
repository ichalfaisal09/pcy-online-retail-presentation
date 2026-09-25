import argparse
import gc
import itertools
import json
import tempfile
import time
import tracemalloc
import zlib
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "public" / "data" / "preprocessing"
NUM_BUCKETS = 100_003
TOTAL_BASKETS = 18_294


def stable_pair_hash(item1, item2, num_buckets):
    a, b = min(item1, item2), max(item1, item2)
    return zlib.crc32((a + "\x00" + b).encode("utf-8")) % num_buckets


def prepare_basket_file():
    metadata = json.loads((DATA_DIR / "metadata.json").read_text(encoding="utf-8"))
    encoded_baskets = json.loads((DATA_DIR / "final-baskets.json").read_text(encoding="utf-8"))
    descriptions = metadata["descriptions"]
    handle = tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix="-cleaned-baskets.txt", delete=False)
    with handle:
        for _, item_ids in encoded_baskets:
            handle.write(";".join(descriptions[item_id] for item_id in item_ids) + "\n")
    return Path(handle.name)


def memory_checkpoint(label, checkpoints):
    current, peak = tracemalloc.get_traced_memory()
    checkpoints.append({
        "stage": label,
        "current_mb": current / (1024 * 1024),
        "peak_mb": peak / (1024 * 1024),
    })


def run_measurement(baskets_path, support_percent):
    threshold = int((support_percent / 100) * TOTAL_BASKETS)
    gc.collect()
    tracemalloc.start()
    start = time.perf_counter()
    checkpoints = []

    item_counts = defaultdict(int)
    bucket_counts = [0] * NUM_BUCKETS
    with baskets_path.open("r", encoding="utf-8") as source:
        for line in source:
            items = line.strip().split(";")
            if not items or not items[0]:
                continue
            for item in items:
                item_counts[item] += 1
            for item1, item2 in itertools.combinations(sorted(items), 2):
                bucket_counts[stable_pair_hash(item1, item2, NUM_BUCKETS)] += 1
    memory_checkpoint("Setelah Pass 1", checkpoints)

    frequent_items = {item for item, count in item_counts.items() if count >= threshold}
    bitmap = [1 if count >= threshold else 0 for count in bucket_counts]
    memory_checkpoint("Setelah bitmap", checkpoints)

    candidate_pair_counts = defaultdict(int)
    with baskets_path.open("r", encoding="utf-8") as source:
        for line in source:
            items = line.strip().split(";")
            if not items or not items[0]:
                continue
            for pair in itertools.combinations(sorted(items), 2):
                item1, item2 = pair
                if item1 in frequent_items and item2 in frequent_items:
                    if bitmap[stable_pair_hash(item1, item2, NUM_BUCKETS)] == 1:
                        candidate_pair_counts[pair] += 1
    memory_checkpoint("Setelah Pass 2", checkpoints)

    frequent_pairs = {
        pair: count
        for pair, count in candidate_pair_counts.items()
        if count >= threshold
    }
    memory_checkpoint("Setelah frequent pair", checkpoints)

    rules = []
    for (item_a, item_b), pair_count in frequent_pairs.items():
        for cause, effect in ((item_a, item_b), (item_b, item_a)):
            confidence = pair_count / item_counts[cause]
            effect_popularity = item_counts[effect] / TOTAL_BASKETS
            interest = confidence - effect_popularity
            if interest > 0.1:
                rules.append((cause, effect, pair_count / TOTAL_BASKETS, confidence, interest))
    memory_checkpoint("Setelah association rule", checkpoints)

    _, total_peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    return {
        "support_percent": support_percent,
        "threshold": threshold,
        "frequent_items": len(frequent_items),
        "candidate_pairs": len(candidate_pair_counts),
        "frequent_pairs": len(frequent_pairs),
        "rules": len(rules),
        "runtime_seconds": time.perf_counter() - start,
        "total_peak_mb": total_peak / (1024 * 1024),
        "checkpoints": checkpoints,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--supports", nargs="+", type=float, default=[1, 2, 3])
    parser.add_argument("--output", type=Path, default=ROOT / "memory-checkpoints.json")
    args = parser.parse_args()

    baskets_path = prepare_basket_file()
    try:
        results = []
        for support in args.supports:
            print(f"Measuring support {support:g}%...", flush=True)
            result = run_measurement(baskets_path, support)
            results.append(result)
            print(json.dumps(result, ensure_ascii=False), flush=True)
        args.output.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Saved: {args.output}", flush=True)
    finally:
        baskets_path.unlink(missing_ok=True)


if __name__ == "__main__":
    main()

