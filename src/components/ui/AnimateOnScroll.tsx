import { ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: boolean
}

export function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
  stagger = false,
}: AnimateOnScrollProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`
        ${stagger ? 'stagger-children' : 'animate-on-scroll'}
        ${isInView ? 'is-visible' : ''}
        ${className}
      `}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
