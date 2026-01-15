# Database Optimizer Skill

Analyze and optimize database queries and schema for production performance. Catches indexing issues, suggests query rewrites, and provides migration scripts.

## Instructions

When this skill is invoked, perform a thorough database optimization analysis.

### Step 1: Gather Information

Use AskUserQuestion to collect:

1. **Database type**
   - PostgreSQL, MySQL, SQLite, MongoDB, etc.

2. **Schema**
   - Ask user to paste tables, columns, relationships
   - Or point to schema file/migration files in codebase

3. **Problematic queries**
   - Slow queries with timing
   - EXPLAIN ANALYZE output if available

4. **Performance context**
   - Current query time
   - Target query time
   - Query frequency (calls/second)
   - Data volume (rows in tables)
   - Expected growth (2 year projection)

### Step 2: Analyze

For each slow query, identify:

1. **Root cause of slowness**
   - Missing indexes
   - N+1 queries
   - Full table scans
   - Inefficient JOINs
   - Suboptimal WHERE clauses

2. **Index analysis**
   - Missing indexes (columns in WHERE, JOIN, ORDER BY)
   - Unused indexes (candidates for removal)
   - Composite index opportunities

3. **Query structure issues**
   - SELECT * instead of specific columns
   - Unnecessary subqueries
   - Missing LIMIT clauses
   - Inefficient aggregations

### Step 3: Generate Recommendations

Produce a structured report:

```markdown
## Database Optimization Report

### Summary
- Database: [type + version]
- Tables analyzed: [count]
- Queries analyzed: [count]
- Estimated improvement: [X% faster]

---

### 1. Index Recommendations

| Table | Column(s) | Index Type | Impact | Reason |
|-------|-----------|------------|--------|--------|
| ... | ... | B-tree/GIN/etc | High/Med/Low | ... |

**Migration script:**
```sql
-- High impact indexes
CREATE INDEX idx_... ON table(column);

-- Medium impact indexes
CREATE INDEX idx_... ON table(column);
```

---

### 2. Query Rewrites

#### Query 1: [description]

**Before:**
```sql
[original query]
```
- Execution time: [X ms]
- Problem: [explanation]

**After:**
```sql
[optimized query]
```
- Expected time: [Y ms]
- Improvement: [Z%]

---

### 3. Schema Improvements

| Change | Type | Impact | Trade-off |
|--------|------|--------|-----------|
| ... | Denormalize/Normalize/Partition | ... | Write vs Read |

---

### 4. Caching Strategy

| Data | Cache Location | TTL | Invalidation |
|------|----------------|-----|--------------|
| ... | Redis/Memory/CDN | ... | ... |

---

### 5. Implementation Priority

#### Immediate (biggest impact, lowest risk)
1. [change] - Est. [X%] improvement

#### Short-term (requires testing)
1. [change] - Est. [X%] improvement

#### Long-term (schema changes)
1. [change] - Est. [X%] improvement

---

### Growth Considerations (2 year projection)

| Current | In 2 years | Recommendation |
|---------|------------|----------------|
| [X] rows | [Y] rows | Partition by [column] |
```

### Step 4: Provide Migration Scripts

Generate ready-to-run SQL:

```sql
-- ================================================
-- Database Optimization Migration
-- Generated: [date]
-- ================================================

-- STEP 1: Create indexes (non-blocking if possible)
CREATE INDEX CONCURRENTLY idx_... ON ...;

-- STEP 2: Analyze tables after index creation
ANALYZE table_name;

-- STEP 3: Optional schema changes
-- (Review carefully before running)
ALTER TABLE ...;
```

### Output

Write the full analysis to `docs/DB-OPTIMIZATION.md` and summarize key findings to the user.

### Constraints

- Always explain WHY something is slow, not just what to change
- Consider write performance impact of new indexes
- Account for data growth
- Prefer non-blocking migrations (CONCURRENTLY for Postgres)
- Flag any destructive changes clearly
- If no EXPLAIN output provided, note that estimates are approximate
