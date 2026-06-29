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
    <div className="flex min-h-screen">

      {/* Painel esquerdo — verde escuro */}
      <div className="hidden md:flex md:w-[42%] flex-col items-center justify-center bg-earth-dark rounded-r-[3rem] px-12 py-16 text-white">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-earth-olive text-4xl font-extrabold shadow-lg mb-8">
          IA
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-center mb-4">API Front IA</h1>
        <p className="text-lg text-white/70 text-center leading-relaxed">Acesse sua conta para continuar</p>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">

          {/* Logo visível só em mobile */}
          <div className="md:hidden mb-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-earth-olive text-white text-xl font-extrabold shadow-md">
              IA
            </div>
            <h1 className="text-2xl font-bold text-earth-forest">API Front IA</h1>
          </div>

          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={formError ?? error} />

          <p className="mt-6 text-center text-sm text-earth-sage">
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-earth-olive hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
