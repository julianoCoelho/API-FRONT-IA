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