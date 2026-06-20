# Retrospectiva técnica: throttle configurável para logs por frame

## 1. Resumo da tarefa

O usuário solicitou reduzir a poluição visual dos logs na tela de vitória/derrota, sem remover o log por frame necessário para diagnosticar se o loop `WAIT_INPUT` continua vivo. O resultado solicitado era adicionar parâmetros no plugin `Jhonny_RaceHelper` para habilitar/desabilitar logs emitidos a cada frame e configurar o intervalo de emissão, com default de 5 segundos.

Foi entregue:

- `Jhonny/js/plugins/Jhonny_RaceHelper.js`: novos parâmetros `EnableFrameDebugLogs` e `FrameDebugLogIntervalSeconds`; nova API global `JhonnyRace.logFrameDebug(type, payload)` com throttle por tipo de log.
- `Jhonny/js/plugins.js`: parâmetros ativos do plugin atualizados com defaults `true` e `5`.
- `Jhonny/data/CommonEvents.json`: o log direto `console.log('RACE_WAIT_INPUT', ...)` foi substituído por `JhonnyRace.logFrameDebug('RACE_WAIT_INPUT', ...)`.
- `Jhonny/planos/003-bug-fix-round1/fase1/build_phase1_debug_patch.py`: constante do log atualizada para manter idempotência e evitar reintrodução do `console.log` bruto.

Critério de sucesso: o usuário confirmou manualmente que funcionou. Validações locais também passaram: `node -c` no plugin, `python3 -m json.tool` no `CommonEvents.json`, `python3 -m py_compile` no patcher, e execução idempotente do patcher com `No changes needed`.

Arquivos e tecnologias relevantes: RPG Maker MZ, plugin JavaScript `Jhonny_RaceHelper`, `js/plugins.js` como fonte de parâmetros carregados em runtime, comandos JSON de Common Events e patcher Python da fase 1.

## 2. Decisões técnicas e inferências

### Decisão ou inferência: criar parâmetros específicos para logs por frame, sem reutilizar apenas `EnableDebugLogs`

- **Motivo:** o usuário pediu controle específico para logs emitidos todo frame; `EnableDebugLogs` já existia, mas desligaria logs úteis não repetitivos, como `RACE_CONTINUE_INPUT` e logs estruturados.
- **Evidência disponível:** `Jhonny_RaceHelper.js` já tinha `EnableDebugLogs`; o problema reportado era especificamente a frequência de `RACE_WAIT_INPUT`.
- **Resultado:** funcionou.
- **Avaliação:** necessária.
- **Melhoria futura:** a task poderia declarar explicitamente que `EnableDebugLogs` deve continuar controlando logs globais e que logs de loop devem ter controle separado.

### Decisão ou inferência: implementar throttle no plugin, não no Common Event

- **Motivo:** o usuário pediu "usando parametros no plugin"; o Common Event não é bom local para parse de configuração e controle de último frame logado.
- **Evidência disponível:** o log por frame estava em `CommonEvents.json`, mas a configuração solicitada era do plugin `Jhonny_RaceHelper`.
- **Resultado:** funcionou.
- **Avaliação:** necessária.
- **Melhoria futura:** documentar no artefato técnico que logs repetitivos devem passar por uma API única do plugin, não por `console.log` direto em Common Events.

### Decisão ou inferência: usar intervalo em segundos convertido para frames assumindo 60 FPS

- **Motivo:** o usuário pediu intervalo em tempo ("a cada 5 segundos"), mas o loop opera por frame e `Graphics.frameCount` já estava disponível.
- **Evidência disponível:** os logs e o CE usavam `Graphics.frameCount`; RPG Maker MZ normalmente opera a 60 FPS.
- **Resultado:** funcionou para o objetivo prático.
- **Avaliação:** necessária, mas depende de uma suposição técnica.
- **Melhoria futura:** se for importante precisão temporal real, usar timestamp/milisegundos em vez de `seconds * 60`. Para debug de MZ, frame count é suficiente.

