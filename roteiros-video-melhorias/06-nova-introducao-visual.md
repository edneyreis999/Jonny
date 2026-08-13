---
title: "06 — A nova introdução visual de Jhonny"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos"
spoken_word_target: "aproximadamente 681 palavras (faixa de 650–850)"
validation_status: "structural_validation; runtime_pending"
---

# A nova introdução visual de Jhonny

## Ficha rápida

| Campo | Informação |
| --- | --- |
| Objetivo | Apresentar a nova introdução como um álbum de memórias, mostrando imagens e costura visual sem resumir a história. |
| Promessa | Explicar como escola, caderno, garagem, Opala, corrida, festa e mensagem passaram a formar matéria visual para a abertura. |
| Antes | `main` em [`fcf82b5eb688ff6d0f4473ce76ffaf9885760dd5`](https://github.com/edneyreis999/Jonny/tree/fcf82b5eb688ff6d0f4473ce76ffaf9885760dd5) |
| Depois | `feat/intro` em [`27856061841c2ba039103a5f1063a180f008ab4a`](https://github.com/edneyreis999/Jonny/tree/27856061841c2ba039103a5f1063a180f008ab4a) |
| Evidência principal | [PR #12 — Introdução](https://github.com/edneyreis999/Jonny/pull/12) |
| Fato verificável | O commit cria `Map017`, registrado como `Intro`, adiciona 13 PNGs narrativos e toca `Map010`, `Map011` e `MapInfos.json`. |
| Integração observada | `Map017` chama nove imagens, usa fades e termina com transferência para `Map010`; `Map010` recebeu um fade-in. A entrada normal em `Map017` não foi localizada estaticamente. |
| Leitura editorial | A sequência **pode** funcionar como álbum de memórias; compreensão, ritmo, emoção e continuidade exigem Playtest e revisão humana. |

## Nota sobre a comparação

Os dois SHAs compartilham a base `1e2b431`, mas `feat/intro` não descende do merge `fcf82b5`. Para não atribuir a esta melhoria mudanças de outra branch, use os snapshots para as capturas e o commit `2785606`/PR #12 para delimitar o escopo: 17 caminhos, 13 deles imagens novas. Não apresente o diff total entre os dois SHAs como se fosse exclusivamente a introdução.

## Preparação da gravação

Na raiz do clone, crie worktrees exclusivos para este vídeo:

```bash
git worktree add --detach ../jhonny-video-06-antes fcf82b5eb688ff6d0f4473ce76ffaf9885760dd5
git worktree add --detach ../jhonny-video-06-depois 27856061841c2ba039103a5f1063a180f008ab4a
```

- Abra `../jhonny-video-06-antes/Jhonny/index.html` e `../jhonny-video-06-depois/Jhonny/index.html` por servidores locais em portas diferentes. Não compartilhe saves.
- No “antes”, grave apenas a ausência de `Map017` e dos 13 assets; não percorra a narrativa para fabricar uma cena equivalente.
- No “depois”, inicie um jogo descartável. Como não foi localizada uma transferência direta para `Map017`, use o console de Playtest, se necessário: `$gamePlayer.reserveTransfer(17, 0, 0, 2, 0);`.
- Se usar esse salto, mantenha na tela “acesso por depuração — alcance normal pendente”. Ele demonstra o mapa real, não prova sua entrada pelo fluxo normal.
- Capture somente o começo seguro da sequência: pátio, corredor e um recorte do caderno que esconda texto legível. Depois faça tomadas isoladas de garagem e conserto, sem falas completas.
- Não mostre as artes `primeiroLugar`, `segundoLugar` ou `ultimoLugar` em contexto narrativo. Evite também o conteúdo legível da imagem `mensagem`.

Depois da gravação, remova somente estes worktrees:

```bash
git worktree remove ../jhonny-video-06-antes
git worktree remove ../jhonny-video-06-depois
```

## Capturas planejadas

1. Cartela “Antes / Depois” com `fcf82b5`, `2785606` e PR #12.
2. [FREEZE] `MapInfos.json` antes, terminando no mapa 16, e depois, com o mapa 17 chamado `Intro`.
3. Trecho real do começo de `Map017`: pátio → corredor → recorte não legível do caderno, com a caixa de texto cortada ou coberta.
4. Dois recortes breves: garagem e conserto do Opala, sem revelar a conversa que os acompanha.
5. Um fade entre duas imagens, em velocidade normal, seguido de replay a 50% apenas para análise visual.
6. [B-ROLL] mosaico seguro com pátio, corredor, caderno, garagem, conserto e Opala; rotule Opala como “asset adicionado”, não como cena confirmada de `Map017`.
7. Diff de `Map017` sem diálogos: destaque nove comandos de imagem e a transferência final para `Map010`.
8. `Map010` recebendo o fade-in após o salto, seguido da cartela “13 imagens adicionadas · 9 referenciadas em Map017 · Playtest pendente”.

## Roteiro cronometrado

### 0:00–0:40 — Gancho

> Antes de uma história pedir que a gente escolha um caminho, ela pode abrir uma caixa de lembranças. Uma escola, um caderno, uma garagem, um carro sendo consertado: imagens separadas que, colocadas em sequência, sugerem uma vida anterior ao primeiro grande conflito. Depois da Game Jam, Jhonny ganhou uma nova introdução visual construída com esse material. Hoje vamos tratá-la como um álbum de memórias: mostrar algumas páginas, entender a costura e parar antes que o álbum revele demais.

[NA TELA] Captura 1, seguida por flashes de pátio, caderno e garagem.

[EDIÇÃO] Legenda permanente e discreta: “Estrutura verificada · ritmo e compreensão pendentes de Playtest”.

### 0:40–1:25 — Recorte e evidência

> O antes é a main no commit fcf82b5. O depois é a branch feat/intro no commit 2785606, ligada ao pull request número 12. Há uma cautela: essas duas pontas saem da mesma base, mas a branch da introdução não contém o merge anterior da main. Por isso, não usamos o diff bruto inteiro como prova. O recorte correto é o commit de introdução: dezessete caminhos, incluindo o novo Map017, os mapas 010 e 011, o índice de mapas e treze imagens.

[NA TELA] Links imutáveis, PR #12 e [FREEZE] na lista dos 17 caminhos do commit.

[B-ROLL] Mostre `Map017.json` e `MapInfos.json`; não role por textos narrativos.

### 1:25–2:15 — As páginas do álbum

> As treze imagens adicionadas cobrem Opala, duas artes de racha, caderno, conserto do carro, corredor e pátio da escola, festa, garagem, mensagem e três posições de corrida. Todas são PNGs de 1536 por 864 pixels. Mas presença no pacote e uso na cena são fatos diferentes: neste snapshot, Map017 chama diretamente nove delas. Opala, Racha1, segundo lugar e último lugar aparecem como assets adicionados, sem chamada direta encontrada no mapa. Na edição, mostre esse segundo grupo apenas como material disponível, não como momento executado.

[NA TELA] Captura 6; agrupe os thumbnails por “referenciado em Map017” e “adicionado ao pacote”.

[FREEZE] Texto: “13 adicionadas · 9 chamadas diretamente”.

### 2:15–3:05 — Escola e caderno, sem entregar a história

> Para mostrar a introdução sem transformá-la em resumo, grave só o primeiro movimento seguro. O pátio estabelece um lugar. O corredor aproxima a câmera daquele cotidiano. O caderno muda a escala e aponta para algo pessoal. Essa sequência é a base da metáfora do álbum: cada imagem acrescenta uma pista, enquanto a narração completa continua guardada para quem jogar. Não diga que o público entende imediatamente quem são essas pessoas ou por que essas lembranças importam. Mostre que o evento combina imagens e falas; a leitura do conjunto vem depois.

[NA TELA] Captura 3, no máximo quatro segundos por imagem; cubra ou corte a caixa de texto.

[EDIÇÃO] Use som de virada de página apenas na edição, identificado como efeito do vídeo, não como áudio do jogo.

### 3:05–3:55 — Garagem, Opala e movimento

> O segundo bloco pode aproximar o álbum do carro sem revelar resultados. Garagem e conserto do Opala permitem sugerir uma relação construída ao longo do tempo. As artes de corrida ampliam essa memória para movimento e competição, mas as imagens de colocação devem ficar fora da montagem principal. Aqui, o trabalho de direção é escolher detalhes: uma ferramenta, uma silhueta, parte do carro. O vídeo precisa comunicar passagem de tempo e recorrência, não explicar o destino de ninguém nem antecipar vitória ou derrota.

[NA TELA] Captura 4 e um detalhe fechado de `Racha2`; não mostre telas de colocação.

[B-ROLL] Captura 5, com rótulo “fade em execução — confirmação limitada a esta sessão”.

### 3:55–4:45 — A costura técnica e o limite do fluxo

> Por baixo das imagens existe um evento autorun. Ele alterna fade-out, troca de picture, fade-in e diálogo, e termina transferindo para Map010. Map010 ganhou um fade-in no início para receber essa passagem. O commit também toca Map011, que permanece no fluxo do prólogo para Map010, mas a inspeção não encontrou uma transferência direta para Map017. Por isso o salto de depuração deve ser declarado na captura. Ele prova que o mapa pode ser aberto para teste; não prova que um jogo novo chega até ele pela rota planejada.

[NA TELA] Captura 7, seguida da captura 8; destaque somente códigos de picture, fade e transferência.

[FREEZE] “Alcance normal de Map017: pendente”.

### 4:45–5:25 — O que a metáfora permite dizer

> Chamar essa introdução de álbum de memórias é uma interpretação editorial. Ela ajuda a montar o vídeo porque organiza os recortes por lembrança, passagem de tempo e associação visual. O que não podemos afirmar é que a abertura ficou clara, bem ritmada, emocionante ou livre de confusão. Para isso, alguém precisa jogar do início, observar a duração de cada quadro, ler os textos, ouvir o áudio e conferir a transição até a cena seguinte. O repositório mostra a intenção materializada; a recepção pertence ao Playtest.

[NA TELA] Mosaico seguro com a tarja “interpretação editorial”.

[EDIÇÃO] Não use selos como “nova abertura definitiva”, “mais clara” ou “melhor ritmo”.

### 5:25–6:00 — Fecho

> A mudança do PR 12 é concreta: um mapa chamado Intro, treze imagens novas e uma sequência visual que atravessa escola, caderno, garagem, carro, corrida, festa e mensagem. Para apresentar isso sem spoiler, basta abrir poucas páginas do álbum e deixar as restantes fechadas. Os links dos dois snapshots e do PR estão na descrição. Antes de publicar, ainda precisamos confirmar o acesso pelo fluxo normal, a ordem das imagens, os fades, a legibilidade, o áudio, o ritmo e a entrega para Map010. Até lá, dizemos “foi implementado”, não “foi validado”.

[NA TELA] Cartela final com PR #12, SHAs e “Playtest pendente”.

[EDIÇÃO] Termine no caderno fechado ou na garagem; não encerre em imagem de resultado.

## Plano B — se a introdução não executar

Não altere o snapshot para fingir uma rota completa. Grave uma montagem estática verificável: `MapInfos` antes/depois → pasta com os 13 PNGs → mosaico seguro → lista das nove referências em `Map017` → sequência de comandos de fade → transferência final para `Map010`. Rotule toda simulação de ordem como **“reconstrução a partir do evento — runtime não confirmado”**. Se o salto de depuração falhar, não use captura de outro commit como substituta.

## Spoilers e validações pendentes

- Não exiba diálogos completos, o conteúdo legível da mensagem, colocações de corrida, acidentes, sabotagem, morte, finais ou consequências de escolhas.
- Playtest obrigatório: jogo novo; entrada normal em `Map017`; execução do autorun; ordem e duração das nove imagens; fades; texto e áudio; escala/corte dos PNGs; remoção da picture; transferência e fade-in em `Map010`; controle devolvido ao jogador.
- Revisão humana obrigatória: compreensão sem contexto externo, ritmo, legibilidade, coerência da cronologia, impacto emocional, acessibilidade visual e adequação dos recortes para publicação.
- A inspeção estática validou o parse de `Map010`, `Map011`, `Map017` e `MapInfos`, os 13 arquivos PNG, nove referências diretas e a transferência para `Map010`. Ela não validou alcance, execução, timing, áudio, leitura, emoção ou continuidade percebida.

## Checklist final de publicação

- [ ] Links, branches e SHAs correspondem a `main`/`fcf82b5` e `feat/intro`/`2785606`; o PR é o #12.
- [ ] A atribuição usa os 17 caminhos do commit de introdução, não o diff bruto entre branches divergentes.
- [ ] Há entre cinco e oito capturas, com no máximo três imagens consecutivas da abertura real.
- [ ] O salto para `Map017`, se usado, está claramente rotulado como depuração.
- [ ] As 13 imagens são chamadas de assets adicionados; apenas nove são apresentadas como referenciadas diretamente em `Map017`.
- [ ] Nenhuma arte de colocação, mensagem legível, diálogo completo ou desfecho aparece em contexto.
- [ ] Compreensão, ritmo, emoção, alcance normal, fades, áudio e continuidade permanecem marcados como Playtest pendente.
- [ ] A equipe revisou a captura real e aprovou os recortes antes da publicação.
- [ ] A fala lida fica próxima de seis minutos, com pausas para freezes e end card.
