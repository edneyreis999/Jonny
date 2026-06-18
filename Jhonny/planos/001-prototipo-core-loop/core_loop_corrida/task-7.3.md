---
status: pending
---

<task_context>
<domain>engine/observability/logging</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-1.2</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 7.3: Adicionar Plugin Command `logRaceEvent` no `Jhonny_RaceHelper.js`

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §11 (observabilidade para playtest/debug)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §Apêndice B (linhas 1142-1170 — "Plugin command para observabilidade (opcional)"), §Apêndice A (linhas 1025-1141 — plugin mínimo `Jhonny_RaceHelper.js`)

## Visão Geral

Estender o plugin `Jhonny_RaceHelper.js` (criado em task-1.2 com Apêndice A) para incluir um **Plugin Command** chamado `logRaceEvent` que registra eventos estruturados do minigame no console (F12) como JSON. Permite:

- **Debug:** ver sequência de ações durante playtest.
- **Balanceamento:** coletar métricas (% sucesso Risk, P_CENA médio, etc.).
- **Replay分析:** (futuro) reconstruir sessão a partir de logs.

Cada log tem formato JSON estruturado: `{type, frame, vars, switches}`.

<requirements>
- Plugin Command `logRaceEvent` registrado no `Jhonny_RaceHelper.js`.
- Aceita parâmetro `type` (string) — ex: "SAFE_CLICK", "RISK_SUCCESS", "CRASH".
- Imprime JSON estruturado no console (F12).
- Inclui: frame atual, todas as variáveis relevantes (101-115), switches (101-106).
- Não bloqueia o frame (síncrono, mas barato — apenas `console.log`).
- Pode ser chamado via Plugin Command no MZ Editor (não apenas via Script inline).
- Logs são identificados com prefixo `RACE_EVENT:` para fácil filtragem no console.
- Não afeta performance em modo normal (logs só em dev/debug).
</requirements>

## Subtarefas

- [ ] 7.3.1 Localizar o arquivo `Jhonny/js/plugins/Jhonny_RaceHelper.js` (criado em task-1.2)
- [ ] 7.3.2 Adicionar bloco `PluginManager.registerCommand` para `logRaceEvent`
- [ ] 7.3.3 Implementar função `_logRaceEvent(args)` que:
  - [ ] Lê `args.type` (string)
  - [ ] Captura `Graphics.frameCount`
  - [ ] Lê todas as variáveis 101-115 via `$gameVariables.value(N)`
  - [ ] Lê switches 101-106 via `$gameSwitches.value(N)`
  - [ ] Monta objeto JSON
  - [ ] Imprime com `console.log("RACE_EVENT:", JSON.stringify(obj, null, 2))`
- [ ] 7.3.4 Adicionar docs no header do plugin (`@command logRaceEvent`, `@param type`)
- [ ] 7.3.5 Validar plugin com `node -c Jhonny_RaceHelper.js`
- [ ] 7.3.6 Inserir chamadas `logRaceEvent` em handlers críticos:
  - [ ] `EV_OnSafe` (após mutação): `logRaceEvent("SAFE_CLICK")`
  - [ ] `EV_OnRisk` (após branch): `logRaceEvent("RISK_SUCCESS")` ou `logRaceEvent("RISK_FAIL")`
  - [ ] `EV_Crash` (no início): `logRaceEvent("CRASH")`
  - [ ] `EV_VitoriaCorrida` (no início): `logRaceEvent("VICTORY")`
- [ ] 7.3.7 Playtest — verificar logs no F12 após cada ação

## Detalhes de Implementação

### Código a adicionar no `Jhonny_RaceHelper.js`

