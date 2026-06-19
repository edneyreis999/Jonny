---
title: "Fase 6 — Crash, Restart, Variação de Corridas e Vitória"
description: "Registro de implementação da Fase 6 do core loop da Corrida (RPG Maker MZ)."
tags: [core-loop, corrida, rpg-maker-mz, fase-6, crash, restart, vitoria]
type: fase-completa
data_implementacao: "2026-06-19"
status: "COMPLETA E VALIDADA EM PLAYTEST MZ"
spec_referencia: "[[tasks]]"
---

# Fase 6 — Crash, Restart, Variação de Corridas e Vitória

> **Status:** COMPLETA E VALIDADA EM PLAYTEST MZ pelo usuário (2026-06-19). Todas as tarefas (6.1, 6.3, 6.4) implementadas via script gerador e confirmadas em Playtest. Core loop da corrida fechado: crash → restart <1s; variação 6/8/10 cenas; tela de vitória/derrota com threshold funcional.

## Resumo executivo

A Fase 6 fecha o core loop da corrida: falha no Risk → crash visual → restart <1s; variação de 3 corridas com comprimentos 6/8/10 cenas; tela de vitória/derrota com threshold de pontuação por corrida.

Implementação seguiu a heurística F3+F4+F5 consolidada: **script gerador é artefato-fonte**, JSON nunca é editado diretamente. Os dois artefatos-fonte criados:

- `Jhonny/planos/001-prototipo-core-loop/fase6/setup_phase6_system.py` — adiciona `VAR_VITORIA_PASSOU` (Editor ID 117)
- `Jhonny/planos/001-prototipo-core-loop/fase6/build_phase6_ces.py` — patches CEs 5/7/12 + cria CEs 18/19 + **limpa CE 17** para objeto vazio canônico ([[never-delete-common-events]])

## Pré-passos executados

| Passo | Comando | Resultado |
|-------|---------|-----------|
| Snapshot System.json | `python3 -c "import json; ..."` | Confirmed vars 100-116 + switch 100-105; slot 117 vago |
| Criar VAR_VITORIA_PASSOU | `python3 fase6/setup_phase6_system.py` | var[117] = 'VAR_VITORIA_PASSOU' (array estendido p/ len=118) |
| Criar overlay_flash_white.png | `python3 -c "from PIL import Image; ..."` | 816×624 RGBA branco opaco em `Jhonny/img/pictures/race/` |

## Mudanças aplicadas

### System.json
- **VAR_VITORIA_PASSOU** (Editor ID 117) criado. Resetada em 2 lugares (defensivo, decisão usuário):
  - EV_Crash (CE 18) — task 6.1
  - EV_RaceOrchestrator INIT (CE 5) — task 6.3

### CommonEvents.json (20 slots: 0-19)

| CE | Ação | Detalhe |
|----|------|---------|
| 5 (Orchestrator) | **PATCH** | Inserido `ControlVar VAR_VITORIA_PASSOU=0` no cmd 14 (após If/Else de N_CENAS, antes do script de SEED). |
| 7 (Renderer) | **PATCH** | Inserido check de vitória nos cmds 4-7: `If SCENE_INDEX >= RACE_N_CENAS → Call CE 19 + Exit Event Processing`. Roda a cada frame antes do render-on-change. |
| 12 (OnRisk) | **PATCH** | FAIL branch cmd 31: `Call CE 17` → `Call CE 18`. Comment `[TASK 6.1 PENDENTE]` removido (cmd count 35→34). |
| 17 (EV_ResolucaoRiskFail) | **LIMPO** | Slot limpo para objeto vazio canônico (`{id:17, list:[{code:0,indent:0,parameters:[]}], name:"", switchId:1, trigger:0}`). Absorvido por CE 18 (EV_Crash). **NUNCA deletado** — regra [[never-delete-common-events]]. |
| 18 (EV_Crash) | **NOVO** (26 cmds) | Ver sequência completa abaixo. |
| 19 (EV_VitoriaCorrida) | **NOVO** (40 cmds) | Ver sequência completa abaixo. |

### CE 18 — EV_Crash (sequência ≤60 frames = 1s)

