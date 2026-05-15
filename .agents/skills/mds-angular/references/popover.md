# Popover

## Description
A pop-up overlay offering rich interactive content positioned dynamically adjacent to its origin triggering element.

## When to Apply
Use this component when:
- Providing small contextual configurator forms (filters) overlapping complex tables
- Offering rich detailed definitions on terms clicked

Do NOT use this component when:
- Replacement for full Modals when capturing large amounts of data requiring focus dominance

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `content` | `any` | - |
| `disabled` | `any` | - |
| `placement` | `any` | - |
| `popoverClass` | `any` | - |
| `trigger` | `any` | - |

## Code Examples

### HTML Template
```html
<mds-button [mdsPopoverTarget]="filterPopover">Filters</mds-button>
<mds-popover #filterPopover>
  <div p-3>Complex filter form here...</div>
</mds-popover>
```

### TypeScript Component
```typescript

```
