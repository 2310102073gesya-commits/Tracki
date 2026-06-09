const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
  const systemPrompt = `Anda adalah "Tracki AI", asisten keuangan syariah.`;

  const formattedHistory = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Baik, saya mengerti.' }] },
  ];

  try {
    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage("p");
    console.log(result.response.text());
  } catch (e) {
    console.error("ERROR:", e);
  }
}

run();
