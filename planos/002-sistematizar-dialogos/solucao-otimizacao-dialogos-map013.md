# Solucao Corrigida de Otimizacao dos Dialogos do Map013

Fonte revisada: `Jhonny/data/Map013.json`, mapa `Estrada_VN3`.

Esta correcao substitui a proposta anterior de um menu central com uma opcao
livre de "decisao final". Essa proposta nao preserva a logica real do mapa.

## Conclusao Principal

A escolha de furar o pneu nao pode virar uma opcao global chamada "Decisao
Final".

No `Map013`, a decisao "Corte o pneu do Opala e impeca Jonny de correr" so
aparece depois de uma sequencia especifica de escolhas. O mapa nao grava essa
liberacao em switches; a liberacao esta embutida na propria arvore aninhada de
`Show Choices`.

Portanto, qualquer refatoracao precisa preservar esse gate narrativo de uma
destas formas:

1. manter essa parte como arvore aninhada;
2. ou criar uma maquina de estado explicita com variaveis de progresso;
3. ou usar um menu central apenas com opcoes bloqueadas/desbloqueadas por
   estado, nunca com "Decisao Final" sempre visivel.

## Evidencia do Mapa

- `Map013` tem 446 comandos `Show Choices`.
- Existem 12 grupos unicos de escolhas recorrentes.
- O mapa nao usa `Label`, `Jump to Label`, `Conditional Branch` ou `Control
  Switches` para controlar esse dialogo.
- Existem 20 transferencias no `Map013`:
  - 19 comandos de transferencia cujo primeiro destino e `Map006`;
  - 1 transferencia final para `Map001` depois de setar `VAR_RACE_ID = 3`.
- Nao existe transferencia direta de `Map013` para `Map012`.
- Simulando todas as escolhas do interpreter, existem 934 sequencias completas:
  - 915 sequencias limpas caem em `Map001` com `VAR_RACE_ID = 3`;
  - 18 sequencias de sabotagem transferem para `Map006` e encerram com `Exit
    Event Processing`;
  - 1 sequencia de sabotagem transfere primeiro para `Map006`, mas nao tem
    `Exit Event Processing` logo depois. Pela leitura estatica do interpreter,
    ela continua ate o final do evento e tambem executa `VAR_RACE_ID = 3 ->
    Map001`. Isso precisa de Playtest antes de ser tratado como comportamento
    perceptivel final.
- A tabela completa de sequencias gerada por parser esta em
  `builds/fase1/map013-sequencias-destinos.tsv`.

O caminho para `Map012` e indireto:

```text
Map013
  -> VAR_RACE_ID = 3
  -> Map001
  -> corrida / Common Events
  -> se VAR_VITORIA_PASSOU = 1
  -> Map016 (Batida)
  -> Map012 (FIM_FALSE_Formatura_False)
```

O caminho pretendido para `Map006` e direto:

```text
Map013
  -> escolha final "Corte o pneu do Opala..."
  -> Map006 (FIM_TRUE_Estrada_VN4_SABOTAGEM)
```

Mas ha uma excecao estrutural: uma das 19 sequencias que escolhem "Corte o
pneu..." nao executa `Exit Event Processing` apos o transfer para `Map006`.
Se o interpreter continuar depois do transfer, esse ramo ainda pode cair no
transfer final para `Map001`.

## Gate Real Para Furar o Pneu

O gate final aparece sempre depois de Jonny recusar entregar as chaves:

```text
Chance: Eu ja tive o suficiente. De-me as chaves do Opala.
Jonny: Eu nunca farei isso. Adeus, acaso...

Escolhas:
- Deixe Jonny correr.
- Corte o pneu do Opala e impeca Jonny de correr.
```

Esse grupo final aparece 19 vezes. Em todas elas, "Corte o pneu..." leva para
um primeiro transfer para `Map006`. Em 18 delas o evento encerra logo depois.
Em 1 delas o evento nao encerra e pode continuar ate `Map001`. A alternativa
"Deixe Jonny correr." cai no fluxo de corrida e depois no falso.

## Sequencias Que Levam ao Map006

Todas as sequencias abaixo terminam em:

```text
Corte o pneu do Opala e impeca Jonny de correr.
```

