---
fase: 2
sessao: 2026-06-20
tema: inversão de opcodes RMMZ 246/249 causando silêncio em Playtest
status: retrospectiva-tecnica
---

# Retrospectiva — Fase 2 (opcode inversion)

## 1. Resumo da tarefa

**Solicitado:** Implementar Fase 2 do plano `Jhonny/planos/003-bug-fix-round1/tasks.md` — tocar ME distinto (Victory1 vs Defeat1) nas telas de vitória e derrota do CE 19.

**Entregue:** CE 19 reformulado em dois patches (G reordena script, H adiciona branch condicional). Após uma correção de regressão, Playtest validou jingles distintos em ambos os paths.

**Critério de sucesso:** Usuário ouve Victory1 na vitória, Defeat1 na derrota, distinguíveis por ouvido. Confirmado em Playtest.

**Restrições relevantes:** RPG Maker MZ, `CommonEvents.json` editável via gerador Python idempotente, convention de memórias `rmmz-indent-skipbranch` / `never-delete-common-events` / `user-testable-feedback`, plugin `Jhonny_RaceHelper.js`.

## 2. Decisões técnicas e inferências

### Inferência 1 — Opcodes RMMZ invertidos

- **Decisão:** Usei `CODE_PLAY_ME = 246` e `CODE_PLAY_SE = 249` no gerador Python, seguindo literalmente a especificação da `task-2.2.md`.
- **Motivo:** A task-2.2.md declarava explicitamente "code 249 = PlaySE, code 246 = Play ME", e o contexto de planejamento parecia confiável.
- **Evidência disponível:** task-2.2.md §Patch H, linhas sobre "Target audio command (after Patch H): Play ME (code 246)".
- **Resultado:** Falhou — silêncio total em ambos os paths. `rmmz_objects.js:10809` define `command246 = fadeOutBgs`, e `rmmz_objects.js:10815` define `command249 = playMe`.
- **Avaliação:** Inferência DESNECESSÁRIA — a fonte (`rmmz_objects.js`) estava sempre disponível e uma única busca teria confirmado os opcodes em segundos.
- **Melhoria futura:** Antes de escrever patch com opcode RMMZ, SEMPRE grep em `rmmz_objects.js` por `Game_Interpreter.prototype.commandNNN`. Memory salva: `rmmz-audio-opcodes.md`.

### Inferência 2 — Auditorias sufficient como gate de qualidade

- **Decisão:** Confiei que Audits G/H/I/J aprovando significavam que a implementação estava correta.
- **Motivo:** As quatro auditorias passaram sem erros; JSON válido; gerador idempotente.
- **Evidência disponível:** Output das audits imprimindo "OK" para G/H/I/J.
- **Resultado:** Falhou silenciosamente — as audits estavam codificadas com o MESMO opcode errado da implementação, então validaram tautologicamente.
- **Avaliação:** Inferência DESNECESSÁRIA — deveria ter notado que Audit I checava "code 249 PlaySE com nomes ME", e como code 249 é Play ME (não PlaySE), o audit não fazia sentido.
- **Melhoria futura:** Auditorias devem validar SEMÂNTICA (tipo do param vs handler esperado), não só código numérico. Para áudio: Play ME/SE espera dict; FadeoutBGS/BGM espera número.

### Inferência 3 — Pré-Patch H, áudio era silencioso

