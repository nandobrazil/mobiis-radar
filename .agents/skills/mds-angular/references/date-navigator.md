# Date Navigator

## Description
An inline widget for iterating through adjacent days, weeks, or months incrementally without opening a full generic calendar.

## When to Apply
Use this component when:
- Daily or Weekly schedule views
- Navigating sequential resource availability pages linearly

Do NOT use this component when:
- Choosing a distant, disconnected birthdate inside a signup form (use DatePicker instead)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `avaiableDatesArray` | `any` | Array com as datas e disponibilidades  formato: [{mDate: Date, avaiable: boolean}] |
| `changeToWeekOnSelect` | `any` | Quando selecionado o dia, muda para a visão de semana |
| `currentDate` | `any` | - |
| `formControl` | `any` | FormControl que manipula a data selecionada no formato YYYY-MM-DDT03:00:00.000Z |
| `loading` | `any` | Habilita modo de loading enquanto estiver carregando as datas |
| `navigatorContent` | `any` | - |
| `onMonthChange` | `any` | Evento emitido quando é alterado o range do mês |
| `onSelect` | `any` | Evento emitido ao selecionar um dia |
| `selectedDate` | `any` | - |
| `view` | `any` | Visualização da navegação |
| `weeks` | `any` | - |

## Code Examples

### HTML Template
```html
<mds-date-navigator [(currentDate)]="selectedDate" (dateChange)="loadDataForDate($event)"></mds-date-navigator>
```

### TypeScript Component
```typescript
selectedDate = new Date();
```
