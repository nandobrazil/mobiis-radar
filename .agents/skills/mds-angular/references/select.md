# Select

## Description
A dropdown styled select element for choosing a single or multiple value from an expandable list of predictable choices.

## When to Apply
Use this component when:
- Selecting an option among 5 to 50 items
- Picking a structured category from the system taxonomies

Do NOT use this component when:
- Massive data sets over 200 items (use Autocomplete instead)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `addOutput` | `any` | - |
| `addrMember` | `any` | Campo de referencia no objeto do item para informação de endereço utilizada na dropdown |
| `addTag` | `any` | Permite criar opções personalizadas. |
| `addTagText` | `any` | Texto da tag de Adicionar |
| `appendTo` | `any` | Anexe o dropdown ao  ou a qualquer outro elemento usando o seletor css. |
| `badgeRounded` | `any` | Deixa o badge (caso tenha) arredondado |
| `blurOutput` | `any` | - |
| `changeOutput` | `any` | - |
| `clearable` | `any` | Permite limpar o valor selecionado. Padrão true |
| `clearAllText` | `any` | Texto de impar o campo |
| `clearOnBackspace` | `any` | Limpre os valores selecionados um a um ao clicar em backspace. Padrão true |
| `clearOutput` | `any` | - |
| `clearSearchOnAdd` | `any` | Limpa a entrada de pesquisa quando o item é selecionado. |
| `closeOnSelect` | `any` | Se deve fechar o menu quando um valor é selecionado |
| `closeOutput` | `any` | - |
| `colorMember` | `any` | Campo de referencia no objeto do item para informação de cor |
| `colorTitleMember` | `any` | Titulo para o campo de cor |
| `compareWith` | `any` | Uma função para comparar os valores das opções com os valores selecionados. |
| `customOptionTemplate` | `any` | Template utilizado para exibir as opções, será exposto a propriedade &#39;option&#39; |
| `customTagTemplate` | `any` | Template utilizado para exibir as tags, será exposto a propriedade &#39;option&#39; |
| `disabled` | `any` | Desabilita o campo |
| `driverMember` | `any` | Campo de referencia no objeto do item para nome do motorista utilizada na dropdown |
| `driverPhoneMember` | `any` | Campo de referencia no objeto do item para telefone do motorista utilizada na dropdown |
| `dropdownPosition` | `any` | Define a podição do dropdown |
| `effectiveCloseOnSelect` | `any` | - |
| `emailMember` | `any` | Campo de referencia no objeto do item para o e-mail utilizado na dropdown |
| `focusOutput` | `any` | - |
| `formControl` | `any` | FormControl do campo |
| `formGroupDir` | `any` | - |
| `groupBy` | `any` | Permite agrupar itens por chave ou expressão de função |
| `groupValue` | `any` | Expressão de função para fornecer o valor do grupo |
| `hideSelected` | `any` | - |
| `hideSelectedInput` | `any` | Permite ocultar os itens selecionados do dropdown. |
| `iconAlias` | `any` | Por padrão renderiza o icone por alias, se false, usa o modelo [&#39;fal&#39;, &#39;icone&#39;] |
| `iconMember` | `any` | Campo de referencia no objeto do item para icone do item |
| `iconType` | `any` | Tipo do icone |
| `imgMember` | `any` | Campo de referencia no objeto do item para imagem de avatar |
| `items` | `any` | Itens do campo |
| `labelDescription` | `any` | Campo de referencia no objeto do item para descrição utilizada na dropdown |
| `labelMember` | `any` | Campo de referencia no objeto do item para o label |
| `loading` | `any` | Exibe loading no campo |
| `loadingText` | `any` | Texto de carregando |
| `maxSelectedItems` | `any` | Quando [multiple]=&quot;true&quot;, permite definir um número limite de seleção. |
| `mode` | `any` | Modo de exibição do input |
| `multiple` | `any` | Permite selecionar vários itens. |
| `ngSelect` | `any` | - |
| `notFoundText` | `any` | Texto de nenhum item encontrado |
| `openOnEnter` | `any` | Abre o dropdown usando enter |
| `openOutput` | `any` | - |
| `phoneMember` | `any` | Campo de referencia no objeto do item para o telefone utilizada na dropdown |
| `placeholder` | `any` | Label do campo. * só esse componente utiliza o placeholder para label |
| `qtdMaxExibidos` | `any` | Qtd max de labels exibidas no select multiple |
| `removeOutput` | `any` | - |
| `removePaddingBottom` | `any` | Remove comportamento de campo com padding-bottom |
| `required` | `any` | Campo requerido |
| `scrollOutput` | `any` | - |
| `scrollToEndOutput` | `any` | - |
| `searchFn` | `any` | Permitir filtrar por função de pesquisa personalizada |
| `searchOutput` | `any` | - |
| `selectableGroup` | `any` | Permite selecionar o grupo quando groupBy é usado |
| `selectableGroupAsModel` | `any` | Indica se deve selecionar todos os filhos ou o próprio grupo |
| `selectedValue` | `any` | - |
| `selectOnTab` | `any` | Selecione o item do dropdown marcado usando tab. |
| `size` | `any` | Tamano do Campo |
| `stateChanges` | `any` | - |
| `templateOption` | `any` | Template utilizado para exibir os itens na lista do dropdown |
| `templateTag` | `any` | Template utilizado para exibir as tags de multipla seleção |
| `templateTagType` | `any` | Tipo de template utilizado para exibir as tags |
| `templateType` | `any` | Tipo de template utilizado para exibir as opções |
| `trackByFn` | `any` | Fornece função trackBy personalizada |
| `typeahead` | `any` | Preenchimento automático personalizado ou filtro avançado. |
| `typeToSearchText` | `any` | Texto de informação para digitar para pesquisar |
| `valueMember` | `any` | Campo de referencia no objeto do item para o valor |
| `virtualScroll` | `any` | Habilite a rolagem virtual para melhor desempenho |

## Code Examples

### HTML Template
```html
<mds-select [options]="categories()" [formControl]="categoryControl"></mds-select>
```

### TypeScript Component
```typescript
categories = signal([{id: 1, name: 'Logistics'}, {id: 2, name: 'Finance'}]);
```
