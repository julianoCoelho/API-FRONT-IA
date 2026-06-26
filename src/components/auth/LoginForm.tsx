import { useState, type FormEvent } from 'react'
import { Input } from '../common/Input.tsx'
import { Button } from '../common/Button.tsx'

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void
  isLoading?: boolean
  error?: string | null
}

export default function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isLoading) return
    onSubmit(username, password)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      <Input
        label="Usuário"
        type="text"
        name="username"
        placeholder="Seu usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        disabled={isLoading}
      />

      <Input
        label="Senha"
        type="password"
        name="password"
        placeholder="Sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      <Button type="submit" isLoading={isLoading} className="mt-2">
        Entrar
      </Button>
    </form>
  )
}
