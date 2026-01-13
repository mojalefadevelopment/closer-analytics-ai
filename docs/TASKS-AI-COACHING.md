# AI Coaching MVP - Task Breakdown

Source: PRD-AI-COACHING.md  
Scope: MVP only, 72-hour execution window

## Scope Guardrails
- Only: 1 transcript input, 1 analysis output, 1 page, 1 edge function, 1 prompt, manual testing with 3 real transcripts
- Not included: auth, history, Fathom sync, multi frameworks, mobile polish

## Workstream 1: Project Setup and Secrets
- [ ] **TAK-01** Set Supabase secret for Anthropic API key  
  Deliverable: `ANTHROPIC_API_KEY` secret present  
  Acceptance: `supabase secrets list` shows key
- [ ] **TAK-02** Local env setup for function testing  
  Deliverable: `.env.local` with required vars  
  Acceptance: `supabase functions serve` starts without errors

## Workstream 2: Edge Function `/coaching-analyze`
- [ ] **TAK-03** Edge function skeleton with CORS + OPTIONS  
  Deliverable: `/coaching-analyze` responds 200 to OPTIONS  
  Acceptance: curl OPTIONS works
- [ ] **TAK-04** Request validation: transcript length >= 100  
  Deliverable: 400 with clear error  
  Acceptance: short input fails with error
- [ ] **TAK-05** Anthropic client and API call integration  
  Deliverable: function returns raw model output  
  Acceptance: successful response with content
- [ ] **TAK-06** Prompt builder per PRD JSON schema  
  Deliverable: `buildPrompt()` implemented  
  Acceptance: valid JSON in 3 test runs
- [ ] **TAK-07** JSON parsing + error handling  
  Deliverable: clear error when JSON invalid  
  Acceptance: invalid response leads to 500 with log
- [ ] **TAK-08** Token/length guard (truncate) for long input  
  Deliverable: transcript truncation  
  Acceptance: long input processed without crash
- [ ] **TAK-09** Retry on JSON parse fail (1 retry)  
  Deliverable: stricter second attempt  
  Acceptance: retry logged

## Workstream 3: Frontend UI (React)
- [ ] **TAK-10** `CoachingAnalyze` page with textarea + button  
  Deliverable: input flow works  
  Acceptance: transcript can be pasted and button enabled
- [ ] **TAK-11** Supabase function invoke wired  
  Deliverable: response mapped to state  
  Acceptance: output renders after analyze
- [ ] **TAK-12** Loading + error states  
  Deliverable: loading text/spinner and error box  
  Acceptance: loading visible, errors readable
- [ ] **TAK-13** Output layout for priority, actionPoints, observations  
  Deliverable: single-screen output  
  Acceptance: fits within desktop viewport
- [ ] **TAK-14** Input constraints in UI (min 100 chars)  
  Deliverable: disabled button + message  
  Acceptance: user sees immediate feedback

## Workstream 4: Prompt Quality
- [ ] **TAK-15** Run 3 real transcripts through prompt  
  Deliverable: outputs logged  
  Acceptance: max 3 actionPoints and 3 observations
- [ ] **TAK-16** Prompt iteration for specificity  
  Deliverable: v0.2 prompt  
  Acceptance: actions start with verb, no vague language
- [ ] **TAK-17** Quote strictness validation  
  Deliverable: quotes match transcript  
  Acceptance: ctrl+f matches every quote

## Workstream 5: QA and Edge Cases
- [ ] **TAK-18** Test cases: short, empty, very long transcript  
  Deliverable: checklist  
  Acceptance: no crashes, clear errors
- [ ] **TAK-19** Timeout/latency check  
  Deliverable: timing logs  
  Acceptance: < 60s for normal input
- [ ] **TAK-20** Happy-path demo flow  
  Deliverable: end-to-end run recorded  
  Acceptance: transcript -> output visible

## Workstream 6: Deploy and Documentation
- [ ] **TAK-21** Deploy edge function  
  Deliverable: live `/coaching-analyze`  
  Acceptance: staging call succeeds
- [ ] **TAK-22** Add route/link in app  
  Deliverable: navigation entry  
  Acceptance: reachable via UI
- [ ] **TAK-23** Mini README for testers  
  Deliverable: 1-page usage and test flow  
  Acceptance: non-dev can follow

## Workstream 7: User Validation
- [ ] **TAK-24** Test with user 1  
  Deliverable: feedback notes  
  Acceptance: concrete feedback captured
- [ ] **TAK-25** Fixes from feedback 1  
  Deliverable: patch  
  Acceptance: top issue fixed
- [ ] **TAK-26** Test with user 2  
  Deliverable: confirmation notes  
  Acceptance: output useful to user
- [ ] **TAK-27** Go/No-Go evaluation  
  Deliverable: decision + notes  
  Acceptance: must-haves met

## Definition of Done (MVP)
- Transcript paste works
- Analysis returns in < 60 seconds
- Output contains concrete action points with quotes
- No crashes on happy path
- 3 real transcript tests completed

## First 2 Hours Plan

### Research Plan (0:00 - 0:30)
- [ ] Confirm existing Supabase project and Edge Functions are set up  
  Output: short note on current state (project, CLI, function folder presence)
- [ ] Identify required env vars and where they should live  
  Output: list of required keys and target files (`supabase secrets`, `.env.local`)
- [ ] Check existing app routes and where to add the new page  
  Output: target route path and file location

### Implementation Plan (0:30 - 2:00)
- [ ] **TAK-01** Set Supabase secret for Anthropic API key  
  Output: secret added and verified
- [ ] **TAK-02** Local env setup for function testing  
  Output: `.env.local` ready and function serve works
- [ ] **TAK-03** Edge function skeleton with CORS + OPTIONS  
  Output: `/coaching-analyze` responds to OPTIONS
- [ ] **TAK-05** Anthropic call + prompt builder stub  
  Output: function returns model output for a test transcript

### Actionable Chunks (Pick Up and Execute)
- [ ] **Chunk A** Supabase + env wiring  
  Scope: TAK-01, TAK-02  
  Done when: secrets set and local serve runs
- [ ] **Chunk B** Edge function scaffold  
  Scope: TAK-03  
  Done when: OPTIONS works with CORS headers
- [ ] **Chunk C** AI call stub  
  Scope: TAK-05  
  Done when: one test transcript returns output
