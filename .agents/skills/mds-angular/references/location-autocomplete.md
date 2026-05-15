# Location Autocomplete

## Description
A highly specialized input connected generally to geographic validation systems (e.g. Google Places/Maps API) to guarantee valid address selections.

## When to Apply
Use this component when:
- Entering origin, destination, or delivery addresses in logistics forms
- City/State fuzzy searching

Do NOT use this component when:
- Searching non-geographic business internal records or simple generic comboboxes

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `autocomplete` | `any` | - |
| `changeOutput` | `any` | - |
| `formGroup` | `any` | - |
| `geocoderService` | `any` | - |
| `inputEndereco` | `any` | - |
| `inputPlaceholder` | `any` | - |
| `keyupOutput` | `any` | - |
| `label` | `any` | - |
| `localInput` | `any` | - |
| `minLength` | `any` | - |
| `place` | `any` | - |
| `placeholder` | `any` | - |
| `placeHolder_deprecated` | `any` | - |
| `placeIdInput` | `any` | - |
| `required` | `any` | - |
| `size` | `any` | - |
| `subscriptions` | `Subscription[]` | - |

## Code Examples

### HTML Template
```html
<mds-location-autocomplete [formControl]="addressControl" (locationSelected)="onAddressFix($event)"></mds-location-autocomplete>
```

### TypeScript Component
```typescript
addressControl = new FormControl('');
```
