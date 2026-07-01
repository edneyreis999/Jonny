---
title: "Loki Init - Tools Pipeline Engineer Inventory"
tipo: "inventario de pipeline"
status: "parcial"
tags:
  - loki-init
  - tools-pipeline-engineer
  - rpg-maker-mz
  - scripts
---

# Loki Init - Tools Pipeline Engineer Inventory

Data: 2026-06-30
Agente: tools-pipeline-engineer
Escopo: scripts, automacoes, import/export, validadores, geradores, ferramentas
historicas e gates para uso futuro em `/Users/edney/projects/coreto/summer26`.

## Status

Inventario factual estatico. Nenhum script historico foi executado. Nenhum
arquivo de runtime, plano historico, data JSON, plugin, asset, save, `.agents`,
`.codex`, `.claude`, `AGENTS.md`, `CLAUDE.md` ou `docs/index.xml` foi alterado.

Evidencia usada:

- `editor-structural` para a forma de projeto RPG Maker MZ declarada nos docs
  comuns do init e em `Jhonny/CLAUDE.md`.
- `static-risk` para classificacao de scripts por path, cabecalho, constantes
  de destino, chamadas de escrita e asserts.
- `runtime-pending` para qualquer efeito em jogo, Common Events, input, audio,
  pictures, transfers, save/load ou deploy.

## Fontes Lidas

Fontes duradouras e de contexto:

- `docs/loki-init/project-inventory.md`.
- `docs/loki-init/technology-context.md`.
- `docs/index.xml`.
- `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md`.
- `Jhonny/CLAUDE.md`.
- `Jhonny/package.json`.
- Contrato de inventario do `loki:init`.
- Skill `loki-rpg-maker-mz-project-inventory` e checklist core, em modo
  focado em pipeline scripts.
- Skill `loki-retrospectiva-tecnica`, para a retrospectiva propria.

Fontes de pipeline inspecionadas estaticamente:

- Listagem de `Jhonny/scripts/**`.
- Listagem de `Jhonny/planos/**`.
- Cabecalhos e padroes estaticos selecionados de scripts Python em
  `Jhonny/scripts/**` e `Jhonny/planos/**`.

Nao lido em profundidade:

- Corpos completos de todos os scripts Python; a classificacao e baseada em
  cabecalhos, constantes de destino, chamadas de escrita e nomes.
- `Jhonny/data/*.json`, `Jhonny/js/plugins/**`, assets e saves, fora do
  inventario comum ja produzido por outros agentes.
- Historico Git por script; exigido apenas antes de reuso futuro.
- Execucao de validators, Playtest, export, build ou scripts de plano.

## Mapa de Localizacao

| Superficie | Localizacao | Fato atual |
| --- | --- | --- |
| App shell | `Jhonny/package.json` | Declara `main: index.html`, janela 1280x720 e titulo `Bye Bye Jhonny`; nao declara `scripts`, dependencias ou comandos npm. |
| Projeto RPG Maker MZ | `Jhonny/` | Projeto real; runtime sensivel e fora do escopo de escrita deste init. |
| Procedimento de scripts historicos | `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md` | Fonte duradoura para classificar e aprovar reuso de scripts em `Jhonny/planos/`. |
| Scripts locais soltos | `Jhonny/scripts/` | Um script Python encontrado: `merge_pr4_data_resolution.py`. |
| Scripts historicos de plano | `Jhonny/planos/**` | 40 scripts Python encontrados por listagem; evidencia historica por padrao. |
| Planos e retrospectivas historicas | `Jhonny/planos/**` | Existem muitos docs de fase, interacoes e retrospectivas; foram tratados como contexto historico/listagem, nao como ferramenta atual. |

## Inventario de Scripts

`find Jhonny/planos Jhonny/scripts -type f -name '*.py'` encontrou 41 scripts
Python:

- 40 sob `Jhonny/planos/**`.
- 1 sob `Jhonny/scripts/**`.

`find Jhonny/planos Jhonny/scripts` nao encontrou scripts `.sh`, `.js`, `.mjs`,
`.ts`, `.rb` ou `.lua` nessas duas superficies.

