# Dynamic Card

## Description
A highly programmatic data-driven Card element fed via JSON/Configs instead of static HTML composition templates.

## When to Apply
Use this component when:
- Rendering configurations originating directly down from the backend definitions
- Highly customized user dashboards based on flexible privileges

Do NOT use this component when:
- When standard statically typed layouts are sufficient and more easily readable by developers

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `badges` | `CardTemplateBadgeModel[]` | - |
| `data` | `any` | - |
| `hasNotification` | `boolean` | Adiciona alteração visual para identificar que possui notificação |
| `hasUpdate` | `boolean` | Adiciona alteração visual para identificar a carga teve atualização |
| `isSelected` | `boolean` | Card selecionado |
| `isSelectionMode` | `boolean` | Habilita o modo de seleção do card |
| `itemMap` | `CardTemplateMapeamentoModel` | - |
| `showFooter` | `boolean` | - |
| `template` | `CardTemplateModel` | Template das informações dinâmicas exibidas no card, com as chaves dos campos a serem exibidos baseado no mapeamento dos campos ```json { config: { showLabel: true, showIcon: true }, label: &#39;codigoIdentificador&#39;,header: [&#39;origem.localidade&#39;, &#39;destino.localidade&#39;], body: [&#39;codigo&#39;, &#39;caracteristica.descricao&#39;, &#39;motorista.documento&#39;,&#39;veiculo.placa&#39;], badges: [&#39;tipoFrete&#39;, &#39;origemCarga&#39;] } |
| `totals` | `CardTemplateTotalizadorModel` | - |

### Outputs
| Output | Evento | Descrição |
|--------|--------|-----------|
| `onToggleCard` | `EventEmitter<any>` | - |

## Code Examples

### HTML Template
```html
<mds-dynamic-card [configuration]="serverCardConfig()"></mds-dynamic-card>
```

### TypeScript Component
```typescript

```
