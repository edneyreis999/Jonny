---
title: "Loki Init - Dialogue Editor Inventory"
tipo: "inventario de dialogo"
status: "parcial"
agent: "dialogue-editor"
date: 2026-06-30
tags:
  - loki-init
  - dialogue-editor
  - inventario
  - rpg-maker-mz
  - dialogo
---

# Loki Init - Dialogue Editor Inventory

## Escopo

Inventario factual de corpus de dialogo, vozes/personas, idioma/localizacao,
tom observado, fontes de texto, concentracao de dialogos, superficies de UI com
texto e lacunas editoriais para o projeto RPG Maker MZ `Jhonny/`.

Este documento nao reescreve dialogo, nao normaliza termos e nao valida voz,
ritmo, leitura, impacto emocional, fit visual, localizacao ou seguranca de
conteudo. A evidencia e estatica.

## Fontes lidas

| Fonte | Uso no inventario | Nivel de evidencia |
| --- | --- | --- |
| `docs/loki-init/project-inventory.md` | Contexto comum, limites de escrita, runtime real em `Jhonny/`, plugins ativos, locale e superficie sensivel. | `editor-structural` |
| `docs/loki-init/technology-context.md` | Classificacao `game-dev`, stack RPG Maker MZ, plugins ativos e gates. | `editor-structural` |
| `docs/index.xml` | Catalogo navegavel; confirma que o core loop e fonte duradoura de alta prioridade. | `editor-structural` |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Tom de design, POV, relacao com VN/ConcernScore, texto de HUD/resultado citado e lacunas de Playtest. | `static-risk` |
| `Jhonny/data/MapInfos.json` | Lista de mapas, nomes de cenas e potenciais superficies VN/finais. | `parse-valid` |
| `Jhonny/data/Map001.json` a `Jhonny/data/Map016.json` | Contagem estruturada de comandos de texto, escolhas, comentarios e plugin commands por mapa. | `parse-valid` |
| `Jhonny/data/CommonEvents.json` | TextPicture de HUD/resultado e Common Events de apresentacao de fala/bust. | `parse-valid` |

Fontes relevantes nao lidas em detalhe neste envelope: pitch/canon completo
`[[Roleta Paulista]]`, imagens com texto embutido, previews no editor,
Playtest, saves, assets de fonte, e qualquer documento fora da lista aprovada.

## Mapa de localizacao

| Tipo de texto | Onde procurar |
| --- | --- |
| Falas e escolhas VN | `Jhonny/data/Map005.json`, `Map006.json`, `Map007.json`, `Map009.json`, `Map010.json`, `Map011.json`, `Map012.json`, `Map013.json`, `Map015.json`, `Map016.json` |
| Mapa mais denso de dialogo/branching | `Jhonny/data/Map013.json` (`Estrada_VN3`) |
| Aviso inicial de conteudo | `Jhonny/data/Map011.json` (`Prologo`) |
| Texto longo em scroll | `Jhonny/data/Map009.json` (`Celular`) |
| HUD/resultado renderizado por texto-picture | `Jhonny/data/CommonEvents.json`, CE5, CE6, CE8, CE9 e CE19 |
| Bust/foco visual de fala | `Jhonny/data/CommonEvents.json`, CE20 a CE23; plugin commands VisuMZ |
| Termos de design e tom de corrida | `docs/02-Core-Loop/Corrida - Core Loop.md` |
| Locale, resolucao e contexto tecnico | `docs/loki-init/project-inventory.md`, `docs/loki-init/technology-context.md` |

## Corpus de dialogo

Contagem estatica de comandos textuais em mapas:

| Superficie | Total observado |
| --- | ---: |
| `Show Text` blocks, code 101 | 1.446 |
| Linhas de `Show Text`, code 401 | 2.343 |
| `Show Choices`, code 102 | 461 |
| Opcoes de escolha | 1.364 |
| Branches de escolha, code 402 | 1.364 |
| `Scroll Text` blocks, code 105 | 1 |
| Linhas de `Scroll Text`, code 405 | 98 |
| Blocos de comentario, code 108 | 989 |
| Linhas de comentario, code 408 | 2.129 |
| Plugin commands em mapas, code 357 | 17 |

