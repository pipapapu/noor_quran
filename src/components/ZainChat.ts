import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send } from "lucide-react";
import { ActivePlayer } from "../types";

interface ZainChatProps {
  player: ActivePlayer;
  onBack: () => void;
}

type Message = {
  role: "user" | "model";
  text: string;
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function ZainChat({ player, onBack }: ZainChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMessages: Message[] = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Build history for Gemini
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{
                text: `Kamu adalah Zain, teman ngaji AI yang ramah, sabar, dan menyenangkan untuk anak-anak belajar Al-Quran. 
Nama anak yang kamu ajak bicara adalah ${player.name}, level ${player.level}.
Jawab dengan bahasa Indonesia yang mudah dipahami anak-anak, singkat (maksimal 3 kalimat), dan gunakan emoji yang sesuai.
Fokus hanya pada topik: Al-Quran, Tajwid, hafalan surah, doa harian, dan akhlak islami.
Kalau ditanya di luar topik itu, arahkan kembali dengan cara yang ramah.`
              }]
            },
            contents: [
              ...history,
              { role: "user", parts: [{ text: userText }] }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300,
            }
          }),
        }
      );

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Maaf, Zain lagi bingung. Coba tanya lagi ya! 🙏";

      setMessages([...newMessages, { role: "model", text: reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "model", text: "Maaf, koneksi Zain lagi gangguan. Coba lagi ya! 🙏" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-emerald-50">

      {/* Header */}
      <div className="bg-emerald-600 text-white px-4 py-3 flex items-center gap-3 shrink-0 shadow-md">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-emerald-700 transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <img
          src="/zain-avatar.jpg"
          alt="Zain"
          className="w-9 h-9 rounded-full border-2 border-white object-cover bg-amber-100"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <div>
          <p className="font-black text-sm leading-tight">Zain</p>
          <p className="text-[10px] opacity-80">Teman Ngaji AI ✨</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="text-center mt-6 space-y-2">
            <div className="text-5xl">👋</div>
            <p className="font-black text-emerald-800 text-sm">
              Assalamualaikum, {player.name}!
            </p>
            <p className="text-xs text-emerald-600 font-medium">
              Aku Zain, teman ngaji kamu 🕌<br />
              Tanya aku tentang Al-Quran, Tajwid, atau Hafalan ya!
            </p>
            {/* Quick question chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                "Apa itu Tajwid?",
                "Surah terpendek apa?",
                "Ajarkan doa makan",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="bg-white border border-emerald-300 text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-emerald-50 transition active:scale-95"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat bubbles */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "model" && (
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center mr-2 shrink-0 mt-1">
                Z
              </div>
            )}
            <div
              className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm
                ${msg.role === "user"
                  ? "bg-emerald-500 text-white rounded-br-none"
                  : "bg-white text-slate-800 border border-emerald-100 rounded-bl-none"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
              Z
            </div>
            <div className="bg-white border border-emerald-100 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-3 py-3 bg-white border-t border-emerald-100 flex gap-2 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Tanya Zain tentang Al-Quran..."
          className="flex-1 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 text-sm outline-none focus:border-emerald-400 transition"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow disabled:opacity-40 transition active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}