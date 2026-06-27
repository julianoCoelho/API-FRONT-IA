# Parte 2 — Proposta de Evolução do Front-end

> **Projeto:** Chat IA — Módulo Front-end  
> **Stack:** React 19 · TypeScript · Vite · MSW · Tailwind CSS  
> **Contrato:** OpenAPI 3.0 (Swagger) — SDD  
> **Time:** Ana (UI) · Vitor (Lógica) · Juliano (Infra)

---

## 1. Diagnóstico Atual — O que já temos (Parte 1 completa)

### Tipos (`src/types/api.ts`)
LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, SendMessageRequest, MessageResponse, ChatSessionResponse, FileUploadResponse, ErrorResponse, HealthResponse

### Services
`api.ts` (axios + interceptor JWT), `auth.service.ts`, `chat.service.ts` (CRUD sessões + mensagens), `chat-delete.service.ts`, `file.service.ts` (upload/download com progresso)

### Hooks
`useAuth` (login/register/logout), `useChat` (sessões, mensagens, export .txt, rename, delete), `useFileUpload` (validação tipo/tamanho, progresso), `useHealth` (polling)

### Componentes (13 — todos puros de apresentação)
- **common/:** Button, Input, Spinner, FileDropzone
- **auth/:** LoginForm, RegisterForm
- **chat/:** ChatWindow, MessageBubble, MessageList, MessageInput, FileAttachmentPreview, types.ts
- **layout/:** AppLayout, Sidebar, Header

### Páginas
LoginPage, RegisterPage, ChatPage (orquestradora), NotFoundPage

### Contextos
AuthContext (token JWT em localStorage, login/logout, isAuthenticated)

### Mocks (MSW)
Handlers para 9 endpoints + fixtures (users, messages, sessions). Inicia condicionalmente via `VITE_ENABLE_MSW`.

### Separação Apresentação vs Comportamento
✅ Rigorosamente mantida — JSX não chama API nem gerencia estado de negócio

### Roteamento
React Router DOM v7 com rotas protegidas, lazy loading, redirect inteligente (/ → /chat se logado, /login se não)

---

## 2. Novos Requisitos — Parte 2 (RAG + n8n)

### 2.1 Conceitos do RAG que impactam o Front-end

- **Ingestão:** Upload de documento → parsing → chunking → embedding → persistência no pgvector
- **Recuperação:** Pergunta do usuário → busca por similaridade vetorial → contexto enriquecido → LLM → resposta com fontes
- **Fontes (sources):** A resposta do assistente agora carrega `sources[]` — fragmentos de documentos usados para gerar a resposta
- **Modelo de IA:** Llama (local) — o front-end não consome o modelo diretamente, apenas a API do back-end

### 2.2 Orquestração n8n (não afeta o front-end diretamente)

- n8n é camada externa — o back-end notifica via webhook após indexação
- Front-end só precisa exibir o status final da ingestão (INDEXED / FAILED)

---

## 3. Mudanças Propostas

### 3.1 Tipos — `src/types/api.ts`

**Adicionar:**
```typescript
export interface SourceResponse {
  documentId: string
  chunkId: string
  content: string
  score: number
  fileName?: string
  page?: number
}

export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'INDEXED' | 'FAILED'

export interface DocumentResponse {
  id: string
  fileName: string
  fileSize: number
  status: DocumentStatus
  createdAt: string
}

export interface DocumentStatusResponse {
  id: string
  status: DocumentStatus
  progress?: number
  error?: string
}
```

**Atualizar:**
```typescript
export interface MessageResponse {
  id: string
  chatSessionId: string
  role: 'USER' | 'ASSISTANT'
  content: string
  timestamp: string
  sources?: SourceResponse[]   // NOVO
}
```

### 3.2 Services

| Arquivo | Ação | Detalhes |
|---|---|---|
| `document.service.ts` | **NOVO** | `ingestDocument(file, onProgress)`, `getDocuments()`, `getDocumentStatus(id)` |
| `chat.service.ts` | **ATUALIZAR** | `sendMessage()` retorna `MessageResponse` com `sources` |
| `file.service.ts` | **ATUALIZAR** | Resposta pode incluir `documentId` para tracking de ingestão |

### 3.3 Hooks

| Hook | Ação | Comportamento |
|---|---|---|
| `useDocuments.ts` | **NOVO** | `{ documents, isLoading, error, ingestDocument, getDocumentStatus }` — lista docs, polling de status |
| `useChat.ts` | **ATUALIZAR** | `sendMessage()` processa `sources[]` da resposta, expõe `sourcesByMessageId` |
| `useFileUpload.ts` | **ATUALIZAR** | Após upload, inicia tracking de ingestão; expõe `ingestionStatus` |

### 3.4 Componentes

