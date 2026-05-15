# Card

## Description
A standard elevated container displaying distinct, structured pieces of information visually grouped together.

## When to Apply
Use this component when:
- Displaying summary widgets on dashboards
- Wrapping structured form sections gracefully in gray background interfaces

Do NOT use this component when:
- As a strict list item representation in highly dense data tables

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `actionPosition` | `any` | posição dos botões de ação do card |
| `additionalClass` | `any` | Classe adicional para o card |
| `desativarHover` | `any` | Desativa os efeitos de hover no card |
| `fixarAcao` | `any` | Deixar as ações fixas e aparentes no card |
| `multiple` | `any` | Exibe visualmente grupo de card |
| `onToggle` | `any` | disparado ao trocar a seleção |
| `possuiAcao` | `any` | Habilita as ações no card |
| `selected` | `any` | Card selecionado (bidirecional) |
| `selectionMode` | `any` | Habilita o modo de seleção do card |
| `size` | `any` | Tamanhos do espaçamento interno do card |
| `temAtualizacao` | `any` | Exibe destaque no card quando possi atualização de alguma informação ou status |
| `temNotificacao` | `any` | Exibe badge e destaque de notificação |
| `variant` | `any` | Variant do card |

## Code Examples

### HTML Template
```html
<mds-card>
  <div mdsCardHeader>Order Summary</div>
  <div mdsCardContent>Content info...</div>
</mds-card>
```

### TypeScript Component
```typescript

```
