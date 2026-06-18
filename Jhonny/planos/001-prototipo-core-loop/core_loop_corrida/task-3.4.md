---
status: implemented-pending-playtest
---

<task_context>
<domain>engine/gameplay/hud</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-3.1</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 3.4: Implementar HUD de Consciência (Bar bg + Fill scaleX)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §8 (Feedback Multimodal — "Barra de Consciência é o HUD principal")
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §4.3 (linhas 519-545)

## Visão Geral

Implementar a barra de Consciência — o HUD principal do minigame, sempre visível no topo da tela. Composta por duas pictures:
- **`bar_consciencia_bg`** (Picture ID 20): faixa sépia escura "vazia" (estática).
- **`bar_consciencia_fill`** (Picture ID 21): faixa sépia clara "cheia", redimensionada via `scaleX` dinâmico conforme valor.

Também criar o Common Event `EV_UpdateHud` que atualiza a barra quando `VAR_CONSCIENCIA` muda.

<requirements>
- Pictures 20 e 21 são mostradas no INIT do `EV_RaceOrchestrator`.
- `origin = Upper Left` em ambos (load-bearing para barra encher da esquerda para direita).
- Picture 21 tem `scaleX` dinâmico baseado em `VAR_CONSCIENCIA` (0..100 → 0..100%).
- Animação suave de 6 frames (0.1s) via `Move Picture` com `Slow End` easing.
- Common Event `EV_UpdateHud` criado e chamado pelos handlers (tasks 5.1, 5.2) após mudar `VAR_CONSCIENCIA`.
</requirements>

## Subtarefas

- [ ] 3.4.1 **(JSON-automatizável)** Definir `Show Picture: 20` e `Show Picture: 21` no INIT do `EV_RaceOrchestrator` (task 3.1) — código `231`
- [ ] 3.4.2 **(Python+json em `System.json`)** Nomear variável ID 115 = `VAR_HUD_CONSCIENCIA_DISPLAY` (apenas se for usar interpolação manual; pode ser omitida se usar `Move Picture` direto)
- [ ] 3.4.3 **(JSON-automatizável)** Criar Common Event `EV_UpdateHud` com trigger "Call"
- [ ] 3.4.4 No `EV_UpdateHud`, usar `Script` (`355`) chamando `$gameScreen.picture(21).move(...)` para animar `scaleX` em 6 frames — alternativa mais confiável que `Move Picture` via código `232` com variável
- [ ] 3.4.5 (Opcional) Adicionar texto "CONSCIÊNCIA" ao lado da barra via `TextPicture` (Plugin Command — task 7.2)
- [ ] 3.4.6 Validar JSON com `python -m json.tool`
- [ ] 3.4.7 Playtest MZ obrigatório para confirmar animação suave da barra

## Automação via JSON (setup) + Script (animação)

> **Aprendizado [[fase2/retrospectiva]]:** código `231` (Show Picture) é direto via JSON — mesmo padrão do `EV_Preload`.
>
> **Por que Script em vez de `Move Picture` (232) com variável:** o comando MZ `Move Picture` aceita apenas constantes em `scaleX`/`scaleY` pelo editor visual. Para animar `scaleX` baseado em `VAR_CONSCIENCIA` (variável), o caminho mais fiável é chamar direto o método JS da API (`$gameScreen.picture(ID).move(x, y, scaleX, scaleY, opacity, blendMode, duration)`).

### Estrutura JSON — `EV_UpdateHud`

```python
import json, pathlib
ce_path = pathlib.Path("Jhonny/data/CommonEvents.json")
ces = json.loads(ce_path.read_text())

ces.append({
  "id": len(ces),
  "list": [
    # Script: anima scaleX da Picture 21 em 6 frames
    {"code": 355, "indent": 0, "parameters": [
      "const c = $gameVariables.value(105);"                           # VAR_CONSCIENCIA
      "const p = $gameScreen.picture(21);"
      "p.move(310, 18, c, 100, 255, 0, 6);"                            # x, y, scaleX, scaleY, opacity, blend, duration
    ]},
    {"code": 0, "indent": 0, "parameters": []}
  ],
  "name": "EV_UpdateHud",
  "trigger": 0,
  "switchId": 1,
  "autoErase": false,
  "conditionString": ""
})

ce_path.write_text(json.dumps(ces, indent=4, ensure_ascii=False))
```

> **API de referência (`rmmz_objects.js` `Game_Picture.move`):**
> ```js
> move(x, y, scaleX, scaleY, opacity, blendMode, duration)
> ```
> - `duration` em frames (6 = 0.1s)
> - Easing padrão é linear; para "Slow End" precisaria patch no `Game_Picture` (polish posterior)
> - `scaleX` aceita valor percentual direto (0..100) — não é decimal 0..1

### Setup inicial no `EV_RaceOrchestrator` (task 3.1)

Adicionar os comandos Show Picture ao INIT block do Orchestrator:

```python
# Estes comandos entram no list do EV_RaceOrchestrator
orchestrator_hud_cmds = [
  {"code": 231, "indent": 0, "parameters": [
    20, "race/bar_consciencia_bg", 0, 0, 308, 16, 100, 100, 255, 0
  ]},
  {"code": 231, "indent": 0, "parameters": [
    21, "race/bar_consciencia_fill", 0, 0, 310, 18, 0, 100, 255, 0
    #                                                                  ^ scaleX = 0% (barra vazia no INIT)
  ]}
]
```

