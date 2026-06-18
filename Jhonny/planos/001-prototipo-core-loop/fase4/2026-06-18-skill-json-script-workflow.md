# Retrospectiva técnica — skill `rpg-maker-mz-data-json` (workflow script-first)

**Data:** 2026-06-18
**Sessão revisada:** edição da skill `.claude/skills/rpg-maker-mz-data-json` para tornar obrigatório o workflow de criar script Python antes de editar qualquer `data/*.json`.
**Arquivo de saída:** `Jhonny/planos/001-prototipo-core-loop/fase4/2026-06-18-skill-json-script-workflow.md`

---

## 1. Resumo da tarefa

**Solicitado:** alterar as instruções da skill `rpg-maker-mz-data-json` para incluir regra obrigatória: antes de editar qualquer `*.json` do RPG Maker MZ, o agente deve (1) criar um script Python, (2) salvá-lo fisicamente em disco, (3) executá-lo para aplicar a mudança. Nunca editar o JSON diretamente. Justificativa declarada: rastreabilidade e debug. Restrição: a skill é genérica (usada em qualquer projeto RPG Maker MZ), portanto nenhuma referência específica ao projeto `Jhonny/` deve aparecer.

**Entregue:**
- Nova reference `references/workflow.md` (regra, why, 5 passos obrigatórios, naming/placement, padrões proibidos, relação com as file-type references).
- `SKILL.md` atualizado: novo bullet mandatório em "Always Apply", instrução para sempre consultar `workflow.md` em "References", novo check em "Validation".
- Conteúdo 100% agnóstico ao projeto (sem `Jhonny/`, `planos/`, Daratrine, nomes de fases).

**Critérios de sucesso:** regra aparece no nível mais visível da skill (Always Apply); existe reference única e reusável; nenhum nome específico do projeto vazou; workflow cobre criação, execução, persistência e auditoria do script.

**Restrições relevantes:** skill é markdown com frontmatter YAML; references vivem em `references/`; padrão existente é "Always Apply" + tabela de references + "Validation".

---

## 2. Decisões técnicas e inferências

| Decisão ou inferência | Motivo | Evidência disponível | Resultado | Avaliação | Melhoria futura |
| --- | --- | --- | --- | --- | --- |
| Criar nova reference `workflow.md` em vez de embutir a regra em uma file-type reference existente | A regra é cross-cutting (vale para todo `*.json`), não específica de tipo de arquivo | SKILL.md já separa "Always Apply" (geral) das references (por tipo) | OK | Necessária | Manter como padrão: regras cross-cutting → nova reference + bullet em Always Apply |
| Colocar a regra como **primeiro** bullet em "Always Apply" | O usuário enfatizou "SEMPRE" e "muito importante" | Texto do prompt | OK | Necessária | Quando o usuário usar "sempre/obrigatório/muito importante", tratar como regra de topo |
| Exemplos de nomes de script genéricos (`expand_switches.py`, `add_actor_skills.py`) em vez dos nomes reais usados na fase 3/4 | Restrição explícita do usuário de não mencionar nada específico do projeto | Texto do prompt | OK | Necessária | Sempre reler a restrição de anonimização antes de escrever exemplos |
| Não adicionar coluna nova na tabela de references | A regra se aplica a todos os tipos; adicionar linha por tipo seria ruído | Estrutura tabular existente | OK | Necessária | Manter tabela de references apenas para mapeamento arquivo→reference |
| Adicionar também check em "Validation" | Validation descrevia checagens pós-edição; faltava confirmar origem da mudança | Padrão da seção Validation ser lista operacional | OK | Útil, não obrigatório | Considerar sempre propagar regras cross-cutting para as seções de validation |

Sem inferências arriscadas — todas as decisões se apoiam em evidência direta do prompt ou da estrutura existente do arquivo.

