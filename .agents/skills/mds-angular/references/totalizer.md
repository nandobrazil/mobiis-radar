# Totalizer

## Description
A structured widget highlighting primary scalar aggregation metrics distinctly (e.g., total sales, daily count) typically featuring an icon, title, and large value.

## When to Apply
Use this component when:
- KPI tracking metric blocks at the top of domain dashboards
- Summary metric block totals next to filtered reports

Do NOT use this component when:
- Displaying arrays, objects, or highly complex descriptions over simple number aggregates

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `additionalClass` | `any` | Classe adicional |
| `helper` | `any` | Texto de ajuda |
| `icon` | `any` | Icone |
| `iconColor` | `any` | - |
| `iconType` | `any` | Tipo do icone |
| `label` | `any` | Label do totalizer |
| `loading` | `any` | Exibe o loader |
| `mode` | `any` | Modo da disposição do totalizer |
| `size` | `any` | Tamanho do totalizer |
| `value` | `any` | Valor do totalizer |
| `variant` | `any` | Variant do totalizer |

## Code Examples

### HTML Template
```html
<mds-totalizer title="Total Deliveries" [value]="deliveryCount()" icon="truck"></mds-totalizer>
```

### TypeScript Component
```typescript
deliveryCount = signal(1250);
```
