---
status: implemented
---

<task_context>
<domain>engine/gameplay/feedback</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>low</complexity>
<dependencies>task-4.3</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
<origin>Feedback do usuário 2026-06-18 — regra user-testable-feedback</origin>
</task_context>

# Tarefa 4.5: Adicionar Feedback Sonoro e Visual nos Handlers EV_OnSafe/EV_OnRisk

## Referências de Origem

- Implementação atual: [[fase-4-completa]] §Estrutura dos CEs (CE 11/12 como esqueletos silenciosos)
- Regra aplicada: [[user-testable-feedback]] (qualquer task testada manualmente precisa de feedback perceptível)
- Asset availability: [[tasks]] §Estado de pré-requisitos — `freada.ogg`, `pneu_cantando.ogg`, `crash_metal.ogg` em `Jhonny/audio/se/`

## Visão Geral

CEs 11 (`EV_OnSafe`) e 12 (`EV_OnRisk`) foram implementados como esqueletos silenciosos: only ligam `SW_INPUT_LOCKED`. Sem feedback perceptível, o usuário não consegue validar a fase sem F12/F9 — o que (1) é anti-padrão (debug ≠ validação) e (2) pausa o jogo no MZ Playtest ([[mz-playtest-pauses]]), mascarando bugs.

Esta task adiciona feedback **mínimo viável** para que o usuário possa validar F4 apenas observando/ouvindo o jogo:

- **CE 11 (Safe):** `Play SE: freada` após ligar o lock
- **CE 12 (Risk):** `Play SE: pneu_cantando` após ligar o lock

> Áudio é suficiente para F4. Task 5.3 (`EV_ResolucaoSafe`/`EV_ResolucaoRiskOK`) adicionará animações visuais completas (flash + zoom). Task 7.1 refinará o mapeamento de SEs.

<requirements>
- `EV_OnSafe` (CE 11) emite `Play SE: freada` imediatamente após `Control Switches: SW_INPUT_LOCKED = ON`.
- `EV_OnRisk` (CE 12) emite `Play SE: pneu_cantando` imediatamente após `Control Switches: SW_INPUT_LOCKED = ON`.
- Implementação via extensão do script gerador `Jhonny/planos/001-prototipo-core-loop/fase4/build_phase4_ces.py` (não editar `CommonEvents.json` direto).
- Validação perceptível sem F12/F9: usuário clica → ouve o som.
</requirements>

## Subtarefas

- [x] 4.5.1 Editar `fase4/build_phase4_ces.py` no bloco do CE 11: adicionar comando `Play SE` (`code: 250`) após o `Control Switches` que liga `SW_INPUT_LOCKED` (101)
- [x] 4.5.2 Editar `fase4/build_phase4_ces.py` no bloco do CE 12: adicionar comando `Play SE` (`code: 250`) após o `Control Switches` que liga `SW_INPUT_LOCKED` (101)
- [x] 4.5.3 Rodar o script para regenerar `Jhonny/data/CommonEvents.json`
- [x] 4.5.4 Validar JSON: `python3 -m json.tool Jhonny/data/CommonEvents.json`
- [x] 4.5.5 Auditar: `rg '"code": 250' Jhonny/data/CommonEvents.json` deve mostrar 2 ocorrências (uma em CE 11, uma em CE 12)
- [ ] 4.5.6 Playtest MZ sem F12/F9: clicar botão Parar → ouve `freada`; clicar botão Furar → ouve `pneu_cantando`

## Detalhes de Implementação

### Formato JSON canônico do Play SE (code 250)

Conforme `rmmz_objects.js` (`Game_Interpreter.command250`):

```javascript
Game_Interpreter.prototype.command250 = function(params) {
    AudioManager.playSe(params[0]);
    return true;
};
```

`params[0]` é um objeto `{ name, volume, pitch, pan }`. Nome sem extensão (RPG Maker procura `<name>.ogg` em `audio/se/`).

### Comando Play SE para CE 11 (freada)

```json
{
    "code": 250,
    "indent": 0,
    "parameters": [
        {"name": "freada", "volume": 90, "pitch": 100, "pan": 0}
    ]
}
```

### Comando Play SE para CE 12 (pneu_cantando)

```json
{
    "code": 250,
    "indent": 0,
    "parameters": [
        {"name": "pneu_cantando", "volume": 90, "pitch": 100, "pan": 0}
    ]
}
```

### Ordem dentro do CE

Após os 3 guardas e o `Control Switches` do lock, ANTES do placeholder `Comment`. Estrutura final do CE 11:

