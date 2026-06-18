---
status: pending
---

<task_context>
<domain>engine/gameplay/timer</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-3.2</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 4.1: Criar `EV_RaceTimer` (Parallel, Tick por Frame, 3 Guardas)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §3 (Anatomia de uma Cena — fase 2 Janela input)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §2.3 (linhas 248-299), §2.4 (linhas 301-325)
- Retrospectiva Fase 3: [[fase3/retrospectiva]] (fonte de verdade sobre convenção de IDs)

## Visão Geral

Criar o Common Event `EV_RaceTimer` no **CE Editor ID 11** com trigger "Parallel" e condition `SW_RACE_ACTIVE` (Editor ID **100**). Ele é o **único escritor de `VAR_TIMER_FRAMES`** (com exceção do Renderer no setup). A cada tick (1 frame), decrementa `VAR_TIMER_FRAMES`. Quando chega a 0, dispara timeout → ação safe automática.

> **Convenção de IDs (aprendizado F3 — não usar 101+):** RMMZ acessa `_data[id]` diretamente (`rmmz_objects.js:691, 723`), então o índice do array em `System.json` é igual ao Editor ID. Os nomes vivem em Editor IDs 100-113 (variáveis) e 100-105 (switches).

<requirements>
- Pré-passo executado: variável `VAR_TIMER_TIMEOUT_FLAG` (Editor ID 116) criada em `System.json`.
- Common Event `EV_RaceTimer` criado no CE Editor ID 11 com trigger "Parallel" e `switchId: 100` (`SW_RACE_ACTIVE`).
- Loop com `Label + Jump to Label` terminando obrigatoriamente em `Wait 1 frame`.
- 3 guardas no início: `SW_RACE_ACTIVE` (100) `== OFF` → exit, `SW_INPUT_LOCKED` (101) `== ON` → skip tick, `VAR_TIMER_FRAMES` (108) `<= 0` → exit (já expirou).
- Decrementa `VAR_TIMER_FRAMES` (108) por 1 a cada frame.
- Quando `VAR_TIMER_FRAMES` (108) `== 0`, chama `EV_OnSafe` (CE Editor ID 12) com `VAR_TIMER_TIMEOUT_FLAG` (116) `= 1`.
- Não escreve em `VAR_CONSCIENCIA` (104) (escritor único são os handlers).
</requirements>

## Subtarefas

- [ ] 4.1.0 **Pré-passo:** Criar variável `VAR_TIMER_TIMEOUT_FLAG` (Editor ID 116) em `System.json` via Python+json
- [ ] 4.1.1 Confirmar snapshot de IDs: imprimir `variables[95:117]` e `switches[95:107]` de `System.json`
- [ ] 4.1.2 **Criar o script gerador** `Jhonny/planos/001-prototipo-core-loop/fase4/build_phase4_ces.py` (usar `fase3/build_phase3_ces.py` como referência de estrutura: helper `C(code, indent, params)`, constantes de IDs, modo idempotente preservando slots 0-10 de `CommonEvents.json`)
- [ ] 4.1.3 Implementar no script o Common Event `EV_RaceTimer` no CE Editor ID 11 com trigger "Parallel" e `switchId: 100`
- [ ] 4.1.4 Implementar no script o loop com Label + Jump to Label
- [ ] 4.1.5 Implementar no script os 3 guardas no início (usando Editor IDs 100, 101, 108)
- [ ] 4.1.6 Implementar no script o decremento de `VAR_TIMER_FRAMES` (108)
- [ ] 4.1.7 Implementar no script a detecção de timeout e chamada de `EV_OnSafe` (CE 12) com flag (116) = 1
- [ ] 4.1.8 Executar o script para gravar CE 11 em `Jhonny/data/CommonEvents.json`
- [ ] 4.1.9 **Auditar scripts inline:** rodar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` e confirmar IDs
- [ ] 4.1.10 Validar JSON com `python3 -m json.tool`
- [ ] 4.1.11 Salvar o projeto e solicitar playtest MZ ao usuário

## Detalhes de Implementação

### Script gerador `fase4/build_phase4_ces.py` (artefato-fonte)

Toda a task é implementada em **Python** no script `Jhonny/planos/001-prototipo-core-loop/fase4/build_phase4_ces.py`. Este script é **artefato-fonte** — o JSON de `CommonEvents.json` é saída gerada, não editável à mão.

Estrutura mínima (espelhar `fase3/build_phase3_ces.py`):

```python
"""
Fase 4 — Cria os Common Events de Timer e Handlers do core loop da Corrida.

Cria (incrementalmente em 4.1, 4.3, 4.4):
  CE ID 11: EV_RaceTimer   (trigger Parallel, switchId 100)  [task 4.1]
  CE ID 12: EV_OnSafe      (trigger Call)                     [task 4.3]
  CE ID 13: EV_OnRisk      (trigger Call)                     [task 4.3]
  CE ID 14: EV_KeyInput    (trigger Parallel, switchId 100)  [task 4.4]

Idempotente: preserva slots 0-10 (CEs F1/F2/F3). Em 4.1, apenas CE 11 é emitido.
"""
import json, pathlib

