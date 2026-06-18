'use client';
import { useState, useEffect } from 'react';

const parseMoney = (str: string) => Number.parseInt(String(str).replace(/[^0-9]/g, ''), 10) || 0;
const formatMoney = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

export default function SplitPage() {
  const [members, setMembers] = useState([
    { id: '1', name: 'Kamu (Host)', role: 'Host', color: 'linear-gradient(135deg,var(--pink),var(--blue))', initial: 'KM', customPercent: 0, isPaid: true }
  ]);
  const [newName, setNewName] = useState('');
  const [tab, setTab] = useState('Rata Sama');
  const [splitData, setSplitData] = useState<{merchant: string, total: string, items: any[]}>({
    merchant: 'Toko',
    total: 'Rp 0',
    items: []
  });

  const parsedTotal = parseMoney(splitData.total);

  useEffect(() => {
    const dataStr = localStorage.getItem('split_data');
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        setSplitData(data);
        if (data.members && Array.isArray(data.members)) {
          setMembers(data.members);
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    // Simpan ke localStorage setiap ada perubahan agar terbaca di Laporan/Dashboard
    if (splitData.total !== 'Rp 0' || splitData.merchant !== 'Toko') {
      localStorage.setItem('split_data', JSON.stringify({ ...splitData, members }));
    }
  }, [splitData, members]);

  const handleSelesai = () => {
    if (confirm('Akhiri sesi patungan ini dan hapus datanya?')) {
      localStorage.removeItem('split_data');
      setSplitData({ merchant: 'Toko', total: 'Rp 0', items: [] });
      setMembers([{ id: '1', name: 'Kamu (Host)', role: 'Host', color: 'linear-gradient(135deg,var(--pink),var(--blue))', initial: 'KM', customPercent: 0, isPaid: true }]);
    }
  };

  const handleAddMember = () => {
    if (!newName.trim()) return;
    const grads = ['linear-gradient(135deg,#f472b6,#ec4899)','linear-gradient(135deg,#60a5fa,#3b82f6)','linear-gradient(135deg,#fb923c,#ea580c)','linear-gradient(135deg,#a78bfa,#7c3aed)','linear-gradient(135deg,#34d399,#059669)'];
    const g = grads[newName.length % grads.length];
    const init = newName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || 'US';
    setMembers([...members, { 
      id: Date.now().toString(), 
      name: newName, 
      role: 'Anggota', 
      color: g, 
      initial: init,
      customPercent: 0,
      isPaid: false
    }]);
    setNewName('');
  };

  const handleRemoveMember = (id: string) => {
    if (id === '1') return; // Cannot remove host
    setMembers(members.filter(m => m.id !== id));
    // Reset assigned items
    setSplitData(prev => ({
      ...prev,
      items: prev.items.map(i => i.assignedTo === id ? { ...i, assignedTo: 'all' } : i)
    }));
  };

  const setItemAssignee = (idx: number, memberId: string) => {
    const newItems = [...splitData.items];
    newItems[idx].assignedTo = memberId;
    setSplitData({ ...splitData, items: newItems });
  };

  const updateCustomPercent = (id: string, percent: number) => {
    setMembers(members.map(m => m.id === id ? { ...m, customPercent: percent } : m));
  };

  const togglePaid = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, isPaid: !m.isPaid } : m));
  };

  // CALCULATE SPLIT
  const memberAmounts: Record<string, number> = {};
  members.forEach(m => memberAmounts[m.id] = 0);

  if (tab === 'Rata Sama') {
    const perPerson = parsedTotal / (members.length || 1);
    members.forEach(m => memberAmounts[m.id] = perPerson);
  } else if (tab === 'Custom %') {
    members.forEach(m => {
      memberAmounts[m.id] = (parsedTotal * (m.customPercent || 0)) / 100;
    });
  }

  const totalPercent = members.reduce((sum, m) => sum + (m.customPercent || 0), 0);

  const generateWaText = () => {
    let text = `🍛 *Split Bill — ${splitData.merchant}*\n`;
    text += `📅 ${new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}\n`;
    text += `─────────────────\n`;
    text += `Total Tagihan: ${formatMoney(parsedTotal)}\n`;
    text += `─────────────────\n`;
    
    members.forEach(m => {
      const amt = Math.round(memberAmounts[m.id] || 0);
      if (m.id === '1') {
        text += `✅ ${m.name} — ${formatMoney(amt)} (Host, bayar dulu)\n`;
      } else if (m.isPaid) {
        text += `✅ ${m.name} — LUNAS\n`;
      } else {
        text += `🧾 ${m.name} — Transfer ${formatMoney(amt)}\n`;
      }
    });
    
    text += `─────────────────\n`;
    text += `🏦 Ke Rekening/E-Wallet: [Isi Nomormu]\n`;
    text += `🤲 Barakallahu fiikum\n`;
    
    return text;
  };

  const handleCopyWa = () => {
    navigator.clipboard.writeText(generateWaText());
    alert('Pesan WA berhasil di-copy!');
  };

  return (
    <div className="page active" id="page-split">
      <div className="page-title">Split Bill Cerdas</div>
      <div className="page-sub">Bagi tagihan transparan, tercatat, share ke WhatsApp</div>

      <div className="g2">
        <div>
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="card-title">Anggota Grup</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input className="form-input" type="text" placeholder="Ketik nama teman..." value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddMember()} style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={handleAddMember} style={{ flexShrink: 0, padding: '10px 14px' }}>Tambah</button>
            </div>
            <div>
              {members.map((m) => (
                <div key={m.id} className="member-row" style={m.role === 'Host' ? { background: 'linear-gradient(135deg,var(--pink-dim),var(--blue-dim))', borderColor: 'var(--border2)' } : {}}>
                  <div className="member-avatar" style={{ background: m.color }}>{m.initial}</div>
                  <span className="member-name">{m.name}</span>
                  {m.role === 'Host' ? (
                    <span className="badge badge-pink">Host</span>
                  ) : (
                    <button type="button" style={{ fontSize: '12px', cursor: 'pointer', color: 'var(--red)', background: 'none', border: 'none', padding: 0 }} onClick={() => handleRemoveMember(m.id)}>✕ Hapus</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="card-title">Detail Tagihan</div>
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label htmlFor="merchant" className="form-label">Nama Toko / Tempat</label>
              <input id="merchant" className="form-input" type="text" placeholder="Contoh: Warteg Bu Sari" value={splitData.merchant === 'Toko' ? '' : splitData.merchant} onChange={e => setSplitData({ ...splitData, merchant: e.target.value || 'Toko' })} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="totalBill" className="form-label">Total Tagihan (Rp)</label>
              <input id="totalBill" className="form-input" type="text" placeholder="Rp 0" value={splitData.total === 'Rp 0' ? '' : splitData.total} onChange={e => {
                const v = e.target.value.replace(/\D/g, '');
                if (v) {
                  const formatted = 'Rp ' + Number.parseInt(v, 10).toLocaleString('id-ID');
                  setSplitData({ ...splitData, total: formatted });
                } else {
                  setSplitData({ ...splitData, total: 'Rp 0' });
                }
              }} />
            </div>
          </div>

          <div className="card">
            <div className="card-title">Metode Split</div>
            <div className="tabs">
              {['Rata Sama', 'Custom %'].map(t => (
                <div key={t} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setTab(t); }} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</div>
              ))}
            </div>
            
            <div style={{ background: 'linear-gradient(135deg,var(--pink-dim),var(--blue-dim))', borderRadius: 'var(--r-sm)', padding: '16px', textAlign: 'center', border: '1px solid rgba(236,72,153,.15)', marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', color: 'var(--muted2)', marginBottom: '5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px' }}>Total Tagihan</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '26px', fontWeight: 700, background: 'linear-gradient(135deg,var(--pink),var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{formatMoney(parsedTotal)}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>{splitData.merchant} · {members.length} orang</div>
            </div>

            {tab === 'Custom %' && (
              <div style={{ marginTop: '14px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text2)' }}>Atur Persentase per Orang:</div>
                {members.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', flex: 1 }}>{m.name}</span>
                    <input 
                      type="number" 
                      min="0" max="100"
                      className="form-input" 
                      style={{ width: '80px', padding: '6px' }} 
                      value={m.customPercent || ''} 
                      onChange={e => updateCustomPercent(m.id, Number(e.target.value))}
                      placeholder="%"
                    />
                    <span style={{ fontSize: '12px', width: '20px' }}>%</span>
                  </div>
                ))}
                <div style={{ fontSize: '11px', fontWeight: 600, color: totalPercent === 100 ? 'var(--green)' : 'var(--red)', marginTop: '8px', textAlign: 'right' }}>
                  Total: {totalPercent}% {totalPercent !== 100 && '(Harus 100%)'}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: '14px' }}>
            <div className="card-title">Ringkasan Pembayaran</div>
            {members.map(m => (
              <div key={m.id} className="member-row" style={m.id === '1' ? { background: 'linear-gradient(135deg,var(--pink-dim),var(--blue-dim))', borderColor: 'var(--border2)' } : {}}>
                <div className="member-avatar" style={{ background: m.color }}>{m.initial}</div>
                <div style={{ flex: 1 }}>
                  <div className="member-name">{m.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    {m.id === '1' ? 'Bayar dulu ke kasir' : 'Bayar ke Kamu'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="member-amount">{formatMoney(Math.round(memberAmounts[m.id] || 0))}</div>
                  {m.id === '1' ? (
                    <div style={{ fontSize: '10px', color: 'var(--pink)' }}>Bagianmu</div>
                  ) : (
                    <button 
                      onClick={() => togglePaid(m.id)}
                      className="badge" 
                      style={{ 
                        fontSize: '9px', cursor: 'pointer', border: 'none',
                        background: m.isPaid ? 'var(--green-dim)' : 'var(--pink-dim)',
                        color: m.isPaid ? 'var(--green)' : 'var(--pink)'
                      }}
                    >
                      {m.isPaid ? '✅ LUNAS' : '🧾 BELUM LUNAS'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">Share WhatsApp</div>
            <div className="wa-preview" style={{ whiteSpace: 'pre-wrap' }}>
              {generateWaText()}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '11px' }} onClick={handleCopyWa}>
              📋 Copy Pesan WA
            </button>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '8px', border: '1px solid var(--red)', color: 'var(--red)', background: 'transparent' }} onClick={handleSelesai}>
              ❌ Akhiri & Hapus Sesi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
