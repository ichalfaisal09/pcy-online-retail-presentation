import json
from pathlib import Path
import numpy as np
import pandas as pd

SOURCE = Path(r"E:\TugasLugas\AnalisisBigData\Online Retail.xlsx")
OUTPUT = Path(__file__).resolve().parents[1] / "public" / "data" / "preprocessing"
BLACKLIST = {"POSTAGE", "DOTCOM POSTAGE", "BANK CHARGES", "MANUAL", "AMAZON FEE", "DISCOUNT", "SAMPLES", "CRUK COMMISSION"}
DTYPE = np.dtype([("invoice", "<u2"), ("stock_code", "<u2"), ("description", "<u2"), ("quantity", "<f4")], align=False)

def encode(values):
    unique = pd.unique(values)
    return unique.tolist(), values.map({value: index for index, value in enumerate(unique)}).to_numpy(dtype=np.uint16)

def dump_json(name, value):
    with (OUTPUT / name).open("w", encoding="utf-8") as output:
        json.dump(value, output, ensure_ascii=False, separators=(",", ":"))

def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    print("Reading workbook…", flush=True)
    raw = pd.read_excel(SOURCE, usecols=["InvoiceNo", "StockCode", "Description", "Quantity"])
    raw["InvoiceNo"] = raw["InvoiceNo"].astype(str)
    raw["StockCode"] = raw["StockCode"].astype(str)
    raw["Description"] = raw["Description"].astype("string").str.strip()
    valid = (~raw["InvoiceNo"].str.startswith("C") & (raw["Quantity"] > 0) & raw["Description"].notna() & raw["Description"].ne("")).fillna(False)
    eligible = raw.loc[valid].copy()
    products = eligible.loc[~eligible["Description"].str.upper().isin(BLACKLIST)].copy()
    unique = products.drop_duplicates(subset=["InvoiceNo", "Description"], keep="first").copy()
    sizes = unique.groupby("InvoiceNo")["Description"].nunique()
    final = unique[unique["InvoiceNo"].isin(sizes[sizes >= 2].index)].copy()
    actual = {"raw_rows": len(raw), "eligible_rows": len(eligible), "product_rows": len(products), "unique_rows": len(unique), "baskets_before_pruning": len(sizes), "final_baskets": int((sizes >= 2).sum()), "unique_products": unique["Description"].nunique()}
    expected = {"raw_rows": 541909, "eligible_rows": 530693, "product_rows": 528515, "unique_rows": 517721, "baskets_before_pruning": 19961, "final_baskets": 18294, "unique_products": 4059}
    if actual != expected: raise RuntimeError(f"Pipeline total tidak sesuai. expected={expected}; actual={actual}")
    print("Cleaning totals verified.", flush=True)
    normalized = raw.copy(); normalized["Description"] = normalized["Description"].fillna("")
    invoices, invoice_ids = encode(normalized["InvoiceNo"])
    stocks, stock_ids = encode(normalized["StockCode"])
    descriptions, description_ids = encode(normalized["Description"])
    packed = np.empty(len(normalized), dtype=DTYPE)
    packed["invoice"], packed["stock_code"], packed["description"] = invoice_ids, stock_ids, description_ids
    packed["quantity"] = normalized["Quantity"].astype("float32").to_numpy()
    packed.tofile(OUTPUT / "records.bin")
    for name, rows in [("raw.ids", raw), ("eligible.ids", eligible), ("products.ids", products)]: np.asarray(rows.index, dtype="<u4").tofile(OUTPUT / name)
    description_lookup = {description: index for index, description in enumerate(descriptions)}
    baskets = [[invoices.index(invoice), [description_lookup[value] for value in group["Description"]]] for invoice, group in final.groupby("InvoiceNo", sort=True)]
    dump_json("final-baskets.json", baskets)
    dump_json("metadata.json", {"format": "records.bin: uint16 invoice, uint16 stockCode, uint16 description, float32 quantity (10 bytes/record)", "invoices": invoices, "stockCodes": stocks, "descriptions": descriptions, "stages": {"raw": {"label": "Data mentah", "rows": actual["raw_rows"], "file": "raw.ids"}, "eligible": {"label": "Hasil filter kelayakan", "rows": actual["eligible_rows"], "file": "eligible.ids"}, "products": {"label": "Hasil filter item non-produk", "rows": actual["product_rows"], "file": "products.ids"}, "baskets": {"label": "Basket siap PCY", "rows": actual["final_baskets"], "file": "final-baskets.json"}}, "summary": actual})
    print(json.dumps(actual), flush=True)

if __name__ == "__main__": main()
