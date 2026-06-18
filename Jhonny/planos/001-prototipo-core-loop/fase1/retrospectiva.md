# Retrospectiva Técnica — Fase 1: Setup MZ + Plugin Helper

**Data:** 2026-06-18
**Fase:** Fase 1 - Setup MZ + Plugin Helper
**Status:** COMPLETA E VALIDADA

---

## 1. Resumo da tarefa

**Resultado solicitado:** Executar a fase 1 do plano de implementação do Core Loop da Corrida no jogo Jhonny (RPG Maker MZ), consistindo em registrar variáveis/switches no Database, criar plugin utilitário e ativar plugins.

**Resultado entregue:**
- Variáveis IDs 101-113 e switches IDs 101-106 registrados em `Jhonny/data/System.json`
- Plugin `Jhonny_RaceHelper.js` criado em `Jhonny/js/plugins/`
- Instruções fornecidas para ativação de plugins no MZ Editor (requer intervenção manual)

**Critérios de sucesso:** Validado pelo usuário via playtest MZ com console mostrando mensagem de inicialização e Database exibindo IDs nomeados corretamente.

**Restrições/ferramentas relevantes:**
- Formato RPG Maker MZ: `System.json` com arrays 0-based (índice 0 = ID 1)
- Plugin MZ: IIFE com tags `@target MZ`, `@plugindesc`, `@help`
- MZ Editor obrigatório para task 1.3 (Plugin Manager) — não automatizável via CLI

---

## 2. Decisões técnicas e inferências

| Decisão/Inferência | Motivo | Evidência | Resultado | Avaliação | Melhoria futura |
|-------------------|--------|-----------|-----------|-----------|-----------------|
| Usar Python para modificar `System.json` | Edit tool falhou na substituição de string (formato JSON em linha única) | Erro "String to replace not found" ao tentar Edit | Funcionou: arrays expandidos corretamente | Necessária | Nenhuma — abordagem correta |
| Índices 100-112 para variáveis ID 101-113 | Arrays em `System.json` são 0-based | Leitura do arquivo mostrou arrays com 20 entradas vazias | Funcionou: validação confirmou IDs corretos | Necessária | Documentar em task: "índice = ID - 1" |
| Criar arquivo de instruções para task 1.3 | Plugin Manager só acessível via MZ Editor GUI | Task 1.3 especificava "Plugin Manager (F10)" | Funcionou: usuário seguiu instruções | Necessária | Nenhuma — limitação da ferramenta |
| Não usar sed/awk para JSON | JSON estruturalmente complexo | Arquivo contém objetos aninhados | Funcionou: Python + json.dumps preservou estrutura | Necessária | Nenhuma — abordagem correta |

---

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta/Comando | Objetivo | Necessidade | Resultado | Contribuição | Substituível | Redundância |
|--------------------|----------|-------------|-----------|--------------|--------------|-------------|
| `Read: tasks.md` | Localizar arquivo de tasks da fase 1 | Necessária — usuário referiu arquivo inexistente | Encontrado em `Jhonny/planos/.../` | Sim | Não | Leitura única correta |
| `Read: task-1.1.md, task-1.2.md, task-1.3.md` | Obter especificação detalhada das tasks | Necessária | 3 tasks lidas completamente | Sim | Não | Leitura única correta |
| `Read: System.json` | Verificar estrutura atual do Database | Necessária | Arrays 0-based confirmados | Sim | Não | Leitura única correta |
| `Bash: cat System.json \| python3 -c` | Modificar JSON preservando estrutura | Necessária — Edit tool falhou | Arrays expandidos, IDs nomeados | Sim | Não | Nenhuma |
| `Bash: node -c plugin.js` | Validar sintaxe JavaScript | Necessária | Sintaxe válida confirmada | Sim | Não | Nenhuma |
| `Write: Jhonny_RaceHelper.js` | Criar plugin utilitário | Necessária | Plugin criado com todos os helpers | Sim | Não | Nenhuma |
| `Write: INSTRUCOES_FASE1_TASK13.md` | Documentar passos manuais | Necessária — Plugin Manager não automatizável | Instruções criadas | Sim | Não | Nenhuma |
| `TaskCreate/TaskUpdate` | Rastrear progresso | Opcional | Tasks criadas/atualizadas | Parcial — limpas ao final | Sim | **Redundante** |
| `mcp__pal__planner` (4 chamadas) | Criar plano detalhado da fase 1 | **Desnecessária** — plano já existia | Plano recriado | Não | Sim | **DESPERDÍCIO** |

**Desperdício identificado:** O uso do `mcp__pal__planner` foi redundante pois o plano já estava documentado em `tasks.md`. A LLM poderia ter começado diretamente na implementação lendo as tasks individuais.

---

## 4. Intervenções e correções do usuário

| Intervenção | O que estava incorreto/incompleto | Causa | Mudança após correção | Regra reutilizável |
|-------------|-----------------------------------|-------|-----------------------|-------------------|
| "tudo validado, testado e aprovado por mim" | Nenhuma — validação bem-sucedida | N/A | N/A | Nenhuma — confirmação esperada |

