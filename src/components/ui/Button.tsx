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
    text-sm font-medium
    cursor-pointer
    transition-all duration-150 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variantStyles = {
    primary: `
      bg-blue-500
      text-white
      shadow-button
      hover:not-disabled:bg-blue-600
      hover:not-disabled:shadow-button-hover
      active:not-disabled:scale-[0.98]
      disabled:shadow-none
    `,
    ghost: `
      bg-white
      text-slate-700
      border border-slate-200
      hover:not-disabled:bg-slate-50
      hover:not-disabled:border-slate-300
      active:not-disabled:bg-slate-100
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
