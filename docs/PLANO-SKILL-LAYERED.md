# Plano de Execução — Skill-Layered (2 Dias)

> **Projeto:** Chat IA — Front-end Parte 2 (RAG + Ingestão de Documentos)  
> **Stack:** React 19 · TypeScript · Vite · MSW · Tailwind CSS  
> **Time:** Ana (iniciante — UI) · Vitor (intermediário — Lógica) · Juliano (intermediário — Infra)  
> **Contrato:** `openapi-parte2.yaml` (fonte única da verdade)  
> **Modelo:** Mesma estrutura da Parte 1 — cada um na sua camada de especialidade

---

## Dia 1 — Infra + Lógica + UI Base

### Juliano (Infra) — manhã e tarde

| Horário | Tarefa | Arquivos |
|---|---|---|
| **Manhã** | Adicionar tipos novos ao `api.ts` | `src/types/api.ts` |
| | Atualizar `swagger.yaml` com schemas da Parte 2 | `src/mocks/swagger.yaml` |
| | Criar fixtures `documents.ts` e `sources.ts` | `src/mocks/fixtures/documents.ts`, `sources.ts` |
| **Tarde** | Atualizar `handlers.ts`: POST /documents, GET /documents/{id}, POST /documents/{id}/reprocess | `src/mocks/handlers.ts` |
| | Atualizar handler POST /chat/messages para retornar `RagMessageResponse` com sources | `src/mocks/handlers.ts` |

### Vitor (Lógica) — manhã e tarde

| Horário | Tarefa | Arquivos |
|---|---|---|
| **Manhã** | Criar `useDocuments.ts` (ingest, polling, reprocess) | `src/hooks/useDocuments.ts` |
| | Criar `document.service.ts` | `src/services/document.service.ts` |
| **Tarde** | Atualizar `useChat.ts` — `sendMessage()` processa `sources[]`, expõe `sourcesByMessageId` | `src/hooks/useChat.ts` |
| | Atualizar `useFileUpload.ts` — expor `ingestionStatus` e `ingestionDocumentId` | `src/hooks/useFileUpload.ts` |
| | Atualizar `chat.service.ts` — `sendMessage()` retorna `RagMessageResponse` | `src/services/chat.service.ts` |

### Ana (UI) — manhã e tarde

| Horário | Tarefa | Arquivos |
|---|---|---|
| **Manhã** | Criar `SourcePanel.tsx` — painel colapsável com cards de fonte | `src/components/chat/SourcePanel.tsx` |
| | Criar `IngestionStatus.tsx` — badge de status PROCESSING/COMPLETED/FAILED | `src/components/chat/IngestionStatus.tsx` |
| **Tarde** | Atualizar `MessageBubble.tsx` — prop `sources`, renderizar `SourcePanel` | `src/components/chat/MessageBubble.tsx` |
| | Atualizar `MessageList.tsx` — prop `sourcesByMessageId`, repassar | `src/components/chat/MessageList.tsx` |
| | Atualizar `FileAttachmentPreview.tsx` — prop `ingestionStatus` | `src/components/chat/FileAttachmentPreview.tsx` |

---

## Dia 2 — Integração + QA

### Vitor (Lógica) — manhã

| Tarefa | Arquivos |
|---|---|
| Atualizar `ChatWindow.tsx` — prop `sourcesByMessageId` | `src/components/chat/ChatWindow.tsx` |
| Atualizar `ChatPage.tsx` — conectar `useDocuments` + `useChat` + `useFileUpload` | `src/pages/ChatPage.tsx` |

### Juliano (Infra) — manhã

| Tarefa |
|---|
| **PAR com Vitor** — revisão e finalização do `ChatPage.tsx` |
| Validar `npm run dev` sem erros |

### Ana (UI) — manhã

| Tarefa | Arquivos |
|---|---|
| Ajustes finos de CSS (transições, hover, estados vazio) | `src/components/chat/*.tsx` |
| Testar visualmente todos os estados no MSW | — |

### Tarde (todos)

| Pessoa | Tarefa |
|---|---|
| **Vitor** | Tratamento de erro 503 (LLM indisponível) + AGENTS.md |
| **Juliano** | QA final: MSW `onUnhandledRequest` limpo, merge |
| **Ana** | README.md atualizado |

---

## Matriz RACI

| Tarefa | Complexidade | Ana | Vitor | Juliano |
|---|---|---|---|---|
| SourcePanel.tsx | ⭐⭐ | **D** | N | — |
| IngestionStatus.tsx | ⭐ | **D** | — | N |
| MessageBubble (atualizar) | ⭐ | **D** | N | — |
| MessageList (atualizar) | ⭐ | D | — | **N** |
| FileAttachmentPreview (atualizar) | ⭐ | **D** | — | N |
| ChatWindow (atualizar) | ⭐⭐ | N | **D** | — |
| useDocuments.ts | ⭐⭐⭐ | — | **D** | N |
| useChat (atualizar) | ⭐⭐ | — | **D** | N |
| useFileUpload (atualizar) | ⭐ | — | D | **N** |
| document.service.ts | ⭐ | — | **D** | N |
| chat.service (atualizar) | ⭐ | — | D | **N** |
| Tipos api.ts | ⭐⭐ | — | N | **D** |
| Handlers MSW + fixtures | ⭐⭐ | — | — | **D** |
| swagger.yaml (atualizar) | ⭐ | — | — | **D** |
| ChatPage.tsx (orquestração) | ⭐⭐⭐ | N | **D** | N |
| QA + README + AGENTS | ⭐ | N | N | **D** |

---

## Distribuição de Carga

| Pessoa | Dia 1 (tarefas) | Dia 2 (tarefas) | Complexidade total |
|---|---|---|---|
| **Ana** | 4 (SourcePanel, IngestionStatus, MessageBubble, MessageList, FileAttachmentPreview) | 2 (CSS, README) | ⭐⭐⭐ (média) |
| **Vitor** | 4 (useDocuments, document.service, useChat, chat.service, useFileUpload) | 3 (ChatWindow, ChatPage, tratamento 503, AGENTS) | ⭐⭐⭐⭐⭐ (alta) |
| **Juliano** | 4 (tipos, swagger, fixtures, handlers) | 2 (PAR ChatPage, QA, merge) | ⭐⭐⭐⭐ (média-alta) |

**Nota:** A carga entre Vitor e Juliano no Dia 1 é equilibrada — Vitor tem mais lógica (hooks), Juliano tem mais infra (mocks). No Dia 2, Vitor concentra a integração (ChatPage) com suporte de Juliano (PAR).

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
