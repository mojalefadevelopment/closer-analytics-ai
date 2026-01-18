import { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`
        w-full
        rounded-2xl
        border border-white/10
        bg-white/5
        p-4
        text-text-primary
        text-base
        leading-relaxed
        resize-y
        transition-all duration-200
        placeholder:text-text-muted
        focus:border-primary/50
        focus:bg-white/8
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  )
}
