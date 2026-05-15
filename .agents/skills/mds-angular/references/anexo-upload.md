# Anexo Upload

## Description
The interactive dropping zone input area letting users explicitly drag files or use system dialogs to upload local files into the application.

## When to Apply
Use this component when:
- Handling document uploads during order creations
- Applying attachment logic rapidly via standardized interface rules

Do NOT use this component when:
- Using it strictly for simple string-based inputs or non-file elements

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `displayFiles` | `any` | - |
| `filesInput` | `any` | Arquivos para atualizar processamento |
| `filesUploaded` | `any` | - |
| `internalFiles` | `any` | - |
| `multiple` | `any` | Habilita seleção de multiplos arquivos |
| `onFilesSelected` | `any` | Emitido ao selecionar os arquivos, retorna os arquivos selecionados |
| `supportedFileTypes` | `any` | Extensão dos tipos de arquivos suportados |
| `supportedMimeTypes` | `any` | Mime dos tipos de arquivos suportados |
| `uploadedIds` | `any` | - |
| `uploadFinished` | `any` | - |
| `validFiles` | `any` | - |

## Code Examples

### HTML Template
```html
<mds-anexo-upload (fileDropped)="handleNewFile($event)" accept=".pdf, .jpg"></mds-anexo-upload>
```

### TypeScript Component
```typescript
handleNewFile(file: File) { }
```