---

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Necessário? | Contribuiu? | Redundante? |
| --- | --- | --- | --- | --- |
| `ls` no diretório da skill | Confirmar estrutura (SKILL.md + references/) | Sim | Sim | Não |
| `Read SKILL.md` | Conhecer formato, seções, tabela de references | Sim | Sim | Não |
| `ls references/` | Confirmar que nenhuma reference existente cobria workflow | Sim | Sim | Não |
| `Read references/System.md` | Verificar padrão de escrita das references | Sim, mas 1 teria bastado | Parcialmente | **Sim — `map.md` foi lido em seguida sem agregar informação estrutural nova** |
| `Read references/map.md` | Confirmação extra do padrão | Não era necessário após `System.md` | Baixo | **Sim, evitável** |
| `Write references/workflow.md` | Criar nova reference | Sim | Sim | Não |
| `Edit SKILL.md` (Always Apply + References) | Inserir regra e pointer | Sim | Sim | Não |
| `Edit SKILL.md` (Validation) | Adicionar check | Sim | Sim | Não |

**Aprendizado:** ler 2 references para inferir o padrão de escrita foi 1 a mais do que o necessário. Uma leitura basta quando o objetivo é só confirmar formato (título, listas, "Guidelines").

---

## 4. Intervenções e correções do usuário

Nenhuma durante a sessão. O prompt foi completo: regra, justificativa, referência a exemplo prático (fases 3/4), restrição de anonimização, e instrução de "encontrar a melhor reference ou criar nova". Não houve necessidade de clarificação.

---

## 5. Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
| --- | --- | --- | --- |
| Leitura de `references/map.md` após já ter lido `references/System.md` | Baixo | Vontade de "confirmar o padrão" com segunda amostra | Regra: 1 reference basta para inferir formato |
| Bullet final do SKILL.md em "Always Apply" um pouco longo (parágrafo em vez de uma linha) | Baixo | Tentativa de caber toda a regra no bullet | Manter bullets curtos; a reference existe para detalhar |
| Sem outros desperdícios relevantes | — | — | — |

Sem tentativas exploratórias, sem buscas amplas, sem comandos que não produziram informação útil.

---

## 6. Caminho mínimo recomendado

1. **Ler `SKILL.md` da skill alvo.** Entrada: caminho da skill. Ferramenta: Read. Resultado esperado: conhecer seções (Always Apply, References, Validation) e formato da tabela de references. Critério para seguir: conseguir identificar onde regras cross-cutting são declaradas.
2. **`ls references/`.** Entrada: diretório da skill. Resultado: confirmar se já existe reference que cobre o workflow. Critério: se sim, editar; se não, criar nova.
3. **Ler 1 reference existente.** Entrada: qualquer reference. Resultado: capturar padrão de escrita (título, "Guidelines", listas). Critério: ter template mental antes de escrever a nova.
4. **Escrever a nova reference.** Entrada: regra + justificativa + exemplo do usuário. Resultado: arquivo markdown completo, agnóstico ao projeto. Critério: texto autocontido, sem nomes específicos do projeto.
5. **Editar `SKILL.md`.** Entrada: local das seções Always Apply, References, Validation. Resultado: regra como primeiro bullet de Always Apply, pointer em References, check em Validation. Critério: diff cobre as três seções.
6. **Encerrar.** Critério objetivo: nova reference existe, `SKILL.md` reference-a explicitamente, nenhum nome de projeto aparece.

---

## 7. Conhecimento reutilizável

### Fatos confirmados
- Skills markdown desta workspace seguem: frontmatter (`name`, `description`) → parágrafo introdutório → seção "Always Apply" → "References" (tabela arquivo→reference) → "Validation".
- Regras cross-cutting (que valem para todos os arquivos que a skill toca) vivem em "Always Apply" + em uma reference dedicada, nunca embutidas em uma file-type reference.
- A descrição do frontmatter alimenta o roteamento automático da skill; mudanças de escopo exigem atualizar a `description`.

