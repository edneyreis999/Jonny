---
title: "11 — Cenas e transições ganharam linguagem cinematográfica"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos"
spoken_word_target: "aproximadamente 656 palavras (faixa de 650–850)"
validation_status: "structural_validation; runtime_pending"
---

# Cenas e transições ganharam linguagem cinematográfica

## Ficha rápida

| Campo | Informação |
| --- | --- |
| Promessa | Mostrar como dois PRs transformaram uma passagem funcional em uma sequência de planos, sem revelar resultados, sabotagem, romances ou finais. |
| Antes | Branch `main`, SHA [`7b26b41e846822c4402a59264868751837066653`](https://github.com/edneyreis999/Jonny/tree/7b26b41e846822c4402a59264868751837066653) |
| Marco do PR #17 | SHA [`264ef91d07fb5499edf10c71fb50d4ea826ecf3d`](https://github.com/edneyreis999/Jonny/tree/264ef91d07fb5499edf10c71fb50d4ea826ecf3d) |
| Depois | Branch `feat/ajuste-v3-3`, SHA [`6f578d692f21cd61b1966752ce75860cacb60d29`](https://github.com/edneyreis999/Jonny/tree/6f578d692f21cd61b1966752ce75860cacb60d29) |
| Evidências principais | [PR #17](https://github.com/edneyreis999/Jonny/pull/17) e [PR #18](https://github.com/edneyreis999/Jonny/pull/18), tratados como um único ciclo de criação e polimento. |
| Fatos verificáveis | O ciclo adiciona seis mapas (`introCorrida`, `furarPneu`, `introVN2`, `posVN2`, `introVN3`, `posFimTRue`), 40 imagens de transição, uma BGM, três SE e o plugin `VisuMZ_3_VisualCutinEffect`, marcado como ativo. O PR #18 registra três commits de polimento. |
| Ação comparada | Percorrer, em sessão nova, a mesma passagem do SMS final até a entrada da corrida. |
| Leitura editorial | O PR se chamava “ajuste”; dentro dele havia a construção de uma linguagem de planos, cortes, áudio e cut-ins. A qualidade dessa costura ainda depende da gravação. |
| Status de validação | JSON, contagens de arquivos, sintaxe do plugin e envelope de `plugins.js` conferidos. Continuidade, timing, áudio, cut-ins e alcance das rotas aguardam Playtest humano. |
| Risco de spoiler | Alto. A versão pública usa somente telefone, chave, faróis e um cut-in de ação segura. |

## Preparação da gravação

Execute a partir de `/Users/edney/projects/coreto/summer26`. Os três worktrees separam a origem, o marco do PR #17 e o resultado do PR #18:

```bash
git worktree add --detach ../jhonny-video-11-antes 7b26b41e846822c4402a59264868751837066653
git worktree add --detach ../jhonny-video-11-pr17 264ef91d07fb5499edf10c71fb50d4ea826ecf3d
git worktree add --detach ../jhonny-video-11-depois 6f578d692f21cd61b1966752ce75860cacb60d29
```

Sirva os projetos em portas separadas:

```bash
python3 -m http.server 9101 --directory ../jhonny-video-11-antes/Jhonny
python3 -m http.server 9102 --directory ../jhonny-video-11-pr17/Jhonny
python3 -m http.server 9103 --directory ../jhonny-video-11-depois/Jhonny
```

- Grave os três canvases em 1280×720. Use sessão nova em cada snapshot e alcance naturalmente a passagem do SMS para a corrida; não compartilhe saves nem edite mapas, switches ou variáveis.
- Faça uma tomada contínua de cada versão, começando antes do SMS e terminando assim que a corrida estiver visível. Preserve o mesmo enquadramento e não conclua durante a captura que a transição “funcionou melhor”.
- Crie uma bandeja segura somente com `jonnyRecieveMessage`, `jonnyReadMessage`, `jonnySendingMessage`, `1-2-close-chave`, `3-1-1-close-farol-apagando`, `3-1-2-close-farol-apagando`, `race/freiar` e `race/curvaSegura`.
- Não abra em tela pública mapas, miniaturas ou nomes ligados a pneu furado, faca, morte, vitória, separação, romances, resultados ou finais. Não mostre uma folha de contato com as 40 imagens.
- O snapshot intermediário inicia em outra posição que os extremos. Compare a mesma passagem narrativa, não a tela inicial de cada build.

Depois, encerre os servidores e remova apenas estes worktrees:

```bash
git worktree remove ../jhonny-video-11-antes
git worktree remove ../jhonny-video-11-pr17
git worktree remove ../jhonny-video-11-depois
```

## Plano de capturas — 8 tomadas

1. Cartela `ANTES → PR #17 → PR #18`, com os SHAs curtos `7b26b41`, `264ef91` e `6f578d6`.
2. A passagem no antes: do sinal sonoro do SMS até o corte funcional para a corrida.
3. A mesma passagem no PR #17: telefone recebendo, leitura e envio, sem texto legível.
4. Continuação segura do PR #17: close da chave e faróis apagando, cortando antes de qualquer revelação.
5. A passagem equivalente no depois; use tela dividida com o marco intermediário somente se a gravação revelar diferença observável.
6. Um cut-in de ação segura, preferindo `freiar` ou `curvaSegura`; capture apenas se surgir naturalmente.
7. [FREEZE] Cartela `6 mapas • 40 imagens • 1 BGM + 3 SE`, sem nomes de assets ou mapas.
8. [B-ROLL] Entrada ativa do Visual Cutin Effect e escada `polimento-1 → polimento-2 → polimento-3` do PR #18.

## Roteiro cronometrado

### 0:00–0:30 — Gancho em supercut

> Uma mensagem chega. O telefone acende. Uma chave gira. Os faróis se apagam. Em poucos planos, Jhonny deixa de apenas trocar de mapa e começa a construir expectativa. Esta é a melhoria número onze: um ciclo de dois pull requests que adicionou cenas intermediárias, imagens, áudio e cut-ins. Vamos comparar exatamente a mesma passagem antes e depois, preservando os segredos da história.

[NA TELA] Supercut das capturas 2, 3, 4 e 6, com 1 a 2 segundos por plano.

[EDIÇÃO] Remova texto de mensagens e corte antes de qualquer resultado; tarja “supercut sem spoilers”.

### 0:30–1:10 — Três marcos, um ciclo

> O ponto de partida é a main no commit 7b26b41. O pull request 17 chega ao marco 264ef91 e introduz a base visual. O pull request 18 leva esse trabalho ao commit 6f578d6, depois de três rodadas registradas como polimento um, dois e três. Não são três sistemas novos: são três passagens sobre o mesmo conjunto de cenas. Por isso, tratamos os dois PRs como criação, revisão e acabamento de uma única linguagem.

[NA TELA] Capturas 1 e 8; mostre links dos snapshots e dos dois PRs.

[FREEZE] Legenda: “três rodadas de polimento, não três funcionalidades”.

### 1:10–1:55 — A passagem antes

> Para comparar sem depender de um final, escolhemos o limite entre o SMS e a corrida. Na versão anterior, esse trecho toca o aviso da mensagem e segue por uma transferência direta até o mapa da corrida. Ele cumpre a função narrativa: recebe o chamado e leva à próxima ação. Nossa pergunta não é se o antes estava errado. É o que muda quando esse intervalo ganha imagens capazes de preparar o gesto seguinte.

[NA TELA] Captura 2 inteira, em velocidade normal.

[EDIÇÃO] Rótulo discreto: “ANTES — passagem funcional”. Não esconda uma espera real com jump cut.

### 1:55–2:45 — A base criada no PR #17

> No marco do PR 17, a mesma costura passa a usar três imagens do telefone: receber, ler e enviar. Depois, uma nova cena de pré-corrida enquadra a chave e o apagar dos faróis antes de entregar o controle à corrida. A estrutura está presente nos mapas e os arquivos existem no snapshot. Se a tomada confirmar a sequência, edite os planos na ordem em que realmente apareceram. Se houver pausa, tela ausente ou ordem inesperada, mantenha isso visível e marque a validação como pendente.

[NA TELA] Capturas 3 e 4, primeiro sem cortes; depois repita como montagem curta.

[FREEZE] Sobreponha apenas `telefone → chave → faróis`, sem reproduzir diálogo.

### 2:45–3:30 — O tamanho da linguagem visual

> Essa passagem é apenas a amostra segura. O ciclo adicionou seis mapas intermediários e quarenta imagens de transição. Também entraram quatro arquivos de áudio: uma música e três efeitos sonoros. Esses números mostram a extensão do material, não provam ritmo, mixagem ou continuidade. Para evitar spoilers, não vamos abrir a lista completa. A cartela registra a escala; o supercut usa somente planos neutros que antecedem a corrida.

[NA TELA] Captura 7; use ícones abstratos em vez de miniaturas.

[EDIÇÃO] Não exiba nomes de mapas ou arquivos nesta parte da versão pública.

### 3:30–4:15 — Cut-ins durante a corrida

> O mesmo ciclo adiciona o Visual Cutin Effect e o deixa marcado como ativo na configuração do projeto. Em Common Events da corrida, comandos chamam imagens para decisões seguras e arriscadas e depois encerram os cut-ins. Isso conecta a linguagem de corte à ação do jogador. Ainda é evidência estrutural: só a captura pode confirmar se o efeito aparece, entra e sai no tempo certo e não cobre informação importante. Para esta versão, usamos apenas uma ação segura.

[NA TELA] Captura 6, seguida de um recorte curto da captura 8.

[FREEZE] Cartela: “configurado e referenciado • execução pendente”.

### 4:15–5:05 — O que o PR #18 poliu

> Depois da base, o PR 18 faz três rodadas de polimento sobre Common Events, mapas, configuração do projeto e imagens usadas nos comandos da corrida. O melhor modo de mostrar esse trabalho é repetir a passagem no snapshot final e observar diferenças reais, não prometer uma melhoria abstrata. Se o telefone, a chave, os faróis ou o cut-in mudarem de apresentação, destaque o frame correspondente. Se a diferença não for perceptível nessa rota, mostre a escada de commits e diga apenas que os arquivos foram revisados.

[NA TELA] Captura 5 em tela dividida com 3 ou 4, seguida da captura 8.

[EDIÇÃO] Não use “mais fluido” ou “melhor timing” sem comparação visível.

### 5:05–5:35 — Limite spoiler-safe

> Há muito mais material nesse ciclo, mas quantidade não justifica revelar a história. Ficaram fora do vídeo a sabotagem, consequências de corrida, relações entre personagens, morte e finais. Também não usamos uma folha de contato, porque os próprios nomes dos arquivos entregam acontecimentos. O recorte público prova o método com uma única transição segura e deixa o restante para quem jogar.

[B-ROLL] Reprise acelerada do supercut seguro; nenhuma tela de seleção de arquivos.

[EDIÇÃO] Aplicar desfoque se qualquer texto de SMS ou nome sensível permanecer legível.

### 5:35–6:00 — Fecho

> O PR se chamava ajuste; dentro dele havia uma linguagem cinematográfica em construção. O Git comprova mapas, imagens, áudio, comandos e três rodadas de polimento. A gravação ainda precisa comprovar continuidade, timing, mixagem, cut-ins e rotas. Os três snapshots e os pull requests 17 e 18 estão na descrição. O resultado que podemos afirmar hoje é simples: entre uma cena e outra, passou a existir material pensado para conduzir o olhar.

[NA TELA] Cartela final com os três SHAs, os dois PRs e `estrutura verificada • Playtest pendente`.

## Plano B — se a rota ou o efeito não colaborar

Não altere mapa inicial, transferências, switches, Common Events ou saves. Monte uma demonstração estática com os oito assets permitidos na bandeja segura: diagrama `Map010 → corrida` no antes e `Map010 → introCorrida → corrida` no ciclo; três frames do telefone; chave; faróis; entrada ativa do plugin; um comando de cut-in seguro; escada dos três commits de polimento. Rotule tudo como “estrutura do snapshot”. Se o runtime não reproduzir a passagem, remova qualquer fala que descreva ordem, duração ou funcionamento e preserve a cartela `runtime_pending`.

## Spoilers e validações pendentes

- A versão pública não mostra `furarPneu`, `posVN2`, `introVN3` ou `posFimTRue`, nem arquivos associados a sabotagem, vitória, separação, morte, romances ou finais. Os nomes aparecem apenas nesta ficha de produção.
- Não mostre texto completo de SMS, resultados de corrida, ordem de chegada, escolhas, transferências posteriores ou uma folha de contato dos assets.
- Permanecem pendentes até Playtest humano: continuidade da passagem, ordem e duração percebidas, fades, ausência de flashes, sincronização e mixagem dos quatro áudios, entrada/saída e camada dos cut-ins, legibilidade, input e retorno à corrida.
- A existência dos seis mapas não comprova que todas as rotas os alcançam. A inspeção estática não encontrou um chamador direto para `furarPneu`; alcance, condições e terminação de cada rota precisam de validação humana.
- `plugins.js` tem envelope estrutural válido e marca o Visual Cutin Effect como ativo; isso não equivale a aceite pelo Plugin Manager nem a comportamento validado.
- As três rodadas do PR #18 provam revisão registrada, não qualidade, ausência de regressões ou timing aprovado.

## Checklist final de publicação

- [ ] Os links e rótulos distinguem o antes `7b26b41`, o marco do PR #17 `264ef91` e o depois `6f578d6`.
- [ ] PRs #17 e #18 aparecem como um único ciclo, preservando as três rodadas de polimento do segundo PR.
- [ ] A comparação usa a mesma passagem do SMS até a entrada da corrida em sessões novas e sem saves compartilhados.
- [ ] Há entre cinco e oito capturas; este plano prevê oito.
- [ ] O supercut usa somente telefone sem texto legível, chave, faróis e uma ação segura.
- [ ] A cartela informa `6 mapas`, `40 imagens` e `1 BGM + 3 SE` sem revelar nomes sensíveis.
- [ ] Visual Cutin Effect é descrito como ativo e referenciado, nunca como funcionamento já aprovado.
- [ ] Nenhum jump cut esconde pausa, falha, tela ausente ou ordem inesperada na comparação principal.
- [ ] Continuidade, timing, áudio, cut-ins, input e alcance das rotas continuam marcados como Playtest pendente.
- [ ] Nenhum frame revela sabotagem, morte, relações, resultado ou final.
