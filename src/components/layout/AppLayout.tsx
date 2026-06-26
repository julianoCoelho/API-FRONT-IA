import type { ReactNode } from 'react'

interface AppLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export function AppLayout({ sidebar, children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-30 w-64">
        {sidebar}
      </aside>
      <main className="ml-64 flex flex-1 flex-col overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default AppLayout
