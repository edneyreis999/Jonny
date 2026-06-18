

  

Gere plano de ação tecnico a partir da analise técnica de implementação

  

## Passo 1: Scan de Contexto

  

Leia em paralelo os arquivos:
- [Guia Técnico](obsidian://open?vault=summer26&file=docs%2F03-Tech%2FGuia%20de%20Implementa%C3%A7%C3%A3o%20-%20Core%20Loop%20da%20Corrida)
- [Corrida - Core Loop](obsidian://open?vault=summer26&file=docs%2F02-Core-Loop%2FCorrida%20-%20Core%20Loop)

Para ter um contexto geral do que vai ser implementado.

  

## Passo 2: PAL MCP Planner

  

Invocar `mcp__pal__planner`

Para criar um plano de implementação. Divida o plano em fases testaveis pelo desenvolvedor.
Ao fim de cada fase, o desenvolvedor deve ser capaz de rodar o projeto e ver uma evolução visual no que está sendo implementado.

Quem vai ler e implementar seu plano vai ser um outro agente de IA.
Seja técnico e explicito sobre o que deve ser implementado em cada etapa.
Informe como e onde encontrar referencias para implementação, assim como explicar em detalhes como é para ser implementado.

  

## Passo 4: Write Artifacts

 Pergunte ao usuario qual o diretorio que ele deseja guardar o plano.
 Crie um nome simples para o diretorio em snake case.

```bash

mkdir -p {{DIRECTORY}}/<nome-snakecase>

```

  Use os templates:
  - ../../../.claude/templates/task-template.md
  - ../../../.claude/templates/tasks-template.md

Para escrever as tasks.