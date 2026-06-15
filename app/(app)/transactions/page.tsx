'use client';
import { useState } from 'react';
import { useTransactions, SyariahLabel } from '@/lib/hooks/useTransactions';

export default function TransactionsPage() {
  const { addTransaction, transactions, deleteTransaction, isLoaded } = useTransactions();
  const [jenis, setJenis] = useState<'pengeluaran' | 'pemasukan'>('pengeluaran');
  const [halal, setHalal] = useState<SyariahLabel>('✓ Halal');
  const [kategori, setKategori] = useState('Makan');
  const [nominalStr, setNominalStr] = useState('');
  const [description, setDescription] = useState('');
  const [filterMonth, setFilterMonth] = useState('Semua');

  const handleNominal = (e: any) => {
    const v = e.target.value.replace(/\D/g, '');
    if (v) {
      setNominalStr('Rp ' + Number.parseInt(v, 10).toLocaleString('id-ID'));
    } else {
      setNominalStr('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number.parseInt(nominalStr.replace(/\D/g, ''), 10);
    if (!amount || !description) {
      alert('Harap isi nominal dan keterangan');
      return;
    }

    addTransaction({
      name: description,
      amount,
      type: jenis,
      syariahLabel: halal,
      category: kategori
    });

    alert('Transaksi tersimpan! ✓');
    setNominalStr('');
    setDescription('');
  };

  if (!isLoaded) return null;

  return (
    <div className="page active" id="page-input">
      <div className="page-title">Buku Kas & Transaksi</div>
      <div className="page-sub">Catat pengeluaran atau pemasukan baru</div>

      <form onSubmit={handleSubmit} className="g2">
        <div>
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="card-title">Detail Transaksi</div>
            <div className="form-group">
              <span className="form-label">Jenis</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button"
                  className="btn" 
                  onClick={() => setJenis('pengeluaran')} 
                  style={{ flex: 1, justifyContent: 'center', ...(jenis === 'pengeluaran' ? { borderColor: 'var(--red)', background: 'var(--red-dim)', color: 'var(--red)' } : {}) }}
                >💸 Pengeluaran</button>
                <button 
                  type="button"
                  className="btn" 
                  onClick={() => setJenis('pemasukan')} 
                  style={{ flex: 1, justifyContent: 'center', ...(jenis === 'pemasukan' ? { borderColor: 'var(--green)', background: 'var(--green-dim)', color: 'var(--green)' } : {}) }}
                >💰 Pemasukan</button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="nominal" className="form-label">Nominal</label>
              <input id="nominal" required className="form-input" type="text" placeholder="Rp 0" value={nominalStr} onChange={handleNominal} />
            </div>
            <div className="form-group">
              <label htmlFor="keterangan" className="form-label">Keterangan</label>
              <input id="keterangan" required className="form-input" type="text" placeholder="Contoh: Makan siang warteg halal" value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            {jenis === 'pengeluaran' && (
              <div className="form-group">
                <span className="form-label">🌙 Status Syariah</span>
                <div className="halal-filter">
                  <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setHalal('✓ Halal'); }} className={`halal-btn ${halal === '✓ Halal' ? 'active-halal' : ''}`} onClick={() => setHalal('✓ Halal')}>✓ Halal</div>
                  <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setHalal('⚠️ Syubhat'); }} className={`halal-btn ${halal === '⚠️ Syubhat' ? 'active-syubhat' : ''}`} onClick={() => setHalal('⚠️ Syubhat')} style={halal === '⚠️ Syubhat' ? { borderColor: 'var(--gold)', background: 'var(--gold-dim)', color: 'var(--gold)', fontWeight: 700 } : {}}>⚠️ Syubhat</div>
                  <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setHalal('✗ Haram'); }} className={`halal-btn ${halal === '✗ Haram' ? 'active-haram' : ''}`} onClick={() => setHalal('✗ Haram')}>✗ Haram</div>
                  <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setHalal('✓ Amal 🌟'); }} className={`halal-btn ${halal === '✓ Amal 🌟' ? 'active-halal' : ''}`} onClick={() => setHalal('✓ Amal 🌟')}>✓ Amal</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="card-title">Pilih Kategori</div>
            <div className="cat-grid">
              {[
                { label: 'Makan', icon: '🍜' },
                { label: 'Transport', icon: '🚗' },
                { label: 'Belanja', icon: '🛒' },
                { label: 'Hiburan', icon: '🎬' },
                { label: 'Kesehatan', icon: '💊' },
                { label: 'Pendidikan', icon: '📚' },
                { label: 'Tagihan', icon: '💡' },
                { label: 'Sedekah', icon: '🕌' },
                { label: 'Lainnya', icon: '➕' },
              ].map(cat => (
                <div key={cat.label} role="button" tabIndex={0} onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setKategori(cat.label);
                    if (cat.label === 'Sedekah') setHalal('✓ Amal 🌟');
                  }
                }} className={`cat-btn ${kategori === cat.label ? 'selected' : ''}`} onClick={() => {
                  setKategori(cat.label);
                  if (cat.label === 'Sedekah') setHalal('✓ Amal 🌟');
                }}>
                  <span className="em">{cat.icon}</span>{cat.label}
                </div>
              ))}
            </div>
          </div>

          <div className="syariah-box" style={{ marginBottom: '14px' }}>
            <div className="syariah-box-head"><span className="badge badge-gold">🌙 Tips Syariah</span></div>
            <div className="syariah-box-text" style={{ fontSize: '12px' }}>Transaksi kategori <strong>Sedekah</strong> otomatis berstatus Amal dan terekam di Tracker Sedekah Anda.</div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            ✓ Simpan Transaksi
          </button>
        </div>
      </form>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Daftar Transaksi</span>
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{ fontSize: '11.5px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
          >
            <option value="Semua">Semua Waktu</option>
            <option value="Bulan Ini">Bulan Ini</option>
          </select>
        </div>
        
        {(() => {
          const filteredTransactions = transactions.filter(trx => {
            if (filterMonth === 'Semua') return true;
            const trxMonth = new Date(trx.date).getMonth();
            const trxYear = new Date(trx.date).getFullYear();
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            return trxMonth === currentMonth && trxYear === currentYear;
          });

          if (filteredTransactions.length === 0) {
            return <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>Belum ada transaksi di periode ini.</div>;
          }

          return (
            <div>
              {filteredTransactions.map(trx => (
                <div key={trx.id} className="trx-item">
                  <div className="trx-icon" style={{ background: trx.type === 'pemasukan' ? 'var(--green-dim)' : 'var(--pink-dim)' }}>
                    {trx.type === 'pemasukan' ? '💰' : '💸'}
                  </div>
                  <div className="trx-info">
                    <div className="trx-name">{trx.name}</div>
                    <div className="trx-cat">{new Date(trx.date).toLocaleDateString('id-ID')} · {trx.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`trx-amount ${trx.type === 'pemasukan' ? 'in' : 'out'}`}>
                      {trx.type === 'pemasukan' ? '+' : '-'}Rp {trx.amount.toLocaleString('id-ID')}
                    </div>
                    {trx.type === 'pengeluaran' && trx.syariahLabel !== 'Semua' && (
                      <span className="badge" style={{ 
                        background: trx.syariahLabel === '✓ Halal' || trx.syariahLabel === '✓ Amal 🌟' ? 'var(--green-dim)' : trx.syariahLabel === '⚠️ Syubhat' ? 'var(--gold-dim)' : 'var(--red-dim)',
                        color: trx.syariahLabel === '✓ Halal' || trx.syariahLabel === '✓ Amal 🌟' ? 'var(--green)' : trx.syariahLabel === '⚠️ Syubhat' ? 'var(--gold)' : 'var(--red)',
                        fontSize: '8px'
                      }}>{trx.syariahLabel}</span>
                    )}
                  </div>
                  <button onClick={() => { if(confirm('Hapus transaksi ini?')) deleteTransaction(trx.id) }} style={{ border: 'none', background: 'transparent', color: 'var(--red)', fontSize: '12px', cursor: 'pointer', marginLeft: '10px' }}>✕</button>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
