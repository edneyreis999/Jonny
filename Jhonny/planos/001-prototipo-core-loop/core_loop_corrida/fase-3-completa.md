---
title: "Fase 3 Implementada — Orchestrator + Renderizacao Estatica"
type: registro-conclusao
fase: 3
status: implementada-pending-playtest
data_implementacao: "2026-06-18"
validacao: "JSON valido em todos os arquivos; Playtest MZ pendente (depende de acao do usuario)"
---

# Fase 3 Implementada — Orchestrator + Renderizacao Estatica

## Resultado

A Fase 3 foi implementada em 2026-06-18. **Status: implementada, aguardando Playtest MZ para validacao visual.**

- `task-3.1`: `EV_RaceOrchestrator` criado no CE ID 5.
- `task-3.2`: `EV_RaceRenderer` criado no CE ID 7 (Parallel, condition `SW_RACE_ACTIVE`).
- `task-3.3`: `EV_RenderSinal` (CE ID 8) e `EV_RenderCurva` (CE ID 9) criados.
- `task-3.4`: HUD de Consciencia integrada ao Orchestrator (Pictures 20/21). `EV_UpdateHud` criado no CE ID 6.
- `task-3.5`: Event autorun `Init Corrida` adicionado em Map001.

## Pre-passos aplicados

1. **`System.json`**:
   - Variavel ID 114 nomeada como `VAR_LAST_RENDERED_INDEX` (subtarefa 3.2.1).
   - `startMapId` alterado de `4` (Mapa-fase2, legado da F2) para `1` (Map001 — entry point limpo da F3).

2. **Map004 permanece intocado**: o evento `Init` existente la eh artefato da F2 (chamava `EV_Preload` para pre-aquecer pictures). Nao interfere na F3 porque `startMapId` agora aponta para Map001.

## Mudancas concretas

### `Jhonny/data/System.json`

| Campo            | Antes                       | Depois                                |
| ---------------- | --------------------------- | ------------------------------------- |
| `variables[113]` | `""`                        | `"VAR_LAST_RENDERED_INDEX"` (ID 114)  |
| `startMapId`     | `4`                         | `1`                                   |

### `Jhonny/data/CommonEvents.json`

CEs novos (slots 5-9). Slots 0-4 preservados (null, acelerador, freio, EV_Preload, buffer vazio).

| ID | Name                  | Trigger    | Switch | Comandos | Responsabilidade                                    |
| -- | --------------------- | ---------- | ------ | -------- | --------------------------------------------------- |
| 5  | `EV_RaceOrchestrator` | Call (0)   | 1      | 24       | INIT block + composicao corrida + HUD setup + fade  |
| 6  | `EV_UpdateHud`        | Call (0)   | 1      | 2        | Animar `scaleX` da barra de Consciencia (6 frames)  |
| 7  | `EV_RaceRenderer`     | Parallel(2)| 101    | 36       | Detectar mudanca de cena + sortear + renderizar     |
| 8  | `EV_RenderSinal`      | Call (0)   | 1      | 4        | Pictures: bg_sinal + opala_pov + sinal_red          |
| 9  | `EV_RenderCurva`      | Call (0)   | 1      | 7        | Pictures: bg_curva + opala_pov + placa + If Curva do Diabo |

### `Jhonny/data/Map001.json`

- Adicionado `events: [null, Init Corrida]` (antes era array vazio).
- Evento `Init Corrida`:
  - `x=8 y=6` (alinhado com `startX/startY` canonico do projeto).
  - `trigger: 3` (Autorun).
  - Lista: `Control Variables VAR_RACE_ID = 1` -> `Call Common Event: EV_RaceOrchestrator (5)`.

## Correcoes em relacao ao spec original das tasks

Lendo `js/rmmz_objects.js` notei que os exemplos JSON em `task-3.1.md` e `task-3.2.md` tinham formatos errados para o If (code 111). Corrigi na implementacao:

| Exemplo da task                 | Estava                  | Correto                    | Razao                                            |
| ------------------------------- | ----------------------- | -------------------------- | ------------------------------------------------ |
| `If SW_RACE_ACTIVE == OFF`      | `[1, 101, 0]`           | `[0, 101, 1]`              | type 0=switch (1=variable), value 1=is-OFF       |
| `If VAR_RACE_ID == 1`           | `[12, 101, 0, 1, 0]`    | `[1, 101, 0, 1, 0]`        | type 12=Script (nao variable); type 1=variable   |
| `Fadein Screen 18f` (code 222)  | `[18, false]`           | ignorado nesta versao MZ   | `command222` sempre usa `fadeSpeed()=24` frames  |

Para a transicao preto -> visivel em 18 frames (spec F3), substitui o `Fadein Screen` por dois `Tint Screen`:
- `Tint [-255,-255,-255,0], 0 frames` -> escurece instantaneo
- `Tint [0,0,0,0], 18 frames` -> clareia em 0.3s

