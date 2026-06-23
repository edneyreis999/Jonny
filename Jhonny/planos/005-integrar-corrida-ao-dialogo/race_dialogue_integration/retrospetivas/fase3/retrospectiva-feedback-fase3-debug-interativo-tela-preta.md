# Retrospectiva Tecnica - Feedback Fase 3 Debug Interativo Tela Preta

## 1. Resumo da tarefa

O usuario trouxe feedback de Playtest apos a implementacao da Fase 3:

- Ao perder a corrida 1 ou 2 e apertar espaco na tela de resultado, o jogo ficava preso em tela preta.
- Ao ganhar a corrida 1 e 2, o jogo nao seguia para a corrida 3.

Resultado entregue:

- O feedback foi investigado sem alterar arquivos, seguindo o fluxo de uma pergunta por turno.
- Foi confirmado que a ida para a corrida 3 **nao** era esperada: pela Fase 3, vitoria na corrida 1 leva ao mapa narrativo `Map005` e vitoria na corrida 2 leva a `Map013`.
- Foi identificado um diagnostico confirmado para a tela preta na derrota: o fluxo de derrota termina no `Map001` com a corrida desligada, mas o evento `Init Corrida` nao consegue reiniciar a corrida porque ja foi apagado por `Erase Event` no carregamento atual do mapa.
- Foi produzida uma proposta cirurgica de correcao, mas nenhuma alteracao foi aplicada porque o usuario ainda nao deu consentimento explicito.

Criterios que indicaram sucesso da investigacao:

- Zero duvidas pendentes antes da sintese final.
- Evidencias confirmadas por logs e por comandos simples executados pelo usuario no console.
- Causa raiz vinculada a fatos observaveis do runtime, sem depender de suposicoes nao verificadas.

Restricoes, ferramentas e formatos relevantes:

- Skill `loki-feedback`: sem escrita em arquivos, uma pergunta por turno, proposta somente com zero duvidas.
- Dominio RPG Maker MZ: `Common Events`, `Map001`, switches, variaveis, pictures e estado do interpreter.
- Ferramenta principal de diagnostico: comandos simples no console do jogo executados pelo usuario e retornados no chat.

## 2. Decisoes tecnicas e inferencias

### Decisao 1

- **Decisao ou inferencia:** Normalizar o feedback em dois comportamentos separados: derrota com tela preta e expectativa sobre corrida 3.
- **Motivo:** O feedback continha um bug confirmado e uma duvida de escopo/produto no mesmo texto.
- **Evidencia disponivel:** O usuario relatou tanto o travamento na derrota quanto o comportamento apos vencer as corridas 1 e 2.
- **Resultado:** Funcionou.
- **Avaliacao:** Necessaria.
- **Melhoria futura:** Em feedbacks mistos, explicitar desde o inicio quais pontos sao bug e quais sao confirmacao de comportamento esperado.

### Decisao 2

- **Decisao ou inferencia:** Priorizar comandos de console executados pelo usuario em vez de abrir o codebase imediatamente.
- **Motivo:** A skill exigia dialogo investigativo e o problema era runtime.
- **Evidencia disponivel:** O usuario ja trouxe logs `RACE_EVENT` ricos em estado de variaveis e switches.
- **Resultado:** Funcionou muito bem.
- **Avaliacao:** Necessaria.
- **Melhoria futura:** Quando o feedback vier com logs de runtime, comecar pelo menor conjunto de comandos que separa "fluxo ainda rodando" de "fluxo morto".

### Decisao 3

- **Decisao ou inferencia:** Testar primeiro em qual mapa o jogo estava preso.
- **Motivo:** Sem isso nao dava para diferenciar falha de transfer, falha de renderer ou falha de reinicializacao local.
- **Evidencia disponivel:** O usuario nao sabia em qual mapa estava; a tela estava preta.
- **Resultado:** Funcionou.
- **Avaliacao:** Necessaria.
- **Melhoria futura:** Em bugs de tela preta, a primeira coleta deve incluir `mapId`, posicao do jogador e switches centrais.

