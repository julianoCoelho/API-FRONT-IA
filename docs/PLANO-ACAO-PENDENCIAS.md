# Plano de Ação — Pendências Técnicas

> Gerado em: 29/06/2026
> Baseado na análise dos commits e do código-fonte atual (branch `develop`).

---

## Priorização

| Prioridade | Item | Responsável sugerido | Esforço estimado |
|------------|------|----------------------|------------------|
| 🔴 Alta | 1. Conectar `sourcesByMessageId` na UI | Vitor | 2h |
| 🔴 Alta | 2. Integrar `IngestionStatus` no fluxo de upload | Ana + Vitor | 2h |
| 🟡 Média | 3. Unificar tipos `SourceResponse` | Juliano | 1h |
| 🟡 Média | 4. Adicionar testes unitários | Equipe | 8h |
| 🟢 Baixa | 5. Remover `console.log` de debug | Juliano | 15min |
| 🟢 Baixa | 6. Alinhar `ingestion.ts` com constantes da API | Vitor | 30min |
| 🟢 Baixa | 7. Botão de `reprocessDocument` na UI | Ana | 1h |
| ⚪ Futuro | 8. Streaming de respostas | Vitor | 4h |

---

## Item 1 — 🔴 Conectar `sourcesByMessageId` na UI

### Problema
O hook `useChat()` retorna `sourcesByMessageId`, mas esse dado não é passado pela cadeia de componentes:

```
useChat → ChatPage → ChatWindow → MessageList → MessageBubble → SourcePanel
```

O `SourcePanel` nunca é renderizado em nenhuma mensagem do assistente.

### O que fazer

1. **Adicionar prop `sourcesByMessageId` no `ChatWindow`** (`src/components/chat/ChatWindow.tsx`)
   - Tipo: `Record<string, SourceResponse[]>`
   - Repassar para `MessageList`

2. **Adicionar prop `sourcesByMessageId` no `MessageList`** (`src/components/chat/MessageList.tsx`)
   - Para cada mensagem, buscar `sourcesByMessageId[message.id]` e passar para `MessageBubble`

3. **Verificar `MessageBubble`** (`src/components/chat/MessageBubble.tsx`)
   - Já possui prop `sources?: SourceResponse[]` — conferir se está funcionando e se o `SourcePanel` é condicionalmente renderizado para `role === 'ASSISTANT'`

4. **Passar `sourcesByMessageId` no `ChatPage`** (`src/pages/ChatPage.tsx`)
   - Extrair do `useChat()` e passar para `<ChatWindow>`

### Critério de aceite
- Toda mensagem do assistente com fontes exibe o `SourcePanel` colapsável com o número correto de fontes.
- Ao expandir, os cards de fonte aparecem com nome do documento, trecho e score.

---

## Item 2 — 🔴 Integrar `IngestionStatus` no fluxo de upload

### Problema
O componente `IngestionStatus` existe em `src/components/common/IngestionStatus.tsx` mas não é utilizado. O `ChatPage` gerencia um estado `Attachment` local com campos como `ingestionStatus: string` — duplicando lógica.

### O que fazer

1. **Substituir o estado local `Attachment` no `ChatPage`** (`src/pages/ChatPage.tsx`)
   - Usar o retorno de `useFileUpload()` diretamente: `ingestionStatus`, `ingestionDocumentId`, `uploadedFile`
   - Renderizar `<IngestionStatus>` no lugar do preview manual de arquivo

