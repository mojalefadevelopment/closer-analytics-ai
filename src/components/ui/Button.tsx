import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
}

export function Button({
  children,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={`
        btn-gradient
        rounded-full
        px-6 py-3
        text-base font-semibold
        text-white
        shadow-button
        cursor-pointer
        transition-all duration-200
        hover:not-disabled:-translate-y-0.5
        hover:not-disabled:shadow-button-hover
        disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none
        ${className}
      `}
      {...props}
    >
      {loading ? 'Analyseren...' : children}
    </button>
  )
}
