PRD: AI Coaching MVP

PRD: AI Coaching MVP

> **Type:** Product Requirements Document
> **Versie:** 1.0
> **Datum:** 2026-01-13
> **Tijdsbudget:** 72 uur (3 werkdagen)
> **Status:** Ready for execution

---

## Executive Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   "Ik plak één coaching call transcript → binnen 60 seconden krijg ik      │
│    coaching feedback die ik morgen kan toepassen."                          │
│                                                                             │
│   Als dat werkt en indruk maakt, hebben we gewonnen.                        │
│   Ook al is alles eromheen handmatig, hardcoded of lelijk.                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Kernbelofte
Eén transcript → Eén analyse → Concrete actiepunten → Voelbare waarde

### Succes = Indruk maken op één closer/coach
Niet: feature-completeness, schaalbaarheid, of polish.

---

## Waarom Dit Werkt

### Wat we WEL hebben
- ✅ Scherp gedefinieerde doelgroep (closers + coaches)
- ✅ Harde kwaliteitslat (ondermaats = faalt)
- ✅ Duidelijk kernmoment (1-op-1 coaching calls)
- ✅ Bestaande gebruikersbasis om mee te testen

### Wat we NIET hoeven te doen
- ❌ Product discovery (we weten wat ze willen)
- ❌ Market validation (we hebben al closers)
- ❌ Infrastructure bouwen (Supabase + Edge Functions bestaan)

---

## Scope Definition

### ✅ IN SCOPE (72 uur)

| Component | Specificatie | Effort |
|-----------|--------------|--------|
| **Input** | Tekstveld voor transcript plakken | 2u |
| **Context** | Hardcoded closer-profiel (level, doel) | 1u |
| **AI** | Eén prompt → Claude API call | 4u |
| **Output** | Gestructureerde feedback op 1 scherm | 4u |
| **Hosting** | Supabase Edge Function | 2u |
| **UI** | Minimale React pagina | 4u |
| **Testing** | 3 echte transcripten door echte gebruiker | 4u |
| **Buffer** | Onverwachte issues | 12u |

**Totaal: ~33u actief werk + 39u buffer/iteratie**

### ❌ EXPLICIET UIT SCOPE

| Feature | Waarom niet | Wanneer wel |
|---------|-------------|-------------|
| Fathom auto-sync | Integratie-complexiteit | Week 2+ |
| Transcript history | Database schema nodig | Week 2+ |
| Meerdere frameworks | Prompt-explosie | Na validatie |
| Feedback loops | Vereist persistence | Na validatie |
| Team/manager view | Andere persona | Na MVP |
| Mooie UI | Tijd verspilling nu | Na validatie |
| Authenticatie | Bestaande auth gebruiken | Dag 1 |
| Mobile layout | Desktop-first | Na validatie |

---

## User Flow (Exact)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MVP USER FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   STAP 1: INPUT                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                                                                     │   │
│   │   [Plak je Fathom transcript hier]                                  │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │                                                             │   │
│   │   │   Coach: Hoe ging je call met Peter?                        │   │
│   │   │   Closer: Ja, het was lastig. Hij had bezwaren...           │   │
│   │   │   Coach: Welke bezwaren precies?                            │   │
│   │   │   Closer: Vooral prijs, hij zei dat...                      │   │
│   │   │   ...                                                       │   │
│   │   │                                                             │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   │                                                                     │   │
│   │   [────────────── Analyseer ──────────────]                         │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                              ↓ 30-60 sec                                    │
│                                                                             │
│   STAP 2: OUTPUT                                                            │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                                                                     │   │
│   │   🎯 PRIORITEIT #1                                                  │   │
│   │   ───────────────                                                   │   │
│   │   Stop met prijsverdediging — vraag eerst naar de échte blokkade.   │   │
│   │                                                                     │   │
│   │   📋 ACTIEPUNTEN                                                    │   │
│   │   ───────────────                                                   │   │
│   │   1. Open met "Wat zou er moeten veranderen om dit wél te doen?"    │   │
│   │   2. Stel de "10/10" vraag voordat je over prijs praat              │   │
│   │   3. Gebruik stilte na bezwaren (je vult nu te snel in)             │   │
│   │                                                                     │   │
│   │   💬 OBSERVATIES UIT DE CALL                                        │   │
│   │   ───────────────────────────                                       │   │
│   │   • "Hij zei dat het te duur was" — je ging direct in defence       │   │
│   │   • Coach stelde 3x dezelfde vraag — je hoorde het niet             │   │
│   │   • Geen concrete next step afgesproken aan het eind                │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Questionnaire (Context Boost)