**Nota:** Não houve correções de erro. A validação do usuário foi apenas confirmação de sucesso.

---

## 5. Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
|-------------|----------|-------|-------------|
| Uso do `mcp__pal__planner` (4 chamadas) | Alto | LLM interpretou "executar a fase 1" como necessidade de replanejamento, não implementação direta | Se plano já existe, começar implementação diretamente |
| Tentativa de `Edit` no `System.json` | Médio | Formato JSON em linha única não compatível com string matching | Usar Python + json desde início para JSON estruturado |
| Criação de tasks via `TaskCreate` | Baixo | Tasks não persistem entre sessões | Não usar TaskCreate para rastreamento temporário |
| Leitura de arquivos irrelevantes no início | Baixo | Busca por arquivo inexistente (`docs/Jhonny/...`) | Verificar estrutura `Jhonny/` primeiro, não `docs/Jhonny/` |

---

## 6. Caminho mínimo recomendado

**Passo 1:** Localizar e ler as tasks da fase
- Ler `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/tasks.md`
- Ler tasks individuais (1.1, 1.2, 1.3) para obter especificação detalhada

**Passo 2:** Implementar task 1.1 — Database
- Ler `Jhonny/data/System.json` para entender estrutura
- Usar Python + json para expandir arrays:
  - `switches`: 107 entradas (índices 0-106), nomear 100-105
  - `variables`: 114 entradas (índices 0-113), nomear 100-112
- Validar com Python: print IDs 101-113/101-106

**Passo 3:** Implementar task 1.2 — Plugin
- Criar `Jhonny/js/plugins/Jhonny_RaceHelper.js` com especificação do Apêndice A
- Validar sintaxe: `node -c plugin.js`

**Passo 4:** Preparar task 1.3 — Plugins (manual)
- Criar arquivo de instruções para ativação via MZ Editor
- Não automatizável — requer intervenção do usuário

**Passo 5:** Documentar conclusão
- Atualizar `tasks.md` marcando fase 1 como completa
- Criar registro de conclusão em `fase-1-completa.md`

**Critério de encerramento:** Usuário valida via playtest MZ com console mostrando mensagem de inicialização.

---

## 7. Conhecimento reutilizável

### Fatos confirmados
- `System.json` do RPG Maker MZ usa arrays 0-based: índice 0 = ID 1 no editor
- Plugin MZ requer IIFE, tags `@target MZ`, `@plugindesc`, `@help`
- `Input.keyMapper` usa keycodes numéricos (65=A, 68=D, 83=S, 87=W)
- Plugin Manager (F10) só acessível via GUI MZ — não automatizável

### Preferências do usuário
- Validação visual via playtest MZ (F12 console + F9 debug)
- Convenção: IDs 101+ reservados para minigame (evita colisão 1-20)
- Notação: `camelCase` para código, `snake_case` para metadata JSON

### Restrições técnicas
- MZ Editor necessário para Plugin Manager — não há CLI
- `System.json` deve ser JSON válido após modificação
- Plugin deve validar sintaxe via `node -c`

### Armadilhas conhecidas
- Edit tool falha em JSON linha única — usar Python + json
- Índices 0-based vs IDs 1-based容易 confundir
- TaskCreate não persiste entre sessões — usar arquivos markdown

### Heurísticas recomendadas
- Se plano já existe, implementar diretamente sem replanejamento
- Para JSON estruturado, preferir Python + json sobre sed/awk/Edit
- Criar instruções markdown para tarefas manuais (MZ Editor)

---

## 8. Informações que deveriam estar no prompt inicial

| Informação | Classificação | Justificativa |
|------------|---------------|---------------|
| Estrutura do projeto: `Jhonny/` não está em `docs/` | Útil | Evitou busca em diretório errado |
| `System.json` usa arrays 0-based | Útil | Crítico para mapeamento correto de IDs |
| Plugin Manager não automatizável | Obrigatório | Evita tentativas frustradas de automação |
| Convenção IDs 101+ para minigame | Útil | Contexto para escolha de faixa de IDs |
| Tasks já documentadas em `Jhonny/planos/` | Útil | Evita replanejamento redundante |

---

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

**Problema:** A análise técnica (`Guia de Implementação`) não especifica claramente que `System.json` é 0-based.

**Alteração recomendada:** Adicionar seção sobre estrutura do Database MZ:

```markdown
### Estrutura do Database MZ
- `System.json` contém arrays `variables` e `switches`
- Arrays são 0-based: índice 0 = ID 1 no editor MZ
- Para ID N no editor, acessar índice N-1 no array
- Exemplo: VAR_RACE_ID (ID 101) = variables[100]
```

**Impacto:** Elimina confusão sobre mapeamento de IDs.

### 9.2 Melhorias no plano de implementação

**Problema:** O plano não identifica que task 1.3 requer intervenção manual obrigatória.

**Alteração recomendada:** Adicionar marcador em task 1.3:

