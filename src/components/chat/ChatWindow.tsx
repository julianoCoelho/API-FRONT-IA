import type { Message } from './types.ts'
import { MessageList } from './MessageList.tsx'
import { MessageInput } from './MessageInput.tsx'
import { FileAttachmentPreview } from './FileAttachmentPreview.tsx'

interface Attachment {
  fileName: string
}

interface ChatWindowProps {
  messages: Message[]
  onSendMessage: (text: string) => void
  onAttach?: () => void
  attachments?: Attachment[]
  onRemoveAttachment?: (index: number) => void
}

export function ChatWindow({
  messages,
  onSendMessage,
  onAttach,
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
              onRemove={() => onRemoveAttachment?.(index)}
            />
          ))}
        </div>
      )}

      <MessageInput onSendMessage={onSendMessage} onAttach={onAttach} />
    </div>
  )
}

export default ChatWindow