### Preferências do usuário
- Regras obrigatórias devem ser declaradas com "SEMPRE" e posicionadas no topo de "Always Apply".
- Toda skill deve permanecer genérica — nada de nomes de projeto, planos, fases, personagens.
- Workflows que produzem rastreabilidade (scripts persistidos em disco) são valorizados; sempre que possível, formalizá-los como regra na skill correspondente.

### Restrições técnicas
- Arquivos da skill são markdown puro; sem build, sem teste automatizado.
- References são linkadas via caminho relativo `references/X.md`.
- `description` do frontmatter é o gatilho de ativação da skill — manter precisa.

### Armadilhas conhecidas
- Mencionar exemplos específicos do projeto (`fase3/`, `build_phase4_ces.py`, `setup_phase4_system.py`) quebra a restrição de anonimização.
- Embutir regra cross-cutting em uma file-type reference a esconde de quem consulta só a tabela de references.

### Heurísticas recomendadas
- Nova regra cross-cutting → nova reference + bullet em "Always Apply" + check em "Validation".
- Anonimizar exemplos: substituir nomes específicos por formas genéricas (`expand_switches.py`, `add_actor_skills.py`).
- Para confirmar padrão de escrita de uma skill, 1 leitura de reference basta.

---

## 8. Informações que deveriam estar no prompt inicial

| Item | Classificação |
| --- | --- |
| Caminho da skill alvo | Obrigatório — já estava presente |
| Regra literal a ser adicionada | Obrigatório — já estava presente |
| Justificativa (rastreabilidade/debug) | Útil — já estava presente |
| Restrição de anonimização (não mencionar o projeto) | Obrigatório — já estava presente |
| Exemplo prático (fases 3/4) | Útil — já estava presente |
| Diretiva "criar nova reference se preciso" | Opcional — já estava presente |

**Avaliação:** o prompt estava completo. Nenhuma informação adicional seria necessária.

---

## 9. Melhorias nos artefatos do fluxo

A tarefa foi edição pontual de skill, não execução de plano. As sub-seções 9.1–9.3 (análise técnica / plano / tasks) não se aplicam diretamente. Aplica-se 9.4 (fora do escopo) e a matriz 9.5.

### 9.4 Problemas fora do escopo dos artefatos

| Problema | Por que está fora do escopo | Como tratar |
| --- | --- | --- |
| Leitura de 2 references onde 1 bastava | Ineficiência operacional da LLM, não deficiência de especificação | Nenhuma alteração em artefato; capturar como heurística nesta retrospectiva |

### 9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
| --- | --- | --- | --- | --- |
| Leitura dupla de references para inferir padrão | Hábito de confirmar com segunda amostra | Fora do escopo (operação da LLM) | Nenhuma | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica
`Nenhuma alteração recomendada para a análise técnica.`

#### Patch sugerido para o plano de implementação
`Nenhuma alteração recomendada para o plano de implementação.`

#### Patch sugerido para as tasks da fase executada
`Nenhuma alteração recomendada para as tasks desta fase.`

#### Ações fora do fluxo de especificação
- Heurística operacional (capturada aqui, em 9.4): ao inferir padrão de escrita de skill markdown, ler apenas 1 reference existente como amostra.

---

## 10. Checklist operacional

1. Ler `SKILL.md` da skill alvo antes de qualquer edição.
2. Confirmar com `ls references/` se já existe reference que cobre o tema.
3. Tratar regra com "SEMPRE/obrigatório" como primeiro bullet de "Always Apply".
4. Regra cross-cutting → nova reference dedicada + pointer na tabela de References.
5. Anonimizar exemplos (sem nomes de projeto, planos, fases, personagens).
6. Propagar regras cross-cutting para a seção "Validation" quando aplicável.
7. Manter `description` do frontmatter alinhada ao escopo real da skill.
8. Critério de conclusão: diff cobre Always Apply + References + Validation; nova reference existe; nenhum nome específico de projeto vazou.
