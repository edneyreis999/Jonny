---
title: "Retrospectiva — Debug bug indent/skipBranch em CE 12 (F7)"
fase: 7
tipo: retrospectiva-debug
data: "2026-06-19"
status: "bug corrigido — playtest do usuário confirmou o fix"
---

# Retrospectiva — Debug bug indent/skipBranch em CE 12

> Sessão de debug iniciada pelo relato do usuário: "tenho a impressão de que as últimas alterações introduziram um bug — agora sempre que tento o caminho Risk eu perco. Às vezes vejo a label de Glória aumentar como se eu tivesse acertado, mas o resultado é sempre o som de fail e o jogo reiniciando."

## 1. Resumo da tarefa

**Solicitado:** Diagnosticar causa raiz de bug pós-F7 — Risk path sempre resulta em crash, mesmo em rolls de sucesso.

**Entregue:**
- Diagnóstico raiz confirmado: `Game_Interpreter.skipBranch` (`rmmz_objects.js:9694`) compara apenas `indent`, não rastreia IF/ELSE/END. Plugin Commands `logRaceEvent` inseridos em CE 12 cmds 19-20 e 32-33 com `indent=0` dentro de ramos IF/ELSE cujo corpo é `indent=1` faziam `skipBranch` parar cedo demais.
- Correção aplicada em 2 níveis:
  1. `build_phase7_ces.py` agora passa `indent=1` explícito para RISK_SUCCESS/RISK_FAIL em CE 12 + adicionada função `_fix_log_race_event_indent()` para auto-corrigir runs anteriores.
  2. `CommonEvents.json` regenerado — cmds 19, 20, 32, 33 agora têm `indent=1`.
- Memory persistida: `rpg-mz-indent-skipbranch.md` em `~/.claude/projects/.../memory/`.

**Critério de sucesso:** Playtest do usuário confirmou "está funcionando como o esperado".

## 2. Decisões técnicas e inferências

| Decisão | Motivo | Evidência | Resultado | Avaliação |
|---------|--------|-----------|-----------|-----------|
| Suspeitar inicialmente do patch F7 (especificamente logRaceEvent calls) | Usuário relatou bug surgindo após "últimas alterações"; F7 foi a fase mais recente | `git status` mostrou `CommonEvents.json` modificado vs HEAD; `git diff` mostrou 4 novos PluginCmds em CE 12 | Correto — bug estava em 2 dos 4 cmds inseridos em CE 12 | Necessária |
| Investigar CE 12 antes do plugin `Jhonny_RaceHelper.js` | Bug é comportamental (branching errado), não de crash JS | Plugin `logRaceEvent` é puro (apenas lê `$gameVariables`/`$gameSwitches`); nenhum efeito colateral visível | Correto — plugin estava intacto | Necessária |
| Localizar implementação real de `skipBranch` em `rmmz_objects.js` em vez de confiar em memória/recall | Sintoma "Glória sobe + crash sempre" não bateria com IF/ELSE aninhamento tradicional; precisava confirmar semântica real | Iteração inicial no raciocínio considerou implementação por IF/ELSE/END nesting — estava errada | Decisiva — implementação real (comparação de `indent`) explicou o bug | Necessária |
| Inserir função `_fix_log_race_event_indent` em vez de apenas mudar `make_log_race_event_cmd` default | JSON em disco já tinha o bug; script era idempotente via `has_log_race_event`, então re-run não corrigiria | `build_phase7_ces.py` idempotência baseada em pattern, não em correção | Correto — primeira execução após fix corrigiu o JSON existente | Necessária |

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta/comando | Objetivo | Necessário? | Contribuiu? | Como evitar redundância |
|--------------------|----------|-------------|-------------|-------------------------|
| `git log --oneline -- CommonEvents.json` | Confirmar que F7 não estava committed; diff seria contra HEAD | Sim | Sim | — |
| `git diff HEAD -- CommonEvents.json` | Ver todos os patches F7 aplicados | Sim | Sim — revelou que 4 PluginCmds foram inseridos em CE 12 | — |
| `python3 -c "..."` dumps estruturados de CEs | Visualizar indent/code/parameters em formato legível | Sim | Sim — formato `cmd N [ind=N] code=N desc` permitiu ver o bug estrutural | Reutilizar este helper como snippet permanente |
| `grep -n "skipBranch\|command111\|command411\|command412"` em `rmmz_objects.js` | Localizar implementação real | Sim | Decisivo — revelou `skipBranch` por comparação de indent | Conhecimento prévio do arquivo teria pulado esta busca |
| `Read rmmz_objects.js` lines 9660-9700 e 9927-10082 | Confirmar semântica de skipBranch, command111, command411 | Sim | Decisivo | — |
| `find Jhonny/js -name "rpg_*.js"` | (Falhou — MZ usa `rmmz_*.js` não `rpg_*.js`) | Não | Perda — deveria ter sido `ls Jhonny/js/` primeiro | Conhecer a estrutura `rmmz_*.js` do MZ vs `rpg_*.js` do MV |
| Dumps de CE 5, 6, 11, 15, 18, 19 | Verificar se outros CEs tinham o mesmo bug | Sim | Sim — confirmou que apenas CE 12 estava afetado (outros tinham logRaceEvent em top-level body) | — |
| Dumps de CE 10, 13, 16 | Verificar se CEs paralelos poderiam estar chamando CE 18 | Sim, mas conclusão negativa | Parcialmente útil — descartou teoria alternativa | Suspeita razoável dado trigger=2 (Autorun) |
| Análise de CE 19 (VitoriaCorrida) Call CE 18 no path derrota | Verificar se bug era em Victory→Defeat→Crash | Sim | Excluiu teoria alternativa | — |

