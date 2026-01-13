interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`
        inline-block
        h-5 w-5
        animate-spin
        rounded-full
        border-2 border-solid
        border-current
        border-r-transparent
        ${className}
      `}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
