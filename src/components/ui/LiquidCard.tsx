import { ReactNode } from 'react'

interface LiquidCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  variant?: 'default' | 'accent' | 'large'
}

export function LiquidCard({
  children,
  className = '',
  onClick,
  selected = false,
  variant = 'default',
}: LiquidCardProps) {
  const baseStyles = `
    relative overflow-hidden rounded-3xl
    transition-all duration-300 ease-out
    ${onClick ? 'cursor-pointer' : ''}
  `

  const variantStyles = {
    default: 'p-5',
    accent: 'p-5',
    large: 'p-7',
  }

  return (
    <div
      className={`
        liquid-card
        ${baseStyles}
        ${variantStyles[variant]}
        ${selected ? 'liquid-card-selected' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Animated border */}
      <div className="liquid-border-wrapper" />

      {/* Glass background */}
      <div className="liquid-glass-bg" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
