export interface ActivePlayer {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  unlockedSurahs: string[]; // list of surah ID
  solvedQuizzes: string[];
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt?: string;
}

export interface Verse {
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface Surah {
  id: string;
  number: number;
  name: string;
  arabicName: string;
  translation: string;
  verses: Verse[];
  storyPrompt: string; // fallback if gemini offline
  audioUrl: string; // prebuilt audio recitations if available, or lovely synthetic waveforms
}

export interface TajwidRule {
  id: string;
  name: string;
  englishName: string;
  description: string;
  exampleArabic: string;
  exampleTranslit: string;
  audioPronounce: string; // name/phonetics
}

export const AVATARS = [
  { id: "zain", name: "Ibrahim", role: "Pelajar Sholih", img: "/ibrahim-avatar.png" },
  { id: "aisyah", name: "Aisyah", role: "Pelajar Sholihah", img: "/aisyah-avatar.png" },
  { id: "hasan", name: "Windy", role: "Hafiz Cilik", img: "/windy-avatar.png" },
  { id: "yasmin", name: "Bilqis", role: "Pakar Tajwid", img: "/bilqis-avatar.png" }
];

export const BAD_LIST: Badge[] = [
  { id: "fatihah_master", name: "Bintang Fatihah", description: "Menyelesaikan petualangan membaca Surah Al-Fatiha", icon: "🌟", color: "bg-amber-400 text-white" },
  { id: "tajwid_kid", name: "Pakar Tajwid Cilik", description: "Menjawab kuis tajwid pertama dengan sempurna", icon: "✨", color: "bg-teal-400 text-white" },
  { id: "hafiz_junior", name: "Pahlawan Hafiz", description: "Sukses menyusun urutan ayat Surah Al-Ikhlas", icon: "👑", color: "bg-violet-500 text-white" },
  { id: "daily_hero", name: "Pejuang Harian", description: "Berhasil menyelesaikan tantangan harian Surah Al-Asr", icon: "🔥", color: "bg-red-400 text-white" },
  { id: "zain_friend", name: "Sahabat Zain AI", description: "Bercerita dan bertanya pada Zain AI tentang Al-Quran", icon: "🤝", color: "bg-sky-400 text-white" }
];

export const SURAH_DATA: Surah[] = [
  {
    id: "fatihah",
    number: 1,
    name: "Al-Fatihah",
    arabicName: "الفاتحة",
    translation: "Pembukaan",
    audioUrl: "https://everyayah.com/data/Ghamadi_40kbps/001001.mp3",
    storyPrompt: "Surah Al-Fatiha adalah pembuka Al-Quran. Ia disebut khazanah berharga dari surga, mengajarkan kita untuk selalu memuji Allah sang pencipta alam semesta, dan memohon petunjuk di jalan yang lurus! 🌟🕌",
    verses: [
      { number: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", transliteration: "Bismillahir-rahmanir-rahim", translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang." },
      { number: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", transliteration: "Al-hamdu lillahi rabbil-'alamin", translation: "Segala puji bagi Allah, Tuhan seluruh alam." },
      { number: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", transliteration: "Ar-rahmanir-rahim", translation: "Yang Maha Pengasih, Maha Penyayang." },
      { number: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", transliteration: "Maliki yawmid-din", translation: "Pemilik hari pembalasan." },
      { number: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", transliteration: "Iyyaka na'budu wa iyyaka nasta'in", translation: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan." },
      { number: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", transliteration: "Ihdinas-siratal-mustaqim", translation: "Tunjukkanlah kami jalan yang lurus." },
      { number: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", transliteration: "Siratalladzina an'amta 'alayhim ghayril-maghdubi 'alayhim walad-dallin", translation: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat." }
    ]
  },
  {
    id: "ikhlas",
    number: 112,
    name: "Al-Ikhlas",
    arabicName: "الإخلاص",
    translation: "Memurnikan Keesaan Allah",
    audioUrl: "https://everyayah.com/data/Ghamadi_40kbps/112001.mp3",
    storyPrompt: "Surah Al-Ikhlas mengajarkan kita bahwa Allah itu Satu (Esa). Allah tidak memiliki ayah, ibu, anak, dan tidak ada satu makhluk pun yang bisa menyamai kehebatan Allah SWT! 💖",
    verses: [
      { number: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", transliteration: "Qul huwallahu ahad", translation: "Katakanlah (Muhammad), Dia-lah Allah, Yang Maha Esa." },
      { number: 2, arabic: "اللَّهُ الصَّمَدُ", transliteration: "Allahush-samad", translation: "Allah tempat meminta segala sesuatu." },
      { number: 3, arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", transliteration: "Lam yalid wa lam yulad", translation: "Dia tidak beranak dan tidak pula diperanakkan." },
      { number: 4, arabic: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", transliteration: "Wa lam yakul lahu kufuwan ahad", translation: "Dan tidak ada sesuatu yang setara dengan Dia." }
    ]
  },
  {
    id: "asr",
    number: 103,
    name: "Al-'Asr",
    arabicName: "العصر",
    translation: "Demi Waktu",
    audioUrl: "https://everyayah.com/data/Ghamadi_40kbps/103001.mp3",
    storyPrompt: "Surah Al-'Asr mengingatkan kita pentingnya disiplin waktu. Kita rugi jika tidak mengisi waktu dengan iman, beramal sholeh, menasihati kebaikan, dan melatih kesabaran! ⏰✈️",
    verses: [
      { number: 1, arabic: "وَالْعَصْرِ", transliteration: "Wal-'asr", translation: "Demi masa (waktu)." },
      { number: 2, arabic: "إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ", transliteration: "Innal-insana lafi khusr", translation: "Sungguh, manusia berada dalam kerugian." },
      { number: 3, arabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", transliteration: "Illalladzina amanu wa 'amilus-shalihati wa tawashaw bil-haqqi wa tawashaw bis-sabr", translation: "kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran." }
    ]
  },
  {
    id: "fil",
    number: 105,
    name: "Al-Fil",
    arabicName: "الفيل",
    translation: "Gajah",
    audioUrl: "https://everyayah.com/data/Ghamadi_40kbps/105001.mp3",
    storyPrompt: "Surah Al-Fil mengisahkan Raja Abrahah sombong dengan pasukan gajah raksasa yang ingin menghancurkan Ka'bah, kemudian Allah mengutus burung Ababil penembak batu panas membela Ka'bah! 🐘🕌",
    verses: [
      { number: 1, arabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ", transliteration: "Alam tara kayfa fa'ala rabbuka bi-ashhabil-fil", translation: "Tidakkah engkau (Muhammad) perhatikan bagaimana Tuhanmu telah bertindak terhadap pasukan bergajah?" },
      { number: 2, arabic: "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ", transliteration: "Alam yaj'al kaydahum fi tadlil", translation: "Bukankah Dia telah menjadikan tipu daya mereka itu sia-sia?" },
      { number: 3, arabic: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ", transliteration: "Wa arsala 'alayhim tayran ababil", translation: "dan Dia mengirimkan kepada mereka burung yang berbondong-bondong (burung Ababil)," },
      { number: 4, arabic: "تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ", transliteration: "Tarmihim bi-hijaratim-min sijjil", translation: "yang melempari mereka dengan batu-batu dari tanah liat yang dibakar," },
      { number: 5, arabic: "فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ", transliteration: "Fa-ja'alahum ka'asfim-ma'kul", translation: "sehingga mereka dijadikan-Nya seperti daun-daun yang dimakan (ulat)." }
    ]
  },
  {
    id: "falaq",
    number: 113,
    name: "Al-Falaq",
    arabicName: "الفلق",
    translation: "Waktu Subuh",
    audioUrl: "https://everyayah.com/data/Ghamadi_40kbps/113001.mp3",
    storyPrompt: "Surah Al-Falaq mengajarkan kita untuk berlindung kepada Allah dari segala kejahatan: kejahatan malam yang gelap, kejahatan sihir, dan kejahatan orang yang iri hati. Allah adalah pelindung terbaik kita! 🌅🛡️",
    verses: [
      { number: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", transliteration: "Qul a'udzu birabbil-falaq", translation: "Katakanlah, Aku berlindung kepada Tuhan yang menguasai subuh (fajar)." },
      { number: 2, arabic: "مِنْ شَرِّ مَا خَلَقَ", transliteration: "Min syarri ma khalaq", translation: "dari kejahatan (makhluk yang) Dia ciptakan," },
      { number: 3, arabic: "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ", transliteration: "Wa min syarri ghasiqin idza waqab", translation: "dan dari kejahatan malam apabila telah gelap gulita," },
      { number: 4, arabic: "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", transliteration: "Wa min syarrin-naffatsati fil-'uqad", translation: "dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya)," },
      { number: 5, arabic: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", transliteration: "Wa min syarri hasidin idza hasad", translation: "dan dari kejahatan orang yang dengki apabila dia dengki." }
    ]
  },
  {
    id: "nas",
    number: 114,
    name: "An-Nas",
    arabicName: "الناس",
    translation: "Manusia",
    audioUrl: "https://everyayah.com/data/Ghamadi_40kbps/114001.mp3",
    storyPrompt: "Surah An-Nas adalah surah terakhir Al-Quran! Ia mengajarkan kita berlindung kepada Allah, Raja dan Tuhan seluruh manusia, dari bisikan jahat setan yang suka menggoda hati kita agar berbuat dosa. 👥🌙",
    verses: [
      { number: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", transliteration: "Qul a'udzu birabbin-nas", translation: "Katakanlah, Aku berlindung kepada Tuhannya manusia." },
      { number: 2, arabic: "مَلِكِ النَّاسِ", transliteration: "Malikin-nas", translation: "Raja manusia." },
      { number: 3, arabic: "إِلَٰهِ النَّاسِ", transliteration: "Ilahin-nas", translation: "Sembahan manusia." },
      { number: 4, arabic: "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", transliteration: "Min syarril-waswasil-khannas", translation: "dari kejahatan (bisikan) setan yang bersembunyi." },
      { number: 5, arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", transliteration: "Alladzii yuwaswisu fii shuduurin-naas", translation: "yang membisikkan (kejahatan) ke dalam dada manusia," },
      { number: 6, arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ", transliteration: "Minal-jinnati wan-naas", translation: "dari (golongan) jin dan manusia." }
    ]
  },
  {
    id: "kawthar",
    number: 108,
    name: "Al-Kawthar",
    arabicName: "الكوثر",
    translation: "Nikmat yang Banyak",
    audioUrl: "https://everyayah.com/data/Ghamadi_40kbps/108001.mp3",
    storyPrompt: "Surah Al-Kawthar adalah surah terpendek di Al-Quran, hanya 3 ayat! Allah memberikan nikmat yang sangat banyak kepada Nabi Muhammad SAW, termasuk telaga Kawthar di surga. Kita diajak bersyukur dan sholat! 🌊✨",
    verses: [
      { number: 1, arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", transliteration: "Inna a'thaynakal-kawtsar", translation: "Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak." },
      { number: 2, arabic: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", transliteration: "Fasholli lirabbika wanhar", translation: "Maka laksanakanlah sholat karena Tuhanmu, dan berkurbanlah (sebagai ibadah dan mendekatkan diri kepada Allah)." },
      { number: 3, arabic: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", transliteration: "Inna syaani-aka huwal-abtar", translation: "Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah)." }
    ]
  },
  {
    id: "maun",
    number: 107,
    name: "Al-Ma'un",
    arabicName: "الماعون",
    translation: "Barang yang Berguna",
    audioUrl: "https://everyayah.com/data/Ghamadi_40kbps/107001.mp3",
    storyPrompt: "Surah Al-Ma'un mengajarkan kita untuk peduli pada anak yatim dan orang miskin. Orang yang mendustakan agama adalah mereka yang menghardik anak yatim dan tidak mau membantu sesama. Yuk berbagi! 🤲❤️",
    verses: [
      { number: 1, arabic: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ", transliteration: "Ara-aytal-ladzii yukadzdzibu bid-diin", translation: "Tahukah kamu (orang) yang mendustakan agama?" },
      { number: 2, arabic: "فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ", transliteration: "Fadzaalikal-ladzii yadu'ul-yatiim", translation: "Maka itulah orang yang menghardik anak yatim," },
      { number: 3, arabic: "وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ", transliteration: "Wa laa yahudhdhu 'alaa tha'aamil-miskiin", translation: "dan tidak mendorong memberi makan orang miskin." },
      { number: 4, arabic: "فَوَيْلٌ لِلْمُصَلِّينَ", transliteration: "Fa waylul-lil-musholliin", translation: "Maka celakalah orang yang sholat," },
      { number: 5, arabic: "الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ", transliteration: "Alladziina hum 'an sholaatihim saahuum", translation: "(yaitu) orang-orang yang lalai terhadap sholatnya," },
      { number: 6, arabic: "الَّذِينَ هُمْ يُرَاءُونَ", transliteration: "Alladziina hum yuraa-uun", translation: "yang berbuat ria (pamer)," },
      { number: 7, arabic: "وَيَمْنَعُونَ الْمَاعُونَ", transliteration: "Wa yamna'uunal-maa'uun", translation: "dan enggan (memberikan) bantuan." }
    ]
  },
  {
    id: "quraisy",
    number: 106,
    name: "Quraisy",
    arabicName: "قريش",
    translation: "Suku Quraisy",
    audioUrl: "https://everyayah.com/data/Ghamadi_40kbps/106001.mp3",
    storyPrompt: "Surah Quraisy mengisahkan nikmat besar Allah kepada suku Quraisy: perjalanan dagang musim dingin ke Yaman dan musim panas ke Syam yang aman dan makmur. Allah meminta mereka bersyukur dengan beribadah! 🐪🌍",
    verses: [
      { number: 1, arabic: "لِإِيلَافِ قُرَيْشٍ", transliteration: "Li-iilaafi quraisy", translation: "Karena kebiasaan orang-orang Quraisy," },
      { number: 2, arabic: "إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ", transliteration: "Iilaafihim rihlatas-syitaa-i wash-shayf", translation: "(yaitu) kebiasaan mereka bepergian pada musim dingin dan musim panas." },
      { number: 3, arabic: "فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ", transliteration: "Fal ya'buduu rabba haadzal-bayt", translation: "Maka hendaklah mereka menyembah Tuhan (pemilik) rumah ini (Ka'bah)." },
      { number: 4, arabic: "الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ", transliteration: "Alladzii ath'amahum min juu'in wa aamanahum min khawf", translation: "Yang telah memberi makanan kepada mereka untuk menghilangkan lapar dan mengamankan mereka dari rasa ketakutan." }
    ]
  }
];

export const TAJWID_RULES: TajwidRule[] = [
  {
    id: "qalqalah",
    name: "Qalqalah (Pantulan)",
    englishName: "Bouncing Sound",
    description: "Bunyi huruf yang memantul indah seperti bola karet yang jatuh ketika mati atau sukun. Hurufnya ada 5: ب (Ba), ج (Jim), د (Dal), ط (Tha), ق (Qaf) disingkat 'Baju Di Toko'!",
    exampleArabic: "قُلْ هُوَ اللَّهُ أَحَدٌ   ←  أَحَدْ",
    exampleTranslit: "Ahad (pada kata 'Ahadun' dibaca memantul)",
    audioPronounce: "A-ha-dd(h)"
  },
  {
    id: "ikhfa",
    name: "Ikhfa (Samar-samar)",
    englishName: "Hidden Nasalization",
    description: "Apabila Nun sukun (نْ) atau Tanwin bertemu salah satu huruf Ikhfa, dibaca samar-samar mendengung di hidung selama 2-3 ketukan kenthongan santai!",
    exampleArabic: "مِنْ قَبْلِ ← مِــنْقَبْلِ",
    exampleTranslit: "Min qabli (suara 'N' melebur samar ke 'Q')",
    audioPronounce: "Mi-ng-qobli"
  },
  {
    id: "izhar",
    name: "Izhar (Jelas & Terang)",
    englishName: "Clear Pronunciation",
    description: "Dibaca jelas dan tegas tanpa mendengung di hidung sama sekali. Terjadi apabila Nun sukun (نْ) bertemu huruf tenggorokan: ء (Alif), هـ (Ha), ع ('Ain), ح (Ha ceria), غ (Ghair), خ (Kha).",
    exampleArabic: "مَنْ آمَنَ ← مَنْ آمَنَ",
    exampleTranslit: "Man aamana (tetap dibaca MAN yang jelas)",
    audioPronounce: "Man Aamana"
  }
];
