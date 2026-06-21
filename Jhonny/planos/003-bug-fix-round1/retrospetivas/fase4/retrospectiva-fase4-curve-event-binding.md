# Retrospectiva — Fase 4 (Curve Event Binding)

> Destinada a outra LLM que for executar tarefa equivalente no projeto
> Jhonny. Foco em armadilhas, desperdícios e correções reutilizáveis —
> não em narrativa.

## 1. Resumo da tarefa

**Pedido:** Implementar Fase 4 do plano `Jhonny/planos/003-bug-fix-round1/tasks.md`
(bug #4 — "labels Risk/Safe invertidos na Cena de Curva").

**Entregue:** Dois patches no generator
`interaction/fase4/fix_curve_labels.py`:
- **Patch K** (CE 9 `EV_RenderCurva` cmds 12/13): mouse bindings trocados —
  pic 43 (`race/btn_direita`, x=624) → CE 12 (Risk); pic 44
  (`race/btn_esquerda`, x=336) → CE 11 (Safe).
- **Patch L** (CE 13 `EV_KeyInput` cmd 4 branch Curva): keyboard handler —
  `'right'` → CE 12 (Risk), `'left'` → CE 11 (Safe). Branch Sinal
  (`'down'`→11, `'up'`→12) intocada.

**Diagnóstico real:** H6 (event-binding inversion), não H1–H5 listados no
task-4.1. Mouse + teclado estavam ambos invertidos.

**Critério de sucesso:** user disse "FUNCIONOU" após Playtest em
2026-06-21. JSON valida, diff = 3 linhas (+3/-3), generator idempotente
(2ª run = "skip" x2 + git diff vazio entre runs), audit K/L semântico
passa.

**Restrições relevantes:**
- RPG Maker MZ + plugin ButtonPicture + Common Events JSON.
- `Jhonny/js/rmmz_objects.js` é fonte da verdade para opcodes.
- Convenções de memória: `never-delete-common-events`,
  `user-testable-feedback`, `curva-convention-inversion`.
- JSON do projeto é `indent=4` (não `indent=2`).

## 2. Decisões técnicas e inferências

### 2.1 — H6 (event-binding inversion) fora da lista H1–H5
- **Decisão:** Adicionar nova hipótese H6 ao diagnosis.md após H1–H5
  serem rejeitados pela evidência.
- **Motivo:** task-4.1 listava apenas coord swap, file swap, condition
  inversion, opcode drift, TextPicture bake timing. Nenhum desses
  cobre "binding CE-picture invertido".
- **Evidência:** Dump de CE 9 cmd 12/13 mostrou
  `picture(43).mzkp_commonEventId = 11` (direita → Safe). Dump de CE 13
  cmd 4 mostrou `'right' → reserveCommonEvent(11)`. Spec §5 diz
  Direita = Risk.
- **Resultado:** Funcionou — diagnóstico correto na primeira análise.
- **Avaliação:** Necessária. Hipóteses incompletas no task-4.1 eram um
  risco conhecido (mas não documentado).
- **Melhoria futura:** Toda task de "diagnóstico" com lista de hipóteses
  deve incluir uma HN genérica "binding/atribuição semântica invertida"
  quando o sistema tem atribuições dinâmicas (event handlers, callbacks,
  plugin hooks).

### 2.2 — `json.dump(indent=2)` em vez de `indent=4`
- **Decisão:** Escrevi o generator com `indent=2` seguindo o exemplo
  literal no task-4.2 (que dizia `json.dump(ces, f, indent=2,
  ensure_ascii=False)`).
- **Motivo:** Task spec continha o exemplo com indent=2; presumi que era
  o formato canônico do projeto.
- **Evidência:** `git diff --stat` mostrou 3773+/3773- (arquivo inteiro
  reflowed). HEAD verificado depois: usa 4 espaços.
- **Resultado:** Falhou — diff ficou irrecuperável, precisei
  `git restore` e reescrever o generator.
- **Avaliação:** Falha de execução. A informação "formato do JSON" não
  estava no task, mas deveria ter sido verificada com `head -c 200` ou
  `git show HEAD:...` antes da primeira escrita.
- **Melhoria futura:** Antes de qualquer `json.dump` em arquivo JSON
  existente, comparar indent do HEAD: `git show HEAD:<path> | head -c 200`.
  É 1 comando, custa <100 tokens.

### 2.3 — Padrões de string literal em vez de regex no patcher L
- **Decisão:** Escrevi `buggy_left = "isTriggered('left'))
  $gameTemp.reserveCommonEvent(12)"` com **1 espaço** entre `)` e `$`.
- **Motivo:** Olhei o dump formatado pelo Python, que colapsa espaços
  visualmente.
- **Evidência:** Após 1ª run, audit mostrou
  `('right')) reserveCommonEvent(12)` (correto) mas
  `('left'))  reserveCommonEvent(12)` (ainda 12, dois espaços no
  original não casaram com o padrão de 1 espaço).
- **Resultado:** Falhou parcialmente — right corrigido, left não. JSON
  ficou em estado inválido (both → 12).
- **Avaliação:** Falha de execução. A informação estava disponível no
  dump raw (`repr()` teria mostrado os espaços).
- **Melhoria futura:** Para qualquer patcher que case substrings em
  código fonte, usar `repr()` no Python dump antes de escrever padrões.
  Ou usar regex com `\s+` desde o início.

### 2.4 — Audit com regex de um único `\)` em vez de `\)\)`
- **Decisão:** Reusei a mesma família de padrões do patcher L no audit,
  sem duplicated backslash para os dois `)` (`('up')` fecha string,
  `)` fecha `isTriggered(`).
- **Motivo:** Copy-paste do raciocínio do patcher.
- **Evidência:** Audit imprimiu
  `AssertionError: Sinal 'up' must reserve CE 12 (Risk), got NO MATCH`.
- **Resultado:** Falhou — mas o patcher já tinha aplicado a mudança
  corretamente; só o audit é que estava quebrado.
- **Avaliação:** Falha de execução, mesma causa raiz que 2.3.
- **Melhoria futura:** Mesma regra: regex em código-fonte com parens
  aninhados precisa de escape duplo.

### 2.5 — Atualizar variável `p3/p4` para `p` no patch K
- **Decisão:** Função `_expected_mouse_src` usa `const p = ` como
  forma canônica, então o patch normalized `p3`→`p` e `p4`→`p`.
- **Motivo:** Simplicidade — um único template serve para ambos os cmds.
- **Evidência:** Diff mostra `const p3` → `const p` além do CE ID swap.
- **Resultado:** Funcionalmente correto (IIFE-scoped), mas o diff ficou
  maior do que o mínimo necessário (variável renomeada além do binding
  trocado).
- **Avaliação:** Aceitável. Não causou bug.
- **Melhoria futura:** Para diff mínimo, preservar o nome da variável
  original via substituição in-place do número CE apenas.

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Necessário? | Substituível? |
| ---------- | -------- | ----------- | ------------- |
| `rg Risk\|Safe` em CommonEvents.json | Achar CEs candidatos | Sim | Combinar com dump Python direto |
| `find img/pictures -name "*risk*"` | Confirmar H2 (file swap) | Sim | Único `ls` |
| `python3 << EOF` dump CE 9/11/12/13/16 | Inspeção comando-a-comando | Sim | **Um único dump_all_ces.py** no início evitaria múltiplas variações |
| `git show HEAD:Jhonny/data/CommonEvents.json \| head -c 500` | Descobrir indent do HEAD | Sim (tardiamente) | **Deveria ter sido o passo 1 antes de escrever** |
| `python3 -m json.tool` | Validar JSON pós-edit | Sim | Insubstituível |
| `git restore Jhonny/data/CommonEvents.json` | Recuperar de bad 1ª run | Sim (corretivo) | Evitável se 2.2 tivesse sido verificado |
| `python3 -c "import ast; ast.parse(open(...))"` | Syntax check do generator | Sim | Insubstituível |
| Audit K/L Python inline (regex) | Verificar bindings semânticos | Sim | Já na spec — executar como bloco único |

**Desperdícios observados:**
- Rodei o generator 1x com bug de indent, vi 3773 linhas de diff, tive
  que `git restore` + corrigir indent + re-rodar. Custo: 2 ciclos
  completos de write/run/diff/restore que 1 único `head -c 200` no
  HEAD teria evitado.
- Rodei o generator 1x com bug de regex no patch L, vi audit falhar,
  tive que inspectar `repr()` do source para entender o porquê. Custo:
  1 ciclo extra de write/run/audit/fix.
- Audit regex com mesmo bug de `\)` vs `\)\)` que o patcher. Custo: 1
  iteração extra para debugar.

## 4. Intervenções e correções do usuário

**Nenhuma intervenção foi necessária durante a execução.** O usuário
forneceu apenas:
1. O comando inicial `implemente a fase 4 do plano ...` — escopo claro.
2. O comando `/context` (apenas informativo, exibindo uso de tokens).
3. O sinal canônico `FUNCIONOU!!` após Playtest — confirmação de
   sucesso.

Toda a identificação de bugs no patcher (indent, regex) foi feita pela
própria LLM via diff/audit antes do handoff. O fluxo
write→audit→fix→re-run manteve o usuário fora do loop até o Playtest
final.

## 5. Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
| ----------- | ------- | ----- | ----------- |
| `json.dump(indent=2)` em arquivo `indent=4` | Médio (1 ciclo write+diff+restore+rewrite) | Padrão do task-4.2 copiado literalmente sem verificar HEAD | Incluir "verificar indent do HEAD antes de json.dump" no checklist |
| Padrões de string literal em código JS com whitespace variável | Médio (1 ciclo run+audit+fix+re-run) | Dump formatado colapsa espaços visualmente | Usar `repr()` no dump ou regex com `\s+` desde o início |
| Audit regex com `\)` faltando duplicação | Baixo (1 ciclo debug+fix) | Copy-paste do raciocínio errado do patcher | Testar regex contra sample conhecido antes de rodar audit completo |
| 3 reads de tasks (4.1, 4.2, 4.3) | Baixo | Necessário para entender specs | Poderia ter lido via offset/limit (cada uma <130 linhas) |
| Normalização `p3/p4`→`p` no patch K | Baixo | Template único para ambos os cmds | Substituir só o CE ID, preservar nome original |
| Leu retrospectiva-fase3 completa (435 linhas) | Baixo | Queria entender padrões do projeto | Bastava o checklist final + "Caminho mínimo" |

## 6. Caminho mínimo recomendado

Para executar Fase 4 novamente:

1. **Dump único** dos CEs relevantes via Python (CE 7, 8, 9, 11, 12, 13,
   16, 19) — captura placements, bindings, handlers em uma chamada.
2. **Verificar indent do HEAD** com `git show HEAD:Jhonny/data/CommonEvents.json
   | head -c 200` antes de qualquer `json.dump`.
3. **Inspecionar `repr()`** de cada string JS que será patcheada —
   revela whitespace de alinhamento que dumps formatados escondem.
4. **Verificar opcodes** em `rmmz_objects.js` para 231/355/117 (lista
   canônica no topo do generator fase3 também serve de referência).
5. **Escrever o generator** com patches K (mouse) + L (teclado),
   idempotentes via regex com `\s+` e checagem de CE ID atual.
6. **Rode 2x** (applied→skipped) + valide JSON + rode audit K/L.
7. **Hard-refresh Playtest** com 2 checkpoints: clique Right→Risk,
   clique Left→Safe; tecla → → Risk, tecla ← → Safe.

**Critério de parada:** "FUNCIONOU" do user + audit Python "OK" +
generator idempotente confirmado por git diff vazio entre runs.

## 7. Conhecimento reutilizável

### Fatos confirmados
- ButtonPicture.js usa `picture.mzkp_commonEventId` para bindar click →
  CE. Atribuição é feita via script inline `code=355` em CEs de render.
- CE 13 `EV_KeyInput` é um parallel CE que lê `Input.isTriggered(...)`
  a cada tick e chama `$gameTemp.reserveCommonEvent(N)`. Branch
  Sinal/Curva via `$gameVariables.value(102)` (VAR_SCENE_TYPE: 0=Sinal,
  !=0=Curva).
- Var 102 (`VAR_SCENE_TYPE`) e switch 102 (`SW_CRASH_FLAG`) são
  namespaces diferentes — não confundir.
- JSON de `Jhonny/data/CommonEvents.json` é `indent=4` (verificado em
  HEAD).
- Código JS inline em `code=355` pode ter whitespace de alinhamento
  não-trivial (ex: `'left'))  $gameTemp` com 2 espaços para alinhar com
  `'right')) $gameTemp`).

### Preferências do usuário
- Sinal canônico de sucesso: "FUNCIONOU" (memória existente).
- Generator deve ser idempotente — 2ª run imprime "skip" e produz git
  diff vazio (regra do plano).
- Diff mínimo é valorizado — evitar reflow de arquivos JSON.
- Hard-refresh (`Cmd+Shift+R`) é obrigatório antes de Playtest após
  escrever em `data/*.json` (regra do plano).

### Restrições técnicas
- `json.dump(ces, f, indent=N)` deve usar o mesmo N do HEAD (4 para
  CommonEvents.json). Usar outro valor reflow o arquivo inteiro.
- Regex em código JS com parens aninhados precisa de escape duplo:
  `\)\)` para fechar string + função.
- Auditoria deve validar o **significado** (qual CE bindado a qual
  input/picture), não apenas "o opcode 355 está presente" — audits
  tautológicos perdem regressões (regra do plano).

### Armadilhas conhecidas
- **`json.dump(indent=2)` em arquivo `indent=4`** → 3773 linhas de diff
  ruído. Sempre verificar indent do HEAD antes.
- **String literal em código JS com whitespace de alinhamento** →
  substring match falha silenciosamente (substituição parcial). Usar
  regex `\s+` ou inspecionar `repr()` primeiro.
- **H6 (event-binding inversion) não estava na lista H1–H5 do task-4.1**
  → sempre considerar binding/atribuição invertida quando o sistema tem
  handlers dinâmicos.
- **Audit regex com mesmo bug do patcher** → false negative na
  verificação. Validar regex contra sample conhecido antes.

### Heurísticas recomendadas
- Antes de `json.dump` em arquivo versionado: `git show HEAD:<path>
  | head -c 200`.
- Antes de escrever padrões de substring em código fonte: dumpar com
  `repr()` ou usar regex `\s+`.
- Para tasks de "diagnóstico" com lista de hipóteses: incluir HN genérica
  para "binding semântico invertido" quando aplicável.
- Para diff mínimo: substituir apenas o byte que muda, não reescrever a
  linha inteira.

## 8. Informações que deveriam estar no prompt inicial

| Item | Classificação |
| ---- | ------------- |
| Formato JSON canônico do projeto (`indent=4`) | Obrigatório (qualquer json.dump errado quebra o diff) |
| Mapeamento CE index → nome (CE 9 = EV_RenderCurva, CE 11 = EV_OnSafe, etc.) | Útil (acelera mas é descoberto em 1 dump) |
| Mapeamento variável/switch (var 102 = VAR_SCENE_TYPE) | Útil (acelera mas é descoberto em 1 dump System.json) |
| Aviso "código JS inline pode ter whitespace de alinhamento" | Útil (já implícito em `repr()` heurística) |
| H6 na lista de hipóteses do task-4.1 | Útil (acelera mas inferível em 1 dump) |
| Confirmação de que Sinal branch (down/up) deve permanecer inalterada | Útil (especificado no spec §4 mas implícito no task) |
| Estrutura de diretórios pós-reorganização (`interaction/faseN/`) | Opcional (especificado pelo user quando necessário) |

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

**Problema observado:** Hipóteses H1–H5 no task-4.1 não incluem
"event-binding inversion" (H6), apesar de o sistema ButtonPicture usar
atribuição dinâmica via `mzkp_commonEventId`.

**Informação ausente:** Lista de hipóteses deveria incluir H6 para
binding CE-picture e CE-keyboard.

**Por que pertence à análise técnica:** É uma propriedade estrutural do
sistema de input do projeto (ButtonPicture + reserveCommonEvent), não
um detalhe operacional da task.

**Onde adicionar:** Análise técnica do plano 003 (se existir) ou
task-4.1 seção "Hypotheses".

**Texto sugerido:**
> | ID | Mechanism                                     | Likelihood |
> | -- | --------------------------------------------- | ---------- |
> | H6 | `picture.mzkp_commonEventId` ou `reserveCommonEvent(N)` atribui o CE errado à picture/tecla — bindings invertidos entre Safe e Risk | High quando o sistema usa ButtonPicture + Input.isTriggered |

**Impacto:** Elimina a necessidade de adicionar H6 ad-hoc no
diagnosis.md.

### 9.2 Melhorias no plano de implementação

**Problema observado:** Plano não tem step de "verificar formato JSON
canônico antes de json.dump". Isso causou o ciclo waste de indent=2.

**Deficiência do plano:** Convenções (seção `Conventions` do tasks.md)
falam sobre `python3 -m json.tool` para validar, mas nada sobre
**preservar indent** ao escrever.

**Etapa afetada:** Todas as fases que usam generators (1, 2, 3, 4, 5).

**Alteração recomendada:** Adicionar convenção explícita sobre indent.

**Texto sugerido para a seção `Conventions` do tasks.md:**
> - **JSON indent preservation:** antes de qualquer `json.dump(ces, f,
>   indent=N)`, confirme o `indent` do HEAD via `git show HEAD:<path>
>   | head -c 200`. O projeto usa `indent=4` para `CommonEvents.json`;
>   usar outro valor reflow o arquivo inteiro e gera diff ruído de
>   ~3700 linhas. O generator deve usar `json.dump(ces, f,
>   indent=<valor_do_HEAD>, ensure_ascii=False)`.

**Como reduziria custo:** Elimina 1 ciclo write→diff→restore→rewrite
(~3-4 chamadas de tool + iteração de pensamento) em cada fase que use
generators.

### 9.3 Melhorias nas tasks da fase executada

**Task 4.1 afetada.**

**Informação ausente:** H6 não estava na lista de hipóteses.

**Consequência observada:** Tive que adicionar H6 ad-hoc ao
diagnosis.md e estender a seção "Implementation choice" do task-4.2
implicitamente.

**Alteração recomendada:** Adicionar H6 + atualizar "Visual Context"
para mencionar que binding pode ser via mouse (CE 9 cmd 12/13) ou
teclado (CE 13 cmd 4).

**Texto sugerido para incluir na lista de hipóteses do task-4.1:**
> | H6 | Event-binding inversion — `picture.mzkp_commonEventId` atribui CE errado (pic 43 → CE 11 Safe quando deveria ser CE 12 Risk) e/ou handler de teclado `$gameTemp.reserveCommonEvent(N)` tem CE trocado para 'right'/'left' no branch Curva | High |

**Como validar:** Ao executar próxima task de input bug, H6 deve estar
na lista desde o início.

---

**Task 4.2 afetada.**

**Informação ausente:** "Implementation choice" cobre apenas H1, H2,
H3. Não cobre H6.

**Consequência observada:** Tive que inferir a abordagem (direct JSON
edit via Python script) sem guia explícito.

**Alteração recomendada:** Adicionar entrada para H6.

**Texto sugerido para incluir em "Implementation choice" do task-4.2:**
> - **If H6 (event-binding inversion):**
>   - Use a Python script `fase4/fix_curve_labels.py` (direct JSON edit).
>   - Two patches:
>     - **Patch K** (mouse, CE 9 cmds 12/13): swap `mzkp_commonEventId`
>       values 11 ↔ 12 on pic 43 (direita) and pic 44 (esquerda).
>     - **Patch L** (keyboard, CE 13 cmd 4): in the Curva `else` branch
>       of the inline JS, swap `reserveCommonEvent(11)` ↔
>       `reserveCommonEvent(12)` for `'right'` and `'left'`. The Sinal
>       branch (`'down'`, `'up'`) stays unchanged.
>   - Use **regex with `\s+`** for whitespace tolerance: the original
>     code aligns `'left'`/`'up'` with `'right'`/`'down'` via extra
>     spaces. Literal substring match will silently fail to match.
>   - Idempotency: detect current CE ID per picture/key; if already
>     correct, print "skip".
>   - Before naming the patch function, identify the next free patch
>     letter via `rg "patch_[a-z]_" fase*/build_phase*.py
>     interaction/fase*/build_phase*.py`; K and L are next after
>     Phase 3's I/J.

**Como validar:** Próxima LLM executando Fase 4 seguiria o recipe direto
sem inferir.

---

**Task 4.3 afetada.**

**Informação ausente:** Audit H do task-4.3 é genérico ("depends on the
diagnosis"). Não tem exemplo concreto para H6.

**Alteração recomendada:** Adicionar exemplo de audit H6.

**Texto sugerido para incluir em task-4.3 step 4:**
> **Audit H6 — Event bindings match spec §5 (Direita=Risk,
> Esquerda=Safe):**
> ```python
> import json, re
> ces = json.load(open('Jhonny/data/CommonEvents.json'))
> # Mouse: pic 43 (direita @ RIGHT) -> CE 12 (Risk); pic 44 (esquerda @ LEFT) -> CE 11 (Safe)
> c12 = ces[9]['list'][12]['parameters'][0]
> c13 = ces[9]['list'][13]['parameters'][0]
> assert re.search(r"picture\(43\).*mzkp_commonEventId\s*=\s*12", c12), "pic 43 must bind CE 12"
> assert re.search(r"picture\(44\).*mzkp_commonEventId\s*=\s*11", c13), "pic 44 must bind CE 11"
> # Keyboard Curva branch: right->12, left->11; Sinal: down->11, up->12
> src = ces[13]['list'][4]['parameters'][0]
> def key_ce(k): 
>     m = re.search(rf"isTriggered\('{k}'\)\)\s+\$gameTemp\.reserveCommonEvent\((\d+)\)", src)
>     assert m, f"key '{k}' not found"
>     return int(m.group(1))
> assert key_ce('down') == 11 and key_ce('up') == 12, "Sinal branch must be down->11, up->12"
> assert key_ce('right') == 12 and key_ce('left') == 11, "Curva branch must be right->12, left->11"
> print("Audit H6 OK")
> ```
> Note: regex needs `\)\)` (two close parens — one for `'key'` string
> literal, one for `isTriggered(`) and `\s+` (whitespace tolerance for
> alignment between `'left'`/`'up'` and `'right'`/`'down'`).

**Como validar:** Audit imprime "Audit H6 OK" sem AssertionError.

### 9.4 Problemas fora do escopo dos artefatos

| Problema | Por que fora do escopo | Como tratar |
| -------- | --------------------- | ----------- |
| `json.dump(indent=2)` em arquivo `indent=4` | Falha operacional da LLM; convenção sobre indent já está sugerida em 9.2 | Aplicar heurística "verificar HEAD antes de json.dump" |
| Padrões de string literal sem whitespace tolerance | Falha operacional da LLM; natureza do código JS é variável | Usar `repr()` ou `\s+` desde o início |
| Audit regex com `\)` faltando duplicação | Falha operacional da LLM; regex é detalhe técnico | Testar regex contra sample conhecido |
| Normalização `p3/p4`→`p` no patch K | Decisão de implementação; não muda semântica | Aceitável |

### 9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
| ------------------ | --------------- | -------------------- | -------------------- | ---------- |
| H6 fora da lista de hipóteses do task-4.1 | Análise técnica não listou binding semântico | Task 4.1 + análise técnica | Adicionar H6 à lista | Alta |
| `json.dump(indent=2)` reflowed arquivo | Convenção sobre indent não está no tasks.md | Plano de implementação | Adicionar convenção "JSON indent preservation" | Alta |
| Padrões literais sem `\s+` falharam | Task-4.2 não alerta sobre whitespace de alinhamento | Task 4.2 (Implementation choice para H6) | Adicionar entrada H6 com regex `\s+` | Alta |
| Audit H genérico demais para H6 | Task-4.3 não tem exemplo concreto | Task 4.3 | Adicionar exemplo de audit H6 com regex canônica | Média |
| Variável `p3/p4` normalizada para `p` no patch K | Template único no patcher | Fora do escopo | Aceitável, sem alteração | Baixa |
| Regex do audit com `\)` em vez de `\)\)` | Copy-paste do bug do patcher | Fora do escopo (operacional) | Testar regex contra sample | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

```markdown
## Hipóteses canônicas para bugs de input binding

Quando o sistema usa ButtonPicture (mzkp_commonEventId) ou
reserveCommonEvent via Input.isTriggered, incluir H6:

| ID | Mechanism | Likelihood |
| -- | --------- | ---------- |
| H6 | Event-binding inversion — `picture.mzkp_commonEventId` ou `reserveCommonEvent(N)` atribui o CE errado à picture/tecla (ex: pic direita → CE Safe em vez de Risk) | High quando o sistema usa binding dinâmico |

CEs relevantes para a Cena de Curva:
- CE 9 (EV_RenderCurva): cmds 12/13 atribuem mzkp_commonEventId a pics 43/44
- CE 13 (EV_KeyInput): cmd 4 chama reserveCommonEvent(N) para cada tecla
- CE 11 (EV_OnSafe): handler Safe
- CE 12 (EV_OnRisk): handler Risk
```

#### Patch sugerido para o plano de implementação

Adicionar à seção `Conventions` do `tasks.md`:

```markdown
- **JSON indent preservation:** Antes de qualquer `json.dump(ces, f,
  indent=N)`, confirme o indent do HEAD via
  `git show HEAD:<path> | head -c 200`. O projeto usa `indent=4` para
  `CommonEvents.json`; usar outro valor reflow o arquivo inteiro e
  gera diff ruído. Generator deve usar
  `json.dump(ces, f, indent=<valor_do_HEAD>, ensure_ascii=False)`.
```

#### Patch sugerido para as tasks da fase executada

**Task 4.1 — adicionar à tabela de Hipotheses:**
```markdown
| H6 | Event-binding inversion — `picture.mzkp_commonEventId` atribui CE errado em CE 9 cmds 12/13 (pic direita → CE 11 Safe em vez de CE 12 Risk) e/ou handler de teclado em CE 13 cmd 4 tem `reserveCommonEvent(N)` trocado para 'right'/'left' no branch Curva | High |
```

**Task 4.2 — adicionar entrada H6 em "Implementation choice":**
```markdown
- **If H6 (event-binding inversion):**
  - Use Python script `fase4/fix_curve_labels.py` (direct JSON edit).
  - Two patches:
    - **Patch K** (CE 9 cmds 12/13): swap `mzkp_commonEventId` 11↔12 em pics 43 (direita) e 44 (esquerda).
    - **Patch L** (CE 13 cmd 4 branch Curva): swap `reserveCommonEvent(11)`↔`(12)` para 'right' e 'left'. Sinal branch ('down'/'up') intocado.
  - Use **regex `\s+`** para whitespace tolerance — código original alinha 'left'/'up' com 'right'/'down' via espaços extras. Substring match literal falha silenciosamente.
  - Idempotente: detect CE ID atual; se já correto, print "skip".
  - Próxima letra de patch: K, L (após I/J da fase 3).
```

**Task 4.3 — adicionar exemplo de audit H6:**
```markdown
**Audit H6 — Event bindings match spec §5:**
[ver bloco de código em 9.3 acima]

Notas: regex precisa de `\)\)` (dois `)` — um para 'key' string literal,
um para `isTriggered(`) e `\s+` (whitespace tolerance para alinhamento
entre 'left'/'up' e 'right'/'down').
```

#### Ações fora do fluxo de especificação

- Antes de qualquer `json.dump` em arquivo JSON versionado, rodar
  `git show HEAD:<path> | head -c 200` para confirmar indent.
- Para padrões de substring em código JS, usar `repr()` no dump ou
  regex `\s+` desde o início.
- Para regex em código com parens aninhados (`isTriggered('right')`),
  contar `)` duas vezes: `\)\)`.

## 10. Checklist operacional (próxima execução)

- [ ] Antes de qualquer `json.dump`: `git show HEAD:<path> | head -c 200`
      para confirmar indent (projeto usa 4).
- [ ] Listar CEs 0-19 com nome/trigger/switch antes de qualquer edição.
- [ ] Para cada substring a ser substituída em JS inline: usar `repr()`
      no dump Python para ver whitespace real, ou regex `\s+`.
- [ ] Para regex em código com parens aninhados (`isTriggered('X')`):
      usar `\)\)` (dois `)`).
- [ ] Verificar opcodes 231/355/117 em `rmmz_objects.js`.
- [ ] Generator deve ser idempotente — 2ª run imprime "skipped" x N e
      produz git diff vazio entre runs.
- [ ] `python3 -m json.tool Jhonny/data/CommonEvents.json` valida.
- [ ] Audit deve validar **significado** (qual CE bindado), não opcode.
- [ ] User faz hard-refresh (`Cmd+Shift+R`) antes do Playtest.
- [ ] Sinal visível/audível canônico confirmado pelo user ("FUNCIONOU").
- [ ] Memory `curva-convention-inversion` e `never-delete-common-events`
      consultadas antes de começar.
