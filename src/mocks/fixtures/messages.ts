export interface MockMessage {
  id: string
  chatSessionId: string
  role: 'USER' | 'ASSISTANT'
  content: string
  timestamp: string
}

function getUserKey(suffix: string): string {
  const user = localStorage.getItem('current_user') ?? 'anonymous'
  return `msw_${user}_${suffix}`
}

const DEFAULT_MESSAGES: Record<string, MockMessage[]> = {
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
      content: 'Uma interface no TypeScript é uma forma de definir a estrutura de um objeto.',
      timestamp: new Date(Date.now() - 86300000).toISOString(),
    },
  ],
}

export function loadMessages(): Record<string, MockMessage[]> {
  try {
    const stored = localStorage.getItem(getUserKey('messages'))
    if (stored) return JSON.parse(stored) as Record<string, MockMessage[]>
  } catch { /* ignora */ }
  return structuredClone(DEFAULT_MESSAGES)
}

export function saveMessages(data: Record<string, MockMessage[]>): void {
  try {
    localStorage.setItem(getUserKey('messages'), JSON.stringify(data))
  } catch { /* ignora */ }
}

export const messagesBySession: Record<string, MockMessage[]> = loadMessages()

export function getMessagesBySessionId(sessionId: string): MockMessage[] {
  return messagesBySession[sessionId] ?? []
}

export function addMessage(message: MockMessage): void {
  if (!messagesBySession[message.chatSessionId]) {
    messagesBySession[message.chatSessionId] = []
  }
  messagesBySession[message.chatSessionId].push(message)
  saveMessages(messagesBySession)
}

export function deleteMessagesBySessionId(sessionId: string): void {
  delete messagesBySession[sessionId]
  saveMessages(messagesBySession)
}
