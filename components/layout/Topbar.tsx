'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const HARI = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function Topbar() {
  const [time, setTime] = useState('');
  const [day, setDay] = useState('');
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('Memuat...');

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const h = String(n.getHours()).padStart(2,'0');
      const m = String(n.getMinutes()).padStart(2,'0');
      const s = String(n.getSeconds()).padStart(2,'0');
      setTime(`${h}:${m}:${s}`);
      setDay(HARI[n.getDay()]);
      setCurrentDate(`${n.getDate()} ${BULAN[n.getMonth()]} ${n.getFullYear()}`);
      
      const hr = n.getHours();
      let greet = 'Selamat malam! 🌙';
      if (hr >= 4 && hr < 11) greet = 'Selamat pagi! 👋';
      else if (hr >= 11 && hr < 15) greet = 'Selamat siang! ☀️';
      else if (hr >= 15 && hr < 18) greet = 'Selamat sore! 🌆';
      setGreeting(greet);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="topbar">
      <div>
        <div className="topbar-greeting">{greeting}</div>
        <div className="topbar-title">Tracki Syariah</div>
      </div>
      <div className="topbar-right">
        <div className="clock">
          <div className="clock-day">{day}</div>
          <div className="clock-time">{time}</div>
        </div>
        <div className="syariah-pill">🌙 Syariah Mode</div>
        <div className="month-sel">📅 {currentDate}</div>
        <Link href="/transactions" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          + Catat
        </Link>
      </div>
    </div>
  );
}