```
If SW_RACE_ACTIVE (100) == OFF → Exit
If SW_INPUT_LOCKED (101) == ON → Exit
If VAR_TIMER_FRAMES (108) <= 0 → Exit
Control Switches: SW_INPUT_LOCKED (101) = ON
Play SE: freada                                          ← NOVO
Comment: "TODO task 5.1 — implementar lógica Safe"
```

Mesma estrutura para CE 12 com `pneu_cantando`.

### Por que antes do placeholder e não depois?

O `Play SE` deve tocar **imediatamente** após o lock para dar feedback instantâneo de que o clique foi registrado. Se ficar depois do placeholder (que task 5.1/5.2 vai preencher com lógica pesada), o usuário pode perceber delay.

### Por que só áudio em F4?

1. **Mínimo viável:** a regra [[user-testable-feedback]] exige "visible OR audible" — áudio satisfaz.
2. **Custo baixo:** 1 comando Play SE vs. 3+ comandos para flash visual (Tint/Wait/Tint-back) ou TextPicture (Plugin Command opaco).
3. **Sem efeito colateral:** Play SE não bloqueia parallel CE execution (diferente de `Show Text` code 101).
4. **Composicional com tasks futuras:** task 5.3 adicionará animações visuais completas; task 7.1 refinará o mapeamento de SEs. Nada em F4.5 entra em conflito.

### Mapeamento de SEs (decisão desta task)

| CE | Botão (Sinal) | Botão (Curva) | SE | Justificativa |
|----|---------------|---------------|----|---------------|
| 11 (Safe) | btn_parar | btn_direita | `freada` | "Parar/Direita" = ação conservadora → freio |
| 12 (Risk) | btn_furar | btn_esquerda | `pneu_cantando` | "Furar/Esquerda" = ação agressiva → pneu cantando |

> Task 7.1 pode refinar este mapeamento (ex.: Risk-sucesso=motor, Risk-falha=crash_metal). Esta task usa apenas os 3 SEs já existentes em `Jhonny/audio/se/`.

## visual_validation

**Procedimento — SEM F12, SEM F9:**

1. Abrir o jogo via RPG Maker MZ Playtest (F5)
2. Iniciar corrida (entrar no mapa Map001 que tem event autorun chamando `EV_RaceOrchestrator`)
3. Aguardar cena aparecer (Sinal ou Curva) com botões na faixa inferior
4. Clicar no botão da esquerda (Parar no Sinal, Esquerda no Curva):
   - **Esperado:** ouve `freada.ogg` imediatamente após o clique
5. Resetar o lock via console (uma única vez, só para poder testar de novo):
   - `$gameSwitches.setValue(101, false)`
6. Clicar no botão da direita (Furar no Sinal, Direita no Curva):
   - **Esperado:** ouve `pneu_cantando.ogg` imediatamente após o clique
7. Repetir cliques não devem emitir som adicional (o lock bloqueia re-entrada — guarda 2)

**Falha diagnóstica:**
- Clique sem som → `Play SE` não foi adicionado ou arquivo `freada.ogg`/`pneu_cantando.ogg` não existe em `audio/se/`
- Som atrasado → `Play SE` está depois do placeholder (mover para antes)
- Som toca mas lock não liga → bug na cadeia pré-existente (ver [[fase4-debug-state]])

## Critérios de Sucesso

- [x] `EV_OnSafe` (CE 11) contém `Play SE: freada` após o `Control Switches SW_INPUT_LOCKED = ON`.
- [x] `EV_OnRisk` (CE 12) contém `Play SE: pneu_cantando` após o `Control Switches SW_INPUT_LOCKED = ON`.
- [x] `python3 -m json.tool Jhonny/data/CommonEvents.json` OK.
- [x] `rg '"code": 250'` mostra exatamente 2 ocorrências.
- [ ] **Usuário confirma em playtest (SEM F12/F9):** clique em cada botão produz som distinto e imediato.
- [ ] Atualizar [[fase-4-completa]] com nota de que feedback foi adicionado.

## Fora de Escopo

- Animação visual completa (flash, zoom, picture animation) — task 5.3.
- Mapeamento final de SEs (Risk=motor, Risk-falha=impacto) — task 7.1.
- Feedback para input via teclado (setas/WASD) — embora os mesmos CEs 11/12 sejam chamados, então o feedback自动mente se aplica. Não precisa de task separada.
- HUD de Pontos de Glória — task 5.4.

## Notas

- **Regra aplicada:** [[user-testable-feedback]] — qualquer task manualmente testada deve ter feedback perceptível sem ferramentas de debug.
- **Lição de F4:** a ausência de feedback nesta fase causou 4 iterações de debug (R1-R4) que concluíram "bug" quando na verdade o código funcionava — o usuário apenas não tinha como perceber sem F12, e F12 pausava o jogo ([[mz-playtest-pauses]]).
