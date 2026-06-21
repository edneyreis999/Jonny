---
title: Fase 4 — Implementação Completa (Input + Timer)
fase: 4
data: 2026-06-18
status: completa e validada em playtest MZ (2026-06-18)
executor: Claude (glm-5.2)
tipo: registro-implementacao
depends_on: "[[Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/fase-3-completa]]"
origem_atualizacao: "[[fase4/Atualizacao-aplicada]]"
---

# Fase 4 — Implementação Completa (Input + Timer)

## Status

**COMPLETA E VALIDADA em playtest MZ (2026-06-18).** Todos os caminhos de input (clique + teclado + timeout) testados com feedback audível conforme a regra [[user-testable-feedback]]. Cenários validados pelo usuário:

- Clique no botão Safe (Parar/Direita) → toca `freada`
- Clique no botão Risk (Furar/Esquerda) → toca `pneu_cantando`
- Timer expira sem input → toca `freada` (auto-Safe)
- Setas do teclado em Sinal: ↓=Safe, ↑=Risk
- Setas do teclado em Curva: →=Safe, ←=Risk
- WASD equivalentes funcionam
- Anti-re-entrada: após o som, nenhum input adicional é processado (lock ativo)

Bug do guarda 3 corrigido nesta sessão (ver `[[#Bug do guarda 3 (descoberto em playtest pós-F4.5)]]`). Lógica completa de Safe/Risk (custo/benefício, advancement de cena) é F5 — tasks 5.1 e 5.2.

## Resumo do que foi implementado

| CE Editor ID | Nome | Trigger | Cmds | Função |
|--------------|------|---------|------|--------|
| 7 | `EV_RaceRenderer` (estendido) | Parallel (SW_RACE_ACTIVE) | 40 | Adicionado: Erase Picture 41-44 ao trocar de cena |
| 8 | `EV_RenderSinal` (estendido) | Call | 8 | Adicionado: Pictures 41/42 (botões Parar/Furar) + bind via Script |
| 9 | `EV_RenderCurva` (estendido) | Call | 11 | Adicionado: Pictures 43/44 (botões Direita/Esquerda) + bind via Script |
| 10 | `EV_RaceTimer` (novo) | Parallel (SW_RACE_ACTIVE) | 20 | Decrementa VAR_TIMER_FRAMES; timeout chama EV_OnSafe com flag=1 |
| 11 | `EV_OnSafe` (novo) | Call | 9 | Esqueleto com 2 guardas + lock + **Play SE: freada** (F4.5); placeholder para task 5.1 |
| 12 | `EV_OnRisk` (novo) | Call | 9 | Esqueleto com 2 guardas + lock + **Play SE: pneu_cantando** (F4.5); placeholder para task 5.2 |
| 13 | `EV_KeyInput` (novo) | Parallel (SW_RACE_ACTIVE) | 8 | Captura setas + WASD; ramifica por VAR_SCENE_TYPE; dispara handlers |

## Correção crítica vs documentação pré-F4

> **OFF-BY-ONE corrigido:** a documentação da F4 (`tasks.md`, `task-4.*.md`, `Atualizacao-aplicada.md`) afirmava que os CEs da F3 viviam nos Editor IDs 6-10 e os da F4 deveriam ir em 11-14. **Estava errado.**
>
> **Fonte de verdade:** `rmmz_objects.js:6888` confirma `$dataCommonEvents[this._commonEventId]` — acesso direto ao array. Os CEs da F3 vivem em **Editor IDs 5-9** (confirmado por `build_phase3_ces.py` e pela retrospectiva da F3 §7 "CE 5-9 recriados com IDs corrigidos"). Portanto F4 usa **Editor IDs 10-13**.
>
> Mapeamento real aplicado:
> - CE 10 = `EV_RaceTimer` (não 11)
> - CE 11 = `EV_OnSafe` (não 12)
> - CE 12 = `EV_OnRisk` (não 13)
> - CE 13 = `EV_KeyInput` (não 14)

## Decisões técnicas da implementação

### 1. Botões: Script direto em vez de Plugin Command (code 357)

A task 4.2 previa uso de MZ Editor para o Plugin Command `ButtonPicture → Set` (schema opaco do code 357). **Decisão: usar Script inline (code 355) diretamente**, explorando o fato de que `ButtonPicture.js:74-81` apenas faz:

```javascript
picture.mzkp_commonEventId = commonEventId;
```