```
0.  Play ME Shock1 {vol 90, pitch 100}             # Buzzer1 não existe; Shock1 = fallback
1.  Shake Screen [power 8, speed 6, 18f, no-wait]
2.  Show Picture 32 race/overlay_flash_white (opacity 255, fullscreen)
3.  Move Picture 32 → opacity 0 over 6f
4.  Tint Screen [-255,-255,-255,0] over 6f
5.  Wait 18f                                        # shake completa, flash apagou, tint escuro
6.  VAR_CONSCIENCIA = 0
7.  VAR_PONTOS_GLORIA = 0
8.  VAR_SCENE_INDEX = 0
9.  VAR_LAST_RENDERED_INDEX = -1                    # força CE 7 a re-renderizar cena 1
10. VAR_TIMER_FRAMES = 240
11. VAR_TAXA_SUCESSO = 0
12. VAR_ROLL_RESULT = 0
13. VAR_VITORIA_PASSOU = 0                          # defensivo (também resetado no INIT Orchestrator)
14. VAR_ATTEMPT_N += 1
15. Script: VAR_SEED = Math.floor(Math.random()*1e9)  # spec §7.3 literalmente
16. ControlSwitch SW_CRASH_FLAG OFF
17. ControlSwitch SW_INPUT_LOCKED OFF               # consumidor de lock (4º — preserva simetria)
18. ControlSwitch SW_LAST_ACTION_SAFE OFF
19. Script: for (i=1..60) $gameScreen.erasePicture(i)
20. Erase Picture 32                                # defensivo (já coberto pelo loop)
21. Tint Screen [0,0,0,0] over 12f
22. Call Common Event 6 (EV_UpdateHud)              # recria HUD zerado
23. Call Common Event 8 (EV_RenderSinal)            # recria cena 1
24. Wait 6f                                         # estabilização
25. End
```

**Total: 18 (shake/flash/tint) + 12 (tint normal) + 6 (stabilization) = 36 frames ≈ 0.6s** ✓ (<1s spec)

**Preservado entre restarts:** `VAR_RACE_ID`, `VAR_RACE_N_CENAS` (spec §7.2).

### CE 19 — EV_VitoriaCorrida

```
0.  Script: erasePicture(1..60)
1.  Fadeout BGM 1s                                  # code 242
2.  Play ME Victory1 {vol 90, pitch 100}
3.  Tint Screen [60, 20, -120, 60] over 12f         # dourado (fallback p/ bg_vitoria ausente)
4.  Comment [F6.4] bg_vitoria.png ausente — fallback Tint dourado acima
5.  Script: threshold check (R1=60, R2=100, R3=150) # seta VAR_VITORIA_PASSOU (deve rodar ANTES do If/Else)
6.  If VAR_VITORIA_PASSOU == 1:
7.    Plugin Cmd TextPicture.set {text: "\C[6]VITÓRIA!"}      # code 357
8.    Plugin Cont "Text = \C[6]VITÓRIA!"                       # code 657
9.    Show Picture 53 "" at (308,200)                          # TextPicture consome texto Set
10. Else:
11.   Plugin Cmd TextPicture.set {text: "\C[18]DERROTA!"}
12.   Plugin Cont "Text = \C[18]DERROTA!"
13.   Show Picture 56 "" at (308,200)
14. End
15. Plugin Cmd TextPicture.set {text: "Pontos de Glória: \V[105]"}
16. Plugin Cont "Text = Pontos de Glória: \V[105]"
17. Show Picture 54 "" at (258,300)
18. Plugin Cmd TextPicture.set {text: "Pressione [Espaço] para continuar"}
19. Plugin Cont "Text = Pressione [Espaço] para continuar"
20. Show Picture 55 "" at (258,360)
21. Label WAIT_INPUT
22. If Script "!Input.isTriggered('ok')": Wait 1f + Jump WAIT_INPUT
23-25. (corpo do If + End)
26-30. Erase Pictures 5, 53, 54, 55, 56
31. Tint Screen [0,0,0,0] over 6f
32. If VAR_VITORIA_PASSOU == 1:
33.   If VAR_RACE_ID < 3:
34.     VAR_RACE_ID += 1
35.     Call CE 5 (Orchestrator — inicia próxima corrida)
36.   Else (RACE_ID == 3):
37.     Comment [F6.4] Tela FIM: bg_fim.png ausente — fallback tela preta + loop
38-41.   Label FIM_LOOP + Wait 1 + Jump FIM_LOOP + End
42. Else (VITORIA_PASSOU == 0):
43.   Call CE 18 (EV_Crash — restart sem avançar)
44. End
```

