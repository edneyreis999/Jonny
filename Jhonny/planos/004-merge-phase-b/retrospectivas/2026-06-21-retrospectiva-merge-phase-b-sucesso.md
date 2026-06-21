# Retrospectiva — Merge feat/release-phase-b → main (Tentativa bem-sucedida)

**Data:** 2026-06-21
**Branch resultante:** `main` @ commit `fad1053`
**Strategy executada:** PRE-CRIAR (Strategy 2 do `merge-strategy.md`)
**Pré-condição atendida:** usuário pré-criou 5 CEs no editor RMMZ (commit `27cfba1`)

---

## 1. Resumo da tarefa

**Solicitado:** Merge `feat/release-phase-b` (VN3 cutscenes) → `main` (sistema de corrida), resolvendo conflitos um a um com input do usuário.

**Entregue:** Merge commit `fad1053` em `main` com 28 arquivos:
- `CommonEvents.json`: 4 slots Fala-ID1-4 (IDs 20-23) preenchidos com conteúdo da feat, preservando IDs reais.
- `System.json`: `versionId` mantido da main.
- Maps 005/006/010/013: 871 chamadas `code:117` remapeadas (10→20, 11→21).
- 11 maps novos, 2 plugins VisuMZ, 6 parallaxes, 2 pictures, 2 saves — adicionados pela feat sem conflito.

**Critério de sucesso (cumprido):** usuário abriu o projeto no editor RMMZ e confirmou "FUNCIONOU!" — CEs Fala-ID1-4 visíveis e populados, race system intacto, maps abrem sem erro.

**Restrições relevantes:**
- Editor RMMZ só aceita CE slots criados via "Change Maximum" (não via script externo).
- JSON deve ser canônico: `array[0]=null`, IDs sequenciais, último comando terminator `{code:0,indent:0,parameters:[]}`.
- Conventional Commits, sem `Co-authored-by`.

---

## 2. Decisões técnicas e inferências

### 2.1 — Confiança cega no `merge-strategy.md`

- **Decisão:** Não revalidar mapeamento de CEs; usar o script Python e contagens do artefato diretamente.
- **Motivo:** O artefato já tinha sido construído na sessão anterior com toda a evidência (`git show :2:`, `:3:`, contagens por map).
- **Evidência:** IDs reais atribuídos pelo editor (20-23) corresponderam exatamente ao esperado; contagem de remapeamentos (67/18/28/758 = 871) correspondeu.
- **Resultado:** Funcionou.
- **Avaliação:** Decisão correta. Revalidar teria sido desperdício.
- **Melhoria futura:** Verificação rápida de 1 linha (total CEs + nomes dos slots 20-23) já foi feita e é suficiente.

### 2.2 — Resolver conflitos programaticamente em vez de manualmente

- **Decisão:** Para `CommonEvents.json`, ignorar as 13 regiões de conflito (39 marcadores) e reconstruir o array via Python, em vez de resolver cada `<<<<<<< HEAD` manualmente.
- **Motivo:** Conflito é estrutural (mesmas posições de array com conteúdo diferente), não textual. Manual seria impossível.
- **Evidência:** `git status` mostrou ambos modified; `grep -c` mostrou 39 marcadores.
- **Resultado:** Funcionou na primeira execução.
- **Melhoria futura:** Manter esse padrão: conflito estrutural em JSON → reconstruir via script, não Edit manual.

### 2.3 — Manter `versionId` da main

- **Decisão:** Em `System.json`, resolver o único conflito (`versionId`) mantendo `56565876` da main.
- **Motivo:** `versionId` é fingerprint do database. O merge está entrando na main; o "ponto de continuidade" é a main.
- **Evidência:** Conflito tinha apenas 1 chave.
- **Resultado:** Funcionou. Editor RMMZ aceitou sem reclamar.

---

## 3. Uso de ferramentas, comandos e scripts

### 3.1 — `git fetch origin && git status && git log` (estado inicial)

