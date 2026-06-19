---
status: concluida
data: 2026-06-18
fase: 5
plan: "[[tasks]]"
sucessora: "[[fase-5-completa]]"
predecessoras: ["[[fase4/retrospectiva]]"]
sessoes: ["implementacao", "debug-pos-playtest", "debug-profundo-v2", "registro-task-5.6"]
---

# Retrospectiva Técnica — Fase 5 (Lógica de Estado e Resolução)

> Documento combinado de quatro sessões:
> - **Parte 1 — Implementação:** detectar bug crítico de inversão de switch em 3 tasks "completas", corrigir gerador, regenerar JSON.
> - **Parte 2 — Debug pós-playtest:** diagnóstico de 4 sintomas observados pelo usuário via injeção de `console.log` em CEs.
> - **Parte 3 — Debug profundo v2:** root-cause analysis via leitura de código, criação de `inject_debug_logs_v2.py` com SEs audíveis como fallback para feedback visual invisível.
> - **Parte 4 — Registro da task 5.6:** confirmação empírica do Bug 3 via playtest + spec da correção em `task-5.6.md` (CE 17 `EV_ResolucaoRiskFail` como bridge para F6).

---

# PARTE 1 — Implementação da Fase 5

## P1.1 Resumo da tarefa

**Solicitado:** Implementar a Fase 5 do plano `core_loop_corrida/tasks.md` (5 tasks: 5.1 Safe logic, 5.2 Risk logic, 5.3 Resolução flashes, 5.4 HUD Glória, 5.5 Hover vermelho). Em seguida: verificar o que estava realmente implementado, detectar tasks marcadas como completas que não estavam, e concluir as pendentes.

**Entregue:**
- Bug crítico corrigido em 3 tasks "completas" (5.1/5.2/5.3): docstring do gerador `build_phase5_ces.py` invertia o estado do `ControlSwitch` (code 121), causando travamento permanente do input após o primeiro clique.
- Task 5.4 (HUD Glória via TextPicture Plugin Command) mantida como pendente manual MZ, documentada em `fase-5-completa.md`.
- Task 5.5 (Hover) confirmada correta após auditoria.
- JSON regenerado, reauditoria passou, `fase-5-completa.md` criado com checklist de Playtest.

**Critérios de sucesso:**
- JSON válido, scripts inline auditar 100% contra `System.json`, semântica das operações de switch correta, artefato-fonte (`build_phase5_ces.py`) refletindo MZ real, registro de conclusão criado.

**Restrições relevantes:**
- Skill `rpg-maker-mz-data-json`: proibido editar `data/*.json` diretamente — sempre via script Python salvo em disco.
- `rmmz_objects.js` é a fonte canônica dos formatos de comando MZ.
- Convenção F3: `System.json` arrays usam Editor ID direto (sem offset).
- Playtest MZ é obrigatório para validação visual (não marcado pela LLM).

## P1.2 Decisões técnicas e inferências

### P1.2.1 Inferência: trust no status `[x]` das tasks

- **Decisão:** Inicialmente tratar tasks 5.1/5.2/5.3/5.5 marcadas `[x]` em `tasks.md` como fato.
- **Motivo:** Ausência de verificação independente; o próprio prompt anterior da LLM havia marcado `[x]`.
- **Evidência:** `tasks.md` exibia `[x]` ao lado de cada task; CEs 11/12/14/15/16 tinham contagem de comandos plausível.
- **Resultado:** Falhou parcialmente — bug crítico em 3 tasks não foi detectado pela LLM da sessão anterior.
- **Avaliação:** Decisão incorreta. O usuário explicitamente pediu "cuidado com tasks marcadas como completas não está" — essa instrução foi o que disparou a verificação real.
- **Melhoria futura:** Status `[x]` em `tasks.md` **não é evidência**. Sempre ler o CE gerado e auditar semântica antes de declarar fase completa.

### P1.2.2 Decisão: ler o source MZ (`rmmz_objects.js`) em vez de confiar no docstring do gerador

- **Decisão:** Após detectar suspeita de bug, grep em `command121`/`command122` no source MZ em vez de re-ler o docstring do gerador.
- **Motivo:** Docstring do `build_phase5_ces.py` dizia `state(0=OFF|1=ON)` — precisava validar.
- **Evidência:** `rmmz_objects.js:10172-10176`: `$gameSwitches.setValue(i, params[2] === 0)` → `0` significa ON.
- **Resultado:** Funcionou. Bug confirmado em <1 min.
- **Avaliação:** Decisão correta e necessária.
- **Melhoria futura:** Toda adição de comando MZ novo ao gerador deve ser validada contra o source MZ antes de commit, não contra a documentação textual.

### P1.2.3 Inferência: positions hardcoded no CE 16 batem com botões reais

- **Decisão:** Auditor `Show Picture` em CE 8/9 (RenderSinal/Curva) para validar `BTN_FURAR_X=440`, `BTN_FURAR_Y=500` hardcoded no CE 16.
- **Motivo:** Geometria do hover precisa coincidir com botão real ou hover detecta região errada.
- **Evidência:** CE 8/9 confirmam `btn_furar` e `btn_esquerda` em (440, 500).
- **Resultado:** Funcionou.
- **Avaliação:** Necessária — teria sido um bug silencioso.

## P1.3 Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Necessário? | Contribuiu? | Evitável? |
|------------|----------|-------------|-------------|-----------|
| `Read tasks.md` | Ler estado das tasks | Sim | Sim (ponto de entrada) | Não |
| `Read CLAUDE.md` (Jhonny) | Ler convenções do projeto | Já no contexto | — | Sim, estava em cache |
| `Read task-5.5.md` | Detalhes da task 5.5 | Já no contexto | — | Sim, em cache |
| `Read build_phase5_ces.py` | Ler gerador completo | Sim (auditoria) | Sim | Não |
| `Bash python3` (inspect CE) | Dump CE 11/12/14/15/16 | Sim | Sim (revelou bugs) | Não |
| `Bash grep rmmz_objects.js` | Validar formato command121 | Sim | Sim (confirmou bug) | Não |
| `Bash python3` (audit System.json) | Validar IDs 100-116 | Sim | Sim | Não |
| `Bash python3` (inline audit) | Verificar `value(`/`setValue(` IDs | Sim | Sim | Não |
| `Bash ls img/pictures/race/` | Confirmar pictures existem | Sim | Sim | Não |
| `Edit build_phase5_ces.py` (×6) | Corrigir docstring + 5 ops | Sim | Sim | Não |
| `Bash python3 build_phase5_ces.py` | Regenerar JSON | Sim | Sim | Não |

**Evitável detectado:**
- **Re-leitura de `tasks.md`**: já havia sido lido antes do compact. Releitura consumiu ~9k tokens. Em próxima execução, trabalhar a partir do summary.
- **Re-leitura de `setup_phase5_system.py` e `CLAUDE.md`**: ambos já estavam no context window via system-reminders. Releitura total evitável.

## P1.4 Intervenções e correções do usuário

### P1.4.1 Instrução: "cuidado com tasks marcadas como completas não está"

- **Antes:** LLM da sessão anterior havia marcado `[x]` em 5.1/5.2/5.3/5.5; contexto do compact sugeria que a fase estava implementada.
- **Causa do desalinhamento:** LLM anterior não auditou semântica — apenas contou comandos e validou sintaxe JSON.
- **Após correção:** Verificação item a item, detecção de bug crítico, correção de 5 operações de switch.
- **Regra reutilizável:** Status `[x]` em markdown **NÃO** é evidência de implementação correta. Auditar semântica de cada operação MZ contra o source.

## P1.5 Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
|-------------|---------|-------|-------------|
| Releitura integral de `tasks.md` (~9k tokens) após compact | Médio | Summary do compact não incluiu texto completo | Trabalhar do summary; usar `Read` apenas com `offset/limit` para seções específicas |
| Releitura de `CLAUDE.md` e `setup_phase5_system.py` que já estavam no context | Baixo | Hábito de "confirmar antes de agir" | Confiar no context tracking do harness |
| Aceitação inicial do status `[x]` sem auditoria | Alto (quase vira bug em produção) | Default confiante em markdown de status | Política: nunca declarar fase completa sem auditoria semântica |

## P1.6 Caminho mínimo recomendado

1. **Ler `tasks.md` apenas da seção F5** (offset/limit) para identificar tasks pendentes.
2. **Bash dump de cada CE relevante** (`python3` com loop sobre `[6,11,12,14,15,16]`): uma única chamada.
3. **Bash grep em `rmmz_objects.js`** para validar formato de cada comando MZ não-trivial usado (121/122/111/223/225/231/235).
4. **Bash audit de IDs inline** em uma chamada combinada com check de pictures.
5. **Editar gerador** uma única vez com todas as correções (substituir 5 operações + docstring num Edit multi-edição).
6. **Regenerar JSON + validar + reauditar** em um Bash encadeado.
7. **Escrever `fase-5-completa.md`** + atualizar `tasks.md` status em paralelo.

Resultado: ~5 Bash + ~3 Edit + ~1 Write. Redução estimada: 30-40% do consumo de tokens vs. esta execução.

## P1.7 Conhecimento reutilizável

### P1.7.1 Fatos confirmados

- **`ControlSwitch` (code 121):** `params[2] === 0` → ON; `params[2] === 1` → OFF. Fonte: `rmmz_objects.js:10172-10176`.
- **`ControlVariables` (code 122):** `params = [startId, endId, op, operandType, operand]`, op 0=set/1=add/2=sub/3=mul/4=div/5=mod.
- **`If` (code 111):** `params[0]=0` para switch (formato `[0, swId, valor]` onde 0=ON/1=OFF); `params[0]=1` para variável (formato `[1, varId, src(0=const|1=var), operand, op]`, op 0=eq/1=ge/2=le/3=gt/4=lt/5=neq).
- **System.json arrays:** `variables[N]` corresponde a Editor ID N (sem offset). Fonte: `rmmz_objects.js:691, 723`.
- **`ButtonPicture.js`:** não tem hover nativo — solução é CE paralelo com `TouchInput.x/y` via Script inline.
- **TextPicture Plugin Commands (code 357):** schema opaco, **não gerar via JSON** — inserção manual MZ Editor.

### P1.7.2 Preferências do usuário

- Toda validação manual deve ter feedback visível/audível sem F12/F9 (regra `user-testable-feedback`).
- Status `[x]` em markdown não é aceito como prova — sempre auditar.
- Autor commits sem `Co-authored-by`.

### P1.7.3 Restrições técnicas

- `data/*.json` só pode ser editado via script Python salvo em disco (skill obrigatória).
- Gerador `build_phaseN_ces.py` é artefato-fonte: correção sempre no gerador, nunca no JSON gerado.
- Após editar JSON via script, é obrigatório MZ Editor → Database (F10) → Ctrl+S → reiniciar Playtest (bug real F4).

### P1.7.4 Armadilhas conhecidas

- **Docstrings de geradores são especulativos.** Validar contra source MZ.
- **Contagem de comandos no CE não é evidência de correção.** Um CE com 22 comandos pode ter semântica 100% errada.
- **Lock/Unlock de switch é particularmente sensível** — bug aqui trava o jogo sem erro de console.
- **MZ Editor visual não audita scripts inline.** Auditoria manual obrigatória.
- **`mzkp_commonEventId`** é a propriedade correta para bind de CE via Script inline no `ButtonPicture.js` (validado em F4).

### P1.7.5 Heurísticas recomendadas

- Antes de declarar fase completa: dump de cada CE + auditoria de cada `121`/`122`/`111`/`355` em uma tabela semântica.
- Operações de switch: comentar sempre no gerador `# SW_X = ON/OFF` ao lado do `C(121, ...)`.
- Hover overlays: Picture ID **menor** que botões para não bloquear clique (22-24 < 41-50).
- Resolução (flash/tint): sempre `Wait` ≥ duração do tint senão unlock acontece antes do fim visual.

## P1.8 Informações que deveriam estar no prompt inicial

- **Obrigatório:** "Audite a semântica de cada comando MZ contra `rmmz_objects.js`; status `[x]` em `tasks.md` não é prova."
- **Útil:** "Operações de switch (code 121) são particularmente sensíveis a bugs de inversão — valide-as primeiro."
- **Opcional:** "Use `offset/limit` ao reler `tasks.md` — arquivo é grande."

## P1.9 Melhorias nos artefatos do fluxo

### P1.9.1 Análise técnica

| Problema | Informação ausente | Seção | Alteração |
|----------|-------------------|-------|-----------|
| Bug de inversão de switch | Tabela canônica de formatos MZ com semântica explícita | "Códigos MZ canônicos" | Adicionar tabela com cada code (111/117/121/122/223/225/231/235/355) e `params[i]` significado, **validada contra `rmmz_objects.js`** |

### P1.9.2 Plano de implementação

| Problema | Deficiência | Etapa | Alteração |
|----------|-------------|-------|-----------|
| Fim de Fase sem auditoria semântica | Sem checkpoint de "auditoria semântica de switch/var ops" | Após última task de cada fase | Incluir checkpoint: "dump de cada CE modificado + tabela semântica de cada 121/122" |

### P1.9.3 Tasks da fase executada

| Task | Informação ausente | Consequência | Alteração recomendada |
|------|-------------------|--------------|----------------------|
| task-5.1, 5.2, 5.3 | Não incluíam tabela canônica `121 params[2]: 0=ON, 1=OFF` | LLM inferiu errado a partir do docstring do gerador | Adicionar em cada task um "Formato canônico MZ" com referência `rmmz_objects.js:LINE` para cada code usado |
| task-5.3 | Não especificava que unlock no fim de `EV_Resolucao*` é crítico para não travar input | Bug crítico quase passou | Adicionar critério de aceitação: "Após resolução, próximo clique FUNCIONA (lock liberado)" |
| task-5.4 | Não detalhava o passo manual MZ com sequência de UI clara | Pendente manual ficava ambíguo | Adicionar sequência numerada: Database → CE 6 → Insert → Plugin Command → TextPicture > Set Text → ... |

### P1.9.4 Problemas fora do escopo dos artefatos

- **Comportamento operacional da LLM** (confiar em `[x]` sem auditoria): não deve ser corrigido por especificação — é falha de execução.
- **Custo de re-leitura após compact**: é característica do harness, não do plano.

### P1.9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|--------------------|-----------------|----------------------|----------------------|-----------|
| Bug de inversão de switch (5 ops) | Docstring do gerador + ausência de tabela canônica nas tasks | Tasks 5.1/5.2/5.3 | Adicionar formato canônico MZ com referência ao source | Alta |
| Status `[x]` falso-positivo | Ausência de checkpoint de auditoria semântica no plano | Plano (fim de fase) | Adicionar checkpoint explícito | Alta |
| Lock não libera após resolução | Task 5.3 não explicitava critério de aceitação "próximo clique funciona" | Task 5.3 | Adicionar critério de aceitação | Alta |
| Task 5.4 manual vago | Ausência de sequência de UI MZ | Task 5.4 | Adicionar passo-a-passo numerado | Média |

### P1.9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Adicionar à seção "Códigos MZ canônicos":

```
| Code | Nome | params[i] significado | Source ref |
|------|------|----------------------|-----------|
| 111  | If   | [0, sw, 0=ON/1=OFF] ou [1, var, src(0=const|1=var), operand, op(0=eq/1=ge/2=le/3=gt/4=lt/5=neq)] | rmmz_objects.js:Game_Interpreter.prototype.command111 |
| 121  | ControlSwitch | [startId, endId, state] onde state=0 → ON, state=1 → OFF | rmmz_objects.js:10172 |
| 122  | ControlVariables | [startId, endId, op(0=set/1=add/2=sub/3=mul/4=div/5=mod), operandType(0=const|1=var), operand] | rmmz_objects.js:10180 |
| 223  | TintScreen | [[R,G,B,Intensity], duration_frames, preserveErase] | — |
| 225  | ShakeScreen | [power, speed, duration, waitForCompletion] | — |
| 231  | ShowPicture | [id, name, origin(0=UL/1=center), variableRef, x, y, scaleX, scaleY, opacity, blendMode] | — |
```

