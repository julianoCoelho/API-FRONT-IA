# FRONTEND — Especificação Técnica e Arquitetural — Parte 2

> **Projeto:** Chat IA — Módulo Front-end  
> **Stack:** React 19 · TypeScript · Vite · MSW · Tailwind CSS  
> **Contrato:** OpenAPI 3.0 (Swagger) — `openapi-parte2.yaml` (fonte única da verdade)  
> **Base:** Parte 1 já implementada — este documento especifica **apenas as evoluções** para RAG e ingestão de documentos

---

## 1. Visão Geral — O que muda da Parte 1 para a Parte 2

A Parte 2 adiciona ao front-end:
1. **Exibição de fontes (sources)** nas respostas do assistente — rastreabilidade de quais documentos foram usados
2. **Pipeline de ingestão de documentos** — upload de TXT/PDF para indexação RAG
3. **Polling de status de documentos** — acompanhar processamento (PENDING → PROCESSING → COMPLETED/FAILED)
4. **Reprocessamento de documentos** — reenviar documento já indexado pelo pipeline

### Premissas arquiteturais (mantidas da Parte 1)

- **Spec-Driven Development (SDD):** Contrato OpenAPI 3.0 como fonte única da verdade
- **Separação Apresentação vs Comportamento:** JSX puro, Custom Hooks como ponte
- **MSW:** Mock de todas as rotas em `development` e `test`
- **JWT:** Token em `localStorage`, enviado via interceptor axios
- **Upload:** Validação de tipo (TXT/PDF) e tamanho (5MB) no cliente antes do envio

---

## 2. Contrato de API — OpenAPI 3.0 (Parte 2)

### 2.1 Schemas Novos

Fonte: `openapi-parte2.yaml` do back-end (branch `developer-parte2`)

| Schema | Campos | Obrigatórios |
|---|---|---|
| **SourceResponse** | `documentId: uuid`, `documentName: string`, `chunkIndex: integer`, `excerpt: string` (max 500), `score: float` (0-1) | `documentId, documentName, chunkIndex, excerpt, score` |
| **RagMessageResponse** | `id: uuid`, `chatSessionId: uuid`, `role: [ASSISTANT]`, `content: string`, `timestamp: date-time`, `sources: SourceResponse[]` | Todos |
| **DocumentResponse** | `id: uuid`, `fileName: string`, `fileSize: integer`, `status: [PENDING, PROCESSING, COMPLETED, FAILED]`, `chunkCount: integer`, `createdAt: date-time` | Todos |
| **DocumentStatusResponse** | Herda `DocumentResponse` + `completedAt?: date-time`, `errorMessage?: string` | — |
| **CreateSessionRequest** | `title: string` | `title` |
| **HealthResponse** | `status: string`, `timestamp: date-time` | `status, timestamp` |

### 2.2 Schemas Mantidos (inalterados)

`LoginRequest`, `LoginResponse`, `RegisterRequest`, `RegisterResponse`, `SendMessageRequest`, `MessageResponse` (histórico), `ChatSessionResponse`, `FileUploadResponse`, `ErrorResponse`

### 2.3 Endpoints — Mapeamento Completo

| Método | Rota | Auth | Request Body | Response | Status |
|---|---|---|---|---|---|
| POST | `/auth/login` | Não | `LoginRequest` | `LoginResponse` | Mantido |
| POST | `/auth/register` | Não | `RegisterRequest` | `RegisterResponse` (201) | Mantido |
| GET | `/chat/sessions` | JWT | — | `ChatSessionResponse[]` | Mantido |
| POST | `/chat/sessions` | JWT | `CreateSessionRequest` | `ChatSessionResponse` (201) | Mantido |
| POST | `/chat/messages` | JWT | `SendMessageRequest` | `RagMessageResponse` | **Evoluído** — agora com `sources[]` |
| GET | `/chat/sessions/{sessionId}/messages` | JWT | — | `MessageResponse[]` | Mantido — histórico **sem** sources |
| POST | `/chat/files` | JWT | `multipart: file` | `FileUploadResponse` | Mantido |
| GET | `/chat/files/{fileId}` | JWT | — | `application/octet-stream` | Mantido |
| POST | `/documents` | JWT | `multipart: file` | `DocumentResponse` (201) | **Novo** |
| GET | `/documents/{id}` | JWT | — | `DocumentStatusResponse` | **Novo** |
| POST | `/documents/{id}/reprocess` | JWT | — | `DocumentResponse` (202) | **Novo** |
| GET | `/health` | Não | — | `HealthResponse` | Mantido |

### 2.4 Observações sobre o contrato