Goal: capture 3-5 multiple-choice answers that steer the analysis and reduce generic output.

UI placement (assumption): inline above the transcript input, collapsed to a single row on mobile.

Design direction: light + fresh, subtle glassmorphism (frosted glass), accent color `#7dd3fc`.

### MVP Question Set (5)

1) Call type
- Discovery
- Objection handling
- Closing
- Follow-up

2) Deal size
- 3k-6k
- 6k-15k
- 15k-50k

3) Decision maker status
- Yes, direct decision maker
- Shared decision
- Not sure yet

4) Primary objection
- Price
- Timing
- Trust
- Offer fit
- Authority

5) Desired outcome for this call
- Clear next step
- Handle objection
- Move to close
- Qualify / disqualify

### Prompt injection (concept)

Add a short "Questionnaire Context" block before the transcript:

```
QUESTIONNAIRE CONTEXT:
- Call type: {callType}
- Deal size: {dealSize}
- Decision maker: {decisionMaker}
- Primary objection: {primaryObjection}
- Desired outcome: {desiredOutcome}
```

Keep it short and literal. No free-text fields in MVP.

Internal framework (MVP v2): map questionnaire answers to prompt emphasis
(e.g., objection type drives question focus). Not user-configurable yet.

---

## Technical Specification

### Architecture (Minimaal)

```
┌──────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│              │     │                      │     │                  │
│   React UI   │────▶│  Supabase Edge Fn    │────▶│  Claude API      │
│   (1 page)   │     │  /coaching-analyze   │     │  (claude-3-opus) │
│              │◀────│                      │◀────│                  │
└──────────────┘     └──────────────────────┘     └──────────────────┘
```

### Edge Function: `/coaching-analyze`

```typescript
// supabase/functions/coaching-analyze/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Anthropic from 'npm:@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
});

interface AnalyzeRequest {
  transcript: string;
  // Hardcoded context for MVP — no customization
}

interface CoachingAnalysis {
  priority: {
    title: string;
    explanation: string;
  };
  actionPoints: Array<{
    action: string;
    why: string;
  }>;
  observations: Array<{
    quote: string;
    insight: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { transcript } = await req.json() as AnalyzeRequest;

  if (!transcript || transcript.length < 100) {
    return new Response(
      JSON.stringify({ error: 'Transcript te kort (min 100 karakters)' }),
      { status: 400 }
    );
  }

  const analysis = await analyzeTranscript(transcript);

  return new Response(JSON.stringify(analysis), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});

async function analyzeTranscript(transcript: string): Promise<CoachingAnalysis> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: buildPrompt(transcript),
      },
    ],
  });

  // Parse structured output
  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  return JSON.parse(content.text);
}
```

### The Prompt (Kern van de MVP)

```typescript
function buildPrompt(transcript: string): string {
  return `Je bent een elite sales coach voor high-ticket closers (€3k-€50k deals).

CONTEXT:
- Dit is een transcript van een 1-op-1 coaching call tussen een coach en closer
- De closer wil groeien van €3-6k/maand naar €10-15k/maand
- Focus op concrete, direct toepasbare feedback

TRANSCRIPT:
"""
${transcript}
"""

ANALYSEER dit gesprek en geef feedback in EXACT dit JSON format:

{
  "priority": {
    "title": "[Eén zin: de belangrijkste verandering]",
    "explanation": "[2-3 zinnen waarom dit prioriteit #1 is]"
  },
  "actionPoints": [
    {
      "action": "[Concrete actie, begint met werkwoord]",
      "why": "[Eén zin waarom dit werkt]"
    }
  ],
  "observations": [
    {
      "quote": "[Exacte quote uit transcript]",
      "insight": "[Wat dit onthult over de closer]"
    }
  ]
}

REGELS:
- Maximaal 3 actionPoints
- Maximaal 3 observations
- Elke actie moet MORGEN toepasbaar zijn
- Geen coach-jargon of vage taal
- Quotes moeten EXACT uit het transcript komen
- Als iets niet duidelijk is, zeg dat eerlijk

