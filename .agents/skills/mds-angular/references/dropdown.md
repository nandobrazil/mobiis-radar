# Dropdown

## Description
A floating list of actions triggered by clicking an origin target button/icon, maintaining multiple low-priority choices tidily.

## When to Apply
Use this component when:
- Providing "More Options" actions (Edit, Clone, Delete) in table rows
- Grouping secondary actions in toolbars

Do NOT use this component when:
- When a standard Select input is meant for Form capture (Dropdown primarily focuses on triggering non-capture Actions)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `#appRef` | `any` | - |
| `#cleanupFloatingUi` | ` | undefined` | - |
| `#document` | `any` | - |
| `#dropdownEl` | `HTMLElement | undefined` | - |
| `#hoverTimer` | `any` | - |
| `#injector` | `any` | - |
| `#isAnimatingOut` | `any` | - |
| `#portalOutlet` | `DomPortalOutlet | undefined` | - |
| `#submenuPortals` | `literal type[]` | - |
| `#viewContainerRef` | `any` | - |
| `activeSubmenus` | `any` | - |
| `additionalClass` | `any` | Classes CSS adicionais para o botão do dropdown. |
| `ariaLabel` | `any` | O aria-label para o botão do dropdown. |
| `arrowRef` | `any` | - |
| `autoClose` | `any` | Define o comportamento de fechamento automático do dropdown. |
| `buttonStyle` | `any` | Estilos CSS para o botão do dropdown. |
| `caret` | `any` | Se o dropdown deve exibir o ícone de seta. |
| `contentItems` | `QueryList<MenuItemComponent>` | - |
| `contextBase` | `any` | O elemento base para o contexto do dropdown. |
| `customTemplate` | `any` | Template customizado para o botão do dropdown. |
| `disabled` | `any` | Se o dropdown está desabilitado. |
| `display` | `any` | O modo de exibição do dropdown. |
| `dropdownContent` | `any` | O conteúdo a ser exibido no menu do dropdown. |
| `dropdownTemplate` | `any` | - |
| `elementRef` | `any` | A referência do elemento a ser usado como gatilho do dropdown. |
| `icon` | `any` | O ícone a ser exibido no dropdown. |
| `isOpen` | `any` | - |
| `isReady` | `any` | - |
| `itemOption` | `any` | Se o item do dropdown é uma opção. |
| `itemSubscriptions` | `any` | - |
| `label` | `any` | O texto a ser exibido no dropdown. |
| `loading` | `any` | Se o dropdown está em estado de carregamento. |
| `onClose` | `any` | Evento emitido quando o dropdown é fechado. |
| `openChange` | `any` | Evento emitido quando o estado de aberto/fechado do dropdown muda. |
| `outline` | `any` | Se o dropdown deve ter um contorno. |
| `pendingClose` | `literal type | null` | - |
| `placement` | `any` | A posição do menu do dropdown. |
| `positionBy` | `any` | A referência de posicionamento do dropdown. |
| `shiftPadding` | `any` | O preenchimento para a funcionalidade de deslocamento. |
| `showSubmenu` | `any` | - |
| `size` | `any` | Define o tamanho do dropdown. |
| `submenuBehavior` | `any` | O comportamento do submenu. |
| `submenuTemplate` | `any` | - |
| `submenuTitles` | `any` | - |
| `triggerRef` | `any` | - |
| `triggers` | `any` | Os gatilhos que abrem o dropdown. |
| `useArrow` | `any` | Se o dropdown deve usar uma seta. |
| `useShift` | `any` | Se o dropdown deve usar a funcionalidade de deslocamento. |
| `variant` | `any` | Define o estilo do dropdown. |
| `viewItems` | `QueryList<MenuItemComponent>` | - |

## Code Examples

### HTML Template
```html
<mds-dropdown [label]="'Actions'">
  <mds-dropdown-item (click)="edit()">Edit</mds-dropdown-item>
  <mds-dropdown-item (click)="delete()" variant="danger">Delete</mds-dropdown-item>
</mds-dropdown>
```

### TypeScript Component
```typescript

```
