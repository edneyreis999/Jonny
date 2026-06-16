# Commit Types Reference

## Primary Types

### feat

New feature for the user (not a build script feature).

```
feat(auth): add OAuth2 login with Google
feat(cart): implement quantity adjustment
feat(api): add pagination to users endpoint
```

### fix

Bug fix for the user (not a build script fix).

```
fix(form): prevent double submission
fix(api): handle null values in response
fix(auth): correct token expiration check
```

### docs

Documentation changes only.

```
docs(readme): add installation instructions
docs(api): update endpoint descriptions
docs(contributing): add code style guidelines
```

### style

Changes that don't affect code meaning (formatting, whitespace, semicolons).

```
style(lint): fix ESLint warnings
style(format): apply Prettier formatting
style(imports): sort import statements
```

### refactor

Code change that neither fixes a bug nor adds a feature.

```
refactor(auth): extract validation logic to service
refactor(database): simplify query builder
refactor(components): convert class to functional component
```

### test

Adding or correcting tests.

```
test(auth): add unit tests for login service
test(api): add integration tests for users
test(e2e): add checkout flow tests
```

### chore

Maintenance tasks, build process, dependencies.

```
chore(deps): update lodash to 4.17.21
chore(ci): add GitHub Actions workflow
chore(release): bump version to 2.0.0
```

## Extended Types (optional)

### perf

Performance improvements.

```
perf(query): optimize user search with index
perf(bundle): reduce initial load size
```

### build

Changes to build system or dependencies.

```
build(webpack): upgrade to v5
build(docker): add multi-stage build
```

### ci

CI/CD configuration changes.

```
ci(github): add automated testing
ci(deploy): configure staging environment
```

### revert

Reverts a previous commit.

```
revert: feat(auth): add OAuth login

This reverts commit abc123.
```

## Type Selection Guide

| Change Type                             | Use Type    |
| --------------------------------------- | ----------- |
| New user-facing feature                 | feat        |
| Bug fix                                 | fix         |
| Performance improvement                 | perf        |
| Code restructuring (no behavior change) | refactor    |
| Adding/fixing tests                     | test        |
| Documentation only                      | docs        |
| Formatting/style                        | style       |
| Build scripts/deps                      | build/chore |
| CI/CD changes                           | ci          |
