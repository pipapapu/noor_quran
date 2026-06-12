import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, RotateCcw, CheckCircle, ArrowLeft, BookOpen, Volume2, Sparkles, Smile } from "lucide-react";
import { SURAH_DATA, Surah, Verse } from "../types";

interface HafizHeroProps {
  onBack: () => void;
  onAddCoins: (amount: number) => void;
  onAddXp: (amount: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

interface ConfettiBall {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

// Custom synthesized chime generator using Web Audio API
const playCuteChime = (success: boolean) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (success) {
      // Lovely major arpeggio chime (C4 -> E4 -> G4 -> C5)
      const now = ctx.currentTime;
      const freqs = [261.63, 329.63, 392.00, 523.25];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(f, now + i * 0.1);
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.5);
      });
    } else {
      // Gentle soft sliding buzzer for mistakes
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (error) {
    console.warn("AudioContext block by browser guidelines.", error);
  }
};

export default function HafizHero({ onBack, onAddCoins, onAddXp, onUnlockBadge }: HafizHeroProps) {
  // Support Al-Ikhlas and Al-Asr for memorization puzzle
  const gamesSurahs = SURAH_DATA.filter(s => s.id === "ikhlas" || s.id === "asr");
  const [selectedSurah, setSelectedSurah] = useState<Surah>(gamesSurahs[0]);
  const [shuffledVerses, setShuffledVerses] = useState<Verse[]>([]);
  const [placedVerses, setPlacedVerses] = useState<(Verse | null)[]>([]);
  const [gameState, setGameState] = useState<"playing" | "success" | "failure">("playing");
  const [confetti, setConfetti] = useState<ConfettiBall[]>([]);
  const [hintActive, setHintActive] = useState(false);

  useEffect(() => {
    resetGame(selectedSurah);
  }, [selectedSurah]);

  const resetGame = (surah: Surah) => {
    // Generate shuffled
    const copy = [...surah.verses];
    const shuffled = copy.sort(() => Math.random() - 0.5);
    setShuffledVerses(shuffled);
    setPlacedVerses(Array(surah.verses.length).fill(null));
    setGameState("playing");
    setConfetti([]);
    setHintActive(false);
  };

  const handlePlaceVerse = (verse: Verse) => {
    if (gameState !== "playing") return;
    
    // Find next empty slot in placedVerses
    const nextEmptyIndex = placedVerses.indexOf(null);
    if (nextEmptyIndex !== -1) {
      const newPlaced = [...placedVerses];
      newPlaced[nextEmptyIndex] = verse;
      setPlacedVerses(newPlaced);

      // Remove from shuffled pool
      setShuffledVerses(prev => prev.filter(v => v.number !== verse.number));
    }
  };

  const handleRemoveVerse = (index: number) => {
    if (gameState !== "playing") return;
    
    const verse = placedVerses[index];
    if (verse) {
      const newPlaced = [...placedVerses];
      newPlaced[index] = null;
      setPlacedVerses(newPlaced);

      // Return to shuffled pool
      setShuffledVerses(prev => [...prev, verse]);
    }
  };

  const checkSolution = () => {
    // Check if everything is full
    const isAnyEmpty = placedVerses.some(v => v === null);
    if (isAnyEmpty) return;

    let correct = true;
    placedVerses.forEach((verse, idx) => {
      if (verse && verse.number !== selectedSurah.verses[idx].number) {
        correct = false;
      }
    });

    if (correct) {
      setGameState("success");
      playCuteChime(true);
      
      // Earn rewards!
      onAddCoins(20);
      onAddXp(30);
      if (selectedSurah.id === "ikhlas") {
        onUnlockBadge("hafiz_junior");
      }

      // Generate colorful confetti
      const particles: ConfettiBall[] = [];
      const colors = ["#FFEB3B", "#FF4081", "#00E676", "#29B6F6", "#AB47BC", "#FF7043"];
      for (let i = 0; i < 60; i++) {
        particles.push({
          id: i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 50 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 6,
          delay: Math.random() * 0.4
        });
      }
      setConfetti(particles);
    } else {
      setGameState("failure");
      playCuteChime(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF9C4] relative select-none">
      
      {/* Game Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 shadow-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button id="hafiz-back" onClick={onBack} className="p-1 hover:bg-white/20 rounded-full transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h3 className="font-bold text-base tracking-wide flex items-center gap-1.5">
              <Award className="w-5 h-5 text-yellow-300 animate-pulse" /> Pahlawan Hafiz
            </h3>
            <span className="text-[10px] text-amber-100 font-medium">Melatih hafalan & menyusun ayat surah</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full text-xs font-semibold">
          <span>🏆</span>
          <span>+30 XP</span>
        </div>
      </div>

      {/* Surah Switcher */}
      <div className="p-3 flex items-center justify-center gap-2 bg-amber-400/20 shrink-0">
        {gamesSurahs.map((surah) => (
          <button
            key={surah.id}
            id={`hafiz-switch-${surah.id}`}
            onClick={() => setSelectedSurah(surah)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
              selectedSurah.id === surah.id
                ? "bg-amber-500 text-white shadow-amber-300/40"
                : "bg-white text-amber-800 hover:bg-amber-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Surah {surah.name}</span>
          </button>
        ))}
      </div>

      {/* Main Board Workspace */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-start">
        <p className="text-center font-bold text-slate-700 text-xs mb-3 flex items-center justify-center gap-1">
          <span>🎯</span> Susunlah ayat di bawah ini sesuai urutan yang benar dari atas ke bawah!
        </p>

        {/* Placing Slots Zone */}
        <div className="space-y-2.5">
          {placedVerses.map((verse, index) => (
            <div
              key={index}
              id={`hafiz-slot-${index}`}
              className={`min-h-[64px] rounded-2xl border-2 flex items-center justify-between p-3 transition relative overflow-hidden ${
                verse
                  ? "bg-white border-teal-300 shadow-sm"
                  : "bg-amber-50/55 border-dashed border-amber-300/80"
              }`}
            >
              {/* Badge Slot Number */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-400 text-white font-mono text-xs font-bold flex items-center justify-center">
                {index + 1}
              </div>

              {verse ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="pl-8 flex-1 flex flex-row-reverse items-center justify-between gap-2.5"
                >
                  <div className="text-right flex-1">
                    <p className="text-base text-slate-800 font-serif leading-relaxed font-bold tracking-wide">
                      {verse.arabic}
                    </p>
                    <p className="text-[9px] text-slate-500 font-mono italic">
                      {verse.transliteration}
                    </p>
                  </div>
                  <button
                    id={`hafiz-remove-${index}`}
                    onClick={() => handleRemoveVerse(index)}
                    className="p-1 text-slate-400 hover:text-red-500 text-[10px] font-bold border border-slate-200 rounded-lg hover:border-red-200 hover:bg-red-50 transition"
                  >
                    Hapus
                  </button>
                </motion.div>
              ) : (
                <div className="pl-8 text-slate-400 text-xs italic font-medium">
                  Ketuk kartu lafal di bawah...
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Shuffled pool cards */}
        {shuffledVerses.length > 0 && (
          <div className="mt-5">
            <h4 className="text-[10px] text-amber-800 font-extrabold uppercase tracking-widest text-center mb-2.5 bg-amber-200/50 py-1 rounded-full">
              Pilihan Lafal Ayat
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <AnimatePresence>
                {shuffledVerses.map((verse) => (
                  <motion.button
                    key={verse.number}
                    id={`hafiz-pool-item-${verse.number}`}
                    layoutId={`verse-${verse.number}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => handlePlaceVerse(verse)}
                    className="p-3 bg-white hover:bg-amber-100 rounded-2xl border-2 border-amber-300 text-slate-800 shadow-sm active:scale-95 transition text-right duration-200"
                  >
                    <p className="text-sm font-serif font-bold text-slate-800 leading-relaxed tracking-wide">
                      {verse.arabic}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[8px] bg-amber-300 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">Ayat Acak</span>
                      <p className="text-[9px] text-slate-400 font-mono italic">{verse.transliteration}</p>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Success / Fail / Check Banner */}
        <div className="mt-6 shrink-0 flex flex-col gap-2.5">
          {gameState === "playing" && (
            <div className="flex gap-2">
              <button
                id="hafiz-hint-btn"
                onClick={() => setHintActive(!hintActive)}
                className="flex-1 bg-[#81C784] hover:bg-[#66BB6A] text-white font-bold py-3 rounded-2xl shadow-sm text-xs transition active:scale-95"
              >
                {hintActive ? "Sembunyikan Bantuan" : "Lihat Bantuan 📖"}
              </button>
              <button
                id="hafiz-check-btn"
                onClick={checkSolution}
                disabled={placedVerses.includes(null)}
                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-3 rounded-2xl shadow-md text-xs transition hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                Periksa Urutan! 🎯
              </button>
            </div>
          )}

          {hintActive && gameState === "playing" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 p-3 rounded-2xl border border-amber-300 text-[10px] text-amber-900 leading-relaxed"
            >
              <div className="font-bold flex items-center gap-1 mb-1">
                <span>📖</span> Urutan Arti Surah {selectedSurah.name}:
              </div>
              <ol className="list-decimal pl-4 space-y-1 font-medium">
                {selectedSurah.verses.map((v, i) => (
                  <li key={i}>{v.translation}</li>
                ))}
              </ol>
            </motion.div>
          )}

          {gameState === "success" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-4 text-white text-center shadow-lg relative overflow-hidden"
            >
              <div className="relative z-10 space-y-2">
                <div className="flex justify-center text-4xl">🎉🥳👏</div>
                <h4 className="font-extrabold text-base">MAA SHAA ALLAH, HEBAT!</h4>
                <p className="text-xs text-teal-105 font-medium leading-relaxed">
                  Kamu berhasil mengurutkan ayat Surah {selectedSurah.name} dengan sempurna! 
                  Kamu mendapatkan <strong className="text-yellow-300 font-bold">+20 Koin Emas</strong> & <strong className="text-yellow-300 font-bold">+30 XP</strong>. Unlocked badge baru!
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    id="hafiz-finish-ok"
                    onClick={onBack}
                    className="bg-white text-emerald-800 font-extrabold px-5 py-2 rounded-full text-xs shadow-sm hover:bg-slate-100 transition active:scale-95"
                  >
                    Mantap! Kembali
                  </button>
                  <button
                    id="hafiz-replay-ok"
                    onClick={() => resetGame(selectedSurah)}
                    className="bg-emerald-600 border border-emerald-400 text-white font-extrabold px-4 py-2 rounded-full text-xs shadow-sm flex items-center gap-1.5 hover:bg-emerald-700 transition active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Ulangi
                  </button>
                </div>
              </div>

              {/* Celebration Confetti Layer */}
              {confetti.map((c) => (
                <div
                  key={c.id}
                  className="absolute pointer-events-none rounded-full animate-ping opacity-90"
                  style={{
                    backgroundColor: c.color,
                    width: c.size,
                    height: c.size,
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    animationDelay: `${c.delay}s`,
                    animationDuration: "2s"
                  }}
                />
              ))}
            </motion.div>
          )}

          {gameState === "failure" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-rose-500 to-red-500 rounded-3xl p-4 text-white text-center shadow-lg"
            >
              <h4 className="font-extrabold text-sm flex items-center justify-center gap-2">
                <span>😢</span> Oh-oh, ayo coba lagi!
              </h4>
              <p className="text-[11px] text-rose-100 mt-1 mb-2.5 font-medium">
                Urutan ayat kamu belum tepat. Membaca berulang-ulang akan memudahkan menghafal! Mau coba sekali lagi?
              </p>
              <div className="flex justify-center gap-2">
                <button
                  id="hafiz-fail-retry"
                  onClick={() => resetGame(selectedSurah)}
                  className="bg-white text-red-600 font-extrabold px-6 py-2 rounded-full text-xs shadow-sm hover:bg-rose-50 active:scale-95 transition"
                >
                  Coba Lagi! 🔄
                </button>
                <button
                  id="hafiz-fail-help"
                  onClick={() => {
                    setGameState("playing");
                    setHintActive(true);
                  }}
                  className="bg-red-700 hover:bg-red-800 text-white font-extrabold px-4 py-2 rounded-full text-xs shadow-sm active:scale-95 transition"
                >
                  Aktifkan Panduan
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