```javascript
// === PLUGIN COMMAND: logRaceEvent ===
// Registra evento estruturado do minigame no console (F12).
// Conforme Apêndice B do Guia Técnico.

/*:
 * @target MZ
 * @plugindesc Jhonny Race Helper — utilities for the race minigame.
 * @help
 * Jhonny_RaceHelper.js
 *
 * Funções:
 *   - JhonnyRace.rollD100(): retorna 0..99
 *   - JhonnyRace.clamp(value, min, max)
 *
 * Plugin Commands:
 *   - logRaceEvent { type: "STRING" }
 *     Registra evento estruturado no console (F12).
 *
 * @command logRaceEvent
 * @text Log Race Event
 * @desc Registra um evento do minigame como JSON estruturado no console.
 *
 * @arg type
 * @text Event Type
 * @desc Tipo do evento (ex: SAFE_CLICK, RISK_SUCCESS, CRASH).
 * @type string
 * @default UNKNOWN
 */

// _logRaceEvent — chamado pelo PluginManager
JhonnyRace._logRaceEvent = function(args) {
  try {
    const type = args && args.type ? String(args.type) : "UNKNOWN";
    const frame = Graphics.frameCount;

    // Capturar todas as variáveis relevantes (IDs 101-115)
    const vars = {};
    const varNames = {
      101: "RACE_ID",
      102: "SCENE_INDEX",
      103: "SCENE_TYPE",
      104: "P_CENA",
      105: "CONSCIENCIA",
      106: "PONTOS_GLORIA",
      107: "TAXA_SUCESSO",
      108: "ROLL_RESULT",
      109: "TIMER_FRAMES",
      110: "SCENE_START",
      111: "SEED",
      112: "RACE_N_CENAS",
      113: "ATTEMPT_N",
      114: "LAST_RENDERED_INDEX",
      115: "HOVER_LEVEL"
    };
    for (const id in varNames) {
      if (varNames.hasOwnProperty(id)) {
        vars[varNames[id]] = $gameVariables.value(parseInt(id, 10));
      }
    }

    // Capturar switches (IDs 101-106)
    const switches = {};
    const switchNames = {
      101: "RACE_ACTIVE",
      102: "INPUT_LOCKED",
      103: "CRASH_FLAG",
      104: "LAST_ACTION_SAFE",
      105: "PAUSED",
      106: "IS_CURVA_DIABO"
    };
    for (const id in switchNames) {
      if (switchNames.hasOwnProperty(id)) {
        switches[switchNames[id]] = $gameSwitches.value(parseInt(id, 10));
      }
    }

    const entry = {
      type: type,
      frame: frame,
      vars: vars,
      switches: switches,
      timestamp: new Date().toISOString()
    };

    console.log("RACE_EVENT:", JSON.stringify(entry, null, 2));
    return entry;
  } catch (e) {
    console.warn("RACE_EVENT: error logging:", e);
    return null;
  }
};

// Registrar o Plugin Command (MZ API)
if (typeof PluginManager !== "undefined") {
  PluginManager.registerCommand("Jhonny_RaceHelper", "logRaceEvent", JhonnyRace._logRaceEvent.bind(JhonnyRace));
}
```

### Estrutura do log esperado

```json
{
  "type": "SAFE_CLICK",
  "frame": 1234,
  "vars": {
    "RACE_ID": 1,
    "SCENE_INDEX": 2,
    "SCENE_TYPE": 0,
    "P_CENA": 30,
    "CONSCIENCIA": 50,
    "PONTOS_GLORIA": 80,
    "TAXA_SUCESSO": 0,
    "ROLL_RESULT": 0,
    "TIMER_FRAMES": 180,
    "SCENE_START": 1100,
    "SEED": 123456789,
    "RACE_N_CENAS": 6,
    "ATTEMPT_N": 3,
    "LAST_RENDERED_INDEX": 1,
    "HOVER_LEVEL": 0
  },
  "switches": {
    "RACE_ACTIVE": true,
    "INPUT_LOCKED": true,
    "CRASH_FLAG": false,
    "LAST_ACTION_SAFE": true,
    "PAUSED": false,
    "IS_CURVA_DIABO": false
  },
  "timestamp": "2026-06-18T12:34:56.789Z"
}
```

### Por que JSON estruturado e não string formatada?

- **Filtragem:** `console.log("RACE_EVENT:", json)` permite filtrar por prefixo no DevTools.
- **Busca:** JSON permite buscar por `"type": "CRASH"` ou `"vars.CONSCIENCIA": 0`.
- **Export:** fácil parsear logs para análise (Node script, Python, planilha).
- **Extensibilidade:** adicionar campos novos não quebra parsers antigos.

### Por que capturar TODAS as variáveis/switches?

Em vez de capturar só o que muda:

- **Custo:** `console.log` é barato (microsegundos). Capturar 21 valores é negligenciável.
- **Debug:** se bug aparecer, ter estado completo no log é invaluable.
- **Simplicidade:** um helper faz tudo, em vez de múltiplos para cada evento.

Se performance virar problema (não deveria), otimizar capturando apenas o delta.

### Onde chamar `logRaceEvent` (Plugin Command)

No MZ Editor, abrir cada handler e adicionar `Plugin Command: Jhonny_RaceHelper > Log Race Event` com `type` apropriado:

| Handler | Posição no evento | Type |
|---------|-------------------|------|
| `EV_OnSafe` (5.1) | Após mutação, antes de `EV_ResolucaoSafe` | `"SAFE_CLICK"` |
| `EV_OnRisk` (5.2) — ramo sucesso | Após mutação, antes de `EV_ResolucaoRiskOK` | `"RISK_SUCCESS"` |
| `EV_OnRisk` (5.2) — ramo falha | Após custo, antes de `EV_Crash` | `"RISK_FAIL"` |
| `EV_Crash` (6.1) | No início | `"CRASH"` |
| `EV_VitoriaCorrida` (6.4) | No início | `"VICTORY"` |
| `EV_RaceOrchestrator` (3.1) — INIT | Após INIT block | `"RACE_INIT"` |

