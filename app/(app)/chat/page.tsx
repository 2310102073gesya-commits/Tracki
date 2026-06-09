'use client';
import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'model';
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Halo! Saya Tracki AI, asisten keuangan pribadimu. 😊\n\nAda yang bisa saya bantu hari ini? Mau tanya soal target nabung beli laptop, tips hemat, atau hukum PayLater?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke pesan terbaru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Tambahkan pesan user ke UI
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Siapkan history untuk dikirim ke API (tanpa pesan pertama yang hanya sapaan UI)
      const history = messages.slice(1).map(m => ({ role: m.role, text: m.text }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Gagal mengirim pesan');

      // Tambahkan balasan AI ke UI
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Maaf, terjadi kesalahan pada koneksi. Boleh coba lagi kak?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="page active" id="page-chat" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <div className="page-title">Asisten AI 💬</div>
      <div className="page-sub">Konsultasikan keuangan & target tabungan Anda</div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', marginTop: '10px' }}>
        
        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-dim)' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: msg.role === 'user' ? 'var(--blue)' : 'var(--pink)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', flexShrink: 0
              }}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div style={{
                background: msg.role === 'user' ? 'var(--blue-dim)' : 'var(--bg)',
                border: msg.role === 'model' ? '1px solid var(--border)' : 'none',
                padding: '10px 14px',
                borderRadius: '12px',
                borderTopRightRadius: msg.role === 'user' ? '2px' : '12px',
                borderTopLeftRadius: msg.role === 'model' ? '2px' : '12px',
                maxWidth: '80%',
                fontSize: '13.5px',
                lineHeight: '1.5',
                color: 'var(--text)',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🤖</div>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: '12px', borderTopLeftRadius: '2px', fontSize: '13.5px', color: 'var(--muted)', display: 'flex', gap: '4px' }}>
                <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                <span style={{ animation: 'pulse 1s infinite 0.2s' }}>●</span>
                <span style={{ animation: 'pulse 1s infinite 0.4s' }}>●</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '12px 16px', background: 'var(--bg)', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Tanya soal nabung, budget, atau cicilan..."
            style={{
              flex: 1,
              background: 'var(--bg-dim)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '10px 16px',
              fontSize: '13.5px',
              color: 'var(--text)',
              resize: 'none',
              minHeight: '40px',
              maxHeight: '100px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            rows={1}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: input.trim() && !isLoading ? 'var(--pink)' : 'var(--border2)',
              color: '#fff', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s', flexShrink: 0
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
