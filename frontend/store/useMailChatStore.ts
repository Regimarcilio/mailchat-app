'use client';

import { create } from 'zustand';

interface Usuario {
  email: string;
  nome: string;
  token: string;
}

interface ToastMsg {
  id: number;
  texto: string;
  tipo: 'info' | 'success' | 'error' | 'warning';
}

interface MailChatStore {
  tema: string;
  setTema: (tema: string) => void;
  configuracoesAbertas: boolean;
  abrirConfiguracoes: () => void;
  fecharConfiguracoes: () => void;
  postitModalAberto: boolean;
  postitEmailPreset: number | null;
  abrirPostit: (emailId: number | null) => void;
  fecharPostit: () => void;
  contatoSelecionadoId: number | null;
  selecionarContato: (id: number | null) => void;
  agendaAberta: boolean;
  alternarAgenda: () => void;
  diaSelecionado: string;
  selecionarDia: (dia: string) => void;
  chatMobileAberto: boolean;
  abrirChatMobile: () => void;
  fecharChatMobile: () => void;
  toasts: ToastMsg[];
  notificar: (texto: string) => void;
  dismissToast: (id: number) => void;
  
  // Authentication fields
  usuario: Usuario | null;
  setContaConectada: (usuario: Usuario) => void;
  desconectar: () => void;
}

let toastSeq = 1;

export const useMailChatStore = create<MailChatStore>()((set) => ({
  tema: 'whatsapp',
  setTema: (tema) => {
    set({ tema });
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = tema;
    }
  },
  configuracoesAbertas: false,
  abrirConfiguracoes: () => set({ configuracoesAbertas: true }),
  fecharConfiguracoes: () => set({ configuracoesAbertas: false }),
  postitModalAberto: false,
  postitEmailPreset: null,
  abrirPostit: (emailId) => set({ postitModalAberto: true, postitEmailPreset: emailId }),
  fecharPostit: () => set({ postitModalAberto: false, postitEmailPreset: null }),
  contatoSelecionadoId: 1,
  selecionarContato: (id) => set({ contatoSelecionadoId: id }),
  agendaAberta: true,
  alternarAgenda: () => set((s) => ({ agendaAberta: !s.agendaAberta })),
  diaSelecionado: '2026-11-13',
  selecionarDia: (dia) => set({ diaSelecionado: dia }),
  chatMobileAberto: false,
  abrirChatMobile: () => set({ chatMobileAberto: true }),
  fecharChatMobile: () => set({ chatMobileAberto: false }),
  toasts: [],
  notificar: (texto) => {
    const id = toastSeq++;
    set((s) => ({
      toasts: [...s.toasts, { id, texto, tipo: 'info' }],
    }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },
  dismissToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
  
  // Authentication methods
  usuario: null,
  setContaConectada: (usuario) => set({ usuario }),
  desconectar: () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('mailchat_token');
      localStorage.removeItem('mailchat_user_email');
    }
    set({ usuario: null });
  },
}));
