const bucketCount = 100003
const hashPair = (left, right) => ((left * 1009 + right) % bucketCount)

self.onmessage = async ({ data: { support } }) => {
  try {
    const started = performance.now()
    const response = await fetch('/data/preprocessing/final-baskets.json')
    const source = await response.json()
    const baskets = source.map(([, items]) => items)
    const threshold = Math.floor((support / 100) * baskets.length)
    const itemCounts = new Map()
    const buckets = new Uint32Array(bucketCount)
    for (const basket of baskets) {
      for (const item of basket) itemCounts.set(item, (itemCounts.get(item) || 0) + 1)
      for (let left = 0; left < basket.length; left += 1) for (let right = left + 1; right < basket.length; right += 1) buckets[hashPair(basket[left], basket[right])] += 1
    }
    const frequent = new Set([...itemCounts].filter(([, count]) => count >= threshold).map(([item]) => item))
    const candidates = new Map()
    for (const basket of baskets) {
      const filtered = basket.filter((item) => frequent.has(item))
      for (let left = 0; left < filtered.length; left += 1) for (let right = left + 1; right < filtered.length; right += 1) {
        const first = Math.min(filtered[left], filtered[right]); const second = Math.max(filtered[left], filtered[right])
        if (buckets[hashPair(first, second)] >= threshold) { const key = `${first}:${second}`; candidates.set(key, (candidates.get(key) || 0) + 1) }
      }
    }
    const pairs = [...candidates.values()].filter((count) => count >= threshold).length
    self.postMessage({ ok: true, support, threshold, baskets: baskets.length, frequentItems: frequent.size, candidates: candidates.size, frequentPairs: pairs, runtime: performance.now() - started })
  } catch { self.postMessage({ ok: false, error: 'Perhitungan browser gagal.' }) }
}
