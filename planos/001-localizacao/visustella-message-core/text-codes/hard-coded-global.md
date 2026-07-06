# Hard-Coded Global Text Codes

Text codes **hard-coded** do VisuStella Message Core. Nao editaveis via Plugin Parameters. Funcionam em **qualquer janela** do jogo.

---

## Formatacao de Texto

| Text Code | Efeito |
|-----------|--------|
| `<b>` | Texto fica **bold** |
| `</b>` | Remove bold |
| `<i>` | Texto fica *italic* |
| `</i>` | Remove italic |

---

## Alinhamento

**NÃO funciona com Word Wrap habilitado.** Usar no inicio da linha.

| Text Code | Efeito |
|-----------|--------|
| `<left>` | Alinhado a esquerda |
| `</left>` | Remove alinhamento a esquerda |
| `<center>` | Centralizado |
| `</center>` | Remove centralizacao |
| `<right>` | Alinhado a direita |
| `</right>` | Remove alinhamento a direita |

---

## Cor e Word Wrap

| Text Code | Efeito |
|-----------|--------|
| `<ColorLock>` | Text codes `\C[x]` nao mudam a cor do texto subsequente |
| `</ColorLock>` | Remove Color Lock |
| `<WordWrap>` | Habilita Word Wrap para esta janela |
| `</WordWrap>` | Desabilita Word Wrap |
| `<br>` | Line break (requer Word Wrap habilitado) |
| `<line break>` | Line break (requer Word Wrap habilitado) |

> **Restricoes do Word Wrap:**
> - Nao funciona em Choice Window.
> - Nao pode ser usado junto com `<left>`, `<center>`, `<right>`.
> - `<br>` e `<line break>` so funcionam quando Word Wrap esta habilitado.

---

## Pictures

| Text Code | Efeito |
|-----------|--------|
| `\picture<x>` | Desenha picture x (filename) na posicao atual do texto |
| `\CenterPicture<x>` | Desenha picture x (filename) centralizado na janela |

> **Notas sobre Pictures:**
> - Melhor resultado na Message Window.
> - Nao recomendado para Help Window ou janelas que mudam conteudo frequentemente.
> - A partir da **v1.53**, Help Window suporta estes codes.

---

## Map Name

**Requer** VisuMZ_0_CoreEngine com Map Name Text Code habilitado.

| Text Code | Efeito |
|-----------|--------|
| `<left>` | Map name alinhado a esquerda |
| `<center>` | Map name centralizado |
| `<right>` | Map name alinhado a direita |
| `<top>` | Map name no topo |
| `<middle>` | Map name no meio vertical |
| `<bottom>` | Map name embaixo |
| `<X: +n>` | Ajusta posicao horizontal do map name em +n pixels |
| `<X: -n>` | Ajusta posicao horizontal do map name em -n pixels |
| `<Y: +n>` | Ajusta posicao vertical do map name em +n pixels |
| `<Y: -n>` | Ajusta posicao vertical do map name em -n pixels |

---

## Auto-Casing

| Text Code | Efeito |
|-----------|--------|
| `<Caps>` | Texto em MAIUSCULAS. Desliga outros auto-case modes |
| `</Caps>` | Desliga auto-casing |
| `<Upper>` | Primeira letra de cada palavra maiuscula (Title Case) |
| `</Upper>` | Desliga auto-casing |
| `<Lower>` | Texto em minusculas |
| `</Lower>` | Desliga auto-casing |
| `<Alt>` | Alterna entre maiuscula e minuscula (ex: HeLlO) |
| `</Alt>` | Desliga auto-casing |
| `<Chaos>` | Randomiza maiuscula/minuscula (ex: waSsUP) |
| `</Chaos>` | Desliga auto-casing |

> **Nota:** `</Caps>`, `</Upper>`, `</Lower>`, `</Alt>`, `</Chaos>` fazem a mesma coisa e podem ser usados interchangeably. Qualquer tag de fechamento desliga qualquer modo de auto-casing ativo.

---

## Control Buttons

**Requer** VisuMZ_0_CoreEngine instalado.

| Text Code | Efeito |
|-----------|--------|
| `<Up Button>` | Mostra botao Up |
| `<Left Button>` | Mostra botao Left |
| `<Right Button>` | Mostra botao Right |
| `<Down Button>` | Mostra botao Down |
| `<Ok Button>` | Mostra botao Ok |
| `<Cancel Button>` | Mostra botao Cancel |
| `<Shift Button>` | Mostra botao Shift |
| `<Menu Button>` | Mostra botao Menu |
| `<Page Up Button>` | Mostra botao Page Up |
| `<Page Down Button>` | Mostra botao Page Down |

> **Nota:** A aparencia visual dos botoes depende das configuracoes de Gamepad/Button display do Core Engine.