#### Patch sugerido para o plano de implementação

Após a última task de cada fase (F5+), adicionar checkpoint:

```
**Checkpoint obrigatório — Auditoria semântica de fase:**
1. Dump de cada CE modificado via `python3 -c "import json; ..."`
2. Para cada `C(121, ...)`: confirmar `params[2]` (0=ON, 1=OFF) bate com intenção
3. Para cada `C(122, ...)`: confirmar op + operandType batem com intenção
4. Para cada `C(111, ...)`: confirmar params[0] (0=switch/1=var) e semântica de valor/op
5. Para cada Script inline (`C(355, ...)`): confirmar IDs batem com System.json
6. Não marcar tasks `[x]` sem este checkpoint
```

#### Patch sugerido para as tasks da fase executada

**task-5.1.md — adicionar seção "Formato canônico MZ":**

```
### Formato canônico MZ (validar antes de commit)

- `ControlSwitch` (code 121): `[startId, endId, state]` onde **state=0 → ON, state=1 → OFF**.
  Fonte: `js/rmmz_objects.js:10172-10176`.
- `ControlVariables` (code 122): `[startId, endId, op, operandType, operand]`.
  op: 0=set/1=add/2=sub/3=mul/4=div/5=mod. operandType: 0=const/1=var.

**Erro comum:** escrever `[SW, SW, 1]` pensando "ON" quando na verdade é OFF.
```

**task-5.2.md — adicionar na seção "Critérios de Sucesso":**

```
- [ ] Após Risk-sucesso, próximo clique (Safe ou Risk) FUNCIONA — confirma que SW_INPUT_LOCKED foi liberado por EV_ResolucaoRiskOK
- [ ] Após Risk-falha, SW_CRASH_FLAG = ON (verificável via F9 → Switches → SW 102)
```

**task-5.3.md — adicionar na seção "Critérios de Sucesso":**

```
- [ ] CRÍTICO: Após chamar EV_ResolucaoSafe ou EV_ResolucaoRiskOK, o próximo clique FUNCIONA — se não funciona, unlock (params[2]=1 em code 121) foi escrito errado
```

**task-5.4.md — substituir a seção "Subtarefas" pelo passo-a-passo explícito:**

```
### Passo manual MZ Editor (obrigatório)

1. Abrir projeto Jhonny no RPG Maker MZ.
2. Database (F10) → aba Common Events.
3. Selecionar #0006 EV_UpdateHud.
4. Insert → Plugin Command → TextPicture > Set Text:
   - text: GLÓRIA: \V[105] (uma barra no editor; MZ salva como \\V[105] no JSON)
5. Insert → Plugin Command → TextPicture > Show:
   - pictureId: 51
   - position: (560, 20)
6. Ctrl+S no Database. Fechar Database.
7. Reiniciar Playtest (não basta F5).
```

#### Ações fora do fluxo de especificação

- Adicionar hook/check operacional: "Antes de marcar `[x]` em tasks.md, rodar dump de CE + tabela semântica" — esta é uma regra de execução da LLM, não do artefato.

## P1.10 Checklist operacional (próxima execução)

1. [ ] **Pré-condição:** Existe `build_phaseN_ces.py` no diretório da fase? Se não, criá-lo primeiro.
2. [ ] **Fonte de verdade:** Todo comando MZ no gerador tem referência `rmmz_objects.js:LINE` no docstring?
3. [ ] **Validação crítica:** Cada `C(121, ...)` no gerador tem comentário `# SW_X = ON/OFF` ao lado?
4. [ ] **Validação crítica:** Toda task com `[x]` passou por dump de CE + auditoria semântica?
5. [ ] **Erro conhecido:** Docstring do gerador NÃO é fonte de verdade — `rmmz_objects.js` é.
6. [ ] **Erro conhecido:** Contagem de comandos no CE não é evidência de correção.
7. [ ] **Critério de conclusão:** "Próximo clique funciona" (não trava após primeiro input) — validar em Playtest.
8. [ ] **Critério de conclusão:** `python3 -m json.tool` passa + auditoria inline IDs passa + MZ Editor Ctrl+S executado.

---

# PARTE 2 — Debug pós-playtest

## P2.1 Resumo da tarefa

**Solicitado pelo usuário:**
1. Validar comportamento da F5 já implementada após playtest MZ manual.
2. Diagnóstico de 4 sintomas observados:
   - HUD Glória aparece no clique Safe, mas **não** no clique Risk.
   - `console.log("Glória on terminal")` (manual do usuário no CE 6) só dispara no Safe, não no Risk.
   - Flashes verde/dourado (CE 14/15) não aparecem em nenhum dos dois cliques.
   - Safe pode ser clicado múltiplas vezes por cenário (deveria travar após 1).

**Resultado entregue:**
- Root cause do bug "Risk nunca dispara Glória" **identificado** sem playtest adicional: `var[104]` (Consciência) é inicializada em 0 no CE 5 RaceOrchestrator linha `[0]`, fazendo `taxa = clamp(0,0,100) = 0`, e `roll(0-99) < 0` é sempre falso → Risk sempre cai no fail branch → nunca chama CE 6/CE 15.
- Script `fase5/inject_debug_logs.py` criado, injectando `console.log("[F5DBG] ...")` em 20 pontos estratégicos dos CEs 5, 11, 12, 14, 15 (CE 6 e CE 16 intocados — preserva edições manuais do usuário / hover funcional).
- Playtest MZ com F12 Console filtrado por `[F5DBG]` identificado como o próximo passo confirmatório (ainda pendente — usuário precisa rodar).

**Restrições relevantes:**
- Workflow script-first (skill `rpg-maker-mz-data-json`): todo edit via Python em disco, nunca inline.
- Editar JSON inline não pode tocar CE 6 (usuário inseriu TextPicture Plugin Command manualmente via MZ Editor — schema opaco de code 357).
- Pós-edit MZ obrigatório: Database (F10) → Ctrl+S → reiniciar Playtest.

## P2.2 Decisões técnicas e inferências

### P2.2.1 Hipótese "Risk sempre falha" derivada da análise do JSON antes do playtest

- **Decisão/inferência:** Antes de pedir mais playtest ao usuário, abrir o `CommonEvents.json` e rastrear o fluxo de CE 12 → success vs fail branch.
- **Motivo:** Usuário reportou que o `console.log` do CE 6 (que ele inseriu) não disparava no Risk. Sabíamos que `Call CE 6` em CE 12 estava dentro do success branch apenas.
- **Evidência:** Estrutura do CE 12: `[14] If roll < taxa` → success → `[25] Call CE 6` / `[31] Else` → fail → `[38] SW_CRASH_FLAG set` (sem Call CE 6).
- **Resultado:** Hipótese correta. Identificou que para o `Call CE 6` nunca disparar, o success branch nunca é entrado, o que significa `roll >= taxa` sempre.
- **Avaliação:** Inferência necessária e correta — poupou um round-trip de playtest.
- **Melhoria futura:** Antes de pedir playtest diagnóstico, sempre rastrear o fluxo de controle no JSON para gerar hipóteses específicas. Isso reduz o número de interações com o usuário.

### P2.2.2 Busca de onde `var[104]` (Consciência) é inicializada

- **Decisão/inferência:** Varrer todos os CEs buscando `setValue(104` (Script inline) e `C(122, *, [104, 104, ...])` (ControlVariables) para encontrar a inicialização.
- **Motivo:** Hipótese P2.2.1 implicava que `taxa=0`. Como `taxa = clamp(consciencia, 0, 100)`, `consciencia` precisaria estar em 0 no momento do Risk.
- **Evidência:** Dump de CEs 1-16 mostrou que `CE 5 RaceOrchestrator [0]` faz `var[104] = 0`.
- **Resultado:** Bug crítico confirmado **sem playtest**. Consciência inicial = 0 → Risk sempre falha no primeiro clique.
- **Avaliação:** Inferência correta e direta.
- **Melhoria futura:** Quando suspeitar de "estado inicial incorreto", sempre auditar a inicialização primeiro — não o cálculo em si.

### P2.2.3 Não regenerar o JSON do zero (`build_phase5_ces.py`) para preservar CE 6

- **Decisão/inferência:** Escrever um script Python *separado* (`inject_debug_logs.py`) que faz patch em JSON existente, em vez de modificar `build_phase5_ces.py` e regenerar.
- **Motivo:** Usuário editou CE 6 manualmente no MZ Editor para inserir TextPicture Plugin Command (code 357 com args opacas) e um `console.log` Script. Regenerar do gerador sobrescreveria essas edições (gerador não conhece schema Plugin Command).
- **Evidência:** Inspeção do CE 6 no JSON mostrou `code=357 ['TextPicture', 'set', ...]` + `code=657 [...]` + `code=355 ['console.log("Glória on terminal")']` — todos de edição manual do usuário.
- **Resultado:** Patch cirúrgico em CEs 5/11/12/14/15 preservou CE 6 intacto.
- **Avaliação:** Decisão correta — obrigatória dado o estado do repositório.
- **Melhoria futura:** Sempre que o JSON alvo de um edit contiver edições manuais do usuário (visíveis por code 357/657 Plugin Commands não produzidos pelos scripts Python), usar patch, não regenerar.

### P2.2.4 Injeção de `console.log` como estratégia de diagnóstico — HIGHLIGHT

- **Decisão/inferência:** Em vez de tentar adivinhar todos os bugs e propor fixes imediatos, espalhar `console.log("[F5DBG] ...")` em pontos estratégicos dos CEs para o usuário rodar playtest e reportar quais disparam.
- **Motivo:** Usuário sugeriu explicitamente a estratégia ("use a estratégia que eu usei de colocar Scripts console.log no meio dos conteudos dos CEs para eu ter um feedback no terminal"). Ele já tinha inserido um `console.log("Glória on terminal")` manualmente no CE 6 e confirmou que disparava no Safe mas não no Risk — informação que validou a hipótese P2.2.1.
- **Evidência:**
  - `console.log` em MZ Playtest aparece no console do Chromium (F12 devtools), filtrável por string.
  - Cada CE no MZ é JavaScript executado em runtime. `code=355` (Script) aceita qualquer JS.
  - Já existe o hook do usuário (script isolado em CE 6) que provou funcionar a abordagem.
- **Resultado:** Script `inject_debug_logs.py` com 20 pontos de log, todos prefixados `[F5DBG]` para filtro fácil.
- **Avaliação:** **Abordagem excelente** — transformou diagnóstico opaco (lógica dentro de CEs JSON) em output textual observável. Reduz drasticamente o número de rounds de playtest.
- **Melhoria futura (padronizar):** Sempre que uma task envolver lógica de CE com branches/loops/calls e o playtest for a única validação possível, propor injeção de `console.log` com prefixo de fase (`[F<N>DBG]`) como step natural antes do playtest diagnóstico. O custo é baixo (1 script Python, ~10 minutos) e o benefício é alto (elimina adivinhação).

## P2.3 Uso de ferramentas, comandos e scripts

| Ferramenta/comando | Objetivo | Por quê | Resultado | Substituível? | Redundante? |
|---|---|---|---|---|---|
| `python3` inline + `json.loads` em `CommonEvents.json` | Listar nome/trigger/cmds de todos os 17 CEs | Confirmar que CEs 14/15/16 existiam após regeneração F5 anterior | Sim, 17 slots confirmados | Não | Não |
| `python3` inline para dump detalhado de CE 6, 11, 8 | Inspecionar código + params + indent dos CEs chave | Verificar o que o usuário editou no CE 6 e a estrutura do CE 11 (Safe) | Confirmou TextPicture inserido + estrutura OnSafe intacta | Não | Não |
| `python3` inline para dump CE 12, 14, 15 | Inspecionar Risk e resoluções | Entender por que Risk não chega ao Call CE 6 | Revelou que Call CE 6/15 estão dentro do success branch | Não | Não |
| `python3` inline para listar switches/vars 100-117 em `System.json` | Mapear IDs semânticos | Validar constantes do gerador vs realidade | Revelou que `var[101]` é `VAR_SCENE_INDEX` (não `SW_INPUT_LOCKED`) — clareou que `cena++` em CE 11/12 está correto | Não | Não |
| `python3` inline grep por `setValue(104` em todos CEs + dump CE 5 | Encontrar inicialização de Consciência | Confirmar hipótese do Risk sempre falhar | **Bug crítico identificado**: `CE 5 [0]` zera `var[104]` | Não | Não |
| `Write` tool em `inject_debug_logs.py` | Salvar script de patch em disco | Workflow script-first exige script em disco | Script salvo e executado | Não | Não |
| `python3 inject_debug_logs.py` | Aplicar patch no JSON | Executar script | 20 logs injetados, JSON validado | Não | Não |
| `python3 -m json.tool` em `CommonEvents.json` | Validar sintaxe pós-edit | Skill exige validação | OK | Não | Não |
| `python3` inline para auditar CE 12 pós-injeção | Confirmar ordem e indent dos logs | Garantir que logs success/fail estão nos branches corretos | Estrutura confirmada | Não | Não |

**Evitado nesta sessão (comparado com sessão anterior):**
- Não re-li `tasks.md` (~9k tokens) — já estava no contexto.
- Não re-li `build_phase5_ces.py` completo — referenciei apenas o resumo na Parte 1 desta retrospectiva.
- Não usei `grep` para buscar textual — preferi Python `json.loads` para análise estruturada.

## P2.4 Intervenções e correções do usuário

### P2.4.1 "acabei de ver que se eu clicar no verde (safe) aparece Glória on terminal no meu terminal sim! só não aparece se eu clicar no vermelho"

- **Tipo:** Esclarecimento / nova informação observada pelo usuário.
- **O que estava incompleto antes:** Minha hipótese inicial (CE 6 não sendo chamado de CE 11/12) estava parcialmente errada — o `console.log` do CE 6 disparava no Safe, então CE 6 estava sendo chamado por CE 11. A questão era só CE 12 → CE 6.
- **Sujeição corrigida:** A hipótese "todos os calls CE 11/12 → CE 6 falhando" foi substituída por "apenas CE 12 → CE 6 falhando", o que apontou diretamente para o success branch nunca ser entrado.
- **Execução após correção:** Foco em rastrear o fluxo `If roll < taxa` em CE 12 → verificar inicialização de `consciencia` → bug crítico identificado.
- **Regra reutilizável:** Antes de propor patches amplos, sempre pedir ao usuário para reportar o symptom com máximo de granularidade (qual botão, qual ação, qual mensagem esperada vs qual observada). Diferenciação "Safe funciona mas Risk não" foi crucial.

### P2.4.2 "use a estratégia que eu usei de colocar Scripts console.log no meio dos conteudos dos CEs"

- **Tipo:** Preferência explícita do usuário (nova) — aplicar uma estratégia de debug que ele validou empiricamente.
- **O que estava alinhado antes:** Já tinha proposto diagnóstico via leitura do JSON, mas faltava a etapa de "instrumentação para o usuário reportar".
- **Execução após correção:** Construção de `inject_debug_logs.py` com 20 pontos de log prefixados `[F5DBG]`.
- **Regra reutilizável (PREFERÊNCIA DO USUÁRIO):** Para lógica complexa em CEs do MZ, instrumentar com `console.log("[F<N>DBG] ...")` antes de pedir playtest diagnóstico. Usuário prefere esse padrão sobre tentar fixes às cegas.

