import { GlassPanel } from '../ui/GlassPanel'
import { Pill } from '../ui/Pill'

export function Hero() {
  return (
    <GlassPanel className="animate-rise grid gap-4">
      <div className="uppercase tracking-[0.18em] text-xs text-text-muted">
        AI Coaching
      </div>
      <h1 className="m-0 text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-tight">
        Coaching feedback voor je volgende gesprek.
      </h1>
      <p className="m-0 text-text-muted text-lg leading-relaxed">
        Plak een coaching call transcript en krijg actiepunten en observaties.
        Focus op 1 ding, 3 acties, 3 observaties.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <Pill>Stap 1: Plak transcript</Pill>
        <Pill>Stap 2: Analyseer</Pill>
        <Pill>Stap 3: Pas toe</Pill>
      </div>
    </GlassPanel>
  )
}
