---
title: "Loki Init - Standards Curator Context"
tipo: "agent-context"
status: "partial"
tags:
  - loki-init
  - agent-context
  - standards-curator
---

# Loki Init - Standards Curator Context

Data: 2026-06-30  
Agente: `standards-curator`  
Escopo: classificar aprendizados e limites de promocao durante `loki:init`.

## Facts With Sources

- `docs/loki-init/project-inventory.md` fixa writes permitidos em `docs/**` e `planos/000-init-loki/**`.
- `docs/loki-init/technology-context.md` classifica o workspace como `game-dev` por causa de `Jhonny/`.
- O estado real de git contradiz a instrucao inicial que dizia nao haver `.git/`.
- `docs/index.xml` precisava receber os novos documentos duradouros do init.

## Inferences And Hypotheses

- Nenhum aprendizado deste init deve virar regra global ou pacote Loki sem `technical-review`.
- Retrospectivas de fase sao evidencias locais, nao standards reutilizaveis por si mesmas.

## Gaps / Do Not Assume

- Nao assumir runtime validado.
- Nao promover regras para `.claude/**`, `.codex/**`, `.agents/**` ou pacote Loki neste workflow.

## Validators Recommended

- Verificar escopo de writes.
- Verificar catalogacao em `docs/index.xml`.
- Registrar conflitos como questoes abertas, nao como decisoes finais.

## Context Budget Used

- Handoff sintetico do agente e inventarios comuns do init.
