# Page Header

## Description
A clear, distinct header block defining the main context, title, and primary actions for a view or page.

## When to Apply
Use this component when:
- Identifying the main objective of a screen
- Placing primary actions (Create, Edit, Delete) for a resource prominently

Do NOT use this component when:
- As a section header deep inside a document structure (use section-header instead)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `label` | `string` | - |

## Code Examples

### HTML Template
```html
<mds-page-header title="Manage Deliveries" [actions]="primaryActions"></mds-page-header>
```

### TypeScript Component
```typescript

```