## P2.5 Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
|---|---|---|---|
| `System-reminder` do hook `PreToolUse:Write` com standards Python genéricos | Baixo | Hook injeta contexto JIT que não era relevante para o script de patch | Fora do escopo — hook é operacional |
| Não houve leitura redundante nesta sessão | — | — | Manter padrão |
| Não houve buscas amplas | — | — | Manter padrão |

**Esta sessão foi enxuta.** O único ponto: gerei um `Write` direto em `inject_debug_logs.py` (~280 linhas) que poderia ter sido menor se tivesse usado uma abstração única para os pontos de inserção. Mas a legibilidade foi mantida e cada CE tem seu próprio bloco, o que facilita manutenção.

## P2.6 Caminho mínimo recomendado

Para a próxima sessão de debug de uma fase MZ pós-playtest:

1. **Receber sintomas do usuário com granularidade** (qual botão, qual ação, qual observável vs esperado).
   - Input: sintoma + valor esperado.
   - Ferramenta: nenhuma.
   - Resultado: hipótese inicial.

2. **Ler o JSON estruturado** com `python3 -c "import json; ..."` para listar nome/trigger/cmds de todos os CEs.
   - Input: caminho do `CommonEvents.json`.
   - Ferramenta: Bash + Python inline.
   - Resultado: mapa dos CEs envolvidos.
   - Critério: identificar CEs cuja execução dependeria do sintoma relatado.

3. **Rastrear o fluxo de controle** no(s) CE(s) suspeito(s): dump completo `code` + `params` + `indent` para entender branches.
   - Input: índices dos CEs suspeitos.
   - Ferramenta: Bash + Python inline.
   - Resultado: lista de pontos onde o fluxo poderia divergir.
   - Critério: ter ≥1 hipótese testável sobre onde a divergência acontece.

4. **Auditar inicializações de variáveis/switches** relevantes aos CEs suspeitos (grep por `setValue(N` e `C(122, *, [N, N, ...])`).
   - Input: lista de IDs relevantes (do System.json).
   - Ferramenta: Bash + Python inline.
   - Resultado: confirmar ou refutar cada hipótese.
   - Critério: ter identificado root cause OU precisar de playtest para distinguir entre múltiplas causas.

5. **Se ainda houver ambiguidade**, criar `inject_debug_logs.py` com `console.log("[F<N>DBG] ...")` em pontos chave.
   - Input: lista de pontos a instrumentar (entry, pós-lock, branch entries, pós-calls).
   - Ferramenta: Write + Bash.
   - Resultado: script Python em disco + JSON patchado.
   - Critério: JSON válido + logs com prefixo identificável.

6. **Pedir playtest ao usuário** com instruções precisas: F10 → Ctrl+S → reiniciar Playtest → F12 → Console → filtro `[F<N>DBG]` → reportar quais logs disparam em cada ação.

7. **Marcar task como concluída** apenas quando usuário confirmar que os logs aparecem e/ou os fixes propostos resolvem o sintoma.

## P2.7 Conhecimento reutilizável

### P2.7.1 Fatos confirmados (adicionais aos de P1.7.1)

- `var[101]` em `System.json` deste projeto é `VAR_SCENE_INDEX` (não `SW_INPUT_LOCKED`). Sempre confirmar IDs no `System.json` antes de interpretar params de `C(122)` e `C(121)`.
- Switches e variables em MZ são **arrays separados** — ID 101 em switch é diferente de ID 101 em variável. Não há colisão.
- `code=117 Call Common Event` falha **silenciosamente** se o CE alvo não existe em `$dataCommonEvents` runtime. Não há log de erro.
- `code=355 Script` em MZ Common Event executa JS arbitrário em runtime, incluindo `console.log()` visível no F12 devtools do Playtest.
- `code=357 Plugin Command` (TextPicture, etc.) tem schema opaco — deve ser editado via MZ Editor, não via JSON script.
- `code=657` parece ser uma linha-filha de `code=357` (provavelmente para comandos plugin com args multi-linha). Mesma regra: não gerar via JSON script.

### P2.7.2 Preferências do usuário (adicionais)

- **Para depurar lógica complexa em CEs MZ, instrumentar com `console.log("[F<N>DBG] ...")` é a abordagem preferida** — usuário validou empiricamente com `console.log("Glória on terminal")` no CE 6 e adorou o resultado.
- Prefixo de fase (`[F5DBG]`) para filtro fácil no Console do F12 devtools.

### P2.7.3 Restrições técnicas (adicionais)

- Workflow script-first (`rpg-maker-mz-data-json`): edits `data/*.json` só via Python em disco.
- Pós-edit MZ obrigatório: Database (F10) → Ctrl+S → reiniciar Playtest. Sem isso, runtime pode usar JSON stale e CEs novos podem "não existir".
- Plugin Commands (code 357/657) não podem ser patcheados via script Python de forma confiável — schema é opaco e validado pelo MZ Editor.

### P2.7.4 Armadilhas conhecidas (adicionais)

- `[F5DBG]` injeção deve verificar idempotência — re-executar `inject_debug_logs.py` sem remover logs anteriores duplicaria tudo. Script atual já aborta com mensagem clara se detectar marca.
- Patch JSON em CEs precisa respeitar `indent` (1 dentro de If/Else, 2 dentro de Ifs aninhados) ou a estrutura de code 111/411/412 quebra.

### P2.7.5 Heurísticas recomendadas (adicionais)

- **Antes de pedir playtest diagnóstico**, rastrear o JSON e gerar ≥1 hipótese testável.
- **Antes de suspeitar de cálculo errado**, auditar inicialização (`setValue` ou `C(122, 0)`).
- **Antes de regenerar JSON**, verificar se usuário fez edições manuais (code 357/657 não produzidos por scripts).
- **Para CE com branches aninhados**, logs em pontos: entry → guards → lock → cálculos → cada branch → cada call.
- **Para CEs Parallel com loops** (como Hover), inserir log apenas no entry (não dentro do loop — senão spam).

## P2.8 Informações que deveriam estar no prompt inicial

- **Obrigatório:** Estado inicial das variáveis/switches relevantes ao core-loop (`consciencia`, `gloria`, `cena`) — sem isso, qualquer análise de "por que Risk falha" requer varredura de CEs.
- **Útil:** Mapa de "qual CE chama qual" (call graph) — evita ter que rastrear via `code=117` em cada CE.
- **Útil:** Quais CEs o usuário editou manualmente (preservar) — evita regenerar JSON e perder edições.
- **Opcional:** Snapshot do console F12 após um playtest rápido — já daria sintomas observáveis sem precisar de rastreio.

## P2.9 Melhorias nos artefatos do fluxo

### P2.9.1 Análise técnica

**Problema:** Não há um "mapa de inicialização de estado" documentado. Para descobrir que `consciencia` inicia em 0 em CE 5, foi necessário varrer todos os CEs.

**Informação ausente:** Documento listando onde cada variável/switch core-loop é inicializado, atualizado e lido.

**Por que pertence à análise técnica:** É um fato estrutural do sistema, não da execução de uma task específica.

**Seção sugerida:** "Estado core-loop — ciclo de vida das variáveis e switches".

**Texto sugerido (trecho):**
```
| Var/Switch | Onde é inicializado | Onde é atualizado | Onde é lido |
|---|---|---|---|
| var[104] CONSCIENCIA | CE 5 [0] = 0 | CE 11 +10/100; CE 12 -=P_CENA | CE 12 taxa=clamp |
| var[105] GLORIA | CE 5 [1] = 0 | CE 11 +10; CE 12 += P_CENA×2 | CE 6 HUD TextPicture |
| var[101] SCENE_INDEX | CE 5 [2] = 0 | CE 11/12 +=1 | CE 7 renderer |
| sw[101] INPUT_LOCKED | CE 5 [15] ON; CE 11/12 ON | CE 14/15 OFF | CE 11/12 guards |
```

**Impacto esperado:** Próxima análise de "por que X não atualiza" torna-se uma consulta à tabela, não uma varredura.

### P2.9.2 Plano de implementação

**Problema:** Plano não tem checkpoint de "diagnóstico pós-playtest com `console.log`". Quando playtest falha, LLM tende a propor fixes às cegas em vez de instrumentar.

**Deficiência:** Falta uma etapa de "instrumentação para diagnóstico" entre "implementar" e "validar playtest".

**Etapa afetada:** Bloco final de cada fase (validação).

**Alteração recomendada:** Adicionar step pós-implementação:

**Texto sugerido:**
```
Após implementar uma fase com lógica de CE (branches, calls, loops) e antes
de marcar como "validada", criar `inject_debug_logs.py` com logs prefixados
`[F<N>DBG]` em pontos de entry/branch/call. Pedir ao usuário um playtest
diagnóstico com F12 Console filtrado. Só considerar a fase validada após
confirmar que todos os logs esperados disparam nas ações corretas.
```

**Como reduziria custo:** Elimina ciclos de "achismo e fix" que consomem rounds de playtest do usuário.

### P2.9.3 Tasks da fase executada

**Task 5.1 (OnSafe):**
- **Informação ausente:** Critério objetivo para validar que lock funciona ("não pode haver 2 `CE11 OnSafe CLICK` consecutivos sem um `CE14 ... FIM` entre eles").
- **Consequência observada:** Usuário reportou "Safe pode ser clicado 2+ vezes por cena" — só descobrimos porque playtestou.
- **Alteração recomendada:** Adicionar critério de aceitação testável por log.
- **Texto sugerido:** "Critério: após `CE11 LOCK aplicado`, próximo `CE11 OnSafe CLICK` só pode aparecer após `CE14 ResolucaoSafe FIM`. Se aparecer antes, lock está falho."

**Task 5.2 (OnRisk):**
- **Informação ausente:** Dependência entre taxa e valor inicial de `consciencia`. Task descreve `taxa = clamp(consciencia, 0, 100)` mas não especifica o valor inicial esperado.
- **Consequência observada:** Risk sempre falha porque `consciencia` inicia em 0.
- **Alteração recomendada:** Pré-condição explícita sobre estado inicial.
- **Texto sugerido:** "Pré-condição: `var[104] CONSCIENCIA` deve estar inicializada entre 30 e 80 no CE 5 RaceOrchestrator. Valor 0 faz Risk sempre falhar (roll nunca < 0)."

**Task 5.4 (HUD Glória):**
- **Informação ausente:** Confirmação de que o Plugin Command TextPicture inserido manualmente tem o schema esperado (`code=357` com args incluindo `text`).
- **Alteração recomendada:** Adicionar comando de validação JSON.
- **Texto sugerido:** "Após inserção manual MZ, rodar `python3 -c \"import json; e=json.load(open('Jhonny/data/CommonEvents.json'))[6]; assert any(c.get('code')==357 and 'TextPicture' in str(c.get('parameters')) for c in e['list']), 'TextPicture não encontrado no CE 6'\"` para confirmar."

**Tasks 5.3, 5.5:** Sem alterações — funcionam conforme especificado.

### P2.9.4 Problemas fora do escopo dos artefatos

| Problema | Por que fora do escopo | Como tratar |
|---|---|---|
| Usuário não tinha F12 devtools aberto inicialmente | Operacional do usuário, não especificação | Instrução operacional em `fase-N-completa.md` (já coberto) |
| Plugin Command TextPicture exige MZ Editor manual | Limitação de schema da engine | Já documentado em tasks como "passo manual MZ" |
| Hook `PreToolUse:Write` injeta contexto Python genérico JIT | Configuração operacional do workspace | Fora do escopo — hook é do ambiente |

### P2.9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|---|---|---|---|---|
| Risk sempre falha no primeiro clique | `consciencia` inicial = 0 em CE 5 | Task 5.2 | Adicionar pré-condição sobre valor inicial de consciencia | Alta |
| Não saber onde cada variável é inicializada | Sem mapa de ciclo de vida | Análise técnica | Adicionar tabela "Estado core-loop" | Alta |
| Diagnóstico por achismo ao invés de instrumentação | Falta step de instrumentação pós-implementação | Plano | Adicionar step "inject_debug_logs.py" no bloco de validação | Média |
| Múltiplos cliques Safe por cenário | Lock não checado ou releases cedo | Task 5.1 | Adicionar critério baseado em logs | Média |
| Schema TextPicture não validável via script | Limitação MZ (Plugin Command opaco) | Fora do escopo | Nenhuma alteração nos artefatos | Baixa |

### P2.9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Adicionar à análise técnica uma seção:

```markdown
## Estado core-loop — ciclo de vida das variáveis e switches

| ID | Nome | Init | Update | Read |
|----|------|------|--------|------|
| var[101] | VAR_SCENE_INDEX | CE 5 [2] = 0 | CE 11 [15] +=1; CE 12 [18/23] +=1 | CE 7 renderer |
| var[103] | VAR_P_CENA | (define cenário atual) | CE 8/9 render | CE 11/12 multiplier |
| var[104] | VAR_CONSCIENCIA | CE 5 [0] = 0 | CE 11 +10/100; CE 12 -=P_CENA | CE 12 taxa=clamp |
| var[105] | VAR_PONTOS_GLORIA | CE 5 [1] = 0 | CE 11 +10; CE 12 +=P_CENA×2 | CE 6 HUD |
| var[106] | VAR_TAXA_SUCESSO | CE 12 calc | CE 12 [8] | CE 12 [10] If |
| var[107] | VAR_ROLL_RESULT | CE 12 [9] | CE 12 [9] random | CE 12 [10] If |
| sw[100] | SW_RACE_ACTIVE | CE 5 [17] ON | — | CE 7/10/16/11/12 guards |
| sw[101] | SW_INPUT_LOCKED | CE 5 [15] ON | CE 11/12 [6] ON; CE 14/15 OFF | CE 11/12 guards [3] |
| sw[102] | SW_CRASH_FLAG | (implícito OFF) | CE 12 [30] ON | (CE Crash F6 lerá) |
| sw[103] | SW_LAST_ACTION_SAFE | (implícito OFF) | CE 11 ON; CE 12 OFF | (F6+) |
```

#### Patch sugerido para o plano de implementação

Adicionar step genérico após implementação de cada fase com lógica de CE:

```markdown
### Step de diagnóstico pós-implementação

Antes de marcar a fase como "validada", criar `faseN/inject_debug_logs.py` que
insere `console.log("[F<N>DBG] ...")` em pontos estratégicos (entry, pós-lock,
branch entries, pós-calls) dos CEs com lógica. Pedir ao usuário:
1. MZ Editor → Database (F10) → Ctrl+S → reiniciar Playtest.
2. F12 → Console → filtro `[F<N>DBG]`.
3. Reportar quais logs disparam em cada ação.

Só marcar como validada após confirmar logs esperados.
```

#### Patch sugerido para as tasks da fase executada

**Task 5.1 — adicionar critério de aceitação:**
```markdown
### Critério de aceitação (logs)
Após playtest com `inject_debug_logs.py`, no F12 Console filtrado por `[F5DBG]`:
- Cada clique em Parar deve gerar exatamente 1 sequência:
  `CE11 OnSafe CLICK` → `CE11 LOCK aplicado` → `CE11 gloria=...` →
  `CE11 → Call CE 6` → `CE11 → Call CE 14` → `CE14 INI` → `CE14 FIM`.
- Próximo `CE11 OnSafe CLICK` só pode aparecer APÓS `CE14 ... FIM`.
- Múltiplos CLICKs sem FIM entre eles indica bug de lock.
```

