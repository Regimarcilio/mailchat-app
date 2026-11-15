'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMailChatStore } from '@/store/useMailChatStore';

export default function MinimalLoginPage() {
  const router = useRouter();
  const setContaConectada = useMailChatStore((s) => s.setContaConectada);
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    const token = 'token_' + Date.now();
    const nome = email.split('@')[0];
    
    setContaConectada({ email, nome, token });
    localStorage.setItem('mailchat_token', token);
    localStorage.setItem('mailchat_user_email', email);
    
    // Force redirect
    window.location.href = '/';
  };

  const handleQuickLogin = () => {
    const quickEmail = 'demo@' + Math.random().toString(36).substring(7) + '.com';
    setEmail(quickEmail);
    handleLogin({} as React.FormEvent);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>MailChat</h1>
        <p style={styles.subtitle}>Cliente de e-mail estilo WhatsApp</p>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.primaryBtn}>Continuar</button>
          <button type="button" onClick={handleQuickLogin} style={styles.secondaryBtn}>
            Login rápido
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh' as const,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f4f8 100%)'
  } as const,
  card: {
    background: 'white' as const,
    borderRadius: '16px' as const,
    padding: '48px' as const,
    maxWidth: '400px' as const,
    width: '100%' as const,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' as const
  } as const,
  title: {
    fontSize: '28px' as const,
    fontWeight: 700 as const,
    color: '#1f2937' as const,
    margin: '0 0 8px' as const
  } as const,
  subtitle: {
    fontSize: '14px' as const,
    color: '#6b7280' as const,
    textAlign: 'center' as const
  } as const,
  input: {
    width: '100%' as const,
    padding: '12px 16px' as const,
    fontSize: '16px' as const,
    border: '1px solid #e5e7eb' as const,
    borderRadius: '8px' as const,
    marginBottom: '16px' as const,
    outline: 'none' as const
  } as const,
  primaryBtn: {
    width: '100%' as const,
    padding: '12px 16px' as const,
    fontSize: '16px' as const,
    fontWeight: 500 as const,
    color: 'white' as const,
    backgroundColor: '#2563eb' as const,
    border: 'none' as const,
    borderRadius: '8px' as const,
    cursor: 'pointer' as const,
    marginBottom: '12px' as const
  } as const,
  secondaryBtn: {
    width: '100%' as const,
    padding: '12px 16px' as const,
    fontSize: '14px' as const,
    color: '#6b7280' as const,
    backgroundColor: '#f3f4f6' as const,
    border: '1px solid #d1d5db' as const,
    borderRadius: '8px' as const,
    cursor: 'pointer' as const
  } as const
};
