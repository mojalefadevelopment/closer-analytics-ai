# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # TypeScript check + production build
npm run lint     # TypeScript type checking only
npm run preview  # Preview production build
```

## Architecture

Single-page React app for analyzing sales coaching call transcripts via AI. Currently uses mock data; designed for Supabase Edge Function + Claude API integration.

**Data Flow:**
```
CoachingAnalyze (page)
    └── useCoachingAnalysis (hook) ← manages all state
            ├── TranscriptInput ← user pastes transcript
            └── AnalysisOutput ← displays results
                    ├── PriorityCard
                    ├── ActionPointsList
                    └── ObservationsList
```

**Key Directories:**
- `src/components/ui/` - Reusable primitives (Button, Card, GlassPanel, Textarea)
- `src/components/coaching/` - Feature components that compose UI primitives
- `src/components/layout/` - PageShell with animated background orbs
- `src/hooks/` - useCoachingAnalysis: state management + API call logic
- `src/types/` - TypeScript interfaces (CoachingAnalysis)
- `src/mocks/` - Mock API response for demo mode

**Core Type:**
```typescript
interface CoachingAnalysis {
  priority: { title: string; explanation: string }
  actionPoints: Array<{ action: string; why: string }>
  observations: Array<{ quote: string; insight: string }>
}
```

## Styling

- Tailwind CSS with custom design tokens in `tailwind.config.ts`
- Glassmorphism design: use `.glass-panel` class or `GlassPanel` component
- Custom animations in `src/styles/glass.css` (float, rise)
- All UI text is in Dutch (nl)

## Backend Integration (Planned)

The hook `useCoachingAnalysis.ts` is prepared for Supabase integration:
- Replace mock call with `supabase.functions.invoke('coaching-analyze', { body: { transcript } })`
- Edge function will call Claude API and return `CoachingAnalysis` JSON
- See `BACKLOG.md` for implementation tasks and `docs/PRD-AI-COACHING.md` for requirements

## Validation

- Minimum transcript: 100 characters (`MIN_TRANSCRIPT_CHARS`)
- Maximum transcript: 50,000 characters (`MAX_TRANSCRIPT_CHARS`)
- Constants defined in `src/lib/constants.ts`

## Custom Skills

- `/architecture-review` - Comprehensive codebase architecture analysis (bottlenecks, security, improvements)