**Task 5.2 — adicionar pré-condição:**
```markdown
### Pré-condição
`var[104] CONSCIENCIA` deve ser inicializada em valor > 0 (sugerido 50-80)
no CE 5 RaceOrchestrator antes do primeiro Risk. Com Consciência = 0,
`taxa = 0` e Risk falha sempre (roll 0-99 nunca < 0).

**Correção pendente:** `CE 5 [0] C(122, 0, [104, 104, 0, 0, 0])` deve mudar
para `C(122, 0, [104, 104, 0, 0, 50])` (ou valor definido em análise técnica).
```

#### Ações fora do fluxo de especificação

- **Operacional (não exige alteração em artefatos):** Sempre que for pedir playtest diagnóstico, instruir o usuário explicitamente a abrir F12 devtools → aba Console → aplicar filtro `[F<N>DBG]`. Sem F12 aberto, nenhum log aparece e o diagnóstico falha.

## P2.10 Checklist operacional (debug pós-playtest)

1. **Pré-condição:** Usuário tem MZ Editor + projeto `Jhonny/` abrível.
2. **Fonte de verdade:** `Jhonny/data/CommonEvents.json` (sempre via `python3 -m json.tool`).
3. **Validação crítica:** Após qualquer edit via script Python, F10 → Ctrl+S no MZ Editor → reiniciar Playtest.
4. **Erro conhecido:** Risk sempre falha se `var[104]` inicia em 0 — corrigir init em CE 5.
5. **Erro conhecido:** Plugin Commands (code 357/657) não devem ser editados via JSON script.
6. **Erro conhecido:** `code=121 ControlSwitch` usa `params[2] === 0` para ON (já corrigido em `build_phase5_ces.py`).
7. **Diagnóstico:** Para lógica complexa em CE, sempre criar `inject_debug_logs.py` antes de pedir playtest às cegas.
8. **Idempotência:** `inject_debug_logs.py` aborta se detectar `[F5DBG]` pré-existente — rode `remove_debug_logs.py` (a criar) antes de reinyetar.
9. **Preservação:** Nunca regenere `CommonEvents.json` do zero se usuário editou CEs manualmente (verificar `code 357` no JSON).
10. **Critério de conclusão:** Fase só é "validada" quando usuário confirma no playtest que todos os logs `[F<N>DBG]` esperados disparam nas ações corretas.

---

# HIGHLIGHT — Estratégia `inject_debug_logs.py` + `inject_debug_logs_v2.py`

> **Esta é a aprendizagem mais reutilizável das três sessões combinadas.** A v2 estende a v1 com (a) logs de hipóteses confirmáveis e (b) **SEs audíveis como fallback para feedback visual invisível** (Parte 3).

**Padrão:** Diante de lógica complexa em Common Events do RPG Maker MZ (branches, calls, loops, estado), não tente adivinhar bugs. Crie um script Python que injeta `console.log("[F<N>DBG] ...")` em pontos estratégicos do JSON e peça ao usuário um playtest diagnóstico com F12 Console filtrado.

**Por que funciona:**
- MZ Playtest é Chromium — F12 devtools tem Console filtrável por string.
- Cada CE em runtime é JS — `code=355` (Script) aceita `console.log()`.
- Usuário não precisa entender o JSON — só reporta quais logs aparecem.
- Prefixo `[F<N>DBG]` isola logs de diagnóstico de logs da engine.

**Custo-benefício:**
- Custo: 1 script Python (~10 minutos), 1 round de playtest.
- Benefício: transforma diagnóstico opaco em output textual observável. Elimina ciclos de "achismo e fix".

**Quando NÃO usar:**
- Bug puramente visual (Picture na posição errada) — log não ajuda.
- Bug de schema Plugin Command (TextPicture) — usar MZ Editor direto.
- CE Parallel com loops apertados (ex: Hover 60fps) — log só no entry, nunca no loop.

**Template do script:**
- Salvar em `faseN/inject_debug_logs.py`.
- Prefixo `[F<N>DBG]` em todos os logs.
- Idempotente: aborta se detectar marca pré-existente.
- Helpers: `insert_before(lst, predicate, log_text)`, `insert_after(...)`, `insert_at_top(...)`, `insert_before_end(...)`.
- Não tocar CEs editados manualmente pelo usuário (verificar `code 357/657`).

---

# PARTE 3 — Debug profundo v2 (root-cause via código + SEs audíveis)

## P3.1 Resumo da tarefa

**Solicitado:**
1. Análise profunda de cada um dos 5 bugs reportados após playtest com logs `[F5DBG]` v1.
2. Descobrir causa raiz de cada um.
3. Adicionar mais logs via `inject_debug_logs.py` para confirmar hipóteses.
4. Adicionar **sons distintos** como feedback audível para eventos visuais que o usuário não consegue ver (flashes).

**Entregue:**
- Root cause confirmado por **leitura de código** (não por mais playtest): Bug 3 (Risk FAIL não destrava) é bug real; Bugs 1, 2, 5 são comportamento intencional não-documentado; Bug 4 é feedback visual muito curto (130ms / 100ms).
- `remove_debug_logs.py` criado: idempotente, remove logs `[F5DBG]` + SEs diagnósticos por nome.
- `inject_debug_logs_v2.py` criado: 21 logs + 5 SEs diagnósticos mapeados a eventos visuais.
- JSON regenerado (46210 bytes), validado.
- Tabela de SEs audíveis para o usuário correlacionar som com evento durante playtest.

**Critério de sucesso:** usuário terá console logs suficientes para confirmar Bug 3 + áudio distinto para cada feedback visual.

## P3.2 Decisões técnicas e inferências

| Decisão | Motivo | Evidência | Resultado | Avaliação |
|---------|--------|-----------|-----------|-----------|
| **Ler CE 7/10/13 antes de propor fix** | Hipótese: parallel CE poderia estar liberando lock em background | Logs v1 mostravam sw101 indo de true→false entre 2º FAIL e 3º click sem nenhum CE de resolução visível | CE 7 faz lock+unlock em transição de cena; CE 10 chama CE 11 em timeout; nenhum explica o unlock misterioso | Necessária — eliminou hipóteses antes de concluir |
| **Grep global por `code=121 sw[101]`** | Saber exatamente quem modifica o lock | Checagem manual CE por CE seria lenta e propensa a perder casos | 7 ocorrências: 5 ON (lock aplicado), 2 OFF (CE 14[4] e CE 15[5]) — nenhuma no FAIL do CE 12 | **Decisão chave da sessão** — confirmou Bug 3 sem ambiguidade |
| **Ler `rmmz_objects.js` para semântica do code 111** | Desconfiança que `params[2]` do If Switch tinha semântica não-trivial | Implementação prévia tinha bug de inversão no code 121 (Parte 1) — mesmo tipo de bug poderia existir no 111 | `$gameSwitches.value(p[1]) === (p[2] === 0)` — confirma `params[2]=0` = "is ON" | Necessária — removeu ambiguidade de leitura |
| **Adicionar SEs como fallback de feedback visual** | Usuário relata que não vê flashes; durações são 6f-8f (~100-130ms) | CE 14: `TintScreen [-200,0,-200,0] 8f`; CE 15: `TintScreen [0,0,-255,0] 6f` | SEs distinctos por evento (Cursor1, Bell3, Buzzer1, Up, Applause2) tornam cada invisível audível | Estratégia eficiente — não precisa debugar Tint Screen para confirmar execução |

## P3.3 Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Necessário? | Resultado |
|-----------|----------|-------------|-----------|
| `python3 -c` dump de CE 11 e CE 12 | Ler estrutura completa com indentação | Sim | Revelou bloco `If var104<=90 → var104+=10` (Bug 1) e fórmula da taxa (Bug 2) |
| `python3 -c` dump de CE 5/7/10/13/16 | Encontrar quem poderia liberar lock no caso FAIL | Sim | Confirmou que nenhum parallel CE explica unlock misterioso |
| **`python3 -c` grep global por `code=121 sw[101]`** | Encontrar todos os modificadores do lock | **Sim — mais importante da sessão** | **7 ocorrências catalogadas; FAIL não está entre as OFF** |
| `grep -n "command111" js/rmmz_objects.js` | Confirmar semântica do If Switch | Sim | `value === (params[2] === 0)` — params[2]=0 → ON |
| `ls Jhonny/audio/se/ \| grep ...` | Listar SEs default MZ disponíveis para escolher audibly distinct | Sim | Confirmou Bell1/2/3, Buzzer1/2/3, Cursor1-4, Decision1-5, Cancel1-3, Applause1/2 |
| `remove_debug_logs.py` | Limpar injeção v1 antes de reinjetar v2 | Sim | Removeu 20 comandos, idempotente |
| `inject_debug_logs_v2.py` | Aplicar v2 + SEs diagnósticos | Sim | 21 logs + 5 SEs, JSON válido |
| `python3 -m json.tool` implícito no script | Validar JSON após escrita | Sim | OK |

**Evitável:** análise textual manual CE por CE quando o `grep` programático bastava. Para próximos casos similares, **comece pelo grep global** de código-alvo (ex: todas as ocorrências de `code=121 params=[X,Y]`) antes de ler CE estruturas.

## P3.4 Intervenções e correções do usuário

| Instrução | Estado anterior | Suposição errada | Mudança | Regra reutilizável |
|-----------|-----------------|-------------------|---------|---------------------|
| "faça uma analise profunda de cada um dos bugs relatados e descubra a causa raiz" | Eu ofereci atalho: ler só CE 11/12 ou pular para fix direto | Que usuário queria confirmação rápida, não investigação completa | Pivot para análise de código raiz de todos os 5 bugs | **Usuário prefere root cause analysis profunda sobre quick fix quando há múltiplos bugs aparentes** |
| "adicione logs com inject_debug_logs.py para logarmos as hipoteses. e termos certeza que é um bug" | Minha primeira proposta era confirmar tudo só com leitura de código | Que leitura de código bastava como evidência | V2 injector inclui confirmação por playtest futuro | **Mesmo após root cause por código, usuário quer evidência empírica via playtest antes de marcar bug como confirmado** |
| "sobre os feedbacks visuais que o usuario não está vendo, adicione um som diferente quando o evento ocorrer o usuario consegue escutar os soms" | Não havia proposta de contornar flash invisível | Que flash invisível precisava ser consertado visualmente | SEs como fallback audível para execução confirmar | **Para bugs visuais de duração muito curta, adicionar SE distinto como canal alternativo de confirmação — mais barato que aumentar duração e revalidar** |

## P3.5 Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
|-------------|---------|-------|-------------|
| Leitura inicial CE por CE para encontrar quem modifica sw101 | Médio | Tentar entender fluxo antes de grep estruturado | Começar por `python3 -c` grep global por `code=121` e `code=111` no switch alvo |
| Oferecer atalho "ler só 2 CEs vs análise profunda" antes do usuário pedir profundidade | Baixo | Tentar economizar tokens à custa de profundidade | Em bugs de lógica com múltiplos sintomas, assumir que usuário quer root cause — não perguntar |
| Não ter verificado semântica `code=111` no início (assumi que sabia) | Baixo | Confiança em semântica aparente | Para todo command code MZ crítico, confirmar com `grep -nA 5 commandNNN js/rmmz_objects.js` antes de interpretar |

## P3.6 Caminho mínimo recomendado

1. **Reproduzir sintomas com logs existentes** — se houver `[F<N>DBG]` injetado, pedir playtest com output do console.
2. **Grep global por comandos que mexem no estado suspeito** — `python3 -c` script que percorre todos os CEs e lista cada `code=121` com `switchId == alvo`. Custo: 1 script de 10 linhas.
3. **Confirmar semântica dos commands codes envolvidos** — `grep -nA 10 commandNNN js/rmmz_objects.js` para 111, 121, 122, 117, etc.
4. **Para cada sintoma, classificar:** bug real vs spec ambígua vs design choice. Exigir evidência (linha de código ou log playtest).
5. **Se bug visual (Picture, Tint Screen, Shake):** antes de ajustar duração/posição, adicionar SE distinto como confirmação audível de execução.
6. **Escrever remove+inject scripts como par idempotente** — nunca editar logs diretamente no JSON.
7. **Validar JSON após escrita** — `python3 -m json.tool` ou `json.loads()` no próprio script.
8. **Pedir playtest diagnóstico** — usuário reporta quais logs aparecem e quais SEs tocam.

## P3.7 Conhecimento reutilizável

### Fatos confirmados

- **`code=111` If Switch (MZ source `rmmz_objects.js:9933`):** `result = $gameSwitches.value(params[1]) === (params[2] === 0)`. Portanto `params[2]=0` → "is ON", `params[2]=1` → "is OFF". Mesma semântica do `code=121` (Parte 1 desta retrospectiva).
- **`code=121` ControlSwitch:** `params[2]=0` → ON, `params[2]=1` → OFF (confirmado novamente).
- **`code=223` Tint Screen:** `params[0] = [R, G, B, Saturation]` em range -255..+255, delta do normal `[0,0,0,0]`. `params[1]` = duração em frames. `params[2]` = boolean para "wait for completion".
- **`code=225` Shake Screen:** `params = [power, speed, duration, waitForCompletion]`.
- **Lock management in MZ:** qualquer ramo que set `sw[X] → ON` deve ter caminho que set `sw[X] → OFF`. Inspecionar com grep antes de marcar task como completa.
- **CE 5 RaceOrchestrator roda uma vez por race** (não é parallel). Reseta var[104]=0, var[105]=0, var[101]=0, var[113]=-1, var[112]=1 no início.
- **CE 7 RaceRenderer (parallel em sw[100]):** detecta mudança de cena via `var[101] != var[113]`. Em transição: lock 18f, unlock, renderiza nova cena.
- **CE 10 RaceTimer (parallel em sw[100]):** countdown de `var[108]` (240f para Sinal, 210f para Curva). Atingindo 0, chama CE 11 (auto-Safe).
- **Fórmula taxa Risk (CE 12[9]):** `Math.max(0, Math.min(100, $gameVariables.value(104) + $gameVariables.value(103)))` = `clamp(consc + P_CENA, 0, 100)`. **NÃO é `clamp(consc, 0, 100)`** como spec Task 5.2 dizia.
- **Safe incrementa Consciência (CE 11[10-14]):** `If var[104] <= 90 → var[104] += 10; else → var[104] = 100`. Spec Task 5.1 dizia apenas "clamp" — implementação escolheu incrementar.

### Preferências do usuário

- **Para bugs visuais de duração curta:** adicionar SE distinto como fallback audível ao invés de ajustar duração visual. Mais barato e imediatamente confirmável.
- **Bug confirmation:** exigir evidência empírica via playtest mesmo após root cause por código.
- **Multi-bug scenarios:** preferir root cause analysis profunda (todos os bugs) sobre quick fixes isoladas.
- **Convenção de arquivo:** uma retrospectiva por fase (`faseN/retrospectiva.md`), com seções PARTE 1/2/3 por sessão.

### Restrições técnicas

- **MZ Plugin Commands (code 357/657):** schema opaco, não pode ser gerado via JSON com segurança. Editar manualmente no MZ Editor.
- **MZ `mzkp_commonEventId`:** binda CE a Picture para click handling (ButtonPicture.js).
- **JSON files são read-only em runtime:** toda edição requer MZ Editor → Database (F10) → Ctrl+S → reiniciar Playtest para que `$dataCommonEvents` recarregue.
- **`code=355` Script em CE:** roda como JS no contexto do Game_Interpreter. `console.log()` aparece no F12 devtools.
- **SEs default MZ disponíveis em `Jhonny/audio/se/`:** Bell1/2/3, Buzzer1/2/3, Cursor1-4, Cancel1-3, Decision1-5, Applause1/2, Up/Down (se existirem), Blow1-10, etc. Verificar com `ls` antes de referenciar.

