# Retrospectiva técnica — Revisão das tasks da Fase 2

Data: 2026-06-20

## 1. Resumo da tarefa

O usuário pediu a revisão dos artefatos de planejamento da Fase 2
(`task-2.1.md`, `task-2.2.md`, `task-2.3.md`, `tasks.md` do plano
`003-bug-fix-round1`) com base na retrospectiva da Fase 1, aplicando
correções cirúrgicas e sem citar a retrospectiva nos artefatos editados.

Resultado entregue: correções aplicadas em `task-2.1.md`, `task-2.2.md` e
`task-2.3.md`. `tasks.md` não foi alterado (a descrição de alto nível da
Fase 2 já estava correta).

Critério de sucesso: cada correção endereçava uma imprecisão concreta
verificada contra o estado real do `CommonEvents.json`, e nenhuma
referência à retrospectiva apareceu nos arquivos editados.

Arquivos relevantes:

- `Jhonny/planos/003-bug-fix-round1/tasks.md`
- `Jhonny/planos/003-bug-fix-round1/task-2.{1,2,3}.md`
- `Jhonny/data/CommonEvents.json` (CE 19 — fonte da verdade)
- `Jhonny/planos/003-bug-fix-round1/race-feedback-impl-guide.md`
  (guia normativo)
- `Jhonny/planos/003-bug-fix-round1/fase1/findings.md` e
  `fase-1-completa.md` (estado pós-Fase 1 v2)

Tecnologia: RPG Maker MZ Common Events JSON, geradores Python, plugin
JavaScript MZ.

## 2. Decisões técnicas e inferências

### Decisão: ler o JSON real do CE 19 antes de confiar nas descrições das tasks

- **Motivo:** as tasks diziam `Play ME` (code 246), mas o `findings.md` da
  Fase 1 mencionava `PlaySE Victory1`, e o `ce19-dump.txt` tinha labels
  unreliable (ex: rotulou `TintPicture` como `EraseEvent`).
- **Evidência disponível:** discrepância entre `findings.md` (PlaySE) e
  `task-2.2` (Play ME).
- **Resultado:** confirmou code 249 (PlaySE). A inconsistência era real.
- **Avaliação:** decisão correta — salvaria edição errada se confiasse na
  task.
- **Melhoria futura:** antes de qualquer edição que cite opcodes/índices,
  rodar um script Python de dump no `CommonEvents.json` para confirmar.

### Decisão: converter opcode 249 (PlaySE) → 246 (Play ME) no Patch H

- **Motivo:** o guia de implementação §3.3 specs Play ME para o sting
  cerimonial; o arquivo `Victory1.ogg` existe apenas em `audio/me/`; a
  implementação atual (PlaySE 249) não pode carregar o arquivo pela
  pasta SE.
- **Evidência disponível:** guia §3.2/§3.3 afirma Play ME; `audio/se/`
  não tem `Victory1.ogg`; `audio/me/` tem.
- **Resultado:** Patch H escrito com conversão explícita de opcode.
- **Avaliação:** necessária — sem a conversão, o bug de áudio não seria
  resolvido em nenhum dos dois caminhos.
- **Melhoria futura:** ao ver "task cita opcode X mas código tem opcode
  Y", verificar primeiro qual pasta contém o asset — isso decide entre
  "corrigir descrição" vs "aplicar conversão".

### Decisão: renomear patches Phase 2 D/E → G/H

- **Motivo:** Fase 1 v2 já havia introduzido Patches D/E/F dentro de
  `build_phase1_ces.py` (PAUSED handling). Reutilizar D/E em
  `build_phase2_ces.py` tornaria "Audit D OK" ambíguo em handoffs.
- **Evidência disponível:** `fase-1-completa.md` lista os patches D/E/F
  da Fase 1 v2.
- **Resultado:** patches renomeados, nota de convenção adicionada em
  task-2.2.
- **Avaliação:** correta — previne colisão futura.
- **Melhoria futura:** o plano deveria reservar namespaces de letras de
  patch por fase; ver seção 9.2.

### Decisão: adicionar Audit I (opcode-conversion check) e Audit J (ceremony-lock region untouched)

