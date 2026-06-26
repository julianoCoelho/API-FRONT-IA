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
  disabled?: boolean
  attachments?: Attachment[]
  onRemoveAttachment?: (index: number) => void
}

export function ChatWindow({
  messages,
  onSendMessage,
  onAttach,
  disabled,
  attachments,
  onRemoveAttachment,
}: ChatWindowProps) {
  return (
    <div className="flex h-full flex-col bg-white">
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
