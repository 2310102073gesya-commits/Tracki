import { NextRequest, NextResponse } from 'next/server';
import { getVisionModel } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const mimeType = file.type;

    const model = getVisionModel();
    const prompt = `
      Anda adalah AI asisten keuangan syariah. Ekstrak informasi dari struk belanja ini dalam format JSON:
      {
        "merchant": "Nama Toko",
        "address": "Alamat Toko (jika ada)",
        "date": "Tanggal transaksi",
        "items": [{"name": "Nama Item", "qty": 1, "price": "Harga format string (Rp X.XXX)"}],
        "total": "Total harga (Rp X.XXX)"
      }
      Hanya kembalikan JSON valid, jangan tambah teks lain.
    `;

    const imageParts = [
      {
        inlineData: {
          data: base64Image,
          mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    let parsedData = {};
    try {
      const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON from AI:", responseText);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.error('AI Scan Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
