# Retrospectiva Técnica - Task 5.4 Black Screen Lifecycle

## 1. Resumo da tarefa

O usuário pediu para resolver o último bug da Fase 5: após perder uma corrida, às vezes o jogador ficava preso em uma tela preta. A entrega foi um patch em `Jhonny/data/CommonEvents.json`, gerado por script salvo, que moveu o desligamento de `SW_RACE_ACTIVE` para dentro dos branches de vitória do `CE19 EV_VitoriaCorrida`, preservando a derrota como `CE19 -> CE5` sem desligar o switch antes do retry.

O sucesso foi indicado por três critérios: validação estrutural de JSON e rotas passou, o dump do `CE19` mostrou que a derrota chama `CE5` sem `SW_RACE_ACTIVE OFF` antes, e o usuário confirmou em Playtest: "FUNCIONOU".

Restrições relevantes: qualquer edição em `data/*.json` precisava usar a skill `rpg-maker-mz-data-json`; o JSON não podia ser editado diretamente; a mutação precisava ser feita por script Python salvo em `builds/fase5/`; comportamento de runtime dependia de Playtest no RPG Maker MZ.

## 2. Decisões técnicas e inferências

### Decisão: tratar o snapshot da tela preta como fonte principal

- **Motivo:** o log anterior só mostrava `SAFE_CLICK` e entrada em `CE19`, não onde o fluxo morria.
- **Evidência disponível:** snapshot runtime mostrou `Map001`, `pictures: []`, `screenTint: [0,0,0,0]`, `SW_RACE_ACTIVE: false`, `SW_PAUSED: false`, nenhum interpreter ativo, nenhum CE reservado e `Init Corrida` apagado.
- **Resultado:** funcionou. Esse dado eliminou hipótese de wait-loop ativo e apontou para fluxo já encerrado.
- **Avaliação:** necessária.
- **Melhoria futura:** sempre coletar snapshot mínimo antes de mexer em CEs quando houver tela preta intermitente.

### Decisão: investigar lifecycle de Common Event paralelo

- **Motivo:** o estado final tinha `SW_RACE_ACTIVE OFF` e nenhum interpreter, mas a derrota deveria chamar `CE5`.
- **Evidência disponível:** `CE19` era chamado por `CE7 EV_RaceRenderer`, e `CE7` é Common Event paralelo com `trigger: 2` e `switchId: 100`.
- **Resultado:** funcionou. O engine confirmou que `Game_CommonEvent.refresh()` define `_interpreter = null` quando o switch do Common Event paralelo deixa de estar ativo.
- **Avaliação:** necessária.
- **Melhoria futura:** documentar que CEs chamados por um CE paralelo não devem desligar o switch que mantém o pai vivo antes de terminar handoffs críticos.

### Decisão: não mexer no `CE3 EV_Preload`

- **Motivo:** havia histórico de bug antigo no retry/preload, mas a evidência atual não apontava para stall dentro do CE3.
- **Evidência disponível:** o snapshot não tinha child interpreter, common event reservado, nem `SW_RACE_ACTIVE ON` pendente; o fluxo já havia morrido antes do retry.
- **Resultado:** funcionou.
- **Avaliação:** necessária para reduzir risco.
- **Melhoria futura:** só abrir ou remover CE3 quando o snapshot mostrar retry já em `CE5 -> CE3` ou interpreter preso antes de `SW_RACE_ACTIVE ON`.

### Decisão: mover `SW_RACE_ACTIVE OFF` para branches de vitória

- **Motivo:** vitória ainda precisava desligar a corrida antes de transferir para mapa narrativo, mas derrota precisava manter o interpreter vivo até chamar `CE5`.
- **Evidência disponível:** `CE19` tinha um `SW_RACE_ACTIVE OFF` global antes do branch de vitória/derrota; a derrota ficava depois desse comando.
- **Resultado:** funcionou em Playtest.
- **Avaliação:** necessária.
- **Melhoria futura:** em eventos chamados por CEs paralelos, separar cleanup de vitória e cleanup de derrota quando o cleanup altera o switch que controla o CE pai.

## 3. Uso de ferramentas, comandos e scripts

### Skill `rpg-maker-mz-data-json`

- **Objetivo:** seguir o workflow obrigatório para `data/CommonEvents.json`.
- **Por que foi necessário:** alteração em `data/*.json`.
- **Resultado:** script-first workflow aplicado.
- **Contribuiu diretamente:** sim.
- **Alternativa mais simples:** nenhuma aceitável, pois editar JSON diretamente violaria a regra do projeto.
- **Evitar redundância:** manter o caminho da skill e referências já carregados quando a conversa continua na mesma tarefa.

