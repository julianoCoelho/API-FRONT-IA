# Plano de Ação — Pendências Técnicas

> Gerado em: 29/06/2026
> Baseado na análise cruzada entre:
> - Código-fonte atual (branch `develop`)
> - Requisitos acadêmicos (Parte 1 e Parte 2)
> - Especificações do backend (BACKEND-SPEC.md, BACKEND-SPEC-PARTE2.md)
> - Contratos OpenAPI (openapi.yaml, openapi-parte2.yaml)

---

## Sumário Executivo

| Dimensão | Status |
|----------|--------|
| **Parte 1 — Frontend** | ✅ ~95% completo |
| **Parte 2 — Frontend (RAG/Ingestão)** | ⚠️ ~60% — estrutura existe mas 3 bugs críticos de integração |
| **Backend (Parte 1)** | ✅ Especificado e implementado |
| **Backend (Parte 2)** | ⚠️ Especificado (BACKEND-SPEC-PARTE2.md), implementação pendente |

---

## Priorização

| Prioridade | Item | Responsável sugerido | Esforço estimado |
|------------|------|----------------------|------------------|
| 🔴 Crítico | 1. Corrigir tipo do `SourcePanel` — usa `source.ts` em vez de `api.ts` (campos `snippet` vs `excerpt`) | Juliano | 1h |
| 🔴 Crítico | 2. Conectar `sourcesByMessageId` na cadeia ChatPage → ChatWindow → MessageList → MessageBubble | Vitor | 2h |
| 🔴 Crítico | 3. Alinhar `ingestion.ts` com constantes da API (`READY`→`COMPLETED`, `ERROR`→`FAILED`) + integrar `IngestionStatus` no ChatPage | Vitor + Ana | 2h |
| 🟡 Alta | 4. Unificar `SourceResponse`: eliminar `types/source.ts`, padronizar imports em `types.ts`, `MessageBubble`, `SourcePanel` | Juliano | 1h |
| 🟡 Média | 5. Remover `console.log` de debug em `App.tsx` | Juliano | 15min |
| 🟡 Média | 6. Adicionar `ingestionStatus` prop no `FileAttachmentPreview` + botão "Reprocessar" | Ana | 2h |
| 🟡 Média | 7. Adicionar testes unitários (vitest + @testing-library/react) | Equipe | 8h |
| ⚪ Backend | 8. Adicionar `PATCH /chat/sessions/{id}` e `DELETE /chat/sessions/{id}` ao contrato OpenAPI do backend | Time Backend | — |
| ⚪ Backend | 9. Implementar pipeline RAG no backend (POST /documents, pgvector, embedding, webhook n8n) | Time Backend | — |
| ⚪ Futuro | 10. Streaming de respostas (SSE) | Vitor | 4h |

---

## Diagnóstico Detalhado

### O que já funciona (Parte 1 completa)

**Tipos (`src/types/api.ts`):** LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, SendMessageRequest, MessageResponse, ChatSessionResponse, FileUploadResponse, ErrorResponse, HealthResponse — ✅ gerados do swagger.yaml

**Services:** `api.ts` (axios + interceptor JWT), `auth.service.ts`, `chat.service.ts` (CRUD sessões + mensagens), `chat-delete.service.ts`, `file.service.ts` (upload/download com progresso) — ✅

**Hooks:** `useAuth`, `useChat` (sessões, mensagens, export .txt, rename, delete), `useFileUpload` (validação tipo/tamanho, progresso), `useHealth` (polling n8n) — ✅

**Componentes (13 — todos puros de apresentação):**
- common/: Button, Input, Spinner, FileDropzone, HealthStatusBadge — ✅
- auth/: LoginForm, RegisterForm — ✅
- chat/: ChatWindow, MessageBubble, MessageList, MessageInput, FileAttachmentPreview — ✅
- layout/: AppLayout, Sidebar, Header — ✅

**Páginas:** LoginPage, RegisterPage, ChatPage (orquestradora), NotFoundPage — ✅

**Contextos:** AuthContext (token JWT em localStorage, login/logout, isAuthenticated) — ✅

**Mocks (MSW):** Handlers para 12 endpoints + fixtures (users, messages, sessions, documents, sources) — ✅

**Separação Apresentação vs Comportamento:** ✅ Rigorosamente mantida

**Roteamento:** React Router DOM v7 com rotas protegidas, lazy loading, redirect inteligente — ✅

### O que foi adicionado para Parte 2 (mas tem bugs)

