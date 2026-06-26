import { useState } from 'react'
import { fileService } from '../services/file.service'
import type { FileUploadResponse } from '../types/api'

export interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<FileUploadResponse | null>
  isUploading: boolean
  error: string | null
  uploadedFile: FileUploadResponse | null
}

const ALLOWED_TYPES = ['text/plain', 'application/pdf']
const MAX_SIZE = 5_242_880

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<FileUploadResponse | null>(null)

  const uploadFile = async (file: File): Promise<FileUploadResponse | null> => {
    setError(null)
    setUploadedFile(null)

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
      const response = await fileService.uploadFile(file)
      setUploadedFile(response)
      return response
    } catch (err: unknown) {
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
    error,
    uploadedFile,
  }
}