### Snapshot JS no console do Playtest

- **Objetivo:** capturar estado runtime da tela preta.
- **Por que foi necessário:** bug intermitente e dependente do engine.
- **Resultado:** mostrou que não havia interpreter ativo, CE reservado, pictures ou wait-loop.
- **Contribuiu diretamente:** sim, foi a evidência decisiva.
- **Alternativa mais simples:** pedir só `SW_RACE_ACTIVE`, `SW_PAUSED`, interpreter e reservation teria bastado.
- **Evitar redundância:** usar uma versão segura do probe desde o início, sem chamar `currentCommand()` quando `_list` é `null`.

### `rg` e `sed` em `rmmz_objects.js`

- **Objetivo:** verificar comportamento de `Game_CommonEvent.refresh()`, `command117`, child interpreters e transfer.
- **Por que foi necessário:** confirmar se desligar `SW_RACE_ACTIVE` podia matar o interpreter do CE paralelo.
- **Resultado:** confirmou `_interpreter = null` quando o CE paralelo fica inativo.
- **Contribuiu diretamente:** sim.
- **Alternativa mais simples:** leitura focada em `Game_CommonEvent.refresh()` teria sido suficiente depois do snapshot.
- **Evitar redundância:** procurar primeiro por `Game_CommonEvent.prototype.refresh`.

### Dump Python de `CE19`

- **Objetivo:** ver a janela de comandos pós-result screen.
- **Por que foi necessário:** localizar exatamente onde `SW_RACE_ACTIVE OFF`, branch de vitória e `Call CE5` estavam.
- **Resultado:** confirmou o comando global antes do branch e, depois do patch, confirmou `Call CE5` sem race stop antes.
- **Contribuiu diretamente:** sim.
- **Alternativa mais simples:** poderia ter sido combinado com o script de mutação.
- **Evitar redundância:** criar um pequeno audit script reutilizável para CE19 route window.

### Script `builds/fase5/06_move_race_stop_to_victory_branch.py`

- **Objetivo:** mutar `CommonEvents.json` de forma auditável.
- **Por que foi necessário:** regra do projeto para `data/*.json`.
- **Resultado:** removeu o race stop global, inseriu race stop nos três branches de vitória, preservou derrota `CE19 -> CE5`, validou contagens de writes de variáveis.
- **Contribuiu diretamente:** sim.
- **Alternativa mais simples:** não para escrita em JSON.
- **Evitar redundância:** precondições do script devem mirar apenas CE19 e não revalidar coisas já cobertas por scripts anteriores, exceto quando protegem o patch.

### `python3 -m json.tool`, `py_compile`, e `03_validate_race_dialogue_integration.py`

- **Objetivo:** validar JSON, script e matriz de rotas.
- **Por que foi necessário:** garantir integridade estrutural antes do Playtest.
- **Resultado:** todos passaram.
- **Contribuiu diretamente:** sim.
- **Alternativa mais simples:** `json.tool` e matriz eram suficientes; `py_compile` é barato e útil.
- **Evitar redundância:** rodar uma vez após o patch final, não após cada leitura exploratória.

## 4. Intervenções e correções do usuário

### Usuário confirmou que o bug de setas estava resolvido, mas Space/click havia quebrado

- **Tipo:** correção de erro.
- **Antes:** uma tentativa anterior desligava `SW_RACE_ACTIVE` cedo demais para bloquear paralelos.
- **Suposição problemática:** tratar `SW_RACE_ACTIVE OFF` como bloqueio seguro durante tela de resultado.
- **Mudança:** reverter early race stop e bloquear input no nível de `CE7`, `CE13`, `CE11` e `CE12`.
- **Regra reutilizável:** não desligar o switch que mantém o fluxo de resultado vivo antes de validar quem é o dono do interpreter.

### Usuário forneceu o snapshot final da tela preta

- **Tipo:** esclarecimento necessário.
- **Antes:** ainda havia hipóteses concorrentes: CE19 wait, CE3 preload, fila de CE ou input residual.
- **Suposição resolvida:** o fluxo não estava preso esperando; estava encerrado.
- **Mudança:** investigação passou para lifecycle de Common Event paralelo.
- **Regra reutilizável:** quando a tela preta ocorre, classificar primeiro como "esperando", "em retry", ou "fluxo morto" usando snapshot runtime.

### Usuário confirmou "FUNCIONOU"

- **Tipo:** confirmação de Playtest.
- **Antes:** a correção era apenas estrutural.
- **Mudança:** o bug foi considerado resolvido.
- **Regra reutilizável:** para RPG Maker MZ, não marcar runtime como resolvido antes de confirmação de Playtest.

