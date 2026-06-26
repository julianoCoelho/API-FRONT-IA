import { Button } from '../common/Button.tsx'

interface HeaderProps {
  title: string
  onLogout?: () => void
}

export function Header({ title, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      {onLogout && (
        <Button variant="danger" onClick={onLogout}>
          <LogoutIcon />
          Sair
        </Button>
      )}
    </header>
  )
}

function LogoutIcon() {
  return (
    <svg
      className="h-4 w-4"
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
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
      />
    </svg>
  )
}

export default Header
