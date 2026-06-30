import React, { type SVGProps } from 'react'

export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export const DOCUMENT_STATUS: Record<string, DocumentStatus> = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const

export interface StatusConfig {
  label: string
  color: string
  Icon: (props: SVGProps<SVGSVGElement>) => React.ReactNode
}