### Decisão ou inferência: atualizar `js/plugins.js` além do header do plugin

- **Motivo:** em RPG Maker MZ, declarar `@param` no header torna o parâmetro disponível no editor, mas runtime lê valores ativos em `js/plugins.js`.
- **Evidência disponível:** busca local mostrou `Jhonny/js/plugins.js` com `"EnableDebugLogs": "true"`; `System.json` não continha o plugin.
- **Resultado:** funcionou.
- **Avaliação:** necessária para o default valer imediatamente no projeto.
- **Melhoria futura:** sempre verificar `js/plugins.js` quando alterar parâmetros de plugin MZ.

### Decisão ou inferência: manter o patcher da fase atualizado

- **Motivo:** scripts da fase podem ser reexecutados; se o patcher mantivesse o `console.log` antigo, a alteração seria revertida parcialmente.
- **Evidência disponível:** `build_phase1_debug_patch.py` continha a constante `WAIT_DEBUG_LOG` com `console.log('RACE_WAIT_INPUT', ...)`.
- **Resultado:** funcionou; execução do patcher retornou `No changes needed`.
- **Avaliação:** necessária para idempotência.
- **Melhoria futura:** toda mudança em `CommonEvents.json` gerada por script deve atualizar o script fonte correspondente na mesma execução.

## 3. Uso de ferramentas, comandos e scripts

### `rg -n "RACE_WAIT_INPUT|logRaceEvent|..." ...`

- **Objetivo específico:** localizar pontos de log por frame, APIs do plugin e scripts geradores/patchers relacionados.
- **Por que foi necessário:** identificar a origem exata do log repetitivo.
- **Resultado obtido:** `RACE_WAIT_INPUT` estava como `console.log` direto em CE 19; `Jhonny_RaceHelper.js` já tinha `EnableDebugLogs`; patcher da fase tinha a constante do log.
- **Contribuiu diretamente:** sim.
- **Abordagem mais simples:** poderia ter sido uma busca mais curta apenas por `RACE_WAIT_INPUT`.
- **Como evitar redundância:** começar com `rg -n "RACE_WAIT_INPUT"` e expandir só se necessário.

### `sed -n` / `nl -ba` em `Jhonny_RaceHelper.js`, `CommonEvents.json`, patcher e `plugins.js`

- **Objetivo específico:** ler trechos próximos aos pontos de alteração.
- **Por que foi necessário:** aplicar patches pequenos sem ler arquivos inteiros.
- **Resultado obtido:** confirmou estrutura do header do plugin, parse de parâmetros, API global e formato do script no CE 19.
- **Contribuiu diretamente:** sim.
- **Abordagem mais simples:** parte da leitura do `git diff` anterior poderia ter sido evitada, pois alguns trechos já estavam no contexto.
- **Como evitar redundância:** ler só `plugins.js`, o topo do plugin e o bloco do CE 19.

### `node -e "const s=require('./Jhonny/data/System.json')..."`

- **Objetivo específico:** verificar se `System.json` continha parâmetros do plugin.
- **Por que foi necessário:** havia uma hipótese de que os parâmetros ativos poderiam estar em `System.json`.
- **Resultado obtido:** nenhum plugin `Jhonny_RaceHelper` em `System.json`.
- **Contribuiu diretamente:** parcialmente; ajudou a descartar uma fonte incorreta.
- **Abordagem mais simples:** `rg -n "Jhonny_RaceHelper|EnableDebugLogs" Jhonny/js Jhonny/data` teria encontrado `plugins.js` diretamente.
- **Como evitar redundância:** em projetos RPG Maker MZ, verificar primeiro `js/plugins.js`.

### `apply_patch`

- **Objetivo específico:** editar o plugin, Common Event, `plugins.js`, patcher e criar esta retrospectiva.
- **Por que foi necessário:** ferramenta adequada para edições manuais controladas.
- **Resultado obtido:** alterações aplicadas sem sobrescrever mudanças não relacionadas.
- **Contribuiu diretamente:** sim.
- **Abordagem mais simples:** não.
- **Como evitar redundância:** agrupar patches relacionados quando o contexto já estiver claro.

