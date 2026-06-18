---
title: "Retrospectiva Técnica — Debug Fase 3 (IDs MZ deslocados)"
fase: 3
data: "2026-06-18"
tipo: retrospectiva-tecnica
executor: "Codex"
status_da_fase: "debug concluído — playtest confirmado pelo usuário"
---

# Retrospectiva Técnica — Debug Fase 3

## 1. Resumo da tarefa

**Solicitado:** ajudar a debugar a Fase 3 do plano do core loop da Corrida em RPG Maker MZ, porque o jogo renderizava apenas a barra de Consciência no topo, sem fundo/elementos da cena.

**Entregue:**
- Diagnóstico do desalinhamento entre os IDs planejados e os IDs efetivamente usados pelo `System.json`.
- Correção de `Jhonny/data/CommonEvents.json` para alinhar `EV_RaceOrchestrator` e `EV_RaceRenderer` aos IDs reais.
- Correção de `Jhonny/data/Map001.json` para inicializar `VAR_RACE_ID` no ID real.
- Atualização de `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/build_phase3_ces.py` para regenerar a Fase 3 sem reintroduzir o deslocamento.

**Critérios de conclusão:**
- `python3 -m json.tool` passou em `CommonEvents.json` e `Map001.json`.
- Checks pontuais confirmaram `EV_RaceRenderer.trigger = 2`, `switchId = 100`, guarda por `SW_RACE_ACTIVE`, comparação `VAR_SCENE_INDEX != VAR_LAST_RENDERED_INDEX`, scripts inline corrigidos e autorun escrevendo `VAR_RACE_ID`.
- Usuário confirmou em playtest: "Funcionou".

**Arquivos relevantes:**
- `Jhonny/data/System.json`
- `Jhonny/data/CommonEvents.json`
- `Jhonny/data/Map001.json`
- `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/build_phase3_ces.py`
- `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/tasks.md`

## 2. Decisões técnicas e inferências

