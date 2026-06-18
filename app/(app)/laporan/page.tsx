'use client';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function LaporanPage() {
  const { transactions, getSummary, isLoaded } = useTransactions();
  const [splitSesi, setSplitSesi] = useState(0);
  const [splitPiutang, setSplitPiutang] = useState(0);

  useEffect(() => {
    const splitData = localStorage.getItem('split_data');
    if (splitData) {
      try {
        const data = JSON.parse(splitData);
        if (data && (data.total !== 'Rp 0' || (data.items && data.items.length > 0))) {
          setSplitSesi(1);
          setSplitPiutang(data.total !== 'Rp 0' ? Number.parseInt(String(data.total).replace(/[^0-9]/g, ''), 10) : 0);
        }
      } catch(e) {}
    }
  }, []);
  
  if (!isLoaded) return null;

  const summary = getSummary();
  const formatMoney = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  const handleExportExcel = () => {
    if (transactions.length === 0) {
      alert('Belum ada data transaksi untuk diexport.');
      return;
    }

    // Siapkan data untuk Excel
    const excelData = transactions.map(t => ({
      'Tanggal': new Date(t.date).toLocaleDateString('id-ID'),
      'Jenis': t.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
      'Kategori': t.category || '-',
      'Keterangan': t.name,
      'Nominal': t.amount,
      'Status Syariah': t.syariahLabel || '-'
    }));

    // Buat worksheet dan workbook
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Auto-size kolom agar rapi
    const wscols = [
      { wch: 12 }, // Tanggal
      { wch: 15 }, // Jenis
      { wch: 15 }, // Kategori
      { wch: 30 }, // Keterangan
      { wch: 15 }, // Nominal
      { wch: 15 }  // Status Syariah
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Riwayat Transaksi");

    // Download file .xlsx
    XLSX.writeFile(wb, "Laporan_Keuangan_Tracki.xlsx");
  };

  // Calculate expense by category
  const expenseByCategory: Record<string, number> = {};
  let totalExpense = 0;
  
  transactions.forEach(t => {
    if (t.type === 'pengeluaran') {
      const cat = t.category || 'Lainnya';
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + t.amount;
      totalExpense += t.amount;
    }
  });

  const categories = Object.keys(expenseByCategory).map(cat => {
    const amount = expenseByCategory[cat];
    const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
    
    // Assign colors
    let color = 'var(--blue)';
    if (cat === 'Makan' || cat === 'Makanan') color = 'var(--red)';
    else if (cat === 'Belanja') color = 'var(--pink)';
    else if (cat === 'Hiburan') color = 'var(--purple)';
    else if (cat === 'Sedekah' || cat === 'Amal') color = 'var(--gold)';
    else if (cat === 'Transport' || cat === 'Transportasi') color = 'var(--blue)';
    else color = 'var(--muted)';

    return { name: cat, amount, pct, color };
  }).sort((a, b) => b.amount - a.amount);

  const sedekahTotal = transactions.filter(t => t.syariahLabel === '✓ Amal 🌟').reduce((sum, t) => sum + t.amount, 0);
  
  let score = 50;
  if (summary.income > 0) {
    const expenseRatio = summary.expense / summary.income;
    if (expenseRatio <= 0.4) score = 90;
    else if (expenseRatio <= 0.7) score = 75;
    else if (expenseRatio <= 0.9) score = 60;
    else score = 40;
  } else if (summary.expense > 0) {
    score = 30; // Ada pengeluaran tapi nol pemasukan
  } else {
    score = 0; // Belum ada data
  }
  if (sedekahTotal > 0 && score > 0) score = Math.min(100, score + 10);
  
  const isHealthy = score >= 60;
  
  const zakatWajib = summary.balance >= 119000000 ? summary.balance * 0.025 : 0;

  // Tren 3 bulan terakhir
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthsData = [0, 0, 0]; // [month-2, month-1, current]
  
  transactions.filter(t => t.type === 'pengeluaran').forEach(t => {
     const d = new Date(t.date);
     const diff = (currentYear - d.getFullYear()) * 12 + (currentMonth - d.getMonth());
     if (diff === 0) monthsData[2] += t.amount;
     else if (diff === 1) monthsData[1] += t.amount;
     else if (diff === 2) monthsData[0] += t.amount;
  });
  const maxMonth = Math.max(...monthsData, 10000);
  const h1 = Math.max(5, (monthsData[0] / maxMonth) * 100);
  const h2 = Math.max(5, (monthsData[1] / maxMonth) * 100);
  const h3 = Math.max(5, (monthsData[2] / maxMonth) * 100);

  return (
    <div className="page active" id="page-laporan">
      <div className="page-title">Laporan Bulanan</div>
      <div className="page-sub">Ringkasan keuangan islami bulan ini</div>

      {/* Health score header */}
      <div className="card" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div className="score-ring" style={{ background: isHealthy ? `linear-gradient(#fff,#fff) padding-box, conic-gradient(var(--green) ${score}%, rgba(16,185,129,0.2) 0) border-box` : `linear-gradient(#fff,#fff) padding-box, conic-gradient(var(--red) ${score}%, rgba(239,68,68,0.2) 0) border-box` }}>
            <div className="score-num">{score}</div>
            <div className="score-label">/100</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>Kesehatan Keuangan: <span style={{ color: isHealthy ? 'var(--green)' : 'var(--red)' }}>{isHealthy ? 'Sehat & Terkontrol' : 'Perlu Evaluasi'}</span></div>
            <div style={{ fontSize: '12.5px', color: 'var(--muted)', maxWidth: '360px', lineHeight: 1.6 }}>
              {score === 0 ? 'Belum ada data keuangan bulan ini. Mulai catat transaksi Anda!' : 
               isHealthy ? `Pengeluaran terkontrol. ${sedekahTotal > 0 ? `Sedekah bulan ini ${formatMoney(sedekahTotal)} — meningkatkan skor keberkahan 🌙` : ''}` 
               : 'Pengeluaran hampir melebihi batas atau tidak ada pemasukan. Perlu evaluasi kembali pengeluaran bulan ini.'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn" style={{ fontSize: '12px' }} onClick={handleExportExcel}>📊 Export Excel Asli (.xlsx)</button>
        </div>
      </div>

      <div className="g2">
        <div>
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="card-title">Ringkasan</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px', marginBottom: '12px' }}>
              <div style={{ background: 'var(--green-dim)', borderRadius: 'var(--r-sm)', padding: '13px', textAlign: 'center', border: '1px solid rgba(16,185,129,.2)' }}>
                <div style={{ fontSize: '10px', color: 'var(--green)', marginBottom: '3px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Pemasukan</div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '19px', fontWeight: 700, color: 'var(--green)' }}>{formatMoney(summary.income)}</div>
              </div>
              <div style={{ background: 'var(--red-dim)', borderRadius: 'var(--r-sm)', padding: '13px', textAlign: 'center', border: '1px solid rgba(239,68,68,.2)' }}>
                <div style={{ fontSize: '10px', color: 'var(--red)', marginBottom: '3px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Pengeluaran</div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '19px', fontWeight: 700, color: 'var(--red)' }}>{formatMoney(summary.expense)}</div>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg,var(--pink-dim),var(--blue-dim))', borderRadius: 'var(--r-sm)', padding: '14px', textAlign: 'center', border: '1px solid rgba(236,72,153,.15)' }}>
              <div style={{ fontSize: '10px', color: 'var(--pink)', marginBottom: '3px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Sisa / Tabungan</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '24px', fontWeight: 700, background: 'linear-gradient(135deg,var(--pink),var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{formatMoney(summary.balance)}</div>
            </div>

            {/* Zakat mini */}
            {zakatWajib > 0 && (
              <div style={{ marginTop: '10px', background: 'var(--gold-dim)', borderRadius: 'var(--r-sm)', padding: '11px', border: '1px solid rgba(245,158,11,.2)' }}>
                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 700, marginBottom: '3px' }}>🌙 Zakat Maal (2,5%)</div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '16px', fontWeight: 700, color: 'var(--gold)' }}>{formatMoney(zakatWajib)}</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>Wajib dikeluarkan bulan ini</div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title">Pengeluaran per Kategori</div>
            {categories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>Belum ada data pengeluaran</div>
            ) : categories.map((cat, idx) => (
              <div key={idx} className="prog-wrap">
                <div className="prog-head">
                  <span style={{ color: 'var(--text2)' }}>{cat.name} {cat.name === 'Sedekah' ? '🌙' : ''}</span>
                  <span style={{ color: cat.color, fontWeight: 600 }}>{formatMoney(cat.amount)} · {cat.pct}%</span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${cat.pct}%`, background: cat.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="card-title">Tren 3 Bulan Terakhir</div>
            <div className="chart-wrap" id="laporan-bars" style={{ height: '140px' }}>
              <div className="bar-col" style={{ background: 'rgba(236,72,153,.45)', height: `${h1}%`, borderRadius: '8px 8px 0 0', opacity: 1, flex: 0.8 }} title={formatMoney(monthsData[0])}></div>
              <div className="bar-col" style={{ background: 'rgba(236,72,153,.55)', height: `${h2}%`, borderRadius: '8px 8px 0 0', opacity: 1, flex: 0.8 }} title={formatMoney(monthsData[1])}></div>
              <div className="bar-col" style={{ background: 'var(--pink)', height: `${h3}%`, borderRadius: '8px 8px 0 0', opacity: 1, flex: 0.8 }} title={formatMoney(monthsData[2])}></div>
            </div>
            <div className="bar-labels" style={{ fontSize: '10px', marginTop: '6px' }}>
              <div style={{ flex: 1, textAlign: 'center', color: 'var(--muted)' }}>
                {(() => { const d = new Date(); d.setMonth(d.getMonth() - 2); return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'][d.getMonth()]; })()}
              </div>
              <div style={{ flex: 1, textAlign: 'center', color: 'var(--muted)' }}>
                {(() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'][d.getMonth()]; })()}
              </div>
              <div style={{ flex: 1, textAlign: 'center', color: 'var(--pink)', fontWeight: 700 }}>
                {(() => { const d = new Date(); return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'][d.getMonth()]; })()}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Split Bill Bulan Ini</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '7px', marginBottom: '12px' }}>
              <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-sm)', padding: '11px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>{splitSesi}</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px', fontWeight: 500 }}>Sesi</div>
              </div>
              <div style={{ background: 'var(--pink-dim)', borderRadius: 'var(--r-sm)', padding: '11px', textAlign: 'center', border: '1px solid rgba(236,72,153,.2)' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '17px', fontWeight: 700, color: 'var(--pink)' }}>{splitPiutang > 0 ? 'Aktif' : '-'}</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px', fontWeight: 500 }}>Status</div>
              </div>
              <div style={{ background: 'var(--blue-dim)', borderRadius: 'var(--r-sm)', padding: '11px', textAlign: 'center', border: '1px solid rgba(59,130,246,.2)' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '14px', fontWeight: 700, color: 'var(--blue)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{splitPiutang > 0 ? formatMoney(splitPiutang) : '-'}</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px', fontWeight: 500 }}>Tagihan</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