### Decisao 4

- **Decisao ou inferencia:** Verificar se havia pictures residuais, interpreter rodando e Common Event reservado antes de afirmar a causa.
- **Motivo:** A tela preta poderia vir tanto de um evento travado quanto de estado morto com overlay residual.
- **Evidencia disponivel:** O usuario reportou ausencia de HUD e dialogo, mas nao o estado interno do mapa.
- **Resultado:** Funcionou.
- **Avaliacao:** Necessaria.
- **Melhoria futura:** Tratar esse trio como pacote minimo de triagem para bugs de fluxo no RPG Maker MZ:
  - pictures residuais
  - `isRunning()`
  - `isCommonEventReserved()`

### Decisao 5

- **Decisao ou inferencia:** Investigar explicitamente o `_erased` do evento `Init Corrida`.
- **Motivo:** O usuario levantou a hipotese de que `Erase Event` pudesse estar ligado ao bug.
- **Evidencia disponivel:** A Fase 1 havia inserido `Erase Event` nas paginas 1, 2 e 3 do `Init Corrida`.
- **Resultado:** Funcionou.
- **Avaliacao:** Necessaria e orientada por uma boa hipotese do usuario.
- **Melhoria futura:** Quando um usuario levantar uma hipotese plausivel com impacto estrutural, converter a hipotese em checagem objetiva em vez de aceitar ou rejeitar verbalmente.

### Decisao 6

- **Decisao ou inferencia:** Concluir que o problema era o fluxo de derrota depender do reinicio do mesmo mapa, apesar do `Init Corrida` estar apagado no carregamento atual.
- **Motivo:** Era preciso ligar todos os fatos de runtime a um mecanismo unico.
- **Evidencia disponivel:**
  - `mapId = 1`
  - `SW_RACE_ACTIVE = false`
  - `SW_PAUSED = false`
  - `isRunning() = false`
  - `isCommonEventReserved() = false`
  - `Init Corrida` com `_erased = true`
  - `findProperPageIndex() = 1`
  - `VAR_RACE_ID = 1`, `VAR_VITORIA_PASSOU = 0` na derrota da corrida 1
- **Resultado:** Funcionou.
- **Avaliacao:** Necessaria.
- **Melhoria futura:** A analise tecnica e as tasks deveriam ter antecipado explicitamente o risco "derrota no mesmo carregamento + autorun apagado".

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta ou comando | Objetivo | Resultado | Contribuiu? | Substituivel? | Como evitar redundancia |
| --- | --- | --- | --- | --- | --- |
| Logs `RACE_EVENT` trazidos pelo usuario | Entender estado de runtime no momento de `SAFE_CLICK`, `VICTORY` e `CRASH` | Mostraram `VITORIA_PASSOU=0`, `RACE_ACTIVE` desligando no `CRASH` e estado da corrida | Sim | Nao | Sempre comecar pela leitura do proprio feedback antes de pedir novos comandos |
| `console.log($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gameSwitches.value(100), $gameSwitches.value(104))` | Descobrir mapa, posicao e switches centrais na tela preta | Confirmou `Map001`, `(4,5)`, `RACE_ACTIVE=false`, `PAUSED=false` | Sim | Nao | Em bugs de tela preta, usar como comando inicial padrao |
| `console.log($gameScreen._pictures.filter(Boolean).map(...))` | Verificar residuos visuais | Confirmou apenas `race/overlay_flash_white` residual | Sim | Nao | Incluir cedo quando o sintoma for visual |
| `console.log($gameMap.event(1)?._erased, $gameMap.event(1)?.event()?.name)` | Confirmar estado do `Init Corrida` | Mostrou `_erased=true` no evento `Init Corrida` | Sim | Nao | Comandos sobre `_erased` sao mais uteis que tentar inferir visualmente o estado do autorun |
| `console.log($gameVariables.value(100), $gameVariables.value(117), $gameVariables.value(112), $gameVariables.value(116))` | Fechar estado de corrida/derrota | Confirmou na corrida 1: `1 0 1 0` | Sim | Nao | Pedir para uma corrida especifica quando houver possibilidade de mistura entre Race 1 e Race 2 |
| `console.log($gameMap._interpreter.isRunning(), $gameTemp.isCommonEventReserved())` | Distinguir fluxo travado de fluxo morto | Confirmou `false false` | Sim | Nao | Usar antes de propor qualquer causa envolvendo deadlock de event command |
| `console.log($gameMap.event(1)?.findProperPageIndex())` | Verificar se ainda havia pagina valida para o `Init Corrida` | Confirmou `1`, ou seja, pagina valida existe apesar de o evento estar apagado | Sim | Nao | Excelente comando para diferenciar "condicao nao bate" de "evento apagado" |
| `console.log($gameMap.event(1)?.pageIndex(), ...)` | Tentar inspecionar pagina atual | Falhou porque `pageIndex` nao e funcao | Nao diretamente | Sim | Preferir `findProperPageIndex()` em `Game_Event` |

