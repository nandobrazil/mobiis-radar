# Board Pipe (Kanban Column)

## Description
A vertical column layout component representing a specific discrete status/phase in a Kanban board flow.

## When to Apply
Use this component when:
- Delivery or Order management visual Kanban boards
- Drag and Drop interface columns for workflow state management

Do NOT use this component when:
- As a general grid column outside of a lateral-scrolling pipeline context

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `additionalClass` | `string` | Classes adicionais para o pipe |
| `compact` | `boolean` | Cards internos compactos |
| `contentShow` | `boolean` | Controla se está exibindo a navegação ou conteúdo no caso do modo=&quot;content&quot; Navegacao: ng-container[mdsPipeNav] Conteudo: ng-container[mdsPipeContent] |
| `customPlacement` | `MdsPlacement` | Posicionamento customizado do menu de ações do pipe |
| `description` | `string` | Descrição, texto de ajuda do pipe |
| `hasCompact` | `boolean` | Possui botão de visão compacta |
| `hasSubItems` | `boolean` | Remove espaçamento interno em caso de ter sub-itens |
| `icon` | `MdsIconAlias` | Icone |
| `iconType` | `"alias" | "svg"` | Tipo do icone |
| `label` | `string` | Titulo do pipe |
| `loading` | `boolean` | Adiciona loader no pipe |
| `minimized` | `boolean` | Modo minimizado do pipe |
| `mode` | `"list" | "content"` | Modo do pipe  list: lista de cards content: conteudo com navegação (pedidos) |
| `progress` | `number` | - |
| `roundEnd` | `string` | Data do fim do round - DD-MM-YYYY HH:mm:ss |
| `roundStart` | `string` | Data de inicio do round - DD-MM-YYYY HH:mm:ss |
| `showActions` | `boolean` | Exibe o menu de ações do pipe |
| `showFilter` | `boolean` | Exibe o [pipeFilter] |
| `total` | `number` | Contador do total de ítens no pipe |
| `variant` | `MdsBoardPipeVariants` | Variação do pipe |

### Outputs
| Output | Evento | Descrição |
|--------|--------|-----------|
| `roundEndEmitter` | `EventEmitter` | - |
| `roundStartedEmitter` | `EventEmitter` | - |
| `roundWaitingEmitter` | `EventEmitter` | - |
| `toggleEmitter` | `EventEmitter` | - |
| `togglePipeEmitter` | `EventEmitter` | - |

## Code Examples

### HTML Template
```html
<mds-board-pipe [title]="'In Transit'" [items]="inTransitOrders()" (itemDropped)="updateStatus($event)"></mds-board-pipe>
```

### TypeScript Component
```typescript
inTransitOrders = signal([]);
```
