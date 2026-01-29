import { memo, ReactNode, useMemo, useCallback, HTMLAttributes } from 'react'

interface LiquidCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  children: ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  variant?: 'default' | 'large'
}

export const LiquidCard = memo(function LiquidCard({
  children,
  className = '',
  onClick,
  selected = false,
  variant = 'default',
  ...rest
}: LiquidCardProps) {
  const paddingStyles = {
    default: 'p-5',
    large: 'p-6 sm:p-8',
  }

  const cardClassName = useMemo(() => {
    const baseStyles = `
      bg-white rounded-2xl border
      transition-all duration-200
      ${onClick ? 'cursor-pointer' : ''}
    `
    const borderStyle = selected
      ? 'border-primary shadow-[0_0_0_1px_#3b82f6]'
      : 'border-gray-200 hover:border-gray-300 hover:shadow-card-hover'

    return `${baseStyles} ${borderStyle} ${paddingStyles[variant]} ${className}`.trim()
  }, [onClick, variant, selected, className])

  // Memoize keyboard handler to prevent recreation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }, [onClick])

  return (
    <div
      {...rest}
      className={cardClassName}
      onClick={onClick}
      role={onClick ? 'button' : rest.role}
      tabIndex={onClick ? 0 : rest.tabIndex}
      onKeyDown={onClick ? handleKeyDown : rest.onKeyDown}
    >
      {children}
    </div>
  )
})
