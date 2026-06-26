export interface MockMessage {
  id: string
  chatSessionId: string
  role: 'USER' | 'ASSISTANT'
  content: string
  timestamp: string
}

export const messagesBySession: Record<string, MockMessage[]> = {
  'sess-001-aaaa-bbbb-cccc-ddddeeee0001': [
    {
      id: 'msg-001-xxxx-yyyy-zzzz-000000000001',
      chatSessionId: 'sess-001-aaaa-bbbb-cccc-ddddeeee0001',
      role: 'ASSISTANT',
      content: 'Olá! Como posso ajudar você hoje?',
      timestamp: new Date().toISOString(),
    },
  ],
  'sess-001-aaaa-bbbb-cccc-ddddeeee0002': [
    {
      id: 'msg-002-xxxx-yyyy-zzzz-000000000001',
      chatSessionId: 'sess-001-aaaa-bbbb-cccc-ddddeeee0002',
      role: 'USER',
      content: 'O que é uma interface no TypeScript?',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'msg-002-xxxx-yyyy-zzzz-000000000002',
      chatSessionId: 'sess-001-aaaa-bbbb-cccc-ddddeeee0002',
      role: 'ASSISTANT',
      content: 'Uma interface no TypeScript é uma forma de definir a estrutura de um objeto, especificando quais propriedades e métodos ele deve conter.',
      timestamp: new Date(Date.now() - 86300000).toISOString(),
    },
  ],
}

export function getMessagesBySessionId(sessionId: string): MockMessage[] {
  return messagesBySession[sessionId] ?? []
}

export function addMessage(message: MockMessage): void {
  const existing = messagesBySession[message.chatSessionId]
  if (existing) {
    existing.push(message)
  } else {
    messagesBySession[message.chatSessionId] = [message]
  }
}