| # | Sequencia antes de "Corte o pneu..." | Payload antes do Map006 |
|---|---|---|
| 1 | E isso! Tire no acelerador! -> Voce diz isso toda vez, exibicionista. -> Curva do Diabo! Nao faz sentido nenhum. E por isso que voce ganha tudo. -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | transferencia direta |
| 2 | E isso! Tire no acelerador! -> Voce diz isso toda vez, exibicionista. -> Jonny, voce esta falando sobre a Curva do Diabo? -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | transferencia direta |
| 3 | E isso! Tire no acelerador! -> Voce e... diferente. Aconteceu alguma coisa? -> Esqueca. Provavelmente e apenas mais uma briga. Vai ficar tudo bem em breve -> Curva do Diabo! Nao faz sentido nenhum. E por isso que voce ganha tudo. -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | transferencia direta |
| 4 | E isso! Tire no acelerador! -> Voce e... diferente. Aconteceu alguma coisa? -> Esqueca. Provavelmente e apenas mais uma briga. Vai ficar tudo bem em breve -> Jonny, voce esta falando sobre a Curva do Diabo? -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | transferencia direta |
| 5 | E isso! Tire no acelerador! -> Voce e... diferente. Aconteceu alguma coisa? -> Voce realmente gostou dela, nao e? -> Voce esta se distraindo. Concentre-se na corrida! Voce vai fazer a Curva do Diabo? -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | `track_poli = 1`; sem `Exit Event Processing`; leitura estatica continua ate `VAR_RACE_ID = 3 -> Map001` |
| 6 | E isso! Tire no acelerador! -> Voce e... diferente. Aconteceu alguma coisa? -> Voce realmente gostou dela, nao e? -> Nao posso dar conselhos sobre namoro, mas conheco corridas. Essa faixa tem Devil's Curve: mantenha o foco. -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | `track_poli = 1` |
| 7 | E isso! Tire no acelerador! -> Voce e... diferente. Aconteceu alguma coisa? -> Voce realmente gostou dela, nao e? -> Vamos conversar, Jonny. Nao acho que seja uma boa ideia voce correr enquanto esta com a cabeca quente. -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | transferencia direta |
| 8 | O ultimo ano do ensino medio nao e facil para ninguem, nem mesmo para o grande Jonny. -> Voce diz isso toda vez, exibicionista. -> Curva do Diabo! Nao faz sentido nenhum. E por isso que voce ganha tudo. -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | transferencia direta |
| 9 | O ultimo ano do ensino medio nao e facil para ninguem, nem mesmo para o grande Jonny. -> Voce diz isso toda vez, exibicionista. -> Jonny, voce esta falando sobre a Curva do Diabo? -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | transferencia direta |
| 10 | O ultimo ano do ensino medio nao e facil para ninguem, nem mesmo para o grande Jonny. -> Voce e... diferente. Aconteceu alguma coisa? -> Esqueca. Provavelmente e apenas mais uma briga. Vai ficar tudo bem em breve -> Curva do Diabo! Nao faz sentido nenhum. E por isso que voce ganha tudo. -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | transferencia direta |
| 11 | O ultimo ano do ensino medio nao e facil para ninguem, nem mesmo para o grande Jonny. -> Voce e... diferente. Aconteceu alguma coisa? -> Esqueca. Provavelmente e apenas mais uma briga. Vai ficar tudo bem em breve -> Jonny, voce esta falando sobre a Curva do Diabo? -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | transferencia direta |
| 12 | O ultimo ano do ensino medio nao e facil para ninguem, nem mesmo para o grande Jonny. -> Voce e... diferente. Aconteceu alguma coisa? -> Voce realmente gostou dela, nao e? -> Voce esta se distraindo. Concentre-se na corrida! Voce vai fazer a Curva do Diabo? -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | `track_poli = 1` |
| 13 | O ultimo ano do ensino medio nao e facil para ninguem, nem mesmo para o grande Jonny. -> Voce e... diferente. Aconteceu alguma coisa? -> Voce realmente gostou dela, nao e? -> Nao posso dar conselhos sobre namoro, mas conheco corridas. Essa faixa tem Devil's Curve: mantenha o foco. -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | `track_poli = 1` |
| 14 | O ultimo ano do ensino medio nao e facil para ninguem, nem mesmo para o grande Jonny. -> Voce e... diferente. Aconteceu alguma coisa? -> Voce realmente gostou dela, nao e? -> Vamos conversar, Jonny. Nao acho que seja uma boa ideia voce correr enquanto esta com a cabeca quente. -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | transferencia direta |
| 15 | O que aconteceu, Johnny? -> Esqueca. Provavelmente e apenas mais uma briga. Vai ficar tudo bem em breve -> Curva do Diabo! Nao faz sentido nenhum. E por isso que voce ganha tudo. -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | toca SE `flat tire` |
| 16 | O que aconteceu, Johnny? -> Esqueca. Provavelmente e apenas mais uma briga. Vai ficar tudo bem em breve -> Jonny, voce esta falando sobre a Curva do Diabo? -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | `track_poli = 1` |
| 17 | O que aconteceu, Johnny? -> Voce realmente gostou dela, nao e? -> Voce esta se distraindo. Concentre-se na corrida! Voce vai fazer a Curva do Diabo? -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | `track_poli = 1` |
| 18 | O que aconteceu, Johnny? -> Voce realmente gostou dela, nao e? -> Nao posso dar conselhos sobre namoro, mas conheco corridas. Essa faixa tem Devil's Curve: mantenha o foco. -> Isso e uma loucura. Prometa-me que nao fara essa curva. Nao acho que seja uma boa ideia voce correr, voce nao e voce mesmo... -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | `track_poli = 1` |
| 19 | O que aconteceu, Johnny? -> Voce realmente gostou dela, nao e? -> Vamos conversar, Jonny. Nao acho que seja uma boa ideia voce correr enquanto esta com a cabeca quente. -> Johnny, do que voce esta falando? Quase parece... voce esta bem, cara? -> Pare de tentar mudar de assunto. | transferencia direta |

