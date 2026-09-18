import { useEffect, useState } from 'react'
import './App.css'

const details = [['Nama', 'Faisal'], ['NIM', 'D082261012'], ['Mata Kuliah', 'Analisis Big Data'], ['Dosen Pengampu', 'Mukarramah Yusuf, B.Sc., M.Sc., Ph.D.']]

const backgroundPoints = [
  <>Data <strong>transaksi retail</strong> menyimpan informasi berharga mengenai pola pembelian konsumen yang dapat dianalisis.</>,
  <>Analisis ini bertujuan menemukan pola produk yang <strong>sering dibeli secara bersamaan</strong> dalam satu keranjang belanja.</>,
  <><strong>Manfaat bisnis:</strong> mendukung rekomendasi produk, strategi <em>bundling</em>, promosi silang, dan penempatan produk.</>,
  <><strong>Fokus analisis:</strong> pencarian <em>frequent itemsets</em> menggunakan <strong>Algoritma Park-Chen-Yu (PCY)</strong> yang efisien untuk data berskala besar.</>,
]

function BackgroundSlide() {
  return <section className="background-slide" aria-labelledby="background-title">
    <div className="section-heading"><p>01 — KONTEKS PENELITIAN</p><h2 id="background-title">Latar <span>Belakang</span></h2></div>
    <div className="background-grid">
      <ol className="point-list">{backgroundPoints.map((point, index) => <li key={index}><span className="point-number">0{index + 1}</span><p>{point}</p></li>)}</ol>
      <div className="data-card" aria-label="Ilustrasi pola data penjualan">
        <div className="card-label"><span /> RETAIL PATTERNS</div>
        <div className="chart-area"><div className="axis y-axis" /><div className="axis x-axis" /><div className="bar bar-a" /><div className="bar bar-b" /><div className="bar bar-c" /><svg viewBox="0 0 240 130" aria-hidden="true"><path d="M10 105 L55 78 L99 91 L146 34 L190 60 L230 16" /></svg></div>
        <div className="card-footer"><span>TRANSAKSI</span><span>POLA PRODUK</span></div>
      </div>
    </div>
  </section>
}

const fields = [
  { symbol: '▤', title: 'InvoiceNo', text: <>Berfungsi sebagai ID transaksi atau <em>basket</em> (keranjang). Setiap sesi pembelian pelanggan memiliki ID unik, dan satu <strong>InvoiceNo dapat memuat banyak item.</strong></> },
  { symbol: '◆', title: 'Description', text: <>Berisi nama spesifik dari item produk yang dibeli. Kolom ini digunakan sebagai representasi item dalam pembentukan kombinasi produk.</> },
  { symbol: '▦', title: 'Quantity', text: <>Menunjukkan jumlah unit produk yang dibeli dalam satu transaksi (<em>InvoiceNo</em>) tertentu untuk produk (<em>Description</em>) tersebut.</> },
]

function DatasetSlide() {
  return <section className="dataset-slide" aria-labelledby="dataset-title">
    <div className="section-heading"><p>02 — SUMBER &amp; STRUKTUR DATA</p><h2 id="dataset-title">Dataset <span>Online Retail</span></h2></div>
    <p className="dataset-intro">Dataset yang digunakan berasal dari <strong>UCI Machine Learning Repository</strong>, yang merekam transaksi retail online.</p>
    <div className="field-grid">{fields.map((field) => <article className="field-card" key={field.title}><span className="field-symbol" aria-hidden="true">{field.symbol}</span><h3>{field.title}</h3><p>{field.text}</p></article>)}</div>
    <p className="source-note">Sumber: UCI Machine Learning Repository — Online Retail Dataset</p>
  </section>
}

