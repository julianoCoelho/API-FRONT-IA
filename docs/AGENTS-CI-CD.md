### Evolução Incremental e Resolução de Conflitos

**Papel:** Arquiteto React, Engenheiro de Integração Front-end Sênior e Tech Lead.

Este arquivo documenta as resoluções manuais de *Merge Conflicts*, testes de fumaça (*smoke tests*) e correção de comportamentos nativos de API do Navegador (*Drag and Drop*).



### 1. Validação do MSW e Teste de Fumaça (Smoke Test)

> **Prompt:** Atue como Engenheiro de Qualidade / Core Tech Lead. Analise os arquivos de roteamento 'src/App.tsx', a inicialização do mock service worker em 'src/main.tsx' e o arquivo 'src/mocks/browser.ts'.
> 
> Precisamos garantir que o Critério de Aceite (DoD Compacto) do plano de sprint seja cumprido:
> 
> 1. Certifique-se de que o MSW está configurado para iniciar em modo de desenvolvimento através de 'worker.start({ onUnhandledRequest: 'warn' })'.
> 2. Verifique se o roteamento lida perfeitamente com fluxos onde o token não existe, jogando o usuário para o fluxo de autenticação.
> 3. Ajuste quaisquer inconsistências de tipagem TypeScript originadas dos schemas importados do 'src/types/api.ts' nas páginas que conectam a UI aos hooks.

> **Prompt:** Atue como Desenvolvedor Front-end. Preciso testar se o meu arquivo 'src/services/api.ts' está injetando corretamente o JWT e se o MSW intercepta chamadas.
> 
> Modifique temporariamente o arquivo 'src/App.tsx' para:
> 
> 1. Incluir um 'useEffect' que faz um disparo 'api.get("/health")' assim que a aplicação for montada.
> 2. Certifique-se de que se houver um token no localStorage, o interceptor adicione o header correspondente.
> 3. Adicione um console.log(response.data) no sucesso e um console.error(error) na falha.
> 
> Isso servirá apenas como um teste de fumaça (smoke test) para validar a infraestrutura antes do Vitor plugar os hooks reais.

### 2. Criação e Refinamento de Componente de Upload Dinâmico

> **Prompt:** Atue como UI Engineer React. No componente 'src/components/chat/FileAttachmentPreview.tsx' (ou diretamente no container de upload dentro da ChatWindow), certifique-se de incluir uma barra de progresso visual utilizando Tailwind CSS.
> 
> Requisitos Visuais:
> 
> 1. O componente deve receber uma propriedade opcional ou obrigatória chamada 'progress' (número de 0 a 100).
> 2. Renderize uma barra horizontal cinza clara background ('bg-gray-200') e uma div interna colorida (ex: 'bg-blue-600') cuja largura seja controlada dinamicamente via inline style (style={{ width: `${progress}%` }}).
> 3. Exiba o texto amigável do percentual (ex: "Uploading... 45%") enquanto o progresso for menor que 100.

> **Prompt:** Atue como UI Engineer React e especialista em Tailwind CSS. Precisamos refinar o componente de anexo de arquivos para atender estritamente ao requisito de "barra de progresso visual" da especificação do sistema.
> 
> Modifique o arquivo 'src/components/chat/FileAttachmentPreview.tsx' (ou o equivalente onde o arquivo anexado é exibido) para:
> 
> 1. Atualizar a interface de Props do componente para aceitar uma propriedade opcional ou obrigatória: 'progress?: number' (um número de 0 a 100).
> 2. Dentro do JSX, logo abaixo ou ao lado do nome do arquivo, adicione uma barra de progresso visual utilizando as seguintes classes Tailwind:- Um container externo cinza claro: 'w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-2'- Uma barra interna preenchida dinamicamente (ex: azul ou verde): 'bg-blue-600 h-1.5 rounded-full transition-all duration-300'
> 3. Utilize inline style para controlar dinamicamente a largura da barra interna baseado na prop: style={{ width: `${progress ?? 0}%` }}.
> 4. Adicione um texto discreto de apoio textual ao lado (ex: 'Enviando... 45%') que só deve aparecer se o progresso for maior que 0 e menor que 100. Se for 100, exiba um indicador visual de sucesso (como um check ou texto 'Concluído').
> 5. Garanta que o estilo visual se integre de forma harmônica com o restante do layout do chat já gerado.

