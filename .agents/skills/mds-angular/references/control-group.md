# Control Group

## Description
Uma estrutura de layout (wrapper) com funcionamento semelhante ao `button-group` ou `input-group` do Bootstrap. O `mds-control-group` serve para agrupar botões, botões com inputs, ou múltiplos inputs em uma única linha. Ele conecta os elementos visualmente, removendo bordas e arredondamentos internos para que pareçam um bloco contínuo com divisões internas (ex: `[ quantidade | operador | valor ]`).

## When to Apply
Use this component when:
- Precisar agrupar uma sequência de botões relacionados de forma contínua (`[ Anterior ] [ Próximo ]` ou de formatação de texto `[ Negrito ] [ Itálico ] [ Sublinhado ]`).
- Criar conjuntos de input com botões acoplados (ex: um campo de busca grudado a um botão de "Pesquisar").
- Combinar múltiplos inputs que compõem uma única entrada de dados complexa (ex: `[ quantidade ] | [ operador ] | [ valor ]`).

Do NOT use this component when:
- Precisar apenas envolver um input simples com seu *label* e *error message* (para isso, utilize as marcações de formulário padrão em vez de agrupar).
- Os elementos não tiverem relação semântica e visual forte o suficiente para serem "grudados".

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `additionalClass` | `any` | Classe adicional para o componente |
| `label` | `any` | Label do grupo |
| `mode` | `any` | Modo para o Radio e Checkbox |
| `role` | `any` | role WAI-ARIA |

## Code Examples

### HTML Template

**Grupo de Inputs Complexos (Quantidade | Operador | Valor):**
```html
<mds-control-group>
  <mds-input type="number" placeholder="Quantidade"></mds-input>
  <mds-select placeholder="Operador">
    <mds-option value="=">Igual</mds-option>
    <mds-option value=">">Maior</mds-option>
    <mds-option value="<">Menor</mds-option>
  </mds-select>
  <mds-input type="text" placeholder="Valor"></mds-input>
</mds-control-group>
```

**Grupo de Input com Botão:**
```html
<mds-control-group>
  <mds-input type="text" placeholder="Buscar..."></mds-input>
  <mds-button variant="primary">Buscar</mds-button>
</mds-control-group>
```

**Grupo de Botões (Navegação):**
```html
<mds-control-group>
  <mds-button variant="secondary">Anterior</mds-button>
  <mds-button variant="secondary">Próximo</mds-button>
</mds-control-group>
```

**Grupo de Botões (Barra de Ferramentas / Editor de Texto):**
```html
<mds-control-group>
  <mds-button variant="ghost" icon="format_bold"></mds-button>
  <mds-button variant="ghost" icon="format_italic"></mds-button>
  <mds-button variant="ghost" icon="format_underlined"></mds-button>
</mds-control-group>
```
