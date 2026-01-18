import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  variant?: 'primary' | 'ghost'
}

export function Button({
  children,
  loading = false,
  disabled,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  const baseStyles = `
    rounded-xl
    px-6 py-3
    text-sm font-semibold
    cursor-pointer
    transition-all duration-200 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variantStyles = {
    primary: `
      gradient-closer
      text-white
      shadow-button
      hover:not-disabled:shadow-button-hover
      hover:not-disabled:-translate-y-0.5
      active:not-disabled:scale-[0.98]
      disabled:shadow-none
    `,
    ghost: `
      bg-white/5
      text-text-secondary
      border border-white/10
      hover:not-disabled:bg-white/10
      hover:not-disabled:text-text-primary
      hover:not-disabled:border-white/20
      active:not-disabled:bg-white/5
    `,
  }

  return (
    <button
      disabled={isDisabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? 'Analyseren...' : children}
    </button>
  )
}
