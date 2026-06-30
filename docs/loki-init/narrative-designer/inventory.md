---
title: "Loki Init - Narrative Designer Inventory"
tipo: "inventario narrativo"
status: "parcial"
tags:
  - loki-init
  - narrative-designer
  - inventario
  - game-dev
  - rpg-maker-mz
---

# Loki Init - Narrative Designer Inventory

Data: 2026-06-30
Agente: narrative-designer
Escopo: inventario factual de personagens, premissa/canon visivel, lugares, lore, arcos, dialogos, rotas/finais e lacunas narrativas para o projeto Jhonny.

## Status

Inventario parcial e estatico. As fontes permitidas mostram a narrativa principalmente por meio de uma especificacao mecanica da corrida, nomes de mapas e inventarios tecnicos ja consolidados. Nao foi feita leitura profunda de `MapXXX.json`, eventos, dialogos completos, pitch `[[Roleta Paulista]]`, assets, saves ou runtime.

Este documento separa fatos documentados de inferencias. Leitura, pacing, alcance de rotas, impacto emocional, compreensao do jogador e seguranca de conteudo continuam pendentes de gate humano/Playtest.

## Fontes lidas

| Fonte | Uso no inventario |
| --- | --- |
| `docs/loki-init/project-inventory.md` | Contexto do projeto, titulo, locale, mapas, switches/variaveis citados, Common Events resumidos e limites de validacao. |
| `docs/loki-init/technology-context.md` | Classificacao `game-dev`, engine RPG Maker MZ, plugins ativos e gates pendentes. |
| `docs/index.xml` | Catalogo navegavel e confirmacao de documentos canonicos/lacunas catalogadas. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Fonte narrativa principal disponivel: premissa mecanica, POV, corridas, ConcernScore, Curva do Diabo e relacao com VN/finais. |
| `Jhonny/data/MapInfos.json` | Lista estruturada de mapas e nomes narrativos/ending-like. |
| `docs/03-Tech/**` via `rg` direcionado | Busca estreita por termos narrativos; nao revelou fonte canonica adicional de historia, apenas procedimentos tecnicos e prompts. |
| Contratos Loki de init/inventario | Contrato universal e contrato `narrative-designer`. |

## Mapa de localizacao

| Tipo de informacao | Onde esta agora | Cobertura |
| --- | --- | --- |
| Premissa mecanica e tema da corrida | `docs/02-Core-Loop/Corrida - Core Loop.md` | Lido em detalhe. |
| Canon amplo, VN, ConcernScore, finais e direcao de arte | Referenciados como `[[Roleta Paulista]]`, `[[Direcão de arte]]` e docs nao permitidos nesta task | Nao lidos; canon ausente neste inventario. |
| Mapas/cenas provaveis | `Jhonny/data/MapInfos.json` | Parse estruturado de nomes, sem abrir eventos. |
| Dialogos e escolhas reais | Provavelmente em `Jhonny/data/MapXXX.json` e docs de pitch/VN | Nao lidos; fora do escopo permitido. |
| Runtime de rotas/finais | Common Events e mapas, resumidos no inventario comum | Nao auditado por este agente. |
| Gates e validacao perceptivel | `docs/loki-init/project-inventory.md`, `technology-context.md`, docs tecnicos de Playtest | Estatica; Playtest pendente. |

## Fatos documentados

### Identidade do projeto

- O titulo runtime registrado no inventario comum e `Bye Bye Jhonny`.
- O projeto runtime real fica em `Jhonny/` e e RPG Maker MZ.
- O locale observado no inventario comum e `pt_BR`.
- O documento de core loop declara a cena pai como `[[Roleta Paulista]]`.

### Personagens e papeis visiveis

- O core loop nomeia `Joao` como figura assumida pelo jogador durante as corridas: entre corridas o POV e do amigo, nas corridas o jogador "vira" o Joao.
- O amigo e citado como POV entre corridas, mas nao e nomeado nas fontes lidas.
- O jogo/projeto usa grafias proximas em superficies diferentes: `Jhonny` no titulo/pasta e `JonnyFormando` como nome de mapa; o core loop usa `Joao`. Nenhuma fonte lida resolve se isso e alias, erro de grafia, nome legal/apelido ou personagens distintos.
- O `Opala` aparece como veiculo central nas cenas de corrida e na possivel intervencao/sabotagem.

### Premissa e canon visivel

