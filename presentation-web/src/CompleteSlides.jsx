export function AnalysisObjectiveSlide() {
  return <section className="complete-slide objective-complete-slide" aria-labelledby="objective-complete-title"><div className="section-heading"><p>01 — TUJUAN ANALISIS</p><h2 id="objective-complete-title">Tujuan <span>Analisis</span></h2></div><p className="complete-lead">Analisis menggunakan transaksi Online Retail untuk menemukan produk yang sering muncul bersama dalam satu basket.</p><div className="objective-path"><article><span>INPUT</span><strong>Transaksi retail</strong><p>InvoiceNo membentuk basket. Description mewakili produk.</p></article><i>→</i><article><span>PROSES</span><strong>Algoritma PCY</strong><p>Hash bucket dan bitmap menyaring kandidat pasangan.</p></article><i>→</i><article><span>OUTPUT</span><strong>Frequent pair dan rule</strong><p>Hasil menunjukkan pola pembelian bersama pada dataset.</p></article></div><aside className="complete-statement">Hasil analisis dapat digunakan sebagai dasar evaluasi bundling dan rekomendasi produk. Association rule menunjukkan keterkaitan, bukan hubungan sebab-akibat.</aside></section>
}

export function BasketFormationSlide() {
  const rows = [
    ['536365', 'WHITE HANGING HEART T-LIGHT HOLDER', '6'],
    ['536365', 'WHITE METAL LANTERN', '6'],
    ['536365', 'CREAM CUPID HEARTS COAT HANGER', '8'],
    ['536365', 'KNITTED UNION FLAG HOT WATER BOTTLE', '6'],
  ]
  return <section className="complete-slide basket-formation-slide" aria-labelledby="basket-formation-title"><div className="section-heading"><p>05 — PEMBENTUKAN BASKET</p><h2 id="basket-formation-title">Baris Transaksi menjadi <span>Set Produk</span></h2></div><div className="basket-formation-layout"><div className="formation-table"><div><b>InvoiceNo</b><b>Description</b><b>Quantity</b></div>{rows.map((row, index) => <div key={index}>{row.map((value) => <span key={value}>{value}</span>)}</div>)}</div><div className="formation-transform"><span>GROUP BY InvoiceNo</span><b>↓</b><strong>Basket 536365</strong><p>{'{'}WHITE HANGING HEART T-LIGHT HOLDER, WHITE METAL LANTERN, CREAM CUPID HEARTS COAT HANGER, KNITTED UNION FLAG HOT WATER BOTTLE{'}'}</p></div></div><aside className="complete-note"><b>Aturan basket:</b> setiap Description dicatat satu kali dalam satu InvoiceNo. Quantity dipakai untuk memeriksa kelayakan baris, tetapi tidak menjadi bobot support.</aside></section>
}

export function CleanMetadataSlide() {
  return <section className="complete-slide metadata-complete-slide" aria-labelledby="metadata-complete-title"><div className="section-heading"><p>06 — METADATA DATA BERSIH</p><h2 id="metadata-complete-title">Skala Input <span>PCY</span></h2></div><div className="metadata-equation"><div><span>BASKET BERSIH</span><strong>18.294</strong></div><b>×</b><div><span>PRODUK UNIK</span><strong>4.059</strong></div></div><div className="possible-pair-formula notation-formula"><span>DEFINISI VARIABEL</span><p><b>n</b> = jumlah item atau produk unik di seluruh dataset</p><strong>Kombinasi pasangan maksimum = n(n−1) ÷ 2</strong><p className="notation-substitution">n = 4.059&nbsp;&nbsp;→&nbsp;&nbsp;4.059 × 4.058 ÷ 2 = <b>8.235.711</b></p><small>Rumus ini menunjukkan seluruh kombinasi teoritis dua produk. PCY tidak menyimpan counter untuk semuanya.</small></div><aside className="complete-statement">Hash bucket dan bitmap menyaring ruang kandidat sebelum penghitungan pasangan eksak pada Pass 2.</aside></section>
}

export function PCYConfigurationSlide() {
  return <section className="complete-slide config-complete-slide" aria-labelledby="config-complete-title"><div className="section-heading"><p>10 — KONFIGURASI ALGORITMA</p><h2 id="config-complete-title">Konfigurasi <span>PCY</span></h2></div><div className="config-lines"><div><span>INPUT</span><strong>18.294 basket</strong><p>Dataset bersih yang sama untuk seluruh skenario support.</p></div><div><span>HASH TABLE</span><strong>100.003 bucket</strong><p>Bilangan prima untuk mendistribusikan pasangan ke bucket.</p></div><div><span>FUNGSI HASH</span><strong>CRC32</strong><p>Hasil stabil pada setiap eksekusi, berbeda dari <code>hash()</code> bawaan Python.</p></div><div><span>SCAN DATA</span><strong>2 pass</strong><p>Pass 1 membentuk bitmap. Pass 2 menghitung kandidat yang lolos.</p></div></div><div className="stable-hash-formula">crc32(min(item₁,item₂) + &quot;\0&quot; + max(item₁,item₂)) mod 100.003</div></section>
}