Distribuicao por mapa com texto:

| Mapa | Nome | Show Text | Linhas | Escolhas | Opcoes | Scroll linhas | Observacao |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `Map005` | `Quarto_VN2` | 62 | 108 | 15 | 45 | 0 | Cena VN com Jonny/Chance e escolhas. |
| `Map006` | `FIM_TRUE_Estrada_VN4_SABOTAGEM` | 20 | 20 | 0 | 0 | 0 | Ending/rota true com fala. |
| `Map007` | `Formatura_True` | 9 | 10 | 0 | 0 | 0 | Cena curta de formatura. |
| `Map009` | `Celular` | 2 | 3 | 0 | 0 | 98 | Texto longo em scroll. |
| `Map010` | `Estrada_VN1` | 31 | 37 | 0 | 0 | 0 | Cena VN inicial de estrada. |
| `Map011` | `Prologo` | 1 | 4 | 0 | 0 | 0 | Aviso de conteudo inicial. |
| `Map012` | `FIM_FALSE_Formatura_False` | 9 | 12 | 0 | 0 | 0 | Ending/rota false curta. |
| `Map013` | `Estrada_VN3` | 1.310 | 2.146 | 446 | 1.319 | 0 | Maior concentracao do corpus e de branching textual. |
| `Map015` | `Formatura_True2` | 1 | 1 | 0 | 0 | 0 | Cena final curta. |
| `Map016` | `Batida` | 1 | 2 | 0 | 0 | 0 | Cena de acidente/transicao. |

`Map001`, `Map002`, `Map003`, `Map004`, `Map008` e `Map014` nao apresentaram
comandos de fala, escolha ou scroll text na contagem estatica.

## Concentracao e repeticao

- `Map013/Estrada_VN3` concentra aproximadamente 90,6% dos blocos `Show Text`
  e 96,6% das opcoes de escolha observadas em mapas.
- O mesmo mapa tambem contem 987 blocos de comentario e 2.124 linhas de
  comentario, sinalizando alta densidade de autoria/branching no evento.
- A contagem estatica encontrou 2.441 linhas textuais somando `Show Text` e
  `Scroll Text`; comprimento medio aproximado de linha: 35,9 caracteres;
  comprimento maximo observado: 60 caracteres.
- Ha repeticao alta de linhas e opcoes em `Map013`, incluindo blocos de
  despedida, coragem, corrida, bebida, Opala e Curva/Devil's Curve. Isto pode
  ser branching intencional, duplicacao estrutural do editor ou conteudo
  repetido; a diferenca exige leitura editorial e route matrix.
- Foram encontradas 65 linhas textuais vazias em comandos de texto/scroll. Sem
  preview nao e possivel dizer se sao pausas intencionais, quebras de layout ou
  sobra de edicao.

## Vozes e personas observadas

Metadados de speaker em `Show Text`:

| Speaker | Blocos observados | Superficies principais |
| --- | ---: | --- |
| `Jonny` | 1.369 | Predominante em `Map013`, tambem `Map005`, `Map010`, `Map006` e `Map016`. |
| `Chance` | 56 | `Map005`, `Map006`, `Map009`, `Map010` e `Map013`. |
| `Principal` | 13 | `Map007` e `Map012`. |
| `Student` | 5 | `Map012`. |
| Sem speaker | 3 | `Map010`, `Map011` e `Map015`. |

Nenhum `faceName` foi observado nos comandos `Show Text`; os comandos de bust e
foco visual aparecem via `VisuMZ_2_VNPictureBusts` em mapas e Common Events.
CE20 a CE23 (`Fala-ID1` a `Fala-ID4`) ajustam tom/escala de busts por Picture
ID, mas nao carregam falas proprias.

Evidencia de voz ainda ausente:

- Character bible ou guia de voz por personagem.
- Relacao canonica entre `Jonny`, `Jhonny`, `Johnny`, `Joao/João` e o titulo
  "Bye Bye Jhonny".