### Comandos que não produziram informação útil

- `find Jhonny/js -name "rpg_*.js"` — retornou vazio porque MZ usa prefixo `rmmz_`. Deveria ter sido `ls Jhonny/js/` diretamente.

### Informações descobertas tardiamente que deveriam ter sido verificadas primeiro

- Implementação exata de `skipBranch`. Várias iterações de raciocínio consideraram implementação por nesting de IF/ELSE/END — ter lido o source no início teria encurtado o diagnóstico.

## 4. Intervenções e correções do usuário

**Zero intervenções during o debug.** Usuário forneceu sintoma preciso na mensagem inicial:
- "sempre perde no caminho Risk"
- "às vezes vejo a label de Glória aumentar como se tivesse acertado"
- "resultado é sempre o som de fail e o jogo reiniciando"

Esses três dados foram **suficientes e precisos** para direcionar o diagnóstico. O detalhe "Glória sobe mas crash acontece" foi o indício crítico que apontou para `skipBranch` quebrado (em vez de simples "roll always fails").

**Após o fix**, usuário confirmou: "Testei aqui manualmente e agora está funcionando como o esperado!"

Tipo da intervenção: nenhuma — esta sessão foi pura execução de diagnóstico sem redirecionamento.

## 5. Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
|-------------|---------|-------|-------------|
| Iteração mental sobre semântica de `skipBranch` antes de ler source | Médio | Pressupôs implementação por IF/ELSE/END nesting (comum em motores) | Ler `rmmz_objects.js:9694` no início de qualquer debug que envolva branching |
| `find` por `rpg_*.js` que retornou vazio | Baixo | Confusão MV (`rpg_*.js`) vs MZ (`rmmz_*.js`) | `ls Jhonny/js/` antes de `find` |
| Dumps de CE 10, 13, 16, 19 para descartar teorias alternativas | Médio | Aproximação "scattershot" antes de confirmar a causa primária | Após identificar结构性anomalia (cmds indent=0 dentro de IF body em CE 12), isolar a verificação antes de expandir escopo |
| Trace manual de 2 cenários (SUCCESS/FAIL) em Markdown antes de confirmar via source | Baixo | Necessário para validar hipótese — não é desperdício real | — |

Sem respostas excessivamente longas; sem perguntas ao usuário cuja resposta estava no contexto; sem artefatos intermediários desnecessários.

