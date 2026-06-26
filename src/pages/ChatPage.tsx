import { useState, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import { useFileUpload } from '../hooks/useFileUpload'
import AppLayout from '../components/layout/AppLayout'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import ChatWindow from '../components/chat/ChatWindow'

export default function ChatPage() {
  const { user: _user, logout } = useAuth()
  const { sessions, activeSession, messages, sendMessage, selectSession, createSession, renameSession, deleteSession, exportSessionAsTxt, isSending } = useChat()
  const { uploadFile, isUploading, uploadProgress } = useFileUpload()

  const [attachments, setAttachments] = useState<{ fileName: string; progress?: number }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAttach() {
    fileInputRef.current?.click()
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

    await uploadFile(file)

    clearInterval(progressInterval)
    setAttachments((prev) => {
      const updated = [...prev]
      const last = updated[updated.length - 1]
      if (last) {
        updated[updated.length - 1] = { ...last, progress: uploadProgress }
      }
      return updated
    })

    setTimeout(() => setAttachments([]), 3000)
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
      sidebar={
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSession?.id}
          onSelectSession={selectSession}
          onCreateSession={() => createSession('Nova conversa')}
          onRenameSession={renameSession}
          onDeleteSession={deleteSession}
        />
      }
    >
      <Header
        title={activeSession?.title ?? `Chat IA`}
        onLogout={logout}
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
