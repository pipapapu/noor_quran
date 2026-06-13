import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Play, Lock, Check } from "lucide-react";
import {
  SOAL_PER_LEVEL,
  TIMER_DURATION,
  TOTAL_LEVELS,
  getSoalForLevel,
  type QuizQuestion,
} from "../data/quizData";
import {
  getUnlockedLevels,
  getCompletedLevels,
  markLevelCompleted,
  unlockNextLevel,
} from "./services/quizStorage";

// ============================================
// Sound helpers (copy dari file lo biar konsisten)
// ============================================
const playSparkleSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
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

const playWinSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
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

// ============================================
// Props
// ============================================
interface TriviaGameProps {
  initialLevel?: number;
  onClose: () => void;
  onLevelComplete: (level: number, correctCount: number) => void;
}

// ============================================
// Main Component
// ============================================
export default function TriviaGame({
  initialLevel = 1,
  onClose,
  onLevelComplete,
}: TriviaGameProps) {
  // ===== SCREEN STATE =====
  type Screen = "list" | "play" | "result";
  const [screen, setScreen] = useState<Screen>("list");
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [unlockedLevels, setUnlockedLevelsState] = useState<number[]>([1]);
  const [completedLevels, setCompletedLevelsState] = useState<number[]>([]);

  // ===== QUIZ STATE =====
  const [soalList, setSoalList] = useState<QuizQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [checkingAnswer, setCheckingAnswer] = useState<null | "correct" | "wrong" | "timeout">(
    null,
  );

  // ===== TIMER STATE =====
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);

  // ===== CONFETTI STATE =====
  const [confettiPieces, setConfettiPieces] = useState<
    { id: number; left: number; bg: string; delay: number; duration: number; isCircle: boolean }[]
  >([]);

  // ============================================
  // Load progress dari storage pas mount
  // ============================================
  useEffect(() => {
    setUnlockedLevelsState(getUnlockedLevels());
    setCompletedLevelsState(getCompletedLevels());
  }, []);

  // ============================================
  // MULAI LEVEL
  // ============================================
  const startLevel = useCallback((level: number) => {
    playSparkleSound();
    setCurrentLevel(level);
    setSoalList(getSoalForLevel(level));
    setQuestionIndex(0);
    setCorrectCount(0);
    setCheckingAnswer(null);
    setTimeLeft(TIMER_DURATION);
    setScreen("play");
  }, []);

  // ============================================
  // TIMER EFFECT
  // ============================================
  useEffect(() => {
    if (screen !== "play") return;
    if (checkingAnswer !== null) return; // pause timer pas lagi cek jawaban

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const t = setTimeout(() => {
      setTimeLeft((t) => Math.max(0, t - 0.1));
    }, 100);

    return () => clearTimeout(t);
  }, [timeLeft, screen, checkingAnswer]);

  // ============================================
  // TIMEOUT HANDLER
  // ============================================
  const handleTimeout = () => {
    setCheckingAnswer("timeout");
    playSparkleSound();
    // Auto next setelah 1.5 detik
    setTimeout(() => moveToNext(), 1500);
  };

  // ============================================
  // JAWABAN HANDLER
  // ============================================
  const handleAnswer = (selectedIdx: number) => {
    if (checkingAnswer !== null) return;
    const currentQ = soalList[questionIndex];
    const isCorrect = selectedIdx === currentQ.answer;

    setCheckingAnswer(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      playWinSound();
    } else {
      playSparkleSound();
    }

    setTimeout(() => moveToNext(), 1200);
  };

  // ============================================
  // NEXT QUESTION / FINISH
  // ============================================
  const moveToNext = () => {
    if (questionIndex + 1 < SOAL_PER_LEVEL) {
      setQuestionIndex((i) => i + 1);
      setCheckingAnswer(null);
      setTimeLeft(TIMER_DURATION);
    } else {
      finishLevel();
    }
  };

  // ============================================
  // FINISH LEVEL
  // ============================================
  const finishLevel = () => {
    markLevelCompleted(currentLevel);
    unlockNextLevel(currentLevel + 1);

    // Update local state
    setUnlockedLevelsState(getUnlockedLevels());
    setCompletedLevelsState(getCompletedLevels());

    // Reward callback ke parent
    onLevelComplete(currentLevel, correctCount);

    // Confetti kalo lulus
    const passed = correctCount >= Math.ceil(SOAL_PER_LEVEL * 0.6);
    if (passed) {
      fireConfetti(correctCount === SOAL_PER_LEVEL ? 80 : 40);
    }

    setScreen("result");
  };

  // ============================================
  // CONFETTI
  // ============================================
  const fireConfetti = (count: number) => {
    const colors = [
      "#FFD93D",
      "#2DD4BF",
      "#EC407A",
      "#1F6B3A",
      "#E67E22",
      "#5EEAD4",
      "#FF8A95",
    ];
    const pieces = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      bg: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      isCircle: Math.random() > 0.5,
    }));
    setConfettiPieces(pieces);

    // Cleanup
    setTimeout(() => setConfettiPieces([]), 4500);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      {/* ===== CONFETTI LAYER ===== */}
      <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
        {confettiPieces.map((p) => (
          <span
            key={p.id}
            className="absolute top-0 block"
            style={{
              left: `${p.left}%`,
              width: "10px",
              height: "14px",
              background: p.bg,
              borderRadius: p.isCircle ? "50%" : "0",
              animation: `confettiFall ${p.duration}s linear ${p.delay}s forwards`,
            }}
          />
        ))}
      </div>

      {/* ===== KEYFRAMES (inject sekali aja) ===== */}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* ===== BACKDROP ===== */}
      <div className="absolute inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {screen === "list" && (
            <LevelListView
              key="list"
              unlockedLevels={unlockedLevels}
              completedLevels={completedLevels}
              onSelectLevel={startLevel}
              onClose={onClose}
            />
          )}

          {screen === "play" && soalList.length > 0 && (
            <PlayView
              key={`play-${currentLevel}-${questionIndex}`}
              level={currentLevel}
              question={soalList[questionIndex]}
              questionIndex={questionIndex}
              totalQuestions={SOAL_PER_LEVEL}
              timeLeft={timeLeft}
              checkingAnswer={checkingAnswer}
              onAnswer={handleAnswer}
              onClose={onClose}
            />
          )}

          {screen === "result" && (
            <ResultView
              key="result"
              level={currentLevel}
              correctCount={correctCount}
              totalQuestions={SOAL_PER_LEVEL}
              hasNext={unlockedLevels.includes(currentLevel + 1)}
              onNext={() => startLevel(currentLevel + 1)}
              onBackToList={() => setScreen("list")}
              onClose={onClose}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ============================================
// VIEW 1: LEVEL LIST
// ============================================
interface LevelListViewProps {
  unlockedLevels: number[];
  completedLevels: number[];
  onSelectLevel: (level: number) => void;
  onClose: () => void;
}

function LevelListView({
  unlockedLevels,
  completedLevels,
  onSelectLevel,
  onClose,
}: LevelListViewProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-white rounded-3xl border-4 border-cyan-400 shadow-2xl w-full max-w-sm max-h-[85vh] flex flex-col font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-slate-100">
        <div>
          <h3 className="text-base font-black text-emerald-900">📍 Titik Cek Trivia</h3>
          <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">
            Kuis Rahasia Zain
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Summary */}
      <div className="flex justify-around py-3 px-4 border-b border-slate-100 bg-slate-50">
        <div className="text-center">
          <div className="text-lg font-black text-emerald-700">{TOTAL_LEVELS}</div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wider">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-black text-emerald-700">{unlockedLevels.length}</div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wider">Terbuka</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-black text-emerald-700">{completedLevels.length}</div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wider">Selesai</div>
        </div>
      </div>

      {/* Level List (scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map((lvl) => {
          const isUnlocked = unlockedLevels.includes(lvl);
          const isCompleted = completedLevels.includes(lvl);
          return (
            <button
              key={lvl}
              disabled={!isUnlocked}
              onClick={() => onSelectLevel(lvl)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition ${
                isCompleted
                  ? "bg-emerald-50 border-emerald-300"
                  : isUnlocked
                    ? "bg-white border-slate-200 hover:border-cyan-300 active:scale-[0.98]"
                    : "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  isCompleted
                    ? "bg-emerald-200"
                    : isUnlocked
                      ? "bg-amber-100"
                      : "bg-slate-200"
                }`}
              >
                {!isUnlocked ? "🔒" : isCompleted ? "🏆" : "🎯"}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-extrabold text-slate-800">
                  Tantangan Titik Cek {lvl}
                </h4>
                <p className="text-[10px] text-slate-500 font-semibold">
                  {SOAL_PER_LEVEL} soal •{" "}
                  {!isUnlocked ? "Terkunci" : isCompleted ? "Selesai ✓" : "Mulai"}
                </p>
              </div>
              <div className="shrink-0">
                {!isUnlocked ? (
                  <Lock className="w-4 h-4 text-slate-400" />
                ) : isCompleted ? (
                  <Check className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Play className="w-4 h-4 text-cyan-600 fill-current" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================
// VIEW 2: PLAY (soal per soal)
// ============================================
interface PlayViewProps {
  level: number;
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  checkingAnswer: null | "correct" | "wrong" | "timeout";
  onAnswer: (idx: number) => void;
  onClose: () => void;
}

function PlayView({
  level,
  question,
  questionIndex,
  totalQuestions,
  timeLeft,
  checkingAnswer,
  onAnswer,
  onClose,
}: PlayViewProps) {
  // Timer visual
  const percent = (timeLeft / TIMER_DURATION) * 100;
  const timerColor =
    timeLeft <= 3
      ? "bg-red-500"
      : timeLeft <= 5
        ? "bg-amber-500"
        : "bg-gradient-to-r from-cyan-400 to-emerald-400";
  const textColor =
    timeLeft <= 3 ? "text-red-600" : timeLeft <= 5 ? "text-amber-600" : "text-cyan-700";

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-white rounded-[28px] border-4 border-cyan-400 shadow-2xl p-5 w-full max-w-sm text-center relative font-sans"
    >
      <button
        onClick={onClose}
        className="absolute right-3 top-3 p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="text-3xl mt-2 mb-1">💎📖✨</div>

      <h4 className="font-extrabold text-[#00838F] text-xs uppercase tracking-widest leading-none mb-3">
        Tantangan Titik Cek {level}
      </h4>

      {/* TIMER BAR */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${timerColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className={`text-xs font-black min-w-[28px] text-right ${textColor}`}>
          {Math.ceil(timeLeft)}
        </span>
      </div>

      {/* PROGRESS DOTS */}
      <div className="flex justify-center gap-1.5 mb-3">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i < questionIndex
                ? "bg-emerald-500"
                : i === questionIndex
                  ? "bg-cyan-500 scale-125"
                  : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <p className="text-[12px] font-bold text-slate-800 leading-relaxed mb-4 px-1 min-h-[50px]">
        {question.q}
      </p>

      {checkingAnswer === null ? (
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              className="w-full p-3 text-center text-xs font-bold bg-slate-50 hover:bg-cyan-50 border-2 border-slate-200 hover:border-cyan-300 rounded-2xl transition active:scale-95 text-slate-700"
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <AnswerFeedback
          state={checkingAnswer}
          correctAnswer={question.options[question.answer]}
        />
      )}

      <p className="text-[8px] text-slate-400 font-semibold uppercase tracking-widest mt-3">
        Kuis Rahasia Titik Cek Noor Al-Quran
      </p>
    </motion.div>
  );
}

// ============================================
// FEEDBACK (bener/salah/timeout)
// ============================================
function AnswerFeedback({
  state,
  correctAnswer,
}: {
  state: "correct" | "wrong" | "timeout";
  correctAnswer: string;
}) {
  if (state === "correct") {
    return (
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-2xl p-4 space-y-1"
      >
        <h4 className="font-extrabold text-sm">🎉 BENAR! HEBAT!</h4>
        <p className="text-[10px] text-emerald-800 font-semibold">+10 Koin & +15 XP</p>
      </motion.div>
    );
  }
  if (state === "wrong") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-3 space-y-2">
        <p className="text-xs text-red-700 font-bold">🥺 Belum tepat!</p>
        <p className="text-[10px] text-slate-600">Jawaban: {correctAnswer}</p>
      </div>
    );
  }
  // timeout
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 space-y-2">
      <p className="text-xs text-amber-700 font-bold">⏰ Waktu habis!</p>
      <p className="text-[10px] text-slate-600">Jawaban: {correctAnswer}</p>
    </div>
  );
}

