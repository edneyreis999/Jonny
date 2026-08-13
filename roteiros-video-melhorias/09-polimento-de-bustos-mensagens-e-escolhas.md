---
title: "09 — Polimento de bustos, mensagens e escolhas"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos"
spoken_word_target: "aproximadamente 661 palavras (faixa de 650–850)"
validation_status: "structural_validation; runtime_pending"
---

# Polimento de bustos, mensagens e escolhas

## Ficha rápida

| Campo | Informação |
| --- | --- |
| Promessa | Tornar visível o trabalho que normalmente passa despercebido: ajustes repetidos de bustos, caixa de mensagem e escolhas em várias cenas. |
| Antes | `main` em [`8589e439c8b2db83e244153e603228f00bc79b13`](https://github.com/edneyreis999/Jonny/tree/8589e439c8b2db83e244153e603228f00bc79b13) |
| Depois | `feat/ajuste-busto` em [`30cc57f6c0ff2447bc93e2ae85dffafc1bd9c730`](https://github.com/edneyreis999/Jonny/tree/30cc57f6c0ff2447bc93e2ae85dffafc1bd9c730) |
| Evidência principal | [PR #15 — ajuste de busto](https://github.com/edneyreis999/Jonny/pull/15) |
| Fatos verificáveis | O PR reúne seis commits sucessivos, revisa Common Events e 13 mapas; mensagens e escolhas foram padronizadas e a apresentação dos bustos foi ajustada. |
| Leitura editorial | Repetir regras de posição, nome, caixa de texto e escolha **pode** fazer a interface disputar menos atenção com a conversa. A consistência percebida exige revisão de capturas e Playtest. |
| Tom | Calmo, comparativo e atento ao detalhe: se o espectador quase não percebe, o polimento pode estar fazendo seu trabalho. |

## Preparação da gravação

Execute a partir de `/Users/edney/projects/coreto/summer26` e crie os dois worktrees destacados exclusivos deste roteiro:

```bash
git worktree add --detach ../jhonny-video-09-antes 8589e439c8b2db83e244153e603228f00bc79b13
git worktree add --detach ../jhonny-video-09-depois 30cc57f6c0ff2447bc93e2ae85dffafc1bd9c730
```

Sirva os projetos em portas separadas:

```bash
python3 -m http.server 8901 --directory ../jhonny-video-09-antes/Jhonny
python3 -m http.server 8902 --directory ../jhonny-video-09-depois/Jhonny
```

- Abra o [snapshot antes](https://github.com/edneyreis999/Jonny/tree/8589e439c8b2db83e244153e603228f00bc79b13), o [snapshot depois](https://github.com/edneyreis999/Jonny/tree/30cc57f6c0ff2447bc93e2ae85dffafc1bd9c730) e [Files changed do PR #15](https://github.com/edneyreis999/Jonny/pull/15/files).
- Abra `http://127.0.0.1:8901` e `http://127.0.0.1:8902` em perfis separados. Comece uma sessão nova em cada snapshot; não compartilhe saves nem edite mapas, eventos, switches ou variáveis para alinhar as cenas.
- Capture o mesmo enquadramento em pelo menos três cenas seguras. Para cada uma, registre antes e depois com resolução, janela e zoom idênticos; isso torna a comparação piscando legível.
- Prepare um guia de alinhamento discreto na edição — uma linha horizontal e outra vertical — para comparar posição de busto, nome, caixa e escolha. Remova o guia depois do freeze explicativo.
- Grave cada cena isolada. Não monte uma sequência que pareça provar os 13 mapas: ela só ilustra os ajustes. Revise as tomadas antes de afirmar qualquer consistência perceptível.
- Oculte falas que revelem decisões, mortes, sabotagens, acidentes, finais e resultados de corrida. O foco é a moldura da conversa, não o conteúdo dela.

Depois de gravar, encerre os servidores e remova somente os worktrees indicados:

```bash
git worktree remove ../jhonny-video-09-antes
git worktree remove ../jhonny-video-09-depois
```

## Capturas e cues planejados

1. Cartela: “O polimento que você quase não vê”, com os SHAs curtos.
2. [FREEZE] do PR #15: seis commits e o contador `Common Events + 13 mapas`, sem exibir nomes de mapas com spoilers.
3. Comparação piscando da cena A: antes/depois, duas alternâncias lentas e linhas-guia temporárias.
4. Comparação piscando da cena B, com o texto borrado e foco na posição do busto e caixa.
5. Comparação piscando da cena C, focada na posição de uma escolha; não selecione nenhuma opção.
6. [B-ROLL] de miniaturas das três cenas em uma grade, com etiquetas “busto”, “mensagem” e “escolha”.
7. [FREEZE] de um trecho curto do diff em Common Events, sem rolagem de JSON e sem texto narrativo legível.
8. Cartela final: “13 mapas revisados; consistência em runtime requer revisão”.

## Roteiro cronometrado

### 0:00–0:35 — Gancho

> Há melhorias que pedem aplauso porque chegam com uma cena nova. E há melhorias que fazem um trabalho mais discreto: impedir que a atenção saia da conversa para procurar onde está o personagem, o nome ou a escolha. Este vídeo é sobre esse segundo tipo. Vamos olhar para seis commits de ajustes em bustos, mensagens e escolhas, usando comparações rápidas para enxergar o que um jogador talvez apenas sinta como uma apresentação mais organizada.

[NA TELA] Cartela 1; entre em uma cena desfocada, revelando primeiro linhas-guia e depois a interface limpa.

[EDIÇÃO] A fala “mais organizada” deve aparecer como leitura editorial, não como selo de qualidade.

### 0:35–1:15 — O que está documentado

> O antes é o commit 8589e43, da main. O depois é o commit 30cc57f, da branch feat/ajuste-busto, reunido no pull request número 15. O histórico do PR reúne seis commits de ajustes sucessivos. Ele revisa Common Events e treze mapas do jogo, enquanto mensagens e escolhas foram padronizadas e a apresentação dos bustos recebeu ajustes. Isso é a evidência estrutural. Ela mostra esforço distribuído por cenas; não mostra, sozinha, que todo enquadramento está perceptivelmente consistente.

[NA TELA] Abra o PR #15, destaque o título, os SHAs e os seis commits.

[FREEZE] Legenda: “Fato: 6 commits, Common Events e 13 mapas revisados”.

### 1:15–2:00 — Como enxergar polimento

> Para ver polimento, não precisamos ler o arquivo inteiro. Vamos usar uma comparação piscando: a mesma cena, no mesmo tamanho, alternando antes e depois duas vezes. As linhas-guia aparecem só neste momento. Elas ajudam a observar o contorno do busto, a margem da caixa, a área do nome e a posição da escolha. Depois as linhas somem, porque o objetivo de uma interface é justamente não parecer uma planta baixa para quem está lendo.

[NA TELA] Captura 3; alternâncias de meio segundo, depois freeze de dois segundos com guias.

[EDIÇÃO] Nunca reposicione manualmente uma das capturas para “melhorar” a comparação. Corte as duas da mesma gravação-base de cada snapshot.

### 2:00–2:50 — Três cenas, uma linguagem

> Uma cena isolada pode ser acaso. Por isso vamos olhar três, sempre sem entregar suas falas. Na primeira, a atenção vai para o busto. Na segunda, para a relação entre nome e caixa de mensagem. Na terceira, para onde a escolha ocupa a tela. Essas tomadas não representam todos os treze mapas. Elas são uma amostra visual do tipo de superfície revisada pelo PR. A revisão completa precisa conferir cada cena afetada, com seu texto, sua escala e seu momento de entrada. Se uma das amostras não estiver clara, ela sai do vídeo em vez de ser explicada demais.

[NA TELA] Capturas 3, 4 e 5 em sequência, dois segundos cada; aplique blur no conteúdo narrativo.

[B-ROLL] Grade de miniaturas da captura 6, com os três rótulos entrando por vez.

### 2:50–3:40 — Por que várias rodadas

> O detalhe importante é que não foi um único ajuste. São seis commits, com nomes de ajustes sucessivos, até o commit final. Isso sugere um processo de olhar, corrigir e olhar de novo — mas não permite concluir quais decisões foram aprovadas por jogadores. Em apresentação narrativa, pequenas diferenças se acumulam: um busto alguns pixels fora, uma escolha que encosta demais na caixa, um nome que muda de posição. Padronizar esses pontos pode reduzir ruído visual, desde que a revisão em jogo confirme o resultado.

[NA TELA] Linha do tempo de seis pontos, sem texto técnico grande; destaque “ajuste 1” até “ajuste 5”.

[FREEZE] “Fato: seis commits registrados. Efeito percebido: revisar em Playtest.”

### 3:40–4:30 — O que o diff revela, sem virar aula de JSON

> Agora, uma olhada curta no diff. Os arquivos mudaram em Common Events e em vários mapas porque a apresentação da conversa vive nesses lugares. Não é preciso acompanhar cada comando para entender a intenção: uma regra visual espalhada por muitas cenas exige revisão em muitos pontos. Mostramos uma chamada ou um pequeno bloco, depois voltamos para a comparação visual. O código é a trilha da mudança; a cena é a parte que o público consegue avaliar.

[B-ROLL] Captura 7 por no máximo três segundos; destaque só uma área, sem rolar.

[NA TELA] Diagrama: `regra de apresentação → Common Event/mapa → busto + mensagem + escolha`.

### 4:30–5:15 — Fato, interpretação, validação

> Fato: foram ajustados bustos, mensagens e escolhas em seis commits, Common Events e treze mapas. Interpretação: uma posição mais repetível pode fazer a interface sair do caminho da conversa. Validação pendente: observar nas capturas e em Playtest se o nome continua legível, se o busto não cobre informação, se a escolha recebe foco correto e se a transição mantém o timing. Essa divisão é o coração do vídeo: mostrar trabalho real sem transformar uma melhoria de processo em uma promessa automática.

[NA TELA] Três cartões: “documentado”, “interpretação” e “validar”.

[FREEZE] Segure o cartão “validar” por três segundos.

### 5:15–6:00 — Fecho

> Se você não percebe este trabalho de imediato, talvez essa seja a ambição certa: deixar personagem, fala e decisão dividirem a tela sem competir entre si. O PR 15 não adiciona uma única cena para anunciar; ele registra seis commits de revisão em superfícies que se repetem. Os links das versões estão na descrição. Antes de publicar a conclusão de que tudo está uniforme, a equipe ainda precisa revisar as capturas e jogar os trechos afetados. Polimento invisível também merece uma verificação visível. E cada comparação salva ajuda a transformar uma impressão vaga em uma revisão concreta.

[NA TELA] Cartela 8, links e “revisar capturas + Playtest antes de afirmar consistência”.

[EDIÇÃO] Feche com a grade das três cenas, sem linhas-guia e sem texto narrativo legível.

## Plano B — se não houver três cenas seguras em runtime

Não substitua a comparação por capturas de JSON ou por uma cena com spoiler. Faça um vídeo de processo: PR #15 e os seis commits → cartela “Common Events + 13 mapas” → mockup neutro com busto, nome, caixa e escolha → animação das linhas-guia → diff fechado → cartões de fato/interpretação/validação. Explique que o PR documenta ajustes distribuídos, enquanto a demonstração de cenas reais fica para depois da revisão humana. Esse plano mostra por que o polimento importa sem simular consistência percebida.

## Spoilers e validações pendentes

- Borre falas, nomes contextuais, escolhas e imagens que revelem acidentes, mortes, sabotagens, finais ou resultados de corrida. Grave somente o contorno da interface quando houver risco.
- Não declare que os 13 mapas estão uniformes, que bustos não sobrepõem elementos, que mensagens são legíveis, que escolhas recebem input ou que timing/transições funcionam. Essas verificações exigem revisão de capturas e Playtest humano.
- Compare antes e depois com a mesma resolução, proporção e enquadramento; diferenças de zoom ou janela podem criar uma falsa impressão de ajuste.

## Checklist final de publicação

- [ ] Antes, depois e PR #15 abrem; os SHAs exibidos são `8589e43` e `30cc57f`.
- [ ] Os worktrees criados são `../jhonny-video-09-antes` e `../jhonny-video-09-depois`.
- [ ] A fala informa corretamente: seis commits, Common Events, 13 mapas, mensagens/escolhas padronizadas e bustos ajustados.
- [ ] Há de cinco a oito capturas/cues e três comparações piscando gravadas com enquadramento equivalente.
- [ ] Linhas-guia aparecem apenas no freeze explicativo e não adulteram nenhuma das versões.
- [ ] Cenas e textos usados são spoiler-safe ou estão devidamente borrados.
- [ ] Fatos, interpretação e validação pendente aparecem separados na tela.
- [ ] O vídeo não declara consistência visual percebida, input, legibilidade, timing, Playtest ou ausência de bugs como confirmados.
