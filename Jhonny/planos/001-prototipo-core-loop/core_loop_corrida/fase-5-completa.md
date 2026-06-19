---
status: implementada
data: 2026-06-18
fase: 5
plan: "[[tasks]]"
dependencies: ["[[fase-4-completa]]"]
---

# Fase 5 — Lógica de Estado e Resolução (Implementada)

> **STATUS:** Implementada — aguardando Playtest MZ do usuário.
> **Pré-requisito:** F4 validada ([[fase-4-completa]]).
> **Artefato-fonte:** `fase5/build_phase5_ces.py` + `fase5/setup_phase5_system.py`.

## Resumo da implementação

| Task | CE Editor ID | Estado | Descrição |
|------|--------------|--------|-----------|
| 5.1 | CE 11 (`EV_OnSafe`) | **Implementada** | Lógica Safe: Consciência clamp 0-100, Glória +10, cena++, flash verde via CE 14 |
| 5.2 | CE 12 (`EV_OnRisk`) | **Implementada** | Lógica Risk: clamp taxa, roll d100, custo em ambos ramos, Glória ×2 no sucesso, SW_CRASH_FLAG na falha |
| 5.3 | CE 14/15 (NOVOS) | **Implementada** | `EV_ResolucaoSafe` (flash verde + unlock) + `EV_ResolucaoRiskOK` (flash dourado + shake + unlock) |
| 5.4 | CE 6 (`EV_UpdateHud`) | **Placeholder + passo manual MZ pendente** | Plugin Command TextPicture não é seguro via JSON — inserção manual documentada abaixo |
| 5.5 | CE 16 (NOVO) | **Implementada** | `EV_HoverRiskButton` Parallel com TouchInput.x/y, 3 níveis discretos, Pictures 22-24 |

## Bug crítico corrigido nesta sessão

**Root cause:** O docstring do `build_phase5_ces.py` invertia o estado do `ControlSwitch` (code 121):
- Docstring dizia: `state(0=OFF|1=ON)`
- Realidade MZ (`js/rmmz_objects.js:10172-10176`): `params[2] === 0` → switch **ON**

**Impacto do bug (pré-correção):** Após o primeiro clique (Safe ou Risk), `SW_INPUT_LOCKED` ficava permanentemente ON — jogador não conseguia clicar novamente, jogo travava.

**Operações corrigidas (5 ao total):**

| CE | Operação | Antes | Depois | Razão |
|----|----------|-------|--------|-------|
| CE 11 (OnSafe) | `SW_LAST_ACTION_SAFE` | `1` (OFF, errado) | `0` (ON) | Última ação foi Safe → flag deve ficar ON |
| CE 12 (OnRisk) sucesso | `SW_LAST_ACTION_SAFE` | `0` (ON, errado) | `1` (OFF) | Última ação foi Risk → flag deve ficar OFF |
| CE 12 (OnRisk) falha | `SW_CRASH_FLAG` | `1` (OFF, errado) | `0` (ON) | Crash → flag deve ficar ON para F6 |
| CE 14 (ResolucaoSafe) | `SW_INPUT_LOCKED` unlock | `0` (ON, errado) | `1` (OFF) | Liberar input após resolução |
| CE 15 (ResolucaoRiskOK) | `SW_INPUT_LOCKED` unlock | `0` (ON, errado) | `1` (OFF) | Liberar input após resolução |

> Operações **já corretas** que permaneceram inalteradas: `121 [101, 101, 0]` no início de CE 11 e CE 12 (lock ON, correto — o autor original pensou "0=OFF" mas o efeito é ON, dando lock correto por acidente).

## Validação automática concluída

- `python3 -m json.tool Jhonny/data/CommonEvents.json` → OK
- Auditoria de IDs em scripts inline (`value(|setValue(`) → PASS (todos os IDs 100-116 batem com `System.json`)
- Auditoria de operações `ControlSwitch` (121) → semântica verificada CE 11/12/14/15
- Posição do botão Furar (440, 500) confirmada em CE 8 — coincide com geometria hardcoded em CE 16
- Pictures `race/overlay_risk_low|med|high.png` e `race/btn_furar|esquerda.png` existem em `Jhonny/img/pictures/race/`

## Passo manual MZ OBRIGATÓRIO — Task 5.4 (HUD Glória)

> **Por que manual:** Plugin Commands (code 357) têm schema opaco que não pode ser gerado com segurança via JSON. O `TextPicture` exige argumentos específicos que o MZ Editor valida visualmente.

### Sequência

1. Abrir o projeto `Jhonny/` no RPG Maker MZ.
2. **Database (F10)** → aba **Common Events**.
3. Selecionar **#0006 EV_UpdateHud**.
4. Localizar a linha com o Comment vermelho:
   ```
   [TASK 5.4 MANUAL MZ] Inserir Plugin Command TextPicture: Set Text "GLÓRIA: \\V[105]" + Show (Pic ID 51, pos 560,20). Ver fase-5-completa.md.
   ```
5. Clicar com direito → **Insert** (uma linha acima do Comment, ou abaixo do Script da barra).
6. **Insert → Plugin Command → TextPicture > Set Text**:
   - `text`: `GLÓRIA: \V[105]` (no editor MZ, usar **uma** barra invertida; o MZ salva como `\\V[105]` no JSON).
7. **Insert → Plugin Command → TextPicture > Show**:
   - `pictureId`: `51`
   - `position`: `(560, 20)`
8. **Ctrl+S** no Database para salvar.
9. Fechar o Database.

### Verificação pós-edição

