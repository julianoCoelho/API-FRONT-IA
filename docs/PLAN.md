# Sprint Plan — Front-end Chat IA

> **Time:** Ana (aprendiz) · Vitor (básico) · Juliano (básico)  
> **Stack:** React 18+ · TypeScript · Vite · MSW · Tailwind CSS  
> **Contrato:** swagger.yaml (fonte única da verdade)  
> **Duração estimada:** 12 dias

---

## 1. Matriz de Responsabilidades (RACI por Pareamento)

**D** = Driver (digita) · **N** = Navigator (orienta/revisa)

| Tarefa                                                                                          | Ana | Vitor | Juliano |
| ----------------------------------------------------------------------------------------------- | --- | ----- | ------- |
| **Fase 1 — Estrutura e Mocks**                                                                  |     |       |         |
| Scaffold do projeto (Vite + TS + Tailwind + dependências)                                       | —   | D     | N       |
| Setup MSW (browser.ts, server.ts, public/mockServiceWorker.js)                                  | N   | D     | —       |
| Copiar + versionar swagger.yaml (backend → frontend)                                            | —   | N     | D       |
| Gerar tipos TypeScript via openapi-typescript                                                   | D   | —     | N       |
| Escrever handlers MSW para autenticação (login/register)                                        | N   | D     | —       |
| Escrever handlers MSW para chat (sessions + messages)                                           | N   | —     | D       |
| Escrever handlers MSW para files + health                                                       | D   | N     | —       |
| Criar fixtures mockadas (users.ts, messages.ts, sessions.ts)                                    | D   | N     | —       |
| **Fase 2 — Core Logics**                                                                        |     |       |         |
| Configurar axios + interceptor JWT (services/api.ts)                                            | —   | N     | D       |
| Implementar auth.service.ts (login, register)                                                   | —   | D     | N       |
| Implementar chat.service.ts (sessions, messages)                                                | —   | N     | D       |
| Implementar file.service.ts (upload, download)                                                  | D   | —     | N       |
| Implementar AuthContext.tsx                                                                     | N   | D     | —       |
| Implementar useAuth.ts hook                                                                     | —   | D     | N       |
| Implementar useChat.ts hook                                                                     | —   | N     | D       |
| Implementar useFileUpload.ts hook                                                               | D   | N     | —       |
| Implementar useHealth.ts hook                                                                   | D   | —     | N       |
| Configurar roteamento (react-router-dom) — App.tsx                                              | N   | —     | D       |
| **Fase 3 — UI e Integração**                                                                    |     |       |         |
| Componentes common/ (Button, Input, Spinner, FileDropzone)                                      | D   | N     | —       |
| Componentes auth/ (LoginForm, RegisterForm)                                                     | D   | —     | N       |
| Componentes chat/ (ChatWindow, MessageBubble, MessageList, MessageInput, FileAttachmentPreview) | D   | N     | —       |
| Componentes layout/ (AppLayout, Sidebar, Header)                                                | D   | —     | N       |
| Páginas (LoginPage, RegisterPage, ChatPage, NotFoundPage)                                       | N   | D     | N       |
| Testes nos hooks (useAuth, useChat)                                                             | N   | D     | —       |
| Testes nos componentes (LoginForm, MessageBubble)                                               | D   | —     | N       |
| Ajustes finais, README.md, AGENTS.md                                                            | N   | D     | D       |

---

## 2. Cronograma de Fases

### Fase 1 — Estrutura e Mocks (dias 1–3)

**Objetivo:** Ambiente rodando, MSW interceptando, time independente do back-end.

| Dia | Atividades                                                               | Par                                                                         |
| --- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| 1   | Scaffold Vite + TS + Tailwind + MSW + axios. Commit inicial.             | Vitor (D) + Juliano (N)                                                     |
| 2   | Handlers MSW de auth + chat. Fixtures mockadas. Tipos gerados.           | Ana (D) + Vitor (N) — fixtures e tipos / Vitor (D) + Juliano (N) — handlers |
| 3   | Handlers de files + health. Validar que MSW intercepta tudo via console. | Ana (D) + Juliano (N)                                                       |

**Entregáveis F1:** Projeto compilando, MSW ativo em dev, Swagger YAML copiado, tipos gerados, handlers mockando todas as 9 rotas.

---

### Fase 2 — Core Logics (dias 4–7)

**Objetivo:** Toda lógica de negócio implementada e testável via hook.

| Dia | Atividades                                                 | Par                                                        |
| --- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| 4   | Axios interceptor + JWT. auth.service.ts. AuthContext.tsx. | Juliano (D) + Vitor (N)                                    |
| 5   | useAuth.ts. chat.service.ts.                               | Vitor (D) + Juliano (N)                                    |
| 6   | useChat.ts. file.service.ts. useFileUpload.ts.             | Vitor (D) + Juliano (N) / Ana (D) + Vitor (N) — file hooks |
| 7   | useHealth.ts. Roteamento completo (App.tsx).               | Ana (D) + Juliano (N) / Juliano (D) + Ana (N)              |

**Entregáveis F2:** Serviços chamando MSW, hooks retornando { data, isLoading, error }, rotas configuradas, autenticação funcional.

---

### Fase 3 — UI e Integração (dias 8–12)

**Objetivo:** Interface completa, testada, com README e AGENTS.md.

