'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTransactions } from '@/lib/hooks/useTransactions';

export default function ScanPage() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);
    setIsEditing(false);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Simulasi proses scan AI untuk MVP (karena belum ada API key)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockResult = {
        merchant: 'Kopi Kenangan',
        address: 'Cabang Sudirman, Jakarta',
        date: new Date().toLocaleDateString('id-ID'),
        items: [
          { name: 'Kopi Kenangan Mantan', qty: 2, price: 'Rp 36.000' },
          { name: 'Roti Daging Asap', qty: 1, price: 'Rp 14.000' }
        ],
        total: 'Rp 50.000'
      };
      
      setResult(mockResult);
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveAndSplit = () => {
    if (result) {
      // 1. Simpan ke Buku Kas
      const totalNum = parseInt(String(result.total).replace(/\D/g, '')) || 0;
      addTransaction({
        name: `Belanja ${result.merchant}`,
        amount: totalNum,
        type: 'pengeluaran',
        category: 'Belanja',
        syariahLabel: 'Semua'
      });

      // 2. Simpan data sementara ke localStorage agar bisa dibaca halaman split
      localStorage.setItem('split_data', JSON.stringify({
        merchant: result.merchant,
        total: result.total,
        items: result.items
      }));
      router.push('/split');
    }
  };

  return (
    <div className="page active" id="page-scan">
      <div className="page-title">Scan Struk AI Vision</div>
      <div className="page-sub">Foto struk → Gemini AI baca &amp; ekstraksi otomatis</div>

      <div className="g2">
        <div>
          {!loading && !result && (
            <>
              <div className="card" style={{ marginBottom: '14px', cursor: 'pointer' }} id="upload-card" onClick={handleBoxClick}>
                <div className="card-title">Upload / Foto Struk</div>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,application/pdf" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileUpload} 
                />
                <div className="scan-drop">
                  <div className="scan-drop-icon">📸</div>
                  <div className="scan-drop-title">Foto atau upload struk belanja</div>
                  <div className="scan-drop-sub">JPG, PNG, PDF · Klik atau seret ke sini</div>
                  <div style={{ marginTop: '16px' }}><span className="badge badge-purple" style={{ fontSize: '11px', padding: '5px 14px' }}>Gemini AI Vision ✨</span></div>
                </div>
              </div>

              <div className="card">
                <div className="card-title">Alur Scan AI</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--text2)' }}><span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--pink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>1</span>Upload foto struk (JPG/PNG/PDF)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--text2)' }}><span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>2</span>Gemini Vision API analisis gambar (server-side)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--text2)' }}><span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>3</span>Ekstraksi: nama toko, item, harga, total</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--text2)' }}><span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>4</span>Simpan ke Supabase, dashboard update real-time</div>
                </div>
                <div style={{ marginTop: '14px' }}>
                  <button className="btn" style={{ width: '100%', justifyContent: 'center' }} onClick={handleBoxClick}>🔄 Coba Demo Scan</button>
                </div>
              </div>
            </>
          )}

          {/* Loading */}
          {loading && (
            <div id="scan-loading" className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <div style={{ fontSize: '48px', marginBottom: '14px', animation: 'pulse 1.4s infinite' }}>🔍</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '15px', fontWeight: 700, marginBottom: '5px' }}>Gemini AI membaca struk...</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px' }}>Menganalisis teks, item, dan harga</div>
              <div className="scan-pb" style={{ width: '100%' }}><div id="scan-prog" style={{ width: '75%', background: 'linear-gradient(90deg,var(--pink),var(--blue))', height: '100%', borderRadius: '2px', transition: 'width 0.2s' }}></div></div>
            </div>
          )}
        </div>

        <div>
          {/* Placeholder */}
          {!loading && !result && (
            <div className="card" id="scan-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', textAlign: 'center' }}>
              <div style={{ fontSize: '52px', marginBottom: '14px', opacity: .2 }}>🧾</div>
              <div style={{ fontSize: '13.5px', color: 'var(--muted)', fontWeight: 500 }}>Hasil scan akan muncul di sini</div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="card" id="scan-result" style={{ display: 'block' }}>
              <div className="card-title">Hasil Ekstraksi AI <span className="badge badge-green">✓ Berhasil</span></div>
              
              {!isEditing ? (
                <>
                  <div style={{ background: 'linear-gradient(135deg,var(--pink-dim),var(--blue-dim))', borderRadius: 'var(--r-sm)', padding: '11px', marginBottom: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--muted2)', border: '1px solid var(--border2)' }}>
                    🛒 <strong style={{ color: 'var(--text)' }}>{result.merchant}</strong> — {result.address}<br />
                    <span style={{ color: 'var(--muted)' }}>{result.date}</span>
                  </div>
                  
                  {result.items.map((item: any, idx: number) => (
                    <div className="receipt-row" key={idx}>
                      <span style={{ fontSize: '17px' }}>✨</span>
                      <span className="rr-name">{item.name}</span>
                      <span style={{ fontSize: '10px', color: 'var(--muted)', marginRight: '8px' }}>×{item.qty}</span>
                      <span className="rr-price">{item.price}</span>
                    </div>
                  ))}
                  
                  <div style={{ borderTop: '1.5px solid var(--border)', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)' }}>Total Struk</div>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '19px', fontWeight: 700, color: 'var(--pink)' }}>{result.total}</div>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                  <input className="form-input" value={result.merchant} onChange={e => setResult({...result, merchant: e.target.value})} placeholder="Nama Toko" />
                  <input className="form-input" value={result.total} onChange={e => setResult({...result, total: e.target.value})} placeholder="Total (Rp)" />
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Item dapat diedit manual saat Split Bill nanti.</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn" style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Selesai Edit' : 'Edit Item'}
                </button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }} onClick={handleSaveAndSplit}>
                  Simpan + Split →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
