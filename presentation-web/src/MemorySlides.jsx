import { useEffect, useState } from 'react'

const sampleBaskets = [
  ['B1', 'A, B, C'], ['B2', 'A, B'], ['B3', 'B, C'],
  ['B4', 'C, D'], ['B5', 'C, D'], ['B6', 'A, D'],
]
const itemCounts = [['A', '3', 'Lolos'], ['B', '3', 'Lolos'], ['C', '4', 'Lolos'], ['D', '3', 'Lolos']]
const pairTrace = [
  ['A–B', '2', '4', '2'], ['A–C', '1', '3', '2'], ['A–D', '1', '3', '2'],
  ['B–C', '2', '1', '2'], ['C–D', '2', '6', '2'],
]
const candidateTrace = [
  ['A–B', 'Ya', '1', 'Dihitung', '2', 'Frequent'],
  ['A–C', 'Ya', '1', 'Dihitung', '1', 'Gagal'],
  ['A–D', 'Ya', '1', 'Dihitung', '1', 'Gagal'],
  ['B–C', 'Ya', '1', 'Dihitung', '2', 'Frequent'],
  ['C–D', 'Ya', '1', 'Dihitung', '2', 'Frequent'],
]
const memoryResults = [
  ['1%', '375.747', 59.47, '59,47 MB'], ['2%', '21.080', 6.34, '6,34 MB'],
  ['3%', '815', 3.83, '3,83 MB'], ['5%', '5', 3.68, '3,68 MB'], ['10%', '0', 3.68, '3,68 MB'],
]

function TraceTable({ headers, rows, highlightLast = false }) {
  return <div className="trace-table" role="table"><div className="trace-head" role="row">{headers.map((header) => <span key={header}>{header}</span>)}</div>{rows.map((row, index) => <div className={highlightLast && index === rows.length - 1 ? 'trace-row trace-highlight' : 'trace-row'} role="row" key={row.join('-')}>{row.map((value, cell) => <span key={cell}>{value}</span>)}</div>)}</div>
}

export function MemoryTitleSlide() {
  return <section className="calculation-title-slide memory-title-slide" aria-labelledby="memory-title"><p className="kicker">TRACE PERHITUNGAN PCY</p><h1 id="memory-title">Dari Basket hingga <span>Memori PCY</span></h1><p className="subtitle">Satu contoh yang diikuti langkah demi langkah: menghitung item, mengisi bucket, membuat bitmap, menyaring kandidat, dan membaca penggunaan memorinya.</p><div className="calculation-flow"><span>INPUT</span><b>→</b><span>PASS 1</span><b>→</b><span>BITMAP</span><b>→</b><span>PASS 2</span><b>→</b><span>OUTPUT</span></div></section>
}

export function TraceInputSlide() {
  return <section className="memory-slide" aria-labelledby="trace-input-title"><div className="section-heading"><p>01 — INPUT CONTOH</p><h2 id="trace-input-title">Dataset Mini yang <span>Akan Dilacak</span></h2></div><div className="trace-input-layout"><TraceTable headers={['BASKET', 'ITEM UNIK']} rows={sampleBaskets} /><article className="trace-config"><span>KONFIGURASI CONTOH</span><strong>6 basket · 4 item · 7 bucket</strong><div className="mini-formula">floor(33,34% × 6) = <b>2</b></div><p>Item atau pasangan harus muncul minimal <b>2 kali</b> agar dinyatakan frequent.</p></article></div><aside className="memory-callout"><b>Mengapa contoh kecil?</b> Seluruh perubahan struktur data dapat diperlihatkan. Setelah alurnya dipahami, rumus yang sama diterapkan pada 18.294 basket dan 100.003 bucket.</aside></section>
}

export function ItemCountTraceSlide() {
  return <section className="memory-slide" aria-labelledby="item-count-title"><div className="section-heading"><p>02 — PASS 1A</p><h2 id="item-count-title">Menghitung <span>Frekuensi Item</span></h2></div><div className="trace-split"><article className="trace-code-card"><span>PROSES SETIAP BASKET</span><code>for item in basket:<br />&nbsp;&nbsp;item_counts[item] += 1</code><p>B1 menambah A, B, C. B2 menambah A dan B. Proses diteruskan sampai B6.</p></article><TraceTable headers={['ITEM', 'COUNT', 'COUNT ≥ 2']} rows={itemCounts} /></div><aside className="memory-callout mint"><b>Keadaan setelah Pass 1A:</b> A=3, B=3, C=4, dan D=3. Semua item lolos batas minimum dan masuk ke himpunan <code>frequent_items</code>.</aside></section>
}

