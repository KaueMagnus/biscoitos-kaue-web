import type { ReactNode } from 'react'

type StatusBadgeProps = {
  children: ReactNode
  variant?: 'pending' | 'success' | 'danger' | 'neutral'
}

export function StatusBadge({
  children,
  variant = 'neutral',
}: StatusBadgeProps) {
  return <span className={`status-badge status-badge-${variant}`}>{children}</span>
}
