import { useState, useEffect } from 'react'

interface N8nHealthResponse {
  status: string
  timestamp: string
  source: string
}

export interface UseHealthReturn {
  isActive: boolean
  isLoading: boolean
  lastCheck: string | null
}

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL ?? 'http://localhost:5678/webhook/health-check'
const POLLING_INTERVAL = 30_000

export function useHealth(): UseHealthReturn {
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function checkHealth() {
      try {
        const response = await fetch(N8N_WEBHOOK_URL, { method: 'POST' })
        if (!cancelled) {
          if (response.ok) {
            const data: N8nHealthResponse = await response.json()
            setIsActive(data.status === 'UP')
            setLastCheck(data.timestamp)
          } else {
            setIsActive(false)
          }
        }
      } catch {
        if (!cancelled) {
          setIsActive(false)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    checkHealth()

    const intervalId = setInterval(checkHealth, POLLING_INTERVAL)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [])

  return { isActive, isLoading, lastCheck }
}