| Decisão ou inferência | Motivo | Evidência disponível | Resultado | Avaliação | Melhoria futura |
|---|---|---|---|---|---|
| Tratar `CommonEvents.json` como fonte de verdade inicial | O trecho colado pelo usuário precisava ser comparado ao arquivo salvo | Leitura de CE 5 e CE 7 mostrou divergências entre o trecho do chat e o arquivo em disco | Parcial: identificou diferenças, mas ainda não explicou o deslocamento real | Necessária | Sempre comparar "texto do Editor" com JSON salvo antes de sugerir edição manual |
| Diagnosticar primeiro fluxo `SW_RACE_ACTIVE`/renderer | Sintoma era "só barra renderiza", típico de renderer não ativo ou disparando cedo | Retrospectiva anterior já citava bug de `SW_RACE_ACTIVE` antes/depois do preload; trecho do usuário mostrava switches errados | Parcial: primeira orientação corrigiu parte do fluxo, mas não resolveu todos os IDs | Razoável, mas incompleta | Validar tabela de IDs reais antes de orientar correção manual |
| Considerar que havia deslocamento de IDs | Usuário observou que seleções pareciam "um número para cima" | `System.json` mostrou nomes em índices brutos 100-113; comandos MZ salvos pelo Editor usavam esses índices | Funcionou | Necessária | Tornar obrigatório gerar uma tabela `nome -> id usado no comando` a partir de `System.json` |
| Alinhar o gerador aos IDs reais `100-113` em vez de insistir no plano `101-114` | O Editor e o arquivo salvo estavam operando com IDs brutos onde `#0100` exibia `SW_RACE_ACTIVE` | `System.json`: índice 100 = `SW_RACE_ACTIVE`; índice 100 = `VAR_RACE_ID`; trecho do usuário exibia `#0100 SW_RACE_ACTIVE` | Funcionou | Necessária para este estado do projeto | Atualizar análise/plano/tasks para explicitar que o projeto usa IDs reais `100-113`, apesar da documentação anterior |
| Corrigir scripts inline junto com comandos eventados | Scripts JS não passam pelo seletor visual do Editor e continuavam usando IDs antigos | Busca encontrou `$gameVariables.value(101)`, `setValue(103)`, `setValue(104)`, `setValue(110)` em `CommonEvents.json` e no gerador | Funcionou | Crítica | Sempre auditar scripts inline quando corrigir IDs de variáveis/switches |
| Corrigir `Map001` autorun | O autorun ainda escrevia `VAR_RACE_ID` em `101`, que agora era `VAR_SCENE_INDEX` | Leitura de `Map001.json`: comando inicial `[101,101,0,0,1]` | Funcionou | Necessária | Toda mudança de convenção de IDs deve incluir eventos de mapa, não só Common Events |
| Regenerar via `build_phase3_ces.py` em vez de editar só JSON final | Se o gerador ficasse desatualizado, futura execução reintroduziria o bug | `build_phase3_ces.py` ainda declarava constantes `101-114` | Funcionou | Necessária | Corrigir sempre a fonte geradora/idempotente antes do artefato gerado |

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta ou comando | Objetivo específico | Por que foi necessário | Resultado obtido | Contribuiu diretamente? | Substituição mais simples | Como evitar redundância |
|---|---|---|---|---|---|---|
| `sed` em `tasks.md` e `fase3/retrospectiva.md` | Entender plano e aprendizados prévios | Usuário apontou esses arquivos como contexto | Confirmou Fase 3, bugs anteriores e sintoma conhecido | Sim | Ler só trechos de Fase 3 e armadilhas conhecidas | Começar por buscas em `retrospectiva.md` por "somente a barra", "SW_RACE_ACTIVE", "ID" |
| `rg` por `RaceRender`, `EV_RaceOrchestrator`, `JhonnyRace`, IDs | Localizar artefatos reais | Era preciso saber onde o projeto armazenava CEs e scripts | Encontrou `CommonEvents.json`, `build_phase3_ces.py`, docs/tasks | Sim | `rg` limitado a `Jhonny/data` e `build_phase3_ces.py` teria bastado | Evitar busca ampla em `docs/` depois que o alvo é debug de JSON salvo |
| Python para imprimir CE 3/5/7/8/9 | Comparar comandos salvos com texto do usuário | JSON de RPG Maker é difícil de ler cru | Mostrou comandos, triggers, switchIds e scripts inline | Sim | Essencial; poderia ter sido o primeiro comando após ler o prompt | Usar uma função de dump curto focada em CE 5 e 7 |
| Python para imprimir `System.json` | Verificar nomes e IDs de variáveis/switches | O bug era suspeito de IDs deslocados | Confirmou nomes em índices brutos 100-113 | Sim, decisivo | Essencial | Fazer antes de orientar correção manual |
| `find` por cópias de `CommonEvents.json` | Checar se playtest poderia usar outro arquivo | Havia divergência entre chat e disco | Confirmou só uma cópia relevante | Parcial | Útil, mas poderia esperar | Só usar se a divergência persistir após salvar/reabrir |
| Playwright + `python3 -m http.server` | Tentar validar visualmente no navegador | Queria reproduzir playtest sem Editor | Chegou apenas na title screen; não validou a fase | Não para a solução | Pular; o usuário já fazia playtest no MZ | Não usar browser sem ferramenta de clique/evaluate confiável para avançar da title |
| `view_image` no screenshot | Inspecionar tela capturada | Consequência do teste Playwright | Confirmou title screen, não a cena | Não | Pular junto com Playwright | Remover artefatos temporários se criado |
| `apply_patch` em `build_phase3_ces.py` | Corrigir constantes e scripts inline no gerador | Fonte geradora estava desalinhada | Gerador passou a usar IDs reais `100-113` | Sim | Essencial | Patch direto após tabela de IDs |
| Execução de `build_phase3_ces.py` | Regenerar `CommonEvents.json` | Evita edição manual inconsistente | CE 5-9 recriados com IDs corrigidos | Sim | Essencial | Manter script idempotente |
| Python para ajustar `Map001.json` | Corrigir autorun `VAR_RACE_ID` | Gerador não cobria mapa | Autorun passou de `[101,101,...]` para `[100,100,...]` | Sim | Poderia virar script idempotente separado | Incluir Map001 no script de fase ou em checklist |
| `python3 -m json.tool` | Validar sintaxe JSON | Mudanças em JSON de dados MZ | OK | Sim | Essencial | Rodar uma vez ao fim, não após cada microetapa |
| `rm` de screenshot e `.playwright-mcp` | Limpar artefatos temporários | O teste visual criou arquivos | Workspace limpo | Sim, secundário | Evitar criar esses artefatos | Não usar Playwright nesse caso |

