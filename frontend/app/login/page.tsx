'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { useMailChatStore } from '@/store/useMailChatStore';

export default function LoginPage() {
  const router = useRouter();
  const setContaConectada = useMailChatStore((s) => s.setContaConectada);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Digite seu e-mail');
      return;
    }

    setIsLoading(true);

    // Set user as logged in
    setContaConectada({
      email,
      nome: email.split('@')[0],
      token: 'demo_token_' + Date.now(),
    });

    // Store token
    localStorage.setItem('mailchat_token', 'demo_token_' + Date.now());
    localStorage.setItem('mailchat_user_email', email);

    // Redirect to main app
    setTimeout(() => {
      router.push('/');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f4f8 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif'
    }}>
      <Toaster position="top-center" />
      
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 10px -2px rgba(0,0,0,0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 8px'
          }}>
            MailChat
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Cliente de e-mail estilo WhatsApp
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: '#f9fafb'
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = '#3b82f6';
                (e.target as HTMLInputElement).style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = '#e5e7eb';
                (e.target as HTMLInputElement).style.backgroundColor = '#f9fafb';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#ffffff',
              backgroundColor: isLoading ? '#6b7280' : '#2563eb',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: '16px'
            }}
          >
            {isLoading ? 'Entrando...' : 'Continuar'}
          </button>

          <button
            type="button"
            onClick={() => {
              if (email) handleLogin({} as React.FormEvent);
              else {
                setEmail('convidado@mailchat.app');
                toast.success('E-mail preenchido! Clique novamente');
              }
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Usar e-mail aleatório
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '12px 16px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#1e40af'
        }}>
          <strong>Modo Demo:</strong> Funciona sem configuração de Google. Para login real com Gmail, configure as credenciais.
        </div>
      </div>
    </div>
  );
}