### Armadilhas conhecidas

- **Assumir semântica de command code sem confirmar no source** —já causou bug de inversão no `code=121` (Parte 1) e quase causou interpretação errada do `code=111` nesta sessão.
- **Não grep global por modificadores de switch/variável** — sem grep, é fácil perder CEs paralelos que modificam estado em background.
- **Espec Task que diz "clamp" pode significar** "clamp on increment" (implementação atual) ou "only clamp, never change" (interpretado literalmente). Spec deve dizer explicitamente a fórmula.
- **Lock que nunca é liberado trava o jogo silenciosamente** — só se manifesta quando usuário tenta clicar de novo.
- **CE Parallel com loops apertados (Hover, Timer, Renderer):** logs no topo do loop inundam console. Injetar logs apenas em pontos de mudança de estado.

### Heurísticas recomendadas

- **Antes de propor fix para bug de estado em MZ:** rode `python3 -c` grep por todas as ocorrências do command code que modifica o estado alvo (121 para switch, 122 para variável).
- **Antes de interpretar command code MZ:** `grep -nA 10 "commandNNN" js/rmmz_objects.js` confirma semântica.
- **Para bug visual:** sempre considere SE distinto como canal de fallback antes de re-trabalhar o visual.
- **Para CE Parallel:** logs apenas em entradas/saídas de branch e mudanças de variável. Nunca logs por tick.
- **Para escrita de logs em JSON:** par `remove_debug_logs.py` + `inject_debug_logs_vN.py` como par idempotente, marcados com `[F<N>DBG]`.

## P3.8 Informações que deveriam estar no prompt inicial

- **Obrigatório:** Especificação formal das fórmulas (taxa, Glória, Consciência), não apenas "clamp". Sem isso, toda spec é ambígua.
- **Obrigatório:** Invariante de estado para switches de lock: "todo branch que tranca deve ter path para destravar".
- **Útil:** Catálogo prévio de SEs default MZ disponíveis com nomes canônicos.
- **Útil:** Mapa dos CEs paralelos ativos (CE 5/7/10/13/16) e o que cada um faz — ter isso pronto reduz exploração.
- **Opcional:** Convenção para `python3 -c` scripts de inspeção (ficam em cache command-line, não persistidos como arquivos).

## P3.9 Melhorias nos artefatos do fluxo

### P3.9.1 Melhorias na análise técnica

**Problema:** Spec das Tasks 5.1 e 5.2 descrevia fórmulas como "clamp Consciência 0-100" e "roll d100 vs taxa", sem definir explicitamente que taxa = `clamp(consc + P_CENA, 0, 100)` e que Safe incrementa Consciência em +10.

**Informação ausente:** fórmulas matemáticas completas e invariantes de estado.

**Seção alvo:** Análise técnica do plano `core_loop_corrida` — seção "Mecânica do Core Loop".

**Patch sugerido para a análise técnica:**

```markdown
## Mecânica do Core Loop — fórmulas e invariantes

### Variáveis principais
- var[104] CONSCIENCIA: 0-100. Inicia 0 em cada corrida.
- var[103] P_CENA: 0-100. Determinado ao carregar cena (Sinal=20, Curva=30, ...).
- var[105] GLORIA: acumula sem cap durante a corrida.

### Fórmulas
- **Safe click:** Consciência += 10 (cap 100). Glória += 10. Cena += 1.
- **Risk click:** taxa = clamp(consc + P_CENA, 0, 100). roll = floor(random * 100).
  - Sucesso (roll < taxa): Glória += P_CENA * 2. Consciência -= P_CENA (mín 0). Cena += 1.
  - Falha (roll >= taxa): Consciência -= P_CENA (mín 0). SW_CRASH_FLAG ON. Cena inalterada.

### Invariantes de estado
- **Todo branch que set `SW_INPUT_LOCKED → ON` deve ter path para `→ OFF`.**
- **SW_INPUT_LOCKED só pode ser liberado por CE de resolução (CE 14 ou CE 15) ou pelo renderer durante transição de cena.**
- **Todo CE chamável por click deve ter guards `If SW_RACE_ACTIVE OFF → exit` e `If SW_INPUT_LOCKED ON → exit` no topo.**
```

**Impacto:** Elimina ambiguidade de Bug 1, Bug 2 e previne recorrência de Bug 3.

### P3.9.2 Melhorias no plano de implementação

**Problema:** Plano não explicitava regra de "todo branch que locka precisa destravar".

**Patch sugerido para o plano de implementação:**

```markdown
### Regra de simetria de lock
Antes de marcar uma task que envolva `SW_INPUT_LOCKED` como completa, auditar:
1. Liste todos os pontos onde `sw[101] → ON` é setado.
2. Liste todos os pontos onde `sw[101] → OFF` é setado.
3. Para cada ponto de ON, verifique se há um path de OFF alcançável em todos os branches possíveis.
4. Em particular: branches de FALHA/CRASH/ERRO frequentemente esquecem de liberar o lock.
```

### P3.9.3 Melhorias nas tasks da fase executada

**Task 5.1 (Safe):** Spec original dizia "Consciência clamp 0-100" — ambíguo.

**Patch sugerido:**

```markdown
### Task 5.1 — Lógica Safe (revisada)

**Comportamento esperado:**
- Consciência: incrementa +10 (cap 100). NÃO apenas clamp passivo.
- Glória: +10 (sem cap).
- Cena (var[101]): += 1 (cada Safe avança para próxima cena).
- Lock: trancar durante resolução, destravar via CE 14.

**Critério de aceitação:**
- [ ] Após 1 Safe click: Consciência = 10 (não 0), Glória = 10, Cena = 1.
- [ ] Após 10 Safe clicks: Consciência = 100 (cap), não 110.
- [ ] Lock liberado em ≤ 30 frames após click.
```

**Task 5.2 (Risk):** Spec original dizia "taxa = clamp(consc, 0, 100)" — incorreto.

**Patch sugerido:**

```markdown
### Task 5.2 — Lógica Risk (revisada)

**Fórmula explícita:**
- taxa = clamp(consc + P_CENA, 0, 100)
- roll = floor(random() * 100) — inteiro 0..99
- Sucesso: roll < taxa. Falha: roll >= taxa.

**Branch FAIL (crítico):**
- Após setar SW_CRASH_FLAG, **DEVE** liberar SW_INPUT_LOCKED (sw[101] → OFF) ou chamar CE de resolução que o faça.
- Sem essa liberação, jogo trava permanentemente após 1ª falha.

**Critério de aceitação:**
- [ ] Risk FAIL não pode deixar sw[101] permanentemente ON.
- [ ] Após 1 Risk FAIL, próximo click ainda é processado (eventualmente — possivelmente via EV_Crash em F6).
```

### P3.9.4 Problemas fora do escopo dos artefatos

| Problema | Classificação | Ação |
|----------|---------------|------|
| Usuário não vê flash verde/dourado (duração 6-8f) | Limitação perceptual, não bug de spec | Manter duração; adicionar SE como fallback padrão em CE 14/15 (já feito em v2) |
| Plugin Command TextPicture (Task 5.4) exige MZ Editor manual | Limitação do schema Plugin Command em JSON | Documentado em `fase-5-completa.md` — não há como automatizar |
| Unlock misterioso entre 2º FAIL e 3º click em playtest anterior | Não-reproduzível deterministicamente; pode ser timeout do timer ou reserve CE concorrente | Logs v2 cobrem CE 7/10/11 para próxima rodada diagnosticar |

### P3.9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|--------------------|-----------------|---------------------|----------------------|------------|
| Bug 1 (Consciência incrementa no Safe) | Spec Task 5.1 ambígua | Task 5.1 | Especificar "+10 cap 100" | Alta |
| Bug 2 (Taxa ≠ clamp(consc)) | Spec Task 5.2 errada | Task 5.2 + Análise técnica | Especificar `clamp(consc + P_CENA, 0, 100)` | Alta |
| Bug 3 (Risk FAIL não destrava) | Implementação esquece unlock no FAIL | Análise técnica + Plano | Invariante "todo lock ON tem path para OFF" | Alta |
| Bug 4 (Flash invisible) | Duração curta por design | Fora do escopo | SE audível como fallback (já em v2) | Média |
| Bug 5 (Safe avança cena por click) | Comportamento intencional não-documentado | Task 5.1 | Especificar "Cena += 1" | Média |

### P3.9.6 Resultado final recomendado

**Patch sugerido para a análise técnica:** incluído em P3.9.1.

**Patch sugerido para o plano de implementação:** incluído em P3.9.2.

**Patch sugerido para as tasks desta fase:** incluídos em P3.9.3 (Tasks 5.1 e 5.2).

**Ações fora do fluxo de especificação:** nenhuma além das já executadas (criação de `inject_debug_logs_v2.py` + `remove_debug_logs.py` como ferramentas operacionais recicláveis).

## P3.10 Checklist operacional (PARTE 3)

- [ ] Antes de propor fix para bug de switch/variável MZ: grep global por `code=121`/`code=122` filtrando pelo ID alvo.
- [ ] Antes de interpretar command code MZ desconhecido: `grep -nA 10 "commandNNN" js/rmmz_objects.js`.
- [ ] Todo script de injeção de logs deve ter par `remove_*.py` idempotente.
- [ ] Logs em CE Parallel só em entradas/saídas de branch, nunca em tick de loop.
- [ ] Para bug visual de duração curta: adicionar SE distinto em paralelo ao efeito visual.
- [ ] Invariante: todo `SW_INPUT_LOCKED → ON` deve ter path para `→ OFF` alcançável em todos os branches.
- [ ] Após editar `data/*.json`: MZ Editor → F10 → Ctrl+S → reiniciar Playtest.
- [ ] JSON validado com `python3 -m json.tool` ou `json.loads()` no próprio script.
- [ ] Não marcar bug como confirmado sem playtest diagnostic com logs, mesmo se root cause por código for evidente.
- [ ] Escrever fórmulas matemáticas explícitas nas Tasks — nunca descrever como "clamp" sem operandos.

---

# PARTE 4 — Registro da task 5.6 (Bug 3 spec)

## P4.1 Resumo da tarefa

**Solicitado:** A partir dos logs empíricos do playtest (que confirmaram o Bug 3 reportado em PARTE 3), escolher a abordagem de correção que melhor facilita as tasks futuras e registrar essa correção como uma task nova antes de implementá-la.

**Restrição explícita do usuário:** "antes de implementar, adicione no plano ou na task ou crie uma task nova para isso."

**Entregue:**
- Análise comparativa das três abordagens (inline `sw[101]→OFF` vs. CE 17 novo vs. só documentar) sob a ótica de "facilitar próximas tasks".
- Recomendação fundamentada: **opção 2 (CE 17 `EV_ResolucaoRiskFail`)** porque (a) completa o padrão arquitetural `On<Action> → Resolucao<Action>` já estabelecido por CE 14/15, (b) prepara encadeamento limpo para F6 `EV_Crash` sem refactor futuro, (c) custo marginal desprezível vs. inline.
- `task-5.6.md` criado com 13 subtarefas, pseudo-código do CE 17, pseudo-código da modificação no CE 12 FAIL branch, critérios de sucesso, fora de escopo, errors comuns a evitar.
- `tasks.md` atualizado em 5 pontos: lista de tasks F5, tabela canônica de CE IDs (F5), tabela global de Tasks, ordem de execução, mapa de Common Events snapshot.

**Critérios de sucesso da task de registro (não da implementação):**
- Task spec seguiu o template das tasks 5.x (frontmatter `<task_context>`, seções Visão Geral / Subtarefas / Detalhes / Critérios / Fora de Escopo).
- Bridge para F6 explicitamente documentada (não é F6 completa, apenas destrava input + feedback audível).
- Implementação obrigatoriamente via `build_phase5_ces.py` (preserva regra F3+F4+F5 consolidada).
- `tasks.md` permaneceu consistente (5 pontos atualizados, nenhum órfão).

**Restrições relevantes:**
- `Jhonny/CLAUDE.md`: jamais editar `data/*.json` direto; sempre via script Python salvo em disco.
- `.claude/skills/rpg-maker-mz-data-json`: script-first edit workflow mandatório.
- Regra do usuário: nunca adicionar `Co-authored-by` em commits.
- Plano `core_loop_corrida/tasks.md`: tarefas em ordem linear com dependências declaradas.

## P4.2 Decisões técnicas e inferências

**Decisão 1 — Recomendar Opção 2 (CE 17 novo) sobre Opção 1 (inline) ou Opção 3 (só documentar).**
- **Motivo:** Usuário perguntou "qual das escolhas é mais indicada para facilitar a implementação das próximas tasks?" — critério explícito.
- **Evidência disponível:**
  - CE 14 (`EV_ResolucaoSafe`) e CE 15 (`EV_ResolucaoRiskOK`) já existem como handlers de resolução dedicados — padrão arquitetural estabelecido.
  - Plano `tasks.md` linha 411 já declara que ramo falha do CE 12 "seta `SW_CRASH_FLAG` (102) e chama `EV_Crash` (F6)" — placeholder para F6.
  - `SW_CRASH_FLAG (sw[102])` foi criado justamente para ser consumido por lógica futura de crash.
- **Resultado:** Usuário confirmou Opção 2 implicitamente ao pedir o registro no plano.
- **Avaliação:** Decisão necessária — o critério do usuário exigia escolha fundamentada.
- **Melhoria futura:** Quando o plano original já declara um CE futuro (ex.: `EV_Crash` em F6), a regra "criar CE de resolução para cada action outcome" pode ser inferida diretamente do padrão existente — não requer comparação explícita de 3 opções.

**Decisão 2 — Definir CE 17 como "bridge" (não F6 completa).**
- **Motivo:** Escopo do bug (input travado) vs. escopo de F6 (crash completo: fadeout + reset + fadein + restart <1s).
- **Evidência:** Tasks 6.1-6.4 em `tasks.md` detalham o que F6 fará; nenhuma é necessária para resolver o bug imediato.
- **Resultado:** Task spec claro sobre o que está e o que não está no escopo.
- **Avaliação:** Necessária — sem isso, qualquer um poderia ler "EV_ResolucaoRiskFail" e achar que precisa implementar o crash completo.
- **Melhoria futura:** Padrão explícito no plano: "toda task de bugfix pós-playtest deve declarar se é bridge ou completa, com referência à task futura que substituirá/complementará".

**Decisão 3 — Modificar CE 12 FAIL via `Call Common Event: 17` ANTES do Comment `TASK 6.1 PENDENTE`.**
- **Motivo:** Preservar o Comment como marcador do ponto-de-extensão para F6.
- **Evidência:** Comment existe em CE 12 (confirmação visual da intenção original de F6 extender dali).
- **Resultado:** Spec registra esta ordem nas subtarefas 5.6.6 e no pseudo-código "Depois (com fix)".
- **Avaliação:** Necessária — inline em qualquer outra posição quebraria a semântica do Comment.
- **Melhoria futura:** Convenção MZ no projeto: "Comments de placeholder devem permanecer como marcadores; inserts são sempre imediatamente antes deles".

**Decisão 4 — Manter `SW_CRASH_FLAG (sw[102]) = ON` no CE 12 (não limpar).**
- **Motivo:** F6 consumirá esta flag para decidir se deve executar a animação de crash.
- **Evidência:** Spec original da task 5.2 (e plano `tasks.md`) define este contrato.
- **Resultado:** Spec do CE 17 explicitamente NÃO muta `sw[102]`.
- **Avaliação:** Necessária — sem isso, F6 não teria como distinguir "FAIL" de "auto-Safe no timeout".
- **Melhoria futura:** Contratos de flags entre fases devem ser parte da análise técnica, não descobertos em retrospectiva.

