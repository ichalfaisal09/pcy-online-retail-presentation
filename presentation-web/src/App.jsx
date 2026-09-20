import { useEffect, useState } from 'react'
import PreprocessingDataModal from './PreprocessingDataModal'
import { SensitivityParameterSlide, SensitivityResultSlide } from './SensitivitySlides'
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
  ['Load & Pilih Kolom', <>Baca <em>Online Retail.xlsx</em>; gunakan <strong>InvoiceNo</strong> sebagai ID transaksi dan <strong>Description</strong> sebagai representasi produk.</>],
  ['Filter Kelayakan', <>Buang transaksi batal, <em>Quantity</em> ≤ 0, serta <em>Description</em> kosong atau <em>NaN</em>.</>],
  ['Item Non-Produk', <><strong>Blacklist</strong> adalah daftar nama item yang dikecualikan, misalnya <em>POSTAGE</em>, <em>BANK CHARGES</em>, dan <em>DISCOUNT</em>, karena bukan produk fisik.</>],
  ['Deduplication & Pruning', <>Simpan item unik per <em>InvoiceNo</em>, kelompokkan menjadi basket, lalu buang basket tunggal.</>],
]

function PreprocessingSlide({ onOpenData }) {
  const stages = ['raw', 'eligible', 'products', 'baskets']
  return <section className="preprocess-slide" aria-labelledby="preprocess-title">
    <div className="section-heading"><p>03 — PERSIAPAN DATA</p><h2 id="preprocess-title">Data <span>Preprocessing</span></h2></div>
    <div className="process-line">{preprocessingSteps.map(([title, text], index) => <article className="process-step" key={title}><span>{index + 1}</span><h3>{title}</h3><p>{text}</p><button type="button" className="view-data-button" onClick={() => onOpenData(stages[index])}>Lihat data asli</button></article>)}</div>
  </section>
}

