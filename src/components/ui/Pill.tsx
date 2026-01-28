import { ReactNode } from 'react'

interface PillProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning'
  className?: string
}

export function Pill({ children, variant = 'default', className = '' }: PillProps) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium'

  const variantStyles = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary-light text-primary',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
  }

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