## 4. Intervenções e correções do usuário

| Intervenção | O que estava incorreto ou incompleto antes | Suposição/interpretação causadora | Mudança após correção | Regra reutilizável |
|---|---|---|---|---|
| Usuário interrompeu a tentativa com Playwright e pediu "continue" | A execução estava tentando validar via navegador, mas ainda não tinha passado da title screen | Suposição de que validação browser seria rápida e útil | Retomada do diagnóstico por arquivos e JSON | Em projeto RPG Maker, se o usuário está no Editor/playtest, priorizar inspeção de dados e feedback do playtest sobre automação browser |
| Usuário informou que atualizou manualmente e suspeitou que seleções estavam "um número para cima" | A orientação anterior ainda seguia parcialmente a convenção planejada `101-114` | Foi assumido que os IDs do plano eram a fonte de verdade | A investigação passou a checar `System.json` por índice bruto e corrigiu para `100-113` | Quando o Editor mostra `#0100 Nome`, acreditar no arquivo salvo e validar tabela real antes de corrigir IDs |
| Usuário confirmou "Funcionou" | Validação visual final ainda não havia sido obtida por ferramenta | Dependência real do playtest no MZ | Tarefa encerrada e gerador mantido corrigido | Não marcar debug visual como concluído sem confirmação do usuário quando a automação não reproduz o fluxo |
| Usuário pediu atualizar `retrospectiva.md` existente | Destino da retrospectiva estava ambíguo até a resposta | Nenhuma; foi uma escolha de localização | Retrospectiva salva no arquivo existente da Fase 3 | Seguir regra: perguntar destino uma vez quando não houver caminho inequívoco |

## 5. Análise de desperdício

| O que aconteceu | Impacto estimado | Causa | Como evitar |
|---|---|---|---|
| Leitura ampla de documentos e buscas em docs/tasks além dos arquivos de dados | Médio | Tentativa de reconstruir contexto completo da Fase 3 antes de validar o estado salvo | Para debug pós-implementação, começar por `System.json`, `CommonEvents.json`, `Map001.json` e só depois consultar docs |
| Primeira resposta ao usuário focou em `SW_RACE_ACTIVE`/renderer sem validar a tabela real de IDs | Médio | Confiança excessiva no plano anterior `101-114` | Sempre imprimir tabela `switches[100:107]` e `variables[100:115]` antes de recomendar alteração no Editor |
| Tentativa de usar Playwright/HTTP server para validar visualmente | Médio | Busca por confirmação independente, mas sem automação de input disponível | Pular validação browser em RMMZ quando ela para na title screen; usar feedback do usuário ou instruções de playtest |
| Screenshot temporário e diretório `.playwright-mcp` | Baixo | Efeito colateral da tentativa Playwright | Evitar Playwright; se usado, limpar imediatamente |
| Busca `find /Users/edney` por screenshot | Baixo | Caminho de saída do Playwright era incerto | Primeiro procurar no workspace atual; evitar busca ampla no home |
| Repetição de diagnósticos já presentes na retrospectiva antiga | Baixo | A retrospectiva anterior continha muitos aprendizados, mas nem todos eram relevantes ao bug atual | Para sessão de debug, extrair só linhas associadas ao sintoma atual |
| Não conferir cedo scripts inline | Alto | A atenção inicial ficou em comandos visuais de variáveis/switches | Sempre auditar `value(...)` e `setValue(...)` junto com IDs eventados |

