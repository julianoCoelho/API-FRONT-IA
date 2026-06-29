import { useState, type ReactNode } from 'react'

interface AppLayoutProps {
  sidebar: (isCollapsed: boolean, onToggle: () => void) => ReactNode
  children: ReactNode
}

export function AppLayout({ sidebar, children }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-earth-cream overflow-hidden">
      <aside
        className={`
          fixed inset-y-0 left-0 z-30
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        {sidebar(isCollapsed, () => setIsCollapsed((v) => !v))}
      </aside>
      <main
        className={`
          flex flex-1 flex-col overflow-hidden
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'ml-16' : 'ml-64'}
        `}
      >
        {children}
      </main>
    </div>
  )
}

export default AppLayout
