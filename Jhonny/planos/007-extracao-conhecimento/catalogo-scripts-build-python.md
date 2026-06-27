# Catalogo de scripts Python de build em `planos/`

Data da catalogacao: 2026-06-27

Escopo analisado: todos os arquivos `*.py` e `*.pyw` sob `Jhonny/planos/`.

Total encontrado: 40 scripts Python. A maior parte e composta por scripts de build/patch que alteram JSON do RPG Maker MZ (`data/CommonEvents.json`, `data/System.json`, `data/Map*.json`) e por scripts auxiliares de auditoria/validacao que produzem relatorios Markdown ou verificam invariantes.

## Resumo por diretorio

| Diretorio | Quantidade | Foco principal |
| --- | ---: | --- |
| `001-prototipo-core-loop/fase3` | 1 | Criacao inicial de Common Events do core loop da corrida. |
| `001-prototipo-core-loop/fase4` | 2 | Extensao dos Common Events de renderizacao/input e variavel de timeout. |
| `001-prototipo-core-loop/fase5` | 6 | Estado, resolucao, debug logs e variavel de hover. |
| `001-prototipo-core-loop/fase6` | 2 | Crash, restart, vitoria e variavel de resultado. |
| `001-prototipo-core-loop/fase7` | 1 | Feedback de audio, tentativa e chamadas de log. |
| `003-bug-fix-round1/builds` | 2 | Patches de exploit de gloria e ME de derrota/vitoria. |
| `003-bug-fix-round1/interaction/fase3` | 1 | HUD de consciencia live e persistencia pos-restart. |
| `003-bug-fix-round1/interaction/fase4` | 1 | Correcao de labels/bindings da curva. |
| `003-bug-fix-round1/interaction/fase5` | 1 | Extracao de thresholds para helper `window.JhonnyRace`. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase1` | 2 | Contencao e bootstrap da corrida em `Map001`. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase2` | 3 | Entrada das corridas 1 e 2 e restauracao de formatacao dos mapas. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase3` | 2 | Roteamento vitoria/derrota e cleanup antes de transferencia. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase4` | 7 | Auditorias e fixes de retry, preload e marcadores da corrida 3. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase5` | 6 | Hardening da tela de resultado e fluxo de paralelos/pausa/derrota. |
| `006-joices-phase1` | 1 | Aplicacao de ajustes de juice/feedback da corrida. |
| `006-padronizar-chance-player/builds` | 2 | Auditoria e padronizacao do speaker `Player` para `Chance`. |

## Classificacao operacional

| Tipo | Scripts | Observacao |
| --- | ---: | --- |
| Build/patch em `CommonEvents.json` | 24 | Alto impacto: alteram Common Events, switches, variaveis, branches, scripts internos e fluxo da corrida. Exigem backup/diff e Playtest quando usados. |
| Build/patch em `System.json` | 4 | Criam/validam nomes de variaveis do sistema. Exigem cuidado com indices editor ID vs indice de array. |
| Build/patch em `Map*.json` | 8 | Alteram eventos, transfers e marcadores de mapas. Exigem validacao estrutural e Playtest. |
| Auditoria/validacao sem escrita em data JSON | 4 | Leem JSON e produzem diagnosticos ou validam invariantes. Podem escrever relatorios Markdown. |

## Catalogo completo

| Script | Tipo | Alvos principais | Funcao/resultado |
| --- | --- | --- | --- |
| `001-prototipo-core-loop/fase3/build_phase3_ces.py` | Build de Common Events | `data/CommonEvents.json`; imagens `race/*` | Cria os Common Events iniciais do core loop da Corrida. Define IDs de switches/variaveis em torno de 100+ e escreve listas de comandos para preload/renderizacao inicial. |
| `001-prototipo-core-loop/fase4/build_phase4_ces.py` | Build de Common Events | `data/CommonEvents.json`; imagens `race/bg_sinal`, `race/btn_parar`, `race/btn_furar`, `race/bg_curva`, botoes de curva | Cria CEs 10-13 e estende CEs 7-9 com botoes clicaveis, renderizacao de sinal/curva, timer e input. |
| `001-prototipo-core-loop/fase4/setup_phase4_system.py` | Setup de sistema | `data/System.json`; variavel editor ID 116 | Adiciona `VAR_TIMER_TIMEOUT_FLAG` e valida variaveis esperadas no sistema antes da Fase 4. |
| `001-prototipo-core-loop/fase5/apply_task_5_6.py` | Patch cirurgico de Common Events | `data/CommonEvents.json`; CE 12 e CE 17 | Adiciona `EV_ResolucaoRiskFail` e conecta branch de falha do risco preservando edicoes manuais e logs de debug. |
| `001-prototipo-core-loop/fase5/build_phase5_ces.py` | Build de Common Events | `data/CommonEvents.json`; overlays `race/overlay_risk_*` | Implementa logica de estado e resolucao: HUD, safe/risk, resolucao safe, risk ok, risk fail e hover de risco. |
| `001-prototipo-core-loop/fase5/inject_debug_logs.py` | Instrumentacao temporaria | `data/CommonEvents.json`; CEs 5, 11, 12, 14, 15 | Injeta `console.log` com marcador `[F5DBG]` para diagnostico da Fase 5. Uso temporario; deve ser removido depois da investigacao. |
| `001-prototipo-core-loop/fase5/inject_debug_logs_v2.py` | Instrumentacao temporaria | `data/CommonEvents.json` | Segunda versao de diagnostico da Fase 5. Tambem injeta marcadores `[F5DBG]` e sinais sonoros de diagnostico. |
| `001-prototipo-core-loop/fase5/remove_debug_logs.py` | Limpeza de instrumentacao | `data/CommonEvents.json` | Remove logs `[F5DBG]` e SEs diagnosticos associados. Util para restaurar estado limpo depois dos probes. |
| `001-prototipo-core-loop/fase5/setup_phase5_system.py` | Setup de sistema | `data/System.json`; variavel editor ID 115 | Adiciona `VAR_HOVER_LEVEL` usada no hover de risco da Fase 5. |
| `001-prototipo-core-loop/fase6/build_phase6_ces.py` | Build/patch de Common Events | `data/CommonEvents.json`; CE 18, CE 19, CEs 5/7/12 | Implementa crash, restart, variacao de corridas e vitoria. Inclui thresholds por corrida e overlay de flash branco. |
| `001-prototipo-core-loop/fase6/setup_phase6_system.py` | Setup de sistema | `data/System.json`; variavel editor ID 117 | Adiciona `VAR_VITORIA_PASSOU`, usada na resolucao de vitoria/derrota. |
| `001-prototipo-core-loop/fase7/build_phase7_ces.py` | Patch de Common Events | `data/CommonEvents.json`; plugin `Jhonny_RaceHelper`; CEs 5, 6, 11, 12, 15, 18, 19 | Adiciona feedback de audio, HUD de tentativa e chamadas `logRaceEvent` nos eventos da corrida. |
| `003-bug-fix-round1/builds/build_phase1_ces.py` | Patch de Common Events | `data/CommonEvents.json`; CE 10, CE 11, CE 19 | Corrige exploit de gloria infinita na tela cerimonial com guards de pausa, input lock e timer. |
| `003-bug-fix-round1/builds/build_phase2_ces.py` | Patch de Common Events | `data/CommonEvents.json`; CE 19 | Separa audio de derrota e vitoria no resultado final usando `VAR_VITORIA_PASSOU`. |
| `003-bug-fix-round1/interaction/fase3/build_phase3_ces.py` | Patch de Common Events | `data/CommonEvents.json`; CEs 5, 6, 11, 12, 18 | Faz o HUD de consciencia atualizar ao vivo e sobreviver ao fluxo crash -> restart. |
| `003-bug-fix-round1/interaction/fase4/fix_curve_labels.py` | Patch de Common Events | `data/CommonEvents.json`; CE 9 e CE 13 | Corrige inversao de labels/bindings da curva para mouse e teclado. |
| `003-bug-fix-round1/interaction/fase5/build_phase5_ces.py` | Refactor de Common Events | `data/CommonEvents.json`; CE 19; helper `window.JhonnyRace` | Substitui thresholds literais por chamada ao helper `window.JhonnyRace.isVictory`, mantendo fallback quando o helper nao existe. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase1/01_fix_map001_race_containment.py` | Patch de mapa | `data/Map001.json`; evento `Init Corrida` | Garante contencao da corrida em `Map001`, ajustando paginas por `VAR_RACE_ID` e transfers esperados. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase1/02_add_map001_init_erase_event.py` | Patch de mapa | `data/Map001.json`; evento `Init Corrida` | Adiciona `Erase Event` nas paginas de corrida para controlar o bootstrap autorun. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase2/01_wire_map010_race1_entry.py` | Patch de mapa | `data/Map010.json`; evento 1 pagina 2 | Conecta entrada da Corrida 1: ajusta marcador para setar `VAR_RACE_ID = 1` e transferir para `Map001`. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase2/02_wire_map005_race2_entry.py` | Patch de mapa | `data/Map005.json`; evento 1 pagina 3 | Conecta entrada da Corrida 2: ajusta marcador para setar `VAR_RACE_ID = 2` e transferir para `Map001`. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase2/03_restore_map_json_formatting.py` | Restauracao/validacao de mapas | `data/Map010.json`, `data/Map005.json` | Regrava formatacao JSON e valida marcadores de corrida 1 e 2 depois dos patches de entrada. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase3/01_update_victory_defeat_routing.py` | Patch de Common Events + relatorio | `data/CommonEvents.json`; CE 19; `interaction/fase3` | Atualiza roteamento de vitoria/derrota por corrida e grava sumarios/bloqueadores em Markdown quando necessario. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase3/02_add_race_cleanup_before_transfer.py` | Patch de Common Events + relatorio | `data/CommonEvents.json`; CE 19; `interaction/fase3` | Adiciona cleanup de pictures/estado da corrida antes de transfers de resultado. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase4/00_audit_defeat_retry_bootstrap.py` | Auditoria | `data/CommonEvents.json`, `data/Map001.json`; relatorio `interaction/fase4/defeat-retry-bootstrap-audit.md` | Audita bootstrap de retry apos derrota e documenta por que reentrar via CE5 evita depender do autorun apagado de `Map001`. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase4/01_audit_map013_race3_markers.py` | Auditoria | `data/Map013.json`; relatorio `interaction/fase4/map013-race3-marker-audit.md` | Localiza marcadores e transfers da Corrida 3 em `Map013`, incluindo pontos `7082` e `7107`. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase4/01_fix_defeat_retry_bootstrap.py` | Patch de Common Events + relatorio | `data/CommonEvents.json`; CE 18, CE 19; relatorio de retry | Ajusta retry de derrota para usar o bootstrap adequado sem alterar CE18 de crash direto. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase4/02_patch_map013_race3_markers.py` | Patch de mapa + relatorio | `data/Map013.json`; `interaction/fase4/map013-race3-marker-summary.md` | Insere `VAR_RACE_ID = 3` antes dos transfers auditados da Corrida 3 para entrada em `Map001`. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase4/03_validate_race_dialogue_integration.py` | Validacao | `data/Map001.json`, `Map005.json`, `Map010.json`, `Map012.json`, `Map013.json`, `CommonEvents.json`, `System.json`, `MapInfos.json` | Valida integracao corrida-dialogo lendo varios JSONs e imprimindo checks de rotas/variaveis/mapas. Nao escreve arquivos. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase4/04_audit_retry_preload_stall.py` | Auditoria | `data/CommonEvents.json`; relatorio `interaction/fase4/defeat-retry-preload-audit.md` | Audita travamento de preload no retry de derrota, focando CE3, CE5, CE19, tentativa e `SW_RACE_ACTIVE`. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase4/05_fix_retry_preload_stall.py` | Patch de Common Events + relatorio | `data/CommonEvents.json`; CE3, CE5; relatorio de preload | Corrige stall de preload no retry, preservando bootstrap frio com preload original. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase5/01_harden_result_screen_input.py` | Patch de Common Events | `data/CommonEvents.json`; CE13, CE19 | Endurece input na tela de resultado, trocando condicao de espera para `Input.isPressed('ok')` e bloqueando input de corrida quando `SW_INPUT_LOCKED` esta ativo. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase5/02_restore_common_events_indent.py` | Restauracao de formatacao | `data/CommonEvents.json`; CE13, CE19 | Regrava `CommonEvents.json` com indentacao de 4 espacos depois do hardening de input. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase5/03_stop_race_parallels_on_result_screen.py` | Patch de Common Events | `data/CommonEvents.json`; CE19 | Desliga `SW_RACE_ACTIVE` na tela de resultado para parar Common Events paralelos da corrida. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase5/04_revert_ce19_and_gate_ce7_unlock.py` | Patch/reversao de Common Events | `data/CommonEvents.json`; CE7, CE19 | Reverte parada global precoce em CE19 e condiciona unlock de CE7 para evitar estado indevido. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase5/05_add_paused_guard_to_risk.py` | Patch de Common Events | `data/CommonEvents.json`; CE11, CE12 | Adiciona guards de pausa, race active e input locked para evitar execucao de safe/risk em estado pausado ou bloqueado. |
| `005-integrar-corrida-ao-dialogo/race_dialogue_integration/builds/fase5/06_move_race_stop_to_victory_branch.py` | Patch de Common Events | `data/CommonEvents.json`; CE19 | Move parada da corrida para branches de vitoria, evitando interromper o caminho de derrota/retry. |
| `006-joices-phase1/apply_joices_phase1.py` | Patch de Common Events e System | `data/CommonEvents.json`, `data/System.json` | Aplica ajustes de juice: feedback de inicio, HUD, desativacao de hover band, rota crash->derrota e derrota forcada no resultado. |
| `006-padronizar-chance-player/builds/01_find_player_name_refs.py` | Auditoria | `data/Map*.json` | Procura referencias ao nome `Player` em parametros de comandos dos mapas. Nao escreve arquivos. |
| `006-padronizar-chance-player/builds/02_standardize_player_speaker_to_chance.py` | Patch de mapas | `data/Map005.json`, `data/Map006.json`, `data/Map010.json` | Substitui speaker `Player` por `Chance` em arquivos-alvo, com contagem esperada de substituicoes por mapa. |

## Observacoes de reuso

- Antes de reutilizar scripts de build, conferir se os IDs de Common Events, switches e variaveis ainda batem com o estado atual do projeto. Muitos scripts foram escritos para uma fase especifica e assumem estrutura exata nos comandos.
- Scripts que alteram `data/CommonEvents.json` e `data/Map*.json` devem ser tratados como migracoes pontuais, nao como ferramentas genericas. Rodar fora da ordem historica pode sobrescrever ou duplicar comandos.
- Scripts de auditoria em `005/.../fase4` e `006-padronizar-chance-player/builds/01_find_player_name_refs.py` sao os mais seguros para reexecucao, pois leem dados e produzem diagnostico.
- Instrumentacao `[F5DBG]` deve ser temporaria. Se `inject_debug_logs.py` ou `inject_debug_logs_v2.py` forem usados, `remove_debug_logs.py` deve entrar no checklist de cleanup.
- Validacao que dependa de engine, input, imagens, audio, Common Events paralelos ou transfers ainda requer Playtest no RPG Maker MZ; validacao por script cobre apenas estrutura dos JSONs e invariantes codificadas.
