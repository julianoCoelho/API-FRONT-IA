import { useState, type FormEvent } from 'react'
import { Input } from '../common/Input.tsx'
import { Button } from '../common/Button.tsx'

interface LoginFormData {
  email: string
  password: string
}

interface LoginFormProps {
  isLoading?: boolean
  error?: string
  onSubmit: (data: LoginFormData) => void
}

export function LoginForm({ isLoading, error, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

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
        placeholder="Sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" isLoading={isLoading} className="mt-2">
        Entrar
      </Button>
    </form>
  )
}

export default LoginForm
