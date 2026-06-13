// ✅ Ganti URL ini dengan domain Railway kamu
const BASE_URL = import.meta.env.VITE_API_URL || "https://noorquran-production.up.railway.app";

export async function chatWithZain(
  userMessage: string,
  chatHistory: { role: "user" | "model"; text: string }[] = []
): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/gemini/buddy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage, chatHistory }),
  });

  if (!response.ok) {
    throw new Error(`Request gagal: ${response.status}`);
  }

  const data = await response.json();
  return data.text;
}

export async function explainSurah(surahName: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/gemini/explain-surah`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ surahName }),
  });

  const data = await response.json();
  return data.explanation;
}

export async function generateQuiz(category: string = "default"): Promise<any[]> {
  const response = await fetch(`${BASE_URL}/api/gemini/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category }),
  });

  const data = await response.json();
  return data.quiz;
}

export async function verifyReading(
  verseText: string,
  translation: string,
  textAttempt?: string
): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/gemini/read-verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verseText, translation, textAttempt }),
  });

  const data = await response.json();
  return data.evaluation;
}
