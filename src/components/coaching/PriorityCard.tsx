import { Card } from '../ui/Card'

interface PriorityCardProps {
  title: string
  explanation: string
}

export function PriorityCard({ title, explanation }: PriorityCardProps) {
  return (
    <Card variant="priority">
      <div className="uppercase tracking-[0.12em] text-xs text-text-muted mb-2.5">
        Prioriteit #1
      </div>
      <div className="text-xl font-semibold mb-2">{title}</div>
      <div className="text-text-muted leading-relaxed">{explanation}</div>
    </Card>
  )
}