- Regra de speaker para narracao sem nome e para texto de alerta.
- Critério editorial para escolhas do jogador em primeira pessoa, fala do amigo
  `Chance` e fala atribuida a `Jonny`.

## Idioma e localizacao

Fatos observados:

- `docs/loki-init/project-inventory.md` registra `Jhonny/data/System.json` com
  `locale: pt_BR`.
- O documento de core loop e os docs Loki estao em portugues.
- O corpus de falas, escolhas e HUD/resultado observado nos mapas/Common Events
  esta majoritariamente em ingles.
- CE6 usa TextPicture com labels como `GLORY`, `TRIAL` e `TIMER`.
- CE19 usa TextPicture com `VICTORY!`, `DEFEAT!`, `Glory Score` e instrucao
  para pressionar `[SPACE]`.
- A spec de corrida usa termos portugueses como `Consciência`, `Pontos de
  Glória`, `Curva do Diabo`, `Parar`, `Furar`, `Direita` e `Esquerda`.
- O runtime de corrida usa botoes como imagens (`btn_parar`,
  `btn_furar`, `btn_direita`, `btn_esquerda`), mas o texto visual embutido nos
  assets nao foi auditado por OCR ou preview.

Riscos estaticos de localizacao:

- Mistura PT/EN entre locale do projeto, docs, HUD de corrida, resultado e
  falas VN.
- Drift de nomes: `Jhonny` no titulo/projeto, `Jonny` como speaker predominante
  e ocorrencias textuais de `Johnny`; o core loop tambem usa `João`.
- Drift de termos de rota/tema: `Curva do Diabo` nos docs e `Devil's Curve` ou
  `Devil’s Curve` no corpus.
- Sem glossario canonico para `Consciência`, `Glory`, `Pontos de Glória`,
  `ConcernScore`, `Chance`, `Opala`, `Curva do Diabo` e labels de resultado.

## Tom observado

Evidencia documental do tom:

- O core loop descreve tensao moral entre acao safe e risk, POV dissociativo,
  corridas como arco emocional, e "let chance decide" como leitura tematica.
- O mesmo documento separa `Consciência` como recurso visivel da corrida e
  `ConcernScore` como variavel narrativa oculta das cenas VN/finais.
- A fase especial `Curva do Diabo` aparece como visao completa/futura em alguns
  trechos e como fora do MVP no callout de escopo.

Evidencia textual estatica do corpus:

- O prologo contem aviso de conteudo para suicidio, depressao e perda.
- As falas/escolhas observadas orbitam escola, bebida, corrida, relacao com o
  Opala, coragem, despedida, risco e Curva/Devil's Curve.
- O corpus inclui material de risco sensivel e deve passar por leitura humana
  antes de qualquer aceitacao narrativa ou LQA.

Este inventario nao declara o tom adequado, consistente ou seguro; apenas
identifica as superficies onde o tom aparece.

## Superficies de UI com texto

TextPicture em Common Events:

| Common Event | Texto/label observado | Papel provavel |
| --- | --- | --- |
| CE5 `EV_RaceOrchestrator` | `\V[104]%` | Valor de consciencia/percentual em picture. |
| CE6 `EV_UpdateHud` | `GLORY: \V[105]/\V[119]` | Pontuacao/meta de gloria. |
| CE6 `EV_UpdateHud` | `TRIAL \V[112]` | Tentativa/run atual. |
| CE6 `EV_UpdateHud` | `\V[104]%` | Consciencia/percentual. |
| CE6 `EV_UpdateHud` | `TIMER: \V[120]s` | Timer textual. |
| CE6 `EV_UpdateHud` | `\V[121]/\V[111]` | Progresso de cena. |
| CE8 `EV_RenderSinal` | `\V[103]%` | Probabilidade/tentacao da cena de sinal. |
| CE9 `EV_RenderCurva` | `\V[103]%` | Probabilidade/tentacao da cena de curva. |
| CE19 `EV_VitoriaCorrida` | `VICTORY!`, `DEFEAT!`, `Glory Score: \V[105]`, `Press [SPACE] to continue` | Resultado e instrucao. |

