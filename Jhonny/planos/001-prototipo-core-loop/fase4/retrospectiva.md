---
title: "Fase 4 — Retrospectiva técnica"
type: retrospectiva-tecnica
fase: 4
data: "2026-06-18"
executor: "Claude (glm-5.2)"
scope: "implementação F4 + sessão de debug pós-playtest"
depends_on: "[[fase-4-completa]], [[fase4/debug-pos-playtest]]"
---

# Fase 4 — Retrospectiva técnica

## 1. Resumo da tarefa

**Solicitado pelo usuário:**
1. Implementar a Fase 4 do plano `core_loop_corrida/tasks.md` (CEs 10-13: `EV_RaceTimer`, `EV_OnSafe`, `EV_OnRisk`, `EV_KeyInput` + extensão de `EV_RaceRenderer`, `EV_RenderSinal`, `EV_RenderCurva` com botões clicáveis).
2. Após playtest MZ, diagnosticar 3 bugs reportados: hover não funciona, clique no botão não dispara handler, teclas silenciosas.

**Entregue:**
- `Jhonny/data/System.json` estendido com `VAR_TIMER_TIMEOUT_FLAG` (Editor ID 116).
- `Jhonny/data/CommonEvents.json` com CEs 7-13 regenerados idempotentemente.
- `Jhonny/planos/001-prototipo-core-loop/fase4/setup_phase4_system.py` (pré-passo idempotente).
- `Jhonny/planos/001-prototipo-core-loop/fase4/build_phase4_ces.py` (gerador idempotente).
- `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/fase-4-completa.md` com registro + checklist de playtest (depois atualizado com status real).
- `Jhonny/planos/001-prototipo-core-loop/fase4/debug-pos-playtest.md` com 6 testes diagnósticos para o usuário rodar no console F12.

**Critérios de sucesso aplicados:**
- JSON válido (`python3 -m json.tool` OK em `System.json` e `CommonEvents.json`).
- Idempotência (reexecução do gerador produz diff vazio).
- Auditoria `rg "value\\(|setValue\\("` coerente com `System.json`.
- Playtest MZ do usuário com checklist manual.

**Restrições relevantes:**
- RPG Maker MZ 1.10.0; ID convention: array index = Editor ID (acesso direto em `_data[id]`).
- `Jhonny/CLAUDE.md`: nunca modificar `rmmz_*.js` diretamente (usar plugins); pt_BR; `System.json` é 0-based com offset só em arrays de Database (não em `variables`/`switches`).
- Skill `rpg-maker-mz-data-json` para edição de JSON do RMMZ.

## 2. Decisões técnicas e inferências

### 2.1 Correção off-by-one nos CE Editor IDs

- **Decisão:** Usar Editor IDs 10-13 para F4 (não 11-14 como dizia a documentação pré-F4).
- **Motivo:** Documentação prévia (`tasks.md`, `task-4.*.md`, `Atualizacao-aplicada.md`) afirmava IDs 11-14, mas `build_phase3_ces.py` e `fase3/retrospectiva.md` confirmavam 5-9 para F3.
- **Evidência:** `rmmz_objects.js:6888` confirma `$dataCommonEvents[this._commonEventId]` acesso direto; `fase3/retrospectiva.md §7` afirma "CE 5-9 recriados com IDs corrigidos".
- **Resultado:** Funcionou. CEs criados em slots corretos.
- **Avaliação:** Decisão necessária; conflito entre documentação e realidade precisava ser resolvido antes de implementar.
- **Melhoria futura:** Toda documentação que mapeia IDs deve incluir referência ao script de geração (`build_phaseN_ces.py`) como fonte de verdade; nunca confiar em markdown humano quando há script idempotente.

### 2.2 Bypass do Plugin Command `ButtonPicture → Set` via Script inline

- **Decisão:** Em vez de gerar Plugin Command (code 357) com schema opaco, usar `Script` (code 355) com `$gameScreen.picture(N).mzkp_commonEventId = X`.
- **Motivo:** Plugin Command code 357 tem schema interno do MZ Editor que pode variar entre versões e é difícil de gerar via Python+json.
- **Evidência:** `ButtonPicture.js:74-81` mostra que o Plugin Command "set" apenas faz `picture.mzkp_commonEventId = commonEventId`. `Sprite_Picture.isClickEnabled` (`ButtonPicture.js:84`) lê esta propriedade.
- **Resultado:** **Funcionou sintaticamente, mas o playtest revelou que o clique não dispara o handler** — causou suspeita de que o bind foi perdido. Hipótese H1 no debug-pos-playtest.md.
- **Avaliação:** A decisão tinha justificativa técnica sólida; porém não antecipou que `Game_Screen.showPicture` (`rmmz_objects.js:1065`) **cria nova instância de `Game_Picture` a cada chamada**, descartando propriedades custom.
- **Melhoria futura:** Antes de bypass Plugin Command, ler a função RMMZ que gerencia o ciclo de vida do objeto-alvo (neste caso `Game_Screen.showPicture`). Documentar o risco de propriedades transitórias.

### 2.3 Documentar hover nativo do ButtonPicture

- **Decisão:** Inicialmente (em `fase-4-completa.md`) afirmamos que o hover visual era nativo do ButtonPicture.
- **Motivo:** Presunção baseada em "plugins de botão normalmente têm hover".
- **Evidência:** Nenhuma na fase de implementação — não li o plugin completo.
- **Resultado:** Documentação errada. Playtest do usuário confirmou que hover não funciona. Investiguei `ButtonPicture.js` e `Sprite_Clickable` (`rmmz_sprites.js:80-90`) — ambos têm `onMouseEnter`/`onPress` vazios por padrão.
- **Avaliação:** Decisão **desnecessária** — não precisava ter afirmado nada sobre hover sem ler o código.
- **Melhoria futura:** Toda afirmação sobre comportamento "nativo" deve citar linha específica do código-fonte. Sem citação, não afirmar.

### 2.4 Hipótese de teste em cena errada

- **Decisão:** Sugerir que o user pode ter apertado `direita` em cena Sinal.
- **Motivo:** CE 13 ramifica por `VAR_SCENE_TYPE` — Sinal usa `down/up`, Curva usa `right/left`.
- **Evidência:** Estrutura do CE 13 mostra branch condicional. User não especificou qual cena testou.
- **Resultado:** Hipótese razoável, ainda não confirmada (user não reportou de volta).
- **Avaliação:** Inferência útil; mapeamento Sinal/Curva é factual.
- **Melhoria futura:** Toda task de teste de input deve incluir matriz explícita "cena X → tecla Y → handler Z".

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta/comando | Objetivo | Necessário? | Contribuiu? | Como evitar redundância |
|---|---|---|---|---|
| `Read` ButtonPicture.js | Confirmar que não há hover nativo | Sim | Sim, decisivo | Já ter lido antes de documentar hover |
| `Bash python3` imprimir CEs 7,8,9,11,12,13 | Verificar estrutura JSON dos CEs | Sim | Sim | — |
| `Bash python3` procurar `mzkp_commonEventId` no raw bytes | Confirmar escaping correto | Sim | Sim, confirmou scripts válidos | — |
| `Grep` por `isAnyButtonPressed/isPressed/...` em rmmz_scenes/sprites/objects | Entender fluxo de toque | Sim | Parcial | Poderia ser substituído por `Read` direto do Sprite_Clickable |
| `Read rmmz_sprites.js:1-180` | Sprite_Clickable prototype | Sim | Sim, decisivo para hover | — |
| `Read rmmz_sprites.js:2880-2980` | Sprite_Picture prototype | Sim | Sim, confirmou herança de Sprite_Clickable | — |
| `Read rmmz_objects.js:1060-1109` | `Game_Screen.showPicture` | **Crítico** | Sim, descobriu que nova instância é criada | — |
| `Read rmmz_objects.js:9927-10027` | `command111` (If) | Útil | Confirmou formato `[1, var, op_type, value, op]` | Já estava confirmado na sessão anterior |
| `Bash grep` por `showPicture/_pictures/realPictureId` | Confirmar index mapping | Útil | Confirmou pictureId→realPictureId | — |

**Leituras que poderiam ser evitadas:**
- `Read rmmz_objects.js:9927-10027` (If command) — formato já confirmado em implementação prévia.
- `Grep isAnyButtonPressed` em 3 arquivos — poderia ter lido `Sprite_Clickable` direto.

**Informações descobertas tardiamente que deveriam ter sido verificadas primeiro:**
- `Game_Screen.showPicture` cria nova instância (descoberto em debug; deveria ter sido lido na implementação F4 task-4.2).
- `Sprite_Clickable.onMouseEnter` é vazio (descoberto em debug; deveria ter sido lido antes de documentar hover em F4).

## 4. Intervenções e correções do usuário

### 4.1 Feedback do playtest MZ

- **Instrução:** User reportou: hover não funciona; clique não dispara handler (`SW_INPUT_LOCKED` ficou OFF); teclas silenciosas; mas timer decrementa e reset manual funciona.
- **Antes:** Documentação `fase-4-completa.md` afirmava que tudo funcionaria conforme checklist.
- **Causa:** Implementação não foi testada antes de documentar; presunções sobre ButtonPicture não validadas.
- **Mudança:** Atualizei `fase-4-completa.md` com status real (PASS/FAIL/BLOCKED); criei `debug-pos-playtest.md`.
- **Regra reutilizável:** Documento de "completa" nunca deve marcar item como `[x]` antes do playtest. Sempre `[ ]` (pendente) até user confirmar.

### 4.2 Compact com pedido de preservar info de debug

- **Instrução:** "guarde informações valvalosas para debug. pois tem coisa com bug nessa implementação."
- **Mudança:** Summary da compactação incluiu 10 itens de "KNOWN BUGS/RISKS" + scripts canônicos para debug.
- **Regra reutilizável:** Sempre que compactar após trabalho com bugs identificados, listar bugs + scripts canônicos no início do summary.

## 5. Análise de desperdício

| Desperdício | Impacto | Causa | Como evitar |
|---|---|---|---|
| Afirmar hover nativo sem ler plugin | Médio | Presunção sobre "plugins de botão normalmente têm hover" | Regra: toda afirmação sobre comportamento nativo deve citar linha do código-fonte |
| Não ler `Game_Screen.showPicture` durante task-4.2 | Alto (causou bug em produção) | Foco no fluxo feliz (criar botão); não antecipar re-renderização | Regra: para toda propriedade custom em objeto gerenciado pelo RMMZ, ler a função que cria/recria o objeto |
| Atualizar 5 arquivos de plano (`tasks.md`, `task-4.1-4.4.md`, `Atualizacao-aplicada.md`) ainda referenciando IDs 11-14 | Médio | Documentação prévia estava errada (off-by-one); decidimos não corrigir para não atrasar implementação | Quando descobrir erro em documento, corrigir imediatamente ou criar arquivo de "errata" referenciado |
| Documento `debug-pos-playtest.md` com 6 passos quando 3 seriam suficientes | Baixo-médio | Verbosidade; queria cobrir todas as hipóteses sem priorização | Limitar a 3 testes máximo para próxima iteração; pedir retorno do user antes de expandir |
| Re-lê `rmmz_objects.js:9927-10027` (If command) | Baixo | Esqueci que já havia confirmado formato em implementação pré-compact | Manter "fatos confirmados" no summary da compactação |

## 6. Caminho mínimo recomendado

Para repetir a sessão de debug (3 bugs em CEs RMMZ) com menor custo:

1. **Receber feedback do user** listando exatamente o que observou.
2. **Pedir snapshot do estado** (`Read` não disponível; user roda no F12): switches 100/101, vars 102/108, qual cena (Sinal/Curva).
3. **Confirmar o que o código diz** (paralelo):
   - `Read` do plugin responsável (aqui `ButtonPicture.js`).
   - `Read` do `Sprite_Clickable` prototype (`rmmz_sprites.js:1-95`).
   - `Read` da função que gerencia o objeto-alvo (aqui `Game_Screen.showPicture`).
4. **Gerar 3 hipóteses máximas** ordenadas por probabilidade.
5. **Pedir ao user 3 testes diagnósticos específicos** (não 6).
6. **Critério de saída**: ou isolar a causa raiz com evidência (comando executado + valor retornado), ou identificar que é problema de teste (user em cena errada).
7. **Não propor fix até ter evidência** — esperar retorno do teste.

## 7. Conhecimento reutilizável

### Fatos confirmados
- `Game_Switches.value/setValue` e `Game_Variables.value/setValue` acessam `_data[id]` diretamente (`rmmz_objects.js:691, 723`). Array index em `System.json` = Editor ID.
- `$dataCommonEvents[id]` acesso direto (`rmmz_objects.js:6888`). Index 0 reservado para null.
- `Game_Screen.showPicture` (`rmmz_objects.js:1065`) **cria nova instância** de `Game_Picture` a cada chamada — propriedades custom (`mzkp_commonEventId`) são perdidas quando Show Picture é chamado novamente sobre o mesmo ID.
- `ButtonPicture.js` só sobrescreve `isClickEnabled` (line 84) e `onClick` (line 88). Não há hover visual nativo; `onMouseEnter`/`onMouseExit`/`onPress` (`rmmz_sprites.js:80-90`) são vazios.
- `command111` params para Variable: `[1, varId, srcType, value, op]` onde op 0=eq, 1=ge, 2=le, 3=gt, 4=lt, 5=neq (`rmmz_objects.js:9927`).
- `command122` (Control Variables) params: `[startId, endId, opType, operandType, operand]` onde opType 0=Set, 1=Add, 2=Sub, 3=Mul, 4=Div, 5=Mod (`rmmz_objects.js:10316`).
- `command121` (Control Switches) params: `[startId, endId, value]` onde value 0=ON, 1=OFF, 2=Toggle.
- `Input.isTriggered` captura borda de subida (não contínuo). Para anti-spam, preferir sobre `Input.isPressed`.
- `$gameTemp.reserveCommonEvent(id)` é assíncrono — adiciona à fila; não bloqueia.

### Preferências do usuário
- Documentos de "completa" devem ter checklist com `[x]`/`[ ]`/`[~]` refletindo status real (PASS/FAIL/PARCIAL).
- Debug deve ter comandos prontos para colar no console F12, com comentários explicando cada valor esperado.
- Preservar info de debug ao compactar (lista de bugs conhecidos + scripts canônicos).
- Idioma dos documentos: pt_BR.
- Commits sem Co-authored-by; autor `Edney <edney_reis999@hotmail.com>`.

### Restrições técnicas
- Não modificar `rmmz_*.js` diretamente (usar plugins).
- Editar `data/*.json` via parser/writer (Edit tool falha em JSON single-line).
- Para gerar CEs idempotentemente: padrão `ces = ces[:KEEP]` + append, validando slots preservados com asserts.
- Skill `rpg-maker-mz-data-json` deve ser carregada antes de editar `data/*.json`.
- `.agents/` é deny-by-default — nunca commitar artefatos de sessão.

### Armadilhas conhecidas
- Afirmar comportamento "nativo" sem ler o fonte → documentação errada (hover ButtonPicture).
- Propriedade custom em `Game_Picture` (`mzkp_commonEventId`) é perdida se `Show Picture` for chamado novamente sobre o mesmo ID.
- Documentação prévia pode conter off-by-one em IDs — sempre validar contra script idempotente.
- `Switch ON` em `command121` é value `0`, não `1` (inintuitivo).
- Em CEs Parallel, esquecer `Wait 1 frame` antes de `Jump to Label` trava a engine.
- Mapeamento de input por cena (Sinal=↓/↑, Curva=←/→) é fácil de confundir em testes.
- WASD depende de keyMapper estendido em plugin auxiliar (aqui `Jhonny_RaceHelper.js`) — se ausente, só setas funcionam.

### Heurísticas recomendadas
- Toda afirmação sobre comportamento "nativo" deve citar linha específica do fonte.
- Para toda propriedade custom em objeto RMMZ, identificar a função que (re)cria o objeto antes de setar a propriedade.
- Quando dois documentos conflitam (markdown vs script), o script idempotente vence.
- Ao debugar clique que não dispara: primeiro verifique `mzkp_commonEventId` está setado; depois `isClickEnabled()`; depois `$gameMessage.isBusy()`.
- Ao debugar input por teclado: primeiro verifique cena correta (VAR_SCENE_TYPE); depois tecla mapeada para aquela cena.
- Limite debug docs a 3 testes por iteração; espere retorno antes de expandir.

## 8. Informações que deveriam estar no prompt inicial

**Obrigatório:**
- Quais bugs específicos o user observou no playtest (com enumeração).
- Tipo de cena (Sinal/Curva) quando observou cada bug.
- Estado das switches/vars no F9 no momento do teste.
- Referência ao script idempotente (`build_phase4_ces.py`) como fonte de verdade para CE IDs.