**Padrão TextPicture (replicado de CE 6 / EV_UpdateHud):**
- `code 357 [pluginName, cmdName, displayName, argsObj]` → Plugin Command "Set TextPicture set"
- `code 657 ["Text = <valor>"]` → Plugin Command continuation (display no MZ Editor)
- `code 231 [picId, "", origin, designation, x, y, scaleX, scaleY, opacity, blendMode]` → Show Picture com `name=""` faz o plugin TextPicture consumir o texto Set anterior (`TextPicture.js:66`)

Escape codes MZ preservados: `\C[n]` (cor), `\V[n]` (variável). TextPicture.js processa todos via `Window_Base.drawTextEx`.

## Auditoria

### Inline scripts (value/setValue)
```
value/setValue IDs usados: 100, 101, 102, 103, 104, 105, 106, 107, 109, 110, 115, 117
```
Todos batem com `System.json` pós-`setup_phase6_system.py`. ✓

### ControlSwitch (121) — semântica 0=ON | 1=OFF
Todas as 16 ocorrências validadas (bug F5 não reintroduzido). ✓

### Simetria de lock (SW_INPUT_LOCKED = SW 101)
- **Produtores ON:** CE 5 cmd 16 (INIT), CE 7 cmd 37 (render block), CE 11 cmd 6 (OnSafe), CE 12 cmd 6 (OnRisk) — **4**
- **Consumidores OFF:** CE 7 cmd 39 (render end), CE 14 cmd 3 (ResolucaoSafe), CE 15 cmd 4 (ResolucaoRiskOK), CE 18 cmd 17 (Crash) — **4** ✓

(CE 17 era o 4º consumidor antes; agora é CE 18 — simetria preservada pela absorção.)

### Idempotência
Re-executar `build_phase6_ces.py` confirma:
- CE 5: "patch VITORIA_PASSOU já presente — skip"
- CE 7: "vitória check já presente — skip"
- CE 12: "Call CE 18 já estava (idempotente) — skip"
- CE 17: "CE 17 já está limpo (objeto vazio) — skip" (permanece no formato canônico vazio — **nunca null**, regra [[never-delete-common-events]])
- CE 18/19: regenerados deterministicamente

## Desvios vs spec do plano

1. **ME de crash:** plano pede `Buzzer1`, mas `Buzzer1.ogg` **não existe** em `Jhonny/audio/me/`. Usado `Shock1` como fallback (harsh, curto, sem melodia — semanticamente o mais próximo). `Buzzer1` reservado para v2.
2. **Cálculo N_CENAS:** plano sugere "Opção B (Script inline)", mas CE 5 já continha If/Else chain (cmds 5-13) fazendo o mesmo — mantida a implementação existente, que é funcionalmente equivalente.
3. **Tela FIM (Corrida 3 vitória):** placeholder Comment + loop Label/Jump infinito. Visual da tela FIM não implementado (precisaria de `race/bg_fim.png`).

## Pendências manuais MZ (obrigatórias antes do Playtest)

> **Heurística F4/F5 (atualizada 2026-06-19):** scripts geradores **conseguem** inserir Plugin Commands TextPicture — o formato JSON é conhecido (code 357 + 657 + Show Picture com `name=""`), validado pelo padrão CE 6 / EV_UpdateHud. Passo 2 abaixo foi automatizado no `build_phase6_ces.py` em 2026-06-19.

### Passo 1 — Refresh runtime do MZ (PENDENTE — usuário)
Após rodar o gerador Python, o `$dataCommonEvents` em runtime pode não refletir o JSON em disco (bug real F4). Para refresh:
1. Abrir o projeto no RPG Maker MZ
2. **F10** (Database) → **Common Events** tab → confirmar CEs 18/19 visíveis (CE 19 agora tem 46 cmds com 4 Plugin Commands TextPicture + If/Else Show Picture)
3. **Ctrl+S** (ou Cmd+S no Mac) para forçar reload
4. Fechar e reabrir Playtest

### Passo 2 — CE 19: TextPicture (CONCLUÍDO 2026-06-19)
Os 9 Comments placeholder `[MANUAL MZ F6.4]` foram substituídos por Plugin Commands reais no `build_phase6_ces.py`. Estrutura final do CE 19 (46 cmds):