2. **Ajustar `IngestionStatus`** se necessário
   - Verificar se aceita os status retornados pela API (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`)
   - Atualmente usa `READY` e `ERROR` do `types/ingestion.ts` — vide Item 6

3. **Alinhar `FileAttachmentPreview`** (`src/components/chat/FileAttachmentPreview.tsx`)
   - Pode ser simplificado ou absorvido pelo `IngestionStatus`

### Critério de aceite
- Após upload de arquivo, o status de ingestão aparece em tempo real: `PENDING` → `PROCESSING` → `COMPLETED` (ou `FAILED`).
- A barra de progresso do upload (0-100%) ainda funciona antes da ingestão começar.

---

## Item 3 — 🟡 Unificar tipos `SourceResponse`

### Problema
Existem duas definições de `SourceResponse`:

| Arquivo | Campos |
|---------|--------|
| `src/types/api.ts` | `documentId`, `documentName`, `chunkIndex`, `excerpt`, `score` |
| `src/types/source.ts` | `id`, `documentName`, `page?`, `snippet`, `score?` |

Os hooks usam `api.ts`, os componentes de UI usam `source.ts`. Funciona por coincidência estrutural, mas é frágil.

### O que fazer

1. **Eleger `api.ts` como fonte da verdade** (gerado do Swagger)
2. **Atualizar `source.ts`** para re-exportar o tipo de `api.ts` ou remover o arquivo
3. **Atualizar imports** em `MessageBubble`, `SourcePanel` e `types.ts` do chat
4. **Atualizar `useChat`** se necessário para retornar o tipo correto

### Critério de aceite
- Apenas uma definição de `SourceResponse` no projeto.
- `npm run build` compila sem erros de tipo.

---

## Item 4 — 🟡 Adicionar testes unitários

### Problema
O projeto não possui nenhum teste. A spec menciona meta de 70% de cobertura.

### O que fazer (proposta inicial)

1. **Configurar vitest** no `package.json` e `vite.config.ts`
2. **Adicionar `@testing-library/react`** e `@testing-library/jest-dom`
3. **Criar testes para:**
   - `src/utils/validation.ts` — validação de arquivo e mensagem
   - `src/hooks/useAuth.ts` — fluxo de login/registro/logout
   - `src/components/common/Button.tsx` — variantes e loading
   - `src/components/auth/LoginForm.tsx` — submissão e exibição de erro
   - `src/mocks/handlers.ts` — testes de contrato (request/response)

### Critério de aceite
- `npm run test` executa sem erros.
- Cobertura mínima de 30% para começar (incrementar em sprints seguintes).

---

## Item 5 — 🟢 Remover `console.log` de debug

### Arquivos afetados

| Arquivo | Linhas | Conteúdo |
|---------|--------|----------|
| `src/App.tsx` | ~13 | `console.log('ProtectedRoute', ...)` |
| `src/App.tsx` | ~28 | `console.log('RootRedirect', ...)` |

### O que fazer
- Remover as duas linhas de `console.log`.

### Critério de aceite
- Nenhum `console.log` intencional no código de produção (excluindo warnings legítimos).

---

## Item 6 — 🟢 Alinhar `ingestion.ts` com constantes da API

### Problema
`src/types/ingestion.ts` define os status como:
```ts
type DocumentStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'ERROR'
```

Mas a API (Swagger + `api.ts`) usa:
```ts
type DocumentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
```

### O que fazer
1. Substituir `READY` por `COMPLETED` e `ERROR` por `FAILED` em `ingestion.ts`
2. Atualizar o `StatusConfig` com os ícones/cores correspondentes

### Critério de aceite
- `IngestionStatus` renderiza corretamente os status `COMPLETED` e `FAILED`.
- Nenhum símbolo `READY` ou `ERROR` referente a status de documento no código.

---

## Item 7 — 🟢 Botão de `reprocessDocument` na UI

### Problema
O hook `useDocuments()` expõe `reprocessDocument(id)`, e o serviço `document.service.ts` tem o método, mas não há botão na interface para acioná-lo.

### O que fazer
1. **Adicionar botão "Reprocessar"** no `FileAttachmentPreview` ou no `IngestionStatus` quando o status for `COMPLETED` ou `FAILED`
2. **Conectar ao `reprocessDocument`** do hook

### Critério de aceite
- Documentos com status `COMPLETED` ou `FAILED` exibem botão "Reprocessar".
- Ao clicar, o status volta para `PROCESSING` e o polling é reiniciado.

---

## Item 8 — ⚪ Streaming de respostas (para sprints futuros)

### O que fazer
- Simular no MSW uma resposta chunked (SSE) para `POST /chat/messages`
- Atualizar `useChat` para acumular chunks em vez de aguardar resposta completa
- Adicionar indicador visual de digitação no `MessageBubble`

### Critério de aceite
- Mensagens do assistente aparecem caractere por caractere.
- É possível cancelar a geração.

---

## Ordem sugerida de execução

```
1. Item 5  (console.log)         — 15 min, despolui o código
2. Item 6  (ingestion.ts)        — 30 min, desbloqueia Item 2
3. Item 3  (unificar tipos)      — 1h, desbloqueia Item 1
4. Item 1  (sources na UI)       — 2h, funcionalidade principal
5. Item 2  (IngestionStatus)     — 2h, funcionalidade principal
6. Item 7  (reprocessar)         — 1h, funcionalidade adicional
7. Item 4  (testes)              — 8h, qualidade (pode ser paralelizado)
8. Item 8  (streaming)           — 4h, futuro
```

**Total estimado (itens 1-7): ~14h** (desconsiderando paralelismo).
Com 3 pessoas trabalhando em paralelo, pode ser fechado em 1-2 dias de sprint.

---

## Responsáveis sugeridos por papel

| Papel | Pessoa | Itens |
|-------|--------|-------|
| **Lógica (hooks/services)** | Vitor | 1, 2 (parte lógica), 6, 8 |
| **UI (componentes)** | Ana | 2 (parte UI), 7 |
| **Infra (tipos/roteiro/qualidade)** | Juliano | 3, 4, 5 |
