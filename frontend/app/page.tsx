'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailChat } from '@/components/MailChat';
import { LoginScreen } from '@/components/LoginScreen';
import { useMailChatStore } from '@/store/useMailChatStore';

export default function Home() {
  const router = useRouter();
  const setContaConectada = useMailChatStore((s) => s.setContaConectada);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('mailchat_token');
    const tempEmail = localStorage.getItem('mailchat_temp_email');

    if (token) {
      // Authenticated - show main app
      setIsCheckingAuth(false);
    } else if (tempEmail) {
      // Simulate login for development/testing
      setContaConectada({
        email: tempEmail,
        nome: tempEmail.split('@')[0],
        token: 'mock_token_' + Date.now(),
      });
      localStorage.setItem('mailchat_token', 'mock_token_' + Date.now());
      localStorage.removeItem('mailchat_temp_email');
      setIsCheckingAuth(false);
    } else {
      // Not authenticated - will show login via middleware
      setIsCheckingAuth(false);
    }
  }, [router, setContaConectada]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-purple-500"></div>
      </div>
    );
  }

  // Check authentication status from store
  const contatoSelecionadoId = useMailChatStore((s) => s.contatoSelecionadoId);

  // If no contacts loaded, show login
  if (!contatoSelecionadoId) {
    return <LoginScreen onLoginSuccess={() => window.location.href = '/'} />;
  }

  return <MailChat />;
}