### Script fora de planos

| Script | Classificacao | Destinos observados | Observacao |
| --- | --- | --- | --- |
| `Jhonny/scripts/merge_pr4_data_resolution.py` | `mutator` | `Jhonny/data/Map001.json`; le `Jhonny/data/System.json` | Cabecalho/padroes mostram escrita de BGM em `Map001.json` e assert de `startMapId == 11`. Exige approval e preflight antes de qualquer uso. |

### Scripts historicos por familia

| Familia | Exemplos | Classificacao | Destinos observados |
| --- | --- | --- | --- |
| Geradores de Common Events por fase | `fase3/build_phase3_ces.py`, `fase4/build_phase4_ces.py`, `fase5/build_phase5_ces.py`, `fase6/build_phase6_ces.py`, `fase7/build_phase7_ces.py` | `historical-generator` e `mutator` | `Jhonny/data/CommonEvents.json`. |
| Setup de System.json por fase | `fase4/setup_phase4_system.py`, `fase5/setup_phase5_system.py`, `fase6/setup_phase6_system.py` | `mutator` | `Jhonny/data/System.json`. |
| Patches cirurgicos de Common Events | `apply_task_5_6.py`, `003-bug-fix-round1/builds/build_phase*.py`, `interaction/fase*/build_phase*.py`, `005/.../fase5/*.py` | `mutator` | Principalmente `Jhonny/data/CommonEvents.json`. |
| Debug/probe de Common Events | `inject_debug_logs.py`, `inject_debug_logs_v2.py`, `remove_debug_logs.py` | `cleanup/debug utility` e `mutator` | `Jhonny/data/CommonEvents.json`; insere/remove `console.log`, SE diagnostico e comandos de script. |
| Patches de mapas de integracao | `005/.../fase1/01_fix_map001_race_containment.py`, `02_add_map001_init_erase_event.py`, `fase2/01_wire_map010_race1_entry.py`, `02_wire_map005_race2_entry.py`, `fase4/02_patch_map013_race3_markers.py` | `mutator` | `Jhonny/data/Map001.json`, `Map005.json`, `Map010.json`, `Map013.json`. |
| Restauracao/formato de JSON | `005/.../fase2/03_restore_map_json_formatting.py`, `fase5/02_restore_common_events_indent.py` | `cleanup/debug utility` e `mutator` | Map JSONs e `CommonEvents.json`; risco de diff ruidoso se estado atual divergir. |
| Auditorias e validadores de integracao | `005/.../fase4/00_audit_defeat_retry_bootstrap.py`, `01_audit_map013_race3_markers.py`, `03_validate_race_dialogue_integration.py`, `04_audit_retry_preload_stall.py` | `validator` ou `read-only against runtime`; alguns geram relatorios em plano | Leem `data/*.json`; scripts de auditoria podem escrever relatorios Markdown em `interaction/`. |
| Padronizacao de nome de falante | `006-padronizar-chance-player/builds/01_find_player_name_refs.py`, `02_standardize_player_speaker_to_chance.py` | primeiro: `validator/read-only`; segundo: `mutator` | Leitura de `Map*.json`; escrita em `Map005.json`, `Map006.json`, `Map010.json` no patcher. |
| Joices phase 1 | `006-joices-phase1/apply_joices_phase1.py` | `mutator` | `CommonEvents.json` e `System.json`. |

## Automacao e Import/Export

Fatos observados:

- Nao ha comandos npm de build, lint, test, import ou export em
  `Jhonny/package.json`.
- O projeto e executavel por `index.html` ou servidor local conforme
  `Jhonny/CLAUDE.md`, mas isso e Playtest/runtime, nao pipeline automatizado.
- Os scripts historicos atuam como patchers/geradores de JSON RPG Maker MZ,
  nao como importadores/exportadores genericos.
- Nao foi encontrada superficie atual de export/deploy automatizado nos paths
  permitidos.
- Nao foi encontrada ferramenta atual de conversao de assets nos paths
  permitidos.

