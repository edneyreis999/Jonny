# Loki Init - Dialogue Editor Inventory - Superficies de UI com texto

Source index: [inventory.md](inventory.md)

## Superficies de UI com texto

TextPicture em Common Events:

| Common Event | Texto/label observado | Papel provavel |
| --- | --- | --- |
| CE5 `EV_RaceOrchestrator` | `\V[104]%` | Valor de consciencia/percentual em picture. |
| CE6 `EV_UpdateHud` | `GLORY: \V[105]/\V[119]` | Pontuacao/meta de gloria. |
| CE6 `EV_UpdateHud` | `TRIAL \V[112]` | Tentativa/run atual. |
| CE6 `EV_UpdateHud` | `\V[104]%` | Consciencia/percentual. |
| CE6 `EV_UpdateHud` | `TIMER: \V[120]s` | Timer textual. |
| CE6 `EV_UpdateHud` | `\V[121]/\V[111]` | Progresso de cena. |
| CE8 `EV_RenderSinal` | `\V[103]%` | Probabilidade/tentacao da cena de sinal. |
| CE9 `EV_RenderCurva` | `\V[103]%` | Probabilidade/tentacao da cena de curva. |
| CE19 `EV_VitoriaCorrida` | `VICTORY!`, `DEFEAT!`, `Glory Score: \V[105]`, `Press [SPACE] to continue` | Resultado e instrucao. |

Outras superficies:

- Imagens de botao da corrida carregadas por CE8/CE9 podem conter texto
  embutido; os nomes dos assets indicam `parar`, `furar`, `direita` e
  `esquerda`.
- O sistema de message window usa speaker metadata, sem faceName.
- Foram observados text codes em linhas de mapa, principalmente `\FS[30]`,
  `\FS[40]`, `\FS[50]`, `\C[0]` e `\C[6]`; fit visual nao foi validado.
