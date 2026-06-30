import { useState, type DragEvent } from 'react'
import type { Message } from './types.ts'
import { MessageList } from './MessageList.tsx'
import { MessageInput } from './MessageInput.tsx'
import { FileAttachmentPreview } from './FileAttachmentPreview.tsx'

interface Attachment {
  fileName: string
  progress?: number
  status?: string
  fileSize?: number
}

interface ChatWindowProps {
  messages: Message[]
  onSendMessage: (text: string) => void
  onAttach?: () => void
  onFileDrop?: (file: File) => void
  disabled?: boolean
  attachments?: Attachment[]
  onRemoveAttachment?: (index: number) => void
  onExport?: () => void
}

export function ChatWindow({
  messages,
  onSendMessage,
  onAttach,
  onFileDrop,
  disabled,
  attachments,
  onRemoveAttachment,
  onExport,
}: ChatWindowProps) {
  const [isDragging, setIsDragging] = useState(false)

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDragEnter(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && onFileDrop) {
      onFileDrop(file)
    }
  }

  return (
    <div
      className={`flex flex-1 min-h-0 flex-col bg-earth-cream/30 ${isDragging ? 'ring-2 ring-earth-olive ring-inset' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {onExport && messages.length > 0 && (
        <div className="flex items-center justify-end border-b border-earth-sand/50 px-4 py-1.5">
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-earth-sage transition-colors hover:bg-earth-sand/40 hover:text-earth-forest"
          >
            <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Exportar .txt
          </button>
        </div>
      )}

      <MessageList messages={messages} />

      {attachments && attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-earth-sand/50 px-4 py-2">
          {attachments.map((att, index) => (
            <FileAttachmentPreview
              key={`${att.fileName}-${index}`}
              fileName={att.fileName}
              progress={att.progress}
              status={att.status as any}
              fileSize={att.fileSize}
              onRemove={() => onRemoveAttachment?.(index)}
            />
          ))}
        </div>
      )}

      <MessageInput onSendMessage={onSendMessage} onAttach={onAttach} disabled={disabled} />
    </div>
  )
}

export default ChatWindow
