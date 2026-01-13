import { Card } from '../ui/Card'

interface ActionPoint {
  action: string
  why: string
}

interface ActionPointsListProps {
  actionPoints: ActionPoint[]
}

export function ActionPointsList({ actionPoints }: ActionPointsListProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="uppercase tracking-[0.12em] text-xs text-text-muted">
            Actiepunten overzicht
          </div>
          <div className="text-sm text-text-muted mt-1">
            Duidelijke volgorde en focus per stap.
          </div>
        </div>
        <div className="text-xs uppercase tracking-[0.16em] text-text-muted">
          {actionPoints.length} stappen
        </div>
      </div>
      <div className="relative grid gap-4 pl-7">
        <div
          className="absolute left-3 top-2 bottom-2 w-px bg-slate-200/70"
          aria-hidden="true"
        />
        {actionPoints.map((item, index) => {
          const label = index === 0 ? 'Nu doen' : index === 1 ? 'Daarna' : 'Vervolg'

          return (
            <div
              key={index}
              className="relative rounded-2xl border border-slate-200/70 bg-white/90 p-4"
            >
              <div className="absolute -left-7 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white text-sm font-semibold">
                {index + 1}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="uppercase tracking-[0.16em] text-xs text-text-muted">
                  Actie {index + 1}
                </div>
                <div className="text-xs uppercase tracking-[0.16em] text-accent-strong">
                  {label}
                </div>
              </div>
              <div className="mt-2 text-base font-semibold leading-snug">
                {item.action}
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.16em] text-text-muted">
                Waarom
              </div>
              <div className="text-sm text-text-muted leading-relaxed">
                {item.why}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