## 6. Caminho mínimo recomendado

Para debug equivalente ("comportamento de branching errado após patch estrutural em CEs"):

1. **Capturar diff estrutural**: `git diff HEAD -- Jhonny/data/CommonEvents.json` → ver todos os patches recentes.
2. **Dumpar CEs afetados com indent visível**: helper Python que mostra `cmd N [ind=N] code=N desc`.
3. **Identificar comandos inseridos com indent incompatível com vizinhos**: se cmd em `indent=0` está cercado por cmds em `indent=1` dentro de um IF body, este é o suspeito.
4. **Confirmar semântica de `skipBranch`**: ler `Jhonny/js/rmmz_objects.js:9694` — ele itera enquanto `cmd[_index+1].indent > _indent`.
5. **Trace manual dos 2 cenários** (branch true / branch false) usando a semântica real de `skipBranch` + `command411` (que respeita `_branch[_indent]`).
6. **Aplicar fix em 2 níveis**: (a) corrigir indent dos cmds existentes no JSON em disco; (b) atualizar script gerador para passar indent explícito + adicionar função de auto-correção para runs idempotentes anteriores.
7. **Validar JSON**: `python3 -m json.tool` + re-run do script para confirmar idempotência.
8. **Pedir playtest do usuário**: bug F4 (refresh runtime MZ) exige Ctrl+S + reiniciar Playtest.

Critério de parada: usuário confirma comportamento esperado no playtest manual.

## 7. Conhecimento reutilizável

### Fatos confirmados

- `Game_Interpreter.skipBranch` (MZ) compara apenas `indent`, não rastreia aninhamento IF/ELSE/END.
- `command411` (ELSE) só chama `skipBranch` se `_branch[_indent] !== false` (ou seja, se o IF original foi true). Isso evita que o corpo do ELSE seja pulado quando o IF falhou.
- `command111` (IF) armazena resultado em `_branch[_indent]` (array indexado por indent) e chama `skipBranch` se falso.
- `executeCommand` faz `this._indent = command.indent` antes de chamar o handler — indent é determinado pelo comando corrente, não por estado acumulado.
- Plugin Commands via JSON: `{code: 357, indent, parameters: [pluginName, cmdName, displayName, argsDict]}` + `{code: 657, indent, parameters: ["key = value"]}`.
- RMMZ arquivos core usam prefixo `rmmz_` (não `rpg_` como em MV).

### Preferências do usuário

- Prefere diagnóstico de causa raiz antes de aplicar fix (não "tentar mudanças e ver se funciona").
- Aceita correções em 2 níveis (script gerador + JSON em disco) sem questionar.
- Valida com playtest manual antes de declarar tarefa concluída — segue a regra [[user-testable-feedback]].

### Restrições técnicas

- Bug F4: MZ não relê `data/*.json` em runtime sem F10 → Ctrl+S → reiniciar Playtest.
- JSON válido não implica runtime correto — bugs estruturais de indent passam pelo parser.
- `python3 -m json.tool` valida sintaxe, não semântica.

### Armadilhas conhecidas

- **Cmds inseridos via script Python em CEs existentes DEVEM herdar o indent dos cmds vizinhos.** Default `indent=0` em helper `C()` é armadilha — funciona para top-level body, quebra silenciosamente em ramos IF/ELSE.
- Scripts idempotentes baseados em pattern matching (`has_log_race_event`) não corrigem bugs de indent em runs anteriores — precisam de função `_fix_*_indent` dedicada.
- Sintoma "comportamento de ambos os ramos executa" quase sempre indica bug de `skipBranch` por indent inconsistente.
- Confundir prefixo de arquivos core do MZ (`rmmz_`) com MV (`rpg_`) desperdiça uma busca `find`.

### Heurísticas recomendadas

