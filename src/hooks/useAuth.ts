import { useState } from 'react'
import { useAuth as useAuthContext } from '../contexts/AuthContext'
import { authService } from '../services/auth.service'
import type { LoginRequest, RegisterRequest } from '../types/api'

export interface UseAuthReturn {
  user: { id: string; username: string } | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const { isAuthenticated, isLoading: authLoading, user, login: authLogin, logout: authLogout } = useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (data: LoginRequest) => {
    setError(null)
    setLoading(true)
    try {
      const response = await authService.login(data)
      localStorage.setItem('current_user', data.username)
      authLogin(response.token)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterRequest) => {
    setError(null)
    setLoading(true)
    try {
      await authService.register(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao registrar'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading: authLoading || loading,
    error,
    login,
    register,
    logout: () => {
      localStorage.removeItem('current_user')
      authLogout()
    },
  }
}