| Componente | Ação | Props |
|---|---|---|
| `SourcePanel.tsx` (chat/) | **NOVO** | `sources: SourceResponse[]` — painel colapsável com preview dos chunks e score de similaridade |
| `IngestionStatus.tsx` (chat/) | **NOVO** | `status: DocumentStatus, fileName: string, error?: string` — badge de status da ingestão |
| `MessageBubble.tsx` | **ATUALIZAR** | Nova prop `sources?: SourceResponse[]` — renderiza `<SourcePanel />` abaixo da mensagem do assistente |
| `MessageList.tsx` | **ATUALIZAR** | Aceita `sourcesByMessageId` e repassa ao MessageBubble |
| `FileAttachmentPreview.tsx` | **ATUALIZAR** | Nova prop `ingestionStatus?: DocumentStatus` |
| `ChatWindow.tsx` | **ATUALIZAR** | Passa sources por toda a cadeia de componentes |

### 3.5 Páginas

| Página | Ação |
|---|---|
| `ChatPage.tsx` | Conectar `useDocuments` ao fluxo de upload, passar `sourcesByMessageId` para `ChatWindow`, gerenciar exibição de `IngestionStatus` |
| (nova) `DocumentsPage.tsx` | **OPCIONAL** — página dedicada para listar/gerenciar documentos ingeridos |

### 3.6 Mocks (MSW)

| Arquivo | Ação |
|---|---|
| `swagger.yaml` | **ATUALIZAR** com schemas SourceResponse, DocumentResponse, DocumentStatus e endpoints /documents |
| `handlers.ts` | **ATUALIZAR** — POST /chat/messages retorna sources mockados; adicionar handlers de documentos |
| `fixtures/documents.ts` | **NOVO** — documentos mockados com status variados |
| `fixtures/sources.ts` | **NOVO** — chunks de fontes mockados |

### 3.7 Sidebar

O item "Upload" existente em `Sidebar.tsx` pode:
- **(Opção A)** Navegar para `DocumentsPage` com visão geral de documentos ingeridos
- **(Opção B)** Permanecer inline no chat (upload drag-and-drop como hoje) — mais simples
- **Decisão pendente do grupo**

---

## 4. Alinhamento com o Back-end

O back-end (equipa Java / Spring Boot) precisa expor estes contratos:

| Endpoint | Existe? | Necessário para |
|---|---|---|
| `POST /api/chat/files` | ✅ | Retornar também `documentId` e `status` |
| `POST /api/documents/ingest` | ❌ Novo | Upload → parsing → chunking → embedding (ou unificado com /files) |
| `GET /api/documents` | ❌ Novo | Listar documentos do usuário autenticado |
| `GET /api/documents/{id}/status` | ❌ Novo | Polling de status da ingestão |
| `POST /api/chat/messages` | ✅ | `MessageResponse` agora inclui `sources[]` |
| `POST /api/documents/{id}/webhook` | ❌ (n8n) | Notificar n8n — responsabilidade exclusiva do back-end |

**Importante:** A validação de tipo (TXT/PDF) e tamanho (5MB) continua sendo feita no cliente antes do envio.

---

## 5. Decisões Pendentes (responder em grupo)

1. **Upload + Ingestão:** São o mesmo fluxo (upload aciona ingestão automaticamente) ou dois passos separados?
2. **SourcePanel:** O painel de fontes deve vir colapsado por padrão ("3 documentos consultados ▼") ou expandido?
3. **Sidebar — Upload:** Criar página dedicada de documentos ou manter upload inline no chat?
4. **Modelo Llama:** Algo muda no front-end além dos sources? (Streaming? Status do modelo?)
5. **Prioridade:** Qual dessas mudanças é crítica para a entrega e qual pode ser MVP vs. refinamento?

---

## 6. Estratégia de Implementação Sugerida

Seguindo o mesmo fluxo SDD + CRISP da Parte 1:

| Fase | Passo | Responsável |
|---|---|---|
| **F1 — Spec** | Atualizar `swagger.yaml` com novos schemas e endpoints | Juliano |
| **F1 — Spec** | Regenerar tipos TypeScript ou atualizar `api.ts` manualmente | Juliano |
| **F1 — Mock** | Atualizar handlers MSW + fixtures de documentos/sources | Vitor |
| **F2 — Service** | Criar `document.service.ts` + atualizar `chat.service.ts` | Vitor |
| **F2 — Hook** | Criar `useDocuments.ts` + atualizar `useChat` e `useFileUpload` | Vitor |
| **F3 — UI** | Criar `SourcePanel.tsx`, `IngestionStatus.tsx` | Ana |
| **F3 — UI** | Atualizar `MessageBubble`, `MessageList`, `FileAttachmentPreview` | Ana |
| **F3 — Page** | Atualizar `ChatPage.tsx` para integrar tudo | Vitor + Ana |
| **F4 — QA** | Validar estados (loading/error/data) no MSW, sem warnings | Juliano |
| **F4 — Docs** | Atualizar README.md + AGENTS.md | Todos |

---

## 7. Matriz RACI (Sugerida)

| Tarefa | Ana | Vitor | Juliano |
|---|---|---|---|
| Atualizar swagger.yaml + tipos | — | N | D |
| Atualizar handlers MSW | N | D | — |
| document.service.ts | — | D | N |
| useDocuments.ts | — | D | N |
| SourcePanel.tsx (componente) | D | N | — |
| IngestionStatus.tsx (componente) | D | — | N |
| Atualizar MessageBubble + MessageList | D | N | — |
| Atualizar ChatPage.tsx | N | D | — |
| Revisão + merge + QA | N | N | D |
