# Loader

## Description
A visual animated spinner indicating background network fetching or computational processing is actively blocking or preparing interface rendering.

## When to Apply
Use this component when:
- Awaiting HTTP request resolution inside forms or grids
- Suspense fallback boundary replacements

Do NOT use this component when:
- When processing completes instantly under 100ms causing visual flash clutter (debounce properly)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `size` | `any` | Tamanho em px do loader |
| `stroke` | `any` | Grossura da linha/borda do loader |
| `type` | `any` | Tipo de animação |

## Code Examples

### HTML Template
```html
<mds-loader *if="isLoading()"></mds-loader>
```

### TypeScript Component
```typescript
isLoading = signal(true);
```
