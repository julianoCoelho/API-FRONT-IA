# Histórico de Prompts de IA - Juliano

**Papel:** Arquiteto React, Engenheiro de Integração Front-end Sênior e Tech Lead.

Este arquivo documenta as diretrizes enviadas para os agentes de IA focando na amarração estrutural, segurança de rotas, consumo HTTP, resolução de conflitos e correções avançadas de interações de UI.

---

### 1. Axios Client & Interceptor JWT

Atue como Desenvolvedor Front-end Sênior especialista em TypeScript e Axios. Com base no documento 'FRONTEND-SPEC.md' e no 'swagger.yaml', crie o arquivo central de configuração do Axios em 'src/services/api.ts'. 

Requisitos do arquivo:

1. Instancie o axios configurando a baseURL obtida de 'import.meta.env.VITE_API_URL' (utilize 'http://localhost:8080/api' como fallback padrão).
2. Configure um interceptor de requisição (request interceptor) que verifica se existe um token salvo sob a chave 'token' no localStorage. Se houver, adicione o header 'Authorization: Bearer <token>'.
3. Certifique-se de exportar essa instância tipada corretamente para ser consumida pelos demais serviços. Não inclua lógicas de componentes JSX aqui, apenas a infraestrutura HTTP pura.

### 2. AuthContext & Roteamento Central

Atue como Arquiteto React especialista em Context API e React Router Dom v6+. Implemente a infraestrutura de autenticação global e roteamento base nos arquivos 'src/contexts/AuthContext.tsx' e 'src/App.tsx', respeitando estritamente o escopo do 'FRONTEND-SPEC.md'.

Requisitos para AuthContext.tsx:

1. Crie um contexto que gerencie os estados: 'isAuthenticated' (boolean), 'isLoading' (boolean) e 'user' (opcional).
2. Forneça funções básicas para atualizar esses estados ao efetuar login ou logout.
3. Ao inicializar o contexto, verifique se há um token válido no localStorage para manter a sessão ativa.

Requisitos para App.tsx:

1. Configure o RouterProvider ou estrutura de BrowserRouter com as seguintes rotas: '/login', '/register', '/chat' e a rota coringa '*' que renderiza a 'NotFoundPage'.
2. Implemente um componente de proteção de rotas ('ProtectedRoute') que bloqueia o acesso a '/chat' se 'isAuthenticated' for falso.
3. Integre o AuthProvider envolvendo toda a aplicação. Utilize lazy loading ou stubs simples para as páginas (LoginPage, RegisterPage, ChatPage, NotFoundPage) apenas para permitir a compilação, pois elas serão detalhadas no próximo passo.

### 3.Scaffolding das Páginas

Atue como Desenvolvedor Front-end Core. Crie a estrutura inicial das 4 páginas da aplicação na pasta 'src/pages/': LoginPage.tsx, RegisterPage.tsx, ChatPage.tsx e NotFoundPage.tsx. 

Siga estritamente as diretrizes de Separação de Responsabilidades (Apresentação vs Comportamento) descritas no 'FRONTEND-SPEC.md':

1. As páginas devem servir como 'orchestrators' (composição). 
2. LoginPage e RegisterPage devem renderizar os formulários correspondentes dentro do layout correto.
3. ChatPage deve estruturar a visualização combinando o AppLayout (Sidebar + Header) e a ChatWindow.
4. NotFoundPage deve exibir uma mensagem amigável de erro 404 com um botão para retornar para a rota principal.
5. Deixe preparados os pontos de consumo dos Custom Hooks (useAuth, useChat) utilizando retornos mockados temporários, garantindo que o JSX não possua chamadas diretas à APIs ou manipulação complexa de estados de negócio locais.

### 4. Integração, Revisão Cruzada e Merge

Atue como Engenheiro de Qualidade / Core Tech Lead. Analise os arquivos de roteamento 'src/App.tsx', a inicialização do mock service worker em 'src/main.tsx' e o arquivo 'src/mocks/browser.ts'. 

Precisamos garantir que o Critério de Aceite (DoD Compacto) do plano de sprint seja cumprido:

1. Certifique-se de que o MSW está configurado para iniciar em modo de desenvolvimento através de 'worker.start({ onUnhandledRequest: 'warn' })'.
2. Verifique se o roteamento lida perfeitamente com fluxos onde o token não existe, jogando o usuário para o fluxo de autenticação.
3. Ajuste quaisquer inconsistências de tipagem TypeScript originadas dos schemas importados do 'src/types/api.ts' nas páginas que conectam a UI aos hooks.

---

### 5. Atualização de Contrato OpenAPI para RAG (Parte 1)

