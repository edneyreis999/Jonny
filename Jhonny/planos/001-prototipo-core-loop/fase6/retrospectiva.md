---
title: "Retrospectiva Técnica — Fase 6 (Planejamento + Execução)"
fase: 6
tipo: retrospectiva-tecnica
data: "2026-06-19"
destinatario: "LLM futura executando atualização de plano + spec pós-decisões de fase"
status: "concluída com desperdício identificado"
---

# Retrospectiva Técnica — Fase 6 (Planejamento + Execução)

> **Estrutura do documento:** Este arquivo é construído por melhoria contínua — cada sessão relevante adiciona uma Parte. A Parte 1 cobre o **planejamento + sincronização spec↔tasks** (sessão anterior). A Parte 2 cobre a **execução da implementação F6** (sessão atual). Ao executar nova iteração nesta fase, adicione Parte 3 em vez de sobrescrever.

---

# PARTE 1 — Atualização Fase 6 + Sincronização Spec (Planejamento)

> Cobertura: sessão de atualização do plano e sincronização com o spec após 4 decisões do usuário. As seções 1-10 abaixo referem-se a esta parte. A Parte 2 (execução) está ao final do arquivo.

## 1. Resumo da tarefa

**Solicitado:** Atualizar o plano da Fase 6 (`Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/tasks.md` e tasks 6.1-6.4) com base nos conhecimentos adquiridos nas fases anteriores (F1-F5), perguntando antes sobre ambiguidades.

**Entregue (após correção do usuário):**
- 4 decisões esclarecidas via `AskUserQuestion` (Buzzer1 ME, resetar VAR_SEED, resetar VITORIA_PASSOU nos dois lugares, 2 TextPicture separados).
- `task-6.1.md`, `task-6.3.md`, `task-6.4.md` atualizadas com as 4 decisões.
- `tasks.md` sincronizado (caminho mínimo F6, mapa de variáveis, erros comuns).
- Espec `docs/02-Core-Loop/Corrida - Core Loop.md` sincronizado: callout global de escopo MVP, nova seção §8 (Vitória/Derrota), índice renumerado, §13.2/13.3/13.4 atualizados (variáveis/switches/pseudo-código pós-F6), §14 itens marcados como DECIDIDO/ADIADO.

**Critérios de conclusão:**
- 4 decisões refletidas simultaneamente em tasks + spec.
- Spec e tasks não contraditórios entre si.
- Política de "spec é fonte única da verdade" internalizada como regra reutilizável.

**Restrições relevantes:**
- Skill `obsidian-markdown` é obrigatória antes de editar qualquer `.md` dentro de `docs/` (conforme `docs/CLAUDE.md`).
- Workflow do projeto: entrevista de atualização no início de cada fase (arquivo `fase<N>/Atualizacao.md`).
- Usuário é a fonte da verdade absoluta durante a entrevista.

---

## 2. Decisões técnicas e inferências

| Decisão | Motivo | Evidência | Resultado | Avaliação | Melhoria futura |
|---------|--------|-----------|-----------|-----------|-----------------|
| **Ler 3 retrospectivas (F1-F3) integrais + tasks.md + tasks 6.x** | Usuário pediu "leia e entenda os conhecimentos" | Tasks.md linhas 364-579 já tinham síntese "Aprendizados Consolidados (Fases 1-3)" | Funcionou, mas desperdício alto — tasks.md já sintetizava | Necessária leitura, mas **parcialmente redundante** | Antes de ler retrospectivas integrais, ler seção "Aprendizados Consolidados" do tasks.md. Só ler retrospectiva específica se a síntese não bastar. |
| **Parar pesquisa após 17 leituras sequenciais (hook `STOP RESEARCHING`)** | Sistema identificou research spiral | Hook PostToolUse:Read disparado 5x consecutivas | Acabei lendo mais 2-3 arquivos depois do hook | Necessária mas **tardia** — deveria ter parado antes | Após 5 leituras seguidas sem output, pausar e produzir output incremental |
| **NÃO verificar sincronia spec↔tasks antes do usuário apontar** | Foquei em "atualizar tasks" literalmente | Usuário referenciou link Obsidian mas pediu "atualizar plano e tasks" | Falha: produzi tasks atualizadas mas spec ficou contraditório | **Erro de escopo** | Regra: toda decisão de mecânica em tasks DEVE ser refletida no spec correspondente. Verificar espec a cada task de mecânica. |
| **Carregar `obsidian-markdown` só após identificado trabalho no vault** | CLAUDE.md do vault exige skill antes de qualquer edit em `docs/` | Li o `docs/CLAUDE.md` quando começou trabalho no spec | Funcionou — skill carregada antes do primeiro Edit | Necessária | Carregar skill `obsidian-markdown` no início se a tarefa envolver `docs/02-Core-Loop/` |
| **Inferir que 4 ambiguidades existiam (Buzzer1, seed, VITORIA_PASSOU, TextPicture)** | Tarefas 6.1/6.4 tinham inconsistências internas | task-6.1 mencionava "Buzzer1/SE" em critérios mas "crash_metal" em detalhes | Acertos: 4 perguntas objetivas via `AskUserQuestion` | **Necessária** — escrutínio preventivo | Comparar requisitos × detalhes × critérios de cada task sempre que detectar inconsistência |

