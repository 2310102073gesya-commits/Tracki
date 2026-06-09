'use client';
import { useState } from 'react';
import { useTransactions } from '@/lib/hooks/useTransactions';

export default function InsightPage() {
  const [filter, setFilter] = useState('Semua');
  const { transactions, getSummary, addTransaction, isLoaded } = useTransactions();
  
  if (!isLoaded) return null;

  const summary = getSummary();
  const formatMoney = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  // Asumsi harga emas Rp 1.400.000 / gram (2026) -> 85 gram = 119.000.000
  const nisabTarget = 119000000;
  const isNisabReached = summary.balance >= nisabTarget;
  const zakatWajib = isNisabReached ? summary.balance * 0.025 : 0;
  const nisabPct = Math.min(100, Math.round((summary.balance / nisabTarget) * 100));

  const handleCatatZakat = () => {
    if (zakatWajib <= 0) {
      alert("Alhamdulillah, saat ini harta Anda belum mencapai nisab wajib Zakat Maal.");
      return;
    }
    
    const thisMonth = new Date().getMonth();
    const isPaidThisMonth = transactions.some(t => 
      t.name === 'Pembayaran Zakat Maal' && new Date(t.date).getMonth() === thisMonth
    );
    
    if (isPaidThisMonth) {
      alert("Anda sudah mencatat pembayaran Zakat Maal bulan ini. Insya Allah berkah!");
      return;
    }

    addTransaction({
      name: 'Pembayaran Zakat Maal',
      amount: zakatWajib,
      type: 'pengeluaran',
      category: 'Zakat & Sedekah',
      syariahLabel: '✓ Amal 🌟'
    });
    
    alert(`Alhamdulillah, pembayaran zakat sebesar ${formatMoney(zakatWajib)} berhasil dicatat.`);
  };

  // Hitung total Amal / Sedekah bulan ini
  const sedekahTarget = 100000;
  let totalSedekah = 0;
  transactions.forEach(t => {
    if (t.syariahLabel === '✓ Amal 🌟') {
      totalSedekah += t.amount;
    }
  });
  const sedekahPct = Math.min(100, Math.round((totalSedekah / sedekahTarget) * 100));

  return (
    <div className="page active" id="page-zakat">
      <div className="page-title">🌙 Zakat &amp; Keuangan Syariah</div>
      <div className="page-sub">Kelola rezeki dengan amanah sesuai prinsip Islam</div>

      {/* Hadith */}
      <div className="hadith-box">
        <div className="hadith-arabic" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
        <div className="hadith-text">&quot;Kelola rezekimu dengan amanah, karena harta yang berkah bukan yang banyak tapi yang bermanfaat.&quot;<br/><span style={{ color: 'rgba(255,255,255,.4)', fontSize: '10px' }}>Semoga Allah membawa keberkahan dalam setiap rezekimu 🤲</span></div>
      </div>

      <div className="g2">
        <div>
          {/* Zakat Calculator */}
          <div className="zakat-card" style={{ marginBottom: '14px' }}>
            <div className="card-title" style={{ fontFamily: 'var(--font-head)' }}>🌙 Kalkulator Zakat Maal</div>
            <div className="nisab-ring" style={{ background: `linear-gradient(#fff,#fff) padding-box, conic-gradient(var(--gold) ${nisabPct}%, rgba(245,158,11,0.2) 0) border-box` }}>
              <div className="nisab-pct">{nisabPct}%</div>
              <div className="nisab-sub">{isNisabReached ? 'Tercapai' : 'Belum Tercapai'}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(245,158,11,.08)', borderRadius: 'var(--r-sm)', padding: '12px', border: '1px solid rgba(245,158,11,.2)' }}>
                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 700, marginBottom: '3px', textTransform: 'uppercase' }}>Total Harta</div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>{formatMoney(Math.max(0, summary.balance))}</div>
              </div>
              <div style={{ background: 'rgba(245,158,11,.08)', borderRadius: 'var(--r-sm)', padding: '12px', border: '1px solid rgba(245,158,11,.2)' }}>
                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 700, marginBottom: '3px', textTransform: 'uppercase' }}>Nisab (85g emas)</div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>{formatMoney(nisabTarget)}</div>
              </div>
            </div>
            <div style={{ background: isNisabReached ? 'var(--gold-pale)' : 'var(--bg)', borderRadius: 'var(--r-sm)', padding: '14px', border: isNisabReached ? '1px solid rgba(245,158,11,.3)' : '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: isNisabReached ? 'var(--gold)' : 'var(--muted)', fontWeight: 700, marginBottom: '4px' }}>ZAKAT WAJIB DIKELUARKAN</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '26px', fontWeight: 700, color: isNisabReached ? '#92400e' : 'var(--muted2)' }}>{formatMoney(zakatWajib)}</div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '3px' }}>2,5% × Total Harta</div>
            </div>
            <button className="btn btn-primary" onClick={handleCatatZakat} style={{ width: '100%', justifyContent: 'center', marginTop: '12px', background: 'linear-gradient(135deg,var(--gold),var(--orange))', borderColor: 'var(--gold)' }}>
              🕌 Catat Pembayaran Zakat
            </button>
          </div>

          {/* Sedekah tracker */}
          <div className="card">
            <div className="card-title">💝 Tracker Sedekah</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--muted2)' }}>Target sedekah bulan ini</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green)' }}>{formatMoney(totalSedekah)} / {formatMoney(sedekahTarget)}</span>
            </div>
            <div className="prog-bar" style={{ height: '8px', marginBottom: '12px' }}><div className="prog-fill" style={{ width: `${sedekahPct}%`, background: 'linear-gradient(90deg,var(--green),#34d399)' }}></div></div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>
              {sedekahPct >= 100 
                ? 'Target tercapai! Semoga berkah dan melimpah rezekinya. 🌟' 
                : `${sedekahPct}% tercapai — tambah ${formatMoney(sedekahTarget - totalSedekah)} lagi untuk target keberkahan! 🌟`}
            </div>
          </div>
        </div>

        <div>
          {/* Filter Halal/Haram */}
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="card-title">🌙 Filter Transaksi Syariah</div>
            <div className="filter-row">
              {['Semua', '✓ Halal', '⚠️ Syubhat', '✗ Haram'].map(f => (
                <div key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</div>
              ))}
            </div>
            {transactions.filter(t => t.type === 'pengeluaran').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>Belum ada transaksi pengeluaran.</div>
            ) : transactions
              .filter(t => t.type === 'pengeluaran')
              .filter(t => {
                if (filter === 'Semua') return true;
                if (filter === '✓ Halal') return t.syariahLabel === '✓ Halal' || t.syariahLabel === '✓ Amal 🌟';
                return t.syariahLabel === filter;
              })
              .map((trx) => (
                <div key={trx.id} className="trx-item">
                  <div className="trx-icon" style={{ 
                    background: trx.syariahLabel === '⚠️ Syubhat' ? 'var(--purple-dim)' : trx.syariahLabel === '✗ Haram' ? 'var(--red-dim)' : 'var(--green-dim)' 
                  }}>{trx.syariahLabel === '✓ Amal 🌟' ? '💝' : trx.category === 'Makan' ? '🍜' : '🛒'}</div>
                  <div className="trx-info"><div className="trx-name">{trx.name}</div><div className="trx-cat">{trx.category} · {formatMoney(trx.amount)}</div></div>
                  <span className="badge" style={{ 
                      background: trx.syariahLabel === '✓ Halal' || trx.syariahLabel === '✓ Amal 🌟' ? 'var(--green-dim)' : trx.syariahLabel === '⚠️ Syubhat' ? 'var(--gold-dim)' : 'var(--red-dim)',
                      color: trx.syariahLabel === '✓ Halal' || trx.syariahLabel === '✓ Amal 🌟' ? 'var(--green)' : trx.syariahLabel === '⚠️ Syubhat' ? 'var(--gold)' : 'var(--red)',
                  }}>{trx.syariahLabel}</span>
                </div>
              ))}
          </div>

          {/* Tips Islami */}
          <div className="card">
            <div className="card-title">💡 Tips Keuangan Islami</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'var(--gold-dim)', borderRadius: 'var(--r-sm)', padding: '12px', border: '1px solid rgba(245,158,11,.18)' }}>
                <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, marginBottom: '4px' }}>🌙 Prinsip Qanaah</div>
                <div style={{ fontSize: '12px', color: 'var(--muted2)', lineHeight: 1.6 }}>Merasa cukup dengan yang ada sambil terus berikhtiar. Hindari gaya hidup konsumtif yang berlebihan.</div>
              </div>
              <div style={{ background: 'var(--green-dim)', borderRadius: 'var(--r-sm)', padding: '12px', border: '1px solid rgba(16,185,129,.18)' }}>
                <div style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 700, marginBottom: '4px' }}>💝 Keutamaan Sedekah</div>
                <div style={{ fontSize: '12px', color: 'var(--muted2)', lineHeight: 1.6 }}>Sedekah tidak mengurangi harta — justru memperlancar rezeki dan membersihkan harta dari hal yang tidak baik.</div>
              </div>
              <div style={{ background: 'var(--purple-dim)', borderRadius: 'var(--r-sm)', padding: '12px', border: '1px solid rgba(139,92,246,.18)' }}>
                <div style={{ fontSize: '11px', color: 'var(--purple)', fontWeight: 700, marginBottom: '4px' }}>🚫 Hindari Riba</div>
                <div style={{ fontSize: '12px', color: 'var(--muted2)', lineHeight: 1.6 }}>Tracki tidak mendukung transaksi pinjol, riba, atau judi. Data kamu tidak digunakan untuk iklan haram.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