## 4. Intervencoes e correcoes do usuario

### Intervencao 1

- **Instrucao dada pelo usuario:** Relato de que ganhar a corrida 1 e 2 nao levava para a corrida 3, acompanhado da pergunta "isso esta correto, certo?".
- **O que estava incorreto, incompleto ou desalinhado antes da intervencao:** Havia ambiguidade entre bug real e expectativa de produto.
- **Qual suposicao ou interpretacao causou o problema:** Nao havia erro da LLM; a ambiguidade estava no proprio feedback inicial.
- **Como a execucao mudou depois da correcao:** A investigacao passou a tratar essa parte como confirmacao de comportamento esperado da Fase 3, nao como defeito.
- **Qual regra reutilizavel pode impedir que isso aconteca novamente:** Separar sempre "bug observado" de "duvida sobre comportamento esperado".

### Intervencao 2

- **Instrucao dada pelo usuario:** Hipotese de que o bug podia estar ligada ao `Erase Event` do `Init Corrida`.
- **O que estava incorreto, incompleto ou desalinhado antes da intervencao:** A investigacao ainda nao tinha verificado o estado do evento autorun no runtime.
- **Qual suposicao ou interpretacao causou o problema:** Nenhum erro; foi uma contribuicao diagnostica valida do usuario.
- **Como a execucao mudou depois da correcao:** A investigacao passou a consultar `_erased` e depois `findProperPageIndex()`, o que fechou a causa raiz.
- **Qual regra reutilizavel pode impedir que isso aconteca novamente:** Hipoteses estruturais do usuario devem ser tratadas como pistas de alta prioridade quando sao verificaveis por um comando simples.

### Intervencao 3

- **Instrucao dada pelo usuario:** Comentario explicito de que adorou o debug interativo, com comandos simples no terminal/console e retorno no chat.
- **O que estava incorreto, incompleto ou desalinhado antes da intervencao:** Nada incorreto; isto revelou uma preferencia de colaboracao.
- **Qual suposicao ou interpretacao causou o problema:** Nao se aplica.
- **Como a execucao mudou depois da correcao:** Passa a existir uma preferencia confirmada do usuario sobre o estilo de investigacao.
- **Qual regra reutilizavel pode impedir que isso aconteca novamente:** Para bugs de runtime ou Playtest, priorizar diagnostico interativo com comandos pequenos e observaveis antes de propor patches.

## 5. Analise de desperdicio

### Desperdicio 1

- **O que aconteceu:** Foi pedido um comando invalido com `pageIndex()`.
- **Impacto estimado:** Baixo.
- **Causa:** Lembranca imprecisa da API de `Game_Event`.
- **Como evitar:** Em RPG Maker MZ, preferir `findProperPageIndex()` quando a pergunta e sobre elegibilidade de pagina no runtime.

