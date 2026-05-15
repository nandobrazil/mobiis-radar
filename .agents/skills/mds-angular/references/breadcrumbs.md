# Breadcrumbs

## Description
A structural secondary navigation component that shows the user's location in the website or application's hierarchical structure.

## When to Apply
Use this component when:
- Displaying a hierarchical navigation path to the user
- Allowing users to navigate quickly back to higher-level pages

Do NOT use this component when:
- For primary navigation routing
- In single-page applications with flat structures

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `displayItems` | `any` | Itens processados para exibição (com lógica de colapso) |
| `items` | `any` | Itens do breadcrumb |
| `maxItems` | `any` | Quantidade máxima de itens visíveis antes de colapsar |
| `separator` | `any` | Ícone divisor entre os itens |
| `size` | `any` | Tamanho dos itens |

## Code Examples

### HTML Template
```html
<mds-breadcrumbs [items]="breadcrumbItems" (itemClick)="onBreadcrumbClick($event)"></mds-breadcrumbs>
```

### TypeScript Component
```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  standalone: true
})
export class ExampleComponent {
  breadcrumbItems = signal([
    { label: 'Home', routerLink: '/' },
    { label: 'Settings', routerLink: '/settings' },
    { label: 'Profile' }
  ]);

  onBreadcrumbClick(item: any) {
    console.log('Navigating to', item.label);
  }
}
```
