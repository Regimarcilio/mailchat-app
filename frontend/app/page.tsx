'use client';

import { useEffect, useState } from 'react';
import { useMailChatStore } from '@/store/useMailChatStore';
import { MailChat } from '@/components/MailChat';

export default function Home() {
  const setContaConectada = useMailChatStore((s) => s.setContaConectada);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Always redirect to login if no token
    const token = localStorage.getItem('mailchat_token');
    const email = localStorage.getItem('mailchat_user_email');

    if (token && email) {
      setContaConectada({
        email,
        nome: email.split('@')[0],
        token
      });
      setReady(true);
    } else {
      // Redirect to login
      setReady(true);
    }
  }, [setContaConectada]);

  if (!ready) return null;

  // Check auth again before showing app
  const token = localStorage.getItem('mailchat_token');
  const email = localStorage.getItem('mailchat_user_email');

  if (!token || !email) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return <MailChat />;
}