### Validações: `node -c`, `python3 -m json.tool`, `python3 -m py_compile`

- **Objetivo específico:** validar sintaxe JavaScript, JSON e Python.
- **Por que foi necessário:** alterações tocaram runtime JS, JSON de dados do RPG Maker e script Python.
- **Resultado obtido:** todos passaram.
- **Contribuiu diretamente:** sim.
- **Abordagem mais simples:** não recomendada; são validações rápidas e de alto valor.
- **Como evitar redundância:** manter exatamente essas três quando os mesmos tipos de arquivo forem alterados.

### Execução de `build_phase1_debug_patch.py`

- **Objetivo específico:** confirmar idempotência do patcher após atualizar `WAIT_DEBUG_LOG`.
- **Por que foi necessário:** garantir que reexecutar o patcher não recria o log bruto.
- **Resultado obtido:** `No changes needed`.
- **Contribuiu diretamente:** sim.
- **Abordagem mais simples:** inspeção textual da constante ajudaria, mas não validaria comportamento idempotente.
- **Como evitar redundância:** rodar uma vez após alterar patchers; não repetir se saída for idempotente.

### `find ... __pycache__` e `rm -rf .../__pycache__`

- **Objetivo específico:** remover cache criado pelo `py_compile`.
- **Por que foi necessário:** evitar artefato temporário no worktree.
- **Resultado obtido:** cache removido.
- **Contribuiu diretamente:** sim, para higiene do repositório.
- **Abordagem mais simples:** usar `PYTHONDONTWRITEBYTECODE=1 python3 -m py_compile ...` evitaria criar cache.
- **Como evitar redundância:** usar `PYTHONDONTWRITEBYTECODE=1` por padrão em validações Python quando não quiser `__pycache__`.

## 4. Intervenções e correções do usuário

### Intervenção: "FUNCIONOU"

- **Tipo:** confirmação de validação manual.
- **O que estava incorreto/incompleto antes:** nada confirmado como incorreto; faltava validação no runtime do RPG Maker.
- **Suposição ou interpretação causadora:** não aplicável.
- **Como a execução mudou:** encerrou a tarefa como concluída.
- **Regra reutilizável:** para mudanças em Common Events e plugins MZ, considerar sucesso final somente após playtest manual ou evidência equivalente do runtime.

Não houve correções do usuário durante esta tarefa. A solicitação inicial já indicava causa, restrição e comportamento esperado de forma suficiente.

## 5. Análise de desperdício

### Busca mais ampla que o necessário

- **O que aconteceu:** a busca inicial incluiu muitos padrões (`logRaceEvent`, `WAIT_INPUT`, latch etc.) e várias pastas.
- **Impacto estimado:** baixo.
- **Causa:** reaproveitamento do contexto do bug anterior em vez de focar primeiro no log específico.
- **Como evitar:** começar por `rg -n "RACE_WAIT_INPUT"`; só buscar `EnableDebugLogs` e scripts após localizar a origem.

### Verificação inicial de `System.json`

- **O que aconteceu:** foi usado um comando Node para procurar o plugin em `System.json`, que não era a fonte correta dos parâmetros ativos.
- **Impacto estimado:** baixo.
- **Causa:** incerteza sobre onde o projeto armazenava parâmetros de plugin.
- **Como evitar:** em RPG Maker MZ, buscar primeiro em `js/plugins.js`.

### Leitura de `git diff` com alterações acumuladas da tarefa anterior

- **O que aconteceu:** o diff mostrou também mudanças pré-existentes do conserto do loop de vitória, aumentando ruído.
- **Impacto estimado:** médio.
- **Causa:** worktree já continha alterações não commitadas da tarefa anterior.
- **Como evitar:** usar buscas localizadas e diff restrito por linhas/padrões; ao revisar, separar mentalmente o que já existia do que foi alterado na tarefa atual.

