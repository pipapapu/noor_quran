import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Play, Pause, BookOpen, Volume2, Mic, Sparkles, Smile, MessageCircle, HelpCircle } from "lucide-react";
import { SURAH_DATA, Surah, Verse } from "../types";

interface SurahAdventureProps {
  onBack: () => void;
  onAddCoins: (amount: number) => void;
  onAddXp: (amount: number) => void;
  onExploreReading: (verse: Verse, surahName: string) => void;
}

export default function SurahAdventure({ onBack, onAddCoins, onAddXp, onExploreReading }: SurahAdventureProps) {
  const [selectedSurah, setSelectedSurah] = useState<Surah>(SURAH_DATA[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVersePlaying, setCurrentVersePlaying] = useState<number | null>(null);
  const [storyText, setStoryText] = useState<string | null>(null);
  const [storyLoading, setStoryLoading] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop audio on unmount or surah change
  useEffect(() => {
    stopRecitation();
    return () => stopRecitation();
  }, [selectedSurah]);

  const playRecitation = (verseNum?: number) => {
    // Jika audio yang diklik sama dengan yang sedang berputar, matikan (Toggle Pause)
    if (isPlaying && currentVersePlaying === (verseNum || 1)) {
      stopRecitation();
      return;
    }

    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setIsPlaying(true);
      setCurrentVersePlaying(verseNum || 1);

      // FIX URL: Membuat link audio dinamis EveryAyah dengan benar
      const audioUrl = verseNum 
        ? `https://everyayah.com/data/Ghamadi_40kbps/${selectedSurah.number.toString().padStart(3, "0")}${verseNum.toString().padStart(3, "0")}.mp3`
        : selectedSurah.audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.volume = 0.65;
      
      audio.play().catch(e => {
        console.warn("Autoplay block. Simulating reading sound with Web Audio...");
        const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioClass) {
          const actx = new AudioClass();
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(320, actx.currentTime);
          gain.gain.setValueAtTime(0.1, actx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(actx.destination);
          osc.start();
          osc.stop(actx.currentTime + 1.3);
        }
      });

      // LOGIKA UTAMA: Ketika ayat selesai diputar
      audio.onended = () => {
        onAddCoins(1); // Tetap beri koin reward
        onAddXp(2);

        // Jika yang baru selesai diputar adalah audio per-ayat (bukan audio full surah)
        if (verseNum) {
          const nextVerseNum = verseNum + 1;
          
          // Cek apakah ayat berikutnya masih ada di surah ini
          if (nextVerseNum <= selectedSurah.verses.length) {
            // Otomatis panggil fungsi ini lagi untuk ayat berikutnya!
            playRecitation(nextVerseNum);
          } else {
            // Jika sudah habis ayatnya, matikan status player
            setIsPlaying(false);
            setCurrentVersePlaying(null);
            console.log("Alhamdulillah, surah selesai!");
          }
        } else {
          // Jika yang disetel dari awal adalah tombol "Dengar Surah 📖" (audio full satu surah)
          setIsPlaying(false);
          setCurrentVersePlaying(null);
        }
      };
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecitation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null; // Bersihkan object audio lama
    }
    setIsPlaying(false);
    setCurrentVersePlaying(null);
  };

  const handleFetchStory = async () => {
    setShowStoryModal(true);
    if (storyText && storyText.includes(selectedSurah.name)) return; // already loaded for this surah

    setStoryLoading(true);
    setStoryText(null);

    try {
      const response = await fetch("/api/gemini/explain-surah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surahName: `Surah ${selectedSurah.name}` })
      });
      const data = await response.json();
      if (data.explanation) {
        setStoryText(data.explanation);
        onAddCoins(5);
        onAddXp(10);
      }
    } catch (e) {
      console.error(e);
      setStoryText(selectedSurah.storyPrompt);
    } finally {
      setStoryLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#E8F5E9] relative select-none">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 shadow-md flex items-center justify-between shrink-0 font-sans">
        <div className="flex items-center gap-2">
          <button id="surah-back" onClick={onBack} className="p-1 hover:bg-white/20 rounded-full transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h3 className="font-bold text-base tracking-wide flex items-center gap-1.5">
              🕌 Petualangan Surah
            </h3>
            <span className="text-[10px] text-emerald-100 font-medium">Jelajahi surah juz 30 yang indah</span>
          </div>
        </div>
        <div className="bg-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold">
          Juz Amma
        </div>
      </div>

      {/* Surah List Selector Bar */}
      <div className="p-3 bg-emerald-100/40 flex gap-2 overflow-x-auto shrink-0 select-none scrollbar-none border-b border-emerald-100">
        {SURAH_DATA.map((surah) => (
          <button
            key={surah.id}
            id={`surah-select-tab-${surah.id}`}
            onClick={() => setSelectedSurah(surah)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition whitespace-nowrap active:scale-95 shadow-sm ${
              selectedSurah.id === surah.id
                ? "bg-emerald-600 text-white shadow-emerald-400/20"
                : "bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-100"
            }`}
          >
            {surah.name} ({surah.arabicName})
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Surah Banner Card */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-full pointer-events-none"></div>
          
          <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full px-2.5">
            Surah ke-{selectedSurah.number}
          </span>

          <h2 className="text-xl font-bold font-serif text-slate-800 tracking-wide mt-2">
            Surah {selectedSurah.name} ({selectedSurah.arabicName})
          </h2>
          <p className="text-xs text-slate-450 italic mt-0.5">{selectedSurah.translation} • {selectedSurah.verses.length} Ayat</p>

          <div className="mt-4 flex gap-2.5 select-none w-full">
            <button
              id={`surah-play-full-${selectedSurah.id}`}
              onClick={() => playRecitation()}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 text-white py-2.5 rounded-2xl shadow-sm text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              {isPlaying && !currentVersePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying && !currentVersePlaying ? "Pause Audio" : "Dengar Surah 📖"}</span>
            </button>

            <button
              id={`surah-story-btn-${selectedSurah.id}`}
              onClick={handleFetchStory}
              className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-900 py-2.5 rounded-2xl shadow-sm text-xs font-black transition active:scale-95 flex items-center justify-center gap-1"
            >
              <span>✨ Kisah Dongeng</span>
            </button>
          </div>
        </div>

        {/* Verse Lists */}
        <div className="space-y-3">
          <h4 className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest pl-1">
            DAFTAR AYAT SUCI:
          </h4>

          {selectedSurah.verses.map((verse) => {
            const isThisPlaying = isPlaying && currentVersePlaying === verse.number;
            return (
              <div
                key={verse.number}
                id={`verse-card-${verse.number}`}
                className={`bg-white rounded-3xl p-4.5 border transition-all duration-200 relative shadow-sm ${
                  isThisPlaying ? "border-emerald-400 bg-emerald-50/40 shadow-emerald-100/50" : "border-emerald-50"
                }`}
              >
                {/* Verse Indicator */}
                <div className="flex justify-between items-center mb-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold flex items-center justify-center border border-emerald-200 shadow-sm">
                    {verse.number}
                  </span>

                  <div className="flex gap-2">
                    {/* Read checker trigger */}
                    <button
                      id={`practice-btn-${verse.number}`}
                      onClick={() => onExploreReading(verse, selectedSurah.name)}
                      className="p-1 px-2 text-[9px] bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg border border-sky-100 flex items-center gap-1 transition active:scale-95"
                    >
                      <Mic className="w-3 h-3 text-sky-500" />
                      <strong>Latih Lafal</strong>
                    </button>

                    {/* Quick play verse reciter */}
                    <button
                      id={`play-verse-btn-${verse.number}`}
                      onClick={() => playRecitation(verse.number)}
                      className={`p-1.5 rounded-full transition active:scale-95 flex items-center justify-center ${
                        isThisPlaying ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Arabic Script */}
                <p className="text-right text-xl font-serif text-slate-800 leading-loose tracking-wide font-bold mb-2">
                  {verse.arabic}
                </p>

                {/* Transliteration */}
                <p className="text-[11px] text-teal-800 font-mono italic mb-1 shrink-0">
                  {verse.transliteration}
                </p>

                {/* Translation String */}
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-1.5">
                  {verse.translation}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* Kisah Dongeng Storyteller dialog Modal */}
      <AnimatePresence>
        {showStoryModal && (
          <div className="absolute inset-0 bg-black/45 flex items-end justify-center z-55 p-0">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-[32px] w-full max-h-[85%] flex flex-col shadow-2xl relative"
            >
              {/* Close Bar header */}
              <div className="p-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-t-[30px] flex justify-between items-center text-slate-900 shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨📖</span>
                  <div>
                    <h4 className="font-extrabold text-sm">Cerita Surah {selectedSurah.name}</h4>
                    <span className="text-[9px] text-[#5D4037] font-semibold">Oleh Ustadz Zain AI Dongeng</span>
                  </div>
                </div>
                <button
                  id="close-story-modal"
                  onClick={() => {
                    setShowStoryModal(false);
                    setStoryText(null);
                  }}
                  className="px-3.5 py-1.5 bg-slate-900/10 hover:bg-slate-900/20 text-xs font-bold rounded-full transition"
                >
                  Tutup
                </button>
              </div>

              {/* Story scroll panel body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                
                {/* Illustration placeholder */}
                <div className="w-full bg-amber-50 h-[120px] rounded-2xl border border-dashed border-amber-300 flex flex-col items-center justify-center p-3 text-center text-amber-900 shrink-0">
                  <span className="text-3xl animate-bounce">🎈🦄🕌</span>
                  <span className="text-[10px] font-bold mt-1.5 uppercase tracking-wider text-amber-800">
                    Kisah Edukasi Anak Muslim
                  </span>
                </div>

                {storyLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3">
                    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[11px] text-amber-700 font-bold animate-pulse">
                      Kak Zain AI sedang mencari buku cerita... Keplak-keplok! 📖✨
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-800 text-xs leading-relaxed space-y-3 text-justify font-medium"
                  >
                    {storyText ? (
                      <div className="whitespace-pre-line bg-gradient-to-b from-amber-50/20 to-orange-50/20 p-3.5 rounded-2xl border border-amber-100">
                        {storyText}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic text-center">Cerita tidak termuat.</p>
                    )}
                  </motion.div>
                )}

              </div>
              
              {/* Bottom footer button bar */}
              <div className="p-4 border-t border-slate-100 text-center bg-slate-50 leading-none shrink-0 select-none">
                <p className="text-[10px] text-slate-450 font-medium">Bermain Al-Quran bikin cerdas dan disayang Allah! ❤️</p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
