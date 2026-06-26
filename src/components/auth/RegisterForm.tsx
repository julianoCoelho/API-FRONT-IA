import { useState, type FormEvent } from 'react'
import { Input } from '../common/Input.tsx'
import { Button } from '../common/Button.tsx'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface RegisterFormProps {
  isLoading?: boolean
  error?: string
  onSubmit: (data: RegisterFormData) => void
}

export function RegisterForm({ isLoading, error, onSubmit }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({ name, email, password, confirmPassword })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      <Input
        label="Nome"
        type="text"
        name="name"
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Senha"
        type="password"
        name="password"
        placeholder="Crie uma senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Input
        label="Confirmar Senha"
        type="password"
        name="confirmPassword"
        placeholder="Repita a senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button type="submit" isLoading={isLoading} className="mt-2">
        Cadastrar
      </Button>
    </form>
  )
}

export default RegisterForm