- Antes de inserir qualquer cmd via script em CEs existentes, leia o cmd imediatamente anterior e use `indent = cmd_anterior.indent`.
- Helper `C(code, indent, parameters)` não deveria ter `indent=0` como default — obrigatório explicitar.
- Em bugs comportamentais de RMMZ, ler o source do interpreter antes de teorizar. Arquivo: `Jhonny/js/rmmz_objects.js`, função: `Game_Interpreter.prototype.*`.
- Helper Python para dump de CE (formato `cmd N [ind=N] code=N desc`) é reutilizável em qualquer debug futuro de RMMZ — vale manter como snippet.

## 8. Informações que deveriam estar no prompt inicial

- **Obrigatório**: nada. O sintoma do usuário foi suficiente e preciso.
- **Útil**: menção explícita a "bug surgiu após F7" já estava implícita em "as últimas alterações"; git diff confirmou em 1 comando.
- **Opcional**: nome do arquivo de CE suspeito — mas `git diff` revelou naturalmente.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

**Problema observado:** bug de `skipBranch` por indent inconsistente não estava documentado em nenhum artefato antes desta sessão.

**Informação ausente:** semântica de `Game_Interpreter.skipBranch` (compara indent, não nesting IF/ELSE/END).

**Por que pertence à análise técnica:** é uma restrição técnica estrutural do runtime RMMZ que afeta qualquer patch estrutural em CEs — não é específica desta fase.

**Seção sugerida:** novo item sob "Restrições técnicas" da análise técnica do core-loop (ou análise técnica global do projeto Jhonny).

**Texto sugerido:**

> **RPG Maker MZ `skipBranch` é baseado em indent, não em nesting IF/ELSE/END.** Qualquer comando inserido via script Python em `CommonEvents.json` dentro de um corpo de IF/ELSE DEVE ter `indent` igual ao do corpo onde está sendo inserido. Cmds com `indent=0` dentro de corpo `indent=1` farão `skipBranch` parar cedo demais, executando cmds que deveriam ser pulados. Sintoma: comportamento de ambos os ramos IF/ELSE executa, ou "label atualiza mas crash acontece". Source: `Jhonny/js/rmmz_objects.js:9694`.

**Impacto esperado:** qualquer fase futura que estenda CEs via script será imune a este bug.

### 9.2 Melhorias no plano de implementação

**Nenhuma alteração recomendada para o plano de implementação.** O bug não decorreu de deficiência do plano — decorreu de decisão operacional da LLM (defaultar `indent=0` no helper `C()` e não propagar `indent` nas funções de patch).

### 9.3 Melhorias nas tasks da fase executada

**Task 7.3 (logRaceEvent Plugin Command) — adicionar nota de indent:**

**Informação ausente:** a task não especificava que cmds inseridos em ramos IF/ELSE devem herdar o indent do ramo.

**Consequência observada:** script gerador defaultou para `indent=0`.

**Alteração recomendada — adicionar na task 7.3:**

> **Atenção — indent em cmds inseridos dentro de IF/ELSE:** Os Plugin Commands logRaceEvent em CE 12 cmds 19-20 (ramo sucesso) e cmds 32-33 (ramo falha) DEVEM ser inseridos com `indent=1` (mesmo indent do corpo do IF/ELSE). Default `indent=0` quebra `Game_Interpreter.skipBranch` e faz CE 18 (Crash) rodar em ambos os caminhos. Plugin Commands em CEs 5, 11, 18, 19 ficam no top-level body e usam `indent=0` corretamente.

**Como validar:** após aplicar patch, dump Python do CE deve mostrar cmds 19, 20, 32, 33 com `indent=1` (não `indent=0`).

### 9.4 Problemas fora do escopo dos artefatos

- **Confusão MV vs MZ em prefixo de arquivos core** — operacional, não exige alteração de artefato. Já coberto por [[rpg-mz-indent-skipbranch]] memory.
- **Iteração mental sobre semântica de skipBranch antes de ler source** — operacional. Próxima execução deve ler source primeiro.