## 5. Análise de desperdício

### Probe JS inicial que chamava `currentCommand()` com `_list = null`

- **Impacto estimado:** baixo.
- **Causa:** o probe assumiu interpreter com lista ativa.
- **Como evitar:** sempre checar `it && it._list` antes de chamar métodos que acessam `_list`.

### Leitura ampla de artefatos da fase e dumps extensos

- **Impacto estimado:** médio.
- **Causa:** histórico de bugs similares levou a reabrir muitos artefatos antes de classificar o estado runtime.
- **Como evitar:** coletar snapshot mínimo primeiro; só depois abrir artefatos correspondentes ao estado encontrado.

### Exploração do engine além do necessário

- **Impacto estimado:** baixo.
- **Causa:** depois de encontrar `Game_CommonEvent.refresh()`, ainda foram lidos trechos sobre child interpreter e transfer para validar efeitos colaterais.
- **Como evitar:** ler `command201` apenas se o patch mover race stop para perto de transfers; caso contrário, `Game_CommonEvent.refresh()` e `CE19` bastam.

### Tentativas anteriores de input hardening antes da causa final

- **Impacto estimado:** alto para a fase inteira, baixo para a task 5.4 isolada.
- **Causa:** havia dois bugs sobrepostos: input em tela de resultado e tela preta por lifecycle.
- **Como evitar:** separar sintomas por snapshot e logs: input leak produz `RISK_*` com `PAUSED=true`; lifecycle kill produz interpreter nulo, `RACE_ACTIVE=false` e sem CE reservado.

## 6. Caminho mínimo recomendado

1. **Ação:** pedir snapshot seguro da tela preta.
   **Entrada:** jogador preso na tela preta.
   **Ferramenta:** console JS no Playtest.
   **Resultado esperado:** `mapId`, pictures, tint, switches 100-105, vars 100/112/117, interpreter/child/reservation, evento Init.
   **Critério:** se não há interpreter nem reservation, investigar lifecycle; se há CE19 em wait, investigar input; se há CE5/CE3, investigar retry/preload.

2. **Ação:** dump focado do `CE19` pós-result screen.
   **Entrada:** `CommonEvents.json`.
   **Ferramenta:** Python read-only.
   **Resultado esperado:** localizar `SW_RACE_ACTIVE OFF`, branch de vitória e `Call CE5`.
   **Critério:** se race stop vem antes do branch de derrota, seguir para engine lifecycle.

3. **Ação:** confirmar contrato do engine.
   **Entrada:** `rmmz_objects.js`.
   **Ferramenta:** `rg`/`sed` em `Game_CommonEvent.prototype.refresh`.
   **Resultado esperado:** confirmar que CE paralelo inativo limpa `_interpreter`.
   **Critério:** se confirmado, race stop global antes de retry é suspeito primário.

4. **Ação:** criar script de mutação salvo.
   **Entrada:** CE19 real e comandos esperados.
   **Ferramenta:** Python salvo em `builds/fase5/`.
   **Resultado esperado:** remover race stop global e inserir race stop somente antes dos transfers de vitória.
   **Critério:** script reabre JSON e assertiva que derrota não tem race stop antes de `Call CE5`.

5. **Ação:** validar estruturalmente.
   **Entrada:** arquivos alterados.
   **Ferramenta:** `json.tool`, `py_compile`, script de matriz de rotas.
   **Resultado esperado:** parse e rotas OK.
   **Critério:** só então pedir Playtest.

6. **Ação:** Playtest.
   **Entrada:** projeto reiniciado para carregar JSON.
   **Ferramenta:** RPG Maker MZ Playtest.
   **Resultado esperado:** derrota reinicia corrida sem tela preta; vitória ainda transfere.
   **Critério:** usuário confirma comportamento.

## 7. Conhecimento reutilizável

### Fatos confirmados

- `CE7 EV_RaceRenderer` é Common Event paralelo gated por `SW_RACE_ACTIVE`.
- `CE19 EV_VitoriaCorrida` é chamado pelo fluxo da corrida e controla a tela de resultado, vitória e derrota.
- `Game_CommonEvent.refresh()` limpa `_interpreter` quando `isActive()` fica falso.
- Desligar `SW_RACE_ACTIVE` dentro de um CE chamado por `CE7` pode interromper a cadeia antes de executar handoffs posteriores.
- A derrota correta precisa alcançar `CE19 -> CE5`.
- `CE3 EV_Preload` não era a causa deste bug específico.

### Preferências do usuário

- O usuário prefere análise de impacto antes de novas alterações.
- O usuário aceita remover CE3 se for comprovadamente necessário, mas não quer mudanças sem evidência.
- O usuário valida no Playtest e informa logs/snapshots do console.

