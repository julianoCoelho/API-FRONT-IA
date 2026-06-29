export interface MockSession {
  id: string
  title: string
  createdAt: string
}

function getUserKey(suffix: string): string {
  const user = localStorage.getItem('current_user') ?? 'anonymous'
  return `msw_${user}_${suffix}`
}

const DEFAULT_SESSIONS: MockSession[] = [
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

export function loadSessions(): MockSession[] {
  try {
    const stored = localStorage.getItem(getUserKey('sessions'))
    if (stored) return JSON.parse(stored) as MockSession[]
  } catch { /* ignora */ }
  return structuredClone(DEFAULT_SESSIONS)
}

export function saveSessions(data: MockSession[]): void {
  try {
    localStorage.setItem(getUserKey('sessions'), JSON.stringify(data))
  } catch { /* ignora */ }
}

export const sessions: MockSession[] = loadSessions()

export function addSession(session: MockSession): void {
  sessions.unshift(session)
  saveSessions(sessions)
}

export function removeSession(id: string): void {
  const idx = sessions.findIndex((s) => s.id === id)
  if (idx !== -1) {
    sessions.splice(idx, 1)
    saveSessions(sessions)
  }
}

export function renameSessionInStore(id: string, title: string): void {
  const session = sessions.find((s) => s.id === id)
  if (session) {
    session.title = title
    saveSessions(sessions)
  }
}
