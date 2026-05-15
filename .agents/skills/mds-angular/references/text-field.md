# Text Field / Textarea

## Description
A multiline text entry control enabling long-form textual data capture.

## When to Apply
Use this component when:
- Capturing long descriptive notes or instructions in logistics processes
- User formatted feedback forms

Do NOT use this component when:
- Single line short numeric/alphanumeric IDs

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `autocomplete` | `any` | - |
| `cdr` | `any` | - |
| `complementoTexto` | `any` | - |
| `complementPosition` | `any` | - |
| `customMask` | `any` | - |
| `datalistId` | `any` | - |
| `effectiveComplementoTexto` | `any` | - |
| `effectiveCustomMask` | `any` | - |
| `effectivePrecision` | `any` | - |
| `effectiveSeparador` | `any` | - |
| `effectiveType` | `any` | - |
| `formControl` | `any` | - |
| `formControlAux` | `any` | - |
| `hasComplementLeft` | `any` | - |
| `hasComplementRight` | `any` | - |
| `hasIconLeft` | `any` | - |
| `hasIconRight` | `any` | - |
| `help` | `any` | - |
| `icon` | `any` | - |
| `idElementInput` | `any` | - |
| `inputElement` | `any` | - |
| `inputMode` | `any` | - |
| `isActive` | `any` | - |
| `isDanger` | `any` | - |
| `isDecimalInput` | `any` | - |
| `isIntegerInput` | `any` | - |
| `label` | `any` | - |
| `limiteMilhar` | `any` | - |
| `maskPhone` | `any` | - |
| `maxLength` | `any` | - |
| `minLength` | `any` | - |
| `msgErrorEmail` | `any` | - |
| `msgErrorMask` | `any` | - |
| `msgErrorMaxLength` | `any` | - |
| `msgErrorMaxLengthInput` | `any` | - |
| `msgErrorMinLength` | `any` | - |
| `msgErrorMinLengthInput` | `any` | - |
| `msgErrorRequired` | `any` | - |
| `onBlur` | `any` | - |
| `onChange` | `any` | - |
| `onClick` | `any` | - |
| `onFocus` | `any` | - |
| `onKeyUp` | `any` | - |
| `paddingRight` | `any` | - |
| `pattern` | `any` | - |
| `phoneMaskDirective` | `any` | - |
| `placeholder` | `any` | - |
| `precision` | `any` | - |
| `prefix` | `any` | - |
| `readonly` | `any` | - |
| `removePaddingBottom` | `any` | - |
| `required` | `any` | - |
| `separador` | `any` | - |
| `size` | `any` | - |
| `subscriptions` | `any[]` | - |
| `suffix` | `any` | - |
| `textAreaRows` | `any` | - |
| `type` | `any` | - |
| `validateCellPhoneNumber` | `any` | - |
| `variant` | `any` | - |
| `writingValueFromSelfChange` | `any` | - |
| `zeroIsValid` | `any` | - |

## Code Examples

### HTML Template
```html
<mds-text-field [formControl]="notesControl" rows="5"></mds-text-field>
```

### TypeScript Component
```typescript
notesControl = new FormControl('');
```