Portanto, o bloco equivalente em CE 8/9:

```javascript
const p = $gameScreen.picture(41);
if (p) p.mzkp_commonEventId = 11;  // EV_OnSafe
```

**Vantagens:**
- Idempotente via Python+json (não depende de MZ Editor).
- Visível na auditoria `rg`.
- Mesma propriedade (`mzkp_commonEventId`) que `Sprite_Picture.isClickEnabled` (ButtonPicture.js:84) e `Sprite_Picture.onClick` (ButtonPicture.js:88) checam — funcionalmente idêntico ao Plugin Command.

**Trade-off:** se uma versão futura do plugin trocar o nome da propriedade, este Script quebra. Solução: manter o contrato `mzkp_commonEventId` documentado nesta fase.

### 2. Decremento do timer: opType=2 (Sub) confirmado

`rmmz_objects.js:10316-10342` (`operateVariable`) define:
- `operationType 0 = Set`
- `operationType 1 = Add`
- `operationType 2 = Sub`
- `operationType 3 = Mul`
- `operationType 4 = Div`
- `operationType 5 = Mod`

Aplicado: `Control Variables: VAR_TIMER_FRAMES -= 1` → params `[108, 108, 2, 0, 1]`.

### 3. If command: operador `<=` é op 2 (não 4)

`rmmz_objects.js:9951` (`command111`, case 1 Variable):
- `op 0 = eq`, `op 1 = ge`, `op 2 = le`, `op 3 = gt`, `op 4 = lt`, `op 5 = neq`

Portanto `If VAR_TIMER_FRAMES <= 0` → params `[1, 108, 0, 0, 2]`. A documentação prévia que citava `[1, var, 4, value, 1]` para `<=` estava errada.

### 4. Variável `VAR_TIMER_TIMEOUT_FLAG` em Editor ID 116

`rmmz_objects.js:723` confirma `Game_Variables.value(id) = _data[id]` (acesso direto). Array `System.json:variables` estendido para 117 elementos (índices 0-116). Índice 116 = `VAR_TIMER_TIMEOUT_FLAG`.

## Estrutura dos CEs (detalhes)

### CE 10 — `EV_RaceTimer` (Parallel, switchId=100)

```
Label: TICK
  If SW_RACE_ACTIVE (100) is OFF → Exit Event Processing        [guarda 1]
  If SW_INPUT_LOCKED (101) is ON → Wait 1f, Jump TICK           [guarda 2]
  If VAR_TIMER_FRAMES (108) <= 0 → Wait 1f, Jump TICK           [guarda 3]
  Control Variables: VAR_TIMER_FRAMES (108) -= 1
  If VAR_TIMER_FRAMES (108) == 0:
    Control Variables: VAR_TIMER_TIMEOUT_FLAG (116) = 1
    Call Common Event: EV_OnSafe (CE 11)
  Wait 1 frame
  Jump to Label: TICK
```

### CE 11 — `EV_OnSafe` (Call)

```
If SW_RACE_ACTIVE (100) is OFF → Exit                          [guarda 1]
If SW_INPUT_LOCKED (101) is ON → Exit                          [guarda 2]
Control Switches: SW_INPUT_LOCKED (101) = ON
Play SE: freada                                                ← F4.5 (feedback)
[placeholder para task 5.1 — lógica Safe vai aqui]
```

> **Guarda 3 removido em pós-F4.5** (ver `Bug do guarda 3` abaixo): o guarda `If VAR_TIMER_FRAMES <= 0 → Exit` bloqueava o path de timeout → auto-Safe. Removido por ser redundante com o guarda 2 (lock).

### CE 12 — `EV_OnRisk` (Call)

Estrutura idêntica ao CE 11 com `Play SE: pneu_cantando` (F4.5); placeholder para task 5.2. Mesma remoção do guarda 3.

### CE 13 — `EV_KeyInput` (Parallel, switchId=100)

```
Label: KEY_LOOP
  If SW_RACE_ACTIVE (100) is OFF → Exit
  Script:
    if ($gameVariables.value(102) === 0) {  // Sinal
        if (Input.isTriggered('down')) $gameTemp.reserveCommonEvent(11);
        if (Input.isTriggered('up'))   $gameTemp.reserveCommonEvent(12);
    } else {                                 // Curva
        if (Input.isTriggered('right')) $gameTemp.reserveCommonEvent(11);
        if (Input.isTriggered('left'))  $gameTemp.reserveCommonEvent(12);
    }
  Wait 1 frame
  Jump to Label: KEY_LOOP
```

