# Choice Plugin Commands

Plugin: VisuMZ_0_MessageCore

## Visao Geral

Comandos de plugin para controlar a janela de escolhas (Show Choices), incluindo distancia em relacao a Message Window e propriedades de layout.

---

## Choices: Distance

Muda a distancia entre a choice window e a message window.

| Parametro | Tipo | Default | Observacao |
|---|---|---|---|
| Distance | Numero | `0` | Distancia entre as janelas. Negativo centraliza com o espaco restante |

### Comportamento

- **Valor 0**: Choice window fica adjacentemente colada na message window.
- **Valor positivo**: Adiciona espaco entre as janelas.
- **Valor negativo**: A choice window se centraliza utilizando o espaco restante na tela.

---

## Choice: Properties

Altera propriedades de layout do Show Choices.

| Propriedade | Tipo | Default | Observacao |
|---|---|---|---|
| Choice Line Height | Pixels | — | Altura de cada linha. `0` = inalterado |
| Minimum Choice Width | Pixels | `96` | Largura minima de cada choice |
| Max Rows | Numero | — | Maximo de rows visiveis. `0` = inalterado |
| Max Columns | Numero | — | Maximo de colunas visiveis. `0` = inalterado |
| Text Alignment | Enum | — | Alinhamento do texto dentro das choices |

### Valores de Text Alignment

- Left
- Center
- Right
