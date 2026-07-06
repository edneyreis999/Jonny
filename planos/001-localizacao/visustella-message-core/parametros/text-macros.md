# Text Macros

Plugin Parameters > Text Macros. Define macros que substituem `[MacroName]` por texto ou resultado de JavaScript. Diferente de text codes, macros usam colchetes `[]` e nao barra invertida `\`.

---

## Formato de Macro

### Campos por Entrada

| Campo | Tipo | Descricao |
|-------|------|-----------|
| Match | String | Texto de matching. Em `[Leader]`, o match e `Leader` |
| STR: Text | String | Texto exato de substituicao. Se preenchido, ignora JS: Text |
| JS: Text | String | Codigo JavaScript que retorna o texto de substituicao |

---

## Diferenca entre Macros e Text Codes

| Aspecto | Macro | Text Code |
|---------|-------|-----------|
| Sintaxe | `[Leader]` | `\N[1]` |
| Marcador | Colchetes `[]` | Barra invertida `\` |
| Parametros | Nao suporta parametros dinamicos | Suporta `[number]` ou `[string]` |
| Estilo Yanfly | NAO funciona com `\MacroName` | Formato diferente |

**IMPORTANTE**: Text Macros NAO funcionam com a sintaxe `\MacroName` (estilo Yanfly). Use SEMPRE `[MacroName]` com colchetes.

---

## Prioridade: STR: Text vs JS: Text

- Se **STR: Text** estiver preenchido, ele e usado e **JS: Text e ignorado**
- Se **STR: Text** estiver vazio, **JS: Text** e avaliado
- STR: Text e estatico (mesmo texto sempre)
- JS: Text e dinamico (pode retornar texto diferente baseado em estado do jogo)

---

## Exemplos de Uso

### Nome do Party Leader (JS: Text)
- Match: `Leader`
- JS: Text: `$gameParty.leader().name()`
- Uso: `[Leader]` exibe o nome do party leader

### Nome do Mapa Atual (JS: Text)
- Match: `MapName`
- JS: Text: `$dataMapInfos[$gameMap.mapId()].name`
- Uso: `[MapName]` exibe o nome do mapa atual

### Texto Estatico (STR: Text)
- Match: `GameTitle`
- STR: Text: `Daratrine - A Origem`
- Uso: `[GameTitle]` exibe "Daratrine - A Origem"

### Step Counter (JS: Text)
- Match: `Steps`
- JS: Text: `$gameParty.steps()`
- Uso: `[Steps]` exibe o numero de passos dados

---

## Notas

- O output de uma macro pode conter text codes que serao processados
- Macros podem conter outros macros? Depende da ordem de processamento -- evitar recursao
- Macros sao uteis para dados que mudam frequentemente (gold, HP, nome do leader)
- Para acoes que nao produzem texto, usar Text Code Actions
