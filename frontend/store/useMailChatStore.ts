'use client';

import { create } from 'zustand';

interface Usuario {
  email: string;
  nome: string;
  token: string;
}

interface MailChatStore {
  tema: string;
  setTema: (tema: string) => void;
  configuracoesAbertas: boolean;
  abrirConfiguracoes: () => void;
  fecharConfiguracoes: () => void;
  usuario: Usuario | null;
  setContaConectada: (usuario: Usuario) => void;
  desconectar: () => void;
  contatoSelecionadoId: number | null;
  selecionarContato: (id: number | null) => void;
  agendaAberta: boolean;
  alternarAgenda: () => void;
  diaSelecionado: string;
  selecionarDia: (dia: string) => void;
}

export const useMailChatStore = create<MailChatStore>()((set) => ({
  tema: 'whatsapp',
  setTema: (tema: string) => {
    set({ tema });
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = tema;
    }
  },
  configuracoesAbertas: false,
  abrirConfiguracoes: () => set({ configuracoesAbertas: true }),
  fecharConfiguracoes: () => set({ configuracoesAbertas: false }),
  usuario: null,
  setContaConectada: (usuario: Usuario) => set({ usuario }),
  desconectar: () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('mailchat_token');
      localStorage.removeItem('mailchat_user_email');
    }
    set({ usuario: null });
  },
  contatoSelecionadoId: 1,
  selecionarContato: (id: number | null) => set({ contatoSelecionadoId: id }),
  agendaAberta: true,
  alternarAgenda: () => set((s) => ({ agendaAberta: !s.agendaAberta })),
  diaSelecionado: '2026-11-13',
  selecionarDia: (dia: string) => set({ diaSelecionado: dia }),
}));
