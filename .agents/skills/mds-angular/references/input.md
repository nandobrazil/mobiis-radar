# Input

## Description
The foundational text input wrapper with integrated standard MDS stylings and behaviors.

## When to Apply
Use this component when:
- Any single-line direct text entry from the user (names, emails, short descriptions)

Do NOT use this component when:
- Large multiline essay entries (use textarea)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `autocomplete` | `any` | - |
| `complementoTexto` | `any` | - |
| `complementPosition` | `any` | - |
| `customMask` | `any` | - |
| `datalistId` | `any` | - |
| `effectiveMsgErrorMaxLength` | `any` | - |
| `effectiveMsgErrorMinLength` | `any` | - |
| `effectiveSettings` | `any` | - |
| `help` | `any` | - |
| `icon` | `any` | - |
| `idElementInput` | `any` | - |
| `injector` | `any` | - |
| `inputElement` | `ElementRef` | - |
| `inputMode` | `any` | - |
| `internalValue` | `any` | - |
| `isActive` | `any` | - |
| `isDisabled` | `any` | - |
| `label` | `any` | - |
| `limiteMilhar` | `any` | - |
| `maxLength` | `any` | - |
| `minLength` | `any` | - |
| `msgErrorEmail` | `any` | - |
| `msgErrorMask` | `any` | - |
| `msgErrorMaxLength` | `any` | - |
| `msgErrorMinLength` | `any` | - |
| `msgErrorRequired` | `any` | - |
| `ngControl` | `NgControl | null` | - |
| `onBlur` | `any` | - |
| `onChange` | `any` | - |
| `onChangeFn` | `function` | - |
| `onClick` | `any` | - |
| `onFocus` | `any` | - |
| `onKeyUp` | `any` | - |
| `onTouchedFn` | `function` | - |
| `paddingBottom` | `any` | - |
| `paddingRight` | `any` | - |
| `pattern` | `any` | - |
| `placeholder` | `any` | - |
| `precision` | `any` | - |
| `prefix` | `any` | - |
| `readonly` | `any` | - |
| `required` | `any` | - |
| `separador` | `any` | - |
| `size` | `any` | - |
| `suffix` | `any` | - |
| `textAreaRows` | `any` | - |
| `type` | `any` | - |
| `validateCellPhoneNumber` | `any` | - |
| `variant` | `any` | - |
| `zeroIsValid` | `any` | - |

## Code Examples

### HTML Template
```html
<mds-input [formControl]="nameControl" placeholder="Enter Full Name"></mds-input>
```

### TypeScript Component
```typescript
nameControl = new FormControl('');
```