- A experiencia mistura cenas VN e corridas/minigame. O core loop cobre so a corrida; ele declara que cenas VN, ConcernScore, finais e direcao de arte estao em `[[Roleta Paulista]]`.
- Existem tres corridas fixas na narrativa:
  - Corrida 1: `Lenda`, 6 cenas.
  - Corrida 2: `Rachadura`, 8 cenas.
  - Corrida 3: `Abismo`, 10 cenas.
- O loop narrativo/mecanico gira em torno de decisoes binarias de seguranca versus risco:
  - `Sinal`: Parar e safe; Furar e risk.
  - `Curva`: Esquerda e safe; Direita e risk.
- `Consciencia` e recurso visivel dentro da corrida, reseta por corrida/restart e e documentado como independente de `ConcernScore`.
- `ConcernScore` e variavel oculta acumulada nas cenas VN e define qual final o jogador acessa, mas as fontes lidas nao mostram seus ranges, eventos ou criterios completos.
- `Pontos de Gloria` determinam sucesso em cada corrida por thresholds atuais 200/400/600.
- O MVP atual termina, apos vencer a Corrida 3, em uma tela "FIM" com "Obrigado por jogar!", sem endless mode.

### Lugares e cenas nomeadas

`Jhonny/data/MapInfos.json` lista 16 mapas:

| ID | Nome | Observacao factual |
| --- | --- | --- |
| 1 | `MAP001` | Nome generico. |
| 2 | `mapa-semaforo` | Superficie provavel de cena de sinal, mas eventos nao foram lidos. |
| 3 | `mapa-atalho` | Nome sugere rota/atalho; sem confirmacao de evento. |
| 4 | `Mapa-fase2` | Nome de fase; sem contexto narrativo lido. |
| 5 | `Quarto_VN2` | Nome indica cena VN em quarto. |
| 6 | `FIM_TRUE_Estrada_VN4_SABOTAGEM` | Nome indica final true/estrada/sabotagem; conteudo nao lido. |
| 7 | `Formatura_True` | Nome indica superficie de final/cena de formatura true. |
| 8 | `JonnyFormando` | Nome indica Jhonny/Jonny em formatura; conteudo nao lido. |
| 9 | `Celular` | Nome indica cena/estado com celular. |
| 10 | `Estrada_VN1` | Nome indica cena VN de estrada. |
| 11 | `Prologo` | Mapa inicial registrado no inventario comum. |
| 12 | `FIM_FALSE_Formatura_False` | Nome indica final false/formatura false. |
| 13 | `Estrada_VN3` | Nome indica terceira cena VN de estrada. |
| 14 | `CelularVazio` | Nome indica variante/estado de celular vazio. |
| 15 | `Formatura_True2` | Nome indica segunda superficie de formatura true. |
| 16 | `Batida` | Nome indica cena de crash/batida. |

### Lore e arcos documentados

- A progressao `Lenda -> Rachadura -> Abismo` e apresentada como escalada narrativa e mecanica.
- O core loop explicita que a profundidade vem da leitura contextual e do arco emocional, apesar da mecanica rasa.
- A decisao risk e associada ao impulso de Joao, especialmente em curvas e na Corrida 3.
- A Curva do Diabo aparece como clímax da visao completa: ultima cena da Corrida 3, `P_cena = 100`, sucesso garantido no roll, mas custo de zerar Consciencia.
- Para o MVP, a Fase Especial da Curva do Diabo esta adiada/fora do escopo; `SW_IS_CURVA_DIABO` e reservado e `placa_curva_dir.png` fica no disco sem referencia no MVP, segundo o core loop.
- O core loop cita uma intervencao quando `ConcernScore` esta alto: uma cena substitui a Curva do Diabo e o jogador sabota o Opala antes. O proprio doc declara que esse gating nao faz parte do core loop e esta no pitch.

### Dialogos, rotas e finais

- A fonte de dialogo/VN/finais indicada pelo core loop e `[[Roleta Paulista]]`, nao lida neste envelope.
- A existencia de finais/rotas e documentada por:
  - declaracao de `ConcernScore` como variavel que define final;
  - nomes de mapas `FIM_TRUE_Estrada_VN4_SABOTAGEM`, `Formatura_True`, `FIM_FALSE_Formatura_False`, `Formatura_True2`;
  - mencao a "final escondido" e "finais" no core loop.
- Este inventario nao encontrou corpus de dialogo, falas, escolhas, linhas VN, branch matrix ou ending script nas fontes permitidas.

## Inferencias separadas

Estas inferencias parecem plausiveis, mas nao devem ser tratadas como canon sem leitura das fontes narrativas primarias ou runtime:

