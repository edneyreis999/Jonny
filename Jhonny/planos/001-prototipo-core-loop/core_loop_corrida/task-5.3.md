---
status: pending
---

<task_context>
<domain>engine/gameplay/feedback</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-5.1, task-5.2</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 5.3: Criar `EV_ResolucaoSafe` + `EV_ResolucaoRiskOK`

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §4 (Resolução visual de Safe), §5 (Resolução visual de Risk-sucesso)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §3.3 (linhas 410-423 — tabela de transição, coluna "Próximo CE"), §4.2 (linhas 478-518 — APIs Show/Move Picture), §4.3.1 (linhas 543-570 — overlays de feedback)

## Visão Geral

Criar dois Common Events que produzem **feedback visual de resolução** para as ações bem-sucedidas:

- `EV_ResolucaoSafe`: animação curta (~0,4s) que confirma visualmente o Safe (flash verde + zoom leve).
- `EV_ResolucaoRiskOK`: animação curta (~0,4s) que celebra o Risk-sucesso (flash azul/dourado + zoom mais forte + screen shake leve).

Ambos são responsáveis por **desligar `SW_INPUT_LOCKED`** no fim — destravando o próximo input. Sem estes, o lock fica ON para sempre após um Safe/Risk-sucesso, travando o minigame.

<requirements>
- `EV_ResolucaoSafe` criado com trigger "Call".
- `EV_ResolucaoRiskOK` criado com trigger "Call".
- Ambos usam Picture IDs na faixa 30-39 (overlays de feedback, §4.1 do Guia).
- Animação total ≤ 0,4s (24 frames a 60fps) — depois, `SW_INPUT_LOCKED = OFF`.
- `EV_ResolucaoSafe`: flash verde suave (Tint Screen curto) + zoom leve no botão clicado.
- `EV_ResolucaoRiskOK`: flash dourado/azul + zoom mais forte + shake leve.
- Ambos limpam suas pictures no fim (`Erase Picture`).
- Não fazem nenhuma mutação de variável de estado (Consciência/Glória/cena já foram mutados em 5.1/5.2).
</requirements>

## Subtarefas

- [ ] 5.3.1 Criar Common Event `EV_ResolucaoSafe` com trigger "Call"
- [ ] 5.3.2 Adicionar `Show Picture` ID 30 (flash verde fullscreen) opacidade 100
- [ ] 5.3.3 Adicionar `Move Picture` ID 30 (fade out em 12 frames — opacidade → 0)
- [ ] 5.3.4 Adicionar `Wait: 12 frames`
- [ ] 5.3.5 Adicionar `Erase Picture` ID 30
- [ ] 5.3.6 Adicionar `Control Switches: SW_INPUT_LOCKED = OFF`
- [ ] 5.3.7 Criar Common Event `EV_ResolucaoRiskOK` com trigger "Call"
- [ ] 5.3.8 Adicionar `Show Picture` ID 31 (flash dourado fullscreen) opacidade 160
- [ ] 5.3.9 Adicionar `Tint Screen` leve dourado por 6 frames (opcional)
- [ ] 5.3.10 Adicionar `Shake Screen` power 3, speed 5, duration 8 frames
- [ ] 5.3.11 Adicionar `Move Picture` ID 31 (fade out em 18 frames)
- [ ] 5.3.12 Adicionar `Wait: 18 frames`
- [ ] 5.3.13 Adicionar `Erase Picture` ID 31
- [ ] 5.3.14 Adicionar `Tint Screen: Normal` (resetar cor)
- [ ] 5.3.15 Adicionar `Control Switches: SW_INPUT_LOCKED = OFF`
- [ ] 5.3.16 Salvar e validar com Playtest

## Detalhes de Implementação

### Picture IDs reservados (§4.1 do Guia Técnico)

| Faixa | Uso |
|-------|-----|
| 30-39 | Overlays de feedback (flash, partículas) |

Esta task usa:
- **ID 30**: flash verde para Safe (criar picture `race/overlay_flash_green.png` em task-2.1 — se não existe, gerar agora).
- **ID 31**: flash dourado para Risk-sucesso (picture `race/overlay_flash_gold.png`).
- **ID 32**: reservado para flash branco (task-6.1 — crash).

> [!note] Se as pictures de flash não existirem ainda
> Use `Tint Screen` em vez de `Show Picture` para protótipo inicial:
> - Safe: `Tint Screen (50, 200, 50, 100) por 8 frames`, depois `Tint Screen Normal 12 frames`.
> - Risk-sucesso: `Tint Screen (255, 215, 0, 150) por 6 frames`, depois `Tint Screen Normal 18 frames`.
>
> Substituir por pictures quando assets estiverem prontos (task-2.1 já deveria ter gerado).

### Pseudo-código do `EV_ResolucaoSafe`

```
# EV_ResolucaoSafe (Trigger: Call)
# Animação de feedback para ação Safe. Duração total ~0,4s (24 frames).
# Desliga SW_INPUT_LOCKED no fim (libera próximo input).

# Flash verde: mostrar overlay fullscreen
Show Picture: 30, "race/overlay_flash_green", Upper Left (0,0), (100%,100%), 100, 100, Normal
# Mover opacidade para 0 em 12 frames (~0,2s)
Move Picture: 30, Upper Left (0,0), (100%,100%), 0, 12 frames, Normal
Wait: 12 frames

# Limpar
Erase Picture: 30

# Destravar input para próxima ação
Control Switches: SW_INPUT_LOCKED = OFF
```

