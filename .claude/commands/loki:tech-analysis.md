---
name: nsd:tech-analysis
description: Gera analise tecnica de NSD preenchendo template de analise tecnica baseado em NSD narrativo existente
tools: Task, AskUserQuestion, Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

# NSD Technical Analysis Command

Comando para gerar análise técnica completa de NSD (Narrative Structure Document), preenchendo o template técnico baseado em um NSD narrativo existente.

## Passo 0: Entrada do Usuário

### 0.0: Receber Caminho do NSD

Usar `AskUserQuestion`:

```
header: "NSD Fonte"
question: "Qual arquivo NSD deseja analisar tecnicamente?"
options:
  - label: "Selecionar arquivo"
    description: "Escolha um arquivo .nsd.xml ou .NSD.fluxo-cenas.md"
multiSelect: false
```

Ler o arquivo fornecido e extrair:
- **Nome da quest**: `<nsd:questName>` ou header markdown
- **Variável de controle**: `<nsd:controlVariable>` ou seção de controle
- **Locais**: Lista de `<nsd:location>` com `<nsd:mapId>`
- **Cenas**: Lista de `<nsd:scene>` com beats

### 0.1: Escopo de Análise (Opcional)

```
header: "Escopo"
question: "Deseja analisar todos os mapas do NSD ou específicos?"
options:
  - label: "Todos os mapas"
    description: "Analisa todos os mapas mencionados no NSD"
  - label: "Mapas específicos"
    description: "Selecione quais mapas analisar"
multiSelect: false
```

Se "Mapas específicos": usar `AskUserQuestion` para selecionar IDs.

## Passo 1: Análise de Impacto (PARALELO)

### 1.1: Executar Agentes em Paralelo

### 4.3: Salvar Arquivo

```bash
# Derivar nome do NSD
nsd_path="docs/Quests/X/quest.nsd.xml"
tech_path="${nsd_path%.nsd.xml}.tech.xml"
```

## Passo 5: Relatório Final

```
+======================================================================+
|                 NSD TECHNICAL ANALYSIS REPORT                        |
+======================================================================+
| Quest: [Nome]                                                        |
| NSD: [path/to/nsd]                                                   |
| Output: [path/to/.tech.xml]                                          |
| Generated: [YYYY-MM-DD]                                              |
+======================================================================+

MAPS ANALYZED: [N]
  Map [ID]: [X] events, [Y] vars, [Z] switches
  ...

IMPACT:
  Variables in use: [N]
  Switches in use: [N]
  Critical events: [N]
  Conflicts: [N]

RECOMMENDED IDs:
  Variables: [START]-[END] ([N] free)
  Switches: [START]-[END] ([N] free)

OUTPUT: [tech.xml path]

NEXT:
  1. Review .tech.xml (especialmente StateTeardown)
  2. Aprovação técnica
  3. Implementar no RPG Maker
  4. Testar regressão
```

### 5.1: Avisos

**SE conflitos**: mostrar sugestões
**SE performance ruim**: alertar sobre parallel processes
**SE muitos IDs**: sugerir otimização

## Passo 6: Ação Final

```
header: "Ação"
question: "Deseja realizar ações adicionais?"
options:
  - label: "Finalizar"
    description: "Salva o arquivo .tech.xml e encerra"
  - label: "Abrir para revisão"
    description: "Abre o arquivo gerado para edição"
multiSelect: false
```

## Regras de Ouro

1. **SEMPRE** executar `analyze_map.js` antes de sugerir IDs
2. **NUNCA** sugerir IDs em uso
3. **StateTeardown é OBRIGATÓRIO** - derivar do setup
4. **SEMPRE** incluir testes de regressão
5. Documentar propósito de CADA variável/switch

## Recursos

- Template: `.claude/templates/nsd-technical-analysis-template.xml`
- Scripts: `scripts/analyze_map.js`, `scripts/find_free_ids.js`
