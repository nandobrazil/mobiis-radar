# Collapse

## Description
An accordion-style wrapper allowing users to expand or hide sections of detailed content dynamically to save initial layout space.

## When to Apply
Use this component when:
- Hiding advanced configuration or filter options
- FQA (Frequently Asked Question) list interactions

Do NOT use this component when:
- Hiding primary mission-critical data that immediately blocks user cognition on open

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `additionalClass` | `any` | Classe adicional |
| `collapsed` | `any` | Conteúdo recolhido/colapsado |
| `onToggle` | `any` | Evento emitido ao alternar o estado (já suportado pelo model, mas mantendo para compatibilidade se necessário) |
| `size` | `any` | Tamanho do collapse |
| `variant` | `any` | Variante do collapse. &quot;card&quot; - padrão estilo card; &quot;pipe-group&quot; - utilizado para grupo de cards no pipe |

## Code Examples

### HTML Template
```html
<mds-collapse header="Advanced Options">
  <div class="p-4">Detailed options shown here.</div>
</mds-collapse>
```

### TypeScript Component
```typescript

```
