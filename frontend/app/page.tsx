'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMailChatStore } from '@/store/useMailChatStore';
import { MailChat } from '@/components/MailChat';

export default function Home() {
  const router = useRouter();
  const setContaConectada = useMailChatStore((s) => s.setContaConectada);
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Always check authentication
    const token = localStorage.getItem('mailchat_token');
    const email = localStorage.getItem('mailchat_user_email');

    if (token && email) {
      // Authenticated - set user
      setContaConectada({
        email,
        nome: email.split('@')[0],
        token,
      });
      setIsRedirecting(false);
    } else {
      // Not authenticated - redirect to login
      console.log('No auth found, redirecting to login');
      router.replace('/login');
    }
  }, [router, setContaConectada]);

  if (isRedirecting) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#6b7280'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #d1d5db',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Carregando...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show the app
  return <MailChat />;
}
