import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = (_username: string, _email: string, _password: string) => {
    /* mock: será integrado com authService.register() posteriormente */
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <RegisterForm onSubmit={handleRegister} />
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