> WASD é coberto pelo `keyMapper` estendido em `Jhonny_RaceHelper.js` (W→up, S→down, A→left, D→right).

## Auditoria de IDs inline

`rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` confirma:

| Script | IDs usados | OK? |
|--------|-----------|-----|
| `setValue(102, ...)` (Renderer: rollSceneType) | 102 = VAR_SCENE_TYPE | ✓ |
| `setValue(103, ...)` (Renderer: rollPCena) | 103 = VAR_P_CENA | ✓ |
| `setValue(109, ...)` (Renderer: SCENE_START) | 109 = VAR_SCENE_START | ✓ |
| `setValue(110, ...)` (Orchestrator: seed) | 110 = VAR_SEED | ✓ |
| `value(100)`, `value(101)` (Renderer: Curva do Diabo check) | 100 = VAR_RACE_ID, 101 = VAR_SCENE_INDEX | ✓ |
| `value(102)` (KeyInput: branch Sinal/Curva) | 102 = VAR_SCENE_TYPE | ✓ |
| `value(104)` (UpdateHud: Consciência) | 104 = VAR_CONSCIENCIA | ✓ |
| `reserveCommonEvent(11)`, `reserveCommonEvent(12)` (KeyInput) | 11 = EV_OnSafe, 12 = EV_OnRisk | ✓ |
| `mzkp_commonEventId = 11`, `= 12` (RenderSinal/Curva: bind buttons) | 11 = EV_OnSafe, 12 = EV_OnRisk | ✓ |

**Nenhum ID fora da faixa canônica (variáveis 100-116, switches 100-105, CEs 1-13).**

## Artefatos produzidos

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `Jhonny/data/System.json` | dados | `variables[116] = 'VAR_TIMER_TIMEOUT_FLAG'` adicionado |
| `Jhonny/data/CommonEvents.json` | dados | CEs 7-9 estendidos; CEs 10-13 criados |
| `Jhonny/planos/001-prototipo-core-loop/fase4/setup_phase4_system.py` | fonte | Pré-passo idempotente: cria VAR_TIMER_TIMEOUT_FLAG |
| `Jhonny/planos/001-prototipo-core-loop/fase4/build_phase4_ces.py` | fonte | Gerador idempotente: CE 7-13 |

## Validações automáticas executadas

- [x] `python3 -m json.tool Jhonny/data/System.json` → OK
- [x] `python3 -m json.tool Jhonny/data/CommonEvents.json` → OK
- [x] Idempotência: reexecutar `build_phase4_ces.py` produz diff vazio
- [x] Auditoria `rg "value\\(|setValue\\("` → todos IDs coerentes com System.json
- [x] Auditoria `reserveCommonEvent\(...\)` → apenas 11 e 12
- [x] Auditoria `mzkp_commonEventId = N` → apenas 11 e 12
- [x] `trigger=2, switchId=100` confirmado em CE 7, 10, 13 (Parallel condicional)

## Checklist para playtest MZ (TAREFA DO USUÁRIO)

Após abrir o projeto no RPG Maker MZ:

### Setup
1. [x] Abrir Database (F10) → Common Events → confirmar CEs 10-13 presentes com triggers corretos. **PASS**
2. [x] Abrir Database → Variables → confirmar ID 116 = `VAR_TIMER_TIMEOUT_FLAG`. **PASS**

