# Backlog - Closer Analytics AI

Use this as the single source of truth for future work items.

---

## Phase 2: AI Backend Integration

### Supabase Setup
- [ ] Create Supabase project (if not exists)
- [ ] Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
- [ ] Install `@supabase/supabase-js` dependency
- [ ] Create `src/lib/supabase.ts` client

### Edge Function: `/coaching-analyze`
- [ ] Create `supabase/functions/coaching-analyze/index.ts`
- [ ] Implement CORS headers
- [ ] Add request validation (min 100 chars)
- [ ] Integrate Anthropic SDK (`npm:@anthropic-ai/sdk`)
- [ ] Implement `buildPrompt()` function with PRD prompt
- [ ] Parse Claude JSON response
- [ ] Add error handling (timeout, invalid JSON, API errors)
- [ ] Set `ANTHROPIC_API_KEY` secret on Supabase

### Frontend Connection
- [ ] Update `useCoachingAnalysis.ts` to call real Edge Function
- [ ] Replace mock response with `supabase.functions.invoke()`
- [ ] Test happy path with real transcript
- [ ] Test error states (too short, API failure, timeout)

### Validation & Testing
- [ ] Test with 3 real coaching transcripts
- [ ] Verify quotes match transcript exactly
- [ ] Confirm response time < 60 seconds
- [ ] Validate JSON structure matches `CoachingAnalysis` type