### Restrições técnicas

- `data/*.json` só pode ser alterado por script Python salvo.
- Common Events precisam manter comandos e indentação coerentes.
- Validação runtime de input, pictures, audio e interpreter exige Playtest.
- Não alterar `System.json` ou outros arquivos sujos não relacionados.

### Armadilhas conhecidas

- `SW_RACE_ACTIVE OFF` cedo demais pode quebrar Space/click ou matar retry.
- `Input.isTriggered('ok')` pode perder confirmação rápida; `Input.isPressed('ok')` foi usado para robustez.
- `CE7` pode reabrir `SW_INPUT_LOCKED` depois que `CE19` já abriu a tela de resultado se não checar `SW_PAUSED`.
- `CE12 EV_OnRisk` precisava do mesmo guard de `SW_PAUSED` que `CE11 EV_OnSafe`.
- Probe JS que chama `currentCommand()` sem `_list` pode lançar erro.

### Heurísticas recomendadas

- Para tela preta, primeiro distinguir: interpreter esperando, retry em andamento, ou fluxo morto.
- Quando um CE paralelo chama outro CE, não desligar o switch do CE paralelo antes de terminar handoffs críticos.
- Race cleanup não deve ser global se vitória e derrota têm destinos diferentes.
- Antes de propor novo switch, verificar se `SW_PAUSED`, `SW_INPUT_LOCKED` e `SW_RACE_ACTIVE` já expressam o estado necessário.

## 8. Informações que deveriam estar no prompt inicial

- **Obrigatório:** snapshot runtime da tela preta com interpreter, reservation, switches e `Init Corrida`.
- **Útil:** último `RACE_EVENT` antes da tela preta.
- **Útil:** confirmação se o Playtest foi reiniciado após mudanças em JSON.
- **Útil:** rota esperada após derrota: retry da mesma corrida em `Map001`.
- **Opcional:** qual tecla foi pressionada imediatamente antes do travamento.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

**Problema observado durante a execução:** o contrato entre Common Events paralelos e seus trigger switches só foi validado tarde.

**Informação ausente ou incorreta:** faltava registrar que desligar o switch de um Common Event paralelo pode limpar seu interpreter e interromper child interpreters.

**Por que pertence à análise técnica:** é uma restrição arquitetural do RPG Maker MZ que afeta qualquer desenho de lifecycle da corrida.

**Seção sugerida:** arquitetura/lifecycle de Common Events da corrida.

**Texto sugerido para a alteração:**

```md
Common Events paralelos controlados por switch não devem desligar seu próprio switch de ativação antes de concluir handoffs críticos. Em RPG Maker MZ, `Game_CommonEvent.refresh()` limpa o interpreter quando o Common Event deixa de estar ativo. Como `CE7 EV_RaceRenderer` é paralelo e depende de `SW_RACE_ACTIVE`, qualquer CE chamado por ele deve evitar `SW_RACE_ACTIVE OFF` antes de transferir ou chamar o retry.
```

**Impacto esperado:** evita propostas de cleanup global que matem o fluxo de derrota.

### 9.2 Melhorias no plano de implementação

**Problema observado durante a execução:** a fase tratou input leak e tela preta como sintomas próximos, mas eles tinham causas diferentes.

**Deficiência do plano de implementação:** faltava checkpoint obrigatório para classificar tela preta antes de aplicar novos patches.

**Etapa afetada:** Phase 5.

**Alteração recomendada:** adicionar checkpoint de diagnóstico runtime antes de qualquer nova mutação.

**Texto sugerido para a alteração:**

```md
Antes de qualquer novo patch de tela preta, coletar snapshot runtime e classificar o estado:
1. CE19 ainda está em `WAIT_INPUT`;
2. Retry chegou a `CE5/CE3`;
3. Não há interpreter nem common event reservado.
Cada classe deve ter uma task/fix separada.
```

**Como reduz custo:** evita mexer em input, CE3 ou cleanup sem saber onde o fluxo morreu.

### 9.3 Melhorias nas tasks da fase executada

**Task afetada:** task-5.1/task-5.2, como base para a futura task-5.4.

**Informação ausente, ambígua ou incorreta:** a task não explicitava que `SW_RACE_ACTIVE` é também o trigger do CE paralelo pai que mantém `CE19` vivo.

**Consequência observada:** tentativa anterior de desligar `SW_RACE_ACTIVE` cedo bloqueou setas, mas quebrou Space/click e depois manteve risco de matar retry.

**Alteração recomendada:** adicionar restrição explícita sobre `SW_RACE_ACTIVE`.

