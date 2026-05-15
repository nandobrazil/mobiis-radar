# Toolbar

## Description
A horizontal containment row optimally aligning multiple primary buttons, toggle groups, or micro filter options together.

## When to Apply
Use this component when:
- Sitting immediately above tables/grids to provide bulk actions
- WYSIWYG editor text formatting commands

Do NOT use this component when:
- As primary application site navigation menus

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `description` | `any` | Descrição da toolbar |
| `label` | `any` | Titulo da toolbar |
| `loading` | `any` | Exibe loader no botão de fechar |
| `onClose` | `any` | Evento emitido ao fechar a toolbar |
| `show` | `any` | Controla a visibilidade do toolbar |

## Code Examples

### HTML Template
```html
<mds-toolbar>
  <mds-button icon="add" variant="primary">New</mds-button>
  <mds-button icon="filter">Filter</mds-button>
</mds-toolbar>
```

### TypeScript Component
```typescript

```
