import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, BookOpen, Star, ChevronRight, Volume2 } from "lucide-react";

interface PelajaranMenuProps {
  onBack: () => void;
  onAddCoins: (amount: number) => void;
  onAddXp: (amount: number) => void;
}

// ─── Data Huruf Hijaiyah ────────────────────────────────────────────────────
const HIJAIYAH_LIST = [
  { arab: "ا", latin: "Alif", contoh: "أَسَد", arti: "Singa" },
  { arab: "ب", latin: "Ba", contoh: "بَيْت", arti: "Rumah" },
  { arab: "ت", latin: "Ta", contoh: "تُفَّاح", arti: "Apel" },
  { arab: "ث", latin: "Tsa", contoh: "ثَوْب", arti: "Baju" },
  { arab: "ج", latin: "Jim", contoh: "جَمَل", arti: "Unta" },
  { arab: "ح", latin: "Ha", contoh: "حِصَان", arti: "Kuda" },
  { arab: "خ", latin: "Kha", contoh: "خُبْز", arti: "Roti" },
  { arab: "د", latin: "Dal", contoh: "دَجَاجَة", arti: "Ayam" },
  { arab: "ذ", latin: "Dzal", contoh: "ذِئْب", arti: "Serigala" },
  { arab: "ر", latin: "Ra", contoh: "رَجُل", arti: "Laki-laki" },
  { arab: "ز", latin: "Zay", contoh: "زَيْتُون", arti: "Zaitun" },
  { arab: "س", latin: "Sin", contoh: "سَمَكَة", arti: "Ikan" },
  { arab: "ش", latin: "Syin", contoh: "شَجَرَة", arti: "Pohon" },
  { arab: "ص", latin: "Shad", contoh: "صَقْر", arti: "Elang" },
  { arab: "ض", latin: "Dhad", contoh: "ضِفْدَع", arti: "Katak" },
  { arab: "ط", latin: "Tha", contoh: "طَائِر", arti: "Burung" },
  { arab: "ظ", latin: "Zha", contoh: "ظَبْي", arti: "Rusa" },
  { arab: "ع", latin: "'Ain", contoh: "عِنَب", arti: "Anggur" },
  { arab: "غ", latin: "Ghain", contoh: "غُرَاب", arti: "Gagak" },
  { arab: "ف", latin: "Fa", contoh: "فِيل", arti: "Gajah" },
  { arab: "ق", latin: "Qaf", contoh: "قِرَدَة", arti: "Monyet" },
  { arab: "ك", latin: "Kaf", contoh: "كِتَاب", arti: "Buku" },
  { arab: "ل", latin: "Lam", contoh: "لَيْمُون", arti: "Lemon" },
  { arab: "م", latin: "Mim", contoh: "مَاء", arti: "Air" },
  { arab: "ن", latin: "Nun", contoh: "نَمِر", arti: "Harimau" },
  { arab: "و", latin: "Waw", contoh: "وَرْد", arti: "Bunga" },
  { arab: "ه", latin: "Ha", contoh: "هِلَال", arti: "Bulan Sabit" },
  { arab: "ء", latin: "Hamzah", contoh: "أَرْنَب", arti: "Kelinci" },
  { arab: "ي", latin: "Ya", contoh: "يَد", arti: "Tangan" },
];