- `POST /chat/messages` agora retorna `RagMessageResponse` (role sempre `ASSISTANT`, `sources` obrigatório — pode ser array vazio)
- `GET /chat/sessions/{sessionId}/messages` continua retornando `MessageResponse[]` **sem** `sources` — usado apenas para histórico
- `POST /documents` retorna `201 Created` com status inicial `PROCESSING`
- `POST /documents/{id}/reprocess` retorna `202 Accepted`
- Status 503 em `POST /chat/messages` indica LLM/embedding indisponível — a mensagem USER foi salva mas resposta não foi gerada

---

## 3. Tipos TypeScript — `src/types/api.ts`

### 3.1 Adicionar

```typescript
export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface SourceResponse {
  documentId: string
  documentName: string
  chunkIndex: number
  excerpt: string
  score: number
}

export interface RagMessageResponse {
  id: string
  chatSessionId: string
  role: 'ASSISTANT'
  content: string
  timestamp: string
  sources: SourceResponse[]
}

export interface DocumentResponse {
  id: string
  fileName: string
  fileSize: number
  status: DocumentStatus
  chunkCount: number
  createdAt: string
}

export interface DocumentStatusResponse extends DocumentResponse {
  completedAt?: string | null
  errorMessage?: string | null
}

export interface CreateSessionRequest {
  title: string
}

export interface HealthResponse {
  status: string
  timestamp: string
}
```

### 3.2 Manter (inalterados)

`LoginRequest`, `LoginResponse`, `RegisterRequest`, `RegisterResponse`, `SendMessageRequest`, `MessageResponse`, `ChatSessionResponse`, `FileUploadResponse`, `ErrorResponse`

---

## 4. Serviços

### 4.1 `src/services/document.service.ts` — **NOVO**

```typescript
import { api } from './api'
import type { DocumentResponse, DocumentStatusResponse } from '../types/api'

export const documentService = {
  ingestDocument(file: File, onProgress?: (progress: number) => void): Promise<DocumentResponse> {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => { if (e.total) onProgress(Math.round((e.loaded * 100) / e.total)) }
        : undefined,
    }).then((res) => res.data)
  },

  getDocumentStatus(id: string): Promise<DocumentStatusResponse> {
    return api.get(`/documents/${id}`).then((res) => res.data)
  },

  reprocessDocument(id: string): Promise<DocumentResponse> {
    return api.post(`/documents/${id}/reprocess`).then((res) => res.data)
  },
}
```

### 4.2 `src/services/chat.service.ts` — **ATUALIZAR**

O método `sendMessage` agora retorna `RagMessageResponse`:

```typescript
import type { RagMessageResponse } from '../types/api'

sendMessage(data: SendMessageRequest): Promise<RagMessageResponse> {
  return api.post('/chat/messages', data).then((res) => res.data)
}
```

---

## 5. Hooks

### 5.1 `src/hooks/useDocuments.ts` — **NOVO**

```typescript
interface UseDocumentsReturn {
  documents: DocumentResponse[]
  isLoading: boolean
  error: string | null
  ingestDocument: (file: File) => Promise<DocumentResponse | null>
  pollDocumentStatus: (id: string, onComplete?: (doc: DocumentResponse) => void) => Promise<void>
  reprocessDocument: (id: string) => Promise<void>
}
```

| Método | Comportamento |
|---|---|
| `ingestDocument(file)` | Valida tipo/tamanho, POST /documents, retorna DocumentResponse com status PROCESSING |
| `pollDocumentStatus(id, onComplete?)` | Polling a cada 2s até COMPLETED ou FAILED. Chama `onComplete` quando finalizado |
| `reprocessDocument(id)` | POST /documents/{id}/reprocess, atualiza lista |

### 5.2 `src/hooks/useChat.ts` — **ATUALIZAR**

Adicionar ao `UseChatReturn`:

```typescript
sourcesByMessageId: Record<string, SourceResponse[]>
```

O `sendMessage` agora:
1. Cria `userMessage` otimista (sem sources)
2. Chama `chatService.sendMessage()` → recebe `RagMessageResponse` com `sources[]`
3. Armazena `sources[messageId]` em `sourcesByMessageId`
4. Adiciona `response` à lista de mensagens

### 5.3 `src/hooks/useFileUpload.ts` — **ATUALIZAR**

Adicionar ao `UseFileUploadReturn`:

```typescript
ingestionStatus: DocumentStatus | null
ingestionDocumentId: string | null
```

Após upload bem-sucedido em `/chat/files`, o hook NOTA o início da ingestão via POST /documents (chamando `useDocuments.ingestDocument`). O `ChatPage` orquestra essa conexão.

---

## 6. Componentes

### 6.1 `src/components/chat/SourcePanel.tsx` — **NOVO**

**Props:**
```typescript
interface SourcePanelProps {
  sources: SourceResponse[]
}
```