CE_PATH = pathlib.Path("Jhonny/data/CommonEvents.json")
ces = json.loads(CE_PATH.read_text())

KEEP = 11  # slots 0-10 são CANÔNICOS: null, acelerador, freio, EV_Preload, buffer, Orchestrator, UpdateHud, Renderer, RenderSinal, RenderCurva
# ... asserts de sanity-check dos slots 1-10 ...
ces = ces[:KEEP]  # descarta CEs F4 anteriores se houver

def C(code, indent, parameters=None):
    return {"code": code, "indent": indent, "parameters": parameters or []}

# Constantes MZ (mesma convenção da F3)
SW_RACE_ACTIVE = 100
SW_INPUT_LOCKED = 101
VAR_TIMER_FRAMES = 108
VAR_TIMER_TIMEOUT_FLAG = 116
CE_ON_SAFE = 12

# === CE 11: EV_RaceTimer ===
race_timer = {
    "id": 11,
    "list": [
        # ... comandos conforme pseudocódigo abaixo ...
    ],
    "name": "EV_RaceTimer",
    "switchId": SW_RACE_ACTIVE,
    "trigger": 2,  # 2 = Parallel
}
ces.append(race_timer)

CE_PATH.write_text(json.dumps(ces, indent=4, ensure_ascii=False))
```

**Pós-condições do script em 4.1:**
- Roda sem erros (`python3 Jhonny/planos/001-prototipo-core-loop/fase4/build_phase4_ces.py`)
- Sanity-check de slots 1-10 ainda passa (não corrompe CEs F1/F2/F3)
- `CommonEvents.json` tem 12 entradas (0-11) ao final

> **Por que artefato-fonte?** Tasks 4.3 e 4.4 vão **estender** este mesmo script adicionando CEs 12/13/14. Se o JSON fosse editado diretamente, qualquer regeneração perderia o trabalho. O script permite corrigir IDs/comandos em um só lugar e reemitir o JSON (heurística consolidada em `tasks.md` §Aprendizados).

### Estrutura do Common Event

```
# EV_RaceTimer (CE Editor ID 11)
# Trigger: Parallel, Condition: SW_RACE_ACTIVE (Editor ID 100) == ON
# Único escritor de: VAR_TIMER_FRAMES (108) — decremento contínuo
# Único escritor de: VAR_TIMER_TIMEOUT_FLAG (116) — set 1 no timeout

Label: TICK
  # Guarda 1: fora de corrida (VN ativa, menu, etc.)
  If SW_RACE_ACTIVE (100) == OFF
    Exit Event Processing
  End

  # Guarda 2: input locked (durante setup 0.3s ou resolução 0.4s) — pausa o timer
  If SW_INPUT_LOCKED (101) == ON
    Wait 1 frame
    Jump to Label: TICK
  End

  # Guarda 3: já expirou (não tem o que fazer)
  If VAR_TIMER_FRAMES (108) <= 0
    Wait 1 frame
    Jump to Label: TICK
  End

  # Decremento
  Control Variables: VAR_TIMER_FRAMES (108) -= 1

  # Detecção de timeout
  If VAR_TIMER_FRAMES (108) == 0
    # Timeout → ação safe automática (spec §4 e §5)
    Control Variables: VAR_TIMER_TIMEOUT_FLAG (116) = 1
    Call Common Event: EV_OnSafe (CE Editor ID 12)
    # EV_OnSafe (task 5.1) lê VAR_TIMER_TIMEOUT_FLAG (116) e reseta para 0
  End

  Wait 1 frame
  Jump to Label: TICK