### Atualização não necessária de `build_phase6_ces.py`

- **O que aconteceu:** a fase 6 foi lida para contexto, mas não precisou ser alterada para esta tarefa.
- **Impacto estimado:** baixo.
- **Causa:** cautela por causa de scripts geradores antigos.
- **Como evitar:** atualizar apenas o patcher que de fato contém `RACE_WAIT_INPUT`; ler outros geradores só se `rg` mostrar o mesmo log neles.

## 6. Caminho mínimo recomendado

1. **Ação:** localizar o log repetitivo.
   **Entrada necessária:** nome do log visto pelo usuário, aqui `RACE_WAIT_INPUT`.
   **Ferramenta:** `rg -n "RACE_WAIT_INPUT" Jhonny`.
   **Resultado esperado:** encontrar o script no CE 19 e o patcher que o gera.
   **Critério para seguir:** origem do log e script fonte identificados.

2. **Ação:** verificar parâmetros existentes do plugin e fonte runtime.
   **Entrada necessária:** nome do plugin `Jhonny_RaceHelper`.
   **Ferramenta:** `sed` no topo do plugin e `rg -n "Jhonny_RaceHelper|EnableDebugLogs" Jhonny/js`.
   **Resultado esperado:** confirmar `EnableDebugLogs` e `js/plugins.js`.
   **Critério para seguir:** saber onde declarar `@param` e onde inserir valores ativos.

3. **Ação:** adicionar API `logFrameDebug(type, payload)` no plugin.
   **Entrada necessária:** comportamento desejado: enable/disable e intervalo default 5 segundos.
   **Ferramenta:** `apply_patch`.
   **Resultado esperado:** parâmetros `EnableFrameDebugLogs`, `FrameDebugLogIntervalSeconds`, parse defensivo, throttle por tipo.
   **Critério para seguir:** API exposta em `window.JhonnyRace`.

4. **Ação:** substituir `console.log('RACE_WAIT_INPUT', ...)` por chamada à API.
   **Entrada necessária:** payload atual do log.
   **Ferramenta:** `apply_patch`.
   **Resultado esperado:** CE 19 chama `JhonnyRace.logFrameDebug('RACE_WAIT_INPUT', payload)`.
   **Critério para seguir:** não há `console.log('RACE_WAIT_INPUT'...)` em `CommonEvents.json`.

5. **Ação:** atualizar fontes idempotentes.
   **Entrada necessária:** patcher que contém `WAIT_DEBUG_LOG`.
   **Ferramenta:** `apply_patch`.
   **Resultado esperado:** patcher gera a nova chamada throttled.
   **Critério para seguir:** executar patcher retorna `No changes needed`.

6. **Ação:** validar.
   **Entrada necessária:** arquivos alterados.
   **Ferramenta:** `node -c`, `python3 -m json.tool`, `PYTHONDONTWRITEBYTECODE=1 python3 -m py_compile`, execução do patcher.
   **Resultado esperado:** todas as validações passam.
   **Critério para encerrar:** usuário confirma em playtest que logs aparecem no intervalo configurado e a tela continua funcionando.

## 7. Conhecimento reutilizável

### Fatos confirmados

- `Jhonny_RaceHelper.js` já tinha `EnableDebugLogs`, mas ele é global.
- Parâmetros ativos do plugin no runtime estão em `Jhonny/js/plugins.js`.
- `System.json` não continha o plugin `Jhonny_RaceHelper` nesta sessão.
- `RACE_WAIT_INPUT` era emitido por script direto em `CommonEvents.json`, CE 19.
- `build_phase1_debug_patch.py` continha a constante `WAIT_DEBUG_LOG` e precisava acompanhar a alteração.
- `Graphics.frameCount` está disponível no contexto do log e foi usado para throttle.

### Preferências do usuário

