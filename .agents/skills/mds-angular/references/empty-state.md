# Empty State

## Description
A friendly placeholder visual indicator shown when a list, search result, or dashboard has zero items to display.

## When to Apply
Use this component when:
- Zero search results feedback
- The user has no deliveries or alerts initialized yet to show

Do NOT use this component when:
- Used inappropriately as error messages for HTTP 500 crashes (use proper Error overlays instead)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `icon` | `any` | Icone do Empty State |
| `iconType` | `any` | Tipo do icone |
| `text` | `any` | Texto auxiliar |
| `title` | `any` | Titulo principal do empty state |

## Code Examples

### HTML Template
```html
<mds-empty-state icon="box-open" title="No deliveries found" description="Try adjusting your current filters."></mds-empty-state>
```

### TypeScript Component
```typescript

```
