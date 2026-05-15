# Card Entrega

## Description
A specialized, domain-specific card engineered perfectly to display all contextual shipment/delivery data.

## When to Apply
Use this component when:
- Showing logistics delivery payloads to the user
- Tracking delivery items in a list view

Do NOT use this component when:
- Generic non-logistics data representations

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `endereco` | `any` | Endereço |
| `enderecoInvalido` | `any` | Possui endereço inválido |
| `executarValidacaoDataNoPassado` | `any` | Exibe a validação de data no passado como erro caso true, se false exibe como alerta |
| `fixarAcao` | `any` | Fixa as ações do card |
| `grupoTarefas` | `any` | Grupo de tarefas a ser realizado nesta entrega |
| `nrPedido` | `any` | Número do pedido |
| `ordem` | `any` | Ordenação na lista de entregas |
| `possuiGrupoTarefa` | `any` | Entrega com grupo de tarefas |
| `possuiRedespacho` | `any` | PossuiRedespacho |
| `previsaoEntrega` | `any` | Previsão de entrega |
| `razaoEmpresa` | `any` | Razão social |
| `variant` | `any` | Variante do card |

## Code Examples

### HTML Template
```html
<mds-card-entrega [delivery]="deliveryRecord()"></mds-card-entrega>
```

### TypeScript Component
```typescript
deliveryRecord = signal({ id: 123, status: 'Completed', dest: 'SP' });
```
