/**
 * Prompt Configuration
 *
 * Main entry point for all AI coaching prompts and guidelines.
 * Import from here for cleaner imports throughout the codebase.
 */

export {
  // Core identity
  COACH_IDENTITY,
  COACHING_PHILOSOPHY,
  OUTPUT_RULES_BASE,
  OUTPUT_RULES_BY_EXPERIENCE,
  OUTPUT_RULES,

  // Frameworks
  HIGH_TICKET_FRAMEWORKS,
  OBJECTION_FRAMEWORKS,
  FRAMEWORKS,
  getActiveFrameworks,

  // Context-specific prompts
  EXPERIENCE_PROMPTS,
  FOCUS_PROMPTS,
  GOAL_PROMPTS,

  // Output format
  JSON_FORMAT,

  // Builder functions
  buildSystemPrompt,
  buildUserPrompt,

  // Types
  type AnalysisContext,
  type Framework,
} from './prompts'
