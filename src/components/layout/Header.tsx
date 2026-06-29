interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex-shrink-0 flex items-center border-b border-earth-sand/60 bg-earth-cream/80 backdrop-blur-sm px-6 py-6 shadow-sm">
      <h1 className="text-xl font-semibold text-earth-forest">{title}</h1>
    </header>
  )
}

export default Header
