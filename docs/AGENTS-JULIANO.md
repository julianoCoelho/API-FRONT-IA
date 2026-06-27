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