| Artefato | Status | Problema |
|----------|--------|----------|
| `SourceResponse`, `DocumentResponse`, `RagMessageResponse` em `api.ts` | ✅ Correto | — |
| `document.service.ts` | ✅ Correto | — |
| `useDocuments.ts` | ✅ Correto | — |
| `useChat` com `sourcesByMessageId` | ⚠️ Dado nunca chega na UI | Item 2 |
| `useFileUpload` com `ingestionStatus`/`ingestionDocumentId` | ⚠️ Não integrado ao ChatPage | Item 3 |
| `SourcePanel.tsx` | ❌ Tipo errado | Item 1 |
| `IngestionStatus.tsx` | ❌ Status errados + nunca renderizado | Item 3 |
| `MessageBubble` com prop `sources` | ✅ Correto | — |
| `MessageList` | ⚠️ Não recebe `sourcesByMessageId` | Item 2 |
| `ChatWindow` | ⚠️ Não recebe `sourcesByMessageId` | Item 2 |
| `FileAttachmentPreview` | ❌ Sem `ingestionStatus` + sem botão reprocessar | Item 6 |
| `ChatPage` | ❌ Usa estado local `Attachment` em vez do hook | Itens 2+3 |
| Handlers MSW para /documents | ✅ Correto | — |
| Fixtures documents.ts + sources.ts | ✅ Correto | — |

---

## Item 1 — 🔴 Corrigir tipo do `SourcePanel` (bug de renderização)

### Problema
`SourcePanel.tsx` importa `SourceResponse` de `../../types/source`, mas essa interface tem campos diferentes dos retornados pela API:

| Arquivo | Campos |
|---------|--------|
| `src/types/source.ts` (usado) | `id`, `documentName`, `page?`, `snippet`, `score?` |
| `src/types/api.ts` (correto) | `documentId`, `documentName`, `chunkIndex`, `excerpt`, `score` |

O componente referencia `source.snippet` (undefined) e `source.id` (undefined) — o trecho da fonte **não aparece** na UI.

### O que fazer

1. **Alterar import** em `src/components/chat/SourcePanel.tsx`:
   - Remover: `import type { SourceResponse } from '../../types/source'`
   - Adicionar: `import type { SourceResponse } from '../../types/api'`

2. **Corrigir campos no JSX** do `SourcePanel.tsx`:
   - `source.id` → `source.documentId` (se usado como key)
   - `source.snippet` → `source.excerpt`
   - `source.page` → remover (ou usar `source.chunkIndex`)
   - Adicionar exibição do `score` com barra colorida (verde ≥ 0.8, amarelo ≥ 0.6, vermelho < 0.6)

### Critério de aceite
- Respostas do assistente com fontes exibem o trecho correto (`excerpt`) e o score.
- `SourcePanel` não referencia mais `source.snippet` ou `source.id`.

---

## Item 2 — 🔴 Conectar `sourcesByMessageId` na cadeia de componentes

### Problema
Em `useChat.ts`, o método `sendMessage` faz:
```typescript
const { sources, ...response } = await chatService.sendMessage(...)
setMessages((prev) => [...prev, response]) // response SEM sources
if (sources?.length) {
  setSourcesByMessageId((prev) => ({ ...prev, [response.id]: sources }))
}
```

`sources` são removidas da mensagem e armazenadas separadamente em `sourcesByMessageId`, mas esse estado **nunca** é passado de `ChatPage` → `ChatWindow` → `MessageList` → `MessageBubble`.

### O que fazer

1. **Em `ChatPage.tsx`**: extrair `sourcesByMessageId` do `useChat()` e passar para `<ChatWindow>`
2. **Em `ChatWindow.tsx`**: aceitar prop `sourcesByMessageId: Record<string, SourceResponse[]>` e repassar para `MessageList`
3. **Em `MessageList.tsx`**: aceitar prop `sourcesByMessageId` e passar `sourcesByMessageId[msg.id]` para cada `<MessageBubble>`
4. **Alternativa (mais simples):** Em `useChat.ts`, incluir `sources` na mensagem antes de adicioná-la ao estado `messages`, e remover o `sourcesByMessageId` se não for mais necessário — unifica o fluxo

### Critério de aceite
- Toda mensagem do assistente com fontes exibe o `SourcePanel` colapsável.
- Ao expandir, os cards de fonte aparecem com nome do documento, trecho e score.

---

