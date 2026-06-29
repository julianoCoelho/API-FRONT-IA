import { useState, useRef, useEffect } from 'react'
import { useHealth } from '../../hooks/useHealth'
import { HealthStatusBadge } from '../common/HealthStatusBadge'

interface Session {
  id: string
  title: string
}

interface SidebarProps {
  sessions: Session[]
  activeSessionId?: string
  onSelectSession: (id: string) => void
  onCreateSession: () => void
  onRenameSession: (id: string, title: string) => void
  onDeleteSession: (id: string) => void
  isCollapsed: boolean
  onToggle: () => void
  onLogout?: () => void
}

function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function ChatBubbleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  )
}

function SessionItem({
  session,
  isActive,
  onSelect,
  onRename,
  onDelete,
  isCollapsed,
}: {
  session: Session
  isActive: boolean
  onSelect: () => void
  onRename: (title: string) => void
  onDelete: () => void
  isCollapsed: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(session.title)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  function handleStartEdit(e: React.MouseEvent) {
    e.stopPropagation()
    setEditValue(session.title)
    setEditing(true)
  }

  function handleSubmit() {
    const trimmed = editValue.trim()
    if (trimmed) {
      onRename(trimmed)
    }
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      setEditValue(session.title)
      setEditing(false)
    }
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  function handleConfirmDelete() {
    setShowDeleteModal(false)
    onDelete()
  }

  function handleCancelDelete() {
    setShowDeleteModal(false)
  }

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={onSelect}
        title={session.title}
        className={`flex h-10 w-10 items-center justify-center rounded-xl mx-auto transition-colors ${
          isActive ? 'bg-earth-forest/60 text-earth-cream' : 'text-earth-sand hover:bg-earth-forest/40'
        }`}
      >
        <ChatBubbleIcon />
      </button>
    )
  }

  return (
    <div
      data-active={isActive}
      className="group flex w-full items-center gap-1 rounded-lg px-3 py-2 text-sm text-earth-sand transition-colors hover:bg-earth-forest/60 hover:text-earth-cream data-[active=true]:bg-earth-forest/60 data-[active=true]:text-earth-cream"
    >
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 bg-transparent outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className="min-w-0 flex-1 truncate text-left"
        >
          {session.title}
        </button>
      )}

      {!editing && (
        <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleStartEdit}
            className="rounded p-0.5 text-earth-sage hover:text-earth-cream"
            title="Renomear"
          >
            <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded p-0.5 text-earth-sage hover:text-red-400"
            title="Apagar"
          >
            <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-earth-dark/50 backdrop-blur-sm"
          onClick={handleCancelDelete}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-earth-cream p-6 shadow-2xl shadow-earth-dark/30 border border-earth-sand/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-500">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-earth-forest">Apagar conversa</h3>
            </div>
            <p className="mb-6 text-sm text-earth-sage leading-relaxed">
              Tem certeza que deseja apagar <span className="font-semibold text-earth-forest">"{session.title}"</span>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="flex-1 rounded-xl border border-earth-sand px-4 py-2.5 text-sm font-medium text-earth-forest transition-colors hover:bg-earth-sand/40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onRenameSession,
  onDeleteSession,
  isCollapsed,
  onToggle,
  onLogout,
}: SidebarProps) {
  const { isActive, lastCheck } = useHealth()

  return (
    <div className="flex h-full flex-col bg-earth-dark text-white rounded-r-3xl">
      <div className={`flex items-center px-4 py-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <button
          onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-earth-sand hover:bg-earth-forest/40 transition-colors"
        >
          <HamburgerIcon />
        </button>
        {!isCollapsed && onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-earth-sage hover:text-earth-cream transition-colors"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Sair
          </button>
        )}
      </div>

      <div className={`flex items-center mb-4 ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'}`}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-earth-olive text-sm font-bold shadow-md flex-shrink-0">
          IA
        </div>
        <span
          className={`text-lg font-bold transition-all duration-200 overflow-hidden whitespace-nowrap ${
            isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}
        >
          API Front IA
        </span>
      </div>

      {isCollapsed ? (
        <button
          type="button"
          onClick={onCreateSession}
          title="Nova conversa"
          className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-earth-olive text-white font-bold text-lg shadow-sm hover:shadow-md transition-all duration-200 hover:bg-earth-forest"
        >
          +
        </button>
      ) : (
        <button
          onClick={onCreateSession}
          className="mx-3 mb-4 rounded-xl bg-earth-olive px-3 py-3 text-sm text-white font-semibold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 hover:bg-earth-forest"
        >
          + Nova conversa
        </button>
      )}

      <nav className="flex-1 overflow-y-auto px-3">
        {sessions.length > 0 && (
          <div className={`space-y-1 ${isCollapsed ? '' : 'mb-3'}`}>
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                isActive={session.id === activeSessionId}
                onSelect={() => onSelectSession(session.id)}
                onRename={(title) => onRenameSession(session.id, title)}
                onDelete={() => onDeleteSession(session.id)}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        )}
      </nav>

      <div className={`border-t border-earth-forest/30 px-4 py-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <HealthStatusBadge isActive={isActive} lastCheck={lastCheck} />
      </div>
    </div>
  )
}
