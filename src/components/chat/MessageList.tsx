import { useEffect, useRef } from 'react'
import type { Message } from './types.ts'
import { MessageBubble } from './MessageBubble.tsx'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} content={msg.content} role={msg.role} sources={msg.sources} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

export default MessageList