// ─── Data Metode Iqro ────────────────────────────────────────────────────────
const IQRO_JILID = [
  {
    jilid: 1,
    judul: "Iqro Jilid 1",
    desc: "Mengenal huruf hijaiyah tunggal berharakat fathah",
    warna: "#4CAF50",
    warnaLight: "#E8F5E9",
    emoji: "🌱",
    materi: [
      { label: "Halaman 1–4", isi: "اَ بَ تَ ثَ جَ", keterangan: "Huruf berharakat fathah dasar" },
      { label: "Halaman 5–8", isi: "حَ خَ دَ ذَ رَ", keterangan: "Sambung kanan-kiri (belum bersambung)" },
      { label: "Halaman 9–12", isi: "زَ سَ شَ صَ ضَ", keterangan: "Baca lancar satu per satu" },
      { label: "Halaman 13–18", isi: "طَ ظَ عَ غَ فَ قَ", keterangan: "Latihan kelancaran huruf" },
    ],
  },
  {
    jilid: 2,
    judul: "Iqro Jilid 2",
    desc: "Harakat kasrah, dhammah & huruf sambung",
    warna: "#2196F3",
    warnaLight: "#E3F2FD",
    emoji: "📘",
    materi: [
      { label: "Kasrah (ِ◌)", isi: "اِ بِ تِ ثِ جِ", keterangan: "Bunyi 'i' di bawah huruf" },
      { label: "Dhammah (ُ◌)", isi: "اُ بُ تُ ثُ جُ", keterangan: "Bunyi 'u' di atas huruf" },
      { label: "Huruf Sambung", isi: "بَبَ تَتَ", keterangan: "Baca huruf yang bersambung" },
      { label: "Gabungan 3 Harakat", isi: "بَ بِ بُ", keterangan: "Baca cepat bergantian" },
    ],
  },
  {
    jilid: 3,
    judul: "Iqro Jilid 3",
    desc: "Mad (panjang), sukun & tanwin",
    warna: "#9C27B0",
    warnaLight: "#F3E5F5",
    emoji: "📗",
    materi: [
      { label: "Mad Fathah (ا)", isi: "بَا تَا جَا", keterangan: "Panjang 2 ketuk setelah fathah + alif" },
      { label: "Mad Kasrah (ي)", isi: "بِيْ تِيْ جِيْ", keterangan: "Panjang 2 ketuk setelah kasrah + ya" },
      { label: "Mad Dhammah (و)", isi: "بُوْ تُوْ جُوْ", keterangan: "Panjang 2 ketuk setelah dhammah + waw" },
      { label: "Sukun (ْ◌)", isi: "بَبْ تَبْ", keterangan: "Huruf mati, tidak berbunyi panjang" },
    ],
  },
  {
    jilid: 4,
    judul: "Iqro Jilid 4",
    desc: "Tanwin, qalqalah & huruf tebal-tipis",
    warna: "#FF9800",
    warnaLight: "#FFF3E0",
    emoji: "📙",
    materi: [
      { label: "Tanwin Fathah (ً)", isi: "بَنْ تَنْ جَنْ", keterangan: "Bunyi 'an' di akhir kata" },
      { label: "Tanwin Kasrah (ٍ)", isi: "بِنْ تِنْ جِنْ", keterangan: "Bunyi 'in' di akhir kata" },
      { label: "Tanwin Dhammah (ٌ)", isi: "بُنْ تُنْ جُنْ", keterangan: "Bunyi 'un' di akhir kata" },
      { label: "Qalqalah", isi: "قْ طْ بْ جْ دْ", keterangan: "Huruf memantul saat sukun/waqaf" },
    ],
  },
  {
    jilid: 5,
    judul: "Iqro Jilid 5",
    desc: "Musyaddad (tasydid), waqaf & ibtida",
    warna: "#F44336",
    warnaLight: "#FFEBEE",
    emoji: "📕",
    materi: [
      { label: "Tasydid (ّ◌)", isi: "بَبَّ تَتَّ", keterangan: "Huruf dobel, dibaca ditekan" },
      { label: "Waqaf", isi: "◌ْ → berhenti", keterangan: "Cara berhenti di akhir ayat" },
      { label: "Ibtida", isi: "mulai lagi ←", keterangan: "Cara memulai kembali bacaan" },
      { label: "Gabungan Hukum", isi: "مَدَّ غُنَّة", keterangan: "Latihan kombinasi hukum tajwid" },
    ],
  },
  {
    jilid: 6,
    judul: "Iqro Jilid 6",
    desc: "Bacaan Al-Quran langsung & khatam Iqro",
    warna: "#009688",
    warnaLight: "#E0F2F1",
    emoji: "🏆",
    materi: [
      { label: "Surat Pendek", isi: "قُلْ هُوَ اللَّهُ أَحَدٌ", keterangan: "Latihan baca surat Al-Ikhlas" },
      { label: "Al-Falaq", isi: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", keterangan: "Latihan baca surat Al-Falaq" },
      { label: "An-Nas", isi: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", keterangan: "Latihan baca surat An-Nas" },
      { label: "Khatam Iqro 🎉", isi: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", keterangan: "Siap membaca Al-Quran!" },
    ],
  },
];

// ─── Sub-view: Huruf Hijaiyah ─────────────────────────────────────────────────
function HurufHijaiyah({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full bg-[#E8F5E9]">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-4 pt-10 pb-5 text-white">
        <button onClick={onBack} className="flex items-center gap-1 text-white/80 mb-3 text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <h1 className="text-xl font-black">🔤 Huruf Hijaiyah</h1>
        <p className="text-white/80 text-xs mt-1">29 huruf dasar Al-Quran</p>
      </div>

      {/* Grid huruf */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {HIJAIYAH_LIST.map((h, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`rounded-2xl p-2 text-center transition-all shadow-sm border ${
                selected === i
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-white text-emerald-800 border-emerald-100"
              }`}
            >
              <div className="text-2xl font-bold" style={{ fontFamily: "serif" }}>{h.arab}</div>
              <div className="text-[9px] mt-0.5 font-semibold opacity-80">{h.latin}</div>
            </motion.button>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white rounded-2xl p-4 shadow-md border border-emerald-100 mb-4"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl" style={{ fontFamily: "serif" }}>
                  {HIJAIYAH_LIST[selected].arab}
                </div>
                <div>
                  <div className="font-black text-emerald-700 text-lg">{HIJAIYAH_LIST[selected].latin}</div>
                  <div className="text-slate-500 text-xs mt-1">Contoh kata:</div>
                  <div className="text-xl font-bold text-slate-700" style={{ fontFamily: "serif" }}>
                    {HIJAIYAH_LIST[selected].contoh}
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold">{HIJAIYAH_LIST[selected].arti}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center text-xs text-slate-400 pb-4">
          Tap huruf untuk melihat detail & contoh kata
        </div>
      </div>
    </div>
  );
}

// ─── Sub-view: Metode Iqro ────────────────────────────────────────────────────
function MetodeIqro({ onBack }: { onBack: () => void }) {
  const [selectedJilid, setSelectedJilid] = useState<number | null>(null);

  const jilid = selectedJilid !== null ? IQRO_JILID[selectedJilid] : null;

  return (
    <div className="flex flex-col h-full bg-[#E8F5E9]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-4 pt-10 pb-5 text-white">
        <button
          onClick={jilid ? () => setSelectedJilid(null) : onBack}
          className="flex items-center gap-1 text-white/80 mb-3 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {jilid ? "Pilih Jilid" : "Kembali"}
        </button>
        <h1 className="text-xl font-black">📖 Metode Iqro</h1>
        <p className="text-white/80 text-xs mt-1">
          {jilid ? jilid.judul : "6 Jilid tahapan belajar membaca Al-Quran"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {!jilid ? (
            // Daftar jilid
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <p className="text-xs text-slate-500 mb-3 text-center">
                Pilih jilid untuk melihat materi pembelajaran
              </p>
              {IQRO_JILID.map((j, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedJilid(i)}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 text-left"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: j.warnaLight }}
                  >
                    {j.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-slate-700">{j.judul}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{j.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </motion.button>
              ))}
            </motion.div>
          ) : (
            // Detail materi jilid
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div
                className="rounded-2xl p-4 text-white mb-2"
                style={{ backgroundColor: jilid.warna }}
              >
                <div className="text-3xl mb-1">{jilid.emoji}</div>
                <div className="font-black text-lg">{jilid.judul}</div>
                <div className="text-white/80 text-xs mt-1">{jilid.desc}</div>
              </div>

              {jilid.materi.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div
                        className="text-xs font-bold mb-1 px-2 py-0.5 rounded-full inline-block"
                        style={{ backgroundColor: jilid.warnaLight, color: jilid.warna }}
                      >
                        {m.label}
                      </div>
                      <div
                        className="text-2xl font-bold text-slate-700 my-2"
                        style={{ fontFamily: "serif", direction: "rtl" }}
                      >
                        {m.isi}
                      </div>
                      <div className="text-xs text-slate-400">{m.keterangan}</div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="text-center text-xs text-slate-400 py-2">
                Pelajari setiap bagian dengan sabar dan berulang 🌟
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main PelajaranMenu ───────────────────────────────────────────────────────
export default function PelajaranMenu({ onBack, onAddCoins, onAddXp }: PelajaranMenuProps) {
  const [subView, setSubView] = useState<"menu" | "hijaiyah" | "iqro">("menu");

  if (subView === "hijaiyah") {
    return <HurufHijaiyah onBack={() => setSubView("menu")} />;
  }

  if (subView === "iqro") {
    return <MetodeIqro onBack={() => setSubView("menu")} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#E8F5E9]">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-4 pt-10 pb-8 text-white">
        <button onClick={onBack} className="flex items-center gap-1 text-white/80 mb-3 text-sm">
          <ArrowLeft className="w-4 h-4" /> Beranda
        </button>
        <h1 className="text-2xl font-black">📚 Pengenalan</h1>
        <p className="text-white/80 text-sm mt-1">Pilih materi pembelajaran di bawah</p>
      </div>

      {/* Menu Cards */}
      <div className="flex-1 px-4 py-6 space-y-4">
        {/* Card 1: Huruf Hijaiyah */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setSubView("hijaiyah")}
          className="w-full bg-white rounded-3xl shadow-md border border-emerald-100 overflow-hidden text-left"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-5">
            <div className="text-4xl mb-2">🔤</div>
            <h2 className="text-white text-lg font-black">Huruf Hijaiyah</h2>
            <p className="text-white/80 text-xs mt-1">Pelajari 29 huruf dasar Al-Quran</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex gap-2">
                {["ا","ب","ت","ث","ج"].map((h, i) => (
                  <span key={i} className="text-xl font-bold text-emerald-700" style={{ fontFamily: "serif" }}>{h}</span>
                ))}
                <span className="text-slate-400 text-sm self-end">...</span>
              </div>
              <p className="text-xs text-slate-400">Tap untuk belajar tiap huruf beserta contoh</p>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-400 shrink-0" />
          </div>
        </motion.button>

        {/* Card 2: Metode Iqro */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setSubView("iqro")}
          className="w-full bg-white rounded-3xl shadow-md border border-blue-100 overflow-hidden text-left"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-400 p-5">
            <div className="text-4xl mb-2">📖</div>
            <h2 className="text-white text-lg font-black">Metode Iqro</h2>
            <p className="text-white/80 text-xs mt-1">Tahapan belajar membaca dari Jilid 1–6</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex gap-2 items-center">
                {["🌱","📘","📗","📙","📕","🏆"].map((e, i) => (
                  <span key={i} className="text-lg">{e}</span>
                ))}
              </div>
              <p className="text-xs text-slate-400">6 Jilid dari huruf dasar hingga Al-Quran</p>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-400 shrink-0" />
          </div>
        </motion.button>

        {/* Info box */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex gap-3 items-start">
          <span className="text-xl shrink-0">💡</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Tips:</strong> Mulai dari Huruf Hijaiyah dulu, baru lanjut ke Metode Iqro Jilid 1 secara bertahap ya!
          </p>
        </div>
      </div>
    </div>
  );
}
