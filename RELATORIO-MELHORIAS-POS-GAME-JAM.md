---
doc_id: "jhonny-melhorias-pos-game-jam"
version: "1.0.0"
status: "active"
last_updated: "2026-08-13"
scope: "Melhorias do jogo Jhonny registradas no GitHub após o build da Summer Tavern Games (Tavern Jam)."
not_scope: "Não valida em Playtest a qualidade visual, o áudio, o balanceamento, a tradução, a acessibilidade, as rotas narrativas ou a compatibilidade de saves."
authority: "Para fatos de implementação, prevalecem o histórico do GitHub e os arquivos estruturados do projeto; a equipe do projeto aprova qualquer afirmação editorial antes da publicação."
canonical_source: "https://github.com/edneyreis999/Jonny"
intended_llm_task: "context-hydration"
source_priority:
  - "Snapshot da Tavern Jam: commit 7c08cc58e180e92caf345197c6756cc300954b1a."
  - "PRs e commits integrados à branch main após o snapshot."
  - "Estado estruturado atual de Jhonny/data e Jhonny/js/plugins.js."
  - "Interpretações e sugestões editoriais deste relatório."
confidence: "high"
known_conflicts:
  - "O repositório se chama Jonny; o jogo e a pasta executável usam Jhonny."
replaced_by: null
---

# Relatório de melhorias de Jhonny após a Game Jam

<summary>
Entre o build submetido à Tavern Jam em 23 de junho de 2026 e o último PR com mudanças no jogo, em 21 de julho de 2026, Jhonny recebeu 13 PRs, 10 mapas novos, 31 arquivos de áudio, 79 imagens, 19 variações de expressão, 40 imagens de transição, uma introdução nova, resultados de corrida dedicados, mais feedback para o minigame, melhorias de mensagens e menus, créditos puláveis e localização estruturada em português e inglês.
</summary>

## Como usar este material

<instructions_for_content_generation>

- `CONTENT-01`: trate as seções “Fatos verificados” e a cronologia como base factual.
- `CONTENT-02`: trate “Impacto para o jogador” como interpretação editorial, não como resultado de teste com público.
- `CONTENT-03`: use “foi implementado”, “foi adicionado” ou “foi integrado” quando a evidência for apenas estática.
- `CONTENT-04`: não use “validado”, “perfeito”, “sem bugs”, “mais divertido”, “mais intuitivo” ou “melhor balanceado” sem evidência de Playtest.
- `CONTENT-05`: preserve spoilers de morte, sabotagem, acidente, finais e resultados; prefira enquadramentos fechados e comparações curtas.
- `CONTENT-06`: quando houver comparação “antes e depois”, use o commit da Tavern Jam como “antes” e o merge citado como “depois”.
- `CONTENT-07`: as sugestões de gancho, formato e benefício são não normativas; a head de marketing decide a versão publicada.

</instructions_for_content_generation>

## Recorte do levantamento

