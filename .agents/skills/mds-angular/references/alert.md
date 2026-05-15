# Alert

## Description
Prominent contextual banner messages alerting the user about important state information, success confirmations, or errors systematically.

## When to Apply
Use this component when:
- Highlighting form validation summary errors
- Signaling a critical system banner notification atop the page

Do NOT use this component when:
- Small validation errors located strictly under inputs (use Control Group error validation instead)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `additionalClass` | `any` | Classe adicional para a estrutura do alerta |
| `animated` | `any` | Animação ao aparecer |
| `dismissible` | `any` | Exibe opção de fechar o alerta |
| `fixed` | `any` | Ajustes para posicionamento fixo na tela |
| `icon` | `any` | Icone de apoio ao alerta |
| `iconSize` | `any` | Tamanho do icone |
| `noMargin` | `any` | Remove a margem padrão do bloco de alerta |
| `onClose` | `any` | Evento disparado ao fechar o alerta |
| `size` | `any` | Tamanhos de alerta |
| `solid` | `any` | Fundo sólido |
| `variant` | `any` | Variações de alerta |
| `visible` | `any` | Visibilidade do alerta (bidirecional) |

## Code Examples

### HTML Template
```html
<mds-alert type="warning" title="Connection Interrupted">
  Please check your network and retry.
</mds-alert>
```

### TypeScript Component
```typescript

```
