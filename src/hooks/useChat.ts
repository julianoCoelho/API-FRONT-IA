interface Message {
  id: string;
  chatSessionId: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  timestamp: string;
}

interface Session {
  id: string;
  title: string;
  createdAt: string;
}

export function useChat() {
  const sessions: Session[] = [
    { id: '1', title: 'Nova conversa', createdAt: new Date().toISOString() },
  ];

  const activeSession: Session | null = sessions[0];

  const messages: Message[] = [
    {
      id: 'm1',
      chatSessionId: '1',
      role: 'ASSISTANT',
      content: 'Olá! Como posso ajudar você hoje?',
      timestamp: new Date().toISOString(),
    },
  ];

  const isLoading = false;

  const sendMessage = async (_content: string) => {
    /* mock */
  };

  const createSession = async (_title: string) => {
    /* mock */
  };

  const selectSession = (_id: string) => {
    /* mock */
  };

  return { sessions, activeSession, messages, sendMessage, createSession, selectSession, isLoading };
}
