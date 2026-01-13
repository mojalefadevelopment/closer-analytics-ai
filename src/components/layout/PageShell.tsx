import { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <>
      {/* Background orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      {/* Main container */}
      <main className="relative mx-auto w-[min(96%,960px)] py-14 flex flex-col gap-7">
        {children}
      </main>
    </>
  )
}
