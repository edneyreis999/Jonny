---
status: pending
---

<task_context>
<domain>engine/infra/database</domain>
<type>implementation</type>
<scope>configuration</scope>
<complexity>low</complexity>
<dependencies>none</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 1.1: Registrar Variáveis (IDs 101-113) e Switches (IDs 101-106) no Database

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]]
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §3.1 (linhas 348-377)

## Visão Geral

Reservar uma faixa fixa de IDs de variáveis (101-113) e switches (101-106) no Database do RPG Maker MZ para o minigame de Corrida. Registrar os nomes descritos no Guia Técnico para facilitar debug no editor MZ (F9 → Variables/Switches).

<requirements>
- Todas as 13 variáveis (IDs 101-113) devem estar nomeadas no Database com os nomes canônicos do Guia Técnico §3.1.
- Todas as 6 switches (IDs 101-106) devem estar nomeadas no Database.
- Salvar o projeto (`Ctrl+S` no MZ Editor) para persistir em `data/System.json`.
- Nenhuma variável/switch de outro sistema deve ocupar IDs nesta faixa.
</requirements>

## Subtarefas

- [ ] 1.1.1 Abrir MZ Editor → Database (F9) → aba "Variables"
- [ ] 1.1.2 Registrar variáveis IDs 101-113 com nomes da tabela abaixo
- [ ] 1.1.3 Alternar para aba "Switches" e registrar IDs 101-106
- [ ] 1.1.4 Salvar o projeto (Ctrl+S)
- [ ] 1.1.5 Verificar `Jhonny/data/System.json` → `variables` e `switches` arrays têm entradas nas posições corretas

## Detalhes de Implementação

### Variáveis (IDs 101-113)

| ID  | Nome no Database        | Tipo | Faixa        | Reset em restart? | Descrição                                  |
| --- | ----------------------- | ---- | ------------ | ----------------- | ------------------------------------------ |
| 101 | `VAR_RACE_ID`           | int  | 1..3         | não               | Corrida atual (Lenda/Rachadura/Abismo)     |
| 102 | `VAR_SCENE_INDEX`       | int  | 0..9         | sim               | Cena atual dentro da corrida               |
| 103 | `VAR_SCENE_TYPE`        | enum | 0,1,2        | —                 | 0=Sinal, 1=Curva, 2=Curva do Diabo         |
| 104 | `VAR_P_CENA`            | int  | 0,10,...,100 | —                 | Sorteado por cena                          |
| 105 | `VAR_CONSCIENCIA`       | int  | 0..100       | sim               | Recurso principal                          |
| 106 | `VAR_PONTOS_GLORIA`     | int  | 0..∞         | sim               | Pontuação cumulativa                       |
| 107 | `VAR_TAXA_SUCESSO`      | int  | 0..100       | —                 | `clamp(CONSCIENCIA + P_CENA, 0, 100)`      |
| 108 | `VAR_ROLL_RESULT`       | int  | 0..99        | —                 | d100 (debug/playtest)                      |
| 109 | `VAR_TIMER_FRAMES`      | int  | 0..240       | —                 | Frames restantes (Sinal=240, Curva=210)    |
| 110 | `VAR_SCENE_START`       | int  | frameCount  | —                 | Para barra de progresso sub-frame          |
| 111 | `VAR_SEED`              | int  | 1..1e9       | sim               | Captura decorativa                         |
| 112 | `VAR_RACE_N_CENAS`      | int  | 6/8/10       | —                 | Comprimento da corrida atual               |
| 113 | `VAR_ATTEMPT_N`         | int  | 1..∞         | não               | Tentativa N (incrementa a cada restart)    |

### Switches (IDs 101-106)

| ID  | Nome no Database         | Reset em restart? | Descrição                                       |
| --- | ------------------------ | ----------------- | ----------------------------------------------- |
| 101 | `SW_RACE_ACTIVE`         | desligado         | ON durante corrida; controla CE paralelos       |
| 102 | `SW_INPUT_LOCKED`        | desligado         | ON durante setup (0,3s) e resolução (0,4s)      |
| 103 | `SW_CRASH_FLAG`          | desligado         | ON quando Risk-falha; Orchestrator consome      |
| 104 | `SW_LAST_ACTION_SAFE`    | —                 | ON se última ação foi safe (para feedback)      |
| 105 | `SW_PAUSED`              | —                 | ON durante menu                                 |
| 106 | `SW_IS_CURVA_DIABO`      | —                 | ON na última cena da Corrida 3                  |

### Observações

- O projeto Jhonny vem com 20 variáveis e 20 switches vazias (sem nomear). Estamos reservando a faixa 101+ para evitar colisão com variáveis genéricas do MZ Editor (IDs 1-20 são fáceis de acidentalmente reutilizar).
- Em `Jhonny/data/System.json`, arrays `variables` e `switches` têm índice 0-based — o ID exibido no editor (101) corresponde ao índice 100 do array.

## visual_validation

Ao concluir esta task:
1. Abra o projeto no RPG Maker MZ.
2. Pressione **F9** para abrir o Database.
3. Na aba **Variables**, role até ID 101: deve mostrar `VAR_RACE_ID`. IDs subsequentes (102-113) mostram nomes conforme tabela acima.
4. Na aba **Switches**, role até ID 101: deve mostrar `SW_RACE_ACTIVE`. IDs 102-106 mostram nomes conforme tabela.
5. Nenhum erro de "duplicate ID" ou célula vazia na faixa 101-113 (Variables) e 101-106 (Switches).

## Critérios de Sucesso

- [ ] Database do MZ tem todas as 13 variáveis (IDs 101-113) nomeadas corretamente.
- [ ] Database do MZ tem todas as 6 switches (IDs 101-106) nomeadas corretamente.
- [ ] `Jhonny/data/System.json` foi atualizado (timestamp de modificação mudou).
- [ ] Salvar o projeto não gera erros.
- [ ] `visual_validation` confirmada pelo usuário abrindo o MZ Editor.

## Fora de Escopo

- Inicializar valores dessas variáveis (isso é feito no `EV_RaceOrchestrator` da task 3.1).
- Definir o comportamento de cada switch (implementado nas tasks subsequentes).
- Pré-reservar IDs adicionais para VN/ConcernScore (sistemas separados fora deste plano).