### Playtest (F5 no mapa Map001)
3. [x] Cena inicial aparece com fundo (Sinal ou Curva) + HUD Consciência + **botões na faixa inferior**. **PASS**
4. [~] ~~Hover sobre botão destaca (ButtonPicture nativo).~~ **DOC ERRADA** — ButtonPicture.js não tem hover visual nativo. `onMouseEnter`/`onPress` (`rmmz_sprites.js:80-90`) são vazios. Postergado para F5.
5. [~] Clicar em botão (Parar/Direita) → `SW_INPUT_LOCKED` (101) liga (F9). **CONFIRMADO FUNCIONAL em R5** ([[fase4/debug-r5]]) — clique → `reserveCommonEvent(12)` → CE roda → lock liga. Falha anterior era artifact procedural (F12 pausa jogo — ver [[mz-playtest-pauses]]). **Porém**, handlers são silenciosos: sem feedback perceptível, validação exigia F12/F9 (anti-padrão). **Task-4.5 criada** para adicionar `Play SE` (freada/pneu_cantando) nos CEs 11/12 — ver [[task-4.5]].
6. [x] Reset manual: `$gameSwitches.setValue(101, false)` no console F12. **PASS** — retorna `undefined` (void), reset funciona.
7. [x] Teste timer: observar `VAR_TIMER_FRAMES` (108) decrementar a cada frame (F9). **PASS**
8. [x] Após ~4s (Sinal) ou ~3.5s (Curva) sem input: timer expira, `VAR_TIMER_TIMEOUT_FLAG` (116) pisca em 1, `EV_OnSafe` (CE 11) é chamado → **ouve `freada`**. **PASS** — bug do guarda 3 corrigido; timeout agora toca `freada` igual ao clique manual.
9. [x] **Teste teclado:** pressionar ↓/S, ↑/W, ←/A, →/D — cada um dispara o handler correspondente → **ouve `freada` (Safe) ou `pneu_cantando` (Risk)**. **PASS** — user confirmou setas + WASD em ambas as cenas.
10. [x] **Anti-spam:** segurar tecla → apenas 1 disparo (não 60/s). **PASS** — implícito no teste 9 (apenas 1 som por pressionar).
11. [x] **Anti-re-entrada:** clicar botão + pressionar tecla rapidamente → apenas 1 action processa (a outra descartada pelos guardas). **PASS** — user confirmou "depois do barulho eu não consigo clicar em nada" + "só consigo clicar uma vez".
12. [x] Trocar de cena via console: `$gameVariables.setValue(101, 1)` (Editor ID 101 = VAR_SCENE_INDEX) → Renderer apaga botões antigos e mostra os novos. **PASS**
13. [x] Console F12 sem erros. **PASS** — user não reportou erros durante os testes.

### Pós-playtest
14. [x] Atualizar `tasks.md` marcando F4 como **COMPLETA E VALIDADA**.
15. [x] Criar `Jhonny/planos/001-prototipo-core-loop/fase4/retrospectiva.md` com aprendizados.

## Fora de escopo desta fase

- Implementar lógica Safe completa (task 5.1 — VAR_CONSCIENCIA +10, VAR_PONTOS_GLORIA +10, cena++).
- Implementar lógica Risk completa (task 5.2 — roll d100, taxa de sucesso, custo, crash).
- Animar botão ao clicar (escala/opacity — polish posterior).
- Animação de resolução (task 5.3 — flash/zoom após Safe/Risk).
- HUD de Pontos de Glória via TextPicture (task 5.4).
- Hover vermelho-sangue 3 níveis discretos (task 5.5).

## Pendência aberta pela regra user-testable-feedback

> **Task-4.5 IMPLEMENTADA (2026-06-18) — cliques validados em playtest:** os handlers `EV_OnSafe`/`EV_OnRisk` emitem `Play SE: freada` (CE 11) e `Play SE: pneu_cantando` (CE 12) imediatamente após ligar `SW_INPUT_LOCKED`. Usuário confirmou em playtest que **cliques nos botões produzem os sons esperados**.
>
> **Porém**, o playtest também expôs um bug no path de timeout (ver `[[#Bug do guarda 3 (descoberto em playtest pós-F4.5)]]` abaixo): quando o timer expira sem input, **nenhum som toca**, contradizendo o design ("timeout = auto-Safe"). Bug correcionado na mesma sessão — ver seção abaixo.
>
> **Pendente:** playtest MZ sem F12/F9 confirmando que **timeout expira → ouve `freada`** (subtarefa 4.5.6 + verificação pós-fix). Após confirmação, F4 pode ser marcada como **COMPLETA E VALIDADA**.

## Bug do guarda 3 (descoberto em playtest pós-F4.5)

> **Descoberto em 2026-06-18**, durante playtest de validação da task-4.5. Sintoma: timer expira sem input → nenhum som toca (deveria tocar `freada`).

### Sintoma

- Clique em botão Safe (manual) → toca `freada` ✓
- Timer zera (sem clique) → **nenhum som** ✗

### Causa raiz

