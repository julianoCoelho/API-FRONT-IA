export interface MockSource {
  id: string
  fileName: string
  snippet: string
  relevance: number
}

export const sources: MockSource[] = [
  {
    id: 'src-001-xxxx-yyyy-zzzz-000000000001',
    fileName: 'manual-typescript.pdf',
    snippet:
      'TypeScript é um superconjunto do JavaScript que adiciona tipagem estática opcional, permitindo detectar erros em tempo de compilação.',
    relevance: 0.95,
  },
  {
    id: 'src-002-xxxx-yyyy-zzzz-000000000002',
    fileName: 'guia-rapido-react.txt',
    snippet:
      'React é uma biblioteca JavaScript para construir interfaces de usuário baseadas em componentes reutilizáveis e estado unidirecional.',
    relevance: 0.87,
  },
  {
    id: 'src-003-xxxx-yyyy-zzzz-000000000003',
    fileName: 'especificacao-api.pdf',
    snippet:
      'A API segue o padrão RESTful com autenticação via JWT Bearer tokens e suporte a upload de arquivos TXT e PDF até 5MB.',
    relevance: 0.92,
  },
  {
    id: 'src-004-xxxx-yyyy-zzzz-000000000004',
    fileName: 'manual-typescript.pdf',
    snippet:
      'Interfaces no TypeScript permitem definir contratos para a forma dos objetos, especificando propriedades e métodos obrigatórios.',
    relevance: 0.78,
  },
  {
    id: 'src-005-xxxx-yyyy-zzzz-000000000005',
    fileName: 'especificacao-api.pdf',
    snippet:
      'O endpoint /documents gerencia a ingestão de documentos no pipeline RAG, suportando os status PENDING, PROCESSING, COMPLETED e FAILED.',
    relevance: 0.71,
  },
]

export function getRandomSources(count: number = 2): MockSource[] {
  const shuffled = [...sources].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
