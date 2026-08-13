---
title: "08 — Resultados e escolhas visuais"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos"
spoken_word_target: "aproximadamente 670 palavras (faixa de 650–850)"
validation_status: "structural_validation; runtime_pending"
---

# Resultados da corrida e escolhas visuais

## Ficha rápida

| Campo | Informação |
| --- | --- |
| Promessa | Mostrar que estados de resultado receberam apresentações dedicadas e que escolhas por imagem foram integradas, sem revelar os desfechos. |
| Antes | `main` em [`007c245164c8976149427309f6c3e11c12525716`](https://github.com/edneyreis999/Jonny/tree/007c245164c8976149427309f6c3e11c12525716), pai do commit que introduziu os mapas de resultado. |
| Depois | `feat/pictures-and-choices` em [`1ae74c9efe6171ba9fc911ce0219c51ccbf94265`](https://github.com/edneyreis999/Jonny/tree/1ae74c9efe6171ba9fc911ce0219c51ccbf94265), snapshot completo do ciclo. |
| Evidências | [Commit `97458cd` — route race results to dedicated maps](https://github.com/edneyreis999/Jonny/commit/97458cd271c7649f284d9cf1f94a6256703eec16) e [PR #14 — Pictures and choices](https://github.com/edneyreis999/Jonny/pull/14). |
| Fatos verificáveis | O commit `97458cd` criou `Map018` (`Cena-Vitoria`), `Map019` (`Cena-Derrota-risk`) e `Map020` (`Cena-Derrota-position`) e redirecionou o fluxo de resultados. O PR #14 complementou o ciclo com as imagens `Vitoria`, `Derrota` e `CarroQuebrado`, escolhas por imagem e alterações de áudio ligadas a resultados, frenagem e transições. |
| Leitura editorial | Apresentações próprias **podem** dar ritmo e distinção visual a estados diferentes. Não é uma conclusão de Playtest sobre alcance das rotas, input, timing ou impacto no jogador. |

## Preparação da gravação

Execute a partir de `/Users/edney/projects/coreto/summer26` e crie os worktrees específicos deste roteiro:

```bash
git worktree add --detach ../jhonny-video-08-antes 007c245164c8976149427309f6c3e11c12525716
git worktree add --detach ../jhonny-video-08-depois 1ae74c9efe6171ba9fc911ce0219c51ccbf94265
```

- Os dois links usam commits, portanto são snapshots imutáveis: o **antes** é o estado da `main` imediatamente antes do commit de resultados; o **depois** é o estado completo da branch de pictures and choices. Diga isso na gravação para não parecer uma comparação de branches móveis.
- Deixe abertos o [antes](https://github.com/edneyreis999/Jonny/tree/007c245164c8976149427309f6c3e11c12525716), o [depois](https://github.com/edneyreis999/Jonny/tree/1ae74c9efe6171ba9fc911ce0219c51ccbf94265), o [commit de resultados](https://github.com/edneyreis999/Jonny/commit/97458cd271c7649f284d9cf1f94a6256703eec16) e [Files changed do PR #14](https://github.com/edneyreis999/Jonny/pull/14/files).
- Grave cada apresentação como um recorte de dois a quatro segundos: entrada da imagem, uma pausa e corte antes de qualquer texto que explique o resultado. Use um arquivo separado para Vitória, Derrota-risk e Derrota-position.
- Para escolhas por imagem, grave somente a tela de opções, sem pressionar nada. Não afirme que uma rota é alcançável, que o toque/teclado funciona ou que o tempo de transição está correto sem Playtest.
- Mantenha a trilha do jogo audível em uma faixa separada, mas não use áudio como prova de timing ou mixagem. Se houver dúvida sobre direito de publicação, deixe apenas o som ambiente e peça revisão responsável.

Após a gravação, remova somente estes worktrees:

```bash
git worktree remove ../jhonny-video-08-antes
git worktree remove ../jhonny-video-08-depois
```

## Capturas e cues planejados

1. Cartela: “Resultado não é só um número”, com `007c245` → `1ae74c9`.
2. [FREEZE] do commit `97458cd` mostrando a criação de `Map018` (`Cena-Vitoria`), `Map019` (`Cena-Derrota-risk`) e `Map020` (`Cena-Derrota-position`).
3. Tríptico spoiler-safe: bordas/entradas das três cenas de resultado, com o centro da imagem e textos narrativos cobertos.
4. Mosaico de assets: `Vitoria`, `Derrota`, `CarroQuebrado`, exibidos como thumbnails sem contexto de enredo.
5. [FREEZE] do PR #14 mostrando a integração de Picture Choices e os arquivos de áudio alterados.
6. Escolha visual parada: dois ou mais cards/imagens, cursor parado e sem confirmar uma opção.
7. [B-ROLL] diagrama de fluxo: `estado da corrida → mapa dedicado → imagem/som → continuação`.
8. Cartela final de pendências: “rotas, input e timing requerem Playtest”.

## Roteiro cronometrado

### 0:00–0:35 — Gancho

> Quando uma corrida termina, um número interno pode até dizer o que aconteceu. Mas ele não decide sozinho como aquele momento chega à pessoa jogando. Nesta melhoria, os resultados passaram a ter lugares próprios para aparecer, com imagens, escolhas visuais e uma camada de áudio no mesmo ciclo de trabalho. Vamos mostrar a mudança sem contar o desfecho: só o suficiente para entender como um estado do sistema pode ganhar apresentação. É a diferença entre receber uma resposta e receber um momento para entender essa resposta.

[NA TELA] Cartela 1; entre no diagrama de fluxo antes de mostrar qualquer imagem de resultado.

[EDIÇÃO] Use o aviso “imagens recortadas para evitar spoilers” no canto inferior.

### 0:35–1:15 — Duas evidências, duas etapas

> A comparação começa no commit 007c245, que é o pai do commit de resultados e representa o antes na main. O depois é o commit 1ae74c9, um snapshot completo da branch feat/pictures-and-choices. Os dois são links imutáveis: eles não mudam quando uma branch avança. Entre eles, o commit 97458cd criou o Map018, Cena-Vitoria; o Map019, Cena-Derrota-risk; e o Map020, Cena-Derrota-position. Depois, o pull request 14 complementou o ciclo com imagens, escolhas por imagem e alterações de áudio.

[NA TELA] Abra os quatro links em sequência; fixe os dois SHAs de comparação na tela.

[FREEZE] Captura 2, com legenda: “Fato: três mapas de resultado criados”.

### 1:15–2:00 — O que mudou no fluxo

> Antes, o resultado da corrida já era um estado que o jogo precisava resolver. Nesta alteração, o fluxo foi redirecionado para mapas dedicados. Pense nesses mapas como três palcos: Cena-Vitoria, Cena-Derrota-risk e Cena-Derrota-position. O Git registra que esses mapas foram criados e que o fluxo foi apontado para eles. O que ele não prova sozinho é se todas as condições chegam a cada palco, se voltam corretamente, ou se uma pessoa consegue alcançá-los por input normal.

[NA TELA] Diagrama: `resultado → Map018 / Map019 / Map020 → continuação`, sem setas para finais.

[B-ROLL] Mostre apenas o nome de cada mapa, não sua cena completa.

### 2:00–2:50 — Três apresentações sem entregar a história

> Agora vemos as três apresentações como um tríptico. A ideia não é dizer quem venceu, quem perdeu ou por quê. Vamos observar a porta de entrada de cada tela: cor, enquadramento e a presença de uma imagem dedicada. Foram integradas imagens de Vitória, Derrota e Carro Quebrado. A interpretação editorial é que imagens específicas podem dar uma pausa e uma identidade maior a estados que antes seriam apenas consequência de uma regra. Isso ainda não mede impacto emocional nem clareza para quem joga. O recorte é deliberado: mostrar a linguagem da cena sem entregar sua resposta narrativa.

[NA TELA] Captura 3: três janelas de dois segundos, com máscaras sobre texto e elementos conclusivos.

[FREEZE] No mosaico de thumbnails: “Fato: três imagens específicas integradas”.

### 2:50–3:40 — Escolher vendo, não só lendo

> O mesmo ciclo incluiu Picture Choices. A proposta visual é simples de entender: em vez de uma opção aparecer apenas como texto, uma escolha pode ser apresentada também por imagem. Nesta gravação, paramos antes de confirmar qualquer card. Assim mostramos a interface sem afirmar que os controles, os destinos ou a janela de tempo estão aprovados. O PR documenta a integração; a interação real precisa ser percorrida em Playtest, com teclado, toque ou o método que o projeto oferecer. A imagem pode convidar a escolher, mas o vídeo não finge saber o que acontece depois do clique.

[NA TELA] Captura 6, cursor imóvel; aplique blur aos textos que revelem consequência.

[EDIÇÃO] Sem clique, sem som de confirmação e sem corte que sugira uma rota alcançada.

### 3:40–4:30 — Imagem, som e transição

> O PR 14 também alterou sete arquivos de áudio, seis deles novos, ligados a vitória, derrotas, frenagem e transições. Essa é uma evidência de que a apresentação não foi pensada só como imagem. Mas nome de arquivo e referência no projeto não equivalem a mixagem pronta, sincronismo perfeito ou direito de publicação confirmado. Nesta parte, deixamos um recorte breve respirar com o áudio capturado, se ele estiver autorizado e claro; caso contrário, usamos o diagrama e legendas.

[NA TELA] Captura 5: nomes de áudio e imagem aparecendo como camadas do mesmo palco.

[B-ROLL] Diagrama 7 ganha os rótulos “imagem” e “som”; não toque trechos de final.

### 4:30–5:15 — Fato, leitura e teste pendente

> Vamos separar as três coisas. Fato: três mapas de resultado, imagens específicas, Picture Choices e arquivos de áudio foram integrados. Leitura editorial: resultados distintos podem ganhar ritmo, imagem e som próprios. Teste pendente: confirmar cada rota, cada entrada de escolha, cada transição e cada retorno. Essa separação não diminui a melhoria. Ela deixa o vídeo mais útil, porque mostra o que já está documentado e aponta exatamente o que a equipe precisa verificar antes de fazer promessas maiores.

[NA TELA] Tela em três colunas: “integrado”, “interpretação”, “verificar em Playtest”.

[FREEZE] Deixe a coluna “verificar” por três segundos.

### 5:15–6:00 — Fecho

> O resultado de uma corrida pode ser calculado em uma variável, mas a memória daquele momento é construída pela apresentação. Este ciclo criou três mapas dedicados e os complementou com imagens, escolhas por imagem e áudio. Os snapshots, o commit e o PR estão na descrição para conferência. A versão segura deste vídeo mostra os sinais visuais sem resolver a narrativa na tela. Antes de publicar uma demonstração completa, resta validar rotas, input, timing, retornos e possíveis spoilers em Playtest humano.

[NA TELA] Cartela final com os links e “estrutura integrada; demonstração completa pendente de Playtest”.

[EDIÇÃO] Deixe dois segundos de respiro com a máscara spoiler-safe; não encerre em uma imagem que revele o desfecho.

## Plano B — se não for seguro abrir os resultados no jogo

Não force estados por console, save editado ou comandos improvisados, e não mostre uma tela inteira só porque ela está acessível no editor. Monte o vídeo com evidência estática: SHAs imutáveis → commit que cria os três mapas → thumbnails recortadas de `Vitoria`, `Derrota` e `CarroQuebrado` → integração de Picture Choices no PR → diagrama de fluxo → cartela de Playtest pendente. A narração pode afirmar as criações e integrações registradas, mas deve dizer que a demonstração de runtime foi adiada para evitar spoilers e conclusões sem teste.

## Spoilers e validações pendentes

- Cubra textos, nomes de personagens, consequências e a parte central das telas de Vitória/Derrota. Não explique acidente, sabotagem, morte, final ou resultado específico.
- Não declare que qualquer rota é alcançável, que os mapas são chamados na condição certa, que as escolhas recebem input, que a transição tem timing correto ou que o retorno funciona. Tudo isso depende de Playtest humano.
- Revise direitos e créditos antes de publicar qualquer áudio; a presença de arquivos no repositório não comprova autorização de divulgação.
- Peça à equipe uma aprovação explícita do nível de recorte/blur antes de publicar o tríptico spoiler-safe.

## Checklist final de publicação

- [ ] Os links de antes, depois, commit `97458cd` e PR #14 abrem; os snapshots exibem `007c245` e `1ae74c9`.
- [ ] O vídeo explica que o antes é o pai, na main, do commit de resultados e que o depois é o snapshot imutável da branch.
- [ ] Os worktrees usados são `../jhonny-video-08-antes` e `../jhonny-video-08-depois`.
- [ ] Os mapas aparecem com IDs e nomes corretos: `Map018` (`Cena-Vitoria`), `Map019` (`Cena-Derrota-risk`) e `Map020` (`Cena-Derrota-position`).
- [ ] As imagens `Vitoria`, `Derrota` e `CarroQuebrado` aparecem sem revelar contexto narrativo.
- [ ] Há de cinco a oito capturas/cues e uma versão spoiler-safe que dispensa demonstração completa em runtime.
- [ ] A escolha visual é exibida sem confirmação de input ou destino.
- [ ] O vídeo não declara Playtest, rotas, input, timing, retorno, direitos ou mixagem como validados.
