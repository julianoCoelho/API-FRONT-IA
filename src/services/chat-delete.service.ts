import { api } from './api'

export const chatDeleteService = {
  deleteSession(id: string): Promise<void> {
    return api.delete(`/chat/sessions/${id}`)
  },
}
