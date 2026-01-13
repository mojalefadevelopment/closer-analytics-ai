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
        border border-slate-300/45
        bg-white/90
        p-4
        text-text
        text-base
        leading-relaxed
        resize-y
        transition-all duration-200
        ${className}
      `}
      {...props}
    />
  )
}
