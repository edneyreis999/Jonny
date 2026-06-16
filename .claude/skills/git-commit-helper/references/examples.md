# Real-World Commit Message Examples

## Feature Commits

### Simple Feature

```
feat(auth): add password reset via email

Implement password reset flow:
- Generate secure reset token (24h expiry)
- Send reset email with tokenized link
- Validate token and allow password change

Closes #234
```

### Feature with Breaking Change

```
feat(api)!: restructure API response format

BREAKING CHANGE: All API responses now use JSON:API specification

Previous format:
{ "data": {...}, "status": "ok" }

New format:
{
  "data": { "type": "user", "id": "1", "attributes": {...} },
  "meta": { "timestamp": "..." }
}

Migration: Update all API clients to handle new response structure.
See docs/api-migration.md for detailed guide.

Closes #456
```

### Multi-Component Feature

```
feat(checkout): implement multi-currency support

Add ability to process payments in different currencies:
- Add currency selector to checkout page
- Integrate with exchange rate API
- Update order model with currency field
- Add currency conversion in invoice generation

Supports: USD, EUR, GBP, BRL
Default currency determined by user locale.

Closes #789
```

## Bug Fix Commits

### Simple Fix

```
fix(form): prevent double submission on slow networks

Add loading state to submit button, disabling it after
first click until request completes or fails.
```

### Fix with Root Cause

```
fix(api): resolve connection pool exhaustion

Connection pool was not releasing connections on request timeout,
causing pool exhaustion under high load (~1000 req/min).

Root cause: Missing finally block in database service.
Solution: Ensure connection.release() in finally block.

Fixes #567
```

### Security Fix

```
fix(auth): prevent timing attack on password comparison

Replace string comparison with constant-time comparison
to prevent timing-based password guessing attacks.

Security advisory: CVE-2024-1234
```

## Refactor Commits

### Code Organization

```
refactor(auth): extract token validation to middleware

Move JWT validation logic from individual controllers
to centralized middleware. Reduces duplication across
12 protected endpoints.

No functional changes.
```

### Performance Refactor

```
refactor(search): optimize query with database index

Add composite index on (status, created_at) columns.
Query time reduced from ~800ms to ~50ms for filtered searches.

Migration: 20240115_add_search_index.sql
```

### Architecture Refactor

```
refactor(core): migrate to hexagonal architecture

Restructure application following ports and adapters pattern:
- Extract domain logic from controllers
- Create port interfaces for external services
- Implement adapters for database, email, payment

Benefits:
- Improved testability (mock adapters)
- Clearer dependency direction
- Easier service replacement

This is a large refactor split across multiple PRs.
See ADR-015 for architectural decision details.
```

## Documentation Commits

```
docs(api): add OpenAPI specification

Generate OpenAPI 3.0 spec from code annotations.
Available at /api/docs in development mode.

Includes:
- All public endpoints
- Request/response schemas
- Authentication requirements
- Error response formats
```

## Test Commits

```
test(auth): add E2E tests for OAuth flow

Cover complete OAuth authentication flow:
- Redirect to provider
- Handle callback with code
- Exchange code for token
- Create/update user session

Uses Playwright for browser automation.
Mocks OAuth provider responses.
```

## Chore Commits

### Dependency Update

```
chore(deps): upgrade React to 18.2

Major version upgrade with new features:
- Automatic batching
- Transitions API
- Suspense improvements

Breaking changes handled:
- Updated ReactDOM.render to createRoot
- Replaced deprecated lifecycle methods

Tested: All existing tests pass
```

### CI/CD

```
ci(github): add automated security scanning

Configure Dependabot and CodeQL:
- Daily dependency vulnerability checks
- Weekly code scanning
- Auto-create PRs for security updates

Security alerts sent to #security Slack channel.
```

## Revert Commits

```
revert: feat(checkout): add Apple Pay integration

This reverts commit a1b2c3d4.

Reason: Apple Pay sandbox causing production checkout failures.
Will re-implement after investigating sandbox/prod configuration.

Tracking: #890
```
