import { api } from './api'
import type { DocumentResponse } from '../types/api'

export const documentService = {
  ingestDocument(
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<DocumentResponse> {
    const formData = new FormData()
    formData.append('file', file)

    return api
      .post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress
          ? (e) => {
              if (e.total) {
                onProgress(Math.round((e.loaded * 100) / e.total))
              }
            }
          : undefined,
      })
      .then((res) => res.data)
  },

  getDocumentStatus(id: string): Promise<DocumentResponse> {
    return api.get(`/documents/${id}`).then((res) => res.data)
  },

  reprocessDocument(id: string): Promise<DocumentResponse> {
    return api.post(`/documents/${id}/reprocess`).then((res) => res.data)
  },
}