Para o If composto (Curva do Diabo = corrida 3 AND cena 9), MZ nao suporta AND nativo em um unico If. Usei `Script` (case 12) que avalia `eval`:
```
If Script("$gameVariables.value(101) === 3 && $gameVariables.value(102) === 9")
```

Hardcoded `9` (nao `VAR_RACE_N_CENAS - 1`) porque MZ If nao suporta aritmetica no RHS, e corrida 3 tem sempre 10 cenas com indices 0-9.

## Inicializacao extra (alem do spec)

No INIT do Orchestrator, adicionei uma linha nao descrita nas tasks:
```
Control Variables: VAR_LAST_RENDERED_INDEX = -1
```
Motivo: no primeiro tick do `EV_RaceRenderer`, `VAR_SCENE_INDEX` ainda e `0`. Sem forcar `VAR_LAST_RENDERED_INDEX = -1`, a comparacao `SCENE_INDEX != LAST` seria `0 != 0` = false, e a cena 1 nunca seria renderizada. Com `-1`, a primeira deteccao dispara corretamente.

## Validacao automatica concluida

- `python3 -m json.tool` em todos os JSONs editados: **OK**.
- `Jhonny_RaceHelper.js` ja possui `JhonnyRace.rollSceneType()` e `JhonnyRace.rollPCena()` (validado na F1).
- Map001 event autorun referencia CE ID 5 (que existe).
- Orchestrator referencia CE ID 3 (EV_Preload), CE IDs 8/9 (Render*). Renderer referencia CE IDs 8/9. Todas as referencias cruzadas batem.
- Indentacao If/Else/End consistente em CE 5 (composicao corrida) e CE 7 (loop + Ifs aninhados).
- `Wait 1 frame` presente antes do `Jump to Label` no Renderer (anti-spin).

## Playtest MZ pendente (acao do usuario)

Para validar visualmente, abrir o projeto no RPG Maker MZ e rodar Playtest:

1. **Mapa inicial:** Map001 deve carregar (System.json `startMapId = 1`).
2. **Fadein:** tela escurece e volta em ~0.3s (Tint preto -> Tint normal em 18 frames).
3. **Cena 1 renderizada:** aparece bg_sinal OU bg_curva (aleatorio 60/40), mais opala_pov e o sinal/placa correspondente.
4. **HUD:** barra de Consciencia vazia visivel no topo (Picture 20 com fill 21 em `scaleX = 0%`).
5. **F9 (debug) deve mostrar:**
   - Variables: `VAR_RACE_ID = 1`, `VAR_RACE_N_CENAS = 6`, `VAR_SCENE_INDEX = 0`, `VAR_LAST_RENDERED_INDEX = 0`, `VAR_SCENE_TYPE = 0 ou 1`, `VAR_P_CENA = multiplo de 10`, `VAR_TIMER_FRAMES = 240 ou 210`, `VAR_ATTEMPT_N = 1`, `VAR_SEED = numero grande`.
   - Switches: `SW_RACE_ACTIVE = ON`, `SW_INPUT_LOCKED = OFF` (apos os 18 frames de setup).
6. **F12 (console) sem erros.**
7. **Teste manual de troca de cena:** no console, rodar `$gameVariables.setValue(102, 1)` -> o Renderer deve re-renderizar a cena 2 no proximo frame (fundo troca, sorteio novo).

### Riscos conhecidos a observar no playtest

- **Parallel trigger:** se houver algum problema na sintaxe do `trigger: 2` ou `switchId: 101`, o CE pode nao disparar ou disparar errado. Confirmar abrindo o CE no Database do MZ (F10) -> aba Common Events -> `EV_RaceRenderer` -> campos "Trigger: Parallel" e "Condition: SW_RACE_ACTIVE" devem estar preenchidos.
- **Spin infinito:** se o `Wait 1 frame` estiver mal posicionado, a engine trava. Confirmar visualmente no editor MZ que o `Wait 1 frame` esta dentro do loop, antes do `Jump to Label: RENDER_LOOP`.
- **Curva do Diabo:** para testar manualmente, rodar no console:
  ```js
  $gameVariables.setValue(101, 3);  // VAR_RACE_ID = 3
  $gameVariables.setValue(102, 9);  // VAR_SCENE_INDEX = 9
  // proximo frame: o Renderer deve usar VAR_SCENE_TYPE=2, VAR_P_CENA=100, SW_IS_CURVA_DIABO=ON
  ```

## Fora de escopo desta fase (continua pendente)

- Botões clicaveis e handler de input (Fase 4).
- Logica de Safe/Risk e HUD de Pontos de Gloria (Fase 5).
- Crash, Restart e Curva do Diabo visual (Fase 6).
- Audio feedback e logger estruturado (Fase 7).

## Artefato de build

O script Python que gerou os CEs 5-9 esta em:
`Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/build_phase3_ces.py`

Idempotente (preserva slots 0-4 e recria 5-9 a cada run). Pode ser re-executado se houver need de ajuste.