### Desperdicio 2

- **O que aconteceu:** Houve uma rodada extra para distinguir se os valores `2 0 3 0` vinham da corrida 1 ou 2.
- **Impacto estimado:** Baixo.
- **Causa:** O feedback inicial trazia logs de duas corridas e um dos dumps de variavel ficou sem contexto inequívoco.
- **Como evitar:** Quando houver multiplos cenarios parecidos, pedir desde cedo um reteste controlado em apenas um deles.

### Desperdicio 3

- **O que aconteceu:** A investigacao demorou alguns turnos para chegar ao estado do interpreter e do evento apagado.
- **Impacto estimado:** Medio.
- **Causa:** A triagem seguiu uma ordem segura, mas nao a ordem minima ideal.
- **Como evitar:** Para bugs de "tela preta sem HUD/dialogo", o pacote minimo pode ser pedido quase de uma vez em uma sessao humana comum, mas nesta skill isso precisa ser sequenciado em perguntas individuais planejadas melhor.

### Desperdicio 4

- **O que aconteceu:** O feedback positivo sobre o debug interativo so apareceu no final e nao estava no prompt inicial.
- **Impacto estimado:** Baixo.
- **Causa:** Preferencia de colaboracao do usuario ainda nao estava conhecida.
- **Como evitar:** Em sessoes futuras de bug runtime, assumir como heuristica preferida do usuario o modelo "rode este comando simples e me diga o resultado".

## 6. Caminho minimo recomendado

1. **Acao:** Normalizar o feedback em bug real e comportamento esperado.
   - **Entrada:** relato do usuario e logs fornecidos.
   - **Ferramenta:** nenhuma.
   - **Resultado esperado:** separar "tela preta na derrota" de "duvida sobre corrida 3".
   - **Criterio:** nao misturar confirmacao de produto com diagnostico tecnico.

2. **Acao:** Confirmar se a ida para corrida 3 e esperada pela fase atual.
   - **Entrada:** plano e tasks da Fase 3.
   - **Ferramenta:** leitura local, se necessario.
   - **Resultado esperado:** fechar rapidamente que Race 1/2 vitoriosas voltam ao mapa narrativo.
   - **Criterio:** remover essa parte do conjunto de bugs.

3. **Acao:** Pedir o estado minimo da tela preta.
   - **Entrada:** usuario no jogo, tela preta reproduzida.
   - **Ferramenta:** comando de console.
   - **Resultado esperado:** `mapId`, posicao, `SW_RACE_ACTIVE`, `SW_PAUSED`.
   - **Criterio:** definir se o problema e local ao `Map001` ou um transfer errado.

4. **Acao:** Pedir pictures residuais.
   - **Entrada:** mesma tela preta.
   - **Ferramenta:** comando de console.
   - **Resultado esperado:** confirmar se sobra overlay ou HUD.
   - **Criterio:** separar black screen visual de black screen por fluxo morto.

5. **Acao:** Pedir `isRunning()` e `isCommonEventReserved()`.
   - **Entrada:** mesma tela preta.
   - **Ferramenta:** comando de console.
   - **Resultado esperado:** saber se ainda existe fluxo ativo.
   - **Criterio:** distinguir travamento de evento vs ausencia total de fluxo.

6. **Acao:** Pedir `_erased` e `findProperPageIndex()` do evento `Init Corrida`.
   - **Entrada:** mesma tela preta.
   - **Ferramenta:** comando de console.
   - **Resultado esperado:** confirmar se ha pagina valida, mas evento apagado.
   - **Criterio:** fechar a relacao entre `Erase Event` e a impossibilidade de reinicio no mesmo carregamento.

