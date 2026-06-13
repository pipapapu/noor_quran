import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, Play } from "lucide-react";
import { ActivePlayer, AVATARS } from "../types";
import TriviaGame from "../components/TriviaGame";

type TabId = "home" | "membaca" | "pelajaran" | "permainan" | "profil";

interface MapJourneyProps {
  player: ActivePlayer;
  onNavigateTab: (tab: TabId) => void;
  onStartSurah: () => void;
  onStartTajwid: () => void;
  onStartHafiz: () => void;
  onStartDailyAsr: () => void;
  onAddCoins: (amount: number) => void;
  onAddXp: (amount: number) => void;
}

// =====================
// Sound helpers (Web Audio API, no asset needed)
// =====================
const playSparkleSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.25);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 0.45);
  } catch (e) {}
};

const playSurahSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.6);
    });
  } catch (e) {}
};

// =====================
// Avatar helpers
// =====================
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const AVATAR_BG_COLORS = [
  "bg-pink-400", "bg-cyan-400", "bg-violet-400",
  "bg-amber-400", "bg-emerald-400", "bg-rose-400",
];

// Trivia checkpoints (Titik Cek) — kept from original app
const CHECKPOINTS = [
  {
    id: 1,
    question: "Berapa kali kita membaca Surah Al-Fatihah dalam shalat wajib sehari semalam?",
    options: ["17 kali", "10 kali", "5 kali"],
    ansIdx: 0,
  },
  {
    id: 2,
    question: "Surah Al-Fil menceritakan kawanan burung pelindung Ka'bah bernama?",
    options: ["Burung Ababil", "Burung Elang", "Burung Merpati"],
    ansIdx: 0,
  },
  {
    id: 3,
    question: "Ada berapa huruf memantul dalam hukum Tajwid Qalqalah?",
    options: ["5 Huruf (Ba-Jim-Dal-Tha-Qaf)", "3 Huruf", "10 Huruf"],
    ansIdx: 0,
  },
  {
    id: 4,
    question: "Manakah surah terpendek di bawah ini?",
    options: ["Surah Al-Kautsar (3 Ayat)", "Surah Al-Fatihah", "Surah Al-Ikhlas"],
    ansIdx: 0,
  },
];

// XP progress for level meter
const getXpProgress = (xp: number) => {
  // simple: 150 XP per level
  const intoLevel = xp % 150;
  return Math.min(100, Math.round((intoLevel / 150) * 100));
};

type ChatMessage = { from: "zain" | "me"; text: string };

