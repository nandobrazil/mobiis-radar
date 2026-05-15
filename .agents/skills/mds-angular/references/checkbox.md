# Checkbox

## Description
A standard selection control for toggling a binary state or picking multiple items from a list.

## When to Apply
Use this component when:
- Independent binary settings (Yes/No, True/False)
- Selecting multiple independent options from a defined list

Do NOT use this component when:
- Mutually exclusive selections (use Radio instead)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `additionalClass` | `any` | Classe adicional |
| `checkbox` | `any` | - |
| `checked` | `any` | Campo checado |
| `disabled` | `any` | Campo desativado |
| `formControl` | `any` | FormControl do campo |
| `icon` | `any` | Icone do para o checkbox do tipo group |
| `iconSize` | `any` | Tamanho do icone. |
| `idElementInput` | `any` | - |
| `label` | `any` | Label do checkbox |
| `labelPosition` | `any` | Posição do label com relação ao campo |
| `loading` | `any` | Exibe loading de carregando |
| `mode` | `any` | Tipo de checkbox:  single - normal group - grupo de seleção (estilo botão) switch - Interruptor - liga e desliga |
| `name` | `any` | Nome do campo |
| `onChange` | `any` | Eventos |
| `onChangeCallback` | `function` | - |
| `onTouchedCallback` | `function` | - |
| `required` | `any` | Campo requerido |
| `size` | `any` | Tamanhos para o checkbox do tipo group |

## Code Examples

### HTML Template
```html
<mds-checkbox [formControl]="isActiveControl">Active</mds-checkbox>
```

### TypeScript Component
```typescript
import { FormControl } from '@angular/forms';
isActiveControl = new FormControl(false);
```
