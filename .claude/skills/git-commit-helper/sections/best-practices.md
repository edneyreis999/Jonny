# Commit Message Best Practices

## The Golden Rules

### 1. Atomic Commits

One logical change per commit. If you can describe the change with "and", split it.

**Bad:**

```
feat(auth): add login and fix password validation and update styles
```

**Good:**

```
feat(auth): add login endpoint
fix(auth): validate password length
style(auth): update form styling
```

### 2. Imperative Mood

Write as if giving a command. Read as "If applied, this commit will..."

**Bad:** `added feature`, `fixes bug`, `changing behavior`
**Good:** `add feature`, `fix bug`, `change behavior`

### 3. Explain Why, Not What

The diff shows WHAT changed. The message explains WHY.

**Bad:**

```
fix(api): change status code to 404
```

**Good:**

```
fix(api): return 404 for missing resources

Previously returned 500 for non-existent users,
confusing clients about error cause.
```

### 4. Keep Summary Concise

- Under 50 characters (hard limit: 72)
- No period at end
- Capitalize only if needed for proper nouns

### 5. Use Body for Context

When summary isn't enough:

- Explain motivation
- Contrast with previous behavior
- Note side effects
- Reference related issues

## Writing the Summary

### Do

- Start with lowercase (unless proper noun)
- Use present tense imperative
- Be specific: "fix login timeout" not "fix bug"
- Include scope when helpful

### Don't

- End with period
- Use past tense
- Be vague: "update", "changes", "fix stuff"
- Exceed 50 characters

## Writing the Body

### When to Include

- Complex changes needing explanation
- Non-obvious motivations
- Breaking changes
- Workarounds or temporary solutions

### Format

```
Short summary under 50 chars

More detailed explanation if needed. Wrap at 72 characters.
Explain the problem this commit solves and why this approach
was chosen over alternatives.

- Bullet points for multiple items
- Each starting with hyphen
- Consistent formatting

Fixes #123
```

## Scope Guidelines

### Good Scopes

- Feature names: `auth`, `checkout`, `search`
- Module names: `api`, `database`, `cache`
- Component names: `button`, `modal`, `table`
- Layer names: `service`, `controller`, `repository`

### Avoid

- File names: `user.ts`, `index.js`
- Generic: `code`, `stuff`, `misc`
- Too broad: `app`, `all`, `everything`

## Multi-File Commits

When touching multiple files:

1. Identify the common theme
2. Use that as scope
3. List specific changes in body

```
refactor(auth): centralize token validation

- Move validation from controllers to middleware
- Extract token parsing to utility function
- Update all auth-related endpoints
- Add comprehensive tests

Reduces code duplication across 12 controllers.
```
