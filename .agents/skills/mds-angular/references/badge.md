# Badge

## Description
A small colored visual tag or bubble typically appended to items highlighting an implicit status, quantity, or classification.

## When to Apply
Use this component when:
- Indicating Unread notification counts (e.g. 5)
- Highlighting small status conditions ("New", "Urgent", "Pending")

Do NOT use this component when:
- Being used to hold interactive clickable logic (it is fundamentally an informational indicator)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `clickable` | `any` | Adiciona variação com clique |
| `fixed` | `any` | Fixa o badge |
| `icon` | `any` | Alias do icone |
| `label` | `any` | Label opcional para o badge |
| `rounded` | `any` | Badge arredondado |
| `size` | `any` | Tamanhos do badge |
| `solid` | `any` | Badge sólido |
| `value` | `any` | Conteúdo do badge |
| `variant` | `any` | Variantes de badge |

## Code Examples

### HTML Template
```html
<mds-badge color="success">Completed</mds-badge>
```

### TypeScript Component
```typescript

```
