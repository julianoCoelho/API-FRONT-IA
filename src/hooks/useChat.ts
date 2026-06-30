import { useState, useCallback, useEffect, useRef } from 'react'
import { chatService } from '../services/chat.service'
import { chatDeleteService } from '../services/chat-delete.service'
import type { ChatSessionResponse, MessageResponse, SourceResponse } from '../types/api'

export interface UseChatReturn {
  sessions: ChatSessionResponse[]
  activeSession: ChatSessionResponse | null
  messages: MessageResponse[]
  sourcesByMessageId: Record<string, SourceResponse[]>
  isLoading: boolean
  isSending: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  createSession: (title: string) => Promise<void>
  selectSession: (id: string) => void
  renameSession: (id: string, title: string) => void
  deleteSession: (id: string) => Promise<void>
  exportSessionAsTxt: () => void
}

export function useChat(): UseChatReturn {
  const [sessions, setSessions] = useState<ChatSessionResponse[]>([])
  const [activeSession, setActiveSession] = useState<ChatSessionResponse | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [sourcesByMessageId, setSourcesByMessageId] = useState<Record<string, SourceResponse[]>>({})
  const sendingRef = useRef(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSessions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await chatService.getSessions()
      setSessions(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar sessões'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  useEffect(() => {
    if (messages.length > 0) {
      console.log('[messages] ATUALIZADO', messages.map(m => ({
        id: m.id.slice(0, 8), role: m.role, content: m.content.slice(0, 30)
      })))
    }
  }, [messages])

  const loadMessages = useCallback(async (sessionId: string) => {
    console.log('[loadMessages] INÍCIO', { sessionId })
    setIsLoading(true)
    setError(null)
    try {
      const data = await chatService.getMessages(sessionId)
      console.log('[loadMessages] DADOS', { count: data.length }, data.map(m => ({
        id: m.id.slice(0, 8), role: m.role, content: m.content.slice(0, 30)
      })))
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
    setSourcesByMessageId({})
    if (session) {
      loadMessages(session.id)
    }
  }, [sessions, loadMessages])

  useEffect(() => {
    if (sessions.length > 0 && !activeSession) {
      selectSession(sessions[0].id)
    }
  }, [sessions, activeSession, selectSession])

  const createSession = useCallback(async (title: string) => {
    setError(null)
    try {
      const newSession = await chatService.createSession(title)
      setSessions((prev) => [newSession, ...prev])
      setActiveSession(newSession)
      setSourcesByMessageId({})
      await loadMessages(newSession.id)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar sessão'
      setError(message)
    }
  }, [loadMessages])

  const sendMessage = useCallback(async (content: string) => {
    console.log('[useChat:sendMessage] INÍCIO', { content: content.slice(0, 30), sendingRef: sendingRef.current })
    if (!activeSession || sendingRef.current) return
    sendingRef.current = true
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
      console.log('[useChat:sendMessage] add userMessage', { id: userMessage.id })
      setMessages((prev) => [...prev, userMessage])

      const { sources, ...response } = await chatService.sendMessage({
        chatSessionId: activeSession.id,
        content,
      })
      console.log('[useChat:sendMessage] add assistant', { id: response.id })
      setMessages((prev) => [...prev, response])
      if (sources?.length) {
        setSourcesByMessageId((prev) => ({ ...prev, [response.id]: sources }))
      }
    } catch (err: unknown) {
      const is503 =
        (err instanceof Object && 'response' in err &&
          (err as { response: { status: number } }).response?.status === 503)
      if (is503) {
        setError('O assistente está temporariamente indisponível. Sua mensagem foi salva.')
      } else {
        const message = err instanceof Error ? err.message : 'Erro ao enviar mensagem'
        setError(message)
      }
    } finally {
      console.log('[useChat:sendMessage] FINALLY', { sendingRef: sendingRef.current })
      setIsSending(false)
      sendingRef.current = false
    }
  }, [activeSession])

  const renameSession = useCallback((id: string, title: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s))
    )
    setActiveSession((prev) => (prev?.id === id && prev ? { ...prev, title } : prev))
    chatService.renameSession(id, title).catch(() => {
      // falha silenciosa — estado React já foi atualizado
    })
  }, [])

  const deleteSession = useCallback(async (id: string) => {
    setError(null)
    try {
      await chatDeleteService.deleteSession(id)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao apagar sessão'
      setError(message)
    }

    setSessions((prev) => prev.filter((s) => s.id !== id))
    setActiveSession((prev) => {
      if (prev?.id === id) {
        setMessages([])
        return null
      }
      return prev
    })
  }, [])

  const exportSessionAsTxt = useCallback(() => {
    if (messages.length === 0) return

    const lines = messages.map(
      (m) => `[${m.timestamp}] ${m.role}: ${m.content}`
    )
    const content = lines.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `chat-${activeSession?.title ?? 'export'}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }, [messages, activeSession])

  return {
    sessions,
    activeSession,
    messages,
    sourcesByMessageId,
    isLoading,
    isSending,
    error,
    sendMessage,
    createSession,
    selectSession,
    renameSession,
    deleteSession,
    exportSessionAsTxt,
  }
}