- O usuário quer manter logs úteis de diagnóstico, mas sem poluir o console em todo frame.
- Prefere controles via parâmetros do plugin quando a configuração é de debug/runtime.
- Validação manual em playtest é parte normal do fluxo.

### Restrições técnicas

- Em RPG Maker MZ, declarar `@param` no plugin não basta para alterar o valor ativo já salvo; `js/plugins.js` precisa conter os parâmetros.
- Common Events em JSON podem chamar scripts JS, mas lógica configurável deve ficar no plugin quando possível.
- Scripts patchers precisam permanecer idempotentes, porque podem ser reexecutados.

### Armadilhas conhecidas

- Trocar apenas o header do plugin deixa o editor ciente do parâmetro, mas pode não alterar o runtime atual.
- Deixar `console.log` direto no CE 19 ignora qualquer configuração do plugin.
- Atualizar `CommonEvents.json` sem atualizar o patcher permite regressão futura ao reexecutar scripts.
- Diffs em worktree sujo podem misturar alterações da tarefa atual com mudanças anteriores.

### Heurísticas recomendadas

- Para logs repetitivos, centralizar throttle no plugin e usar um `type` como chave.
- Para debug em loops por frame, logar a primeira ocorrência imediatamente e depois aplicar intervalo.
- Para parâmetros de tempo em MZ, `segundos * 60` é suficiente para debug baseado em frame count.
- Após alterar patchers, sempre executar uma vez para provar idempotência.

## 8. Informações que deveriam estar no prompt inicial

- **Útil:** nome exato do log a ser controlado (`RACE_WAIT_INPUT`). O contexto permitiu inferir, mas explicitá-lo reduziria busca.
- **Útil:** confirmar se `EnableDebugLogs` deveria permanecer como master switch global. Foi inferido pelo estado do plugin.
- **Útil:** confirmar se o intervalo deveria usar frames ou tempo real. A implementação usou frame count.
- **Opcional:** informar se o default deveria ser `true` para logs por frame ou se deveria vir desabilitado. O pedido só fixou default do intervalo; a implementação manteve habilitado para preservar diagnóstico.

Nenhuma informação ausente era obrigatória; a tarefa tinha escopo técnico suficiente.

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

#### Melhoria: documentar fonte runtime dos parâmetros de plugin MZ

- **Problema observado durante a execução:** houve verificação desnecessária em `System.json` antes de encontrar `js/plugins.js`.
- **Informação ausente ou incorreta:** a análise técnica não destacava que parâmetros ativos de plugin ficam em `Jhonny/js/plugins.js`.
- **Por que pertence à análise técnica:** é uma propriedade estrutural do projeto/RPG Maker MZ, não uma instrução específica desta task.
- **Seção sugerida:** `Restrições técnicas / RPG Maker MZ`.
- **Texto sugerido:** "Parâmetros ativos de plugins MZ são carregados de `Jhonny/js/plugins.js`. Ao adicionar `@param` em um plugin já instalado, atualizar também a entrada correspondente em `plugins.js` para que o runtime use os novos defaults sem depender do editor."
- **Impacto esperado:** evita buscas em arquivos incorretos e falhas em que o parâmetro existe no header mas não funciona no playtest.

#### Melhoria: proibir `console.log` direto em Common Events para logs repetitivos

- **Problema observado durante a execução:** `RACE_WAIT_INPUT` estava hardcoded no CE 19, sem controle por configuração.
- **Informação ausente ou incorreta:** não havia contrato indicando que logs de loop devem passar pelo helper.
- **Por que pertence à análise técnica:** define responsabilidade arquitetural entre Common Events e plugin.
- **Seção sugerida:** `Contratos entre Common Events e Jhonny_RaceHelper`.
- **Texto sugerido:** "Logs emitidos em loops por frame não devem usar `console.log` direto em Common Events. Eles devem chamar uma API do `Jhonny_RaceHelper` que aplique enable/disable e throttle configuráveis."
- **Impacto esperado:** reduz retrabalho e impede nova poluição do console.

