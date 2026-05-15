# Config Toggle

## Description
A toggle switch tailored for immediate configuration changes with high visibility state changes.

## When to Apply
Use this component when:
- Turning major features ON/OFF immediately
- Global application settings toggles (e.g., Dark Mode)

Do NOT use this component when:
- Inside large complex forms where state isn't saved until a Submit button is triggered (use checkbox instead)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `boxSize` | `MdsSizesSmall | "no-spacing"` | Modo box: tamanho do espaçmento do bloco |
| `boxVariant` | `MdsBoxVariants` | Modo box: tamanho do espaçmento do bloco |
| `description` | `string` | Descrição da configuração |
| `disabledHelp` | `string` | Mensagem de ajuda quando desativado |
| `formControl` | `UntypedFormControl` | formControl do checkbox |
| `icon` | `MdsIconAlias` | Icone da configuração |
| `label` | `string` | Titulo da configuração |
| `mode` | `MdsConfigToggleModes` | Modo de exibição do bloco |
| `name` | `string` | name do switch |
| `size` | `MdsSizes` | Tamanho geral do componente |
| `toggleSize` | `MdsSizesSmall` | tamanho do switch |

### Outputs
| Output | Evento | Descrição |
|--------|--------|-----------|
| `onToggle` | `EventEmitter` | Evento emitido no toggle |

## Code Examples

### HTML Template
```html
<mds-config-toggle [formControl]="featureEnabled" label="Enable feature X"></mds-config-toggle>
```

### TypeScript Component
```typescript
featureEnabled = new FormControl(true);
```