## 6. Caminho mínimo recomendado

1. **Ação:** Ler apenas o trecho do usuário e identificar CEs afetados (`EV_RaceOrchestrator`, `EV_RaceRenderer`).
   - **Entrada:** Texto colado pelo usuário.
   - **Ferramenta:** Nenhuma ou leitura visual.
   - **Resultado esperado:** Lista de nomes/IDs suspeitos.
   - **Critério para seguir:** Saber quais CEs comparar no JSON.

2. **Ação:** Dump curto de `System.json` para variáveis/switches 100-114.
   - **Entrada:** `Jhonny/data/System.json`.
   - **Ferramenta:** Python ou `jq`.
   - **Resultado esperado:** Tabela real `id usado no comando -> nome`.
   - **Critério para seguir:** Confirmar se o projeto usa `100-113` ou `101-114`.

3. **Ação:** Dump curto de CE 5, CE 7 e autorun de `Map001`.
   - **Entrada:** `CommonEvents.json`, `Map001.json`.
   - **Ferramenta:** Python.
   - **Resultado esperado:** Comandos críticos visíveis: switchId, guarda, comparação, set last, scripts inline, timer, autorun.
   - **Critério para seguir:** Identificar todos os pontos fora da tabela real.

4. **Ação:** Corrigir a fonte geradora `build_phase3_ces.py`.
   - **Entrada:** Tabela real de IDs.
   - **Ferramenta:** `apply_patch`.
   - **Resultado esperado:** Constantes e scripts inline usam a mesma convenção.
   - **Critério para seguir:** `rg "value\\(|setValue\\("` não mostra IDs antigos incompatíveis.

5. **Ação:** Executar o gerador para reescrever CE 5-9.
   - **Entrada:** `build_phase3_ces.py` corrigido.
   - **Ferramenta:** `python3`.
   - **Resultado esperado:** `CommonEvents.json` regenerado.
   - **Critério para seguir:** CE 7 `switchId` é o ID real de `SW_RACE_ACTIVE`.

6. **Ação:** Corrigir `Map001.json` se o autorun inicializa `VAR_RACE_ID`.
   - **Entrada:** Tabela real de IDs e lista do evento `Init Corrida`.
   - **Ferramenta:** Python simples ou patch estruturado.
   - **Resultado esperado:** Autorun escreve `VAR_RACE_ID` real.
   - **Critério para seguir:** Primeiro comando do autorun usa o ID correto.

7. **Ação:** Validar JSON e imprimir checks críticos.
   - **Entrada:** JSONs editados.
   - **Ferramenta:** `python3 -m json.tool` e dump curto.
   - **Resultado esperado:** Sintaxe OK e comandos críticos coerentes.
   - **Critério para concluir:** Usuário confirma playtest ou os checks batem exatamente com o contrato esperado.

## 7. Conhecimento reutilizável

### Fatos confirmados

- Neste estado do projeto, os nomes relevantes estão nos IDs usados pelo comando MZ `100-113`, não em `101-114`:
  - `100 = VAR_RACE_ID` e `100 = SW_RACE_ACTIVE`
  - `101 = VAR_SCENE_INDEX` e `101 = SW_INPUT_LOCKED`
  - `102 = VAR_SCENE_TYPE`
  - `103 = VAR_P_CENA`
  - `104 = VAR_CONSCIENCIA`
  - `105 = VAR_PONTOS_GLORIA` e `105 = SW_IS_CURVA_DIABO`
  - `108 = VAR_TIMER_FRAMES`
  - `109 = VAR_SCENE_START`
  - `110 = VAR_SEED`
  - `111 = VAR_RACE_N_CENAS`
  - `112 = VAR_ATTEMPT_N`
  - `113 = VAR_LAST_RENDERED_INDEX`