**Útil:**
- Linha específica do fonte onde se esperava hover nativo.
- Confirmação prévia de que `Jhonny_RaceHelper.js` estende `Input.keyMapper` para WASD.

**Opcional:**
- Versão exata do RMMZ (1.10.0 confirmada em `rmmz_sprites.js:2`).

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

**Problema 1:** Implementação F4 assumiu que `mzkp_commonEventId` persistiria entre re-renderizações.

- **Informação ausente:** `Game_Screen.showPicture` cria nova instância de `Game_Picture` a cada chamada.
- **Por que pertence à análise técnica:** É fato estrutural sobre o contrato entre `Game_Screen` e plugins que extendem `Game_Picture`. Aplica-se a qualquer feature que sete propriedades custom em pictures.
- **Seção sugerida:** "Contratos do RMMZ — ciclo de vida de Game_Picture".
- **Texto sugerido:**
  > `Game_Screen.showPicture(pictureId, ...)` sempre instancia um novo `Game_Picture` e o atribui a `_pictures[realPictureId]`, substituindo qualquer instância anterior (`rmmz_objects.js:1065-1072`). Propriedades custom (ex.: `mzkp_commonEventId` do plugin ButtonPicture) **não persistem** entre chamadas de Show Picture sobre o mesmo ID. Features que dependem dessas propriedades devem (a) re-setá-las após cada Show Picture, ou (b) evitar re-chamar Show Picture.

**Problema 2:** Implementação documentou hover como "nativo".

- **Informação ausente:** `ButtonPicture.js` não sobrescreve `onMouseEnter`/`onPress`.
- **Por que pertence à análise técnica:** Fato sobre o plugin incluso no projeto.
- **Seção sugerida:** "Plugins inclusos — ButtonPicture".
- **Texto sugerido:**
  > `ButtonPicture.js` estende `Sprite_Picture` apenas sobrescrevendo `isClickEnabled` (line 84) e `onClick` (line 88). Não fornece feedback visual de hover; `onMouseEnter`/`onMouseExit`/`onPress` (`rmmz_sprites.js:80-90`) permanecem vazios. Para hover visual, é necessário patch de `Sprite_Picture.prototype.onMouseEnter` em plugin auxiliar.

### 9.2 Melhorias no plano de implementação

**Problema:** Task 4.2 foi marcada como "criar botões com ButtonPicture" sem validar pré-condição de persistência da propriedade.

- **Deficiência:** Plano não exigia leitura de `Game_Screen.showPicture` antes da implementação.
- **Etapa afetada:** Task 4.2 (ButtonPicture).
- **Alteração recomendada:** Adicionar passo pré-implementação "verificar ciclo de vida do objeto-alvo".
- **Texto sugerido:** Antes de task-4.2:
  > **Pré-validação obrigatória:** Antes de implementar features que setam propriedades custom em `Game_Picture`, ler `Game_Screen.showPicture` (`rmmz_objects.js:1065`) e confirmar que a propriedade persiste entre chamadas. Se não persistir, documentar workaround na task (re-setar após cada Show Picture ou evitar re-renderização).

**Problema:** Documento de "fase completa" foi gerado com checklist marcado antes do playtest.

- **Alteração recomendada:** Documento `fase-N-completa.md` deve ter todos os itens do checklist como `[ ]` (pendente) até user confirmar no playtest; o `status` no frontmatter deve ser "aguardando-playtest".
- **Texto sugerido:** Template do `fase-N-completa.md` deve conter regra explícita: "Itens do checklist ficam `[ ]` até validação MZ do usuário. Atualizar para `[x]`/`[~]`/`[ ]` (PASS/PARCIAL/FAIL) apenas após feedback."

### 9.3 Melhorias nas tasks da fase executada

**Task 4.2 (ButtonPicture):**

- **Informação ausente:** Hover não existe; `mzkp_commonEventId` é perdido em re-renderização.
- **Consequência:** Implementação presumiu persistência; playtest revelou bug.
- **Alteração recomendada:** Adicionar seção "Riscos conhecidos desta task".
- **Texto sugerido:**
  > ### Riscos conhecidos
  > - **Hover visual:** `ButtonPicture.js` não fornece feedback visual de hover nativo. Se hover for requisito, requer patch de `Sprite_Picture.prototype.onMouseEnter` em plugin auxiliar.
  > - **Persistência de `mzkp_commonEventId`:** Setar via Script só persiste até o próximo `Show Picture` sobre o mesmo ID. O `EV_RaceRenderer` deve chamar `EV_RenderSinal`/`EV_RenderCurva` (que setam `mzkp_commonEventId`) **apenas** em troca de cena, nunca no loop paralelo. Validar que `VAR_LAST_RENDERED_INDEX` está sendo atualizado corretamente.

**Task 4.4 (KeyInput):**

- **Informação ausente:** Mapeamento de teclas difere por tipo de cena.
- **Consequência:** User testou `direita` (possivelmente em cena Sinal) e reportou falha.
- **Alteração recomendada:** Adicionar matriz explícita no topo da task.
- **Texto sugerido:**
  > ### Matriz de input por cena
  > | Cena | VAR_SCENE_TYPE | Parar/Direita (CE 11) | Furar/Esquerda (CE 12) |
  > |------|----------------|------------------------|--------------------------|
  > | Sinal | 0 | ↓ / S | ↑ / W |
  > | Curva | 1 ou 2 | → / D | ← / A |
  > WASD requer `Jhonny_RaceHelper.js` com keyMapper estendido.

**Task 4.1 (RaceTimer):**

- **Informação ausente:** Nenhuma identificada — task funcionou conforme especificado.

### 9.4 Problemas fora do escopo dos artefatos

- **User pode ter testado em cena errada** (Sinal vs Curva): comportamento esperado, não defeito de especificação. Tratado em `debug-pos-playtest.md` sem exigir alteração de artefato.
- **Verbosidade da LLM em `debug-pos-playtest.md` (6 passos vs 3 essenciais):** ineficiência operacional da LLM. Não contamina análise/plano/tasks.
- **Plugin Command code 357 com schema opaco:** limitação do RMMZ; não há como prever sem inspeção. Decisão de bypass via Script foi correta.

### 9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|---|---|---|---|---|
| Hover documentado como nativo | Presunção sem ler fonte | Análise técnica | Documentar que ButtonPicture só sobrescreve `isClickEnabled`/`onClick` | Alta |
| `mzkp_commonEventId` perdido | `showPicture` cria nova instância | Análise técnica | Documentar ciclo de vida do `Game_Picture` | Alta |
| Clique não dispara handler | Provavelmente H1 (propriedade não setada) | Task 4.2 | Adicionar "Riscos conhecidos" sobre persistência | Alta |
| User testou tecla em cena errada | Falta de matriz input×cena | Task 4.4 | Adicionar matriz Sinal/Curva | Média |
| Checklist `fase-4-completa.md` marcado antes do playtest | Falta de regra no template | Plano de implementação | Adicionar regra "checklist fica `[ ]` até playtest" | Média |
| Documento de debug verboso (6 passos) | Verbosidade da LLM | Fora do escopo | Nenhuma | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

```markdown
## Contratos do RMMZ

### Ciclo de vida de Game_Picture

`Game_Screen.showPicture(pictureId, ...)` sempre instancia um novo `Game_Picture`
e o atribui a `_pictures[realPictureId]`, substituindo qualquer instância anterior
(`rmmz_objects.js:1065-1072`). Propriedades custom (ex.: `mzkp_commonEventId` do
plugin ButtonPicture) **não persistem** entre chamadas de Show Picture sobre o
mesmo ID. Features que dependem dessas propriedades devem (a) re-setá-las após
cada Show Picture, ou (b) evitar re-chamar Show Picture.

## Plugins inclusos

### ButtonPicture.js

Estende `Sprite_Picture` apenas sobrescrevendo `isClickEnabled` (line 84) e
`onClick` (line 88). Não fornece feedback visual de hover nativo;
`onMouseEnter`/`onMouseExit`/`onPress` (`rmmz_sprites.js:80-90`) permanecem
vazios. Para hover visual, é necessário patch de
`Sprite_Picture.prototype.onMouseEnter` em plugin auxiliar.
```

#### Patch sugerido para o plano de implementação

```markdown
### Template fase-N-completa.md — Regra de checklist

Itens do checklist ficam `[ ]` (pendente) até validação MZ do usuário.
Após playtest, atualizar cada item para:
- `[x]` — PASS (comportamento observado conforme esperado)
- `[~]` — PARCIAL (funcionou com ressalvas)
- `[ ]` — FAIL (não funcionou, ver documento de debug)

O campo `status` no frontmatter fica "aguardando-playtest" até todos os itens
críticos serem `[x]` ou `[~]`.

### Pré-validação obrigatória para tasks que usam propriedades custom

Antes de implementar features que setam propriedades custom em objetos
gerenciados pelo RMMZ (Game_Picture, Game_Actor, Game_Map, etc.), ler a função
que (re)cria o objeto e confirmar que a propriedade persiste entre chamadas.
Se não persistir, documentar workaround na task.
```

#### Patch sugerido para as tasks da fase executada

**Task 4.2 — Adicionar seção "Riscos conhecidos":**

```markdown
### Riscos conhecidos desta task

- **Hover visual:** `ButtonPicture.js` não fornece feedback visual de hover
  nativo. Se hover for requisito, requer patch de
  `Sprite_Picture.prototype.onMouseEnter` em plugin auxiliar.
- **Persistência de `mzkp_commonEventId`:** Setar via Script só persiste até
  o próximo `Show Picture` sobre o mesmo ID (`rmmz_objects.js:1065`). O
  `EV_RaceRenderer` deve chamar `EV_RenderSinal`/`EV_RenderCurva` (que setam
  `mzkp_commonEventId`) **apenas** em troca de cena, nunca no loop paralelo.
  Validar que `VAR_LAST_RENDERED_INDEX` (113) está sendo atualizado
  corretamente após cada render.
- **Pré-condição para cliques:** `$gameMessage.isBusy()` deve ser false
  (`ButtonPicture.js:85`). Em corrida normal não há mensagem ativa, mas
  validar com teste.
```

**Task 4.4 — Adicionar matriz de input por cena no topo:**

```markdown
### Matriz de input por cena

| Cena | VAR_SCENE_TYPE | Parar/Direita (CE 11) | Furar/Esquerda (CE 12) |
|------|----------------|------------------------|--------------------------|
| Sinal | 0 | ↓ / S | ↑ / W |
| Curva | 1 ou 2 | → / D | ← / A |

WASD requer `Jhonny_RaceHelper.js` com keyMapper estendido.
Testar sempre ambas as cenas com as teclas corretas.
```

#### Ações fora do fluxo de especificação

- Reduzir verbosidade operacional da LLM: máximo 3 testes diagnósticos por iteração de debug. Esta é melhoria de comportamento da LLM, não de artefato.

## 10. Checklist operacional

Antes e durante a próxima execução de tarefa similar (implementar fase de CEs RMMZ + diagnosticar bugs de playtest):

