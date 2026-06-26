interface HeaderProps {
  username: string;
  onLogout: () => void;
}

export default function Header({ username, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <h1 className="text-lg font-semibold">Chat IA</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{username}</span>
        <button onClick={onLogout} className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300">
          Sair
        </button>
      </div>
    </header>
  );
}