Outras superficies:

- Imagens de botao da corrida carregadas por CE8/CE9 podem conter texto
  embutido; os nomes dos assets indicam `parar`, `furar`, `direita` e
  `esquerda`.
- O sistema de message window usa speaker metadata, sem faceName.
- Foram observados text codes em linhas de mapa, principalmente `\FS[30]`,
  `\FS[40]`, `\FS[50]`, `\C[0]` e `\C[6]`; fit visual nao foi validado.

## Cobertura

| Area | Cobertura atual |
| --- | --- |
| Corpus de mapas | Completo para `Map001` a `Map016` em contagem de comandos textuais. |
| Common Events textuais | Parcial focada em CE5, CE6, CE8, CE9, CE19 e CE20-23. |
| Voz/persona | Parcial via speaker metadata e texto observado; sem bible ou validacao humana. |
| Localizacao | Parcial via locale, idioma das falas/HUD e drift de nomes/termos. |
| Tom | Parcial via core loop e temas textuais; sem aceite editorial. |
| UI text | Parcial via TextPicture e assets referenciados; sem preview, OCR ou teste de fit. |
| Branch reachability | Nao validado; contagem de escolhas nao prova caminho alcancavel. |
| Sensibilidade de conteudo | Superficies identificadas; seguranca/adequacao nao validada. |

## Lacunas editoriais

- Falta fonte canonica aprovada para personagem, voz, relacao e grafia de
  nomes.
- Falta glossario de localizacao PT/EN e decisao sobre idioma final.
- Falta leitura humana do corpus completo, especialmente `Map013`.
- Falta matriz de rotas para distinguir repeticao intencional de duplicacao
  acidental.
- Falta preview em RPG Maker/Playtest para validar que linhas, text codes,
  speaker labels, scroll text e choices cabem nas janelas.
- Falta gate humano para conteudo sensivel envolvendo suicidio, depressao,
  perda, alcool e direcao perigosa.
- Falta decisao canonica sobre como `ConcernScore`, Curva do Diabo, intervencao
  e finais se conectam ao corpus de dialogo atual.

## Riscos

| Risco | Evidencia | Proximo gate |
| --- | --- | --- |
| Map013 concentra quase todo o dialogo e branching textual. | 1.310 blocos de Show Text e 1.319 opcoes em `Estrada_VN3`. | Route matrix + leitura humana. |
| Mistura de idioma pode afetar produto e LQA. | Locale `pt_BR`, docs em portugues, falas/HUD em ingles. | Decisao de idioma + glossario. |
| Drift de nomes pode quebrar identidade de personagem. | `Jhonny`, `Jonny`, `Johnny` e `Joao/João` aparecem em superficies diferentes. | Decisao canonica de naming. |
| Conteudo sensivel requer revisao especializada. | Aviso de suicidio/depressao/perda e corpus sobre ultima corrida/despedida. | Human validation/sensitive-content review. |
| UI text pode nao caber ou conflitar com arte. | TextPicture, text codes, assets com texto embutido e tela 1280x720. | Preview/Playtest. |

## Required validations

- `technical-review` antes de qualquer tarefa que edite `Jhonny/data/*.json`,
  plugins, assets ou runtime.
- `human-validation` antes de declarar voz, leitura, ritmo, tom, aceitacao
  narrativa, LQA, fit visual ou tratamento de conteudo sensivel como validos.
- `loki-rpg-maker-mz-data-json` antes de editar mapas, Common Events ou
  database JSON.
- `loki-rpg-maker-mz-plugin-workflow` antes de editar plugins ou
  `plugins.js`.

## Agent response

