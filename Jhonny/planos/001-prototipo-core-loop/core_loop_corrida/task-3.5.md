---
status: pending
---

<task_context>
<domain>engine/infra/map</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>low</complexity>
<dependencies>task-3.1</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 3.5: Criar Mapa "Garagem" (Map001) com Event Autorun

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §12.1 (Estrutura de eventos)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §1.3 (linhas 109-135), §9 Checklist (linhas 994-996)

## Visão Geral

Configurar o Map001 (já existente no projeto Jhonny como mapa inicial) como ponto de entrada do minigame. Criar um event com trigger "Autorun" que:
1. Define `VAR_RACE_ID = 1` (Corrida 1 = 6 cenas, para teste inicial).
2. Chama `EV_RaceOrchestrator`.

Em playtest, basta iniciar o jogo (Playtest) para a corrida começar automaticamente.

<requirements>
- Map001 (ou novo mapa, se preferir separar) tem pelo menos 1 event.
- Event tem trigger "Autorun" (não "Action Button" nem "Parallel").
- Event define `VAR_RACE_ID = 1` no início.
- Event chama `EV_RaceOrchestrator`.
- Event não tem condicional (sempre dispara no playtest).
</requirements>

## Subtarefas

- [ ] 3.5.1 Abrir Map001 no MZ Editor (ou criar novo mapa "Garagem")
- [ ] 3.5.2 Criar event com trigger "Autorun"
- [ ] 3.5.3 Adicionar `Control Variables: VAR_RACE_ID = 1`
- [ ] 3.5.4 Adicionar `Call Common Event: EV_RaceOrchestrator`
- [ ] 3.5.5 (Opcional) Adicionar `Erase Event` temporário para não re-disparar em testes manuais
- [ ] 3.5.6 Configurar `System.json` → `startMapId` aponta para o mapa (se for novo)
- [ ] 3.5.7 Salvar o projeto

## Detalhes de Implementação

### Estrutura do Event

```
# Event "Init Corrida" em Map001
# Trigger: Autorun
# Condition: (nenhuma — sempre dispara quando o mapa carrega)

# Define corrida 1 para teste (Lenda — 6 cenas)
Control Variables: VAR_RACE_ID = 1

# Inicia o minigame
Call Common Event: EV_RaceOrchestrator

# Após o Orchestrator retornar (vitória ou crash restart), o event continua.
# Para o protótipo, o event "termina" aqui — o Orchestrator+Crash cuida do loop.
```

### Por que trigger "Autorun" e não "Parallel"?

- **Autorun:** dispara quando o mapa carrega e o event está na tela. Bloqueia input do player mas permite `Wait`. É o trigger correto para cutscenes e scripts init.
- **Parallel:** dispara imediatamente mas não bloqueia input; corre em paralelo com o player. Para um init único, Autorun é mais seguro.

> **Atenção:** se o Orchestrator loop infinitamente (via Crash reiniciando), o Autorun nunca "termina". Para o protótipo, isso é aceitável. Em polish, adicionar `Erase Event` após o Orchestrator (mas isso só roda se o Orchestrator retornar normalmente).

### Posição do Event

Pode ser em qualquer tile do mapa. O event não precisa ser visível — pode ficar "abaixo" do player ou fora da tela. Recomendação:
- Colocar na posição inicial do player (System.json → `startX`, `startY`).
- Usar graphic "transparente" (sem sprite) para não aparecer.

### Variações por corrida

Para testar Corrida 2 ou 3, mudar `VAR_RACE_ID` no event:
- `VAR_RACE_ID = 1` → 6 cenas (Lenda).
- `VAR_RACE_ID = 2` → 8 cenas (Rachadura).
- `VAR_RACE_ID = 3` → 10 cenas (Abismo — inclui Curva do Diabo).

Em playtest, comentar/descomentar a linha conforme a corrida a testar. Para o protótipo, manter `VAR_RACE_ID = 1`.

### Mapa "Garagem" — descrição visual

O spec menciona cena "Roleta Paulista" mas o mapa inicial do Jhonny é simples. Para o protótipo visual:
- Mapa pequeno (17x13 tiles é o default do MZ).
- Tileset: Interior ou Exterior (não importa muito — o minigame sobrepõe tudo com pictures).
- BGM: opcional (silêncio é aceitável durante o minigame).
- O player aparece e imediatamente o event autorun dispara.

### Erro comum a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Trigger "Action Button" | Event não dispara sozinho | Usar "Autorun" |
| Trigger "Parallel" + Event sem Wait | Travamento (loop infinito síncrono) | Usar "Autorun" |
| Esquecer `VAR_RACE_ID` | Default 0 → Orchestrator entra em branch undefined → bug | Sempre setar `VAR_RACE_ID` antes de chamar Orchestrator |
| Event tem Condition Switch | Não dispara se switch OFF | Deixar Condition vazia |
| `startMapId` aponta para mapa errado | Jogo abre em mapa sem event | Verificar `System.json` |

## visual_validation

Ao concluir esta task:
1. Salvar o projeto.
2. Rodar Playtest (F5 ou botão Playtest no MZ Editor).
3. O jogo abre direto no Map001 (ou no mapa configurado).
4. Após ~0.1s (tempo do event autorun disparar), o fadein começa.
5. Após 0.3s, a cena 1 do minigame aparece renderizada.
6. Pressione F9 → `VAR_RACE_ID = 1`, `VAR_RACE_N_CENAS = 6`, `VAR_SCENE_INDEX = 0`.
7. Console (F12) sem erros.

## Critérios de Sucesso

- [ ] Event com trigger "Autorun" existe em Map001 (ou novo mapa).
- [ ] Event define `VAR_RACE_ID = 1` antes de chamar Orchestrator.
- [ ] Event chama `EV_RaceOrchestrator`.
- [ ] `System.json` → `startMapId` aponta para o mapa correto.
- [ ] Ao rodar Playtest, a corrida começa automaticamente sem input do jogador.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Criar cena VN prévia (fora de escopo do protótipo — corrida inicia direto).
- Implementar variação entre corridas (feito parcialmente pela task 6.3).
- Renderizar o mapa da garagem (não relevante — pictures cobrem tudo).
- Implementar transição entre corridas (feito na task 6.4 — tela de vitória).
