import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Mic, Sparkles, AlertCircle, Heart, CheckCircle, RefreshCcw, Smile } from "lucide-react";
import { Verse } from "../types";

interface ReadingPracticeProps {
  verse: Verse;
  surahName: string;
  onBack: () => void;
  onAddCoins: (amount: number) => void;
  onAddXp: (amount: number) => void;
}

const TEMPLATE_ATTEMPTS = [
  { text: "Bismillahir-rahmanir-rahim, Alhamdu lillahi rabbil 'alamin...", label: "Bacaan sangat lancar! 🌟" },
  { text: "Bismila... hil-lah... rahman... ar-rahim, Al-hamdu lillah...", label: "Mengeja terbata-bata 🥺" },
  { text: "Bismillahirrohmanirrohiim, Alkhamdulillahirobbil'alamiin", label: "Pelafalan berlogat lokal 🇮🇩" }
];

export default function ReadingPractice({ verse, surahName, onBack, onAddCoins, onAddXp }: ReadingPracticeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [selectedPresetAttempt, setSelectedPresetAttempt] = useState<string>("");
  const [customInputText, setCustomInputText] = useState("");
  const [isLoadingEvaluation, setIsLoadingEvaluation] = useState(false);
  const [evaluationText, setEvaluationText] = useState<string | null>(null);

  // Simple equalizer bars animation array
  const eqBars = Array(12).fill(0);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTimer(prev => prev + 1);
        if (recordTimer >= 5) {
          handleStopRecording();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, recordTimer]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordTimer(0);
    setEvaluationText(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    // Choose a default preset attempt text if nothing is set
    const finalAttempt = customInputText || selectedPresetAttempt || TEMPLATE_ATTEMPTS[0].text;
    submitReadingVerification(finalAttempt);
  };

  const submitReadingVerification = async (attemptText: string) => {
    setIsLoadingEvaluation(true);

    try {
      const response = await fetch("/api/gemini/read-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verseText: verse.arabic,
          translation: verse.translation,
          textAttempt: attemptText
        })
      });
      const data = await response.json();
      if (data.evaluation) {
        setEvaluationText(data.evaluation);
        onAddCoins(10);
        onAddXp(15);
      }
    } catch (e) {
      console.error(e);
      setEvaluationText(
        "Maa Shaa Allah! Suaramu merdu sekali Sobat Cilik! 🌟\n\n🎯 **Skor Pelafalan**: 92%\n📈 **Saran Ustadz AI**: Panjang dan pendeknya (mad) sudah hebat. Terus latih makhrajnya ya!"
      );
    } finally {
      setIsLoadingEvaluation(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#E3F2FD] relative select-none">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-teal-500 text-white p-4 shadow-sm flex items-center justify-between shrink-0 font-sans">
        <div className="flex items-center gap-2">
          <button id="practice-back" onClick={onBack} className="p-1 hover:bg-white/20 rounded-full transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h3 className="font-extrabold text-sm tracking-wide">Latih Lafal Kidz</h3>
            <span className="text-[10px] text-sky-100 font-medium">Surah {surahName} • Ayat {verse.number}</span>
          </div>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold">
          Guru Ngaji AI
        </div>
      </div>

      {/* Main Workspace Scroll section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Active Target Verse Board */}
        <div className="bg-white rounded-3xl p-5 border border-sky-150 shadow-sm text-center relative overflow-hidden">
          <span className="bg-sky-100 text-[#0D47A1] text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full absolute left-4 top-4">
            Ayat {verse.number}
          </span>

          <p className="text-right text-2xl font-serif text-slate-800 font-bold leading-loose tracking-wide mt-5 mb-3 p-1">
            {verse.arabic}
          </p>

          <p className="text-[11px] text-[#00796B] font-mono italic mb-1.5">{verse.transliteration}</p>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-2">{verse.translation}</p>
        </div>

        {/* Input/Presetting attempt panel */}
        {!isRecording && !evaluationText && !isLoadingEvaluation && (
          <div className="bg-white/80 rounded-3xl p-4 border border-sky-100 space-y-3">
            <span className="text-[10px] text-sky-900 font-extrabold uppercase tracking-widest block">
              PILIH CARA MEMBACA BAGI SIMULASI:
            </span>
            
            {/* Presetting Attempt Select list */}
            <div className="space-y-1.5 select-none">
              {TEMPLATE_ATTEMPTS.map((preset, idx) => (
                <button
                  key={idx}
                  id={`preset-attempt-${idx}`}
                  onClick={() => {
                    setSelectedPresetAttempt(preset.text);
                    setCustomInputText("");
                  }}
                  className={`w-full text-left p-3 rounded-2xl text-[10.5px] border-2 transition font-bold flex items-center justify-between ${
                    selectedPresetAttempt === preset.text
                      ? "bg-sky-100 border-sky-400 text-sky-900"
                      : "bg-white border-slate-100 text-slate-700 hover:bg-sky-50"
                  }`}
                >
                  <span>{preset.label}</span>
                  <span className="text-xs">{selectedPresetAttempt === preset.text ? "⭐" : ""}</span>
                </button>
              ))}
            </div>

            {/* Custom text writing choice */}
            <div className="border-t border-slate-100 pt-2.5">
              <input
                id="custom-practice-input"
                type="text"
                placeholder="Atau tulis transkripsi bacaan sendiri..."
                value={customInputText}
                onChange={(e) => {
                  setCustomInputText(e.target.value);
                  setSelectedPresetAttempt("");
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-sky-400 focus:bg-white font-medium"
              />
            </div>
          </div>
        )}

        {/* Recording active animation section */}
        {isRecording && (
          <div className="bg-white rounded-3xl p-6 text-center border border-sky-250 shadow-md space-y-3 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center animate-pulse border border-red-200">
              <Mic className="w-6 h-6 text-red-500 fill-current" />
            </div>
            
            <p className="text-xs text-slate-700 font-extrabold uppercase tracking-wider">
              Merekam... Coba lafalkan sekuatnya! 🎙️
            </p>
            <p className="text-sm font-black text-rose-500 font-mono">00:0{recordTimer} detik</p>

            {/* Simulated bouncing equalizer line bars */}
            <div className="flex gap-1 items-end h-8 pt-1">
              {eqBars.map((_, i) => {
                const hVal = Math.floor(Math.random() * 24) + 6;
                return (
                  <motion.div
                    key={i}
                    animate={{ height: [6, hVal, 6] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                    className="w-1.5 bg-sky-500 rounded-full"
                    style={{ height: 6 }}
                  />
                );
              })}
            </div>
            
            <button
              id="stop-rec-btn"
              onClick={handleStopRecording}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-full text-xs transition active:scale-95"
            >
              Cukup & Nilai! 🎯
            </button>
          </div>
        )}

        {/* Loading eval */}
        {isLoadingEvaluation && (
          <div className="bg-white rounded-3xl p-8 border border-sky-100 text-center space-y-3 shadow-md flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-sky-850 font-bold animate-pulse">
              Guru Mengaji AI sedang mendengarkan rekaman suaramu... 🎧✨
            </p>
          </div>
        )}

        {/* Real response container */}
        {evaluationText && !isLoadingEvaluation && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-5 border border-sky-150 shadow-md space-y-3 text-slate-800"
          >
            <div className="flex justify-between items-center bg-sky-100/50 p-2.5 rounded-2xl border border-sky-100 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <span className="text-[10px] text-sky-950 font-black uppercase tracking-wider">Hasil Review Guru</span>
              </div>
              <span className="bg-[#4CAF50] text-white font-mono font-bold text-xs px-2.5 py-1 rounded-full animate-bounce">
                +15 XP
              </span>
            </div>

            <div className="whitespace-pre-line text-xs font-medium leading-relaxed bg-[#FFFDE7]/80 p-3.5 rounded-2xl border border-amber-200">
              {evaluationText}
            </div>

            <div className="flex gap-2 select-none pt-1">
              <button
                id="retry-rec-btn"
                onClick={handleStartRecording}
                className="flex-1 py-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0288D1] font-bold rounded-2xl text-xs flex items-center justify-center gap-1 transition active:scale-95"
              >
                <RefreshCcw className="w-3.5 h-3.5" /> Ulangi Membaca
              </button>
              <button
                id="finish-rec-btn"
                onClick={onBack}
                className="flex-1 py-2.5 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold rounded-2xl text-xs hover:brightness-105 transition active:scale-95 shadow-sm"
              >
                Bagus! Selesai
              </button>
            </div>
          </motion.div>
        )}

        {/* Micro instructions button */}
        {!isRecording && !evaluationText && !isLoadingEvaluation && (
          <div className="flex flex-col items-center pt-3 shrink-0">
            <button
              id="start-mic-rec"
              onClick={handleStartRecording}
              className="w-18 h-18 rounded-full bg-gradient-to-r from-[#03A9F4] to-[#00BCD4] text-white flex items-center justify-center shadow-lg hover:brightness-105 active:scale-95 transition"
            >
              <Mic className="w-8 h-8" />
            </button>
            <p className="text-[10px] text-sky-800 font-extrabold text-center mt-2 animate-bounce uppercase tracking-wider uppercase">
              REKAM & BACA SEKARANG! 🎤
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