- `EV_RaceRenderer` deve ser `trigger = 2` com `switchId = 100` nesse projeto.
- `EV_RaceRenderer` deve comparar `VAR_SCENE_INDEX != VAR_LAST_RENDERED_INDEX` e salvar `LAST = SCENE`.
- `EV_RaceOrchestrator` deve ligar `SW_RACE_ACTIVE` depois de `EV_Preload`, não antes.
- Scripts inline em Common Events precisam usar os mesmos IDs reais que os comandos eventados.
- `Map001` autorun também participa da convenção de IDs: inicializa `VAR_RACE_ID`.

### Preferências do usuário

- O usuário valida no RPG Maker MZ/Playtest e informa o resultado.
- O usuário prefere documentação de retrospectiva no diretório da fase (`fase3/retrospectiva.md`).
- O usuário aceita correções diretas nos arquivos do projeto quando o problema está identificado.

### Restrições técnicas

- Dados de RPG Maker MZ em JSON usam IDs numéricos diretamente; o Editor pode exibir `#0100 Nome`, e esse número deve ser tratado como a fonte observável.
- O seletor visual do Editor não corrige scripts inline JavaScript; esses precisam de auditoria textual.
- `build_phase3_ces.py` é fonte geradora para CE 5-9; editar só `CommonEvents.json` deixa risco de regressão.
- Playwright sem automação de clique/evaluate não foi útil para passar da title screen e validar a cena.

### Armadilhas conhecidas

- Assumir que o plano `101-114` é correto quando o `System.json` salvo mostra nomes em `100-113`.
- Corrigir apenas comandos visuais no Editor e esquecer scripts como `$gameVariables.value(...)`.
- Corrigir `CommonEvents.json` e esquecer o autorun em `Map001.json`.
- Concluir que "só barra renderiza" é apenas problema de preload/ordem do switch; também pode ser IDs deslocados.
- Regenerar CEs com um script antigo que ainda usa constantes erradas.

### Heurísticas recomendadas

- Para qualquer bug de variável/switch em RMMZ, primeiro imprimir `System.json` com índices brutos e nomes.
- Quando o usuário cola comandos do Editor, comparar `#NNNN Nome` contra o JSON salvo antes de orientar edição manual.
- Buscar `value(` e `setValue(` sempre que uma correção envolve IDs de variáveis.
- Corrigir primeiro a fonte geradora, depois regenerar o JSON.
- Se o sintoma envolve renderização parcial, verificar simultaneamente: switch condition do CE paralelo, ordem do preload, variáveis de detecção de mudança e scripts inline.

## 8. Informações que deveriam estar no prompt inicial

- **Obrigatório:** tabela real de IDs conforme exibida pelo Editor ou extraída de `System.json` (`#0100 SW_RACE_ACTIVE`, etc.).
- **Obrigatório:** confirmação de que o trecho colado já estava salvo no Editor antes da comparação com `CommonEvents.json`.
- **Útil:** resultado do F9 durante playtest para `SW_RACE_ACTIVE`, `VAR_SCENE_INDEX`, `VAR_LAST_RENDERED_INDEX`, `VAR_SCENE_TYPE` e `VAR_P_CENA`.
- **Útil:** informar que havia suspeita de deslocamento de seletores antes da primeira correção manual.
- **Opcional:** screenshot do playtest após o fade, desde que acompanhado dos valores F9.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