7. **Acao:** Pedir variaveis centrais de derrota para uma corrida especifica.
   - **Entrada:** reteste controlado em uma corrida so.
   - **Ferramenta:** comando de console.
   - **Resultado esperado:** `RACE_ID`, `VITORIA_PASSOU`, `ATTEMPT_N`, `TIMER_TIMEOUT_FLAG`.
   - **Criterio:** confirmar que se trata de derrota legitima e nao vitoria/transfer indevido.

8. **Acao:** Sintetizar causa raiz e proposta cirurgica sem editar nada.
   - **Entrada:** evidencias acima.
   - **Ferramenta:** nenhuma.
   - **Resultado esperado:** diagnostico confirmado e proposta minima.
   - **Criterio:** zero duvidas pendentes.

## 7. Conhecimento reutilizavel

### Fatos confirmados

- Na Fase 3, vencer a corrida 1 leva ao mapa narrativo `Map005`; vencer a corrida 2 leva a `Map013`. Nao deveria ir para a corrida 3 ainda.
- Na tela preta reproduzida apos derrota, o jogo estava no `Map001`, posicao `(4,5)`.
- Na tela preta, `SW_RACE_ACTIVE=false` e `SW_PAUSED=false`.
- Na tela preta, nao havia interpreter rodando nem Common Event reservado.
- Na tela preta, a unica picture residual era `race/overlay_flash_white`.
- Na tela preta, `Init Corrida` estava com `_erased=true`.
- Na tela preta, `findProperPageIndex()=1`, entao havia pagina valida para o evento, mas o evento apagado impedia reexecucao.
- Em reteste controlado da derrota da corrida 1: `VAR_RACE_ID=1`, `VAR_VITORIA_PASSOU=0`, `ATTEMPT_N=1`, `TIMER_TIMEOUT_FLAG=0`.

### Preferencias do usuario

- O usuario gostou explicitamente do debug interativo com comandos simples executados por ele e retorno no chat.
- Para bugs de runtime, esse estilo colaborativo deve ser priorizado.

### Restricoes tecnicas

- Na skill `loki-feedback`, nenhuma alteracao pode ser aplicada sem consentimento explicito do usuario.
- A investigacao deve fazer uma pergunta por turno.
- Em bugs de runtime RPG Maker MZ, o console do jogo e uma fonte de verdade importante e barata.

### Armadilhas conhecidas

- `pageIndex()` nao deve ser assumido como metodo disponivel de `Game_Event` nesse contexto; `findProperPageIndex()` foi o metodo util.
- Feedbacks que misturam duvida de comportamento esperado com bug tecnico podem levar a investigacao desnecessaria se nao forem separados logo no inicio.
- Logs `RACE_EVENT` com tipo `VICTORY` nao implicam vitoria real; e preciso verificar `VITORIA_PASSOU`.

### Heuristicas recomendadas

- Para bugs de tela preta em RPG Maker MZ, comecar por:
  - mapa e posicao
  - switches centrais
  - pictures residuais
  - interpreter rodando ou nao
  - estado `_erased` do evento autorun relevante
- Se o usuario trouxer uma hipotese verificavel, transforme-a imediatamente em um comando objetivo.
- Quando houver possibilidade de confusao entre duas corridas/fases, pedir reteste controlado em apenas um cenario.

## 8. Informacoes que deveriam estar no prompt inicial

- **Obrigatorio:** explicitar no proprio feedback se o problema ocorre em corrida 1, corrida 2 ou ambas, com um dump de variaveis separado por cenario.
- **Util:** incluir desde o inicio `mapId`, `RACE_ACTIVE`, `PAUSED` e `_erased` do evento de init apos o bug.
- **Util:** indicar no prompt do plano que vitoria na corrida 1/2 nao deveria iniciar corrida 3 na Fase 3, para evitar ambiguidade de expectativa.
- **Opcional:** registrar como preferencia do usuario que o debug interativo com comandos simples e bem-vindo.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na analise tecnica

#### Melhoria 1