**Responsabilidade:**
- Exibir contagem de fontes: "2 documentos consultados" (sempre visível)
- Botão "Ver fontes" / "Ocultar fontes" (colapsável)
- Quando expandido: lista de cards, um por fonte:
  - `documentName` (negrito)
  - `excerpt` (trecho, truncado com ellipsis se > 200 caracteres)
  - `score` (barra de progresso colorida: verde ≥ 0.8, amarelo ≥ 0.6, vermelho < 0.6)
  - `chunkIndex` discreto

**Restrições:**
- JSX puro — não faz fetch, não gerencia estado de negócio
- Não renderizar se `sources` for array vazio

### 6.2 `src/components/chat/IngestionStatus.tsx` — **NOVO**

**Props:**
```typescript
interface IngestionStatusProps {
  status: DocumentStatus
  fileName: string
  errorMessage?: string | null
}
```

**Estados visuais:**
| Status | Exibição |
|---|---|
| `PROCESSING` | Spinner + "Processando..." + barra indeterminada |
| `COMPLETED` | Check verde + "Indexado" |
| `FAILED` | Ícone de erro + "Falha na indexação" + `errorMessage` |

### 6.3 `src/components/chat/MessageBubble.tsx` — **ATUALIZAR**

**Props:** Adicionar `sources?: SourceResponse[]`

**Comportamento:**
- Se `role === 'ASSISTANT'` e `sources && sources.length > 0`:
  - Renderizar `<SourcePanel sources={sources} />` abaixo do conteúdo da mensagem
- Caso contrário: comportamento atual (inalterado)

### 6.4 `src/components/chat/MessageList.tsx` — **ATUALIZAR**

**Props:** Adicionar `sourcesByMessageId?: Record<string, SourceResponse[]>`

**Comportamento:**
- Ao renderizar cada `MessageBubble`, passar `sources={sourcesByMessageId[msg.id]}` se existir
- Scroll automático mantido

### 6.5 `src/components/chat/FileAttachmentPreview.tsx` — **ATUALIZAR**

**Props:** Adicionar `ingestionStatus?: DocumentStatus`

**Comportamento:**
- Se `ingestionStatus` presente, exibir badge de status ao lado do nome do arquivo
- Reutilizar lógica visual de `IngestionStatus` (ou delegar para ele)

### 6.6 `src/components/chat/ChatWindow.tsx` — **ATUALIZAR**

**Props:** Adicionar `sourcesByMessageId?: Record<string, SourceResponse[]>`

**Comportamento:**
- Repassar `sourcesByMessageId` para `MessageList`

---

## 7. Páginas

### 7.1 `src/pages/ChatPage.tsx` — **ATUALIZAR**

**Mudanças:**
1. Conectar `useDocuments` ao fluxo de upload:
   - Após `uploadFile()` bem-sucedido, chamar `ingestDocument(file)` do `useDocuments`
   - Iniciar `pollDocumentStatus(documentId)` para tracking
2. Conectar `sourcesByMessageId` do `useChat` ao `ChatWindow`
3. Exibir `IngestionStatus` para documentos recentes (opcional: toast ou barra inferior)

---

## 8. Mocks MSW

### 8.1 `src/mocks/swagger.yaml` — **ATUALIZAR**

Substituir pelo conteúdo do `openapi-parte2.yaml` do back-end.

### 8.2 `src/mocks/handlers.ts` — **ATUALIZAR**

| Handler | Ação |
|---|---|
| `POST */api/chat/messages` | Retornar `RagMessageResponse` com `sources[]` mockados (2-3 fontes simuladas) |
| `POST */api/documents` | Retornar `DocumentResponse` (201) com status `PROCESSING` |
| `GET */api/documents/:id` | Retornar `DocumentStatusResponse` — transicionar de PROCESSING para COMPLETED após 3 chamadas |
| `POST */api/documents/:id/reprocess` | Retornar `DocumentResponse` (202) com status `PROCESSING` |

### 8.3 `src/mocks/fixtures/documents.ts` — **NOVO**

```typescript
export const documents = [
  {
    id: 'doc-001',
    fileName: 'relatorio-anual-2025.pdf',
    fileSize: 1024000,
    status: 'COMPLETED',
    chunkCount: 12,
    createdAt: '2026-06-25T10:00:00Z',
  },
  {
    id: 'doc-002',
    fileName: 'contrato-prestacao-servicos.txt',
    fileSize: 245760,
    status: 'PROCESSING',
    chunkCount: 0,
    createdAt: '2026-06-26T14:30:00Z',
  },
]
```

### 8.4 `src/mocks/fixtures/sources.ts` — **NOVO**