### Por que try/catch?

Plugin é chamado dentro de handlers de evento do MZ. Se algo der errado (ex.: `$gameVariables` ainda não inicializado em frame 0), o jogo não deve quebrar. `try/catch` captura erro e loga warning sem interromper o handler.

### Validação com `node -c`

```bash
node -c Jhonny/js/plugins/Jhonny_RaceHelper.js
```

Confirma sintaxe JS válida antes de testar no MZ. Não valida lógica (apenas parse).

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Esquecer `PluginManager.registerCommand` | Comando não aparece no MZ Editor | Registrar sempre no fim do plugin |
| Usar `args.type` direto sem `String()` | TypeError se undefined | `args && args.type ? String(args.type) : "UNKNOWN"` |
| Capturar `$gameVariables` em frame 0 | Erro: `$gameVariables` undefined | Try/catch |
| Esquecer `@command logRaceEvent` no header | Comando não registrado | Documentar sempre |
| Logs em produção (não dev) | Console poluído | Aceitável no MVP — futuramente adicionar `DEBUG` flag |
| Logs sem prefixo "RACE_EVENT:" | Difícil filtrar | Sempre prefixar |
| Logs muito verbosos (objeto enorme) | Console lento | Limitar a vars/switches relevantes |
| Não usar `JSON.stringify(obj, null, 2)` | Log não-legível | Sempre pretty-print com 2 espaços |

### Decisão: feature flag para desativar logs?

MVP: **não**. Logs sempre ativos em playtest. Em produção (jogo publicado), comentar as chamadas ou adicionar:

```javascript
JhonnyRace.DEBUG = true;  // setar false em produção

JhonnyRace._logRaceEvent = function(args) {
  if (!JhonnyRace.DEBUG) return;
  // ... resto do código
};
```

Deixar `DEBUG = true` para o protótipo.

### Integração com task-7.2 (TENTATIVA N)

Logs incluem `ATTEMPT_N` — pode-se correlacionar eventos por tentativa. Exemplo: "tentativa 3 crashou na cena 4 com P_CENA=70".

## visual_validation

Ao concluir esta task:

1. **Validar sintaxe:** `node -c Jhonny/js/plugins/Jhonny_RaceHelper.js` → sem erros.
2. Abrir MZ Editor → F10 (Plugin Manager) → confirmar `Jhonny_RaceHelper` listado.
3. **No `EV_OnSafe`** (e outros handlers), abrir Item List → adicionar Plugin Command → deve aparecer `Jhonny_RaceHelper > Log Race Event`.
4. Inicie a corrida com **F12 aberto** (DevTools → Console).
5. Clique em **Parar** (Safe).
6. **Console mostra:** `RACE_EVENT: {"type": "SAFE_CLICK", "frame": ..., "vars": {...}, "switches": {...}, "timestamp": "..."}`.
7. Force Risk-falha → log `"type": "CRASH"` aparece.
8. Vence corrida → log `"type": "VICTORY"` aparece.
9. **Filtrar console por "RACE_EVENT"** → todos os logs aparecem em sequência.
10. Estrutura JSON é válida (copiar/colar em jsonlint.com → sem erro).
11. Sem erros de runtime no console.

## Critérios de Sucesso

- [ ] `Jhonny_RaceHelper.js` tem função `_logRaceEvent` implementada.
- [ ] `PluginManager.registerCommand("Jhonny_RaceHelper", "logRaceEvent", ...)` registrado.
- [ ] Header tem `@command logRaceEvent` e `@arg type` documentados.
- [ ] `node -c Jhonny_RaceHelper.js` passa sem erro.
- [ ] Plugin Command aparece no MZ Editor.
- [ ] `logRaceEvent` é chamado em: EV_OnSafe, EV_OnRisk (sucesso + falha), EV_Crash, EV_VitoriaCorrida, EV_RaceOrchestrator INIT.
- [ ] Logs aparecem no F12 como JSON estruturado com prefixo `RACE_EVENT:`.
- [ ] Captura variáveis 101-115 e switches 101-106.
- [ ] Try/catch protege contra runtime errors.
- [ ] Sem erros no console.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo e verificando logs.

## Fora de Escopo

- Persistir logs em arquivo (fora do MVP — apenas console).
- Enviar logs para servidor (fora do MVP).
- Dashboard visual de logs (fora do MVP).
- Replay system baseado em logs (v2).
- Métricas agregadas (% sucesso Risk, etc.) — análise manual em planilha por enquanto.
- Diferenciação por nível de log (DEBUG/INFO/WARN/ERROR) — MVP usa só INFO.
- Toggle de logs via Plugin Parameter — deixar sempre ON no protótipo.