## Escolhas Que Levam ao Map012

Nenhuma escolha do `Map013` transfere diretamente para `Map012`.

O que existe sao sequencias que caem no fluxo de corrida. Depois disso, o mapa
seta `VAR_RACE_ID = 3` e transfere para `Map001`. No Common Event
`EV_VitoriaCorrida`, quando `VAR_VITORIA_PASSOU = 1` e `VAR_RACE_ID = 3`, a
corrida transfere para `Map016`; `Map016` transfere para `Map012`. Quando
`VAR_VITORIA_PASSOU != 1`, o Common Event chama `EV_RaceOrchestrator` de novo.

Portanto, a resposta exata e:

- `Map013` nunca chama `Map012` diretamente.
- 915 sequencias completas limpas chegam primeiro/finalmente em `Map001` com
  `VAR_RACE_ID = 3`.
- Essas 915 sequencias sao as que levam ao falso por corrida/acidente, isto e,
  `Map001 -> Map016 -> Map012` depois da conclusao da corrida.
- Existe ainda 1 sequencia de sabotagem mal encerrada que transfere primeiro
  para `Map006`, mas pela leitura estatica continua ate `Map001`; ela esta
  marcada como `map006_missing_exit_then_map001_static` na tabela de evidencia
  e precisa de Playtest antes de ser tratada como destino perceptivel final.

Agrupamento das 915 sequencias limpas pelo ultimo texto escolhido antes de
`VAR_RACE_ID = 3 -> Map001`:

| Ultima escolha da sequencia limpa | Sequencias completas | Resultado indireto |
|---|---:|---|
| Entao vamos tomar outra cerveja! | 256 | `Map001 -> Map016 -> Map012` apos conclusao da corrida |
| Tem certeza de que deveria correr assim? Talvez voce devesse ficar de fora... | 256 | `Map001 -> Map016 -> Map012` apos conclusao da corrida |
| Nao vou deixar voce correr. De-me as chaves do Opala. | 256 | `Map001 -> Map016 -> Map012` apos conclusao da corrida |
| Tudo bem! Vamos tomar uma cerveja para nos aquecer antes da corrida! | 128 | `Map001 -> Map016 -> Map012` apos conclusao da corrida |
| Deixe Jonny correr. | 19 | `Map001 -> Map016 -> Map012` apos conclusao da corrida |

