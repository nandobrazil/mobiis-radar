# Menu

## Description
A flexible primary or contextual menu component for navigation.

## When to Apply
Use this component when:
- Primary application navigation (e.g. sidebar)
- Displaying a vertical list of navigation links

Do NOT use this component when:
- Inline navigation (use tabs instead)
- Action-oriented button arrays

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `#breakpointObserver` | `any` | - |
| `#cd` | `any` | - |
| `#elementRef` | `any` | - |
| `#justOpened` | `any` | - |
| `fixed` | `any` | Menu fixo na lateral |
| `floatingOpened` | `any` | Define se o menu flutuante está visível (drawer aberto) |
| `forceFloating` | `any` | Força o comportamento de menu flutuante |
| `img` | `any` | logo para o menu flutuante |
| `isFloatingMode` | `any` | Sinal que define se o menu deve assumir o comportamento de floating |
| `isMobileBreakpoint` | `any` | Sinal que identifica se o breakpoint atual é mobile |
| `isWide` | `any` | Define se o menu deve se comportar visualmente como aberto (sempre true em modo flutuante) |
| `menuOpened` | `any` | - |
| `menuScroll` | `ElementRef` | - |
| `secundaryMenu` | `any` | Modificação visual para menu secundário |
| `toggleEmitter` | `any` | - |
| `version` | `any` | Versão do sistema |

## Code Examples

### HTML Template
```html
<mds-menu>
  <mds-menu-item routerLink="/dashboard" label="Dashboard" icon="home"></mds-menu-item>
  <mds-menu-item routerLink="/settings" label="Settings" icon="settings"></mds-menu-item>
</mds-menu>
```

### TypeScript Component
```typescript
// Uses standard Angular Router configuration
```
