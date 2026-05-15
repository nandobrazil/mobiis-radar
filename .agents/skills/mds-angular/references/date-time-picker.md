# Date Time Picker

## Description
A combined input component resolving both a specific calendar date and an exact time of day.

## When to Apply
Use this component when:
- Scheduling exact delivery windows
- Logging precise timestamps for manual incidents

Do NOT use this component when:
- When the time of day is completely irrelevant to the underlying domain requirement

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `disabled` | `boolean` | desativa o campo |
| `fromUtcValue` | `boolean` | Data em UTC |
| `futureRanges` | `boolean` | Exibe ranges futuros |
| `help` | `string` | Texto de ajuda |
| `highlightDates` | `Date[]` | - |
| `label` | `string` | Label do campo |
| `maxDate` | `Date` | Data máxima - moment |
| `minDate` | `Date` | Data mínima - moment |
| `mode` | `MdsDateTimePickerModes` | Modo do seletor |
| `msgErrorRequired` | `string` | Mensagem de validação de campo obrigatório |
| `placeholder` | `string` | Placeholder do campo |
| `placement` | `MdsPlacement` | Posição do calendário para cima ou para baixo do campo |
| `readonly` | `boolean` | Somente leitura |
| `replaceInvalidDate` | `boolean` | - |
| `required` | `boolean` | Campo obrigatório |
| `showRanges` | `boolean` | Mostra o seletor de ranges fixos |
| `size` | `MdsSizes` | tamanho do campo |
| `timePicker` | `boolean` | Habilita o time picker |
| `timeRequired` | `boolean` | Horário obrigatório |
| `variant` | `MdsDateTimePickerVariants` | Variante do campo |

### Outputs
| Output | Evento | Descrição |
|--------|--------|-----------|
| `dateViewChanged` | `EventEmitter` | - |
| `onBlur` | `EventEmitter` | - |
| `onChange` | `EventEmitter` | - |
| `onFocus` | `EventEmitter` | - |

## Code Examples

### HTML Template
```html
<mds-date-time-picker [formControl]="scheduledTimeControl"></mds-date-time-picker>
```

### TypeScript Component
```typescript
scheduledTimeControl = new FormControl(new Date());
```
