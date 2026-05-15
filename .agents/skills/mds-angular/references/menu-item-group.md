# Menu Item Group

## Description
A structural wrapper to group multiple menu items together visually, often with a group header.

## When to Apply
Use this component when:
- Grouping logically related configuration or navigation links

Do NOT use this component when:
- Isolated single links lacking logical grouping

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `#router` | `any` | - |
| `active` | `any` | Item ativo |
| `description` | `any` | Texto secundário do item |
| `icon` | `any` | icone do item |
| `isActiveGroup` | `any` | - |
| `isOpen` | `any` | - |
| `label` | `any` | Texto do item |
| `links` | `any` | - |
| `loading` | `any` | Exibe loader |
| `menuItems` | `any` | - |
| `navEnd` | `any` | - |
| `notify` | `any` | Exibe badge de notificação |
| `onClick` | `any` | - |
| `size` | `any` | tamanho do item |
| `type` | `any` | Texto secundário do item |

## Code Examples

### HTML Template
```html
<mds-menu-item-group header="Administration">
  <!-- <mds-menu-item> ... -->
</mds-menu-item-group>
```

### TypeScript Component
```typescript

```