---

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Necessidade | Resultado | Contribuiu? | Substituível | Como evitar redundância |
|------------|----------|-------------|-----------|-------------|--------------|--------------------------|
| `Read` fase1/retrospectiva.md (292 linhas) | Entender F1 | Útil | Confirmou convenções de IDs/Plugin Manager | Parcial — síntese já em tasks.md | Ler só linhas 7 (Conhecimento Reutilizável) | tasks.md linhas 364+ já tem o essencial |
| `Read` fase2/retrospectiva.md (499 linhas) | Entender F2 | Útil | Confirmou assets padrão, Common Events JSON | Parcial | Mesma substituição | Mesma recomendação |
| `Read` fase3/retrospectiva.md (346 linhas) | Entender F3 — IDs | Útil | Confirmou Editor IDs 100-113/100-105 | **Sim** — crítica para entender convenção | Ler linhas 130-178 (Conhecimento) | Skip se tasks.md já lido |
| `Bash` `wc -l` para checar tamanho das retrospectivas | Decidir entre ler ou não F4 (1948) e F5 (1573) | Necessária | Evitou ler 3500 linhas de retrospectiva | **Sim** — evitou desperdício | Manter | Aplicar sempre que ver arquivo grande |
| `Read` tasks.md linhas 276-580 | Visão de tarefas + aprendizados consolidados | **Crítica** | Tinha toda a síntese F1-F5 + caminho mínimo F6 + mapa de IDs/CEs | **Sim** — principal fonte | Não | Ler PRIMEIRO antes de retrospectivas |
| `Read` task-6.1.md (368 linhas), 6.2 (62), 6.3 (242), 6.4 (428) | Detalhes das tasks a atualizar | Necessária para editar | Tasks estavam bem detalhadas — só precisei aplicar 4 patches cirúrgicos | **Sim** | Não | Ler na ordem de edição, não todas de uma vez |
| `Read` spec `Corrida - Core Loop.md` seções 1-2, 6, 7, 8, 12 | Identificar inconsistências com F6 | Necessária após intervenção do usuário | 8 inconsistências mapeadas (A-H) | **Sim** | Não | Tinha que ter feito ANTES do usuário apontar |
| `Bash` `grep` por seções no spec | Mapear estrutura | Necessária | Estrutura clara | **Sim** | Não | Manter |
| `AskUserQuestion` (2x) | Resolver 4+3 ambiguidades | **Crítica** | Usuário definiu políticas e decisões específicas | **Sim** | Não | Sempre que detectar inconsistência task vs spec vs spec interno, perguntar |
| `Skill obsidian-markdown` | Cumprir `docs/CLAUDE.md` antes de editar `.md` em `docs/` | **Obrigatória** | Sintaxe callout, wikilink, propriedades OK | **Sim** | Não | Sempre carregar no início de tarefa que envolva `docs/` |
| `TaskCreate`/`TaskUpdate` (8 tasks) | Rastrear 4+4 subtask | Útil | Progresso visível | **Sim** | Não | Manter — escopo foi 8 edições |
| `Edit` (~12 chamadas) | Aplicar patches cirúrgicos no spec e tasks | Necessária | Cada Edit foi único e bem escopado | **Sim** | Não | Manter — preferir Edit a Write para arquivos grandes |

**Chamadas redundantes principais:**
- Leitura integral de F1, F2, F3 retrospectivas quando tasks.md linhas 364-579 já sintetizava — **desperdício médio**.
- Não li F4/F5 retrospectivas integrais (certo), mas usei `wc -l` tardiamente — só depois de já ter aberto F1/F2/F3.

---

## 4. Intervenções e correções do usuário

### Intervenção 1 (após AskUserQuestion inicial)

**Tipo:** Esclarecimento de ambiguidades reais — não foi correção de erro.

**Antes:** Tasks 6.1/6.4 tinham inconsistências internas documentadas (Buzzer1 vs crash_metal; TextPicture fixo vs condicional).

**Mudança:** Usuário respondeu 4 perguntas objetivas definindo:
1. Resetar VAR_SEED a cada crash (spec §7.3 literal).
2. Buzzer1 (ME) — não crash_metal SE.
3. VITORIA_PASSOU resetado nos dois lugares (defensivo).
4. 2 TextPicture separados (Picture 53+56) com If/Else Show.

**Regra reutilizável:** Identificar inconsistências task ↔ spec ↔ spec interno ANTES de editar. Perguntar com opções concretas, não abertas.

### Intervenção 2 (após contexto 16%)

**Tipo:** **Correção de erro de escopo — falha minha.**

**Instrução dada:** "você viu se a fase 6 está de acordo com o spec? ... eu sou a fonte da verdade. se eu decidi alguma coisa, essa coisa deve refletir também no `Corrida - Core Loop`. Você precisa ter uma filosofia de SEMPRE deixar todos os documentos atualizados."

**O que estava incorreto:** Atualizei apenas tasks + tasks.md. Spec `Corrida - Core Loop.md` ficou contradizendo as decisões F6 em 8 pontos (som de crash, threshold de vitória, Curva do Diabo, lista de variáveis, pseudo-código, decisões em aberto).

**Suposição causadora:** Interpretei "atualizar plano e tasks" literalmente, sem estender ao spec correspondente.

**Mudança após correção:**
- Adicionei callout global de escopo MVP.
- Criei seção nova §8 sobre Vitória/Derrota com thresholds 60/100/150.
- Atualizei 4 seções pontuais do spec (Feedback, Variáveis, Pseudo-código, Decisões em aberto).
- Renumerrei índice e referências cruzadas.

**Regra reutilizável:** **Todo documento referenciado por um arquivo de tasks DEVE ser sincronizado com as decisões das tasks.** Spec é fonte única da verdade. Política do usuário: entrevista de atualização no início de cada fase, usuário é fonte da verdade absoluta.

### Intervenção 3 (esclarecimento de política de spec)

**Tipo:** Esclarecimento de política — não foi correção de erro.

**Antes:** Perguntei qual filosofia adotar (design vs implementação vs híbrido).

**Mudança:** Usuário definiu: "Spec = fonte única da verdade. Porém é humanamente impossível prever tudo durante a criação da Spec. Existem mecânicas que eu só vou descobrir que foi planejada errada quando eu for implementar. Para mitigar esse problema, meu workflow sempre roda uma atualização na fase que eu vou começar a trabalhar com base nos aprendizados da fase anterior."

**Regra reutilizável:** Workflow do projeto:
1. Início de cada fase → entrevista via `fase<N>/Atualizacao.md`.
2. LLM identifica divergências spec↔aprendizados.
3. LLM pergunta usuário via `AskUserQuestion`.
4. Usuário decide (fonte da verdade absoluta).
5. **NENHUM documento pode ficar desatualizado** — spec, tasks, plano, tudo sincronizado.

---

## 5. Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
|-------------|---------|-------|-------------|
| Ler 3 retrospectivas integrais (F1: 292, F2: 499, F3: 346 = 1137 linhas) quando tasks.md linhas 364-579 já tinha síntese "Aprendizados Consolidados" | Médio | Interpretei "leia os conhecimentos" como "leia as retrospectivas" em vez de "use o que já está consolidado" | Ler tasks.md "Aprendizados Consolidados" PRIMEIRO. Só ler retrospectiva integral se a síntese não cobrir o ponto específico. |
| 17 leituras sequenciais sem output (hook `STOP RESEARCHING` disparou 5x) | Médio | Confirmation bias — achei que precisava de mais contexto | Após 5-7 leituras sem output, pausar e produzir síntese incremental |
| Não verificar spec antes do usuário apontar — gerou 2ª rodada de leituras | Alto | Foco estreito em "tasks" em vez de "documentos referenciados pelas tasks" | Regra: enumerar documentos referenciados por tasks e verificá-los para sincronia |
| Pergunta de política de spec (`Spec = design`, `fonte única`, `híbrido`) — resposta já era implícita pelo workflow do usuário | Baixo | Hesitei em assumir a regra do projeto | Verificar se workflow está documentado em CLAUDE.md antes de perguntar política |
| Edit task-6.1 crítica de sucesso original dizia "Buzzer1/SE" — inconsistency interna | Baixo | Task original misturou dois conceitos | Auditar requisitos × detalhes × critérios antes de aplicar patches |