- **Problema observado durante a execucao:** O risco de derrota desligar a corrida no `Map001` sem mecanismo de rearmar o `Init Corrida` no mesmo carregamento so apareceu no debug de runtime.
- **Informacao que estava ausente ou incorreta:** A analise previa tratava o `Erase Event` como guarda de autorun, mas nao conectava isso ao fluxo de derrota no mesmo mapa.
- **Por que essa informacao pertence a analise tecnica:** E um risco estrutural de arquitetura do fluxo `Map001` + autorun + derrota.
- **Em qual secao da analise tecnica ela deveria ser adicionada ou alterada:** `Efeitos Colaterais Confirmados` ou uma nova subsecao de riscos do `Map001`.
- **Texto sugerido para a alteracao:**

```markdown
### Risco de derrota no mesmo carregamento do Map001

Se o evento `Init Corrida` for neutralizado via `Erase Event` para evitar reinicializacao infinita do autorun, qualquer fluxo de derrota que tente reiniciar a corrida no mesmo carregamento do `Map001` precisara:

- recarregar o mapa, ou
- rearmar explicitamente a inicializacao da corrida por outro mecanismo.

Caso contrario, o `Map001` pode ficar sem HUD, sem Common Events ativos e sem novo bootstrap da corrida.
```

- **Impacto esperado na proxima execucao:** Anteciparia a causa raiz antes do Playtest e reduziria investigacao runtime.

#### Melhoria 2

- **Problema observado durante a execucao:** A duvida sobre "deveria ir para corrida 3?" apareceu como ambiguidade de produto.
- **Informacao que estava ausente ou incorreta:** O plano e a analise nao enfatizavam o suficiente, em linguagem de validacao, que Race 1 e Race 2 vitoriosas retornam ao mapa narrativo, nao a outra corrida.
- **Por que essa informacao pertence a analise tecnica:** E parte do comportamento de integracao entre corridas e narrativa.
- **Em qual secao da analise tecnica ela deveria ser adicionada ou alterada:** `Saidas Pos-Vitoria`.
- **Texto sugerido para a alteracao:**

```markdown
Importante: na Fase 3, vencer a corrida 1 ou 2 nao inicia automaticamente a corrida seguinte. A progressao volta ao mapa narrativo correspondente; a integracao da corrida 3 acontece apenas na Fase 4.
```

- **Impacto esperado na proxima execucao:** Evita diagnosticar como bug um comportamento correto da fase.

### 9.2 Melhorias no plano de implementacao

#### Melhoria 1

- **Problema observado durante a execucao:** O plano nao destacava o acoplamento entre a derrota e o mecanismo de reentrada no `Map001`.
- **Deficiencia do plano de implementacao:** A Phase 3 pedia "keep defeat inside `Map001`", mas nao explicava que isso exigia reentrada segura apesar do `Init Corrida` ter sido neutralizado na Fase 1.
- **Etapa afetada:** `Phase 3 - Victory, Defeat, and Cleanup Lifecycle`.
- **Alteracao recomendada:** Inserir uma nota estrutural na fase sobre a dependencia com o guard de `Init Corrida`.
- **Texto sugerido para a alteracao:**

```markdown
Implementation note: defeat retry on `Map001` must not assume the original `Init Corrida` autorun can fire again on the same map load, because Phase 1 intentionally neutralized repeated autorun initialization.
```

- **Como a mudanca reduziria custo, risco ou retrabalho:** Forcaria a verificacao do fluxo de derrota antes de concluir a fase.

### 9.3 Melhorias nas tasks da fase executada

#### Melhoria 1

- **Task afetada:** `task-3.1.md`
- **Informacao ausente, ambigua ou incorreta:** A task dizia para manter a derrota no `Map001`, mas nao explicitava que o retry nao podia depender do `Init Corrida` apagado no mesmo carregamento.
- **Consequencia observada durante a execucao:** O patch estrutural passou, mas o Playtest revelou tela preta apos derrota.
- **Alteracao recomendada:** Acrescentar um requisito explicito de reentrada segura no mesmo mapa.
- **Texto sugerido para incluir ou substituir:**

