import { useState, useCallback, useEffect } from 'react'
import { chatService } from '../services/chat.service'
import type { ChatSessionResponse, MessageResponse } from '../types/api'

export interface UseChatReturn {
  sessions: ChatSessionResponse[]
  activeSession: ChatSessionResponse | null
  messages: MessageResponse[]
  isLoading: boolean
  isSending: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  createSession: (title: string) => Promise<void>
  selectSession: (id: string) => void
}

export function useChat(): UseChatReturn {
  const [sessions, setSessions] = useState<ChatSessionResponse[]>([])
  const [activeSession, setActiveSession] = useState<ChatSessionResponse | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSessions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await chatService.getSessions()
      setSessions(data)
      if (data.length > 0 && !activeSession) {
        setActiveSession(data[0])
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar sessões'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [activeSession])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  const loadMessages = useCallback(async (sessionId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await chatService.getMessages(sessionId)
      setMessages(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar mensagens'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const selectSession = useCallback((id: string) => {
    const session = sessions.find((s) => s.id === id) ?? null
    setActiveSession(session)
    if (session) {
      loadMessages(session.id)
    }
  }, [sessions, loadMessages])

  const createSession = useCallback(async (title: string) => {
    setError(null)
    try {
      const newSession = await chatService.createSession(title)
      setSessions((prev) => [newSession, ...prev])
      setActiveSession(newSession)
      setMessages([])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar sessão'
      setError(message)
    }
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!activeSession) return
    setIsSending(true)
    setError(null)
    try {
      const userMessage: MessageResponse = {
        id: crypto.randomUUID(),
        chatSessionId: activeSession.id,
        role: 'USER',
        content,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMessage])

      const response = await chatService.sendMessage({
        chatSessionId: activeSession.id,
        content,
      })
      setMessages((prev) => [...prev, response])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar mensagem'
      setError(message)
    } finally {
      setIsSending(false)
    }
  }, [activeSession])

  return {
    sessions,
    activeSession,
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    createSession,
    selectSession,
  }
}