function PreprocessingResultSlide() {
  const cleaningRows = [
    ['Data mentah', 'Dibaca dari file Online Retail.xlsx', '—', '541.909'],
    ['Filter kelayakan', 'Cancel, Quantity ≤ 0, atau Description kosong', '−11.216', '530.693'],
    ['Item non-produk', 'Biaya dan entri administratif dalam blacklist', '−2.178', '528.515'],
    ['Deduplication', 'Produk sama dalam InvoiceNo yang sama', '−10.794', '517.721'],
  ]
  return <section className="preprocessing-result-slide" aria-labelledby="preprocessing-result-title">
    <div className="section-heading"><p>04 — DAMPAK PREPROCESSING</p><h2 id="preprocessing-result-title">Dari Baris Data ke <span>Basket Bersih</span></h2></div>
    <div className="preprocess-split">
      <article className="cleaning-panel"><p className="panel-label">01 · PEMBERSIHAN BARIS DATA</p><div className="cleaning-table"><div className="cleaning-head"><span>TAHAP</span><span>DIHAPUS</span><span>SISA BARIS</span></div>{cleaningRows.map(([stage, description, removed, remaining]) => <div className="cleaning-row" key={stage}><strong>{stage}<small>{description}</small></strong><b>{removed}</b><em>{remaining}</em></div>)}</div><p className="panel-total"><b>517.721</b> baris data bersih</p></article>
      <article className="basket-panel"><p className="panel-label">02 · PEMBENTUKAN BASKET</p><div className="basket-flow"><div><b>517.721</b><span>baris bersih</span></div><i>↓<small>grouping InvoiceNo</small></i><div><b>19.961</b><span>basket terbentuk</span></div><i className="prune-arrow">↓<small>−1.667 basket tunggal</small></i><div className="final-basket"><b>18.294</b><span>basket siap PCY</span></div></div></article>
    </div>
    <aside className="preprocessing-footnote"><strong>Metadata dataset bersih:</strong> 4.059 jenis produk menghasilkan hingga 8.235.711 pasangan kandidat [n(n−1)/2]. Karena itu PCY menggunakan bitmap untuk menyaring kandidat dan menjaga penggunaan RAM tetap efisien.</aside>
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

function EvaluationSlide() {
  return <section className="evaluation-slide" aria-labelledby="evaluation-title"><div className="section-heading"><p>10 — KONFIGURASI TERPILIH</p><h2 id="evaluation-title">Mengapa Memilih <span>Support 3%</span></h2></div><div className="evaluation-grid"><article className="evaluation-summary"><p className="eyebrow-label">AMBANG TERPILIH</p><strong>548</strong><p>Pasangan item harus muncul bersama minimal <b>548 kali</b> dari <b>18.294 basket</b> agar dinyatakan frequent.</p><div className="ratio-bar" aria-label="Support minimum 3 persen"><i /></div><small>3% × 18.294 basket, dibulatkan ke bawah</small></article><article className="evaluation-points"><h3>Hasil pada Support 3%</h3><ul><li><strong>149 frequent item</strong> lolos dari Pass 1.</li><li>PCY menyaring pencarian menjadi hanya <strong>815 kandidat pair</strong>.</li><li>Ditemukan <strong>15 frequent pair</strong>; runtime rata-rata <strong>116,78 detik</strong> dari <strong>5 kali pengujian</strong>.</li></ul></article></div><div className="business-insight"><span>ALASAN PEMILIHAN</span><p>Support 3% memberi kompromi yang seimbang: aturan masih tersedia untuk dianalisis, sementara kandidat pair dan kebutuhan memori jauh lebih rendah dibanding support 1%.</p></div></section>
}
const associationRules = [
  ['PINK REGENCY TEACUP AND SAUCER → GREEN REGENCY TEACUP AND SAUCER', '3,5%', '83,18%', '0,776'],
  ['PINK REGENCY TEACUP AND SAUCER → ROSES REGENCY TEACUP AND SAUCER', '3,3%', '78,71%', '0,729'],
  ['GREEN REGENCY TEACUP AND SAUCER → ROSES REGENCY TEACUP AND SAUCER', '4,2%', '75,67%', '0,699'],
  ['ROSES REGENCY TEACUP AND SAUCER → GREEN REGENCY TEACUP AND SAUCER', '4,2%', '72,25%', '0,667'],
  ["PAPER CHAIN KIT 50'S CHRISTMAS → PAPER CHAIN KIT VINTAGE CHRISTMAS", '3,0%', '67,65%', '0,613'],
]
function AssociationRulesSlide() {
  return <section className="association-slide" aria-labelledby="association-title"><div className="section-heading"><p>11 — ASSOCIATION RULE MINING · SUPPORT 3%</p><h2 id="association-title">Association Rule Mining <span>— Top 5 Rules</span></h2></div><div className="rules-table" role="table" aria-label="Top 5 Association Rules berdasarkan interest pada minimum support 3 persen"><div className="rules-head" role="row"><span>PERINGKAT</span><span>ASSOCIATION RULE</span><span>SUPPORT</span><span>CONFIDENCE</span><span>INTEREST</span></div>{associationRules.map(([rule, support, confidence, interest], index) => <div className={`rules-row ${index === 0 ? 'top-rule' : 'supporting-rule'}`} role="row" key={rule}><span>0{index + 1}</span><strong>{rule}{index === 0 && <small className="rule-badge">RULE TERBAIK</small>}</strong><b>{support}</b><b>{confidence}</b><em>{interest}</em></div>)}</div><div className="association-bottom"><aside className="rule-explanation"><p><strong>Interpretasi:</strong> Pada minimum support <b>3%</b>, rule <b>PINK REGENCY TEACUP AND SAUCER → GREEN REGENCY TEACUP AND SAUCER</b> memiliki interest tertinggi, yaitu <b>0,776</b>. Artinya, kedua produk memiliki keterkaitan pembelian yang kuat.</p></aside><div className="metric-explanation"><p><b>Confidence (A → B)</b> = support(A, B) ÷ support(A).</p><p><b>Support</b> menunjukkan proporsi basket yang memuat dua produk bersama.</p><p><b>Interest</b> menunjukkan kekuatan hubungan dibanding peluang produk tujuan muncul secara umum.</p></div></div><p className="association-conclusion">Dari <strong>15 frequent pair</strong> pada support 3%, seri produk <strong>Regency Teacup and Saucer</strong> muncul sebagai peluang bundling dan rekomendasi silang.</p></section>
}
function ProductInsightSlide() {
  return <section className="product-insight-slide" aria-labelledby="insight-title"><div className="section-heading"><p>12 — INSIGHT PRODUK</p><h2 id="insight-title">Pola Pembelian <span>Regency Teacup</span></h2></div><div className="insight-grid"><article className="insight-highlight"><span>INTEREST TERTINGGI</span><strong>0,776</strong><p>PINK REGENCY TEACUP<br />→ GREEN REGENCY TEACUP</p></article><article className="insight-copy"><h3>Temuan Produk</h3><ul><li><strong>Pink, Green, dan Roses Regency Teacup</strong> muncul berulang pada rule dengan interest tertinggi.</li><li>Hubungan <strong>Green ↔ Roses Regency Teacup</strong> bersifat dua arah dan menunjukkan peluang rekomendasi silang.</li><li><strong>Pink → Green Regency Teacup</strong> memiliki confidence 83,18%, sehingga Green relevan sebagai rekomendasi setelah pembelian Pink.</li></ul></article></div><div className="insight-action"><span>ARAH BISNIS</span><p>Buat paket <strong>Regency Teacup and Saucer</strong>, tampilkan rekomendasi silang pada halaman produk, dan gunakan kombinasi ini untuk promosi tematik.</p></div></section>
}

const conclusions = [
  <>Dengan minimum support <strong>3%</strong>, PCY menemukan <strong>15 frequent pair</strong> yang layak dianalisis.</>,
  <>PCY menggunakan struktur data <strong>hash bucket dan bitmap</strong> untuk menyaring kandidat sebelum pembentukan pada pass kedua.</>,
  <>Algoritma ini hanya melakukan <strong>dua kali iterasi scan</strong> terhadap keseluruhan dataset.</>,
  <>Konfigurasi 3% menghasilkan kompromi antara jumlah aturan yang tersedia dan efisiensi komputasi.</>,
  <>Hasil PCY menjadi fondasi penting untuk strategi <strong>bundling</strong> dan <strong>sistem rekomendasi</strong>.</>,
]
function ConclusionSlide() {
  return <section className="conclusion-slide" aria-labelledby="conclusion-title"><div className="section-heading"><p>13 — PENUTUP</p><h2 id="conclusion-title">Kesimpulan <span>Utama</span></h2></div><div className="conclusion-grid conclusion-only"><article className="conclusion-panel"><h3>Ringkasan Hasil</h3><ul>{conclusions.map((item, index) => <li key={index}>{item}</li>)}</ul></article></div></section>
}

function MethodologySlide() {
  return <section className="methodology-slide" aria-labelledby="methodology-title"><div className="section-heading"><p>14 — LAMPIRAN METODOLOGI</p><h2 id="methodology-title">Rancangan <span>Pengujian PCY</span></h2></div><div className="methodology-grid"><article><span>KONFIGURASI TETAP</span><strong>18.294 basket</strong><p>100.003 bitmap bucket · 2 pass PCY · dataset bersih yang sama untuk seluruh percobaan.</p></article><article><span>PENGUKURAN UTAMA</span><strong>Runtime &amp; RAM</strong><p>Dicatat bersama jumlah frequent item, kandidat pair, dan frequent pair pada setiap minimum support.</p></article><article><span>PENGULANGAN</span><strong>5× pada 1–3%</strong><p>Nilai runtime yang ditampilkan adalah rata-rata lima percobaan dengan konfigurasi yang sama.</p></article><article><span>BATAS EKSPERIMEN</span><strong>1× pada 5–10%</strong><p>Pengujian tidak diulang karena tidak ditemukan frequent pair; hasil dipakai untuk menunjukkan ambang terlalu ketat.</p></article></div><aside className="methodology-note"><b>Catatan interpretasi:</b> semua hasil dibandingkan pada dataset dan konfigurasi PCY yang sama. Perbedaan runtime kecil antarpercobaan dapat dipengaruhi kondisi perangkat saat eksekusi.</aside></section>
}
function SupportComparisonSlide() {
  const options = [
    ['1%', '182 transaksi', '1.107 pair · 375.747 kandidat', 'Paling banyak aturan, tetapi RAM 59,47 MB dan runtime 160,88 s.', 'Eksplorasi pola luas'],
    ['2%', '365 transaksi', '109 pair · 21.080 kandidat', 'Lebih ringkas, namun aturan masih cukup banyak untuk ditinjau.', 'Alternatif moderat'],
    ['3%', '548 transaksi', '15 pair · 815 kandidat', 'Kandidat sangat efisien dan masih menghasilkan aturan yang kuat.', 'Dipilih untuk analisis'],
  ]
  return <section className="support-comparison-slide" aria-labelledby="support-comparison-title"><div className="section-heading"><p>15 — LAMPIRAN TANYA JAWAB</p><h2 id="support-comparison-title">Jika Support <span>Diubah?</span></h2></div><p className="support-comparison-intro">Gunakan perbandingan ini saat menjelaskan alasan pemilihan minimum support kepada dosen.</p><div className="support-decision-grid">{options.map(([support, threshold, result, tradeoff, use]) => <article className={support === '3%' ? 'selected-support' : ''} key={support}><b>{support}</b><span>ambang {threshold}</span><strong>{result}</strong><p>{tradeoff}</p><em>{use}</em></article>)}</div><aside className="support-comparison-note"><b>Jawaban singkat:</b> 1% cocok untuk eksplorasi pola yang lebih luas, 2% menjadi alternatif moderat, sedangkan <strong>3% dipilih</strong> karena memberi aturan yang tetap bermakna dengan beban komputasi jauh lebih efisien.</aside></section>
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
  const [activeDataStage, setActiveDataStage] = useState(null)
  const isRevisionRoute = window.location.pathname.replace(/\/$/, '') === '/revisi-pcy'
  const next = () => setSlide((value) => Math.min(value + 1, 16))
  const previous = () => setSlide((value) => Math.max(value - 1, 0))
  useEffect(() => { const handleKey = (event) => { if (activeDataStage || ['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return; if (event.key === 'ArrowRight') next(); if (event.key === 'ArrowLeft') previous() }; window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey) }, [activeDataStage])
  useEffect(() => { document.title = isRevisionRoute ? 'Revisi PCY | Penerapan Algoritma PCY' : 'Penerapan Algoritma PCY' }, [isRevisionRoute])
  return <main className={`presentation slide-${slide}`}>
    <div className="orb orb-one" aria-hidden="true" /><div className="orb orb-two" aria-hidden="true" /><div className="data-lines" aria-hidden="true" />
    <header className="slide-header"><span className="eyebrow">ANALISIS BIG DATA</span><span className="slide-count">{String(slide + 1).padStart(2, '0')} / 17</span></header>
    {slide === 0 ? <TitleSlide /> : slide === 1 ? <BackgroundSlide /> : slide === 2 ? <DatasetSlide /> : slide === 3 ? <PreprocessingSlide onOpenData={setActiveDataStage} /> : slide === 4 ? <PreprocessingResultSlide /> : slide === 5 ? <MiningConceptSlide /> : slide === 6 ? <ProblemSlide /> : slide === 7 ? <WorkflowSlide /> : slide === 8 ? <SensitivityParameterSlide /> : slide === 9 ? <SensitivityResultSlide /> : slide === 10 ? <EvaluationSlide /> : slide === 11 ? <AssociationRulesSlide /> : slide === 12 ? <ProductInsightSlide /> : slide === 13 ? <ConclusionSlide /> : slide === 14 ? <MethodologySlide /> : slide === 15 ? <SupportComparisonSlide /> : <ThanksSlide />}
    {activeDataStage && <PreprocessingDataModal stage={activeDataStage} onClose={() => setActiveDataStage(null)} />}
    <footer className="deck-controls"><span>Gunakan ← → untuk berpindah</span><div><button onClick={previous} disabled={slide === 0} aria-label="Slide sebelumnya">←</button><button onClick={next} disabled={slide === 16} aria-label="Slide berikutnya">→</button></div></footer>
  </main>
}

export default App