## P4.3 Uso de ferramentas, comandos e scripts

- **Read `task-5.3.md`** — Objetivo: entender o template de task para replicar em 5.6. Contribuiu diretamente para o spec. Não redundante: era a primeira leitura da sessão. **Como evitar:** se a sessão começar com task creation, ler o template imediatamente ao invés de adiar.

- **Read `tasks.md` (integral, 432 linhas)** — Objetivo: encontrar os 5 pontos de atualização (lista de tasks F5, tabela CE, tabela global, ordem execução, mapa snapshot). **Avaliação:** Leitura completa foi necessária porque o arquivo tem 5+ seções distintas que precisavam de patch cirúrgico. **Como evitar:** `grep -n "task-5\." tasks.md` primeiro localizaria todas as referências sem leitura integral; depois Read focado nas linhas de interesse.

- **Bash `ls core_loop_corrida/`** — Objetivo: confirmar que `task-5.6.md` não existia antes e que tasks 5.1-5.5 e 6.x seguiam numeração contínua. **Resultado:** Confirmou padrão. **Poderia ser substituído por** `Glob task-*.md`. Sem desperdício significativo.

- **Write `task-5.6.md`** — Objetivo: criar spec. **Resultado:** arquivo criado em uma passada (sem iteração). **Contribuiu diretamente para a solução.**

- **Edit `tasks.md`** (4 chamadas) — Objetivo: 4 patches cirúrgicos em pontos diferentes. **Avaliação:** Cada edit foi único e atômico. Não havia forma mais simples (uma única passada de Write exigiria reescrever 432 linhas). **Sem desperdício.**

**Nada foi descartado nesta sessão** — todas as leituras e tools calls contribuíram para a entrega. Sessão enxuta (5 edits + 1 write + 3 reads + 1 ls).

## P4.4 Intervenções e correções do usuário

**Intervenção 1 — "qual das escolhas é mais indicada para facilitar a implementação das próximas tasks?"**
- **Contexto anterior:** Apresentei 3 opções via `AskUserQuestion` para escolher abordagem do Bug 3 fix.
- **O que estava incompleto:** As 3 opções estavam descritas sob critérios técnicos genéricos (impacto, arquivos tocados), sem focar no critério do usuário (facilitar tarefas futuras).
- **Suposição causadora:** Achei que o usuário escolheria por preferência técnica individual; ele quis uma recomendação fundamentada em continuidade.
- **Mudança após correção:** Análise comparativa explícita com 5 razões concretas para Opção 2, terminando com recomendação direta + contraste com YAGNI.
- **Regra reutilizável:** Quando perguntar sobre escolha entre abordagens técnicas, sempre incluir análise de "impacto em tarefas futuras" como dimensão primária, não como sub-proposta.

**Intervenção 2 — "antes de implementar, adicione no plano ou na task ou crie uma task nova para isso."**
- **Contexto anterior:** Confirmei Opção 2 e perguntei "Confirmar Opção 2 para eu prosseguir?" (implícito: prosseguir = implementar).
- **O que estava incorreto:** Ia direto para implementação (criar `build_phase5_ces.py` estendido, modificar `CommonEvents.json`) sem registrar a decisão.
- **Suposição causadora:** Tratei a confirmação da abordagem como sinal verde para implementar; ignorei que o usuário quer spec primeiro.
- **Mudança após correção:** Criei `task-5.6.md` com 13 subtarefas + atualizei `tasks.md` em 5 pontos; NÃO toquei em `CommonEvents.json` ou em scripts Python.
- **Regra reutilizável (load-bearing):** **Para qualquer mudança em `data/*.json` ou em `build_phaseN_ces.py`, criar/atualizar a task spec ANTES da implementação.** A task spec é o artefato-fonte da decisão; o script Python é o artefato-fonte da execução. Esta regra deve ser adicionada ao `MEMORY.md` ou à skill `rpg-maker-mz-data-json`.

**Classificação:** Ambas foram **esclarecimentos de ambiguidade real + nova preferência** (regra spec-first), não correções de erro técnico.

## P4.5 Análise de desperdício

**Desperdício 1 — Apresentação inicial de 3 opções sem recomendação (P4.4 Intervenção 1).**
- **O que aconteceu:** `AskUserQuestion` com 3 opções sem eixo de análise primário; usuário precisou pedir recomendação.
- **Impacto:** Baixo (uma troca de mensagem).
- **Causa:** Convenção de "apresentar opções neutras" sobreposta à necessidade de "recomendar com justificativa".
- **Como evitar:** Para decisões técnicas com critério mensurável (custo futuro, manutenabilidade, etc.), sempre incluir recomendação como primeira opção marcada "(Recommended)" — padrão já descrito no próprio system prompt do AskUserQuestion.

**Desperdício 2 — Pergunta "Confirmar Opção 2 para eu prosseguir?" sem reconhecer intenção de spec-first.**
- **O que aconteceu:** Após recomendar Opção 2, perguntei "Confirmar Opção 2 para eu prosseguir?" — usuário respondeu pedindo spec.
- **Impacto:** Baixo.
- **Causa:** Não internalizei o padrão F3+F4+F5 consolidado de "task spec é fonte antes do script gerador".
- **Como evitar:** Adotar como default: para mudanças em `data/*.json`, sempre propor criação de task spec primeiro, implementação depois.

**Sem outros desperdícios significativos.** Sessão foi enxuta: ~10 tool calls, todas contribuíram para entrega. Sem buscas amplas, sem leituras redundantes, sem tentativas exploratórias.

## P4.6 Caminho mínimo recomendado

Para registrar uma task de bugfix pós-playtest no plano `core_loop_corrida/`:

1. **Confirmar empiricamente o bug via playtest diagnostic logs.**
   - Entrada: logs `[F5DBG]` filtrados no F12 console.
   - Ferramenta: leitura direta dos logs colados pelo usuário.
   - Resultado esperado: identificação do branch/comando que viola a invariante.
   - Critério: bug confirmado quando log mostra estado pós-ação inconsistente com spec.

2. **Analisar opções de correção sob critério "facilitar tarefas futuras".**
   - Entrada: plano `tasks.md` atual + padrões arquiteturais existentes.
   - Ferramenta: `Read` no plano + `grep` em `CommonEvents.json` por handlers similares.
   - Resultado esperado: identificação do padrão a seguir (ex.: `On<Action> → Resolucao<Action>`).
   - Critério: opção escolhida deve (a) completar padrão existente OU (b) explicitamente justificar criação de novo padrão.

3. **Apresentar recomendação com justificativa concreta + YAGNI check.**
   - Entrada: análise do passo 2.
   - Ferramenta: resposta textual direta (sem `AskUserQuestion` neutro).
   - Resultado esperado: usuário confirma ou pede ajuste.
   - Critério: recomendação tem nome da opção + 3+ razões + endereço ao counter-argument YAGNI.

4. **Criar task spec ANTES de tocar em `data/*.json` ou `build_phaseN_ces.py`.**
   - Entrada: decisão confirmada do passo 3.
   - Ferramenta: `Read` em uma task anterior (ex.: `task-5.3.md`) como template + `Write` na nova task.
   - Resultado esperado: arquivo `task-N.M.md` com frontmatter, requisitos, subtarefas, pseudo-código, critérios, fora de escopo.
   - Critério: spec declara explicitamente se é bridge ou completa + dependências + ordem de insert.

5. **Atualizar `tasks.md` em todos os pontos de referência à nova task.**
   - Entrada: `task-N.M.md` criado.
   - Ferramenta: `grep -n "task-N\." tasks.md` para localizar todos os pontos; `Edit` por ponto.
   - Resultado esperado: lista de tasks da fase + tabela de CE IDs + tabela global + ordem de execução + snapshot mapa CEs.
   - Critério: nenhum ponto do plano referencia versão antiga sem a task nova.

6. **PARAR.** Não implementar sem confirmação explícita do usuário.

## P4.7 Conhecimento reutilizável

### Fatos confirmados

- **CE 17 é o próximo slot livre** em `CommonEvents.json` após F5 task 5.5 (CE 16 `EV_HoverRiskButton`).
- **Padrão arquitetural `On<Action> → Resolucao<Action>`** é load-bearing no projeto: CEs 11/12 chamam CEs 14/15; qualquer novo outcome (ex.: FAIL) deve seguir o mesmo padrão criando um novo CE de resolução.
- **Comment `TASK 6.1 PENDENTE`** em CE 12 FAIL é marcador de ponto-de-extensão para F6 — inserts no FAIL branch devem ser antes dele para preservar semântica.
- **`SW_CRASH_FLAG (sw[102])` é contrato entre F5 e F6**: F5 seta ON; F6 consumirá e fará reset. Limpar em F5 quebra o contrato.

### Preferências do usuário

- **Spec-first para mudanças em `data/*.json`:** sempre criar/atualizar task spec antes de implementar. Confirmado nesta sessão como regra load-bearing.
- **Recomendação com justificativa > opções neutras:** quando há critério técnico mensurável, preferir recomendação direta com razões concretas.
- **Análise deve focar em continuidade:** escolhas técnicas são avaliadas pelo impacto em tarefas futuras, não apenas pelo critério imediato.

### Restrições técnicas

- **Skill `rpg-maker-mz-data-json`:** script-first edit workflow mandatório para `data/*.json`.
- **`Jhonny/CLAUDE.md`:** nunca editar `data/*.json` direto; sempre via script Python salvo em disco.
- **Plano `core_loop_corrida/tasks.md`:** tarefas em ordem linear com dependências declaradas; nova task deve incluir `deps:` na linha de entrada da fase.

### Armadilhas conhecidas

- **Pular etapa de spec antes de implementar:** gera retrabalho quando usuário pede spec (caso desta sessão).
- **Apresentar 3 opções sem recomendação:** obriga usuário a pedir recomendação, desperdiça uma troca.
- **Modificar CE 12 FAIL com `sw[101]→OFF` inline:** quebra padrão arquitetural, gera refactor em F6.

### Heurísticas recomendadas

- Quando usuário pede "qual opção facilita próximas tasks": responder com nome da opção + 3+ razões concretas + YAGNI check + recomendação direta.
- Para bug de resolução faltante (ex.: unlock ausente em um branch): sempre criar novo CE de resolução, nunca inline.
- Para task de bugfix pós-playtest: declarar explicitamente se é bridge (com referência à task que completará) ou completa.
- Ao inserir comando em branch com Comment de placeholder: sempre antes do Comment, nunca depois.

## P4.8 Informações que deveriam estar no prompt inicial

- **Obrigatório:** "Registre a correção como task nova no plano antes de implementar."
- **Útil:** Critério de avaliação ("otimizar para tarefas futuras" vs. "minimal fix").
- **Útil:** Referência ao padrão `On<Action> → Resolucao<Action>` para que a LLM não precise re-descobri-lo em `tasks.md`.
- **Opcional:** Confirmação de que `task-5.3.md` é o template canônico para novas tasks 5.x.

## P4.9 Melhorias nos artefatos do fluxo

### P4.9.1 Melhorias na análise técnica

**Problema:** Contrato `SW_CRASH_FLAG` entre F5 e F6 foi descoberto em retrospectiva, não documentado na análise técnica ou spec.

**Informação ausente:** Qual fase seta/sw[102]=ON, qual consome, qual reseta.

**Por que pertence à análise técnica:** É um contrato cross-fase que deveria estar explícito antes do plano de execução.

**Seção sugerida:** "Contratos de estado cross-fase" ou similar.

**Texto sugerido:**
> **Contrato `SW_CRASH_FLAG` (Editor ID 102):**
> - **Setter:** CE 12 (`EV_OnRisk`) FAIL branch, ao confirmar roll >= taxa.
> - **Consumer esperado:** CE F6 `EV_Crash` (task 6.1) — deve ler sw[102] para decidir executar animação de crash.
> - **Reset:** CE F6 `EV_Crash` deve setar sw[102]=OFF no fim do restart.
> - **Invariant:** Entre set e consume/reset, input deve estar destravado (via CE 17 em F5 task 5.6, ou via reset direto em F6 task 6.1 quando disponível).

**Impacto:** Evitaria decisão de "manter ou limpar sw[102] no CE 17" — seria direto do contrato.

### P4.9.2 Melhorias no plano de implementação

**Problema:** Plano não tem placeholder explícito para "resolução do FAIL path" — Bug 3 só foi descoberto em playtest.

**Deficiência:** Tarefa 5.3 cria `EV_ResolucaoSafe` (CE 14) e `EV_ResolucaoRiskOK` (CE 15) mas nenhuma task cria `EV_ResolucaoRiskFail`. Plano pressupõe que F6 `EV_Crash` cobriria, mas entre F5 e F6 o jogo fica travado.

**Etapa afetada:** Task 5.3 (escopo).

**Alteração recomendada:** Adicionar task 5.3-extendida ou task 5.6 no plano original com escopo "bridge FAIL path".

**Texto sugerido (a ser adicionado ao plano original em futuras adições similares):**
> Toda task que cria CEs de resolução para outcomes de handler deve cobrir TODOS os outcomes possíveis. Se um outcome será tratado em fase futura (ex.: crash em F6), criar bridge CE na fase atual para destravar input + feedback mínimo, com Comment de ponto-de-extensão.

**Como reduziria custo:** Eliminaria classe inteira de bugs "input permanentemente travado após X" em fases intermediárias.

### P4.9.3 Melhorias nas tasks da fase executada

**Task 5.3 — adicionar nota sobre outcome FAIL não coberto.**

**Informação ausente:** Task 5.3 cria CE 14 e CE 15 mas não menciona que FAIL é tratado em F6, nem cria bridge.

**Consequência observada:** Bug 3 só descoberto em playtest pós-F5.

**Alteração recomendada:** Adicionar na seção "Fora de Escopo" de `task-5.3.md`:
> Outcome FAIL do Risk (CE 12 ramo `roll >= taxa`) é tratado pela task 5.6 (`EV_ResolucaoRiskFail` CE 17) em F5 extendida, NÃO nesta task. Originalmente planejado para F6 `EV_Crash`, mas bug de input travado entre F5 e F6 exigiu bridge — ver task-5.6.

**Como validar:** Próxima leitura de task 5.3 deixará claro que FAIL path não é oversight, é delegado.

### P4.9.4 Problemas fora do escopo dos artefatos

**Problema:** Apresentação de opções sem recomendação primária (Intervenção 1).

**Por que fora do escopo:** É padrão operacional da LLM, não deficiência de spec.

**Como tratar:** Internalizar regra: para escolhas técnicas com critério mensurável, sempre recomendar com justificativa como primeira opção.

**Ação:** Nenhuma alteração em spec; apenas aprendizado operacional consolidado em P4.7.

### P4.9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|---|---|---|---|---|
| `SW_CRASH_FLAG` contrato implícito | Não documentado em análise técnica | Análise técnica | Adicionar seção "Contratos de estado cross-fase" | Média |
| Bug 3 (FAIL sem unlock) descoberto em playtest | Plano não exigia bridge para outcomes tratados em fase futura | Plano de implementação | Adicionar regra "toda resolução deve cobrir todos os outcomes, com bridge se necessário" | Alta |
| Task 5.3 não menciona que FAIL é delegado | Fora de Escopo omisso | Task 5.3 | Adicionar nota em "Fora de Escopo" referenciando task 5.6 | Baixa |
| Apresentação de opções sem recomendação primária | Padrão operacional LLM | Fora do escopo | Internalizar como heurística | Baixa |

### P4.9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

