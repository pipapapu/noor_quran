import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, MessageCircle, HelpCircle, User, Award, ArrowLeft } from "lucide-react";

interface ZainBuddyProps {
  onClose?: () => void;
  onAddCoins: (amount: number) => void;
  onAddXp: (amount: number) => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
}

const SUGGESTED_BUBBLES = [
  { text: "Zain, ceritakan kisah Gajah Ababil dong! 🐘", label: "Kisah Al-Fil" },
  { text: "Berikan aku teka-teki Tajwid yang seru! ✨", label: "Teka-teki Tajwid" },
  { text: "Kenapa kita tidak boleh membazir waktu? ⏰", label: "Pesan Al-Asr" },
  { text: "Sebutkan huruf-huruf Qalqalah mental! ⚽", label: "Huruf Qalqalah" }
];

export default function ZainBuddy({ onClose, onAddCoins, onAddXp }: ZainBuddyProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "model",
      text: "Assalamu'alaikum Sobat Cilik! Aku Zain, teman ngajimu yang siap nemenin kamu jelajah Al-Quran! Kamu mau tanya atau bercerita apa hari ini? 🌟📖"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = { id: userMsgId, role: "user", text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Update simple history
    const updatedHistory = [...chatHistory, { role: "user", text: textToSend }];
    setChatHistory(updatedHistory);

    try {
      const response = await fetch("/api/gemini/buddy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: chatHistory
        })
      });

      const data = await response.json();
      if (data.success || data.text) {
        const modelMsgId = `model-${Date.now()}`;
        setMessages(prev => [...prev, { id: modelMsgId, role: "model", text: data.text }]);
        setChatHistory(prev => [...prev, { role: "model", text: data.text }]);
        
        // Give small reward on first chats!
        if (messages.length < 5) {
          onAddCoins(5);
          onAddXp(10);
        }
      }
    } catch (e) {
      console.error(e);
      // Fallback
      const fallbackMsgs = [
        "Wah kereeen! Aku denger Al-Quran dibaca bikin tenang lho. Terus semangat ya! ✨",
        "Subhanallah, kamu pinter bener deh! Nanti kalau udah besar moga jadi Hafiz sejati! 👑🕌"
      ];
      const selectedFallback = fallbackMsgs[Math.floor(Math.random() * fallbackMsgs.length)];
      setMessages(prev => [...prev, { id: `fb-${Date.now()}`, role: "model", text: selectedFallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#E3F2FD] to-[#FFF3E0] relative">
      {/* Buddy Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-4 shadow-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {onClose && (
            <button id="buddy-back-btn" onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div className="relative">
            <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-amber-200">
              <img
                src="/zain-avatar.jpg"
                alt="Zain Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">Zain (Teman Mengaji AI)</h3>
            <span className="text-[10px] text-teal-100 flex items-center gap-0.5 font-medium">
              <Sparkles className="w-2.5 h-2.5 text-yellow-300" /> Sedang aktif belajar
            </span>
          </div>
        </div>
        <div className="bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-1">
          <span className="text-yellow-300 text-sm">⭐</span>
          <span className="text-[11px] font-bold">Sahabat AI</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {msg.role === "model" ? (
              <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-100 shrink-0 border border-teal-200">
                <img
                  src="/zain-avatar.jpg"
                  alt="Zain"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 text-white">
                <User className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm relative ${
                msg.role === "user"
                  ? "bg-emerald-500 text-white rounded-tr-none"
                  : "bg-white text-slate-800 rounded-tl-none border border-amber-100"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 max-w-[80%]"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-100 shrink-0 border border-teal-200">
              <img
                src="/zain-avatar.jpg"
                alt="Zain"
                className="w-full h-full object-cover font-mono"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-none border border-amber-100 shadow-sm text-xs text-slate-400 flex items-center gap-1 font-medium">
              <span className="animate-bounce inline-block">●</span>
              <span className="animate-bounce delay-75 inline-block">●</span>
              <span className="animate-bounce delay-150 inline-block">●</span>
              <span className="text-[10px] ml-1">Zain sedang berpikir...</span>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggetion Bubbles */}
      <div className="px-4 py-2 bg-white/40 border-t border-slate-100 flex gap-2 overflow-x-auto shrink-0 select-none scrollbar-none">
        {SUGGESTED_BUBBLES.map((bubble, idx) => (
          <button
            key={idx}
            id={`buddy-suggestion-${idx}`}
            onClick={() => handleSendMessage(bubble.text)}
            className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 text-[10px] font-semibold rounded-full border border-sky-200 transition shrink-0 whitespace-nowrap active:scale-95"
          >
            {bubble.label}
          </button>
        ))}
      </div>

      {/* Input Tray */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
        <input
          id="buddy-chat-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage(inputValue);
          }}
          placeholder="Tanya Zain tentang surah atau tajwid..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-teal-400 focus:bg-white transition"
        />
        <button
          id="buddy-send-btn"
          onClick={() => handleSendMessage(inputValue)}
          disabled={!inputValue.trim() || isLoading}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-md hover:brightness-105 active:scale-95 transition disabled:opacity-50 disabled:scale-100"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
