---
name: typescript-expert
description: Expert guidance for writing TypeScript code following modern best practices, targeting TypeScript 5.x and ES2022. Use this skill when writing, reviewing, or refactoring TypeScript code in any .ts or .tsx file. Provides comprehensive guidelines on type system usage, architecture patterns, security, testing, and performance.
---

# TypeScript Expert

## Overview

This skill provides expert-level guidance for TypeScript development targeting TypeScript 5.x and ES2022. Apply these guidelines when writing new TypeScript code, reviewing existing code, or refactoring to ensure maintainability, type safety, security, and performance.

## When to Use This Skill

Activate this skill when:

- Writing new TypeScript code (`.ts`, `.tsx` files)
- Reviewing or refactoring existing TypeScript implementations
- Making architectural decisions for TypeScript projects
- Implementing security-sensitive features
- Setting up testing infrastructure
- Optimizing TypeScript code performance
- Establishing coding standards for a team

## Core Principles

Before writing any TypeScript code, internalize these foundational principles:

1. **Respect existing architecture** - Study the codebase patterns before introducing new abstractions
2. **Prioritize readability** - Favor explicit, clear solutions over clever shortcuts
3. **Maintain type safety** - Avoid `any`; use TypeScript's type system to catch errors at compile time
4. **Keep it simple** - Short methods, focused classes, single-purpose modules
5. **Security first** - Validate inputs, sanitize outputs, handle secrets properly

## Development Workflow

### 1. Before Writing Code

Before implementing any TypeScript feature:

1. **Explore the codebase structure**
   - Identify existing patterns for similar functionality
   - Locate shared utilities and types that can be reused
   - Understand the project's dependency injection or composition pattern

2. **Check type definitions**
   - Search for existing interfaces and types that match your needs
   - Centralize shared contracts instead of duplicating shapes
   - Use the project's type organization conventions

3. **Review security requirements**
   - Identify external inputs that need validation
   - Determine what secrets or sensitive data will be handled
   - Plan error handling and logging strategy

### 2. While Writing Code

Apply these guidelines during implementation:

**Type System Best Practices:**

- Avoid `any` (implicit or explicit); prefer `unknown` with type narrowing
- Use discriminated unions for state machines and event handlers
- Express intent with utility types (`Readonly`, `Partial`, `Record`, `Pick`, `Omit`)
- Centralize shared type definitions

**Code Organization:**

- Use kebab-case for filenames (`user-service.ts`, `data-mapper.ts`)
- PascalCase for types/classes/interfaces, camelCase for functions/variables
- Keep tests and types near their implementations
- Extract helpers when functions grow beyond 20-30 lines

**Async & Error Handling:**

- Use `async/await` with try/catch blocks
- Guard edge cases early to avoid deep nesting
- Propagate structured errors through logging utilities
- Handle user-facing errors through the project's notification pattern

**Security Practices:**

- Validate external input with schema validators or type guards
- Never hardcode secrets; use secure storage
- Sanitize untrusted content before rendering
- Use parameterized queries to prevent injection

### 3. After Writing Code

Before considering the task complete:

1. **Run quality checks**

   ```bash
   npm run lint          # Fix style issues
   npm run type-check    # Verify type safety
   npm run test          # Run tests
   ```

2. **Add or update tests**
   - Unit tests for business logic
   - Integration tests for cross-module behavior
   - E2E tests for user-facing features

3. **Document public APIs**
   - Add JSDoc comments to public functions/classes
   - Include `@param`, `@returns`, `@throws` annotations
   - Add `@example` for non-obvious usage

4. **Review performance implications**
   - Lazy-load heavy dependencies
   - Consider debouncing high-frequency events
   - Track resource lifetimes to prevent memory leaks

## Quick Reference Checklist

Use this checklist for code reviews or self-review:

- [ ] No usage of `any` type (use `unknown` + type guards instead)
- [ ] All external inputs validated with type guards or schema validators
- [ ] Secrets loaded from secure sources, never hardcoded
- [ ] Error handling with try/catch and structured error propagation
- [ ] Public APIs documented with JSDoc
- [ ] Tests added/updated for new functionality
- [ ] Lint and type-check pass without errors
- [ ] Follows project's naming conventions (kebab-case files, PascalCase types)
- [ ] Code reuses existing utilities before creating new ones
- [ ] Functions are focused and single-purpose (<30 lines)

## Detailed Guidelines

For comprehensive coverage of all TypeScript development aspects, consult the detailed guidelines document:

**Read:** `references/typescript-guidelines.md`

This reference covers:

- Project organization strategies
- Type system advanced patterns
- Architecture and design patterns
- External integration best practices
- Comprehensive security practices
- Configuration and secrets management
- UI/UX component patterns
- Testing strategies
- Performance optimization techniques
- Documentation standards

Load this reference when encountering complex scenarios or when establishing team standards.

## Common Scenarios

### Scenario 1: Adding a New Feature

1. Search for similar existing features to maintain consistency
2. Identify shared types and utilities to reuse
3. Create focused, single-purpose modules
4. Write tests alongside implementation
5. Document public APIs with JSDoc
6. Run lint/type-check before committing

### Scenario 2: Refactoring Legacy Code

1. Add tests for existing behavior first (if missing)
2. Read detailed guidelines in `references/typescript-guidelines.md`
3. Replace `any` types with proper types or `unknown` + guards
4. Extract reusable utilities from duplicated code
5. Improve error handling with structured errors
6. Verify tests still pass after refactoring

### Scenario 3: Security-Sensitive Implementation

1. Review "Security Practices" in `references/typescript-guidelines.md`
2. Implement input validation with schema validators
3. Use type guards for runtime type safety
4. Handle secrets through secure storage APIs
5. Add comprehensive tests including security edge cases
6. Document security considerations in code comments

### Scenario 4: Performance Optimization

1. Review "Performance & Reliability" in `references/typescript-guidelines.md`
2. Profile to identify actual bottlenecks (don't optimize prematurely)
3. Implement lazy loading for heavy dependencies
4. Add debouncing/throttling for high-frequency events
5. Track and dispose resources properly
6. Measure improvements with benchmarks

## Resources

This skill includes one reference file:

### references/typescript-guidelines.md

Comprehensive TypeScript development guidelines covering all aspects in detail. Load this reference when:

- Establishing team coding standards
- Encountering complex architectural decisions
- Implementing security-critical features
- Setting up testing infrastructure
- Optimizing performance
- Resolving type system challenges

The reference provides in-depth guidance on topics that may only be briefly mentioned in this SKILL.md.