```yaml
parallel_agent_response:
  agent: "dialogue-editor"
  mode: "init_context_scoped_writer"
  summary: "Inventario factual de corpus de dialogo, speakers, idioma/localizacao, tom observado, fontes de texto, concentracao de dialogos, UI text e lacunas editoriais para Jhonny/RPG Maker MZ."
  affected_files:
    - "docs/loki-init/dialogue-editor/inventory.md"
    - "planos/000-init-loki/retrospetivas/fase1/dialogue-editor-retrospectiva.md"
  write_scope:
    mode: "init_context_scoped_writer"
    target_files:
      - "docs/loki-init/dialogue-editor/**"
      - "planos/000-init-loki/retrospetivas/fase1/dialogue-editor-retrospectiva.md"
    allowed_writes:
      - "docs/loki-init/dialogue-editor/**"
      - "planos/000-init-loki/retrospetivas/fase1/dialogue-editor-retrospectiva.md"
    scoped_write_domains:
      - "character-dialogue"
      - "choice-text"
      - "localization-source-text"
    validators:
      - "static JSON parse for selected RPG Maker MZ maps and CommonEvents"
      - "inventory contract coverage check"
    human_gates:
      - "human-validation"
  affected_runtime_surfaces:
    - "Jhonny/data/Map001.json through Jhonny/data/Map016.json"
    - "Jhonny/data/CommonEvents.json"
    - "RPG Maker MZ message windows"
    - "TextPicture HUD/result text"
    - "VisuMZ VNPictureBusts presentation commands"
  affected_domain_ids:
    - "Map005 Quarto_VN2"
    - "Map006 FIM_TRUE_Estrada_VN4_SABOTAGEM"
    - "Map007 Formatura_True"
    - "Map009 Celular"
    - "Map010 Estrada_VN1"
    - "Map011 Prologo"
    - "Map012 FIM_FALSE_Formatura_False"
    - "Map013 Estrada_VN3"
    - "Map015 Formatura_True2"
    - "Map016 Batida"
    - "CE5 EV_RaceOrchestrator"
    - "CE6 EV_UpdateHud"
    - "CE8 EV_RenderSinal"
    - "CE9 EV_RenderCurva"
    - "CE19 EV_VitoriaCorrida"
    - "CE20-CE23 Fala-ID1 through Fala-ID4"
  evidence:
    - "Map JSON parsed with structured Python read-only script"
    - "CommonEvents JSON parsed with structured Python read-only script"
    - "System/project locale and plugin context from loki-init common docs"
    - "Core loop doc read for documented tone and design terms"
  findings:
    - type: "voice"
      detail: "Speakers observed: Jonny, Chance, Principal, Student and unnamed lines; no character voice bible found in allowed sources."
    - type: "clarity"
      detail: "Map013 has very high branching/text density; route reachability and repetition intent are not validated statically."
    - type: "pacing"
      detail: "2.441 text/scroll lines and 461 choice groups were observed; reading pace requires human preview or Playtest."
    - type: "tone"
      detail: "Core loop and corpus point to moral risk, racing, farewell, depression/loss and dangerous driving themes; tone safety not validated."
    - type: "subtext"
      detail: "Static evidence suggests risk/safe and farewell motifs, but subtext acceptance requires human reading."
    - type: "exposition"
      detail: "No editorial pass was performed to classify exposition load."
    - type: "repetition"
      detail: "Repeated lines and choice options are common in Map013; route matrix needed before classifying as duplicate or intentional."
    - type: "localization-risk"
      detail: "Locale/docs are Portuguese while dialogue/HUD are mainly English; naming and term glossary drift exists."
    - type: "open-question"
      detail: "Confirm canonical naming: Jhonny/Jonny/Johnny/Joao and final language policy."
  risks:
    - "Static inventory cannot validate readability, tone, UI fit, LQA, sensitive-content safety, or branch reachability."
    - "Do not rewrite dialogue without approved task scope, canon source and human validation gate."
  confidence: "medium"
  model_class: "specialist_generalist_human_like"
  effort: "high"
  required_validations:
    - "technical-review"
    - "human-validation"
  proposed_next_step: "Run a focused narrative/dialogue tech analysis or scoped editorial review for Map013 and localization glossary before any dialogue rewrite."
```
