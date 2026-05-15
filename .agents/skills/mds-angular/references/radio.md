# Radio

## Description
A standard selection control for choosing exactly ONE item from a mutually exclusive list of visible choices.

## When to Apply
Use this component when:
- Selecting an exclusive delivery priority (Low/Medium/High)
- Short predictable options (under 5 options typically)

Do NOT use this component when:
- Lists with 6+ options where display space is wasted (use Select instead)
- Binary single-item on/off triggers (use Checkbox)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `additionalClass` | `any` | Classe adicional |
| `btnType` | `any` | Tipo do botão no caso de group |
| `btnVariant` | `any` | Variante para o radio do tipo group |
| `checked` | `any` | - |
| `disabled` | `any` | Desativa somente este campo |
| `formControlDisabled` | `any` | Desabilita todo o formControl  Talvez  não precise, adicionado por segurança e garantia |
| `icon` | `any` | Icone do para o radio do tipo group |
| `iconAdditionalClass` | `any` | Classe aditional para o icone |
| `idElementInput` | `string` | - |
| `injector` | `any` | - |
| `inputDisabled` | `any` | - |
| `internalValue` | `any` | - |
| `label` | `any` | Label do radio |
| `mode` | `any` | Tipo de radio:  single - normal group - grupo de seleção (estilo botão) option - Opção de seleção em uma lista, com destaque no selecionado |
| `name` | `any` | Nome do campo |
| `ngControl` | `NgControl | null` | - |
| `onChangeCallback` | `function` | - |
| `onTouchedCallback` | `function` | - |
| `required` | `any` | Campo requerido |
| `size` | `any` | Tamanhos para o radio do tipo group |
| `value` | `any` | - |

## Code Examples

### HTML Template
```html
<mds-radio-group [formControl]="urgencyControl">
  <mds-radio value="low">Low</mds-radio>
  <mds-radio value="high">High</mds-radio>
</mds-radio-group>
```

### TypeScript Component
```typescript
urgencyControl = new FormControl('low');
```
