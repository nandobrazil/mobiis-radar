# Section Item

## Description
Standardized layout containers nesting neatly underneath Section Headers, holding specific labels and data pairs linearly.

## When to Apply
Use this component when:
- Read-only view mode of complex forms (Label-value pairs)
- Detailed configuration data points

Do NOT use this component when:
- For interactive primary form elements unless explicitly styled for editing mode alignment

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `additionalClass` | `any` | Classe adicional |
| `icon` | `any` | Nome do icone ou imagem  MdsIconAlias alias do icone |
| `iconFontSize` | `any` | Tamanho da fonte do icone |
| `iconSize` | `any` | Calcula o tamanho do ícone |
| `iconType` | `any` | Tipo do icone |
| `label` | `any` | Label/titulo do item |
| `loading` | `any` | Habilita animação de loading |
| `reverse` | `any` | Modo que inverte a posição do label e do value |
| `size` | `any` | Tamanho do componente |
| `value` | `any` | Valor do item |
| `valueEllipsis` | `any` | Habilita ellipsis para cortar o tamanho do value excedente a largura |

## Code Examples

### HTML Template
```html
<mds-section-item label="Contract Number" [value]="contractId()"></mds-section-item>
```

### TypeScript Component
```typescript
contractId = signal('CT-889982');
```