- **Decisão:** Acreditei na premissa de task-2.2.md de que o pré-Fase 2 era `PlaySE Victory1` (code 249) e portanto silencioso (porque o asset vive em `audio/me/`).
- **Motivo:** task-2.2.md vinha com este diagnóstico pronto.
- **Evidência disponível:** Apenas a afirmação da task.
- **Resultado:** Premissa incorreta — code 249 é Play ME, que carrega `Victory1.ogg` de `audio/me/` corretamente. Pré-Fase 2 tocava Victory1 em ambos os paths (o bug #2 original).
- **Avaliação:** Inferência PARCIALMENTE necessária (a task apresentava isto como fato), mas deveria ter sido validada com Playtest antes de planejar a correção.
- **Melhoria futura:** Para qualquer análise de "comportamento atual", requerer evidência observável (log, Playtest, ou código) — não confiar em afirmação de documento.

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta/comando                            | Objetivo                                | Contribuiu? | Poderia ser mais simples?                  |
| --------------------------------------------- | --------------------------------------- | ----------- | ------------------------------------------ |
| `Read` task-2.1/2.2/2.3.md                    | Entender especificação                  | Sim         | Sim — leitura única no início bastava      |
| `Read` `build_phase1_ces.py`                  | Casar estilo do gerador                 | Sim         | Sim                                        |
| `Bash ls Jhonny/audio/me/`                    | Inventariar ME assets                   | Sim         | -                                          |
| `Bash python3 json.load System.json`          | Confirmar defeatMe canônico             | Sim         | -                                          |
| `Bash python3` dump CE 19                     | Confirmar estado post-Fase 1            | Sim         | -                                          |
| `Write build_phase2_ces.py`                   | Gerador                                 | Sim         | -                                          |
| `Bash python3 build_phase2_ces.py`            | Aplicar patches                         | Sim         | -                                          |
| Audits G/H/I/J (one-liners Python)            | Validar implementação                   | NÃO         | Deveriam validar semântica, não só código  |
| **FALTANTE:** `grep commandNNN rmmz_objects.js` | Verificar opcodes antes do patch        | -           | **Deveria ter sido o PRIMEIRO passo**      |

### Buscas redundantes / leituras excessivas

- **Nenhuma leitura redundante grave.** As leituras foram direcionadas.
- **Tentativa exploratória evitada:** depois do /loki:feedback, fiz UMA busca (`grep command246\|command249 rmmz_managers.js`) que imediatamente confirmou a inversão. Esta busca deveria ter ocorrido ANTES de escrever o gerador.

## 4. Intervenções do usuário

### Intervenção 1 — `/loki:feedback` reportando silêncio

- **Instrução:** "Logo depois que eu perco e entro na tela de derrota eu não estou escutando audio nenhum, isso é esperado? ... Na tela de vitoria agora eu também não escuto audio nenhum."
- **O que estava incorreto:** Patch H estava chamando `fadeOutBgs` no lugar de `playMe`.
- **Suposição causadora:** Confiei que a especificação task-2.2.md estava correta sobre opcodes RMMZ sem verificar a fonte.
- **Mudança após correção:** Identifiquei causa raiz lendo `rmmz_objects.js`, corrigi Patch H para detectar 3 estados (original/regressão/correto), normalizei branch params para 5 elementos, re-run + audits.
- **Regra reutilizável:** Toda opcode RMMZ deve ser verificada em `rmmz_objects.js` antes de ir para patch. Memory `rmmz-audio-opcodes` registrada.

### Intervenção 2 — `/loki:feedback` "funcionou perfeitamente!!!"

- Confirmação de Playtest. Sem correção; apenas fechamento de fase.

## 5. Análise de desperdício

| Desperdício                                        | Impacto | Causa                                    | Como evitar                                              |
| --------------------------------------------------- | ------- | ---------------------------------------- | -------------------------------------------------------- |
| Gerador escrito com opcode errado                   | Alto    | Confiança cega em task-2.2.md            | `grep commandNNN rmmz_objects.js` como passo 1           |
| Audits G/H/I/J passaram falsamente                  | Alto    | Mesmo erro de opcode contaminação        | Audits devem validar tipo do param vs handler            |
| Re-trabalho de escrita do gerador pós-regressão     | Médio   | Correção de Patch H + branch params      | Evitar se opcode tivesse sido verificado antes           |
| Atualização de `fase-2-completa.md` v1 → v2         | Baixo   | Documentar correção                      | Inevitável dado o bug                                    |
| Roteiro de Playtest冗長 em `fase-2-completa.md`     | Baixo   | Copiei estrutura da Fase 1               | Roteiro curto seria suficiente                           |

## 6. Caminho mínimo recomendado

Para executar Fase 2 (ou equivalente — qualquer patch que adicione branch em comando de áudio RMMZ):

1. **Verificar opcodes em `rmmny/js/rmmz_objects.js`.** Entrada: lista de opcodes a usar. Ferramenta: `grep commandNNN`. Resultado esperado: tabela opcode→handler. Critério: todos os opcodes do patch confirmados na fonte antes de prosseguir.
2. **Inventariar assets de áudio relevantes.** `ls audio/<me|se|bgm|bgs>/`. Confirmar com `System.json` qual é o canônico.
3. **Dump do CE alvo pós-fase-anterior.** Confirmar índices de cmd que serão tocados.
4. **Escrever gerador idempotente** com patches nomeados (G, H, I, ...), cada um com detecção de estado pré-mutação.
5. **Escrever audits SEMÂNTICAS** (validar tipo do param vs handler, não só opcode numérico). Exemplo: para Play ME, validar que `cmd.parameters[0]` é dict; para FadeoutBGS, validar que é número.
6. **Rodar gerador 2x** (aplica + idempotência) + audits + `json.tool`.
7. **Handoff para Playtest** com cenários victory e defeat explícitos.

## 7. Conhecimento reutilizável

### Fatos confirmados

- `Jhonny/js/rmmz_objects.js`: `command242` = FadeoutBGM, `command246` = FadeoutBGS, `command249` = Play ME, `command250` = Play SE, `command111` = Conditional Branch.
- Conditional Branch em variável usa params `[1, varId, operandSrc, operandVal, operator]` (5 elementos); operandSrc=0 constante, operator=0 igualdade.
- `System.json` é a fonte canônica para `victoryMe` / `defeatMe` / `gameoverMe`.
- Assets RMMZ carregam por canal: code 249 carrega de `audio/me/`, code 250 de `audio/se/`. Não há cross-loading.

### Preferências do usuário

- Não adicionar Co-authored-by em commits.
- Não comentar código desnecessariamente (CLAUDE.md básico-rules.json).
- Validação Playtest requer feedback visível/audível sem F12/F9 (memory `user-testable-feedback`).
- Commits só quando explicitamente solicitado.

### Restrições técnicas

- RPG Maker MZ `data/*.json` são read-only em runtime; editar só via gerador.
- Generators Python em `fase<N>/build_phase<N>_ces.py`, idempotentes via pattern detection.
- Memory `never-delete-common-events`: CEs são "limpos" para objeto vazio, nunca null'd.
- Memory `rpg-mz-indent-skipbranch`: cmds dentro de IF/ELSE devem ter indent = parent + 1.

### Armadilhas conhecidas

- **NUNCA confiar em opcodes RMMZ vindos de especificação sem verificar em `rmmz_objects.js`.** Especificações podem ter sido escritas com convenção de MV (que tem códigos diferentes) ou invertidas.
- Audits que repetem o opcode da implementação são tautológicas e não pegam regressão.
- `fadeOutBgs({dict})` silencia sem erro — params[0] é esperado como número; JS não reclama do tipo errado.
- Após aplicar patch, **hard-refresh do browser** em Playtest (`Cmd+Shift+R`) ou o JSON cached mascara a correção.

### Heurísticas recomendadas

- Antes de qualquer patch RMMZ com áudio/switch/variable/timer: 1 grep em `rmmz_objects.js`.
- Para auditorias: sempre validar tipo do param vs handler, não só código.
- Antes de Playtest: listar manualmente o que cada path deve produzir (áudio, visual, comportamento). Facilita report do usuário.
- Após descobrir bug de opcode:.salvar memory específica para evitar recorrência.

## 8. Informações que deveriam estar no prompt inicial

- **Obrigatório:** "Antes de escrever qualquer patch RMMZ com opcodes numéricos, verifique-os em `Jhonny/js/rmmz_objects.js` procurando por `Game_Interpreter.prototype.commandNNN`."
- **Obrigatório:** "Audits devem validar semântica (tipo do param vs handler), não só opcode numérico."
- **Útil:** Tabela de opcodes RMMZ mais comuns (111, 117, 118, 119, 121, 122, 230, 242, 246, 249, 250, 355, 655, 411, 412).
- **Útil:** "Se a task-2.X.md afirma 'estado atual do JSON é X', valide com um dump antes de confiar."
- **Opcional:** Style de resposta preferido (conciso, em Português).

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

| Problema observado                                                            | Causa principal                              | Artefato responsável | Alteração necessária                                                | Prioridade |
| ----------------------------------------------------------------------------- | -------------------------------------------- | -------------------- | ------------------------------------------------------------------- | ---------- |
| Opcode 246/249 invertido na implementação                                     | Análise técnica não verificou opcodes na fonte | Análise técnica      | Adicionar "Dicionário RMMZ opcode→handler (verificado em rmmz_objects.js)" | Alta       |
| Premissa "pré-Fase 2 era silêncio" não validada                               | Análise assumiu comportamento sem Playtest   | Análise técnica      | Adicionar seção "Estado observável atual" com Playtest/log          | Média      |

#### Patch sugerido para a análise técnica

Adicionar à análise técnica (referenciada por `race-feedback-impl-guide.md`):

```markdown
## RMMZ opcode dictionary (verificado em Jhonny/js/rmmz_objects.js)

Antes de escrever qualquer patch RMMZ com comando numérico, confirme o opcode
em rmmz_objects.js. Códigos confirmados para este projeto:

| Code | Handler                            | Params                                                 |
| ---- | ---------------------------------- | ------------------------------------------------------ |
| 111  | Conditional Branch                 | [type, ...] (case 1 variable: 5 params)                |
| 117  | End Event Processing               | [eventId]                                              |
| 118  | Label                              | [labelName]                                            |
| 119  | Jump To Label                      | [labelName]                                            |
| 121  | Control Switch                     | [startId, endId, value] (0=ON, 1=OFF)                  |
| 122  | Control Variable                   | [startId, endId, op, operandType, operandValue]        |
| 230  | Wait                               | [frames]                                               |
| 242  | Fadeout BGM                        | [durationSec]                                          |
| 246  | Fadeout BGS                        | [durationSec]                                          |
| 249  | Play ME                            | [{name, volume, pitch, pan}]                           |
| 250  | Play SE                            | [{name, volume, pitch, pan}]                           |
| 355  | Script                             | [jsCode]                                               |
| 655  | Script (continuação)               | [jsCode]                                               |
| 411  | Else                               | []                                                     |
| 412  | End                                | []                                                     |

Para outros opcodes: grep em rmmz_objects.js por `commandNNN`.
```

### 9.2 Melhorias no plano de implementação

| Problema observado                                            | Causa principal                          | Artefato responsável | Alteração necessária                                    | Prioridade |
| ------------------------------------------------------------- | ---------------------------------------- | -------------------- | ------------------------------------------------------- | ---------- |
| Fase 2 dependia de opcodes não verificados                    | Plano não inclui passo "verificar opcode" | Plano                | Adicionar passo pré-Fase: "Dicionário opcode"            | Alta       |
| Playtest só no fim da fase; regressão descoberta tarde        | Plano não tem sanity-check pré-Playtest  | Plano                | Adicionar "pré-Playtest: validar tipo param vs handler"  | Média      |

#### Patch sugerido para o plano de implementação

Adicionar ao `tasks.md`, antes da lista de fases:

```markdown
## Pré-requisito cross-fase — Verificação de opcodes RMMZ

Antes de iniciar qualquer fase que envolva command codes RMMZ
(áudio, switch, variable, branch, timer), verifique cada opcode em
`Jhonny/js/rmmz_objects.js` procurando por `Game_Interpreter.prototype.commandNNN`.
Confirme o tipo esperado de `parameters` e registre no arquivo da fase.

Audits que validam opcode numérico são insuficientes — devem também validar
que `parameters[0]` corresponde ao tipo esperado pelo handler (dict para
Play ME/SE/BGM/BGS, número para Fadeout/Wait).
```

### 9.3 Melhorias nas tasks da fase executada

| Problema observado                                            | Causa principal                          | Task     | Alteração necessária                                            | Prioridade |
| ------------------------------------------------------------- | ---------------------------------------- | -------- | --------------------------------------------------------------- | ---------- |
| Task 2.2 afirma "code 249 = PlaySE, code 246 = Play ME"       | Task continha opcode invertido           | task-2.2 | Substituir afirmação e exigir verificação em rmmz_objects.js    | Alta       |
| Task 2.3 audits checam code 246 como Play ME                  | Mesma inversão                           | task-2.3 | Atualizar audits para code 249 + validar tipo param             | Alta       |
| Task 2.2 pré-Fase H assume "Victory1 é silencioso pré-patch"  | Premissa não validada                    | task-2.2 | Adicionar passo "dump e ouvir áudio pré-patch para confirmar"   | Média      |

#### Patch sugerido para as tasks da fase executada

**task-2.2.md — substituir §"Current audio command":**

```markdown
## PRÉ-PASSO OBRIGATÓRIO — Verificar opcodes em rmmz_objects.js

Antes de escrever qualquer patch, grep em `Jhonny/js/rmmz_objects.js`:

    grep -n "Game_Interpreter.prototype.command\(111\|246\|249\|242\)" \
        Jhonny/js/rmmz_objects.js

Confirme:
- `command242` = Fadeout BGM (params: [durationSec])
- `command246` = Fadeout BGS (params: [durationSec]) — **NÃO é Play ME**
- `command249` = Play ME (params: [{name, volume, pitch, pan}])
- `command111` = Conditional Branch

> NOTA: versões anteriores desta task invertiam 246 e 249. A fonte da
> verdade é `rmmz_objects.js`, não esta especificação.

## Current audio command (verificado)

CE 19 cmd[6] é `command249` = Play ME com `{"name": "Victory1", ...}`.
Carrega `Victory1.ogg` de `audio/me/` corretamente. **Pré-Patch H, toca
Victory1 em ambos os paths (vitória e derrota) — este é o bug #2 original.**

## Patch H — Adicionar branch sem converter opcode

O opcode 249 está correto. Patch H apenas envolve o Play ME em um branch:

    If VAR_VITORIA_PASSOU == 1:
        Play ME "Victory1"        # code 249
    Else:
        Play ME "Defeat1"         # code 249

NÃO converter 249 → 246. Manter params como dict.
```

**task-2.3.md — atualizar audits H e I:**

```markdown
**Audit H** — Two distinct Play ME (code 249) names in a branch:

    python3 -c "import json; c=json.load(open('Jhonny/data/CommonEvents.json'))[19]; lst=c['list']; names=[cmd['parameters'][0].get('name') for cmd in lst if cmd['code']==249 and isinstance(cmd['parameters'][0], dict)]; assert len(set(names)) >= 2, f'expected >=2 distinct ME names, got {names}'; print('Audit H OK')"

**Audit I (regression check)** — No FadeoutBGS (code 246) carrying ME asset
names (validates semantically — FadeoutBGS expects number param, not dict):

    python3 -c "import json; c=json.load(open('Jhonny/data/CommonEvents.json'))[19]; lst=c['list']; wrong=[cmd['parameters'][0].get('name') for cmd in lst if cmd['code']==246 and isinstance(cmd['parameters'][0], dict) and cmd['parameters'][0].get('name') in ('Victory1','Defeat1','Defeat2','Gameover1','Gameover2')]; assert not wrong, f'FadeoutBGS used with ME asset(s): {wrong}'; print('Audit I OK')"
```

### 9.4 Problemas fora do escopo dos artefatos

| Problema observado                                    | Por que está fora do escopo                                      | Como tratar                                            |
| ----------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------ |
| Cache do browser pode mascarar correção em Playtest   | Ambiente operacional, não especificação                          | Documentar em instrução de Playtest, não em tasks      |
| Possível regressão silenciosa via audits tautológicas  | Padrão de auditoria, mas a correção é conteúdo da task           | Capturado em 9.3                                       |

#### Ações fora do fluxo de especificação

- Adicionar à memória `user-testable-feedback.md` (ou nova memory): "Em Playtest pós-correção de bug, sempre fazer hard-refresh do browser (Cmd+Shift+R) para evitar cache."
- Memory `rmmz-audio-opcodes.md` já criada — referenciá-la em futuras tasks de áudio.

### 9.5 Matriz de rastreabilidade

| Problema observado                                       | Causa principal                          | Artefato responsável  | Alteração                                  | Prioridade |
| -------------------------------------------------------- | ---------------------------------------- | --------------------- | ------------------------------------------ | ---------- |
| Patch H usou opcode 246 como Play ME                     | Opcode invertido na spec                 | Tasks (2.2)           | Substituir espec + exigir verif em fonte   | Alta       |
| Audits H/I baseadas no mesmo opcode errado               | Mesma inversão                           | Tasks (2.3)           | Atualizar audits p/ code 249 + semântica   | Alta       |
| Premissa "pré-Fase 2 era silêncio" não validada          | Falta de Playtest/log                    | Análise técnica       | Adicionar "estado observável atual"        | Média      |
| Plano não tem passo pré-fase de verificação de opcodes   | Estratégia faltante                      | Plano                 | Adicionar pré-requisito cross-fase         | Alta       |
| Cache do browser mascara correção                        | Ambiente operacional                     | Fora do escopo        | Memory/instrução Playtest                  | Baixa      |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Adicionar seção "RMMZ opcode dictionary (verificado em `Jhonny/js/rmmz_objects.js`)" com tabela opcode→handler→params, conforme §9.1.

#### Patch sugerido para o plano de implementação

Adicionar "Pré-requisito cross-fase — Verificação de opcodes RMMZ" a `tasks.md`, conforme §9.2.

#### Patch sugerido para as tasks desta fase

- `task-2.2.md`: substituir §"Current audio command" + §"Patch H" conforme §9.3.
- `task-2.3.md`: substituir Audit H e Audit I conforme §9.3.

#### Ações fora do fluxo de especificação

- Atualizar memory `user-testable-feedback.md` para incluir recomendação de hard-refresh.
- Memory `rmmz-audio-opcodes.md` já criada — referenciar em futuras tasks.

## 10. Checklist operacional (próxima execução)

1. [ ] Antes de escrever patch RMMZ: `grep commandNNN rmmz_objects.js` para cada opcode.
2. [ ] Audits validam tipo do param vs handler (não só opcode).
3. [ ] Dump do CE alvo pós-fase-anterior antes de planejar mutações.
4. [ ] Generator idempotente: roda 2x, segunda run skipa tudo, `git diff` vazio.
5. [ ] `python3 -m json.tool` valida JSON após cada mutação.
6. [ ] Indent dentro de IF/ELSE é parent + 1 (memory `rpg-mz-indent-skipbranch`).
7. [ ] Pré-Playtest: listar o que cada path deve produzir (visual/áudio).
8. [ ] Playtest exige hard-refresh do browser para evitar cache JSON.
9. [ ] Memory `rmmz-audio-opcodes` consultada para qualquer patch de áudio.
10. [ ] Commits só quando usuário explicitamente solicitar.