```

### Formato JSON canônico do comando If (code 111)

Conforme descoberto na F3 (ver `fase-3-completa.md`), o MZ usa:
- `[0, switchId, 0]` para `If Switch == ON` (type 0 = switch, value 0 = is-ON)
- `[0, switchId, 1]` para `If Switch == OFF` (type 0 = switch, value 1 = is-OFF)
- `[1, variableId, 0, value, 0]` para `If Variable == value` (type 1 = variable, op 0 = eq)
- `[1, variableId, 4, value, 1]` para `If Variable <= value` (op 4 = lte)

**Não** usar `[1, sw, 0]` para switch (formato inválido).

### Por que `Wait 1 frame` no final?

Em CE paralelo, o `Wait 1 frame` é **obrigatório** para liberar o interpreter deste CE para o próximo tick do frame. Sem ele:
- O CE spin dentro de um único frame → engine trava.
- Ou pior: o decremento acontece infinitamente em 1 frame → `VAR_TIMER_FRAMES` vai para -∞ instantaneamente.

### Respeitando o contrato de escrita única

| Variável (Editor ID)        | Único escritor                                              |
| --------------------------- | ----------------------------------------------------------- |
| `VAR_TIMER_FRAMES` (108)    | `EV_RaceTimer` (decremento) + `EV_RaceRenderer` (reset no setup) |
| `VAR_TIMER_TIMEOUT_FLAG` (116) | `EV_RaceTimer` (set 1) + `EV_OnSafe` (reset 0 na task 5.1) |

> O Renderer (task 3.2, CE 8) seta `VAR_TIMER_FRAMES = 240` ou `210` no setup da cena. O Timer só decrementa. Sem Race Condition.

### Por que 3 guardas?

1. **`SW_RACE_ACTIVE` (100) `== OFF`**: previne execução durante VN ou menu (timer para de correr).
2. **`SW_INPUT_LOCKED` (101) `== ON`**: pausa timer durante setup (0.3s) e resolução (0.4s) — sensação de "tempo congelado" durante animação.
3. **`VAR_TIMER_FRAMES` (108) `<= 0`**: evita underflow (timer já expirou, handler ainda não resetou).

Sem guarda 2, o timer continuaria correndo durante a animação de resolução, fazendo o jogador perder tempo da próxima cena. Sem guarda 3, `VAR_TIMER_FRAMES` iria para negativo entre o timeout e o reset.

### Por que não usar `Game_Timer` nativo?

`Game_Timer` (`rmmz_objects.js:425-466`) é o timer do HUD do jogador. Problemas:
- **`onExpire` chama `BattleManager.abort()`** (`rmmz_objects.js:464-466`) — hardcoded para combate.
- **É singleton global** (`$gameTimer`) — não suporta múltiplos timers concorrentes.
- **Resolução em frames**, mas a UI dele é em segundos.

Para QTE com timer de 3.5s precisão sub-segundo, `VAR_TIMER_FRAMES` + CE paralelo é o padrão correto.

### Pré-passo: criar `VAR_TIMER_TIMEOUT_FLAG` (Editor ID 116)

Snippet Python+json para o pré-passo:

```python
import json
path = 'Jhonny/data/System.json'
with open(path) as f:
    s = json.load(f)
# Expandir array se necessário
while len(s['variables']) < 117:
    s['variables'].append('')
# Nomear ID 116 (índice 116)
s['variables'][116] = 'VAR_TIMER_TIMEOUT_FLAG'
with open(path, 'w') as f:
    json.dump(s, f, indent=4, ensure_ascii=False)
