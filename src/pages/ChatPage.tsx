import { useState, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import { useFileUpload } from '../hooks/useFileUpload'
import { useDocuments } from '../hooks/useDocuments'
import AppLayout from '../components/layout/AppLayout'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import ChatWindow from '../components/chat/ChatWindow'

interface Attachment {
  fileName: string
  progress?: number
  ingestionStatus?: string | null
  ingestionError?: string | null
}

export default function ChatPage() {
  const { user: _user, logout } = useAuth()
  const { sessions, activeSession, messages, sendMessage, selectSession, createSession, renameSession, deleteSession, exportSessionAsTxt, isSending } = useChat()
  const { uploadFile, isUploading } = useFileUpload()
  const { ingestDocument, pollDocumentStatus } = useDocuments()

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAttach() {
    fileInputRef.current?.click()
  }

  function updateLastAttachment(update: Partial<Attachment>) {
    setAttachments((prev) => {
      const updated = [...prev]
      const last = updated[updated.length - 1]
      if (last) {
        updated[updated.length - 1] = { ...last, ...update }
      }
      return updated
    })
  }

  async function handleFileDrop(file: File) {
    if (!file) return

    setAttachments((prev) => [...prev, { fileName: file.name, progress: 0 }])

    const progressInterval = setInterval(() => {
      setAttachments((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last && last.progress !== undefined && last.progress < 90) {
          updated[updated.length - 1] = { ...last, progress: last.progress + 10 }
        }
        return updated
      })
    }, 200)

    const uploaded = await uploadFile(file)

    clearInterval(progressInterval)

    if (uploaded) {
      updateLastAttachment({ progress: 100 })

      const doc = await ingestDocument(file)
      if (doc) {
        updateLastAttachment({ ingestionStatus: doc.status })

        pollDocumentStatus(doc.id, (completed) => {
          updateLastAttachment({
            ingestionStatus: completed.status,
            ingestionError: completed.status === 'FAILED' ? completed.errorMessage : undefined,
          })

          setTimeout(() => setAttachments([]), 5000)
        })
      }
    } else {
      updateLastAttachment({ progress: 0 })
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    await handleFileDrop(file)
  }

  function handleRemoveAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <AppLayout
      sidebar={(isCollapsed, onToggle) => (
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSession?.id}
          onSelectSession={selectSession}
          onCreateSession={() => createSession('Nova conversa')}
          onRenameSession={renameSession}
          onDeleteSession={deleteSession}
          isCollapsed={isCollapsed}
          onToggle={onToggle}
          onLogout={logout}
        />
      )}
    >
      <Header
        title={activeSession?.title ?? `Chat IA`}
      />

      <ChatWindow
        messages={messages}
        onSendMessage={sendMessage}
        onAttach={handleAttach}
        onFileDrop={handleFileDrop}
        disabled={isSending || isUploading}
        attachments={attachments}
        onRemoveAttachment={handleRemoveAttachment}
        onExport={exportSessionAsTxt}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </AppLayout>
  )
}
