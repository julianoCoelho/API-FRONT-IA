import type { MessageRole } from './types.ts'
import type { SourceResponse } from '../../types/api'
import { SourcePanel } from './SourcePanel.tsx'

interface MessageBubbleProps {
  content: string
  role: MessageRole
  sources?: SourceResponse[]
}

const roleConfig: Record<MessageRole, { align: string; style: string; label: string; labelClass: string }> = {
  USER: {
    align: 'self-end',
    style: 'bg-earth-olive text-white rounded-2xl rounded-br-sm shadow-sm',
    label: 'Você',
    labelClass: 'text-xs text-earth-sage mb-1 text-right',
  },
  ASSISTANT: {
    align: 'self-start',
    style: 'bg-earth-cream text-earth-forest border border-earth-sand/60 rounded-2xl rounded-bl-sm shadow-sm',
    label: 'Assistente',
    labelClass: 'text-xs text-earth-khaki mb-1',
  },
}

export function MessageBubble({ content, role, sources }: MessageBubbleProps) {
  const config = roleConfig[role]

  return (
    <div className={`flex max-w-[75%] flex-col ${config.align}`}>
      <span className={config.labelClass}>{config.label}</span>
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