export default function MapJourney({
  player,
  onNavigateTab,
  onStartSurah,
  onStartTajwid,
  onStartHafiz,
  onStartDailyAsr,
  onAddCoins,
  onAddXp,
}: MapJourneyProps) {
  const [triviaOpen, setTriviaOpen] = useState(false);

  // ✅ Chat box state (di dalam component)
  const key = undefined
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { from: "zain", text: "Assalamu'alaikum! Aku Zain, teman ngaji kamu 🌟 Ada yang mau ditanya?" },
  ]);

  const currentAvatarInfo = AVATARS.find(a => a.id === player.avatar) || AVATARS[0];
  const initials = getInitials(player.name);
  const avatarBgColor = AVATAR_BG_COLORS[player.name.charCodeAt(0) % AVATAR_BG_COLORS.length];
  const xpPct = getXpProgress(player.xp);

  };

  // ✅ State tambahan buat loading & error
  const [chatLoading, setChatLoading] = useState(false);

  // ✅ Handler kirim pesan → panggil Gemini API
  const handleSendChat = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;

    // 1) tambahin pesan user
    setChatMessages((prev) => [...prev, { from: "me", text }]);
    setChatInput("");

    // 2) tambahin placeholder "Zain lagi mikir..."
    setChatMessages((prev) => [...prev, { from: "zain", text: "..." }]);
    setChatLoading(true);

    try {
      const res = await fetch("https://noorquran-production.up.railway.app/api/gemini/buddy", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ 
		message: text,
		chatHistory: chatMessages 
		})
	  })

      const data = await res.json();

      if (!res.ok) {
        console.error("Gemini API error:", data);
        throw new Error(data?.error?.message || `HTTP ${res.status}`);
      }

      const reply =
        data?.text || "Hmm, Zain lagi bingung nih 🤔 coba tanya lagi ya!"

      // 3) replace placeholder "..." dengan jawaban Zain
      setChatMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { from: "zain", text: reply };
        return updated;
      });
    } catch (err: any) {
      console.error("Chat error:", err);
      setChatMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          from: "zain",
          text: `Waduh, Zain lagi ada masalah teknis 😅 (${err?.message || "unknown error"}). Coba lagi nanti ya!`,
        };
        return updated;
      });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#E8F5E9] overflow-y-auto overflow-x-hidden relative font-sans select-none scrollbar-none pb-4">

      {/* Background yellow road (jalur kuning) — adapts to scroll height */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex flex-col justify-around items-center">
        <div className="w-24 h-96 border-[32px] border-amber-400 rounded-full rotate-45 transform translate-x-12"></div>
        <div className="w-24 h-96 border-[32px] border-amber-400 rounded-full -rotate-45 transform -translate-x-12"></div>
      </div>

      {/* Floating decorations */}
      <div className="absolute right-4 top-32 text-3xl opacity-50 pointer-events-none select-none">☁️</div>
      <div className="absolute left-6 top-60 text-2xl opacity-40 pointer-events-none select-none">☁️</div>
      <div className="absolute right-8 top-[420px] text-3xl opacity-70 pointer-events-none select-none">🌴</div>
      <div className="absolute left-4 top-[480px] text-4xl opacity-80 pointer-events-none select-none">🕌</div>

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 w-full px-4">

        {/* ============ HEADER ============ */}
        <header className="flex items-center justify-between py-3 bg-white rounded-b-2xl px-3 shadow-sm mt-0 border-b">
          <div className="flex items-center gap-2">
            <span className="text-2xl">&nbsp;</span>
            <div>
              <h1 className="text-sm font-black text-emerald-800 leading-tight">Noor</h1>
              <p className="text-[9px] text-amber-700 font-bold tracking-wider leading-none">AL-QURAN</p>
            </div>
          </div>

          {/* Progress Level */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-[11px] font-bold text-amber-900">
            <span>🔑 Level {player.level}</span>
            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${xpPct}%` }}></div>
            </div>
          </div>

          {/* Profile (clickable → goes to profile tab) */}
          <button
            id="hud-profile-trigger"
            onClick={() => onNavigateTab("profil")}
            className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-full border hover:bg-white transition active:scale-95"
          >
            <div className={`w-7 h-7 rounded-full overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center ${avatarBgColor}`}>
              {currentAvatarInfo?.img ? (
                <img
                  src={currentAvatarInfo.img}
                  alt={player.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <span className="text-[10px] font-black text-white leading-none">{initials}</span>
              )}
            </div>
            <div className="pr-2 hidden sm:block text-left leading-none">
              <p className="text-[9px] font-bold text-gray-800 leading-none">{player.name}</p>
              <p className="text-[8px] text-gray-400">Pelajar</p>
            </div>
          </button>
        </header>

        {/* ============ TITLE ============ */}
        <div className="text-center my-6">
          <h2 className="text-2xl font-black text-emerald-900">Penjelajah Cilik</h2>
          <p className="text-[10px] font-black text-amber-800 tracking-wider uppercase mt-0.5">Petualangan Belajar Mengaji &amp; Hafal Al-Quran</p>
        </div>

        {/* ============ ADVENTURE AREA (ZIGZAG) ============ */}
        <div className="flex flex-col gap-6 relative my-8 max-w-md mx-auto">

          {/* CARD 1: Petualangan Surah (kiri) */}
          <motion.button
            id="btn-journey-surah"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { playSurahSound(); onStartSurah(); }}
            className="w-[75%] mr-auto bg-white border-[3px] border-emerald-500 rounded-2xl p-4 shadow-sm text-center transform transition active:scale-95 block"
          >
            <div className="text-3xl mb-1">👦👧🕌</div>
            <h3 className="text-sm font-extrabold text-slate-800">Petualangan Surah</h3>
            <p className="text-[11px] font-bold text-emerald-600">Belajar &amp; Membaca</p>
          </motion.button>

          {/* CARD 2: Bintang Tajwid (kanan) */}
          <motion.button
            id="btn-journey-tajwid"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStartTajwid}
            className="w-[75%] ml-auto bg-white border-[3px] border-amber-400 rounded-2xl p-4 shadow-sm text-center transform transition active:scale-95 block"
          >
            <div className="text-xl font-bold text-amber-600 mb-1">✨ ح ت ب ✨</div>
            <h3 className="text-sm font-extrabold text-slate-800">Bintang Tajwid</h3>
            <p className="text-[11px] font-bold text-amber-600">Aturan &amp; Tanda Baca</p>
          </motion.button>

          {/* BANNER TANTANGAN HARIAN (membentang) */}
          <motion.div
            id="btn-journey-daily-asr"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartDailyAsr}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-4 shadow-md my-2 flex items-center justify-between border-b-[4px] border-purple-800 cursor-pointer"
          >
            <div>
              <span className="bg-amber-400 text-purple-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                Tantangan Harian:
              </span>
              <h4 className="text-base font-black underline decoration-amber-400 decoration-2 mt-1">Selesaikan Al-Asr</h4>
            </div>
            <button
              id="daily-game-play-btn"
              onClick={(e) => { e.stopPropagation(); onStartDailyAsr(); }}
              className="bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow active:translate-y-0.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Mainkan</span>
            </button>
          </motion.div>

          {/* CARD 3: Pahlawan Hafiz (kiri) */}
          <motion.button
            id="btn-journey-hafiz"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStartHafiz}
            className="w-[75%] mr-auto bg-white border-[3px] border-pink-500 rounded-2xl p-4 shadow-sm text-center transform transition active:scale-95 block"
          >
            <div className="text-3xl mb-1">👑🏆🏅</div>
            <h3 className="text-sm font-extrabold text-slate-800">Pahlawan Hafiz</h3>
            <p className="text-[11px] font-bold text-pink-600">Menghafal &amp; Bermain</p>
          </motion.button>

          {/* CARD 4: Titik Cek Trivia (kanan) — keeps old checkpoint feature */}
          <motion.button
            id="btn-journey-trivia"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setTriviaOpen(true)}
            className="w-[75%] ml-auto bg-white border-[3px] border-cyan-400 rounded-2xl p-4 shadow-sm text-center transform transition active:scale-95 block relative"
          >
            <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse">4 TRIVIA</span>
            <div className="text-3xl mb-1">🎯💎</div>
            <h3 className="text-sm font-extrabold text-slate-800">Titik Cek Trivia</h3>
            <p className="text-[11px] font-bold text-cyan-600">Kuis Rahasia Zain</p>
          </motion.button>

        </div>

        {/* ============ ZAIN BUDDY ENTRY ============ */}
        <div className="max-w-md mx-auto mt-4 mb-6">
          <motion.button
            id="btn-journey-zain"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            // ✅ Sekarang buka chat box, bukan navigasi ke permainan
            onClick={() => setChatOpen(true)}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl p-3 shadow-md flex items-center gap-3 border-b-[4px] border-emerald-700"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-amber-100 shrink-0">
              <img src="/zain-avatar.jpg" alt="Zain" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="text-left flex-1">
              <p className="text-[9px] font-black uppercase tracking-wider opacity-90">Teman Ngaji AI</p>
              <p className="text-sm font-black leading-tight">Ngobrol sama Zain</p>
            </div>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* ============ TRIVIA MODAL ============ */}
      <{triviaOpen && (
  <TriviaGame
    initialLevel={1}
    onClose={() => setTriviaOpen(false)}
    onLevelComplete={(level, correctCount) => {
      onAddCoins(10 * Math.max(1, correctCount));
      onAddXp(15 * Math.max(1, correctCount));
    }}
  />
)}

      {/* ============ ZAIN CHAT MODAL ============ */}
      <AnimatePresence>
        {chatOpen && (
          <div className="absolute inset-0 bg-black/45 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-3xl border-4 border-teal-400 shadow-2xl w-full max-w-sm flex flex-col overflow-hidden font-sans"
              style={{ maxHeight: "85vh" }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-3 flex items-center gap-2">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white bg-amber-100 shrink-0">
                  <img src="/zain-avatar.jpg" alt="Zain" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black leading-tight">Zain</p>
                  <p className="text-[10px] opacity-90">Teman Ngaji AI • Online</p>
                </div>
                <button
                  id="close-chat-btn"
                  onClick={() => setChatOpen(false)}
                  className="p-1 rounded-full hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-emerald-50">
                {chatMessages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs font-semibold whitespace-pre-wrap ${
                        m.from === "me"
                          ? "bg-teal-500 text-white rounded-br-sm"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
                      }`}
                    >
                      {m.text === "..." ? (
                        <span className="inline-flex gap-1">
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce" style={{ animationDelay: "0.15s" }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>.</span>
                        </span>
                      ) : (
                        m.text
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-2 border-t bg-white flex gap-2">
                <input
                  id="chat-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  disabled={chatLoading}
                  placeholder={chatLoading ? "Zain lagi mikir..." : "Tanya Zain sesuatu..."}
                  className="flex-1 px-3 py-2 text-xs border-2 border-slate-200 rounded-full focus:border-teal-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
                />
                <button
                  id="chat-send-btn"
                  onClick={handleSendChat}
                  disabled={chatLoading}
                  className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-full text-xs font-black"
                >
                  {chatLoading ? "..." : "Kirim"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
