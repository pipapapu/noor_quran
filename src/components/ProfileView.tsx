import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Pencil, Award, RefreshCcw, ChevronLeft } from "lucide-react";
import { ActivePlayer, AVATARS, BAD_LIST } from "../types";

interface ProfileViewProps {
  player: ActivePlayer;
  onUpdateAvatar: (avatarId: string, name: string) => void;
  onResetStats: () => void;
}

export default function ProfileView({ player, onUpdateAvatar, onResetStats }: ProfileViewProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [nameDraft, setNameDraft] = useState(player.name);
  const [editingName, setEditingName] = useState(false);

  // Sync draft if player.name changes from outside
  React.useEffect(() => {
    if (!editingName) setNameDraft(player.name);
  }, [player.name, editingName]);

  const currentAvatarInfo =
    AVATARS.find((a) => a.id === player.avatar) || AVATARS[0];

  const handleSaveName = () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) return;
    onUpdateAvatar(player.avatar, trimmed); // reuse: keep avatar, update name
    setEditingName(false);
  };

  const handleClearName = () => {
    setNameDraft("");
  };

  const handlePickAvatar = (id: string) => {
    // keep current name, switch avatar
    onUpdateAvatar(id, player.name);
    setShowPicker(false);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto select-none font-sans">
      {/* ============= HEADER: AVATAR ============= */}
      <div className="flex flex-col items-center pt-6 pb-3 px-4">
        <button
          id="profile-avatar-trigger"
          onClick={() => setShowPicker(true)}
          className="relative active:scale-95 transition-transform"
          aria-label="Pilih avatar"
        >
          <div className="w-32 h-32 rounded-full border-[5px] border-amber-300 bg-amber-50 overflow-hidden shadow-md">
            <img
              src={currentAvatarInfo.img}
              alt={player.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-white border-[3px] border-amber-300 shadow flex items-center justify-center">
            <Pencil className="w-4 h-4 text-slate-800" strokeWidth={2.5} />
          </span>
        </button>
      </div>

      {/* ============= NAMA PROFIL ============= */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold text-slate-800 tracking-wider">
            NAMA PROFILMU:
          </span>
          <div className="flex items-center gap-1">
            <button
              id="save-name-btn"
              onClick={handleSaveName}
              disabled={!editingName || !nameDraft.trim()}
              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-emerald-600 disabled:opacity-30 transition"
              aria-label="Simpan nama"
            >
              <Check className="w-4 h-4" strokeWidth={3} />
            </button>
            <button
              id="clear-name-btn"
              onClick={() => {
                setNameDraft(player.name);
                setEditingName(false);
              }}
              disabled={!editingName}
              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-rose-500 disabled:opacity-30 transition"
              aria-label="Batal edit"
            >
              <X className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="bg-teal-400 rounded-full p-1 flex items-center">
          <input
            id="profile-name-input"
            type="text"
            value={nameDraft}
            onChange={(e) => {
              setNameDraft(e.target.value);
              setEditingName(true);
            }}
            onFocus={() => setEditingName(true)}
            placeholder="Nama mu"
            maxLength={20}
            className="flex-1 bg-transparent outline-none px-5 py-3 text-white text-lg font-semibold placeholder:text-white/70"
          />
          <div className="flex items-center gap-1 pr-2">
            <button
              id="name-clear-x"
              onClick={handleClearName}
              className="w-8 h-8 rounded-full bg-white/25 hover:bg-white/35 flex items-center justify-center text-white transition"
              aria-label="Hapus teks"
            >
              <X className="w-4 h-4" strokeWidth={3} />
            </button>
            <button
              id="name-edit-pencil"
              onClick={() => {
                const input = document.getElementById("profile-name-input");
                input?.focus();
              }}
              className="w-8 h-8 rounded-full bg-white/25 hover:bg-white/35 flex items-center justify-center text-white transition"
              aria-label="Edit nama"
            >
              <Pencil className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ============= MEDAL & BADGE ============= */}
      <div className="px-5 pb-6">
        <div className="flex items-center gap-1.5 mb-3">
          <Award className="w-4 h-4 text-amber-500" strokeWidth={2.5} />
          <span className="text-[11px] font-extrabold text-slate-800 tracking-wider">
            MEDAL &amp; BADGE KOLEKSIMU:
          </span>
        </div>

        <div className="space-y-3">
          {BAD_LIST.map((badgeItem) => {
            const isUnlocked = player.badges.some(
              (b) => b.id === badgeItem.id
            );
            return (
              <div
                key={badgeItem.id}
                id={`badge-row-${badgeItem.id}`}
                className={`relative bg-white rounded-2xl border-2 border-dashed p-4 flex items-center gap-3 ${
                  isUnlocked
                    ? "border-teal-300 bg-teal-50/30"
                    : "border-stone-200"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked
                      ? badgeItem.color
                      : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {isUnlocked ? badgeItem.icon : "🔒"}
                </div>
                <div className="flex-1 min-w-0 pr-20">
                  <h4
                    className={`text-sm font-extrabold ${
                      isUnlocked ? "text-slate-800" : "text-slate-500"
                    }`}
                  >
                    {badgeItem.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
                    {badgeItem.description}
                  </p>
                </div>
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-3 py-1 rounded-full ${
                    isUnlocked
                      ? "bg-teal-100 text-teal-700"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {isUnlocked ? "Terbuka" : "Terkunci"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============= RESET BUTTON ============= */}
      <div className="px-5 pb-32 pt-2">
        {showResetConfirm ? (
          <div className="bg-white border-2 border-red-200 rounded-3xl p-4 space-y-3 text-center shadow-sm">
            <p className="text-[10px] text-red-600 font-extrabold uppercase tracking-widest">
              RESET SELURUH SKOR &amp; KOIN?
            </p>
            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
              Apakah kamu yakin? Semua level, koin, XP, dan medal akan kembali
              ke nol.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                id="reset-stats-confirm-btn"
                onClick={() => {
                  onResetStats();
                  setShowResetConfirm(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full text-[10px] shadow-sm transition active:scale-95"
              >
                Ya, Reset
              </button>
              <button
                id="reset-stats-cancel-btn"
                onClick={() => setShowResetConfirm(false)}
                className="bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold px-4 py-2 rounded-full text-[10px] transition"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <button
            id="trigger-stats-reset"
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-white hover:bg-red-50 text-rose-500 hover:text-rose-600 border border-rose-200 font-bold py-3 rounded-2xl text-[10.5px] transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Data Mulai Dari Awal</span>
          </button>
        )}
      </div>

      {/* ============= AVATAR PICKER MODAL ============= */}
      <AnimatePresence>
        {showPicker && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPicker(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-5 pt-3 pb-8 max-w-md mx-auto"
            >
              <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mb-4" />
              <h3 className="text-center font-extrabold text-slate-800 mb-4 text-base">
                Pilih Avatar
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {AVATARS.map((av) => {
                  const isSelected = player.avatar === av.id;
                  return (
                    <button
                      key={av.id}
                      id={`avatar-pick-${av.id}`}
                      onClick={() => handlePickAvatar(av.id)}
                      className={`aspect-square rounded-full overflow-hidden border-[3px] bg-stone-50 active:scale-95 transition ${
                        isSelected
                          ? "border-teal-400"
                          : "border-transparent"
                      }`}
                      aria-label={av.name}
                    >
                      <img
                        src={av.img}
                        alt={av.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
