import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { config } from 'dotenv';

config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      throw new Error("GEMINI_API_KEY is not configured or placeholder detected.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// AI endpoint 1: Zain AI Study Buddy (Chatbot for children)
app.post("/api/gemini/buddy", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    const ai = getGeminiClient();

    // Prepare a cozy system instruction suited for a child-friendly companion
    const systemInstruction = 
      "Kamu adalah Zain, seorang anak laki-laki berusia 8 tahun yang sangat cerdas, ceria, ramah, dan sholeh. " +
      "Tugasmu adalah menjadi teman belajar mengaji, membaca Al-Quran, dan Tajwid bagi anak-anak Indonesia. " +
      "Jawab semua pertanyaan dengan bahasa anak-anak yang seru, hangat, menyemangati, dan mudah dimengerti. " +
      "Gunakan emoji anak-anak yang lucu (seperti 🌟, 🕌, ✨, 📖, 🥳, 👏, 😊). " +
      "Jangan terlalu panjang lebar saat menjawab agar anak-anak tidak bosan. " +
      "Jika ditanya tentang kisah nabi, surah, atau tajwid, terangkan secara ringkas, menyenangkan, dan berikan pesan moral yang bagus. " +
      "Selalu gunakan kata 'Teman-teman' atau panggil dia 'Sobat Cilik'.";

    // Format previous history into system/user contents for generateContent
    const contents: any[] = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((c: any) => {
        contents.push({
          role: c.role === "user" ? "user" : "model",
          parts: [{ text: c.text }],
        });
      });
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Zain Buddy Error:", error.message);
    // Fallback response for kids when API key is missing or errored
    const fallbackAnswers = [
      "Wah, sobat cilik cerdas sekali! Aku sangat senang mendengarnya. Ayo kita terus membaca Al-Quran ya! ✨",
      "Maa Shaa Allah! Bagus sekali pertanyaannya. Rasulullah dulu mengajarkan kita untuk selalu melafalkan huruf dengan baik dan benar. Terus semangat belajar tajwidnya ya! 📖🌟",
      "Subhanallah! Kamu hebat sekali sudah mau bertanya tentang Al-Quran. Semoga Sobat Cilik jadi anak sholeh/sholehah yang dicintai Allah! 🕌😊",
      "Ayo kita bermain tebak surah! Sambil menunggu Zain mengasah pensil, coba sebutkan surah terpendek dalam Al-Quran? Betul, Surah Al-Kautsar! 🥳👏"
    ];
    const randomIndex = Math.floor(Math.random() * fallbackAnswers.length);
    res.json({
      success: false,
      text: fallbackAnswers[randomIndex],
      isFallback: true,
      errorMsg: error.message
    });
  }
});

// AI endpoint 2: Kids Explain Surah (Kisah Surah untuk Anak)
app.post("/api/gemini/explain-surah", async (req, res) => {
  try {
    const { surahName } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = 
      "Kamu adalah Kak Zain, pendongeng kisah-kisah Al-Quran untuk anak-anak TK dan SD. " +
      "Tugasmu adalah menjelaskan kisah menarik di balik sebuah surah (contoh: Surah Al-Fil menceritakan pasukan gajah Raja Abrahah, Al-Asr tentang pentingnya waktu) dalam bentuk cerita dongeng anak-anak yang interaktif, penuh warna, dan seru. " +
      "Akhiri dengan 1 baris hikmah/moral yang bisa anak-anak praktikkan sehari-hari. Maksimal 3 paragraf pendek.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Gambarkan cerita di balik ${surahName} untuk anak kecil agar seru dan berkesan.`,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ success: true, explanation: response.text });
  } catch (error: any) {
    console.error("Explain Surah Error:", error.message);
    // Fallback explanations for children
    let fallback = "";
    if (req.body.surahName?.toLowerCase().includes("fil")) {
      fallback = "Dahulu kala, ada Raja sombong bernama Abrahah yang ingin merusak Ka'bah dengan menunggangi gajah-gajah yang sangat besar! Namun, Allah mengutus burung-burung kecil bernama Ababil. Burung-burung itu membawa batu-batu kerikil kecil yang sangat panas dari surga dan menjatuhkannya ke arah gajah-gajah jahat itu. Pasukan gajah pun lari ketakutan! Kisah seru ini diceritakan di Surah Al-Fil. Hikmahnya, kita tidak boleh sombong ya, karena Allah selalu melindungi orang-orang yang beriman! 🐘🐦🌟";
    } else if (req.body.surahName?.toLowerCase().includes("asr")) {
      fallback = "Surah Al-Asr menceritakan tentang betapa berharganya waktu! Waktu itu seperti es batu, kalau kita diamkan terus tanpa dimanfaatkan untuk hal baik, ia akan mencair begitu saja sampai habis. Orang-orang akan rugi jika tidak mengisi waktunya dengan beramal sholeh, saling menasihati dalam kebaikan, dan sabar. Hikmahnya, yuk kurangi waktu bermain game yang tidak bermanfaat, dan isi dengan belajar atau membantu Ayah & Ibu! ⏰✨";
    } else {
      fallback = `Maa Shaa Allah! Surah ${req.body.surahName || "Surah Al-Quran"} memiliki makna dan hikmah yang sangat indah untuk membimbing kita menjadi anak yang ber akhlak mulia. Allah menurunkan surah ini agar kita selalu ingat untuk berbuat baik, gemar membantu sesama, dan taat beribadah. Hikmahnya, mari kita rajin melafalkannya setiap hari ya! 📖🕌❤️`;
    }
    res.json({ success: false, explanation: fallback, isFallback: true });
  }
});