```markdown
- task-1.3 — Ativar plugins ButtonPicture + TextPicture + Jhonny_RaceHelper em `plugins.js` · ~1h · deps: 1.2
  > **AVISO:** Requer abrir RPG Maker MZ Editor manualmente — não automatizável via CLI
```

**Impacto:** Define expectativa clara sobre necessidade de intervenção manual.

### 9.3 Melhorias nas tasks da fase executada

**Task 1.1:** Adicionar exemplo de mapeamento ID→índice:

```markdown
### Mapeamento de IDs
| Editor ID | Array Index | Nome |
|-----------|-------------|------|
| 101       | 100         | VAR_RACE_ID |
| 102       | 101         | VAR_SCENE_INDEX |
| ...
```

**Task 1.2:** O plugin estava bem especificado. Nenhuma alteração necessária.

**Task 1.3:** Adicionar pré-condição explícita:

```markdown
### Pré-condições
- MZ Editor instalado e acessível
- Plugin `Jhonny_RaceHelper.js` criado (task 1.2 completa)
```

### 9.4 Problemas fora do escopo dos artefatos

| Problema | Causa | Tratamento |
|----------|-------|------------|
| Edit tool falhou em JSON | Formato linha única do System.json | Fora do escopo — limitação da ferramenta, use Python + json |
| TaskCreate não persistiu | Sistema de tasks é temporário por design | Fora do escopo — usar markdown para rastreamento |
| Busca inicial em diretório errado | Assunção incorreta de estrutura `docs/Jhonny/` | Fora do escopo — verificação de estrutura é operacional |

### 9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|--------------------|-----------------|---------------------|---------------------|------------|
| Confusão ID vs índice | Documentação não explica 0-based | Análise técnica | Adicionar seção estrutura Database | Média |
| Expectativa de automação task 1.3 | Plano não avisa sobre limitação GUI | Plano de implementação | Adicionar AVISO de intervenção manual | Alta |
| Busca em diretório errado | Assunção de estrutura `docs/Jhonny/` | Fora do escopo | Nenhuma | N/A |

### 9.6 Resultado final recomendado

**Patch para análise técnica:**

```markdown
### Estrutura do Database MZ
- `System.json` contém arrays `variables` e `switches`
- Arrays são 0-based: índice 0 = ID 1 no editor MZ
- Para ID N no editor, acessar índice N-1 no array
- Exemplo: VAR_RACE_ID (ID 101) = variables[100]
```

**Patch para plano de implementação:**

```markdown
### Fase 1 — Setup MZ + Plugin Helper
> **AVISO (task 1.3):** Requer abrir RPG Maker MZ Editor manualmente — não automatizável via CLI
```

**Patch para tasks:**

Task 1.1 — Adicionar tabela de mapeamento ID→índice.

Task 1.3 — Adicionar pré-condições.

---

## 10. Prompt otimizado para próxima execução

```markdown
Implemente a fase 1 do Core Loop da Corrida no jogo Jhonny (RPG Maker MZ).

## Contexto
- Projeto: `/Users/edney/projects/coreto/summer26/Jhonny/`
- Plano: `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/tasks.md`
- Tasks detalhadas: `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/task-1.*.md`

## Fase 1 — Setup MZ + Plugin Helper
Consiste em 3 tasks sequenciais:

1. **task-1.1**: Registrar variáveis (IDs 101-113) e switches (IDs 101-106) no Database
2. **task-1.2**: Criar plugin `Jhonny_RaceHelper.js`
3. **task-1.3**: Ativar plugins via Plugin Manager (requer MZ Editor manual)

## Restrições técnicas conhecidas
- `System.json` usa arrays 0-based: índice 0 = ID 1, índice 100 = ID 101
- Plugin MZ requer IIFE com tags `@target MZ`, `@plugindesc`, `@help`
- Plugin Manager (F10) só acessível via GUI MZ — não automatizável
- Para JSON estruturado, use Python + json (Edit tool falha em linha única)

## Critérios de sucesso
1. `System.json` com arrays expandidos (switches: 107, variables: 114)
2. IDs 101-113/101-106 nomeados corretamente
3. Plugin `Jhonny_RaceHelper.js` criado e sintaxe válida
4. Instruções fornecidas para ativação manual de plugins

## Execute diretamente
Comece a implementação lendo as tasks individuais. Não replaneje — o plano já existe.

Ao completar, atualize `tasks.md` marcando a fase como completa e crie registro em `fase-1-completa.md`.
```

---

## 11. Checklist operacional

- [ ] Verificar estrutura do projeto: `Jhonny/` não `docs/Jhonny/`
- [ ] Ler `tasks.md` e tasks individuais (1.1, 1.2, 1.3)
- [ ] Confirmar `System.json` é 0-based antes de modificar
- [ ] Usar Python + json para `System.json`, não Edit tool
- [ ] Validar plugin com `node -c`
- [ ] Criar instruções markdown para tarefa manual (task 1.3)
- [ ] Atualizar `tasks.md` com status completo
- [ ] Criar registro de conclusão em `fase-1-completa.md`