```markdown
## Contratos de estado cross-fase

### `SW_CRASH_FLAG` (Editor ID 102)

- **Setter:** CE 12 (`EV_OnRisk`) FAIL branch, ao confirmar `roll >= taxa`.
- **Consumer esperado:** CE F6 `EV_Crash` (task 6.1) — deve ler `sw[102]` para decidir executar animação de crash.
- **Reset:** CE F6 `EV_Crash` deve setar `sw[102]=OFF` no fim do restart.
- **Invariant:** Entre set e consume/reset, input deve estar destravado via CE 17 (F5 task 5.6) — bridge explícita entre F5 e F6.
```

#### Patch sugerido para o plano de implementação

Adicionar à seção "Decisões técnicas críticas (load-bearing)" em `tasks.md`:

```markdown
- **Cobertura completa de outcomes:** toda task que cria CEs de resolução deve cobrir TODOS os outcomes do handler correspondente. Se um outcome será tratado em fase futura, criar bridge CE (destrava input + feedback mínimo) na fase atual com Comment de ponto-de-extensão.
```

#### Patch sugerido para as tasks da fase executada

**Task 5.3 (`task-5.3.md`), seção "Fora de Escopo":**

```markdown
- Resolução do FAIL path do Risk (CE 12 ramo `roll >= taxa`): tratada pela task 5.6 (`EV_ResolucaoRiskFail` CE 17), criada como bugfix pós-playtest quando Bug 3 (input travado após FAIL) foi confirmado. Originalmente planejada para F6 `EV_Crash`, mas exigiu bridge entre F5 e F6.
```

#### Ações fora do fluxo de especificação

- Internalizar como aprendizado operacional (P4.4 Intervenção 2): **spec-first para mudanças em `data/*.json`** — criar/atualizar task spec antes de tocar no JSON ou em scripts geradores. Considerar adicionar esta regra ao `MEMORY.md` global.

## P4.10 Checklist operacional

- [ ] Bug confirmado empiricamente via playtest diagnostic logs antes de propor correção.
- [ ] Padrão arquitetural existente identificado antes de escolher abordagem (`grep` em `CommonEvents.json` por handlers similares).
- [ ] Recomendação de opção sempre acompanha justificativa concreta + endereça YAGNI.
- [ ] Task spec criada ANTES de qualquer edit em `data/*.json` ou `build_phaseN_ces.py`.
- [ ] Task spec declara explicitamente: bridge vs. completa + dependências + ordem de insert + Comment marcador.
- [ ] `tasks.md` atualizado em todos os 5 pontos de referência (lista fase, tabela CE, tabela global, ordem execução, snapshot mapa).
- [ ] Insert em branch com Comment placeholder é sempre ANTES do Comment, nunca depois.
- [ ] Contrato de flags cross-fase (ex.: `SW_CRASH_FLAG`) declarado na análise técnica, não descoberto em retrospectiva.
- [ ] Parar após registro da task; não implementar sem confirmação explícita do usuário.

---

# PARTE 5 — Implementação task 5.6 + limpeza pós-playtest (feedback sonoro como canal preferencial)

## P5.1 Resumo da tarefa

**Solicitado pelo usuário:**
1. Analisar o estado real da Fase 5 auditando arquivos (não confiar no status `[x]` do `tasks.md`).
2. Validar a Task 5.4 (HUD Glória via TextPicture) feita manualmente pelo usuário no MZ Editor.
3. Implementar a Task 5.6 (CE 17 `EV_ResolucaoRiskFail` + wire no CE 12 FAIL branch) para resolver o bug de input travado após Risk FAIL.
4. Rodar `fase5/remove_debug_logs.py` para limpar 21 logs `[F5DBG]` + SEs diagnósticos injetados pela `inject_debug_logs_v2.py`.
5. Produzir retrospectiva destacando o **feedback sonoro** como canal preferencial de validação em playtest.

**Restrições explícitas:**
- "antes de implementar, adicione no plano ou na task ou crie uma task nova para isso" (regra spec-first consolidada na PARTE 4).
- Workflow script-first (`rpg-maker-mz-data-json` skill): edits em `data/*.json` só via Python em disco.
- Regra P2.2.3: patch > regenerar quando o JSON contém edições manuais do usuário.

**Entregue:**
- `fase5/build_phase5_ces.py` estendido com `CE_RESOLUCAO_RISK_FAIL = 17` + `build_resolucao_risk_fail_list()` + `Call CE 17` no `build_on_risk_list()` FAIL branch + truncate atualizado para 17.
- `fase5/apply_task_5_6.py` criado: patch cirúrgico idempotente, preserva Plugin Command manual do CE 6 + logs `[F5DBG]` + SEs diagnósticos.
- `fase5/remove_debug_logs.py` corrigido (cláusula `skip_se_cleaning` por CE + `indent=4` + readicionado `Buzzer1` à `DIAG_SE_NAMES`).
- `CommonEvents.json`: CE 17 criado (4 cmds); CE 12 FAIL wired com `Call CE 17`; 25 comandos de diagnóstico removidos.
- `tasks.md`: Task 5.6 marcada como `[x]`; header F5 atualizado para refletir status real.
- **Bug 3 confirmado resolvido pelo usuário em playtest**: Buzzer1 + shake + input destravado após Risk FAIL.