| Dia | Atividades                                                                                                 | Par                     |
| --- | ---------------------------------------------------------------------------------------------------------- | ----------------------- |
| 8   | Componentes common/ (Button, Input, Spinner, FileDropzone).                                                | Ana (D) + Vitor (N)     |
| 9   | Componentes auth/ (LoginForm, RegisterForm). Componentes chat/ (MessageBubble, MessageList, MessageInput). | Ana (D) + Juliano (N)   |
| 10  | Componentes chat/ (ChatWindow, FileAttachmentPreview). Layout (AppLayout, Sidebar, Header).                | Ana (D) + Vitor (N)     |
| 11  | Páginas (LoginPage, RegisterPage, ChatPage, NotFoundPage). Testes hooks.                                   | Vitor (D) + Juliano (N) |
| 12  | Testes componentes. README.md. AGENTS.md. Revisão final.                                                   | Ana (D) + Juliano (N)   |

**Entregáveis F3:** Aplicação funcional, testada, documentada.

---

## 3. Definição de Pronto (DoD)

Cada tarefa só é considerada **pronta** quando todos os itens abaixo estiverem validados:

- ☐ **SDD:** Tipos/contratos usam schemas gerados do swagger.yaml — sem tipos manuais soltos.

- ☐ **MSW:** Toda chamada de API na tarefa tem handler MSW correspondente registrado.

- ☐ **Separação:** Componentes JSX não contêm fetch, axios, useState de negócio — só hooks.

- ☐ **Estados:** Todo hook entrega { data, isLoading, error } e o componente trata os 3 estados.

- ☐ **Testes:** Hook testado (retorno esperado) ou componente testado (render + interação).

- ☐ **Sem warnings:** npm run dev sem erros nem warnings. MSW com onUnhandledRequest: 'warn' limpo.

- ☐ **Commits atômicos:** Um commit por tarefa, mensagem descritiva em português.

- ☐ **Pair Programming:** Toda task de componente/hook tem **Driver + Navigator** registrados no commit (ex: Co-authored-by: Ana <ana@>, Co-authored-by: Vitor <vitor@>).

---

## 4. Dica de Ouro para a Mentoria

> **Nunca resolva o problema para eles. Resolva** _**com**_ **eles.**

- **Driver caiu?** Não tire o teclado da mão. Peça: _"Descreve em voz alta o que você quer fazer. Onde você acha que está o erro?"_

- **Code Review ao vivo:** Nos primeiros 15 min de cada dia, todos revisam o diff do dia anterior juntos. Isso cria vocabulário técnico compartilhado.

- **Pergunta padrão para Ana:** _"O que você acha que esse hook precisa devolver pro componente funcionar?"_ — força o raciocínio de contrato antes da implementação.

- **Pergunta padrão para Vitor/Juliano:** _"Se o back-end mudar esse contrato, quantos arquivos aqui quebram?"_ — força a visão de acoplamento e SDD.

- **Termômetro diário (5 min):** Cada um responde 3 emojis: 🟢 (tranquilo), 🟡 (emperrado mas com saída), 🔴 (bloqueado). Se alguém der 🔴, pare tudo e desbloqueie primeiro.

---

## 5. Estrutura esperada ao final da Sprint

FRONTEND-IA/frontend/  
├── src/  
│   ├── types/  
│   │   └── api.ts                  (gerado do swagger.yaml)  
│   ├── services/  
│   │   ├── api.ts                  (axios + interceptor JWT)  
│   │   ├── auth.service.ts  
│   │   ├── chat.service.ts  
│   │   └── file.service.ts  
│   ├── hooks/  
│   │   ├── useAuth.ts  
│   │   ├── useChat.ts  
│   │   ├── useFileUpload.ts  
│   │   └── useHealth.ts  
│   ├── components/  
│   │   ├── common/  
│   │   │   ├── Button.tsx  
│   │   │   ├── Input.tsx  
│   │   │   ├── Spinner.tsx  
│   │   │   └── FileDropzone.tsx  
│   │   ├── auth/  
│   │   │   ├── LoginForm.tsx  
│   │   │   └── RegisterForm.tsx  
│   │   ├── chat/  
│   │   │   ├── ChatWindow.tsx  
│   │   │   ├── MessageBubble.tsx  
│   │   │   ├── MessageList.tsx  
│   │   │   ├── MessageInput.tsx  
│   │   │   └── FileAttachmentPreview.tsx  
│   │   └── layout/  
│   │       ├── AppLayout.tsx  
│   │       ├── Sidebar.tsx  
│   │       └── Header.tsx  
│   ├── pages/  
│   │   ├── LoginPage.tsx  
│   │   ├── RegisterPage.tsx  
│   │   ├── ChatPage.tsx  
│   │   └── NotFoundPage.tsx  
│   ├── mocks/  
│   │   ├── swagger.yaml  
│   │   ├── browser.ts  
│   │   ├── server.ts  
│   │   ├── handlers.ts  
│   │   └── fixtures/  
│   │       ├── users.ts  
│   │       ├── messages.ts  
│   │       └── sessions.ts  
│   ├── contexts/  
│   │   └── AuthContext.tsx  
│   └── utils/  
│       ├── format.ts  
│       └── validation.ts  
├── public/  
│   └── mockServiceWorker.js  
├── README.md  
└── AGENTS.md