## Item 3 — 🔴 Alinhar `ingestion.ts` + Integrar `IngestionStatus` na UI

### Problema A — Status incorretos
`src/types/ingestion.ts` define:
```typescript
type DocumentStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'ERROR'
```
Mas a API (Swagger + `api.ts`) usa:
```typescript
type DocumentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
```

### Problema B — Componente nunca usado
`IngestionStatus.tsx` (em `components/common/`) foi criado mas **nunca é importado ou renderizado**. O `ChatPage.tsx` gerencia um estado `Attachment` local com lógica duplicada.

### O que fazer

1. **Corrigir `src/types/ingestion.ts`:**
   - Substituir `'READY'` por `'COMPLETED'` e `'ERROR'` por `'FAILED'`
   - Atualizar `StatusConfig` com labels "Indexado" e "Falha na indexação"
   - Opcional: remover o arquivo e usar `types/api.ts` diretamente

2. **Corrigir `src/components/common/IngestionStatus.tsx`:**
   - Atualizar labels para português: PENDING→"Pendente", PROCESSING→"Processando...", COMPLETED→"Indexado", FAILED→"Falha"
   - Adicionar prop `fileName?: string` e `errorMessage?: string` conforme especificação FRONTEND-SPEC-PARTE2.md
   - Adicionar exibição de mensagem de erro quando status for FAILED e `errorMessage` presente

3. **Simplificar `ChatPage.tsx`:**
   - Substituir estado local `Attachment` pelo retorno de `useFileUpload()`: `uploadedFile`, `ingestionStatus`, `ingestionDocumentId`
   - Renderizar `<IngestionStatus>` no lugar do preview manual de arquivo
   - Conectar `useDocuments().ingestDocument` após upload bem-sucedido

### Critério de aceite
- Após upload de arquivo, o status de ingestão aparece em tempo real: `PENDING` → `PROCESSING` → `COMPLETED` (ou `FAILED`).
- `IngestionStatus` exibe spinner durante PROCESSING, check verde no COMPLETED, ícone de erro no FAILED com mensagem.

---

## Item 4 — 🟡 Unificar tipos `SourceResponse`

### Problema
Existem duas definições de `SourceResponse` no projeto:

| Arquivo | Campos | Usado por |
|---------|--------|-----------|
| `src/types/api.ts` | `documentId`, `documentName`, `chunkIndex`, `excerpt`, `score` | services, hooks, mock handlers |
| `src/types/source.ts` | `id`, `documentName`, `page?`, `snippet`, `score?` | SourcePanel, MessageBubble, types.ts do chat |

### O que fazer

1. **Eleger `api.ts` como fonte da verdade** (gerado do Swagger)
2. **Eliminar `src/types/source.ts`**
3. **Atualizar imports:**
   - `src/components/chat/SourcePanel.tsx`: `from '../../types/api'`
   - `src/components/chat/MessageBubble.tsx`: `from '../../types/api'`
   - `src/components/chat/types.ts`: `from '../../types/api'`
4. **Atualizar `src/components/chat/types.ts`**: o campo `sources` deve usar o tipo `SourceResponse` de `api.ts`

### Critério de aceite
- Apenas uma definição de `SourceResponse` no projeto.
- `npm run build` compila sem erros de tipo.

---

## Item 5 — 🟢 Remover `console.log` de debug

### Arquivos afetados

| Arquivo | Linhas | Conteúdo |
|---------|--------|----------|
| `src/App.tsx` | ~13 | `console.log('[ProtectedRoute]', ...)` |
| `src/App.tsx` | ~28 | `console.log('[RootRedirect]', ...)` |

### O que fazer
Remover as duas linhas de `console.log`.

### Critério de aceite
- Nenhum `console.log` intencional no código de produção (excluindo warnings legítimos).

---

## Item 6 — 🟢 Adicionar `ingestionStatus` + botão "Reprocessar"

### Problema
- `FileAttachmentPreview` não exibe status de ingestão do documento
- `useDocuments().reprocessDocument` existe mas não há botão na UI para acioná-lo

### O que fazer

1. **Adicionar prop `ingestionStatus?: DocumentStatus` e `onReprocess?: () => void`** no `FileAttachmentPreview`
2. **Exibir badge de status** (`IngestionStatus` ou badge inline) ao lado do nome do arquivo
3. **Exibir botão "Reprocessar"** quando status for `COMPLETED` ou `FAILED`
4. **Conectar no `ChatPage`**: passar `ingestionStatus` do hook e chamar `reprocessDocument` do `useDocuments`