- **Repositório:** [edneyreis999/Jonny](https://github.com/edneyreis999/Jonny).
- **Build da Tavern Jam:** estado da `main` após o [PR #6 — add cena batida](https://github.com/edneyreis999/Jonny/pull/6).
- **Commit inicial, excluído do levantamento:** [`7c08cc5`](https://github.com/edneyreis999/Jonny/commit/7c08cc58e180e92caf345197c6756cc300954b1a), de 23/06/2026 às 14:50:40 (`America/Sao_Paulo`).
- **Última mudança funcional encontrada:** [PR #19 — tradução](https://github.com/edneyreis999/Jonny/pull/19), merge [`26922c1`](https://github.com/edneyreis999/Jonny/commit/26922c1834d7be0ff4b9888d40588632cf9cb925), de 21/07/2026 às 14:33:55.
- **Data do levantamento:** 13/08/2026.
- **Estado posterior ao PR #19:** os commits seguintes até a data do levantamento alteraram documentação, mas não produziram novo diff em `Jhonny/`.
- **Confiabilidade do marco:** alta para identificar o snapshot da jam; o GitHub não contém evidência de deploy automatizado, então o envio à plataforma provavelmente foi manual.

## Resumo quantitativo

Os números abaixo comparam o snapshot da Tavern Jam com o estado do jogo após o PR #19.

| Indicador | Resultado | Leitura correta |
| --- | ---: | --- |
| Pull Requests integrados | 13 | PRs #7 a #19 |
| Commits no intervalo | 54 | Inclui commits de branches, merges e documentação |
| Mudança funcional direta fora de PR | 1 | Commit dos mapas dedicados de resultado da corrida |
| Caminhos alterados em `Jhonny/` | 328 | 139 adicionados, 48 modificados e 141 removidos |
| Linhas no diff do jogo | +53.487 / -51.523 | Métrica inflada por JSON formatado e código de plugins de terceiros |
| Mapas | 16 → 26 | 10 mapas novos |
| Arquivos de áudio adicionados | 31 | 28 OGG, 2 MP3 e 1 WAV; inclui formatos ou cópias alternativas |
| Imagens adicionadas | 79 | 19 expressões, 15 cenários, 40 transições e 5 imagens de corrida |
| Plugins ativos | 5 → 16 | 11 integrações ativas novas; não significa 11 sistemas independentes |
| Chaves na tabela de idiomas | 456 | Colunas `Portuguese` e `English` |
| Referências `\tl{...}` encontradas | 3.531 | 419 chaves únicas referenciadas; nenhuma referência ausente na análise estrutural |
| Assets visuais padrão removidos | 141 | 120 pictures e 21 parallaxes não usados/padrão do RPG Maker |

## Principais melhorias

### IMP-01 — Limpeza do pacote e identidade visual mais própria

**Evidência:** [PR #7 — Melhorias Gerais](https://github.com/edneyreis999/Jonny/pull/7), merge em 01/07/2026.

**Fatos verificados**

- O PR revisou `CommonEvents.json` e os mapas 005, 009, 010 e 013.
- Retratos de Chance e Jonny e imagens de celular, estrada, formatura e quarto foram atualizados.
- Foram removidas 120 imagens padrão de personagens e 21 parallaxes padrão que não faziam parte da identidade final do jogo.
- O PR afetou 170 arquivos; alterações binárias não aparecem na contagem de linhas do GitHub.

**Impacto para o jogador — interpretação:** o jogo passa a depender menos do visual genérico do RPG Maker e apresenta um conjunto de cenas mais coerente com sua própria identidade.

**Oportunidade de conteúdo:** mostrar “o que saiu do build depois da jam” e explicar que polimento também é decidir o que não pertence ao jogo.

**Captura sugerida:** mosaico “assets padrão removidos → retratos e cenários próprios”, sem exibir pastas técnicas por muito tempo.

### IMP-02 — Personagens ganharam mais expressão durante os diálogos

**Evidência:** [PR #8 — Expressões de personagens](https://github.com/edneyreis999/Jonny/pull/8), merge em 02/07/2026.

**Fatos verificados**

- Foram adicionadas 10 variações de retrato para Chance e 9 para Jonny.
- `Map010` e `CommonEvents.json` receberam integração para apresentação das expressões.
- Foram adicionados e ativados Message Core, Picture Choices e Choice Common Events.
- O projeto passou a ter infraestrutura para combinar texto, escolhas e mudanças de expressão.

**Impacto para o jogador — interpretação:** reações faciais podem comunicar surpresa, dúvida, tensão e afeto sem depender apenas da fala escrita.

**Oportunidade de conteúdo:** “O texto era o mesmo; a conversa, não.” Comparar uma fala com retrato estático e a mesma fala com reação.

**Captura sugerida:** grade com as 19 expressões ou GIF de 4–8 segundos com três mudanças de emoção.

### IMP-03 — Mensagens, menu e qualidade de vida foram ampliados

**Evidência:** [PR #9 — Novos Plugins e ajustes](https://github.com/edneyreis999/Jonny/pull/9), merge em 03/07/2026.

**Fatos verificados**

- A tela de título, a janela do jogo e a fonte foram atualizadas.
- Foi adicionada uma música dedicada ao menu, `JonnyMenuMusic.ogg`.
- Foram integrados sistemas de opções, save, funções estendidas de mensagem, histórico de mensagens, som por letra e ocultação da caixa de diálogo.
- O arquivo do Event Title Scene foi adicionado, mas aparece inativo na configuração atual; ele não deve ser anunciado como funcional sem evidência adicional.

**Impacto para o jogador — interpretação:** a experiência narrativa ganha controles e conveniências mais próximas de uma visual novel, além de uma apresentação de menu mais alinhada ao jogo.

**Oportunidade de conteúdo:** um post sobre “as ferramentas invisíveis que deixam uma visual novel mais confortável”, com foco em histórico, ocultação de mensagens e opções.

**Captura sugerida:** vídeo saindo da tela de título, abrindo opções e demonstrando o histórico de mensagens. Tudo permanece pendente de Playtest antes de publicação.

### IMP-04 — A narrativa e a corrida ganharam uma camada sonora própria

**Evidência:** [PR #10 — sons e músicas](https://github.com/edneyreis999/Jonny/pull/10), merge em 06/07/2026.

**Fatos verificados**

- O PR adicionou 20 arquivos de áudio.
- Foram incluídas músicas para corrida, combate/tensão, finais feliz e triste.
- Foram incluídos efeitos de aceleração, SMS, frenagem, vidro quebrando, colisão, explosão e pneu furado.
- Common Events e múltiplos mapas foram atualizados para referenciar os novos sons.
- Outros 11 arquivos de áudio foram adicionados nos PRs #9, #14 e #17, totalizando 31 adições no período.

**Impacto para o jogador — interpretação:** ações e consequências podem ser percebidas também pelo som, dando mais antecipação, impacto e identidade às cenas.

**Oportunidade de conteúdo:** “Você entende a corrida de olhos fechados?” Alternar o mesmo trecho sem e com a nova camada sonora.

**Captura sugerida:** vídeo curto com áudio e legendas; GIF não demonstra esta melhoria.

### IMP-05 — A estrutura de diálogos foi simplificada sem remover a história

**Evidência:** [PR #11 — Sistematização de diálogos](https://github.com/edneyreis999/Jonny/pull/11), merge em 07/07/2026.

**Fatos verificados**

- O `Map013.json` passou por uma grande redução estrutural: 31.686 linhas removidas e 2.884 adicionadas no arquivo durante o PR.
- Três Common Events reutilizáveis foram preenchidos: `VN3_RaceGoodbye`, `VN3_CourageSip` e `VN3_RefuseKeysGoodbye`.
- A intenção registrada no commit foi reutilizar diálogos que antes estavam repetidos dentro do mapa.
- O PR completo removeu 32.284 linhas e adicionou 4.175, incluindo documentação e diagrama do trabalho.

**Impacto para o jogador — interpretação:** o conteúdo visível pode permanecer equivalente, enquanto futuras correções de texto e escolhas ficam menos propensas a divergir entre rotas.

**Oportunidade de conteúdo:** “Cortamos mais de 30 mil linhas sem cortar a história.” É o número técnico mais forte do período para um devlog.

**Captura sugerida:** animação de vários blocos repetidos convergindo para três eventos reutilizáveis; evitar mostrar uma parede de JSON.

### IMP-06 — O jogo recebeu uma nova introdução visual

**Evidência:** [PR #12 — Introdução](https://github.com/edneyreis999/Jonny/pull/12), merge em 07/07/2026.

**Fatos verificados**

- Foi criado o `Map017`, identificado no projeto como `Intro`.
- Foram adicionadas 13 imagens de cenário ligadas a escola, festa, garagem, caderno, mensagem, Opala, conserto e posições na corrida.
- Os mapas 010 e 011 e o índice de mapas foram ajustados para integrar a introdução.

**Impacto para o jogador — interpretação:** a abertura pode apresentar relações, memórias e ambições antes do fluxo principal, reduzindo a dependência de exposição por texto.

**Oportunidade de conteúdo:** “Quanto de uma vida cabe em uma introdução?” Mostrar a abertura como um álbum de memórias.

**Captura sugerida:** montagem rápida com caderno, escola, festa, garagem e Opala, cortando antes de spoilers narrativos.

### IMP-07 — A corrida ficou mais comunicativa e responsiva

**Evidência:** [PR #13 — Juice on race](https://github.com/edneyreis999/Jonny/pull/13), merge em 07/07/2026.

**Fatos verificados**

- `Jhonny_RaceHelper.js` recebeu 498 linhas novas e duas removidas.
- O PR registra HUD expandida, notificações de eventos, renderização de estado, logging estruturado e tratamento de interação dos botões.
- `CommonEvents.json` foi ajustado e o `System.json` recebeu nova versão do projeto.
- Registros de browser/Playwright foram versionados junto ao PR, mas a presença desses arquivos não equivale a aprovação humana de gameplay.

**Impacto para o jogador — interpretação:** as decisões da corrida podem produzir resposta visual mais imediata e deixar mais claro que o comando foi recebido e alterou o estado do minigame.

**Oportunidade de conteúdo:** “A corrida já calculava tudo. O problema era fazer o jogador sentir.” Explicar o ciclo entrada → feedback → consequência.

**Captura sugerida:** tela dividida com uma única ação no build da jam e após o PR #13, destacando HUD e resposta do botão.

### IMP-08 — Vitória e derrotas passaram a ter apresentações próprias

**Evidência:** commit direto [`97458cd — route race results to dedicated maps`](https://github.com/edneyreis999/Jonny/commit/97458cd271c7649f284d9cf1f94a6256703eec16), de 07/07/2026, complementado pelo [PR #14 — Pictures and choices](https://github.com/edneyreis999/Jonny/pull/14), merge em 09/07/2026.

**Fatos verificados**

- Foram criados três mapas: `Cena-Vitoria`, `Cena-Derrota-risk` e `Cena-Derrota-position`.
- O fluxo de resultado da corrida foi redirecionado para esses mapas dedicados.
- Foram adicionadas imagens específicas de Vitória, Derrota e Carro Quebrado.
- O PR #14 integrou escolhas por imagens e alterou sete arquivos de áudio, dos quais seis eram novos, ligados à vitória, derrotas, frenagem e transições.
- Os mapas de resultado e os mapas 005 e 013 foram revisados no mesmo ciclo.

**Impacto para o jogador — interpretação:** resultados diferentes deixam de ser apenas estados do sistema e podem receber ritmo, imagem e som próprios.

**Oportunidade de conteúdo:** dois posts possíveis: “A mesma escolha pesa mais quando vira imagem” e “Vitória e derrota merecem finais diferentes”.

**Captura sugerida:** tríptico com as três telas de resultado ou GIF da bifurcação, sem revelar o desfecho completo.

### IMP-09 — Busto, mensagens e escolhas passaram por seis rodadas de polimento

**Evidência:** [PR #15 — ajuste de busto](https://github.com/edneyreis999/Jonny/pull/15), merge em 10/07/2026.

**Fatos verificados**

- O PR reúne seis commits de ajustes sucessivos.
- Foram revisados Common Events e 13 mapas do jogo.
- As mensagens e escolhas foram padronizadas e a apresentação dos bustos foi ajustada ao longo das rodadas.
- Foi criada documentação durável sobre diálogos e escolhas repetidos.

**Impacto para o jogador — interpretação:** consistência de posição, nome, caixa de texto e escolha ajuda a interface a sair do caminho da conversa.

**Oportunidade de conteúdo:** “Se você não percebe este trabalho, talvez ele tenha funcionado.” Mostrar por que polimento exige várias passadas pequenas.

**Captura sugerida:** comparação piscando entre antes e depois, ou sequência dos commits `ajustes-1` a `ajuste 5`.

### IMP-10 — Créditos ganharam controle de pulo por teclado e toque

**Evidência:** [PR #16 — ajustes de mensagem e créditos](https://github.com/edneyreis999/Jonny/pull/16), merge em 14/07/2026.

**Fatos verificados**

- Foi criado e ativado o plugin próprio `Jhonny_CreditsSkip.js`.
- O plugin está configurado para os mapas 9 e 14.
- Os comandos OK, Cancel e Shift e a interação por toque estão habilitados na configuração atual.
- O PR também revisou mensagens, a tabela de idiomas e o fluxo de créditos.

**Impacto para o jogador — interpretação:** o encerramento continua reconhecendo a equipe, mas replays e sessões de teste podem avançar sem ficar presos à duração total dos créditos.

**Oportunidade de conteúdo:** “Adicionar conteúdo é design. Deixar o jogador pular também é.”

**Captura sugerida:** vídeo curto mostrando a indicação de pulo e a transição após o comando, pendente de Playtest.

### IMP-11 — Novas cenas e transições esconderam as costuras entre capítulos

**Evidência:** [PR #17 — ajuste v3-2](https://github.com/edneyreis999/Jonny/pull/17), merge em 17/07/2026, e [PR #18 — ajuste v3-3](https://github.com/edneyreis999/Jonny/pull/18), merge no mesmo dia.

**Fatos verificados**

- Foram adicionados seis mapas: `introCorrida`, `furarPneu`, `introVN2`, `posVN2`, `introVN3` e `posFimTRue`.
- Foram adicionadas 40 imagens de transição.
- Foram adicionados quatro arquivos de áudio: uma BGM e três efeitos.
- Imagens de corrida, barras, overlays, botões, placas, sinal e Opala em POV foram revistas.
- O Visual Cutin Effect foi adicionado e está ativo na configuração atual.
- Common Events e mapas narrativos foram expandidos; o PR #18 realizou três rodadas adicionais de polimento.

**Impacto para o jogador — interpretação:** transições, cut-ins, áudio e mapas intermediários podem substituir cortes puramente funcionais por continuidade visual e dramática.

**Oportunidade de conteúdo:** “O PR se chamava ajuste; dentro dele havia uma linguagem cinematográfica.”

**Captura sugerida:** supercut de SMS, pré-corrida, pós-corrida e pneu furado. Revisar cada frame para não revelar morte, sabotagem ou finais.

### IMP-12 — A localização PT/EN foi estruturada e ampliada

**Evidência:** trabalho iniciado nos PRs anteriores e consolidado no [PR #19 — tradução](https://github.com/edneyreis999/Jonny/pull/19), merge em 21/07/2026.

**Fatos verificados**

- O Message Core está ativo com localização habilitada.
- O idioma padrão configurado é `Portuguese`; os idiomas configurados são `Portuguese` e `English`.
- O formato efetivo configurado é TSV e o arquivo apontado é `data/Languages.tsv`.
- A tabela atual contém 456 chaves, sem chaves duplicadas e sem linhas com quantidade incorreta de colunas.
- Foram encontradas 3.531 referências `\tl{...}` em arquivos JSON, cobrindo 419 chaves únicas; nenhuma referência aponta para chave inexistente.
- O PR #19 adicionou 82 linhas à tabela e revisou os mapas 016 a 020 e 023 a 026.

**Impacto para o jogador — interpretação:** centralizar texto em uma tabela facilita manter termos consistentes e preparar o jogo para públicos em português e inglês.

**Oportunidade de conteúdo:** “Traduzir não foi trocar palavras; foi descobrir o que o jogo queria dizer.” Mostrar a mesma fala alternando idioma.

**Captura sugerida:** tela dividida entre uma chave na tabela e sua aparição no jogo. A qualidade da tradução, a troca no menu, as quebras de linha e as fontes ainda exigem Playtest/LQA.

## Cronologia completa do pós-jam

Datas abaixo usam o horário de São Paulo.

| Data | Entrega | Escopo registrado | Estatística do GitHub |
| --- | --- | --- | ---: |
| 01/07 | [PR #7 — Melhorias Gerais](https://github.com/edneyreis999/Jonny/pull/7) | Limpeza de assets, revisão de retratos, cenários e eventos | 170 arquivos; +50 / -40 linhas |
| 02/07 | [PR #8 — Expressões](https://github.com/edneyreis999/Jonny/pull/8) | 19 expressões e base de mensagens/escolhas | 26 arquivos; +10.200 / -29 |
| 03/07 | [PR #9 — Plugins e ajustes](https://github.com/edneyreis999/Jonny/pull/9) | Menu, fonte, janela, opções, save e recursos de mensagem | 15 arquivos; +9.786 / -47 |
| 06/07 | [PR #10 — Sons e músicas](https://github.com/edneyreis999/Jonny/pull/10) | Trilha e efeitos para corrida, cenas e finais | 31 arquivos; +1.694 / -1.612 |
| 07/07 | [PR #11 — Diálogos](https://github.com/edneyreis999/Jonny/pull/11) | Reutilização de diálogos e redução do Map013 | 5 arquivos; +4.175 / -32.284 |
| 07/07 | [PR #12 — Introdução](https://github.com/edneyreis999/Jonny/pull/12) | Mapa de introdução e 13 imagens narrativas | 17 arquivos; +2.216 / -13 |
| 07/07 | [PR #13 — Juice na corrida](https://github.com/edneyreis999/Jonny/pull/13) | HUD, notificações, renderização e interação | 11 arquivos; +15.026 / -11 |
| 07/07 | [`97458cd` — resultados dedicados](https://github.com/edneyreis999/Jonny/commit/97458cd271c7649f284d9cf1f94a6256703eec16) | Três novos mapas e roteamento dos resultados | 7 arquivos do jogo; +5.422 / -400 |
| 09/07 | [PR #14 — Pictures and choices](https://github.com/edneyreis999/Jonny/pull/14) | Escolhas visuais, telas de resultado e áudio do minigame | 18 arquivos; +1.684 / -2.370 |
| 10/07 | [PR #15 — Ajuste de busto](https://github.com/edneyreis999/Jonny/pull/15) | Seis rodadas de padronização de apresentação | 16 arquivos; +4.992 / -3.283 |
| 14/07 | [PR #16 — Mensagens e créditos](https://github.com/edneyreis999/Jonny/pull/16) | Créditos puláveis e avanço da localização | 8 arquivos; +858 / -25 |
| 17/07 | [PR #17 — Ajuste v3-2](https://github.com/edneyreis999/Jonny/pull/17) | Seis mapas, 40 transições, áudio e feedback visual | 132 arquivos; +14.032 / -208 |
| 17/07 | [PR #18 — Ajuste v3-3](https://github.com/edneyreis999/Jonny/pull/18) | Três rodadas de polimento em eventos, mapas e imagens | 13 arquivos; +623 / -237 |
| 21/07 | [PR #19 — Tradução](https://github.com/edneyreis999/Jonny/pull/19) | Expansão PT/EN e revisão de mapas | 10 arquivos; +246 / -84 |

> As estatísticas de linha não medem esforço nem impacto para o jogador. Imagens e áudio contam como arquivos alterados, mas normalmente como zero linhas; JSON reformatado e plugins de terceiros podem gerar milhares de linhas sem equivalência direta em conteúdo novo.

## Banco de pautas para posts diários e devlogs

| ID | Pauta | Gancho factual | Melhor formato | Evidência principal | Risco editorial |
| --- | --- | --- | --- | --- | --- |
| POST-01 | Um mês de evolução | 13 PRs transformaram o build da jam entre 23/06 e 21/07 | Timelapse de 45–60 s | PRs #7–#19 | Baixo |
| POST-02 | O que removemos depois da jam | 141 assets padrão foram retirados | Carrossel antes/depois | PR #7 | Baixo |
| POST-03 | Dar emoção a uma conversa | 19 expressões novas foram adicionadas | GIF ou carrossel | PR #8 | Baixo |
| POST-04 | Conforto de visual novel | Histórico, ocultação de mensagens, opções e save foram integrados | Vídeo de UI | PR #9 | Precisa Playtest |
| POST-05 | O mundo deixou de ser silencioso | 31 arquivos de áudio entraram no período | Vídeo com fones | PRs #10, #14 e #17 | Direitos e mix devem ser revistos |
| POST-06 | 30 mil linhas a menos | Map013 perdeu 31.686 linhas ao reutilizar diálogos | Motion graphic/diagrama | PR #11 | Evitar equiparar linhas a conteúdo removido |
| POST-07 | Uma vida em imagens | A nova introdução usa 13 imagens narrativas | Montagem/álbum | PR #12 | Moderado; pode antecipar história |
| POST-08 | O “juice” da corrida | O helper ganhou 498 linhas de HUD, feedback e interação | Antes/depois | PR #13 | Precisa Playtest |
| POST-09 | Três resultados, três emoções | Vitória e dois tipos de derrota ganharam mapas próprios | Tríptico | `97458cd` e PR #14 | Alto; spoilers |
| POST-10 | Escolhas deixaram de ser só listas | Picture Choices foi integrado ao fluxo | GIF de seleção | PR #14 | Precisa Playtest |
| POST-11 | A saga do polimento | Seis commits ajustaram bustos, mensagens e escolhas | Comparação quadro a quadro | PR #15 | Baixo |
| POST-12 | Respeitar o tempo do jogador | Créditos aceitam OK, Cancel, Shift e toque | Vídeo curto | PR #16 | Precisa Playtest |
| POST-13 | O PR “ajuste” que virou cinema | 40 imagens de transição e seis mapas foram adicionados | Supercut | PRs #17 e #18 | Alto; spoilers |
| POST-14 | Português e inglês | 456 chaves estruturam a localização PT/EN | Tela dividida | PR #19 | Precisa LQA |

## Sugestão de primeira sequência editorial

Esta ordem começa pelo que é mais fácil de demonstrar visualmente e alterna arte, áudio, UX e bastidor técnico:

1. `POST-08` — juice da corrida.
2. `POST-03` — expressões de personagens.
3. `POST-05` — som e música.
4. `POST-10` — escolhas por imagens.
5. `POST-06` — 30 mil linhas removidas sem cortar a história.
6. `POST-13` — transições cinematográficas.
7. `POST-14` — localização PT/EN.
8. `POST-01` — um mês de evolução, fechando a primeira série.

## Afirmações seguras e afirmações que exigem validação

### Seguras com base no GitHub e nos arquivos atuais

- “Adicionamos 10 mapas depois da Game Jam.”
- “Criamos 19 variações de expressão para Chance e Jonny.”
- “Adicionamos 31 arquivos de áudio no período.”
- “Criamos 40 imagens de transição.”
- “Separamos vitória e derrotas em mapas dedicados.”
- “Reduzimos a repetição de diálogos do Map013 por meio de Common Events.”
- “Estruturamos localização em português e inglês com 456 chaves.”
- “Adicionamos controles para pular os créditos por teclado e toque.”

### Exigem Playtest, captura ou revisão humana antes de publicar

- “A corrida ficou mais divertida, justa, clara ou responsiva.”
- “Os botões funcionam perfeitamente em teclado, mouse e toque.”
- “O áudio está bem mixado e sincronizado.”
- “As transições não têm cortes, atrasos ou tela preta.”
- “Todas as rotas e finais são alcançáveis.”
- “A tradução está natural e cabe corretamente nas janelas.”
- “O histórico, as opções, o save e a ocultação de mensagens funcionam em todos os contextos.”
- “Saves da versão da Game Jam são compatíveis com a versão posterior.”

## Checklist de produção para marketing

- Capturar o “antes” no commit [`7c08cc5`](https://github.com/edneyreis999/Jonny/commit/7c08cc58e180e92caf345197c6756cc300954b1a).
- Capturar o “depois” no merge ou commit indicado em cada pauta.
- Usar o mesmo save, resolução, volume e trecho nas comparações.
- Preferir GIF de 4–8 segundos para retratos, HUD, botões e transições.
- Usar vídeo com áudio para música, motor, freada, colisão e ritmo de cena.
- Colocar legendas em todo vídeo, pois parte do público verá o conteúdo sem som.
- Revisar nomes de arquivos e frames para esconder spoilers.
- Confirmar licenças e créditos dos assets de áudio antes de destacar faixas individualmente.
- Fazer Playtest do trecho exato que será anunciado.
- Encerrar cada post com uma pergunta específica ao público.

## Fontes e método

<facts>

- `SOURCE-01`: o marco da jam foi identificado no [README](README.md) e no registro [Jhonny — Publicação na Tavern Jam](docs/01-Notes/Jhonny/Jhonny%20-%20Publica%C3%A7%C3%A3o%20na%20Tavern%20Jam.md).
- `SOURCE-02`: metadados, títulos, datas, corpos e estatísticas dos PRs #7 a #19 foram consultados no GitHub.
- `SOURCE-03`: o intervalo `7c08cc5..26922c1` foi comparado localmente para quantificar mapas, imagens, áudio, plugins e remoções.
- `SOURCE-04`: `System.json`, `CommonEvents.json` e `MapInfos.json` foram aceitos por parser JSON.
- `SOURCE-05`: `js/plugins.js` passou por validação estrutural do envelope e extração read-only da lista de plugins ativos.
- `SOURCE-06`: `Languages.tsv` foi validado quanto a cabeçalho, número de colunas, unicidade de chaves e cobertura das referências `\tl{...}`.
- `SOURCE-07`: não foram encontradas issues do repositório criadas no recorte pós-jam; o material detalhado está concentrado em commits e PRs.

</facts>

## Limitações

- O levantamento prova mudanças versionadas, não a percepção real de jogadores.
- Binários não permitem inferir qualidade visual ou sonora por diff textual.
- O código de plugins comprova presença e ativação, mas não substitui teste em runtime.
- A validação de localização foi estrutural; troca de idioma, legibilidade e qualidade textual permanecem pendentes de Playtest/LQA.
- O relatório evita narrar detalhes dos finais; filenames no GitHub podem conter spoilers que não devem ser reproduzidos em postagens.
- Não há GitHub Release, workflow de deploy ou registro automatizado do upload da jam. O commit do PR #6 é o melhor snapshot disponível, com alta confiança.

## Formato recomendado para uma IA gerar cada peça

<output_format>

Para cada `POST-ID` selecionado, produzir:

1. `titulo`: uma frase curta, sem clickbait enganoso.
2. `gancho`: até duas frases apoiadas em um fato verificado.
3. `roteiro`: 4 blocos — antes, decisão, depois e bastidor.
4. `legenda_curta`: até 500 caracteres.
5. `legenda_devlog`: de 800 a 1.500 caracteres.
6. `lista_de_capturas`: de 2 a 5 imagens, GIFs ou vídeos necessários.
7. `fonte_github`: PR ou commit principal.
8. `spoiler_risk`: `baixo`, `moderado` ou `alto`.
9. `validation_needed`: testes ou revisões humanas ainda necessários.

Se faltar evidência para uma afirmação, marcar `needs-human-review` em vez de completar a lacuna por inferência.

</output_format>
