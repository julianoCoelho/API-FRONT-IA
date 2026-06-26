import { api } from './api'
import type { ChatSessionResponse, MessageResponse, SendMessageRequest } from '../types/api'

export const chatService = {
  getSessions(): Promise<ChatSessionResponse[]> {
    return api.get('/chat/sessions').then((res) => res.data)
  },

  createSession(title: string): Promise<ChatSessionResponse> {
    return api.post('/chat/sessions', { title }).then((res) => res.data)
  },

  getMessages(sessionId: string): Promise<MessageResponse[]> {
    return api.get(`/chat/sessions/${sessionId}/messages`).then((res) => res.data)
  },

  sendMessage(data: SendMessageRequest): Promise<MessageResponse> {
    return api.post('/chat/messages', data).then((res) => res.data)
  },
}