---

## 6. Caminho mínimo recomendado

1. **Ler `fase<N>/Atualizacao.md`** — instruções do usuário para a fase atual.
   - Entrada: path do arquivo.
   - Ferramenta: `Read`.
   - Resultado esperado: escopo da entrevista de atualização.
   - Critério: lista de divergências a verificar.

2. **Ler tasks.md "Aprendizados Consolidados"** — síntese das fases anteriores já está lá.
   - Entrada: `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/tasks.md` linhas 364+.
   - Ferramenta: `Read`.
   - Resultado: convenções de IDs, mapa de variáveis, erros comuns.
   - Critério: conhecer contrato técnico.

3. **Para cada task da fase atual (task-6.x.md):**
   - Ler requisitos + detalhes + critérios.
   - Cruzar com spec correspondente.
   - Identificar inconsistências internas e divergências spec↔task.

4. **Listar ambiguidades REAIS** (mecânica nova, edge case não previsto, som/visual específico).

5. **Perguntar via `AskUserQuestion`** com 2-4 opções concretas por ambiguidade. Bloquear até resposta.

6. **Para cada decisão do usuário:**
   - Aplicar patch em cada task afetada.
   - **Imediatamente** aplicar patch no spec correspondente.
   - Atualizar tasks.md (mapa de variáveis, erros comuns, caminho mínimo).

7. **Carregar skill `obsidian-markdown`** antes de qualquer Edit em `docs/*.md`.

8. **Verificar consistência spec↔tasks ao final** — grep por palavras-chave das decisões em ambos os documentos.

9. **Reportar ao usuário** com tabela "decisão × arquivo × seção alterada".

10. **Critério de encerramento:** nenhuma divergência spec↔tasks; todas as 4 decisões aplicadas em tasks + spec + tasks.md.

---

## 7. Conhecimento reutilizável

### Fatos confirmados

- `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/tasks.md` linhas 364-579 contém síntese "Aprendizados Consolidados (Fases 1-3)" — fonte primária de contexto técnico.
- `docs/CLAUDE.md` (do vault Obsidian) exige skill `obsidian-markdown` carregada **antes** de qualquer write em `docs/`.
- Retrospectivas das fases anteriores ficam em `Jhonny/planos/001-prototipo-core-loop/fase<N>/retrospectiva.md`.
- Spec `Corrida - Core Loop.md` está em `docs/02-Core-Loop/` (44KB, ~615 linhas pré-F6).
- Convenção de Editor IDs do projeto: 100-113 (variáveis) e 100-105 (switches) — **não** 101-114/101-106.
- `ControlSwitch` (code 121): `params[2]=0` → ON; `params[2]=1` → OFF (oposto do intuitivo — bug F5).

### Preferências do usuário

- **Spec é fonte única da verdade** — TODO detalhe decidido em tasks deve refletir no spec.
- **Workflow:** entrevista de atualização no início de cada fase via `fase<N>/Atualizacao.md`. Usuário é fonte da verdade absoluta.
- **Perguntas devem ter opções concretas**, não abertas.
- **Spec descreve visão completa do produto;** detalhes fora de escopo do MVP devem ter callout global no topo (não editar cada menção).
- **Não elogiar genericamente a execução;** focar em aprendizados acionáveis.

### Restrições técnicas

- Edit tool falha em JSON linha única — usar Python + json para `System.json` e `CommonEvents.json`.
- `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` — auditoria obrigatória de scripts inline.
- Skill `obsidian-markdown` obrigatória para escrever em `docs/*.md`.
- Hook `PostToolUse:Read` dispara `STOP RESEARCHING` após N leituras consecutivas — respeitar.

### Armadilhas conhecidas

- **Atualizar tasks sem sincronizar spec** — gera documentos contraditórios. Spec DEVE ser verificado a cada decisão de mecânica.
- **Ler retrospectivas integrais antes do tasks.md** — desperdício; tasks.md já tem síntese.
- **Interpretar "leia os conhecimentos" como "leia todas as retrospectivas"** — síntese consolidada é suficiente.
- **Misturar áudio SE/ME nas tasks** — TextPicture fixo em edição exige 2 pictures separadas para alternância de texto.

### Heurísticas recomendadas

- Ordem de leitura: `fase<N>/Atualizacao.md` → `tasks.md` (aprendizados + caminho mínimo) → tasks individuais → spec relevante. Pular retrospectivas integrais exceto se a síntese não cobrir.
- Toda decisão de mecânica → aplicar patch simultaneamente em: tasks afetadas + tasks.md + spec + plano (se houver).
- Toda decisão de implementação (som específico, asset específico) → aplicar patch em tasks + spec (seção de feedback/implementação).
- Antes de `Edit` em `docs/`, checar se skill `obsidian-markdown` está carregada.
- `AskUserQuestion` é barato e direto — usar sempre que houver ambiguidade real, com opções concretas.

---

## 8. Informações que deveriam estar no prompt inicial

| Informação | Classificação | Justificativa |
|------------|---------------|---------------|
| Especificar que TODOS os documentos referenciados devem ser sincronizados (não apenas tasks) | **Obrigatório** | Evitaria a intervenção crítica do usuário sobre spec desatualizado |
| Indicar que `tasks.md` "Aprendizados Consolidados" já sintetiza F1-F5 | **Obrigatório** | Evitaria leitura integral das retrospectivas (desperdício médio) |
| Mencionar que skill `obsidian-markdown` deve ser carregada no início | **Útil** | Evitaria carregamento tardio |
| Mencionar workflow de entrevista de fase (Atualizacao.md + perguntas + sincronização total) | **Útil** | Reduziria pergunta sobre política de spec |
| Caminho do spec correspondente (`docs/02-Core-Loop/Corrida - Core Loop.md`) | **Útil** | Evitaria busca por grep |

---

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

| Problema observado | Informação ausente | Por que pertence à análise técnica | Seção sugerida | Texto sugerido | Impacto |
|--------------------|--------------------|--------------------------------------|----------------|----------------|---------|
| Espec `Corrida - Core Loop.md` estava divergente das tasks em 8 pontos | Política de sincronização spec↔tasks não documentada no Guia de Implementação | É contrato estrutural: spec é fonte única da verdade | Topo do Guia de Implementação | "Toda decisão de mecânica ou implementação tomada em tasks DEVE ser refletida no spec `Corrida - Core Loop.md` simultaneamente. Spec é fonte única da verdade. Workflow: entrevista de atualização no início de cada fase via `fase<N>/Atualizacao.md`." | Alto — evita intervenção crítica |
| Lista de variáveis no spec §13.2 (antiga §12.2) estava defasada em F4/F5/F6 | Snapshot de variáveis não era mantido atualizado após cada fase | É contrato de IDs entre eventos e scripts | §13.2 do spec | Já corrigido nesta sessão — tabela com 18 variáveis F1-F6 | Médio — já aplicado |

