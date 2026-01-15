# Backlog - AI Coaching MVP

> **Source:** [PRD-AI-COACHING.md](docs/PRD-AI-COACHING.md)
> **Scope:** MVP only, 72-hour execution window
> **Status:** Ready for execution

---

## Scope Guardrails

**In scope:** 1 transcript input, 1 analysis output, 1 page, 1 edge function, 1 prompt, manual testing with 3 real transcripts

**Out of scope:** Auth, history, Fathom sync, multiple frameworks, mobile polish

---

## Priority Levels

| Level | Meaning |
|-------|---------|
| **P0** | Blocking - MVP cannot ship without this |
| **P1** | Important - Needed for quality MVP |
| **P2** | Nice-to-have - Do if time permits |

---

## P0: Critical Path (Must Complete First)

### 1. Setup (Do First)

- [ ] **TAK-01** Set Supabase secret for Anthropic API key
  `supabase secrets list` shows key

- [ ] **TAK-02** Local env setup for function testing
  `supabase functions serve` starts without errors

### 2. Edge Function Core

- [ ] **TAK-03** Edge function skeleton with CORS + OPTIONS
  curl OPTIONS returns 200

- [ ] **TAK-05** Anthropic client and API call integration
  Function returns raw model output

- [ ] **TAK-06** Prompt builder per PRD JSON schema
  Valid JSON in 3 test runs

- [ ] **TAK-04** Request validation: transcript length >= 100
  Short input returns 400 with clear error

- [ ] **TAK-07** JSON parsing + error handling
  Invalid response returns 500 with log

### 3. Frontend Core

- [ ] **TAK-10** `CoachingAnalyze` page with textarea + button
  Transcript can be pasted, button enabled

- [ ] **TAK-11** Supabase function invoke wired
  Output renders after analyze

- [ ] **TAK-13** Output layout for priority, actionPoints, observations
  Fits within desktop viewport

- [ ] **TAK-12** Loading + error states
  Loading visible, errors readable

- [ ] **TAK-14** Input constraints in UI (min 100 chars)
  Disabled button + helper message

### 4. Deploy

- [ ] **TAK-21** Deploy edge function
  Staging call succeeds

- [ ] **TAK-22** Add route/link in app
  Reachable via UI navigation

---

## P1: Quality & Robustness

### Edge Function Hardening

- [ ] **TAK-08** Token/length guard (truncate) for long input
  Long input processed without crash

- [ ] **TAK-09** Retry on JSON parse fail (1 retry)
  Retry logged on failure

### Prompt Quality

- [ ] **TAK-15** Run 3 real transcripts through prompt
  Max 3 actionPoints and 3 observations

- [ ] **TAK-16** Prompt iteration for specificity
  Actions start with verb, no vague language

- [ ] **TAK-17** Quote strictness validation
  ctrl+f matches every quote in transcript

### QA & Edge Cases

- [ ] **TAK-18** Test cases: short, empty, very long transcript
  No crashes, clear errors

- [ ] **TAK-19** Timeout/latency check
  < 60s for normal input

- [ ] **TAK-20** Happy-path demo flow
  End-to-end transcript → output works

---

## P2: Polish & Validation

### Documentation

- [ ] **TAK-23** Mini README for testers
  Non-dev can follow instructions

### User Validation

- [ ] **TAK-24** Test with user 1
  Concrete feedback captured

- [ ] **TAK-25** Fixes from feedback 1
  Top issue fixed

- [ ] **TAK-26** Test with user 2
  Output useful to user

- [ ] **TAK-27** Go/No-Go evaluation
  Must-haves met

---

## Definition of Done (MVP)

- [ ] Transcript paste works
- [ ] Analysis returns in < 60 seconds
- [ ] Output contains concrete action points with quotes
- [ ] No crashes on happy path
- [ ] 3 real transcript tests completed

---

## Execution Order

```
START
  │
  ▼
┌─────────────────────────────┐
│ TAK-01, TAK-02              │  Setup
│ Secrets + Local env         │
└─────────────────────────────┘
  │
  ▼
┌─────────────────────────────┐
│ TAK-03 → TAK-05 → TAK-06    │  Edge Function
│ Skeleton → API → Prompt     │
└─────────────────────────────┘
  │
  ▼
┌─────────────────────────────┐
│ TAK-04, TAK-07              │  Validation & Errors
│ Input check + JSON parse    │
└─────────────────────────────┘
  │
  ▼
┌─────────────────────────────┐
│ TAK-10 → TAK-11 → TAK-13    │  Frontend
│ Page → Wire → Output        │
└─────────────────────────────┘
  │
  ▼
┌─────────────────────────────┐
│ TAK-12, TAK-14              │  UX Polish
│ Loading + Constraints       │
└─────────────────────────────┘
  │
  ▼
┌─────────────────────────────┐
│ TAK-21, TAK-22              │  Deploy
│ Function + Route            │
└─────────────────────────────┘
  │
  ▼
MVP COMPLETE ─── Then P1/P2
```

---

## Environment Setup

```bash
# 1. Anthropic API key
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

# 2. Deploy Edge Function
supabase functions deploy coaching-analyze

# 3. Local testing
supabase functions serve coaching-analyze --env-file .env.local
```