**Texto sugerido para incluir:**

```md
Restrição: durante `CE19`, não desligar `SW_RACE_ACTIVE` no caminho compartilhado de vitória/derrota. `CE19` pode estar rodando como child de `CE7`, que é paralelo e depende de `SW_RACE_ACTIVE`. Se `SW_RACE_ACTIVE OFF` for necessário, aplicar somente depois de decidir o branch e nunca antes do `Call CE5` da derrota.
```

**Como validar:** dump de `CE19` deve mostrar derrota `411 -> 117 [5]` sem comando `121 [100,100,1]` entre eles.

### 9.4 Problemas fora do escopo dos artefatos

**Problema observado:** bug intermitente dependia de timing no Playtest.

**Por que está fora do escopo dos artefatos:** a intermitência exata não é previsível só pela especificação; precisa de estado runtime.

**Como deveria ser tratado:** probes seguros e logs focados.

**Proteção operacional:** manter um snippet de snapshot seguro para interpreter/list/reservation.

### 9.5 Matriz de rastreabilidade das melhorias

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
| --- | --- | --- | --- | --- |
| Cleanup global matou retry | `SW_RACE_ACTIVE` controla o CE paralelo pai | Análise técnica | Documentar contrato de Common Event paralelo | Alta |
| Patches de input não resolviam tela preta | Sintomas de input leak e lifecycle misturados | Plano de implementação | Adicionar checkpoint de classificação runtime | Alta |
| Tentativa de desligar `SW_RACE_ACTIVE` cedo quebrou continuação | Task não restringia race stop compartilhado | Tasks da fase | Incluir restrição sobre `SW_RACE_ACTIVE` em CE19 | Alta |
| Probe JS lançou erro | `_list` nulo em interpreter morto | Fora do escopo | Usar snippet seguro | Média |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

```md
Adicionar em "Lifecycle dos Common Events":

Common Events paralelos controlados por switch não devem desligar seu próprio switch de ativação antes de concluir handoffs críticos. Em RPG Maker MZ, `Game_CommonEvent.refresh()` limpa o interpreter quando o Common Event deixa de estar ativo. Como `CE7 EV_RaceRenderer` é paralelo e depende de `SW_RACE_ACTIVE`, qualquer CE chamado por ele deve evitar `SW_RACE_ACTIVE OFF` antes de transferir ou chamar o retry.
```

#### Patch sugerido para o plano de implementação

```md
Adicionar à Phase 5:

Antes de qualquer novo patch de tela preta, coletar snapshot runtime e classificar o estado:
1. CE19 ainda está em `WAIT_INPUT`;
2. Retry chegou a `CE5/CE3`;
3. Não há interpreter nem common event reservado.
Cada classe deve ter uma task/fix separada.
```

#### Patch sugerido para as tasks da fase executada

```md
Adicionar às tasks de result-screen lifecycle:

Restrição: durante `CE19`, não desligar `SW_RACE_ACTIVE` no caminho compartilhado de vitória/derrota. `CE19` pode estar rodando como child de `CE7`, que é paralelo e depende de `SW_RACE_ACTIVE`. Se `SW_RACE_ACTIVE OFF` for necessário, aplicar somente depois de decidir o branch e nunca antes do `Call CE5` da derrota.

Validação obrigatória: dump de `CE19` deve mostrar derrota `411 -> 117 [5]` sem comando `121 [100,100,1]` entre eles.
```

#### Ações fora do fluxo de especificação

```md
Criar ou manter snippet operacional seguro para snapshot de tela preta, sem chamar `currentCommand()` quando `_list` é null.
```

## 10. Checklist operacional

- [ ] Carregar `Jhonny/CLAUDE.md` e a skill `rpg-maker-mz-data-json` antes de editar `data/*.json`.
- [ ] Para tela preta, coletar snapshot runtime antes de propor patch.
- [ ] Classificar o estado: `CE19 WAIT_INPUT`, `CE5/CE3 retry`, ou fluxo morto sem interpreter.
- [ ] Verificar se o CE alterado roda como child de Common Event paralelo.
- [ ] Não desligar o switch que ativa o CE paralelo antes de handoff crítico.
- [ ] Gerar toda mutação de JSON por script Python salvo em `builds/faseN/`.
- [ ] Assertar que derrota chega em `Call Common Event 5` sem `SW_RACE_ACTIVE OFF` antes.
- [ ] Rodar `json.tool`, `py_compile` e validação de matriz de rotas.
- [ ] Pedir Playtest após reiniciar o jogo para recarregar JSON.
- [ ] Considerar concluído só após confirmação do usuário.