- **Objetivo:** Confirmar pré-condição (main limpa, sem merge in-progress).
- **Necessário:** Sim — confirmou que usuário já tinha feito commit `27cfba1` com os slots pré-criados.
- **Substituível:** Não, foi mínimo e necessário.

### 3.2 — `git show :2:CommonEvents.json` / `:3:CommonEvents.json` (git stages)

- **Objetivo:** Obter versões limpas (HEAD/main e feat) do arquivo em conflito, sem marcadores.
- **Resultado:** Direto em Python via `subprocess.check_output`.
- **Contribuiu:** Crítico — evitou parse de arquivo com marcadores de conflito.

### 3.3 — Script Python para sobrescrever slots

- **Objetivo:** Pegar main_ces (24 CEs), substituir conteúdo dos slots Fala-ID1-4 (índices 20-23) com feat_ces por nome, preservando `id` da main.
- **Resultado:** 4 substituições corretas, JSON válido salvo.
- **Contribuiu:** Solução direta. Sem alternativa mais simples.

### 3.4 — Script Python para remapear `code:117`

- **Objetivo:** Em cada map da feat, trocar `parameters[0]` dos comandos `code:117` de 10→20, 11→21, 12→22, 13→23.
- **Resultado:** 871 remapeamentos, contagem por map idêntica ao esperado.
- **Contribuiu:** Crítico — sem isso, `code:117` em maps chamaria EV_RaceTimer ao invés de Fala-ID1.

### 3.5 — Validação Python (canonicalidade, switches, terminators)

- **Objetivo:** Confirmar `array[0]=null`, IDs sequenciais, último comando terminator, switches 43-46 não colidem com race system (100-105).
- **Resultado:** 5 checks passaram.
- **Contribuiu:** Confirmação antes do commit. Pode ser consolidado em menos chamadas na próxima execução.

### 3.6 — TaskCreate (5 tasks)

- **Objetivo:** Trackear progresso do merge.
- **Avaliação:** Marginalmente útil. Sessão foi curta o suficiente para dispensar.
- **Desperdício:** Baixo. Cada TaskUpdate consome tokens. Para merges de 2 arquivos com script único, não repetir.

---

## 4. Intervenções e correções do usuário

**Nenhuma intervenção corretiva nesta sessão.**

Todas as ações seguiram o plano confirmado pelo usuário em cada etapa (perguntas respondidas com "sim, confirmado" e "FUNCIONOU!"). O usuário forneceu a pré-condição (CEs pré-criados no editor) antes do início, conforme combinado na sessão anterior.

---

## 5. Análise de desperdício

### 5.1 — TaskCreate + 5× TaskUpdate

- **O que:** Criei 5 tasks e fiz 10 updates de status ao longo da sessão.
- **Impacto:** Baixo.
- **Causa:** Hábito de tracking para tarefas "multi-step".
- **Como evitar:** Para merges guiados por artefato pré-existente com 2 conflitos, dispensar TaskCreate. Os 5 passos já estão documentados no `merge-strategy.md`.

### 5.2 — Validação fragmentada (3 chamadas Python separadas para checagens estruturais)

- **O que:** Rodei 3 blocos Python separados para validar: (a) canonicalidade, (b) colisão de switches, (c) contagem de code:117.
- **Impacto:** Baixo.
- **Causa:** Construí incrementalmente.
- **Como evitar:** Consolidar em 1 script único de pós-merge.

### 5.3 — Read desnecessário de `merge-phase-b-active.md` (hook disse para não ler)

- **O que:** Tentei Read da memória e o sistema rejeitou (já estava no contexto).
- **Impacto:** Baixo (sem IO real).
- **Causa:** Hábito de re-ler antes de atualizar.
- **Como evitar:** Para memórias já carregadas via system-reminder, usar Write direto.

---

## 6. Caminho mínimo recomendado

Para repetir este merge bem-sucedido com o mesmo padrão:

1. **Confirmar pré-condição no editor.** Verificar que `main` tem slots Fala-ID1-4 preenchíveis nos IDs esperados.
   - **Ferramenta:** `git log --oneline | grep Fala-ID` + `python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); print([(i,c.get('name')) for i,c in enumerate(ces) if c and 'Fala-ID' in c.get('name','')])"`.
   - **Critério:** 4 slots encontrados, IDs anotados.