Antwoord ALLEEN met valid JSON, geen andere tekst.`;
}
```

### React Component (Minimaal)

```typescript
// src/pages/CoachingAnalyze.tsx

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CoachingAnalysis {
  priority: { title: string; explanation: string };
  actionPoints: Array<{ action: string; why: string }>;
  observations: Array<{ quote: string; insight: string }>;
}

export default function CoachingAnalyze() {
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<CoachingAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (transcript.length < 100) {
      setError('Plak een langer transcript (min 100 karakters)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        'coaching-analyze',
        { body: { transcript } }
      );

      if (fnError) throw fnError;
      setAnalysis(data);
    } catch (err) {
      setError('Analyse mislukt. Probeer opnieuw.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Coaching Analyse</h1>

      {/* Input */}
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Plak je Fathom transcript hier..."
        className="w-full h-64 p-4 border rounded-lg mb-4"
        disabled={loading}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || transcript.length < 100}
        className="w-full py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? 'Analyseren...' : 'Analyseer'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Output */}
      {analysis && (
        <div className="mt-8 space-y-6">
          {/* Priority */}
          <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
            <div className="font-bold text-amber-800">🎯 Prioriteit #1</div>
            <div className="text-lg font-semibold mt-1">{analysis.priority.title}</div>
            <div className="text-gray-600 mt-1">{analysis.priority.explanation}</div>
          </div>

          {/* Action Points */}
          <div>
            <div className="font-bold mb-2">📋 Actiepunten</div>
            <ol className="space-y-2">
              {analysis.actionPoints.map((ap, i) => (
                <li key={i} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium">{i + 1}. {ap.action}</div>
                  <div className="text-sm text-gray-500">{ap.why}</div>
                </li>
              ))}
            </ol>
          </div>

          {/* Observations */}
          <div>
            <div className="font-bold mb-2">💬 Observaties</div>
            <div className="space-y-2">
              {analysis.observations.map((obs, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded">
                  <div className="italic text-gray-600">"{obs.quote}"</div>
                  <div className="text-sm mt-1">{obs.insight}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Output Specification

### Voorbeeld Output (Wat de gebruiker ziet)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   🎯 PRIORITEIT #1                                                          │
│   ═══════════════                                                           │
│                                                                             │
│   Stop met prijsverdediging — vraag eerst naar de échte blokkade.           │
│                                                                             │
│   Je gaat 3 van de 4 keer direct in verdediging als iemand "te duur"        │
│   zegt. Daardoor mis je de echte reden waarom ze twijfelen.                 │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   📋 ACTIEPUNTEN                                                            │
│   ══════════════                                                            │
│                                                                             │
│   1. Open met "Wat zou er moeten veranderen om dit wél te doen?"            │
│      → Verschuift focus van prijs naar waarde                               │
│                                                                             │
│   2. Stel de "10/10" vraag voordat je over prijs praat                      │
│      → Geeft je info om bezwaren te pareren                                 │
│                                                                             │
│   3. Gebruik 3 seconden stilte na elk bezwaar                               │
│      → Je vult nu te snel in, waardoor je info mist                         │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   💬 OBSERVATIES UIT DE CALL                                                │
│   ══════════════════════════                                                │
│                                                                             │
│   "Hij zei dat het te duur was en toen..."                                  │
│   → Je onderbrak de coach hier en ging direct verdedigen                    │
│                                                                             │
│   "Ik weet niet, misschien moet ik gewoon harder werken"                    │
│   → Dit is een signaal van overwhelm, niet van motivatiegebrek              │
│                                                                             │
│   "Aan het eind zei ik dat ik erover na zou denken"                         │
│   → Geen concrete next step — dit laat deals weglekken                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Output Kwaliteitscriteria

| Criterium | Vereiste | Meetbaar |
|-----------|----------|----------|
| **Specificiteit** | Elke actie verwijst naar iets uit de call | Quotes aanwezig |
| **Toepasbaarheid** | Acties zijn morgen uitvoerbaar | Begint met werkwoord |
| **Beknoptheid** | Hele output past op 1 scherm | Max 400 woorden |
| **Eerlijkheid** | Geen bullshit of vage adviezen | Geen "probeer", "misschien" |
| **Prioritering** | Duidelijk wat #1 is | Eén priority item |

---

## First 4 Hours Plan (Questionnaire Upgrade)

### Research Plan (timebox)
- [ ] Locate current input/output components and mock data
  Output: list of exact files + insertion points for questionnaire
  Acceptance: transcript input, analysis output, and mock data paths identified
- [ ] Define questionnaire schema + defaults
  Output: JSON shape + 5 MC options per field
  Acceptance: no free-text fields; matches PRD question set
- [ ] Confirm UI placement + styling tokens
  Output: layout choice (inline above transcript) + accent color `#7dd3fc`
  Acceptance: aligns with "light, fresh, frosted glass" direction

