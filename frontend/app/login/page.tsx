'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useMailChatStore } from '@/store/useMailChatStore';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface GmailProfile {
  emailAddress: string;
  name: string;
}

interface GmailLabel {
  id: string;
  name: string;
}

interface GmailMessage {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet: string;
  date?: string;
  from?: string;
  subject?: string;
}

// Fetch Gmail profile
async function fetchGmailProfile(): Promise<GmailProfile> {
  const response = await fetch('/api/gmail/profile', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}

// Fetch Gmail labels
async function fetchGmailLabels(): Promise<GmailLabel[]> {
  const response = await fetch('/api/gmail/labels', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch labels');
  return response.json();
}

// Fetch recent messages
async function fetchRecentMessages(): Promise<GmailMessage[]> {
  const response = await fetch('/api/gmail/messages?maxResults=20', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
}

export default function LoginPage() {
  const router = useRouter();
  const setContaConectada = useMailChatStore((s) => s.setContaConectada);
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // React Query hooks for data fetching
  const profileQuery = useQuery({
    queryKey: ['gmail-profile'],
    queryFn: fetchGmailProfile,
    enabled: false, // Will be enabled after login
  });

  const labelsQuery = useQuery({
    queryKey: ['gmail-labels'],
    queryFn: fetchGmailLabels,
    enabled: false,
  });

  const messagesQuery = useQuery({
    queryKey: ['gmail-messages'],
    queryFn: fetchRecentMessages,
    enabled: false,
  });

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787';
      const response = await fetch(`${backendUrl}/api/auth/google`, {
        method: 'GET',
        redirect: 'manual',
      });

      if (response.redirected) {
        localStorage.setItem('mailchat_temp_email', email);
        window.location.href = response.headers.get('Location') || '';
      }
    } catch (error) {
      toast.error('Erro ao iniciar login Google');
      setIsLoggingIn(false);
    }
  };

  const handleGuestLogin = async () => {
    if (!email) {
      toast.error('Digite seu e-mail primeiro');
      return;
    }

    setIsLoggingIn(true);

    try {
      // Store email and trigger the OAuth2 flow simulation
      localStorage.setItem('mailchat_temp_email', email);
      
      // Fetch profile (will use mock data if not authenticated with Google)
      let profile: GmailProfile | null = null;
      let labels: GmailLabel[] = [];
      let messages: GmailMessage[] = [];

      try {
        // Try to fetch real Gmail data
        const profileData = await fetch('/api/gmail/profile', { credentials: 'include' });
        if (profileData.ok) {
          profile = await profileData.json();
        }
      } catch {}

      try {
        const labelsData = await fetch('/api/gmail/labels', { credentials: 'include' });
        if (labelsData.ok) {
          labels = await labelsData.json();
        }
      } catch {}

      try {
        const messagesData = await fetch('/api/gmail/messages?maxResults=20', { credentials: 'include' });
        if (messagesData.ok) {
          messages = await messagesData.json();
        }
      } catch {}

      // If no real data, use mock data for guest mode
      if (!profile) {
        profile = { emailAddress: email, name: email.split('@')[0] };
        labels = [
          { id: 'INBOX', name: 'Recebidos' },
          { id: 'SENT', name: 'Enviados' },
          { id: 'DRAFTS', name: 'Rascunhos' },
          { id: 'TRASH', name: 'Lixeira' },
          { id: 'SPAM', name: 'Spam' }
        ];
        messages = [
          { id: '1', threadId: '1', snippet: 'Mensagem de boas-vindas', from: 'noreply@mailchat.app', subject: 'Bem-vindo ao MailChat!', date: new Date().toISOString() },
          { id: '2', threadId: '2', snippet: 'Configure sua conta', from: 'support@mailchat.app', subject: 'Configuração da conta', date: new Date().toISOString() }
        ];
      }

      // Set the user data
      setContaConectada({
        email: profile.emailAddress,
        nome: profile.name,
        token: 'guest_token_' + Date.now(),
      });

      localStorage.setItem('mailchat_token', 'guest_token_' + Date.now());
      localStorage.setItem('mailchat_user_email', profile.emailAddress);

      // Store fetched data in the store
      // Note: In production, this would be done via the store's state management

      router.push('/');
    } catch (error) {
      toast.error('Erro ao entrar');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">MailChat</h1>
          <p className="text-sm text-gray-600">Cliente de e-mail estilo WhatsApp</p>
        </div>

        <div className="space-y-3">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-base focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Conectando...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 533.5 544.3">
                <path
                  fill="#4285F4"
                  d="M533.5 278.5c0-18.5-1.5-36.6-4.3-54.2L311.7 138a131.3 131.3 0 00-55.6-37l-5.5-2c-6.5-2-13.4-2-19.9 0l-5.5 2-55.6 37-5.5 2c-6.5 2-13.4 2-19.9 0L99.3 138 85.1 116.6c-6.5-2-13.4-2-19.9 0l-5.5 2C57.8 140.5 44 161.3 44 181.5v17.8c0 21.3 13.1 41.4 34.2 48.4l-5.5 2-26 18.6-2.5 1.8c-6.5 2-13.4 2-19.9 0L4.3 218.3c-8.5 3.2-13.8 11.5-12.4 20l5.5 32.5c4.6 27.1 24.1 47.1 50.4 51.5l-5.5 2c-1.5 8-1.5 16.3 0 24.2l5.5 32.5c-6.5 8-6.5 18.7 0 26.7l5.5 32.5c8.5 3.2 13.8 11.5 12.4 20l-5.5 32.5c-4.6 27.1-24.1 47.1-50.4 51.5l5.5 2c13.5 1.7 27-1.4 38.5-10.5l57.7-40.8 5.5-2c6.5-2 13.4-2 19.9 0l5.5 2 55.6-38c25.8-17.6 41.4-46.4 41.4-77.8V278.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M432 166.7c-8.4-2.8-17.4-5-26-7-18-5.1-35.9-12.7-52.3-22.6l-5.2-3.1c-4.2-2.5-11.3-2.5-15.5 0L258 166.7v-6.1c0-7.7 3.3-13.9 7.2-18.6l5.3-5.7c3.5-2.8 8.3-3.1 11.9-1l5.3 5.7 57.7 40.7c14.1 10 28.3 17.7 41.4 22.4l-5.2 3z"
                />
                <path
                  fill="#34A853"
                  d="M91.5 278.5c3.8-13.1 12.2-25.4 25-33.1l-5.5-2-31.4-21.8C36.9 218 43.7 189.5 62.3 168.1l5.5 3.8c3.5 2.4 7.9 3.7 11.9 2.8l5.5-1.5c6.5-2 13.4-2 19.9 0l5.5 2 55.6-37c12.3-8.6 21.5-22.1 26.2-38.2l5.5-2c6.5-2 13.4-2 19.9 0l5.5 2 55.6 37c12.3 8.6 21.5 22.1 26.2 38.2l5.5 2c3.5 2.4 7.1 3.7 11.9 2.8l5.5-1.5c6.5-2 13.4-2 19.9 0l5.5 2 55.6 37c13.9 9.6 24.1 25.8 29.1 44.2l5.5 20.3 1.5 5.5 5.5 20.3c1.5 5.5 5.5 9.5 11.1 10.3 3.5 0.4 7.1 0.1 10.6-0.7 2.6-0.6 5.2-1.6 7.7-2.7l5.5-2.6 5.5 2.6c2.6 1.2 5.2 2.1 7.8 2.7l5.5 2.6 5.5-2.6 5.5 2.6c2.6 1.2 5.2 2.1 7.8 2.7l5.5 2.6-5.5 3.1c-4.9 9.4-14.1 16.3-24.5 19.9l-5.5 3.1 5.5 3.1c2.6 1.2 5.2 2.1 7.8 2.7l5.5 2.6-5.5 3.1c-4.9 9.4-14.1 16.3-24.5 19.9l-5.5 3.1c-6.5 2-13.4 2-19.9 0l-5.5-2-55.6 37c-8.1 4.9-16.5 9.1-24.9 12.5l-5.5 2c-6.5 2-13.4 2-19.9 0l-5.5-2C100.1 286.3 95.9 281 91.5 278.5z"
                />
              </svg>
              Continuar com Google
            </div>
          )}
        </button>

        <button
          onClick={handleGuestLogin}
          disabled={isLoggingIn}
          className="w-full inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Entrar como convidado
        </button>

        <p className="text-xs text-gray-500 text-center">
          Ao continuar, você aceita nossos{' '}
          <a href="/termos" className="text-purple-600 hover:underline">
            Termos de Serviço
          </a>{' '}
          e{' '}
          <a href="/privacidade" className="text-purple-600 hover:underline">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
}
