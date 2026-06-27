# Histórico de Prompts de IA - Vitor

**Papel:** Engenheiro de Software Core, Especialista em MSW, Serviços e State Management (Custom Hooks).

Este arquivo reúne as instruções fornecidas às IAs para o desenvolvimento da lógica de negócio offline/online, consumo dos microsserviços e estruturação de dados globais.

---

### 1. Camada de Simulação e Interceptação de API (MSW)

Atue como Engenheiro de Software especialista em MSW (Mock Service Worker) e TypeScript. Com base nas definições do 'swagger.yaml' e no arquivo 'FRONTEND-SPEC.md', crie a infraestrutura de simulação local.

Requisitos:

1. Crie arquivos de fixtures em 'src/mocks/fixtures/' para simular dados de utilizadores ('users.ts'), sessões de chat ('sessions.ts') e mensagens de chat ('messages.ts').
2. Implemente os handlers no arquivo 'src/mocks/handlers.ts' interceptando as rotas de Autenticação (/auth/login, /auth/register), Chat (/chat/sessions, /chat/sessions/{sessionId}/messages) e Infraestrutura (/health).
3. Garanta que as respostas mockadas respeitam fielmente os Schemas descritos no swagger (como LoginResponse, RegisterResponse, e as coleções de mensagens).
4. Retorne erros adequados (ex: 401 Unauthorized se as credenciais estiverem incorretas).

### 2. Camada de Comunicação com Endpoint Back-end

Atue como Desenvolvedor Core TypeScript. Desenvolva as camadas de serviços da aplicação em 'src/services/' consumindo o cliente HTTP configurado em 'src/services/api.ts'.

Requisitos:

1. Crie 'auth.service.ts' com os métodos 'login' e 'register'.
2. Crie 'chat.service.ts' com os métodos para listar sessões ('getSessions'), criar sessão ('createSession'), listar mensagens ('getMessages') e enviar mensagem ('sendMessage').
3. Crie 'file.service.ts' para lidar com o envio de ficheiros ('uploadFile') e download ('downloadFile').
4. Utilize estritamente as tipagens geradas a partir do Swagger localizadas em 'src/types/api.ts' para tipar os argumentos de entrada e os retornos de cada método de serviço.

### 3. Desenvolvimento de Custom Hooks de Estado Global e Negócio

Atue como Desenvolvedor React Sénior especialista em Custom Hooks e gestão de estados. Crie os hooks da aplicação localizados na pasta 'src/hooks/'.

Requisitos baseados no 'FRONTEND-SPEC.md':

1. Todo o hook deve declarar e exportar explicitamente uma interface tipada de retorno (ex: 'interface UseAuthReturn').
2. useAuth.ts: Deve interagir com o AuthContext e o auth.service.ts para expor funções de login, registo e estado de autenticação.
3. useChat.ts: Deve gerir a sessão ativa do chat, o array de mensagens trocadas com a IA e a mutação para o envio de novas mensagens de texto.
4. useFileUpload.ts: Deve gerir o estado de upload de ficheiros anexados e expor erros visuais caso as validações falhem.
5. useHealth.ts: Deve verificar a saúde do sistema chamando o endpoint correspondente.
6. Todos os hooks devem gerir de forma consistente o padrão de estados '{ data, isLoading, error }'.

### 4. Acoplamento Lógico e Atualização Preliminar de Páginas

Atue como Engenheiro de Integração Front-end em React. Atualize as páginas orchestrators localizadas em 'src/pages/' para conectar a lógica de negócio dos hooks à interface visual dos componentes.

Requisitos:

1. Em 'LoginPage.tsx' e 'RegisterPage.tsx', consuma o hook 'useAuth' e passe os estados de 'isLoading', 'error' e a função de submissão para dentro dos formulários correspondentes.
2. Em 'ChatPage.tsx', integre o 'useChat' e o 'useFileUpload'. Passe o histórico de mensagens e o estado de carregamento da IA para a janela de Chat.
3. Certifique-se de que nenhum componente de apresentação de UI faz chamadas diretas a serviços ou manipula dados complexos; a página deve servir estritamente como a cola conectora (orquestradora).