### Implementation Plan (timebox)
- [ ] Add questionnaire UI (MC selects or pills) to the transcript input section
  Output: visible questionnaire with 5 fields
  Acceptance: all options selectable; works on mobile
- [ ] Extend analysis request payload with questionnaire answers
  Output: request includes questionnaire context
  Acceptance: payload shape validated in the client
- [ ] Update mock analysis prompt/context (or placeholder) to include questionnaire block
  Output: prompt/context string includes questionnaire values
  Acceptance: values are injected in a fixed block
- [ ] Update output layout to show questionnaire context (small summary chip row)
  Output: compact summary near results header
  Acceptance: stays within one screen, no clutter
- [ ] Manual validation checklist
  Output: checklist in PRD for quick QA
  Acceptance: can be executed in <10 minutes

### Actionable Chunks
- [ ] Chunk A: UI + state
  Scope: questionnaire fields, defaults, validation, layout placement
  Done when: all 5 fields render, update state, and are readable on mobile
- [ ] Chunk B: Data + prompt wiring
  Scope: payload shape, context block, mock data updates
  Done when: payload includes questionnaire values and mock analysis reflects them
- [ ] Chunk C: Output + QA
  Scope: summary chips + checklist
  Done when: summary is visible and checklist passes

### Manual Validation Checklist
- [ ] Questionnaire visible above transcript input on desktop and mobile
- [ ] All 5 fields selectable; defaults set; no empty state blocking submit
- [ ] Request payload includes questionnaire context block
- [ ] Output header shows questionnaire summary chips
- [ ] Layout remains single-screen on standard laptop viewport

---

## 72-Uur Planning

### Dag 1 (Uur 0-24): Foundation

| Uur | Taak | Deliverable | Owner |
|-----|------|-------------|-------|
| 0-2 | Setup Anthropic API key in Supabase | `ANTHROPIC_API_KEY` secret | Dev |
| 2-6 | Edge Function skeleton + CORS | `/coaching-analyze` responds | Dev |
| 6-10 | Prompt engineering + testing | Consistent JSON output | Dev |
| 10-14 | React pagina (input form) | Transcript kan geplakt worden | Dev |
| 14-18 | React pagina (output display) | Analyse zichtbaar | Dev |
| 18-24 | Integration + error handling | Happy path werkt | Dev |

**Dag 1 Gate:** Kan ik een transcript plakken en krijg ik JSON terug?

### Dag 2 (Uur 24-48): Polish & Edge Cases

| Uur | Taak | Deliverable | Owner |
|-----|------|-------------|-------|
| 24-28 | Prompt refinement (3 echte transcripten) | Output kwaliteit omhoog | Dev |
| 28-32 | Loading states + error messages | Geen crashes | Dev |
| 32-36 | Output styling (basic maar leesbaar) | Professional genoeg | Dev |
| 36-40 | Edge cases (te kort, geen JSON, timeout) | Graceful failures | Dev |
| 40-44 | Routing + navigatie | Bereikbaar vanuit app | Dev |
| 44-48 | Buffer / fixes | Stabiel | Dev |

**Dag 2 Gate:** Kan een niet-developer dit gebruiken zonder uitleg?

### Dag 3 (Uur 48-72): Validation & Ship

| Uur | Taak | Deliverable | Owner |
|-----|------|-------------|-------|
| 48-52 | Test met 1e echte gebruiker | Feedback verzameld | Dev + User |
| 52-56 | Kritieke fixes uit feedback | Issues opgelost | Dev |
| 56-60 | Test met 2e echte gebruiker | Bevestiging dat het werkt | Dev + User |
| 60-64 | Deploy naar staging | Live op staging URL | Dev |
| 64-68 | Documentatie (1 pagina: wat + hoe) | README voor testers | Dev |
| 68-72 | Buffer / finale polish | Ship ready | Dev |