- `Joao`, `Jhonny` e `Jonny` provavelmente se referem ao mesmo eixo de personagem, mas a grafia nao esta normalizada nas fontes lidas.
- Os mapas com prefixo `FIM_TRUE` e `FIM_FALSE` provavelmente representam finais diferentes, mas os criterios e consequencias nao foram verificados.
- `Quarto_VN2`, `Estrada_VN1`, `Estrada_VN3`, `Celular` e `CelularVazio` sugerem estrutura VN intercalada com corridas, mas a ordem, conteudo e escolhas dependem de eventos nao lidos.
- `FIM_TRUE_Estrada_VN4_SABOTAGEM` sugere que sabotagem pode ser parte de rota/intervencao true, alinhada com a mencao do core loop ao Opala sabotado, mas isso ainda e inferencia por nome de mapa e doc secundario.
- `Batida` provavelmente materializa crash ou consequencia de risco, mas nao ha leitura de evento para confirmar.
- A progressao `Lenda -> Rachadura -> Abismo` sugere deterioracao emocional/moral, mas o texto de cenas VN que daria essa leitura nao foi inspecionado.

## Lacunas de canon

- Pitch completo `[[Roleta Paulista]]`: nao lido, mas e a fonte declarada para VN, ConcernScore, finais e direcao de arte.
- Biblia de personagens: nao encontrada nas fontes lidas.
- Identidade e voz do amigo POV: ausente.
- Relacao exata entre Joao/Jhonny/Jonny: ausente.
- Corpus de dialogo e escolhas: nao lido/não encontrado nas fontes permitidas.
- Matriz de rotas/endings: ausente.
- Ranges, thresholds e owner runtime do `ConcernScore`: ausentes nas fontes lidas.
- Condicoes de acesso aos finais true/false/hidden: incompletas.
- Estado atual real da Curva do Diabo no runtime versus visao futura: documentado como fora do MVP, mas exige auditoria tecnica se uma task futura depender disso.
- Conteudo sensivel, avisos, suporte/recurso externo e tratamento de method-detail: nao inventariado; avaliar antes de validar narrativa, especialmente por crash, batida, sabotagem, risco e possivel queda emocional.
- Localizacao/LQA: locale `pt_BR` existe, mas qualidade de texto, tom, consistencia de termos e fit visual nao foram validados.

## Riscos narrativos

- Risco de continuidade: o projeto tem sinais de canon em docs, mapas e runtime, mas a fonte primaria de historia nao foi lida neste envelope.
- Risco de nomenclatura: `Joao`/`Jhonny`/`Jonny` podem gerar drift em dialogo, UI, arquivo e catalogo.
- Risco de branching: nomes de mapas indicam finais, mas nao ha matriz de flags, escolhas, pre-condicoes e pos-condicoes.
- Risco MVP versus visao futura: Curva do Diabo e intervencao por ConcernScore aparecem como visao completa/futura; tasks futuras precisam distinguir feature atual de post-MVP.
- Risco de validacao indevida: static inventory nao valida pacing, legibilidade, compreensao de escolhas, impacto emocional, alcance de ending ou seguranca narrativa.

## Cobertura

| Item do contrato `narrative-designer` | Status |
| --- | --- |
| Personagens | Parcial: Joao/Jhonny/Jonny, amigo POV e Opala como elemento central; sem bible. |
| Premissa/canon atual | Parcial: corrida/VN, tres corridas, Consciência, ConcernScore e tema risco/safe. |
| Lugares | Parcial: todos os nomes de `MapInfos`, sem conteudo interno de mapas. |
| Lore | Parcial: Curva do Diabo, Opala, formatura/estrada/celular por nomes; sem fonte primaria. |
| Arcos | Parcial: `Lenda -> Rachadura -> Abismo`, queda/tensao risk; VN nao lida. |
| Dialogos | Nao coberto: corpus nao lido. |
| Rotas/finais | Parcial: existencia por nomes e referencias; matriz ausente. |
| Fontes narrativas | Mapeadas: core loop, MapInfos, pitch/docs referenciados e runtime provavel. |
| Missing canon | Coberto em lacunas. |

## Proximo passo recomendado

Antes de qualquer escrita narrativa, executar `loki:tech-analysis` ou task dedicada com escopo permitido para ler a fonte `[[Roleta Paulista]]` e os mapas/eventos narrativos selecionados, produzindo uma matriz de personagens, cenas VN, escolhas, `ConcernScore`, rotas e finais. A validacao de ritmo, compreensao e impacto precisa de leitura humana/Playtest.
