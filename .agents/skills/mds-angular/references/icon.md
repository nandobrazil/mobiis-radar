# Icon

## Description
The fundamental standardized icon renderer pulling systematically verified SVG geometry strictly from the Mobiis icon libraries (via Lucide or custom).

## When to Apply
Use this component when:
- Decorating buttons visibly
- Clarifying navigation items comprehensively
- Enhancing distinct visual affordance gracefully

Do NOT use this component when:
- Using icons indiscriminately as decorations without explicit semantic meaning or value

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `absoluteStrokeWidth` | `any` | Lucide: absoluteStrokeWidth |
| `container` | `ViewContainerRef` | - |
| `fixedWidth` | `any` | FontAwesome: tamanho fixo |
| `flip` | `any` | FontAwesome: Inverter horizontalmente o icone |
| `icon` | `any` | Nome do icone ou imagem  MdsIconAlias alias do icone any[] Array do FontAwesome ex.: [\&#39;fal\&#39;, \&#39;question\&#39;] string Nome do arquico do ícone svg, localizado na pasta /assets/icons/ |
| `iconSizeNumerical` | `any` | Tamanho numérico do ícone |
| `loading` | `any` | Loader |
| `MDSIcon` | `any` | Retorna o ícone pelo alias |
| `pull` | `any` | FontAwesome: posiciona o icone |
| `pulse` | `any` | FontAwesome: Animação pulsando |
| `rotate` | `any` | FontAwesome: rotacionar icone |
| `size` | `any` | Tamanho do icone. Padrao do FontAwesome, ou em px para svg |
| `spin` | `any` | FontAwesome: Animação girando |
| `strokeWidth` | `any` | Lucide: tamanho da borda |
| `transform` | `any` | FontAwesome: Transformar o icone |
| `type` | `any` | Tipo do icone |

## Code Examples

### HTML Template
```html
<mds-icon name="user-check" size="md" color="primary"></mds-icon>
```

### TypeScript Component
```typescript

```
