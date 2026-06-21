
# Retrospectiva técnica — CE19 WAIT_INPUT e SW_RACE_ACTIVE

Data: 2026-06-20

## 1. Resumo da tarefa

O usuário reportou uma regressão após o Patch D: ao vencer a corrida com pontos de glória suficientes, a tela de vitória ficava travada e `Space` não avançava. O objetivo era diagnosticar e corrigir o bloqueio sem reintroduzir o bug original em que o timer continuava concedendo glória durante a tela de vitória/derrota.

Resultado entregue: CE 19 (`EV_VitoriaCorrida`) deixou de desligar `SW_RACE_ACTIVE` no topo. A tela cerimonial passa a manter o parallel owner vivo, enquanto `SW_INPUT_LOCKED=ON` bloqueia o timer e handlers de corrida. O loop `WAIT_INPUT` foi robustecido com latch de continue no plugin `Jhonny_RaceHelper.js`, e `SW_PAUSED`/`SW_INPUT_LOCKED` são desligados antes do branch pós-tela.

Critério de sucesso: o usuário confirmou manualmente que venceu a corrida e conseguiu sair da tela de vitória. Antes da correção final, os logs mostravam `RACE_CONTINUE_INPUT` sem novos `RACE_WAIT_INPUT`; depois, a interação funcionou.

Arquivos relevantes:

- `Jhonny/data/CommonEvents.json`
- `Jhonny/js/plugins/Jhonny_RaceHelper.js`
- `Jhonny/planos/003-bug-fix-round1/fase1/build_phase1_ces.py`
- `Jhonny/planos/003-bug-fix-round1/fase1/build_phase1_debug_patch.py`
- `Jhonny/planos/001-prototipo-core-loop/fase6/build_phase6_ces.py`

Tecnologia/formato: RPG Maker MZ Common Events JSON, plugin JavaScript MZ, geradores Python.

## 2. Decisões técnicas e inferências

### Decisão ou inferência: `Input.isTriggered("ok")` era frágil demais

- **Motivo:** o primeiro log tinha `RACE_WAIT_INPUT ok=false latest=null`, então parecia que a borda de input não chegava ao loop.
- **Evidência disponível:** `Input.isTriggered` retorna verdadeiro por 1 frame; o usuário estava preso mesmo apertando `Space`.
- **Resultado:** funcionou parcialmente. O latch capturou `mouse` e `keyboard`, mas a tela continuou travada.
- **Avaliação:** foi uma melhoria útil de robustez, mas não era a causa raiz.
- **Melhoria futura:** antes de alterar input, verificar se o loop continua executando após o primeiro `Wait 1 frame`. Se o log do loop aparece só uma vez, investigar lifecycle do common event.

### Decisão ou inferência: criar latch de continue no plugin

- **Motivo:** o input interno do MZ continuava mostrando `latest=null`, mesmo após tornar o branch mais tolerante.
- **Evidência disponível:** depois do latch, os logs mostraram `RACE_CONTINUE_INPUT` para mouse e `Space`.
- **Resultado:** confirmou que o navegador recebia os eventos. Não resolveu sozinho porque o CE 19 não estava mais rodando.
- **Avaliação:** necessário como diagnóstico e aceitável como robustez final, mas poderia ter sido adiado até confirmar que o loop estava vivo.
- **Melhoria futura:** usar o latch apenas se houver logs repetidos de `WAIT_INPUT` sem captura de input.

### Decisão ou inferência: `SW_RACE_ACTIVE=OFF` no topo do CE 19 parava o timer

