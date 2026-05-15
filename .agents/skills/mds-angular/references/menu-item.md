# Menu Item

## Description
An individual entry inside an MDS Menu component.

## When to Apply
Use this component when:
- Adding a single clickable link or action to a generic menu container

Do NOT use this component when:
- Used standalone outside of a menu context

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `#dropdown` | `any` | - |
| `#submenuLevelDirective` | `any` | - |
| `active` | `any` | item ativo |
| `backButton` | `any` | Ajuste para item de voltar na lista do submenu |
| `description` | `any` | Description do item |
| `disabled` | `any` | Desabilita o item |
| `elementRef` | `any` | - |
| `icon` | `any` | Icone do item |
| `iconAdditionalClass` | `any` | Classe adicional para o icone |
| `itemClick` | `any` | Output when the item is clicked |
| `label` | `any` | Label do item |
| `loading` | `any` | tamanho do item |
| `notify` | `any` | Exibe marcador de notificação |
| `openSubmenu` | `any` | Output to open submenu |
| `rotateIcon` | `any` | Rotaciona o icone do item |
| `size` | `any` | tamanho do item |
| `submenuHover` | `any` | - |
| `submenuMouseLeave` | `any` | - |
| `submenuTemplate` | `any` | Ajuste para item com submenu |

## Code Examples

### HTML Template
```html
<mds-menu-item [label]="'Home'" [icon]="'home'" (click)="navigate()"></mds-menu-item>
```

### TypeScript Component
```typescript

```
