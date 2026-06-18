---
status: complete
---

<task_context>
<domain>engine/infra/common-event</domain>
<type>implementation</type>
<scope>performance</scope>
<complexity>low</complexity>
<dependencies>task-2.1</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 2.3: Criar `EV_Preload` (Show+Erase Sequencial)

## Referências de Origem

- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §8.3 Performance considerations (linhas 936-949), §3.2 (linhas 386-405)

## Visão Geral

Criar um Common Event (`EV_Preload`) que força o `ImageManager.loadPicture` a cachear todas as texturas do minigame **antes** do gameplay começar. Sem pré-carregamento, o primeiro `Show Picture` de cada asset causa hitch (stutter) no QTE.

<requirements>
- Common Event `EV_Preload` criado com trigger "Call".
- Executa `Show Picture` + `Wait 1 frame` + `Erase Picture` para cada picture criada na task 2.1.
- Pode ser chamado via `Call Common Event: EV_Preload` no `EV_RaceOrchestrator` (task 3.1).
- Duração total: ~15 frames (0.25s) — imperceptível ao jogador.
</requirements>

## Subtarefas

- [x] 2.3.1 Criar/editar Common Event em `Jhonny/data/CommonEvents.json`
- [x] 2.3.2 Criar novo Common Event nomeado `EV_Preload` com trigger "Call"
- [x] 2.3.3 Para cada picture, adicionar 3 comandos: `Show Picture`, `Wait 1 frame`, `Erase Picture`
- [x] 2.3.4 Salvar o projeto
- [x] 2.3.5 Testar `EV_Preload` em Playtest no RPG Maker MZ

> **Nota de implementação (2026-06-18):** `EV_Preload` foi criado no Common Event ID 3 diretamente em `CommonEvents.json`, com 48 comandos úteis (16 pictures x Show/Wait/Erase) mais o terminador. Validado em Playtest no RPG Maker MZ.

## Detalhes de Implementação

### Por que pré-carregar?

`Show Picture` com imagem nova dispara `ImageManager.loadPicture` (`rmmz_sprites.js:2972-2974`), que é **assíncrono** — pede a textura ao PixiJS loader. Se a textura não está em cache, há hitch (stutter de 1-3 frames) durante o load. Em QTE com timer de 3.5s, qualquer hitch é perceptível.

Pré-carregar força todas as texturas para o cache PixiJS antes do gameplay. Depois, quando `EV_RaceRenderer` fizer `Show Picture` na hora, a textura já está em RAM — sem hitch.

### Estrutura do Common Event

```
# EV_Preload (Trigger: Call)
# Pré-carrega todas as pictures do minigame para evitar hitch durante QTE

# Backgrounds
Show Picture: 1, "race/bg_sinal", Upper Left, (0, 0), 100%, 100%, 255, Normal
Wait 1 frame
Erase Picture: 1

Show Picture: 1, "race/bg_curva", Upper Left, (0, 0), 100%, 100%, 255, Normal
Wait 1 frame
Erase Picture: 1

# Botões
Show Picture: 1, "race/btn_parar", Upper Left, (0, 0), 100%, 100%, 255, Normal
Wait 1 frame
Erase Picture: 1

# ... repetir para todas as 15 pictures:
# btn_furar, btn_direita, btn_esquerda,
# bar_consciencia_bg, bar_consciencia_fill,
# opala_pov, timer_bar, curva_do_diabo_placa,
# overlay_risk_low, overlay_risk_med, overlay_risk_high
```

> **Importante:** usar sempre o mesmo Picture ID (ex.: 1) e apagar com `Erase Picture` a cada iteração. Assim você não "gasta" IDs do `picturesUpperLimit = 100`. Não usar IDs 20+ para evitar conflito com IDs reservados do HUD/botões (ver Guia §4.1).

### Onde chamar

O `EV_Preload` deve ser chamado:
1. **No `EV_RaceOrchestrator`** (task 3.1) — no bloco INIT, **antes** do fadein.
2. (Opcional) **No `Scene_Boot`** — para caches persistentes entre corridas. Para gamejam, chamar no Orchestrator é suficiente.

### Erro comum a evitar

- **Não use `Erase Picture` sem `Wait 1 frame`** — sem o wait, o MZ pode otimizar e skipar o load real (textura nunca chega ao cache). O `Wait 1 frame` força o PixiJS a processar o load.
- **Não faça loop com variável** — MZ CE não suporta iterar array de strings; listar os 15 `Show Picture` explicitamente é mais claro.
- **Não chame em Parallel CE** — `EV_Preload` é síncrono (trigger: Call); chamar em paralelo pode causar condição de corrida com o Orchestrator.

## visual_validation

Ao concluir esta task:
1. No MZ Editor, Database → Common Events → `EV_Preload` deve aparecer na lista.
2. Abra o conteúdo — deve mostrar 45 comandos (3 comandos × 15 pictures).
3. Para testar isoladamente, crie um evento temporário em qualquer mapa com:
   ```
   Call Common Event: EV_Preload
   Show Picture: 1, "race/bg_sinal", Upper Left, (0, 0), 100%, 100%, 255, Normal
   ```
4. Rodar Playtest e ativar o evento — o `bg_sinal` aparece **imediatamente** (sem hitch) após a chamada do `EV_Preload`.

## Critérios de Sucesso

- [x] Common Event `EV_Preload` existe com trigger "Call".
- [x] 16 pictures são carregadas e apagadas em sequência.
- [x] Duração total ~16 frames (0.27s).
- [x] Após chamar `EV_Preload`, `Show Picture` subsequente não causa hitch.
- [x] Picture ID usado durante o preload (ex.: 1) fica livre após o preload (todas apagadas).

## Fora de Escopo

- Chamar `EV_Preload` no fluxo de jogo (feito na task 3.1 `EV_RaceOrchestrator`).
- Pré-carregar SEs/BGM (MZ faz isso automaticamente; não é necessário para audio).
- Criar versões otimizadas (ex.: preload paralelo com multi-threading) — MZ não suporta.