**Context:** Atualização de contrato OpenAPI para RAG (Parte 2).
**Role:** Tech Lead / Infraestrutura.
**Instructions:** Atualize `src/mocks/swagger.yaml` com schemas `DocumentResponse`, `DocumentStatus` e `RagMessageResponse`. Após isso, regenere as interfaces em `src/types/api.ts`.
**Standards:** Salve este prompt em `docs/AGENTS-Juliano.md`. Mantenha histórico das alterações de contratos.
**Purpose:** Garantir tipagem forte para a ingestão de docs e fontes do RAG.

---

### 6. Mocking de Rotas de Documentos e RAG (Parte 2)

**Context:** Mocking de rotas de documentos e RAG.
**Role:** Tech Lead / Infraestrutura.
**Instructions:** Crie `src/mocks/fixtures/documents.ts` e `sources.ts`. Implemente os handlers no `handlers.ts` para: POST `/documents` (upload), GET `/documents/{id}` (polling status) e a nova estrutura de resposta do chat com `sources`.
**Standards:** Valide se os status (PENDING, PROCESSING, COMPLETED, FAILED) estão sendo simulados corretamente.
**Purpose:** Permitir desenvolvimento paralelo sem dependência do backend real.

---

### 7. Service Layer para Documentos (Parte 3)

**Context:** Service layer para documentos.
**Role:** Tech Lead / Infraestrutura.
**Instructions:** Crie `src/services/document.service.ts` com métodos `ingestDocument`, `getDocumentStatus` e `reprocessDocument`. Use o `axios` configurado com o interceptor de JWT.
**Standards:** Use tipagens de `api.ts`. Garantir tratamento de erro básico.
**Purpose:** Abstrair complexidade de rede para a camada de Hooks.

---

### 8. Limpeza e Padronização — Remoção de console.logs, Migração de SourceResponse e Atualização de Status de Ingestão

**Context:** Limpeza e padronização pós-integração.
**Role:** Arquiteto Front-end Sênior / Tech Lead.
**Instructions:** Realize as seguintes ações de limpeza e padronização no código:

1. **Remover console.logs do App.tsx:** Os blocos de depuração temporários nos componentes `ProtectedRoute` e `RootRedirect` foram removidos, deixando o arquivo limpo apenas com lógica de navegação e providers.

2. **Migrar SourceResponse de `src/types/source.ts` para `src/types/api.ts`:** A interface `SourceResponse` duplicada em `source.ts` (shape antigo: `{ id, documentName, page?, snippet, score? }`) foi removida. O código agora usa exclusivamente a definição em `api.ts` (shape alinhado ao OpenAPI: `{ documentId, documentName, chunkIndex, excerpt, score }`). Os componentes afetados (`SourcePanel.tsx`, `MessageBubble.tsx`, `chat/types.ts`) foram atualizados nos imports e no acesso às propriedades (`documentId`, `excerpt`, `chunkIndex`). O arquivo `src/types/source.ts` foi deletado.

3. **Atualizar `src/types/ingestion.ts` com os novos status OpenAPI:** O tipo `DocumentStatus` migrou de `'PENDING' | 'PROCESSING' | 'READY' | 'ERROR'` para `'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'`, alinhado ao `DocumentStatus` do contrato OpenAPI em `api.ts`. O mapeamento `DOCUMENT_STATUS` e o componente `IngestionStatus.tsx` foram atualizados correspondentemente.

**Arquivos alterados:**
- `src/App.tsx` — remoção de console.logs
- `src/types/source.ts` — deletado
- `src/types/ingestion.ts` — status atualizados
- `src/components/chat/SourcePanel.tsx` — import e props migrados
- `src/components/chat/MessageBubble.tsx` — import migrado
- `src/components/chat/types.ts` — import migrado
- `src/components/common/IngestionStatus.tsx` — keys/labels dos status atualizados
- `docs/AGENTS-JULIANO.md` — registro deste prompt

**Standards:** Manter tipagem forte e alinhamento com o contrato OpenAPI. Remover código morto e duplicado.
**Purpose:** Garantir consistência tipológica com o backend e eliminar resíduos de depuração.

---

### 9. Integração de Dados RAG — Fluxo sourcesByMessageId na Árvore de Componentes

**Context:** Integração de dados RAG — o hook `useChat` já populava corretamente `sourcesByMessageId` no `sendMessage()`, mas o dado nunca era repassado pela árvore de componentes. O `MessageBubble` nunca recebia `sources`, e o `SourcePanel` nunca era renderizado.

**Role:** Arquiteto Front-end Sênior / Tech Lead.

**Instructions:** Conecte o `sourcesByMessageId` desde o `useChat` até o `MessageBubble`, passando por `ChatPage`, `ChatWindow` e `MessageList`:

