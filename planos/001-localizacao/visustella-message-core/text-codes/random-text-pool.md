# Random Text Pool

Plugin: VisuMZ_0_MessageCore

## Visao Geral

O Random Text Pool permite exibir um texto aleatorio a partir de um pool de entradas definidas pelo usuario. Cada vez que a mensagem e processada, uma das entradas e selecionada aleatoriamente.

## Formato

```
<RNG> texto1 | texto2 | texto3 </RNG>
```

## Regras

| Regra | Detalhe |
|---|---|
| Separador | `\|` (pipe) entre entradas de texto |
| Quantidade de entradas | Ilimitada |
| Espacos em branco | Excessivos sao removidos automaticamente (trim) |
| Compatibilidade com Macros | **NAO funciona dentro de macros** |

## Exemplo

```
<RNG> Ola, viajante! | Bem-vindo, aventureiro! | Salve, heroi! </RNG>
```

Resultado: uma das tres mensagens sera exibida aleatoriamente cada vez que o texto for processado.
