---
title: "Loki Init - Open Questions"
tipo: "open-questions"
status: "partial"
tags:
  - loki-init
  - questoes-abertas
  - game-dev
---

# Loki Init - Open Questions

Data: 2026-06-30

## Produto E Design

- O jogador deve conseguir vencer jogando sempre safe, ou o risco obrigatorio e intencional?
- `Curva do Diabo` pertence ao MVP, a polish futura, ou deve ficar explicitamente fora do proximo plano?
- Timeout deve gerar crash/falha, reroll, ou executar safe automaticamente?
- Qual e o publico-alvo/persona de Playtest para avaliar clareza e frustracao?

## Narrativa E Conteudo

- Qual arquivo/documento e fonte canonica de `Roleta Paulista`, VN, endings, `ConcernScore`, personagens e voz?
- A Corrida e a quest chain do projeto ou apenas um subsistema dentro de uma estrutura narrativa maior?
- `Consciência` deve ser tratada como apenas recurso mecanico, metafora narrativa, ou ambos?
- O retry sem replay da VN preserva contexto emocional suficiente?

## Runtime E UX

- Save/load deve ser bloqueado, permitido ou tratado especialmente durante race ativa e tela de resultado?
- Confirmacao da tela de resultado deve aceitar mouse/touch alem de OK/Space?
- Quais maps/events chamam cada corrida?
- Quais Picture IDs sao reservados para HUD, botoes, preload, resultado, busts e plugins?

## Audio E Arte

- O MVP usa apenas SE default do RPG Maker ou permite novos assets de audio?
- Timer ticks entram no MVP?
- Quais assets em `img/pictures/race/` existem e quais sao futuros/reservados?
- Ha limite alvo para memoria/texture cost de pictures fullscreen?

## Proximo Workflow

- O proximo `loki:tech-analysis` deve focar primeiro em resultado/retry, save/load, helper plugin ou inventario visual/audio?
