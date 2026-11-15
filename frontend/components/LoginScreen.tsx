'use client';

import { useState } from 'react';
import { useMailChatStore } from '@/store/useMailChatStore';
import { Toaster, toast } from 'react-hot-toast';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const setContaConectada = useMailChatStore((s) => s.setContaConectada);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    
    try {
      // Simulação OAuth2 - em produção, substituir por verdadeiro OAuth2
      // const response = await fetch('/api/auth/google', { method: 'GET' });
      
      // Simulação de sucesso
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em produção: tratar callback do OAuth2 com token
      setContaConectada({
        email: email || 'user@example.com',
        nome: 'Usuario Teste',
        token: 'mock_token_' + Date.now(),
      });
      
      toast.success('Login realizado com sucesso!');
      onLoginSuccess();
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSimulatedGoogleLogin = () => {
    if (!email) {
      toast.error('Digite seu e-mail primeiro');
      return;
    }
    handleGoogleLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        {/* Logo EX Technologies */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">MailChat</h1>
          <p className="text-sm text-gray-600">Cliente de e-mail estilo WhatsApp</p>
        </div>
        
        {/* Email Input */}
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
        
        {/* Google Button */}
        <button
          onClick={handleSimulatedGoogleLogin}
          disabled={isLoggingIn}
          className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? (
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-purple-500"></div>
              Conectando...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {/* Google Icon SVG */}
              <svg className="mr-2 h-5 w-5" viewBox="0 0 533.5 544.3">
                <path
                  fill="#4285F4"
                  d="M533.5 278.5c0-18.5-1.5-36.6-4.3-54.2L311.7 138a131.3 131.3 0 00-55.6-37l-5.5-2c-6.5-2-13.4-2-19.9 0l-5.5 2-55.6 37-5.5 2c-6.5 2-13.4 2-19.9 0L99.3 138 85.1 116.6c-6.5-2-13.4-2-19.9 0l-5.5 2C57.8 140.5 44 161.3 44 181.5v17.8c0 21.3 13.1 41.4 34.2 48.4l-5.5 2-5.5 2-26 18.6-2.5 1.8c-6.5 2-13.4 2-19.9 0L4.3 218.3c-8.5 3.2-13.8 11.5-12.4 20l5.5 32.5c4.6 27.1 24.1 47.1 50.4 51.5l-5.5 2c-1.5 8-1.5 16.3 0 24.2l5.5 32.5c-6.5 8-6.5 18.7 0 26.7l5.5 6.3c4.6 27.1 24.1 47.1 50.4 51.5l-5.5 2c6.5 8 6.5 18.7 0 26.7l5.5 32.5c8.5 3.2 13.8 11.5 12.4 20l-5.5 32.5c-4.6 27.1-24.1 47.1-50.4 51.5l5.5 2c13.5 1.7 27-1.4 38.5-10.5l57.7-40.8 5.5-2c6.5-2 13.4-2 19.9 0l5.5 2 55.6-38c25.8-17.6 41.4-46.4 41.4-77.8V278.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M432 166.7c-8.4-2.8-17.4-5-26-7-18-5.1-35.9-12.7-52.3-22.6l-5.2-3.1c-4.2-2.5-11.3-2.5-15.5 0L258 166.7v-6.1c0-7.7 3.3-13.9 7.2-18.6l5.3-5.7c3.5-2.8 8.3-3.1 11.9-1l5.3 5.7 57.7 40.7c14.1 10 28.3 17.7 41.4 22.4l-5.2 3z"
                />
                <path
                  fill="#34A853"
                  d="M91.5 278.5c3.8-13.1 12.2-25.4 25-33.1l-5.5-2-31.4-21.8C36.9 218 43.7 189.5 62.3 168.1l5.5 3.8c3.5 2.4 7.9 3.7 11.9 2.8l5.5-1.5c9.4-2.7 19.5-6.5 29-11.6l5.5-3.1 5.5 3.1c7.3 4.1 14.6 8.7 21.8 13.3l5.5 3.2c1.5 1 3.1 1.1 4.6 0l5.5-3c6.5-3.8 13.4-7.8 20-11.6l5.5-3.1 5.5 3.1c9.4 5.4 19.5 9.6 29.4 12.7l5.5 1.9c20 7.2 30.7 28.9 22.4 49.3l-5.5 16.5-1.5 5.5-5.5 16.5c-2.7 9.5-11.9 15.7-22.3 12.5L158.4 308.5c-9.4-3.1-19.5-7-29-11.6l-5.5-3.1C100.1 286.3 95.9 281 91.5 278.5z"
                />
                <path
                  fill="#EA4335"
                  d="M432 166.7c-18.4-11.8-42.1-18.9-67-18.9-20.9 0-40.3 6.6-55.3 17.8l-5.5-3.1-5.5 3.1L160 166.7v6.1c0 15.7 6.1 30.5 16.9 41.9l-5.5 16.5-1.5 5.5-5.5 16.5c-4.2 13.1-2.7 27.5 3.7 39.3l5.5-3.1c-1.5 7.1-1.5 14.3 0 21.4l-5.5 16.5c-5.9 11.9-4.6 27.8 4.4 39.3l5.5-3.1 5.5 3.1c3.5 2.1 7.1 4.3 11.1 5.5 14.7 4.6 29.7 7.1 45 7.1 23.5 0 46.5-6.9 65.6-18.9l55.7-40.6 5.5-2c6.5-2 13.4-2 19.9 0l5.5 2c28.1 10.3 41.7 43.1 25.8 70.2l-5.5 9.7z"
                />
              </svg>
              Continuar com Google
            </div>
          )}
        </button>
        
        {/* Terms */}
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
