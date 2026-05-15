# Utilities

## Description
A conceptual collection covering purely structural wrapper directives, structural behavioral directives, or standalone service definitions facilitating MDS needs safely.

## When to Apply
Use this component when:
- Handling outside-clicks gracefully
- Injecting standardized pure CSS manipulation structures dynamically via decorators

Do NOT use this component when:
- Using component abstractions where a direct simple CSS rule applies effectively in modern browsers directly

## Code Examples

### HTML Template
```html
<!-- Uses directive examples (e.g. click outside) -->
<div (mdsClickOutside)="closeDropdown()">...</div>
```

### TypeScript Component
```typescript
// Or utility functions imported from mds-components
```
