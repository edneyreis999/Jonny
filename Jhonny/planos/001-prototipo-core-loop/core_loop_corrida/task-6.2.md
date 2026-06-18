---
status: pending
---

<task_context>
<domain>engine/gameplay/climax</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-3.2, task-6.1</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 6.2: Implementar Curva do Diabo (Corrida 3, Cena 9)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §6.4 (Curva do Diabo — clímax), §6.2 (P_CENA máximo = 100)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §5.4 (linhas 735-753 — "Curva do Diabo — clímax da Corrida 3")

## Visão Geral

A **Corrida 3 (Abismo)** tem 10 cenas. A última cena (índice 9) é a **Curva do Diabo** — o clímax do minigame. Diferencia-se das outras cenas por:

1. **`VAR_P_CENA = 100` fixo** (não sorteado): máximo custo possível.
2. **`VAR_SCENE_TYPE = 2`** (enum especial, distinto de Sinal=0 e Curva=1).
3. **`SW_IS_CURVA_DIABO = ON`**: liga feedback visual diferenciado (placa "CURVA DO DIABO", música intensa, etc.).
4. **Placa diferenciada**: picture `placa_curva_dir` (criada em task-2.1) aparece em vez de `placa_curva`.

Esta task ajusta o `EV_RaceRenderer` (task-3.2) e o sorteio do `EV_RaceOrchestrator`/cenas para detectar a condição "Curva 3 + cena 9" e aplicar as variações.

<requirements>
- Na Corrida 3 (RACE_ID=3), cena 9 (SCENE_INDEX=9), o Renderer deve:
  - Setar `VAR_SCENE_TYPE = 2` (não sortear 0/1).
  - Setar `VAR_P_CENA = 100` (não sortear de [10,20,...,100]).
  - Setar `SW_IS_CURVA_DIABO = ON`.
  - Mostrar picture `placa_curva_dir` (não `placa_curva`).
- Em todas as outras corridas/cenas, comportamento normal (sorteio 60/40 Sinal/Curva).
- Placa "CURVA DO DIABO" visível na tela.
- Decisão: jogador ainda pode Safe ou Risk (mas Risk é suicídio com P_CENA=100 → custo sempre máximo).
</requirements>

## Subtarefas

- [ ] 6.2.1 Confirmar picture `race/placa_curva_dir.png` existe (task-2.1 deveria ter criado)
- [ ] 6.2.2 Estender `EV_RaceRenderer` (task-3.2) com check especial no sorteio:
  - [ ] `If VAR_RACE_ID == 3 AND VAR_SCENE_INDEX == 9` → setar `VAR_SCENE_TYPE = 2`, `VAR_P_CENA = 100`, `SW_IS_CURVA_DIABO = ON`
  - [ ] Else → sorteio normal (60/40 Sinal/Curva, P_CENA em [10,20,...,100])
- [ ] 6.2.3 Modificar `EV_RenderCurva` (task-3.3) para usar picture diferente quando `SW_IS_CURVA_DIABO = ON`
- [ ] 6.2.4 Garantir que a placa "CURVA DO DIABO" aparece visivelmente (Picture ID na faixa 10-19)
- [ ] 6.2.5 Validar que Risk na Curva do Diabo com taxa baixa = quase sempre crash
- [ ] 6.2.6 Garantir que após vencer Curva do Diabo (Safe/Risk-sucesso), corrida termina (task-6.4 cuida da vitória)

## Detalhes de Implementação

### Pseudo-código do sorteio no `EV_RaceRenderer`