export function PairMatrixSlide() {
  const scanBaskets = [
    { id: 'B1', items: ['A', 'B', 'C'], pairs: ['AB', 'AC', 'BC'] },
    { id: 'B2', items: ['A', 'B'], pairs: ['AB'] },
    { id: 'B3', items: ['B', 'C'], pairs: ['BC'] },
    { id: 'B4', items: ['C', 'D'], pairs: ['CD'] },
    { id: 'B5', items: ['C', 'D'], pairs: ['CD'] },
    { id: 'B6', items: ['A', 'D'], pairs: ['AD'] },
  ]
  const labels = ['A', 'B', 'C', 'D']
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing || step >= scanBaskets.length) return undefined
    const timer = window.setTimeout(() => {
      setStep((value) => Math.min(scanBaskets.length, value + 1))
      if (step + 1 >= scanBaskets.length) setPlaying(false)
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [playing, step, scanBaskets.length])
  const counts = { AB: 0, AC: 0, AD: 0, BC: 0, BD: 0, CD: 0 }
  scanBaskets.slice(0, step).forEach((basket) => basket.pairs.forEach((pair) => { counts[pair] += 1 }))
  const current = step > 0 ? scanBaskets[step - 1] : null
  const previousCounts = { ...counts }
  if (current) current.pairs.forEach((pair) => { previousCounts[pair] -= 1 })
  const reset = () => { setPlaying(false); setStep(0) }
  const previous = () => { setPlaying(false); setStep((value) => Math.max(0, value - 1)) }
  const next = () => { setPlaying(false); setStep((value) => Math.min(scanBaskets.length, value + 1)) }
  const cellClass = (row, column, pair, value) => {
    if (column < row) return 'matrix-unused'
    if (row === column) return 'matrix-diagonal'
    const status = value >= 2 ? 'matrix-frequent' : value > 0 ? 'matrix-candidate' : 'matrix-zero'
    return current?.pairs.includes(pair) ? status + ' matrix-updated' : status
  }
  return <section className="memory-slide" aria-labelledby="pair-matrix-title"><div className="section-heading"><p>03 — VISUALISASI PASANGAN</p><h2 id="pair-matrix-title">Pertambahan Count pada <span>Matriks Pasangan</span></h2></div>
    <div className="matrix-scan-status" aria-live="polite"><div><span>PROGRES PEMINDAIAN</span><strong>{step} / {scanBaskets.length} basket</strong></div><div className="scan-progress"><i style={{ width: `${(step / scanBaskets.length) * 100}%` }} /></div><div className="matrix-controls"><button type="button" onClick={reset} disabled={step === 0}>Reset</button><button type="button" onClick={previous} disabled={step === 0}>← Sebelumnya</button><button type="button" onClick={next} disabled={step === scanBaskets.length}>Basket berikutnya →</button><button type="button" className={playing ? 'active' : ''} onClick={() => setPlaying((value) => !value)} disabled={step === scanBaskets.length}>{playing ? 'Jeda' : 'Putar otomatis'}</button></div></div>
    <div className="matrix-layout"><div className="pair-matrix" role="table" aria-label="Matriks count pasangan item A sampai D"><div className="matrix-row"><span className="matrix-label" />{labels.map((label) => <span className="matrix-label" key={label}>{label}</span>)}</div>{labels.map((rowLabel, row) => <div className="matrix-row" role="row" key={rowLabel}><span className="matrix-label">{rowLabel}</span>{labels.map((columnLabel, column) => { const pair = row < column ? rowLabel + columnLabel : columnLabel + rowLabel; const value = row === column ? '—' : counts[pair]; return <span className={cellClass(row, column, pair, value)} role="cell" key={columnLabel}>{column < row ? '' : value}</span> })}</div>)}</div>
      <article className="matrix-reading"><span>BASKET YANG SEDANG DIPROSES</span>{current ? <><strong>{current.id} = {'{'}{current.items.join(', ')}{'}'}</strong><p>Pasangan terbentuk: <b>{current.pairs.map((pair) => pair[0] + '–' + pair[1]).join(', ')}</b>.</p><div className="increment-log">{current.pairs.map((pair) => <div key={pair}><span>{pair[0]}–{pair[1]}</span><b>{previousCounts[pair]} → {counts[pair]}</b><em>{counts[pair] >= 2 ? 'Frequent' : 'Belum frequent'}</em></div>)}</div></> : <><strong>Belum ada basket dipindai</strong><p>Klik <b>Basket berikutnya</b> untuk membaca B1 dan melihat count matriks bertambah.</p></>}<small>Batas minimum contoh: count ≥ 2</small></article>
    </div>
    <div className="matrix-legend"><span><i className="legend-frequent" />Frequent · count ≥ 2</span><span><i className="legend-candidate" />Sudah muncul, count masih 1</span><span><i className="legend-zero" />Belum pernah muncul</span><span><i className="legend-diagonal" />Item dengan dirinya sendiri</span></div>
    <aside className="memory-callout"><b>Yang perlu diamati:</b> angka bertambah ketika basket dibaca. Contohnya A–B berubah 0 → 1 saat B1, kemudian 1 → 2 saat B2 dan statusnya berubah menjadi frequent.</aside>
  </section>
}
export function PairHashTraceSlide() {
  return <section className="memory-slide" aria-labelledby="pair-hash-title"><div className="section-heading"><p>04 — PASS 1B</p><h2 id="pair-hash-title">Membentuk Pasangan dan <span>Hash Bucket</span></h2></div><div className="hash-formula"><span>stable_pair_hash(A, B)</span><b>=</b><span>crc32(&quot;A\0B&quot;) mod 7</span><b>=</b><strong>bucket 4</strong></div><TraceTable headers={['PASANGAN', 'KEMUNCULAN', 'BUCKET', 'COUNT BUCKET AKHIR']} rows={pairTrace} /><aside className="memory-callout"><b>Collision:</b> A–C dan A–D sama-sama masuk bucket 3. Bucket menyimpan total gabungan 2, bukan identitas pasangan yang membentuknya.</aside></section>
}

