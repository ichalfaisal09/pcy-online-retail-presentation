import { useEffect, useState } from 'react'

const basePath = '/data/preprocessing/'
const pageSize = 50
const number = new Intl.NumberFormat('id-ID')
let cache = null

async function getMetadata() {
  if (!cache) cache = { metadata: await fetch(`${basePath}metadata.json`).then((response) => response.json()) }
  return cache.metadata
}

async function getRecords() {
  if (!cache.records) cache.records = await fetch(`${basePath}records.bin`).then((response) => response.arrayBuffer())
  return new DataView(cache.records)
}

async function getStageIds(name) {
  if (!cache[name]) {
    const metadata = await getMetadata()
    cache[name] = new Uint32Array(await fetch(`${basePath}${metadata.stages[name].file}`).then((response) => response.arrayBuffer()))
  }
  return cache[name]
}

function unpackRecord(view, index, metadata) {
  const offset = index * 10
  return {
    invoice: metadata.invoices[view.getUint16(offset, true)],
    stockCode: metadata.stockCodes[view.getUint16(offset + 2, true)],
    description: metadata.descriptions[view.getUint16(offset + 4, true)] || '—',
    quantity: view.getFloat32(offset + 6, true),
  }
}

function DataTable({ stage, metadata, page }) {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        if (stage === 'baskets') {
          if (!cache.baskets) cache.baskets = await fetch(`${basePath}final-baskets.json`).then((response) => response.json())
          const start = page * pageSize
          const result = cache.baskets.slice(start, start + pageSize).map(([invoiceId, itemIds]) => ({
            invoice: metadata.invoices[invoiceId],
            count: itemIds.length,
            items: itemIds.map((itemId) => metadata.descriptions[itemId]).join(', '),
          }))
          if (alive) setRows(result)
          return
        }
        const [ids, records] = await Promise.all([getStageIds(stage), getRecords()])
        const start = page * pageSize
        const result = Array.from(ids.slice(start, start + pageSize), (id) => unpackRecord(records, id, metadata))
        if (alive) setRows(result)
      } catch {
        if (alive) setError('Data asli tidak dapat dimuat. Coba muat ulang halaman.')
      }
    }
    load()
    return () => { alive = false }
  }, [stage, metadata, page])

  if (error) return <p className="data-modal-status error">{error}</p>
  if (!rows) return <p className="data-modal-status">Memuat data asli…</p>
  if (stage === 'baskets') return <div className="modal-table-wrap"><table><thead><tr><th>InvoiceNo</th><th>Jumlah item unik</th><th>Isi basket</th></tr></thead><tbody>{rows.map((row) => <tr key={row.invoice}><td>{row.invoice}</td><td>{row.count}</td><td>{row.items}</td></tr>)}</tbody></table></div>
  return <div className="modal-table-wrap"><table><thead><tr><th>InvoiceNo</th><th>Description</th></tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.invoice}-${row.stockCode}-${index}`}><td>{row.invoice}</td><td>{row.description}</td></tr>)}</tbody></table></div>
}

export default function PreprocessingDataModal({ stage, onClose }) {
  const [metadata, setMetadata] = useState(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    let alive = true
    getMetadata().then((result) => { if (alive) setMetadata(result) })
    return () => { alive = false }
  }, [])
  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])
  if (!metadata) return <div className="data-modal-backdrop"><div className="data-modal"><p className="data-modal-status">Memuat struktur data…</p></div></div>
  const config = metadata.stages[stage]
  const totalPages = Math.ceil(config.rows / pageSize)
  return <div className="data-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="data-modal" role="dialog" aria-modal="true" aria-labelledby="data-modal-title"><header><div><span>DATA ASLI · PREPROCESSING</span><h3 id="data-modal-title">{config.label}</h3><p className={stage === 'products' ? 'modal-important-total' : ''}><b>{number.format(config.rows)}</b> {stage === 'baskets' ? 'basket' : 'baris data'} · menampilkan {number.format(page * pageSize + 1)}–{number.format(Math.min((page + 1) * pageSize, config.rows))}</p></div><button type="button" onClick={onClose} aria-label="Tutup tabel data">×</button></header><DataTable stage={stage} metadata={metadata} page={page} /><footer><button type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>← Sebelumnya</button><span>Halaman {number.format(page + 1)} / {number.format(totalPages)}</span><button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((value) => value + 1)}>Berikutnya →</button></footer></section></div>
}