- **Motivo:** Patch H faz conversão de opcode; sem um audit específico,
  regressão silenciosa é possível. Patch G/H mexe em índices próximos
  ao ceremony lock; sem audit explícito, pode-se quebrar a Fase 1 v2.
- **Evidência disponível:** retrospectiva Fase 1 mostrou que mudanças em
  índices do CE 19 podem quebrar WAIT_INPUT.
- **Resultado:** dois audits extras adicionados.
- **Avaliação:** proporcionais ao risco.
- **Melhoria futura:** sempre que uma task mover comandos dentro de um CE
  que tem switches de lifecycle críticos, adicionar audit de "região
  intocada".

### Inferência: o "Victory ME" que o usuário ouve na derrota não vem do CE 19 cmd[6]

- **Motivo:** se PlaySE Victory1 não encontra o arquivo (Victory1.ogg só
  em me/), ele deveria falhar silenciosamente; mas o usuário reporta
  ouvir Victory ME.
- **Evidência disponível:** nenhum outro PlaySE/PlayME com Victory1 em
  nenhum CE.
- **Resultado:** inferência não resolvida nesta sessão (fora de escopo —
  bug será confirmado em Playtest da Fase 2).
- **Avaliação:** corretamente deixada em aberto; adicionei nota de
  sanity-check na task-2.3.
- **Melhoria futura:** nãoInvestigar mistérios de áudio fora do escopo
  da revisão de tasks; sinalizar para validação Playtest.

## 3. Uso de ferramentas, comandos e scripts

### `Read` paralelo de tasks.md, task-2.{1,2,3}.md, retrospectiva-fase1

- **Objetivo:** estabelecer contexto completo antes de qualquer edição.
- **Resultado:** identifiquei todas as inconsistências Candidatas.
- **Contribuição direta:** sim.
- **Substituição possível:** nenhuma mais simples.

### `Read` paralelo de `findings.md`, `fase-1-completa.md`, `ce19-dump.txt`, `ls audio/me/`

- **Objetivo:** mapear o estado pós-Fase-1 v2.
- **Resultado:** confirmou layout de 55 comandos e audit defaults.
- **Contribuição direta:** sim.
- **Substituição possível:** `findings.md` e `fase-1-completa.md` são
  grandes; leitura de seções específicas (§6, §9) seria mais econômica.
- **Como evitar redundância:** ler apenas as seções referenciadas pelas
  tasks.

### `Bash` com Python para dump direto do CE 19

- **Objetivo:** verificar opcode real em cmd[6] e estrutura pós-v2.
- **Resultado:** confirmou code 249 (PlaySE), 55 comandos, índices
  exatos do ceremony lock e `SW_PAUSED=OFF`.
- **Contribuição direta:** crítica — sem isto, editaria código errado.
- **Substituição possível:** nenhuma. O dump textual `ce19-dump.txt`
  tinha labels não-confiáveis.

### `Bash` para checar `audio/se/` e referências de `Victory1` em JSONs

- **Objetivo:** confirmar que Victory1 só existe em me/ e onde é
  referenciado.
- **Resultado:** confirmou a divergência pasta/comando.
- **Contribuição direta:** útil mas parcialmente redundante — o guia §3.3
  já dizia Play ME; só a confirmação da ausência em se/ foi nova.
- **Como evitar redundância:** trusted the impl guide spec; verificação
  da pasta poderia ter sido única.

### `grep` no `race-feedback-impl-guide.md` por "Play ME / Defeat music"

- **Objetivo:** confirmar a spec normativa do Phase 2.
- **Resultado:** confirmou Play ME como recomendado em §3.2/§3.3.
- **Contribuição direta:** sim.
- **Substituição possível:** leitura direta da §3.3 uma vez no início
  teria evitado a need de grep.

### `Edit` (5 chamadas) para correções cirúrgicas

- **Objetivo:** aplicar correções.
- **Resultado:** tasks atualizadas, DoD consistente.
- **Contribuição direta:** sim.
- **Substituição possível:** nenhuma.

### `Bash` final com `grep` para verificar edits

- **Objetivo:** confirmar que patches/audits renomeados não deixaram
  referências stale.
