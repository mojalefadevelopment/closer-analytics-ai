import { memo, ReactNode, useMemo } from 'react'

interface LiquidCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  variant?: 'default' | 'accent' | 'large'
}

const variantStyles = {
  default: 'p-6',
  accent: 'p-6',
  large: 'p-8',
}

export const LiquidCard = memo(function LiquidCard({
  children,
  className = '',
  onClick,
  selected = false,
  variant = 'default',
}: LiquidCardProps) {
  const cardClassName = useMemo(() => {
    const baseStyles = `
      relative overflow-hidden rounded-3xl
      transition-all duration-300 ease-out
      ${onClick ? 'cursor-pointer' : ''}
    `
    return `
      liquid-card
      ${baseStyles}
      ${variantStyles[variant]}
      ${selected ? 'liquid-card-selected' : ''}
      ${className}
    `.trim()
  }, [onClick, variant, selected, className])

  return (
    <div className={cardClassName} onClick={onClick}>
      {/* Animated border */}
      <div className="liquid-border-wrapper" />

      {/* Glass background */}
      <div className="liquid-glass-bg" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
})
