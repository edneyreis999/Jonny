---
status: implemented-pending-playtest
---

<task_context>
<domain>engine/gameplay/renderer</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>task-3.1</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 3.2: Criar `EV_RaceRenderer` (Parallel, Detecção de Cena)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §3 (Anatomia de uma Cena), §6 (Geração Procedural)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §1.1 (linhas 46-95), §5.1 (linhas 626-690)

## Visão Geral

Criar o Common Event `EV_RaceRenderer` com trigger "Parallel" e condition switch `SW_RACE_ACTIVE`. Ele é o **loop de renderização principal** — detecta quando `VAR_SCENE_INDEX` muda, faz o sorteio procedural da nova cena (tipo Sinal/Curva e `VAR_P_CENA`), chama `EV_RenderSinal` ou `EV_RenderCurva`, e configura o timer inicial.

<requirements>
- Common Event `EV_RaceRenderer` criado com trigger "Parallel" e condition `SW_RACE_ACTIVE`.
- Loop com `Label + Jump to Label` terminando obrigatoriamente em `Wait 1 frame`.
- Detecta mudança de `VAR_SCENE_INDEX` comparando com uma variável auxiliar `VAR_LAST_RENDERED_INDEX`.
- Sorteia `VAR_SCENE_TYPE` e `VAR_P_CENA` lazy (somente quando a cena muda).
- Trata caso especial da Curva do Diabo (Corrida 3, cena 9).
- Chama `EV_RenderSinal` ou `EV_RenderCurva` conforme o tipo.
- Configura `VAR_TIMER_FRAMES` (240 para Sinal, 210 para Curva).
- Executa setup de 18 frames (0.3s) com `SW_INPUT_LOCKED = ON`.
</requirements>

## Subtarefas

- [ ] 3.2.1 **(Python+json em `System.json`)** Nomear variável ID 114 = `VAR_LAST_RENDERED_INDEX`. Atualmente está vazia — único ajuste de Database da Fase 3.
- [ ] 3.2.2 **(JSON-automatizável com cautela)** Criar Common Event `EV_RaceRenderer` com `trigger: 2` (Parallel) e `switchId: 101` (condition `SW_RACE_ACTIVE`)
- [ ] 3.2.3 Implementar loop com Label (`118`) + Jump to Label (`119`) terminando em `Wait 1 frame` (`230`)
- [ ] 3.2.4 Implementar detecção de mudança de cena via If (`111`) comparando `VAR_SCENE_INDEX` com `VAR_LAST_RENDERED_INDEX`
- [ ] 3.2.5 Implementar tratamento da Curva do Diabo (Corrida 3, cena N-1) — If com duas condições AND
- [ ] 3.2.6 Implementar sorteio procedural via Script (`355`) chamando `JhonnyRace.rollSceneType()`, `JhonnyRace.rollPCena()`
- [ ] 3.2.7 Chamar `EV_RenderSinal` ou `EV_RenderCurva` conforme `VAR_SCENE_TYPE` — código `117`
- [ ] 3.2.8 Configurar `VAR_TIMER_FRAMES` e `VAR_SCENE_START` (via `Graphics.frameCount`)
- [ ] 3.2.9 Implementar setup 18 frames com `SW_INPUT_LOCKED = ON` → `Wait 18 frames` → `OFF`
- [ ] 3.2.10 Validar JSON com `python -m json.tool`
- [ ] 3.2.11 **MZ Editor obrigatório:** abrir o CE no Database e confirmar que:
  - `Trigger: Parallel` está selecionado
  - `Condition: Switch` aponta para `SW_RACE_ACTIVE` (ID 101)
  - Estrutura de indent (If/Else/End) está correta no editor
- [ ] 3.2.12 Playtest MZ obrigatório: rodar sem travamento (spin infinito)

## Automação via JSON (alta complexidade — validar MZ obrigatório)

> **Aprendizado [[fase2/retrospectiva]]:** Common Events SIMPLES são seguros via JSON. Este CE usa `Parallel trigger` + `Label/Jump loop` + `Script` inline — **três fatores de risco** que tornam a validação MZ Editor obrigatória, não opcional.

