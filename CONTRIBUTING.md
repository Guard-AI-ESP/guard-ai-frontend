# Contributing to Guard AI

## Branch Convention

### Permanent branches

| Branch | Role | Direct push |
|--------|------|-------------|
| `main` | Production — stable, deployed | No |
| `staging` | Integration — recette before prod | No |

### Working branches

All working branches must target `staging` via Pull Request.

```
feat/<scope>    ← new feature
fix/<scope>     ← bug fix
chore/<scope>   ← maintenance, deps, config
docs/<scope>    ← documentation
```

Examples:
```
feat/frontend/dashboard-integration
fix/frontend/websocket-reconnect
chore/frontend/upgrade-svelte
docs/frontend/component-usage
```

### Flow

```
feat/* ──PR──► staging ──PR──► main
fix/*  ──PR──► staging ──PR──► main
```

## Pull Request Rules

- Target `staging`, never `main` directly
- PR title must follow: `type(scope): short description`
- Squash merge preferred to keep history clean
- At least 1 review required before merge to `staging`
- At least 1 review required before merge to `main`

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(dashboard): integrate real-time WebSocket events
fix(events): fix empty state display
chore(deps): upgrade to SvelteKit 2.1
docs(setup): update env variable documentation
```
