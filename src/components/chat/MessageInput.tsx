import { useState, useRef, type KeyboardEvent } from 'react'

interface MessageInputProps {
  onSendMessage: (text: string) => void
  onAttach?: () => void
  disabled?: boolean
}

export function MessageInput({ onSendMessage, onAttach, disabled: parentDisabled }: MessageInputProps) {
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isProcessingRef = useRef(false)
  const isEnterRef = useRef(false)

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      console.log('[KEYDOWN]', { isProcessing: isProcessingRef.current, parentDisabled, text: text.trim().slice(0, 20) })
      if (!isProcessingRef.current && !parentDisabled) {
        isEnterRef.current = true
        isProcessingRef.current = true
        handleSend()
      }
    }
  }

  function handleKeyUp(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter') {
      isEnterRef.current = false
      isProcessingRef.current = false
    }
  }

  async function handleSend() {
    const trimmed = text.trim()
    console.log('[SEND]', { trimmed: trimmed.slice(0, 20), isProcessing: isProcessingRef.current, isSending })
    if (!trimmed) return

    try {
      await onSendMessage(trimmed)
      setText('')
    } catch (error) {
      console.error("Erro ao enviar:", error)
    } finally {
      console.log('[SEND:finally]', { isEnter: isEnterRef.current, isProcessing: isProcessingRef.current })
      setIsSending(false)
      if (!isEnterRef.current) {
        isProcessingRef.current = false
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.focus()
      }
    }
  }

  function handleInput() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const isDisabled = parentDisabled || isSending

  return (
    <div className="flex items-end gap-2 border-t border-earth-sand/50 bg-earth-cream/60 backdrop-blur-sm px-4 py-3">
      {onAttach && (
        <button
          type="button"
          onClick={onAttach}
          disabled={isDisabled}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-earth-sage transition-colors hover:bg-earth-sand/40 hover:text-earth-forest disabled:opacity-50"
          aria-label="Anexar arquivo"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
            />
          </svg>
        </button>
      )}

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onInput={handleInput}
        disabled={isDisabled}
        placeholder="Digite sua mensagem..."
        rows={1}
        className="min-h-[40px] flex-1 resize-none rounded-xl border border-earth-sand px-3 py-2.5 text-sm placeholder:text-earth-sage/50 focus:border-earth-olive focus:outline-none focus:ring-1 focus:ring-earth-olive disabled:cursor-not-allowed disabled:opacity-50 bg-white/80"
      />

      <button
        type="button"
        onClick={() => {
          console.log('[CLICK]', { isProcessing: isProcessingRef.current, text: text.trim().slice(0, 20) })
          if (!isProcessingRef.current) {
            isProcessingRef.current = true
            handleSend()
          }
        }}
        disabled={isDisabled || !text.trim()}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-earth-olive text-white shadow-sm transition-colors hover:bg-earth-forest disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Enviar mensagem"
      >
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </button>
    </div>
  )
}

export default MessageInput