> **Ordem de execução F3:** esta task (3.4) deve ser executada **antes** da task 3.1 — assim o Orchestrator já inclui o setup do HUD ao ser gerado. Ver seção "Ordem de Execução Recomendada" em [[tasks.md]].

## Detalhes de Implementação

### Setup inicial (no `EV_RaceOrchestrator`)

Adicionar após o `EV_Preload`:

```
# === HUD de Consciência (permanente durante toda a corrida) ===
Show Picture: 20, "race/bar_consciencia_bg", Upper Left, (308, 16), 100%, 100%, 255, Normal
Show Picture: 21, "race/bar_consciencia_fill", Upper Left, (310, 18), 0%, 100%, 255, Normal
#                                                                       ^^^^
#                                                                  scaleX 0% = barra vazia no início
# (conforme VAR_CONSCIENCIA = 0 no INIT)
```

> **Posicionamento:** `(308, 16)` e `(310, 18)` — offset de 2px em X e Y para o fill ficar "dentro" do bg (borda visual).

### `EV_UpdateHud`

```
# EV_UpdateHud (Trigger: Call)
# Atualiza a barra de Consciência com animação suave

# VAR_CONSCIENCIA já está no range 0..100, então usamos direto como percent de scaleX
Move Picture: 21, Upper Left, (310, 18), VAR_CONSCIENCIA, 100, 255, Normal, 6 frames, Slow End
#                                                   ^^^^^^^^^^^^^^^^
#                                                   scaleX dinâmico (0..100%)
#                                                   6 frames = 0.1s transição suave
#                                                   Slow End = desacelera no fim (easeOut)
```

> **Como funciona:** `Game_Picture.move()` (Guia §4.2, `rmmz_objects.js:1214-1228`) interpola `scaleX` do valor atual até o target em `duration` frames com easing. Como `VAR_CONSCIENCIA` está em 0..100 e `scaleX` aceita percent, o valor serve direto.

### Por que `Upper Left` (origin 0) é load-bearing

`Sprite_Picture.updateOrigin` (`rmmz_sprites.js:2933-2942`) aplica a origem no render:
- `Upper Left` (0): barra "cresce da esquerda para a direita" — efeito esperado.
- `Center` (1): barra encolhe do centro para as bordas — errado para HUD de barra.

### Quem chama `EV_UpdateHud`?

Toda vez que `VAR_CONSCIENCIA` muda:
- **`EV_OnSafe`** (task 5.1) — após `VAR_CONSCIENCIA += 10`.
- **`EV_OnRisk`** (task 5.2) — após `VAR_CONSCIENCIA -= VAR_P_CENA` (tanto sucesso quanto falha).
- **`EV_RaceOrchestrator`** (task 3.1) — após zerar `VAR_CONSCIENCIA` no INIT (para a barra começar em 0).
- **`EV_Crash`** (task 6.1) — durante o hover da barra zerada (0.3s).

### Hover vermelho-sangue (3 níveis discretos)

A task 5.5 implementa os overlays (IDs 22, 23, 24) que destacam a porção a ser consumida no hover do botão Risk. Esta task (3.4) cobre apenas a barra base. Os overlays serão filhos da faixa 20-29.

### Erro comum a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| `origin = Center` | Barra encolhe do centro | Sempre `Upper Left` (origin 0) |
| Atualizar via `Show Picture` (em vez de `Move`) | Sem animação; salta | Sempre `Move Picture` para animar |
| Usar `Wait 6 frames` após Move | Bloqueia o handler por 0.1s | Não esperar — Move é assíncrono (interpola em background) |
| Esquecer de chamar `EV_UpdateHud` após mudar Consciência | Barra não atualiza | Sempre chamar após `Control Variables: VAR_CONSCIENCIA` |
| scaleX 0..1 (decimal) | Barra some | MZ usa 0..100 (percent) — passar `VAR_CONSCIENCIA` direto |

## visual_validation

Ao concluir esta task (com 3.1 pronto):
1. No Map001, ative o event autorun que chama `EV_RaceOrchestrator`.
2. Após o fadein (0.3s), deve ver no **topo da tela** uma barra horizontal:
   - Fundo sépia escuro (Picture 20, `bar_consciencia_bg`).
   - Fill sépia claro com largura 0 (Picture 21, `bar_consciencia_fill` com scaleX 0%).
3. Para testar atualização: `$gameTemp.reserveCommonEvent(ID_EV_UPDATE_HUD)` no console após mudar `$gameVariables.setValue(105, 50)` — barra deve crescer suavemente para 50% em 0.1s.
4. Para testar hover: passar o mouse sobre o futuro botão Risk (ainda não implementado) — sem efeito ainda (task 5.5).

## Critérios de Sucesso

- [ ] Pictures 20 e 21 são mostradas no INIT do Orchestrator.
- [ ] Picture 21 começa com `scaleX = 0%` (barra vazia).
- [ ] `EV_UpdateHud` existe com trigger "Call".
- [ ] `EV_UpdateHud` faz `Move Picture: 21` com scaleX = `VAR_CONSCIENCIA`, 6 frames, Slow End.
- [ ] `origin = Upper Left` em ambos.
- [ ] Posicionamento estável no topo (Y=16-18).
- [ ] Sem hitch visual ao atualizar.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Implementar hover vermelho-sangue (feito na task 5.5).
- Implementar HUD de Pontos de Glória (feito na task 5.4).
- Implementar indicador "TENTATIVA N" (feito na task 7.2).
- Animar com flash discreto quando muda (polish posterior).
