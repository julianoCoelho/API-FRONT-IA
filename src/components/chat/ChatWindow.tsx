import { useState, type DragEvent } from 'react'
import type { Message } from './types.ts'
import { MessageList } from './MessageList.tsx'
import { MessageInput } from './MessageInput.tsx'
import { FileAttachmentPreview } from './FileAttachmentPreview.tsx'

interface Attachment {
  fileName: string
  progress?: number
}

interface ChatWindowProps {
  messages: Message[]
  onSendMessage: (text: string) => void
  onAttach?: () => void
  onFileDrop?: (file: File) => void
  disabled?: boolean
  attachments?: Attachment[]
  onRemoveAttachment?: (index: number) => void
}

export function ChatWindow({
  messages,
  onSendMessage,
  onAttach,
  onFileDrop,
  disabled,
  attachments,
  onRemoveAttachment,
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
      className={`flex h-full flex-col bg-white ${isDragging ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <MessageList messages={messages} />

      {attachments && attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-gray-200 px-4 py-2">
          {attachments.map((att, index) => (
            <FileAttachmentPreview
              key={`${att.fileName}-${index}`}
              fileName={att.fileName}
              progress={att.progress}
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
