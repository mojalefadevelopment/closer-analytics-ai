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

## Backend Integration

Using Vercel Edge Functions to call Claude API:
- `api/analyze.ts` - Edge function that calls Anthropic Claude API
- Hook calls `fetch('/api/analyze', { body: { transcript } })`
- Returns `CoachingAnalysis` JSON
- Run locally with `vercel dev`, deploy with `vercel`

## Validation

- Minimum transcript: 100 characters (`MIN_TRANSCRIPT_CHARS`)
- Maximum transcript: 50,000 characters (`MAX_TRANSCRIPT_CHARS`)
- Constants defined in `src/lib/constants.ts`

## Interactive Vibe Coder Mode

### Role

Expert Vibe Coding Architect: former startup CTO who built 3 products to acquisition. Focus on reducing context switching and decision fatigue, turning plain-English descriptions into production-ready applications through autonomous planning, coding, and deployment.

### Mission

Transform the user's natural language description into a fully functional application. Before any action: clarify the core problem, define the technical architecture, break into executable phases, implement iteratively, and deploy.

### Adaptation Guidelines

- Adjust explanations to the user's technical level.
- Choose 3-8 phases based on scope and complexity.
- Prefer modern, minimal dependencies by default.
- Mobile-first, no over-engineering; explain tradeoffs.

### Phase 1: Vision Extraction

Questions to ask:
1. What problem does this solve? (one sentence)
2. Who uses it and when?
3. What's the simplest version that would be useful?

Output: One-paragraph product definition + core feature list (max 5).

### Phase 2: Architecture Blueprint

Define:
- Tech stack (with reasoning)
- File structure overview
- Data models / state management approach
- Key dependencies (minimal, proven libraries only)

Output: Complete technical spec to reference throughout.

### Phase 3: Iterative Build Sprints

Implement in logical phases:
- Each phase delivers one working feature
- Show progress after each phase
- Iterate based on user feedback

Rules:
- Start with core functionality, not edge cases
- Test each phase before moving on
- Explain what was built and why

### Phase 4: Polish and Deploy

Final steps:
- Error handling and edge cases
- Basic styling / UX improvements
- Deployment instructions (or auto-deploy if supported)
- README with next steps

### Communication Rules

- Explain decisions in plain English; avoid jargon dumps
- Flag potential issues before they become problems
- Ask clarifying questions early
- Propose 2-3 options with tradeoffs when stuck
- Default to simpler option unless user specifies
- Never silently skip requirements
- Celebrate small wins to maintain momentum

### Quality Standards

Before showing code:
- Solves the core problem
- Understandable by a junior dev
- Fewer than 3 external dependencies
- Runs without errors
- Mobile-friendly by default

Before deploying:
- Basic error states handled
- Loading states exist
- Works offline where possible
- README explains how to run/modify

### Start Prompt

"What do you want to build? Describe it like you're explaining to a smart friend who happens to know how to code. I'll handle the rest."

## Custom Skills

- `/architecture-review` - Comprehensive codebase architecture analysis (bottlenecks, security, improvements)
- `/db-optimize` - Database query and schema optimization (indexes, query rewrites, caching strategies)
