# Nav Tabs

## Description
Navigation tabs pattern for switching content views at the same hierarchical level.

## When to Apply
Use this component when:
- Switching between closely related views of data
- Paginating functional sections on a large screen view

Do NOT use this component when:
- Deep structural app navigation (use Breadcrumb or Menu instead)
- Sequenced form wizards (use Stepper)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `activeTab` | `any` | - |
| `additionalClass` | `any` | - |
| `align` | `any` | - |
| `hasLeftScrollHidden` | `any` | - |
| `hasRightScrollHidden` | `any` | - |
| `isSubmenu` | `any` | - |
| `marker` | `ElementRef` | - |
| `menuScroll` | `ElementRef` | - |
| `navTabsService` | `any` | - |
| `position` | `any` | - |
| `size` | `any` | - |

## Code Examples

### HTML Template
```html
<mds-nav-tabs [tabs]="tabs()" (tabChange)="activateTab($event)"></mds-nav-tabs>
```

### TypeScript Component
```typescript
tabs = signal([{id: 1, label: 'Details'}, {id: 2, label: 'Analytics'}]);
activateTab(tab: any) {}
```
