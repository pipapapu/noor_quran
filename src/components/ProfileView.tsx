import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Shield, Award, Sparkles, Zap, Flame, Compass, RefreshCcw } from "lucide-react";
import { ActivePlayer, AVATARS, BAD_LIST, Badge } from "../types";

interface ProfileViewProps {
  player: ActivePlayer;
  onUpdateAvatar: (avatarId: string, name: string) => void;
  onResetStats: () => void;
}

export default function ProfileView({ player, onUpdateAvatar, onResetStats }: ProfileViewProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Find active avatar photo
  const currentAvatarInfo = AVATARS.find(a => a.id === player.avatar) || AVATARS[0];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#E0F7FA] to-[#FFF8E1] overflow-y-auto p-4 space-y-4">
      
      {/* Student Banner Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#80DEEA] shadow-sm relative overflow-hidden flex flex-col items-center select-none text-center">
        <div className="absolute right-0 top-0 w-24 h-24 bg-[#E0F7FA] rounded-full pointer-events-none -mr-8 -mt-8 opacity-80"></div>
        
        {/* Kid Portrait */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-amber-300 overflow-hidden bg-amber-50 shadow-md">
            <img
              src={currentAvatarInfo.img}
              alt={player.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-5 h-5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center text-xs">
            ✨
          </span>
        </div>

        <h3 className="font-bold text-base text-slate-800 tracking-wide mt-3">
          {player.name}
        </h3>
        <p className="text-[10px] bg-amber-100 text-amber-900 border border-amber-200 px-3 py-0.5 rounded-full font-bold uppercase tracking-wide mt-1 inline-block">
          {currentAvatarInfo.role}
        </p>

        {/* Dynamic score panels */}
        <div className="grid grid-cols-3 gap-2 w-full mt-5">
          <div className="bg-[#EFFFEC] border border-green-200 rounded-2xl p-2.5 flex flex-col items-center">
            <span className="text-lg">⭐</span>
            <span className="text-xs font-black text-slate-800 mt-0.5">{player.xp} XP</span>
            <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider">Skor</span>
          </div>

          <div className="bg-[#FFF3E0] border border-orange-200 rounded-2xl p-2.5 flex flex-col items-center">
            <span className="text-lg">🪙</span>
            <span className="text-xs font-black text-slate-800 mt-0.5">{player.coins} Koin</span>
            <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider">Emas</span>
          </div>

          <div className="bg-[#FFEBEE] border border-rose-200 rounded-2xl p-2.5 flex flex-col items-center">
            <span className="text-lg">🔥</span>
            <span className="text-xs font-black text-slate-800 mt-0.5">{player.streak} Hari</span>
            <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider">Streak</span>
          </div>
        </div>
      </div>

      {/* Choose Avatar Suite */}
      <div className="space-y-2 select-none">
        <span className="text-[10px] text-teal-900 font-extrabold uppercase tracking-widest pl-1">
          GANTI KARAKTER BELAJARMU:
        </span>
        <div className="grid grid-cols-4 gap-2">
          {AVATARS.map((av) => {
            const isSelected = player.avatar === av.id;
            return (
              <button
                key={av.id}
                id={`avatar-choice-${av.id}`}
                onClick={() => onUpdateAvatar(av.id, av.name)}
                className={`p-1.5 rounded-2xl border-2 bg-white flex flex-col items-center text-center gap-1 transition ${
                  isSelected 
                    ? "border-cyan-400 shadow-sm bg-cyan-50/20 active:scale-95" 
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-50 border border-slate-200 shadow-sm">
                  <img
                    src={av.img}
                    alt={av.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[9px] font-extrabold text-slate-700 truncate w-full">{av.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badge deck checklist */}
      <div className="space-y-2">
        <span className="text-[10px] text-teal-900 font-extrabold uppercase tracking-widest pl-1 flex items-center gap-1">
          <Award className="w-4 h-4 text-amber-500" /> MEDAL & BADGE KOLEKSIMU:
        </span>
        <div className="bg-white rounded-3xl p-4.5 border border-cyan-150 shadow-sm space-y-3">
          {BAD_LIST.map((badgeItem) => {
            const isUnlocked = player.badges.some(b => b.id === badgeItem.id);
            return (
              <div
                key={badgeItem.id}
                id={`badge-row-${badgeItem.id}`}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
                  isUnlocked
                    ? "bg-[#E0F2F1]/50 border-teal-200"
                    : "bg-slate-50/50 border-dashed border-slate-250 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-2xl shadow-sm ${
                    isUnlocked ? badgeItem.color : "bg-slate-200 text-slate-400"
                  }`}>
                    {isUnlocked ? badgeItem.icon : "🔒"}
                  </div>
                  <div>
                    <h4 className={`text-[11px] font-extrabold ${isUnlocked ? "text-teal-950" : "text-slate-500"}`}>
                      {badgeItem.name}
                    </h4>
                    <p className="text-[9px] text-slate-500 font-semibold">{badgeItem.description}</p>
                  </div>
                </div>

                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  isUnlocked ? "bg-teal-100 text-teal-800" : "bg-slate-200 text-slate-400"
                }`}>
                  {isUnlocked ? "Terbuka" : "Terkunci"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Settings Utilities */}
      <div className="pt-2 select-none">
        {showResetConfirm ? (
          <div className="bg-white border-2 border-red-200 rounded-3xl p-3.5 space-y-3 text-center">
            <p className="text-[10px] text-red-600 font-extrabold uppercase tracking-widest">
              RESET SELURUH SKOR & KOIN?
            </p>
            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
              Apakah kamu yakin? Proses ini akan menghapus semua level, koin, poin XP, dan medali kebesaran kamu kembali nol.
            </p>
            <div className="flex gap-2 justify-center leading-none">
              <button
                id="reset-stats-confirm-btn"
                onClick={() => {
                  onResetStats();
                  setShowResetConfirm(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-1.5 rounded-full text-[10px] shadow-sm transition active:scale-95"
              >
                Ya, Reset
              </button>
              <button
                id="reset-stats-cancel-btn"
                onClick={() => setShowResetConfirm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-1.5 rounded-full text-[10px] transition"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <button
            id="trigger-stats-reset"
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-white hover:bg-red-50 text-red-650 hover:text-red-700 border border-red-200/50 hover:border-red-200 font-bold py-2.5 rounded-2xl text-[10.5px] transition flex items-center justify-center gap-1 shadow-sm"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Data Mulai Dari Awal</span>
          </button>
        )}
      </div>

    </div>
  );
}