| Problema observado durante a execução | Informação ausente ou incorreta | Por que pertence à análise técnica | Seção sugerida | Texto sugerido | Impacto esperado |
|---|---|---|---|---|---|
| IDs planejados `101-114` não batiam com os IDs reais usados pelo projeto | A fonte de verdade dos IDs não estava documentada como snapshot do `System.json` | É contrato estrutural entre eventos, scripts e Database | "Mapa de IDs e fonte de verdade" | "Antes de implementar ou debugar eventos, extrair de `System.json` a tabela real `id -> nome`. Neste projeto, a Fase 3 usa IDs reais `100-113` para variáveis e `100-105` para switches. Não assumir que a numeração do plano corresponde ao Editor." | Alto |
| Scripts inline mantiveram IDs antigos | A análise não tratava scripts JS como consumidores do contrato de IDs | Scripts são parte da arquitetura de integração MZ/JS | "Contratos entre Common Events e scripts inline" | "Todo ID usado em `$gameVariables.value/setValue` e `$gameSwitches.value/setValue` deve ser auditado junto com comandos 121/122/111. O seletor do Editor não protege scripts inline." | Alto |
| O sintoma "só barra renderiza" tinha múltiplas causas possíveis | A análise anterior enfatizava preload/ordem de switch, mas não IDs deslocados | Diagnóstico de runtime precisa listar causas prováveis e checks | "Riscos de renderização parcial" | "Se apenas HUD renderizar: verificar (1) CE paralelo condicionado pelo switch correto, (2) `SW_RACE_ACTIVE` ligado após preload, (3) comparação `SCENE_INDEX != LAST`, (4) scripts inline escrevendo `VAR_SCENE_TYPE/P_CENA` nos IDs reais." | Médio |

### 9.2 Melhorias no plano de implementação

| Problema observado durante a execução | Deficiência do plano | Etapa afetada | Alteração recomendada | Texto sugerido | Redução de custo/risco |
|---|---|---|---|---|---|
| Validação de IDs reais aconteceu tarde, após correções manuais | Plano não tinha checkpoint "snapshot do Database" antes de gerar ou debugar CEs | Pré-passos F3 e F4 | Adicionar checkpoint obrigatório antes de qualquer edição | "Pré-check: imprimir de `System.json` a tabela `variables[95:115]` e `switches[95:110]`; usar essa tabela como fonte de verdade para todos os comandos e scripts." | Evita deslocamento global |
| `build_phase3_ces.py` podia reintroduzir bug após correção manual | Plano não deixa claro que scripts geradores são artefatos-fonte | F3 manutenção/debug | Tratar gerador como primeira alteração | "Quando houver script gerador para CEs, corrigir o gerador antes de corrigir o JSON gerado; regenerar e validar." | Evita regressão |
| Playtest dependia do usuário, mas automação foi tentada sem ganho | Plano não define estratégia de validação para RMMZ quando browser para na title | Validação visual | Definir que playtest MZ do usuário é critério final quando não há automação de input | "Se a automação não avança da title screen, encerrar validação automatizada em JSON/checks e pedir/aguardar confirmação de playtest MZ." | Reduz tentativas improdutivas |

### 9.3 Melhorias nas tasks da fase executada

| Task afetada | Informação ausente, ambígua ou incorreta | Consequência observada | Alteração recomendada | Texto sugerido | Como validar |
|---|---|---|---|---|---|
| `task-3.1` | IDs dos comandos no Orchestrator seguiam plano `101-114`, não snapshot real | `SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, seed, cena e tentativa ficaram deslocados | Adicionar pré-condição de tabela real e exemplo ajustável | "Antes de editar o Orchestrator, obter IDs reais de `System.json`. Não hardcodar `101-114` sem conferir. Se `SW_RACE_ACTIVE` aparecer como `#0100` no Editor, usar `100` em comandos 121/111 e scripts." | Dump do CE 5 mostra `SW_RACE_ACTIVE` e variáveis nos IDs da tabela |
| `task-3.2` | Não exigia auditoria de scripts inline após correção de IDs | Scripts continuavam escrevendo `VAR_SCENE_TYPE/P_CENA` em IDs errados | Incluir busca obrigatória por scripts | "Após gerar `EV_RaceRenderer`, buscar em `CommonEvents.json`: `value(` e `setValue(`. Confirmar que todos os IDs JS batem com a tabela real." | `rg "value\\(|setValue\\(" CommonEvents.json` mostra só IDs corretos |
| `task-3.2` | Critério de aceitação não incluía `switchId` do CE paralelo | Renderer podia ficar condicionado por switch vazio | Adicionar check objetivo | "Validar: CE 7 possui `trigger: 2` e `switchId` igual ao ID real de `SW_RACE_ACTIVE`." | Dump Python de CE 7 |
| `task-3.5` | Autorun de mapa não estava ligado ao contrato real de IDs | `Map001` escreveu `VAR_RACE_ID` no ID errado | Adicionar check do primeiro comando do evento | "Validar que `Init Corrida` seta o ID real de `VAR_RACE_ID = 1` antes de chamar `EV_RaceOrchestrator`." | Dump Python de `Map001.json` |