- **Motivo:** o bug original era timer/glória rodando durante vitória/derrota; desligar `SW_RACE_ACTIVE` parecia uma forma direta de pausar CEs parallel.
- **Evidência disponível:** CE 10, CE 13, CE 16 e CE 7 são parallel em `switchId=100`; CE 19 é chamado a partir do fluxo de renderização de corrida.
- **Resultado:** falhou. O primeiro `Wait 1 frame` dentro do CE 19 devolvia controle ao interpreter; com `SW_RACE_ACTIVE=OFF`, o parallel owner deixava de executar e não voltava ao `WAIT_INPUT`.
- **Avaliação:** decisão incorreta. A informação para evitar o erro estava no próprio JSON (`CE_RaceRenderer` parallel `switchId=100` e CE 19 chamado por esse fluxo).
- **Melhoria futura:** regra obrigatória: nunca desligar o switch que mantém vivo o parallel owner de um common event que ainda precisa atravessar `Wait`, `Label/Jump` ou input loop.

### Decisão ou inferência: `SW_INPUT_LOCKED=ON` bastava para bloquear timer/glória

- **Motivo:** era preciso parar o bug original sem matar o owner do CE 19.
- **Evidência disponível:** CE 10 tem branch que, se `SW_INPUT_LOCKED=ON`, espera 1 frame e volta ao label; CE 11/12 têm early-exit quando `SW_INPUT_LOCKED=ON`.
- **Resultado:** funcionou. O usuário confirmou a saída da tela de vitória.
- **Avaliação:** era a correção mínima correta.
- **Melhoria futura:** mapear primeiro os readers dos switches envolvidos (`SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `SW_PAUSED`) antes de escolher o switch de lifecycle.

## 3. Uso de ferramentas, comandos e scripts

### `rg` em docs, JSON e scripts

- **Objetivo:** localizar `RACE_WAIT_INPUT`, `VITORIA_PASSOU`, `INPUT_LOCKED`, `PAUSED`, `Patch D`.
- **Necessidade:** entender contexto e alterações existentes.
- **Resultado:** encontrou CE 19, scripts da fase 1 e retrospectiva anterior.
- **Contribuição direta:** sim.
- **Alternativa mais simples:** começar por `CommonEvents.json` CE 19 e CE 7/10/11/13 teria reduzido leitura lateral.
- **Como evitar redundância:** usar uma primeira busca restrita a `CommonEvents.json` e aos scripts `fase1/*.py`.

### `git diff -- Jhonny/data/CommonEvents.json`

- **Objetivo:** ver mudanças do Patch A/D no CE 19.
- **Necessidade:** confirmar estado real do arquivo.
- **Resultado:** mostrou `SW_RACE_ACTIVE=OFF` no topo e `SW_RACE_ACTIVE=ON` antes do branch.
- **Contribuição direta:** sim, mas a conclusão correta veio tarde.
- **Alternativa mais simples:** inspecionar imediatamente quem é o owner parallel do CE 19.
- **Como evitar redundância:** após ver qualquer mudança em `SW_RACE_ACTIVE`, auditar todos os common events `trigger=2 switchId=100`.

### `sed`/`nl` em `CommonEvents.json`

- **Objetivo:** ler trechos de CE 19, CE 10, CE 11/12, CE 13 e CE 7.
- **Necessidade:** verificar opcodes e fluxo.
- **Resultado:** confirmou que `WAIT_INPUT` tinha `Wait 1 + Jump`, CE 10 respeitava `INPUT_LOCKED`, e CE 13/CE 7 dependiam de `SW_RACE_ACTIVE`.
- **Contribuição direta:** sim.
- **Substituição possível:** script pequeno `dump_ce.py <id>` teria sido mais eficiente.
- **Como evitar redundância:** manter script utilitário para dump de common events por ID.

### `node -c Jhonny/js/plugins/Jhonny_RaceHelper.js`

- **Objetivo:** validar sintaxe do plugin JS após adicionar latch.
- **Necessidade:** evitar erro de carregamento no playtest.
- **Resultado:** passou.
- **Contribuição direta:** sim.
- **Substituição possível:** nenhuma mais simples com o mesmo valor.
- **Como evitar redundância:** rodar uma vez após a edição final, não após cada hipótese parcial.

### `python3 -m json.tool Jhonny/data/CommonEvents.json`

- **Objetivo:** validar JSON após edições.
- **Necessidade:** arquivo de dados do MZ é sensível a JSON inválido.
- **Resultado:** passou.
- **Contribuição direta:** sim.
- **Substituição possível:** não recomendada.
- **Como evitar redundância:** rodar após cada edição efetiva de JSON.

### `python3 -m py_compile ...`

- **Objetivo:** validar scripts Python alterados.
- **Necessidade:** garantir que geradores/patchers não quebrassem.
- **Resultado:** passou.
- **Contribuição direta:** sim.
- **Substituição possível:** rodar só nos scripts realmente modificados.
- **Como evitar redundância:** não compilar scripts que não foram tocados.

### `build_phase1_debug_patch.py` e `build_phase1_ces.py`

- **Objetivo:** confirmar idempotência.
- **Necessidade:** evitar que scripts reintroduzissem patches ruins.
- **Resultado:** inicialmente precisaram ser atualizados; depois reconheceram o estado correto.
- **Contribuição direta:** sim.
- **Substituição possível:** inspeção manual seria insuficiente porque scripts são fonte de reexecução.
- **Como evitar redundância:** atualizar scripts somente após causa raiz confirmada.

## 4. Intervenções e correções do usuário

### Intervenção: logs após Patch D mostrando tela ainda travada

- **Instrução:** usuário forneceu logs com `RACE_WAIT_INPUT ok=false latest=null`.
- **Problema anterior:** a solução assumia que restaurar `SW_RACE_ACTIVE` pós-wait resolveria o fluxo.
- **Suposição causadora:** Patch D foi tratado como necessário antes de confirmar que o `WAIT_INPUT` continuava rodando.
- **Mudança:** foco mudou para input e depois para lifecycle do CE.
- **Regra reutilizável:** logs pós-patch devem incluir evidência de progressão do loop, não só estado inicial.

### Intervenção: logs mostrando `RACE_CONTINUE_INPUT` mas sem saída

- **Instrução:** usuário informou cliques e `Space`, com logs `RACE_CONTINUE_INPUT`.
- **Problema anterior:** a execução ainda tratava input como suspeito principal.
- **Suposição causadora:** se o input fosse capturado, o CE consumiria no próximo tick.
- **Mudança:** diagnóstico mudou para “o CE não está tickando”; isso levou ao `SW_RACE_ACTIVE=OFF` como causa raiz.
- **Regra reutilizável:** se evento externo é capturado mas branch não reage, verificar se o interpreter ainda está ativo.

### Intervenção: confirmação “FUNCIONOU!!”

- **Tipo:** critério de sucesso manual.
- **Impacto:** encerrou a investigação.
- **Regra reutilizável:** em bugs de RPG Maker MZ com common events, validação manual em playtest é parte do critério de conclusão.

## 5. Análise de desperdício

### Exploração excessiva do input antes do lifecycle

- **O que aconteceu:** foram feitas duas alterações de input antes de perceber que o loop não continuava rodando.
- **Impacto estimado:** alto.
- **Causa:** foco no valor `latest=null` sem checar frequência dos logs `RACE_WAIT_INPUT`.
- **Como evitar:** primeiro verificar se logs do loop aparecem em frames sucessivos após o primeiro `Wait`.

### Patch D aplicado para religar `SW_RACE_ACTIVE`

- **O que aconteceu:** foi inserido `SW_RACE_ACTIVE=ON` antes do branch pós-wait.
- **Impacto estimado:** médio.
- **Causa:** tentativa de corrigir caminho de derrota sem resolver que o wait nunca chegava ao branch.
- **Como evitar:** não corrigir estado “depois do wait” enquanto não houver prova de que o wait termina.

### Leitura ampla de documentação e retrospectivas

- **O que aconteceu:** vários arquivos de plano/documentação foram pesquisados antes de auditar diretamente CE 7/10/11/13/19.
- **Impacto estimado:** médio.
- **Causa:** tentativa de reconstruir contexto por docs em vez de mapear o grafo real dos CEs.
- **Como evitar:** em regressão runtime, priorizar fonte executável (`CommonEvents.json`, plugin JS) e consultar docs só para confirmar intenção.

### Atualização prematura de scripts geradores

- **O que aconteceu:** scripts foram atualizados para hipótese intermediária de input.
- **Impacto estimado:** médio.
- **Causa:** consolidar uma solução antes de validação manual.
- **Como evitar:** editar geradores apenas após o usuário validar a correção runtime ou após evidência inequívoca.

### Uso de logs que consumiam input na primeira versão

- **O que aconteceu:** uma versão de log chamava função de consumo; depois foi separado em `hasContinueInput()` e `consumeContinueInput()`.
- **Impacto estimado:** baixo.
- **Causa:** mistura de observabilidade com efeito colateral.
- **Como evitar:** funções de log devem ser puras ou explicitamente não consumidoras.

## 6. Caminho mínimo recomendado

1. **Ação:** ler CE 19 no `CommonEvents.json`.
   - **Entrada:** logs do usuário e arquivo ativo.
   - **Ferramenta:** `nl -ba ... | sed -n '<faixa CE19>'`.
   - **Resultado esperado:** identificar topo do CE, `WAIT_INPUT`, branch pós-wait.
   - **Critério:** saber quais switches são alterados antes do primeiro `Wait`.

2. **Ação:** auditar owner e CEs parallel em `SW_RACE_ACTIVE`.
   - **Entrada:** IDs de CE 7/10/13/16/19 ou busca por `"switchId": 100`.
   - **Ferramenta:** `rg` + `nl/sed`.
   - **Resultado esperado:** confirmar se CE 19 é chamado por fluxo parallel dependente de `SW_RACE_ACTIVE`.
   - **Critério:** se CE 19 tem `Wait`, não desligar o switch que mantém o owner vivo.

3. **Ação:** auditar readers de `SW_INPUT_LOCKED`.
   - **Entrada:** ID `101`.
   - **Ferramenta:** `rg` em `CommonEvents.json`.
   - **Resultado esperado:** verificar que CE 10 espera quando lock está ON e CE 11/12 saem cedo.
   - **Critério:** se lock bloqueia timer/handlers, usar lock em vez de desligar `SW_RACE_ACTIVE`.

4. **Ação:** corrigir CE 19.
   - **Entrada:** CE 19 ativo.
   - **Ferramenta:** `apply_patch`.
   - **Resultado esperado:** topo com `SW_INPUT_LOCKED=ON`, `SW_PAUSED=ON`, sem `SW_RACE_ACTIVE=OFF`; antes do branch, desligar `SW_PAUSED` e `SW_INPUT_LOCKED`.
   - **Critério:** `WAIT_INPUT` mantém `Wait 1 + Jump`, e `SW_RACE_ACTIVE` permanece ON.

5. **Ação:** opcionalmente robustecer continue input.
   - **Entrada:** logs mostrando loop vivo mas input não capturado.
   - **Ferramenta:** editar plugin JS.
   - **Resultado esperado:** latch via `keydown`/mouse/touch com `hasContinueInput()` e `consumeContinueInput()`.
   - **Critério:** só necessário se o problema persistir com loop vivo.

6. **Ação:** atualizar geradores/patchers.
   - **Entrada:** correção final validada.
   - **Ferramenta:** `apply_patch` nos scripts Python.
   - **Resultado esperado:** scripts não reintroduzem `SW_RACE_ACTIVE=OFF` ou Patch D.
   - **Critério:** segunda execução dos scripts não altera o JSON.

7. **Ação:** validar.
   - **Entrada:** arquivos alterados.
   - **Ferramenta:** `python3 -m json.tool`, `node -c`, `python3 -m py_compile`.
   - **Resultado esperado:** sem erros.
   - **Critério:** usuário vence a corrida e sai da tela; glória não aumenta durante a tela.

## 7. Conhecimento reutilizável

### Fatos confirmados

- CE 19 (`EV_VitoriaCorrida`) pode ser executado dentro de um fluxo cujo owner parallel depende de `SW_RACE_ACTIVE`.
- Desligar `SW_RACE_ACTIVE` antes de um `Wait 1 frame` no CE 19 pode matar o interpreter antes de o `WAIT_INPUT` consumir input.
- CE 10 (`EV_RaceTimer`) já respeita `SW_INPUT_LOCKED=ON` fazendo wait-loop, o que impede o timer de continuar concedendo glória.
- CE 11/12 têm guards de `SW_INPUT_LOCKED=ON` que impedem resolução enquanto bloqueado.
- Logs `RACE_CONTINUE_INPUT` sem novos logs `RACE_WAIT_INPUT` indicam que input chegou, mas o CE não está mais executando.

### Preferências do usuário

- O usuário testa manualmente no RPG Maker MZ e fornece logs do console.
- O usuário valoriza correção prática e evidência por logs.
- O usuário aceita patches diretos nos arquivos do projeto, desde que validados.

### Restrições técnicas

- `CommonEvents.json` deve permanecer JSON válido.
- Mudanças no plugin JS exigem reiniciar playtest para recarregar runtime.
- `Input.isTriggered("ok")` é borda de 1 frame no MZ.
- Logs que chamam funções consumidoras podem alterar comportamento; separar inspect/consume.
- Geradores Python podem reescrever CEs e precisam ser atualizados depois da correção final.

### Armadilhas conhecidas

- Não usar `SW_RACE_ACTIVE=OFF` para pausar uma tela que ainda depende de CEs parallel com `switchId=100`.
- Não inserir correções “depois do WAIT_INPUT” se não há prova de que o wait termina.
- Não tratar `latest=null` como prova suficiente de bug de input.
- Não concluir sucesso só porque o bug original de glória parou; validar vitória e derrota pós-input.

### Heurísticas recomendadas

- Para loops `Label -> Conditional Branch -> Wait -> Jump`, verificar se o log repete depois do primeiro wait.
- Para switches de lifecycle, mapear writers e readers antes de mudar valor.
- Se o objetivo é pausar side effects, preferir o lock que os consumidores já respeitam a desligar o switch que mantém o sistema vivo.
- Só consolidar em scripts geradores após validação manual ou prova runtime conclusiva.

## 8. Informações que deveriam estar no prompt inicial

- **Obrigatório:** CE 19 é chamado por um fluxo parallel dependente de `SW_RACE_ACTIVE`, e contém `Wait 1` no loop de input.
- **Obrigatório:** CE 10 já respeita `SW_INPUT_LOCKED=ON`, então `SW_INPUT_LOCKED` pode pausar o timer sem desligar `SW_RACE_ACTIVE`.
- **Útil:** lista dos common events parallel em `SW_RACE_ACTIVE` e suas responsabilidades.
- **Útil:** critério de validação exigindo que `RACE_WAIT_INPUT` continue logando em frames sucessivos antes do input.
- **Útil:** instrução para validar os dois caminhos pós-tela: vitória avança corrida; derrota chama crash/restart.
- **Opcional:** comando/script utilitário para dump de CE por ID.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

#### Melhoria 1

- **Problema observado durante a execução:** `SW_RACE_ACTIVE=OFF` foi escolhido como pausa do timer, mas também interrompia o common event que precisava continuar rodando.
- **Informação ausente ou incorreta:** contrato de lifecycle de `SW_RACE_ACTIVE`: ele não é apenas “race active”; ele também é o switch owner dos CEs parallel que sustentam o fluxo.
- **Por que pertence à análise técnica:** é uma restrição arquitetural e de contrato entre CEs.
- **Seção sugerida:** “Lifecycle de switches e ownership dos common events”.
- **Texto sugerido:**

```markdown
### Contrato de SW_RACE_ACTIVE durante telas cerimoniais

`SW_RACE_ACTIVE` é o switch owner de common events parallel do fluxo de corrida, incluindo o renderer/key input/timer. Não desligar `SW_RACE_ACTIVE` dentro de um common event que ainda precisa atravessar `Wait`, `Label/Jump` ou aguardar input, pois o interpreter parallel pode ser interrompido antes de completar o fluxo.

Para pausar efeitos durante vitória/derrota, usar `SW_INPUT_LOCKED=ON` como trava operacional. CE 10 deve permanecer vivo, mas em wait-loop sem decrementar timer; CE 11/12 devem sair cedo quando `SW_INPUT_LOCKED=ON`.
```

- **Impacto esperado:** evita o erro principal e elimina Patch D.

#### Melhoria 2

- **Problema observado durante a execução:** input foi investigado antes de confirmar que o loop continuava executando.
- **Informação ausente ou incorreta:** falta de critério para distinguir “input não capturado” de “interpreter morto”.
- **Por que pertence à análise técnica:** define diagnóstico de runtime para loops MZ.
- **Seção sugerida:** “Observabilidade e diagnóstico de loops”.
- **Texto sugerido:**

```markdown
Em loops `WAIT_INPUT`, logar a cada iteração com `Graphics.frameCount`. Se o log aparece apenas uma vez e há `Wait` antes de `Jump`, suspeitar primeiro de interrupção do interpreter/parallel owner, não de input. Se o log continua aparecendo e o input não é capturado, investigar `Input`/foco/canvas.
```

- **Impacto esperado:** reduz exploração errada em input.

### 9.2 Melhorias no plano de implementação

#### Melhoria 1

- **Problema observado durante a execução:** validação do bug original não cobria se a tela de vitória/derrota ainda conseguia sair.
- **Deficiência do plano:** critério de sucesso focava em “glória estática” e não em continuidade pós-cerimônia.
- **Etapa afetada:** validação da fase 1.
- **Alteração recomendada:** adicionar checkpoint obrigatório de ambos os caminhos pós-`WAIT_INPUT`.
- **Texto sugerido:**

```markdown
Critérios de validação da fase:
1. Durante vitória/derrota, `PONTOS_GLORIA` permanece estático por pelo menos 10s.
2. `RACE_WAIT_INPUT` continua aparecendo em frames sucessivos enquanto nenhum input de continuar é dado.
3. Em vitória com `RACE_ID < 3`, input de continuar chama CE 5 e inicia `RACE_ID + 1`.
4. Em derrota, input de continuar chama CE 18 e reinicia a mesma corrida.
5. Não considerar a fase concluída se o loop de input logar apenas uma vez.
```

- **Como reduz custo:** detecta imediatamente a interrupção do interpreter.

#### Melhoria 2

- **Problema observado durante a execução:** scripts geradores foram atualizados antes da validação da causa raiz.
- **Deficiência do plano:** faltou etapa separando patch experimental de consolidação.
- **Etapa afetada:** implementação e documentação da fase.
- **Alteração recomendada:** exigir validação runtime antes de atualizar geradores permanentes.
- **Texto sugerido:**

```markdown
Fluxo para patches de regressão:
1. Aplicar patch mínimo no arquivo runtime.
2. Validar manualmente com logs.
3. Só depois atualizar geradores/patchers idempotentes.
4. Rodar idempotência como etapa final.
```

- **Como reduz custo:** evita consolidar hipóteses intermediárias.

### 9.3 Melhorias nas tasks da fase executada

#### Task afetada: `task-1.2` / `build_phase1_ces.py`

- **Informação ausente, ambígua ou incorreta:** instrução dizia para desligar `SW_RACE_ACTIVE` no topo do CE 19.
- **Consequência observada:** `WAIT_INPUT` parava após o primeiro `Wait 1 frame`.
- **Alteração recomendada:** substituir Patch A para usar `SW_INPUT_LOCKED=ON` e `SW_PAUSED=ON`, sem mexer em `SW_RACE_ACTIVE`.
- **Texto sugerido para substituir:**

```markdown
Patch A correto — CE 19 topo:
- Inserir `SW_INPUT_LOCKED = ON` (`code=121 [101,101,0]`).
- Inserir `SW_PAUSED = ON` (`code=121 [104,104,0]`) apenas como sinal cerimonial.
- Não inserir `SW_RACE_ACTIVE = OFF` no CE 19.

Justificativa: CE 19 é alcançado a partir de fluxo parallel dependente de `SW_RACE_ACTIVE`. Desligar esse switch antes de `WAIT_INPUT` interrompe o interpreter após o primeiro `Wait`. O timer já é bloqueado por `SW_INPUT_LOCKED=ON`.
```

- **Como validar:** logs `RACE_WAIT_INPUT` repetem por frames sucessivos; glória não aumenta; `Space` sai da tela.

#### Task afetada: Patch D em `build_phase1_debug_patch.py`

- **Informação ausente, ambígua ou incorreta:** Patch D restaurava `SW_RACE_ACTIVE=ON` depois do wait.
- **Consequência observada:** não ajudava porque o wait nunca terminava; mantinha a solução errada.
- **Alteração recomendada:** remover Patch D e tratar qualquer ocorrência antes do branch como legado a remover.
- **Texto sugerido:**

```markdown
Patch D legado:
- Não inserir `SW_RACE_ACTIVE=ON` antes do branch pós-`WAIT_INPUT`.
- Se existir `code=121 [100,100,0]` nesse ponto, remover.
- O CE 19 não deve alternar `SW_RACE_ACTIVE`; ele deve manter o owner parallel vivo.
```

- **Como validar:** `CommonEvents.json` não contém `code=121 [100,100,0]` entre `WAIT_INPUT` e o branch `VAR_VITORIA_PASSOU`.

#### Task afetada: validação da fase

- **Informação ausente, ambígua ou incorreta:** não havia critério de log para distinguir wait vivo de wait morto.
- **Consequência observada:** input foi diagnosticado incorretamente por duas tentativas.
- **Alteração recomendada:** adicionar log/checkpoint.
- **Texto sugerido:**

```markdown
Durante playtest, na tela de vitória/derrota:
- Antes de apertar continuar, confirmar que `RACE_WAIT_INPUT` aparece mais de uma vez com `frame` crescente.
- Se aparecer só uma vez, investigar switch owner/interpreter lifecycle antes de investigar teclado/foco.
```

- **Como validar:** console mostra pelo menos dois logs `RACE_WAIT_INPUT` separados por frames antes do input.

### 9.4 Problemas fora do escopo dos artefatos

#### Problema: atualização prematura de hipótese em scripts

- **Por que fora do escopo:** foi falha operacional da LLM, não falta de especificação.
- **Tratamento:** adotar regra operacional de consolidar scripts apenas após validação.
- **Proteção:** checklist operacional.

#### Problema: necessidade de logs manuais do usuário

- **Por que fora do escopo:** comportamento runtime do MZ/NW.js depende de playtest manual.
- **Tratamento:** solicitar logs específicos quando a reprodução local não está disponível.
- **Proteção:** definir exatamente quais logs indicam loop vivo, input capturado e transição.

### 9.5 Matriz de rastreabilidade das melhorias

| **Problema observado** | **Causa principal** | **Artefato responsável** | **Alteração necessária** | **Prioridade** |
|---|---|---|---|---|
| Tela travava após vitória | `SW_RACE_ACTIVE=OFF` matou owner parallel do CE 19 | Análise técnica | Documentar contrato de `SW_RACE_ACTIVE` e proibir desligamento durante wait | Alta |
| Patch D não resolvia | Corrigia estado depois de um wait que nunca terminava | Task | Remover Patch D e marcar como legado | Alta |
| Input investigado antes do lifecycle | Falta de critério para loop vivo vs morto | Análise técnica / task | Logar `RACE_WAIT_INPUT` em frames sucessivos como checkpoint | Alta |
| Validação incompleta da fase | Critério não cobria continuidade pós-tela | Plano | Validar vitória e derrota após input | Alta |
| Geradores atualizados cedo demais | Consolidação de hipótese intermediária | Fora do escopo | Regra operacional: runtime primeiro, gerador depois | Média |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

```markdown
### Contrato de SW_RACE_ACTIVE durante telas cerimoniais

`SW_RACE_ACTIVE` é o switch owner de common events parallel do fluxo de corrida. Não desligar esse switch dentro de um common event que ainda precisa atravessar `Wait`, `Label/Jump` ou aguardar input.

Para pausar efeitos durante vitória/derrota, usar `SW_INPUT_LOCKED=ON`. CE 10 deve permanecer vivo em wait-loop sem decrementar timer; CE 11/12 devem sair cedo quando `SW_INPUT_LOCKED=ON`.

### Diagnóstico de WAIT_INPUT

Em loops `WAIT_INPUT`, logar `Graphics.frameCount` a cada iteração. Se o log aparece apenas uma vez e há `Wait` antes de `Jump`, investigar interrupção do interpreter/parallel owner antes de investigar input/foco.
```

#### Patch sugerido para o plano de implementação

```markdown
### Validação obrigatória da fase

1. Durante vitória/derrota, `PONTOS_GLORIA` permanece estático por pelo menos 10s.
2. `RACE_WAIT_INPUT` aparece em frames sucessivos enquanto nenhum input de continuar é dado.
3. Vitória com `RACE_ID < 3`: continuar chama CE 5 e inicia `RACE_ID + 1`.
4. Derrota: continuar chama CE 18 e reinicia a mesma corrida.
5. Não concluir a fase se `RACE_WAIT_INPUT` aparecer apenas uma vez.

### Consolidação de patches

Aplicar patch mínimo no runtime, validar manualmente, e só então atualizar geradores/patchers idempotentes.
```

#### Patch sugerido para as tasks da fase executada

```markdown
### task-1.2 — Patch A correto no CE 19

Inserir no topo:
- `SW_INPUT_LOCKED = ON` (`code=121 [101,101,0]`)
- `SW_PAUSED = ON` (`code=121 [104,104,0]`)

Não inserir `SW_RACE_ACTIVE = OFF` no CE 19.

Justificativa: CE 19 roda dentro de fluxo parallel dependente de `SW_RACE_ACTIVE`; desligar esse switch interrompe `WAIT_INPUT` após o primeiro `Wait`.

### Patch D legado

Não inserir `SW_RACE_ACTIVE=ON` antes do branch pós-`WAIT_INPUT`. Se existir `code=121 [100,100,0]` nesse ponto, remover.

### Validação

Na tela de vitória/derrota, antes de continuar, confirmar que `RACE_WAIT_INPUT` aparece mais de uma vez com `frame` crescente.
```

#### Ações fora do fluxo de especificação

- Criar script utilitário `dump_ce.py <id>` para imprimir common event por ID com índices.
- Manter checklist operacional para não consolidar geradores antes de validação runtime.

## 10. Checklist operacional

1. Conferir CE 19 e seu primeiro `Wait` antes de alterar switches de lifecycle.
2. Mapear todos os CEs `trigger=2 switchId=100`.
3. Não desligar `SW_RACE_ACTIVE` dentro de fluxo que ainda precisa continuar executando.
4. Usar `SW_INPUT_LOCKED=ON` para pausar timer/handlers quando os consumidores já respeitam o lock.
5. Validar que `RACE_WAIT_INPUT` loga em frames sucessivos antes de testar input.
6. Se input é capturado mas CE não reage, investigar interpreter morto.
7. Não aplicar patches pós-wait enquanto o wait não termina.
8. Atualizar geradores/patchers só após validação manual da correção.
9. Rodar `python3 -m json.tool` após editar `CommonEvents.json`.
10. Encerrar somente após playtest confirmar vitória e derrota pós-input.
