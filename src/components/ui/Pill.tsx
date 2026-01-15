import { ReactNode } from 'react'

interface PillProps {
  children: ReactNode
  variant?: 'default' | 'subtle' | 'accent'
  className?: string
}

export function Pill({ children, variant = 'default', className = '' }: PillProps) {
  const baseStyles = 'px-3.5 py-1.5 rounded-full text-sm'

  const variantStyles = {
    default: 'bg-white/80 border border-slate-300/35',
    subtle: 'bg-accent/10 text-accent-strong',
    accent: 'bg-gradient-to-r from-accent to-accent-strong text-white font-medium',
  }

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
