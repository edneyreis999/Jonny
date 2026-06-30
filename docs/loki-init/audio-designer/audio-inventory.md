---
title: "Loki Init - Audio Designer Inventory"
tipo: "inventario de audio"
status: "parcial-estatico"
agent: "audio-designer"
tags:
  - loki-init
  - audio-designer
  - audio
  - rpg-maker-mz
  - corrida
---

# Loki Init - Audio Designer Inventory

Data: 2026-06-30
Escopo: inventario factual de musica, ambience, SFX, assets de audio, gatilhos/cues, superficies de configuracao sonora e fontes de cues da corrida para o projeto `Jhonny/`.

Este inventario e estatico. Nao foi executado Playtest, preview no editor, validacao de playback, mix, timing, loop, balanceamento de volume, browser autoplay, carregamento, fade perceptivel ou compreensao do jogador.

## Fontes lidas

| Fonte | Uso neste inventario | Evidencia |
| --- | --- | --- |
| `docs/loki-init/project-inventory.md` | Contexto comum do init, IDs/superficies ja mapeadas e limites de escrita. | Inventario comum indica RPG Maker MZ, plugins ativos e dados de corrida relevantes. |
| `docs/loki-init/technology-context.md` | Contexto tecnico e gates. | Projeto classificado como `game-dev`; runtime real e `Jhonny/`; assets incluem `audio/**`; Playtest/human gate pendente. |
| `docs/index.xml` | Roteamento de docs duradouros. | Catalogo aponta `Corrida - Core Loop` e `Corrida - Runtime e Eventos` como docs de alta prioridade para corrida/runtime. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Direcao sonora documentada da corrida. | Define feedback audio desejado para safe/risk/crash/timer/Curva do Diabo e observa decisoes de MVP sobre crash. |
| `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Contrato runtime da corrida. | Registra `EV_VitoriaCorrida` com fadeout de BGM, ME curta e gate de Playtest para audio/Common Events. |
| `Jhonny/data/CommonEvents.json` | Fonte estruturada direta de triggers/cues em Common Events. | Parse JSON estatico identificou comandos `Play BGM`, `Fadeout BGM`, `Play ME` e `Play SE`. |
| `Jhonny/audio/**` | Listagem estatica de assets de audio. | Somente nomes/caminhos foram listados; binarios nao foram abertos, tocados ou convertidos. |
| Contrato `docs/loki-init-inventory-contracts.md` do pacote Loki | Contrato de conteudo do agente. | `audio-designer` deve cobrir musica, ambience, SFX, assets, gatilhos/cues, configuracao sonora e mapa de fontes. |

## Mapa de localizacao

| Informacao | Onde procurar |
| --- | --- |
| Assets BGM | `Jhonny/audio/bgm/*.ogg` |
| Assets BGS/ambience | `Jhonny/audio/bgs/*.ogg` |
| Assets ME | `Jhonny/audio/me/*.ogg` |
| Assets SE/SFX/UI sounds | `Jhonny/audio/se/*.ogg` |
| Cues implementados em Common Events | `Jhonny/data/CommonEvents.json`, comandos RPG Maker MZ `241`, `242`, `249`, `250` |
| Cues documentados da corrida | `docs/02-Core-Loop/Corrida - Core Loop.md`, secoes de feedback e implementacao |
| Contrato runtime de resultado | `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`, `Tela de resultado` e `Gates antes de editar JSON` |
| Contexto de plugins e engine | `docs/loki-init/technology-context.md` e `docs/loki-init/project-inventory.md` |

## Assets de audio encontrados

Listagem estatica de `Jhonny/audio/**`:

| Canal RPG Maker | Pasta | Quantidade | Observacao estatica |
| --- | --- | ---: | --- |
| BGM | `Jhonny/audio/bgm/` | 49 | Inclui `darkeletronic.ogg`, usado pela corrida em CE5. |
| BGS | `Jhonny/audio/bgs/` | 29 | Ambiences padrao como cidade, chuva, vento, mar, agua e fogo; nenhum `Play BGS` foi encontrado nos Common Events lidos. |
| ME | `Jhonny/audio/me/` | 27 | Inclui `Victory1.ogg`, `Defeat1.ogg` e `Shock1.ogg`; `Buzzer1.ogg` nao existe nesta pasta. |
| SE | `Jhonny/audio/se/` | 348 | Inclui `freada.ogg`, `pneu_cantando.ogg`, `crash_metal.ogg`, `Up1.ogg` e `Buzzer1.ogg`. |
| Total | `Jhonny/audio/**` | 453 | Todos os arquivos listados sao `.ogg`. |

Assets de projeto ou corrida identificaveis por nome:

| Asset | Canal | Status de referencia estatica |
| --- | --- | --- |
| `darkeletronic.ogg` | BGM | Referenciado diretamente em CE5 `EV_RaceOrchestrator`. |
| `freada.ogg` | SE | Referenciado diretamente em CE11 `EV_OnSafe`. |
| `pneu_cantando.ogg` | SE | Referenciado diretamente em CE15 `EV_ResolucaoRiskOK`. |
| `crash_metal.ogg` | SE | Existe no disco; nao apareceu como comando direto nos Common Events lidos. Doc de core loop trata como reservado para v2/polish. |
| `Victory1.ogg` | ME | Referenciado diretamente em CE19 `EV_VitoriaCorrida`. |
| `Defeat1.ogg` | ME | Referenciado diretamente em CE19 `EV_VitoriaCorrida`. |
| `Shock1.ogg` | ME | Existe no disco; doc de core loop registra decisao de MVP para crash, mas os Common Events lidos nao mostram uso direto. |
| `Buzzer1.ogg` | SE | Existe como SE; nao existe em `audio/me/`. |

## Superficies de configuracao sonora

| Superficie | Evidencia | Cobertura |
| --- | --- | --- |
| RPG Maker BGM | CE5 usa `Fadeout BGM` e `Play BGM`; CE19 usa `Fadeout BGM`. | Inspecionado em `CommonEvents.json`. |
| RPG Maker BGS | Pasta `audio/bgs/` existe. | Nenhum comando `Play BGS`/`Fadeout BGS` foi encontrado nos Common Events lidos; mapas nao foram lidos neste envelope. |
| RPG Maker ME | CE19 usa `Play ME` para resultado. | Inspecionado em `CommonEvents.json`. |
| RPG Maker SE | CE11 e CE15 usam `Play SE`. | Inspecionado em `CommonEvents.json`. |
| Documentacao de feedback | `Corrida - Core Loop` descreve freada, motor, pneu, impacto, silencio, ticking e Curva do Diabo. | Direcao documentada, nao validacao de runtime. |
| Plugins ativos | Inventario comum/tecnologia registra `TextPicture`, `ButtonPicture`, `Jhonny_RaceHelper`, `VisuMZ_0_CoreEngine`, `VisuMZ_2_VNPictureBusts`. | Nao foram lidos `plugins.js` ou arquivos de plugin neste envelope; sem claim de audio plugin-owned. |
| Config global de audio do System/engine | `System.json` nao foi fonte direta deste agente. | Fora de escopo desta execucao; usar `loki-rpg-maker-mz-project-inventory`/data-json em analise futura. |

## Cues implementados em `CommonEvents.json`

| Cue ID | Tipo | Fonte | Trigger/caller estatico | Canal | Arquivo | Parametros | Observacao |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `race-bgm-start` | music | CE5 `EV_RaceOrchestrator` | Inicio/reinicio de corrida via orquestrador. | BGM | `darkeletronic` | volume 90, pitch 100, pan 0 | CE5 faz `Fadeout BGM` de 1 frame, chama efeito scriptado, espera 72 frames e toca BGM. |
| `safe-brake` | SFX | CE11 `EV_OnSafe` | Acao safe registrada. | SE | `freada` | volume 90, pitch 100, pan 0 | Implementa parte do feedback de Parar/Esquerda; nao valida se timing bate com visual. |
| `safe-progress` | UI/progression sound | CE11 `EV_OnSafe` | Apos ganho de pontos/consciência. | SE | `Up1` | volume 70, pitch 100, pan 0 | Funciona como confirmacao/progresso; nao aparece explicitamente na direcao sonora original. |
| `risk-success-tire` | SFX | CE15 `EV_ResolucaoRiskOK` | CE12 chama CE15 quando risk vence. | SE | `pneu_cantando` | volume 90, pitch 100, pan 0 | Implementa pneu cantando para risk-sucesso. |
| `result-bgm-fade` | mix/transition | CE19 `EV_VitoriaCorrida` | Tela de resultado. | BGM | n/a | fadeout 1 | Contrato runtime tambem menciona fadeout de BGM na tela de resultado. |
| `result-victory-me` | ME | CE19 `EV_VitoriaCorrida` | Branch de resultado vitoria. | ME | `Victory1` | volume 90, pitch 100, pan 0 | Estatica: comando existe; branch e timing precisam de Playtest. |
| `result-defeat-me` | ME | CE19 `EV_VitoriaCorrida` | Branch de resultado derrota. | ME | `Defeat1` | volume 90, pitch 100, pan 0 | Estatica: comando existe; branch e timing precisam de Playtest. |

## Cues documentados mas nao confirmados como implementados

| Cue/necessidade | Fonte documental | Evidencia direta em Common Events | Status |
| --- | --- | --- | --- |
| Motor caindo RPM em safe | `Corrida - Core Loop`, feedback de Sinal/Curva. | CE11 toca `freada` e `Up1`; nao ha asset/cue de motor identificado por nome. | Lacuna estatica. |
| Motor subindo RPM em risk-sucesso | `Corrida - Core Loop`, feedback de risk-sucesso. | CE15 toca `pneu_cantando`; nao ha cue de motor identificado por nome. | Lacuna estatica. |
| Impacto metalico e silencio abrupto em risk-falha | `Corrida - Core Loop`, feedback de crash. | CE12 falha chama CE18; CE18 nao tem `Play SE`/`Play ME` direto. `crash_metal.ogg` existe, mas nao esta referenciado. | Lacuna/conflito entre direcao e runtime estatico. |
| `Shock1` como fallback de crash MVP | `Corrida - Core Loop`, decisao F6 registrada. | `Shock1.ogg` existe em ME, mas nao foi encontrado como comando direto nos Common Events lidos. | Drift a revisar antes de afirmar comportamento. |
| Timer ticking final | `Corrida - Core Loop`, ticking opcional nos 1,5s finais. | CE10 `EV_RaceTimer` nao apresentou comando de audio na leitura estruturada. | Nao implementado nos Common Events lidos ou fora do escopo. |
| Curva do Diabo com motor engasgando e baixo uma oitava abaixo | `Corrida - Core Loop`, direcao de clímax/futuro. | CE de corrida lidos nao mostram cue especifico para Curva do Diabo. O doc tambem marca Curva do Diabo como fora do MVP atual. | Futuro/fora do MVP, nao validado. |
| Ambience/BGS de corrida | Pastas BGS existem; docs de corrida focam SFX/ME/BGM. | Nenhum `Play BGS` nos Common Events lidos. | Nao encontrado nesta cobertura. |

## Fontes de cues da corrida

| Fonte | Papel de cue | Evidencia |
| --- | --- | --- |
| CE5 `EV_RaceOrchestrator` | Entrada musical da corrida. | `Fadeout BGM` + `Play BGM darkeletronic`; tambem chama preload CE3 e registra evento via `Jhonny_RaceHelper`. |
| CE10 `EV_RaceTimer` | Fonte potencial de cue temporal. | Controla timer e chama CE11 no timeout; nao contem comandos de audio na leitura estruturada. |
| CE11 `EV_OnSafe` | Resolucao safe. | Toca `freada` e `Up1`; chama CE14 `EV_ResolucaoSafe`. |
| CE12 `EV_OnRisk` | Resolucao risk e falha. | Chama CE15 no sucesso e CE18 no fail; nao contem comando direto de audio. |
| CE15 `EV_ResolucaoRiskOK` | Resolucao audiovisual de risk-sucesso. | Toca `pneu_cantando`, aplica tint e shake. |
| CE18 `EV_Crash` | Cleanup/restart por crash. | Registra `CRASH`, manipula switches, apaga pictures e chama CE19; sem comando direto de audio. |
| CE19 `EV_VitoriaCorrida` | Tela de resultado. | Fadeout de BGM, ME de vitoria/derrota, TextPictures e fluxo de confirmacao/retry. |
| Docs de core loop | Intencao sonora. | Define audio esperado para safe/risk/crash/timer/Curva do Diabo. |
| Docs de runtime | Contrato de lifecycle. | Reforca que audio/Common Events exigem Playtest antes de validar. |

## Ambience e musica

Fatos atuais:

- Musica implementada diretamente na corrida: `darkeletronic` via BGM em CE5.
- Transicao de resultado: CE19 faz fadeout de BGM antes de ME.
- BGS/ambience: assets existem em `audio/bgs/`, mas nenhum uso foi encontrado nos Common Events lidos.
- Map autoplay, System BGM defaults, battle BGM, vehicle BGM, map event audio e animations nao foram inspecionados por estarem fora das fontes permitidas.

Inferencia limitada:

- `darkeletronic.ogg` parece ser asset especifico do projeto pela nomenclatura fora do padrao RTP observado; isso e inferencia de nome/listagem, nao validacao de autoria, mix ou intencao.

## SFX, UI sound e acessibilidade

Fatos atuais:

- `freada` e `pneu_cantando` sao SFX de corrida diretamente acionados.
- `Up1` e um SE padrao usado como confirmacao/progresso em safe.
- `Victory1` e `Defeat1` sao ME de resultado.
- `EV_HoverRiskButton` existe como feedback de hover/custo, mas nao tem audio direto na leitura estruturada.
- `EV_RaceTimer` nao tem ticking sonoro direto na leitura estruturada.

Gaps de acessibilidade:

- A direcao sonora inclui pistas importantes, como crash, ticking opcional e Curva do Diabo; a cobertura estatica nao prova fallback visual/textual equivalente para cada pista sonora.
- Para crash, ha feedback visual documentado e comandos visuais em Common Events, mas o audio de impacto/ME de crash esta em drift entre documentacao, assets e runtime estatico.
- Se timer, Curva do Diabo ou custo de risco dependerem de audio em iteracoes futuras, exigir fallback visual/textual e Playtest com audio desligado.

## Cobertura

Inspecionado em detalhe:

- `CommonEvents.json` para cues de audio diretos nos Common Events.
- Listagem de `Jhonny/audio/**` por canal e assets de corrida/resultados nominalmente relevantes.
- Documentacao de corrida para intencao sonora e contrato runtime.

Apenas mapeado:

- Plugins ativos, `System.json` e configuracao de engine via inventarios comuns ja existentes.
- Ambience/BGS como asset inventory, sem callers confirmados.

Nao inspecionado neste envelope:

- `Jhonny/data/System.json` diretamente.
- `Jhonny/data/Map*.json` para autoplay ou eventos de mapa com audio.
- `Jhonny/data/Animations.json` para timings de som em animacoes.
- `Jhonny/js/plugins.js`, parametros de plugins e codigo de plugins.
- `Jhonny/audio/**` binarios, metadados internos, duracao, loudness, loop points, canais ou integridade de decode.
- Editor RPG Maker MZ, Playtest, browser/NW.js runtime, console ou screenshots.

## Riscos e lacunas de validacao

| Risco/lacuna | Evidencia | Validacao requerida |
| --- | --- | --- |
| Drift de crash audio | Doc registra `Shock1` como fallback MVP; `Shock1.ogg` existe; CE18 nao toca audio direto e CE19 toca `Defeat1` na derrota. | `loki:tech-analysis` focado em crash/result screen + Playtest humano. |
| Cue de `crash_metal.ogg` reservado mas nao conectado | Asset existe; Common Events lidos nao referenciam. | Decisao de produto/audio antes de implementar v2/polish. |
| Motor/timbre/baixo documentados sem asset/caller confirmado | Docs descrevem intencao; assets de motor nao foram identificados por nome. | Asset plan e validacao auditiva humana. |
| Timer ticking opcional ausente nos CEs lidos | CE10 nao tem comandos de audio. | Decisao de UX/acessibilidade antes de adicionar cue; Playtest para pressao e conforto. |
| Ambience/BGS sem caller na cobertura | Pasta BGS existe; Common Events de corrida nao usam BGS. | Leitura de mapas/System/animations se ambience entrar no escopo. |
| Mix e prioridade nao validados | Volumes estaticos existem em comandos, mas playback nao foi executado. | Human-validation gate com audio ligado/desligado, BGM/ME/SE simultaneos e resultado/retry. |
| Browser autoplay/loop/fade nao validado | RPG Maker HTML5/NW.js pode ter comportamento dependente de runtime. | Playtest em target runtime. |

## Handoff recomendado

- Para `runtime-qa`: cobrir Playtest minimo de corrida com BGM inicial, safe, risk-sucesso, risk-falha/crash, resultado vitoria/derrota, retry e audio desligado.
- Para `gameplay-engineer`: analisar drift de CE18/CE19 versus decisao de crash audio antes de editar `CommonEvents.json`.
- Para `scene-presentation-designer`: alinhar timing visual de tint/shake/fade com os cues `freada`, `pneu_cantando`, ME de resultado e eventual crash.
- Para `ux-ui-designer`/`accessibility`: garantir que timer, custo de risco, crash e resultado nao dependam somente de audio.
- Para proximo workflow tecnico: usar `loki:tech-analysis` antes de qualquer edicao em `Jhonny/data/*.json`, `Jhonny/audio/**` ou plugins.

## Status do inventario

Parcial, suficiente para `loki:init` do `audio-designer` dentro das fontes permitidas. A cobertura atende ao contrato de inventario factual de audio, mas nao substitui analise tecnica completa nem validacao perceptiva.