### 3. Integração Final das Branches e Resolução de Git Conflicts

> **Prompt:** Atue como Engenheiro de Integração Front-end Sénior em React e TypeScript. O código de UI da Ana (feat/ana-ui-components) e os Hooks de lógica do Vitor (feat/vitor-logic-hooks) foram unificados na minha ramificação. Agora precisamos finalizar a integração dentro das páginas orquestradoras em 'src/pages/'.
> 
> Realize as seguintes correções e implementações:
> 
> 1. No arquivo 'src/App.tsx', remova completamente aquele 'useEffect' temporário de teste de fumaça (smoke test) que faz a chamada direta ao '/health'. Deixe o arquivo limpo apenas com o Provedor de Autenticação e as Rotas protegidas.
> 2. Atualize 'src/pages/LoginPage.tsx' e 'src/pages/RegisterPage.tsx': Importe os componentes visuais de formulário criados pela Ana ('LoginForm' e 'RegisterForm') e conecte-os ao hook 'useAuth' criado pelo Vitor. Passe as propriedades 'isLoading', 'error' e a função 'onSubmit' corretamente.
> 3. Atualize 'src/pages/ChatPage.tsx': Integre os hooks 'useChat' e 'useFileUpload' do Vitor com os componentes visuais da Ana ('AppLayout', 'Sidebar', 'ChatWindow'). Certifique-se de passar a propriedade 'progress' do hook de upload para o componente visual de anexo de arquivos para exibir a barra de progresso.
> 4. Corrija quaisquer problemas de tipagem TypeScript ou incompatibilidades entre as interfaces de Props dos componentes da Ana e os objetos retornados pelos hooks do Vitor. O projeto deve compilar 100% sem erros no terminal.

> **Prompt:** Atue como Engenheiro de Integração Front-end Sénior. Minha branch está em estado de MERGE CONFLICT com a branch do Vitor. Os arquivos 'src/components/auth/LoginForm.tsx', 'src/components/auth/RegisterForm.tsx' e 'src/components/layout/Sidebar.tsx' contêm marcadores de conflito do Git.
> 
> Resolva os conflitos e finalize a integração seguindo estas regras estritas:
> 
> 1. Nos arquivos em conflito (LoginForm, RegisterForm e Sidebar): O lado 'HEAD' (Ours) contém a UI completa e estilizada com Tailwind da Ana. O lado do Vitor (Theirs) contém as chamadas de Hooks. Combine os dois lados mantendo 100% do layout, classes CSS e tags HTML da Ana, mas injetando as funções, estados de loading, erros e submits dos hooks do Vitor ('useAuth' e 'useChat').
> 2. No arquivo 'src/App.tsx': Remova completamente o 'useEffect' temporário que criamos para o teste de fumaça do '/health'. Deixe o arquivo limpo apenas com as rotas e os providers.
> 3. Atualize as páginas orquestradoras em 'src/pages/':- 'LoginPage.tsx' e 'RegisterPage.tsx': Devem renderizar os formulários limpos, garantindo que a lógica flua para o 'useAuth'.- 'ChatPage.tsx': Conecte os hooks 'useChat' e 'useFileUpload' do Vitor aos componentes visuais da Ana ('AppLayout', 'Sidebar', 'ChatWindow'). Passe o estado 'progress' do upload para a barra de progresso visual que refinamos.
> 4. Corrija qualquer erro de tipagem TypeScript entre o retorno dos hooks do Vitor e as Props esperadas pelos componentes da Ana. O projeto deve compilar sem erros.

### 4. Resolução de Falhas de Roteamento (Bug 404) e Auditoria do Swagger