### Pré-condições para automação
- [x] Slot vazio confirmado (CE ID 5+)
- [x] Variável 114 nomeada como `VAR_LAST_RENDERED_INDEX`
- [ ] Plugin `Jhonny_RaceHelper.js` com funções `JhonnyRace.rollSceneType()` e `JhonnyRace.rollPCena()` expostas (dependência indireta da task 1.2 — confirmar antes de automatizar)
- [ ] Validação obrigatória: `python -m json.tool`
- [ ] **Validação obrigatória: MZ Editor abrir o CE sem erro** (Parallel + condition string podem ter formato específico)
- [ ] **Validação obrigatória: Playtest MZ sem spin/travamento** (loops Label/Jump malformados travam a engine)

### Campos JSON específicos do Parallel trigger

```json
{
  "id": 6,
  "list": [...],
  "name": "EV_RaceRenderer",
  "trigger": 2,            // 2 = Parallel (0=Call, 1=Auto, 2=Parallel, 3=Autorun... ajustar conforme MZ)
  "switchId": 101,         // Condition switch = SW_RACE_ACTIVE
  "autoErase": false,
  "conditionString": ""
}
```

> **Atenção:** `trigger: 2` é o código do MZ para Parallel. **Confirmar abrindo um CE Parallel existente no projeto Jhonny para validar o campo** (ex.: abrir `EV_Preload` e um CE parallel nativo para comparação). Se houver divergência, criar no MZ Editor manualmente.

### Mapeamento de comandos adicionais (além da task 3.1)

| Comando MZ | code | parameters (exemplo) |
|------------|------|---------------------|
| `Label: NAME` | `118` | `["RENDER_LOOP"]` |
| `Jump to Label: NAME` | `119` | `["RENDER_LOOP"]` |
| `Exit Event Processing` | `115` | `[]` |
| `Wait N frames` | `230` | `[18]` |
| `Erase Picture: ID` | `235` | `[10]` (apaga picture 10) |
| `If VAR_A != VAR_B` | `111` | `[12, VAR_A_ID, 1, VAR_B_ID, 1]` (type=var, src=variable, value=ID, op=neq) |
| `If VAR_A == N And VAR_B == M` | `111` | `[12, VAR_A_ID, 0, N, 0, 1, 12, VAR_B_ID, 0, M, 0]` (compound) |

### Risco: loop Label/Jump malformado

Se o `Wait 1 frame` (`230` com `parameters: [1]`) for esquecido, ou se o `Jump to Label` estiver posicionado errado, **a engine trava em spin infinito dentro de um único frame** (Game_Interpreter.update é cooperativo, não preemptivo).

**Validação recomendada antes de Playtest completo:**
1. Abrir CE no MZ Editor
2. Confirmar visualmente que o `Wait 1 frame` está dentro do loop principal
3. Confirmar que `Jump to Label: RENDER_LOOP` está após o `Wait 1 frame`
4. Confirmar que o `Exit Event Processing` (`115`) está no `If SW_RACE_ACTIVE == OFF`

### Snippet Python — esqueleto (complete com os comandos If/Else)

```python
import json, pathlib
ce_path = pathlib.Path("Jhonny/data/CommonEvents.json")
ces = json.loads(ce_path.read_text())

renderer_list = [
    # Label: RENDER_LOOP
    {"code": 118, "indent": 0, "parameters": ["RENDER_LOOP"]},
    # If SW_RACE_ACTIVE == OFF → Exit
    {"code": 111, "indent": 0, "parameters": [1, 101, 0]},  # type=1 switch, switchId=101, value=OFF
    {"code": 115, "indent": 1, "parameters": []},            # Exit Event Processing
    {"code": 412, "indent": 0, "parameters": []},            # End
    # If VAR_SCENE_INDEX != VAR_LAST_RENDERED_INDEX
    {"code": 111, "indent": 0, "parameters": [12, 102, 1, 114, 1]},  # var != var
    # ... (complete com o corpo do if — Erase/Sorteio/Render/Timer/Lock)
    {"code": 412, "indent": 0, "parameters": []},            # End
    # Wait 1 frame + Jump
    {"code": 230, "indent": 0, "parameters": [1]},
    {"code": 119, "indent": 0, "parameters": ["RENDER_LOOP"]},
    # End of list
    {"code": 0, "indent": 0, "parameters": []}
]

ces.append({
  "id": len(ces),
  "list": renderer_list,
  "name": "EV_RaceRenderer",
  "trigger": 2,
  "switchId": 101,
  "autoErase": false,
  "conditionString": ""
})

ce_path.write_text(json.dumps(ces, indent=4, ensure_ascii=False))
```

