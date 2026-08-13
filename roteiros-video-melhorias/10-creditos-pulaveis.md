---
title: "10 — Créditos puláveis no primeiro final e no replay"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos"
spoken_word_target: "aproximadamente 713 palavras (faixa de 650–850)"
validation_status: "structural_validation; runtime_pending"
---

# Créditos puláveis no primeiro final e no replay

## Ficha rápida

| Campo | Informação |
| --- | --- |
| Objetivo | Mostrar que os créditos continuam existindo, mas receberam uma saída antecipada para quem conclui novamente ou precisa testar o encerramento. |
| Promessa | Comparar “assistir até o fim” e “pular conscientemente”, preservando o reconhecimento da equipe e mostrando a saída configurada para o replay. |
| Antes | `main` em [`3fd46a2564e48b07215f242604c033f502e8ebb4`](https://github.com/edneyreis999/Jonny/tree/3fd46a2564e48b07215f242604c033f502e8ebb4) |
| Depois | `feat/ajuste-v3-1` em [`2be503f710e04f4c0f88d42ee43882ba024fa378`](https://github.com/edneyreis999/Jonny/tree/2be503f710e04f4c0f88d42ee43882ba024fa378) |
| Evidência principal | [PR #16 — ajustes de mensagem e créditos](https://github.com/edneyreis999/Jonny/pull/16) |
| Fato verificável | O PR cria e ativa `Jhonny_CreditsSkip.js`, configurado para os mapas 9 e 14, com OK, Cancel, Shift e toque habilitados. |
| Escopo técnico | O plugin encerra apenas `Window_ScrollText`; depois, o evento continua e alcança o comando já existente de retorno ao título. |
| Estado da validação | Sintaxe, ativação, parâmetros e estrutura dos mapas foram verificados. Input, resposta imediata e retorno correto permanecem pendentes de Playtest. |

## Preparação da gravação

Crie os worktrees exclusivos deste vídeo na raiz do clone:

```bash
git worktree add --detach ../jhonny-video-10-antes 3fd46a2564e48b07215f242604c033f502e8ebb4
git worktree add --detach ../jhonny-video-10-depois 2be503f710e04f4c0f88d42ee43882ba024fa378
```

- Abra `../jhonny-video-10-antes/Jhonny/index.html` e `../jhonny-video-10-depois/Jhonny/index.html` por servidores locais em portas diferentes. Nunca compartilhe saves.
- Prepare dois saves descartáveis no “depois”: um antes da primeira conclusão que será mostrada e outro já no contexto de replay. Use a mesma rota apenas para reduzir variáveis; não revele qual desfecho é.
- Grave uma faixa central dos créditos por dois a quatro segundos. Cubra nomes, mensagens, imagens e qualquer texto que entregue personagens, destinos ou finais.
- Na primeira conclusão, deixe o scroll seguir brevemente e demonstre que pular é opcional. No replay, pressione uma única entrada e registre o tempo até a tela seguinte.
- Teste separadamente OK, Cancel, Shift e toque/mouse. Não monte quatro tentativas como se fossem uma única captura contínua.
- No “antes”, mostre apenas que a mesma tecla acelera o scroll, se isso ocorrer; não espere os créditos completos em câmera.

Depois da gravação, remova somente estes worktrees:

```bash
git worktree remove ../jhonny-video-10-antes
git worktree remove ../jhonny-video-10-depois
```

## Capturas planejadas

1. Cartela “Antes / Depois” com os SHAs curtos `3fd46a2`, `2be503f` e PR #16.
2. [FREEZE] do PR mostrando `Jhonny_CreditsSkip.js` adicionado e `plugins.js` alterado.
3. Mesmo recorte mascarado do scroll no antes e no depois, sem nomes legíveis.
4. Primeira conclusão no “depois”: deixe quatro segundos rodarem, sem pressionar nada, e use a legenda “assistir continua disponível”.
5. Replay no “depois”: pressione OK e [FREEZE] no último quadro do scroll e no primeiro quadro após o encerramento.
6. Grade de testes curtos: Cancel, Shift e toque/mouse, cada um rotulado como tentativa independente.
7. [B-ROLL] parâmetros efetivos: mapas `9,14`; OK, Cancel, Shift e Touch em `true`.
8. Fluxo técnico sem conteúdo: `Scrolling Text → terminateMessage → próximo comando → Return to Title`.

## Roteiro cronometrado

### 0:00–0:40 — Gancho

> Créditos são parte do jogo: reconhecem quem trabalhou e oferecem um momento de encerramento. Mas o mesmo tempo tem outro peso quando a pessoa já terminou uma vez, procura outra rota ou testa o final pela décima vez. Depois da Game Jam, Jhonny recebeu uma opção simples para esses dois contextos coexistirem: assistir aos créditos normalmente ou encerrar o texto rolante com uma entrada. Hoje vamos mostrar a primeira conclusão e o replay sem abrir os nomes nem revelar qual final levou até ali.

[NA TELA] Captura 1; entre em uma faixa mascarada de créditos e corte antes de qualquer nome legível.

[EDIÇÃO] Selo discreto: “Configuração verificada · funcionamento pendente de Playtest”.

### 0:40–1:20 — Versões e evidência

> O antes é a main no commit 3fd46a2. O depois é a branch feat/ajuste-v3-1 no commit 2be503f, ligada ao pull request número 16. O diff adiciona um plugin próprio de cem linhas chamado Jhonny Credits Skip e registra sua ativação em plugins.js. Ele está configurado para os mapas 9 e 14. Também há quatro permissões em true: OK, Cancel, Shift e toque. Isso comprova instalação e intenção; ainda não comprova resposta de teclado, controle, mouse ou touchscreen em execução.

[NA TELA] Capturas 2 e 7, com zoom somente no nome, status e cinco parâmetros.

[FREEZE] “Ativo no snapshot · mapas 9 e 14”.

### 1:20–2:10 — O antes não era um pulo

> No engine anterior, OK, Shift e toque já podiam acelerar o texto rolante para três vezes a velocidade, quando o evento permitia avanço rápido. Acelerar não é o mesmo que pular: o scroll continua percorrendo seu conteúdo. O novo plugin intercepta a janela de Scrolling Text apenas nos mapas configurados. Se uma entrada permitida estiver pressionada, ele encerra a mensagem. Cancel é uma adição importante nessa lista. Na comparação, cronometre do mesmo ponto e descreva somente o que a captura realmente reproduzir.

[NA TELA] Captura 3 em tela dividida; use tarjas “acelerar” e “tentativa de pulo”.

[EDIÇÃO] Não escreva “instantâneo” até medir o intervalo no Playtest gravado.

### 2:10–3:00 — Primeira conclusão: escolha assistir

> Se a primeira conclusão estiver disponível para uma tomada revisada, a demonstração começa sem apertar nada. Deixe alguns segundos passarem para mostrar que os créditos não foram removidos nem substituídos. A pessoa ainda pode acompanhar o scroll. Então interrompa a captura antes que nomes ou detalhes narrativos fiquem legíveis. O ponto editorial é escolha, não pressa: preservar um encerramento completo para quem quer vê-lo e oferecer uma saída para outra necessidade. Não diga que todo jogador percebe o recurso, porque a configuração não adiciona, por si só, uma instrução visível na tela.

[NA TELA] Captura 4, com máscara sólida sobre o texto e contador de quatro segundos.

[FREEZE] Cartela: “Primeira conclusão: assistir continua disponível”.

### 3:00–3:50 — Replay: testar o pulo

> Agora carregue o save de replay e chegue ao mesmo trecho. Pressione OK uma vez e marque o quadro exato da entrada. O plugin foi escrito para encerrar o texto rolante; ele não envia o jogador diretamente ao título. Depois do encerramento, o evento retoma sua lista normal. Nos dois mapas, a estrutura contém um bloco de noventa e oito linhas de scroll seguido por Return to Title. Se a tela de título aparecer, podemos registrar esse resultado nesta sessão. Se houver atraso, travamento ou outra tela, mantenha o ocorrido e marque a validação como falha.

[NA TELA] Captura 5 com indicador visual de tecla e cronômetro quadro a quadro.

[EDIÇÃO] Evite corte entre a entrada e a tela seguinte; a continuidade é parte da evidência.

### 3:50–4:35 — Quatro entradas, quatro testes

> A configuração habilita OK, Cancel, Shift e toque. Isso não significa que uma única tentativa valide todas. Faça quatro testes independentes, reiniciando o mesmo estado antes de cada um. Para OK, Cancel e Shift, registre também se o controle físico mapeia corretamente os símbolos esperados. Para toque, teste mouse no navegador e touchscreen apenas se houver dispositivo disponível. O plugin consulta entrada pressionada, não apenas o primeiro clique; por isso observe se manter o botão durante a chegada aos créditos provoca um pulo não intencional.

[NA TELA] Captura 6 em grade, com resultado individual: “passou”, “falhou” ou “não testado”.

[B-ROLL] Mostre o checklist de input sem conteúdo dos créditos ao fundo.

### 4:35–5:20 — O que essa conveniência não muda

> Pular os créditos não apaga o reconhecimento da equipe: o conteúdo permanece no jogo e a primeira captura mostra que ele pode continuar rodando. Também não é atalho para escolher um final, alterar flags ou começar outro capítulo. O escopo do código é menor: detectar o mapa, detectar uma entrada e terminar a janela de texto. A leitura de que isso ajuda replays e sessões de teste é editorial. Para afirmar que ficou claro, confortável e sem acionamentos acidentais, precisamos observar pessoas usando o recurso e testar todos os dispositivos previstos.

[NA TELA] Captura 8; mantenha o diagrama simples e sem nomes de mapas narrativos.

[FREEZE] “Conteúdo preservado · saída opcional · experiência ainda em validação”.

### 5:20–6:00 — Fecho

> A melhoria do PR 16 é pequena no tamanho e precisa no objetivo. Jhonny ganhou um plugin próprio, ativo em dois mapas de créditos, com quatro famílias de entrada habilitadas. Na primeira conclusão, mostramos que assistir continua sendo uma opção. No replay, verificamos se a pessoa consegue seguir adiante sem esperar o scroll completo. Os snapshots e o pull request estão na descrição. Antes de publicar, a equipe ainda precisa confirmar cada input, o momento do pulo, a continuidade do evento, o retorno ao título e a ausência de acionamento involuntário. Até lá, dizemos “foi implementado”, não “funciona em todos os casos”.

[NA TELA] End card com PR #16, dois SHAs e “Playtest pendente”.

[EDIÇÃO] Termine na tela de título ou em cartela neutra, nunca em uma linha reveladora dos créditos.

## Plano B — se o Playtest não colaborar

Não regrave créditos de outro commit nem simule uma tecla bem-sucedida. Monte uma sequência auditável: snapshots → plugin novo → ativação em `plugins.js` → parâmetros `9,14` e quatro entradas → trecho do código que chama `terminateMessage` → estrutura anonimizada dos mapas, com `Scrolling Text` seguido de `Return to Title`. Rotule o fluxo como **“comportamento implementado — runtime não confirmado”**. Para preservar spoilers, represente as 98 linhas por uma barra, sem texto real.

## Spoilers e validações pendentes

- Nunca mostre nomes, funções, agradecimentos, mensagens, imagens de final, mortes, sabotagem, acidente, resultados ou a rota que levou aos créditos. Use máscara opaca, recorte central sem texto ou conteúdo substituto claramente rotulado.
- Playtest obrigatório nos mapas 9 e 14: assistir sem input; OK; Cancel; Shift; controle; mouse; toque real quando disponível; botão mantido antes do scroll; pulo no começo, meio e fim; continuidade; retorno ao título; áudio; repetição após carregar save.
- Revisão humana obrigatória: descoberta do recurso, risco de pulo acidental, clareza de qualquer indicação visual, tempo de resposta, acessibilidade e adequação da demonstração de primeira conclusão/replay.
- A inspeção estática confirmou `node --check`, envelope de `plugins.js`, ativação, parâmetros, um bloco de 98 linhas e `Return to Title` em cada mapa. Ela não validou input, timing, UI, áudio, continuidade ou ausência de regressões.

## Checklist final de publicação

- [ ] Links, branches e SHAs correspondem a `main`/`3fd46a2` e `feat/ajuste-v3-1`/`2be503f`; o PR é o #16.
- [ ] Há entre cinco e oito capturas e nenhuma revela texto ou imagem dos créditos.
- [ ] O vídeo distingue acelerar no antes de encerrar o scroll no depois.
- [ ] A primeira conclusão mostra que assistir permanece disponível; o replay testa a saída opcional.
- [ ] OK, Cancel, Shift e toque aparecem como testes independentes, com falhas e itens não testados visíveis.
- [ ] O vídeo não afirma que o plugin volta ao título diretamente; o retorno pertence ao comando seguinte do evento.
- [ ] Mapas 9 e 14, input, continuidade e retorno foram Playtestados ou permanecem explicitamente pendentes.
- [ ] Nenhum save, final, nome, agradecimento ou dado pessoal aparece.
- [ ] A fala lida fica próxima de seis minutos, com pausas para freezes e end card.
