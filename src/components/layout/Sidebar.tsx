import type { ReactNode } from 'react';

interface Session {
  id: string;
  title: string;
}

interface SidebarProps {
  sessions: Session[];
  activeSessionId?: string;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
}

export default function Sidebar({ sessions, activeSessionId, onSelectSession, onCreateSession }: SidebarProps) {
  return (
    <aside className="flex h-full flex-col border-r p-4">
      <button
        onClick={onCreateSession}
        className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        + Nova conversa
      </button>
      <nav className="flex flex-col gap-1">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            data-active={session.id === activeSessionId}
            className="rounded px-3 py-2 text-left hover:bg-gray-100 data-[active=true]:bg-gray-200"
          >
            {session.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}
