import { Button } from '../common/Button.tsx'

interface HeaderProps {
  title: string
  onLogout?: () => void
}

export function Header({ title, onLogout }: HeaderProps) {
  return (
    <header className="flex-shrink-0 flex items-center justify-between border-b border-earth-sand/60 bg-earth-cream/80 backdrop-blur-sm px-6 py-6 shadow-sm">
      <h1 className="text-xl font-semibold text-earth-forest">{title}</h1>
      
      {onLogout && (
        <Button variant="danger" onClick={onLogout}>
          Sair
        </Button>
      )}
    </header>
  )
}

export default Header
