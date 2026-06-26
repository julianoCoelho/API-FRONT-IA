import type { ReactNode } from 'react';

interface AppLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export default function AppLayout({ sidebar, header, children }: AppLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] grid-rows-[auto_1fr]">
      <div className="col-span-2">{header}</div>
      <div className="row-start-2">{sidebar}</div>
      <main className="row-start-2 overflow-auto">{children}</main>
    </div>
  );
}
