# Card Item

## Description
A generic repeating component meant to sit within a parent Card configuration framing minor data lines.

## When to Apply
Use this component when:
- Iterating internal items (e.g., individual products) belonging to an overarching parent card constraint

Do NOT use this component when:
- Use standalone outside of overarching parent boundaries or semantic structures

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `additionalClass` | `any` | Classe adicional para o card |
| `autoVariant` | `any` | Variante do Avatar automático |
| `description` | `any` | Texto de apoio / descrição |
| `disabled` | `any` | Alteração visual para o item desabilitado |
| `highlight` | `any` | Texto para destacar |
| `href` | `any` | href normal para o link |
| `icon` | `any` | Icone do item |
| `label` | `any` | Titulo do card |
| `labelEllipsis` | `any` | Habilita ellipsis para cortar o tamanho do label excedente a largura |
| `loading` | `any` | Controla animação de destaque para ação ocorrendo no card |
| `mode` | `any` | Modo da disposição de visualização do componente |
| `routerLink` | `any` | Link da rota usando o Router |
| `showArrow` | `any` | Exibe a seta indicativa de ação |
| `showAvatar` | `any` | Exibe o avatar |
| `size` | `any` | Tamanho do card |
| `target` | `any` | Target do link |
| `updated` | `any` | Destaca o card para informar que teve atualização |
| `variant` | `any` | Variante do Avatar |

### Outputs
| Output | Evento | Descrição |
|--------|--------|-----------|
| `onCtrlClick` | `EventEmitter<MouseEvent>` | Evento emitido no ctel+click no elemento |

## Code Examples

### HTML Template
```html
<mds-card>
  <mds-card-item *for="let item of items(); track item.id" [data]="item"></mds-card-item>
</mds-card>
```

### TypeScript Component
```typescript
items = signal([{id: 1, name: 'Box'}]);
```