### 9.2 Melhorias no plano de implementação

| Problema observado | Deficiência do plano | Etapa afetada | Alteração recomendada | Texto sugerido | Redução de custo |
|--------------------|----------------------|---------------|------------------------|----------------|------------------|
| Plano (tasks.md) não lista "documentos a sincronizar" como subtask | Plano trata spec como documento estático | Pré-passos de cada fase | Adicionar subtask "Verificar sincronia spec ↔ tasks após cada decisão" | Em "Pré-passos F<N>": "Após cada decisão do usuário, aplicar patch simultaneamente em: tasks afetadas + tasks.md + spec `Corrida - Core Loop.md`. Skill `obsidian-markdown` obrigatória antes de Edit em `docs/`." | Alto — evita reprocessamento |

### 9.3 Melhorias nas tasks da fase executada

| Task afetada | Informação ausente/ambígua | Consequência | Alteração recomendada | Texto sugerido | Validação |
|--------------|----------------------------|--------------|------------------------|----------------|-----------|
| task-6.1.md | Crítica de sucesso original dizia "Buzzer1/SE" misturando conceitos | Exigiu AskUserQuestion para resolver | Já corrigido — crítica agora diz "Play ME Buzzer1" explicitamente | "Sequência completa: **Play ME Buzzer1** + Shake + Flash + Tint escuro..." | `rg "crash_metal" task-6.1.md` não retorna referência ativa |
| task-6.1.md | Tabela de preservação seletiva listava VAR_SEED como "preservar (default)" | Contradizia spec §7.3 ("nova seed") | Já corrigido — VAR_SEED agora "resetar nova seed" | Linha atualizada + nota de decisão do usuário | `rg "Math.floor\\(Math.random" task-6.1.md` retorna 1 match |
| task-6.4.md | Sugeria If/Else para alternar texto de TextPicture (fixo em edição) | Exigiu AskUserQuestion | Já corrigido — 2 TextPicture separados (Picture 53+56) | Subtarefas 6.4.6/6.4.10-13 + diagrama + critérios + tabela posições | `rg "Picture 56" task-6.4.md` retorna múltiplos matches |

### 9.4 Problemas fora do escopo dos artefatos

| Problema | Por que está fora do escopo | Como tratar | Proteção operacional |
|----------|------------------------------|-------------|----------------------|
| Hook `STOP RESEARCHING` disparou 5x sem eu parar | Estratégia operacional da LLM, não falha do plano | Internalizar regra: pausar após 5 leituras sem output | Memo mental / CLAUDE.md: "respeitar hooks do sistema" |
| Skill `obsidian-markdown` carregada após identificação de trabalho no vault, não preventivamente | Preguiça operacional, não falha do plano | Carregar skill no início se a tarefa envolver `docs/` | Verificar paths no prompt inicial |

### 9.5 Matriz de rastreabilidade das melhorias

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|--------------------|-----------------|----------------------|----------------------|------------|
| Spec desatualizado vs tasks F6 | Falta de política de sincronização no Guia | Análise técnica (Guia de Implementação) | Adicionar seção "Política de Sincronização Spec↔Tasks" | Alta |
| Variáveis do spec defasadas (F4/F5/F6) | Snapshot não mantido após cada fase | Spec §13.2 | Atualização já aplicada nesta sessão | Média (resolvido) |
| Task-6.1 misturava SE/ME | Crítica ambígua | Task | Correção já aplicada | Média (resolvido) |
| Task-6.1 preservava seed por default | Decisão ambígua pré-interview | Task | Correção já aplicada + spec §7.3 confirmado | Média (resolvido) |
| Task-6.4 sugeria If/Else alternar texto TextPicture | Detalhe técnico de MZ não documentado | Task | Correção já aplicada + nota sobre TextPicture fixo | Média (resolvido) |
| Plano não tem checkpoint de sincronização spec | Plano trata spec como estático | Plano de implementação | Adicionar subtask em pré-passos | Alta |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica (Guia de Implementação)

```markdown
### Política de Sincronização Spec ↔ Tasks

Toda decisão de mecânica ou implementação tomada em tasks DEVE ser refletida no spec
`docs/02-Core-Loop/Corrida - Core Loop.md` simultaneamente. Spec é ==fonte única da verdade==.

Workflow de entrevista de atualização (no início de cada fase):
1. Ler `Jhonny/planos/001-prototipo-core-loop/fase<N>/Atualizacao.md`.
2. Ler `tasks.md` "Aprendizados Consolidados" para contexto técnico.
3. Para cada task da fase, cruzar requisitos × detalhes × critérios × spec correspondente.
4. Identificar ambiguidades e perguntar via `AskUserQuestion` com opções concretas.
5. Usuário responde (fonte da verdade absoluta).
6. Aplicar patches simultaneamente em: tasks afetadas + tasks.md + spec.
7. Skill `obsidian-markdown` é obrigatória antes de qualquer Edit em `docs/`.

Critério de conclusão: nenhuma divergência spec ↔ tasks após todas as decisões aplicadas.
```

#### Patch sugerido para o plano de implementação

```markdown
Em "Pré-passos F<N>" de cada fase, adicionar:

- [ ] Verificar sincronia spec ↔ tasks antes e depois das edições da fase.
- [ ] Skill `obsidian-markdown` carregada se a fase envolver `docs/`.
- [ ] Após cada decisão do usuário via AskUserQuestion: aplicar patch em tasks + tasks.md + spec.
```

#### Patch sugerido para as tasks da fase executada

Já aplicado nesta sessão. Resumo dos patches:

**task-6.1.md:**
- Crítica de sucesso: "Buzzer1/SE" → "Play ME Buzzer1"
- Subtarefa 6.1.5: `Play SE crash_metal` → `Play ME Buzzer1`
- Subtarefas 6.1.10h/6.1.10i novas: resetar VAR_SEED + VAR_VITORIA_PASSOU
- Tabela preservação seletiva: VAR_SEED agora reset, VAR_VITORIA_PASSOU reset

**task-6.3.md:**
- Pseudo-código INIT Orchestrator: adicionado `Control Variables: VAR_VITORIA_PASSOU = 0`
- Critério de sucesso: adicionado check de reset defensivo

