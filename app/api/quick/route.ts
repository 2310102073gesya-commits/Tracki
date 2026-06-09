import { NextRequest, NextResponse } from 'next/server';
import { getVisionModel } from '@/lib/ai/gemini'; // getVisionModel uses gemini-flash, good for text too

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    
    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Teks tidak boleh kosong' }, { status: 400 });
    }

    const model = getVisionModel();
    const prompt = `
      Anda adalah AI asisten pencatat keuangan (expense tracker) yang pintar. 
      Tugas Anda adalah mengekstrak informasi transaksi dari kalimat santai (natural language) ke dalam format JSON.
      
      Aturan ekstraksi:
      1. "name": Nama transaksi singkat dan jelas (string).
      2. "amount": Jumlah uang dalam bentuk angka integer positif (number). Jika ada kata "ribu", kalikan 1000. Contoh: "25 ribu" jadi 25000.
      3. "category": Pilih salah satu kategori paling cocok dari list ini: ["Belanja", "Makanan", "Transportasi", "Tagihan", "Hiburan", "Gaji", "Zakat", "Sedekah", "Lainnya"] (string).
      4. "type": Jika kalimatnya tentang mendapat uang/gaji/pemasukan, isikan "pemasukan". Jika tentang membeli/membayar/keluar uang, isikan "pengeluaran" (string).

      Contoh Input: "Tadi beli nasi padang 25 ribu pakai ayam"
      Output JSON:
      {
        "name": "Beli Nasi Padang",
        "amount": 25000,
        "category": "Makanan",
        "type": "pengeluaran"
      }

      Input pengguna: "${text}"
      
      Hanya kembalikan JSON valid, jangan tambah teks lain, backticks, atau markdown.
    `;

    const result = await model.generateContent([prompt]);
    const responseText = result.response.text();
    
    let parsedData = {};
    try {
      const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON from AI:", responseText);
      return NextResponse.json({ error: 'Gagal memahami teks. Coba gunakan kalimat yang lebih jelas.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.error('AI Quick Input Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