### Pseudo-código do `EV_ResolucaoRiskOK`

```
# EV_ResolucaoRiskOK (Trigger: Call)
# Animação de feedback para Risk-sucesso. Duração total ~0,4s (24 frames).
# Mais intenso que Safe (Risk é a ação "ousada" — merece celebração).
# Desliga SW_INPUT_LOCKED no fim.

# Flash dourado: overlay fullscreen opacidade alta
Show Picture: 31, "race/overlay_flash_gold", Upper Left (0,0), (100%,100%), 160, 100, Add
# (Modo "Add" dá brilho extra no flash)

# Shake screen celebração
Shake Screen: power 3, speed 5, duration 8 frames

# Fade out do flash em 18 frames
Move Picture: 31, Upper Left (0,0), (100%,100%), 0, 18 frames, Normal
Wait: 18 frames

# Limpar
Erase Picture: 31

# Resetar shake (caso ainda esteja rodando)
Shake Screen: power 0, speed 0, duration 0  # alguns usam Stop Shake; no MZ: Shake Screen com dur 0 para

# Destravar input
Control Switches: SW_INPUT_LOCKED = OFF
```

### Por que 0,4s e não mais?

Conforme spec de domínio, o ritmo do minigame é **tensa e rápida**. Cada cena tem 240 frames (4s para Sinal) ou 210 frames (3,5s para Curva). Uma resolução de 0,4s dá:

- Tempo suficiente para o jogador **ver** que a ação teve efeito (percepção mínima humana ~150ms).
- Não alonga demais o feedback (não cansa em sessões longas).
- Mantém o lock ativo durante toda a animação (sem cliques prematuros).

> [!important] O lock deve cobrir toda a animação
> Se a animação durar 0,4s mas o lock for desligado em 0,2s, o jogador pode clicar no meio da animação. **Sempre desligar o lock no último frame da animação**, depois do `Wait`.

### Diferença entre `EV_ResolucaoSafe` e `EV_ResolucaoRiskOK`

| Aspecto | Safe | Risk-sucesso |
|---------|------|--------------|
| Cor do flash | Verde (50,200,50) | Dourado (255,215,0) |
| Opacidade inicial | 100 (suave) | 160 (intenso) |
| Shake screen | Não | Sim (power 3) |
| Duração | 12 frames | 18 frames |
| Significado narrativo | "Você freou bem" | "VOCÊ FUROU!" (conquista) |

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Esquecer `SW_INPUT_LOCKED = OFF` no fim | Lock fica ON para sempre após primeiro Safe/Risk-sucesso | Sempre desligar após animação |
| Animação > 0,5s | Sensação de lentidão | Manter ≤ 24 frames |
| Não fazer `Erase Picture` | Flash fica na tela permanentemente | Sempre apagar overlay ao fim |
| Usar Picture ID já ocupado (ex.: 20 = HUD) | Flash sobrescreve HUD | Reservar 30-39 para overlays |
| Esquecer `Wait` entre `Move Picture` e `Erase Picture` | Erase corta a animação antes de terminar | Sempre `Wait` com mesma duração do Move |
| `Shake Screen` sem parar | Tela treme para sempre | Shake MZ é auto-terminante (dura `duration` frames) |

## visual_validation

Ao concluir esta task (com 5.1, 5.2 prontos):

1. Inicie a corrida e clique em **Parar** (Safe).
2. **Flash verde** cobre a tela por ~0,2s e desaparece.
3. `SW_INPUT_LOCKED` desliga (F9 → Switch 102 = OFF) — pode clicar novamente.
4. Cena avança (fundo muda se Renderer ativo).
5. Clique em **Furar** com roll forçado para sucesso (`$gameVariables.setValue(108, 0)` no F12).
6. **Flash dourado** mais intenso cobre a tela.
7. **Tela treme** por ~8 frames (sutil).
8. Flash dourado desaparece em ~0,3s.
9. `SW_INPUT_LOCKED` desliga.
10. Console F12 sem erros.
11. Após várias ações Safe/Risk-sucesso, **nenhuma picture de overlay fica residual** na tela (Playtest → F8 → ver Picture list).

## Critérios de Sucesso

- [ ] `EV_ResolucaoSafe` existe com trigger "Call".
- [ ] `EV_ResolucaoRiskOK` existe com trigger "Call".
- [ ] Ambos produzem flash visual visível (verde/dourado).
- [ ] Duração total ≤ 24 frames cada.
- [ ] `SW_INPUT_LOCKED = OFF` no fim de cada um.
- [ ] `Erase Picture` 30/31 sempre executado (sem overlay residual).
- [ ] Risk-sucesso tem shake screen, Safe não tem.
- [ ] Sem erros de sintaxe nos eventos.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Animação de crash (feito em task-6.1 — separado e mais complexo).
- Animação da Curva do Diabo (feito em task-6.2).
- HUD de Glória (feito em task-5.4).
- Sons de feedback (feito em task-7.1).
- Animação de zoom no botão clicado (opcional, fora do MVP).
