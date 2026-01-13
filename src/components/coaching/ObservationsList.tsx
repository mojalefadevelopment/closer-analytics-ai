import { Card } from '../ui/Card'

interface Observation {
  quote: string
  insight: string
}

interface ObservationsListProps {
  observations: Observation[]
}

export function ObservationsList({ observations }: ObservationsListProps) {
  return (
    <Card>
      <div className="uppercase tracking-[0.12em] text-xs text-text-muted mb-2.5">
        Observaties uit de call
      </div>
      <div className="grid gap-2.5">
        {observations.map((item, index) => (
          <div key={index} className="quote-card">
            <div className="italic text-text-muted">"{item.quote}"</div>
            <div className="text-sm mt-1.5">{item.insight}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
