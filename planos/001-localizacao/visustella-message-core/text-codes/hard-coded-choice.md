# Choice Window-Only Hard-Coded Text Codes

Text codes exclusivos da Choice Window do VisuStella Message Core. Funcionam apenas dentro de choices (Show Choices event command).

---

## Show/Hide Choices

Controlam visibilidade das choices baseado em switches do jogo.

| Text Code | Effect |
|-----------|--------|
| `<Show>` | Choice sempre visivel |
| `<Show Switch: x>` | Visivel se switch x ON |
| `<Show Switches: x,x,x>` | Visivel se TODOS switches ON |
| `<Show All Switches: x,x,x>` | Visivel se TODOS switches ON |
| `<Show Any Switches: x,x,x>` | Visivel se QUALQUER switch ON |
| `<Hide>` | Choice sempre escondida |
| `<Hide Switch: x>` | Escondida se switch x ON |
| `<Hide Switches: x,x,x>` | Escondida se TODOS switches ON |
| `<Hide All Switches: x,x,x>` | Escondida se TODOS switches ON |
| `<Hide Any Switches: x,x,x>` | Escondida se QUALQUER switch ON |

---

## Enable/Disable Choices

Controlam se a choice pode ser selecionada (habilitada) ou nao (desabilitada/grayed out).

| Text Code | Effect |
|-----------|--------|
| `<Enable>` | Choice sempre habilitada |
| `<Enable Switch: x>` | Habilitada se switch x ON |
| `<Enable Switches: x,x,x>` | Habilitada se TODOS switches ON |
| `<Enable All Switches: x,x,x>` | Habilitada se TODOS switches ON |
| `<Enable Any Switches: x,x,x>` | Habilitada se QUALQUER switch ON |
| `<Disable>` | Choice sempre desabilitada |
| `<Disable Switch: x>` | Desabilitada se switch x ON |
| `<Disable Switches: x,x,x>` | Desabilitada se TODOS switches ON |
| `<Disable All Switches: x,x,x>` | Desabilitada se TODOS switches ON |
| `<Disable Any Switches: x,x,x>` | Desabilitada se QUALQUER switch ON |

---

## Layout

Controlam largura e indentacao da choice window.

| Text Code | Effect |
|-----------|--------|
| `<Choice Width: x>` | Largura minima da area de texto. Aplica a TODA a choice window |
| `<Choice Indent: x>` | Indentacao da choice. Aplica apenas a choice atual |

---

## Background Colors

Requer plugin **VisuMZ_0_CoreEngine** instalado.

| Text Code | Effect |
|-----------|--------|
| `<BgColor: x>` | Cor de fundo usando text color index x |
| `<BgColor: x,y>` | Gradiente de text color x para text color y |
| `<BgColor: #rrggbb>` | Cor de fundo usando hex |
| `<BgColor: #rrggbb, #rrggbb>` | Gradiente usando hex |

---

## Help Window

Mostra uma help window adicional quando a choice e hovered/selecionada.

| Text Code | Effect |
|-----------|--------|
| `<Help> text </Help>` | Mostra help window com 'text'. Desaparece se choice sem texto |

---

## Shuffle

Embaralha a ordem das choices aleatoriamente.

| Text Code | Effect |
|-----------|--------|
| `<Shuffle>` | Embaralha ordem de todas as choices |
| `<Shuffle: x>` | Embaralha e mostra apenas x choices. Hidden choices NAO contam para x |

---

## Background Images

Imagens carregadas de `img/pictures/`. Escaladas para cobrir toda a area da choice.

| Text Code | Effect |
|-----------|--------|
| `<BgImg: filename>` | Imagem de fundo stretch na choice rect |
| `<BgImg LowerLeft: filename>` | Scale para lower left |
| `<BgImg LowerRight: filename>` | Scale para lower right |
| `<BgImg MidLeft: filename>` | Scale para middle left |
| `<BgImg Center: filename>` | Scale para center |
| `<BgImg MidRight: filename>` | Scale para middle right |
| `<BgImg UpperLeft: filename>` | Scale para upper left |
| `<BgImg UpperRight: filename>` | Scale para upper right |

**Notas:**
- Imagem menor que choice sera escalada para cobrir toda a area
- Limpa o dim background padrao
- Apenas 1 background image por choice
- Pode combinar 1 background image + 1 foreground image
- Imagem fica ATRAS do cursor

---

## Foreground Images

Imagens carregadas de `img/pictures/`. NAO escaladas alem do tamanho original.

| Text Code | Effect |
|-----------|--------|
| `<FgImg: filename>` | Imagem de foreground stretch na choice rect |
| `<FgImg LowerLeft: filename>` | Scale para lower left |
| `<FgImg LowerRight: filename>` | Scale para lower right |
| `<FgImg MidLeft: filename>` | Scale para middle left |
| `<FgImg Center: filename>` | Scale para center |
| `<FgImg MidRight: filename>` | Scale para middle right |
| `<FgImg UpperLeft: filename>` | Scale para upper left |
| `<FgImg UpperRight: filename>` | Scale para upper right |

**Notas:**
- Foreground NAO escala alem do tamanho original da imagem
- Texto fica em cima da imagem
- Apenas 1 foreground image por choice
- Fica ATRAS do cursor
