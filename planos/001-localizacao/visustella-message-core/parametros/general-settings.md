# General Settings

Plugin Parameters > General Settings. Configuracoes gerais da janela de mensagem, name box, choice list e text codes padrao.

---

## Message Window

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| Default Rows | Number | Numero padrao de rows (linhas) visiveis na message window |
| Default Width | Number | Largura padrao da message window em pixels |
| Fast Forward Key | Input | Tecla usada para fast forward durante mensagens |
| Text Delay | Number | Frames entre cada caractere exibido. `0` = instantaneo |
| Offset X | Number | Offset horizontal da message window. Valores negativos = esquerda, positivos = direita |
| Offset Y | Number | Offset vertical da message window. Valores negativos = cima, positivos = baixo |
| Stretch Dimmed BG | Boolean | Se ON, estica o background dimmed para cobrir a tela inteira |
| Default Outline Width | Number | Espessura padrao do outline do texto em pixels |
| Each Message Start | String | Texto adicionado automaticamente no inicio de cada mensagem. Suporta text codes |
| Each Message End | String | Texto adicionado automaticamente no final de cada mensagem. Suporta text codes |

### Notas sobre Each Message Start/End

- Suporta text codes (ex: `<center>`, `\{`, `\C[x]`)
- **NAO se aplica** a page breaks intermediarios causados por word wrap ou excess lines
- So aplica no inicio da mensagem inteira e no final da mensagem inteira
- Exemplo de uso: definir `<center>` no Start para centralizar todas as mensagens

### WARNING: Fast Forward Key

Se o Fast Forward Key for igual ao dash button, o jogo limpara os inputs ao triggerar um evento. Isso pode causar comportamento inesperado onde o jogador parece "travado" apos iniciar um evento enquanto corria.

---

## Name Box Window

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| Default Color | Number | Cor padrao do texto da name box (indice da text color) |
| Offset X | Number | Offset horizontal da name box. Valor e clampado para nao sair da tela |
| Offset Y | Number | Offset vertical da name box. Valor e clampado para nao sair da tela |

---

## Choice List Window

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| Line Height | Number | Altura padrao da linha para o comando Show Choices |
| Max Rows | Number | Maximo de rows visiveis simultaneamente na choice list |
| Max Columns | Number | Maximo de colunas visiveis simultaneamente na choice list |
| Text Alignment | Select | Alinhamento padrao do texto nas choices (Left/Center/Right) |

---

## Default Text Codes

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| Relative \PX \PY | Boolean | Se ON, `\PX[x]` e `\PY[x]` sao relativos a posicao atual em vez de absolutos |
| \{ Maximum | Number | Tamanho maximo de fonte que `\{` pode alcancar |
| \} Minimum | Number | Tamanho minimo de fonte que `\}` pode alcancar |
| \{ Change \} | Number | Quanto `\{` e `\}` alteram o font size a cada uso |

### Comportamento de \{ e \}

- `\{` aumenta o font size pelo valor de `\{ Change \}`
- `\}` diminui o font size pelo valor de `\{ Change \}`
- O font size nunca excede `\{ Maximum` nem vai abaixo de `\} Minimum`