### 9.4 Problemas fora do escopo dos artefatos

| Problema observado | Por que está fora do escopo dos artefatos | Como tratar | Ação |
|---|---|---|---|
| Tentativa Playwright não avançou da title screen | Limitação operacional da ferramenta usada na sessão, não falha do plano de jogo | Evitar browser para validar esse tipo de playtest sem automação de input | Proteção operacional: preferir checks JSON + playtest do usuário |
| Interrupção do usuário durante Playwright | Controle normal da sessão pelo usuário | Retomar do último ponto útil e limpar processos/artefatos | Nenhuma alteração de especificação |
| Screenshot temporário criado | Efeito colateral operacional | Limpar antes do final | Nenhuma alteração de especificação |

### 9.5 Matriz de rastreabilidade das melhorias

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|---|---|---|---|---|
| IDs planejados não batiam com IDs reais | Falta de snapshot de `System.json` como fonte de verdade | Análise técnica | Documentar tabela real e regra de validação | Alta |
| Scripts inline continuavam errados | Auditoria de IDs focada nos comandos visuais | Análise técnica + task | Exigir busca `value/setValue` | Alta |
| CE paralelo condicionado por switch vazio/errado | Plano não validava `switchId` contra tabela real | Task | Check explícito de `trigger` e `switchId` | Alta |
| Autorun escrevia variável errada | Task de mapa não validava contrato de IDs | Task | Check do primeiro comando do evento | Alta |
| Gerador podia reintroduzir erro | Correção manual sem atualizar fonte geradora | Plano | Corrigir gerador antes do JSON | Alta |
| Tentativa Playwright improdutiva | Estratégia operacional da LLM | Fora do escopo | Evitar automação browser sem input/evaluate | Média |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Adicionar seção "Fonte de verdade de IDs":

```md
### Fonte de verdade de IDs no RPG Maker MZ

Antes de implementar ou debugar Common Events, extrair do `System.json` a tabela
real de `variables` e `switches`. Não confiar apenas na numeração descrita no
plano. O número exibido pelo Editor (`#0100 Nome`) deve bater com o número usado
nos parâmetros JSON dos comandos 111/121/122 e nos scripts inline.

Auditar também todos os usos JS:
- `$gameVariables.value(ID)`
- `$gameVariables.setValue(ID, ...)`
- `$gameSwitches.value(ID)`
- `$gameSwitches.setValue(ID, ...)`

O seletor visual do Editor não corrige IDs dentro de scripts inline.
```

Adicionar seção "Diagnóstico de HUD sem cena":

```md
### Diagnóstico: apenas HUD/barra renderiza

Se apenas a barra de Consciência aparecer:
1. Confirmar que o CE renderer paralelo tem `trigger = 2` e `switchId` igual ao
   ID real de `SW_RACE_ACTIVE`.