### 9.5 Matriz de rastreabilidade das melhorias

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|--------------------|-----------------|---------------------|---------------------|------------|
| Cmds logRaceEvent inseridos com indent=0 em ramos IF/ELSE | Falta de documentação da semântica de skipBranch | Análise técnica | Adicionar seção "Restrições técnicas: skipBranch baseado em indent" | Alta |
| Mesmo bug | Task 7.3 não especificava indent dos cmds inseridos | Task 7.3 | Adicionar nota de indent obrigatório para cmds em ramos IF/ELSE | Alta |
| Confusão `rpg_*.js` vs `rmmz_*.js` | Falha de recall operacional | Fora do escopo | Memory [[rpg-mz-indent-skipbranch]] já cobre | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Adicionar seção sob "Restrições técnicas":

```markdown
### skipBranch baseado em indent (RPG Maker MZ)

`Game_Interpreter.skipBranch` (Jhonny/js/rmmz_objects.js:9694) itera
`while (cmd[_index+1].indent > _indent)` — não rastreia aninhamento
IF/ELSE/END. Comandos inseridos via script em CommonEvents.json dentro
de corpo de IF/ELSE DEVEM herdar o indent do corpo (geralmente indent=1
para corpo de IF top-level). Cmds com indent=0 dentro de corpo indent=1
fazem skipBranch parar cedo demais e executar cmds que deveriam ser
pulados. Sintoma clássico: comportamento de ambos os ramos IF/ELSE
executa, ou "estado de sucesso aplica mas crash também dispara".

`command411` (ELSE) respeita `_branch[_indent]` — só pula o corpo do
ELSE se o IF original foi true. Isso significa que o bug se manifesta
principalmente no caminho true (ramo IF executa + corpo do ELSE "vaza").
```

#### Patch sugerido para o plano de implementação

`Nenhuma alteração recomendada para o plano de implementação.`

#### Patch sugerido para as tasks da fase executada

**Task 7.3 — adicionar subseção:**

```markdown
#### Indent obrigatório para cmds em ramos IF/ELSE

Em CE 12 (EV_OnRisk), os 4 cmds logRaceEvent ficam dentro de ramos
IF/ELSE cujo corpo é indent=1:

- RISK_SUCCESS (cmds 19-20): dentro do ramo TRUE do IF em cmd 9
- RISK_FAIL (cmds 32-33): dentro do ramo ELSE em cmd 25

Use `make_log_race_event_cmd(event_type, indent=1)` para estes.
NÃO usar default indent=0 — quebra Game_Interpreter.skipBranch.

Plugin Commands em CEs 5, 11, 18, 19 ficam no top-level body (sem IF
circundante) e usam indent=0 corretamente.

Validação: após gerar JSON, rodar dump Python e confirmar:
- CE 12 cmds 19, 20, 32, 33 → indent=1
- CE 5 cmd 15, CE 11 cmds 18-19, CE 18 cmds 0-1, CE 19 cmds 0-1 → indent=0
```

#### Ações fora do fluxo de especificação

- Memory `[[rpg-mz-indent-skipbranch]]` já persistida em
  `~/.claude/projects/-Users-edney-projects-coreto-summer26/memory/` —
  cobre o aprendizado para sessions futuras independentemente de
  artefatos do projeto.

## 10. Checklist operacional

Para próxima execução que envolva patch estrutural em CEs via script:

1. [ ] Antes de inserir qualquer cmd em CE existente, ler o cmd anterior e usar `indent = cmd_anterior.indent`.
2. [ ] Helper `C(code, indent, parameters)` deve exigir `indent` explícito — não confiar em default.
3. [ ] Após aplicar patch, dumpar CE afetado com Python e confirmar que cmds novos têm indent consistente com vizinhos.
4. [ ] Para patches idempotentes, incluir função `_fix_*_indent()` que reescreve indent caso cmd já exista com valor errado.
5. [ ] Em bugs comportamentais de RMMZ, ler `Jhonny/js/rmmz_objects.js` antes de teorizar — source é a fonte da verdade.
6. [ ] Validar JSON com `python3 -m json.tool` (sintaxe) E com dump estrutural (semântica de indent).
7. [ ] Bug F4: instruir usuário a F10 → Ctrl+S → reiniciar Playtest.
8. [ ] Pedir confirmação de playtest antes de declarar tarefa concluída.
