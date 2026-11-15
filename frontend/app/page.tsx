'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailChat } from '@/components/MailChat';
import { useMailChatStore } from '@/store/useMailChatStore';

export default function Home() {
  const router = useRouter();
  const setContaConectada = useMailChatStore((s) => s.setContaConectada);
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Always check authentication FIRST
    const token = localStorage.getItem('mailchat_token');
    const tempEmail = localStorage.getItem('mailchat_temp_email');

    if (token || tempEmail) {
      // Authenticated - load user and show app
      if (tempEmail) {
        setContaConectada({
          email: tempEmail,
          nome: tempEmail.split('@')[0],
          token: 'guest_token_' + Date.now(),
        });
        localStorage.setItem('mailchat_token', 'guest_token_' + Date.now());
        localStorage.removeItem('mailchat_temp_email');
      } else {
        const email = localStorage.getItem('mailchat_user_email') || 'guest@mailchat.app';
        setContaConectada({
          email,
          nome: email.split('@')[0],
          token,
        });
      }
      setIsRedirecting(false);
    } else {
      // NOT authenticated - FORCE redirect to login
      console.log('No token found, redirecting to /login');
      router.replace('/login');
    }
  }, [router, setContaConectada]);

  // Show loading while redirecting
  if (isRedirecting) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-purple-500"></div>
      </div>
    );
  }

  // Show the app only when authenticated
  return <MailChat />;
}