### 9.2 Melhorias no plano de implementação

#### Melhoria: incluir checkpoint de fonte idempotente para alterações em Common Events

- **Problema observado durante a execução:** foi necessário lembrar de atualizar o patcher depois de alterar `CommonEvents.json`.
- **Deficiência do plano:** não havia etapa explícita para sincronizar dados gerados e script gerador/patcher.
- **Etapa afetada:** mudanças em Common Events.
- **Alteração recomendada:** adicionar checkpoint "atualizar script fonte e validar idempotência".
- **Texto sugerido:** "Sempre que uma alteração manual tocar `CommonEvents.json`, localizar o script gerador/patcher responsável pelo mesmo trecho, atualizar a fonte e executar o script uma vez para confirmar saída idempotente."
- **Como reduz custo/risco:** evita regressão ao reexecutar fases e torna a alteração reproduzível.

### 9.3 Melhorias nas tasks da fase executada

#### Task afetada: correção/debug do CE 19 `WAIT_INPUT`

- **Informação ausente, ambígua ou incorreta:** o log `RACE_WAIT_INPUT` foi especificado/implantado como `console.log` direto, sem throttling.
- **Consequência observada durante a execução:** console ficou ruim de usar porque o log rodava todo frame.
- **Alteração recomendada:** trocar critério de log direto por API configurável do plugin.
- **Texto sugerido para incluir ou substituir na task:** "O log `RACE_WAIT_INPUT` deve ser emitido por `JhonnyRace.logFrameDebug('RACE_WAIT_INPUT', payload)`, nunca por `console.log` direto. A API deve respeitar parâmetros do plugin para habilitar/desabilitar logs por frame e intervalo de emissão, com default de 5 segundos."
- **Como validar que a nova instrução é suficiente:** `rg -n "console.log\\('RACE_WAIT_INPUT|RACE_WAIT_INPUT" Jhonny/data/CommonEvents.json Jhonny/planos/003-bug-fix-round1/fase1` deve mostrar apenas chamadas via `logFrameDebug`.

#### Task afetada: manutenção do plugin `Jhonny_RaceHelper`

- **Informação ausente, ambígua ou incorreta:** não havia uma API reutilizável para logs repetitivos.
- **Consequência observada durante a execução:** a primeira implementação de debug ficou no CE, não no plugin.
- **Alteração recomendada:** adicionar requisito para logs de diagnóstico de alta frequência.
- **Texto sugerido para incluir ou substituir na task:** "Adicionar ao `Jhonny_RaceHelper` uma API `logFrameDebug(type, payload)` com throttle por `type`. A API deve respeitar `EnableDebugLogs`, `EnableFrameDebugLogs` e `FrameDebugLogIntervalSeconds`."
- **Como validar que a nova instrução é suficiente:** console mostra `RACE_WAIT_INPUT` no máximo uma vez por intervalo configurado, e `EnableFrameDebugLogs=false` suprime o log.

### 9.4 Problemas fora do escopo dos artefatos

#### Problema observado: validação final dependeu de playtest manual

- **Por que fora do escopo:** o comportamento visual/log de runtime do RPG Maker MZ não foi automatizado nesta tarefa.
- **Como deveria ser tratado:** manter validações estáticas locais e solicitar/aguardar confirmação manual quando o usuário está debugando no editor/playtest.
- **Proteção operacional:** nenhuma automação obrigatória para esta tarefa; se o fluxo crescer, considerar teste de runtime separado.

#### Problema observado: diff contaminado por mudanças anteriores não commitadas

- **Por que fora do escopo:** condição operacional do worktree, não falha da especificação desta task.
- **Como deveria ser tratado:** usar `git diff -- <arquivos>` e buscas localizadas; não reverter mudanças anteriores.
- **Proteção operacional:** nenhuma alteração nos artefatos; manter disciplina de não tratar todo diff como parte da tarefa atual.

