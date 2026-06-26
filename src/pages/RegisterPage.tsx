import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const handleRegister = async (username: string, email: string, password: string) => {
    setFormError(null);
    try {
      await register({ username, password, email: email || undefined });
      navigate('/login');
    } catch {
      setFormError('Erro ao cadastrar. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={formError ?? error} />
        <p className="mt-4 text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
