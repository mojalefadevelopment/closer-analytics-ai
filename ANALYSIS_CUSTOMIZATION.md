# Analysis Customization Guide

Dit document legt uit hoe je de AI coaching analyse kunt aanpassen.

## Quick Start

Het hoofdbestand voor alle AI instructies is:
```
api/config/prompts.ts
```

## Wat je kunt aanpassen

### 1. Coach Identiteit
```typescript
export const COACH_IDENTITY = `Je bent een elite sales coach...`
```
Pas de persoonlijkheid en tone-of-voice van de AI aan.

### 2. Coaching Filosofie
```typescript
export const COACHING_PHILOSOPHY = [
  'Eén grote verandering is beter dan tien kleine',
  // ... voeg toe of pas aan
]
```

### 3. Experience Levels
In `EXPERIENCE_PROMPTS` kun je aanpassen hoe de AI reageert op basis van ervaring:
- **starter**: Simpele taal, bemoedigend, max 2 actiepunten
- **intermediate**: Direct, frameworks noemen, max 3 actiepunten
- **expert**: Ultra-direct, psychologische inzichten, blinde vlekken benoemen

### 4. Focus Areas
In `FOCUS_PROMPTS`:
- **bezwaren**: Focus op bezwaarafhandeling
- **afsluiting**: Focus op closing technieken
- **rapport**: Focus op connectie bouwen
- **algemeen**: Volledige analyse

### 5. Goals
In `GOAL_PROMPTS`:
- **closes**: Feedback gericht op hogere close rate
- **tickets**: Feedback gericht op hogere dealwaarde
- **gesprekken**: Feedback gericht op gespreksvaardigheden

### 6. Custom Frameworks
Voeg je eigen frameworks toe aan de `FRAMEWORKS` array:

```typescript
{
  name: 'Mijn Custom Framework',
  description: 'Wat dit framework doet',
  enabled: true,
  appliesTo: 'all', // of ['bezwaren', 'afsluiting']
  criteria: [
    'Waar de AI op moet letten punt 1',
    'Waar de AI op moet letten punt 2',
  ],
}
```

## Output Format

De AI geeft altijd terug:
```json
{
  "priority": {
    "title": "Belangrijkste verandering",
    "explanation": "Waarom dit prioriteit #1 is"
  },
  "actionPoints": [
    { "action": "Concrete actie", "why": "Waarom dit werkt" }
  ],
  "observations": [
    { "quote": "Exacte quote", "insight": "Wat dit onthult" }
  ]
}
```

## Tips

1. **Test incrementeel**: Pas één ding aan en test
2. **Wees specifiek**: Hoe specifieker je instructies, hoe beter de output
3. **Gebruik voorbeelden**: Geef de AI voorbeelden van goede/slechte feedback
4. **Check de logs**: Bij problemen, check de Vercel logs voor debugging