### 9.5 Matriz de rastreabilidade das melhorias

| **Problema observado** | **Causa principal** | **Artefato responsável** | **Alteração necessária** | **Prioridade** |
|---|---|---|---|---|
| Verificação desnecessária em `System.json` | Fonte runtime de plugin não documentada | Análise técnica | Documentar `js/plugins.js` como fonte ativa de parâmetros | Média |
| `RACE_WAIT_INPUT` poluiu console em todo frame | Log direto em Common Event sem throttle | Análise técnica / task | Exigir API de plugin para logs repetitivos | Alta |
| Risco de patcher recriar log antigo | Falta de checkpoint de idempotência em alterações de CE | Plano / task | Atualizar patcher e executar idempotência sempre que CE for alterado | Alta |
| Validação final dependeu do usuário | Runtime MZ não automatizado | Fora do escopo | Tratar como playtest manual necessário | Baixa |
| Diff com mudanças anteriores | Worktree já tinha alterações acumuladas | Fora do escopo | Usar buscas/diffs restritos e não reverter trabalho não relacionado | Média |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

Adicionar em `Restrições técnicas / RPG Maker MZ`:

```md
Parâmetros ativos de plugins MZ são carregados de `Jhonny/js/plugins.js`.
Ao adicionar `@param` em um plugin já instalado, atualizar também a entrada
correspondente em `plugins.js` para que o runtime use os novos defaults sem
depender do editor.
```

Adicionar em `Contratos entre Common Events e Jhonny_RaceHelper`:

```md
Logs emitidos em loops por frame não devem usar `console.log` direto em Common
Events. Eles devem chamar uma API do `Jhonny_RaceHelper` que aplique
enable/disable e throttle configuráveis.
```

#### Patch sugerido para o plano de implementação

Adicionar checkpoint em etapas que alteram Common Events:

```md
Sempre que uma alteração manual tocar `CommonEvents.json`, localizar o script
gerador/patcher responsável pelo mesmo trecho, atualizar a fonte e executar o
script uma vez para confirmar saída idempotente.
```

#### Patch sugerido para as tasks da fase executada

Task CE 19 `WAIT_INPUT`:

```md
O log `RACE_WAIT_INPUT` deve ser emitido por
`JhonnyRace.logFrameDebug('RACE_WAIT_INPUT', payload)`, nunca por `console.log`
direto. A API deve respeitar parâmetros do plugin para habilitar/desabilitar logs
por frame e intervalo de emissão, com default de 5 segundos.
```

Task `Jhonny_RaceHelper`:

```md
Adicionar ao `Jhonny_RaceHelper` uma API `logFrameDebug(type, payload)` com
throttle por `type`. A API deve respeitar `EnableDebugLogs`,
`EnableFrameDebugLogs` e `FrameDebugLogIntervalSeconds`.
```

#### Ações fora do fluxo de especificação

- Manter playtest manual como critério final quando a alteração envolve console/runtime do RPG Maker MZ.
- Em worktree com alterações acumuladas, usar diffs restritos por arquivo e preservar mudanças anteriores não relacionadas.

## 10. Checklist operacional

- [ ] Localizar primeiro o log específico com `rg -n "RACE_WAIT_INPUT"`.
- [ ] Verificar `Jhonny/js/plugins.js` ao adicionar parâmetros de plugin.
- [ ] Não usar `console.log` direto em Common Events para logs de loop.
- [ ] Centralizar throttling em `Jhonny_RaceHelper.logFrameDebug`.
- [ ] Preservar `EnableDebugLogs` como controle global e criar parâmetro específico para logs por frame.
- [ ] Atualizar `CommonEvents.json` e o patcher/gerador correspondente.
- [ ] Rodar `node -c` no plugin.
- [ ] Rodar `python3 -m json.tool` no JSON alterado.
- [ ] Rodar o patcher uma vez para confirmar idempotência.
- [ ] Encerrar só após playtest confirmar que o console ficou legível e o fluxo continua funcionando.
