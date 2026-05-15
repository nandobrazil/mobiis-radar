# Microform

## Description
A small, inline enclosed form typically used for quick inline additions of simple relational items without leaving the current view context.

## When to Apply
Use this component when:
- Adding a quick tag to an item
- Apporting a single quick comment inline on a work item log

Do NOT use this component when:
- Lengthy multiple-step data collection (use full pages or dialogs)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `help` | `string` | Ajuda do campo |
| `label` | `string` | Label do campo |
| `value` | `string` | Value do campo autocomplete |

### Outputs
| Output | Evento | Descrição |
|--------|--------|-----------|
| `onClose` | `EventEmitter<any>` | - |

## Code Examples

### HTML Template
```html
<mds-microform (submitted)="onQuickSubmit($event)">
  <mds-input name="quickVal"></mds-input>
</mds-microform>
```

### TypeScript Component
```typescript

```
