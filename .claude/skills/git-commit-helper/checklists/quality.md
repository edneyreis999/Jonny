# Commit Message Quality Checklist

## 🔴 CRITICAL: Author Validation

**BEFORE EVERYTHING ELSE:**

- [ ] **Git user configured** - `git config user.name` and `git config user.email` are set
- [ ] **NO Claude co-author** - NEVER add `Co-Authored-By: Claude` or similar
- [ ] **Human author only** - Commit has ONLY the configured git user as author

**This is NON-NEGOTIABLE. Commits must reflect the human developer, not the AI assistant.**

---

## Pre-Commit Validation

Apply before finalizing any commit message.

### Summary Line

- [ ] **Type is appropriate** - Correctly categorizes the change (feat/fix/refactor/etc.)
- [ ] **Scope is specific** - Names the affected module/component (not generic like "code")
- [ ] **Under 50 characters** - Ideally; hard limit 72
- [ ] **Imperative mood** - "add" not "added" or "adds"
- [ ] **No period at end** - Summary ends without punctuation
- [ ] **Lowercase start** - Unless proper noun requires capitalization
- [ ] **Descriptive** - Avoids vague terms like "update", "fix stuff", "changes"

### Body (if present)

- [ ] **Blank line after summary** - Required separation
- [ ] **Explains WHY** - Motivation, not just description
- [ ] **Wrapped at 72 chars** - For terminal readability
- [ ] **Bullet points consistent** - All using `-` or `*`

### Footer (if applicable)

- [ ] **Breaking changes marked** - Using `!` or `BREAKING CHANGE:`
- [ ] **Issue refs included** - `Fixes #123`, `Closes #456`
- [ ] **Migration instructions** - For breaking changes

### Atomic Commit Check

- [ ] **Single logical change** - Can be described without "and"
- [ ] **Self-contained** - Build passes after this commit alone
- [ ] **Reviewable** - Reasonable size for code review

## Quick Reference

### Good Examples
```
feat(auth): add JWT token refresh endpoint
fix(api): handle null user profile gracefully
refactor(db): extract query builder to separate module
docs(readme): add Docker setup instructions
test(auth): add integration tests for login flow
chore(deps): upgrade typescript to 5.0
```

### Bad Examples
```
update code                    # Too vague
Fixed the bug.                 # Past tense, period, vague
feat: add new feature          # No scope, circular description
FEAT(AUTH): ADD LOGIN          # Wrong case
adding user authentication     # Not imperative
```

## Final Check

Before committing, ask:
1. Would a new team member understand this change from the message?
2. In 6 months, will I know WHY this change was made?
3. Does the commit stand alone (atomic)?
