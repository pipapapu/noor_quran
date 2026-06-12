import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Sparkles, Volume2, ArrowLeft, GraduationCap, CheckCircle, HelpCircle, RefreshCcw, Smile } from "lucide-react";
import { TAJWID_RULES, TajwidRule } from "../types";

interface TajwidStarsProps {
  onBack: () => void;
  onAddCoins: (amount: number) => void;
  onAddXp: (amount: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

const playSoundSynth = (hz: number, duration = 0.4) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.setValueAtTime(hz, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

export default function TajwidStars({ onBack, onAddCoins, onAddXp, onUnlockBadge }: TajwidStarsProps) {
  const [activeTab, setActiveTab] = useState<"learn" | "play">("learn");
  const [selectedRule, setSelectedRule] = useState<TajwidRule>(TAJWID_RULES[0]);
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);

  // Quiz state
  const [quizList, setQuizList] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Fetch quiz on playing tab activate
  useEffect(() => {
    if (activeTab === "play") {
      fetchQuiz();
    }
  }, [activeTab]);

  const fetchQuiz = async () => {
    setIsLoadingQuiz(true);
    setQuizList([]);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);

    try {
      const response = await fetch("/api/gemini/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "tajwid" })
      });
      const data = await response.json();
      if (data.quiz && Array.isArray(data.quiz)) {
        setQuizList(data.quiz);
      }
    } catch (e) {
      console.error("Error loaded Tajwid Quiz:", e);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleHearRule = (rule: TajwidRule) => {
    setSoundPlaying(rule.id);
    let hz = 280;
    if (rule.id === "qalqalah") hz = 350;
    if (rule.id === "ikhfa") hz = 480;
    playSoundSynth(hz, 0.6);
    setTimeout(() => {
      setSoundPlaying(null);
    }, 700);
  };

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);

    const question = quizList[currentIdx];
    const isCorrect = optIdx === question.answerIndex;
    
    if (isCorrect) {
      playSoundSynth(523.25, 0.45); // cute C5 chord chime
      setQuizScore(prev => prev + 1);
      onAddCoins(10);
      onAddXp(15);
    } else {
      playSoundSynth(180, 0.3); // low flat buzz
    }
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setIsAnswered(false);

    if (currentIdx + 1 < quizList.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
      // Perfect score awards a badge!
      if (quizScore + (selectedOpt === quizList[currentIdx].answerIndex ? 1 : 0) === quizList.length) {
        onUnlockBadge("tajwid_kid");
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#E0F2F1] relative select-none">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-4 shadow-md flex items-center justify-between shrink-0 font-sans">
        <div className="flex items-center gap-2">
          <button id="tajwid-back" onClick={onBack} className="p-1 hover:bg-white/20 rounded-full transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h3 className="font-bold text-base tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" /> Bintang Tajwid
            </h3>
            <span className="text-[10px] text-teal-100 font-medium">Bermain tanda baca & hukum membaca Al-Quran</span>
          </div>
        </div>
        <div className="bg-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold">
          Level 1-3
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="px-4 py-2 bg-teal-50 border-b border-teal-100 flex gap-2 shrink-0 select-none justify-center">
        <button
          id="tajwid-tab-learn"
          onClick={() => setActiveTab("learn")}
          className={`flex-1 max-w-[150px] py-1.5 rounded-full text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeTab === "learn"
              ? "bg-[#00796B] text-white shadow-sm"
              : "bg-white text-[#004D40] hover:bg-teal-100"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Belajar Tajwid</span>
        </button>
        <button
          id="tajwid-tab-play"
          onClick={() => setActiveTab("play")}
          className={`flex-1 max-w-[150px] py-1.5 rounded-full text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeTab === "play"
              ? "bg-[#00796B] text-white shadow-sm"
              : "bg-white text-[#004D40] hover:bg-teal-100"
          }`}
        >
          <span>🎯 Main Game</span>
        </button>
      </div>

      {/* Main Container Workspace */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-start">
        
        {activeTab === "learn" && (
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-[#004D40] text-center mb-1 bg-white/70 py-1.5 rounded-full shadow-sm">
              ✨ Pilih Hukum Tajwid di bawah untuk Belajar!
            </h4>

            {/* Rule Selector Panel */}
            <div className="grid grid-cols-3 gap-1.5 select-none shrink-0 mb-2">
              {TAJWID_RULES.map((rule) => (
                <button
                  key={rule.id}
                  id={`tajwid-btn-${rule.id}`}
                  onClick={() => setSelectedRule(rule)}
                  className={`p-2.5 rounded-2xl text-[10px] font-extrabold flex flex-col items-center justify-center text-center gap-1.5 transition duration-150 relative overflow-hidden ${
                    selectedRule.id === rule.id
                      ? "bg-[#009688] text-white shadow-md shadow-teal-500/20 active:scale-95"
                      : "bg-white text-[#00695C] border border-teal-200 hover:bg-teal-50"
                  }`}
                >
                  <span className="text-lg">
                    {rule.id === "qalqalah" ? "⚽" : rule.id === "ikhfa" ? "👃" : "💡"}
                  </span>
                  <span>{rule.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            {/* Expanded Lesson Board */}
            <AnimatePresence mode="wait">
              {selectedRule && (
                <motion.div
                  key={selectedRule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl p-5 border border-teal-200 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-start border-b border-teal-50 pb-3">
                    <div>
                      <h3 className="font-extrabold text-base text-[#004D40] flex items-center gap-1.5">
                        <span>📖</span> {selectedRule.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold">{selectedRule.englishName}</span>
                    </div>
                    
                    <button
                      id={`tajwid-pronounce-${selectedRule.id}`}
                      onClick={() => handleHearRule(selectedRule)}
                      className={`p-2.5 rounded-full transition flex items-center justify-center shrink-0 ${
                        soundPlaying === selectedRule.id
                          ? "bg-amber-400 text-white animate-bounce"
                          : "bg-teal-50 text-[#00796B] hover:bg-teal-100"
                      }`}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Rule Description Text */}
                  <div className="bg-[#E0F2F1]/40 rounded-2xl p-3.5 border border-teal-50">
                    <p className="text-slate-705 text-xs text-justify leading-relaxed font-medium">
                      {selectedRule.description}
                    </p>
                  </div>

                  {/* Graphic Visualization Component */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-[#004D40] font-extrabold uppercase tracking-widest block">
                      KUPAS CONTOH BACAAN:
                    </span>
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-100 text-center relative overflow-hidden">
                      <p className="text-2xl font-serif font-bold text-slate-800 leading-relaxed mb-1 p-1 tracking-wide">
                        {selectedRule.exampleArabic}
                      </p>
                      <p className="text-[10px] font-mono font-bold text-[#00695C] italic">
                        {selectedRule.exampleTranslit}
                      </p>
                      <span className="absolute bottom-1 right-2 text-xs opacity-20">📖</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      id="tajwid-go-quiz-inside"
                      onClick={() => setActiveTab("play")}
                      className="w-full bg-[#00897B] hover:bg-[#00796B] text-white font-extrabold py-3 rounded-2xl shadow-sm text-xs transition duration-150 active:scale-95"
                    >
                      Coba Uji Pengetahuanmu! 🎯
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeTab === "play" && (
          <div className="flex-1 flex flex-col justify-start">
            {isLoadingQuiz ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
                <div className="w-12 h-12 border-4 border-[#009688] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-teal-800 font-bold animate-pulse">Menyiapkan Kuis Pintar Cilik...</p>
              </div>
            ) : quizFinished ? (
              // Quiz Completed screen
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-5 border border-teal-200 text-center shadow-lg space-y-4"
              >
                <div className="text-4xl">🏆🥇🥳</div>
                <h3 className="font-extrabold text-[#004D40] text-base">KUIS TAJWID SELESAI!</h3>
                
                <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-100 max-w-xs mx-auto">
                  <p className="text-[11px] text-teal-800 font-bold uppercase tracking-wider">Hasil Ujian Cilik</p>
                  <p className="text-3xl font-black text-teal-700 mt-1 mb-1">{quizScore} / {quizList.length}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Jawaban Benar</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-semibold px-2">
                  {quizScore === quizList.length
                    ? "Subhanallah luar biasa! Kamu menjawab semua kuis dengan benar dan berhak mendapat Badge Pakar Tajwid Cilik! 🌟"
                    : "Hebat sekali usahamu Sobat Cilik! Terus belajar hukum tajwid agar bacaan Al-Quran-mu terdengar semakin merdu ya! ❤️"}
                </p>

                <div className="flex gap-2 justify-center pt-2 select-none">
                  <button
                    id="tajwid-quiz-replay"
                    onClick={fetchQuiz}
                    className="flex-1 py-3 bg-teal-550 border border-teal-300 text-[#00796B] font-extrabold rounded-2xl text-xs hover:bg-teal-50 transition active:scale-95 flex items-center justify-center gap-1"
                  >
                    <RefreshCcw className="w-4 h-4" /> Ulangi Kuis
                  </button>
                  <button
                    id="tajwid-quiz-exit"
                    onClick={onBack}
                    className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-extrabold rounded-2xl text-xs hover:brightness-105 transition active:scale-95 shadow-md shadow-teal-500/20"
                  >
                    Kembali
                  </button>
                </div>
              </motion.div>
            ) : quizList.length > 0 ? (
              // Active Quiz Screen
              <div className="space-y-4">
                {/* Progress bar info */}
                <div className="flex justify-between items-center bg-white px-3.5 py-2 rounded-xl text-[10px] text-teal-900 border border-teal-200/50">
                  <span className="font-extrabold">SOAL {currentIdx + 1} dari {quizList.length}</span>
                  <div className="w-24 bg-teal-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-555 h-full rounded-full transition-all duration-300"
                      style={{ width: `${((currentIdx + 1) / quizList.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold">⭐ Skor: {quizScore}</span>
                </div>

                {/* Question bubble */}
                <motion.div
                  key={currentIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-3xl p-4.5 border border-teal-200 shadow-sm relative"
                >
                  <span className="absolute -top-3 left-4 bg-[#FFD54F] text-[#5D4037] text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-sm">
                    Tebakan Tajwid 🤔
                  </span>
                  <p className="text-[12px] font-bold text-slate-800 leading-relaxed mt-2.5">
                    {quizList[currentIdx].question}
                  </p>
                </motion.div>

                {/* Options List */}
                <div className="space-y-2 select-none">
                  {quizList[currentIdx].options.map((opt, idx) => {
                    const isSelected = selectedOpt === idx;
                    const isCorr = idx === quizList[currentIdx].answerIndex;
                    let styleClass = "bg-white text-slate-800 border-teal-200 hover:bg-teal-50";
                    
                    if (isAnswered) {
                      if (isCorr) {
                        styleClass = "bg-emerald-100 text-emerald-900 border-emerald-400 font-bold shadow-sm-emerald";
                      } else if (isSelected) {
                        styleClass = "bg-red-100 text-red-900 border-red-300";
                      } else {
                        styleClass = "bg-slate-50 text-slate-400 border-slate-200 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        id={`quiz-opt-${idx}`}
                        className={`w-full p-3.5 text-left text-[11px] rounded-2xl border-2 transition duration-150 relative ${styleClass} flex items-center justify-between`}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                      >
                        <span className="flex-1 font-semibold">{opt}</span>
                        {isAnswered && isCorr && (
                          <span className="text-emerald-600 text-sm">✅ Benar!</span>
                        )}
                        {isAnswered && !isCorr && isSelected && (
                          <span className="text-red-500 text-sm">❌ Kurang tepat</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback/Explanation & Next panel */}
                {isAnswered && (
                  <motion.div
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-teal-50 p-4 rounded-3xl border border-teal-200 space-y-3 shrink-0"
                  >
                    <div className="flex items-start gap-1.5">
                      <span className="text-xl">💡</span>
                      <div>
                        <span className="font-extrabold text-[10px] text-teal-800 block uppercase tracking-widest">
                          CELOTEH GURU BACA:
                        </span>
                        <p className="text-[10.5px] text-teal-950 font-medium leading-relaxed">
                          {quizList[currentIdx].explanation}
                        </p>
                      </div>
                    </div>
                    <button
                      id="quiz-next-btn"
                      onClick={handleNextQuestion}
                      className="w-full bg-[#00897B] hover:bg-[#00796B] text-white font-extrabold py-2.5 rounded-xl text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-1"
                    >
                      <span>{currentIdx + 1 === quizList.length ? "Lihat Skor Akhir 🏆" : "Soal Berikutnya ➡️"}</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <p className="text-xs text-slate-500">Gagal memuat kuis. Coba ulangi kembali.</p>
                <button id="quiz-reload-direct" onClick={fetchQuiz} className="px-5 py-2 bg-teal-600 text-white rounded-full text-xs font-bold">
                  Muat Ulang
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
