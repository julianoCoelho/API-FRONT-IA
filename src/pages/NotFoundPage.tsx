import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-xl text-gray-600">Página não encontrada</p>
      <Link
        to="/"
        className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
