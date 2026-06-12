import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `Kamu adalah Zain, teman ngaji AI yang ramah dan sabar 
  untuk anak-anak belajar Al-Quran. Jawab dengan bahasa yang mudah dipahami 
  anak-anak, singkat, dan menyenangkan. Fokus pada topik Al-Quran, tajwid, 
  dan hafalan.`,
});

export async function chatWithZain(
  userMessage: string,
  history: { role: "user" | "model"; parts: string }[] = []
) {
  const chat = model.startChat({
    history: history.map((h) => ({
      role: h.role,
      parts: [{ text: h.parts }],
    })),
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}