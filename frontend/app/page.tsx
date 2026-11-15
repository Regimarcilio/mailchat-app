'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMailChatStore } from '@/store/useMailChatStore';
import { MailChat } from '@/components/MailChat';

export default function Home() {
  const router = useRouter();
  const setContaConectada = useMailChatStore((s) => s.setContaConectada);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('mailchat_token');
    const email = localStorage.getItem('mailchat_user_email');

    if (token && email) {
      setContaConectada({
        email,
        nome: email.split('@')[0],
        token
      });
    }
    
    setReady(true);
  }, [setContaConectada]);

  if (!ready) return null;

  // Check auth
  const token = localStorage.getItem('mailchat_token');
  const email = localStorage.getItem('mailchat_user_email');

  if (!token || !email) {
    router.replace('/login');
    return null;
  }

  return <MailChat />;
}
