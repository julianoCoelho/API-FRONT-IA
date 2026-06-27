# Plano de Execução — Feature-Sliced Vertical (2 Dias)

> **Projeto:** Chat IA — Front-end Parte 2 (RAG + Ingestão de Documentos)  
> **Stack:** React 19 · TypeScript · Vite · MSW · Tailwind CSS  
> **Time:** Ana (iniciante — UI) · Vitor (intermediário — Lógica) · Juliano (intermediário — Infra)  
> **Contrato:** `openapi-parte2.yaml` (fonte única da verdade)

---

## Estrutura — 2 Squads paralelas

Cada squad entrega uma **feature completa verticalmente** (tipos → service → hook → mock → UI → página).

---

## Squad A — Ingestão de Documentos

**Membros:** Vitor (D) · Juliano (N)

### Passo 1 — Tipos e Spec
**Arquivo:** `src/types/api.ts`

Adicionar:
```typescript
export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface DocumentResponse {
  id: string; fileName: string; fileSize: number
  status: DocumentStatus; chunkCount: number; createdAt: string
}

export interface DocumentStatusResponse extends DocumentResponse {
  completedAt?: string | null; errorMessage?: string | null
}
```

### Passo 2 — Serviço
**Arquivo:** `src/services/document.service.ts`

```typescript
export const documentService = {
  ingestDocument(file, onProgress?): Promise<DocumentResponse>
  getDocumentStatus(id): Promise<DocumentStatusResponse>
  reprocessDocument(id): Promise<DocumentResponse>
}
```

### Passo 3 — Hook
**Arquivo:** `src/hooks/useDocuments.ts`

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

### Passo 4 — Mocks
**Arquivos:** `src/mocks/handlers.ts`, `src/mocks/fixtures/documents.ts`

- Handler POST */api/documents → DocumentResponse (201, status PROCESSING)
- Handler GET */api/documents/:id → DocumentStatusResponse (transiciona PROCESSING→COMPLETED após 3 polls)
- Handler POST */api/documents/:id/reprocess → DocumentResponse (202, status PROCESSING)

### Passo 5 — Componente UI
**Arquivo:** `src/components/chat/IngestionStatus.tsx`

```typescript
interface IngestionStatusProps {
  status: DocumentStatus
  fileName: string
  errorMessage?: string | null
}
```

### Passo 6 — Integração na Página
**Arquivo:** `src/pages/ChatPage.tsx`

Conectar `useDocuments` + `IngestionStatus` no fluxo de upload existente:
- Após uploadFile() bem-sucedido → chamar `ingestDocument(file)`
- Iniciar `pollDocumentStatus(documentId)` para tracking
- Exibir `IngestionStatus` enquanto PROCESSING

✅ **Feature completa: ingestão funcionando**

---

## Squad B — Fontes RAG nas Mensagens

**Membros:** Ana (D) · Juliano (N)

### Passo 1 — Tipos e Spec
**Arquivo:** `src/types/api.ts`

Adicionar:
```typescript
export interface SourceResponse {
  documentId: string; documentName: string; chunkIndex: number
  excerpt: string; score: number
}

export interface RagMessageResponse {
  id: string; chatSessionId: string; role: 'ASSISTANT'
  content: string; timestamp: string; sources: SourceResponse[]
}
```

### Passo 2 — Serviço
**Arquivo:** `src/services/chat.service.ts`

Atualizar `sendMessage()` para retornar `RagMessageResponse`.

### Passo 3 — Hook
**Arquivo:** `src/hooks/useChat.ts`

Adicionar ao `UseChatReturn`:
```typescript
sourcesByMessageId: Record<string, SourceResponse[]>
```

No `sendMessage()`:
1. Cria userMessage otimista
2. Chama `chatService.sendMessage()` → recebe `RagMessageResponse` com `sources[]`
3. Salva `sources[response.id]` em `sourcesByMessageId`
4. Adiciona response às mensagens

### Passo 4 — Mocks
**Arquivos:** `src/mocks/handlers.ts`, `src/mocks/fixtures/sources.ts`

- Atualizar handler POST */api/chat/messages para retornar `RagMessageResponse` com 2-3 sources mockados
- Fixture `sources.ts` com `generateMockSources()`

### Passo 5 — Componente UI
**Arquivo:** `src/components/chat/SourcePanel.tsx`

```typescript
interface SourcePanelProps {
  sources: SourceResponse[]
}
```

Painel colapsável:
- "2 documentos consultados" (sempre visível)
- Expandir: cards com documentName, excerpt (truncado), score (barra colorida)

### Passo 6 — Atualizar Componentes

| Componente | O que muda |
|---|---|
| `MessageBubble.tsx` | Nova prop `sources?: SourceResponse[]` — renderiza `<SourcePanel />` se role=ASSISTANT e sources.length > 0 |
| `MessageList.tsx` | Nova prop `sourcesByMessageId` — repassa ao MessageBubble |
| `ChatWindow.tsx` | Nova prop `sourcesByMessageId` — repassa ao MessageList |
| `FileAttachmentPreview.tsx` | Nova prop `ingestionStatus?: DocumentStatus` — badge de status |

✅ **Feature completa: fontes RAG visíveis no chat**

---

## Dia 2 — Integração + QA

| Atividade | Responsável |
|---|---|
| Merge das duas squads no `ChatPage.tsx` | Vitor + Juliano |
| Testar fluxo completo: upload → ingestão → perguntar → ver sources | Todos |
| Tratamento de erro 503 (LLM indisponível) | Vitor |
| Ajustes finos de UI (transições, estados vazios) | Ana |
| Atualizar `swagger.yaml` com schemas da Parte 2 | Juliano |
| QA: `npm run dev` sem warnings, MSW limpo | Juliano |
| README.md + AGENTS.md | Ana + Vitor |

---

## Matriz RACI

| Tarefa | Squad | Ana | Vitor | Juliano |
|---|---|---|---|---|
| Tipos DocumentResponse/DocumentStatus | A | — | D | N |
| document.service.ts | A | — | **D** | N |
| useDocuments.ts | A | — | **D** | N |
| Handlers documentos + fixtures | A | — | — | **D** |
| IngestionStatus.tsx | A | D | — | N |
| Conectar ingestão no ChatPage | A | N | **D** | — |
| Tipos SourceResponse/RagMessageResponse | B | — | N | **D** |
| chat.service.ts (atualizar) | B | — | D | N |
| useChat.ts (atualizar) | B | — | **D** | N |
| Fixtures sources.ts | B | — | — | **D** |
| SourcePanel.tsx | B | **D** | N | — |
| MessageBubble/MessageList/ChatWindow (atualizar) | B | **D** | N | — |
| swagger.yaml (atualizar) | — | — | — | **D** |
| Integração ChatPage + QA | — | N | **D** | N |
| README + AGENTS | — | D | D | — |

---

## Definição de Pronto (DoD)

- [ ] `npm run dev` roda sem erros nem warnings
- [ ] MSW interceptando todas as chamadas — console limpo
- [ ] Tipos refletem exatamente o `openapi-parte2.yaml`
- [ ] `MessageBubble` exibe `SourcePanel` colapsável para respostas com sources
- [ ] `IngestionStatus` exibe PROCESSING → COMPLETED/FAILED
- [ ] Upload de documento aciona ingestão e polling de status
- [ ] Separação Apresentação vs Comportamento mantida
- [ ] README.md + AGENTS.md atualizados
