import { ReactNode } from 'react'

interface PillProps {
  children: ReactNode
  variant?: 'default' | 'subtle' | 'accent'
  className?: string
}

export function Pill({ children, variant = 'default', className = '' }: PillProps) {
  const baseStyles = 'px-3.5 py-1.5 rounded-full text-sm font-medium'

  const variantStyles = {
    default: 'bg-white/5 border border-white/10 text-text-secondary',
    subtle: 'badge-glass text-primary',
    accent: 'gradient-closer text-white',
  }

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
