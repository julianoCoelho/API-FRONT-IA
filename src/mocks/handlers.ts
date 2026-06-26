import { http, HttpResponse } from 'msw'
import { users } from './fixtures/users'
import { sessions } from './fixtures/sessions'
import { getMessagesBySessionId, addMessage } from './fixtures/messages'

function unauthorized(message = 'Não autenticado') {
  return HttpResponse.json(
    {
      status: 401,
      error: 'Unauthorized',
      message,
      timestamp: new Date().toISOString(),
    },
    { status: 401 },
  )
}

function notFound(entity = 'Recurso') {
  return HttpResponse.json(
    {
      status: 404,
      error: 'Not Found',
      message: `${entity} não encontrado(a)`,
      timestamp: new Date().toISOString(),
    },
    { status: 404 },
  )
}

function badRequest(message: string) {
  return HttpResponse.json(
    {
      status: 400,
      error: 'Bad Request',
      message,
      timestamp: new Date().toISOString(),
    },
    { status: 400 },
  )
}

function isAuthenticated(request: Request): boolean {
  const auth = request.headers.get('Authorization')
  return auth !== null && auth.startsWith('Bearer ')
}

export const handlers = [
  // POST /api/auth/login
  http.post('*/api/auth/login', async ({ request }) => {
    const body = await request.json() as { username: string; password: string }
    const user = users.find((u) => u.username === body.username && u.password === body.password)

    if (user) {
      return HttpResponse.json({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock',
        expiresIn: 86400,
      })
    }

    return HttpResponse.json(
      {
        status: 401,
        error: 'Unauthorized',
        message: 'Credenciais inválidas',
        timestamp: new Date().toISOString(),
      },
      { status: 401 },
    )
  }),

  // POST /api/auth/register
  http.post('*/api/auth/register', async ({ request }) => {
    const body = await request.json() as { username: string; password: string; email?: string }
    const exists = users.find((u) => u.username === body.username)

    if (exists) {
      return badRequest('Username já está em uso')
    }

    const newUser = {
      id: crypto.randomUUID(),
      username: body.username,
      password: body.password,
      email: body.email,
    }
    users.push(newUser)

    return HttpResponse.json(
      {
        id: newUser.id,
        username: newUser.username,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    )
  }),

  // GET /api/chat/sessions
  http.get('*/api/chat/sessions', ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorized()
    }
    return HttpResponse.json(sessions)
  }),

  // POST /api/chat/sessions
  http.post('*/api/chat/sessions', async ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorized()
    }
    const body = await request.json() as { title: string }

    if (!body.title || body.title.trim().length === 0) {
      return badRequest('O título da sessão é obrigatório')
    }

    const newSession = {
      id: crypto.randomUUID(),
      title: body.title,
      createdAt: new Date().toISOString(),
    }
    sessions.unshift(newSession)

    return HttpResponse.json(newSession, { status: 201 })
  }),

  // GET /api/chat/sessions/:sessionId/messages
  http.get('*/api/chat/sessions/:sessionId/messages', ({ params, request }) => {
    if (!isAuthenticated(request)) {
      return unauthorized()
    }

    const { sessionId } = params
    const session = sessions.find((s) => s.id === sessionId)

    if (!session) {
      return notFound('Sessão')
    }

    const messages = getMessagesBySessionId(sessionId as string)
    return HttpResponse.json(messages)
  }),

  // POST /api/chat/messages
  http.post('*/api/chat/messages', async ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorized()
    }

    const body = await request.json() as { chatSessionId: string; content: string }

    if (!body.content || body.content.trim().length === 0) {
      return badRequest('O conteúdo da mensagem não pode estar vazio')
    }

    if (body.content.length > 10000) {
      return badRequest('A mensagem excede o limite de 10.000 caracteres')
    }

    const session = sessions.find((s) => s.id === body.chatSessionId)
    if (!session) {
      return notFound('Sessão')
    }

    const userMessage = {
      id: crypto.randomUUID(),
      chatSessionId: body.chatSessionId,
      role: 'USER' as const,
      content: body.content,
      timestamp: new Date().toISOString(),
    }
    addMessage(userMessage)

    const assistantMessage = {
      id: crypto.randomUUID(),
      chatSessionId: body.chatSessionId,
      role: 'ASSISTANT' as const,
      content: `Recebi sua mensagem: "${body.content.substring(0, 50)}${body.content.length > 50 ? '...' : ''}". Como posso ajudar?`,
      timestamp: new Date().toISOString(),
    }
    addMessage(assistantMessage)

    return HttpResponse.json(assistantMessage)
  }),

  // POST /api/chat/files
  http.post('*/api/chat/files', async ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorized()
    }

    const clonedRequest = request.clone()
    const formData = await clonedRequest.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return badRequest('Nenhum arquivo enviado')
    }

    const allowedTypes = ['text/plain', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return badRequest('Formato inválido. Apenas TXT e PDF são aceitos.')
    }

    if (file.size > 5_242_880) {
      return HttpResponse.json(
        {
          status: 413,
          error: 'Payload Too Large',
          message: 'Arquivo excede o limite de 5MB.',
          timestamp: new Date().toISOString(),
        },
        { status: 413 },
      )
    }

    return HttpResponse.json({
      fileId: crypto.randomUUID(),
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    })
  }),

  // GET /api/chat/files/:fileId
  http.get('*/api/chat/files/:fileId', async ({ params, request }) => {
    if (!isAuthenticated(request)) {
      return unauthorized()
    }

    const { fileId } = params
    if (!fileId || fileId === 'not-found') {
      return notFound('Arquivo')
    }

    const blob = new Blob(['Conteúdo do arquivo mock'], { type: 'application/octet-stream' })
    return HttpResponse.arrayBuffer(await blob.arrayBuffer(), {
      headers: { 'Content-Type': 'application/octet-stream' },
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
