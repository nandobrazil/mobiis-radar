# Anexo Item

## Description
Displays an individual attached file document cleanly showing file size, extension indicator icon, and relevant actions (Download/Remove).

## When to Apply
Use this component when:
- Listing uploaded attachments to a specific logistics load form context
- Showing documents tied to an order dynamically

Do NOT use this component when:
- Used for primary image galleries focusing strongly on visual browsing instead of semantic file documents

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `anexo` | `any` | Objeto do anexo |
| `disabled` | `any` | Desabilita efeito de clique |
| `label` | `any` | Label do anexo |
| `loading` | `any` | Exibe loading |
| `onClick` | `any` | Emitido ao clicar no item para baixar o anexo |
| `onDelete` | `any` | Emitido ao clicar em remover o anexo |
| `showRemove` | `any` | Exibe ou não a opção de remover |
| `size` | `any` | Tamanho do item |

## Code Examples

### HTML Template
```html
<mds-anexo-item [file]="uploadedDoc()" (removed)="onRemove()"></mds-anexo-item>
```

### TypeScript Component
```typescript
uploadedDoc = signal({ name: 'invoice.pdf', size: '2MB' });
```
