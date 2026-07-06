# Text Code Replacements

Plugin Parameters > Text Code Replacements. Define text codes customizados que substituem o code por texto no momento da exibicao. Diferente dos Text Code Actions, estes produzem texto visivel.

---

## Formato de Text Code

Text codes no RPG Maker usam o formato `\X[y]` onde `X` e o marcador (match) e `y` e o parametro.

### Campos por Entrada

| Campo | Tipo | Descricao |
|-------|------|-----------|
| Match | String | O marcador apos a `\`. Em `\N[x]`, o match e `N` |
| Type | Select | Tipo de parametro esperado. Opcoes: `none`, `number`, `string` |
| STR: Text | String | Texto exato de substituicao. Se preenchido, ignora JS: Text |
| JS: Text | String | Codigo JavaScript que retorna o texto de substituicao |

---

## Detalhamento dos Campos

### Match
O identificador unico do text code. Deve ser uma string curta que nao conflite com text codes existentes.

### Type
Determina como o parametro entre colchetes e interpretado:

| Type | Formato | Exemplo | Descricao |
|------|---------|---------|-----------|
| none | `\X` | `\G` | Sem parametro. A substituicao nao depende de dados adicionais |
| number | `\X[n]` | `\G[1]` | Parametro numerico. Disponivel em JS: Text como argumento |
| string | `\X[text]` | `\G[fire]` | Parametro de texto. Disponivel em JS: Text como argumento |

### Prioridade: STR: Text vs JS: Text

- Se **STR: Text** estiver preenchido, ele e usado e **JS: Text e ignorado**
- Se **STR: Text** estiver vazio, **JS: Text** e avaliado
- STR: Text e estatico (mesmo texto sempre)
- JS: Text e dinamico (pode retornar texto diferente baseado em estado do jogo)

---

## Exemplos de Uso

### Substituicao estatica (STR: Text)
- Match: `HP`
- Type: `none`
- STR: Text: `Health Points`
- Uso: `\HP` exibe "Health Points"

### Substituicao dinamica (JS: Text)
- Match: `GLD`
- Type: `none`
- JS: Text: `$gameParty.gold() + " moedas"`
- Uso: `\GLD` exibe "150 moedas" (ou o valor atual de gold)

### Com parametro numerico (JS: Text)
- Match: `ITEM`
- Type: `number`
- JS: Text: `$dataItems[arguments[0]].name`
- Uso: `\ITEM[1]` exibe o nome do item com ID 1

---

## Notas

- O texto de saida pode conter text codes que serao processados recursivamente
- Para executar acoes sem substituir texto, usar Text Code Actions
- Text codes customizados entram em conflito se tiverem o mesmo Match