```
# EV_RaceRenderer (trecho — sorteio quando VAR_SCENE_INDEX muda)

# === CHECK ESPECIAL: CURVA DO DIABO ===
If VAR_RACE_ID == 3 AND VAR_SCENE_INDEX == 9
  # Clímax da Corrida 3
  Control Variables: VAR_SCENE_TYPE = 2
  Control Variables: VAR_P_CENA = 100
  Control Switches: SW_IS_CURVA_DIABO = ON
Else
  # Sorteio normal
  Control Switches: SW_IS_CURVA_DIABO = OFF

  # Sorteio do tipo: 60% Sinal, 40% Curva
  Script: var r = Math.random(); $gameVariables.setValue(103, r < 0.6 ? 0 : 1)

  # Sorteio do P_CENA em [10, 20, ..., 100]
  Script: $gameVariables.setValue(104, (Math.floor(Math.random() * 10) + 1) * 10)
End

# === RENDERIZAÇÃO ===
If VAR_SCENE_TYPE == 0
  Call EV_RenderSinal
Else If VAR_SCENE_TYPE == 1
  Call EV_RenderCurva
Else
  # VAR_SCENE_TYPE == 2 (Curva do Diabo) — usa RenderCurva com placa diferenciada
  Call EV_RenderCurva
End
```

### Modificação do `EV_RenderCurva` para Curva do Diabo

```
# EV_RenderCurva (trecho — escolha da placa)

# Background comum
Show Picture: 10, "race/bg_curva", ...

# Placa: diferenciada se Curva do Diabo
If SW_IS_CURVA_DIABO == ON
  Show Picture: 15, "race/placa_curva_dir", (200, 80), (100%, 100%), 255, Normal
Else
  Show Picture: 15, "race/placa_curva", (200, 80), (100%, 100%), 255, Normal
End

# Resto do setup (Opala POV, botões, etc.) — comum
...
```

### Por que `VAR_P_CENA = 100` fixo?

Spec §6.4: Curva do Diabo é a **cena de custo máximo**. Variar P_CENA tiraria o clímax. Fixar em 100 significa:

- **Custo de Risk-sucesso:** Consciência sempre -100 (zerada).
- **Recompensa de Risk-sucesso:** Glória +200 (100×2) — enorme.
- **Taxa de sucesso:** `CONSCIENCIA + 100` clamped em 100. Para ter 100% de sucesso, Consciência precisa estar ≥ 0 (sempre verdade) — mas **clamped**, então sempre 100%.

> [!important] Curva do Diabo: Risk-sucesso é quase garantido se Consciência > 0
> Como `taxa = min(100, CONSCIENCIA + 100) = 100`, **qualquer roll < 100** é sucesso. Exceto roll = 99 (falha garantida com 1%).
>
> Estratégia ótima na Curva do Diabo: Risk se Consciência > 0 (recompensa alta, falha só 1%).
>
> Mas spec também menciona "tensão narrativa" — calibrar para que Risk não seja óbvio (ver task-7.x playtest).

### Por que `VAR_SCENE_TYPE = 2`?

Distingue de Sinal (0) e Curva comum (1) para:

- Renderer saber qual fundo/placa mostrar.
- Hover calcular overlay diferenciado (talvez nível 4 reservado para Diabo?).
- Logger identificar evento "CURVA_DIABO".
- Pós-jogo: estatística "quantas vezes chegou na Curva do Diabo".

### Por que `SW_IS_CURVA_DIABO` como switch?

Em vez de checar `VAR_RACE_ID == 3 AND VAR_SCENE_INDEX == 9` em todo lugar (custoso e frágil — se mudar o índice, quebra), um switch booleano é:

- Mais legível.
- Mais barato de checar.
- Pode ser usado em Ifs do MZ Editor sem precisar de Script.
- Conveniente para o logger (task-7.3).

### Posição da placa (Picture ID 15)

Conforme faixas §4.1 do Guia:

- ID 15 está na faixa 10-19 (elementos intermediários).
- Posição (200, 80) — topo-centro-esquerda, visível mas não bloqueia fundo.
- Tamanho 100% (original da picture).

