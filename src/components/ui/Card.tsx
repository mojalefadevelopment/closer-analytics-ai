import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'priority'
  className?: string
}

export function Card({ children, variant = 'default', className = '' }: CardProps) {
  const baseStyles = 'p-5 rounded-3xl shadow-card'

  const variantStyles = {
    default: 'bg-white/90 border border-slate-300/35',
    priority: 'priority-card',
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  )
}
