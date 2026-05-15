# Chart

## Description
Wrapper component wrapping robust generic graphing libraries (e.g. ECharts) specifically stylized and constrained for the MDS standards.

## When to Apply
Use this component when:
- Generating dynamic complex charts (Pie, Line, Scatter) for analytics modules

Do NOT use this component when:
- Showing single simple literal scalar metric values linearly without graphing necessity

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `chartColors` | `any` | - |
| `chartData` | `any[]` | - |
| `chartFormat` | `MdsChartFormats` | - |
| `chartLabels` | `{}` | - |
| `chartLegend` | `boolean` | - |
| `chartLegendPosition` | `MdsChartLegendPositions` | - |
| `chartOptions` | `EChartsOption` | - |
| `chartSingleData` | `number[]` | - |
| `chartType` | `MdsChartTypes` | - |
| `chartValueAfter` | `string` | - |
| `chartValueBefore` | `string` | - |
| `customPieColors` | `boolean` | - |
| `customTooltipFormat` | `any` | - |
| `lineTension` | `number | null` | - |
| `minimumFractionDigits` | `number` | - |
| `performanceMode` | `boolean` | - |
| `showInlineValue` | `boolean` | - |

### Outputs
| Output | Evento | Descrição |
|--------|--------|-----------|
| `chartClick` | `EventEmitter` | - |
| `chartHover` | `EventEmitter` | - |

## Code Examples

### HTML Template
```html
<mds-chart [type]="'bar'" [data]="yearlyData()"></mds-chart>
```

### TypeScript Component
```typescript
yearlyData = signal({ labels: ['Jan','Feb'], datasets: [...] });
```