> **Prompt:** Atue como Arquiteto React e especialista em React Router. Após a consolidação do código, a aplicação está renderizando diretamente a página 404 (NotFoundPage) ao ser iniciada. Precisamos auditar o arquivo 'src/App.tsx' e o fluxo de rotas para corrigir isso imediatamente.
> 
> Realize as seguintes ações:
> 
> 1. Analise o 'src/App.tsx' e verifique a definição das rotas (`<Routes>` e `<Route>`). Certifique-se de que os caminhos para '/login', '/register' e '/chat' estão declarados explicitamente, em caixa baixa e sem barras duplicadas.
> 2. Garanta que a rota raiz (`path="/"`) tenha um redirecionamento inteligente: se o usuário estiver autenticado, vai para '/chat'; se não estiver, vai para '/login'. Não deixe a rota raiz vazia ou apontando para o 404.
> 3. Certifique-se de que a rota de fallback (`path="*"`) que renderiza a NotFoundPage esteja posicionada estritamente como a ÚLTIMA rota dentro do componente `<Routes>`.
> 4. Injete um bloco de depuração (`console.log`) temporário dentro do componente principal do 'App.tsx' ou do componente de 'ProtectedRoute' que imprima: o caminho atual da URL (`window.location.pathname`), o estado de 'isAuthenticated' e o estado de 'isLoading' do AuthContext. Isso nos ajudará a rastrear o comportamento no console do navegador.
> 5. Corrija qualquer erro de sintaxe ou importação nas páginas orquestradoras que possa estar quebrando a renderização do roteador.

> **Prompt:** Atue como Arquiteto Front-end Sênior e Engenheiro de Integração. Após a consolidação das branches, a aplicação está renderizando diretamente a página 404 (NotFoundPage) ao iniciar. Além disso, precisamos garantir que o projeto esteja em estrita conformidade com as diretrizes do documento 'BACKEND-SPEC.md' e o contrato 'swagger.yaml'.
> 
> Realize as seguintes ações corretivas e de auditoria:
> 
> 1. Correção do Erro 404 (src/App.tsx):- Audite a definição das rotas (<Routes> e <Route>). Garanta que os caminhos para '/login', '/register' e '/chat' estejam declarados corretamente.- Certifique-se de que a rota raiz (path Mitigado para "/") possua um redirecionamento inteligente baseado no estado de autenticação: se logado, vai para '/chat'; se não logado, vai para '/login'.- Mova a rota de fallback/wildcard (path="*") que renderiza a NotFoundPage para ser estritamente a ÚLTIMA rota dentro do bloco <Routes>.- Injete um 'console.log' temporário de depuração no componente principal ou no ProtectedRoute exibindo: window.location.pathname, isAuthenticated e isLoading.
> 2. Auditoria de Conformidade com o 'BACKEND-SPEC.md' e 'swagger.yaml':- Verifique se os endpoints consumidos pelos hooks e services do Vitor (ex: login, register, chat e o upload de arquivos) seguem exatamente as rotas e os schemas definidos no 'swagger.yaml' (única fonte da verdade de acordo com o SDD).- Certifique-se de que a rota de infraestrutura '/health' está mapeada ou testada de forma isolada sem interferir no fluxo de navegação do usuário, respeitando a separação de escopo do backend.- Garanta que o tratamento de tokens JWT e a estrutura dos payloads enviados combinem perfeitamente com o esperado pelos DTOs e esquemas de segurança descritos no manual do backend.
> 3. Resolução de Quebras.

### 5. Correção de Comportamento de Captura de Upload (Drag and Drop Interception)

> **Prompt:** Atue como Engenheiro Front-end Sénior especializado em interações ricas em React. Temos um bug onde o comportamento nativo do navegador está a intercetar o upload: ao arrastar e largar (drag and drop) um ficheiro na área de mensagem ou no componente de dropzone, o navegador tenta abrir o ficheiro diretamente em vez de processar o upload pelo hook do Vitor.
> 
> Corrija os componentes 'src/components/common/FileDropzone.tsx' (ou onde a zona de drop estiver implementada) e 'src/components/chat/ChatWindow.tsx' seguindo estas diretrizes:
> 
> 1. Garanta que as funções de manipulação de eventos de drag (onDragOver, onDragEnter, onDragLeave e onDrop) chamem explicitamente 'e.preventDefault()' e 'e.stopPropagation()' logo na primeira linha para neutralizar o comportamento nativo do navegador.
> 2. Certifique-se de que o evento 'onDrop' capture corretamente o ficheiro através de 'e.dataTransfer.files[0]' e repasse-o imediatamente para a função de upload gerida pelo hook 'useFileUpload' do Vitor.
> 3. Se houver um estado visual de "isDragging" (para mudar a cor da borda ou mostrar um overlay quando o arquivo está sobre a tela), garanta que ele seja limpo ('false') tanto no 'onDragLeave' quanto no fim do 'onDrop'.
> 4. Verifique se o input invisível do tipo file (caso o usuário prefira clicar em vez de arrastar) também está disparando a mesma função de upload corretamente através do evento 'onChange'.
