'use client';
import { useTransactions } from '@/lib/hooks/useTransactions';
import Link from 'next/link';

export default function DashboardPage() {
  const { transactions, getSummary, isLoaded } = useTransactions();
  const summary = getSummary();
  const recentTransactions = transactions.slice(0, 5);

  const formatMoney = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

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
            <div className="bar-col" style={{ background: 'linear-gradient(to top,var(--pink),var(--pink2))', height: '40%' }}></div>
            <div className="bar-col" style={{ background: 'linear-gradient(to top,var(--pink),var(--pink2))', height: '60%' }}></div>
            <div className="bar-col" style={{ background: 'linear-gradient(to top,var(--pink),var(--pink2))', height: '80%' }}></div>
            <div className="bar-col" style={{ background: 'linear-gradient(to top,var(--pink),var(--pink2))', height: '50%' }}></div>
            <div className="bar-col" style={{ background: 'linear-gradient(to top,var(--pink),var(--pink2))', height: '90%' }}></div>
          </div>
          <div className="bar-labels" id="bar-labels">
            <div className="bar-label">Min</div><div className="bar-label">Sen</div><div className="bar-label">Sel</div><div className="bar-label">Rab</div><div className="bar-label">Kam</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Breakdown Kategori</div>
          <div className="donut-wrap">
            <div style={{ width: '120px', height: '120px', flexShrink: 0, borderRadius: '50%', background: 'conic-gradient(#ef4444 38%, #3b82f6 0 60%, #ec4899 0 78%, #8b5cf6 0 92%, #f97316 0 100%)' }}></div>
            <div className="legend">
              <div className="legend-row"><div className="legend-dot" style={{ background: '#ef4444' }}></div><span className="legend-name">Makan &amp; Minum</span><span className="legend-pct">38%</span></div>
              <div className="legend-row"><div className="legend-dot" style={{ background: '#3b82f6' }}></div><span className="legend-name">Transport</span><span className="legend-pct">22%</span></div>
              <div className="legend-row"><div className="legend-dot" style={{ background: '#ec4899' }}></div><span className="legend-name">Belanja</span><span className="legend-pct">18%</span></div>
              <div className="legend-row"><div className="legend-dot" style={{ background: '#8b5cf6' }}></div><span className="legend-name">Hiburan</span><span className="legend-pct">14%</span></div>
              <div className="legend-row"><div className="legend-dot" style={{ background: '#f97316' }}></div><span className="legend-name">Lainnya</span><span className="legend-pct">8%</span></div>
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