### Critério de aceite
- Documentos com status `COMPLETED` ou `FAILED` exibem botão "Reprocessar".
- Ao clicar, o status volta para `PROCESSING` e o polling é reiniciado.

---

## Item 7 — 🟡 Adicionar testes unitários

### Problema
O projeto não possui nenhum teste. A spec menciona meta de 70% de cobertura.

### O que fazer (proposta inicial)

1. **Instalar dependências:**
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
   ```
2. **Configurar vitest** no `vite.config.ts`
3. **Adicionar script `test`** no `package.json`
4. **Criar testes para:**
   - `src/utils/validation.ts` — validação de arquivo e mensagem
   - `src/hooks/useAuth.ts` — fluxo de login/registro/logout
   - `src/components/common/Button.tsx` — variantes e loading
   - `src/components/auth/LoginForm.tsx` — submissão e exibição de erro
   - `src/mocks/handlers.ts` — testes de contrato (request/response)

### Critério de aceite
- `npm run test` executa sem erros.
- Cobertura mínima de 30% para começar.

---

## Item 8 — ⚪ Backend: Adicionar PATCH/DELETE sessions ao contrato

### Problema
O frontend utiliza `PATCH /chat/sessions/{id}` (rename) e `DELETE /chat/sessions/{id}` (delete), mas esses endpoints **não estão listados** em nenhuma versão do OpenAPI do backend (nem Parte 1, nem Parte 2).

### Impacto
Quando o frontend for apontado para o backend real (sem MSW), essas chamadas falharão com 404.

### Ação necessária (time backend)
Adicionar ao `openapi.yaml`:

```yaml
/chat/sessions/{sessionId}:
  patch:
    summary: Renomear sessão de chat
    operationId: renameSession
    parameters:
      - name: sessionId
        in: path
        required: true
        schema: { type: string, format: uuid }
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              title: { type: string }
    responses:
      '200': { description: Sessão renomeada }
      '401': { description: Não autenticado }
      '404': { description: Sessão não encontrada }
  delete:
    summary: Excluir sessão de chat
    operationId: deleteSession
    parameters:
      - name: sessionId
        in: path
        required: true
        schema: { type: string, format: uuid }
    responses:
      '204': { description: Sessão excluída }
      '401': { description: Não autenticado }
      '404': { description: Sessão não encontrada }
```

---

## Item 9 — ⚪ Backend: Implementar pipeline RAG

### O que precisa ser implementado no backend (conforme BACKEND-SPEC-PARTE2.md)

| Componente | Status |
|------------|--------|
| Infraestrutura: docker-compose (PostgreSQL + pgvector), Flyway migrations | 📝 Planejado |
| Domínio: `Document.java`, `DocumentChunk.java` | 📝 Planejado |
| DTOs: `DocumentResponse`, `DocumentStatusResponse`, `RagMessageResponse`, `SourceResponse` | 📝 Planejado |
| Ports: `EmbeddingProvider`, `LlmProvider`, `DocumentRepository`, `DocumentChunkRepository`, `WebhookNotifier` | 📝 Planejado |
| `EmbeddingService` + adaptador Spring AI (OpenRouter) | 📝 Planejado |
| `DocumentIngestionService` + `DocumentController` (POST /documents) | 📝 Planejado |
| `RagService` + evolução de `ChatController` (POST /chat/messages retorna RagMessageResponse) | 📝 Planejado |
| Webhook n8n (`N8nWebhookNotifier`) | 📝 Planejado |
| GlobalExceptionHandler atualizado (422, 503) | 📝 Planejado |

**Frontend não depende do backend para desenvolvimento** — MSW mocks todos os endpoints.

---

## Item 10 — ⚪ Streaming de respostas (para sprints futuros)

### O que fazer
- Simular no MSW uma resposta chunked (SSE) para `POST /chat/messages`
- Atualizar `useChat` para acumular chunks em vez de aguardar resposta completa
- Adicionar indicador visual de digitação no `MessageBubble`

### Critério de aceite
- Mensagens do assistente aparecem caractere por caractere.
- É possível cancelar a geração.

---

## Pontos de Atenção com o Backend

| # | Ponto | Detalhe | Impacto no Frontend |
|---|-------|---------|---------------------|
| 1 | **PATCH/DELETE sessions** | Não especificados no OpenAPI do backend | Frontend quebra sem MSW |
| 2 | **POST /chat/messages evolui** | Response muda de `MessageResponse` para `RagMessageResponse` com `sources[]` | Sem isso, frontend não recebe sources |
| 3 | **Pipeline de documentos** | Backend precisa implementar ingestão + embedding | Frontend já mockado — funcional sem backend |
| 4 | **CORS** | `http://localhost:5173` precisa estar liberado | Já configurado no backend (CorsConfig.java) |
| 5 | **URL da API** | Frontend usa `VITE_API_URL` com fallback `http://localhost:8080/api` | Deve bater com `server.servlet.context-path=/api` |
| 6 | **Variáveis de ambiente** | `OPENROUTER_API_KEY`, `DATASOURCE_URL`, etc. | Backend Parte 2 não funciona sem elas |
| 7 | **Modelo Llama local** | Requisito acadêmico: usar LLM localmente | Frontend não consome LLM diretamente — só a API |
| 8 | **Status 503** | Frontend trata 503 em `POST /chat/messages` | Backend precisa retornar 503 quando LLM indisponível |

