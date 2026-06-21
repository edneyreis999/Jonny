# Retrospectiva — Fase 3 (HUD Consciência) + Bonus Fix (HUD Risco)

> Destinada a outra LLM que for executar tarefa equivalente no projeto
> Jhonny. Foco em armadilhas, desperdícios e correções reutilizáveis —
> não em narrativa.

## 1. Resumo da tarefa

**Pedido:** Implementar Fase 3 do plano `Jhonny/planos/003-bug-fix-round1/tasks.md`
(bugs #5 "HUD Consciência stuck at 0%" e #6 "HUD Consciência desaparece
após primeira tentativa").

**Entregue:**
- Fase 3 completa (3 patches I-a/I-b/J) — CE 6 convertido em parallel com
  loop HUD_TICK + re-bake pic 60; CE 5 INIT re-show pic 60; CE 11/12/18
  tiveram callers `code 117 [6]` removidos.
- **Bonus fix** descoberto em Playtest via `loki:feedback`: HUD de risco
  (pic 61) também estava stale. Trocado `\V[106]%` (TAXA_SUCESSO) por
  `\V[103]%` (P_CENA) em 4 lugares (CE 8 cmds 5-6, CE 9 cmds 7-8).

**Critério de sucesso:** user disse "FUNCIONOU" após Playtest em
2026-06-21. Audits I/J/K + 4 sanity checks programáticos em Python
passaram; generator idempotente (2ª run produz "skipped" x3 + git diff
vazio).

**Restrições relevantes:**
- RPG Maker MZ + plugin TextPicture + Common Events JSON.
- Convenções de memória: `never-delete-common-events`,
  `rpg-mz-indent-skipbranch`, `user-testable-feedback`.
- Engine source `Jhonny/js/rmmz_objects.js` é a fonte da verdade para
  opcodes (specs podem estar invertidas).

## 2. Decisões técnicas e inferências

### 2.1 — Converter CE 6 (action) em parallel em vez de criar novo CE
- **Decisão:** Estender CE 6 (`EV_UpdateHud`) mudando trigger 0→2 e
  switch 1→100, adicionando loop HUD_TICK.
- **Motivo:** task-3.2 dizia explicitamente "if CE named EV_UpdateHud
  exists, extend it". CE 6 já tinha esse nome.
- **Evidência:** `ces[6].name == 'EV_UpdateHud'` + spec audit I exigia
  nome+trigger+switch+label específicos nesse CE.
- **Resultado:** Funcionou.
- **Avaliação:** Necessária — alternativas quebravam o audit.
- **Melhoria futura:** Especificar o destino exato (CE index + nome)
  elimina ambiguidade.

### 2.2 — Adicionar Patch I-b (remoção de callers `117 [6]`) fora da spec
- **Decisão:** Remover `code 117 [6]` em CE 11/12/18 no mesmo patch que
  converte CE 6 em parallel.
- **Motivo:** Spec não mencionava, mas `command117` em
  `rmmz_objects.js:10121` faz `setupChild(list, eventId)` — caller adota
  lista do CE chamado e executa sincronamente. Com loop HUD_TICK
  infinito, caller (CE 11/12/18) travaria.
- **Evidência:** Leitura direta do handler `command117`.
- **Resultado:** Funcionou — sem hang no Playtest.
- **Avaliação:** Necessária e crítica. Sem isso, jogo congela na primeira
  ação Safe/Risk/Crash.
- **Melhoria futura:** task-3.2 deveria ter um checkpoint: "identifique
  todos os callers do CE sendo modificado antes de aplicar mudanças de
  trigger/loop". Salvo como memória
  `rmmz-parallel-ce-code117-hang.md`.

### 2.3 — Guard SW_PAUSED dentro do loop, não no topo da lista
- **Decisão:** Colocar `Label HUD_TICK` ANTES do `If SW_PAUSED → Exit`
  (dentro do loop), não antes.
- **Motivo:** Spec dizia "topo do list". Mas parallel CE com loop
  infinito reinicia do topo só quando a run termina — se o guard estiver
  antes do label, roda uma vez e nunca mais.
- **Evidência:** Semântica do paralelo interpreter + leitura do
  `command115` (Exit → `_index = list.length`).
- **Resultado:** Funcionou — SW_PAUSED é re-avaliado a cada tick.
- **Avaliação:** Necessária. Spec estava sutilmente errada.
- **Melhoria futura:** Spec deveria dizer "dentro do loop, como primeiro
  comando após Label".

### 2.4 — Bonus fix: trocar display var 106 → var 103 em vez de adicionar re-bake paralelo
- **Decisão:** Trocar `\V[106]%` por `\V[103]%` no pic 61.
- **Motivo:** var 103 (P_CENA) é rollada por cena em CE 7 cmd 23 antes do
  render; pic 61 já é re-bakeado por cena via CE 8/9 chamados por CE 7.
  Logo display automaticamente correto, sem precisar de mais nada.
- **Evidência:** Trace completo do fluxo CE 7 → CE 8/9 → pic 61.
- **Resultado:** Funcionou — Playtest confirmou.
- **Avaliação:** Necessária — adotada após dialog `loki:feedback`.
- **Melhoria futura:** Heurística geral: antes de adicionar re-bake
  paralelo, verificar se a variável já é setada no momento do bake.

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Necessário? | Substituível? |
| ---------- | -------- | ----------- | ------------- |
| `rg "TextPicture"` | Achar bakes TextPicture | Sim | Único grep basta — não repetir |
| `rg "Consci\|Taxa"` | Achar texto HUD | Sim | Combinar com grep anterior em uma chamada |
| `python3 -c` dumps CE 5/6/7/8/9/11/12/16/18 | Inspeção comando-a-comando | Sim | **Um único script dump-all** economiza 6-8 chamadas |
| `python3 -m json.tool` | Validar JSON pós-edit | Sim | Insubstituível |
| Audits I/J/K Python | Verificar estado final | Sim | Já na spec — executar como blocos |
| Python inline para bonus fix | 4 substituições diretas | Sim | Mais seguro que `Edit` com `replace_all` em JSON |

**Desperdícios observados:**
- Rodei 4-5 scripts Python separados para dumpar CEs diferentes. Um
  único `dump_all.py` no início teria economizado ~5 chamadas.
- Re-rodei `rg TextPicture` depois do bonus fix para confirmar — uma
  única checagem Python via `json.load` foi suficiente e mais barata.

## 4. Intervenções e correções do usuário

### 4.1 — `loki:feedback` para desambiguar "HUD bugado"
- **Antes:** Presumi que "bug do HUD" se referia aos bugs #5/#6 já
  mapeados (HUD Consciência).
- **Correção:** User esclareceu via skill `loki:feedback` que era a **HUD
  de risco** (pic 61), não a HUD de consciência (pic 60). Bug era
  diferente, não estava no plano original.
- **Causa:** Assumi que "HUD" sem qualificação = HUD principal.
- **Execução mudou:** Iniciei dialog `loki:feedback` (uma pergunta por
  turno), identifiquei var 106 vs var 103, confirmei comportamento
  esperado, apliquei cirurgicamente.
- **Regra reutilizável:** Antes de assumir o escopo de "bug em HUD",
  listar quais HUDs existem e perguntar qual. Não inferir.

### 4.2 — Reorganização de arquivos mid-session
- **Antes:** Salvei artefatos em `Jhonny/planos/003-bug-fix-round1/fase3/`.
- **Correção:** User moveu para `interaction/fase3/` e me informou o novo
  caminho quando meu `Edit` falhou com "File does not exist".
- **Causa:** Diretório foi reorganizado entre turns sem aviso explícito.
- **Execução mudou:** Passei a usar `interaction/fase3/` para docs
  posteriores.
- **Regra reutilizável:** Antes de escrever em caminho salvo em sessão
  anterior, checar existência com `ls`. Falha de `Edit`/`Read` em arquivo
  conhecido → rodar `ls` no diretório pai.

### 4.3 — Confirmação de design via `loki:feedback`
- **Antes:** Propus 3 opções (A/B/C) para o comportamento da HUD de risco.
- **Correção:** User escolheu uma quarta: "mostrar taxa crua, jogador faz
  conta mentalmente".
- **Causa:** Minha hipótese inicial era "mostrar taxa somada" — não
  considerei que designer preferiria dar menos informação.
- **Regra reutilizável:** Para decisões de UX de HUD, NÃO listar só
  opções técnicas; incluir "não mostrar nada somado" como possibilidade.

## 5. Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
| ----------- | ------- | ----- | ----------- |
| Múltiplos dumps Python separados de CEs | Médio | Cada dump foi feito reativo a uma dúvida pontual | `dump_all_ces.py` único no início mostrando CE 0-19 completo |
| Re-execução de `rg TextPicture` pós-bonus fix | Baixo | Quis confirmar visualmente o estado final | Confiar no resultado do `json.load` + assertion explícita |
| Docstring com `\V[...]` causando SyntaxWarning | Baixo | Esqueci que `\V` não é escape Python válido | Padronizar `r"""..."""` para docstrings de generator que mencionem `\V`/`\C` RMMZ |
| Leu `task-3.2.md` + `task-3.3.md` por inteiro (3 reads) | Baixo | Cada um <100 linhas, OK | Poderia ter lido via Read com offset/limit se fossem maiores |
| 3 turns de `loki:feedback` para caracterizar o bonus bug | Médio | User demorou a dar sintoma exato ("meio bugado") | Primeira pergunta do feedback deveria ser "qual sintoma específico" |

## 6. Caminho mínimo recomendado

Para executar Fase 3 + bonus fix novamente:

1. **Dump único** dos CEs 5, 6, 8, 9, 11, 12, 16, 18 com Python —
   captura owners, callers, bakes em uma chamada.
2. **Busca callers** do CE que será modificado: `for ce: for cmd: if
   cmd.code==117 and cmd.params==[6]`. CRÍTICO antes de mudar trigger.
3. **Verifique opcodes** em `rmmz_objects.js` para 111/115/117/118/119/
   121/230/231/235/357/657 — lista canônica está no topo do generator.
4. **Escreva o generator** `build_phase3_ces.py` com patches I-a, I-b, J
   — idempotentes via pattern detection.
5. **Rode 2x** (applied→skipped) + valide JSON + rode audits I/J/K.
6. **Hard-refresh Playtest** com 3 checkpoints: HUD frame 1, live update,
   sobrevivência crash→restart.
7. **Playtestbonus:** se user relatar qualquer HUD "stuck" ou "stale",
   perguntar qual HUD especificamente. Trace variável displayada vs
   variável setada — se forem diferentes ou tempos diferentes, é o bug
   TextPicture-bake-timing.

**Critério de parada:** "FUNCIONOU" do user + audits Python "OK" +
generator idempotente confirmado por git diff vazio.

## 7. Conhecimento reutilizável

### Fatos confirmados
- TextPicture (plugin) bakeia `\V[N]` no momento do Show Picture (code
  231). Não é dinâmico. Para HUDs live, precisa re-bake ou usar variável
  já setada.
- `command117` em RMMZ faz `setupChild(list, eventId)` — caller executa
  lista do CE chamado sincronamente. Loop infinito no CE chamado → hang.
- Variável `var 103 (P_CENA)` é rollada por `JhonnyRace.rollPCena()` em
  CE 7 cmd 23 a cada nova cena.
- Variável `var 106 (TAXA_SUCESSO)` = `clamp(cons[104] + P_CENA[103], 0,
  100)`, computada só em CE 12 cmd 7 (após clicar Risk).
- CE 18 (Crash) cmd 21 apaga pictures 1-60 via script.
- CE 19 head tem `SW_INPUT_LOCKED=ON + SW_PAUSED=ON` (ceremony lock da
  Fase 1 v2) — não tocar.

### Preferências do usuário
- Designer prefere mostrar **menos** informação somada — jogador faz
  conta mentalmente. Ex: HUD mostra P_CENA cru, não `cons + P_CENA`.
- Toda validação Playtest precisa de sinal visível/audível (regra já em
  memória `user-testable-feedback`).
- Hard-refresh (`Cmd+Shift+R`) é obrigatório após escrever em
  `data/*.json` — cache do browser mascara fixes.
- User reorganiza diretórios entre turns sem aviso — sempre checar
  existência antes de `Edit`.

### Restrições técnicas
- CEs em RMMZ nunca devem ser deletados/nulled — limpar a `list` para
  vazio canônico (memória `never-delete-common-events`).
- Indent de comandos inseridos em branch IF/ELSE DEVE matchear indent
  do entorno ou `skipBranch` termina cedo (memória
  `rpg-mz-indent-skipbranch`).
- Opcodes RMMZ podem estar invertidos em specs antigas — `rmmz_objects.js`
  é fonte da verdade.

### Armadilhas conhecidas
- **Converter CE action→parallel com loop infinito sem remover callers
  code 117** → hang. Sempre buscar callers antes.
- **TextPicture sem re-bake** → display stale. Buscar `\V[` no JSON e
  cruzar com a lista de escritas da variável.
- **Spec dizer "topo do list" para guard em CE com loop** → ambíguo;
  pode significar dentro ou fora do loop. Clarificar antes.
- **Docstring Python com `\V`/`\C` RMMZ** → SyntaxWarning no 3.12+. Usar
  raw string ou escape duplo.

### Heurísticas recomendadas
- Antes de adicionar re-bake paralelo, verificar se variável já é setada
  no momento do bake.
- Antes de estender CE existente, buscar callers via grep em todos os
  CEs.
- Specs podem estar sutilmente erradas (indent, "topo", opcodes) —
  validar contra engine source quando há ambiguidade.
- Para HUDs, há 3 estratégias válidas (variável-pronta, re-bake paralelo,
  plugin custom). Escolher a mais simples que resolve.

## 8. Informações que deveriam estar no prompt inicial

| Item | Classificação |
| ---- | ------------- |
| Lista de CEs existentes (index→name→trigger) para o módulo | Útil |
| Mapeamento de variáveis (var N → significado semântico) | Obrigatório |
| Mapeamento de switches | Obrigatório |
| Lista de callers de cada CE via code 117 | Útil |
| Aviso explícito sobre TextPicture bake timing | Útil (já em memória) |
| Padrão idempotente de generator (C() helper, _write_back) | Útil (já existe via prior art fase1/fase2) |
| Preferência UX: não mastigar informação para o jogador | Opcional (descoberta em dialog) |
| Estrutura de diretórios pós-reorganização (`interaction/faseN/`) | Opcional (especificado pelo user quando necessário) |

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

**Problema observado:** task-3.2 pedia para estender CE 6 com loop
HUD_TICK sem mencionar que `code 117` callers causariam hang. Eu
descobri lendo `command117` em `rmmz_objects.js` antes de escrever o
generator — mas isso poderia ter sido perdido.

**Informação ausente:** Relação de callers do CE 6 (`code 117 [6]` em
CE 11/12/18) + semântica de `command117.setupChild`.

**Onde adicionar:** Seção "Ceremony-lock interaction" da task-3.2
deveria ter uma sub-seção "Caller cleanup".

**Texto sugerido:**
> **Caller cleanup obrigatório:** Antes de aplicar Patch I, identifique
> todos os CEs que chamam CE 6 via `code 117` (grep `parameters==[6]`).
> Para cada caller, remova o `117 [6]` no mesmo patch. Razão:
> `command117` em `rmmz_objects.js:10121` faz `setupChild(list, eventId)`
> — caller adota lista do CE chamado e executa sincronamente. Loop
> infinito no CE chamado → caller trava forever.

**Impacto:** Elimina o risco de uma próxima execução esquecer do
Patch I-b e quebrar o jogo em Playtest.

### 9.2 Melhorias no plano de implementação

**Problema observado:** Bonus fix (HUD Risco pic 61) não estava no
plano original. Foi descoberto em Playtest. Se tivesse sido antecipado,
teria entrado na Fase 3 (mesmo padrão de bug).

**Deficiência:** Plano tratou só bugs reportados verbalmente pelo user
em 2026-06-19. Não fez auditoria automática de "todos os bakes
TextPicture que referenciam variáveis computadas tardiamente".

**Etapa afetada:** Fase 3 (mas também repercute em Fase 4/5 se houver
outros bakes similares).

**Alteração recomendada:** Adicionar uma fase pré-plano (ou uma seção
"Pre-flight audit" no tasks.md) que lista todos os TextPicture bakes e
verifica se a variável referenciada é setada ANTES do bake.

**Texto sugerido para o topo do tasks.md:**
> **Pre-flight audit (obrigatório antes de qualquer fase):** Rode
> ```bash
> python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); [print(f'CE{i}[{j}] \\V[{...}]') for ...]"
> ```
> para listar todos os TextPicture bakes. Para cada, verifique quando a
> variável referenciada é escrita. Bakes de variáveis tardias = bug
> latente.

**Como reduziria custo:** Bonus fix seria detectado na Fase 1, não na
Fase 3. Evitaria um round de Playtest + dialog `loki:feedback`.

### 9.3 Melhorias nas tasks da fase executada

**Task 3.2 afetada.**

**Informação ausente:** Task não mencionava que o guard SW_PAUSED deveria
estar DENTRO do loop HUD_TICK (depois do Label), não antes. Spec disse
"topo do list" — ambíguo.

**Consequência:** Eu inferencei corretamente, mas outra LLM poderia
colocar antes do Label e o guard não funcionaria após a primeira run.

**Alteração recomendada:** Substituir trecho "Add a guard at the top of
EV_UpdateHud's list: ..." por:

**Texto sugerido:**
> **Guard SW_PAUSED dentro do loop (não antes do Label):**
> Layout correto:
> ```
> [0] Label HUD_TICK
> [1] If SW_PAUSED == ON     (code 111, indent 0, params [0,104,0])
> [2]   Exit Event Processing (code 115, indent 1)
> [3] End                     (code 412, indent 0)
> [4..] corpo do tick
> [N] Wait 6
> [N+1] Jump HUD_TICK
> ```
> Razão: parallel CE só reavalia o topo quando a run termina. Guard
> antes do Label rodaria uma vez e nunca mais. Dentro do loop,
> re-avalia a cada tick. `Exit` (code 115) termina a run; parallel CE
> reinicia do índice 0 no frame seguinte.

**Como validar:** Audit I já verifica `[0,104,0]` nos primeiros 8 cmds.
Adicionar assertion específica: cmd[0] deve ser Label HUD_TICK.

### 9.4 Problemas fora do escopo dos artefatos

| Problema | Por que fora do escopo | Como tratar |
| -------- | --------------------- | ----------- |
| User reorganizou `fase3/` → `interaction/fase3/` mid-session | Decisão operacional do user | Checar `ls` antes de `Edit` em path conhecido |
| Docstring com `\V` causando SyntaxWarning | Padrão Python, não do projeto | Usar raw docstrings em generators RMMZ |
| Bug bonus descoberto em Playtest | Resultado legítimo de teste manual, não falha de spec | Manter `loki:feedback` como mecanismo de descoberta |
| 3 turns de `loki:feedback` para caracterizar bug | Estratégia do skill, não do plano | Considerar adicionar à skill `loki:feedback`: "primeira pergunta deve ser 'qual sintoma específico'" |

### 9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
| ------------------ | --------------- | -------------------- | -------------------- | ---------- |
| Hang de callers após converter CE 6 para parallel | Spec não mencionava code 117 callers | Task 3.2 | Adicionar seção "Caller cleanup obrigatório" | Alta |
| Guard SW_PAUSED posicionado ambíguo | "topo do list" sem especificar dentro/fora do loop | Task 3.2 | Especificar layout com Label antes do guard | Alta |
| Bonus bug HUD Risco não detectado antes do Playtest | Plano não tinha pre-flight audit de TextPicture bakes | Plano de implementação | Adicionar "Pre-flight audit" no tasks.md | Média |
| Reorganização de diretórios mid-session | Decisão operacional do user | Fora do escopo | Checar `ls` antes de `Edit` em paths antigos | Baixa |
| SyntaxWarning de `\V` em docstring | Padrão Python | Fora do escopo | Raw docstrings | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

```markdown
## Variáveis e switches canônicas (Corrida)

| ID  | Tipo     | Nome             | Semântica                              | Escrita por                          |
| --- | -------- | ---------------- | -------------------------------------- | ------------------------------------ |
| 100 | switch   | SW_RACE_ACTIVE   | Owner de todos os parallel CEs         | CE 5 cmd 20                          |
| 101 | switch   | SW_INPUT_LOCKED  | Pause operacional                      | CE 5 cmd 18, CE 18 cmd 19            |
| 104 | switch   | SW_PAUSED        | Pause cerimonial                       | CE 19 head, CE 19 foot               |
| 103 | variable | P_CENA           | Penalidade/potencial da cena (0-100)   | CE 7 cmd 23 (`JhonnyRace.rollPCena`) |
| 104 | variable | CONSCIENCIA      | Consciência acumulada                  | CE 11/12, CE 5 INIT, CE 18 cmd 8     |
| 105 | variable | PONTOS_GLORIA    | Pontuação                              | CE 11/12 cmd 15, CE 5 INIT, CE 18    |
| 106 | variable | TAXA_SUCESSO     | `clamp(cons + P_CENA, 0, 100)`         | CE 12 cmd 7 (apenas após Risk)       |
| 112 | variable | TENTATIVA        | Número da tentativa atual              | CE 5 cmd 4                           |
| 117 | variable | VITORIA_PASSOU   | 1=passou, 0=não                        | CE 19 script block                   |
```

#### Patch sugerido para o plano de implementação

```markdown
## Pre-flight audit (obrigatório antes de qualquer fase)

Antes de começar qualquer fase, rode:

    python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); [print(f'CE{i} ({c.get(\"name\",\"\")}) [{j}] \\V-exibido: {cmd[\"parameters\"][3].get(\"text\",\"\")}') for i,c in enumerate(ces) if c for j,cmd in enumerate(c.get('list',[])) if cmd.get('code')==357 and cmd.get('parameters',[None])[0]=='TextPicture']"

Para cada bake TextPicture, verifique se a variável referenciada é
setada ANTES do bake. Bakes de variáveis tardias = bug latente
(TextPicture não é dinâmico).
```

#### Patch sugerido para as tasks da fase executada

**Task 3.2 — substituir seção "Ceremony-lock interaction":**

```markdown
## Caller cleanup + Guard posicionamento

### Caller cleanup (obrigatório antes de Patch I-a)
Identifique todos os CEs que chamam CE 6 via `code 117`:
    python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); [print(f'CE{i}[{j}] chama CE 6') for i,c in enumerate(ces) if c for j,cmd in enumerate(c.get('list',[])) if cmd.get('code')==117 and cmd.get('parameters')==[6]]"

Para cada caller, remova o `117 [6]` no mesmo patch (Patch I-b).
Razão: `command117` em `rmmz_objects.js:10121` faz `setupChild(list,
eventId)` — caller adota lista do CE chamado e executa sincronamente.
Loop infinito no CE chamado → caller trava forever.

### Posicionamento do guard SW_PAUSED (DENTRO do loop)
Layout correto:
    [0] Label HUD_TICK
    [1] If SW_PAUSED == ON     (code 111, indent 0, params [0,104,0])
    [2]   Exit Event Processing (code 115, indent 1)
    [3] End                     (code 412, indent 0)
    [4..] corpo do tick
    [N]   Wait 6
    [N+1] Jump HUD_TICK

Razão: parallel CE só reavalia o topo quando a run termina. Guard antes
do Label rodaria uma vez só. Dentro do loop, re-avalia a cada tick.
```

#### Ações fora do fluxo de especificação

- Adicionar à skill `loki:feedback` (ou à memória operacional): "primeira
  pergunta deve ser 'qual sintoma específico'", não "A/B/C de hipóteses".
  Reduz 3 turns → 1 turn para caracterização de bug.
- Padronizar raw docstrings (`r"""..."""`) em generators RMMZ para
  evitar SyntaxWarning com `\V`/`\C`.

## 10. Checklist operacional (próxima execução)

- [ ] Rodar Pre-flight audit (TextPicture bakes + variáveis tardias).
- [ ] Listar CEs 0-19 com nome/trigger/switch antes de qualquer edição.
- [ ] Para CE sendo estendido: grep `code 117 [N]` em todos os CEs.
- [ ] Verificar opcodes 111/115/117/118/119/121/230/231/235/357/657 em
      `rmmz_objects.js`.
- [ ] Generator deve ser idempotente — 2ª run imprime "skipped" x N e
      produz git diff vazio.
- [ ] `python3 -m json.tool Jhonny/data/CommonEvents.json` valida.
- [ ] Audits I/J/K + sanity checks Python passam.
- [ ] User faz hard-refresh (`Cmd+Shift+R`) antes do Playtest.
- [ ] Sinal visível/audível canônico confirmado pelo user ("FUNCIONOU").
- [ ] Memory `rmmz-textpicture-bake-timing.md` + `rmmz-parallel-ce-
      code117-hang.md` consultadas antes de começar.