// AI endpoint 3: Kids Dynamic Quiz Generator (Kuis Pintar Cilik)
app.post("/api/gemini/quiz", async (req, res) => {
  try {
    const { category } = req.body; // e.g., 'surah', 'tajwid', 'hafalan'
    const ai = getGeminiClient();

    const prompt = 
      `Buat 3 pertanyaan pilihan ganda yang sangat sederhana dan seru untuk anak TK/SD tentang ${category || "pengetahuan dasar islam atau tajwid"}. ` +
      `Bahasa harus sederhana, ceria, dan sangat mudah. ` +
      `Sediakan 3 pilihan jawaban untuk setiap pertanyaan.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "Daftar pertanyaan kuis cilik",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "Pertanyaan yang menyenangkan untuk anak-anak" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "Tepat 3 pilihan jawaban (A, B, C)" 
              },
              answerIndex: { type: Type.INTEGER, description: "Indeks jawaban yang benar (0, 1, atau 2)" },
              explanation: { type: Type.STRING, description: "Penjelasan mengapa jawaban itu benar dengan nada ceria khas anak-anak" }
            },
            required: ["question", "options", "answerIndex", "explanation"]
          }
        }
      }
    });

    const quizData = JSON.parse(response.text.trim());
    res.json({ success: true, quiz: quizData });
  } catch (error: any) {
    console.error("Quiz Generator Error:", error.message);
    // Offline pre-programmed quiz dataset for kids fallback! Allows flawless offline functionality.
    const offlineQuizzes: Record<string, any[]> = {
      tajwid: [
        {
          question: "Wah, suara memantul seperti bola karet kalau kita melafalkan Qalqalah! Manakah huruf berikut yang memantul?",
          options: ["Alif (أ)", "Ba (ب) dengan sukun", "Sin (س)"],
          answerIndex: 1,
          explanation: "Betul sekali! Huruf Ba (ب) adalah salah satu dari 5 huruf Qalqalah (Baju Di Toko: Ba, Jim, Dal, Tha, Qaf) yang jika sukun suaranya akan memantul membal! 🥳⚽"
        },
        {
          question: "Tanda harakat garis satu di atas huruf Hijaiyah bunyinya 'A', apa nama tanda itu?",
          options: ["Fathah ( َ)", "Kasrah ( ِ)", "Dhammah ( ُ)"],
          answerIndex: 0,
          explanation: "Yeeey! Namanya Fathah. Fathah membuat mulut kita terbuka lebar mengucapkan bunyi 'A' seperti 'Baa', 'Taa', 'Saa'! 🌟"
        },
        {
          question: "Idgham bighunnah artinya bunyinya harus masuk dan mendengung! Huruf manakah di bawah ini yang termasuk Idgham Bighunnah?",
          options: ["Nun (ن)", "Ra (ر)", "Lam (ل)"],
          answerIndex: 0,
          explanation: "Maa Shaa Allah hebat! Huruf Hijaiyah pembawa dengung Idgham Bighunnah disingkat Ya, Nun, Mim, Wawu (Ya-Na-Ma-Wa). Jadi Nun adalah jawabannya! ✨"
        }
      ],
      surah: [
        {
          question: "Surah Al-Fatiha disebut juga sebagai pembuka Al-Quran. Ada berapa ayat di dalam Al-Fatiha?",
          options: ["5 Ayat", "7 Ayat", "10 Ayat"],
          answerIndex: 1,
          explanation: "Maa Shaa Allah! Surah Al-Fatiha memiliki 7 ayat yang indah dan wajib dibaca di setiap shalat kita! 🕌✨"
        },
        {
          question: "Surah apakah yang menceritakan tentang hewan gajah yang sangat besar?",
          options: ["Surah An-Nas", "Surah Al-Ikhlas", "Surah Al-Fil"],
          answerIndex: 2,
          explanation: "Hebaaat! Al-Fil artinya Gajah. Surah ini bercerita tentang kebesaran Allah melindungi Ka'bah dari kawanan gajah! 🐘🕌"
        },
        {
          question: "Surah Al-Ikhlas mengajarkan kita bahwa Allah itu Esa. Apa arti dari 'Esa'?",
          options: ["Ada tiga", "Satu-satunya (Maha Tunggal)", "Banyak sekali"],
          answerIndex: 1,
          explanation: "Tepat sekali Sobat Cilik! Esa artinya Satu-satunya. Tidak ada tuhan selain Allah yang menciptakan alam semesta ini! ❤️🌟"
        }
      ],
      default: [
        {
          question: "Berapakah jumlah rukun Islam yang wajib dijalankan oleh kita semua?",
          options: ["5 Rukun", "6 Rukun", "4 Rukun"],
          answerIndex: 0,
          explanation: "Betul! Ada Syahadat, Shalat, Puasa, Zakat, dan Naik Haji bagi yang mampu! 🕌👏"
        },
        {
          question: "Siapakah nama nabi penutup yang sangat sayang kepada anak-anak?",
          options: ["Nabi Ibrahim AS", "Nabi Muhammad SAW", "Nabi Musa AS"],
          answerIndex: 1,
          explanation: "Subhanallah! Nabi Muhammad SAW adalah nabi terakhir kita yang teladannya luar biasa mulia dan sangat cinta pada anak-anak! ❤️✨"
        },
        {
          question: "Sebelum melakukan ibadah shalat dan memegang Al-Quran, kita harus membersihkan diri dengan?",
          options: ["Berwudhu", "Mandi susu", "Mencuci pakaian"],
          answerIndex: 0,
          explanation: "Tepat! Kita berwudhu dengan air yang bersih dan suci agar badan kita suci menghadap Allah SWT! 💦🕌"
        }
      ]
    };

    const selectedCategory = (req.body.category || "default").toLowerCase();
    const quizList = offlineQuizzes[selectedCategory] || offlineQuizzes.default;
    res.json({ success: false, quiz: quizList, isFallback: true });
  }
});

// AI endpoint 4: Simulated Speech Reader Checklist (Penilaian Bacaan Quran Cilik)
app.post("/api/gemini/read-verify", async (req, res) => {
  try {
    const { verseText, translation, textAttempt } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = 
      "Kamu adalah Guru Mengaji penyayang anak-anak yang ramah dan suportif. " +
      "Tugasmu adalah membandingkan target ayat dengan upaya tulisan atau transkripsi suara anak, lalu memberikan saran yang hangat, penyemangati layaknya pelatih cilik. " +
      "Berikan skor kelancaran (dalam persen 70% s/d 100%), sebutkan apa yang sudah bagus, dan tunjukkan 1 bimbingan tajwid kecil yang ramah. " +
      "Jika textAttempt kosong atau hanya berupa simulasi, buat bimbingan umum untuk melancarkan makhraj ayat tersebut.";

    const prompt = `Ayat target: "${verseText}" (Artinya: "${translation}"). Upaya pembacaan: "${textAttempt || 'Anak baru saja membaca dengan lantang'}".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({ success: true, evaluation: response.text });
  } catch (error: any) {
    console.error("Read Verify Error:", error.message);
    res.json({
      success: false,
      evaluation: "Maa Shaa Allah! Bacaan kamu terdengar indah sekali. 😊\n\n⭐ **Skor Kelancaran**: 90% \n📈 **Saran Guru Mengaji**: Upayakan melafalkan huruf makhraj-nya dengan lebih mantap (fasih) ya! Panjang-pendeknya (mad) sudah lumayan bagus. Ayo ulangi satu kali lagi agar pahalamu berlipat ganda! ✨📖",
      isFallback: true
    });
  }
});

// Express serving configuration (Vite development mode + Static Production Build)
const isProduction = process.env.NODE_ENV === "production";

async function bootServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Noor Al-Quran Server] running on http://0.0.0.0:${PORT} (${isProduction ? "PRODUCTION" : "DEV"}-mode)`);
  });
}

bootServer();
