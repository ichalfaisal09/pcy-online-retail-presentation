import { useState } from 'react'

const number = new Intl.NumberFormat('id-ID')

export default function BrowserPCYSlide({ support, setSupport }) {
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)
  const run = () => {
    setRunning(true); setResult(null)
    const worker = new Worker(new URL('./pcyWorker.js', import.meta.url), { type: 'module' })
    worker.onmessage = ({ data }) => { setRunning(false); setResult(data); worker.terminate() }
    worker.postMessage({ support: Number(support) || 0 })
  }
  const threshold = Math.floor(((Number(support) || 0) / 100) * 18294)
  return <section className="browser-pcy-slide" aria-labelledby="browser-pcy-title"><div className="section-heading"><p>08 — DEMO INTERAKTIF</p><h2 id="browser-pcy-title">Jalankan <span>PCY Langsung</span></h2></div><div className="browser-support-control"><label>MINIMUM SUPPORT <span><input type="number" min="0" max="100" step="0.1" value={support} onChange={(event) => setSupport(event.target.value)} aria-label="Minimum support dalam persen" />%</span></label><p><strong>{number.format(18294)} basket</strong> × <strong>{support}%</strong> = minimum <em>{number.format(threshold)} transaksi</em></p></div><p className="browser-pcy-intro">Nilai ini dipakai langsung saat PCY dijalankan di browser.</p><button type="button" className="run-pcy-button" onClick={run} disabled={running}>{running ? 'Menghitung Pass 1 & Pass 2…' : 'Jalankan PCY di Browser'}</button>{result && result.support === Number(support) && (result.ok ? <div className="browser-result-grid"><article><b>{number.format(result.frequentItems)}</b><span>Frequent Item</span></article><article><b>{number.format(result.candidates)}</b><span>Kandidat Pair</span></article><article><b>{number.format(result.frequentPairs)}</b><span>Frequent Pairs</span></article><article><b>{(result.runtime / 1000).toFixed(2).replace('.', ',')} s</b><span>Runtime Browser</span></article></div> : <p className="browser-pcy-error">{result.error}</p>)}<p className="browser-pcy-note">Perhitungan dijalankan secara lokal pada perangkat presenter; hasil dapat berbeda sedikit antarperangkat.</p></section>
}
