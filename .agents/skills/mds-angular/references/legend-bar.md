# Legend Bar

## Description
A descriptive color-coded key mapping element typically positioned adjacent to charts or calendars to decode visual colored statuses systematically.

## When to Apply
Use this component when:
- Displaying definitions for color-coded calendar dates (Holidays vs Active)
- Extrinsic legend definition for densely integrated map overlays

Do NOT use this component when:
- Stand-alone usage far decoupled from its visual target

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `id` | `string` | Identificador para gravar o estado da barra no localStorage |
| `isFixed` | `boolean` | Define se a barra será fixada no rodapé |
| `label` | `string` | Título da barra |
| `size` | `"sm" | "xs"` | Tamanho da barra |

## Code Examples

### HTML Template
```html
<mds-legend-bar [items]="legendItems()"></mds-legend-bar>
```

### TypeScript Component
```typescript
legendItems = signal([{color: 'red', label: 'Critical'}]);
```
