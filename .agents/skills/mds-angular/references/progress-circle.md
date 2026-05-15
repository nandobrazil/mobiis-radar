# Progress Circle

## Description
An SVG circular indicator representing quantified progression through a measurable ongoing operational task.

## When to Apply
Use this component when:
- Displaying large file upload completion percentages
- Showcasing task completion profiles on user dashboards visually

Do NOT use this component when:
- When an operation is entirely indeterminate and lacks mathematically sound completion metrics (use indeterminate Loader)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `progress` | `number` | Valor do progresso |
| `size` | `number` | Tamanho do Progress em px |
| `variant` | `any` | Variante do Progress |

## Code Examples

### HTML Template
```html
<mds-progress-circle [value]="uploadProgress()"></mds-progress-circle>
```

### TypeScript Component
```typescript
uploadProgress = signal(45); // Extends up to 100
```
