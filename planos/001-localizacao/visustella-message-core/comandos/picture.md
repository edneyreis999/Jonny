# Picture Plugin Commands

Plugin: VisuMZ_0_MessageCore

## Visao Geral

Comandos de plugin para exibir, apagar e atualizar texto sobre pictures na tela. O texto suporta text codes do RPG Maker MZ e se adapta as propriedades da picture (tamanho, posicao). Settings de texto sao apagados automaticamente se a picture for apagada.

---

## Picture: Change Text

Define texto para uma ou mais pictures alvo. Suporta text codes nativos do engine.

| Parametro | Tipo | Observacao |
|---|---|---|
| Picture ID(s) | Lista de IDs | IDs das pictures que receberao o texto |
| Padding | Pixels | Padding aplicado dos lados do texto |

### Posicoes de Texto

O texto pode ser posicionado em 9 regioes da picture:

| | Esquerda | Centro | Direita |
|---|---|---|---|
| **Superior** | Upper Left | Upper Center | Upper Right |
| **Meio** | Middle Left | Middle Center | Middle Right |
| **Inferior** | Lower Left | Lower Center | Lower Right |

Cada posicao recebe seu proprio bloco de texto independente.

### Notas

- Text codes como `\n[x]`, `\v[x]`, etc. sao suportados.
- O texto se ajusta ao tamanho da picture automaticamente.
- Se a picture for apagada, todo o texto configurado e perdido.

---

## Picture: Erase Text

Apaga todo o texto associado as pictures alvo.

| Parametro | Tipo | Observacao |
|---|---|---|
| Picture ID(s) | Lista de IDs | IDs das pictures que terao o texto removido |

---

## Picture: Refresh Text

Atualiza o texto de todas as pictures atualmente na tela.

### Quando Usar

Util quando text codes dinamicos sao atualizados (por exemplo, `\n[x]` referenciando o nome de um actor). Apos alterar o valor referenciado pelo text code, chame este comando para forcar a atualizacao visual.
