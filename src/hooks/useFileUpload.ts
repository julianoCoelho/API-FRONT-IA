import { useState } from 'react'
import { fileService } from '../services/file.service'
import type { DocumentStatus, FileUploadResponse } from '../types/api'

export interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<FileUploadResponse | null>
  isUploading: boolean
  uploadProgress: number
  error: string | null
  uploadedFile: FileUploadResponse | null
  ingestionStatus: DocumentStatus | null
  ingestionDocumentId: string | null
}

const ALLOWED_TYPES = ['text/plain', 'application/pdf']
const MAX_SIZE = 5_242_880

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<FileUploadResponse | null>(null)
  const [ingestionStatus, setIngestionStatus] = useState<DocumentStatus | null>(null)
  const [ingestionDocumentId, setIngestionDocumentId] = useState<string | null>(null)

  const uploadFile = async (file: File): Promise<FileUploadResponse | null> => {
    setError(null)
    setUploadedFile(null)
    setUploadProgress(0)
    setIngestionStatus(null)
    setIngestionDocumentId(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      const msg = 'Formato inválido. Apenas arquivos TXT e PDF são permitidos.'
      setError(msg)
      return null
    }

    if (file.size > MAX_SIZE) {
      const msg = 'Arquivo excede o limite de 5MB.'
      setError(msg)
      return null
    }

    setIsUploading(true)
    try {
      const response = await fileService.uploadFile(file, setUploadProgress)
      setUploadProgress(100)
      setUploadedFile(response)
      return response
    } catch (err: unknown) {
      setUploadProgress(0)
      const message = err instanceof Error ? err.message : 'Erro ao fazer upload'
      setError(message)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    error,
    uploadedFile,
    ingestionStatus,
    ingestionDocumentId,
  }
}