export function FalsePositiveSlide() {
  return <section className="complete-slide false-positive-slide" aria-labelledby="false-positive-title"><div className="section-heading"><p>20 — COLLISION DAN FALSE POSITIVE</p><h2 id="false-positive-title">Mengapa Pass 2 <span>Tetap Diperlukan</span></h2></div><div className="collision-visual"><div><span>A–C</span><strong>count 1</strong></div><i>→</i><div className="collision-bucket"><span>BUCKET 3</span><strong>1 + 1 = 2</strong><em>bitmap = 1</em></div><i>←</i><div><span>A–D</span><strong>count 1</strong></div></div><div className="false-positive-result"><article><span>HASIL BITMAP</span><p>A–C dan A–D lolos sebagai kandidat karena count gabungan bucket mencapai batas minimum 2.</p></article><article><span>HASIL PASS 2</span><p>Count eksak masing-masing hanya 1. Keduanya gagal menjadi frequent pair.</p></article></div><aside className="complete-note"><b>Sifat penyaring:</b> collision dapat meloloskan kandidat yang akhirnya gagal. Namun pasangan yang benar-benar frequent tidak dibuang karena count bucket selalu sedikitnya sebesar count pasangan tersebut.</aside></section>
}

export function RuleDirectionSlide() {
  return <section className="complete-slide rule-direction-slide" aria-labelledby="rule-direction-title"><div className="section-heading"><p>22 — PEMBENTUKAN RULE</p><h2 id="rule-direction-title">Satu Pair, <span>Dua Arah Rule</span></h2></div><div className="rule-direction-visual"><div><span>FREQUENT PAIR</span><strong>{'{C, D}'}</strong><small>count(C,D) = 2</small></div><i>→</i><div><strong>C → D</strong><p>confidence = 2 ÷ count(C)<br /><b>2 ÷ 4 = 50%</b></p></div><div><strong>D → C</strong><p>confidence = 2 ÷ count(D)<br /><b>2 ÷ 3 = 66,67%</b></p></div></div><aside className="complete-statement">Support pasangan sama untuk kedua arah. Confidence berbeda karena penyebutnya mengikuti item pada sisi kiri rule.</aside></section>
}

export function MemoryChangeAnalysisSlide() {
  const stages = [
    ['Pass 1', 2.92, 2.91, 2.91],
    ['Bitmap', 3.71, 3.71, 3.69],
    ['Pass 2', 51.52, 6.25, 3.83],
    ['Frequent pair', 51.55, 6.25, 3.83],
    ['Rules', 51.84, 6.28, 3.84],
  ]
  const max = 51.84
  return <section className="complete-slide memory-change-slide" aria-labelledby="memory-change-title"><div className="section-heading"><p>27 — ANALISIS PERUBAHAN MEMORI</p><h2 id="memory-change-title">Lonjakan Terjadi pada <span>Pass 2</span></h2></div><div className="stage-memory-chart"><header><span>TAHAP</span><span>1%</span><span>2%</span><span>3%</span></header>{stages.map(([stage, one, two, three]) => <div className="stage-memory-row" key={stage}><b>{stage}</b>{[[one,'one'],[two,'two'],[three,'three']].map(([value, className]) => <span key={className}><i className={className} style={{width:`${Math.max(7,(value/max)*100)}%`}} /><em>{String(value).replace('.',',')} MB</em></span>)}</div>)}</div><aside className="complete-note"><b>Penyebab utama:</b> support 1% menyimpan 375.747 entry dalam <code>candidate_pair_counts</code>. Bitmap tetap memiliki 100.003 slot pada seluruh skenario.</aside></section>
}

export function BestRuleInterpretationSlide() {
  return <section className="complete-slide best-rule-slide" aria-labelledby="best-rule-title"><div className="section-heading"><p>32 — INTERPRETASI RULE TERBAIK</p><h2 id="best-rule-title">Pink Regency menuju <span>Green Regency</span></h2></div><div className="best-rule-line"><strong>PINK REGENCY TEACUP AND SAUCER</strong><i>→</i><strong>GREEN REGENCY TEACUP AND SAUCER</strong></div><div className="best-rule-metrics"><div><span>SUPPORT</span><b>3,5%</b><p>Kedua produk muncul bersama pada sekitar 3,5% dari seluruh basket.</p></div><div><span>CONFIDENCE</span><b>83,18%</b><p>Dari basket yang memuat Pink, 83,18% juga memuat Green.</p></div><div><span>INTEREST</span><b>0,776</b><p>Confidence sekitar 77,6 poin persentase di atas popularitas umum Green.</p></div></div><aside className="complete-statement">Rule menunjukkan asosiasi positif yang kuat pada dataset ini. Nilai tersebut tidak membuktikan bahwa pembelian Pink menyebabkan pembelian Green.</aside></section>
}

export function LimitationsSlide() {
  const limitations = [
    ['Preprocessing', 'Blacklist item non-produk ditentukan secara manual dan memengaruhi basket akhir.'],
    ['Minimum support', 'Perubahan support mengubah jumlah frequent item, kandidat, pair, dan rule.'],
    ['Hash collision', 'Collision dapat menghasilkan false positive kandidat sehingga Pass 2 tetap wajib.'],
    ['Implementasi Python', 'List, tuple, integer, dan dictionary memiliki overhead memori.'],
    ['Pengukuran', 'Runtime dipengaruhi kondisi perangkat. tracemalloc mengukur alokasi Python, bukan seluruh RSS proses.'],
  ]
  return <section className="complete-slide limitations-slide" aria-labelledby="limitations-title"><div className="section-heading"><p>33 — KETERBATASAN</p><h2 id="limitations-title">Batas Interpretasi <span>Hasil</span></h2></div><div className="limitations-list">{limitations.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2,'0')}</span><strong>{title}</strong><p>{text}</p></article>)}</div><aside className="complete-note">Hasil berlaku untuk dataset, proses pembersihan, fungsi hash, konfigurasi bucket, dan lingkungan pengujian yang digunakan.</aside></section>
}