```markdown
Defeat retry must remain functional even though `Map001` `Init Corrida` pages were previously patched with `Erase Event`. Do not rely on that autorun firing again on the same map load unless the map is explicitly reloaded.
```

- **Como validar que a nova instrucao e suficiente:** Em revisao de task, o executor ja sabe que precisa considerar reload do mapa ou outro bootstrap equivalente.

#### Melhoria 2

- **Task afetada:** `task-3.1.md`
- **Informacao ausente, ambigua ou incorreta:** A task nao pedia validacao estrutural especifica do caminho de derrota apos o termino do CE19.
- **Consequencia observada durante a execucao:** O fluxo de derrota ficou aparentemente correto no JSON, mas morto em runtime.
- **Alteracao recomendada:** Incluir um checklist estrutural especifico do pos-derrota.
- **Texto sugerido para incluir ou substituir:**

```markdown
Post-defeat structural check:

- after CE19 defeat branch completes, either `Map001` must be reloaded or another verified bootstrap path must reactivate the race loop;
- the map must not be left with `SW_RACE_ACTIVE OFF` and no active interpreter/bootstrap path.
```

- **Como validar que a nova instrucao e suficiente:** O executor consegue revisar CE19/CE18 e identificar o risco antes do Playtest.

#### Melhoria 3

- **Task afetada:** `task-3.2.md`
- **Informacao ausente, ambigua ou incorreta:** A task focava em cleanup antes do transfer de vitoria, mas nao isolava o que deve ou nao acontecer no ramo de derrota.
- **Consequencia observada durante a execucao:** Parte do cleanup pode ter sido interpretada como geral, embora o comportamento critico estivesse na derrota.
- **Alteracao recomendada:** Delimitar explicitamente que o cleanup destrutivo de saida e para vitoria; na derrota, o sistema precisa preservar ou rearmar bootstrap.
- **Texto sugerido para incluir ou substituir:**

```markdown
Cleanup that prepares a narrative handoff belongs to victory branches only. The defeat branch may reset race state, but it must preserve or explicitly restore a valid bootstrap path for restarting the same race on `Map001`.
```

- **Como validar que a nova instrucao e suficiente:** O executor diferencia claramente "cleanup de saida" de "reset para retry".

### 9.4 Problemas fora do escopo dos artefatos

#### Problema 1

- **Problema observado:** Um comando sugerido (`pageIndex()`) nao existia no contexto usado.
- **Por que ele esta fora do escopo dos artefatos:** E um erro operacional da LLM durante a investigacao, nao uma falha do plano ou da task.
- **Como deveria ser tratado:** Melhor disciplina operacional sobre a API de runtime.
- **Se exige alguma protecao operacional, automacao, documentacao separada ou nenhuma acao:** Nenhuma alteracao nos artefatos.

#### Problema 2

- **Problema observado:** Um dump de variaveis veio sem cenario inequívoco entre corrida 1 e corrida 2.
- **Por que ele esta fora do escopo dos artefatos:** E uma limitacao normal de feedback humano durante o Playtest.
- **Como deveria ser tratado:** Pedir reteste controlado de um unico cenario.
- **Se exige alguma protecao operacional, automacao, documentacao separada ou nenhuma acao:** Nenhuma alteracao estrutural; apenas heuristica operacional.

### 9.5 Matriz de rastreabilidade das melhorias

