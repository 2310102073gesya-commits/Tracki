'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname() || '';
  const router = useRouter();
  
  const [user, setUser] = useState({ name: 'Pengguna', email: '-', initials: 'U' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('user_email') || 'ari@tracki.id';
      
      // Extract name from email (e.g., john.doe@email.com -> John Doe)
      const namePart = email.split('@')[0];
      const rawName = namePart.replace(/[._]/g, ' ');
      // Capitalize first letters
      const formattedName = rawName.replace(/\b\w/g, c => c.toUpperCase());
      
      // Get Initials (up to 2 characters)
      const initials = formattedName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

      setUser({ name: formattedName, email: email, initials: initials });
    }
  }, [pathname]); // Update if pathname changes just in case they re-login
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Transaksi', path: '/transactions', icon: '✏️' },
    { name: 'Asisten Chat AI', path: '/chat', icon: '💬' },
    { name: 'Split Bill', path: '/split', icon: '🤝' },
    { name: 'Laporan Bulanan', path: '/laporan', icon: '📋' },
    { name: 'Zakat & Syariah', path: '/insight', icon: '🌙', isSyariah: true },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_email');
    }
    router.push('/');
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/logotracki.png" alt="Tracki" style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(236,72,153,0.15)' }} />
        <div className="logo-name">tracki</div>
      </div>

      <div className="nav-label">Menu Utama</div>

      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.path);
        const className = `nav-item ${item.isSyariah ? 'syariah' : ''} ${isActive ? 'active' : ''}`;
        return (
          <Link href={item.path} key={item.path} className={className}>
            <span className="nav-icon">{item.icon}</span> {item.name}
          </Link>
        );
      })}

      <div className="nav-spacer"></div>

      <div className="syariah-badge">
        <div className="moon">🌙</div>
        <div className="sb-text">Mode Syariah Aktif</div>
        <div className="sb-sub">Halal · Amanah · Berkah</div>
      </div>

      <div className="user-card" onClick={handleLogout} style={{ cursor: 'pointer' }} title="Klik untuk Keluar">
        <div className="user-avatar">{user.initials}</div>
        <div style={{ overflow: 'hidden' }}>
          <div className="user-name" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</div>
          <div className="user-email" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</div>
        </div>
      </div>
    </div>
  );
}