---

## Ordem sugerida de execução

```
1. Item 5  (console.log)              — 15 min, despolui o código
2. Item 4  (unificar tipos)           — 1h,   desbloqueia Item 1
3. Item 1  (SourcePanel tipo)         — 1h,   corrige renderização de sources
4. Item 3  (ingestion.ts + integrar)  — 2h,   desbloqueia uso IngestionStatus
5. Item 2  (sources na cadeia)        — 2h,   funcionalidade principal RAG
6. Item 6  (reprocessar)              — 2h,   funcionalidade adicional
7. Item 7  (testes)                   — 8h,   qualidade (pode paralelizar)
8. Item 10 (streaming)                — 4h,   futuro
```

**Total estimado (itens 1-7): ~16h** (desconsiderando paralelismo).
Com 3 pessoas trabalhando em paralelo, pode ser fechado em 1-2 dias de sprint.

---

## Responsáveis sugeridos por papel

| Papel | Pessoa | Itens |
|-------|--------|-------|
| **Lógica (hooks/services)** | Vitor | 2, 3 (parte lógica), 10 |
| **UI (componentes)** | Ana | 3 (parte UI), 6 |
| **Infra (tipos/roteiro/qualidade)** | Juliano | 1, 4, 5, 7 |

---

## Matriz de Conformidade com Requisitos Acadêmicos

### Parte 1 — Fundações e Arquitetura

| Requisito | Status | Observação |
|-----------|--------|------------|
| Spec-Driven Development (SDD) | ✅ | Contrato OpenAPI como fonte única da verdade |
| Padrão CRISP | ✅ | AGENTS.md documenta prompts no padrão |
| Separação Front/Back (repositórios) | ✅ | Repositórios separados |
| README.md + AGENTS.md | ✅ | Ambos presentes |
| Separação Apresentação vs Comportamento | ✅ | JSX puro, hooks isolados |
| Drag-and-drop + barra de progresso | ✅ | FileDropzone + FileAttachmentPreview |
| Upload TXT/PDF (validação cliente) | ✅ | `useFileUpload` valida tipo e tamanho |
| Mensageria síncrona (chat) | ✅ | useChat + chat.service |
| Histórico por sessão | ✅ | GET /chat/sessions/{id}/messages |
| Health check (/api/health) | ✅ | useHealth + HealthStatusBadge |

### Parte 2 — RAG, Orquestração e Integração Full-Stack

| Requisito | Status | Observação |
|-----------|--------|------------|
| Exibição de fontes (sources) | ❌ | Bug no SourcePanel + sources não chegam na UI — **itens 1 e 2** |
| Ingestão de documentos (upload RAG) | ⚠️ | document.service + useDocuments existem — **item 3** precisa integrar na UI |
| Polling de status de documentos | ✅ | useDocuments.pollDocumentStatus |
| Reprocessamento de documentos | ❌ | Botão não existe na UI — **item 6** |
| Tratamento de erro 503 | ✅ | useChat trata 503 com mensagem amigável |
| Integração n8n (health check) | ✅ | useHealth + HealthStatusBadge no Sidebar |
| Separação SDD mantida | ✅ | Tipos gerados do Swagger |
| Separação Apresentação vs Comportamento | ✅ | Mantida em todos os componentes novos |
| MSW mockando rotas RAG | ✅ | Handlers para /documents, /documents/{id}, /documents/{id}/reprocess |