## Detalhes de Implementação

### Estrutura do Common Event

```
# EV_RaceRenderer (Trigger: Parallel, Condition: SW_RACE_ACTIVE == ON)
# Único escritor de: VAR_P_CENA, VAR_SCENE_TYPE, VAR_LAST_RENDERED_INDEX,
#                   VAR_TIMER_FRAMES (no setup), VAR_SCENE_START, SW_IS_CURVA_DIABO

Label: RENDER_LOOP
  If SW_RACE_ACTIVE == OFF
    Exit Event Processing
  End

  # === Detecta mudança de cena (evita re-renderizar a mesma cena a cada tick) ===
  If VAR_SCENE_INDEX != VAR_LAST_RENDERED_INDEX

    Control Variables: VAR_LAST_RENDERED_INDEX = VAR_SCENE_INDEX

    # === Limpa pictures da cena anterior (mantém HUD 20-29, botões em fade separado) ===
    Erase Picture: 10
    Erase Picture: 11
    # Opala (10), sinal/placa (11) — preserva HUD Consciência (20-21) e timer (22)

    # === Determina tipo da cena ===
    If VAR_RACE_ID == 3 And VAR_SCENE_INDEX == VAR_RACE_N_CENAS - 1
      # Curva do Diabo (última cena da corrida 3)
      Control Variables: VAR_SCENE_TYPE = 2
      Control Variables: VAR_P_CENA = 100
      Control Switches: SW_IS_CURVA_DIABO = ON
    Else
      # Sorteio procedural (60% SINAL, 40% CURVA; P_Cena U{0,10,...,100})
      Script: $gameVariables.setValue(103, JhonnyRace.rollSceneType())
      Script: $gameVariables.setValue(104, JhonnyRace.rollPCena())
      Control Switches: SW_IS_CURVA_DIABO = OFF
    End

    # === Renderiza cena conforme tipo ===
    If VAR_SCENE_TYPE == 0
      Call Common Event: EV_RenderSinal
    Else
      Call Common Event: EV_RenderCurva
    End

    # === Inicia timer da cena ===
    If VAR_SCENE_TYPE == 0
      Control Variables: VAR_TIMER_FRAMES = 240   # 4.0s (Sinal)
    Else
      Control Variables: VAR_TIMER_FRAMES = 210   # 3.5s (Curva)
    End

    # === Salva frame inicial para barra sub-frame ===
    Script: $gameVariables.setValue(110, Graphics.frameCount)
    # VAR_SCENE_START — usado para animar barra de timer com precisão de frame

    # === Setup 0.3s com input locked (spec §3 fase 1) ===
    Control Switches: SW_INPUT_LOCKED = ON
    Wait 18 frames   # 0.3s
    Control Switches: SW_INPUT_LOCKED = OFF

  End

  Wait 1 frame
  Jump to Label: RENDER_LOOP
```

### Por que `Label + Jump to Label` com `Wait 1 frame`?

Em CE paralelo, esse padrão é **canônico em RPG Maker MZ** para loops. O `Wait 1 frame` no final é **obrigatório** — sem ele, o CE entra em spin infinito dentro de um único frame e trava a engine (`Game_Interpreter.update` é cooperativo, não preemptivo).

### Por que detectar mudança com variável auxiliar?

Sem o `VAR_LAST_RENDERED_INDEX`, o CE re-renderizaria a cena a cada frame (60x por segundo), causando:
1. Hitch visual (pictures piscando).
2. Re-sorteio de `VAR_P_CENA` a cada frame (cena nunca tem `P_CENA` estável).
3. Overhead de CPU.

