# Menu Business

## Description
A business-domain specific layout for navigating complex structural sections.

## When to Apply
Use this component when:
- Navigating B2B business segments or complex organizational units

Do NOT use this component when:
- Simple user applications that don't require B2B navigation

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `description` | `string` | Descrição do conteudo |
| `imageAvatar` | `string` | Imagem do avatar |
| `label` | `string` | Label do conteudo |
| `roundedAvatar` | `boolean` | Avatar arredondado |
| `variantAvatar` | `MdsAvatarVariants` | Variante do avatar |

## Code Examples

### HTML Template
```html
<mds-menu-business [businessData]="businessData()"></mds-menu-business>
```

### TypeScript Component
```typescript
@Component({ standalone: true })
export class ExampleComponent {
  businessData = signal({ units: [], current: null });
}
```
