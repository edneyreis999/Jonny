# Git Commit Helper Skill

Generate descriptive commit messages following Conventional Commits format.

## Overview

This skill helps developers write clear, consistent commit messages by:

- Analyzing git diffs to understand changes
- Suggesting appropriate type and scope
- Generating messages that explain WHY, not just WHAT
- Following Conventional Commits specification

## When to Use

- Writing commit messages
- Reviewing staged changes
- Splitting large commits into atomic ones
- Understanding Conventional Commits format

## Quick Start

Ask Claude to help with commits:

- "Help me write a commit message for these changes"
- "Review my staged changes and suggest a commit"
- "What type should I use for this change?"

## Files

```
git-commit-helper/
├── SKILL.md              # Main skill definition
├── SKILL-QUICK-REF.md    # Quick reference card
├── sections.yaml         # Section configuration
├── sections/
│   ├── conventional-commits.md  # Format reference
│   ├── commit-types.md          # Type descriptions
│   ├── best-practices.md        # Guidelines
│   └── workflow.md              # Step-by-step process
├── checklists/
│   └── quality.md        # Validation checklist
└── references/
    └── examples.md       # Real-world examples
```

## Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Tests
- `chore` - Maintenance

## Version

- **Version:** 1.0.0
- **Created:** 2025-12-12
- **Spec:** Conventional Commits 1.0.0
