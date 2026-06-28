import type { MessageRole } from './types.ts'
import type { SourceResponse } from '../../types/source'
import { SourcePanel } from './SourcePanel.tsx'

interface MessageBubbleProps {
  content: string
  role: MessageRole
  sources?: SourceResponse[]
}

const roleConfig: Record<MessageRole, { align: string; style: string; label: string }> = {
  USER: {
    align: 'self-end',
    style: 'bg-blue-600 text-white rounded-2xl rounded-br-sm',
    label: 'Você',
  },
  ASSISTANT: {
    align: 'self-start',
    style: 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm',
    label: 'Assistente',
  },
}

export function MessageBubble({ content, role, sources }: MessageBubbleProps) {
  const config = roleConfig[role]

  return (
    <div className={`flex max-w-[75%] flex-col ${config.align}`}>
      <span className="mb-1 text-xs text-gray-500">{config.label}</span>
      <div className={`whitespace-pre-wrap px-4 py-2.5 text-sm leading-relaxed ${config.style}`}>
        {content}
      </div>
      {role === 'ASSISTANT' && sources && sources.length > 0 && (
        <SourcePanel sources={sources} className="mt-2" />
      )}
    </div>
  )
}

export default MessageBubble
