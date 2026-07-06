# Message Plugin Commands

Plugin: VisuMZ_0_MessageCore

## Visao Geral

Comandos de plugin para alterar propriedades e posicao da Message Window durante o jogo.

---

## Message: Properties

Altera propriedades da Message Window em tempo real.

| Propriedade | Tipo | Default | Observacao |
|---|---|---|---|
| Rows | Numero | — | Numero de rows visiveis. Deixar `0` para manter inalterado |
| Width | Pixels | — | Largura em pixels. Deixar `0` para manter inalterado |
| Word Wrap | Boolean | — | Habilitar ou desabilitar Word Wrap |

---

## Message: X/Y Offsets

Altera offsets X e Y da Message Window. Os valores sao salvos e persistidos entre cenas.

| Offset | Direcao Negativa | Direcao Positiva | Observacao |
|---|---|---|---|
| Offset X | Esquerda | Direita | Coordenadas sao clampadas automaticamente |
| Offset Y | Cima | Baixo | Coordenadas sao clampadas automaticamente |

### Notas

- Os offsets acumulam com a posicao base da Message Window definida pelo engine.
- Valores fora do range valido sao ajustados (clamped) para manter a janela dentro da tela.
