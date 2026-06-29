export interface MockUser {
  id: string
  username: string
  password: string
  email?: string
}

const STORAGE_KEY = 'msw_users'

const SEED_USERS: MockUser[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    username: 'admin',
    password: '123456',
    email: 'admin@example.com',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    username: 'vitor',
    password: '123456',
    email: 'vitor@example.com',
  },
]

function loadUsers(): MockUser[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as MockUser[]
  } catch { /* ignora */ }
  return structuredClone(SEED_USERS)
}

function saveUsers(data: MockUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* ignora */ }
}

export const users: MockUser[] = loadUsers()

export function addUser(user: MockUser): void {
  users.push(user)
  saveUsers(users)
}