A comparação garante que a renderização só acontece quando `VAR_SCENE_INDEX` muda — exatamente uma vez por cena.

### Sorteio lazy (não pré-compor)

Spec §6.1 mostra pseudo-código de loop pré-compõe cenas. Em eventos MZ, **não faça isso** (Guia §5.1):
- MZ não tem array em eventos.
- Sorteio é idempotente no setter.
- Debug mais fácil (ver `VAR_P_CENA = 70` é imediato).

### Timer em frames, não segundos

| Cena    | Segundos | Frames (60fps) |
|---------|----------|----------------|
| Sinal   | 4.0s     | 240            |
| Curva   | 3.5s     | 210            |

Não usar `Wait 4.0s` — acumula drift de arredondamento. Usar `VAR_TIMER_FRAMES = 240` + `EV_RaceTimer` (task 4.1) decrementando por frame.

### Erro comum a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Esquecer `Wait 1 frame` no final | Engine trava (spin infinito) | Sempre terminar loop com `Wait 1 frame` |
| Detectar cena via `If VAR_TIMER_FRAMES == 240` | Conflito com timer; re-renderiza em loops | Usar `VAR_LAST_RENDERED_INDEX` |
| Sortear `VAR_P_CENA` fora do if de mudança | Cena tem `P_CENA` diferente a cada frame | Sorteio só dentro do `If VAR_SCENE_INDEX != VAR_LAST_RENDERED_INDEX` |
| Usar `Call Event` em vez de `Call Common Event` | Não funciona entre Common Events | Sempre `Call Common Event: NOME` |
| Esquecer de tratar Curva do Diabo | Sorteio aleatório substitui o clímax fixo | Condição especial antes do sorteio |

## visual_validation

Ao concluir esta task (com 3.3 também pronto):
1. No Map001, ative o event autorun que chama `EV_RaceOrchestrator`.
2. Após o fadein (0.3s), a cena 1 aparece renderizada (fundo de Sinal OU Curva, aleatório).
3. Pressione F9 → `VAR_SCENE_INDEX = 0`, `VAR_LAST_RENDERED_INDEX = 0`.
4. F9 → `VAR_SCENE_TYPE = 0 ou 1` (sorteado), `VAR_P_CENA = múltiplo de 10`.
5. F9 → `VAR_TIMER_FRAMES = 240 (Sinal) ou 210 (Curva)`.
6. F9 → `VAR_SCENE_START = número grande` (frameCount atual).
7. Aguardar 4s (Sinal) ou 3.5s (Curva) — timer expira, mas sem handler ainda nada acontece (task 4.1). Cena não muda sozinha.
8. Console (F12) sem erros.
9. Para testar troca de cena manualmente: `$gameVariables.setValue(102, 1)` no console — deve re-renderizar cena 2 no próximo frame.

## Critérios de Sucesso

- [ ] `EV_RaceRenderer` existe com trigger "Parallel" e condition `SW_RACE_ACTIVE`.
- [ ] Loop com Label + Jump to Label, terminando em `Wait 1 frame`.
- [ ] Detecção de mudança de cena via `VAR_LAST_RENDERED_INDEX`.
- [ ] Tratamento da Curva do Diabo (Corrida 3, cena N-1) antes do sorteio.
- [ ] Sorteio lazy via `JhonnyRace.rollSceneType()` e `JhonnyRace.rollPCena()`.
- [ ] `VAR_TIMER_FRAMES` configurado conforme `VAR_SCENE_TYPE`.
- [ ] Setup de 18 frames com `SW_INPUT_LOCKED`.
- [ ] Respeita contrato de escrita única (não escreve em `VAR_CONSCIENCIA` ou `VAR_PONTOS_GLORIA`).
- [ ] Engine não trava (spin infinito evitado).
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Implementar `EV_RenderSinal` e `EV_RenderCurva` (feito na task 3.3).
- Implementar o timer que decrementa `VAR_TIMER_FRAMES` (feito na task 4.1).
- Implementar handlers de input (feito na task 4.3).
- Implementar HUD de Consciência (feito na task 3.4).
- Sortear a sequência inteira de cenas em array (anti-pattern — sorteio lazy é o correto).
