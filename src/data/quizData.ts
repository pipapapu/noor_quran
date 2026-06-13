// ============================================
// DATA SOAL TRIVIA TITIK CEK
// Tiap soal: { q, options: [a, b, c], answer: index }
// answer = index dari options yang BENER (0, 1, atau 2)
// ============================================

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
}

export const SOAL_POOL: QuizQuestion[] = [
  {
    q: "Berapa kali kita membaca Surah Al-Fatihah dalam shalat wajib sehari semalam?",
    options: ["17 kali", "10 kali", "5 kali"],
    answer: 0,
  },
  {
    q: "Surah pertama yang diturunkan kepada Nabi Muhammad SAW adalah?",
    options: ["Al-Fatihah", "Al-Alaq", "Al-Ikhlas"],
    answer: 1,
  },
  {
    q: "Berapa jumlah surah dalam Al-Quran?",
    options: ["114 surah", "100 surah", "120 surah"],
    answer: 0,
  },
  {
    q: "Surah Al-Fatihah artinya?",
    options: ["Pembukaan", "Penutup", "Petunjuk"],
    answer: 0,
  },
  {
    q: "Rukun Islam yang kelima adalah?",
    options: ["Shalat", "Naik Haji", "Puasa"],
    answer: 1,
  },
  {
    q: "Berapa kali shalat wajib dalam sehari semalam?",
    options: ["3 kali", "5 kali", "7 kali"],
    answer: 1,
  },
  {
    q: "Nabi terakhir dalam Islam adalah?",
    options: ["Nabi Isa", "Nabi Muhammad SAW", "Nabi Musa"],
    answer: 1,
  },
  {
    q: "Kitab suci umat Islam adalah?",
    options: ["Injil", "Al-Quran", "Taurat"],
    answer: 1,
  },
  {
    q: "Surah yang sering dibaca untuk perlindungan adalah?",
    options: ["Al-Falaq", "Al-Baqarah", "Yasin"],
    answer: 0,
  },
  {
    q: "Surah Al-Ikhlas membahas tentang?",
    options: ["Pagi hari", "Keesaan Allah", "Manusia"],
    answer: 1,
  },
  {
    q: "Huruf hijaiyah ada berapa?",
    options: ["26 huruf", "28 huruf", "29 huruf"],
    answer: 2,
  },
  {
    q: "Wajibnya membaca Al-Quran dengan tajwid adalah?",
    options: ["Sunnah", "Wajib", "Mubah"],
    answer: 1,
  },
  {
    q: "Puasa wajib di bulan?",
    options: ["Syawal", "Ramadhan", "Dzulhijjah"],
    answer: 1,
  },
  {
    q: "Zakat fitrah dibayar setiap?",
    options: ["Setahun sekali", "Bulanan", "Mingguan"],
    answer: 0,
  },
  {
    q: "Hari raya Idul Fitri jatuh setelah?",
    options: ["Puasa Ramadhan", "Wukuf di Arafah", "Maulid Nabi"],
    answer: 0,
  },
  {
    q: "Talbiyah dibaca ketika?",
    options: ["Shalat", "Ibadah Haji", "Puasa"],
    answer: 1,
  },
  {
    q: "Arah kiblat umat Islam adalah?",
    options: ["Madinah", "Mekah", "Yerusalem"],
    answer: 1,
  },
  {
    q: "Kota Mekah berada di negara?",
    options: ["Mesir", "Arab Saudi", "Yaman"],
    answer: 1,
  },
  {
    q: "Nabi yang terkenal dengan kesabarannya adalah?",
    options: ["Nabi Yunus", "Nabi Ayyub", "Nabi Sulaiman"],
    answer: 1,
  },
  {
    q: "Lafaz 'Bismillah' artinya?",
    options: ["Dengan nama Allah", "Segala puji bagi Allah", "Tidak ada tuhan selain Allah"],
    answer: 0,
  },
  {
    q: "Shalat Subuh berapa rakaat?",
    options: ["2 rakaat", "3 rakaat", "4 rakaat"],
    answer: 0,
  },
  {
    q: "Shalat Maghrib berapa rakaat?",
    options: ["2 rakaat", "3 rakaat", "4 rakaat"],
    answer: 1,
  },
  {
    q: "Shalat Isya berapa rakaat?",
    options: ["2 rakaat", "3 rakaat", "4 rakaat"],
    answer: 2,
  },
  {
    q: "Surah terpanjang dalam Al-Quran adalah?",
    options: ["Al-Baqarah", "Ali Imran", "An-Nisa"],
    answer: 0,
  },
  {
    q: "Surah Al-Kautsar adalah surah terpendek, berapa ayatnya?",
    options: ["3 ayat", "5 ayat", "7 ayat"],
    answer: 0,
  },
  {
    q: "Nabi Muhammad SAW lahir di kota?",
    options: ["Madinah", "Mekah", "Thaif"],
    answer: 1,
  },
  {
    q: "Hijrah Nabi ke Madinah terjadi pada tahun?",
    options: ["1 Hijriah", "5 Hijriah", "10 Hijriah"],
    answer: 0,
  },
  {
    q: "Puasa 6 hari di bulan Syawal hukumnya?",
    options: ["Wajib", "Sunnah", "Haram"],
    answer: 1,
  },
  {
    q: "Makanan yang haram adalah?",
    options: ["Daging sapi", "Babi", "Ayam"],
    answer: 1,
  },
  {
    q: "Surah An-Nas adalah surah ke?",
    options: ["112", "113", "114"],
    answer: 2,
  },
  {
    q: "Surah Al-Fatihah adalah surah ke?",
    options: ["1", "2", "3"],
    answer: 0,
  },
  {
    q: "Arti 'Alhamdulillah' adalah?",
    options: ["Segala puji bagi Allah", "Tidak ada tuhan selain Allah", "Allah Maha Besar"],
    answer: 0,
  },
  {
    q: "Arti 'Allahu Akbar' adalah?",
    options: ["Maha Pengasih", "Allah Maha Besar", "Maha Penyayang"],
    answer: 1,
  },
  {
    q: "Surah Al-Fil menceritakan tentang?",
    options: ["Kawanan gajah penyerang Ka'bah", "Kisah Nabi Yunus", "Kisah para sahabat"],
    answer: 0,
  },
  {
    q: "Burung Ababil adalah burung yang melindungi Ka'bah, disebut dalam surah?",
    options: ["Al-Fil", "Al-Quraisy", "Al-Ma'un"],
    answer: 0,
  },
  {
    q: "Ada berapa huruf Qalqalah dalam tajwid?",
    options: ["5 huruf", "3 huruf", "10 huruf"],
    answer: 0,
  },
  {
    q: "Kalimat 'La ilaha illallah' artinya?",
    options: ["Tidak ada tuhan selain Allah", "Allah Maha Esa", "Saya bersaksi"],
    answer: 0,
  },
  {
    q: "Malaikat penyampai wahyu adalah?",
    options: ["Mikail", "Jibril", "Israfil"],
    answer: 1,
  },
  {
    q: "Malaikat peniup sangkakala adalah?",
    options: ["Jibril", "Mikail", "Israfil"],
    answer: 2,
  },
  {
    q: "Shalat yang dilakukan pada malam hari di bulan Ramadhan adalah?",
    options: ["Tarawih", "Tahajud", "Dhuha"],
    answer: 0,
  },
];

// ============================================
// CONFIG GAME
// ============================================
export const TOTAL_LEVELS = 100;
export const SOAL_PER_LEVEL = 4;
export const TIMER_DURATION = 10; // detik per soal

// Helper: shuffle array
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Generate soal untuk 1 level (rotasi + shuffle biar unik)
export function getSoalForLevel(level: number): QuizQuestion[] {
  const startIdx = ((level - 1) * SOAL_PER_LEVEL) % SOAL_POOL.length;
  const result: QuizQuestion[] = [];
  for (let i = 0; i < SOAL_PER_LEVEL; i++) {
    result.push(SOAL_POOL[(startIdx + i) % SOAL_POOL.length]);
  }
  return shuffle(result);
}
