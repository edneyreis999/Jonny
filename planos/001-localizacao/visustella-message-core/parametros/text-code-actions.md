# Text Code Actions

Plugin Parameters > Text Code Actions. Define text codes customizados que executam acoes (JavaScript ou Common Events) quando encontrados no texto. Diferente dos Text Code Replacements, estes nao substituem texto -- apenas executam uma acao.

---

## Formato de Text Code

Text codes no RPG Maker usam o formato `\X[y]` onde `X` e o marcador (match) e `y` e o parametro.

### Campos por Entrada

| Campo | Tipo | Descricao |
|-------|------|-----------|
| Match | String | O marcador apos a `\`. Em `\N[x]`, o match e `N` |
| Type | Select | Tipo de parametro esperado. Opcoes: `none`, `number`, `string` |
| Common Event | Number | ID do Common Event a executar. Funciona apenas na Message Window |
| JS: Action | String | Codigo JavaScript executado quando o text code aparece no texto |

---

## Detalhamento dos Campos

### Match
O identificador unico do text code. Deve ser uma string curta (geralmente 1-3 caracteres) que nao conflite com text codes existentes do RPG Maker ou de outros plugins.

### Type
Determina como o parametro entre colchetes e interpretado:

| Type | Formato | Exemplo | Descricao |
|------|---------|---------|-----------|
| none | `\X` | `\S` | Sem parametro. A acao executa sem dados adicionais |
| number | `\X[n]` | `\S[5]` | Parametro numerico. Disponivel como argumento |
| string | `\X[text]` | `\S[hello]` | Parametro de texto. Disponivel como argumento |

### Common Event
- Executa o Common Event com o ID especificado
- **So funciona na Message Window** (nao funciona em Help Window ou Choice Window)
- Se preenchido, executa junto com JS: Action (se ambos estiverem definidos)

### JS: Action
Codigo JavaScript executado no contexto do jogo quando o text code e encontrado. Nao retorna valor -- e apenas uma acao.

---

## Exemplos de Uso

### Tocar um SE via text code
- Match: `SE`
- Type: `string`
- JS: Action: `AudioManager.playSe({name: arguments[0], volume: 90, pitch: 100, pan: 0})`
- Uso: `\SE[Cursor1]`

### Executar Common Event
- Match: `CE`
- Type: `number`
- Common Event: (deixar vazio, usar o parametro)
- JS: Action: `$gameTemp.reserveCommonEvent(arguments[0])`
- Uso: `\CE[5]`

---

## Notas

- Text Code Actions e Text Code Replacements usam a mesma estrutura de Match
- Se o mesmo Match existir em ambos, o comportamento depende da prioridade do plugin
- Acoes nao imprimem texto na message window
- Para substituir texto, usar Text Code Replacements
