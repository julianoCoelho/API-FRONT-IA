# 🤖 Chat IA — Frontend

Interface web moderna para conversação com Inteligência Artificial, construída com React e TypeScript seguindo a abordagem **Spec-Driven Development (SDD)** — o contrato da API (Swagger) é a fonte única da verdade, com Mock Service Worker simulando o backend em desenvolvimento.

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![MSW](https://img.shields.io/badge/MSW-FF6A33?logo=mockserviceworker&logoColor=fff)

---

## 👥 Equipe do Projeto

**Membros gerais do grupo:** Luiza Tavares e João Farias.

### 🎯 Célula Frontend

| Membro | Papel |
|---|---|
| **Ana Paula** | Componentes de UI, Telas de Autenticação e Design System (Tailwind/JSX) |
| **Vitor Marcelino** | Lógica de negócio, Custom Hooks, integração com Mock Service Worker (MSW) e estados globais |
| **Juliano Coelho** | Tech Lead, Infraestrutura de rede (Axios), AuthContext e Roteamento Seguro |

---

## 🏗️ Arquitetura

O projeto segue **Spec-Driven Development**: o contrato da API está definido em `src/mocks/swagger.yaml`, e a partir dele foram gerados os tipos TypeScript. O Mock Service Worker (MSW) intercepta todas as requisições HTTP em desenvolvimento, eliminando a dependência de um backend real.

### Separação de responsabilidades

- **Camada visual** — Componentes React puros (JSX + Tailwind), sem lógica de rede.
- **Camada de lógica** — Custom Hooks que encapsulam chamadas à API, validações e estado local.
- **Camada de rede** — Axios configurado com interceptores de autenticação, centralizado em `src/services/api.ts`.
- **Camada de mock** — MSW handlers que reproduzem fielmente o comportamento descrito no Swagger.

### Fluxo de dados

```
Swagger (contrato) → Tipos TypeScript → MSW Handlers → Hooks (serviços) → Componentes
```

---

## 🚀 Como rodar localmente

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd api-front-ia

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

> ⚠️ O **MSW (Mock Service Worker)** será iniciado automaticamente junto com o Vite e interceptará todas as chamadas às rotas `/api/*`. Nenhum backend real é necessário para desenvolvimento.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite + MSW) |
| `npm run build` | Compila TypeScript e gera o bundle de produção |
| `npm run preview` | Servir o build de produção localmente |
| `npm run lint` | Executa o linter (Oxlint) |
| `npm run generate-types` | Regenera os tipos TypeScript a partir do Swagger |

---

## 📁 Estrutura do projeto

```
src/
├── components/       # Componentes reutilizáveis (UI, formulários, layout)
│   ├── auth/         # LoginForm, RegisterForm
│   ├── chat/         # ChatWindow, MessageBubble
│   ├── common/       # FileDropzone, Input, Button
│   └── layout/       # AppLayout, Sidebar, Header
├── contexts/         # AuthContext (estado global de autenticação)
├── hooks/            # useAuth, useChat, useFileUpload (custom hooks)
├── mocks/            # Swagger, MSW handlers, fixtures
├── pages/            # LoginPage, RegisterPage, ChatPage, NotFoundPage
├── services/         # api.ts (Axios), auth.service, chat.service, file.service
├── types/            # api.ts (interfaces geradas do Swagger)
└── App.tsx           # Roteamento principal com proteção de rotas
```

---

## 🛡️ Funcionalidades

- 🔐 Autenticação com JWT (login/registro)
- 💬 Sessões de conversa com histórico de mensagens
- 📎 Upload de arquivos (TXT e PDF, até 5MB) com arrastar e soltar
- 🔒 Rotas protegidas (redirecionamento automático para login)
- 🎨 Design responsivo com Tailwind CSS
- 📡 Mock Service Worker simulando todas as rotas da API
