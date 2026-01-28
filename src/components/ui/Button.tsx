import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  variant?: 'primary' | 'ghost' | 'outline'
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
    inline-flex items-center justify-center gap-2
    rounded-xl
    px-5 py-2.5
    text-sm font-medium
    cursor-pointer
    transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variantStyles = {
    primary: `
      bg-primary text-white
      hover:bg-primary-hover
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent text-gray-600
      hover:bg-gray-100 hover:text-gray-800
    `,
    outline: `
      bg-white text-gray-700
      border border-gray-200
      hover:border-gray-300 hover:bg-gray-50
    `,
  }

  return (
    <button
      disabled={isDisabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Analyseren...</span>
        </>
      ) : children}
    </button>
  )
}
