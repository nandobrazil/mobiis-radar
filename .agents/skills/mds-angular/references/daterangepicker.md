# Date Range Picker

## Description
An input allowing users to select a starting boundary and ending boundary across a calendar.

## When to Apply
Use this component when:
- Filtering large lists of records bounding "From" and "To" dates
- Requesting date-span reports or exports

Do NOT use this component when:
- Selecting single specific standalone dates

## Code Examples

### HTML Template
```html
<mds-daterangepicker [formControl]="dateRangeControl"></mds-daterangepicker>
```

### TypeScript Component
```typescript
dateRangeControl = new FormControl({ start: new Date(), end: new Date() });
```