```typescript
export function generateMockSources(): SourceResponse[] {
  return [
    {
      documentId: 'doc-001',
      documentName: 'relatorio-anual-2025.pdf',
      chunkIndex: 3,
      excerpt: 'O faturamento da empresa no exercício de 2025 foi de R$ 12,5 milhões, representando um crescimento de 18% em relação ao ano anterior...',
      score: 0.92,
    },
    {
      documentId: 'doc-002',
      documentName: 'contrato-prestacao-servicos.txt',
      chunkIndex: 7,
      excerpt: 'Cláusula Quinta — Do Pagamento: O valor mensal dos serviços é de R$ 15.000,00 (quinze mil reais), reajustáveis anualmente pelo IPCA...',
      score: 0.78,
    },
  ]
}
```

---

## 9. Regras de Negócio (Atualização)

| Regra | Descrição |
|---|---|
| **Upload ≠ Ingestão** | Upload para `/chat/files` (anexo no chat) é independente de ingestão via `/documents` (RAG) |
| **Status de documentos** | PENDING (raro) → PROCESSING → COMPLETED / FAILED. Front-end faz polling a cada 2s |
| **Sources vazio** | Perguntas sem contexto nos documentos retornam `sources: []` — `SourcePanel` não renderiza |
| **Erro 503** | LLM/embedding indisponível. Exibir mensagem: "O assistente está temporariamente indisponível. Sua mensagem foi salva." |
| **Reprocessamento** | `POST /documents/{id}/reprocess` — status volta para PROCESSING | 

---

## 10. Estrutura de Pastas (Atualizada)

```
src/
├── types/
│   └── api.ts                          # + SourceResponse, RagMessageResponse,
│                                        #   DocumentResponse, DocumentStatusResponse,
│                                        #   DocumentStatus, CreateSessionRequest, HealthResponse
├── services/
│   ├── api.ts                          # (mantido)
│   ├── auth.service.ts                 # (mantido)
│   ├── chat.service.ts                 # ATUALIZADO
│   ├── chat-delete.service.ts          # (mantido)
│   ├── document.service.ts             # NOVO
│   └── file.service.ts                 # (mantido)
├── hooks/
│   ├── useAuth.ts                      # (mantido)
│   ├── useChat.ts                      # ATUALIZADO: + sourcesByMessageId
│   ├── useDocuments.ts                 # NOVO
│   ├── useFileUpload.ts                # ATUALIZADO: + ingestionStatus
│   └── useHealth.ts                    # (mantido)
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx              # ATUALIZADO
│   │   ├── FileAttachmentPreview.tsx   # ATUALIZADO
│   │   ├── IngestionStatus.tsx         # NOVO
│   │   ├── MessageBubble.tsx           # ATUALIZADO
│   │   ├── MessageInput.tsx            # (mantido)
│   │   ├── MessageList.tsx             # ATUALIZADO
│   │   ├── SourcePanel.tsx             # NOVO
│   │   └── types.ts                    # (mantido)
│   ├── common/                         # (mantido)
│   ├── auth/                           # (mantido)
│   └── layout/                         # (mantido)
├── pages/
│   ├── ChatPage.tsx                    # ATUALIZADO
│   ├── LoginPage.tsx                   # (mantido)
│   ├── RegisterPage.tsx                # (mantido)
│   └── NotFoundPage.tsx                # (mantido)
├── mocks/
│   ├── swagger.yaml                    # ATUALIZADO (← openapi-parte2.yaml)
│   ├── browser.ts                      # (mantido)
│   ├── server.ts                       # (mantido)
│   ├── handlers.ts                     # ATUALIZADO
│   └── fixtures/
│       ├── documents.ts                # NOVO
│       ├── messages.ts                 # (mantido)
│       ├── sessions.ts                 # (mantido)
│       ├── sources.ts                  # NOVO
│       └── users.ts                    # (mantido)
├── contexts/
│   └── AuthContext.tsx                 # (mantido)
└── utils/
    ├── format.ts                       # (mantido)
    └── validation.ts                   # (mantido)
```

---

## 11. Definição de Pronto (DoD)

- [ ] `npm run dev` roda sem erros nem warnings
- [ ] MSW interceptando todas as chamadas — `onUnhandledRequest: 'warn'` limpo
- [ ] Tipos TypeScript refletem exatamente o `openapi-parte2.yaml`
- [ ] `MessageBubble` exibe `SourcePanel` colapsável para respostas com sources
- [ ] `IngestionStatus` exibe PROCESSING → COMPLETED/FAILED corretamente
- [ ] Upload de documento aciona ingestão e polling de status
- [ ] Separação Apresentação vs Comportamento mantida — JSX não chama API
- [ ] README.md + AGENTS.md atualizados
