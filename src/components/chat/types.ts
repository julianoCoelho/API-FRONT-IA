import type { SourceResponse } from '../../types/api'

export type MessageRole = 'USER' | 'ASSISTANT'

export interface Message {
  id: string
  content: string
  role: MessageRole
  chatSessionId?: string
  timestamp?: string
  sources?: SourceResponse[]
}
