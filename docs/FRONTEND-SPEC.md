# FRONTEND — Especificação Técnica e Arquitetural

> **Projeto:** Chat IA — Módulo Front-end  
> **Stack:** React 18+ · TypeScript · Vite · MSW · Tailwind CSS (opcional)  
> **Contrato:** OpenAPI 3.0 (Swagger) — copiado do back-end  

---

## 1. Visão Geral — Spec-Driven Development (SDD)

O front-end consome o **Swagger (OpenAPI 3.0)** gerado pelo back-end como contrato único. Isso garante que frente e verso evoluam em paralelo sem acoplamento.

### Fluxo de trabalho

1. **Contrato First** — O time de back-end entrega/congela o YAML `openapi.yaml` no repositório front-end.
2. **Code Generation (Tipos)** — O YAML alimenta a geração de tipos TypeScript via `openapi-typescript` ou `orval`.
3. **Mockagem com MSW** — A partir do YAML, são gerados handlers MSW que simulam todas as rotas, permitindo desenvolvimento front-end 100% independente do back-end.
4. **Integração** — Quando o back-end fica disponível, basta desligar MSW e apontar para a URL real.
5. **Validação** — Testes de contrato no front-end verificam se as chamadas respeitam os schemas do Swagger.

### Responsabilidades do Front-end

- Implementar a interface visual do chat.
- Separar estritamente **Apresentação** (JSX) de **Comportamento** (Custom Hooks).
- Usar MSW para mockar todas as respostas da API.
- Consumir o Swagger YAML como fonte única de tipagem e rotas.

---

## 2. Arquitetura Front-end — Separação Apresentação vs Comportamento

A arquitetura isola completamente a camada visual (componentes JSX) da camada de comportamento (lógica, estado, chamadas à API), usando **Custom Hooks** como ponte.

```
┌──────────────────────────────────────────────┐
│              Pages / Components               │  ← Apresentação
│        (JSX puro — sem lógica de negócio)     │
│         Consomem hooks, não chamam API        │
├──────────────────────────────────────────────┤
│              Custom Hooks                     │  ← Comportamento
│   (estado, efeitos colaterais, chamadas API)  │
├──────────────────────────────────────────────┤
│               Services / API                  │  ← Integração
│    (axios/fetch com tipos gerados do Swagger) │
├──────────────────────────────────────────────┤
│               Mocks (MSW)                     │  ← Mock
│  (handlers gerados do YAML — dev independente)│
└──────────────────────────────────────────────┘
```

### Regras de separação

- **Componentes JSX** nunca chamam `fetch`, `axios`, ou manipulam estado global diretamente.
- **Custom Hooks** devolvem `{ data, isLoading, error, handlers }` para os componentes consumirem.
- **Services** são funções puras de chamada HTTP, tipadas com os schemas do Swagger.
- **MSW** intercepta requisições em `development` e `test`; desligado em `production`.

### Estrutura de Pastas

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Router + providers
├── vite-env.d.ts
│
├── types/                            # Tipos gerados do Swagger
│   ├── api.ts                        # openapi-typescript output
│   └── index.ts                      # Re-exports
│
├── services/                         # Camada HTTP tipada
│   ├── api.ts                        # Instância axios configurada
│   ├── auth.service.ts               # login(), register()
│   ├── chat.service.ts               # getSessions(), sendMessage()
│   └── file.service.ts               # uploadFile(), downloadFile()
│
├── hooks/                            # Comportamento (Custom Hooks)
│   ├── useAuth.ts                    # login/logout/session state
│   ├── useChat.ts                    # messages, sendMessage, sessions
│   ├── useFileUpload.ts             # upload progress, validation
│   └── useHealth.ts                  # health check polling
│
├── components/                       # Apresentação (JSX puro)
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Spinner.tsx
│   │   └── FileDropzone.tsx
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   └── FileAttachmentPreview.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   └── layout/
│       ├── AppLayout.tsx
│       ├── Sidebar.tsx
│       └── Header.tsx
│
├── pages/                            # Páginas (composição de componentes + hooks)
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ChatPage.tsx
│   └── NotFoundPage.tsx
│
├── mocks/                            # Mock Service Worker
│   ├── swagger.yaml                  # Cópia do contrato oficial (back-end)
│   ├── browser.ts                    # MSW browser setup
│   ├── server.ts                     # MSW server setup (para testes)
│   ├── handlers.ts                   # Handlers gerados
│   └── fixtures/                     # Dados mockados
│       ├── users.ts
│       ├── messages.ts
│       └── sessions.ts
│
├── contexts/                         # Contextos globais (mínimos)
│   └── AuthContext.tsx               # Estado de autenticação global
│
├── utils/                            # Utilitários
│   ├── format.ts                     # formatDate(), formatFileSize()
│   └── validation.ts                 # validateFile(), validateMessage()
│
└── styles/
    └── globals.css                   # Estilos globais / Tailwind
