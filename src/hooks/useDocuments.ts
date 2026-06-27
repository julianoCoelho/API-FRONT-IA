import { useState, useCallback, useEffect, useRef } from 'react'
import { documentService } from '../services/document.service'
import type { DocumentResponse, DocumentStatusResponse } from '../types/api'

export interface UseDocumentsReturn {
  documents: DocumentResponse[]
  isLoading: boolean
  error: string | null
  ingestDocument: (file: File) => Promise<DocumentResponse | null>
  pollDocumentStatus: (id: string, onComplete?: (doc: DocumentStatusResponse) => void) => void
  reprocessDocument: (id: string) => Promise<void>
}

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<DocumentResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [])

  const ingestDocument = useCallback(
    async (file: File): Promise<DocumentResponse | null> => {
      setError(null)
      setIsLoading(true)
      try {
        const doc = await documentService.ingestDocument(file)
        setDocuments((prev) => [doc, ...prev])
        return doc
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao ingerir documento'
        setError(message)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const pollDocumentStatus = useCallback(
    (id: string, onComplete?: (doc: DocumentStatusResponse) => void) => {
      if (pollingRef.current) clearInterval(pollingRef.current)

      pollingRef.current = setInterval(async () => {
        try {
          const doc = await documentService.getDocumentStatus(id)
          setDocuments((prev) => prev.map((d) => (d.id === id ? doc : d)))

          if (doc.status === 'COMPLETED' || doc.status === 'FAILED') {
            if (pollingRef.current) clearInterval(pollingRef.current)
            pollingRef.current = null
            if (doc.status === 'FAILED') {
              setError(doc.errorMessage ?? 'Falha no processamento do documento')
            }
            onComplete?.(doc)
          }
        } catch {
          if (pollingRef.current) clearInterval(pollingRef.current)
          pollingRef.current = null
          setError('Erro de conexão ao verificar status do documento')
        }
      }, 2000)
    },
    [],
  )

  const reprocessDocument = useCallback(async (id: string) => {
    setError(null)
    try {
      const doc = await documentService.reprocessDocument(id)
      setDocuments((prev) => prev.map((d) => (d.id === id ? doc : d)))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao reprocessar documento'
      setError(message)
    }
  }, [])

  return {
    documents,
    isLoading,
    error,
    ingestDocument,
    pollDocumentStatus,
    reprocessDocument,
  }
}
