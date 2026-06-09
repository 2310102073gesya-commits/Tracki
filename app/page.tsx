'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // PWA States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Cek apakah sudah di-install (Standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsStandalone(true);
    }

    // Cek apakah perangkat iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setIsIOS(true);
    }

    // Tangkap event install dari Chrome/Android
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Munculkan popup native Android
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      // Panduan untuk iPhone (karena Apple tidak mengizinkan popup otomatis)
      alert("Untuk memasang di iPhone/iPad:\n\n1. Tekan ikon 'Share' (kotak panah ke atas) di menu bawah Safari.\n2. Geser menu ke bawah dan pilih 'Tambahkan ke Layar Utama' (Add to Home Screen).\n3. Klik Tambah di pojok kanan atas.");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_email', email);
    }
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#ffffff',
      fontFamily: 'var(--font-sans)'
    }}>
      <div className="login-quote-side" style={{
        flex: 1,
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: '#fbcfe8', filter: 'blur(100px)', opacity: 0.6, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '300px', height: '300px', background: '#f9a8d4', filter: 'blur(100px)', opacity: 0.4, borderRadius: '50%' }}></div>

        <div style={{ zIndex: 1, maxWidth: '480px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', color: '#db2777', marginBottom: '8px', opacity: 0.4 }}>❝</div>
          <p className="quote-text" style={{ 
            fontFamily: 'var(--font-head)', fontSize: '28px', fontWeight: 700, 
            color: '#831843', lineHeight: 1.4, margin: '0 0 24px 0', letterSpacing: '-0.5px'
          }}>
            Harta yang kita miliki sejatinya adalah titipan. Bukan tentang seberapa banyak yang dikumpulkan, melainkan seberapa berkah ia dibelanjakan.
          </p>
          <div style={{ width: '40px', height: '3px', background: '#db2777', margin: '0 auto 16px auto', borderRadius: '2px' }}></div>
          <p style={{ color: '#be185d', fontSize: '13px', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Pengingat Islami 🌙
          </p>
        </div>
      </div>

      <div className="login-form-side" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ maxWidth: '380px', width: '100%' }}>
          
          <div style={{ marginBottom: '32px' }}>
            <img 
              src="/logotracki.png" 
              alt="Tracki Logo" 
              style={{ 
                width: '72px', height: '72px', borderRadius: '18px', 
                marginBottom: '20px', boxShadow: '0 10px 25px -5px rgba(219,39,119,0.2)',
                objectFit: 'cover'
              }} 
            />
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0', letterSpacing: '-1px' }}>Tracki</h1>
            <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>Masuk untuk mengelola keuangan cerdas & islami.</p>
          </div>

          {/* Banner PWA Download */}
          {!isStandalone && (deferredPrompt || isIOS) && (
            <div style={{
              background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
              border: '1px solid #fbcfe8',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 4px 12px -4px rgba(219,39,119,0.1)'
            }}>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#831843' }}>Aplikasi Tracki Tersedia!</div>
                <div style={{ fontSize: '11.5px', color: '#be185d', marginTop: '2px' }}>Download ke HP agar lebih cepat</div>
              </div>
              <button 
                onClick={handleInstallClick}
                type="button"
                style={{
                  background: '#db2777',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 10px -2px rgba(219,39,119,0.4)'
                }}>
                📥 Install App
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Alamat Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com" 
                required
                style={{
                  width: '100%', padding: '14px 16px', background: '#f9fafb',
                  border: '1px solid #e5e7eb', borderRadius: '12px',
                  color: '#111827', fontSize: '15px', outline: 'none', transition: 'all 0.2s',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                }}
                onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.02)'; }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%', padding: '15px', marginTop: '8px',
                background: loading ? '#f3f4f6' : 'linear-gradient(135deg, #f472b6, #db2777)',
                color: loading ? '#9ca3af' : '#ffffff', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 8px 20px -6px rgba(219,39,119,0.5)'
              }}
            >
              {loading ? 'Memuat Dasbor...' : 'Masuk Sekarang →'}
            </button>
          </form>

          <div style={{ marginTop: '40px', color: '#9ca3af', fontSize: '12px', fontWeight: 500, textAlign: 'center' }}>
            Tracki MVP © 2025 · Dibangun dengan Next.js
          </div>
        </div>
      </div>
    </div>
  );
}
