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
    rounded-full
    px-6 py-3
    text-base font-semibold
    cursor-pointer
    transition-all duration-200
    disabled:opacity-45 disabled:cursor-not-allowed
  `

  const variantStyles = {
    primary: `
      btn-gradient
      text-white
      shadow-button
      hover:not-disabled:-translate-y-0.5
      hover:not-disabled:shadow-button-hover
      disabled:shadow-none
    `,
    ghost: `
      bg-white/50
      text-slate-600
      border border-slate-200
      hover:not-disabled:bg-white/80
      hover:not-disabled:text-slate-800
      hover:not-disabled:border-slate-300
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