const preprocessingSteps = [
  ['Load & Pilih Kolom', <>Baca <em>Online Retail.xlsx</em>; gunakan <strong>InvoiceNo</strong>, <strong>StockCode</strong>, <strong>Description</strong>, dan <strong>Quantity</strong>.</>],
  ['Filter Kelayakan', <>Buang transaksi batal, <em>Quantity</em> ≤ 0, serta <em>Description</em> kosong atau <em>NaN</em>.</>],
  ['Item Non-Produk', <><strong>Blacklist</strong> adalah daftar nama item yang dikecualikan, misalnya <em>POSTAGE</em>, <em>BANK CHARGES</em>, dan <em>DISCOUNT</em>, karena bukan produk fisik.</>],
  ['Deduplication & Pruning', <>Simpan item unik per <em>InvoiceNo</em>, kelompokkan menjadi basket, lalu buang basket tunggal.</>],
]

function PreprocessingSlide() {
  return <section className="preprocess-slide" aria-labelledby="preprocess-title">
    <div className="section-heading"><p>03 — PERSIAPAN DATA</p><h2 id="preprocess-title">Data <span>Preprocessing</span></h2></div>
    <div className="process-line">{preprocessingSteps.map(([title, text], index) => <article className="process-step" key={title}><span>{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
  </section>
}

function PreprocessingResultSlide() {
  const rows = [
    ['Data mentah', '—', '541.909', 'baris'],
    ['Filter kelayakan', '−11.216', '530.693', 'baris'],
    ['Item non-produk', '−2.178', '528.515', 'baris'],
    ['Deduplication', '−10.794', '517.721', 'baris'],
    ['Grouping InvoiceNo', '—', '19.961', 'basket'],
    ['Basket pruning', '−1.667', '18.294', 'basket'],
  ]
  return <section className="preprocessing-result-slide" aria-labelledby="preprocessing-result-title">
    <div className="section-heading"><p>04 — DAMPAK PREPROCESSING</p><h2 id="preprocessing-result-title">Perubahan Data dari Mentah ke <span>Basket Bersih</span></h2></div>
    <div className="preprocess-table" role="table" aria-label="Dampak tiap tahap preprocessing"><div className="preprocess-table-head" role="row"><span>TAHAP</span><span>DIHAPUS</span><span>DATA TERSISA</span><span>SATUAN</span></div>{rows.map(([stage, removed, remaining, unit], index) => <div className={`preprocess-table-row ${index === rows.length - 1 ? 'final-row' : ''}`} role="row" key={stage}><strong>{stage}</strong><b>{removed}</b><em>{remaining}</em><small>{unit}</small></div>)}</div>
    <aside className="cleaning-insight"><b>18.294 basket siap PCY</b><p>Hasil akhir diperoleh setelah 24.188 baris dieliminasi, kemudian 1.667 basket tunggal dibuang.</p></aside>
  </section>
}

const miningConcepts = [
  ['Basket', 'Kumpulan produk dalam satu transaksi (satu keranjang).'],
  ['Item', 'Satu produk tunggal yang berada di dalam basket.'],
  ['1-itemset', 'Himpunan yang berisi tepat satu produk.'],
  ['2-itemset', 'Pasangan dua produk berbeda yang muncul bersama secara berulang.'],
  ['Support', 'Jumlah atau proporsi basket yang mengandung suatu itemset tertentu.'],
]

function MiningConceptSlide() {
  return <section className="concept-slide" aria-labelledby="concept-title">
    <div className="section-heading"><p>05 — LANDASAN ALGORITMA</p><h2 id="concept-title">Konsep Dasar <span>Itemset Mining</span></h2></div>
    <div className="concept-layout"><ol className="concept-list">{miningConcepts.map(([term, description], index) => <li key={term}><span>0{index + 1}</span><p><strong>{term}:</strong> {description}</p></li>)}</ol>
      <aside className="formula-panel"><p>RUMUS SUPPORT PASANGAN</p><div className="formula"><span>support ( A , B )</span><b>=</b><div><i>jumlah basket yang memuat A dan B</i><i>total keseluruhan basket</i></div></div><small>Nilai support digunakan untuk menilai seberapa sering kombinasi produk terjadi.</small></aside>
    </div>
  </section>
}

const challenges = [
  <>Satu transaksi (<em>basket</em>) yang memuat banyak item dapat menghasilkan <strong>kombinasi pasangan produk yang sangat besar.</strong></>,
  <>Menghitung dan melacak <em>support</em> untuk seluruh kandidat pasangan secara eksplisit membutuhkan <strong>memori dan waktu komputasi yang sangat besar.</strong></>,
  <>Sebagian besar pasangan sebenarnya tidak pernah mencapai ambang batas <em>minimum support</em>.</>,
]
const solutions = [
  <>PCY memanfaatkan sisa memori utama pada iterasi pertama untuk membentuk struktur <strong>Hash Bucket</strong>.</>,
  <>PCY <strong>menyaring pasangan</strong> yang secara matematis tidak mungkin menjadi <em>frequent</em> sebelum kandidat dibentuk pada <em>scan</em> kedua.</>,
  <>Secara drastis mengurangi ukuran kandidat pasangan yang harus dievaluasi di memori.</>,
]
function ProblemSlide() {
  return <section className="problem-slide" aria-labelledby="problem-title">
    <div className="section-heading"><p>06 — MOTIVASI ALGORITMA</p><h2 id="problem-title">Masalah dalam <span>Frequent Pair Mining</span></h2></div>
    <div className="problem-grid"><article className="comparison-card challenge-card"><div className="comparison-icon" aria-hidden="true">!</div><h3>Permasalahan Komputasi</h3><ul>{challenges.map((item, index) => <li key={index}>{item}</li>)}</ul></article><article className="comparison-card solution-card"><div className="comparison-icon" aria-hidden="true">✦</div><h3>Solusi Algoritma PCY</h3><ul>{solutions.map((item, index) => <li key={index}>{item}</li>)}</ul></article></div>
  </section>
}

const pcySteps = ['Hitung support setiap item', 'Hash pasangan item ke bucket', 'Hitung frekuensi tiap bucket', 'Buat bitmap bucket frequent']
function WorkflowSlide() {
  return <section className="workflow-slide" aria-labelledby="workflow-title">
    <div className="section-heading"><p>07 — MEKANISME UTAMA</p><h2 id="workflow-title">Cara Kerja <span>Algoritma PCY</span></h2></div>
    <div className="input-pill">DATA TRANSAKSI</div>
    <div className="workflow-pass"><p>PASS 1 · PEMBENTUKAN BUCKET</p><div className="step-flow">{pcySteps.map((step, index) => <div className="flow-node" key={step}><span>{index + 1}</span>{step}</div>)}</div></div>
    <div className="workflow-pass second-pass"><p>PASS 2 · PENYARINGAN KANDIDAT</p><div className="pass-two"><div className="decision">Hitung pasangan jika:<br /><b>1.</b> Kedua item frequent<br /><b>2.</b> Bitmap bucket bernilai 1</div><div className="arrow-link" aria-hidden="true">→</div><div className="output-node">Daftar Frequent Pairs<br /><small>(Output Akhir)</small></div></div></div>
    <div className="bucket-note"><p><strong>Bucket bernilai 1:</strong> frekuensi di dalam bucket memenuhi <em>minimum support</em>.</p><p><strong>Bucket bernilai 0:</strong> pasangan yang hash-nya jatuh ke bucket ini <b>tidak dihitung kembali</b> pada Pass 2.</p></div>
  </section>
}

const metrics = [
  ['5.000', 'Basket untuk Benchmark', 'blue'], ['50', 'Minimum Support', 'blue'], ['50%', 'Minimum Confidence', 'mint'],
  ['937', 'Item Frequent Terdeteksi', 'blue'], ['419.445', 'Kandidat Itemset', 'blue'], ['2.030', 'Frequent Pairs Ditemukan', 'mint'],
  ['27,69 s', 'Rata-rata Runtime (10 Pengujian)', 'blue'], ['84,78 MB', 'Rata-rata Peak Memory (10 Pengujian)', 'mint'], ['2', 'Total Scan Data (Pass)', 'mint'],
]
function ResultsSlide() {
  return <section className="results-slide" aria-labelledby="results-title"><div className="section-heading"><p>08 — EKSEKUSI &amp; OUTPUT</p><h2 id="results-title">Hasil Implementasi <span>PCY</span></h2></div><div className="metric-grid">{metrics.map(([value, label, tone]) => <article className={`metric-card ${tone}`} key={label}><strong>{value}</strong><span>{label}</span></article>)}</div></section>
}

const trials = [27.88798, 27.954222, 26.606518, 28.602966, 28.25224, 27.962832, 27.20653, 28.209351, 26.812265, 27.421376]
function PerformanceDetailSlide() {
  return <section className="performance-slide" aria-labelledby="performance-title"><div className="section-heading"><p>09 — PENGUJIAN KINERJA</p><h2 id="performance-title">Rincian <span>10 Pengujian</span></h2></div><div className="performance-summary"><article><span>RATA-RATA RUNTIME</span><strong>27,69 s</strong></article><article><span>RATA-RATA PEAK MEMORY</span><strong>84,78 MB</strong></article></div><div className="trial-grid">{trials.map((runtime, index) => <article className="trial-row" key={index}><span>Percobaan {String(index + 1).padStart(2, '0')}</span><b>{runtime.toFixed(2).replace('.', ',')} s</b><i><em style={{ width: `${(runtime / 30) * 100}%` }} /></i><small>84,78 MB</small></article>)}</div><p className="performance-note">Semua pengujian menggunakan konfigurasi yang sama: 5.000 basket, minimum support 50, dan dua kali scan data.</p></section>
}

function EvaluationSlide() {
  return <section className="evaluation-slide" aria-labelledby="evaluation-title"><div className="section-heading"><p>10 — ANALISIS HASIL</p><h2 id="evaluation-title">Evaluasi Implementasi <span>PCY</span></h2></div><div className="evaluation-grid"><article className="evaluation-summary"><p className="eyebrow-label">RASIO FREQUENT PAIRS</p><strong>0,48%</strong><p>Dari <b>419.445</b> kandidat itemset, hanya <b>2.030 frequent pairs</b> yang memenuhi ambang minimum support.</p><div className="ratio-bar" aria-label="0,48 persen kandidat menjadi frequent pairs"><i /></div><small>Frequent pairs dibanding kandidat itemset</small></article><article className="evaluation-points"><h3>Temuan Utama</h3><ul><li><strong>937 item frequent</strong> menjadi dasar pembentukan pasangan kandidat.</li><li>PCY menyelesaikan benchmark <strong>5.000 basket</strong> dengan rata-rata peak memory <strong>84,78 MB</strong>.</li><li>Rata-rata runtime adalah <strong>27,69 detik</strong> dari <strong>10 kali pengujian</strong>, dengan dua kali scan dataset per pengujian.</li></ul></article></div><div className="business-insight"><span>INSIGHT BISNIS</span><p>Frequent pairs yang lolos dapat diprioritaskan untuk <strong>bundling produk</strong>, rekomendasi “sering dibeli bersama”, dan promosi silang yang lebih relevan.</p></div></section>
}

const associationRules = [
  ['HERB MARKER CHIVES → HERB MARKER THYME', '1,26%', '63 basket', '94,03%', '92,39%'],
  ['HERB MARKER ROSEMARY → HERB MARKER THYME', '1,52%', '76 basket', '93,83%', '92,19%'],
  ['BOHEMIAN COLLAGE STATIONERY SET → VINTAGE PAISLEY STATIONERY SET', '1,02%', '51 basket', '94,44%', '92,06%'],
  ['HERB MARKER THYME → HERB MARKER ROSEMARY', '1,52%', '76 basket', '92,68%', '91,06%'],
  ['HERB MARKER CHIVES → HERB MARKER MINT', '1,24%', '62 basket', '92,54%', '90,90%'],
]
function AssociationRulesSlide() {
  return <section className="association-slide" aria-labelledby="association-title"><div className="section-heading"><p>11 — ASSOCIATION RULE MINING</p><h2 id="association-title">Association Rule Mining <span>— Top 5 Rules</span></h2></div><div className="rules-table" role="table" aria-label="Top 5 Association Rules berdasarkan interest"><div className="rules-head" role="row"><span>PERINGKAT</span><span>ASSOCIATION RULE</span><span>SUPPORT</span><span>CONFIDENCE</span><span>INTEREST</span></div>{associationRules.map(([rule, support, count, confidence, interest], index) => <div className={`rules-row ${index === 0 ? 'top-rule' : 'supporting-rule'}`} role="row" key={rule}><span>0{index + 1}</span><strong>{rule}{index === 0 && <small className="rule-badge">RULE TERBAIK</small>}</strong><b>{support}<small>{count}</small></b><b>{confidence}</b><em>{interest}</em></div>)}</div><div className="association-bottom"><aside className="rule-explanation"><p><strong>Interpretasi:</strong> Rule <b>HERB MARKER CHIVES → HERB MARKER THYME</b> memiliki interest tertinggi, yaitu <b>92,39%</b>. Ini menunjukkan hubungan pembelian yang kuat antara kedua produk, bukan sekadar karena produk tujuan sering dibeli secara umum.</p></aside><div className="metric-explanation"><p><b>Confidence (A → B)</b> = support(A, B) ÷ support(A).</p><p><b>Support</b> menunjukkan seberapa sering dua produk muncul bersama pada seluruh basket.</p><p><b>Interest</b> menunjukkan seberapa kuat hubungan rule dibanding peluang produk tujuan muncul secara umum.</p></div></div><p className="association-conclusion">Produk dalam kelompok <strong>Herb Marker</strong> sering dibeli bersama dan dapat menjadi kandidat bundling atau rekomendasi silang.</p></section>
}

function ProductInsightSlide() {
  return <section className="product-insight-slide" aria-labelledby="insight-title"><div className="section-heading"><p>12 — INSIGHT PRODUK</p><h2 id="insight-title">Pola Pembelian <span>Herb Marker</span></h2></div><div className="insight-grid"><article className="insight-highlight"><span>INTEREST TERTINGGI</span><strong>92,39%</strong><p>HERB MARKER CHIVES<br />→ HERB MARKER THYME</p></article><article className="insight-copy"><h3>Temuan Produk</h3><ul><li><strong>Chives, Thyme, Rosemary, dan Mint</strong> muncul berulang pada rule dengan interest tertinggi.</li><li>Hubungan <strong>Thyme ↔ Rosemary</strong> bersifat dua arah dan menunjukkan peluang rekomendasi silang.</li><li><strong>Chives → Thyme</strong> memiliki confidence 94,03%, sehingga Thyme relevan sebagai rekomendasi setelah pembelian Chives.</li></ul></article></div><div className="insight-action"><span>ARAH BISNIS</span><p>Buat paket <strong>Herb Marker</strong>, tampilkan rekomendasi silang pada halaman produk, dan gunakan kombinasi ini untuk promosi tematik.</p></div></section>
}

const conclusions = [
  <>PCY berhasil menemukan pasangan produk yang <strong>sering dibeli bersama</strong> secara efisien.</>,
  <>PCY menggunakan struktur data <strong>hash bucket dan bitmap</strong> untuk menyaring kandidat sebelum pembentukan pada pass kedua.</>,
  <>Algoritma ini hanya melakukan <strong>dua kali iterasi scan</strong> terhadap keseluruhan dataset.</>,
  <>Output utama PCY adalah himpunan <strong>frequent pairs</strong> beserta nilai support-nya.</>,
  <>Hasil PCY menjadi fondasi penting untuk strategi <strong>bundling</strong> dan <strong>sistem rekomendasi</strong>.</>,
]
function ConclusionSlide() {
  return <section className="conclusion-slide" aria-labelledby="conclusion-title"><div className="section-heading"><p>13 — PENUTUP</p><h2 id="conclusion-title">Kesimpulan <span>Utama</span></h2></div><div className="conclusion-grid conclusion-only"><article className="conclusion-panel"><h3>Ringkasan Hasil</h3><ul>{conclusions.map((item, index) => <li key={index}>{item}</li>)}</ul></article></div></section>
}

function ThanksSlide() {
  return <section className="thanks-slide" aria-labelledby="thanks-title"><p>ANALISIS BIG DATA · FAISAL</p><h2 id="thanks-title">Terima <span>Kasih</span></h2><div className="thanks-line" aria-hidden="true"><i /><i /><i /></div><small>Penerapan Algoritma PCY untuk Frequent Itemset Mining</small></section>
}

function TitleSlide() {
  return <section className="title-slide" aria-labelledby="presentation-title">
    <p className="kicker">PRESENTASI PROYEK</p>
    <h1 id="presentation-title">Penerapan Algoritma <span>PCY</span><br />untuk Frequent Itemset Mining</h1>
    <p className="subtitle">Analisis produk yang sering dibeli bersama pada dataset Online Retail</p>
    <dl className="identity">{details.map(([label, value]) => <div className="identity-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  </section>
}

function App() {
  const [slide, setSlide] = useState(0)
  const isRevisionRoute = window.location.pathname.replace(/\/$/, '') === '/revisi-pcy'
  const next = () => setSlide((value) => Math.min(value + 1, 14))
  const previous = () => setSlide((value) => Math.max(value - 1, 0))
  useEffect(() => { const handleKey = (event) => { if (event.key === 'ArrowRight') next(); if (event.key === 'ArrowLeft') previous() }; window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey) })
  useEffect(() => { document.title = isRevisionRoute ? 'Revisi PCY | Penerapan Algoritma PCY' : 'Penerapan Algoritma PCY' }, [isRevisionRoute])
  return <main className={`presentation slide-${slide}`}>
    <div className="orb orb-one" aria-hidden="true" /><div className="orb orb-two" aria-hidden="true" /><div className="data-lines" aria-hidden="true" />
    <header className="slide-header"><span className="eyebrow">ANALISIS BIG DATA</span><span className="slide-count">{String(slide + 1).padStart(2, '0')} / 15</span></header>
    {slide === 0 ? <TitleSlide /> : slide === 1 ? <BackgroundSlide /> : slide === 2 ? <DatasetSlide /> : slide === 3 ? <PreprocessingSlide /> : slide === 4 ? <PreprocessingResultSlide /> : slide === 5 ? <MiningConceptSlide /> : slide === 6 ? <ProblemSlide /> : slide === 7 ? <WorkflowSlide /> : slide === 8 ? <ResultsSlide /> : slide === 9 ? <PerformanceDetailSlide /> : slide === 10 ? <EvaluationSlide /> : slide === 11 ? <AssociationRulesSlide /> : slide === 12 ? <ProductInsightSlide /> : slide === 13 ? <ConclusionSlide /> : <ThanksSlide />}
    <footer className="deck-controls"><span>Gunakan ← → untuk berpindah</span><div><button onClick={previous} disabled={slide === 0} aria-label="Slide sebelumnya">←</button><button onClick={next} disabled={slide === 14} aria-label="Slide berikutnya">→</button></div></footer>
  </main>
}

export default App
