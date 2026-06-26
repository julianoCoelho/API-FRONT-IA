import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async (username: string, password: string) => {
    setFormError(null);
    try {
      await login({ username, password });
      navigate('/chat', { replace: true });
    } catch {
      setFormError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={formError ?? error} />
        <p className="mt-4 text-center text-sm text-gray-600">
          Não tem conta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