2. **Iniciar merge.**
   - **Ferramenta:** `git merge --no-commit --no-ff feat/release-phase-b`.
   - **Critério:** 2 conflitos esperados (CommonEvents, System).

3. **Resolver `System.json`.** Editar para manter `versionId` da main; stagear.
   - **Ferramenta:** `Edit` ou `sed`.
   - **Critério:** Sem marcadores, JSON válido, `git add` OK.

4. **Resolver `CommonEvents.json` com script único.** Substituir conteúdo dos slots Fala-ID* preservando IDs; salvar; validar.
   - **Ferramenta:** Bloco Python único que (a) lê stages via `git show :2:` e `:3:`, (b) faz substituição por nome, (c) salva, (d) valida canonicalidade, (e) checa colisão de switches, (f) imprime relatório.
   - **Critério:** 4 substituições, 0 marcadores, IDs sequenciais.

5. **Remapear `code:117` nos maps.**
   - **Ferramenta:** Bloco Python iterando todos `Map0XX.json`, substituindo `parameters[0]` quando `code==117` e valor está no mapa `OLD_TO_NEW`.
   - **Critério:** Contagem por map bate com esperado (005=67, 006=18, 010=28, 013=758).

6. **Stagear tudo, validar ausência de marcadores, commitar.**
   - **Ferramenta:** `git add -A && grep -rn '<<<<<<<\|>>>>>>>' Jhonny/data/ && echo BAD || git commit`.
   - **Critério:** Working tree clean após commit.

7. **Handoff para Playtest.** Pedir ao usuário para abrir no editor e confirmar CEs Fala-ID1-4 populados + maps abrem.
   - **Critério:** Usuário confirma.

---

## 7. Conhecimento reutilizável

### Fatos confirmados

- **Editor RMMZ só aceita CE slots que ele mesmo criou via "Change Maximum".** Concatenar slots via script Python no `CommonEvents.json` produz JSON válido que o editor rejeita (duplo-click em slot vazio não abre painel).
- **A estratégia PRE-CRIAR funciona:** usuário cria slots vazios no editor primeiro, merge sobrescreve só o conteúdo, IDs reais são preservados.
- **Switches 43-46 são usados apenas por Fala-ID1-4** (1 switch por CE); não colidem com race system (switches 100-105).
- **`code:117` é o opcode "Call Common Event"** em RPG Maker MZ; `parameters[0]` é o CE ID alvo.
- **Map013 tem 758 chamadas `code:117`** referenciando Fala-ID1-4 — map "hub" das VN3 cutscenes.

### Preferências do usuário

- Confirmar manualmente cada decisão de merge antes de prosseguir ("sim, confirmado").
- Abrir projeto no editor RMMZ e validar visualmente antes do commit ser considerado concluído.
- Sem `Co-authored-by` em commits (regra global).
- Salvar retrospectivas em `Jhonny/planos/NNN-*/retrospectivas/` com data ISO.

### Restrições técnicas

- `CommonEvents.json` deve ser canônico: `array[0]=null`, IDs sequenciais (id == índice), último comando terminator `{code:0,indent:0,parameters:[]}`.
- `System.json` `versionId` é fingerprint do database — não há "valor correto", usar o do branch que está recebendo o merge.
- Conflitos estruturais em arrays JSON não devem ser resolvidos via Edit manual; reconstruir via script.

### Armadilhas conhecidas

- **`git clean -fd` em repositório com arquivos untracked carregava arquivos nunca commitados** (`.serena/memories/`, `Jhonny/movies/`, planos não commitados). Evitar — usar `git checkout -- <path>` ou `git restore --staged` para escopos específicos.
- **`code:117` não remapeado = chamadaCalls CEs errados em runtime.** Map013 teria 758 chamadas chamando EV_RaceTimer/EV_OnSafe ao invés de Fala-ID1-4.
- **CEs com `name=""` não são lixo:** são slots canônicos vazios usados pelo RMMZ como buffers entre grupos (e.g. ID 4 entre preload e race system, ID 17 entre race system e EV_Crash).

