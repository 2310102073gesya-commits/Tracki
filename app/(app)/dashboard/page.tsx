'use client';
import { useTransactions } from '@/lib/hooks/useTransactions';
import Link from 'next/link';

export default function DashboardPage() {
  const { transactions, getSummary, isLoaded } = useTransactions();
  const summary = getSummary();
  const recentTransactions = transactions.slice(0, 5);

  const formatMoney = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  // Calculate Bar Chart (Last 5 Days)
  const today = new Date();
  const last5Days = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (4 - i));
    return d;
  });

  const dailyExpenses = last5Days.map(date => {
    const dayStr = date.toLocaleDateString('id-ID', { weekday: 'short' });
    const total = transactions
      .filter(t => t.type === 'pengeluaran' && new Date(t.date).toDateString() === date.toDateString())
      .reduce((sum, t) => sum + t.amount, 0);
    return { day: dayStr, total };
  });
  const maxExpense = Math.max(...dailyExpenses.map(d => d.total), 10000); // minimum scale

  // Calculate Donut Chart (Top Categories)
  const expensesByCategory = transactions
    .filter(t => t.type === 'pengeluaran')
    .reduce((acc, t) => {
      const cat = t.category || 'Lainnya';
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalExpenseForDonut = Object.values(expensesByCategory).reduce((a, b) => a + b, 0) || 1;
  const donutColors = ['#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#f97316', '#10b981'];
  
  let currentPct = 0;
  const donutSlices = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) // max 5 slices
    .map((entry, index) => {
      const pct = Math.round((entry[1] / totalExpenseForDonut) * 100);
      const startPct = currentPct;
      currentPct += pct;
      return {
        name: entry[0],
        pct,
        color: donutColors[index]
      };
    });

  let gradientAcc = 0;
  const conicStrs = donutSlices.map(slice => {
    const start = gradientAcc;
    gradientAcc += slice.pct;
    return `${slice.color} ${start}% ${gradientAcc}%`;
  });
  const conicGradient = conicStrs.length > 0 ? `conic-gradient(${conicStrs.join(', ')})` : 'conic-gradient(#e2e8f0 0% 100%)';

  if (!isLoaded) return null;

  return (
    <div className="page active" id="page-dashboard">
      <div className="stats">
        <div className="stat-card">
          <div className="stat-emoji">💸</div>
          <div className="stat-label">Pengeluaran</div>
          <div className="stat-value red">{formatMoney(summary.expense)}</div>
          <div className="stat-change down">Bulan ini</div>
        </div>
        <div className="stat-card">
          <div className="stat-emoji">💰</div>
          <div className="stat-label">Pemasukan</div>
          <div className="stat-value green">{formatMoney(summary.income)}</div>
          <div className="stat-change up">Bulan ini</div>
        </div>
        <div className="stat-card">
          <div className="stat-emoji">🏦</div>
          <div className="stat-label">Saldo</div>
          <div className="stat-value blue">{formatMoney(summary.balance)}</div>
          <div className="stat-change ok">{summary.balance > 0 ? 'Sehat! 💚' : summary.balance < 0 ? 'Minus! ⚠️' : 'Kosong'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-emoji">🤝</div>
          <div className="stat-label">Split Bill</div>
          <div className="stat-value purple">1 Sesi</div>
          <div className="stat-change ok">Aktif</div>
        </div>
      </div>

      {summary.balance > 1200000 && (
        <div className="syariah-box">
          <div className="syariah-box-head">
            <span className="badge badge-gold">🌙 Pengingat Zakat</span>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Nisab sudah tercapai</span>
          </div>
          <div className="syariah-box-text">
            Saldo kamu telah melampaui nisab bulanan. Jangan lupa keluarkan <strong>zakat 2,5%</strong> = <strong>{formatMoney(summary.balance * 0.025)}</strong> untuk menjaga keberkahan rezeki. Innallaha ma&apos;akum 🤲
          </div>
        </div>
      )}

      <div className="g2">
        <div className="card">
          <div className="card-title">Tren Pengeluaran — Hari Ini <a>Detail →</a></div>
          <div className="chart-wrap" id="bar-chart">
            {dailyExpenses.map((day, i) => {
              const heightPct = Math.max((day.total / maxExpense) * 100, 5); // minimum 5% height
              return (
                <div key={i} className="bar-col" style={{ background: 'linear-gradient(to top,var(--pink),var(--pink2))', height: `${heightPct}%` }} title={formatMoney(day.total)}></div>
              );
            })}
          </div>
          <div className="bar-labels" id="bar-labels">
            {dailyExpenses.map((day, i) => (
              <div key={i} className="bar-label">{day.day}</div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Breakdown Kategori</div>
          <div className="donut-wrap">
            <div style={{ width: '120px', height: '120px', flexShrink: 0, borderRadius: '50%', background: conicGradient }}></div>
            <div className="legend">
              {donutSlices.length > 0 ? (
                donutSlices.map((slice, i) => (
                  <div key={i} className="legend-row">
                    <div className="legend-dot" style={{ background: slice.color }}></div>
                    <span className="legend-name">{slice.name}</span>
                    <span className="legend-pct">{slice.pct}%</span>
                  </div>
                ))
              ) : (
                <div className="legend-row"><span className="legend-name" style={{ color: 'var(--muted)' }}>Belum ada pengeluaran</span></div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Transaksi Terbaru <Link href="/transactions">Lihat semua →</Link></div>
        {recentTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>Belum ada transaksi. Silakan input di menu Transaksi.</div>
        ) : (
          recentTransactions.map(trx => (
            <div key={trx.id} className="trx-item">
              <div className="trx-icon" style={{ background: trx.type === 'pemasukan' ? 'var(--green-dim)' : 'var(--pink-dim)' }}>
                {trx.type === 'pemasukan' ? '💰' : '💸'}
              </div>
              <div className="trx-info">
                <div className="trx-name">{trx.name}</div>
                <div className="trx-cat">
                  {trx.category} · {new Date(trx.date).toLocaleDateString('id-ID')}
                  {trx.type === 'pengeluaran' && trx.syariahLabel && (
                    <span className="badge" style={{ 
                      marginLeft: '6px',
                      background: trx.syariahLabel === '✓ Halal' || trx.syariahLabel === '✓ Amal 🌟' ? 'var(--green-dim)' : trx.syariahLabel === '⚠️ Syubhat' ? 'var(--gold-dim)' : 'var(--red-dim)',
                      color: trx.syariahLabel === '✓ Halal' || trx.syariahLabel === '✓ Amal 🌟' ? 'var(--green)' : trx.syariahLabel === '⚠️ Syubhat' ? 'var(--gold)' : 'var(--red)'
                    }}>{trx.syariahLabel}</span>
                  )}
                </div>
              </div>
              <div className={`trx-amount ${trx.type === 'pemasukan' ? 'in' : 'out'}`}>
                {trx.type === 'pemasukan' ? '+' : '-'}{formatMoney(trx.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