2. Confirmar que o Orchestrator liga `SW_RACE_ACTIVE` depois de `EV_Preload`.
3. Confirmar que o renderer compara `VAR_SCENE_INDEX != VAR_LAST_RENDERED_INDEX`.
4. Confirmar que scripts inline escrevem `VAR_SCENE_TYPE` e `VAR_P_CENA` nos IDs reais.
5. Confirmar que o autorun inicializa `VAR_RACE_ID` no ID real.
```

#### Patch sugerido para o plano de implementação

Adicionar aos pré-passos da Fase 3:

```md
- Gerar snapshot de IDs reais a partir de `System.json`:
  - imprimir `variables[95:115]` e `switches[95:110]`;
  - usar essa tabela como fonte de verdade para comandos MZ e scripts inline;
  - se a tabela divergir do plano, atualizar o script gerador antes de gerar JSON.
```

Adicionar à estratégia de manutenção/debug:

```md
- Se existir script gerador para Common Events, corrigir primeiro o gerador,
  depois regenerar o JSON. Não corrigir apenas o JSON gerado.
- Se a automação de navegador parar na title screen, encerrar validação automatizada
  nos checks de JSON e usar playtest MZ do usuário como validação visual final.
```

#### Patch sugerido para as tasks da fase executada

**task-3.1.md**

```md
Pré-check obrigatório: obter IDs reais de `System.json`. Se o Editor mostrar
`#0100 SW_RACE_ACTIVE`, usar `100` nos comandos JSON e scripts, mesmo que o plano
anterior mencione `101`.

Critério de aceitação adicional:
- `EV_RaceOrchestrator` zera/inicializa apenas os IDs reais de
  `VAR_CONSCIENCIA`, `VAR_PONTOS_GLORIA`, `VAR_SCENE_INDEX`,
  `VAR_LAST_RENDERED_INDEX`, `VAR_ATTEMPT_N`, `VAR_RACE_N_CENAS` e `VAR_SEED`.
- `SW_RACE_ACTIVE` é ligado após `EV_Preload`.
```

**task-3.2.md**

```md
Critérios de aceitação adicionais:
- CE `EV_RaceRenderer` tem `trigger: 2` e `switchId` igual ao ID real de
  `SW_RACE_ACTIVE`.
- O primeiro guarda checa `SW_RACE_ACTIVE is OFF`.
- A detecção de mudança usa `VAR_SCENE_INDEX != VAR_LAST_RENDERED_INDEX`.
- A renderização ramifica por `VAR_SCENE_TYPE`, não por `VAR_P_CENA`.
- A configuração do timer ramifica por `VAR_SCENE_TYPE`, não por `VAR_P_CENA`.
- Rodar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` e conferir
  que todos os IDs em scripts inline batem com a tabela real de `System.json`.
```

**task-3.5.md**

```md
Critério de aceitação adicional:
- O evento autorun `Init Corrida` seta o ID real de `VAR_RACE_ID = 1` antes de
  chamar `EV_RaceOrchestrator`.
```

#### Ações fora do fluxo de especificação

- Evitar Playwright/browser para validar essa fase enquanto não houver automação de input capaz de iniciar "Novo Jogo".
- Manter um comando utilitário ou snippet Python para imprimir rapidamente a tabela real de IDs e os comandos críticos de CE 5/7.

## 10. Checklist operacional

1. [ ] Extrair `variables[95:115]` e `switches[95:110]` de `System.json`.
2. [ ] Tratar essa tabela como fonte de verdade para comandos MZ e scripts inline.
3. [ ] Verificar CE 7: `trigger = 2`, `switchId = ID real de SW_RACE_ACTIVE`.
4. [ ] Verificar Orchestrator: `SW_RACE_ACTIVE` liga depois de `EV_Preload`.
5. [ ] Verificar Renderer: compara `SCENE_INDEX != LAST_RENDERED_INDEX`.
6. [ ] Buscar `value(` e `setValue(` em `CommonEvents.json` e no gerador.
7. [ ] Corrigir `build_phase3_ces.py` antes de regenerar `CommonEvents.json`.
8. [ ] Verificar `Map001` autorun: `VAR_RACE_ID = 1` no ID real.
9. [ ] Rodar `python3 -m json.tool` nos JSONs editados.
10. [ ] Encerrar somente após checks críticos passarem e playtest MZ confirmar renderização.