1. **`src/pages/ChatPage.tsx`** — Destruturar `sourcesByMessageId` de `useChat()` e passar como prop `<ChatWindow sourcesByMessageId={...} />`.

2. **`src/components/chat/ChatWindow.tsx`** — Adicionar prop `sourcesByMessageId: Record<string, SourceResponse[]>` à interface `ChatWindowProps`. Importar `SourceResponse` de `../../types/api`. Repassar a prop para `<MessageList sourcesByMessageId={...} />`.

3. **`src/components/chat/MessageList.tsx`** — Adicionar prop `sourcesByMessageId` à interface `MessageListProps`. Importar `SourceResponse` de `../../types/api`. No `map` de mensagens, fundir fontes: `sources={msg.sources ?? sourcesByMessageId[msg.id]}`, usando o dicionário como fallback.

4. **Nenhuma alteração** em `types.ts`, hooks, serviços ou mocks — toda a lógica de negócio já existia, apenas o encadeamento de props estava quebrado.

**Arquivos alterados:**
- `src/pages/ChatPage.tsx` — destruturação e passagem de `sourcesByMessageId`
- `src/components/chat/ChatWindow.tsx` — interface e passagem de `sourcesByMessageId`
- `src/components/chat/MessageList.tsx` — fallback `sourcesByMessageId[msg.id]` no render
- `docs/AGENTS-JULIANO.md` — registro deste prompt

**Standards:** Preservar a separação de responsabilidades — o hook mantém fontes separadas das mensagens; o merge acontece apenas no ponto de renderização.
**Purpose:** Garantir que fontes RAG sejam exibidas corretamente no `SourcePanel` dentro de cada bolha de mensagem do assistente.

---

### 10. Correção de Bugs e Ajustes de Spec — Duplicação de Mensagens, Score Bar, Truncamento, IngestionStatus

**Context:** Correção de bugs pós-integração e alinhamento fino com a especificação `FRONTEND-SPEC-PARTE2.md`. Três frentes: (A) bug de mensagem duplicada, (B) SourcePanel com score bar + truncamento, (C) IngestionStatus com props e labels corretos.

**Role:** Arquiteto Front-end Sênior / Tech Lead.

**Instructions (A) — Bug de mensagem duplicada:**

O `sendMessage` em `useChat.ts` não tinha proteção contra reentrância: entre o clique e `setIsSending(true)`, um segundo clique rápido entrava na função e adicionava outro `userMessage` otimista ao estado. Corrigido com `useRef` guard:

1. Importar `useRef` de `react`
2. Criar `const sendingRef = useRef(false)`
3. No início de `sendMessage`: `if (!activeSession || sendingRef.current) return; sendingRef.current = true`
4. No `finally`: `sendingRef.current = false`

**Instructions (B) — SourcePanel com score bar e truncamento:**

1. Adicionar função `scoreColor(score)` que retorna classe Tailwind: verde (`bg-green-500`) para ≥ 0.8, amarelo (`bg-yellow-500`) para ≥ 0.6, vermelho (`bg-red-500`) para < 0.6
2. Adicionar função `truncate(text, max)` que corta em `max` caracteres e adiciona `…`
3. No card de cada fonte: exibir `excerpt` truncado em 200 caracteres com botão "Mostrar mais"/"Mostrar menos"
4. Abaixo do excerpt: barra de progresso horizontal com largura = `score * 100%` e cor conforme `scoreColor`
5. Porcentagem numérica ao lado (`Math.round(score * 100)%`)

**Instructions (C) — IngestionStatus conforme spec:**

1. Adicionar props `fileName?: string` e `errorMessage?: string | null` à interface
2. Exibir `fileName` antes do badge de status (truncado em 180px)
3. Atualizar labels: `PROCESSING` → "Processando…", `COMPLETED` → "Indexado", `FAILED` → "Falha na indexação"
4. Quando `status === 'PROCESSING'`: renderizar barra indeterminada com `animate-pulse` 
5. Quando `status === 'FAILED'` e `errorMessage` presente: exibir mensagem de erro em vermelho

**Arquivos alterados na branch `fix/rag-data-flow-and-spec-gaps`:**
- `src/hooks/useChat.ts` — `useRef` guard contra reentrância em sendMessage
- `src/components/chat/SourcePanel.tsx` — score bar colorida, truncamento excerpt, "Mostrar mais/menos"
- `src/components/common/IngestionStatus.tsx` — props `fileName`/`errorMessage`, labels da spec, barra PROCESSING
- `docs/AGENTS-JULIANO.md` — registro deste prompt

**Standards:** Manter tipagem forte, alinhamento com o contrato OpenAPI, e separação Apresentação vs Comportamento.
**Purpose:** Eliminar bug de UX (mensagem duplicada), atender requisitos visuais da Parte 2 (score bar, labels, estados de ingestão).