Inferencia: a automacao atual documentada e historica, fase-especifica e
orientada a mutar JSON local. Nao existe, nas fontes permitidas, um pipeline
reutilizavel e aprovado para rodar scripts livremente.

## Validadores Candidatos

Validadores candidatos para tarefas futuras, sempre como evidencia estrutural,
nao como prova de comportamento jogavel:

- Parse estruturado dos `data/*.json` afetados antes e depois da mudanca.
- `python3 -m json.tool <arquivo>` ou parse equivalente para arquivos JSON
  alterados.
- Asserts especificos do script, quando revisados e alinhados ao estado atual.
- Diff restrito: `git diff --stat` e diff do arquivo alvo antes de prosseguir.
- Auditoria de command codes para `CommonEvents.json`, especialmente `117`,
  `121`, `122`, `355`, `357`, labels, waits, transfers e terminadores `0`.
- Cross-reference de callers `117` em mapas/Common Events antes de alterar IDs.
- Cross-reference de Plugin Commands `357` quando `TextPicture`,
  `ButtonPicture` ou `Jhonny_RaceHelper` forem afetados.
- `node -c` apenas para plugins JavaScript quando houver edicao futura em
  `js/plugins/**`.
- Checagem de assets referenciados quando scripts alterarem pictures/audio.

Limites dos validators:

- JSON valido nao prova que o editor RPG Maker MZ reconhece a semantica final.
- Asserts antigos podem codificar um snapshot historico e falhar ou, pior,
  passar contra uma premissa defasada.
- Playtest humano continua obrigatorio para input, pictures, audio, Common
  Events paralelos, tela de resultado, retry, transfer, timing e save/load.

## Gates para Uso Futuro de Scripts

Antes de reexecutar qualquer script `mutator`, `historical-generator`,
`cleanup/debug utility` ou `unknown`:

1. Obter approval explicito para o script, destino e objetivo.
2. Carregar `loki-rpg-maker-mz-data-json` para qualquer escrita em
   `Jhonny/data/*.json`.
3. Carregar `loki-rpg-maker-mz-plugin-workflow` se o script tocar
   `Jhonny/js/plugins/**` ou `Jhonny/js/plugins.js`.
4. Reconstruir intencao historica com `git log --follow --stat --patch -- <script>`.
5. Ler tasks, summaries, retros e interaction da mesma fase somente quando
   necessarios para entender a mudanca.
6. Confirmar precondicoes atuais por parser estruturado, incluindo IDs, nomes,
   command slices, callers e terminadores.
7. Preferir dry-run ou auditoria read-only se o script precisar ser adaptado.
8. Declarar rollback: diff reversivel, backup ou plano de restauracao.
9. Executar validators estruturais antes e depois da escrita.
10. Registrar relatorio de patch com arquivos/IDs alterados, comandos
    inseridos/removidos/alterados, validadores, diff esperado e Playtest
    pendente.
11. Exigir human-validation/Playtest antes de declarar comportamento validado.

Scripts `validator` ou auditorias que nao escrevem runtime podem ser candidatos
a reuso com menor risco, mas ainda exigem preflight para confirmar que nao
escrevem arquivos, que a saida e aplicavel ao estado atual e que nenhuma
validacao perceptivel esta sendo afirmada.

## Riscos

- Geradores historicos podem sobrescrever edicoes manuais em
  `CommonEvents.json`, incluindo Plugin Commands, TextPicture, probes ou
  comandos criados depois da fase original.
- Scripts de fase codificam IDs, nomes, posicoes de comandos e slices de lista;
  essas premissas podem estar defasadas.
- Ha risco de conflito de indexacao de `System.json`: alguns cabecalhos
  historicos assumem `variables[N] == Editor ID N`, enquanto a orientacao local
  tambem alerta sobre arrays 0-based. Qualquer script que escreva switches ou
  variaveis deve confirmar o estado real por parser antes de escrever.
- Scripts de debug podem deixar logs, SEs diagnosticos ou probes persistidos no
  runtime se cleanup falhar.