**Dag 3 Gate:** Maakt dit indruk op een closer/coach?

---

## Success Criteria

### Must Have (MVP = Fail zonder dit)

| # | Criterium | Hoe te meten |
|---|-----------|--------------|
| 1 | Transcript plakken werkt | Form submit zonder errors |
| 2 | Analyse komt binnen 60 sec | Stopwatch |
| 3 | Output bevat concrete actiepunten | Visuele check |
| 4 | Quotes komen uit het transcript | Ctrl+F verificatie |
| 5 | Geen crashes op happy path | 3 tests zonder error |

### Should Have (Maakt indruk)

| # | Criterium | Hoe te meten |
|---|-----------|--------------|
| 6 | Gebruiker zegt "wow" of equivalent | Verbale reactie |
| 7 | Gebruiker wil het nogmaals gebruiken | Vraagt om meer |
| 8 | Actiepunten voelen specifiek, niet generiek | Gebruiker feedback |

### Won't Have (Expliciet niet)

| # | Anti-criterium | Waarom niet |
|---|----------------|-------------|
| 9 | Automatische Fathom sync | Integratie-complexiteit |
| 10 | Opslaan van transcripten | Privacy + database scope |
| 11 | Meerdere coaching frameworks | Prompt-explosie |
| 12 | Mooie animaties | Tijd verspilling |

---

## Risks & Mitigations

| Risico | Impact | Kans | Mitigatie |
|--------|--------|------|-----------|
| Claude API rate limits | Blokkerend | Laag | Test account limits vooraf |
| Prompt geeft inconsistent JSON | Blokkerend | Medium | JSON mode + retry logic |
| Transcript te lang (token limit) | Hoog | Medium | Truncate op 8000 tokens |
| Output te generiek | Hoog | Medium | Prompt iteratie dag 2 |
| Gebruiker begrijpt UI niet | Medium | Laag | Ultra-simpele layout |

---

## Post-MVP Roadmap (Week 2+)

Alleen relevant ALS de MVP valideert:

| Week | Feature | Waarom |
|------|---------|--------|
| 2 | Transcript history | Gebruikers willen terugkijken |
| 2 | Fathom OAuth | Automatische sync gevraagd |
| 3 | Meerdere frameworks | Coaches willen customization |
| 3 | Feedback loop | Verbeteren van output kwaliteit |
| 4 | Team view (manager) | Andere persona ontsluiten |

---

## Appendix A: Prompt Iteration Log

| Versie | Wijziging | Resultaat |
|--------|-----------|-----------|
| v0.1 | Initiële prompt | Te lange output, geen JSON |
| v0.2 | JSON format enforcement | Werkt, maar generieke actiepunten |
| v0.3 | Quote requirement toegevoegd | Specifiekere observaties |
| v0.4 | Max 3 items per sectie | Past op 1 scherm |
| v0.5 | "Morgen toepasbaar" constraint | Concretere acties |

*(Vul aan tijdens development)*

---

## Appendix B: Test Transcripts

### Transcript 1: Bezwaar-handling
```
Coach: Hoe ging je call met Peter gisteren?
Closer: Niet zo goed. Hij zei dat het te duur was.
Coach: Wat zei je toen?
Closer: Ik legde uit waarom we die prijs vragen, de waarde enzo.
Coach: En toen?
Closer: Hij bleef twijfelen. Ik zei dat hij erover kon nadenken.
Coach: Heb je gevraagd wat hij dan wél verwachtte?
Closer: Nee, niet echt...
```

### Transcript 2: Follow-up gemist
*(Vul aan met echt transcript)*

### Transcript 3: Succesvolle close
*(Vul aan met echt transcript)*

---

## Appendix C: Environment Setup

```bash
# 1. Anthropic API key toevoegen
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

# 2. Edge Function deployen
./scripts/deploy-functions.sh coaching-analyze

# 3. Lokaal testen
supabase functions serve coaching-analyze --env-file .env.local
```

---

## Sign-off

| Rol | Naam | Datum | Akkoord |
|-----|------|-------|---------|
| Product | | | [ ] |
| Engineering | | | [ ] |
| Design | | | [ ] |

---

**Einde document**

*"Alles wat niet direct bijdraagt aan een werkende, indrukwekkende MVP: schrappen."*
