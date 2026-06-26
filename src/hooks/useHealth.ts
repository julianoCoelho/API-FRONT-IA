import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { HealthResponse } from '../types/api'

export interface UseHealthReturn {
  status: string | null
  isLoading: boolean
  error: string | null
}

export function useHealth(): UseHealthReturn {
  const [status, setStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function checkHealth() {
      try {
        const response = await api.get<HealthResponse>('/health')
        if (!cancelled) {
          setStatus(response.data.status)
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Serviço indisponível'
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    checkHealth()

    return () => {
      cancelled = true
    }
  }, [])

  return { status, isLoading, error }
}
