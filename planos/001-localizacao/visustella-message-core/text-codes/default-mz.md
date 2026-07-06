# Default RPG Maker MZ Text Codes

Text codes nativos do RPG Maker MZ. **Nao editaveis** via Plugin Parameters do VisuStella Message Core.

---

## Global Text Codes

Funcionam em qualquer janela de texto do jogo.

| Text Code | Efeito |
|-----------|--------|
| `\V[x]` | Valor da variavel x |
| `\N[x]` | Nome do actor x |
| `\P[x]` | Nome do party member x (posicao na ordem do grupo) |
| `\C[x]` | Cor do texto conforme window skin color x |
| `\I[x]` | Desenha icon x |
| `\PX[x]` | Move posicao x do texto para x pixels |
| `\PY[x]` | Move posicao y do texto para y pixels |
| `\G` | Unidade de moeda (exibe nome da moeda) |
| `\{` | Aumenta font size em 1 step |
| `\}` | Diminui font size em 1 step |
| `\FS[x]` | Muda font size para x |
| `\\` | Backslash character (exibe `\` literal) |

---

## Message Window Only

Funcionam **apenas** na Message Window durante diálogos.

| Text Code | Efeito |
|-----------|--------|
| `\$` | Abre gold window |
| `\.` | Espera 1/4 segundo (15 frames) |
| `\|` | Espera 1 segundo (60 frames) |
| `\!` | Espera input de botao do jogador |
| `\>` | Mostra texto restante de uma vez (sem pausa entre caracteres) |
| `\<` | Cancela efeito de mostrar tudo de uma vez |
| `\^` | Nao espera input apos mostrar texto (avanca automaticamente) |

---

## Notas

- Os text codes `\V[x]`, `\N[x]`, `\P[x]` suportam operadores matematicos no indice (ex: `\V[1 + 2]`).
- `\C[x]` utiliza o indice de cor definido no `Window.png` da window skin (0 a 31).
- `\I[x]` referencia o icon index do IconSet.
- `\FS[x]` define o tamanho absoluto da fonte; `\{` e `\}` ajustam relativamente.
- Os codes de Message Window Only (`\$`, `\.`, `\|`, `\!`, `\>`, `\<`, `\^`) nao produzem efeito em outras janelas como Help Window ou Gold Window.