- **Resultado:** pegou `task-2.3.md:11` (Objective ainda dizia "Patch D
  e E").
- **Contribuição direta:** sim.
- **Como evitar redundância:** sempre rodar; pegou um erro que teria
  passado.

## 4. Intervenções e correções do usuário

### Intervenção: escolha da fase via `AskUserQuestion`

- **Instrução:** usuário escolheu Fase 2 e confirmou diretório de
  retrospectivas.
- **Problema anterior:** o prompt template não preenchia FASE_ATUAL /
  DIR_RETROSPECTIVAS / TASKS_MD.
- **Suposição causadora:** template genérico sem parâmetros inferidos.
- **Mudança:** direcionou para Fase 2 com retrospectiva Fase 1.
- **Regra reutilizável:** ao receber prompt template com variáveis
  obrigatórias não-preenchidas, perguntar antes de explorar.

### Intervenção: escolha do destino da retrospectiva

- **Instrução:** usuário escolheu
  `retrospetivas/fase2/retrospectiva-fase2-revisao-tasks.md`.
- **Problema anterior:** argumento do comando apontava para `fase2/`
  mas convenção (Fase 1) é `retrospetivas/`.
- **Mudança:** criado subdiretório `retrospetivas/fase2/`.
- **Regra reutilizável:** quando o argumento de um comando conflita com
  a convenção observada, perguntar antes de inferir.

Nenhuma outra correção foi necessária. O usuário não corrigiu nenhuma
edição de task — todas as alterações passaram sem revisão.

## 5. Análise de desperdício

### Investigação "como o usuário ouve Victory ME se PlaySE não carrega"

- **O que aconteceu:** 3-4 tool calls extras (`ls audio/se/`, grep por
  Victory1, check System.json) para resolver um mistério que era fora
  de escopo.
- **Impacto estimado:** médio.
- **Causa:** curiosidade sobre divergência pasta/comando em vez de
  focar na correção da task.
- **Como evitar:** se a task pede correção e o guia é claro, registrar
  a divergência como nota e seguir. Investigação fica para Playtest.

### Leitura integral de `findings.md` e `fase-1-completa.md`

- **O que aconteceu:** li os dois arquivos completos (~280 + ~270 linhas).
- **Impacto estimado:** médio.
- **Causa:** não sabia quais seções eram relevantes antes de ler.
- **Como evitar:** ler primeiro o índice/sumário; em artifacts de fase,
  focar na seção "Definition of Done" e na "Notas para a próxima fase".

### Deliberação longa sobre renomear D/E → G/H

- **O que aconteceu:** várias rodadas de raciocínio interno antes de
  commitar o rename.
- **Impacto estimado:** baixo (não consumiu tool calls, só context).
- **Causa:** R4 ("não reescrever trechos corretos") vs colisão real de
  audits.
- **Como evitar:** regra clara: se a colisão de nomes cria ambiguidade
  de audit em handoff, renomear é sempre proporcional.

### Deliberação sobre converter PlaySE → Play ME

- **O que aconteceu:** considerou Option A (manter PlaySE) vs Option B
  (converter) por várias rodadas.
- **Impacto estimado:** baixo.
- **Causa:** R5 ("em dúvida, pergunte") vs guia §3.3 claro.
- **Como evitar:** quando guia normativo e estado atual divergem, guia
  vence; registrar a conversão explicitamente na task.

## 6. Caminho mínimo recomendado

1. **Confirmar parâmetros da sessão.**
   - Entrada: prompt template com FASE_ATUAL / DIR_RETROSPECTIVAS /
     TASKS_MD não-preenchidos.
   - Ferramenta: `AskUserQuestion`.
   - Resultado esperado: fase e caminhos definidos.
   - Critério: usuário respondeu.

2. **Ler tasks e retrospectiva em paralelo.**
   - Entrada: TASKS_MD, task-<fase>.*.md, retrospectivas anteriores.
   - Ferramenta: `Read` paralelo.
   - Resultado esperado: lista de possíveis inconsistências.
   - Critério: pelo menos uma divergência identificada.

3. **Ler seletivamente `findings.md` e `fase-N-completa.md`.**
   - Entrada: seções "Definition of Done", "Notas para a próxima fase",
     e §6/§9 se existirem.
   - Ferramenta: `Read` com offset/limit quando possível.
   - Resultado esperado: estado pós-fase-anterior mapeado.
   - Critério: índices de comandos e patches da fase anterior confirmados.

4. **Dump direto do JSON relevante via Python.**
   - Entrada: arquivo `CommonEvents.json` e índice do CE.
   - Ferramenta: `Bash` com script Python one-liner.
   - Resultado esperado: opcode, índices, e params reais.
   - Critério: cada afirmação factual das tasks agora tem fonte
     verificada.

5. **Verificar conflito de namespaces de patches entre fases.**
   - Entrada: `grep` por `patch_[a-z]_` e `Audit [A-Z]` em
     `fase*/build_phase*.py` e em tasks.
   - Ferramenta: `Bash`.
   - Resultado esperado: lista de letras já em uso.
   - Critério: se conflito detectado, renomear na fase atual.

6. **Aplicar correções cirúrgicas via `Edit`.**
   - Entrada: lista de correções com old_string/new_string.
   - Ferramenta: `Edit`.
   - Resultado esperado: arquivos de task atualizados.
   - Critério: cada edição endereça uma divergência verificada.

7. **Verificação final: rodar grep por stale references.**
   - Entrada: nomes antigos (Patch D, Audit E, etc.).
   - Ferramenta: `Bash` com grep.
   - Resultado esperado: zero hits (ou apenas em notas explicativas).
   - Critério: nenhum rename incompleto.

## 7. Conhecimento reutilizável

### Fatos confirmados

- O dump textual `ce19-dump.txt` em `fase1/` tem labels não-confiáveis
  (rotulou `TintPicture` code 223 como `EraseEvent`). Sempre validar
  opcodes via `python3 -c "import json; ..."` direto no
  `CommonEvents.json`.
- `Victory1.ogg`, `Defeat1.ogg`, `Gameover1.ogg` existem apenas em
  `audio/me/`. `audio/se/` não tem essas faixas. PlaySE não pode
  carregá-las.
- `System.json` define `victoryMe: Victory1`, `defeatMe: Defeat1`,
  `gameoverMe: Gameover1` como defaults canônicos.
- CE 19 tem 55 comandos no estado pós-Fase 1 v2 (ceremony lock em
  cmd[0–1], audio em cmd[6], script VITORIA_PASSOU em cmd[9–13],
  WAIT_INPUT em cmd[29–33], SW_PAUSED=OFF em cmd[34]).
- RMMZ Play ME (code 246) e PlaySE (code 249) compartilham o formato
  de parameter dict `{"name", "volume", "pitch", "pan"}`; diferença é
  só a pasta de carga (me/ vs se/) e a semântica de resumo de BGM.
- `set()` sobre dicts em Python levanta TypeError (dicts não são
  hashable). Audits que filtram commands por code e computam
  `set(names)` precisam extrair um campo string primeiro.

### Preferências do usuário

- Edits cirúrgicos; sem reescrita de seções corretas.
- Sem referência a arquivos de retrospectiva nos artefatos editados.
- Perguntar quando há dúvida real; não forçar mudança.
- Convenção: retrospectivas em `retrospetivas/`, podendo ter
  subpastas por fase (`retrospetivas/fase2/`).
- Autor: `Edney <edney_reis999@hotmail.com>`; sem Co-authored-by.

### Restrições técnicas

- Tasks em `/Users/edney/projects/coreto/summer26/Jhonny/planos/003-bug-fix-round1/`
  usam numeração por fase com patches nomeados por letra.
- Patches D/E/F foram introduzidos na Fase 1 v2; letras G/H em diante
  ficam disponíveis para Fase 2.
- `CommonEvents.json` tem 1-based CE index externo, 0-based command
  index interno; CE 19 = `ces[19]`, command N = `ces[19]['list'][N]`.
- Code 121 com `params[2]===0` liga switch; `params[2]===1` desliga.
- Memory `mz-playtest-pauses`: F12 pausa o game loop em Playtest.
- Memory `rpg-mz-indent-skipbranch`: cmds dentro de branch IF/ELSE
  devem ter indent = parent + 1.

### Armadilhas conhecidas

- Confiança em dumps textuais gerados por scripts auxiliares — labels
  podem estar errados. Sempre validar com query direta ao JSON.
- Reutilizar letras de patch entre fases sem checar a fase anterior —
  colisão de audits.
- Escrever audit Python com `set(dict_list)` — crasha em runtime.
- Inferir divergências a partir de tasks sem verificar o JSON — tasks
  podem estar desatualizadas.
- Investigar mistérios periféricos (som que "deveria" não tocar)
  durante revisão de tasks — fora de escopo.

### Heurísticas recomendadas

- Em revisão de tasks pós-fase, sempre ler: tasks atuais + retrospective
  anterior + findings + fase-N-completa (seções relevantes).
- Antes de editar uma task que cita opcode/índice, dump direto do JSON.
- Quando o guia de implementação divergir do código atual, o guia é
  normativo — task deve specar a conversão.
- Reservar letras de patch por fase; checar `fase*/build_phase*.py`
  antes de escolher letras.
- Para cada conversão de opcode/estrutura, adicionar audit específico
  que detecte regressão.
- Para cada região crítica (ceremony lock, WAIT_INPUT), adicionar audit
  "intocado" para impedir que patches adjacentes quebrem o estado.

## 8. Informações que deveriam estar no prompt inicial

- **Obrigatório:** FASE_ATUAL, DIR_RETROSPECTIVAS, TASKS_MD preenchidos
  no template (atualmente o template vem com placeholders vazios).
- **Obrigatório:** caminho do `race-feedback-impl-guide.md` (guia
  normativo) para consulta direta sem grep.
- **Útil:** lista das letras de patch já usadas em fases anteriores
  (`fase1/` usou A–F).
- **Útil:** referência ao memory `rpg-mz-indent-skipbranch` e
  `mz-playtest-pauses` para lembrar de aplicá-los.
- **Opcional:** convenção de subpasta para retrospectivas por fase.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

#### Melhoria 1

- **Problema observado durante a execução:** tasks da Fase 2 diziam
  `Play ME` (code 246) mas o código real é `PlaySE` (code 249) com
  asset em `audio/me/`. Essa divergência não estava documentada.
- **Informação ausente ou incorreta:** contrato de mapeamento
  pasta-canal-opcode do RMMZ (ME→me/, SE→se/, BGM→bgm/, BGS→bgs/),
  com a regra prática: "se o asset só existe em me/, o comando deve
  ser Play ME (246)".
- **Por que pertence à análise técnica:** é uma restrição arquitetural
  do RMMZ que governa toda edição de áudio.
- **Seção sugerida:** "Stack de áudio RMMZ — contrato pasta/canal/opcode".
- **Texto sugerido:**

```markdown
### Stack de áudio RMMZ

| Canal | Opcode | Pasta de carga |
|-------|--------|----------------|
| BGM   | 247    | audio/bgm/     |
| BGS   | 250    | audio/bgs/     |
| ME    | 246    | audio/me/      |
| SE    | 249    | audio/se/      |

Regra prática: cada opcode carrega apenas da sua pasta. Se um asset
existe em `audio/me/` mas o comando é `PlaySE` (249), o áudio não
carrega. Antes de editar qualquer comando de áudio, confirmar a pasta
do asset e usar o opcode correspondente. ME (mas não SE) resume o BGM
ao final do sting — relevante para telas cerimoniais que param o BGM.
```

- **Impacto esperado:** elimina a divergência opcode/pasta em futuras
  edições de áudio.

### 9.2 Melhorias no plano de implementação

#### Melhoria 1

- **Problema observado durante a execução:** Fase 1 v2 introduziu
  Patches D/E/F; Fase 2 planejou Patches D/E novamente, gerando
  colisão de audits.
- **Deficiência do plano:** ausência de namespace de letras por fase.
- **Etapa afetada:** planejamento das fases (tasks.md).
- **Alteração recomendada:** adicionar regra de numeração ao plano.
- **Texto sugerido:**

```markdown
### Numeração de patches跨fase

Cada fase reserva uma faixa de letras. Fase N começa onde a Fase N-1
terminou. Estado atual:
- Fase 1: A, B, C, D, E, F (v2)
- Fase 2: G, H (-planejado)
- Fase 3+: I, J, K, ...

Ao criar um novo patch, grep por `patch_[a-z]_` em
`fase*/build_phase*.py` antes de fixar a letra. Se duas fases usam a
mesma letra, audits ficam ambíguos em handoffs.
```

- **Como reduz custo:** elimina a necessidade de renomear patches
  durante a execução.

### 9.3 Melhorias nas tasks da fase executada

#### Task afetada: `task-2.1.md` step 2

- **Informação ausente, ambígua ou incorreta:** dizia "Inspect CE 19
  for a `Play ME` command (code 246)"; o comando real é `PlaySE` (249)
  e o asset está em `audio/me/`.
- **Consequência observada:** implementador escreveria busca por
  code 246, acharia nada.
- **Alteração recomendada:** corrigir para `PlaySE` (code 249) +
  nota sobre divergência de pasta + remeter ao Patch H (Fase 2) que
  converte para 246.
- **Texto sugerido:** já aplicado em task-2.1.md (edição feita).
- **Como validar:** implementador lê task-2.1 step 2 e encontra
  opcode correto sem investigação.

#### Task afetada: `task-2.2.md` Patch D / Patch E

- **Informação ausente, ambígua ou incorreta:** (a) nomes D/E em
  colisão com Fase 1 v2; (b) spec assumia code 246 sem conversão
  explícita; (c) "três freeze switches" em step 2 estava errado (são
  dois no topo).
- **Consequência observada:** implementador confundiria com Fase 1;
  escreveria patch com code 246 sem conversão; esperaria três switches
  no topo e acharia dois.
- **Alteração recomendada:** renomear para G/H; converter 249→246
  explícito; corrigir "três" para "duas" + descrever layout v2.
- **Texto sugerido:** já aplicado em task-2.2.md.
- **Como validar:** implementador lê Patch H e vê que responsabilidade
  inclui conversão de opcode.

#### Task afetada: `task-2.3.md` Audit E

- **Informação ausente, ambígua ou incorreta:** audit usava
  `set(names)` onde `names` era lista de dicts (Play ME params);
  crasharia com TypeError em runtime.
- **Consequência observada:** audit nunca rodaria com sucesso.
- **Alteração recomendada:** extrair `.get('name')` antes do `set()`.
- **Texto sugerido:** já aplicado (Audit H em task-2.3.md).
- **Como validar:** rodar o one-liner Python e confirmar que printa
  "Audit H OK".

#### Task afetada: ausência de audit anti-regressão para o ceremony lock

- **Informação ausente:** nenhum audit confirmava que os patches da
  Fase 2 não quebraram o ceremony lock da Fase 1 v2.
- **Consequência observada:** risco de regressão silenciosa em
  `SW_INPUT_LOCKED`/`SW_PAUSED`/`WAIT_INPUT`.
- **Alteração recomendada:** adicionar Audit J (ceremony lock
  intacto).
- **Texto sugerido:** já aplicado em task-2.3.md.
- **Como validar:** rodar o audit após generator e confirmar "OK".

### 9.4 Problemas fora do escopo dos artefatos

#### Problema: deliberação longa sobre rename vs keep

- **Por que fora do escopo:** foi ineficiência operacional da LLM,
  não deficiência da spec.
- **Tratamento:** adotar heurística interna "colisão de audits em
  handoff → renomear é proporcional".
- **Proteção:** nenhuma alteração em artefatos.

#### Problema: investigação periférica sobre "como Victory ME toca"

- **Por que fora do escopo:** mistério de runtime do MZ, não falta
  de spec.
- **Tratamento:** adicionei sanity-check note em task-2.3.
- **Proteção:** nota operacional no handoff.

### 9.5 Matriz de rastreabilidade das melhorias

| **Problema observado** | **Causa principal** | **Artefato responsável** | **Alteração necessária** | **Prioridade** |
|---|---|---|---|---|
| Task dizia Play ME (246), código é PlaySE (249) | Stack de áudio RMMZ não documentada | Análise técnica | Adicionar seção "Stack de áudio RMMZ" | Alta |
| Patches D/E reutilizados em Fase 2 | Plano sem namespace de letras por fase | Plano de implementação | Adicionar regra de numeração跨fase | Alta |
| Task-2.1/2.2 com opcode errado | Análise técnica não consultada | Task | Já corrigido em task-2.1/2.2 | Alta |
| Task-2.3 Audit E com bug de hashability | Erro de execução na escrita original | Task | Já corrigido (Audit H) | Alta |
| Ausência de audit anti-regressão do ceremony lock | Plano não exigia auditoria de região intocada | Task | Já adicionado (Audit J) | Média |
| Deliberação sobre rename | Heurística interna ausente | Fora do escopo | Regra operacional | Baixa |
| Investigação periférica de áudio | Tentação de resolver mistério fora de escopo | Fora do escopo | Discipline | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

```markdown
### Stack de áudio RMMZ

| Canal | Opcode | Pasta de carga |
|-------|--------|----------------|
| BGM   | 247    | audio/bgm/     |
| BGS   | 250    | audio/bgs/     |
| ME    | 246    | audio/me/      |
| SE    | 249    | audio/se/      |

Regra prática: cada opcode carrega apenas da sua pasta. Se um asset
existe em `audio/me/` mas o comando é `PlaySE` (249), o áudio não
carrega. Antes de editar qualquer comando de áudio, confirmar a pasta
do asset e usar o opcode correspondente. ME (mas não SE) resume o BGM
ao final do sting — relevante para telas cerimoniais que param o BGM.
```

#### Patch sugerido para o plano de implementação

```markdown
### Numeração de patches跨fase

Cada fase reserva uma faixa de letras. Fase N começa onde a Fase N-1
terminou. Estado atual:
- Fase 1: A, B, C, D, E, F (v2)
- Fase 2: G, H (planejado)
- Fase 3+: I, J, K, ...

Ao criar um novo patch, grep por `patch_[a-z]_` em
`fase*/build_phase*.py` antes de fixar a letra. Se duas fases usam a
mesma letra, audits ficam ambíguos em handoffs.
```

#### Patch sugerido para as tasks da fase executada

Todas as correções já foram aplicadas nesta sessão:

- `task-2.1.md` step 2 e DoD: opcode corrigido para 249, nota sobre
  divergência de pasta, preferência canônica Defeat1.
- `task-2.2.md` References, Patch G/H, step 2–5: renomeado D/E → G/H,
  conversão 249→246 explícita, layout v2 corrigido.
- `task-2.3.md` Audits G/H/I/J: rename, fix de hashability,
  audit anti-regressão do ceremony lock, nota de sanity-check.

Nenhuma alteração adicional recomendada para as tasks.

#### Ações fora do fluxo de especificação

- Criar script utilitário `dump_ce.py <id>` que imprime um CE por ID
  com labels de opcode confiáveis (ao invés dos labels não-confiáveis
  do `ce19-dump.txt` atual). Reduziria dependência de queries Python
  ad-hoc em futuras revisões.

## 10. Checklist operacional

1. Antes de editar tasks que citam opcode ou índice, rodar
   `python3 -c "import json; ..."` direto no `CommonEvents.json`.
2. Não confiar em dumps textuais — labels podem estar errados.
3. Antes de escolher letras de patch, `grep` por `patch_[a-z]_` em
   todas as fases anteriores.
4. Se o guia normativo divergir do código atual, o guia vence — specar
   a conversão explicitamente.
5. Para cada região crítica (ceremony lock, WAIT_INPUT, branches
   importantes), adicionar audit "região intocada".
6. Para cada conversão de opcode/structure, adicionar audit
   específico que detecte regressão.
7. Em Python one-liners de audit, validar que `set()` recebe apenas
   tipos hashable; extrair campo scalar de dicts antes.
8. Não investigar mistérios periféricos durante revisão de tasks —
   sinalizar para validação Playtest.
9. Rodar `grep` final por nomes antigos renomeados para pegar stale
   references.
10. Confirmar destination de retrospectiva antes de salvar (convenção
    `retrospetivas/` pode ter subpastas por fase).