// ============================================
// VIEW 3: RESULT
// ============================================
interface ResultViewProps {
  level: number;
  correctCount: number;
  totalQuestions: number;
  hasNext: boolean;
  onNext: () => void;
  onBackToList: () => void;
  onClose: () => void;
}

function ResultView({
  level,
  correctCount,
  totalQuestions,
  hasNext,
  onNext,
  onBackToList,
  onClose,
}: ResultViewProps) {
  const perfect = correctCount === totalQuestions;
  const passed = correctCount >= Math.ceil(totalQuestions * 0.6);
  const emoji = perfect ? "🏆" : passed ? "🎉" : "😅";
  const title = perfect ? "SEMPURNA!" : passed ? "Lulus Level!" : "Coba Lagi Ya!";
  const stars = "⭐".repeat(correctCount) + "☆".repeat(totalQuestions - correctCount);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-3xl border-4 border-cyan-400 shadow-2xl p-6 w-full max-w-sm text-center font-sans"
    >
      <div className="text-6xl mb-3 animate-bounce">{emoji}</div>
      <h3 className="text-xl font-black text-emerald-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 mb-1">
        Skor: <strong className="text-emerald-700 text-lg">{correctCount}/{totalQuestions}</strong>
      </p>
      <p className="text-lg mb-5">{stars}</p>

      <div className="space-y-2">
        {passed && hasNext && (
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            Lanjut Level {level + 1}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onBackToList}
          className="w-full bg-white border-2 border-cyan-400 text-cyan-700 font-black py-3 rounded-2xl active:scale-95 flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Pilih Level Lain
        </button>
        <button
          onClick={onClose}
          className="w-full text-slate-500 text-xs font-bold py-2"
        >
          Tutup
        </button>
      </div>
    </motion.div>
  );
}