| Problema observado | Causa principal | Artefato responsavel | Alteracao necessaria | Prioridade |
| --- | --- | --- | --- | --- |
| Tela preta apos derrota no `Map001` | Risco de retry no mesmo carregamento com `Init Corrida` apagado nao foi explicitado | Analise tecnica, plano e task | Documentar a dependencia entre `Erase Event` e retry da derrota | Alta |
| Ambiguidade sobre "deveria ir para corrida 3?" | Comportamento esperado da Fase 3 nao estava enfatizado | Analise tecnica | Explicitar que Race 1/2 vitoriosas voltam ao mapa narrativo | Media |
| Falta de validacao estrutural especifica do pos-derrota | Task focou no branch e nao no bootstrap apos termino | Task | Adicionar checks estruturais do pos-derrota | Alta |
| Comando `pageIndex()` invalido | Erro operacional de API | Fora do escopo | Nenhuma mudanca em artefatos; corrigir heuristica de debug | Baixa |
| Dump de variaveis sem cenario inequívoco | Feedback humano misto | Fora do escopo | Pedir reteste controlado em uma corrida | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a analise tecnica

```markdown
### Risco de derrota no mesmo carregamento do Map001

Se o evento `Init Corrida` for neutralizado via `Erase Event` para evitar reinicializacao infinita do autorun, qualquer fluxo de derrota que tente reiniciar a corrida no mesmo carregamento do `Map001` precisara:

- recarregar o mapa, ou
- rearmar explicitamente a inicializacao da corrida por outro mecanismo.

Caso contrario, o `Map001` pode ficar sem HUD, sem Common Events ativos e sem novo bootstrap da corrida.

Importante: na Fase 3, vencer a corrida 1 ou 2 nao inicia automaticamente a corrida seguinte. A progressao volta ao mapa narrativo correspondente; a integracao da corrida 3 acontece apenas na Fase 4.
```

#### Patch sugerido para o plano de implementacao

```markdown
### Phase 3 - Victory, Defeat, and Cleanup Lifecycle

Implementation note: defeat retry on `Map001` must not assume the original `Init Corrida` autorun can fire again on the same map load, because Phase 1 intentionally neutralized repeated autorun initialization.
```

#### Patch sugerido para as tasks da fase executada

```markdown
## Task 3.1

Defeat retry must remain functional even though `Map001` `Init Corrida` pages were previously patched with `Erase Event`. Do not rely on that autorun firing again on the same map load unless the map is explicitly reloaded.

Post-defeat structural check:

- after CE19 defeat branch completes, either `Map001` must be reloaded or another verified bootstrap path must reactivate the race loop;
- the map must not be left with `SW_RACE_ACTIVE OFF` and no active interpreter/bootstrap path.

## Task 3.2

Cleanup that prepares a narrative handoff belongs to victory branches only. The defeat branch may reset race state, but it must preserve or explicitly restore a valid bootstrap path for restarting the same race on `Map001`.
```

#### Acoes fora do fluxo de especificacao

- Em investigacoes futuras de runtime, preferir `findProperPageIndex()` a `pageIndex()` para checar elegibilidade de paginas do evento.
- Pedir reteste controlado de uma unica corrida quando o feedback misturar Race 1 e Race 2.
- Reutilizar o estilo de debug interativo com comandos simples como preferencia explicita do usuario.

## 10. Checklist operacional

- [ ] Separar bug real de duvida sobre comportamento esperado logo no inicio.
- [ ] Confirmar no plano atual se Race 1/2 deveriam ou nao levar para corrida 3.
- [ ] Em tela preta, coletar primeiro `mapId`, posicao, `RACE_ACTIVE` e `PAUSED`.
- [ ] Verificar pictures residuais.
- [ ] Verificar `isRunning()` e `isCommonEventReserved()`.
- [ ] Verificar `_erased` e `findProperPageIndex()` do evento autorun relevante.
- [ ] Pedir dump de variaveis para uma corrida especifica, nao para multiplos cenarios misturados.
- [ ] Nao propor patch enquanto houver duvida pendente.
- [ ] Tratar hipoteses estruturais do usuario como pistas de alta prioridade quando forem verificaveis.
- [ ] Em bugs de runtime, priorizar debug interativo com comandos pequenos e observaveis.
