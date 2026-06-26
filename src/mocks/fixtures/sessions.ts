export interface MockSession {
  id: string
  title: string
  createdAt: string
}

export const sessions: MockSession[] = [
  {
    id: 'sess-001-aaaa-bbbb-cccc-ddddeeee0001',
    title: 'Nova conversa',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sess-001-aaaa-bbbb-cccc-ddddeeee0002',
    title: 'Dúvidas sobre TypeScript',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]