### Heurísticas recomendadas

- **Se a estratégia está bem documentada em artefato prévio, siga o artefato.** Não revalide o que já foi validado.
- **Conflito estrutural (array com mesmas posições, conteúdo diferente) → script.** Conflito textual pontual → Edit.
- **Para validar merge de JSON,** sempre conferir: (1) parse OK, (2) sem marcadores, (3) canonicalidade (IDs sequenciais, terminators), (4) sem referências quebradas (switches/vars/CE IDs).
- **Antes de commit de merge,** confirmar que contagens batem com esperado do planejamento. Discrepância é pista de bug.

---

## 8. Informações que deveriam estar no prompt inicial

### Obrigatório

- Nada faltou. A pré-condição (CEs pré-criados no editor) já estava combinada da sessão anterior e confirmada pelo commit `27cfba1` no `git log`.

### Útil

- **Confirmação explícita no prompt** de que a Strategy 2 (PRE-CRIAR) deve ser seguida, mesmo sendo a única estratégia restante após a falha da Strategy 1.
- **IDs reais atribuídos pelo editor** (20-23) informados no prompt teriam eliminado a chamada de inspeção do `CommonEvents.json`. Porém essa chamada também valida pré-condições, então o custo é baixo.

### Opcional

- Nada.

---

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

**Problema observado:** Para saber que switches 43-46 não colidiam com race system, precisei inspecionar main_ces programaticamente. Essa informação já existia na memória mas não no artefato de merge.

**Informação ausente no `merge-strategy.md`:** mapa de switches/variáveis por CE da main.

**Por que pertence à análise técnica:** É fato estrutural sobre o estado do sistema.

**Seção sugerida para adicionar:**

```markdown
## Switch/Variable usage

- Race system CEs (IDs 5-19) usam switches 100-105 (SW_RACE_ACTIVE, SW_INPUT_LOCKED,
  SW_CRASH_FLAG, SW_LAST_ACTION_SAFE, SW_PAUSED, SW_IS_CURVA_DIABO) e variáveis 100-117.
- Fala-ID1-4 (slots pré-criados IDs 20-23) usam switches 43-46 (1 switch por CE, sem nome em System.json).
- Conclusão: zero colisão semântica.
```

**Impacto esperado:** Elimina a chamada de validação programática durante o merge.

### 9.2 Melhorias no plano de implementação

**Problema observado:** O `merge-strategy.md` lista passos separados para "Resolver CommonEvents", "Remapear code:117", "Validar" — cada um com seu próprio script Python. Na prática, scripts 1+3 (resolver + validar) poderiam ser um só.

**Deficiência:** Fragmentação de passos que pertencem à mesma transação lógica.

**Etapa afetada:** "Resolução do CommonEvents.json" + "Validação antes do commit".

**Alteração recomendada:** Consolidar em um único script que resolve, valida canonicalidade, checa colisão de switches, e aborta com erro se algo falhar (atomicidade).

**Texto sugerido para a alteração:**

```markdown
### Resolução + validação atômica (CommonEvents.json)

Substituir os blocos "Resolução" e "Validação" por um único script Python
que faz (a) substituição por nome, (b) checagem de IDs sequenciais, (c) checagem
de terminators, (d) checagem de switches/vars usadas, e sai com sys.exit(1) se
qualquer check falhar. Isso garante que um commit inválido nunca seja criado.
```

**Como a mudança reduz custo:** Próxima execução faz 1 chamada Python ao invés de 3.

### 9.3 Melhorias nas tasks da fase executada

**Nenhuma alteração recomendada para as tasks desta fase.**

As tasks não foram o artefato que guiou esta execução — o `merge-strategy.md` foi. As tasks que criei (TaskCreate 6-10) foram apenas tracking operacional, não especificação.

### 9.4 Problemas fora do escopo dos artefatos

