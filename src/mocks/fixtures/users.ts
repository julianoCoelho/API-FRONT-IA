export interface MockUser {
  id: string
  username: string
  password: string
  email?: string
}

export const users: MockUser[] = [
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
