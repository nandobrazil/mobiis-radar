# Password Strength

## Description
A composite input displaying an evaluative visual indicator evaluating the quality/complexity level of a password string.

## When to Apply
Use this component when:
- User registration forms
- Change password confirmation popups enforcing security rules

Do NOT use this component when:
- Standard login authentication challenge inputs where the strength indicator is unnecessary

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `barLabel` | `string` | Label da barra de força |
| `formControl` | `UntypedFormControl` | Form control |
| `minLength` | `number` | tamanho mínimo |
| `minStrenght` | `number | null` | força mínima |
| `showDetails` | `boolean` | exibe os detalhes da senha |
| `strengthLabels` | `string[]` | Descrição das forças |

### Outputs
| Output | Evento | Descrição |
|--------|--------|-----------|
| `onChange` | `EventEmitter<number>` | Evento disparado ao alterar o valor da força |

## Code Examples

### HTML Template
```html
<mds-control-group label="New Password">
  <mds-input type="password" [formControl]="newPassControl"></mds-input>
  <mds-password-strength [password]="newPassControl.value"></mds-password-strength>
</mds-control-group>
```

### TypeScript Component
```typescript
newPassControl = new FormControl('');
```
