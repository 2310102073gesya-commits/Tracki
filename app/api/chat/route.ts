import { NextRequest, NextResponse } from 'next/server';
import { getVisionModel } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const { history, message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    const model = getVisionModel(); // Menggunakan gemini-1.5-flash

    const systemPrompt = `
      Anda adalah "Tracki AI", asisten keuangan syariah dan personal finance advisor yang ramah, pintar, dan asyik diajak ngobrol.
      Anda membantu pengguna aplikasi Tracki (aplikasi pencatat keuangan).
      
      Aturan Anda:
      1. Sapa dengan ramah (kadang boleh pakai Assalamu'alaikum).
      2. Berikan saran keuangan yang realistis, praktis, dan sesuai dengan prinsip syariah (hindari riba, sarankan sedekah/zakat).
      3. Jika ditanya tentang target menabung, berikan rincian hitungan kasarnya.
      4. Jangan pernah menjawab dengan kode pemrograman atau hal yang tidak terkait keuangan/teknologi dasar.
      5. Jawab dengan bahasa Indonesia yang santai tapi profesional (seperti gaya startup lokal). Gunakan emoji yang pas.
      6. Jaga jawaban agar tidak terlalu panjang, maksimal 2-3 paragraf singkat saja agar mudah dibaca di layar HP.
    `;

    // Membentuk history untuk format Gemini
    const formattedHistory = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Baik, saya mengerti. Saya akan menjadi Tracki AI, asisten keuangan syariah yang ramah dan siap membantu.' }] },
    ];

    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        formattedHistory.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    try {
      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(message);
      const responseText = result.response.text();

      return NextResponse.json({ success: true, reply: responseText });
    } catch (aiError: any) {
      console.warn('Google AI Error:', aiError);
      
      // Fallback Darurat jika server Google Overload (503) atau error lainnya
      return NextResponse.json({ 
        success: true, 
        reply: "🙏 Mohon maaf kak, sistem mendeteksi error dari Google: " + (aiError.message || JSON.stringify(aiError))
      });
    }

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