- Reformatadores de JSON podem produzir diffs grandes e ocultar a mudanca real.
- Auditorias que escrevem relatorios em `interaction/` continuam sendo writes
  de plano; nao devem ser executadas em workflow sem destino aprovado.
- Nenhum validator estatico cobre timing, foco de input, carregamento de assets,
  comportamento de plugin, audio, save/load ou percepcao do jogador.

## Open Questions

- Quais scripts historicos devem ser promovidos para validators reutilizaveis,
  se algum?
- O projeto deve manter `Jhonny/scripts/merge_pr4_data_resolution.py` como
  ferramenta atual, ou trata-lo como migracao historica solta?
- Qual e a regra canonica atual para indexacao de switches/variables no
  `System.json` deste projeto: indice igual ao Editor ID ou Editor ID menos 1?
- Existe um procedimento aprovado para export/deploy do jogo alem de abrir
  `index.html` ou servir a pasta localmente?

## Response Contract Snapshot

```yaml
parallel_agent_response:
  agent: "tools-pipeline-engineer"
  mode: "scoped-writer"
  summary: "Inventario estatico de scripts, automacoes, validadores, geradores historicos, import/export e gates de uso futuro produzido sem executar scripts."
  affected_files:
    - "docs/loki-init/tools-pipeline-engineer/inventory.md"
    - "planos/000-init-loki/retrospetivas/fase1/tools-pipeline-engineer-retrospectiva.md"
  write_scope:
    mode: "init_context_scoped_writer"
    target_files:
      - "docs/loki-init/tools-pipeline-engineer/inventory.md"
      - "planos/000-init-loki/retrospetivas/fase1/tools-pipeline-engineer-retrospectiva.md"
    allowed_writes:
      - "docs/loki-init/tools-pipeline-engineer/**"
      - "planos/000-init-loki/retrospetivas/fase1/tools-pipeline-engineer-retrospectiva.md"
    scoped_write_domains:
      - "tools-code"
      - "pipeline-scripts"
      - "validators"
      - "automation-config"
    validators:
      - "static file listing"
      - "selected script header inspection"
      - "no mutating script execution"
    human_gates:
      - "approval before future script execution that writes runtime or plan artifacts"
      - "human-validation before runtime behavior is declared valid"
  affected_runtime_surfaces:
    - "Jhonny/data/CommonEvents.json"
    - "Jhonny/data/System.json"
    - "Jhonny/data/Map*.json"
    - "Jhonny/js/plugins/**"
    - "Jhonny/img/**"
    - "Jhonny/audio/**"
    - "Jhonny/save/**"
  affected_domain_ids:
    - "rpg-maker-mz"
    - "race-common-events"
    - "historical-plan-scripts"
  evidence:
    - "docs/03-Tech/RPG Maker MZ - Scripts de Plano.md"
    - "Jhonny/CLAUDE.md"
    - "Jhonny/package.json"
    - "Jhonny/scripts/** listing"
    - "Jhonny/planos/** Python script listing and selected headers"
  findings:
    - type: "pipeline"
      detail: "No npm automation scripts were declared in Jhonny/package.json."
    - type: "generated-artifact"
      detail: "Historical Python scripts generate or patch RPG Maker MZ data JSON, primarily CommonEvents.json."
    - type: "validator"
      detail: "Read-only validators and audits exist but must be confirmed non-mutating before reuse."
    - type: "sensitive-write"
      detail: "Most historical scripts write runtime data JSON and require explicit approval, technical preflight, rollback and Playtest gate."
    - type: "open-question"
      detail: "System.json switch/variable indexing convention needs confirmation before future script writes."
  risks:
    - "Historical generators can overwrite manual RPG Maker editor or plugin-command edits."
    - "Static validators do not validate player-visible behavior."
    - "Old script asserts can encode obsolete project snapshots."
  confidence: "medium"
  model_class: "coding"
  effort: "high"
  required_validations:
    - "technical-review"
    - "human-validation"
  proposed_next_step: "Before any future script execution, run loki:tech-analysis or loki:run-plan with exact script, target files, rollback, validators and approval gate."
```
