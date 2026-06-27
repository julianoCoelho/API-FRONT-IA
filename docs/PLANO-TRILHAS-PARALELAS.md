# Plano de Execução — Trilhas Paralelas (2 Dias)

> **Projeto:** Chat IA — Front-end Parte 2 (RAG + Ingestão de Documentos)  
> **Stack:** React 19 · TypeScript · Vite · MSW · Tailwind CSS  
> **Time:** Ana (iniciante — UI) · Vitor (intermediário — Lógica) · Juliano (intermediário — Infra)  
> **Contrato:** `openapi-parte2.yaml` (fonte única da verdade)

---

## Dia 1 — Fundação + Mocks (paralelo total)

### Manhã

| Ana (UI) | Vitor (Lógica) | Juliano (Infra) |
|---|---|---|
| `SourcePanel.tsx` — painel colapsável de fontes (props: `sources`) | `useDocuments.ts` — hook com polling de status + ingest + reprocess | Tipos TypeScript novos em `api.ts` (`SourceResponse`, `RagMessageResponse`, `DocumentResponse`, `DocumentStatusResponse`, `DocumentStatus`, `HealthResponse`) |
| `IngestionStatus.tsx` — badge de status (PROCESSING/COMPLETED/FAILED) | | `document.service.ts` — `ingestDocument()`, `getDocumentStatus()`, `reprocessDocument()` |

### Tarde

| Ana (UI) | Vitor (Lógica) | Juliano (Infra) |
|---|---|---|
| Atualizar `MessageBubble.tsx` — prop `sources`, renderizar `SourcePanel` | Atualizar `useChat.ts` — `sendMessage()` extrai `sources[]`, expõe `sourcesByMessageId` | Atualizar `handlers.ts` — POST /documents, GET /documents/{id}, POST /documents/{id}/reprocess + POST /chat/messages com sources |
| Atualizar `MessageList.tsx` — prop `sourcesByMessageId`, repassar ao `MessageBubble` | Atualizar `useFileUpload.ts` — expor `ingestionStatus` | Criar fixtures `documents.ts` + `sources.ts` |
| | | Atualizar `swagger.yaml` com schemas da Parte 2 |

---

## Dia 2 — Integração + QA

### Manhã

| Ana (UI) | Vitor (Lógica) | Juliano (Infra) |
|---|---|---|
| Ajustes finos de UI (estados vazio, hover, transições CSS) | Atualizar `ChatWindow.tsx` — prop `sourcesByMessageId` | **PAR com Vitor** — Atualizar `ChatPage.tsx` (orquestração: upload → ingest → polling → sources) |
| Teste visual de todos os estados no MSW | Atualizar `FileAttachmentPreview.tsx` — prop `ingestionStatus` | |
| | Conectar hooks no `ChatPage.tsx` | |

### Tarde

| Ana (UI) | Vitor (Lógica) | Juliano (Infra) |
|---|---|---|
| Finalizar README.md | Tratamento de erro 503 (LLM indisponível) | QA geral: `npm run dev` sem warnings, MSW limpo |
| | Documentar AGENTS.md | Merge final |

---

## Matriz RACI

| Tarefa | Ana | Vitor | Juliano |
|---|---|---|---|
| SourcePanel.tsx | **D** | N | — |
| IngestionStatus.tsx | **D** | — | N |
| MessageBubble (atualizar) | **D** | N | — |
| MessageList (atualizar) | D | — | **N** |
| FileAttachmentPreview (atualizar) | **D** | — | N |
| ChatWindow (atualizar) | N | **D** | — |
| useDocuments.ts | — | **D** | N |
| useChat (atualizar) | — | **D** | N |
| useFileUpload (atualizar) | — | D | **N** |
| document.service.ts | — | **D** | N |
| chat.service (atualizar) | — | D | **N** |
| Tipos api.ts | — | N | **D** |
| Handlers MSW + fixtures | — | — | **D** |
| swagger.yaml | — | — | **D** |
| ChatPage.tsx (orquestração) | N | **D** | N |
| QA + README + AGENTS | N | N | **D** |

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
