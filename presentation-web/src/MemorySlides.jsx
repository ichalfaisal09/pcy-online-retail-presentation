const memoryResults = [
  { support: '1%', candidates: '375.747', peak: 59.47, label: '59,47 MB' },
  { support: '2%', candidates: '21.080', peak: 6.34, label: '6,34 MB' },
  { support: '3%', candidates: '815', peak: 3.83, label: '3,83 MB' },
  { support: '5%', candidates: '5', peak: 3.68, label: '3,68 MB' },
  { support: '10%', candidates: '0', peak: 3.68, label: '3,68 MB' },
]

export function MemoryTitleSlide() {
  return <section className="calculation-title-slide memory-title-slide" aria-labelledby="memory-title"><p className="kicker">ANALISIS KOMPUTASI PCY</p><h1 id="memory-title">Perhitungan <span>Memori PCY</span></h1><p className="subtitle">Memisahkan ukuran struktur data secara teoretis, implementasi aktual Python, dan puncak alokasi memori selama algoritma dijalankan.</p><div className="calculation-flow"><span>STRUKTUR DATA</span><b>→</b><span>RUMUS UKURAN</span><b>→</b><span>PENGUKURAN</span><b>→</b><span>INTERPRETASI</span></div></section>
}

export function MemoryScopeSlide() {
  return <section className="memory-slide" aria-labelledby="memory-scope-title"><div className="section-heading"><p>01 — RUANG LINGKUP</p><h2 id="memory-scope-title">Apa yang <span>Diukur?</span></h2></div><div className="memory-layer-grid">
    <article><span>01</span><h3>Ukuran logis</h3><strong>Bitmap dalam bit</strong><p>Ukuran minimum apabila satu bucket benar-benar disimpan sebagai satu bit.</p></article>
    <article><span>02</span><h3>Implementasi Python</h3><strong>List, integer, dan dictionary</strong><p>Struktur aktual memiliki referensi dan overhead objek yang tidak terlihat pada rumus bitmap ideal.</p></article>
    <article><span>03</span><h3>Hasil eksperimen</h3><strong>Peak tracemalloc</strong><p>Puncak alokasi memori Python sejak Pass 1 hingga pembentukan association rule.</p></article>
  </div><aside className="memory-callout"><b>Prinsip utama:</b> ukuran bitmap bukan total memori program. Total pengukuran juga mencakup item count, bucket count, kandidat pair, frequent pair, string, tuple, set, dan dictionary.</aside></section>
}

export function BitmapFormulaSlide() {
  return <section className="memory-slide" aria-labelledby="bitmap-formula-title"><div className="section-heading"><p>02 — PERHITUNGAN TEORETIS</p><h2 id="bitmap-formula-title">Ukuran Ideal <span>Bitmap</span></h2></div><div className="memory-formula-layout">
    <article className="memory-formula-card"><span>JUMLAH BUCKET</span><strong>100.003</strong><p>Setiap bucket membutuhkan satu nilai status: frequent atau tidak frequent.</p></article>
    <div className="memory-equation"><span>100.003 bit</span><b>÷ 8</b><span>12.500,375 byte</span><b>÷ 1.024</b><strong>≈ 12,21 KiB</strong></div>
  </div><aside className="memory-callout mint"><b>Makna angka 12,21 KiB:</b> kebutuhan minimum jika status seluruh bucket dikemas sebagai bit sungguhan. Angka ini hanya mewakili bitmap, bukan bucket counter dan bukan seluruh proses PCY.</aside></section>
}

export function PythonMemorySlide() {
  return <section className="memory-slide" aria-labelledby="python-memory-title"><div className="section-heading"><p>03 — IMPLEMENTASI AKTUAL</p><h2 id="python-memory-title">Bitmap pada <span>Kode Python</span></h2></div><div className="python-memory-grid">
    <article><span>PASS 1</span><code>bucket_counts = [0] * 100003</code><p>List menyimpan penghitung frekuensi bucket. Nilainya bertambah setiap pasangan masuk ke bucket.</p></article>
    <article><span>TRANSISI</span><code>bitmap = [1 if ... else 0]</code><p>Status bucket disimpan sebagai elemen list 0/1, sehingga belum dikemas menjadi satu bit per bucket.</p></article>
  </div><div className="reference-estimate"><div><span>ESTIMASI REFERENSI LIST 64-BIT</span><strong>100.003 × 8 byte ≈ 781,27 KiB</strong></div><p>Per list, belum termasuk objek list, integer yang terbentuk pada bucket counter, kandidat pair, dan struktur lain. Nilai aktual bergantung pada versi Python dan arsitektur perangkat.</p></div><aside className="memory-callout warning"><b>Kesimpulan:</b> 12,21 KiB adalah ukuran bitmap ideal. Implementasi saat ini mengutamakan kesederhanaan kode, sehingga representasi list membutuhkan memori lebih besar daripada bitmap bit-packed.</aside></section>
}

