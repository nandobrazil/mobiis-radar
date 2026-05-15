# Float Panel (Drawer/Aside)

## Description
An off-canvas side panel that slides in over the primary content, often used to display details without losing context of a parent list.

## When to Apply
Use this component when:
- Editing row details rapidly from a large grid without navigating away
- Opening complex detail metrics overlay on demand

Do NOT use this component when:
- Complete page transitions masquerading as panels

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `bodyAdditionalClass` | `any` | Classe adicional para o body |
| `bodyPadding` | `any` | Exibe o padding padrão no body |
| `bodyScrollDisabled` | `any` | Desativa o scroll no body |
| `bordered` | `any` | Modo do float panel com bordas internas e cor de fundo no body |
| `closeOnEsc` | `any` | Permite fechar o painel no ESC |
| `drawerPosition` | `any` | Posição do drawer |
| `elementId` | `any` | - |
| `forceFullscreen` | `any` | Força ficar em tela cheia |
| `fullscreen` | `any` | Painel em tela cheia |
| `fullscreenIcon` | `any` | - |
| `fullscreenLabel` | `any` | - |
| `fullscreenTogglable` | `any` | Permite alternar para tela-cheia |
| `label` | `any` | Titulo da modal |
| `loading` | `any` | Exibe loading do painel |
| `onClose` | `any` | Eventos |
| `onEscape` | `any` | - |
| `onOpen` | `any` | - |
| `panelOpened` | `any` | Abre o painel |
| `position` | `any` | - |
| `preventClose` | `any` | Exibe alerta para prevenir o fechamento da modal |
| `preventCloseText` | `any` | Texto exibido no alerta para prevenir o fechamento da modal |
| `showFooter` | `any` | Exibe o footer do painel |
| `showHeader` | `any` | Exibe o header do painel |
| `size` | `any` | Tamanho do painel |
| `type` | `any` | Tipo do painel |

## Code Examples

### HTML Template
```html
<mds-float-panel [isOpen]="isPanelOpen()" (closed)="isPanelOpen.set(false)">
  <div header>Detalhamento de Rota</div>
  <div content>Content loaded dynamically</div>
</mds-float-panel>
```

### TypeScript Component
```typescript
isPanelOpen = signal(false);
```
