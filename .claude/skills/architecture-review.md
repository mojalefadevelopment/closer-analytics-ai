# Architecture Review Skill

Comprehensive architecture analysis before writing code. Identifies bottlenecks, security issues, and improvement priorities.

## Instructions

When this skill is invoked, perform a thorough architecture review of the codebase.

### Step 1: Gather Context

First, explore the codebase to understand:
- Folder structure and organization
- Tech stack (check package.json, config files)
- Key architectural patterns in use
- Data flow and state management
- API/backend integration approach

Use the Explore agent to scan:
- All config files (*.config.*, tsconfig, etc.)
- Entry points (main.tsx, index.ts, App.tsx)
- Key directories (src/, supabase/, lib/)
- Type definitions
- Any existing documentation (README, CLAUDE.md, docs/)

### Step 2: Ask for Requirements (if not provided)

Use AskUserQuestion to gather:

1. **Scale expectations**
   - How many concurrent users?
   - Expected data volume?
   - Target growth timeline?

2. **Critical features**
   - What features are must-haves?
   - Any planned integrations?
   - Performance requirements?

### Step 3: Analyze and Report

Produce a structured analysis:

```markdown
## Architecture Review: [Project Name]

### Tech Stack Summary
- Frontend: [detected]
- Backend: [detected]
- Database: [detected]
- External APIs: [detected]

---

### 1. Architecture Strengths
What's working well and should be preserved.

| Strength | Why It Matters |
|----------|----------------|
| ... | ... |

---

### 2. Critical Bottlenecks
What will break at scale or under load.

| Bottleneck | Impact | At What Scale |
|------------|--------|---------------|
| ... | ... | ... |

---

### 3. Security Vulnerabilities
Potential security issues to address.

| Vulnerability | Risk Level | Location |
|---------------|------------|----------|
| ... | High/Medium/Low | file:line |

---

### 4. Recommended Improvements
Specific, actionable changes.

| Improvement | Effort | Impact | Files Affected |
|-------------|--------|--------|----------------|
| ... | S/M/L | High/Med/Low | ... |

---

### 5. Implementation Priority

#### Immediate (before launch)
1. ...

#### Short-term (within 2 weeks)
1. ...

#### Long-term (as you scale)
1. ...

---

### Cost Considerations
- Current: [estimated infrastructure cost]
- At scale: [projected cost implications]
- Cost-saving opportunities: ...
```

### Constraints

- Focus on production-ready solutions
- Consider cost implications of recommendations
- Prioritize maintainability over clever code
- Be specific: reference actual files and line numbers
- Provide actionable steps, not vague suggestions

### Output

Write the analysis to `docs/ARCHITECTURE-REVIEW.md` and summarize key findings to the user.
