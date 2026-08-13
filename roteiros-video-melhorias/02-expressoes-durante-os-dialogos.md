---
title: "02 — Personagens ganharam mais expressão durante os diálogos"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos"
spoken_word_target: "aproximadamente 744 palavras (faixa de 650–850)"
validation_status: "structural_validation; runtime_pending"
---

# Personagens ganharam mais expressão durante os diálogos

## Ficha rápida

| Campo | Informação |
| --- | --- |
| Promessa | Mostrar como a mesma conversa muda de leitura quando Jonny e Chance deixam de sustentar um único retrato estático. |
| Antes | Branch `main`, SHA [`26909fd61d9912b207b933e754f6953aaf8e78d4`](https://github.com/edneyreis999/Jonny/tree/26909fd61d9912b207b933e754f6953aaf8e78d4) |
| Depois | Branch `feat/expressoes-de-personagens`, SHA [`5cdb39be55aac08584f77d570309f3a05ed67a87`](https://github.com/edneyreis999/Jonny/tree/5cdb39be55aac08584f77d570309f3a05ed67a87) |
| Evidência principal | [PR #8 — Expressões de personagens](https://github.com/edneyreis999/Jonny/pull/8) |
| Fatos verificáveis | Foram adicionadas 10 imagens `Jogador_*` para Chance e 9 `Jonny_*`; `Map010` e `CommonEvents.json` passaram a referenciá-las; Message Core, Picture Choices e Choice Common Events aparecem ativos. |
| Leitura editorial | As reações faciais **podem** acrescentar subtexto, humor e tensão à fala. Isso ainda não é resultado de Playtest. |
| Status de validação | Estrutura e assets conferidos nos snapshots; execução, timing, legibilidade e rotas permanecem pendentes. |
| Risco de spoiler | Baixo no começo de `Estrada_VN1`; alto depois que a conversa menciona a Curva do Diabo. Corte antes desse ponto. |

## Preparação da gravação

Execute a partir de `/Users/edney/projects/coreto/summer26`. Os worktrees ficam fora do workspace e usam SHAs imutáveis, não o estado atual das branches:

```bash
git worktree add --detach ../jhonny-video-02-antes 26909fd61d9912b207b933e754f6953aaf8e78d4
git worktree add --detach ../jhonny-video-02-depois 5cdb39be55aac08584f77d570309f3a05ed67a87
```

Em dois terminais separados, sirva somente a pasta do jogo de cada snapshot:

```bash
python3 -m http.server 8101 --directory ../jhonny-video-02-antes/Jhonny
python3 -m http.server 8102 --directory ../jhonny-video-02-depois/Jhonny
```

- Abra `http://127.0.0.1:8101` para o antes e `http://127.0.0.1:8102` para o depois, de preferência em perfis de navegador separados.
- No depois, **Novo jogo** aponta para o mapa 10, `Estrada_VN1`. No antes, o início aponta para o mapa 11; se a equipe autorizar uma transferência apenas na memória, use o console do navegador depois de iniciar o jogo: `$gamePlayer.reserveTransfer(10, 0, 1, 2, 0)`. Isso não altera arquivos. Se não funcionar, use o Plano B.
- Grave o mesmo trecho: “My next victory.” até “Speaking of that, how's school going?”. Capture sem notificações, saves pessoais ou console visível.
- Separe os PNGs `Jonny_1`, `Jonny_2`, `Jonny_3`, `Jonny_6`, `Jonny_7`, `Jonny_9`, `Jogador_1`, `Jogador_2`, `Jogador_4` e `Jogador_5` para B-roll. Os nomes emocionais abaixo são leituras visuais, exceto os Common Events explicitamente nomeados.

Depois da gravação, encerre os servidores e remova somente estes worktrees:

```bash
git worktree remove ../jhonny-video-02-antes
git worktree remove ../jhonny-video-02-depois
```

## Plano de capturas — 7 tomadas

1. Cartela “O texto era o mesmo; a conversa, não”, com os SHAs curtos `26909fd` e `5cdb39b`.
2. Comparação do mesmo momento, “My next victory.”: antes com retrato estático; depois com `Jonny_2`, visualmente sorridente e confiante.
3. [FREEZE] no depois, quando Chance responde “You're getting more full of yourself every day.” usando `Jogador_4`, com sobrancelhas tensas e gota de suor.
4. Sequência fechada no rosto: `Jonny_7` em “Surviving” → `Jonny_3` corado na fala sobre reputação → `Jogador_2` com sorriso provocador na réplica.
5. [B-ROLL] grade dos 19 arquivos adicionados, primeiro 9 de Jonny, depois 10 de Chance; não trate cada leitura de emoção como nome oficial.
6. [FREEZE] do diff de `Map010.json` destacando `Basic_GraphicChange`, `PictureID` e os arquivos reais `Jonny_2`, `Jogador_4` e `Jonny_3`.
7. [B-ROLL] de `CommonEvents.json` nos eventos 28–30, nomeados no arquivo como “Johnny Feliz”, “Johnny Neutro” e “Johnny Triste”, junto da escolha “Feliz / Neutro / Triste”. Mostre como evidência de infraestrutura, não como comportamento validado.

## Roteiro cronometrado

### 0:00–0:30 — Gancho

> O texto era o mesmo; a conversa, não. Na versão da jam, Jonny e Chance já apareciam como bustos durante o diálogo, mas cada um sustentava um retrato estático. Depois, a mesma troca ganhou mudanças de expressão no meio das falas. Um sorriso, uma gota de suor ou um rosto corado não acrescentam uma linha ao roteiro — e ainda assim podem alterar como a gente lê a intenção por trás daquela linha.

[NA TELA] Captura 1; corte seco para a captura 2 exatamente na palavra “depois”.

[EDIÇÃO] Identifique sempre “ANTES — 26909fd” e “DEPOIS — 5cdb39b”.

### 0:30–1:05 — O que o repositório comprova

> Esta comparação usa dois pontos exatos do repositório. O antes é a main no commit 26909fd. O depois é a branch feat/expressoes-de-personagens no commit 5cdb39b, ligada ao pull request número 8. Entre os dois estados, foram adicionadas dez variações de Chance, armazenadas como Jogador, e nove de Jonny. O mapa 10 e os eventos comuns também mudaram para chamar essas imagens. Portanto, aqui existe mais do que uma pasta de arte: existe integração registrada no diálogo.

[NA TELA] PR #8, links dos snapshots e contagem “10 Chance + 9 Jonny”.

[FREEZE] Dois segundos em “19 variações adicionadas”.

### 1:05–1:45 — O antes

> Vamos começar com o mesmo trecho no snapshot anterior. Jonny anuncia: “My next victory.” Chance rebate que ele está ficando cada dia mais convencido. A conversa já tinha alternância de falante, posição dos bustos e texto. O limite visual deste recorte é que os arquivos chamados são apenas Jonny e Jogador; o rosto não acompanha cada virada da provocação. Não significa que a cena não funcionava. Significa apenas que, nesta versão, quase todo o subtexto precisava vir das palavras e do ritmo da leitura.

[NA TELA] Antes em tela cheia; pare na fala “My next victory.” e deixe a réplica avançar uma vez.

[EDIÇÃO] Não use rótulo “ruim”; use “retrato estático neste recorte”.

### 1:45–2:35 — A primeira mudança visível

> Agora, o mesmo trecho no snapshot posterior. Antes de “My next victory.”, o evento troca o busto de Jonny para `Jonny_2`: olhos semicerrados e um sorriso confiante. Logo depois, antes da resposta de Chance, entra `Jogador_4`, com expressão tensa e uma gota de suor. A fala escrita continua igual neste recorte, mas a montagem oferece duas leituras visuais: a autoconfiança de quem já se declara vencedor e a reação desconfortável de quem escuta. É essa diferença que merece aparecer lado a lado, sem acelerar tanto que o rosto passe despercebido.

[NA TELA] Capturas 2 e 3; repita o depois uma vez em 80% da velocidade.

[FREEZE] Circule somente olhos, boca e gota de suor; não cubra a caixa de texto.

### 2:35–3:25 — Expressão também pode ser sutil

> O exemplo seguinte é ainda melhor para mostrar que expressão não precisa ser caricatura. Quando Chance pergunta sobre a escola, Jonny muda para `Jonny_7`, com um sorriso pequeno e o olhar mais baixo, e responde apenas: “Surviving”. Quando Chance revela que ouviu falar da boa nota, aparece `Jonny_3`, visivelmente corado, antes de ele pedir que não espalhem aquilo porque tem uma reputação a manter. A réplica usa `Jogador_2`, com um sorriso de provocação. Em poucos segundos, a cena passeia por reserva, constrangimento e brincadeira sem reescrever a conversa.

[NA TELA] Captura 4, com o nome técnico do PNG em legenda discreta.

[EDIÇÃO] Três cortes no mesmo enquadramento; preserve pelo menos um segundo em cada rosto.

### 3:25–4:10 — A paleta completa

> Esses são só alguns usos dentro do mapa 10. O pacote adicionado é maior: nove imagens de Jonny e dez de Chance. Para visualizar a escala sem fingir que todas já aparecem em todas as rotas, vale montar uma grade com os dezenove PNGs. Entre os arquivos de Jonny, por exemplo, `Jonny_2` foi associado ao Common Event chamado “Johnny Feliz”, `Jonny_7` ao “Johnny Neutro” e `Jonny_6` ao “Johnny Triste”. Esses nomes existem nos dados. Outras descrições, como “confiante” ou “provocador”, são leitura visual para orientar a edição, não categorias oficiais do jogo.

[B-ROLL] Captura 5; faça zoom apenas nos rostos e mantenha os nomes dos arquivos visíveis.

[EDIÇÃO] Não transforme a grade em lista de emoções canônicas.

### 4:10–4:55 — Como a troca foi costurada

> Por baixo da cena, a mudança é direta. O `Map010` contém comandos `Basic_GraphicChange` que conservam o mesmo Picture ID e substituem o arquivo do busto antes da fala correspondente. O projeto também passou a listar Message Core, Picture Choices e Choice Common Events como plugins ativos. No final da primeira página do evento, uma escolha “Feliz, Neutro, Triste” aponta para os Common Events 28, 29 e 30. Isso comprova a estrutura para combinar mensagem, escolha e troca de imagem. Não comprova, sozinho, o resultado visual em execução.

[NA TELA] Capturas 6 e 7, com destaque animado seguindo `Picture ID → arquivo → fala`.

[FREEZE] Cartela curta: “Integração estática confirmada; runtime pendente”.

### 4:55–5:35 — O impacto, sem exagero

> O ganho editorial é permitir que o rosto participe da escrita. Uma provocação pode parecer afetuosa, defensiva ou agressiva dependendo da reação que a acompanha. Um personagem que cora pode revelar o que tenta esconder no texto. Mas isso continua sendo uma hipótese de apresentação até alguém observar a cena rodando: a troca pode estar rápida demais, o busto pode cobrir a interface ou uma rota pode deixar a expressão errada na tela. Por isso, este vídeo mostra o que foi implementado e deixa a avaliação de qualidade para a validação humana.

[NA TELA] Volte à comparação antes/depois; sobreponha “FATO” no nome do asset e “LEITURA” na interpretação.

### 5:35–6:00 — Fecho

> Essa foi a melhoria número 2: dezenove variações de retrato e trocas integradas a `Estrada_VN1`. Mais que a quantidade, importa o momento em que cada rosto entra. Os snapshots e o PR número 8 estão na descrição. Antes de publicar, ainda precisamos revisar em execução o timing, a legibilidade e as rotas. O texto era o mesmo; agora o rosto também fala.

[NA TELA] Cartela final com “19 retratos • Map010 • PR #8”.

[EDIÇÃO] Termine no sorriso de `Jonny_2`; reserve dois segundos para a end card.

## Plano B — se a demonstração em jogo não colaborar

Não altere `System.json`, mapas ou saves para fabricar a comparação e não anuncie Playtest. Monte o vídeo com evidência estática: cartela dos SHAs → retratos antigos `Jonny` e `Jogador` → grade dos 19 PNGs novos → sequência isolada `Jonny_2 / Jogador_4 / Jonny_3 / Jogador_2` → diff de `Map010.json` → Common Events 28–30 → cartela `runtime_pending`. Para a tomada do “mesmo texto”, mostre lado a lado as linhas inalteradas do diálogo e os novos comandos `Basic_GraphicChange`. A tese continua demonstrável sem afirmar que a execução foi observada.

## Spoilers e validações pendentes

- Limite a gravação ao início de `Estrada_VN1`. Corte antes de “Devil's Curve”, da fala sobre ninguém sobreviver à corrida e de qualquer consequência posterior.
- Não mostre morte, sabotagem, acidente, finais, resultados da corrida nem contexto que antecipe esses acontecimentos.
- A escolha “Feliz / Neutro / Triste” e os Common Events 28–30 são evidência estrutural; confirme com a equipe se são conteúdo de produção, ferramenta de teste ou material que deve ficar apenas no B-roll técnico.
- Ainda exigem validação humana: carregamento dos 19 PNGs, posição e espelhamento dos bustos, sincronização da troca com a fala, persistência correta entre mensagens, funcionamento das escolhas, legibilidade, enquadramento e cobertura das rotas.
- Este roteiro não declara Playtest e não autoriza “validado”, “sem bugs”, “mais expressivo para todos” ou “melhor narrativa” na publicação.

## Checklist final de publicação

- [ ] Os links abrem os snapshots `26909fd61d9912b207b933e754f6953aaf8e78d4` e `5cdb39be55aac08584f77d570309f3a05ed67a87`, e o PR é o #8.
- [ ] A comparação usa o mesmo trecho e identifica claramente antes e depois.
- [ ] Há entre cinco e oito capturas; este plano prevê sete.
- [ ] Os números “10 para Chance, 9 para Jonny, 19 no total” aparecem sem sugerir que todas as variações foram vistas em runtime.
- [ ] As leituras visuais estão separadas dos nomes oficiais encontrados nos Common Events.
- [ ] Nenhum frame passa da conversa segura para a menção à Curva do Diabo ou revela eventos posteriores.
- [ ] Toda gravação em execução foi revisada por uma pessoa; se ela não existir ou falhar, o Plano B substitui esse material.
- [ ] A publicação mantém explícitos os gates pendentes de timing, legibilidade, escolhas e rotas.
- [ ] Nenhuma fala declara Playtest, aprovação, ausência de bugs ou superioridade comprovada.
