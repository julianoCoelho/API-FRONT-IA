# Histórico de Prompts de IA - Ana

**Papel:** Desenvolvedora Front-end Specialist e UI Engineer React.

Este arquivo lista os comandos focados estritamente na construção visual atômica, estilizações base com Tailwind CSS, estruturação flexível de componentes injetáveis de layout e utilitários visuais.

---

### 1. Criação de Design System Atômico (Componentes Common)

Atue como Desenvolvedor Front-end especialista em React e Tailwind CSS. Crie os componentes base da aplicação na pasta 'src/components/common/': Button.tsx, Input.tsx, Spinner.tsx e FileDropzone.tsx.

Requisitos:

1. Siga o padrão de Spec-Driven Development (SDD), focando apenas na camada de Apresentação (JSX puro).
2. O Button e o Input devem estender as propriedades nativas do HTML (ex: React.ButtonHTMLAttributes<HTMLButtonElement>) para serem reutilizáveis.
3. Utilize Tailwind CSS para a estilização. O Input deve ter estilos para estados de erro (bordas vermelhas).
4. O FileDropzone deve ser um componente puramente visual de drag-and-drop, recebendo uma função callback 'onFileSelect' via props. Não inclua lógica de upload real aqui.

### 2. Criação de Componentes Globais de Layout e

Atue como UI Engineer React. Crie os componentes de layout e formulários da aplicação utilizando Tailwind CSS.

Requisitos para layout/ (AppLayout, Sidebar, Header):

1. O AppLayout deve usar Flexbox/Grid para organizar a Sidebar na lateral esquerda (fixa) e o conteúdo principal à direita. Utilize 'children' para renderizar o miolo.
2. O Header deve conter um espaço para o título da página e um botão de logout puramente visual.

Requisitos para auth/ (LoginForm, RegisterForm):

1. Monte os formulários utilizando os componentes 'Input' e 'Button' criados anteriormente.
2. Eles não devem conter a regra de negócio do login/registro. Devem apenas receber propriedades como 'isLoading', 'error' (para mostrar mensagens de erro amigáveis) e uma função 'onSubmit' repassando os dados do formulário.

### 3. Componentização de Views Conversacionais de Chat

Atue como Desenvolvedor Front-end especialista em interfaces conversacionais. Crie os componentes visuais do chat em 'src/components/chat/' usando Tailwind CSS.

Requisitos:

1. MessageBubble: Deve receber o conteúdo da mensagem e uma prop 'role' (USER ou ASSISTANT). Mensagens do USER devem ficar alinhadas à direita com fundo diferente das mensagens do ASSISTANT (alinhadas à esquerda).
2. MessageList: Deve renderizar uma lista de MessageBubbles com rolagem (overflow-y-auto).
3. MessageInput: Deve conter um campo de texto, um botão de anexo e um botão de envio. Receberá a prop 'onSendMessage'.
4. FileAttachmentPreview: Um card pequeno visual mostrando o nome do arquivo anexado e um ícone para remover.
5. ChatWindow: O componente agregador que junta o MessageList e o MessageInput em um flex container de altura total da tela.

### 4. Funções e Helpers TypeScript Puros

Atue como Desenvolvedor TypeScript. Crie utilitários puros (sem dependências do React) para formatação e validação visual na pasta 'src/utils/'.

Requisitos:

1. format.ts: Crie a função 'formatDate' (para exibir hora/minuto das mensagens) e 'formatFileSize' (converte bytes para KB ou MB de forma amigável).
2. validation.ts: Crie funções puras para validar o lado do cliente antes do envio, como 'validateFile' (retorna erro visual se não for TXT/PDF ou se passar de 5MB) e 'validateMessage' (verifica se o texto não está vazio).