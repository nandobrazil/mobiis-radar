# Avatar

## Description
A tiny standardized rounded visual container meant solely to frame user, company, or driver profile images/initials elegantly.

## When to Apply
Use this component when:
- Representing the authenticated user graphically in the Topbar
- Displaying drivers uniquely in user lists explicitly

Do NOT use this component when:
- Displaying large full-scale banner promotional imagery

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `abbr` | `any` | - |
| `autoVariant` | `any` | Seta a variante automática pela primeira letra |
| `autoVariantsBase` | `any` | Array com opções cores de variantes usadas na Variante Automática |
| `autoVariantStyles` | `any` | Array com opções de estilos de variantes usadas na Variante Automática |
| `description` | `any` | Descrição / Nome |
| `effectiveDescription` | `any` | - |
| `effectiveVariant` | `any` | - |
| `formControl` | `any` | - |
| `formControlValue` | `any` | - |
| `icon` | `any` | icone do avatar |
| `iconSize` | `any` | - |
| `loading` | `any` | Loading |
| `localImage` | `any` | Caminho da imagem do avatar |
| `rounded` | `any` | Avatar arredondado |
| `size` | `any` | Tamanhos do avatar |
| `variant` | `any` | Variações de avatar |

## Code Examples

### HTML Template
```html
<mds-avatar [image]="userProfile.image" [initials]="userProfile.initials"></mds-avatar>
```

### TypeScript Component
```typescript

```