**Critérios de sucesso aplicados:**
- JSON válido (`python3 -m json.tool` OK).
- Invariante de simetria de lock satisfeita: 4 produtores ON (CE 5/7/11/12) ↔ 4 consumidores OFF (CE 7/14/15/**17**).
- Auditoria de IDs inline: 13 IDs em scripts batem com `System.json`; 9 Call CE targets existem.
- Preservação: Plugin Command manual do CE 6, SEs reais (`freada`, `pneu_cantando`, `Buzzer1` no CE 17), wiring `Call CE 17` no CE 12.
- Zero logs `[F5DBG]` remanescentes.
- Playtest MZ do usuário com feedback perceptível (sem F12/F9).

## P5.2 Decisões técnicas e inferências

### P5.2.1 Patch cirúrgico vs regenerar `build_phase5_ces.py`

- **Decisão:** Estender o `build_phase5_ces.py` para refletir o estado correto (artefato-fonte sincronizado), mas NÃO rodá-lo. Criar `apply_task_5_6.py` como patch separado.
- **Motivo:** Rodar `build_phase5_ces.py` seria destrutivo: perderia Plugin Command TextPicture (code 357/657) inserido manualmente pelo usuário no CE 6, mais 21 logs `[F5DBG]` + 4 SEs diagnósticos injetados por `inject_debug_logs_v2.py`.
- **Evidência:** CE 6 dump mostrou `code=357 ['TextPicture', 'set', ...]` + `code=657` (Plugin Command opaco, não reproduzido pelo gerador). Regra P2.2.3 confirmada.
- **Resultado:** Patch cirúrgico preservou tudo; CE 17 adicionado como slot 17; CE 12 FAIL recebeu `Call CE 17` em `[38]` mantendo todos os logs diagnósticos intactos para playtest confirmatório.
- **Avaliação:** Decisão correta e necessária.
- **Melhoria futura:** Toda nova task pós-implementação que precise preservar edições manuais do usuário deve seguir o padrão `apply_task_N_M.py` (script separado de patch idempotente) em vez de regenerar o gerador.

### P5.2.2 Validação da Task 5.4 contra o source do plugin TextPicture

- **Decisão:** Em vez de aceitar o `code=231 Show Picture` com `name=''` como incorreto, ler `TextPicture.js:55-71` para confirmar o fluxo esperado.
- **Motivo:** Suspeita inicial de que `name=''` no Show Picture era bug. Mas o usuário inseriu manualmente — poderia ter feito certo.
- **Evidência:** `Game_Picture.prototype.show` em `TextPicture.js:64-71` verifica `if (this._name === "" && textPictureText)` para interceptar o Show Picture e renderizar texto em vez de imagem. Portanto `name=''` é **necessário** para o plugin funcionar.
- **Resultado:** Fluxo do usuário validado como correto (Set Text → Show Picture com name=''). Identificados apenas 2 problemas paramétricos: `pictureId=1` (spec pedia 51; ia apagar background da cena) e `x,y=(0,0)` (spec pedia 560,20).
- **Avaliação:** Decisão necessária — evitou falso-positivo de "task errada".
- **Melhoria futura:** Antes de reportar "Plugin Command incorreto", ler o source do plugin correspondente para confirmar o contrato.

### P5.2.3 Detecção tardia do Buzzer1 órfão

- **Decisão:** Primeira versão editada do `remove_debug_logs.py` removeu `Buzzer1` de `DIAG_SE_NAMES` para preservar o Buzzer1 real do CE 17.
- **Motivo:** Heurística simples: "se Buzzer1 é SE real no CE 17, não posso remover Buzzer1 globalmente".
- **Evidência:** Rodei o script; 24 comandos removidos. Mas auditoria posterior via `python3 -c` mostrou `CE 12 Buzzer1` ainda presente em `[31]` — era diagnóstico injetado pela `v2`, agora órfão (duplo Buzzer1 no FAIL path: um órfão em CE 12 + um real via CE 17 Call).
- **Resultado:** Corrigido adicionando `Buzzer1` de volta à lista + mantendo cláusula `skip_se_cleaning` para CE 17. Rerodou o script: +1 comando removido.
- **Avaliação:** Decisão inicial incorreta — causou rerodada do script.
- **Melhoria futura:** Mesmo nome de SE pode ser diagnóstico num CE e real noutro. A solução correta é **excluir por slot do CE** (não por nome global). Ao detectar conflito de nome, sempre usar cláusula de skip por CE.

### P5.2.4 `indent=4` em vez de `indent=2`

- **Decisão:** Mudar `json.dumps(..., indent=2)` para `indent=4` no `remove_debug_logs.py`.
- **Motivo:** JSON atual e `build_phase5_ces.py` usam `indent=4` como padrão do projeto.
- **Evidência:** Aprendizado consolidado em `tasks.md`: "Escrever JSON do RPG Maker com `indent=4` para reduzir diff e facilitar revisão".
- **Resultado:** Diff limpo, sem ruído de mudança de estilo.
- **Avaliação:** Necessária.
- **Melhoria futura:** Todo script que escreve `data/*.json` deve herdar `indent=4` do projeto. Documentar esta convenção no `Jhonny/CLAUDE.md`.

## P5.3 Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Necessário? | Contribuiu? | Substituível? |
|------------|----------|-------------|-------------|---------------|
| `Read tasks.md` | Ler plano + status F5 | Sim | Sim (ponto de entrada) | Trabalhar do summary pós-compact |
| `Read fase4/retrospectiva.md` | Ler aprendizados F4 aplicáveis | Sim | Sim (P2.2.3, simetria de lock) | — |
| `Read fase5/retrospectiva.md` PARTE 1-4 | Contexto do que foi feito antes | Sim | Sim | — |
| `Read build_phase5_ces.py` | Entender gerador antes de estender | Sim | Sim | — |
| `Read TextPicture.js:1-120` | Validar fluxo Set Text + Show Picture | Sim | Sim, decisivo | `grep -nA 5 "prototype.show"` seria suficiente |
| `Read remove_debug_logs.py` | Auditar antes de rodar | Sim | Sim, detectou bug do Buzzer1 | — |
| `Bash python3` (dump CEs) | Confirmar estado real do JSON | Sim | Sim, decisivo | — |
| `Bash python3` (auditoria IDs inline) | Validar IDs batem com System.json | Sim | Sim | — |
| `Bash python3` (auditoria code=121) | Confirmar invariante de simetria | Sim | Sim, validou bug 3 resolvido | — |
| `Edit build_phase5_ces.py` (4×) | Estender com CE 17 + Call | Sim | Sim | — |
| `Write apply_task_5_6.py` | Criar patch cirúrgico | Sim | Sim | — |
| `Edit remove_debug_logs.py` (2×) | Corrigir cláusula skip + indent | Sim | Sim | — |
| `Edit tasks.md` (3×) | Marcar 5.6 + atualizar header + tabela | Sim | Sim | — |

**Evitado:** leituras redundantes de `tasks.md`, `task-5.6.md`, `fase-5-completa.md` (todos já em contexto pós-compact ou lidos explicitamente).

## P5.4 Intervenções e correções do usuário

### P5.4.1 "já fiz a 5.4 manualmente. apenas valide. e pode implementar a 5.6"

- **Tipo:** Esclarecimento de escopo + redução de trabalho.
- **Antes:** Ia propor começar pela 5.4 (passo manual MZ) antes da 5.6.
- **Causa:** Presumi que o usuário ainda não tinha feito o passo manual.
- **Mudança:** Foco direto em validar 5.4 + implementar 5.6.
- **Regra reutilizável:** Antes de propor sequência, perguntar ou checar estado real do que usuário já fez.

### P5.4.2 "Eu arrumei o GLÓRIA: N antes de fazer o teste. e sim! consegui ver perfeitamente!"

- **Tipo:** Esclarecimento pós-intervenção anterior.
- **Antes:** Apontei 3 problemas na 5.4 (pictureId=1, x=0,y=0, Comment placeholder).
- **Causa:** Spec tarefa pedia pictureId=51, posição (560,20). Usuário tinha feito inicialmente com 1/(0,0) mas corrigiu antes do playtest sem avisar.
- **Mudança:** Task 5.4 validada como correta.
- **Regra reutilizável:** Não assumir que estado do JSON visto = estado final. Usuário pode ter feito correções manuais desde a última leitura.

### P5.4.3 "Testei, aqui e parece que ficou bom! ... funcionou perfeitamente"

- **Tipo:** Confirmação empírica da task 5.6.
- **Antes:** Recomendei sequência: MZ Editor refazer 5.4 → F10 Ctrl+S → reiniciar Playtest → clicar Furar até FAIL → observar Buzzer1+shake+input destravado.
- **Mudança:** Bug crítico do input travado resolvido. F5 implementada ponta-a-ponta.
- **Regra reutilizável:** Sucesso em playtest é o único critério de conclusão definitivo para bug de gameplay.

### P5.4.4 "quero que você rode fase5/remove_debug_logs.py"

- **Tipo:** Instrução direta.
- **Antes:** Perguntei se queria limpar + commit + planejar F6.
- **Mudança:** Rodei limpeza, identifiquei bug no script (Buzzer1 órfão), corrigi, rerodei.

### P5.4.5 Argumentos do command `/loki:retrospectiva-tecnica` sobre feedback sonoro

- **Tipo:** Nova preferência explícita a ser documentada nesta retrospectiva.
- **Conteúdo:** Feedback sonoro (Play SE) funcionou muito bem; é simples de colocar; não tem problema de posicionamento invisível (falso positivo de Picture/TextPicture); quando precisa mostrar número/texto, usar TextPicture (como EV 06) ou `console.log` via Script; som foi fácil de remover via script Python (`remove_debug_logs.py`) já que `inject_debug_logs.py` documenta o que foi adicionado.
- **Regra reutilizável:** Ver P5.7.2 "Preferências do usuário" e P5.9 "Melhorias nos artefatos".

## P5.5 Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
|-------------|---------|-------|-------------|
| Rerodada do `remove_debug_logs.py` por Buzzer1 órfão | Baixo-médio | Decisão inicial de remover `Buzzer1` da lista em vez de usar cláusula skip por CE | Padrão: mesmo nome de SE = sempre excluir por slot do CE, nunca por nome global |
| Read completo de `TextPicture.js:1-120` quando `grep -nA 5 "prototype.show"` bastava | Baixo | Hábito de "ler para entender" | Para validação de contrato pontual, preferir `grep -nA` seletivo |
| Validação da task 5.4 feita ANTES do usuário avisar que já tinha corrigido | Baixo | Presumi que estado do JSON = estado final | Perguntar ao usuário se houve correção manual desde a última leitura do JSON |

**Esta sessão foi enxuta no agregado.** Patch cirúrgico evitou regeneração destrutiva; auditoria inline em única chamada; auditoria de simetria de lock em única chamada Python.

## P5.6 Caminho mínimo recomendado

Para repetir esta sessão (implementar bugfix pós-playtest em `data/*.json` que precisa preservar edições manuais e logs diagnósticos):

1. **Receber pedido + ler `task-N.M.md` spec** (1 Read).
2. **Bash dump JSON atual** com 1 script Python que lista CEs + flag indicando slots ocupados (1 Bash).
3. **Decidir patch vs regenerar**: se JSON tem `code=357/657` (Plugin Command manual) ou `[F<N>DBG]` logs → patch. Senão → regenerar gerador.
4. **Estender `build_phaseN_ces.py`** com novo CE/Call (mantém artefato-fonte sincronizado).
5. **Criar `apply_task_N_M.py`** (script separado idempotente). Funções: `add_ceN`, `find_target_index`, `wire_X_branch`, asserts pós-escrita.
6. **Rodar patch** + `python3 -m json.tool` + auditoria inline (1 Bash encadeado).
7. **Pedir playtest** ao usuário com feedback perceptível (sem F12).
8. **Após confirmação**, rodar `remove_debug_logs.py` para limpar telemetria.
9. **Auditar pós-limpeza** que SEs reais + Plugin Commands + wiring permanecem.
10. **Atualizar `tasks.md`** marcando task como `[x]` + `fase-N-completa.md` se última task da fase.

## P5.7 Conhecimento reutilizável

### P5.7.1 Fatos confirmados

- **`TextPicture.js` fluxo:** `PluginManager.registerCommand("TextPicture", "set", ...)` armazena texto; `Game_Picture.prototype.show` intercepta quando `_name === ""` e atribui `mzkp_text` (`TextPicture.js:64-71`). Portanto Show Picture com `name=''` é **necessário** para o plugin.
- **CE 17 alocado:** Editor ID 17 = `EV_ResolucaoRiskFail` (Call, switchId=1, 4 cmds). Próximo slot livre = 18 (F6 EV_Crash).
- **Invariante de simetria de lock:** 4 produtores ON (CE 5[17] init, CE 7[35] transição cena, CE 11[7] OnSafe, CE 12[7] OnRisk) ↔ 4 consumidores OFF (CE 7[38] pós-transição, CE 14[5] ResolucaoSafe, CE 15[6] ResolucaoRiskOK, **CE 17[2] ResolucaoRiskFail**).
- **`code=117 Call Common Event` falha silenciosamente** se o CE alvo não existe em `$dataCommonEvents` runtime. Por isso o pós-edit MZ (F10 → Ctrl+S → reiniciar Playtest) é obrigatório.
- **Padrão `On<Action> → Resolucao<Action>`:** cada action outcome (Safe/Risk-OK/Risk-Fail) tem um CE de resolução dedicado que faz feedback + unlock. Permite extensão futura (F6 EV_Crash) sem refactor.

### P5.7.2 Preferências do usuário

- **HIGHLIGHT — Feedback sonoro como canal preferencial de validação em playtest:**
  - `Play SE` (code 250) é simples de inserir em CEs (parâmetros: `{name, volume, pitch, pan}`).
  - Não tem problema de posicionamento invisível como `Show Picture`/`Move Picture`/`TextPicture` (falso positivo: LLM escolhe posição fora da tela visível, usuário não vê, ambos acham que funcionou).
  - Não tem problema de z-order como overlays (Picture ID menor pode ficar atrás de outro Picture sem LLM perceber).
  - Experiência do usuário é mais clara e rápida: ouviu = funcionou.
  - **Fácil de remover** quando adicionado via script Python documentado (`inject_debug_logs.py` lista exatamente o que adicionou → `remove_debug_logs.py` espelha a remoção).
- **Quando precisa mostrar número ou texto visível na tela:**
  - Preferir `TextPicture` (Plugin Command code 357 + Show Picture code 231 com `name=''`) — padrão do EV 6 (`EV_UpdateHud`).
  - Alternativa: `Script console.log("...")` para diagnóstico textual em F12 devtools — padrão do EV 6 (`console.log("Glória on terminal")`).
  - Validar posição com playtest antes de confiar (diferente do som, posição visível pode variar com resolução/janela).
- **Spec-first:** antes de qualquer edit em `data/*.json`, ter task spec registrada (regra PARTE 4 §P4.4.2).
- **Commits sem Co-authored-by;** autor `Edney <edney_reis999@hotmail.com>`.

### P5.7.3 Restrições técnicas

- `data/*.json` é read-only em runtime; toda edição requer MZ Editor → Database (F10) → Ctrl+S → reiniciar Playtest.
- `data/*.json` deve ser escrito com `indent=4` (padrão do projeto; `indent=2` cria diff ruidoso).
- Plugin Commands (code 357/657) não podem ser gerados via Python+json com segurança — schema opaco.
- `Game_Picture.prototype.show` em MZ 1.10.0 sempre cria nova instância (`rmmz_objects.js:1065`) — propriedades custom (`mzkp_commonEventId`, `mzkp_text`) só persistem entre shows se re-aplicadas ou se via mecanismo do plugin.

### P5.7.4 Armadilhas conhecidas

- **Mesmo nome de SE pode ser diagnóstico num CE e real noutro.** Solução: excluir por slot do CE (`skip_se_cleaning=True` para CEs criados pela task), não por nome global em `DIAG_SE_NAMES`.
- **`remove_debug_logs.py` com `indent=2`** cria diff ruidoso e quebra convenção do projeto.
- **Primeira rodada de cleanup pode deixar órfãos** se a lista `DIAG_SE_NAMES` não cobrir todos os nomes injetados. Auditar pós-limpeza com `python3 -c` para confirmar zero `[F5DBG]` + zero diagnósticos órfãos.
- **Auditoria visual via MZ Editor não audita scripts inline.** Sempre usar `rg "value\\(|setValue\\("` ou `python3 -c` para validar IDs.
- **Picture ID 1 colide com background da cena** (F3 RenderSinal/Curva mostram background em Picture 1). Usar IDs 41-50 para botões, 22-24 para hover overlays, 51+ para HUD texto.

### P5.7.5 Heurísticas recomendadas

- **Para validação em playtest com feedback perceptível:** preferir `Play SE` sobre `Show Picture`/`TextPicture`. SE é binário (ouviu/não ouviu); Picture tem ambiguidade (posição/z-order/visibilidade).
- **Quando Picture for necessário:** validar posição com playtest; usar IDs ≥51 para HUD (longe do range 1-50 de fundo/botões).
- **Para patches pós-implementação:** criar `apply_task_N_M.py` separado, idempotente, com asserts pós-escrita. Preserva edições manuais e telemetria.
- **Para cleanup de telemetria:** rodar auditoria pós-limpeza (`python3 -c` que conta `[F<N>DBG]` + lista Play SE por CE) para confirmar zero órfãos.
- **Para invariante de lock:** `grep -n "code.*121.*\[101, 101" CommonEvents.json` lista todos os pontos que mexem em `SW_INPUT_LOCKED`. Confirmar #ON = #OFF.

## P5.8 Informações que deveriam estar no prompt inicial

- **Obrigatório:** Estado atual do JSON (existe `code=357` Plugin Command? Existem logs `[F5DBG]`?) — determina patch vs regenerar.
- **Obrigatório:** Quais tasks o usuário já implementou manualmente desde a última leitura do JSON — evita auditoria de coisas já corrigidas.
- **Útil:** Confirmação de que task spec foi criada antes da implementação (regra spec-first).
- **Útil:** Lista de SEs reais do jogo (`freada`, `pneu_cantando`, `Buzzer1`) vs SEs diagnósticos (`Bell3`, `Cursor1`, `Applause2`) — evita remoção indevida no cleanup.
- **Opcional:** Snapshot do `System.json` atualizado com IDs nomeados.

## P5.9 Melhorias nos artefatos do fluxo

### P5.9.1 Melhorias na análise técnica

**Problema:** Não há tabela canônica de SEs do projeto (reais vs diagnósticos), causando ambiguidade na limpeza.

**Informação ausente:** Catálogo de SEs canônicos vs diagnósticos.

**Seção sugerida:** "Catálogo de áudio — SEs reais vs diagnósticos".

**Texto sugerido:**

```markdown
## Catálogo de áudio — SEs reais vs diagnósticos

| SE | Tipo | Onde | Quando tocar |
|----|------|------|--------------|
| `freada` | Real | CE 11 OnSafe | Click Safe (F4.5) |
| `pneu_cantando` | Real | CE 12 OnRisk | Click Risk (F4.5) |
| `Buzzer1` | Real | CE 17 ResolucaoRiskFail | Risk FAIL (task 5.6) |
| `crash_metal` | Real (futuro) | CE 18 EV_Crash | Crash animation (F6) |
| `Bell3` | Diagnóstico | (removido) | Era diagnóstico success v2 |
| `Cursor1` | Diagnóstico | (removido) | Era diagnóstico Safe v2 |
| `Applause2` | Diagnóstico | (removido) | Era diagnóstico Risk-OK v2 |
| `Up`/`Blow1` | Diagnóstico | (removido) | Reservados v2 não usados |

**Regra:** Toda vez que um SE é promovido de diagnóstico para real (ex.: Buzzer1 em CE 17),
atualizar esta tabela. `remove_debug_logs.py` deve excluir por slot do CE usando
`skip_se_cleaning`, nunca por nome global.
```

**Impacto:** Elimina a rerodada do `remove_debug_logs.py` por ambiguidade de nome.

### P5.9.2 Melhorias no plano de implementação

**Problema:** Plano não tem regra explícita sobre feedback preferencial (som vs visual).

**Patch sugerido:** Adicionar ao bloco "Pré-condições para playtest":

```markdown
### Estratégia de feedback perceptível (canal preferencial)

Para validação manual em playtest, **priorizar canais na seguinte ordem**:

1. **`Play SE` (code 250)** — canal preferencial. Binário (ouviu/não ouviu),
   sem ambiguidade de posição/z-order/visibilidade. Fácil de adicionar e remover
   via `inject_debug_logs.py` + `remove_debug_logs.py` (par documentado).
2. **`TextPicture` (Plugin Command + Show Picture com `name=''`)** — quando
   precisa mostrar número/texto visível. Padrão do EV 6. Validar posição com
   playtest (pode variar com resolução/janela).
3. **`Script console.log("...")` (code 355)** — diagnóstico textual em F12
   devtools. Não é feedback perceptível (requer F12) mas é útil para
   correlacionar com SE/Picture durante debug.
4. **`Show Picture`/`Move Picture` para flash/overlay** — último recurso.
   Sujeito a falso-positivo (LLM escolhe posição fora da área visível).

**Anti-padrão:** Declarar "validar via F12 que switch X é ON" — F12 é debug,
não validação. Ver [[user-testable-feedback]].
```

**Como reduziria custo:** Próxima LLM escolherá SE por padrão, evitando iterar
entre abordagens visuais que podem ter falso-positivo de posição.

### P5.9.3 Melhorias nas tasks da fase executada

**Task 5.6 — adicionar seção "Critério de aceitação preferencial":**

```markdown
### Critério de aceitação (feedback sonoro preferencial)

Após implementação, validar via playtest MZ com feedback **audível**:

- [ ] Clicar Furar até Risk FAIL → `Buzzer1` (CE 17) audível ao usuário.
- [ ] Shake screen visível por ~8 frames.
- [ ] Input destravado — pode clicar de novo sem reiniciar o jogo.

**Por que som e não flash visual:** feedback sonoro é binário e não tem
problema de posicionamento invisível (falso-positivo). Para validação
definitiva do bug de input travado, "ouvir Buzzer1" é evidência suficiente
de que CE 17 executou.
```

### P5.9.4 Problemas fora do escopo dos artefatos

| Problema | Classificação | Ação |
|----------|---------------|------|
| Buzzer1 órfão após primeira rodada do `remove_debug_logs.py` | Falha operacional da LLM (deveria ter pensado em conflito de nome antes) | Nenhuma alteração de artefato; aprendizado em §P5.7.4 |
| Usuário corrigiu 5.4 manualmente sem avisar antes da auditoria | Falha de comunicação, não de artefato | Nenhuma alteração |
| Rerodada do `remove_debug_logs.py` para limpar órfão | Custo operacional de aprendizado | Padrão "excluir por slot do CE" documentado em §P5.7.4 |

### P5.9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|--------------------|-----------------|----------------------|----------------------|------------|
| Buzzer1 órfão no cleanup | Falta de catálogo de SEs reais vs diagnósticos | Análise técnica | Adicionar "Catálogo de áudio" | Alta |
| Posicionamento invisível em Picture/TextPicture gera falso-positivo | Falta de hierarquia de canais de feedback | Plano | Adicionar "Estratégia de feedback perceptível" | Alta |
| Task 5.6 não explicitava som como critério preferencial | Task spec não hierarquizava canais | Task 5.6 | Adicionar "Critério de aceitação preferencial" | Média |

### P5.9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Incluído em P5.9.1 — adicionar seção "Catálogo de áudio — SEs reais vs diagnósticos".

#### Patch sugerido para o plano de implementação

Incluído em P5.9.2 — adicionar "Estratégia de feedback perceptível (canal preferencial)".

#### Patch sugerido para as tasks desta fase

Incluído em P5.9.3 — Task 5.6 ganha "Critério de aceitação (feedback sonoro preferencial)".

#### Ações fora do fluxo de especificação

- **Salvar preferência do usuário em memória persistente** (`/Users/edney/.claude/projects/-Users-edney-projects-coreto-summer26/memory/`) — ver P5.10 item 35. Esta é uma preferência transversal que deve carregar em todas as sessões futuras, não apenas F5.

## P5.10 Checklist operacional (incremental)

Itens adicionais aplicáveis à próxima execução:

26. **Decisão patch vs regenerar:** se JSON tem `code=357/657` Plugin Command manual ou logs `[F<N>DBG]`, usar patch cirúrgico — nunca regenerar gerador.
27. **Validação de Plugin Command:** antes de reportar "Plugin Command incorreto", `grep -nA 5` no source do plugin correspondente para confirmar o contrato.
28. **Catálogo de SEs:** antes de cleanup de telemetria, confirmar quais SEs são reais do projeto (`freada`, `pneu_cantando`, `Buzzer1` no CE 17) vs diagnósticos.
29. **Excluir por slot do CE:** em scripts de cleanup, mesmo nome de SE pode ser diagnóstico num CE e real noutro — usar `skip_se_cleaning=True` por CE, nunca excluir por nome global.
30. **`indent=4` sempre:** todo script Python que escreve `data/*.json` deve usar `indent=4, ensure_ascii=False`.
31. **Auditoria pós-cleanup:** após `remove_debug_logs.py`, rodar `python3 -c` que conta `[F<N>DBG]` + lista Play SE por CE para confirmar zero órfãos.
32. **Feedback preferencial:** em playtest de validação, priorizar `Play SE` sobre `Show Picture`/`TextPicture` (canal binário, sem falso-positivo de posição).
33. **Invariante de simetria de lock:** `grep -n "code.*121.*\[101, 101" CommonEvents.json` deve listar #ON = #OFF.
34. **Spec-first:** antes de qualquer edit em `data/*.json`, confirmar que task spec existe (regra PARTE 4).
35. **Salvar preferências transversais em memória persistente:** quando usuário explicitar preferência que se aplica a múltiplas sessões (ex.: "feedback sonoro preferencial"), criar memory file em `~/.claude/projects/<project>/memory/`.