export function CandidateMemorySlide() {
  return <section className="memory-slide" aria-labelledby="candidate-memory-title"><div className="section-heading"><p>04 — SUMBER MEMORI TERBESAR</p><h2 id="candidate-memory-title">Kandidat Pair dan <span>Overhead Python</span></h2></div><div className="candidate-memory-flow">
    <article><span>KEY</span><strong>Tuple dua produk</strong><p>Setiap kandidat menggunakan pasangan item sebagai key.</p></article><b>+</b>
    <article><span>VALUE</span><strong>Integer count</strong><p>Nilai menyimpan jumlah kemunculan kandidat.</p></article><b>+</b>
    <article><span>CONTAINER</span><strong>Dictionary</strong><p>Tabel hash memiliki kapasitas dan ruang kosong internal.</p></article><b>=</b>
    <article className="dominant-memory"><span>HASIL</span><strong>Memori kandidat dominan</strong><p>Terutama ketika support rendah menghasilkan ratusan ribu kandidat.</p></article>
  </div><aside className="memory-callout"><b>Mengapa tidak dihitung dengan satu angka tetap?</b> Ukuran dictionary dipengaruhi tuple, integer, kapasitas tabel hash, versi Python, dan objek yang digunakan bersama. Karena itu bagian ini dinilai melalui pengukuran aktual.</aside></section>
}

export function MemoryResultsSlide() {
  const maxPeak = Math.max(...memoryResults.map((item) => item.peak))
  return <section className="memory-slide" aria-labelledby="memory-results-title"><div className="section-heading"><p>05 — HASIL PENGUKURAN</p><h2 id="memory-results-title">Peak Memory berdasarkan <span>Minimum Support</span></h2></div><div className="memory-chart" role="table" aria-label="Peak memory pada setiap minimum support">
    {memoryResults.map((item) => <div className="memory-chart-row" role="row" key={item.support}><b>{item.support}</b><span>{item.candidates} kandidat</span><div><i style={{ width: `${Math.max(6, (item.peak / maxPeak) * 100)}%` }} /></div><strong>{item.label}</strong></div>)}
  </div><aside className="memory-callout mint"><b>Pola yang terlihat:</b> support 1% menghasilkan 375.747 kandidat dan peak 59,47 MB. Ketika kandidat turun menjadi 815 pada support 3%, peak turun menjadi 3,83 MB. Jumlah kandidat merupakan penyebab utama perubahan ini.</aside></section>
}

export function MemoryMeasurementSlide() {
  return <section className="memory-slide" aria-labelledby="measurement-title"><div className="section-heading"><p>06 — METODE PENGUKURAN</p><h2 id="measurement-title">Cara Membaca <span>tracemalloc</span></h2></div><div className="measurement-code"><code>tracemalloc.start()</code><b>→</b><code>Pass 1 + Pass 2 + rules</code><b>→</b><code>get_traced_memory()</code></div><div className="measurement-grid">
    <article><span>CURRENT</span><strong>Memori saat pengukuran</strong><p>Alokasi Python yang masih aktif ketika nilai dibaca.</p></article>
    <article><span>PEAK</span><strong>Puncak selama proses</strong><p>Nilai tertinggi alokasi Python sejak pelacakan dimulai.</p></article>
  </div><aside className="memory-callout warning"><b>Batas interpretasi:</b> angka eksperimen adalah peak allocation yang dilacak <code>tracemalloc</code>, bukan seluruh RAM sistem atau RSS proses. Istilah yang tepat adalah <strong>Peak Memory (tracemalloc)</strong>.</aside></section>
}

export function MemoryConclusionSlide() {
  return <section className="memory-slide" aria-labelledby="memory-conclusion-title"><div className="section-heading"><p>07 — KESIMPULAN</p><h2 id="memory-conclusion-title">Jawaban Inti <span>Perhitungan Memori</span></h2></div><div className="memory-conclusion-grid">
    <article><span>BITMAP IDEAL</span><strong>≈ 12,21 KiB</strong><p>100.003 bucket yang masing-masing direpresentasikan oleh satu bit.</p></article>
    <article><span>IMPLEMENTASI</span><strong>List Python</strong><p>Belum bit-packed dan memiliki overhead referensi serta objek.</p></article>
    <article><span>PEAK TERBESAR</span><strong>59,47 MB</strong><p>Terjadi pada support 1% dengan 375.747 kandidat pair.</p></article>
  </div><aside className="memory-final-statement">PCY menghemat pencarian kandidat melalui bitmap, tetapi penggunaan memori aktual tetap dipengaruhi cara struktur tersebut diimplementasikan dan banyaknya kandidat yang lolos ke Pass 2.</aside></section>
}

