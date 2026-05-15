# Top Bar

## Description
The primary horizontal bar at the top of an application layout, typically housing brand logo, global search, and user profile links.

## When to Apply
Use this component when:
- Global application navigation framework
- Housing global contextual items like notifications or user profile

Do NOT use this component when:
- Page-specific contextual headers (use page-header instead)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `#breakpointObserver` | `any` | - |
| `fixed` | `any` | Fixar o header no topo |
| `forceMobile` | `any` | Força o comportamento de mobile |
| `img` | `any` | Imagem / Logo |
| `isMobile` | `any` | Sinal que identifica se o breakpoint atual é mobile |
| `isMobileMode` | `any` | Sinal que define se o modo mobile está ativo (por breakpoint ou override) |
| `label` | `any` | Nome do módulo |
| `menuCompacted` | `any` | Controla o icone para o menu estático |
| `showMenuToggle` | `any` | Exibe o botão de toggle do menu |

### Outputs
| Output | Evento | Descrição |
|--------|--------|-----------|
| `onToggleMenu` | `EventEmitter` | - |

## Code Examples

### HTML Template
```html
<mds-topbar>
  <div brand>MyApp</div>
  <div actions><mds-menu-user></mds-menu-user></div>
</mds-topbar>
```

### TypeScript Component
```typescript

```
