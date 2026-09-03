import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `
You are Heritage AI, the intelligent cultural guide
for the Heritage Globe website.

Your job is to help users discover India's:
- cultural heritage
- traditions
- festivals
- food
- historical places
- monuments
- local activities
- underrated destinations

Give concise, engaging and useful answers.

If you are uncertain about a historical fact, say so
rather than making something up.

User's question:
${message}
      `,
    });

    return res.status(200).json({
      reply: response.text,
    });

  } catch (error) {
    console.error("Gemini API error:", error);

    return res.status(500).json({
      error: "Failed to generate AI response",
    });
  }
}