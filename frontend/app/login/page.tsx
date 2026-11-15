'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMailChatStore } from '@/store/useMailChatStore';

export default function LoginPage() {
  const router = useRouter();
  const setContaConectada = useMailChatStore((s) => s.setContaConectada);
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      alert('Digite um e-mail');
      return;
    }

    const token = 'token_' + Date.now();
    const nome = email.split('@')[0];
    
    setContaConectada({ email, nome, token });
    localStorage.setItem('mailchat_token', token);
    localStorage.setItem('mailchat_user_email', email);
    
    // Use router for Next.js navigation
    router.push('/');
  };

  const handleRandomEmail = () => {
    const random = Math.random().toString(36).substr(2, 6);
    setEmail('user' + random + '@mail.com');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f3f4f6',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '360px',
        width: '100%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '32px'
        }}>
          MailChat
        </h1>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              outline: 'none',
              marginBottom: '16px'
            }}
            required
          />
          
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Entrar
          </button>
          
          <button type="button" onClick={handleRandomEmail} style={{
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '8px'
          }}>
            Usar e-mail aleatório
          </button>
        </form>
      </div>
    </div>
  );
}