export function BucketStateSlide() {
  const buckets = [['0', '0', 'Tidak frequent'], ['1', '2', 'Frequent'], ['2', '0', 'Tidak frequent'], ['3', '2', 'Frequent'], ['4', '2', 'Frequent'], ['5', '0', 'Tidak frequent'], ['6', '2', 'Frequent']]
  return <section className="memory-slide" aria-labelledby="bucket-state-title"><div className="section-heading"><p>05 — HASIL PASS 1</p><h2 id="bucket-state-title">Keadaan Akhir <span>Bucket Counter</span></h2></div><TraceTable headers={['BUCKET', 'COUNT', 'STATUS COUNT ≥ 2']} rows={buckets} /><div className="state-transition"><div><span>SEBELUM MEMBACA DATA</span><code>[0, 0, 0, 0, 0, 0, 0]</code></div><b>→</b><div><span>SETELAH PASS 1</span><code>[0, 2, 0, 2, 2, 0, 2]</code></div></div><aside className="memory-callout"><b>Memori aktif:</b> <code>item_counts</code> menyimpan count item, sedangkan <code>bucket_counts</code> menyimpan satu penghitung untuk setiap bucket.</aside></section>
}

export function BitmapTraceSlide() {
  const bitmap = [['0', '0', '0'], ['1', '2', '1'], ['2', '0', '0'], ['3', '2', '1'], ['4', '2', '1'], ['5', '0', '0'], ['6', '2', '1']]
  return <section className="memory-slide" aria-labelledby="bitmap-trace-title"><div className="section-heading"><p>06 — TRANSISI</p><h2 id="bitmap-trace-title">Mengubah Count menjadi <span>Bitmap</span></h2></div><div className="bitmap-rule"><div><span>count ≥ 2</span><strong>→ 1</strong><small>bucket boleh diperiksa pada Pass 2</small></div><div><span>count &lt; 2</span><strong>→ 0</strong><small>pasangan langsung diabaikan</small></div></div><TraceTable headers={['BUCKET', 'COUNT', 'BIT']} rows={bitmap} /><aside className="memory-callout mint"><b>Bitmap contoh:</b> <code>[0, 1, 0, 1, 1, 0, 1]</code>. Bit 1 tidak menjamin suatu pasangan frequent; bit 1 hanya berarti pasangan tersebut masih mungkin menjadi frequent.</aside></section>
}