print(f"OK: variables[116] = {s['variables'][116]!r}")
```

> **Atenção:** por causa do acesso direto `_data[id]`, o Editor ID 116 corresponde ao índice 116 do array (não 115). RMMZ reserva `_data[0]` como placeholder não-usado.

### Erro comum a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| **Usar IDs 101+ (convenção pré-F3)** | Comandos MZ referenciam variáveis erradas — comportamento indefinido | Usar IDs 100-113 (vars) e 100-105 (switches) |
| **Usar formato `[1, sw, 0]` para If Switch** | If inválido no MZ — ramificação nunca executa ou sempre executa | Usar `[0, sw, 1]` para `== OFF` e `[0, sw, 0]` para `== ON` |
| Esquecer `Wait 1 frame` no final | Engine trava | Sempre terminar loop com `Wait 1 frame` |
| Esquecer guarda `SW_INPUT_LOCKED` | Timer corre durante animação; jogador perde tempo | Sempre checar `SW_INPUT_LOCKED` (101) antes de decrementar |
| Usar `Wait 0.1s` em vez de `Wait 1 frame` | Drift de 16% por tick (Guia §8.2 #5) | Sempre `Wait 1 frame` |
| Decrementar com `Math.max(0, ...)` via Script | Verboso; MZ `Control Variables` já suporta `-= 1` com floor | Usar command nativo |
| Resetar `VAR_TIMER_FRAMES` aqui | Conflito com Renderer (escritor único) | Timer só decrementa; Renderer reseta no setup |
| Esquecer auditoria `rg "value\\(|setValue\\("` | Scripts inline podem usar IDs errados sem serem percebidos | Sempre rodar antes de fechar a task |
| Usar `Call Common Event` síncrono para o handler | Bloqueia o tick do timer | Para timeout, `Call Common Event` é OK (handler é rápido); o lock é responsabilidade dos guards no handler |

## visual_validation

Ao concluir esta task (com 4.3 e 5.1 prontos para o handler de timeout):
1. No Map001, ative o event autorun.
2. Após o fadein, a cena 1 aparece com timer de 240 frames (Sinal) ou 210 (Curva).
3. Pressione F9 continuamente — observe `VAR_TIMER_FRAMES` (Editor ID 108) diminuindo a cada frame (ex.: 240 → 239 → 238 → ...).
4. Não clicar em nada — após 4.0s (Sinal) ou 3.5s (Curva), o timer expira:
   - `VAR_TIMER_FRAMES` (108) `= 0`.
   - `VAR_TIMER_TIMEOUT_FLAG` (116) `= 1` momentaneamente.
   - `EV_OnSafe` (CE 12) é chamado (ainda sem implementação completa na task 5.1, mas o chamado acontece).
5. Console (F12) sem erros.

## Critérios de Sucesso

- [ ] `VAR_TIMER_TIMEOUT_FLAG` (Editor ID 116) criada em `System.json`.
- [ ] `EV_RaceTimer` existe no CE Editor ID 11 com trigger "Parallel" e `switchId: 100`.
- [ ] Loop com Label + Jump to Label, terminando em `Wait 1 frame`.
- [ ] 3 guardas implementados corretamente usando Editor IDs 100/101/108.
- [ ] `VAR_TIMER_FRAMES` (108) decrementa por 1 a cada frame.
- [ ] Timeout dispara `EV_OnSafe` (CE 12) com `VAR_TIMER_TIMEOUT_FLAG` (116) `= 1`.
- [ ] Respeita contrato de escrita única (não escreve em `VAR_CONSCIENCIA` (104) ou `VAR_PONTOS_GLORIA` (105)).
- [ ] Engine não trava (spin infinito evitado).
- [ ] `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` mostra IDs coerentes.
- [ ] `python3 -m json.tool Jhonny/data/CommonEvents.json` OK.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Implementar `EV_OnSafe` completo (feito na task 5.1).
- Animar barra visual de timer (feita por overlay separado com `Move Picture` baseado em `VAR_TIMER_FRAMES` — polish posterior).
- Tocar som de "tick" opcional nos últimos 1.5s (polish posterior; spec §4 menciona como opcional).
- Implementar `Game_Timer` nativo (anti-pattern).