> [!note] Se a placa for muito grande/pequena
> Ajustar `scaleX/Y` via `Move Picture` com escala. Ver task-2.1 para dimensões esperadas.

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Esquecer `Else` (SW_IS_CURVA_DIABO = OFF no sorteio normal) | Switch fica ON para sempre | Resetar no Else |
| Setar P_CENA=100 mas esquecer de incrementar cena++ | Curva do Diabo repete | Renderer deve sortear nova cena após resolução |
| Mostrar `placa_curva_dir` sem apagar `placa_curva` anterior | Duas placas aparecem | Erase Picture 15 antes de mostrar |
| Resetar `SW_IS_CURVA_DIABO` no crash (task-6.1) | Switch desliga no restart — mas Corrida 3 cena 9 ainda é Diabo | Renderer re-seta no próximo sorteio |
| Sortear `VAR_SCENE_TYPE = 0/1` quando deveria ser 2 | Curva do Diabo vira Sinal/Curva comum | Check IF primeiro, sorteio no Else |
| Usar `>= 9` em vez de `== 9` | Cenas 9, 10+ viram todas Diabo | Índice exato `== 9` |
| Verificar `RACE_ID == 3` mas corrida começa em 1 | Off-by-one | Confirmar IDs: 1=Lenda, 2=Rachadura, 3=Abismo |

### Edge case: Curva do Diabo após restart

Se o jogador chega na Curva do Diabo, falha, restart:

1. Crash reset: `VAR_SCENE_INDEX = 0`.
2. `SW_IS_CURVA_DIABO` permanece OFF (task-6.1 não reseta — mas é re-setado quando cena 9 de novo for sorteada).
3. Renderer detecta cena 9 de novo → seta tudo normalmente.

**Importante:** task-6.1 não reseta `SW_IS_CURVA_DIABO` (não está na lista de reset). Pode adicionar para segurança:

```
# EV_Crash — reset adicional (opcional)
Control Switches: SW_IS_CURVA_DIABO = OFF
```

Confirmar necessidade em playtest.

## visual_validation

Ao concluir esta task (com 3.2, 3.3, 6.1 prontos):

1. Force `VAR_RACE_ID = 3` (Abismo): `$gameVariables.setValue(101, 3)` no F12.
2. Force `VAR_RACE_N_CENAS = 10`: `$gameVariables.setValue(112, 10)`.
3. Force chegar na cena 9: `$gameVariables.setValue(102, 9)` no F12.
4. Avance uma cena (ou dispare re-render).
5. **Placa "CURVA DO DIABO"** aparece (não a placa de curva comum).
6. F9 → `VAR_SCENE_TYPE = 2` ✓.
7. F9 → `VAR_P_CENA = 100` ✓.
8. F9 → `SW_IS_CURVA_DIABO = ON` ✓.
9. Tente Risk: custo = 100 (Consciência zera).
10. Tente Safe: funciona normalmente (Consciência +10, Glória +10).
11. Após resolver (Safe ou Risk-sucesso), cena 10 aparece (última da Corrida 3) ou vitória (task-6.4).
12. Após restart (crash), voltando para cena 9 novamente re-ativa Curva do Diabo corretamente.
13. Teste em corridas 1 e 2 (6 e 8 cenas) — **nenhuma cena** é Curva do Diabo.
14. Console F12 sem erros.

## Critérios de Sucesso

- [ ] Curva do Diabo ativa apenas em Corrida 3 cena 9 (RACE_ID=3 AND SCENE_INDEX=9).
- [ ] `VAR_SCENE_TYPE = 2` setado nessa condição.
- [ ] `VAR_P_CENA = 100` setado nessa condição.
- [ ] `SW_IS_CURVA_DIABO = ON` setado nessa condição.
- [ ] Placa `placa_curva_dir` aparece em vez de `placa_curva`.
- [ ] Sorteio normal funciona em todas as outras condições.
- [ ] Risk na Curva do Diabo aplica custo 100 (Consciência zera).
- [ ] Safe na Curva do Diabo funciona normalmente (+10/+10).
- [ ] Restart após crash re-ativa Diabo corretamente ao voltar à cena 9.
- [ ] Sem erros no console.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Animação especial ao entrar na Curva do Diabo (zoom dramático, flash) — fora do MVP.
- Música exclusiva da Curva do Diabo — fora do MVP.
- Diálogo VN antes/after da Curva do Diabo — sistema VN separado.
- Condição de vitória ao terminar a Corrida 3 (task-6.4).
- Calibração de P_CENA diferente de 100 (playtest em task-7.x).
- Estatísticas de quantas vezes morreu na Curva do Diabo (logger task-7.3 registra, mas não há dashboard).