export function BitmapMemorySlide() {
  return <section className="memory-slide" aria-labelledby="bitmap-memory-title"><div className="section-heading"><p>07 — MEMORI BITMAP</p><h2 id="bitmap-memory-title">Ideal vs <span>Implementasi Python</span></h2></div><div className="memory-compare-grid"><article><span>BITMAP IDEAL</span><strong>100.003 ÷ 8 ÷ 1.024</strong><b>≈ 12,21 KiB</b><p>Satu bucket benar-benar dikemas menjadi satu bit.</p></article><article><span>KODE SAAT INI</span><code>bitmap = [0 atau 1, ...]</code><b>≈ 781,27 KiB referensi</b><p>Estimasi 100.003 × 8 byte pada Python 64-bit, belum termasuk objek list. Nilai aktual bergantung pada lingkungan.</p></article></div><aside className="memory-callout warning"><b>Perbedaan penting:</b> kode menggunakan list angka 0/1, bukan bit-packed bitmap. Karena itu ukuran teoretis 12,21 KiB tidak boleh disebut sebagai total penggunaan memori implementasi.</aside></section>
}

export function CandidateGateSlide() {
  return <section className="memory-slide" aria-labelledby="candidate-gate-title"><div className="section-heading"><p>08 — PASS 2</p><h2 id="candidate-gate-title">Menyaring dan Menghitung <span>Kandidat Pair</span></h2></div><div className="gate-rule"><span>PASANGAN DIHITUNG JIKA</span><strong>kedua item frequent</strong><b>+</b><strong>bitmap[hash(pair)] = 1</strong></div><TraceTable headers={['PAIR', 'ITEM FREQ.', 'BIT', 'AKSI', 'COUNT', 'HASIL']} rows={candidateTrace} /><aside className="memory-callout"><b>False positive bitmap:</b> A–C dan A–D lolos karena collision di bucket 3, tetapi count masing-masing hanya 1 sehingga gagal pada pemeriksaan akhir.</aside></section>
}

export function FrequentPairTraceSlide() {
  return <section className="memory-slide" aria-labelledby="frequent-pair-title"><div className="section-heading"><p>09 — OUTPUT PCY</p><h2 id="frequent-pair-title">Dari Kandidat menjadi <span>Frequent Pair</span></h2></div><div className="output-filter"><div><span>CANDIDATE PAIR COUNTS</span><code>{'{AB:2, AC:1, AD:1, BC:2, CD:2}'}</code></div><b>FILTER COUNT ≥ 2</b><div className="frequent-output"><span>FREQUENT PAIRS</span><code>{'{AB:2, BC:2, CD:2}'}</code></div></div><div className="memory-object-note"><strong>Struktur memori utama pada tahap ini</strong><span>Dictionary key: tuple pasangan</span><span>Dictionary value: integer count</span><span>Overhead tabel hash</span></div><aside className="memory-callout mint"><b>Hasil contoh:</b> dari 5 kandidat yang dihitung, hanya 3 pasangan memenuhi batas minimum. Penyaringan bitmap mengurangi pekerjaan, tetapi verifikasi count tetap dilakukan.</aside></section>
}

export function RuleTraceSlide() {
  return <section className="memory-slide" aria-labelledby="rule-trace-title"><div className="section-heading"><p>10 — ASSOCIATION RULE</p><h2 id="rule-trace-title">Menghitung Rule <span>A → B</span></h2></div><div className="rule-calc-grid"><article><span>SUPPORT</span><strong>count(A,B) ÷ N</strong><b>2 ÷ 6 = 33,33%</b></article><article><span>CONFIDENCE</span><strong>count(A,B) ÷ count(A)</strong><b>2 ÷ 3 = 66,67%</b></article><article><span>INTEREST</span><strong>confidence(A→B) − support(B)</strong><b>66,67% − 50% = 0,167</b></article></div><aside className="memory-callout mint"><b>Keputusan:</b> interest 0,167 &gt; 0,1, sehingga rule A → B lolos filter pada kode. Contoh ini menjelaskan rumus; output sebenarnya tetap menggunakan nama produk lengkap pada dataset Online Retail.</aside></section>
}

