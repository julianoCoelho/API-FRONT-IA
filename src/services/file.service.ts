import { api } from './api'
import type { FileUploadResponse } from '../types/api'

export const fileService = {
  uploadFile(file: File, onProgress?: (progress: number) => void): Promise<FileUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    return api.post('/chat/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => {
            if (e.total) {
              onProgress(Math.round((e.loaded * 100) / e.total))
            }
          }
        : undefined,
    }).then((res) => res.data)
  },

  downloadFile(fileId: string): Promise<Blob> {
    return api.get(`/chat/files/${fileId}`, {
      responseType: 'blob',
    }).then((res) => res.data)
  },
}