```

---

## 3. Mockagem com MSW (Mock Service Worker)

Para que o front-end desenvolva **sem dependência do back-end**, todas as rotas da API devem ser mockadas via MSW.

### Setup

```bash
npm install msw --save-dev
npx msw init public/ --save
```

### Estrutura dos handlers

Os handlers seguem o contrato Swagger. Exemplo para as rotas de login e envio de mensagem:

```typescript
// src/mocks/handlers.ts
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
      id: '550e8400-e29b-41d4-a716-446655440000',
      chatSessionId: body.chatSessionId,
      role: 'USER',
      content: body.content,
      timestamp: new Date().toISOString(),
    })
  }),

  // POST /api/chat/files
  http.post('*/api/chat/files', async () => {
    return HttpResponse.json({
      fileId: '660e8400-e29b-41d4-a716-446655440001',
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
```

### Uso em desenvolvimento (runtime)

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// src/main.tsx
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'warn' })
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
})
```

### Uso em testes (vitest/node)

```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

---

## 4. Exemplo de Hook — Separação Apresentação vs Comportamento

### useAuth.ts (comportamento)

```typescript
import { useState, useCallback } from 'react'
import { authService } from '../services/auth.service'
import type { LoginRequest, LoginResponse } from '../types/api'

interface UseAuthReturn {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: LoginRequest) => Promise<void>
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response: LoginResponse = await authService.login(data)
      localStorage.setItem('token', response.token)
      setIsAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }, [])

  return { isAuthenticated, isLoading, error, login, logout }
}
```

### LoginForm.tsx (apresentação — JSX puro)

```tsx
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../common/Button'
import { Input } from '../common/Input'

export function LoginForm() {
  const { isLoading, error, login } = useAuth()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const username = (form.elements.namedItem('username') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    login({ username, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input name="username" label="Usuário" required />
      <Input name="password" type="password" label="Senha" required />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
```

---

## 5. Regras de Negócio (frente)

- **Formulários:** Validação de campos do lado do cliente antes de chamar a API (ex: mensagem não vazia, arquivo ≤ 5MB).
- **Feedback visual:** Todo estado de `isLoading` deve refletir na UI (spinner, botão disabled).
- **Tratamento de erro:** Erros HTTP (400, 401, 413, 500) devem ser exibidos como mensagens amigáveis.
- **Upload:** Validação de tipo (TXT/PDF) e tamanho (5MB) no client **antes** do envio.
- **JWT:** Token armazenado em `localStorage`, enviado automaticamente via interceptor do axios.
- **MSW:** Ativado apenas em `development` e `test`. Desligado em `production`.

---

## 6. Tecnologias e Dependências

| Pacote                              | Uso                                             |
| ----------------------------------- | ----------------------------------------------- |
| `react` + `react-dom`               | Core                                            |
| `typescript`                        | Tipagem estática                                |
| `vite`                              | Build tool / dev server                         |
| `react-router-dom`                  | Roteamento SPA                                  |
| `axios`                             | HTTP client                                     |
| `msw`                               | Mock Service Worker                             |
| `@mswjs/data`                       | (opcional) banco de dados em memória para mocks |
| `openapi-typescript`                | Geração de tipos a partir do Swagger            |
| `tailwindcss`                       | (opcional) estilização utilitária               |
| `vitest` + `@testing-library/react` | Testes                                          |

---

## 7. Padrões de Entrega

### README.md (obrigatório na raiz do repositório)

Deve conter:

- Título e descrição do projeto
- Stack (React, TypeScript, Vite, MSW)
- Pré-requisitos (Node 18+, npm/pnpm)
- Comandos de setup, dev, build, test
- Como ativar/desativar MSW
- Variáveis de ambiente (VITE_API_URL)
- Estrutura de pastas sumarizada
- Link para o Swagger (quando back-end estiver no ar)

### AGENTS.md (obrigatório na raiz do repositório)

Deve conter o histórico de prompts de IA utilizados durante o desenvolvimento do projeto. Cada entrada deve incluir:

- Data da interação
- Prompt utilizado
- Modelo/ferramenta de IA usada
- Resumo do código gerado ou decisão tomada

Formato sugerido:

```markdown
# AGENTS.md — Histórico de Prompts de IA

## [2026-06-25] Geração dos handlers MSW
- **Ferramenta:** Cline
- **Prompt:** ...
- **Resultado:** Handlers MSW para todas as rotas do chat gerados.
```

### Swagger YAML copiado

O arquivo `src/mocks/swagger.yaml` deve ser uma **cópia fiel** do contrato oficial do back-end. Atualizado sempre que o back-end versionar uma nova versão.

### Convenções de código

- **Idioma:** Código-fonte em **inglês**. JSX/componentes podem conter texto em português (UX).
- **Nomes de arquivo:** PascalCase para componentes (`LoginForm.tsx`), camelCase para hooks (`useAuth.ts`) e services (`auth.service.ts`).
- **Todo componente:** Deve ter uma interface `Props` explícita tipada.
- **Todo hook:** Deve ter um tipo de retorno explícito (`interface UseAuthReturn`).
- **Testes:** Mínimo de 70% de cobertura nos hooks e services.
- **MSW:** `onUnhandledRequest: 'warn'` para detectar chamadas não mockadas durante o desenvolvimento.

---

## 8. Pipeline de Integração com o Back-end

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Back-end     │     │    swagger.yaml   │     │  Front-end   │
│  versiona     │────>│  (copiado para   │────>│  Gera tipos  │
│  openapi.yaml │     │   src/mocks/)    │     │  + handlers  │
└──────────────┘     └──────────────────┘     └──────────────┘
                                                       │
                                                       ▼
                                              ┌──────────────────┐
                                              │  MSW ativado =   │
                                              │  dev independente │
                                              └──────────────────┘
```

**Troca para API real:** Substituir `VITE_API_URL` pela URL do back-end e remover/desabilitar o MSW.