1. **Pré-condição:** Skill `rpg-maker-mz-data-json` carregada; `Jhonny/CLAUDE.md` lido.
2. **Fonte de verdade:** Script idempotente (`build_phaseN_ces.py`) vence sobre markdown humano quando IDs ou estruturas conflitam.
3. **Pré-validação de propriedades custom:** Ler a função RMMZ que (re)cria o objeto-alvo antes de setar propriedade custom.
4. **Documentar "nativo":** Só afirmar comportamento nativo com citação de linha do fonte.
5. **Checklist de fase:** Itens sempre `[ ]` até playtest do user confirmar.
6. **Auditoria de IDs:** Rodar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` após cada edição.
7. **Idempotência:** Reexecutar gerador JSON deve produzir diff vazio.
8. **Debug:** Máximo 3 testes diagnósticos por iteração; esperar retorno do user antes de expandir.
9. **Cena correta para input:** Em testes de teclado, confirmar `VAR_SCENE_TYPE` antes de testar tecla específica (Sinal=↓/↑, Curva=←/→).
10. **Critério de conclusão:** Playtest MZ do usuário com todos os itens críticos `[x]` ou `[~]` (com workaround documentado).

---

# Apêndice — Continuação de debug (R1 → R2)

Adicionado após o usuário retornar os outputs dos 6 testes diagnósticos do `debug-pos-playtest.md` (R1) e produzir `debug-r2.md` (R2). As seções acima continuam válidas para a fase de implementação; este apêndice cobre exclusivamente a sessão de debug.

## A.1 Resumo da sessão R1→R2

**Solicitado:** Diagnosticar por que clique no botão e teclado não disparam `EV_OnSafe`/`EV_OnRisk` (SW_INPUT_LOCKED permanecia OFF).

**Entregue:**
- Análise dos 6 outputs do R1 → descarte sistemático das 5 hipóteses H1–H5.
- Isolamento do bug: `$gameTemp.reserveCommonEvent(11)` é consumido mas o handler não executa.
- Identificação do mecanismo no código RMMZ (`Game_Map.updateInterpreter:6799` e `setupReservedCommonEvent:9548`).
- `debug-r2.md` com teste único que isola as 2 hipóteses finais (CE undefined vs interpreter sempre running).

**Critérios aplicados:**
- Cada hipótese descartada ou confirmada por output específico do user.
- Não propor fix até ter evidência direta da causa raiz.

## A.2 Decisões técnicas (R1→R2)

### A.2.1 Hipótese "user testou em cena errada" — confirmada

- **Decisão:** Tratar o `direita` em Sinal como erro de teste.
- **Motivo:** User não especificou qual cena testou; CE 13 ramifica por `VAR_SCENE_TYPE`.
- **Evidência:** Passo 1 do R1: `VAR_SCENE_TYPE (102): 0 (Sinal)`.
- **Resultado:** Confirmado. User estava em Sinal, `direita` é ignorado por design.
- **Avaliação:** Inferência útil, gerou matriz Sinal/Curva na task 4.4.

### A.2.2 Hipótese H1 (mzkp_commonEventId não setado) — descartada

- **Decisão:** Não investir nesta hipótese sem primeiro ver Passo 2 do R1.
- **Motivo:** Output direto do user eliminava especulação.
- **Evidência:** Passo 2 mostrou `picture(41).mzkp_commonEventId: 11` e `picture(42).mzkp_commonEventId: 12`.
- **Avaliação:** Sequência correta de diagnóstico — deixar o teste refutar a hipótese antes de propor fix.

### A.2.3 Bug real: reserveCommonEvent consumido sem execução

- **Decisão:** Após R1 descartar H1/H3/H4, focar em `Game_Map.updateInterpreter` e `setupReservedCommonEvent`.
- **Motivo:** Passo 4 mostrou que mesmo chamando `$gameTemp.reserveCommonEvent(11)` manualmente, o lock não ligava — só pode ser problema no processamento da fila.
- **Evidência:** Passo 4 + Passo 6 (fila sempre 0 nos snapshots de 500ms).
- **Resultado:** Identifiquei duas hipóteses finais (A e B) sem precisar de mais leitura especulativa.
- **Avaliação:** Decisão correta. Leitura cirúrgica de 3 funções RMMZ foi suficiente.

## A.3 Uso de ferramentas (R1→R2)

| Ferramenta/comando | Objetivo | Necessário? | Contribuiu? | Como evitar redundância |
|---|---|---|---|---|
| `Read rmmz_sprites.js:1-180` | Confirmar Sprite_Clickable vazio em hover | Sim | Sim | Já lido na sessão anterior — verificar contexto antes de reler |
| `Read rmmz_sprites.js:2880-2980` | Sprite_Picture herda de Sprite_Clickable | Sim | Sim | Idem |
| `Read rmmz_objects.js:1060-1109` | `Game_Screen.showPicture` cria nova instância | Sim | Sim | — |
| `Read rmmz_objects.js:9927-10027` | `command111` (If) | Útil | **Redundante** — já confirmado em sessão pré-compact | Manter "fatos confirmados" no summary da compactação |
| `Grep reserveCommonEvent` em rmmz_objects.js/managers.js | Localizar chamadas e processadores | Sim | Sim, decisivo | — |
| `Read rmmz_objects.js:6000-6030` | `Game_Troop.setupBattleEvent` chama setupReservedCommonEvent | Parcial | Não (não é relevante para mapa) | — |
| `Read rmmz_objects.js:6799-6840` | `Game_Map.updateInterpreter` + `setupStartingEvent` | **Crítico** | Sim, decidiu o diagnóstico | — |
| `Read rmmz_objects.js:9545-9570` | `setupReservedCommonEvent` consome fila antes de validar | **Crítico** | Sim, decidiu o diagnóstico | — |

**Verdades operacionais novas** (para incluir no summary de próxima compactação):
- `Game_Map.updateInterpreter` (`rmmz_objects.js:6799`) é o ponto único de consumo de reserved CEs do mapa.
- `setupReservedCommonEvent` (`rmmz_objects.js:9548`) faz `_commonEventQueue.shift()` antes de validar o CE — silenciosamente perde reservas se `$dataCommonEvents[id]` é undefined.
- `Game_Temp._commonEventQueue` guarda IDs (números), não objetos CE.

## A.4 Intervenções do user (R1→R2)

### A.4.1 Feedback completo dos 6 testes R1

- **Instrução:** User colou outputs completos do Passo 1 ao Passo 6, sem resumir.
- **Antes:** Havia 5 hipóteses em aberto sem priorização clara.
- **Causa:** Outputs diretos eliminaram ambiguidade.
- **Mudança:** Cada hipótese H1–H5 foi marcada CONFIRMADA/DESCARTADA com evidência explícita.
- **Regra reutilizável:** Pedir ao user outputs **completos** (não resumidos) dos testes diagnósticos — resumo perde sinais.

### A.4.2 Nenhuma outra intervenção nesta sessão

O diagnóstico fluiu sem correção adicional.

## A.5 Análise de desperdício (R1→R2)

| Desperdício | Impacto | Causa | Como evitar |
|---|---|---|---|
| Re-leitura de `command111` (9927-10027) | Baixo | Esqueci que já havia confirmado formato em sessão anterior | Manter "fatos confirmados" no summary da compactação |
| `debug-pos-playtest.md` com 6 passos quando 3 (Passo 2, 3, 4) eram decisivos | Médio | Verbosidade; queria cobrir todas as hipóteses | Para próxima iteração: 3 testes máximos |
| 4 dos 6 passos do R1 não avançaram o diagnóstico diretamente (Passo 1, 5, 6) | Baixo-médio | Passo 1 confirmou pré-condições (necessário mas barato); Passo 5 confirmou input chega ao RMMZ; Passo 6 só descartou overflow de fila | Em primeira iteração de debug, pedir só: (i) snapshot estado, (ii) verificar objeto-alvo, (iii) bypass input testando handler direto |
| Documento `debug-r2.md` reproduz quase todo o `debug-pos-playtest.md` em compressão | Baixo | Mantenho contexto histórico | Para próxima vez: escrever só o teste único novo, referenciar o documento anterior para contexto |

## A.6 Caminho mínimo para repetir o diagnóstico R1→R2

1. **Receber feedback do user** com outputs completos de 3 testes mínimos:
   - Snapshot estado (switches/vars/scene type).
   - Verificar `mzkp_commonEventId` setado.
   - Bypass input: chamar `reserveCommonEvent(N)` diretamente e observar se o efeito colateral acontece (no caso, SW_INPUT_LOCKED ON).
2. **Se bypass falhar** (e efeito colateral esperado não aparece): o problema é no processamento da fila, não no input.
3. **Localizar processador da fila** via `Grep "setupReservedCommonEvent"` em `rmmz_objects.js` e `rmmz_managers.js`. Ler `Game_Map.updateInterpreter:6799` e `setupReservedCommonEvent:9548`.
4. **Gerar 2 hipóteses finais** baseadas no mecanismo:
   - A: CE undefined em runtime (Database não recarregou).
   - B: Interpreter sempre running (evento em loop no mapa).
5. **Teste único** que imprime `$dataCommonEvents[id]` + `$gameMap._interpreter.isRunning()` + monitora fila em loop curto.
6. **Critério de saída**: output identifica A ou B com evidência direta (undefined vs running=true).

## A.7 Conhecimento reutilizável adicional

### Fatos confirmados (R1→R2)
- **Cena Sinal:** `VAR_SCENE_TYPE = 0`; teclas válidas são `down/up` (setas) e `s/w` (se keyMapper estendido).
- **Cena Curva:** `VAR_SCENE_TYPE = 1` ou `2`; teclas válidas são `right/left` e `d/a`.
- `Input.isTriggered` retorna true só na borda de subida; prender a tecla dispara 1x (anti-spam nativo).
- `Sprite_Picture` visível tem `width=160, height=80` para os botões `race/btn_parar` etc.
- `Game_Screen.showPicture` sempre cria nova instância (`rmmz_objects.js:1065`); propriedades custom não persistem entre chamadas sobre o mesmo ID.
- **Mecanismo de reserved CEs no mapa:**
  - `Game_Map.updateInterpreter` (`rmmz_objects.js:6799`) é o loop de processamento.
  - Só chama `setupStartingEvent` (que chama `setupReservedCommonEvent`) quando `_interpreter.isRunning()` é false.
  - `setupReservedCommonEvent` (`rmmz_objects.js:9548`) faz `shift()` antes de validar — reservas são silenciosamente descartadas se `$dataCommonEvents[id]` é undefined.
- `Game_Temp._commonEventQueue` guarda números (IDs), não objetos CE.
- `Game_Troop.setupBattleEvent` (`rmmz_objects.js:6013`) também chama `setupReservedCommonEvent` — em batalha, o processador é a troop, não o mapa.

### Heurísticas recomendadas (R1→R2)
- **Debug de clique/tecla que não dispara handler:** sempre testar o handler isoladamente (chamar `reserveCommonEvent(N)` manualmente) antes de suspeitar do input.
- **Debug de CE reservado:** primeira verificação é `$dataCommonEvents[N]` em runtime; segunda é `$gameMap._interpreter.isRunning()` em loop.
- **Outputs de debug:** pedir **completos**, não resumidos. Resumo elimina sinais importantes.
- **Após 5 hipóteses refutadas:** pare de especular; leia o código-fonte do mecanismo de fila em vez de propor mais testes especulativos.
- **Context próximo do limite (70%+):** não iniciar novo documento de debug extenso; concentre diagnóstico em teste único de baixo overhead.

## A.8 Informações que deveriam estar no prompt inicial (R1→R2)

**Obrigatório:**
- Outputs completos dos testes do R1 (não resumidos) — era a única fonte de verdade.

**Útil:**
- Snapshot do estado do `_interpreter` do mapa junto com o snapshot das switches/vars (teria poupado um teste).
- Estado da fila `$gameTemp._commonEventQueue` no momento do teste manual de `reserveCommonEvent`.

**Opcional:**
- Versão exata do RMMZ 1.10.0 (já confirmada).

## A.9 Melhorias nos artefatos (incremental à seção 9)

### A.9.1 Análise técnica — adicionar

```markdown
### Mecanismo de reserved Common Events no mapa

`Game_Map.updateInterpreter` (`rmmz_objects.js:6799`) é o loop único de
processamento de eventos do mapa. Ele só chama `setupStartingEvent` (que chama
`setupReservedCommonEvent`) quando `$gameMap._interpreter.isRunning()` é false.
Se um evento do mapa estiver em loop infinito (Parallel ou autorun sem `Wait`),
reserved CEs nunca são processados.

`setupReservedCommonEvent` (`rmmz_objects.js:9548`) faz `_commonEventQueue.shift()`
**antes** de validar se `$dataCommonEvents[id]` existe. Reservas são consumidas
silenciosamente se o CE é undefined em runtime — comum quando o Database MZ não
foi reaberto após edição Python+json de `CommonEvents.json`.

Após editar `CommonEvents.json` via script Python, **obrigatório** reabrir o MZ
Editor → Database → Ctrl+S para que o MZ recarregue e normalize o JSON no seu
formato. Sem isso, `$dataCommonEvents` em runtime pode não refletir o JSON em disco.
```

### A.9.2 Plano de implementação — adicionar regra de validação pós-edição

```markdown
### Pós-edição de data/*.json via script Python — passo obrigatório

Após executar qualquer script Python que modifique `Jhonny/data/*.json`:

1. `python3 -m json.tool Jhonny/data/<arquivo>.json > /dev/null` — valida sintaxe.
2. Reabrir projeto no RPG Maker MZ.
3. Abrir Database (F10) → aba correspondente → confirmar entradas novas visíveis.
4. Ctrl+S no Database para o MZ normalizar.
5. Fechar e reabrir Playtest.

Sem este passo, dados em runtime (`$dataCommonEvents`, `$dataItems`, etc.) podem
não refletir o JSON em disco, causando bugs como reservas de CE ignoradas.
```

### A.9.3 Tasks da fase executada — task-4.2 adicionar

```markdown
### Pós-implementação obrigatória (task-4.2)

Após rodar `build_phase4_ces.py`:
1. Fechar MZ Editor completamente.
2. Reabrir o projeto.
3. Abrir Database (F10) → Common Events → confirmar CE 10-13 visíveis com triggers.
4. Ctrl+S para MZ normalizar.
5. Playtest (F5) e validar via console:
   ```javascript
   $dataCommonEvents[11].name  // deve retornar 'EV_OnSafe'
   ```