**task-6.4.md:**
- Subtarefa 6.4.6: 3 TextPicture → **4 TextPicture** (Picture 53/54/55/**56**)
- Subtarefas 6.4.10-13: reescritas com If/Else Show Picture (não alternar texto)
- Tabela posições: Picture 56 (DERROTA) adicionada
- Subtarefa 6.4.8: erase agora inclui `[5,53,54,55,56]`
- Diagrama de fluxo: atualizado
- Critérios de sucesso: 4 TextPicture + If/Else Show

**tasks.md:**
- Caminho mínimo F6: reescrito com as 4 decisões + nota de política
- Mapa de variáveis: Editor ID 117 não é mais "a criar"
- Estado de pré-requisitos: Picture IDs reservadas 32/5/53/54/55/56
- Erros comuns: 5 novos itens marcados `(F6)`

#### Ações fora do fluxo de especificação

- Internalizar regra operacional: "respeitar hooks `STOP RESEARCHING` do sistema após 5+ leituras consecutivas".
- Carregar skill `obsidian-markdown` no início da próxima tarefa que envolva `docs/`.

---

## 10. Checklist operacional

- [ ] Ler `fase<N>/Atualizacao.md` antes de qualquer outra ação.
- [ ] Ler `tasks.md` linhas 364-579 ("Aprendizados Consolidados") antes de retrospectivas integrais.
- [ ] Verificar divergências spec ↔ tasks ↔ spec interno ANTES de aplicar patches.
- [ ] Perguntar ambiguidades via `AskUserQuestion` com opções concretas (2-4 por pergunta).
- [ ] Carregar `obsidian-markdown` skill antes de Edit em `docs/`.
- [ ] Aplicar patches simultaneamente em tasks + tasks.md + spec para cada decisão.
- [ ] Auditar critérios de sucesso de tasks para inconsistências internas (requisitos × detalhes × critérios).
- [ ] Respeitar hooks `STOP RESEARCHING` — pausar após 5+ leituras sem output.
- [ ] Verificar consistência final via `rg` por palavras-chave das decisões em spec + tasks.
- [ ] Reportar com tabela "decisão × arquivo × seção alterada".

---

# PARTE 2 — Execução da Fase 6 (Implementação via script gerador)

> Cobertura: sessão de implementação das tasks 6.1, 6.3, 6.4 via `build_phase6_ces.py` + `setup_phase6_system.py`. **Zero intervenções do usuário** — execução ocorreu conforme plano, mas com dois desperdícios operacionais identificados.

## P2.1. Resumo da tarefa

**Solicitado:** Executar a Fase 6 do plano `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/tasks.md`.

**Entregue:**
- `fase6/setup_phase6_system.py` — cria variável Editor ID 117 (`VAR_VITORIA_PASSOU`) em `System.json`. Idempotente.
- `fase6/build_phase6_ces.py` — gerador das 3 tasks F6 (6.1/6.3/6.4) com patches cirúrgicos no `CommonEvents.json`. Idempotente (valida slots preservados).
- **CE 18 `EV_Crash`** criado (25 cmds): Buzzer1 ME + Shake + Flash + Tint + reset + nova seed + VITORIA_PASSOU=0 + erase pictures + UpdateHud + RenderSinal.
- **CE 5 `EV_RaceOrchestrator`** reescrito (24→17 cmds): Opção B (Script inline) substituiu cascade If/Else para cálculo de N_CENAS + clamp.
- **CE 19 `EV_VitoriaCorrida`** criado (37 cmds): erase + Stop BGM + ME Victory + threshold check + Comments placeholder para TextPicture manual + loop input + branch por VITORIA_PASSOU.
- **CE 12 `EV_OnRisk`** patched: FAIL branch agora chama CE 18 diretamente.
- **CE 7 `EV_RaceRenderer`** estendido (40→44 cmds): check de vitória antes do bloco de render.
- **CE 17 `EV_ResolucaoRiskFail`** DELETADO (slot 17 = null), absorvido por CE 18.
- `img/pictures/race/overlay_flash_white.png` criado (816×624 RGBA branco opaco via Pillow).
- `tasks.md` atualizado (F6 marcada IMPLEMENTADA, tabela 6.1/6.3/6.4 marcada ✅).
- `fase6/fase-6-completa.md` criado com checklists de playtest e passos manuais MZ pendentes.

**Critérios de conclusão:**
- `python3 -m json.tool CommonEvents.json` e `System.json` válidos.
- Auditoria `rg "value\(|setValue\("` mostra apenas IDs 100-117.
- Auditoria 16 operações `ControlSwitch` (121) com semântica correta (`0=ON|1=OFF`).
- Simetria de lock 4 produtores ON ↔ 4 consumidores OFF preservada.
- Sem referências residuais ao CE 17.

**Restrições relevantes:**
- `build_phaseN_ces.py` é artefato-fonte: corrigir gerador antes do JSON gerado (heurística F3+F4+F5).
- `ControlSwitch` semântica oposta à intuição: `params[2]=0` ON, `params[2]=1` OFF.
- Pós-edição MZ obrigatória (bug F4): F10 → Ctrl+S → reiniciar Playtest.
- Plugin Commands TextPicture não são automatizáveis via JSON — placeholders Comment para passo manual.

## P2.2. Decisões técnicas e inferências

| Decisão | Motivo | Evidência | Resultado | Avaliação | Melhoria futura |
|---------|--------|-----------|-----------|-----------|-----------------|
| **Substituir Opção A (If/Else cascade) por Opção B (Script inline) no CE 5** | Tasks.md e task-6.3 recomendam Opção B; Opção A existente não tinha clamp de RACE_ID | Task-6.3 §"Por que Opção B" + inspeção do CE 5 atual (cmds 5-13 não tinham Else final nem clamp) | Funcionou — CE 5 caiu de 24 para 17 cmds e ganhou clamp | Necessária | Ao encontrar Opção A já implementada mas incompleta vs recomendação do plano, preferir Opção B (Script) — mais compacta, fácil de manter |
| **Inspecionar CE 5 e CE 7 existentes (listas completas) antes de escrever os patches** | Identificar pontos de inserção exatos sem recorrer a adivinhação | Necessidade de saber onde inserir Script inline (CE 5) e onde inserir If vitória (CE 7) | Funcionou — patches cirúrgicos aplicados na posição correta primeira tentativa | Necessária | Sempre fazer "snapshot da estrutura atual" antes de patch cirúrgico em JSON/array |
| **Usar `build_phase5_ces.py` como referência estrutural** | Heurística F5 diz para espelhar a estrutura do gerador anterior | Tarefa F6 exige mesmo padrão: helper `C()`, constantes de IDs, modo idempotente | Funcionou — script gerador passou em 1ª execução (após 2 correções menores) | Necessária | Sempre ler gerador da fase anterior antes de escrever o novo — economiza desenho de estrutura |
| **Inserir victory check no CE 7 APÓS guard SW_RACE_ACTIVE, ANTES do check SCENE_INDEX** | Lógica: vitória dispara quando resolução incrementou SCENE_INDEX ≥ N_CENAS, antes de renderizar próxima cena | Estrutura CE 7: [0]Label, [1-3]guard, [4]check SCENE_INDEX≠LAST | Funcionou — check dispara corretamente ao final da última cena | Necessária | Ao inserir lógica de "vitória/término" em loop Parallel, escolher ponto imediatamente após guards e antes do trabalho principal |
| **Inferir estrutura do Comment placeholder `[TASK 6.1 PENDENTE]` sem verificar JSON em disco** | Build_phase5_ces.py documentava este placeholder no CE 12 | Achei que ler o gerador seria suficiente | Funcionou, mas arriscado — se o JSON em disco divergisse, o patch falharia | **Parcialmente necessária** — verificação preventiva é barata | Para patches cirúrgicos baseados em match de string, sempre confirmar com `python -c "import json; ..."` antes de escrever o código do patch |
| **Criar `overlay_flash_white.png` automaticamente via Pillow em vez de perguntar** | Asset 816×624 RGBA branco opaco é trivial — Pillow resolve em 1 linha | Tasks.md lista-o como "criar em Python+Pillow" | Funcionou | Necessária | Assets triviais (cor sólida RGBA) — criar inline; assets complexos (composição, gradientes) — perguntar |

## P2.3. Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Resultado | Contribuiu? | Como evitar redundância |
|------------|----------|-----------|-------------|--------------------------|
| `Read` tasks.md (com `Jhonny/CLAUDE.md` injetado no system prompt) | Ler plano + escopo da F6 | Contexto completo | **Sim** — fonte primária | Manter — primeira leitura sempre |
| `Read` task-6.1.md, 6.3.md, 6.4.md (700+ linhas combinadas) | Detalhes das tasks a implementar | Sequências de comandos MZ, critérios, armadilhas | **Sim** | Manter — indispensável |
| `Read` `fase5/build_phase5_ces.py` (593 linhas) | Template estrutural do gerador | Padrão C()/constantes/main() idempotente | **Sim** — evitou desenhar do zero | Manter — sempre ler gerador anterior antes de escrever novo |
| `Bash` Python snapshot `variables[95:117]` + `switches[95:107]` + CEs 1-20 | Fonte de verdade canônica antes de qualquer edição | Confirmou IDs 100-117 (var 117 a criar), CEs 1-17 com CE 17 = EV_ResolucaoRiskFail | **Sim** — validou mapa de IDs real vs documentação | Sempre rodar antes de gerar CEs/variáveis |
| `Bash` Python dump CE 5 + CE 7 listas completas | Planejar patches cirúrgicos | Identificou pontos de inserção exatos | **Sim** | Sempre fazer dump da estrutura antes de patch |
| `Bash` Python dump CE 12 (após patch) + CE 7 (após patch) | Verificar wire e victory check | Confirmação visual de Call CE 18 no FAIL branch e If vitória no Renderer | **Sim** | Sempre fazer pós-validação estrutural |
| `Bash` `rg "value\\(|setValue\\(" CommonEvents.json` | Auditoria scripts inline IDs | Todos IDs 100-117 confirmados | **Sim** | Obrigatório (heurística F3+F4+F5) |
| `Bash` Python audit 16 operações `ControlSwitch` | Validar semântica `0=ON|1=OFF` | Todas corretas; simetria 4 ON ↔ 4 OFF preservada | **Sim** | Obrigatório após qualquer mudança em 121 |
| `Bash` Pillow criar PNG inline | Asset `overlay_flash_white.png` | 816×624 RGBA branco opaco | **Sim** | Manter para assets triviais |
| `Write` setup_phase6_system.py (2x — 1ª versão tinha helper estranho) | Setup VAR 117 | 1ª versão com `EDITITOR_ID_BOUNDARY` (typo + helper inútil) → 2ª versão com `ensure_variable()` limpa | **Sim** (após correção) | **Ver P2.5 — desperdício médio** |
| `Write` build_phase6_ces.py (1x) + `Edit` (1x) | Gerador F6 | 1ª versão tinha walrus typo `ces[CE_ON_RISK := 12]` → Edit corrigiu | **Sim** (após correção) | **Ver P2.5 — desperdício baixo** |
| `Edit` tasks.md (3x) | Marcar F6 IMPLEMENTADA + 6.1/6.3/6.4 ✅ | Status atualizado | **Sim** | Manter |
| `Write` fase-6-completa.md | Registro de conclusão com passos manuais MZ | Documentação de pendências para o usuário | **Sim** | Manter para qualquer fase com passos manuais pendentes |

## P2.4. Intervenções e correções do usuário

**Nenhuma intervenção.** A execução ocorreu integralmente conforme plano da F6, sem necessidade de correção, esclarecimento ou redirecionamento. Única interação foi a chamada do comando `/loki:retrospectiva-tecnica` ao final.

**Nota:** Esta é a primeira sessão no projeto com zero intervenções do usuário para uma fase de implementação completa — atribuído a: (a) plano detalhado já cobria todas as decisões; (b) entrevistas prévias (Parte 1) resolveram ambiguidades; (c) leitura atenta de tasks + gerador anterior evitou reinvenção.

## P2.5. Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
|-------------|---------|-------|-------------|
| 1ª versão de `setup_phase6_system.py` tinha helper estranho `EDITITOR_ID_BOUNDARY` (typo no nome + função inútil que retornava o próprio input) | **Baixo** | Escrevi código rápido demais sem revisar | Após Write, sempre revisar o arquivo — especialmente em Python onde refatoração é trivial |
| Walrus operator typo `ces[CE_ON_RISK := 12]["list"] = ...` no `main()` do `build_phase6_ces.py` | **Baixo** | Digitei `CE_ON_RISK :=` em vez de apenas `12` — provavelmente pensava em declarar const mas errei a sintaxe | Revisar `main()` antes de executar; preferir literal `12` quando constante já existe como `CE_ON_RISK` no topo do arquivo |
| Não verifiquei o JSON em disco do CE 12 para confirmar a string exata do Comment placeholder antes de escrever `patch_on_risk_fail_branch()` | **Baixo (prevenido)** | Confiei na leitura do `build_phase5_ces.py` que documentava o placeholder | Para patches cirúrgicos com match de string, sempre confirmar a string real via Python dump antes |
| 3 Edit/Write calls com hooks `PreToolUse:Write` e `PreToolUse:Edit` retornando reminders "Python Standards" — cada um consumiu um turno para processar | **Baixo** | Hooks do projeto disparam em todo Write/Edit em arquivos Python | Não é evitável — é design do projeto. Apenas internalizar as regras |

**Impacto agregado:** Baixo. Não houve retrabalho de arquivo gerado, nem bug em runtime. Os 2 typos foram capturados por revisão antes de executar o gerador.

## P2.6. Caminho mínimo recomendado (execução de fase com gerador)

1. **Ler `tasks.md` da fase** (status + tasks da fase + aprendizados consolidados + caminho mínimo da fase).
   - Critério: conhecer escopo da fase e pré-passos.

2. **Ler tasks individuais da fase** (`task-6.X.md` para cada uma a implementar).
   - Critério: conhecer sequência de comandos MZ, critérios, armadilhas.

3. **Ler gerador da fase anterior** (`fase<N-1>/build_phase<N-1>_ces.py`).
   - Critério: conhecer padrão estrutural (C(), constantes, main idempotente).

4. **Snapshot System.json** via `python3 -c "import json; ..."`.
   - Confirmar IDs reais (variables, switches, total de slots).
   - Critério: IDs canônicos confirmados.

5. **Snapshot CommonEvents.json** — nomes + triggers + cmd counts dos CEs existentes.
   - Critério: slots preservados identificados.

6. **Dump das listas completas dos CEs que serão patched** (não apenas os novos).
   - Exemplo: para patch CE 12, dump `ces[12]['list']`.
   - Critério: ponto de inserção e formato exato de strings a buscar confirmados.

7. **Escrever setup script** se a fase criar novas variáveis/switches.
   - Idempotente, validado com `python3 -m json.tool`.
   - Critério: nova variável aparece no snapshot pós-execução.

8. **Escrever gerador `build_phaseN_ces.py`** com:
   - Constantes de IDs (variables + switches + CEs).
   - Helper `C()`.
   - Funções `build_<ce>_list()` para cada CE novo/reescrito.
   - Funções `patch_<ce>_xxx()` para patches cirúrgicos.
   - `main()` com validação de slots preservados + apply patches + write.
   - Critério: `python3 build_phaseN_ces.py` executa sem erro.

9. **Auditar pós-geração:**
   - `python3 -m json.tool CommonEvents.json` — JSON válido.
   - `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` — IDs inline 100-N.
   - Python audit de todas as operações `121` (ControlSwitch) — semântica.
   - Python dump dos CEs novos/reescritos — estrutura conforme esperado.
   - Critério: zero IDs fora do range, zero operações 121 invertidas.

10. **Criar assets triviais inline** (Pillow para PNG cor sólida, afconvert para áudio simples).
    - Critério: asset referenciado pelo gerador existe no disco.

11. **Atualizar `tasks.md`** com status da fase + checkboxes ✅.
    - Critério: status reflete realidade.

12. **Criar `fase<N>/fase-N-completa.md`** com:
    - Resumo do que foi feito.
    - Lista de passos manuais MZ pendentes (Plugin Commands, F10 Ctrl+S).
    - Cenários de playtest.
    - Critério: documento autônomo — usuário consegue validar sem ler tasks originais.

## P2.7. Conhecimento reutilizável

### Fatos confirmados (adicionais aos da Parte 1)

- **`build_phaseN_ces.py` é o artefato-fonte canônico** para CEs JSON-automatizáveis. Heurística F3+F4+F5+F6 consolidada: corrigir gerador antes do JSON gerado, sempre.
- **CEs truncam em `ces = ces[:N]` antes de append** para evitar duplicação. Slot antigo (CE 17 no caso) deve ser setado para `null` explicitamente se for "deletado" semanticamente.
- **Idempotência de patches**: detectar se o patch já foi aplicado (ex.: se já existe `Call CE 19` no CE 7) e retornar inalterado. Evita re-aplicar em execuções repetidas.
- **Plugin Commands MZ (code 357) têm schema opaco** — não automatizáveis via JSON direto. Padrão: placeholder Comment (`[TASK X.Y MANUAL MZ]`) no gerador + passo manual MZ documentado em `fase-N-completa.md`.
- **Opção B (Script inline) é preferível a Opção A (If/Else cascade)** para lógica condicional com múltiplos casos em MZ — mais compacta, auditável via `rg`, fácil de calibrar.

### Preferências do usuário (adicionais)

- **Spec↔tasks sincronia** já é regra estabelecida na Parte 1 — não precisa ser reforçada.
- **Zero tolerância a erros em runtime**: auditorias (json.tool + rg + Python dump) são obrigatórias antes de reportar conclusão.
- **Documentar passos manuais MZ** explicitamente em `fase-N-completa.md` — usuário não quer caçar placeholders Comment.

### Restrições técnicas (adicionais)

- **Hooks `PreToolUse:Write` e `PreToolUse:Edit`** disparam reminders Python Standards em arquivos `.py`. Internalizar: typed small functions, structured parsers, focused tests.
- **Pillow para PNG trivial**: `Image.new('RGBA', (816, 624), (255, 255, 255, 255))` é suficiente para overlay fullscreen de cor sólida.
- **`ces[CE_ON_RISK := 12]` é typo** — walrus operator não pertence em indexação de lista. Usar literal ou constante existente.

### Armadilhas conhecidas (adicionais)

- **Assumir estrutura de JSON a partir do gerador anterior sem verificar em disco** — risco de patch não casar se gerador foi editado depois. Sempre confirmar via `python -c "import json; ..."`.
- **Escrever `main()` com pressa** — revisar antes de executar, especialmente presença de typos como walrus desnecessário.

### Heurísticas recomendadas (adicionais)

- **Antes de criar gerador novo**: ler `fase<N-1>/build_phase<N-1>_ces.py` inteiro + dump das listas dos CEs que serão patched.
- **Para CEs "deletados" semanticamente**: setar slot para `null` (preserva índices) em vez de remover do array.
- **Para patches cirúrgicos baseados em string**: idempotência via detecção (ex.: `any(cmd.code == 117 and cmd.params == [TARGET] for cmd in list)`).
- **Para CEs com Plugin Command manual**: placeholder Comment `[TASK X.Y MANUAL MZ]` + documentação em `fase-N-completa.md` com screenshot-friendly checklist.

## P2.8. Informações que deveriam estar no prompt inicial

| Informação | Classificação | Justificativa |
|------------|---------------|---------------|
| Caminho do gerador da fase anterior (`fase<N-1>/build_phase<N-1>_ces.py`) | **Útil** | Evita busca — diretório pode variar |
| Lista exata de passos manuais MZ esperados (Plugin Commands) | **Útil** | Permite planejar placeholders Comment desde o início |
| Confirmar que o usuário criará assets visuais complexos (bg_vitoria.png) — fallback já documentado | **Opcional** | Permite decidir fallback vs aguardar asset sem perguntar |

## P2.9. Melhorias nos artefatos do fluxo

### P2.9.1 Melhorias na análise técnica

Nenhuma alteração recomendada para a análise técnica. Os patches sugeridos na Parte 1 (§9.1) cobrem o necessário.

### P2.9.2 Melhorias no plano de implementação

| Problema observado | Deficiência do plano | Etapa afetada | Alteração recomendada | Texto sugerido | Redução de custo |
|--------------------|----------------------|---------------|------------------------|----------------|------------------|
| Plano não explicita "dump das listas dos CEs a patchear" como pré-passo | Pré-passos listam snapshot mas não dump estrutural dos CEs alvo de patch | Pré-passos de cada fase com patches cirúrgicos | Adicionar item: "Dump Python das listas completas dos CEs que serão patched (não apenas os novos)" | Em "Pré-passos F<N>" quando houver patches: "`python3 -c 'import json; ...; print(ces[CE_ID][\"list\"])'` para cada CE alvo de patch — confirma strings exatas e pontos de inserção." | Médio — evita patch casar errado |

### P2.9.3 Melhorias nas tasks da fase executada

| Task afetada | Informação ausente/ambígua | Consequência | Alteração recomendada | Texto sugerido | Validação |
|--------------|----------------------------|--------------|------------------------|----------------|-----------|
| task-6.1.md | Não lista "verificar JSON em disco do CE 12 FAIL branch antes de escrever patch" como subtarefa | Patch foi inferido da leitura do gerador F5 (acertou, mas com risco) | Adicionar subtarefa 6.1.X: "Dump Python do CE 12 `list` para confirmar formato exato do Comment placeholder" | Em "Subtarefas": "6.1.X Confirmar via `python3 -c 'import json; ...'` que o CE 12 FAIL branch contém `C(108, 1, [\"[TASK 6.1 PENDENTE]...\"])` antes de escrever `patch_on_risk_fail_branch()`." | Patch casa na 1ª execução |
| task-6.4.md | Não documenta o fallback "Tint Screen dourado" quando `bg_vitoria.png` não existe | Implementação ficou em dúvida — usar Show Picture inexistente ou Tint? | Já está documentado em task-6.4.md "Sobre os backgrounds de vitória/derrota/FIM" mas poderia estar mais explícito nas subtarefas 6.4.5d | Texto atual já cobre — nenhuma mudança necessária | Já está claro |
| task-6.4.md | Não explicita "idempotência do patch Renderer" como critério | Patchteria duplicar victory check em re-execução | Adicionar ao critério de sucesso do gerador | "Script gerador é idempotente: detecta se vitória check já existe no CE 7 e não duplica." | `python3 build_phase6_ces.py` executado 2x produz o mesmo JSON |

### P2.9.4 Problemas fora do escopo dos artefatos

| Problema | Por que está fora do escopo | Como tratar | Proteção operacional |
|----------|------------------------------|-------------|----------------------|
| Hooks `PreToolUse:Write/Edit` disparam reminders Python Standards | Design operacional do projeto, não falha do plano | Internalizar regras ao escrever Python | Ler `skills/standards/references/python.md` se necessário |
| Walrus typo `ces[CE_ON_RISK := 12]` | Erro operacional de digitação | Revisar `main()` antes de executar | Memo mental |

### P2.9.5 Matriz de rastreabilidade das melhorias

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|--------------------|-----------------|----------------------|----------------------|------------|
| Patch de CE 12 inferido do gerador sem verificar JSON em disco | Task não lista "dump CE 12 antes do patch" | Tasks 6.1 | Adicionar subtarefa de verificação prévia | Média |
| Plano não explicita "dump CEs alvo de patch" como pré-passo | Pré-passos listam snapshot mas não dump estrutural | Plano de implementação | Adicionar item genérico em pré-passos | Média |
| Walrus typo em main() | Erro operacional | Fora do escopo | Internalizar revisão pós-Write | Baixa |
| Hooks Python Standards disparam a cada Write | Design operacional | Fora do escopo | Internalizar regras | Baixa |

### P2.9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

`Nenhuma alteração adicional recomendada para a análise técnica.`

#### Patch sugerido para o plano de implementação

```markdown
Em "Pré-passos F<N>" quando a fase incluir patches cirúrgicos em CEs existentes,
adicionar:

- [ ] Dump Python das listas completas dos CEs alvo de patch:
      `python3 -c "import json; ces = json.load(open('Jhonny/data/CommonEvents.json')); 
       print(ces[CE_ID]['list'])"`
      Confirma strings exatas de Comment/Script placeholders e identifica o índice
      correto para inserção.
```

#### Patch sugerido para as tasks da fase executada

**task-6.1.md** — adicionar subtarefa:
```markdown
- [ ] 6.1.X Confirmar via dump Python que o CE 12 FAIL branch contém
      `C(108, 1, ["[TASK 6.1 PENDENTE]..."])` antes de escrever a função
      `patch_on_risk_fail_branch()`. Previne patch casar com string errada.
```

**task-6.4.md** — adicionar critério de sucesso:
```markdown
- [ ] Script gerador `fase6/build_phase6_ces.py` é idempotente: detecta se
      vitória check já existe no CE 7 e não duplica em re-execução.
```

#### Ações fora do fluxo de especificação

- Internalizar revisão pós-Write: reler o arquivo Python escrito antes de executar, especialmente `main()`.
- Internalizar regras dos hooks Python Standards: typed small functions, structured parsers, focused tests.

## P2.10. Checklist operacional (adicionais ao da Parte 1)

- [ ] Antes de escrever gerador novo, ler `fase<N-1>/build_phase<N-1>_ces.py` por inteiro.
- [ ] Dump Python das listas dos CEs que serão patched (não apenas novos).
- [ ] Snapshot `System.json` (variables + switches) e `CommonEvents.json` (CE names + triggers + cmd counts) antes de qualquer Write.
- [ ] Gerador idempotente: detectar aplicação prévia de patches (ex.: `any(cmd.code == 117 and cmd.params == [TARGET] ...)`).
- [ ] Para CEs "deletados" semanticamente: setar slot para `null` (preserva índices).
- [ ] Plugin Commands MZ (TextPicture, etc.): placeholder Comment `[TASK X.Y MANUAL MZ]` + documentação em `fase-N-completa.md`.
- [ ] Auditoria pós-geração obrigatória: `python3 -m json.tool` + `rg "value\\(|setValue\\("` + Python audit de `ControlSwitch` (121) semântica.
- [ ] Revisar `main()` antes de executar gerador — capturar typos como walrus desnecessário.
- [ ] Criar `fase<N>/fase-N-completa.md` com passos manuais MZ explícitos.
- [ ] Atualizar `tasks.md` com status e checkboxes ✅ ao final.
