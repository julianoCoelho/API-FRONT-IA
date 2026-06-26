interface Session {
  id: string
  title: string
}

interface SidebarProps {
  sessions: Session[]
  activeSessionId?: string
  onSelectSession: (id: string) => void
  onCreateSession: () => void
}

const navItems: { label: string; icon: string }[] = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Upload', icon: 'upload' },
  { label: 'Histórico', icon: 'history' },
  { label: 'Configurações', icon: 'settings' },
]

const iconPaths: Record<string, JSX.Element> = {
  dashboard: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  ),
  upload: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  ),
  history: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  settings: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
  ),
}

export default function Sidebar({ sessions, activeSessionId, onSelectSession, onCreateSession }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-gray-900 text-white">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold">
          AI
        </div>
        <span className="text-lg font-semibold">API Front IA</span>
      </div>

      <button
        onClick={onCreateSession}
        className="mx-3 mb-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700"
      >
        + Nova conversa
      </button>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {sessions.length > 0 && (
          <div className="mb-3 space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => onSelectSession(session.id)}
                data-active={session.id === activeSessionId}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white data-[active=true]:bg-gray-800 data-[active=true]:text-white"
              >
                {session.title}
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-gray-700 pt-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <svg
                className="h-5 w-5 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                {iconPaths[item.icon]}
              </svg>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-gray-700 px-6 py-4">
        <p className="text-xs text-gray-500">v1.0.0</p>
      </div>
    </div>
  )
}
