# Date Picker Navigation

## Description
Inner navigational header used exclusively within custom Date Picker designs to change active months/years.

## When to Apply
Use this component when:
- Custom complex calendar popups that need specialized month/year navigation

Do NOT use this component when:
- Direct usage as a primary application control element

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `endDate` | `Date` | - |
| `highlightDates` | `Date[]` | Listagem de datas para serem destacadas no calendário |
| `ranges` | `literal type` | Lista dos ranges |
| `singleDatePicker` | `boolean` | Habilita seleção de data unica |
| `startDate` | `Date` | - |

### Outputs
| Output | Evento | Descrição |
|--------|--------|-----------|
| `dateViewChanged` | `EventEmitter` | - |
| `onChangeDate` | `EventEmitter` | Emitido ao alterar a data |

## Code Examples

### HTML Template
```html
<mds-date-picker-navigation [currentMonth]="month" (next)="goNext()" (prev)="goPrev()"></mds-date-picker-navigation>
```

### TypeScript Component
```typescript

```
