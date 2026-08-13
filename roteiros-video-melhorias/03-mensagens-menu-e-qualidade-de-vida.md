---
title: "03 — Mensagens, menu e qualidade de vida foram ampliados"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos"
spoken_word_target: "aproximadamente 728 palavras (faixa de 650–850)"
validation_status: "structural_validation; runtime_pending"
---

# Mensagens, menu e qualidade de vida foram ampliados

## Ficha rápida

| Campo | Informação |
| --- | --- |
| Objetivo | Demonstrar como título, diálogos, opções, save e controles de mensagem receberam uma camada de apresentação e conveniência mais próxima de uma visual novel. |
| Promessa | Mostrar ferramentas que podem deixar a leitura mais confortável sem confundir integração estática com comportamento já aprovado em Playtest. |
| Antes | `main` em [`82b36947c89840bac7c2c6bc9e12a2b4480af524`](https://github.com/edneyreis999/Jonny/tree/82b36947c89840bac7c2c6bc9e12a2b4480af524) |
| Depois | `feat/message-features` em [`232bd7450f95c8f7cadce18e4d9644314c04f39c`](https://github.com/edneyreis999/Jonny/tree/232bd7450f95c8f7cadce18e4d9644314c04f39c) |
| Evidência principal | [PR #9 — Novos Plugins e ajustes](https://github.com/edneyreis999/Jonny/pull/9) |
| Fato verificável | O diff adiciona a fonte `Sweetest Cat Ever`, a música `JonnyMenuMusic.ogg`, troca a imagem de título e `Window.png` e integra plugins de opções, save e mensagens. |
| Limite | O arquivo `VisuMZ_4_EventTitleScene.js` existe, mas o plugin está **inativo** (`status: false`) neste snapshot. Não o anuncie nem o demonstre como funcional. |
| Estado da validação | Estrutura inspecionada; título, fonte, janela, áudio, opções, save, histórico, ocultação e demais controles permanecem **pendentes de Playtest**. |

## Preparação da gravação

Crie worktrees exclusivos para este vídeo a partir da pasta que contém `Jhonny`:

```bash
git worktree add --detach ../jhonny-video-03-antes 82b36947c89840bac7c2c6bc9e12a2b4480af524
git worktree add --detach ../jhonny-video-03-depois 232bd7450f95c8f7cadce18e4d9644314c04f39c
```

- Abra `../jhonny-video-03-antes/Jhonny/index.html` e `../jhonny-video-03-depois/Jhonny/index.html` por servidores locais em portas diferentes. Não reutilize saves entre snapshots.
- No “depois”, prepare um save descartável antes de uma conversa sem spoiler e três falas curtas que possam alimentar o histórico.
- Capture o áudio do sistema. A versão anterior referencia `Theme4`; a posterior referencia `JonnyMenuMusic` como BGM do título.
- Teste previamente **Page Up** para o histórico e **Tab** para ocultar a mensagem, pois são as teclas configuradas no snapshot. Se não responderem, use o Plano B.
- Evite a abertura narrativa real, o aviso de conteúdo completo e qualquer escolha com consequência. Uma fala neutra de teste é suficiente.
- Deixe abertos os dois snapshots, a aba **Files changed** do [PR #9](https://github.com/edneyreis999/Jonny/pull/9/files) e uma cartela “Playtest pendente”.

Depois da gravação, remova somente estes worktrees:

```bash
git worktree remove ../jhonny-video-03-antes
git worktree remove ../jhonny-video-03-depois
```

## Capturas planejadas

1. Cartela “Antes / Depois” com os SHAs curtos `82b3694` e `232bd74` e o PR #9.
2. Tela de título antes/depois, com áudio: imagem, comando de menu, janela e troca de `Theme4` por `JonnyMenuMusic`.
3. Mesmo diálogo neutro nos dois snapshots, enquadrando a fonte e a textura de `Window.png`.
4. Menu de opções posterior: navegue por uma configuração simples e mostre, sem prometer persistência, as superfícies de áudio, controles ou autosave que estiverem visíveis.
5. Tela de save posterior: abra a grade configurada em estilo `box`, crie um save descartável e tente carregá-lo.
6. Console inferior de mensagem posterior, se aparecer: `AUTO`, `FAST`, `LOG`, `HIDE`, `SAVE`, `LOAD`, `CONFIG` e `TITLE`.
7. Histórico posterior após três falas neutras; tente abri-lo pelo botão `LOG`, por **Page Up** ou rolando para cima.
8. Ocultação posterior: [FREEZE] com caixa visível, pressione **Tab** ou `HIDE`, e [FREEZE] no mesmo quadro sem a caixa.

## Roteiro cronometrado

### 0:00–0:40 — Gancho

> Nem toda melhoria de uma visual novel é uma cena nova. Algumas ficam entre a história e quem está lendo: uma fonte mais adequada, uma janela mais reconhecível, um histórico para recuperar uma fala e a opção de esconder a caixa para observar a arte. Depois da Game Jam, Jhonny recebeu justamente essa camada. Hoje vamos comparar dois snapshots e mostrar o que foi integrado ao título, ao menu, ao save e às mensagens — com uma regra importante: o Git comprova a configuração; a experiência ainda precisa ser confirmada em Playtest.

[NA TELA] Captura 1; corte rápido para título, diálogo, opções, save, histórico e ocultação.

[EDIÇÃO] Selo discreto durante o vídeo: “Implementado no snapshot · comportamento pendente de Playtest”.

### 0:40–1:20 — Versões e evidência

> O antes é a main no commit 82b3694. O depois é a branch feat/message-features no commit 232bd74, ligada ao pull request número 9. O diff tem quinze caminhos: música, fonte, imagem de título, textura de janela, arquivos de dados e sete arquivos de plugin. Na configuração anterior havia oito plugins ativos. Na posterior existem quinze entradas: quatorze ativas e uma inativa. Assim, a comparação não depende de memória nem de uma versão atual que já recebeu outras mudanças.

[NA TELA] PR #9, os dois links imutáveis e a lista curta dos quinze caminhos.

[FREEZE] Destaque: “Depois: 15 entradas · 14 ativas · Event Title Scene inativo”.

### 1:20–2:10 — Título, música e identidade visual

> Comecemos pela primeira impressão. A imagem `byebyeJohnny` foi atualizada, a janela de comandos deixou o modo transparente e passou a usar a moldura, e a música do título mudou de `Theme4` para o arquivo dedicado `JonnyMenuMusic`. O sistema também passou da fonte `JollyLodger` para `Sweetest Cat Ever`, com tamanho-base menor. Se a captura funcionar, ouça alguns segundos de cada versão e observe o mesmo menu nos dois lados. Podemos dizer que esses arquivos e parâmetros mudaram. Se a composição, a legibilidade e o volume combinam melhor com o jogo é uma avaliação humana, ainda em aberto.

[NA TELA] Captura 2 em tela dividida; normalize apenas o volume de gravação, não os arquivos do jogo.

[B-ROLL] Mostre por dois segundos os nomes `JonnyMenuMusic.ogg`, `Sweetest Cat Ever.ttf`, `Window.png` e `byebyeJohnny.png`.

### 2:10–2:55 — Fonte, janela e controles de leitura

> Na conversa, a mudança fica mais concreta. O Message Core foi configurado para iniciar as mensagens com a nova fonte, e a textura de janela também foi substituída. Além disso, as funções estendidas listam botões para modo automático, avanço rápido, histórico, ocultação, save, load, configurações e retorno ao título. Há ainda som por letra, configurado com o efeito `Cursor1` a cada dois caracteres. Grave uma fala neutra e deixe o público ver e ouvir. Só chame cada recurso de funcional se ele realmente responder durante essa sessão.

[NA TELA] Capturas 3 e 6; faça zoom na fonte, na moldura e nos botões, sem cobrir a personagem.

[EDIÇÃO] Se o som por letra estiver claro, inclua waveform e legenda “configuração: Cursor1 / intervalo 2”. Se não estiver, corte o áudio e marque “não confirmado”.

### 2:55–3:45 — Opções e save

> Duas integrações ampliam a qualidade de vida fora do diálogo: Options Core e Save Core. A configuração inclui categorias de opções, remapeamento de teclado e controle e um atalho de volume mestre. No save, o layout escolhido é o estilo em caixas, com seis posições visíveis por página, retrato do personagem e opção de autosave. Na demonstração, altere apenas algo reversível, saia e volte para observar se a escolha persiste. Depois crie um save descartável e tente carregá-lo. A presença das telas é evidência visual; persistência, compatibilidade e restauração correta continuam sendo testes, não promessas.

[NA TELA] Capturas 4 e 5, com dados de save preparados só para gravação.

[FREEZE] Antes de carregar: “Não compartilhar saves entre os dois snapshots”.

### 3:45–4:40 — Histórico e ocultação

> Agora entram duas conveniências muito ligadas a visual novels. O Message Log está ativo, guarda até cinquenta entradas na configuração e pode aparecer no menu; o atalho indicado é Page Up. Mostre três frases neutras, avance e tente recuperar a primeira pelo histórico. Em seguida, volte ao diálogo e teste a ocultação com Tab ou com o botão HIDE. Segure o mesmo quadro antes e depois para que a diferença seja legível. O objetivo é demonstrar a utilidade real: reler o que passou e limpar a tela para observar a imagem, sem revelar uma conversa importante.

[NA TELA] Capturas 7 e 8. Use frases de teste como “Primeira linha”, “Segunda linha” e “Terceira linha”.

[EDIÇÃO] Se um comando falhar, não repita até mascarar o problema; corte para o Plano B e mantenha “Playtest pendente”.

### 4:40–5:25 — O que não deve ser vendido

> Existe um detalhe essencial neste PR. O arquivo Event Title Scene foi adicionado, mas sua entrada está com `status: false`. Portanto, ele não faz parte da lista de recursos funcionais deste vídeo. Também não devemos transformar plugin instalado em selo de conforto garantido. Precisamos verificar foco de teclado, controle, mouse, toque, legibilidade, volume do som por letra, funcionamento do histórico, retorno do save e qualquer conflito entre atalhos. A formulação correta é: esses sistemas foram adicionados e configurados; o comportamento observado na gravação vale para a rota e o ambiente testados.

[NA TELA] [FREEZE] no status `false` do Event Title Scene; depois, cartela “arquivo presente não é plugin ativo”.

[B-ROLL] Checklist curto: teclado · controle · áudio · save/load · histórico · ocultação.

### 5:25–6:00 — Fecho

> Esta melhoria não muda apenas o que Jhonny conta; muda as ferramentas oferecidas durante a leitura. O título ganhou imagem, janela, fonte e música revisadas. Opções e save receberam novas superfícies. As mensagens ganharam controles, histórico, som por letra e ocultação. Isso aproxima a apresentação de uma visual novel mais equipada, como leitura editorial — não como resultado de pesquisa com jogadores. Os snapshots e o PR estão na descrição para qualquer pessoa conferir. Antes de publicar, a equipe ainda precisa executar o checklist de Playtest e aprovar o que realmente apareceu na captura.

[NA TELA] Montagem final com capturas 2, 4, 5, 7 e 8; encerre nos links e SHAs.

[EDIÇÃO] Não inclua Event Title Scene na cartela de benefícios. Deixe dois segundos para a end card.

## Plano B — se o Playtest não colaborar

Monte uma demonstração estática e auditável: cartela dos snapshots → imagem de título antes/depois → `Window.png` e amostra da fonte → referência de `JonnyMenuMusic` no `System.json` → lista dos plugins e respectivos status → parâmetros de opções, save, histórico e ocultação. Para histórico e `HIDE`, use mockups claramente rotulados como **“configuração esperada — não captura de runtime”**; nunca simule clique, áudio, persistência ou resposta de tecla. Narre que o comportamento segue pendente e mantenha Event Title Scene fora dos benefícios.

## Spoilers e validações pendentes

- Não mostre aviso de conteúdo completo, morte, suicídio, acidente, sabotagem, escolhas decisivas, finais ou resultados da corrida. Use falas neutras e saves descartáveis sem nomes reveladores.
- Playtest obrigatório: boot dos dois snapshots; título e BGM; fonte e janela em diferentes tamanhos de fala; botões de mensagem; `AUTO` e `FAST`; som por letra; Page Up/rolagem no histórico; Tab/`HIDE`; teclado, controle, mouse e toque aplicáveis; opções e persistência; save, load e autosave; retorno seguro ao título.
- Revisão humana obrigatória: legibilidade, contraste, volume e repetição do som por letra, clareza dos ícones/rótulos, sobreposição com bustos, conforto dos atalhos e compatibilidade dos saves.
- A inspeção estática validou o envelope de `plugins.js`, a lista/status dos plugins, o parse dos JSONs selecionados e a presença das mudanças no diff. Ela **não** validou execução, áudio, input, aparência, timing ou persistência.

## Checklist final de publicação

- [ ] Links, branches e SHAs correspondem a `main`/`82b3694` e `feat/message-features`/`232bd74`; o PR é o #9.
- [ ] O vídeo usa entre cinco e oito capturas e inclui título, fonte/janela, música, opções, save, histórico e ocultação.
- [ ] Event Title Scene aparece apenas como **inativo** e não está na lista de recursos funcionais.
- [ ] Cada comportamento mostrado foi reproduzido nesta gravação; falhas ou itens não testados permanecem marcados como Playtest pendente.
- [ ] Nenhum save foi compartilhado entre snapshots e nenhum dado pessoal aparece.
- [ ] Não há spoilers de conteúdo sensível, escolhas, acidente, sabotagem, morte, finais ou resultados.
- [ ] A fala evita “validado”, “sem bugs”, “mais confortável” ou “mais intuitivo” como fatos sem evidência humana.
- [ ] Áudio, legibilidade, persistência, controles e save/load foram revisados pela equipe antes da publicação.
- [ ] A leitura completa fica próxima de seis minutos, com pausas para freezes e end card.