- **Editor RMMZ não documentou oficialmente a restrição de slot creation.** Hipótese confirmada empiricamente. Não é passível de correção via artefato de merge; é fato do ambiente que pertence à memória `[[never-delete-common-events]]` (atualizar).
- **Necessidade de Playtest manual no editor.** Não pode ser automatizada — é decisão humana. Sem ação.

### 9.5 Matriz de rastreabilidade das melhorias

| **Problema observado** | **Causa principal** | **Artefato responsável** | **Alteração necessária** | **Prioridade** |
|---|---|---|---|---|
| Revalidação de switches durante merge | Mapa de switches não documentado | Análise técnica (`merge-strategy.md`) | Adicionar seção "Switch/Variable usage" | Média |
| 3 chamadas Python para validar | Scripts de resolução e validação separados | Plano de implementação | Consolidar em 1 script atômico | Baixa |
| TaskCreate overhead | Hábito operacional | Fora do escopo | Sem ação (decisão operacional da LLM) | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

```diff
+ ## Switch/Variable usage
+
+ - Race system CEs (IDs 5-19) usam switches 100-105 (SW_RACE_ACTIVE,
+   SW_INPUT_LOCKED, SW_CRASH_FLAG, SW_LAST_ACTION_SAFE, SW_PAUSED,
+   SW_IS_CURVA_DIABO) e variáveis 100-117 (VAR_RACE_ID, VAR_SCENE_INDEX, etc.).
+ - Fala-ID1-4 (slots pré-criados IDs 20-23) usam switches 43-46 (1 switch por
+   CE, sem nome em System.json).
+ - Conclusão: zero colisão semântica. Não há necessidade de revalidar durante o merge.
```

#### Patch sugerido para o plano de implementação

```diff
- ### Resolução do CommonEvents.json
- (script isolado)
- 
- ### Validação antes do commit
- (script isolado)
+ ### Resolução + validação atômica (CommonEvents.json)
+ 
+ Script único que:
+ 1. Lê stages via `git show :2:` e `:3:` (limpos, sem marcadores).
+ 2. Para cada slot Fala-ID* em main_ces, substitui conteúdo com feat_ces por nome,
+    preservando `id` real.
+ 3. Salva JSON com indent=4 e ensure_ascii=False.
+ 4. Valida: array[0]==null, IDs sequenciais, último cmd terminator por CE,
+    sem marcadores de conflito, switches usadas ⊆ {43-46} (Fala) ∪ {100-105} (race).
+ 5. Aborta com sys.exit(1) se qualquer check falhar.
```

#### Patch sugerido para as tasks da fase executada

Nenhuma alteração recomendada para as tasks desta fase.

#### Ações fora do fluxo de especificação

- **Atualizar memória `[[never-delete-common-events]]`** para incluir a restrição complementar: "o editor RMMZ também não aceita slots NOVOS criados via script externo — apenas slots criados pelo próprio editor via 'Change Maximum'. Para adicionar CEs via JSON, o slot deve ser pré-criado no editor primeiro." (prioridade alta — evita repetir o erro da Strategy 1).

---

## 10. Checklist operacional

1. **Pré-condição:** `main` tem commit recente criando slots Fala-ID1-4? (`git log --oneline | grep Fala-ID`)
2. **IDs reais:** Confirmar via `python3 -c "import json; ..."` que slots estão nos IDs esperados (default 20-23).
3. **Merge iniciado:** `git merge --no-commit --no-ff feat/release-phase-b` gera exatamente 2 conflitos (CommonEvents + System).
4. **System.json resolvido primeiro:** `versionId` mantido da main, stageado.
5. **CommonEvents resolvido via script:** Substituição por nome + validação atômica.
6. **code:117 remapeado:** Contagem por map (005=67, 006=18, 010=28, 013=758) confere.
7. **Sanidade final:** `grep -rn '<<<<<<<\|>>>>>>>' Jhonny/data/` retorna vazio.
8. **Commit feito:** Mensagem segue Conventional Commits sem `Co-authored-by`.
9. **Handoff:** Usuário abre projeto no editor RMMZ e confirma "FUNCIONOU".
10. **Memória atualizada:** `merge-phase-b-active.md` marcada como concluída.