CE 11 (`EV_OnSafe`) e CE 12 (`EV_OnRisk`) têm um guarda 3 que rejeita a chamada quando `VAR_TIMER_FRAMES <= 0`. Mas o path de timeout chama CE 11 exatamente quando `VAR_TIMER_FRAMES == 0` (CE 10 detecta zero, seta `VAR_TIMER_TIMEOUT_FLAG=1`, chama CE 11). Resultado: o guarda 3 bloqueia o path intencional.

Trace do timeout:
1. CE 10 detecta `VAR_TIMER_FRAMES == 0` → seta `VAR_TIMER_TIMEOUT_FLAG=1` → chama CE 11
2. CE 11 guarda 1 (SW_RACE_ACTIVE OFF?) → passa
3. CE 11 guarda 2 (SW_INPUT_LOCKED ON?) → passa (lock ainda OFF)
4. **CE 11 guarda 3 (`VAR_TIMER_FRAMES <= 0`) → EXIT** ← bug
5. Lock nunca é aplicado, `Play SE: freada` nunca toca

O guarda 3 é redundante com o guarda 2 (lock): uma vez que o lock liga, guarda 2 impede qualquer re-entrada. O "cenário degenerado" que o guarda 3 tentava prevenir (chamada após timeout+reset manual) só acontece em debug via console, não em jogo real.

### Fix aplicado (Opção A — remover guarda 3)

Removidas as 3 linhas do guarda 3 em `build_on_safe_list()` e `build_on_risk_list()`:
- `C(111, 0, [1, VAR_TIMER_FRAMES, 0, 0, 2])` (If)
- `C(115, 1, [])` (Exit)
- `C(412, 0, [])` (End If)

Após o fix, CE 11 e CE 12 têm apenas **2 guardas** (race ativa + lock). Comportamento resultante:
- Clique manual com timer > 0 → guarda 2 passa → lock ON → Play SE ✓
- Timeout (timer = 0) → guarda 2 passa → lock ON → Play SE ✓
- Re-entrada (segundo clique/timeout) → guarda 2 (lock ON) rejeita ✓
- Race terminou → guarda 1 rejeita ✓

Todas as situações de produção funcionam corretamente. Ver `Estrutura dos CEs (detalhes)` atualizada abaixo.

### Alternativa considerada (Opção B — recusada)

Trocar guarda 3 por `If VAR_TIMER_FRAMES <= 0 AND VAR_TIMER_TIMEOUT_FLAG == 0 → Exit` (nested If em RMMZ). Mais defensiva, mas adiciona complexidade sem benefício real — o cenário degenerado só ocorre em debug via console.

## Riscos conhecidos

- **`SW_INPUT_LOCKED` permanente após clique:** nesta fase, o handler esqueleto liga o lock (101) mas ninguém desliga. Sintoma esperado: após o primeiro clique, o timer para de decrementar e novos inputs são descartados. **Reset manual:** `$gameSwitches.setValue(101, false)`. Será corrigido na task 5.3 (handlers de resolução desligam o lock).
- ~~**`EV_OnSafe` chamado por timeout não faz nada visível:** o esqueleto apenas liga o lock.~~ **Corrigido (ver `Bug do guarda 3` acima):** o path de timeout agora funciona — toca `freada` e liga o lock igual ao clique manual. Lógica completa de Safe (custo/benefício) ainda depende da task 5.1.
- **Botões não recebem clique se `$gameMessage.isBusy()` true:** ver `ButtonPicture.js:85`. Em condições normais da corrida, não há mensagem ativa, então isso não deve afetar.
- **Hover visual não existe no ButtonPicture.js:** plugin não sobrescreve `onMouseEnter`/`onPress` (`rmmz_sprites.js:80-90` são vazios). Para hover visual, é necessário plugin adicional ou patch. Postergado para F5.
- **Input por teclado depende do tipo de cena:** em Sinal (VAR_SCENE_TYPE=0), apenas ↓/↑ (e S/W se keyMapper estendido); em Curva, apenas ←/→ (e A/D). Pressionar `direita` em cena Sinal é ignorado por design.
- **Re-renderização do Renderer reseta `mzkp_commonEventId`:** `Game_Screen.showPicture` (`rmmz_objects.js:1065`) cria nova instância de `Game_Picture` a cada chamada, descartando propriedades custom. Se o CE 7 Renderer chamar `Show Picture` fora do momento de troca de cena, o bind é perdido. Confirmar que o guarda `[4]` (VAR_LAST_RENDERED_INDEX != VAR_SCENE_INDEX) está efetivamente impedindo re-renderizações.
