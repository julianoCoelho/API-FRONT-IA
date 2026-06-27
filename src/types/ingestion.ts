import React, { type SVGProps } from 'react'

export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'ERROR'

export const DOCUMENT_STATUS: Record<string, DocumentStatus> = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  ERROR: 'ERROR',
} as const

export interface StatusConfig {
  label: string
  color: string
  Icon: (props: SVGProps<SVGSVGElement>) => React.ReactNode
}