```

### A.9.4 Problemas fora do escopo dos artefatos

- **User precisa reabrir MZ após editar JSON:** procedimento operacional, não defeito de especificação.
- **Re-leitura de `command111`:** ineficiência da LLM; manter fatos confirmados no summary da compactação.

### A.9.5 Matriz de rastreabilidade (incremental)

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|---|---|---|---|---|
| reserveCommonEvent consumido sem execução | Database MZ não recarregou após edição Python | Análise técnica + Plano | Documentar mecanismo de fila + passo obrigatório pós-edição | Alta |
| 5 hipóteses especulativas antes de ler o mecanismo de fila | Verbosidade operacional | Fora do escopo | Heurística: parar após 5 hipóteses refutadas | Baixa |

### A.9.6 Patches sugeridos (incremental)

#### Patch para análise técnica
Conforme A.9.1 acima.

#### Patch para plano de implementação
Conforme A.9.2 acima.

#### Patch para tasks (task-4.2)
Conforme A.9.3 acima.

#### Ações fora do fluxo
- Manter "fatos confirmados" no summary de compactação para evitar releituras.

## A.10 Checklist operacional (incremental)

Itens adicionais aplicáveis à próxima iteração de debug:

11. **Após editar `data/*.json` via Python:** abrir MZ Editor, abrir Database, Ctrl+S antes de playtest.
12. **Debug de handler não dispara:** testar handler isoladamente (`reserveCommonEvent(N)` manual) antes de investigar input.
13. **5 hipóteses refutadas:** parar de especular; ler o código do mecanismo.
14. **Outputs de teste do user:** exigir completos (não resumidos).
15. **Context > 70%:** não iniciar documento novo; concentrar diagnóstico em teste único.

---

# Apêndice B — Continuação R2 → R3 (rastreamento via monkey-patch)

## B.1 Resumo da iteração

**Solicitado:** Continuar debug após user reportar outputs do teste R2.

**Entregue:**
- Análise dos outputs R2 (3 cenários idênticos: antes do jogo, após iniciar, após 10s)
- Descarte de Hipóteses A (CE 11 undefined), B (interpreter sempre running), C (list vazio) com evidência direta
- Identificação do bug real: `setupReservedCommonEvent` não é chamado apesar de interpreter livre
- `Jhonny/planos/001-prototipo-core-loop/fase4/debug-r3.md` com teste único via monkey-patches
- Mapeamento de 5 cenários diagnósticos (D1-D5) com fix específico para cada

**Critério de sucesso:** teste R3 capaz de identificar, em uma execução, qual das 4 funções da cadeia (`Game_Map.update` → `updateInterpreter` → `setupStartingEvent` → `setupReservedCommonEvent`) está quebrando.

## B.2 Decisões técnicas e inferências

| Decisão | Motivo | Evidência | Resultado | Avaliação | Melhoria |
|---------|--------|-----------|-----------|-----------|----------|
| Hipótese `setupReservedCommonEvent` não chamado | queue persistiu em 1 por 1.5s; se a função fosse chamada, `shift()` teria consumido | Output R2 idêntico nos 3 cenários: `queue=1` após 6 amostras | Correta — levou ao mecanismo do gate | Necessária | Quando fila persiste não consumuída, inferir problema no gate/consumidor antes de especular sobre conteúdo |
| Inicialmente afirmei gate = `isSceneActive` | Nome similar a padrões RMMZ; confundi com `Scene_Map.isSceneActive` | Nenhum — assumi pela memória | Incorreta: Scene_Map não tem `isSceneActive`; gate é só `isActive()` | Desnecessária; correção exigiu leitura adicional | Quando duas funções têm nomes similares (`isActive` vs `isSceneActive`), ler o código-fonte antes de afirmar qual é o gate |
| Ler código RMMZ antes de propor teste R3 | Hipóteses A/B/C descartadas; precisava confirmar mecanismo do bug real | Output R2 excluía causas dentro do handler | Acertada: identificou `Game_Map.update(sceneActive)` como gate | Necessária | Sempre ler o código do mecanismo quando hipóteses estruturais são descartadas |
| Teste R3 com monkey-patches em 4 funções | Cada função da cadeia pode estar sendo sobrescrita por plugin; patches isolam cada uma | Padrão de debugging em runtime JS | Eficiente — 5 cenários D1-D5 cobrem todos os pontos de falha | Necessária | Para rastrear call chains em runtime, monkey-patch > logs esparsos |

## B.3 Uso de ferramentas

- **Read `rmmz_objects.js:6790-6849`** — confirmar `Game_Map.updateInterpreter` e `setupStartingEvent`. **Contribuiu diretamente.** Substituível por `grep -n` seletivo.
- **Bash `grep -n "Game_Map.prototype.update\|Scene_Map.prototype.update\|Scene_Map.prototype.isSceneActive\|Scene_Map.prototype.updateMain"`** — localizar assinaturas das funções no arquivo correto. **Contribuiu.** Evitou releitura integral.
- **Read `rmmz_scenes.js:819-868`** — confirmar `Scene_Map.updateMain` passa `this.isActive()`. **Crítico.** Necessário.
- **Read `rmmz_scenes.js:30-50`** — confirmar `Scene_Base.isActive()` retorna `_active`. **Crítico.** Necessário.
- **Write `debug-r3.md`** — criar teste único com 4 monkey-patches e 5 cenários. **Contribuiu diretamente.**

**Evitado nesta iteração:** leituras integrais de arquivos, buscas amplas, múltiplos arquivos intermediários. Concentração em teste único bem desenhado.

## B.4 Intervenções do usuário

Nenhuma intervenção corretiva nesta iteração. User apenas forneceu outputs completos do R2 (3 cenários), que foram solicitados explicitamente no documento anterior. Resposta ao pedido de retrospective: mesma convenção de destino já estabelecida (apêndice em `retrospectiva.md`).

## B.5 Análise de desperdício

| Item | Impacto | Causa | Como evitar |
|------|---------|-------|-------------|
| Resposta ao user reexplicou mecanismo já documentado em `debug-r2.md` | Baixo | Redundância com seção "Mecanismo do bug" do R2 | Quando o mecanismo já está em doc anterior, referenciar em vez de reescrever |
| Afirmação inicial incorreta sobre `isSceneActive` | Médio | Inferência baseada em nome similar | Ler código antes de citar nomes de funções como gate |
| Mensagem final ao user mais longa que o necessário (tabela com 5 cenários) | Baixo | Excesso de detalhe preventivo | Resumo curto + referência ao doc |

## B.6 Caminho mínimo recomendado (para continuação de debug de fila não consumuída)

1. **Receber output de teste mostrando queue=N persistente** → ler `Game_Map.prototype.update` (`rmmz_objects.js:6702`) imediatamente.
2. **Confirmar gate**: qual parâmetro `sceneActive` é passado pelo caller? Em `Scene_Map.updateMain`: `$gameMap.update(this.isActive())`.
3. **Confirmar definição de `isActive`**: `Scene_Base.isActive` retorna `_active`. Não confundir com `isSceneActive` (que não existe em Scene_Map).
4. **Identificar a invariante chave**: `updateEvents` (parallel CEs) roda sempre; `updateInterpreter` (reserved CEs) requer `sceneActive=true`.
5. **Projetar monkey-patches** nas 4 funções da cadeia com contadores: `update`, `updateInterpreter`, `setupStartingEvent`, `setupReservedCommonEvent`.
6. **Mapear cada combinação de contadores a um cenário diagnóstico** (D1-D5) com fix específico.
7. **Critério de parada**: após output do monkey-patch, fix é direcionado sem especulação adicional.

## B.7 Conhecimento reutilizável

### Fatos confirmados

- **`Game_Map.prototype.update(sceneActive)`** (`rmmz_objects.js:6702`) é o gate para reserved CEs: `if (sceneActive) { this.updateInterpreter(); }`.
- **`Game_Map.prototype.updateEvents()`** roda sempre (não tem gate) — é o porquê de parallel CEs funcionarem mesmo quando reserved CEs falham.
- **`Scene_Map.prototype.updateMain`** (`rmmz_scenes.js:841`) chama `$gameMap.update(this.isActive())` — gate é `isActive()`.
- **`Scene_Base.prototype.isActive`** (`rmmz_scenes.js:32`) retorna `this._active`; setado por `start()`.
- **`Scene_Map` não tem `isSceneActive`** — confundir com `isActive` leva a bugs de diagnóstico.
- **`Game_Map.updateInterpreter`** (`rmmz_objects.js:6799`) chama `setupStartingEvent` em loop só quando `_interpreter.isRunning()` é false.
- **`Game_Map.setupStartingEvent`** (`rmmz_objects.js:6821`) chama `setupReservedCommonEvent` como primeira tentativa.

### Restrições técnicas

- Monkey-patches em prototypes RMMZ devem restaurar originais ao final (memory leak se esquecido).
- `setInterval` com 250ms captura apenas snapshots — gaps de execução entre amostras podem mascarar bugs intermitentes. Para rastreamento definitivo, usar patches com contadores cumulativos + `setTimeout` final.
- `_active` pode ser false durante fade/transition mesmo em Scene_Map válida.

### Armadilhas conhecidas

- Afirmar gate sem ler o código → direção errada de diagnóstico.
- Tratar `isActive` e `isSceneActive` como sinônimos → ambos existem em RMMZ mas com semântica diferente.
- Concluir "interpreter não atualiza" sem verificar se `updateInterpreter` está sendo chamado → pode mascarar bug em `setupStartingEvent`.

### Heurísticas recomendadas

- **Quando fila/queue persiste não consumuída**, investigar o gate da função consumidora antes do consumidor em si.
- **Para rastrear call chains em runtime**, monkey-patches com contadores > snapshots periódicos.
- **Antes de propor teste diagnóstico**, ler o código do mecanismo suspeito. Hipóteses sem leitura de código tendem a errar o nome da função.
- **Teste único bem desenhado** cobrindo múltiplos cenários é mais eficiente que múltiplos testes isolados.

## B.8 Informações que deveriam estar no prompt inicial

- **Útil:** versão exata do RMMZ (1.10.0 assumida; assinaturas podem mudar entre versões).
- **Útil:** lista de plugins ativos do projeto (suspeitos de sobrescrever `Game_Map.update`).
- **Útil:** confirmação explícita de qual Scene está ativa quando o bug ocorre (user reportou em 3 cenários sem distinguir Scene_Map vs outras).

## B.9 Melhorias nos artefatos

### B.9.1 Análise técnica

**Problema:** Hipótese B do R2 (`$gameMap._interpreter.isRunning() sempre true`) estava correta na forma (interpreter livre) mas não isolava o gate correto.

**Informação ausente:** A análise técnica não documentou a invariante `updateInterpreter` (gated por `sceneActive`) vs `updateEvents` (unconditional).

**Alteração sugerida (Acrescentar em `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/` — análise técnica do core loop):**

```markdown
## Invariante: gate de reserved CEs

Reserved Common Events (via `$gameTemp.reserveCommonEvent`) só são processados
quando `Game_Map.update` recebe `sceneActive=true`. Esta é a cadeia:

Scene_Map.updateMain → $gameMap.update(this.isActive()) →
  if (sceneActive) Game_Map.updateInterpreter() →
    Game_Map.setupStartingEvent() →
      Game_Interpreter.setupReservedCommonEvent()

Paralelamente, `updateEvents()` (parallel CEs como `EV_RaceTimer`) roda sempre,
independente de sceneActive. Isto significa:

- Parallel CEs funcionam mesmo durante fade/transition/menu sobreposto.
- Reserved CEs (incluindo handlers chamados por input ou timeout) podem falhar
  silenciosamente se sceneActive=false.

Consequência operacional: qualquer teste de reserved CE deve confirmar
`SceneManager._scene.isActive()` antes de concluir que o handler está quebrado.
```

**Impacto:** Reduz iterações de debug futuras; próxima LLM partirá da invariante em vez de redescobri-la.

### B.9.2 Plano de implementação

Nenhuma alteração recomendada para o plano de implementação. O bug é operacional, não de planejamento.

### B.9.3 Tasks da fase executada

**Problema:** Task 4.4 (`EV_KeyInput`) não especifica a pré-condição de que reserved CEs só processam em Scene_Map ativa.

**Task afetada:** task-4.4 (`EV_KeyInput` captura input e reserva CE 11/12).

**Consequência observada:** durante playtest, se a Scene estiver em estado não ativo (fade/transition), inputs serão capturados mas os reserved CEs nunca executam — sintoma indistinguível de "handler quebrado".

**Alteração sugerida na task-4.4:**

```markdown
### Pré-condição para validação no Playtest

Antes de testar teclas/cliques, confirmar que a Scene está ativa:

```javascript
SceneManager._scene.isActive() === true
SceneManager._scene.constructor.name === 'Scene_Map'
```

Se isActive() retornar false, reserved CEs (`reserveCommonEvent`) não processam,
independente da correção do handler. Tratar fade/transition como causa provável.
```

**Como validar:** rodar teste no console antes de validar handler. Se `isActive()` retorna false, o teste de handler é inválido neste momento.

### B.9.4 Problemas fora do escopo

- **`isSceneActive` vs `isActive` confusão**: falha operacional de LLM, não de artefato. Tratada como aprendizado nesta retrospectiva, sem alteração de especificação.
- **Behavior específico do RMMZ 1.10.0**: documentado em B.9.1 acima; fora de escopo das tasks.

### B.9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|--------------------|-----------------|----------------------|----------------------|-----------|
| R2 falhou em isolar bug real | Análise técnica não documenta gate `sceneActive` | Análise técnica | Adicionar seção "Invariante: gate de reserved CEs" | Alta |
| Handler "silencioso" no playtest pode ser gate false | Task 4.4 não especifica verificação de `isActive()` | Task task-4.4 | Adicionar pré-condição de Playtest | Média |
| Confusão `isSceneActive` vs `isActive` | Falha operacional de LLM | Fora de escopo | Nenhuma alteração; aprendizado em retrospectiva | Baixa |

### B.9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Ver B.9.1 acima.

#### Patch sugerido para o plano de implementação

Nenhuma alteração recomendada para o plano de implementação.

#### Patch sugerido para as tasks desta fase

Ver B.9.3 acima (task-4.4).

#### Ações fora do fluxo de especificação

- Adicionar snippet de verificação de Scene ativa ao `Jhonny_RaceHelper.js` como utilitário de debug opcional (`JhonnyRace.debug.sceneState()`).

## B.10 Checklist operacional (incremental)

Itens adicionais aplicáveis à próxima iteração de debug:

16. **Fila/queue persiste não consumuída:** ler `Game_Map.update` e verificar `sceneActive` antes de especular sobre consumidor.
17. **Nomes de função similares (`isActive` vs `isSceneActive`):** ler código-fonte antes de citar como gate.
18. **Rastreamento de call chain:** monkey-patches com contadores > snapshots periódicos.
19. **Após patches em prototypes:** sempre restaurar originais (`clearInterval` + reatribuição) para evitar leak.
20. **Invariante documentada:** reserved CEs só processam em Scene ativa; parallel CEs sempre rodam.

---

# Apêndice C — R3-redo → R5 (isolamento do caminho do clique)

**Iteração coberta:** reexecução do R3 com jogo visível → isolamento do bug ao caminho do clique → criação do R5 → primeira utilização do sistema de memória do projeto.

**Duração:** 1 turno. **Output principal:** debug-r5.md + 2 arquivos de memória (`mz-playtest-pauses.md`, `fase4-debug-state.md`) + 4 tasks.

## C.1 Resumo da tarefa

**Pedido implícito:** continuar a iteração de debug do bug "clicar botão não liga `SW_INPUT_LOCKED`" na Fase 4.

**Resultado entregue:**
- Identificada a causa raiz dos resultados inconclusivos de R1/R2/R3 (jogo pausava durante `setTimeout` por perda de visibilidade da janela do Playtest)
- Confirmado via R3 reexecutado que **CE 11 funciona ponta-a-ponta** quando reservado manualmente
- Bug real isolado ao caminho `clique botão → reserveCommonEvent`
- Criado `debug-r5.md` (click trace focado) com 5 cenários de diagnóstico (F1-F5)
- Salvo aprendizado operacional + estado do debug em memória persistente (`mz-playtest-pauses.md`, `fase4-debug-state.md`)
- Criadas 4 tasks rastreando trabalho restante até F4 ser validada

**Critério de conclusão desta iteração:** user tem próxima ação clara (rodar R5) e contexto preservado em memória para conversas futuras.

## C.2 Decisões técnicas e inferências

### Inferência 1: "0 chamadas a Game_Map.update em 2s = jogo pausado"

- **Decisão:** Tratar o resultado anterior do R3 (`Game_Map.update calls: 0`) como artifact de teste, não como bug real.
- **Motivo:** Ausência absoluta de chamadas era incompatível com cena ativa reportada (`scene._active: true`, `scene.isActive(): true`).
- **Evidência disponível:** output do R3 mostrava Scene_Map ativa +SW_RACE_ACTIVE=true +queue=1 persistente — combinação impossível se o loop estivesse rodando.
- **Resultado:** Confirmado pelo user: "quando eu estou na tela do console, o jogo fica sim travado".
- **Avaliação:** Inferência necessária e correta.
- **Melhoria futura:** Toda análise de "0 chamadas em X segundos" deve ser precedida pela verificação de `document.hidden` e `Graphics.frameCount` delta.

### Inferência 2: Bug está no caminho clique → reserve (não em CE 11)

- **Decisão:** Redirecionar diagnóstico para `Sprite_Picture.onClick` e bind `mzkp_commonEventId`, abandonando hipóteses sobre CE 11 internals.
- **Motivo:** R3-redo mostrou cadeia completa funcionando para reserve manual.
- **Evidência disponível:** `[t=437] setupReservedCommonEvent retornou: true`, `SW_INPUT_LOCKED: true`, `queue final: 0`.
- **Resultado:** Hipótese confirmada; R5 desenha 5 cenários cobrindo todo o caminho do clique.
- **Avaliação:** Inferência necessária e correta.
- **Melhoria futura:** Antes de investigar internals de um componente, validar se ele funciona quando invocado diretamente — exclui metade do espaço de hipóteses.

### Inferência 3: Salvar aprendizado em memória persistente

- **Decisão:** Criar `MEMORY.md` + 2 arquivos de memória no diretório do projeto (`/Users/edney/.claude/projects/-Users-edney-projects-coreto-summer26/memory/`).
- **Motivo:** Instruction prévia do user ("guarde informações valiosas para debug"), e facto de o sistema de memória ainda não ter sido usado neste projeto.
- **Evidência disponível:** Restrição operacional recém-descoberta (jogo pausa em console focus) seria cara de redescobrir.
- **Resultado:** Memória criada.
- **Avaliação:** Decisão necessária.
- **Melhoria futura:** N/A — fluxo correto.

## C.3 Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Necessário? | Contribuiu? | Substituível? |
|-----------|----------|-------------|-------------|---------------|
| `Bash` (`ls fase4/`) | Confirmar diretório existente antes de escrever | Sim | Sim — evitou criar arquivo no path errado | N/A |
| `Write` (debug-r4.md) | Documentar próxima iteração com watchdog robusto | Sim | Parcialmente — R4 não foi usado; user preferiu reexecutar R3 | Concatenar no R5 |
| `Write` (debug-r5.md) | Documentar click trace focado | Sim | Sim — arquivo correto para próxima iteração | N/A |
| `Write` (3× memória) | Persistir aprendizado operacional + estado de debug | Sim | Sim | N/A |
| `TaskCreate` (4×) | Rastrear trabalho restante | Sim | Sim — clarifica dependências | N/A |
| `Bash` (`wc -l`, `tail`) | Confirmar path/estrutura antes de apendar | Sim | Sim | N/A |

**Evitado:** leituras redundantes de `retrospectiva.md` (já no contexto), releituras de `debug-r3.md` (também no contexto).

## C.4 Intervenções do usuário

### Intervenção 1 (alta importância): "Faltou instrução de como eu deveria rodar o R3"

- **Instrução dada:** "Faltou instrução de como eu deveria rodar o R3. Quando eu estou na tela do console, o jogo fica sim travado. dessa vez eu abri o console colei o comando e imediatamente voltei para tela do jogo."
- **O que estava incorreto antes:** Os testes R1/R2/R3 omitiam a pré-condição "jogo visível durante todo o setTimeout", levando a 3 iterações de resultados inconclusivos.
- **Suposição causadora:** Assumi implicitamente que o usuário manteria o jogo em foco naturalmente durante o teste, mas o ato de abrir F12 e colar código leva a user a interagir com a janela do devtools.
- **Mudança após correção:** Toda iteração de teste agora inclui instrução explícita de janela visível + `document.hidden` em cada amostra.
- **Regra reutilizável:** Toda instrução de teste que dependa do loop do jogo rodando deve incluir pré-condição "mantenha a janela do Playtest visível", sugerir docking do F12 lateral ou second monitor, e usar `setInterval` (não pausa em tab oculta) como watchdog com `document.hidden` em cada amostra.

### Intervenção 2: "nem cheguei rodar o debug-r4"

- **Instrução dada:** "(obs: nem cheguei rodar o debug-r4)"
- **O que estava incorreto antes:** Eu tinha criado R4 como próximo passo, mas o user reexecutou R3 (com a correção operacional) e obteve o resultado conclusivo.
- **Suposição causadora:** Achei que R3 estava esgotado após o primeiro output anômalo. Mas a anomalia era de procedimento, não de teste.
- **Mudança após correção:** Pivot para R5 (click trace focado), descartando watchdog do R4 (não mais necessário).
- **Regra reutilizável:** Antes de criar R(N+1), validar se R(N) pode ser reexecutado com procedimento correto. Resultado anômalo pode refletir bug de teste, não bug de código.

## C.5 Análise de desperdício

### Desperdício 1: Criação do R4 com watchdog — usuário nunca rodou

- **O que aconteceu:** Criei `debug-r4.md` (~270 linhas) com watchdog de `setInterval` + `document.hidden` + 6 cenários E1-E6. User reexecutou R3 com procedimento correto e obteve resposta.
- **Impacto:** Médio — arquivo ocupa espaço no diretório sem ter sido validado em uso.
- **Causa:** Pulei a hipótese "R3 foi mal-executado, não mal-projetado" direto para "preciso de um novo teste".
- **Como evitar:** Antes de criar próximo teste, perguntar ao user se o teste anterior foi executado com procedimento correto. Especialmente quando o resultado for anômalo (e.g. "0 chamadas em 2s" com cena ativa).

### Desperdício 2: Não buscar a causa operacional antes

- **O que aconteceu:** Em 3 iterações (R1, R2, R3), vi resultados "impossíveis" (queue=1 persistente por 1.5s) e busquei explicação em internals do engine em vez de questionar o setup do teste.
- **Impacto:** Alto — consumiu 3 ciclos de teste desnecessários.
- **Causa:** Viés de "o teste está certo, o código está errado".
- **Como evitar:** Toda vez que um resultado for fisicamente impossível dada a pré-condição declarada (cena ativa + queue persistente = impossível em loop rodando), questionar a pré-condição antes de especular sobre o código.

## C.6 Caminho mínimo recomendado

Para uma próxima sessão de debug similar (bug de UI em RPG Maker MZ):

1. **Pré-condição de teste documentada no prompt:** "Mantenha a janela do jogo VISÍVEL durante todo o teste. Use F12 dockado lateralmente ou second monitor. Não troque de janela até o teste terminar."
2. **Watchdog obrigatório em todo teste com setTimeout/setInterval:** incluir `document.hidden` e `Graphics.frameCount` delta em cada amostra.
3. **Antes de investigar internals:** validar componente invocando-o manualmente (`$gameTemp.reserveCommonEvent(11)` no console). Se funcionar, bug está em outro lugar.
4. **Salvaguarda proativa:** pedir ao user para confirmar "durante o teste, o timer decrementou na tela?" antes de aceitar qualquer resultado. Se timer parou, teste é inválido.
5. **Diagnóstico de call chain via patches com logging em tempo real** (não só contadores finais).
6. **Criticério de encerramento:** patch rastreia cadeia completa do user-action até efeito observável; identifica exatamente qual nó quebra.

## C.7 Conhecimento reutilizável

### Fatos confirmados

- **MZ Playtest pausa quando console toma foco:** browser pausa `requestAnimationFrame` quando a tab/window do Playtest perde visibilidade. `SceneManager.updateMain` roda em rAF, então `Game_Map.update` recebe 0 chamadas.
- **`setInterval` continua rodando (throttled) em tab oculta** — útil como watchdog.
- **CE 11 (`EV_OnSafe`) cadeia interna funciona ponta-a-ponta** quando reservado via `$gameTemp.reserveCommonEvent(11)`.
- **Editor CE IDs F4:** 10=RaceTimer, 11=OnSafe, 12=OnRisk, 13=KeyInput (não 11-14 como docs antigas).
- **`ButtonPicture.js:84` `isClickEnabled`** retorna false se `picture.mzkp_commonEventId` for undefined/0.
- **Sistema de memória do projeto** vive em `/Users/edney/.claude/projects/-Users-edney-projects-coreto-summer26/memory/` com arquivo `MEMORY.md` como índice.

### Preferências do usuário

- Procedimento de teste MZ deve incluir instrução explícita de janela visível.
- User avisa quando teste foi mal-executado (não esconde).

### Restrições técnicas

- `requestAnimationFrame` pausa em tab oculta no Chromium usado pelo MZ Playtest.
- `setInterval` é throttled mas não pauso em tab oculta.
- Monkey-patches em prototypes devem ser restaurados ao final do teste (`Game_Map.prototype.update = _original`).

### Armadilhas conhecidas

- Resultado "0 chamadas em X segundos" com cena declarada ativa → tab oculta, não bug de código.
- `setTimeout` em console do MZ pausa o jogo se user trocar de janela durante a espera.
- `mzkp_commonEventId` é propriedade custom do plugin ButtonPicture — não existe sem o plugin.

### Heurísticas recomendadas

- **Anomalia física impossível → questionar pré-condição antes de código.**
- **Antes de investigar internals → validar componente via invocação manual.**
- **Todo teste MZ com timing → watchdog `setInterval` + `document.hidden` + `Graphics.frameCount` delta.**
- **Apreendizado operacional recorrente → salvar em memória persistente.**

## C.8 Informações que deveriam estar no prompt inicial

- **Obrigatório:** "Para testes MZ Playtest, mantenha a janela visível durante todo o `setTimeout`/`setInterval`. Browser pausa rAF em tab oculta."
- **Útil:** "Toda análise de '0 chamadas' deve verificar `document.hidden` e `Graphics.frameCount` delta antes de atribuir a bug de código."
- **Opcional:** "Antes de criar R(N+1), confirmar com user se R(N) foi executado com procedimento correto."

## C.9 Melhorias nos artefatos

### C.9.1 Análise técnica

**Problema:** Restrição operacional "MZ Playtest pausa em console focus" não estava documentada em nenhum artefato estrutural, levando a 3 iterações desperdiçadas.

**Informação ausente:** Comportamento do runtime MZ Playtest em resposta a visibility/focus.

**Por que pertence à análise técnica:** É uma restrição do ambiente que afeta toda validação Playtest.

**Seção sugerida:** "Restrições do ambiente Playtest" (nova seção).

**Texto sugerido:**

> ## Restrições do ambiente Playtest
>
> O runtime do RPG Maker MZ Playtest (Chromium/Electron) pausa `requestAnimationFrame` quando a janela perde visibilidade (alt-tab, janela coberta, F12 undocked cobrindo o canvas). Isto afeta:
>
> - `SceneManager.updateMain` (rodando em rAF) — `Game_Map.update` recebe 0 chamadas.
> - `setInterval` continua rodando (throttled a ~1Hz), mas o jogo não avança.
> - `Graphics.frameCount` para de incrementar.
>
> **Implicação para testes de console:** qualquer teste com `setTimeout`/`setInterval` que observa estado do jogo deve incluir watchdog com `document.hidden` e `Graphics.frameCount` delta em cada amostra. Se `frameDelta=0` e `document.hidden=true`, o teste é inválido.
>
> **Pré-condição operacional:** antes de colar qualquer teste no F12, garantir que a janela do Playtest permanecerá visível durante toda a execução. Sugerir docking do F12 lateralmente ou uso de second monitor.

**Impacto esperado:** Elimina iterações desperdiçadas por resultados anômalos de teste.

### C.9.2 Plano de implementação

**Problema:** Plano de validação F4 previa "clicar botão → F9 confirma lock liga" sem incluir pré-condição de janela visível durante playtest.

**Deficiência:** Ausência de pré-condição operacional para testes de UI.

**Etapa afetada:** Checklist de playtest (item 5 do `fase-4-completa.md`).

**Alteração recomendada:** Adicionar seção "Pré-condições para playtest" no plano.

**Texto sugerido:**

> ## Pré-condições para playtest
>
> Antes de executar qualquer item do checklist de playtest:
>
> 1. Janela do Playtest deve permanecer VISÍVEL durante todo o teste.
> 2. F12 (quando usado) deve estar dockado lateralmente ou em second monitor.
> 3. Não trocar de janela durante `setTimeout`/`setInterval` ativos.
> 4. Validar que o timer decrementa entre as observações — se parou, janela perdeu visibilidade e observação é inválida.

**Redução de custo:** Elimina rerun de testes por mal-execução.

### C.9.3 Tasks da fase executada

**Problema:** Task 4.4 (input handling) não listava `mzkp_commonEventId` como propriedade crítica a validar.

**Task afetada:** `task-4.4-input.md` (input via teclado + clique).

**Informação ausente:** Critério de aceitação sobre o bind do botão (`picture.mzkp_commonEventId > 0`).

**Consequência observada:** User reportou "botão não liga lock" sem que teste automatico verificasse o bind.

**Alteração recomendada:** Adicionar critério de aceitação na task.

**Texto sugerido:**

> ### Critério de aceitação adicional
>
> Após renderizar cena (Sinal ou Curva), as pictures 41-44 devem ter `mzkp_commonEventId > 0`. Validar via:
>
> ```javascript
> [41, 42, 43, 44].forEach(id => {
>     const p = $gameScreen.picture(id);
>     if (p?._name) console.assert(p.mzkp_commonEventId > 0, `Pic ${id} sem bind`);
> });
> ```
>
> Se qualquer picture ativa não tiver bind, o clique será silenciosamente ignorado por `Sprite_Picture.isClickEnabled` (ButtonPicture.js:84).

**Como validar:** Rodar snippet acima após `EV_RaceRenderer` (CE 7) executar.

### C.9.4 Problemas fora do escopo dos artefatos

**Problema:** Criei `debug-r4.md` com watchdog e 6 cenários E1-E6, mas user reexecutou R3 com procedimento correto.

**Por que fora do escopo:** Decisão operacional minha (criar próximo teste vs orientar reexecução). Não é deficiência de especificação.

**Como tratar:** Nenhuma alteração de artefato. Ação operacional interna: antes de criar R(N+1), perguntar ao user se R(N) foi bem-executado.

### C.9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|---|---|---|---|---|
| 3 iterações de resultados anômalos | Pré-condição de janela visível não documentada | Análise técnica | Adicionar seção "Restrições do ambiente Playtest" | Alta |
| Reexecução de testes por mal-execução | Plano sem pré-condições operacionais | Plano de implementação | Adicionar "Pré-condições para playtest" | Alta |
| Bind de botão não validado automaticamente | Task não inclui critério de `mzkp_commonEventId` | Task 4.4 | Adicionar critério de aceitação | Média |
| Criação de R4 sem necessidade | Decisão operacional precipitada | Fora do escopo | Nenhuma alteração | Baixa |

### C.9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Ver C.9.1 — adicionar seção "Restrições do ambiente Playtest".

#### Patch sugerido para o plano de implementação

Ver C.9.2 — adicionar "Pré-condições para playtest".

#### Patch sugerido para as tasks da fase executada

Ver C.9.3 — Task 4.4 ganha critério de aceitação sobre `mzkp_commonEventId`.

#### Ações fora do fluxo de especificação

- Antes de criar próxima iteração de teste, confirmar com user se teste anterior foi executado com procedimento correto.
- Memória persistente (`mz-playtest-pauses.md` e `fase4-debug-state.md`) já captura o aprendizado operacional.

## C.10 Checklist operacional (incremental)

Adicionar aos itens 1-20 anteriores:

21. **Pré-condição de teste MZ:** janela do Playtest visível durante todo `setTimeout`/`setInterval`.
22. **Watchdog de teste MZ:** `document.hidden` + `Graphics.frameCount` delta em cada amostra.
23. **Resultado impossível dada pré-condição declarada** → questionar pré-condição antes de código.
24. **Antes de investigar internals** → validar componente via invocação manual.
25. **Aprendizado operacional recorrente** → salvar em `~/.claude/projects/<project>/memory/`.

---

# Apêndice D — R5 → Task-4.5 (feedback perceptível como critério de aceite)

**Data:** 2026-06-18 (continuação da sessão do Apêndice C)
**Escopo:** Análise do output R5; desenquadramento de escopo F4 vs F5; criação de task-4.5; captura de regra permanente `user-testable-feedback`.

## D.1 Resumo da tarefa

**Solicitado:**
1. Analisar o output do teste `debug-r5.md` fornecido pelo usuário.
2. Esclarecer escopo da Fase 4 (ocorreu após pergunta do usuário sobre troca de cena).
3. Adicionar feedback ao plano da Fase 4 para que o usuário valide sem F12/F9.
4. Estabelecer regra: toda task/feature/bug testada manualmente precisa de feedback visível/sonoro.

**Entregue:**
- Diagnóstico R5 → cenário F5 (cadeia do clique funciona; bug era procedural — `[[mz-playtest-pauses]]`).
- Atualização de memória `fase4-debug-state.md` para status "click chain validated".
- Esclarecimento de escopo: troca de cena é F5 (tasks 5.1/5.2), não F4.
- Criação de `task-4.5.md` especificando `Play SE: freada` (CE 11) e `Play SE: pneu_cantando` (CE 12).
- Atualização de `tasks.md` (3 edições: header F4, lista de tasks, tabela, ordem de execução).
- Atualização de `fase-4-completa.md` (2 edições: checklist item 5, nova seção "Pendência aberta").
- Criação de memória permanente `user-testable-feedback.md` (tipo `feedback`).
- Atualização de `MEMORY.md` com índice.
- TaskList: deletar #19/#20 (obsoletas), criar #21/#22/#23.

**Critérios de sucesso:** task-4.5 criada com spec completa; regra persistida como memória que carrega em sessões futuras; F4 ainda NÃO marcada como validada (depende de implementar 4.5).

**Restrições aplicáveis:** `Jhonny/CLAUDE.md` (não marcar fase como validada sem Playtest confirmado); `.claude/rules/basci-rules.json` (English identifiers, mensagens em pt-BR); Convenção de IDs F3+ (switches 100-105, variáveis 100-113); assets em `audio/se/` apenas (`freada`, `pneu_cantando`, `crash_metal` já existem da F2).

## D.2 Decisões técnicas e inferências

### D.2.1 — Diagnóstico F5 (cadeia funciona)

- **Decisão:** Classificar output R5 como cenário F5 do `debug-r5.md`.
- **Motivo:** Output tinha todos os marcadores de sucesso: `Sprite_Picture.onClick` disparou em f=690, `mzkp_commonEventId=12`, `isClickEnabled=true`, `reserveCommonEvent(12)` chamado, queue 0→1→0, `SW_INPUT_LOCKED=true` na amostra 4.
- **Evidência disponível:** Output R5 colado pelo usuário; tabela F1-F5 em `debug-r5.md:259-282`.
- **Resultado:** Funcionou. Nenhum fix de código necessário para a cadeia click→reserve→CE→switch.
- **Avaliação:** Decisão apropriada. F5 era o cenário esperado após o R3-redo ter confirmado a cadeia manual.
- **Melhoria futura:** Nenhuma — o framework F1-F5 do `debug-r5.md` já cobria este caso.

### D.2.2 — Salvar meta-rule como tipo `feedback`, não `project`

- **Decisão:** Classificar a regra "toda task testada manualmente precisa de feedback" como memória tipo `feedback` (não `project`).
- **Motivo:** É uma orientação permanente sobre como abordar trabalho — não um fato sobre o estado do projeto.
- **Evidência:** Tipos definidos em `CLAUDE.md` (system prompt) distinguem `feedback` (guidance on approach) de `project` (ongoing work state).
- **Resultado:** Funcionou. Memory `user-testable-feedback.md` carregará em qualquer sessão futura do mesmo projeto.
- **Avaliação:** Correto.
- **Melhoria futura:** Nenhuma.

### D.2.3 — Criar task-4.5 em vez de reabrir task-4.3

- **Decisão:** Adicionar feedback como nova task-4.5, não modificar task-4.3 (já "implementada").
- **Motivo:** Convenção do projeto: tasks não são reabertas; novo trabalho = nova task.
- **Evidência:** Padrão observado em tasks.md: tasks marcadas `[x]` em fases anteriores permanecem congeladas; correções geram novas linhas.
- **Resultado:** Funcionou. Estrutura preservada.
- **Avaliação:** Decisão apropriada à convenção.
- **Melhoria futura:** Nenhuma.

### D.2.4 — Play SE como mínimo viável (não visual)

- **Decisão:** Task-4.5 especifica apenas `Play SE` (freada/pneu_cantando), sem feedback visual (Tint Screen, TextPicture, etc.).
- **Motivo:** Regra `user-testable-feedback` exige "visible OR audible" — áudio satisfaz. Visual completo é escopo de task 5.3 (animações de resolução).
- **Evidência:** `Jhonny/CLAUDE.md` confirma `audio/se/` tem `freada.ogg` e `pneu_cantando.ogg` da F2.
- **Resultado:** Spec concisa, baixo custo de implementação (~30min).
- **Avaliação:** Correto — composicional com tasks futuras (5.3, 7.1).
- **Melhoria futura:** Nenhuma.

### D.2.5 — Mapeamento Safe=freada, Risk=pneu_cantando

- **Decisão:** CE 11 (Safe) usa `freada`, CE 12 (Risk) usa `pneu_cantando`.
- **Motivo:** Mapeamento semântico óbvio (Safe=conservador=frear, Risk=agressivo=pneu cantando); usa apenas os 3 SEs já existentes.
- **Evidência:** Tasks.md linha 173 já mapeava "Safe=freada" para task 7.1; reuso é consistente.
- **Resultado:** Spec fechada sem ambiguidade.
- **Avaliação:** Apropriado.
- **Melhoria futura:** Nenhuma.

## D.3 Uso de ferramentas, comandos e scripts

### D.3.1 TaskList (checagem de estado atual)

- **Objetivo:** Confirmar estado das tarefas 17-20 antes de decidir próximas atualizações.
- **Resultado:** Confirmou 17/18 completas; 19/20 pendentes.
- **Contribuiu para solução:** Sim — base para deletar 19/20 e criar 21/22/23.
- **Substituível?** Não — era a fonte de verdade.
- **Evitar redundância:** Não houve.

### D.3.2 Read `fase-4-completa.md` (217 linhas)

- **Objetivo:** Confirmar escopo da Fase 4 antes de responder sobre troca de cena.
- **Resultado:** Confirmou — seção "Fora de escopo" lista explicitamente "Implementar lógica Safe completa (task 5.1 — cena++)".
- **Contribuiu para solução:** Sim, mas com desperdício.
- **Substituível?** Sim — `grep -n "Fora de escopo\|cena++" fase-4-completa.md` teria bastado.
- **Como evitar:** Buscas localizadas para arquivos conhecidos grandes.

### D.3.3 Read `tasks.md` (380 linhas)

- **Objetivo:** Localizar estrutura das tasks F4 para atualização.
- **Resultado:** Identificou header F4, lista de tasks, tabela de tasks, ordem de execução.
- **Contribuiu para solução:** Sim.
- **Substituível?** Parcialmente — `grep -n "Fase 4\|task-4\." tasks.md` reduziria consumo.
- **Como evitar:** Para arquivos conhecidos como índices, usar grep antes de ler integral.

### D.3.4 Read `task-4.3.md` (220 linhas)

- **Objetivo:** Entender formato de task antes de criar task-4.5.
- **Resultado:** Template XML task_context, seções canônicas, padrão de critérios.
- **Contribuiu para solução:** Sim — task-4.5 seguiu o mesmo template.
- **Substituível?** Não era estritamente necessário (formato já conhecido por sessions anteriores), mas reduziu erro.
- **Como evitar:** Em sessões onde o template já foi usado, pular esta leitura.

### D.3.5 Write/Edit (4 arquivos)

- `user-testable-feedback.md` (Write — novo arquivo de memória)
- `MEMORY.md` (Edit — adicionar linha de índice)
- `task-4.5.md` (Write — nova task)
- `tasks.md` (Edit x3 — header, lista, tabela, ordem)
- `fase-4-completa.md` (Edit x2 — checklist, nova seção)

Todas contribuíram diretamente para a solução. Nenhuma redundante.

### D.3.6 TaskUpdate (deletar 19/20, criar 21/22/23, adicionar blockedBy)

- 6 chamadas para gerenciar a fila de tarefas.
- **Contribuiu para solução:** Sim.
- **Como evitar:** Poderia ter agrupado todas as atualizações de status em uma sequência planejada — mas o overhead teria sido equivalente.

## D.4 Intervenções e correções do usuário

### D.4.1 — Pergunta sobre troca de cena

- **Instrução:** "ao clickar nos botões Esquerda/Direta na cena de curva visualmente dentro do jogo eu deveria esperar que o jogo trocasse de cena para a cena do sinal, é isso? conforme eu vou apertando, o código deveria ir trocando de cena? isso está implementado?"
- **O que estava incompleto antes:** Eu não havia explicado o escopo real da Fase 4 — apenas analisado R5 como "chain funciona". Usuário ficou sem saber o que esperar.
- **Suposição causadora:** Assumi que o escopo da Fase 4 era claro pelo contexto; não antecipei a confusão.
- **Mudança após correção:** Esclarecimento explícito: F4 = input+timer; F5 = lógica+troca de cena. Apontado para seção "Fora de escopo" de `fase-4-completa.md`.
- **Regra reutilizável:** Após diagnóstico de teste, sempre articular qual é o comportamento esperado vs o observado — não só "funciona" ou "não funciona".

### D.4.2 — Regra user-testable-feedback

- **Instrução:** "adiciona no plano da fase4 algum tipo de feedback... Tenha certeza de que quando você criar uma task/feature/bug, qualquer coisa que vai ser testada pelo usuario manualmente. que isso tenha um feedback visual ou sonoro para o usuario quando ele for testar. sem que ele precise abrir console ou usar o f9. esse tipo de recurso serve para debugar, não para testar se uma feature funciona ou não."
- **Classificação:** Nova preferência/standard (não correção de erro específico).
- **O que estava ausente:** Nenhuma regra explícita previa isso. Task-4.3 original tinha `visual_validation` que dizia "verificar F9" — anti-padrão não percebido.
- **Mudança após correção:** Regra capturada como memória tipo `feedback`; task-4.5 criada para aplicar à F4; tasks futuras deverão seguir a regra.
- **Regra reutilizável:** Salvar imediatamente como `feedback` type memory. Aplicar retroativamente a tasks pendentes que tenham mesmo padrão.

## D.5 Análise de desperdício

### D.5.1 — Leitura integral de `fase-4-completa.md` (217 linhas)

- **O que aconteceu:** Li o arquivo inteiro para responder à pergunta sobre troca de cena.
- **Impacto:** Médio.
- **Causa:** Hábito de ler completo para "ter contexto".
- **Como evitar:** `grep -n "Fora de escopo\|cena++\|task 5\."` teria retornado as 3 linhas necessárias. Ler apenas a seção relevante.

### D.5.2 — Não ter antecipado a regra user-testable-feedback

- **O que aconteceu:** Durante os 5 ciclos de debug R1-R5 (sessões anteriores), eu não apontei que os handlers silenciosos eram problema metodológico. Teria poupado iterações.
- **Impacto:** Alto (sessões múltiplas).
- **Causa:** Foco em "fazer o teste funcionar" em vez de "este teste é válido?".
- **Como evitar:** Antes de propor debug-R(N+1), perguntar: este teste tem algum outcome que o usuário consegue perceber sem ferramentas? Se não, adicionar feedback antes de testar.

### D.5.3 — TaskList checagem no meio da resposta

- **O que aconteceu:** Após output R5, fiz TaskList antes de responder — mas já sabia do resumo da sessão anterior que 17/18 eram in_progress e 19/20 pending.
- **Impacto:** Baixo.
- **Causa:** Confirmação desnecessária.
- **Como evitar:** Em estado conhecido, pular TaskList e ir direto ao update.

### D.5.4 — Resposta extensa sobre escopo F4

- **O que aconteceu:** Ao esclarecer escopo, incluí tabela detalhada de CEs + comparação F4 vs F5 + procedimento de teste.
- **Impacto:** Baixo-médio.
- **Causa:** Estrutura formal demais para uma resposta de esclarecimento.
- **Como evitar:** Resposta de esclarecimento de escopo deveria ser 3-5 linhas: "F4 = input+timer; F5 = lógica+troca de cena; clique em F4 só liga switch; ver `fase-4-completa.md` §Fora de escopo."

## D.6 Caminho mínimo recomendado

Para executar novamente o cenário desta sessão (output R5 → conclusão + plano de feedback + regra persistente):

1. **Receber output R5** do usuário.
2. **Cruzar com matriz F1-F5** em `debug-r5.md:138-282` para classificar o cenário. **Critério:** se `onClick` disparou, `mzkp_commonEventId` definido, `reserveCommonEvent` chamado, e lock ligou → F5.
3. **Atualizar memória `fase4-debug-state.md`** com status F5. **Critério:** descrição muda de "bug isolado" para "click chain validated".
4. **Deletar tasks de debug** (17/18 mark complete, 19/20 stale).
5. **SE** user perguntar sobre comportamento esperado, responder em ≤5 linhas citando seção "Fora de escopo" do fase-4-completa.md.
6. **SE** user apontar falta de feedback, propor task-4.5 diretamente (sem discutir opções):
   - Spec: `Play SE: freada` no CE 11, `Play SE: pneu_cantando` no CE 12, via `build_phase4_ces.py`.
   - Validação: usuário ouve som ao clicar, sem F12/F9.
7. **Salvar regra user-testable-feedback** como memory tipo `feedback` imediatamente após usuário articulá-la.
8. **Aplicar regra a tasks pendentes:** revisar tasks 5.x, 6.x, 7.x — cada uma deve ter critério de aceite perceptível sem debug.

## D.7 Conhecimento reutilizável

### Fatos confirmados

- **CE 11 (EV_OnSafe)** é chamado por btn_parar (Sinal) e btn_direita (Curva) — ação conservadora.
- **CE 12 (EV_OnRisk)** é chamado por btn_furar (Sinal) e btn_esquerda (Curva) — ação agressiva.
- **Cadeia click→reserve→CE→switch** funciona end-to-end quando o jogo está rodando (validado em R5).
- **ButtonPicture plugin** está ativo em `$plugins` (count=1) e respeita `mzkp_commonEventId` conforme R5.
- **Pictures 41/42** = botões Sinal; **43/44** = botões Curva (não renderizados em cena Sinal — esperado).
- **Mapeamento semântico de SEs** (F2): `freada` = brake/frear, `pneu_cantando` = aggressive maneuver, `crash_metal` = impacto.

### Preferências do usuário (novas nesta sessão)

- **Toda task testada manualmente** deve especificar feedback visível ou audível como critério de aceite. F12/F9 são debug, não validação. Salvo em `user-testable-feedback.md`.
- **Estrutura de resposta de esclarecimento de escopo** deve ser concisa — não construir tabelas formais para perguntas diretas.
- **Após análise de teste**, sempre articular o comportamento esperado vs observado (não só "passou/falhou").

### Restrições técnicas

- **`Play SE` (code 250)** params: `{name, volume, pitch, pan}` — nome sem extensão, arquivo em `audio/se/`.
- **`Play SE` não bloqueia** parallel CE execution (diferente de `Show Text` code 101 que abre message window).
- **MZ Playtest pausa main loop** quando F12 ou outra janela toma foco — regra recorrente (ver `[[mz-playtest-pauses]]`).
- **ButtonPicture.js** define `mzkp_commonEventId` como contrato entre render e click handler — não modificar propriedade sem regenerar bind.

### Armadilhas conhecidas

- **Esqueleto silencioso + F12 = debug infinito:** handlers sem feedback levam o usuário a abrir F12 para checar switch, F12 pausa o jogo, switch nunca liga, conclusão falsa de "bug". Solução: feedback perceptível antes de testar.
- **Confundir F4 com F5:** cena++ (troca de cena) parece intuitivo como "resultado de clique" mas é escopo de F5. Sempre citar seção "Fora de escopo" ao esclarecer.
- **Mapeamento de IDs 100-113/100-105** ainda é válido (convenção F3+); não voltar para 101-114/101-106.

### Heurísticas recomendadas

- **Antes de propor debug-R(N+1):** o teste tem outcome perceptível sem ferramentas? Se não, adicionar feedback antes.
- **Antes de ler arquivo >100 linhas:** grep pelo termo específico primeiro.
- **Toda nova preferência articulada pelo user** → salvar como memory imediatamente.
- **Spec de task com "verificar F9" em critério de aceite** → reformular para critério perceptível.
- **Esclarecimento de escopo** → 3-5 linhas + referência à seção canônica.

## D.8 Informações que deveriam estar no prompt inicial

### Obrigatório

- Nenhum item obrigatório adicional — o output R5 continha tudo necessário.

### Útil

- **Regra user-testable-feedback** deveria estar em `Jhonny/CLAUDE.md` desde F1. Sem ela, tasks 1.x-4.x não a seguem e o custo de validação cresce a cada fase.
- **Mapeamento semântico de SEs** (`freada`=Safe, `pneu_cantando`=Risk, `crash_metal`=Crash) deveria estar em `tasks.md` §Aprendizados — reutilização entre F4.5 e F7.1.

### Opcional

- Confirmação explícita de que o usuário tinha clicado em `btn_furar` (Pic 42) e não `btn_parar` (Pic 41) em R5 — saberíamos sem ler o output que CE 12 rodaria.

## D.9 Melhorias nos artefatos do fluxo

### D.9.1 Melhorias na análise técnica

**Problema observado:** Ausência de feedback perceptível nos handlers não foi flaggado como risco estrutural na análise técnica pré-F4. O risco conhecido (riscos.da.fase-4-completa.md §Riscos) menciona "handler silencioso" mas apenas como nota de implementação, não como blocker de validação.

**Informação ausente:** Risco metodológico — "handlers sem feedback perceptível invalidam testes manuais; F12/F9 são debug, não validação".

**Por que pertence à análise técnica:** É um risco estrutural aplicável a todas as fases com teste manual.

**Seção sugerida:** Adicionar a `Guia de Implementação - Core Loop da Corrida` §Riscos:

```markdown
### Risco: Handlers sem feedback perceptível

Handlers de input (CE 11/12, futuros CEs de crash/resolução) não podem
ser validados via F12/F9 — essas ferramentas são debug, não validação,
e em MZ Playtest especificamente pausam o jogo ([[mz-playtest-pauses]]).

Toda task que envolva handler disparado por input do usuário DEVE incluir
na spec:
1. Comando `Play SE` (code 250) com SE já existente em `audio/se/`.
2. Ou `Show Picture` + `Move Picture` + `Erase Picture` (animação breve).
3. Ou `Tint Screen` flash (code 223) com Wait + reset.

Critério de aceite: usuário percebe o efeito sem abrir F12/F9.
```

**Impacto esperado:** Tasks 5.x, 6.x, 7.x produzidas com feedback desde o spec, eliminando ciclos de debug futuros.

### D.9.2 Melhorias no plano de implementação

**Problema observado:** Plano não tem checkpoint explícito "task tem critério de aceite perceptível sem ferramentas".

**Deficiência:** Cada fase pode entregar tasks que "passam" sintaticamente mas exigem F12/F9 para validar — levando aos mesmos bugs procedurais.

**Etapa afetada:** Todas as fases com playtest manual.

**Alteração recomendada:** Adicionar ao `tasks.md` §Overview:

```markdown
**Regra de validação (aprendizado F4):** toda task com `visual_validation`
DEVE ter critério de aceite perceptível sem F12/F9. Se a task não tem
feedback natural (áudio, animação, HUD update), adicionar como parte
da spec antes de marcar como implementada.
```

**Como reduziria custo:** Elimina iterações de debug procedurais; tasks validáveis em primeira tentativa de playtest.

### D.9.3 Melhorias nas tasks da fase executada

**Task afetada:** task-4.3 (já marcada como implementada, mas spec tem anti-padrão).

**Informação ausente:** `visual_validation` da task-4.3 diz "verificar F9" — anti-padrão.

**Consequência:** Implementação seguiu spec → handlers silenciosos → 5 ciclos de debug.

**Alteração recomendada:** Em futuras tasks (e retrospectivamente na task-4.5), substituir padrão:

```markdown
## visual_validation

[SUBSTITUIR]
3. Clicar em qualquer botão:
   - `SW_INPUT_LOCKED` (101) `= ON` após o clique (verificar F9).

[POR]
3. Clicar em qualquer botão:
   - Som distinto toca imediatamente (`freada` para Safe, `pneu_cantando` para Risk).
   - Timer para de decrementar (indireto: lock ativo).
```

**Como validar que a nova instrução é suficiente:** Usuário consegue perceber resultado do clique apenas olhando/ouvindo o jogo, sem abrir nenhuma ferramenta de debug.

### D.9.4 Problemas fora do escopo dos artefatos

**Problema:** Eu não antecipei a regra user-testable-feedback durante as sessões R1-R5.

**Por que está fora do escopo:** A regra não estava articulada em nenhum artefato; era conhecimento tácito do usuário.

**Como deveria ser tratado:** Memória `user-testable-feedback.md` é o artefato correto (não análise técnica, nem plano, nem task). Aplicar retroativamente via revisão de tasks pendentes.

### D.9.5 Matriz de rastreabilidade das melhorias

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|---|---|---|---|---|
| Handlers silenciosos obrigaram F12 → bug procedural mascarado por 5 ciclos | Risco não listado na análise técnica | Análise técnica | Adicionar seção "Risco: Handlers sem feedback perceptível" | Alta |
| Tasks futuras podem repetir o anti-padrão | Plano sem checkpoint de "aceite perceptível" | Plano de implementação | Adicionar regra a tasks.md §Overview | Alta |
| Task-4.3 spec dizia "verificar F9" como validação | Padrão de visual_validation incorreto | Tasks da fase | Substituir "verificar F9" por critério perceptível em tasks futuras | Média |
| Regra capturada como memória (não spec) | É conhecimento operacional, não spec de produto | Fora do escopo | Manter memória; aplicar via revisão de tasks | — |
| Leitura integral de fase-4-completa.md desnecessária | Hábito operacional | Fora do escopo | Internalizar: grep antes de read em arquivos conhecidos grandes | Baixa |

### D.9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Adicionar a `Guia de Implementação - Core Loop da Corrida` nova seção:

```markdown
### Risco: Handlers sem feedback perceptível

Handlers de input (CE 11/12, futuros CEs de crash/resolução) não podem
ser validados via F12/F9 — essas ferramentas são debug, não validação,
e em MZ Playtest especificamente pausam o jogo.

Toda task que envolva handler disparado por input do usuário DEVE incluir
na spec:
1. Comando `Play SE` (code 250) com SE já existente em `audio/se/`, OU
2. `Show Picture` + `Move Picture` + `Erase Picture` (animação breve), OU
3. `Tint Screen` flash (code 223) com Wait + reset.

Critério de aceite: usuário percebe o efeito sem abrir F12/F9.
```

#### Patch sugerido para o plano de implementação

Adicionar a `tasks.md` §Overview (após as "Decisões técnicas críticas"):

```markdown
**Regra de validação (aprendizado F4 — ver [[user-testable-feedback]]):**
toda task com `visual_validation` DEVE ter critério de aceite perceptível
sem F12/F9. Se a task não tem feedback natural (áudio, animação, HUD
update), adicionar como parte da spec antes de marcar como implementada.
```

#### Patch sugerido para as tasks da fase executada

**Task-4.5 (recém-criada nesta sessão):** já segue a regra. Nenhuma alteração necessária.

**Task-4.3 (implementada, mas spec tem anti-padrão):** Em futuras specs similares, substituir:

```diff
- 3. Clicar em qualquer botão:
-    - `SW_INPUT_LOCKED` (101) `= ON` após o clique (verificar F9).
+ 3. Clicar em qualquer botão:
+    - Som distinto toca imediatamente após o clique (ver task-4.5).
+    - Timer para de decrementar (efeito indireto do lock).
```

#### Ações fora do fluxo de especificação

- **Revisar tasks 5.x, 6.x, 7.x** quanto ao padrão "verificar F9" em `visual_validation`. Reformular onde aplicável.
- **Memória `user-testable-feedback.md`** persistida — carrega em sessões futuras automaticamente.

## D.10 Checklist operacional (incremental)

Adicionar aos itens 1-25 anteriores:

26. **Toda spec de task com `visual_validation`** → critério de aceite perceptível sem F12/F9. Se não há feedback natural, adicionar `Play SE` ou animação na própria spec.
27. **Antes de ler arquivo >100 linhas** → `grep -n "<termo>"` primeiro.
28. **Resposta de esclarecimento de escopo** → ≤5 linhas + referência à seção canônica.
29. **Usuário articula nova preferência** → salvar como `feedback` memory imediatamente; não esperar próxima menção.
30. **Após output de teste** → articular comportamento esperado vs observado (não só "passou/falhou").

---

# Apêndice E — Implementação direta da Task-4.5 (Play SE em EV_OnSafe/EV_OnRisk)

**Data:** 2026-06-18
**Origem:** Continuação imediata do Apêndice D — usuário aprovou implementação da task-4.5 que foi apenas especificada.
**Tarefa:** Implementar `task-4.5` (adicionar `Play SE: freada` em CE 11 e `Play SE: pneu_cantando` em CE 12) via extensão de `build_phase4_ces.py`.

## E.1 Resumo da tarefa

- **Solicitado:** Implementar `task-4.5` — especificada no Apêndice D — adicionando feedback sonoro aos handlers `EV_OnSafe`/`EV_OnRisk`.
- **Entregue:** 2 comandos `Play SE` (code 250) inseridos via `build_phase4_ces.py`; `CommonEvents.json` regenerado e validado; `task-4.5.md` marcada `implemented`; `fase-4-completa.md` atualizada (tabela de CEs, estrutura do CE 11, seção "Pendência aberta", checklist 8-11 e 15).
- **Critérios automáticos (todos confirmados):** JSON válido; `rg '"code": 250'` retorna 2 ocorrências; Play SE posicionado após `Control Switches SW_INPUT_LOCKED = ON` em ambos os CEs; nomes corretos (`freada` em CE 11, `pneu_cantando` em CE 12).
- **Pendente:** Subtarefa 4.5.6 — playtest MZ do usuário (validação audível).
- **Restrições:** Editar via script gerador idempotente (não direto no JSON); respeitar `user-testable-feedback`; validar com `python3 -m json.tool` e auditoria `rg`.

## E.2 Decisões técnicas e inferências

### E.2.1 Editar script gerador, não JSON direto
- **Decisão:** Estender `build_phase4_ces.py` e rodá-lo, em vez de patchear `CommonEvents.json`.
- **Motivo:** Regra do projeto (CLAUDE.md "Prefer structured JSON edits via parser/writer"); o script é a fonte canônica declarada em `task-4.5.md`.
- **Evidência:** Task-4.5 §Subtarefas 4.5.1-4.5.3 explicita esse caminho; docstring do script afirma "Idempotente".
- **Resultado:** Funcionou. Idempotência preservada para futuras mudanças da fase.
- **Avaliação:** Necessária — caminho ótimo.
- **Melhoria futura:** Nenhuma.

### E.2.2 Posição após lock, antes do placeholder
- **Decisão:** Inserir `Play SE` imediatamente após `Control Switches SW_INPUT_LOCKED = ON`, antes do comentário placeholder.
- **Motivo:** Task-4.5 §"Por que antes do placeholder" justificou — feedback instantâneo; placeholder será preenchido em F5 com lógica que poderia causar delay perceptível.
- **Evidência:** Especificação explícita.
- **Resultado:** Auditoria confirma `[9] Control Switches` → `[10] Play SE` → `[11] End`.
- **Avaliação:** Necessária.
- **Melhoria futura:** Nenhuma.

### E.2.3 Volume 90, pitch 100, pan 0
- **Decisão:** Valores padrão do task-4.5.md.
- **Motivo:** Especificação literal.
- **Resultado:** Funcionou.
- **Avaliação:** Adequada — volume 90 = alto o suficiente; pitch 100 = natural; pan 0 = centro. Refinamento fica para task 7.1.
- **Melhoria futura:** Nenhuma.

### E.2.4 Manter status `implemented` (não `validada`)
- **Decisão:** Marcar task como `implemented`; checklist 8-11 como `AGUARDANDO PLAYTEST`.
- **Motivo:** Regra `Jhonny/CLAUDE.md` — "Do not mark a phase as 'validada' until the user confirms Playtest results."
- **Evidência:** Subtarefa 4.5.6 pendente.
- **Resultado:** Correto.
- **Avaliação:** Necessária.
- **Melhoria futura:** Nenhuma.

## E.3 Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Contribuiu? | Substituível? |
|-----------|----------|-------------|---------------|
| `Read` `build_phase4_ces.py` (467 linhas) | Localizar blocos CE 11/12 + helper `C()` | Sim | **Parcial** — `rg "^def "` teria reduzido para ~62 linhas |
| `Bash` `ls audio/se/ \| grep` | Confirmar pré-condição (assets existem) | Sim | Não |
| `Edit` `build_phase4_ces.py` (2x) | Inserir Play SE | Sim | Não |
| `Bash` `python3 build_phase4_ces.py` | Regenerar JSON | Sim | Não |
| `Bash` `python3 -m json.tool` | Validar JSON | Sim | Não |
| `Bash` `rg '"code": 250'` | Auditar contagem | Sim | Não |
| `Bash` python inline (2x) | Confirmar CE→name + sequência | Útil | `rg -B2 -A5` teria bastado |
| `Edit` `task-4.5.md` (3x) + `fase-4-completa.md` (5x) | Atualizar docs | Sim | Não |

### E.3.1 Leitura integral do script (desperdício menor)
- **O que:** Li 467 linhas quando ~62 bastariam.
- **Impacto:** Baixo. A leitura ampla confirmou padrões de outros blocos, dando confiança para edições consistentes.
- **Causa:** Inércia — "ler para editar" sem prévia localização via `rg "^def "`.
- **Como evitar:** Em Python >200 linhas, `rg "^def "` primeiro.

### E.3.2 Auditoria dupla (rg + python)
- **O que:** Após `rg "code": 250` (contagem=2), rodei Python inline adicional.
- **Impacto:** Baixo. Produziu evidência mais legível (CE→name), mas era reduntante com `rg -B2 -A5`.
- **Causa:** Excesso de zelo.
- **Como evitar:** Para auditorias simples, `rg -C` com contexto basta.

## E.4 Intervenções e correções do usuário

**Nenhuma nesta sessão.** O usuário aprovou (`Implementar task-4.5: Play SE em EV_OnSafe/EV_OnRisk`) e o trabalho fluiu sem redirecionamentos.

**Lição:** Especificações precisas (como `task-4.5.md`, escrita no Apêndice D) reduzem drasticamente a necessidade de correções. A regra `user-testable-feedback`, capturada como meta-aprendizado no Apêndice D, pagou dividendos imediatos — sua formalização produziu especificações que se traduziram diretamente em implementação sem fricção.

## E.5 Análise de desperdício

### E.5.1 Leitura integral do script
- **Impacto:** Baixo.
- **Causa:** Falha operacional da LLM (também em Apêndice D §D.5.1).
- **Como evitar:** `rg "^def "` antes de Read em Python grande.

### E.5.2 TaskList com 6 itens para task trivial
- **O que:** Criei 6 tasks para trabalho de 5 minutos.
- **Impacto:** Baixo-médio. Cada task foi concluída em 1-2 tool calls; overhead administrativo desproporcional.
- **Causa:** Reflexo da granularidade da task-4.5 (6 subtarefas).
- **Como evitar:** Para tasks ≤ 10 tool calls, pular TaskList.

### E.5.3 Resposta final extensa
- **O que:** A resposta final listou 8 validações, 3 mudanças em docs, e tutorial de playtest em tabela.
- **Impacto:** Baixo-médio. Usuário pediu implementação; recebeu implementação + relatório completo + tutorial.
- **Causa:** Hábito de sumarizar "o que mudou".
- **Como evitar:** Lead com status + próxima ação (≤3 frases). Tabelas vão para docs.

### E.5.4 Sem desperdícios de exploração
**Diferença crítica vs Apêndices A-D:** esta sessão não teve buscas amplas, hipóteses falsas, ou iterações de debug. Especificação direta → execução direta.

## E.6 Caminho mínimo recomendado

1. **(Pré)** `ls Jhonny/audio/se/{freada,pneu_cantando}.ogg` — confirma pré-condição. Critério: 2 arquivos listados.
2. **(Leitura dirigida)** `rg "^def " build_phase4_ces.py` — índice de funções. Critério: identificar offsets de `build_on_safe_list` e `build_on_risk_list`.
3. **(Leitura dos blocos)** `Read build_phase4_ces.py offset=<n> limit=62` — 2 funções + helper `C()`. Critério: padrão confirmado.
4. **(Edição)** 2x `Edit build_phase4_ces.py` inserindo `C(250, 0, [{"name": "<se>", "volume": 90, "pitch": 100, "pan": 0}])` após `C(121, 0, [SW_INPUT_LOCKED, SW_INPUT_LOCKED, 0])`.
5. **(Geração)** `python3 build_phase4_ces.py` — critério: stdout mostra CE 11/12 com 12 cmds (era 11).
6. **(Validação)** `python3 -m json.tool CommonEvents.json > /dev/null && rg -c '"code": 250' CommonEvents.json` — critério: JSON OK + `2`.
7. **(Auditoria)** `rg -B2 -A5 '"code": 250' CommonEvents.json` — critério: contexto mostra CE 11→freada, CE 12→pneu_cantando.
8. **(Docs)** Atualizar `task-4.5.md` (status + subtarefas) e `fase-4-completa.md` (tabela, estrutura, pendência, checklist).
9. **(Entrega)** Resposta de 2-3 frases: status + próxima ação.

**Total ideal:** ~9 tool calls. Sessão real usou ~17 (com overhead de TaskList). Redução possível: ~50%.

## E.7 Conhecimento reutilizável

### E.7.1 Fatos confirmados

- **Formato Play SE em RMMZ** (`rmmz_objects.js:command250`): `{"code": 250, "indent": N, "parameters": [{"name": "<sem-extensão>", "volume": 0-100, "pitch": 0-150, "pan": -100 a 100}]}`. Nome sem `.ogg`; RMMZ procura `<name>.ogg` em `audio/se/`.
- **CE Editor IDs F4:** 10=EV_RaceTimer, 11=EV_OnSafe, 12=EV_OnRisk, 13=EV_KeyInput. (F3 = 5-9.)
- **Variáveis/Switches canônicas:** ver constantes nomeadas em `build_phase4_ces.py:41-58`.
- **Pré-condição de asset:** antes de adicionar Play SE, confirmar `Jhonny/audio/se/<name>.ogg` existe (`ls`).
- **Idempotência de `build_phase4_ces.py`:** reexecução com inputs unchanged produz diff vazio.

### E.7.2 Preferências do usuário (novas nesta sessão)

Nenhuma. Esta sessão confirmou preferências capturadas no Apêndice D.

### E.7.3 Restrições técnicas

- Editar dados RMMZ via script gerador idempotente (Python + json), nunca direto no JSON.
- Não marcar fase como `validada` sem playtest do usuário.
- TaskList não agrega valor para tasks ≤ 10 tool calls.
- `rg "^def "` é o índice de funções mais barato em Python grande.

### E.7.4 Armadilhas conhecidas

- Ler arquivo Python grande inteiro quando grep seria suficiente — recorrente (D.5.1, E.5.1).
- TaskList excessiva para tasks triviais.
- Resposta final muito longa — usuário pode ler `git diff`.

### E.7.5 Heurísticas recomendadas

- **Especificação > exploração.** Tasks com formato JSON, IDs e comandos de validação explícitos executam direto. Investir em spec paga em execuções futuras.
- **Convenção canônica:** task.md → edit script gerador → run → validate → audit → update docs.
- **Pular TaskList** para tasks com escopo pequeno.
- **Resposta final:** lead com status + próxima ação (≤3 frases).

## E.8 Informações que deveriam estar no prompt inicial

- **Obrigatório:** Nenhuma — `task-4.5.md` já continha tudo.
- **Útil:** Path absoluto do script gerador — mas estava implícito na task.
- **Opcional:** Nomes dos SEs já existentes (confirmei via `ls`).

**Avaliação:** Prompt do usuário (`Implementar task-4.5: Play SE em EV_OnSafe/EV_OnRisk`) + `task-4.5.md` (no contexto) eram suficientes. Nenhuma informação crítica faltava.

## E.9 Melhorias nos artefatos do fluxo

### E.9.1 Melhorias na análise técnica

`Nenhuma alteração recomendada para a análise técnica.` A análise já cobre Play SE (code 250) e o formato de `audio/se/`. Implementação não expôs lacunas.

### E.9.2 Melhorias no plano de implementação

`Nenhuma alteração recomendada para o plano de implementação.` `tasks.md` já lista task-4.5; ordem (4.1→...→4.5) está correta — feedback vem após handlers minimamente funcionais.

### E.9.3 Melhorias nas tasks da fase executada

`Nenhuma alteração recomendada para as tasks desta fase.` `task-4.5.md` já continha: formato JSON canônico, posição dentro do CE, nomes dos SEs, comandos de validação, procedimento visual sem F12/F9, mapeamento CE-botão-SE justificado. Especificação exemplar.

### E.9.4 Problemas fora do escopo dos artefatos

| Problema | Por que fora do escopo | Como tratar |
|---------|------------------------|-------------|
| Leitura integral do script (E.5.1) | Falha operacional da LLM, não deficiência de spec | Praticar `rg "^def "` antes de Read |
| TaskList excessiva (E.5.2) | Falha operacional da LLM | Skip para tasks < 10 tool calls |
| Resposta final extensa (E.5.3) | Falha operacional da LLM | Lead com status + next action |

### E.9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|--------------------|-----------------|---------------------|----------------------|------------|
| Leitura integral do script | Inércia "ler para editar" | Fora do escopo (operação LLM) | Praticar `rg "^def "` antes de Read | Baixa |
| TaskList 6 itens para task trivial | Reflexo da granularidade da task | Fora do escopo (operação LLM) | Skip para tasks pequenas | Baixa |
| Resposta final extensa | Hábito de sumário completo | Fora do escopo (operação LLM) | Lead com status + next action | Baixa |

### E.9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica
`Nenhuma alteração recomendada para a análise técnica.`

#### Patch sugerido para o plano de implementação
`Nenhuma alteração recomendada para o plano de implementação.`

#### Patch sugerido para as tasks da fase executada
`Nenhuma alteração recomendada para as tasks desta fase.`

#### Ações fora do fluxo de especificação
Nenhuma ação externa ao fluxo de especificação foi identificada. As ineficiências observadas (E.5.1-E.5.3) são operacionais e devem ser tratadas como prática contínua da LLM, não como alterações de artefatos.

## E.10 Checklist operacional (incremental)

Adicionar aos itens 1-30 anteriores:

31. **Antes de implementar task com Play SE** → `ls Jhonny/audio/se/<name>.ogg` (sem asset, som não toca).
32. **Antes de ler arquivo Python >200 linhas** → `rg "^def "` para índice; ler só funções relevantes.
33. **Para tasks ≤ 10 tool calls** → pular TaskList. Resposta final: status + próxima ação (≤3 frases).

---

# Apêndice F — Bug do guarda 3 (descoberta em playtest pós-F4.5) + fechamento da F4

**Data:** 2026-06-18
**Origem:** Continuação do Apêndice E — usuário fez playtest pós-F4.5 e observou "deveria ouvir algo quando o timer acaba?".
**Tarefa:** Diagnosticar bug do path de timeout, propor fix, implementar após aprovação, marcar F4 como COMPLETA E VALIDADA.

## F.1 Resumo da tarefa

- **Solicitado:** (1) Responder se o design exige feedback sonoro no timeout; (2) implementar o fix do bug; (3) atualizar tasks/plano antes de implementar; (4) marcar F4 como validada após confirmação de que teclado também funciona.
- **Entregue:**
  - Diagnóstico: bug do guarda 3 em CE 11/12 bloqueava o path de timeout → auto-Safe (CE 10 chamava CE 11 com `VAR_TIMER_FRAMES == 0`, mas CE 11 rejeitava chamadas com `<= 0`).
  - Fix: opção A (remover guarda 3) aplicada em `build_phase4_ces.py`; `CommonEvents.json` regenerado; CE 11/12 passaram de 12 para 9 comandos.
  - Documentação do bug adicionada em `fase-4-completa.md` (nova seção "Bug do guarda 3") **antes** da implementação, conforme solicitação do usuário.
  - F4 marcada como **COMPLETA E VALIDADA** em `tasks.md` e `fase-4-completa.md` após playtest do usuário confirmar todos os paths (cliques + teclado + timeout + anti-re-entrada).
  - Memory `fase4-debug-state.md` removida (debug resolvido).
- **Critérios de sucesso:** JSON válido; CE 11/12 com 9 cmds cada; audição de `freada` em timeout; audição de sons distintos em Risk vs Safe; anti-re-entrada via lock confirmada pelo usuário; F4 marcada completa.
- **Restrições:** Editar via script gerador idempotente; documentar bug no plano antes de implementar; explicar em linguagem simples (não jargão).

## F.2 Decisões técnicas e inferências

### F.2.1 Diagnosticar como bug (não como "design sem feedback no timeout")
- **Decisão:** Tratar a ausência de som no timeout como bug, não como recurso faltante.
- **Motivo:** O design da F4 (CE 10) explicitamente chama CE 11 no timeout; ausência de som = implementação não cumpre o design.
- **Evidência:** `fase-4-completa.md` CE 10 estrutura: `If VAR_TIMER_FRAMES == 0: set TIMEOUT_FLAG=1, Call EV_OnSafe`. Risco documentado na fase: "EV_OnSafe chamado por timeout não faz nada visível" — previa o sintoma, mas atribuía causa errada ("placeholder esqueleto").
- **Resultado:** Correto — bug estrutural confirmado.
- **Avaliação:** Necessária.
- **Melhoria futura:** Quando um risco documentado se manifesta, revalidar a causa atribuída — pode estar errada.

### F.2.2 Escolher Opção A (remover guarda 3) sobre Opção B (nested If)
- **Decisão:** Remover as 3 linhas do guarda 3, em vez de trocar por `If VAR_TIMER_FRAMES <= 0 AND TIMEOUT_FLAG == 0 → Exit` (nested If).
- **Motivo:** Guarda 3 é redundante com guarda 2 (lock impede re-entrada); o cenário degenerado que Opção B protege só ocorre em debug via console.
- **Evidência:** Trace dos cenários pós-fix: clique manual, timeout, re-entrada, race terminada — todos funcionam corretamente sem guarda 3.
- **Resultado:** Funcionou — playtest confirmou todos os cenários.
- **Avaliação:** Adequada — simplicidade vence defesa desnecessária.
- **Melhoria futura:** Nenhuma.

### F.2.3 Documentar bug no plano ANTES de implementar
- **Decisão:** Adicionar seção "Bug do guarda 3" em `fase-4-completa.md` com sintoma/causa/fix planejado, antes de editar o script.
- **Motivo:** Solicitação explícita do usuário ("Atualize a task e se preciso o plano antes de implementar").
- **Evidência:** Usuário pediu; prática alinhada com "specification > exploration" (Apêndice E).
- **Resultado:** Doc nunca ficou stale; usuário pôde revisar abordagem antes da execução.
- **Avaliação:** Boa prática — adotar como padrão para fixes não-triviais.
- **Melhoria futura:** Para fixes que mudam estrutura de dados (CEs, variáveis), sempre documentar no plano antes de implementar.

### F.2.4 Remover memory `fase4-debug-state.md`
- **Decisão:** Deletar a memory de debug ao marcar F4 como validada.
- **Motivo:** Memory era específica do debug ativo (R1-R5); debug resolvido → memory stale.
- **Evidência:** Regra de memory: "Update or remove memories that turn out to be wrong or outdated".
- **Resultado:** MEMORY.md atualizado; memory removida.
- **Avaliação:** Correto — caso de estudo preservado na retrospectiva, não precisa duplicar em memory.
- **Melhoria futura:** Ao concluir um ciclo de debug, sempre revisar memories relacionadas e limpar as stale.

## F.3 Uso de ferramentas, comandos e scripts

| Ferramenta | Objetivo | Contribuiu? | Substituível? |
|-----------|----------|-------------|---------------|
| `Read` `fase-4-completa.md` (seções localizadas via `rg`) | Localizar ancoras para Edits | Sim | Não — necessário para Edits precisos |
| `rg "^## "` em `fase-4-completa.md` | Índice de seções | Sim | Não |
| `Bash` `rg "Fase 4\|fase-4\|F4\|fase4" tasks.md` | Localizar menções F4 | Sim | Poderia ter sido `rg -n "STATUS" tasks.md` — mais focado |
| `Edit` `fase-4-completa.md` (5x) | Documentar bug + atualizar estrutura + checklist + riscos + status | Sim | Não |
| `Edit` `tasks.md` (1x) | Atualizar STATUS F4 | Sim | Não |
| `Edit` `build_phase4_ces.py` (2x) | Remover guarda 3 de CE 11 e CE 12 | Sim | Não |
| `Bash` `python3 build_phase4_ces.py` | Regenerar JSON | Sim | Não |
| `Bash` `python3 -m json.tool` + python inline | Validar JSON + auditar sequência | Sim | Não |
| `Bash` `rm memory/fase4-debug-state.md` | Limpeza de memory stale | Sim | Não |
| `Read` MEMORY.md + `Edit` MEMORY.md | Atualizar índice após remoção | Sim | Não |

### F.3.1 Busca ampla no tasks.md (desperdício menor)
- **O que:** `rg "Fase 4|fase-4|F4|fase4"` retornou 30 matches; precisei filtrar mentalmente para encontrar o STATUS.
- **Impacto:** Baixo. Output foi gerido em uma única tela.
- **Causa:** Padrão de busca muito amplo.
- **Como evitar:** Para atualizar status, buscar `rg -n "STATUS"` é mais focado.

## F.4 Intervenções e correções do usuário

### F.4.1 "Você me explicou com termos muito complicados"
- **Instrução:** "o que eu preciso saber é: A opção A que você sugeriu, vai manter o que foi decidido por design?"
- **O que estava incorreto:** Minha resposta original tinha tabela com 5 colunas, opções A/B com trade-offs, trace de 5 passos. User queria sim/não + implicação de design.
- **Suposição que causou o problema:** Achei que user queria entender tecnicamente para decidir. Na verdade user só queria confirmar que o design não estava sendo alterado.
- **Mudança após correção:** Respondi em 3 frases: "Sim, mantém. Clique → toca. Timer zera → toca. Mesmo som. Só remove uma checagem que estava atrapalhando."
- **Regra reutilizável:** Quando user fizer pergunta de design ("deveria fazer X?"), responder design primeiro (sim/não + o que muda), não implementação. Implementação só se user pedir.

### F.4.2 "Atualize a task e se preciso o plano antes de implementar"
- **Instrução:** Atualizar TaskList e plano antes de implementar o fix.
- **O que estava incorreto:** Tendência natural seria ir direto ao código (fix é pequeno).
- **Suposição que causou o problema:** Achei que para fix pequeno (~3 min), documentação poderia vir depois.
- **Mudança após correção:** Limpei TaskList (marquei completos, deletei stale, criei novas para o fix), documentei bug em `fase-4-completa.md` com seção nova antes de tocar no script.
- **Regra reutilizável:** Para qualquer fix estrutural (muda CEs, variáveis, formato de dados), documentar no plano antes de implementar. Fix trivial (1 linha de código sem mudança estrutural) pode pular.

## F.5 Análise de desperdício

### F.5.1 Resposta inicial super-jargonizada (F.4.1)
- **O que:** Respondi pergunta simples do user com tabela + opções + trace técnico.
- **Impacto:** Médio. Custou 1 ciclo de clarificação.
- **Causa:** Não calibrei resposta ao tipo de pergunta (design vs implementação).
- **Como evitar:** Classificar pergunta antes de responder. "Should X happen?" → resposta de design. "Why doesn't X work?" → resposta de implementação.

### F.5.2 Tasks #21-23 stale descobertas pelo system reminder
- **O que:** System reminder apontou que tasks #21-23 estavam pendentes mas o trabalho já tinha sido feito em sessão anterior.
- **Impacto:** Baixo. Limpeza foi rápida (3 TaskUpdate paralelos).
- **Causa:** Não marquei tasks como completed ao final da implementação da task-4.5 na sessão anterior.
- **Como evitar:** Ao concluir um passo, marcar TaskUpdate imediatamente (não esperar "batch no final").

### F.5.3 Sem desperdícios de exploração
Esta sessão (como Apêndice E) não teve buscas amplas, hipóteses falsas, ou iterações de debug. Bug foi diagnosticado por leitura do código existente; fix foi direto; validação foi clara.

## F.6 Caminho mínimo recomendado

1. **(Pré)** Quando user relatar comportamento inesperado, classificar: bug em código existente, design ambíguo, ou feature faltante. Ferramenta: pergunta direta ao design ("o que deveria acontecer?"). Critério: confirmar intenção antes de diagnosticar.
2. **(Diagnóstico)** Ler CE structure no plano (`fase-4-completa.md` → seção CEs). Ferramenta: `rg "^### CE"` para índice. Critério: identificar contradição entre caller e callee.
3. **(Resposta ao user)** Lead com design (sim/não + implicação), não com implementação. Critério: user confirma que entendeu a intenção.
4. **(Propor fix)** 2 opções no máximo, com recomendação. Critério: user aprova uma.
5. **(Documentar no plano ANTES de implementar)** Adicionar seção "Bug X" em `fase-4-completa.md` com sintoma/causa/fix planejado. Critério: seção rastreável.
6. **(Implementar)** Edit script gerador + regenerar JSON + validar. Critério: JSON OK + auditoria de cmds.
7. **(Atualizar doc pós-fix)** Atualizar estrutura de CEs, riscos, checklist. Critério: doc reflete realidade.
8. **(Playtest user)** User confirma cenários sem F12/F9. Critério: todos os cenários passam.
9. **(Marcar fase completa)** Atualizar `tasks.md` STATUS + `fase-4-completa.md` frontmatter + checklist. Critério: doc diz "COMPLETA E VALIDADA".
10. **(Limpar memory stale)** Revisar memories relacionadas ao debug fechado. Critério: memory index atualizado.

## F.7 Conhecimento reutilizável

### F.7.1 Fatos confirmados (novos nesta sessão)

- **Bug estrutural clássico:** Quando CE A chama CE B em uma condição X, mas CE B tem um guarda que rejeita X, o path nunca completa. Sintoma: caller executa, callee não. Diagnóstico: ler callee primeiro e checar cada guarda contra a condição do caller.
- **Guardas redundantes:** Lock (SW_INPUT_LOCKED ON) já impede re-entrada; guardas adicionais tipo "timer <= 0" são redundantes e podem bloquear paths intencionais.
- **Risco documentado pode ter causa errada:** A fase-4 original previa o sintoma do timeout mas atribuía a "placeholder esqueleto". Causa real era o guarda 3. Riscos documentados devem ser revalidados quando o sintoma se manifesta.

### F.7.2 Preferências do usuário (novas nesta sessão)

- **Linguagem simples para respostas de design:** Quando user perguntar "deveria fazer X?", responder sim/não + implicação, não trace técnico.
- **Documentar antes de implementar:** Para fixes estruturais (CEs, variáveis), atualizar plano antes do código.

### F.7.3 Restrições técnicas

- Mesmas de Apêndice E.

### F.7.4 Armadilhas conhecidas (novas)

- Responder pergunta de design com explicação de implementação → fricção desnecessária.
- Deixar TaskList stale → system reminder aponta; melhor marcar completed imediatamente.
- Atribuir causa a risco documentado sem revalidar → pode perpetuar diagnóstico errado.

### F.7.5 Heurísticas recomendadas

- **Classificar pergunta antes de responder:** design (should X?) vs implementação (why doesn't X?).
- **Para fixes estruturais:** documentar no plano antes do código.
- **Ao fechar ciclo de debug:** revisar memories e limpar stale.
- **Risco documentado manifestado:** revalidar causa; não assumir que estava certa.

## F.8 Informações que deveriam estar no prompt inicial

- **Obrigatório:** Nenhuma — contexto da fase estava completo.
- **Útil:** User poderia ter saido "estou perguntando sobre design, não sobre implementação" — mas isso é inferível do tipo de pergunta.
- **Opcional:** Nada.

## F.9 Melhorias nos artefatos do fluxo

### F.9.1 Melhorias na análise técnica

**Problema:** Bug do guarda 3 nasceu de uma contradição estrutural entre CE 10 (caller) e CE 11/12 (callees). A análise técnica da F4 não verificou a consistência entre callers e callees.

**Informação ausente:** Análise de "boundary conditions" — para cada caller→callee, listar em quais estados o caller chama e checar se os guardas do callee aceitam todos esses estados.

**Seção da análise técnica:** Adicionar subseção "Validação de caller-callee" ou similar.

**Texto sugerido:** "Para cada par (caller CE, callee CE), enumerar: (a) em quais condições de estado o caller invoca o callee; (b) quais guardas o callee aplica; (c) confirmar que callee aceita todos os estados de chamada do caller. Exemplo: CE 10 chama CE 11 quando VAR_TIMER_FRAMES == 0 → CE 11 não deve ter guarda `VAR_TIMER_FRAMES <= 0 → Exit`."

**Impacto:** Preveniria bug da F4 e bugs similares em fases futuras.

### F.9.2 Melhorias no plano de implementação

**Problema:** Plano não tinha teste explícito para "timeout = mesmo feedback que clique manual Safe".

**Etapa afetada:** F4 §Validação visual.

**Alteração recomendada:** Adicionar critério perceptível para timeout.

**Texto sugerido:** Adicionar à validação visual da F4: "ao deixar o timer expirar sem input, **um som toca** (mesmo `freada` do clique Safe — design: timeout = auto-Safe) — sem precisar de F12/F9."

**Impacto:** Teria feito o teste de timeout constar do checklist desde o início; bug seria pego no primeiro playtest, não após F4.5.

### F.9.3 Melhorias nas tasks da fase executada

**Task afetada:** task-4.3 (criar CE 11/12 com "3 guardas").

**Informação incorreta:** Task spec dizia "3 guardas (SW_RACE_ACTIVE=100, SW_INPUT_LOCKED=101, VAR_TIMER_FRAMES=108)". O guarda `VAR_TIMER_FRAMES` está errado — bloqueia path de timeout.

**Consequência:** Implementação seguiu a spec; bug foi ao ar.

**Alteração recomendada:** Remover o guarda `VAR_TIMER_FRAMES` da lista; justificar por que 2 guardas bastam.

**Texto sugerido para task-4.3:**
> "CE 11/12 têm **2 guardas**:
> - guarda 1: `SW_RACE_ACTIVE OFF → Exit` (fora de corrida)
> - guarda 2: `SW_INPUT_LOCKED ON → Exit` (anti-re-entrada)
>
> **Não** adicionar guarda para `VAR_TIMER_FRAMES <= 0`: o path de timeout (CE 10 chamando CE 11 quando timer chega a 0) precisa ser aceito pelo handler. O guarda 2 (lock) já impede qualquer re-entrada depois da primeira execução."

**Validação:** Re-ler a task após aplicação e confirmar que especifica CE 11/12 com exatamente 2 guardas, e que justifica a exclusão do guarda de timer.

### F.9.4 Problemas fora do escopo dos artefatos

| Problema | Por que fora do escopo | Como tratar |
|---------|------------------------|-------------|
| Resposta inicial jargonizada (F.5.1) | Falha operacional da LLM, não deficiência de spec | Praticar classificação de pergunta antes de responder |
| Tasks stale não marcadas (F.5.2) | Falha operacional da LLM | Marcar TaskUpdate imediatamente ao concluir passo |

### F.9.5 Matriz de rastreabilidade

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|--------------------|-----------------|---------------------|----------------------|------------|
| Bug do guarda 3 (timeout sem feedback) | Spec task-4.3 pedia 3 guardas; guarda 3 errado | Task 4.3 | Reduzir para 2 guardas + justificar exclusão | Alta |
| Bug não diagnosticado na análise técnica | Sem validação caller-callee | Análise técnica | Adicionar seção "Validação caller-callee" | Média |
| Teste de timeout não estava no checklist | Plano listava cliques mas não timeout explicitamente como feedback | Plano (F4 §Validação visual) | Adicionar critério perceptível para timeout | Média |
| Resposta jargonizada | Falha operacional LLM | Fora do escopo | Praticar classificação de pergunta | Baixa |
| Tasks stale | Falha operacional LLM | Fora do escopo | Marcar TaskUpdate imediatamente | Baixa |

### F.9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Adicionar subseção "Validação caller-callee":

> Para cada par (caller CE, callee CE), enumerar: (a) em quais condições de estado o caller invoca o callee; (b) quais guardas o callee aplica; (c) confirmar que callee aceita todos os estados de chamada do caller.
>
> Exemplo F4: CE 10 chama CE 11 quando `VAR_TIMER_FRAMES == 0` → CE 11 não deve ter guarda `VAR_TIMER_FRAMES <= 0 → Exit`.

#### Patch sugerido para o plano de implementação

Em F4 §Validação visual, adicionar:

> "ao deixar o timer expirar sem input, **um som toca** (mesmo `freada` do clique Safe — design: timeout = auto-Safe) — sem precisar de F12/F9."

#### Patch sugerido para as tasks da fase executada

Em `task-4.3.md`, substituir a especificação de "3 guardas" por:

> CE 11/12 têm **2 guardas**:
> - guarda 1: `SW_RACE_ACTIVE OFF → Exit` (fora de corrida)
> - guarda 2: `SW_INPUT_LOCKED ON → Exit` (anti-re-entrada)
>
> **Não** adicionar guarda para `VAR_TIMER_FRAMES <= 0`: o path de timeout (CE 10 chamando CE 11 quando timer chega a 0) precisa ser aceito pelo handler. O guarda 2 (lock) já impede qualquer re-entrada depois da primeira execução.

#### Ações fora do fluxo de especificação

Nenhuma ação externa ao fluxo de especificação foi identificada. Ineficiências operacionais (resposta jargonizada, tasks stale) devem ser tratadas como prática contínua da LLM.

## F.10 Checklist operacional (incremental)

Adicionar aos itens 1-33 anteriores:

34. **Ao responder pergunta de design** ("deveria fazer X?") → sim/não + implicação. Sem trace técnico.
35. **Para fix estrutural** (CEs, variáveis, formato dados) → documentar no plano antes de implementar.
36. **Risco documentado que se manifesta** → revalidar causa; não assumir que estava certa.
37. **Ao fechar ciclo de debug** → revisar memories; deletar stale; atualizar MEMORY.md.
38. **TaskList** → marcar TaskUpdate imediatamente ao concluir passo, não batch no final.