- **Threshold script movido ANTES do If/Else** (cmd 5) — corrige ordem: `VAR_VITORIA_PASSOU` precisa ser setada antes do branch.
- **If/Else em cmds 6-14** envolve VITÓRIA vs DERROTA (apenas UM é mostrado, conforme decisão do usuário de usar 2 TextPicture separados em vez de alternar texto da mesma picture).
- **Glória (cmds 15-17) e Instrução (cmds 18-20)** incondicionais.
- **Cores via escape code `\C[n]`**: VITÓRIA=6 (gold), DERROTA=18 (red). Tamanho fica default (user pode ajustar no MZ Editor adicionando `\{` repetidos se desejar).

**Não há mais Comments `[MANUAL MZ F6.4]`** no CE 19 — apenas Comments informativos `[F6.4]` documentando fallbacks (bg_vitoria/bg_fim ausentes).

### Passo 3 — (Opcional) Assets visuais
- `Jhonny/img/pictures/race/bg_vitoria.png` — background tela de vitória (fallback: Tint dourado)
- `Jhonny/img/pictures/race/bg_fim.png` — background tela FIM após Corrida 3 (fallback: tela preta + loop)

Sem esses assets, os fallbacks estão ativos.

## Playtest de aceitação (regra `user-testable-feedback`)

> **Regra:** toda validação deve produzir feedback perceptível sem F12/F9 (debug-only). F12/F9 podem ser usados como confirmação adicional, nunca como validação principal.

| Cenário | Ação | Resultado esperado (perceptível) | Confirmação F9 (debug-only) |
|---------|------|----------------------------------|------------------------------|
| **6.1 Crash** | Clicar Furar com taxa insuficiente → roll falha | <1s: Shake + Flash branco + Tint escuro + ME Shock1 + tela volta com cena 1 | `VAR_ATTEMPT_N` incrementou; `VAR_RACE_ID` preservado; `VAR_SEED` mudou; `VAR_CONSCIENCIA/GLORIA` zerados |
| **6.3 Variação** | Setar `VAR_RACE_ID=1/2/3` via F12 debug antes de iniciar corrida | N_CENAS=6/8/10 (corrida mais longa demora mais para terminar) | `VAR_RACE_N_CENAS` reflete 6/8/10 |
| **6.4 Vitória** | Force `VAR_PONTOS_GLORIA` acima do threshold e terminar corrida | Tela dourada + Victory1 + "VITÓRIA!" visível + press Espaço avança corrida | `VAR_VITORIA_PASSOU=1`, `VAR_RACE_ID` incrementa |
| **6.4 Derrota** | Force `VAR_PONTOS_GLORIA` abaixo do threshold e terminar corrida | Tela dourada + Victory1 + "DERROTA!" visível + press Espaço restart | `VAR_VITORIA_PASSOU=0`, EV_Crash dispara |

## Aprendizados consolidados (adicionar à seção Aprendizados do `tasks.md`)

1. **Verificar existência de asset antes de referenciar:** plano F6 assumia `Buzzer1.ogg` em `audio/me/`, mas não existe. Sempre rodar `ls Jhonny/audio/{me,se,bgm}/ | grep -i <name>` antes de usar. Fallback para asset próximo semanticamente (Shock1 para buzzer).
2. **CE "limpo" (cleaned) ao invés de deletado:** Para "remover" um CE que já está em uso (absorvido por outro), **NUNCA** setar o slot para `null` nem remover do array. Sempre limpar para o objeto vazio canônico (`{id:N, list:[{code:0,indent:0,parameters:[]}], name:"", switchId:1, trigger:0}`) — preserva o `id` para compatibilidade com save files legados e referências indiretas em outros CEs/Maps. Regra consolidada em [[never-delete-common-events]]. Helper `make_empty_ce(ce_id)` no `build_phase6_ces.py` garante formato canônico.
3. **Idempotência via detecção de padrão:** patches em CEs existentes (CE 5, 7, 12) detectam se já foram aplicados procurando por marcadores canônicos (e.g., `setValue(117, 0)` já presente, `Call CE 19` já presente). Evita duplicação em re-runs.
4. **If Script type 12 é portátil:** `If Script "!Input.isTriggered('ok')"` é mais simples que If Button type 11 (que exige conhecer o key code). Validado em `rmmz_objects.js:10062`.

## Referências

- Spec: [[tasks]] §Fase 6
- Aprendizados F1-F5: [[tasks]] §Aprendizados Consolidados
- Regra feedback: [[user-testable-feedback]]
- Bug F4 pós-edição MZ: [[fase-4-completa]]
- Bug F5 ControlSwitch semântica: [[fase5/retrospectiva]]
