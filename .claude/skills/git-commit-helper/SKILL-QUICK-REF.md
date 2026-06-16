# Git Commit Helper - Quick Reference

## Commit Format

```
<type>(<scope>): <description>

[body]

[footer]
```

## Types

| Type | Use For |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting |
| `refactor` | Code restructuring |
| `test` | Tests |
| `chore` | Maintenance |
| `perf` | Performance |

## Quick Commands

```bash
# View changes
git diff --staged

# Interactive stage
git add -p

# Commit
git commit -m "type(scope): description"

# Amend last commit
git commit --amend
```

## Summary Rules

- Under 50 characters
- Imperative mood: "add" not "added"
- No period at end
- Lowercase start

## Examples

```
feat(auth): add OAuth2 login
fix(api): handle null responses
refactor(db): simplify queries
docs(readme): add setup guide
test(auth): add login tests
chore(deps): update lodash
```

## Breaking Changes

```
feat(api)!: change response format

BREAKING CHANGE: New JSON structure
```

## Checklist

- [ ] Type matches change
- [ ] Scope is specific
- [ ] <50 chars summary
- [ ] Imperative mood
- [ ] Explains WHY (in body)
