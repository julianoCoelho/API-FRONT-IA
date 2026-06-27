export type MockDocumentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface MockDocument {
  id: string
  fileName: string
  fileSize: number
  mimeType: string
  status: MockDocumentStatus
  errorMessage?: string
  uploadedAt: string
  processedAt?: string
}

export const documents: MockDocument[] = [
  {
    id: 'doc-001-aaaa-bbbb-cccc-ddddeeee0001',
    fileName: 'manual-typescript.pdf',
    fileSize: 245760,
    mimeType: 'application/pdf',
    status: 'COMPLETED',
    uploadedAt: new Date(Date.now() - 60000).toISOString(),
    processedAt: new Date(Date.now() - 55000).toISOString(),
  },
  {
    id: 'doc-002-aaaa-bbbb-cccc-ddddeeee0002',
    fileName: 'guia-rapido-react.txt',
    fileSize: 15360,
    mimeType: 'text/plain',
    status: 'COMPLETED',
    uploadedAt: new Date(Date.now() - 120000).toISOString(),
    processedAt: new Date(Date.now() - 115000).toISOString(),
  },
  {
    id: 'doc-003-aaaa-bbbb-cccc-ddddeeee0003',
    fileName: 'especificacao-api.pdf',
    fileSize: 512000,
    mimeType: 'application/pdf',
    status: 'COMPLETED',
    uploadedAt: new Date(Date.now() - 300000).toISOString(),
    processedAt: new Date(Date.now() - 290000).toISOString(),
  },
]

export function findDocument(id: string): MockDocument | undefined {
  return documents.find((d) => d.id === id)
}

export function updateDocumentStatus(
  id: string,
  status: MockDocumentStatus,
  errorMessage?: string,
): void {
  const doc = documents.find((d) => d.id === id)
  if (doc) {
    doc.status = status
    if (errorMessage) doc.errorMessage = errorMessage
    if (status === 'COMPLETED' || status === 'FAILED') {
      doc.processedAt = new Date().toISOString()
    }
  }
}

export function addDocument(doc: MockDocument): void {
  documents.push(doc)
}
