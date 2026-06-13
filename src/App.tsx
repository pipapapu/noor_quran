import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Mic, BookOpen, Star, User, MessageCircle, X, Sparkles } from "lucide-react";

// Bezel frames and subcomponents
import MobileFrame from "./components/MobileFrame";
import MapJourney from "./components/MapJourney";
import SurahAdventure from "./components/SurahAdventure";
import TajwidStars from "./components/TajwidStars";
import HafizHero from "./components/HafizHero";
import ReadingPractice from "./components/ReadingPractice";
import ProfileView from "./components/ProfileView";
import PelajaranMenu from "./components/PelajaranMenu";

import { ActivePlayer, SURAH_DATA, BAD_LIST, Verse } from "./types";

const INITIAL_PLAYER: ActivePlayer = {
  name: "Zain",
  avatar: "zain",
  level: 4,
  xp: 450,
  coins: 120,
  streak: 5,
  unlockedSurahs: ["fatihah", "ikhlas"],
  solvedQuizzes: [],
  badges: []
};

export default function App() {
  const [player, setPlayer] = useState<ActivePlayer>(INITIAL_PLAYER);
  const [activeTab, setActiveTab] = useState<"home" | "membaca" | "pelajaran" | "permainan" | "profil">("home");
  const [activeModule, setActiveModule] = useState<"surah" | "tajwid" | "hafalan" | "reading" | null>(null);
  const [activeVerseForReading, setActiveVerseForReading] = useState<Verse | null>(null);
  const [activeSurahForReading, setActiveSurahForReading] = useState<string>("");
  

  // Sync state with localStorage if available for perfect persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem("noor_al_quran_player");
      if (saved) {
        setPlayer(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("localStorage not allowed or accessible in current iframe session.");
    }
  }, []);

  const savePlayerState = (updatedPlayer: ActivePlayer) => {
    setPlayer(updatedPlayer);
    try {
      localStorage.setItem("noor_al_quran_player", JSON.stringify(updatedPlayer));
    } catch (e) {}
  };

  // State modifiers
  const handleAddCoins = (amount: number) => {
    const updated = { ...player, coins: player.coins + amount };
    savePlayerState(updated);
  };

  const handleAddXp = (amount: number) => {
    const totalNewXp = player.xp + amount;
    // Simple levelling logic
    const nextLevel = Math.floor(totalNewXp / 150) + 1;
    const updated = {
      ...player,
      xp: totalNewXp,
      level: nextLevel > player.level ? nextLevel : player.level
    };
    savePlayerState(updated);
  };

  const handleUnlockBadge = (badgeId: string) => {
    const badgeConfig = BAD_LIST.find(b => b.id === badgeId);
    if (!badgeConfig) return;

    // Check if ready unlocked
    if (player.badges.some(b => b.id === badgeId)) return;

    const newBadge = {
      ...badgeConfig,
      unlockedAt: new Date().toLocaleDateString("id-ID")
    };

    const updated = {
      ...player,
      badges: [...player.badges, newBadge]
    };
    savePlayerState(updated);
  };

  const handleUpdateAvatar = (avatarId: string, name: string) => {
    const updated = { ...player, avatar: avatarId, name };
    savePlayerState(updated);
  };

  const handleResetStats = () => {
    savePlayerState(INITIAL_PLAYER);
    setActiveTab("home");
    setActiveModule(null);
  };

  // Direct redirection shortcuts from tabs
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setActiveModule(null); // Return from expanding full components on tab change
  };

  // Redirect to voice reading room
  const handleOpenReadingPractice = (verse: Verse, surahName: string) => {
    setActiveVerseForReading(verse);
    setActiveSurahForReading(surahName);
    setActiveModule("reading");
  };

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col h-full bg-[#E8F5E9] overflow-hidden select-none relative font-sans leading-relaxed">
        
        {/* Main Workspace Frame */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* Submodules active check */}
          {activeModule === "surah" ? (
            <SurahAdventure
              onBack={() => setActiveModule(null)}
              onAddCoins={handleAddCoins}
              onAddXp={handleAddXp}
              onExploreReading={handleOpenReadingPractice}
            />
          ) : activeModule === "tajwid" ? (
            <TajwidStars
              onBack={() => setActiveModule(null)}
              onAddCoins={handleAddCoins}
              onAddXp={handleAddXp}
              onUnlockBadge={handleUnlockBadge}
            />
          ) : activeModule === "hafalan" ? (
            <HafizHero
              onBack={() => setActiveModule(null)}
              onAddCoins={handleAddCoins}
              onAddXp={handleAddXp}
              onUnlockBadge={handleUnlockBadge}
            />
          ) : activeModule === "reading" && activeVerseForReading ? (
            <ReadingPractice
              verse={activeVerseForReading}
              surahName={activeSurahForReading}
              onBack={() => setActiveModule(null)}
              onAddCoins={handleAddCoins}
              onAddXp={handleAddXp}
            />
          ) : (
            // Tabs views fallback
            <div className="h-full">
              {activeTab === "home" && (
                <MapJourney
                  player={player}
                  onNavigateTab={handleTabChange}
                  onStartSurah={() => setActiveModule("surah")}
                  onStartTajwid={() => setActiveModule("tajwid")}
                  onStartHafiz={() => setActiveModule("hafalan")}
                  onStartDailyAsr={() => {
                    // pre-select Al-Asr for memorization
                    setActiveModule("hafalan");
                    handleUnlockBadge("daily_hero");
                  }}
                  onAddCoins={handleAddCoins}
                  onAddXp={handleAddXp}
                />
              )}

              {activeTab === "membaca" && (
                <ReadingPractice
                  verse={SURAH_DATA[0].verses[0]} // defaults to Al-Fatiha first verse as entry check
                  surahName="Al-Fatihah"
                  onBack={() => handleTabChange("home")}
                  onAddCoins={handleAddCoins}
                  onAddXp={handleAddXp}
                />
              )}

              {activeTab === "pelajaran" && (
                <PelajaranMenu
                  onBack={() => handleTabChange("home")}
                  onAddCoins={handleAddCoins}
                  onAddXp={handleAddXp}
                />
              )}

              {activeTab === "permainan" && (
                <HafizHero
                  onBack={() => handleTabChange("home")}
                  onAddCoins={handleAddCoins}
                  onAddXp={handleAddXp}
                  onUnlockBadge={handleUnlockBadge}
                />
              )}

              {activeTab === "profil" && (
                <ProfileView
                  player={player}
                  onUpdateAvatar={handleUpdateAvatar}
                  onResetStats={handleResetStats}
                />
              )}
            </div>
          )}

        </div>

        {/* 5. Bottom Navigation Bar Menu (Exact design to screenshot layout) */}
        {!activeModule && (
          <div className="bg-[#EFFFEC] border-t border-green-100 px-4 py-3 pb-4.5 flex justify-between items-center text-center shrink-0 z-20 select-none shadow-inner border-b-0 leading-none">
            
            {/* Nav button 1 : Beranda */}
            <button
              id="nav-tab-home"
              onClick={() => handleTabChange("home")}
              className={`flex-1 flex flex-col items-center gap-1 focus:outline-none transition active:scale-95 duration-100 ${
                activeTab === "home" ? "text-emerald-700 bg-white/40 py-1.5 rounded-2xl" : "text-slate-400 hover:text-slate-500"
              }`}
            >
              <Home className="w-5 h-5 fill-current opacity-90" />
              <span className="text-[9px] font-black tracking-wide">Beranda</span>
            </button>

            {/* Nav button 2 : Membaca */}
            <button
              id="nav-tab-membaca"
              onClick={() => handleTabChange("membaca")}
              className={`flex-1 flex flex-col items-center gap-1 focus:outline-none transition active:scale-95 duration-100 ${
                activeTab === "membaca" ? "text-emerald-700 bg-white/40 py-1.5 rounded-2xl" : "text-slate-400 hover:text-slate-500"
              }`}
            >
              <Mic className="w-5 h-5 opacity-90" />
              <span className="text-[9px] font-black tracking-wide">Membaca</span>
            </button>

            {/* Nav button 3 : Pelajaran */}
            <button
              id="nav-tab-pelajaran"
              onClick={() => handleTabChange("pelajaran")}
              className={`flex-1 flex flex-col items-center gap-1 focus:outline-none transition active:scale-95 duration-100 ${
                activeTab === "pelajaran" ? "text-emerald-700 bg-white/40 py-1.5 rounded-2xl" : "text-slate-400 hover:text-slate-500"
              }`}
            >
              <BookOpen className="w-5 h-5 opacity-90" />
              <span className="text-[9px] font-black tracking-wide">Pelajaran</span>
            </button>

            {/* Nav button 4 : Permainan */}
            <button
              id="nav-tab-permainan"
              onClick={() => handleTabChange("permainan")}
              className={`flex-1 flex flex-col items-center gap-1 focus:outline-none transition active:scale-95 duration-100 ${
                activeTab === "permainan" ? "text-emerald-700 bg-white/40 py-1.5 rounded-2xl" : "text-slate-400 hover:text-slate-500"
              }`}
            >
              <Star className="w-5 h-5 fill-current opacity-90" />
              <span className="text-[9px] font-black tracking-wide">Permainan</span>
            </button>

            {/* Nav button 5 : Profil */}
            <button
              id="nav-tab-profil"
              onClick={() => handleTabChange("profil")}
              className={`flex-1 flex flex-col items-center gap-1 focus:outline-none transition active:scale-95 duration-100 ${
                activeTab === "profil" ? "text-emerald-700 bg-white/40 py-1.5 rounded-2xl" : "text-slate-400 hover:text-slate-500"
              }`}
            >
              <User className="w-5 h-5 fill-current opacity-90 animate-pulse" />
              <span className="text-[9px] font-black tracking-wide">Profil</span>
            </button>

          </div>
        )}


      </div>
    </MobileFrame>
  );
}
