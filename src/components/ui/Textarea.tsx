import { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`
        w-full
        rounded-xl
        border border-gray-200
        bg-white
        p-4
        text-gray-800
        text-base
        leading-relaxed
        resize-y
        transition-all duration-200
        placeholder:text-gray-400
        hover:border-gray-300
        focus:border-primary
        focus:ring-2 focus:ring-primary/10
        focus:outline-none
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:bg-gray-50
        ${className}
      `}
      {...props}
    />
  )
}
