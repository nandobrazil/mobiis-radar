# Button

## Description
The fundamental interactive element triggering business logic actions, forms submissions, or major UI state changes.

## When to Apply
Use this component when:
- Submitting forms
- Confirmations or cancelations in dialogs
- Standard primary actions on pages

Do NOT use this component when:
- Navigational links designed to look identical to buttons but actually functioning exclusively as `href` routing elements (use styled anchor links correctly)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `additionalClass` | `any` | Classe adicional para o botão |
| `ariaLabel` | `any` | Aria label do botão |
| `checked` | `any` | Botão checkado em um grupo (radio) |
| `disabled` | `any` | Desabilita o botão |
| `effectiveAriaLabel` | `any` | Calcula o aria-label efetivo |
| `effectiveIconSize` | `any` | Calcula o tamanho efetivo do ícone |
| `effectiveIconStyle` | `any` | Calcula o estilo efetivo do ícone |
| `effectiveVariant` | `any` | Define a variant &#39;control&#39; se for &#39;default&#39; |
| `icon` | `any` | Icone do botão |
| `iconRight` | `any` | - |
| `iconSize` | `any` | Tamanho do icone |
| `iconType` | `any` | Tipo do icone |
| `itemOption` | `any` | Botão de lista de opções |
| `label` | `any` | Texto do botão |
| `loaderSize` | `any` | Calcula o tamanho do loader |
| `loading` | `any` | Botão com loading |
| `onClick` | `any` | Evento disparado ao clicar no botão |
| `outline` | `any` | Botão outline |
| `rounded` | `any` | - |
| `selected` | `any` | Botão selecionado |
| `size` | `any` | Tamanhos de botão |
| `type` | `any` | Tipo do botão |
| `variant` | `any` | Variações do botão |

## Code Examples

### HTML Template
```html
<mds-button variant="primary" (click)="saveData()">Save Changes</mds-button>
```

### TypeScript Component
```typescript
saveData() { }
```
