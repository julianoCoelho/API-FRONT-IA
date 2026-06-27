# AGENTS-VITOR.md — Registro de Prompts e Status

**Papel:** Frontend Developer (Foco em Hooks e Lógica de Negócio)
**Sprint:** Parte 2 — RAG e Ingestão de Documentos
**Especificação:** `FRONTEND-SPEC-PARTE2.md`

---

## Prompt Atual

> **Contexto:** Implementação de Hooks para RAG e Ingestão de Documentos.
> **Role:** Frontend Developer (Foco em Hooks e Lógica de Negócio).
> **Standards:** Hooks devem encapsular toda a lógica de `axios` e `useState`. Nenhuma lógica de negócio dentro dos componentes visuais.
> **Purpose:** Entregar hooks robustos (polling e gestão de estado) para a feature de documentos.

---

## Status da Implementação

| # | Arquivo | Ação | Status |
|---|---------|------|--------|
| 1 | `src/types/api.ts` | Adicionar `SourceResponse`, `CreateSessionRequest`, `DocumentStatusResponse`; corrigir `RagMessageResponse.sources` para `SourceResponse[]` | ✅ Completo |
| 2 | `src/services/chat.service.ts` | `sendMessage` retorna `RagMessageResponse` | ✅ Completo |
| 3 | `src/services/document.service.ts` | `getDocumentStatus` retorna `DocumentStatusResponse` | ✅ Completo |
| 4 | `src/hooks/useChat.ts` | Adicionar `sourcesByMessageId` ao estado e retorno | ✅ Completo |
| 5 | `src/hooks/useFileUpload.ts` | Adicionar `ingestionStatus` e `ingestionDocumentId` ao retorno | ✅ Completo |
| 6 | `src/hooks/useDocuments.ts` | Verificar alinhamento — já implementado com polling a cada 2s | ✅ Completo |
| 7 | `src/mocks/fixtures/sources.ts` | Alinhar `MockSource` com `SourceResponse` | ✅ Completo |
| 8 | `src/mocks/handlers.ts` | Adicionar `POST /documents/:id/reprocess`; sources no padrão `SourceResponse` | ✅ Completo |
| 9 | `docs/AGENTS-VITOR.md` | Registrar status e bloqueios | ✅ Completo |

---

## Bloqueios

- **Nenhum bloqueio crítico.** Todas as dependências de tipos estavam presentes no `api.ts`.

---

## Observações

- `SourcePanel.tsx`, `IngestionStatus.tsx`, `MessageBubble.tsx`, `MessageList.tsx`, `ChatWindow.tsx`, `FileAttachmentPreview.tsx` — componentes visuais de responsabilidade de outros agents (Ana/Juliano).
- `ChatPage.tsx` — orquestrador de responsabilidade de Juliano (já conecta `useDocuments`, `useChat`, `useFileUpload`).
- A validação de arquivo existe em dois lugares (`validation.ts` e `useFileUpload.ts`) — manter ambas por separação de responsabilidades.
- O hook `useDocuments.ts` já estava implementado com polling a cada 2s e `clearInterval` em COMPLETED/FAILED — apenas import ajustado para `DocumentStatusResponse`.
