# Conventional Commits Format

## Structure

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Components

### Type (required)
Describes the category of change. Must be one of the defined types.

### Scope (optional but recommended)
A noun describing the section of codebase affected:
- Module name: `auth`, `api`, `database`
- Component: `button`, `modal`, `navbar`
- Layer: `controller`, `service`, `repository`
- Feature: `checkout`, `profile`, `search`

### Description (required)
- Imperative mood: "add" not "added" or "adds"
- Lowercase first letter
- No period at end
- Max 50 characters (ideally)

### Body (optional)
- Blank line after description
- Explain motivation and contrast with previous behavior
- Use bullet points for multiple items
- Wrap at 72 characters

### Footer (optional)
- Breaking changes: `BREAKING CHANGE: <description>`
- Issue references: `Fixes #123`, `Closes #456`
- Co-authors: `Co-authored-by: Name <email>`

## Breaking Changes

Two ways to indicate:
1. Append `!` after type/scope: `feat(api)!: change response format`
2. Footer: `BREAKING CHANGE: description of what breaks`

Always include migration instructions for breaking changes.

## Revert Commits

```
revert: feat(api): add user endpoint

This reverts commit abc1234.
Reason: caused production issues with...
```
