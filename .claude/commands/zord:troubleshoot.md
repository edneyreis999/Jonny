---
name: zord:troubleshoot
description: Debug and fix bugs with iterative analysis, hypothesis validation, manual testing, and YAGNI validation
tools: Bash, Read, Edit, Write, Grep, Glob, AskUserQuestion, mcp__pal__debug, mcp__pal__thinkdeep, mcp__pal__consensus, mcp__serena__find_symbol, mcp__serena__get_symbols_overview
model: sonnet
---

# Zord Troubleshoot

## CRITICAL RULES

**ALWAYS STOP AND ASK USER BEFORE ANY ACTION!**

1. ✅ Step 1: Collect context
2. ✅ Step 2: Generate hypotheses
3. ✅ **STOP - Present hypotheses to user**
4. ✅ **WAIT - Ask user for next action**
5. ✅ Step 3: Consensus (optional, ask first)
6. ✅ Step 4: **ASK user to select mode**
7. ✅ Step 5: **ONLY THEN execute chosen mode**

**NEVER** auto-execute fix without user confirmation!

## Syntax

```bash
/zord:troubleshoot              # Start interactive
/zord:troubleshoot "<error_log>" # With initial error
```

## Workflow

### Step 1: Context Collection

```bash
git diff --name-only main...HEAD
```

Ask error log if not provided.

### Step 2: Generate Hypotheses

Use `mcp__pal__debug` → prioritize hypotheses.

**STOP HERE! Present hypotheses:**

```
🔍 Hypotheses:
1. <Hypothesis 1> - <Reasoning>
2. <Hypothesis 2> - <Reasoning>

📋 Modified files: <list>
```

### Step 3: Consensus Validation (ASK FIRST!)

**Ask via AskUserQuestion:**
```
header: "Validation"
question: "Validate hypotheses with consensus?"
options:
  - "Yes" - Run mcp__pal__consensus on hypotheses
  - "No" - Continue without validation
```

Execute based on user choice.

### Step 4: Action Mode (ASK USER!)

**Ask via AskUserQuestion:**
```
header: "Action Mode"
question: "What do you want to do?"
options:
  - "Instrument" - Add logs to validate hypotheses
  - "Fix" - Apply correction
  - "Done" - Report only, no changes
```

**WAIT FOR USER CHOICE!**

### Step 5: Execute Chosen Mode

#### INSTRUMENT (Only if user selected!)

1. Generate log patch based on top hypothesis
2. Show patch
3. **Ask**: "Apply this patch? (y/N)"
4. If yes: apply + "Test manually and share results"

#### FIX (Only if user selected!)

1. Generate fix patch via `mcp__pal__debug`
2. Show patch
3. **Ask**: "Apply this patch? (y/N)"
4. If yes:
   - Apply patch
   - Show manual test instructions
   - **Ask**: "Bug was fixed? (y/N)"
   - **If YES**: Go to Step 6 (YAGNI)
   - **If NO**: **Ask** "Share new error log" → **LOOP to Step 2**

#### DONE (Only if user selected!)

Report findings only. No changes.

### Step 6: YAGNI Analysis (Only if fix confirmed!)

Run `mcp__pal__thinkdeep` with:
```
Analyze for YAGNI violations:
1. Each line necessary?
2. Premature abstraction?
3. Can be simplified?

Bug: <error>
Fix: <patch>
```

Output:
- **Violation**: "Refactor now? (y/N)"
- **OK**: "✅ Fix validated"

## Manual Test Instructions Template

```
📋 TEST MANUAL:
1. Execute: <command>
2. Navigate: <path>
3. Action: <steps>
4. Verify: <expected>

Bug was fixed? (y/N)
```

## MCP Tools

| Tool | Purpose |
|------|---------|
| `mcp__pal__debug` | Hypotheses + fixes |
| `mcp__pal__thinkdeep` | YAGNI validation |
| `mcp__pal__consensus` | Hypothesis validation |
| Serena | Code reading |

## Token Budget

Max **1800 tokens** per session. Keep concise.

## Exit Conditions

- Done mode selected
- Instrument applied
- Fix validated with YAGNI
- User rejects patch
