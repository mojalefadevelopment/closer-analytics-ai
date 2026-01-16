import { ReactNode } from 'react'

interface PillProps {
  children: ReactNode
  variant?: 'default' | 'subtle' | 'accent'
  className?: string
}

export function Pill({ children, variant = 'default', className = '' }: PillProps) {
  const baseStyles = 'px-3.5 py-1.5 rounded-full text-sm'

  const variantStyles = {
    default: 'bg-white border border-slate-200 text-slate-600',
    subtle: 'bg-blue-50 text-blue-600 font-medium',
    accent: 'bg-blue-500 text-white font-medium',
  }

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
