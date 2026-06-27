export interface MockSource {
  documentId: string
  documentName: string
  chunkIndex: number
  excerpt: string
  score: number
}

export const sources: MockSource[] = [
  {
    documentId: 'doc-001-aaaa-bbbb-cccc-ddddeeee0001',
    documentName: 'manual-typescript.pdf',
    chunkIndex: 2,
    excerpt:
      'TypeScript é um superconjunto do JavaScript que adiciona tipagem estática opcional, permitindo detectar erros em tempo de compilação.',
    score: 0.95,
  },
  {
    documentId: 'doc-002-aaaa-bbbb-cccc-ddddeeee0002',
    documentName: 'guia-rapido-react.txt',
    chunkIndex: 5,
    excerpt:
      'React é uma biblioteca JavaScript para construir interfaces de usuário baseadas em componentes reutilizáveis e estado unidirecional.',
    score: 0.87,
  },
  {
    documentId: 'doc-003-aaaa-bbbb-cccc-ddddeeee0003',
    documentName: 'especificacao-api.pdf',
    chunkIndex: 1,
    excerpt:
      'A API segue o padrão RESTful com autenticação via JWT Bearer tokens e suporte a upload de arquivos TXT e PDF até 5MB.',
    score: 0.92,
  },
  {
    documentId: 'doc-001-aaaa-bbbb-cccc-ddddeeee0001',
    documentName: 'manual-typescript.pdf',
    chunkIndex: 10,
    excerpt:
      'Interfaces no TypeScript permitem definir contratos para a forma dos objetos, especificando propriedades e métodos obrigatórios.',
    score: 0.78,
  },
  {
    documentId: 'doc-003-aaaa-bbbb-cccc-ddddeeee0003',
    documentName: 'especificacao-api.pdf',
    chunkIndex: 8,
    excerpt:
      'O endpoint /documents gerencia a ingestão de documentos no pipeline RAG, suportando os status PENDING, PROCESSING, COMPLETED e FAILED.',
    score: 0.71,
  },
]

export function getRandomSources(count: number = 2): MockSource[] {
  const shuffled = [...sources].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