- O Comment vermelho pode ser apagado depois (opcional — serve como lembrete até a inserção).
- O `EV_UpdateHud` é chamado ao fim de `EV_OnSafe` (CE 11) e `EV_OnRisk` (CE 12) — então Picture 51 aparece/atualiza após cada ação.

## Pós-edição MZ obrigatória (aprendizado F4)

Após qualquer edição de `CommonEvents.json` via script Python, o `$dataCommonEvents` em runtime pode não refletir o JSON em disco sem uma passada pelo MZ Editor:

1. Abrir MZ Editor no projeto `Jhonny/`.
2. **Database (F10)** → **Ctrl+S** (mesmo sem alterar nada, força reload do JSON).
3. Fechar e reabrir o Playtest (F5 não basta — encerre e reinicie).

Sem este passo, CEs novos (14/15/16) podem ser ignorados em runtime, causando "Call Common Event: ID não existe" silencioso.

## Checklist de Playtest (feedback perceptível — sem F12/F9)

Conforme [[user-testable-feedback]], toda validação deve ser visível/audível sem ferramentas de debug:

### Task 5.1 (Safe logic)
- [ ] Iniciar corrida. Cena de Sinal aparece com botões Parar/Furar.
- [ ] Clicar **Parar** (Picture 41). Som `freada` toca (F4.5).
- [ ] **Flash verde** cobre a tela por ~8 frames (CE 14).
- [ ] Cena avança (fundo muda para próxima cena).
- [ ] Após 1-2 cliques em Parar, hover sobre o botão não aparece mais travado — pode clicar de novo.

### Task 5.2 (Risk logic)
- [ ] Clicar **Furar** (Picture 42). Som `pneu_cantando` toca.
- [ ] **Roll d100 acontece**: dois resultados possíveis.
- [ ] **Sucesso:** flash dourado + shake visível (CE 15), cena avança, som de vitória implícito pela continuidade.
- [ ] **Falha (após alguns cliques em Furar com Consciência baixa):** SW_CRASH_FLAG seta; Comment placeholder no log indica que EV_Crash será chamado em F6 (task 6.1).

### Task 5.3 (Resolução flashes)
- [ ] Safe → flash verde perceptível.
- [ ] Risk-sucesso → flash dourado + shake perceptível.
- [ ] Após resolução (~18-24 frames), input destrava — próximo clique funciona.

### Task 5.4 (HUD Glória) — APÓS PASSO MANUAL
- [ ] Após passo manual MZ acima, ao clicar Parar/Furar (sucesso), texto `GLÓRIA: <n>` aparece no canto superior direito (560, 20).
- [ ] Número incrementa visivelmente: +10 no Safe, +P_CENA×2 no Risk-sucesso.

### Task 5.5 (Hover vermelho)
- [ ] Iniciar corrida. Forçar taxa via Console F12 (debug-only, permitido neste caso para forçar níveis): `$gameVariables.setValue(106, 80)` → nível alto.
- [ ] Passar mouse sobre o botão **Furar** → overlay vermelho suave (Picture 22, opacidade 80) aparece.
- [ ] Tirar mouse → overlay desaparece.
- [ ] Force `$gameVariables.setValue(106, 50)` → hover mostra Picture 23 (opacidade 140) — visivelmente mais forte.
- [ ] Force `$gameVariables.setValue(106, 20)` → hover mostra Picture 24 (opacidade 220) — vermelho intenso.
- [ ] Passar mouse sobre o botão **Parar** (Safe) → **NENHUM** overlay aparece (correto — Safe não tem hover de risco).
- [ ] Clicar no botão com overlay vermelho → clique funciona (overlay não bloqueia — IDs 22-24 < 41-50).

## Erros comuns e diagnósticos

| Sintoma | Causa provável | Fix |
|---------|----------------|-----|
| Após primeiro clique, jogo não responde mais | (Corrigido nesta sessão) Lock não liberava | Reaplicar `build_phase5_ces.py` |
| "Common Event ID não existe" em runtime | MZ Editor não recarregou JSON | F10 → Ctrl+S → reiniciar Playtest |
| Hover nunca aparece | `SW_INPUT_LOCKED` está ON (durante resolução) | Normal — overlay é apagado durante o lock |
| Hover aparece sobre o botão Safe (Parar/Direita) | Geometria hardcoded errada | Confirmar (440, 500) para Furar/Esquerda vs (220, 500) para Parar/Direita |
| Texto `GLÓRIA: \V[105]` aparece literal (não interpretado) | TextPicture Set Text errado | Usar `\V[105]` no editor (uma barra), não `\\V[105]` |
| Flash verde/dourado não aparece | Tint Screen resetando rápido demais | Confirmar `Wait 12` (Safe) ou `Wait 18` (Risk) em CE 14/15 |

## Fora de escopo (pendente em F6/F7)

- `EV_Crash` (task 6.1) — Comment placeholder no ramo de falha do Risk será substituído por `C(117, 1, [CE_CRASH])` em F6.
- `logRaceEvent` plugin command (task 7.3) — fora do escopo da F5.
- Animação pulsante no hover nível 2/3 — fora do MVP.
- Som de hover — fora do escopo (áudio só em ações efetivas).

## Referências

- Plano: [[tasks]] §Fase 5
- Specs: [[task-5.1]], [[task-5.2]], [[task-5.3]], [[task-5.4]], [[task-5.5]]
- Aprendizados F4: [[fase4/retrospectiva]]
- Skill usada: `rpg-maker-mz-data-json` (workflow script-first)