As 934 sequencias completas estao enumeradas em
`builds/fase1/map013-sequencias-destinos.tsv`. Use as colunas
`status`, `map012_indirect`, `payload` e `choices` para ver exatamente quais
escolhas pertencem a cada desfecho.

## Correcao da Solucao Recomendada

### O Que Nao Fazer

Nao criar um menu principal fixo com:

```text
- corrida
- bebida
- Curva do Diabo
- relacao/Chance
- decisao final
```

Isso quebraria o desenho atual porque "decisao final" ficaria acessivel antes
de o jogador chegar ao ponto narrativo em que Jonny recusa entregar as chaves.

### O Que Fazer

A refatoracao segura e um modelo hibrido com estado:

1. Manter a navegacao principal no `Map013`.
2. Extrair apenas blocos repetidos de fala, busto e transicao para Common
   Events.
3. Criar uma tabela de estados ou flags para desbloqueios narrativos, se o mapa
   for convertido para menu central.
4. Tratar o gate "Deixe Jonny correr / Corte o pneu" como grupo bloqueado, nao
   como opcao global.
5. Preservar payloads terminais diferentes:
   - transferencia simples para `Map006`;
   - `track_poli = 1` antes de `Map006`;
   - SE `flat tire` antes/ao redor do ramo de sabotagem;
   - o ramo atual sem `Exit Event Processing`, decidindo explicitamente se a
     refatoracao vai preservar ou corrigir esse comportamento;
   - queda para `Map001 -> Map016 -> Map012`.

## Modelo de Estado Recomendado

Se o mapa for refeito com menu central, usar uma variavel de estado narrativa,
por exemplo:

```text
VN3_STATE = 0   inicio
VN3_STATE = 10  Jonny falou da corrida / pressao inicial
VN3_STATE = 20  Curva do Diabo contextualizada
VN3_STATE = 30  problema emocional/Chance contextualizado
VN3_STATE = 40  jogador confrontou o risco da corrida
VN3_STATE = 50  jogador pediu as chaves e Jonny recusou
VN3_STATE = 90  terminal
```

O grupo "Deixe Jonny correr / Corte o pneu" so pode aparecer quando o estado
equivalente a `VN3_STATE >= 50` for atingido.

## Classificacao Corrigida dos Grupos

A classificacao anterior `loop / advance / exit` e insuficiente.

Cada grupo precisa registrar:

- `kind`: `loop`, `advance`, `gate`, `exit`;
- `unlock_state`: estado minimo para aparecer;
- `terminal_target`: `Map006`, `Map001 -> Map016 -> Map012`, ou outro;
- `terminal_payload`: variaveis, SEs e Exit Event Processing;
- `source_paths`: quais sequencias atuais chegam ao grupo.

## Ordem Segura de Refatoracao

1. Congelar uma tabela de caminhos terminais antes de editar o JSON.
2. Criar a maquina de estado do `Map013`.
3. Migrar os blocos repetidos de fala/expressao para Common Events.
4. Manter o grupo "Deixe Jonny correr / Corte o pneu" bloqueado por estado.
5. Validar por parser que continuam existindo:
   - 19 sequencias que escolhem "Corte o pneu...";
   - 18 sequencias de sabotagem que transferem para `Map006` e encerram;
   - 1 sequencia de sabotagem atualmente sem `Exit Event Processing`, se ela
     nao for corrigida no JSON;
   - 915 sequencias limpas que caem no falso via
     `Map001 -> Map016 -> Map012`;
   - payloads `track_poli = 1`, SE `flat tire` e `VAR_RACE_ID = 3` onde
     existiam.
6. Validar em Playtest os dois macrodesfechos:
   - sabotagem: `Map013 -> Map006`;
   - falso: `Map013 -> Map001 -> Map016 -> Map012`.

## Resumo

A solucao correta nao e "menu central + decisao final".

A solucao correta e:

- preservar o gate narrativo da decisao de furar o pneu;
- transformar a arvore em maquina de estado se quiser reduzir repeticao;
- extrair somente blocos repetidos para Common Events;
- preservar os destinos e payloads terminais.

Isso reduz duplicacao sem perder a condicao narrativa que libera a sabotagem.
