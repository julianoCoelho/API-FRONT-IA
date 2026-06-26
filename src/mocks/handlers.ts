import { http, HttpResponse } from 'msw'

export const handlers = [
  // POST /api/auth/login
  http.post('*/api/auth/login', async ({ request }) => {
    const body = await request.json() as { username: string; password: string }

    if (body.username === 'admin' && body.password === '123456') {
      return HttpResponse.json({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock',
        expiresIn: 86400,
      })
    }

    return HttpResponse.json(
      { status: 401, error: 'Unauthorized', message: 'Credenciais inválidas' },
      { status: 401 },
    )
  }),

  // POST /api/chat/messages
  http.post('*/api/chat/messages', async ({ request }) => {
    const body = await request.json() as { chatSessionId: string; content: string }

    return HttpResponse.json({
      id: crypto.randomUUID(),
      chatSessionId: body.chatSessionId,
      role: 'USER',
      content: body.content,
      timestamp: new Date().toISOString(),
    })
  }),

  // POST /api/chat/files
  http.post('*/api/chat/files', async () => {
    return HttpResponse.json({
      fileId: crypto.randomUUID(),
      fileName: 'documento.pdf',
      fileSize: 1024000,
      uploadedAt: new Date().toISOString(),
    })
  }),

  // GET /api/health
  http.get('*/api/health', () => {
    return HttpResponse.json({
      status: 'UP',
      timestamp: new Date().toISOString(),
    })
  }),
]