export function MemoryTimelineSlide() {
  const rows = [
    ['Setelah Pass 1', '2,92 MB', '2,91 MB', '2,91 MB'],
    ['Setelah bitmap', '3,71 MB', '3,71 MB', '3,69 MB'],
    ['Setelah Pass 2', '51,52 MB', '6,25 MB', '3,83 MB'],
    ['Setelah frequent pair', '51,55 MB', '6,25 MB', '3,83 MB'],
    ['Setelah association rule', '51,84 MB', '6,28 MB', '3,84 MB'],
  ]
  return <section className="memory-slide" aria-labelledby="memory-timeline-title"><div className="section-heading"><p>11 — CHECKPOINT MEMORI</p><h2 id="memory-timeline-title">Alokasi Aktif pada <span>Setiap Tahap</span></h2></div><p className="checkpoint-intro">Hasil satu pengujian khusus checkpoint menggunakan 18.294 basket, 100.003 bucket, hash CRC32, dan implementasi Python yang sama.</p><TraceTable headers={['TAHAP', 'SUPPORT 1%', 'SUPPORT 2%', 'SUPPORT 3%']} rows={rows} /><div className="checkpoint-peaks"><article><span>PEAK 1%</span><strong>58,86 MB</strong><small>375.747 kandidat</small></article><article><span>PEAK 2%</span><strong>6,40 MB</strong><small>21.080 kandidat</small></article><article><span>PEAK 3%</span><strong>3,99 MB</strong><small>815 kandidat</small></article></div><aside className="memory-callout mint"><b>Temuan utama:</b> kebutuhan awal Pass 1 dan bitmap hampir sama pada seluruh support. Selisih terbesar muncul pada Pass 2 ketika <code>candidate_pair_counts</code> menyimpan kandidat yang lolos filter.</aside><aside className="checkpoint-note"><b>Cara membaca:</b> nilai tabel adalah alokasi yang masih aktif (<em>current</em>) saat checkpoint diambil. Kartu di bawah tabel menunjukkan nilai tertinggi (<em>peak</em>) sepanjang proses.</aside></section>
}
export function MemoryResultsSlide() {
  const maxPeak = Math.max(...memoryResults.map((item) => item[2]))
  return <section className="memory-slide" aria-labelledby="memory-results-title"><div className="section-heading"><p>12 — EKSPERIMEN UTAMA</p><h2 id="memory-results-title">Peak Memory berdasarkan <span>Minimum Support</span></h2></div><div className="memory-chart">{memoryResults.map(([support, candidates, peak, label]) => <div className="memory-chart-row" key={support}><b>{support}</b><span>{candidates} kandidat</span><div><i style={{ width: `${Math.max(6, (peak / maxPeak) * 100)}%` }} /></div><strong>{label}</strong></div>)}</div><aside className="memory-callout mint"><b>Hubungan utama:</b> tabel ini memakai hasil eksperimen utama sebelumnya: pada 1% terdapat 375.747 kandidat dan peak 59,47 MB. Pada 3% hanya 815 kandidat dan peak turun menjadi 3,83 MB. Dictionary kandidat menjadi faktor perubahan terbesar.</aside></section>
}

export function MeasurementSlide() {
  return <section className="memory-slide" aria-labelledby="measurement-title"><div className="section-heading"><p>13 — METODE PENGUKURAN</p><h2 id="measurement-title">Apa Arti Angka <span>Peak Memory?</span></h2></div><div className="measurement-code"><code>tracemalloc.start()</code><b>→</b><code>Pass 1 + bitmap + Pass 2 + rules</code><b>→</b><code>get_traced_memory()</code></div><div className="measurement-grid"><article><span>YANG DIUKUR</span><strong>Alokasi objek Python</strong><p>Puncak alokasi yang dilacak sejak <code>tracemalloc.start()</code>.</p></article><article><span>BUKAN</span><strong>Seluruh RAM sistem</strong><p>Nilainya tidak sama dengan RSS proses atau penggunaan RAM pada Task Manager.</p></article></div><aside className="memory-callout"><b>Istilah yang akurat:</b> gunakan “Peak Memory (tracemalloc)”, bukan klaim bahwa angka tersebut merupakan seluruh RAM yang digunakan komputer.</aside></section>
}

export function MemoryConclusionSlide() {
  return <section className="memory-slide" aria-labelledby="memory-conclusion-title"><div className="section-heading"><p>14 — KESIMPULAN</p><h2 id="memory-conclusion-title">Alur Lengkap <span>Perhitungan Memori</span></h2></div><div className="memory-conclusion-grid"><article><span>1 · FILTER</span><strong>Bitmap menyaring</strong><p>Bucket 0 menghentikan kandidat sebelum count dilakukan pada Pass 2.</p></article><article><span>2 · REPRESENTASI</span><strong>List ≠ bit-packed</strong><p>Implementasi Python menggunakan memori lebih besar daripada ukuran ideal bitmap.</p></article><article><span>3 · FAKTOR UTAMA</span><strong>Jumlah kandidat</strong><p>Support rendah meningkatkan jumlah dictionary entry dan peak memory.</p></article></div><aside className="memory-final-statement">Urutannya adalah: basket dibaca → item dan bucket dihitung → bitmap dibentuk → kandidat disaring dan dihitung → frequent pair dipilih → rule dibuat → puncak alokasi dilaporkan.</aside></section>
}







