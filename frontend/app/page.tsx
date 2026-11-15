'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailChat } from '@/components/MailChat';
import { useMailChatStore } from '@/store/useMailChatStore';

export default function Home() {
  const router = useRouter();
  const setContaConectada = useMailChatStore((s) => s.setContaConectada);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mailchat_token');
    const tempEmail = localStorage.getItem('mailchat_temp_email');

    if (token) {
      // Authenticated - load user
      const email = localStorage.getItem('mailchat_user_email') || 'guest@mailchat.app';
      setContaConectada({
        email,
        nome: email.split('@')[0],
        token,
      });
      setIsCheckingAuth(false);
    } else if (tempEmail) {
      // Guest login simulation
      setContaConectada({
        email: tempEmail,
        nome: tempEmail.split('@')[0],
        token: 'guest_token_' + Date.now(),
      });
      localStorage.setItem('mailchat_token', 'guest_token_' + Date.now());
      localStorage.setItem('mailchat_user_email', tempEmail);
      localStorage.removeItem('mailchat_temp_email');
      setIsCheckingAuth(false);
    } else {
      // Not authenticated - redirect to login
      router.replace('/login');
    }
  }, [router, setContaConectada]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-purple-500"></div>
      </div>
    );
  }

  return <MailChat />;
}
