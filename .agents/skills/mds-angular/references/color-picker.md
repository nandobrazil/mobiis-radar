# Color Picker

## Description
An input designed specifically for users to pick a visual color code (hex, rgb).

## When to Apply
Use this component when:
- Configuring theme colors
- Selecting status indicator colors for dynamic tags

Do NOT use this component when:
- Standard textual input needs

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `additionalClass` | `any` | - |
| `ariaLabel` | `any` | - |
| `caret` | `any` | - |
| `customColors` | `any` | - |
| `disabled` | `any` | - |
| `disabledColors` | `any` | - |
| `effectiveColors` | `any` | - |
| `form` | `any` | - |
| `formControl` | `any` | - |
| `hostValue` | `any` | - |
| `icon` | `any` | - |
| `itemOption` | `any` | - |
| `label` | `any` | - |
| `loading` | `any` | - |
| `onChange` | `any` | - |
| `onChangeCallback` | `function` | - |
| `onTouchedCallback` | `function` | - |
| `outline` | `any` | - |
| `placement` | `any` | - |
| `required` | `any` | - |
| `simpleMode` | `any` | - |
| `size` | `any` | - |
| `type` | `any` | - |
| `variant` | `any` | - |

## Code Examples

### HTML Template
```html
<mds-color-picker [formControl]="brandColorControl"></mds-color-picker>
```

### TypeScript Component
```typescript
brandColorControl = new FormControl('#ff0000');
```
