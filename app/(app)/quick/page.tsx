'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTransactions } from '@/lib/hooks/useTransactions';


export default function QuickInputPage() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const processText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      const resultData = await response.json();
      
      if (!response.ok) {
        throw new Error(resultData.error || 'Gagal memproses teks');
      }
      
      setResult(resultData.data);
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      addTransaction({
        name: result.name,
        amount: result.amount,
        type: result.type,
        category: result.category,
        syariahLabel: result.type === 'pengeluaran' ? '✓ Halal' : 'Semua'
      });
      
      // Reset form
      setText('');
      setResult(null);
      alert('Transaksi berhasil disimpan!');
      router.push('/transactions');
    }
  };

  return (
    <div className="page active" id="page-quick">
      <div className="page-title">Catat Cepat AI ⚡</div>
      <div className="page-sub">Ketik transaksi Anda, AI akan mencatat otomatis</div>

      <div className="g2">
        <div>
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="card-title">Input Transaksi</div>
            
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <textarea 
                className="form-input" 
                rows={4}
                placeholder="Contoh: Tadi beli nasi goreng sama es teh 25 ribu"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ resize: 'none', paddingRight: '50px' }}
                disabled={loading}
              />

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }} 
              onClick={processText}
              disabled={loading || !text.trim()}
            >
              {loading ? '🧠 AI Sedang Memproses...' : '✨ Proses dengan AI'}
            </button>
          </div>
        </div>

        <div>
          {/* Placeholder */}
          {!loading && !result && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px', textAlign: 'center' }}>
              <div style={{ fontSize: '52px', marginBottom: '14px', opacity: .2 }}>✨</div>
              <div style={{ fontSize: '13.5px', color: 'var(--muted)', fontWeight: 500 }}>Hasil ekstraksi AI akan muncul di sini</div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
              <div style={{ fontSize: '48px', marginBottom: '14px', animation: 'pulse 1.4s infinite' }}>🧠</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '15px', fontWeight: 700, marginBottom: '5px' }}>Memahami maksud Anda...</div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="card" style={{ display: 'block', border: '2px solid var(--blue)' }}>
              <div className="card-title">Konfirmasi Transaksi <span className="badge badge-green">✓ Siap</span></div>
              
              <div style={{ background: 'linear-gradient(135deg,var(--pink-dim),var(--blue-dim))', borderRadius: 'var(--r-sm)', padding: '15px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Nama Transaksi</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>{result.name}</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Kategori</div>
                    <div className="badge badge-blue">{result.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Jenis</div>
                    <div className={`badge ${result.type === 'pemasukan' ? 'badge-green' : 'badge-pink'}`}>
                      {result.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '12px', marginTop: '4px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Nominal</div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '24px', fontWeight: 700, color: result.type === 'pemasukan' ? 'var(--green)' : 'var(--pink)' }}>
                    Rp {result.amount.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave}>
                  💾 Simpan ke Buku Kas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
