# Commit Workflow

## 🔴 CRITICAL: Verify Author Configuration

**ALWAYS check author configuration FIRST:**

```bash
# Verify git user is configured
git config user.name
git config user.email
```

**NEVER add Claude as co-author. Commits must have ONLY the human author.**

---

## Step 1: Review Changes

```bash
# View staged changes only
git diff --staged

# Get statistics
git diff --staged --stat
```

## Step 2: Stage Selectively

```bash
# Stage specific files
git add path/to/file.ts

# Stage interactively (recommended)
git add -p

# Stage all changes (use with caution)
git add -A
```

### Interactive Staging (`git add -p`)

Options at each hunk:

- `y` - stage this hunk
- `n` - don't stage this hunk
- `s` - split into smaller hunks
- `e` - manually edit the hunk
- `q` - quit; don't stage remaining

## Step 3: Analyze for Commit Message

Questions to answer:

1. **What type of change?** feat, fix, refactor, etc.
2. **What part of codebase?** Determine scope
3. **What problem does it solve?** The WHY
4. **Any breaking changes?** API changes, removed features

## Step 4: Write the Message

```bash
# Short message only
git commit -m "type(scope): description"

# With body (opens editor)
git commit

# With body inline
git commit -m "type(scope): description" -m "Body text here"
```

## Step 5: Verify

```bash
# View commit just made
git show HEAD

# View commit message
git log -1

# Amend if needed (before push)
git commit --amend
```

## Handling Large Changes

### Option A: Split into Multiple Commits

```bash
# Stage first logical change
git add -p
git commit -m "refactor(auth): extract validation"

# Stage second logical change
git add -p
git commit -m "feat(auth): add OAuth support"
```

### Option B: Document All Changes in Body

```bash
git commit -m "refactor(auth): restructure authentication module" -m "
- Extract validation logic to service
- Add OAuth2 provider support
- Update token handling
- Add comprehensive tests
"
```

## Amending Commits

### Fix Last Commit Message

```bash
git commit --amend
```

### Add Forgotten Files

```bash
git add forgotten-file.ts
git commit --amend --no-edit
```

### Warning

- Only amend commits not yet pushed
- After push, create new commit instead

## Commit Message Template

Set up a template:

```bash
# Create template file
cat > ~/.gitmessage << 'EOF'
# type(scope): description (max 50 chars)

# Body: explain WHY, not WHAT (wrap at 72 chars)

# Footer: issue refs, breaking changes
# Fixes #
# BREAKING CHANGE:
EOF

# Configure git to use it
git config --global commit.template ~/.gitmessage
```
