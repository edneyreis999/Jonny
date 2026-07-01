# Loki Init - Dialogue Editor Inventory - Corpus de dialogo

Source index: [inventory.md](inventory.md)

## Corpus de dialogo

Contagem estatica de comandos textuais em mapas:

| Superficie | Total observado |
| --- | ---: |
| `Show Text` blocks, code 101 | 1.446 |
| Linhas de `Show Text`, code 401 | 2.343 |
| `Show Choices`, code 102 | 461 |
| Opcoes de escolha | 1.364 |
| Branches de escolha, code 402 | 1.364 |
| `Scroll Text` blocks, code 105 | 1 |
| Linhas de `Scroll Text`, code 405 | 98 |
| Blocos de comentario, code 108 | 989 |
| Linhas de comentario, code 408 | 2.129 |
| Plugin commands em mapas, code 357 | 17 |

Distribuicao por mapa com texto:

| Mapa | Nome | Show Text | Linhas | Escolhas | Opcoes | Scroll linhas | Observacao |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `Map005` | `Quarto_VN2` | 62 | 108 | 15 | 45 | 0 | Cena VN com Jonny/Chance e escolhas. |
| `Map006` | `FIM_TRUE_Estrada_VN4_SABOTAGEM` | 20 | 20 | 0 | 0 | 0 | Ending/rota true com fala. |
| `Map007` | `Formatura_True` | 9 | 10 | 0 | 0 | 0 | Cena curta de formatura. |
| `Map009` | `Celular` | 2 | 3 | 0 | 0 | 98 | Texto longo em scroll. |
| `Map010` | `Estrada_VN1` | 31 | 37 | 0 | 0 | 0 | Cena VN inicial de estrada. |
| `Map011` | `Prologo` | 1 | 4 | 0 | 0 | 0 | Aviso de conteudo inicial. |
| `Map012` | `FIM_FALSE_Formatura_False` | 9 | 12 | 0 | 0 | 0 | Ending/rota false curta. |
| `Map013` | `Estrada_VN3` | 1.310 | 2.146 | 446 | 1.319 | 0 | Maior concentracao do corpus e de branching textual. |
| `Map015` | `Formatura_True2` | 1 | 1 | 0 | 0 | 0 | Cena final curta. |
| `Map016` | `Batida` | 1 | 2 | 0 | 0 | 0 | Cena de acidente/transicao. |

`Map001`, `Map002`, `Map003`, `Map004`, `Map008` e `Map014` nao apresentaram
comandos de fala, escolha ou scroll text na contagem estatica.
