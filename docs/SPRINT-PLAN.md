# Sprint Plan — Front-end Chat IA

> **Time:** Ana (aprendiz/UI) · Vitor (básico/lógica) · Juliano (básico/infra)  
> **Stack:** React 18+ · TypeScript · Vite · MSW · Tailwind CSS  
> **Contrato:** `swagger.yaml` (fonte única da verdade)  
> **Duração:** 1 dia (3 trilhas paralelas)

---

## 1. Matriz de Responsabilidades — Trilhas Paralelas

| Horário | Ana (Trilha UI) | Vitor (Trilha Lógica) | Juliano (Trilha Infra) |
|---|---|---|---|
| **08:00–09:00** | `npm install`, confirmar que roda | **PAR com Ana** — scaffold Vite + TS + Tailwind + MSW + axios | Copiar `swagger.yaml`, gerar tipos via `openapi-typescript`, criar `mocks/` |
| **09:00–10:30** | `components/common/` (Button, Input, Spinner, FileDropzone) | Handlers MSW (auth, chat, files, health) + fixtures (`users.ts`, `messages.ts`, `sessions.ts`) | `services/api.ts` (axios + interceptor JWT) |
| **10:30–12:00** | `components/auth/` (LoginForm, RegisterForm) + `components/layout/` (AppLayout, Sidebar, Header) | `services/auth.service.ts` + `services/chat.service.ts` + `services/file.service.ts` | `contexts/AuthContext.tsx` + roteamento `App.tsx` |
| **13:00–15:00** | `components/chat/` (MessageBubble, MessageList, MessageInput, ChatWindow, FileAttachmentPreview) | `hooks/useAuth.ts` + `hooks/useChat.ts` + `hooks/useFileUpload.ts` + `hooks/useHealth.ts` | `pages/` (LoginPage, RegisterPage, ChatPage, NotFoundPage) |
| **15:00–16:30** | `utils/format.ts` + `utils/validation.ts` | Integrar hooks nas páginas (conectar dados) | Revisão cruzada dos PRs + merge |
| **16:30–17:30** | README.md + AGENTS.md | Ajustes finais + `npm run dev` | **PAR com Ana** — revisão geral, validar MSW, `onUnhandledRequest` limpo |

---

## 2. Definição de Pronto (DoD Compacto)

- [ ] `npm run dev` roda sem erros nem warnings
- [ ] MSW interceptando chamadas — console limpo (`onUnhandledRequest: 'warn'`)
- [ ] 3 páginas renderizando com dados mockados (Login, Register, Chat)
- [ ] Hooks integrados nos componentes — `{ data, isLoading, error }` visível na UI
- [ ] Rota `*` caindo em NotFoundPage
- [ ] README.md + AGENTS.md preenchidos

---

## 3. Trade-offs vs Plano Original de 12 dias

| Sacrifício | Justificativa |
|---|---|
| Pair programming contínuo | Substituído por 2 slots estratégicos (setup + revisão final) |
| Testes unitários (vitest) | Substituído por verificação visual + console MSW |
| Commits atômicos por tarefa | 2 commits por pessoa (manhã + tarde) |
| Tratamento de erro refinado | Feedback básico via estado `error` do hook — sem toast |
| Separação total JSX/Hook | Mantida — é barrada pelo DoD se violada |

---

## 4. Estrutura esperada ao final do dia

```
FRONTEND-IA/frontend/
├── src/
│   ├── types/api.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── chat.service.ts
│   │   └── file.service.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   ├── useFileUpload.ts
│   │   └── useHealth.ts
│   ├── components/
│   │   ├── common/   (Button, Input, Spinner, FileDropzone)
│   │   ├── auth/     (LoginForm, RegisterForm)
│   │   ├── chat/     (ChatWindow, MessageBubble, MessageList, MessageInput, FileAttachmentPreview)
│   │   └── layout/   (AppLayout, Sidebar, Header)
│   ├── pages/        (LoginPage, RegisterPage, ChatPage, NotFoundPage)
│   ├── mocks/        (swagger.yaml, browser.ts, server.ts, handlers.ts + fixtures/)
│   ├── contexts/     (AuthContext.tsx)
│   └── utils/        (format.ts, validation.ts)
├── public/mockServiceWorker.js
├── README.md
└── AGENTS.md
```
