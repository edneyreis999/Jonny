---
status: out_of_scope
---

<task_context>
<domain>engine/gameplay/climax</domain>
<type>implementation</type>
<scope>future_feature</scope>
<complexity>medium</complexity>
<dependencies>task-3.2, task-6.1</dependencies>
<prd_ref>[[Corrida - Core Loop]] §6.4</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]] §5.4</techspec_ref>
</task_context>

# Tarefa 6.2: **FORA DE ESCOPO DESTA FASE** — Curva do Diabo (Cena Especial)

> [!warning] Status: reservada para fase futura ou v2
> Esta task **NÃO deve ser implementada na Fase 6**. Decisão confirmada pelo usuário em 2026-06-18 (ver [[tasks#DECISÕES CONFIRMADAS PELO USUÁRIO]] item 3).

## Decisão do Usuário

> "A Cena 10 existe como uma cena normal. Se o jogador vender a terceira corrida jogando normalmente, vamos criar uma nova cena especial que vai ser a cena da Curva do Diabo. Essa cena vai bloquear o caminho safe e o jogador vai ser forçado a escolher o Risk. mas essa cena especial da curva do diabo está fora de escopo dessa implementação. se concentre no core loop principal."

Tradução para a F6:

- **Corrida 3 (Abismo) tem 10 cenas normais** — sorteio 60/40 Sinal/Curva, igual às corridas 1 e 2.
- **A cena 9 (ou outra a definir) NÃO terá tratamento especial** em F6 — `VAR_P_CENA` é sorteado normalmente, `VAR_SCENE_TYPE` também.
- **`SW_IS_CURVA_DIABO` (switch Editor ID 105) permanece reservado e intocado** em F6.
- **`placa_curva_dir.png`** (criado em F2) fica no disco sem ser referenciado em F6.

## O que a cena especial faria (quando implementada no futuro)

Quando esta task for ativada em uma fase futura ou v2, ela deverá:

1. Detectar a condição "Corrida 3 + cena especial" (índice a definir — spec original §6.4 sugeria índice 9, mas pode ser revisado).
2. Setar `VAR_P_CENA = 100` fixo (custo máximo possível — Risk sempre zera Consciência).
3. Setar `VAR_SCENE_TYPE = 2` (enum especial distinto de Sinal=0 e Curva=1).
4. Setar `SW_IS_CURVA_DIABO = ON` (Switch Editor ID 105).
5. Mostrar picture `race/placa_curva_dir.png` em vez de `race/placa_curva.png`.
6. **Bloquear o caminho Safe** — jogador é forçado a escolher Risk (regra narrativa do clímax).
7. Após resolução (Risk-sucesso ou Risk-falha→crash), corrida prossegue normalmente.

## Pré-requisitos para ativar esta task no futuro

- **F6 completada e validada em Playtest MZ** (core loop funcional com 3 corridas normais).
- **Decisão de design sobre o Safe block:** como o jogador é impedido de clicar Safe?
  - Opção A: Esconder o botão Picture 41 na cena especial.
  - Opção B: Mostrar botão mas ignorar clique (lock via switch).
  - Opção C: Substituir por um único botão "FURAR" centralizado.
- **Calibração do P_CENA fixo:** confirmar que 100 é o valor desejado (Risk-sucesso com Consciência > 0 dá Glória +200 — enorme; pode precisar de clamp).

## Referências de Origem (preservadas para o futuro implementador)

- Spec de Domínio: [[Corrida - Core Loop]] §6.4 (Curva do Diabo — clímax)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §5.4 (linhas 735-753 — "Curva do Diabo — clímax da Corrida 3")
- Variáveis/Switches reservados:
  - `VAR_SCENE_TYPE` (Editor ID 102) — valor 2 reservado para Curva do Diabo
  - `SW_IS_CURVA_DIABO` (Switch Editor ID 105) — **já nomeado em `System.json`** (F1), pronto para uso

## Fora de Escopo

Tudo nesta task está fora de escopo da F6. Apenas o placeholder é mantido para documentação futura.
