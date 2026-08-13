---
title: "05 — Diálogos reutilizáveis"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos"
spoken_word_target: "aproximadamente 678 palavras (faixa de 650–850)"
validation_status: "structural_validation; runtime_pending"
---

# Estrutura de diálogos simplificada com eventos reutilizáveis

## Ficha rápida

| Campo | Informação |
| --- | --- |
| Promessa | Explicar, sem jargão nem parede de JSON, como trechos de diálogo repetidos foram centralizados em eventos reutilizáveis. |
| Antes | `main` em [`1e2b4317171325ff6a1b43c84a27ce185d7dc6ae`](https://github.com/edneyreis999/Jonny/tree/1e2b4317171325ff6a1b43c84a27ce185d7dc6ae) |
| Depois | `feat/sistematizacao-dialogos` em [`f1fbbb4bd5bf13b0bfc7a2d3a2873e17e9063bb9`](https://github.com/edneyreis999/Jonny/tree/f1fbbb4bd5bf13b0bfc7a2d3a2873e17e9063bb9) |
| Evidência principal | [PR #11 — Sistematização de diálogos](https://github.com/edneyreis999/Jonny/pull/11) |
| Fatos verificáveis | Em `Map013.json`, o PR removeu 31.686 linhas e adicionou 2.884. Foram preenchidos os Common Events `VN3_RaceGoodbye`, `VN3_CourageSip` e `VN3_RefuseKeysGoodbye`; a intenção registrada é reutilizar diálogos repetidos no mapa. |
| Leitura editorial | Centralizar um trecho que se repete **pode** reduzir a chance de versões divergirem em futuras correções. A equivalência perceptível da história exige Playtest das rotas. |
| Frase-chave | “Menos linhas não significa menos história; pode significar menos cópia da mesma fala.” |

## Preparação da gravação

Execute a partir de `/Users/edney/projects/coreto/summer26` e crie os worktrees exclusivos deste vídeo:

```bash
git worktree add --detach ../jhonny-video-05-antes 1e2b4317171325ff6a1b43c84a27ce185d7dc6ae
git worktree add --detach ../jhonny-video-05-depois f1fbbb4bd5bf13b0bfc7a2d3a2873e17e9063bb9
```

- Abra o [snapshot antes](https://github.com/edneyreis999/Jonny/tree/1e2b4317171325ff6a1b43c84a27ce185d7dc6ae), o [snapshot depois](https://github.com/edneyreis999/Jonny/tree/f1fbbb4bd5bf13b0bfc7a2d3a2873e17e9063bb9) e a aba [Files changed do PR #11](https://github.com/edneyreis999/Jonny/pull/11/files).
- Para a explicação visual, prepare cartões simples: três blocos “rota A”, “rota B” e “rota C” apontando para um único cartão “Common Event”. Não grave uma rolagem longa de JSON.
- Se a equipe abrir o jogo, capture somente a mesma despedida ou escolha curta em rotas seguras e sem desfecho. A captura serve para revisão; não publique como equivalência validada sem Playtest das rotas.
- Faça zoom no diff apenas nos nomes dos três eventos e no resumo numérico. O público precisa ver a ideia, não ler a implementação inteira.

Depois da gravação, remova somente os worktrees criados acima:

```bash
git worktree remove ../jhonny-video-05-antes
git worktree remove ../jhonny-video-05-depois
```

## Capturas e cues planejados

1. Cartela: “Menos cópia. A mesma história?” com os SHAs curtos.
2. [FREEZE] do PR #11 e do resumo: `Map013` com `-31.686 / +2.884`.
3. [B-ROLL] animação de três cartões de diálogo iguais convergindo para um cartão reutilizável.
4. [FREEZE] dos nomes `VN3_RaceGoodbye`, `VN3_CourageSip` e `VN3_RefuseKeysGoodbye` em `CommonEvents.json`.
5. Mapa conceitual: “rota → chama evento → diálogo comum → continua a rota”.
6. Comparação curta de uma fala segura nas duas versões, apenas se ambas as rotas forem revisadas; sem final ou consequência.
7. [B-ROLL] do diff, bem fechado, de uma chamada do Common Event no `Map013`.
8. Cartela final: “estrutura integrada; equivalência das rotas ainda precisa de Playtest”.

## Roteiro cronometrado

### 0:00–0:35 — Gancho

> À primeira vista, este é um vídeo sobre números estranhos: mais de trinta mil linhas saíram de um arquivo. Mas o ponto não é fazer uma história menor. O ponto é parar de guardar a mesma conversa em vários cantos. Hoje vamos ver como uma parte dos diálogos de Jhonny foi reorganizada para ser chamada de um lugar comum, e por que isso pode facilitar o cuidado com as rotas sem apagar o que elas contam. Em vez de olhar para código, pense em páginas repetidas de um livro de escolhas.

[NA TELA] Cartela 1; os três cartões “rota” surgem separados e repetem a mesma pequena linha fictícia, sem texto do jogo.

[EDIÇÃO] Use texto de exemplo como “despedida comum”, nunca uma fala real que revele a trama.

### 0:35–1:15 — O recorte verificável

> A comparação usa o commit 1e2b431, da main, como antes, e o commit f1fbbb4, da branch feat/sistematizacao-dialogos, como depois. Eles estão ligados ao pull request número 11. No arquivo Map013, esse PR removeu 31.686 linhas e adicionou 2.884. O número é grande porque a estrutura mudou em massa. Ele não é uma contagem de falas cortadas, nem uma prova de que a história permaneceu igual para quem joga. É uma medida de edição do arquivo, não um termômetro de emoção ou de conteúdo visível.

[NA TELA] Abra PR #11, destaque os dois SHAs e o resumo do arquivo `Map013.json`.

[FREEZE] Legenda grande: “Fato: `Map013` — 31.686 removidas / 2.884 adicionadas”.

### 1:15–2:05 — Traduzindo a ideia

> Pense em três cenas que chegam a uma mesma despedida. Antes, cada caminho pode carregar sua própria cópia daquele diálogo. Se uma palavra precisa mudar, existem vários lugares para procurar. Depois, as rotas podem chamar um único evento comum. Elas continuam tendo escolhas e consequências próprias; o trecho compartilhado passa a morar num endereço só. É como substituir três fotocópias de uma página por uma página guardada na pasta certa, com três pessoas apontando para ela.

[B-ROLL] Captura 3: os cartões convergem em animação lenta, depois se separam novamente para mostrar que as rotas continuam.

[NA TELA] Diagrama: `rota A ┐` / `rota B ├→ evento comum → continua` / `rota C ┘`.

### 2:05–2:55 — Os três eventos reutilizáveis

> Nesta mudança, três Common Events foram preenchidos: VN3_RaceGoodbye, VN3_CourageSip e VN3_RefuseKeysGoodbye. Os nomes descrevem pontos reutilizáveis ligados a despedida e escolhas, mas este vídeo não precisa revelar o contexto narrativo deles. O fato importante é que eles existem no arquivo de eventos comuns e que a intenção registrada no trabalho foi reutilizar diálogos antes repetidos no Map013. É uma mudança de organização que se pode inspecionar no diff. Para o público, basta enxergá-los como três cartões que podem ser chamados por cenas diferentes.

[NA TELA] Capture 4: mostre os três nomes como etiquetas, com a tela técnica desfocada ao redor.

[FREEZE] “Fato: três Common Events preenchidos”.

### 2:55–3:45 — O que menos linhas quer dizer — e o que não quer

> Menos linhas pode significar menos repetição de comandos, menos duplicação de uma fala e um mapa mais fácil de manter. Não significa automaticamente menos história. Ao mesmo tempo, não podemos inverter a frase e dizer que a experiência ficou idêntica só porque o arquivo encolheu. Uma rota pode depender de ordem, condição, retorno e timing. Para dizer que o conteúdo perceptível foi preservado, a equipe precisa percorrer as rotas em Playtest e comparar o que aparece para a pessoa jogando.

[NA TELA] Tela dividida: “ESTRUTURA: diff comprova” / “EXPERIÊNCIA: Playtest confirma”.

[EDIÇÃO] Não use barras de “100% igual” ou um selo de aprovado.

### 3:45–4:35 — Comparação segura, se disponível

> Se houver uma tomada revisada de uma despedida curta nas duas versões, mostramos primeiro o antes e depois o depois. O enquadramento fica fechado na caixa de diálogo; paramos antes da escolha ou da consequência. Isso é uma ilustração, não uma cobertura de todas as rotas. Se a tomada não estiver pronta, o diagrama faz melhor este trabalho do que forçar uma gravação incompleta. A honestidade do vídeo vale mais do que uma comparação que parece definitiva e não é.

[NA TELA] Captura 6, quatro segundos por versão, com rótulos de snapshot e sem música dramática adicionada na edição.

[FREEZE] “Exemplo visual; rotas completas pendentes de Playtest”.

### 4:35–5:20 — Por que isso importa para quem joga

> Para quem joga, a infraestrutura deveria ficar invisível. A oportunidade está no cuidado futuro: quando um trecho compartilhado precisa de ajuste, existe um ponto comum para revisar. A interpretação editorial é que isso pode diminuir o risco de a mesma fala ficar diferente entre caminhos parecidos. Mas a promessa ao público não é “nunca haverá divergência”. A promessa responsável é menor: o projeto passou a ter uma estrutura que favorece uma revisão mais concentrada.

[NA TELA] Mostre o cartão “uma revisão” saindo para três rotas, sem afirmar que elas já foram verificadas.

[B-ROLL] Captura 7, no máximo três segundos; dissolva para o diagrama, não para uma parede de JSON.

### 5:20–6:00 — Fecho

> Então o número técnico tem uma história simples: o Map013 foi reduzido e passou a apontar para três eventos reutilizáveis, com a intenção registrada de reaproveitar diálogos repetidos. O pull request 11 mostra a alteração; os links dos dois snapshots permitem conferir. O que ainda falta é igualmente claro: fazer Playtest de cada rota afetada, observar textos, escolhas, retornos e timing, e só então dizer como a equivalência aparece na prática. Registre os desvios encontrados para que a estrutura comum possa ser corrigida uma vez, no lugar certo. Menos cópia não é menos narrativa. É uma maneira de dar à narrativa um lugar mais fácil de cuidar.

[NA TELA] Cartela 8, links e a frase “Menos cópia; revisão das rotas pendente”.

[EDIÇÃO] Finalize no diagrama simples; não volte ao arquivo JSON.

## Plano B — sem gravação segura das rotas

Não simule uma escolha nem pule diretamente a um final para obter uma imagem bonita. Faça o vídeo completamente por evidências estáticas: cartela de SHAs → resumo numérico do `Map013` → animação de cópias convergindo → os três nomes de Common Events → diagrama de chamada → cartela de pendências. Narre que a reorganização está no PR e que a equivalência percebida entre rotas ainda depende de Playtest. Assim, o vídeo explica a melhoria sem substituir validação por uma suposição.

## Spoilers e validações pendentes

- Evite falas completas, escolhas textuais, acidentes, mortes, sabotagens, finais e resultados de corrida. Os nomes técnicos dos eventos podem aparecer sem explicar sua consequência.
- Não declare que a história é idêntica, que todas as rotas funcionam, que o retorno de evento está correto, que o timing é preservado ou que não há regressões. Essas conclusões exigem Playtest humano de cada rota afetada.
- A revisão deve cobrir as chamadas e continuidades de `VN3_RaceGoodbye`, `VN3_CourageSip` e `VN3_RefuseKeysGoodbye`, além dos trechos de `Map013` que as invocam.

## Checklist final de publicação

- [ ] Links de antes, depois e PR #11 abrem; os SHAs exibidos são `1e2b431` e `f1fbbb4`.
- [ ] Os worktrees foram criados com `../jhonny-video-05-antes` e `../jhonny-video-05-depois`.
- [ ] A estatística aparece corretamente: `Map013` com 31.686 linhas removidas e 2.884 adicionadas.
- [ ] Os três Common Events aparecem escritos corretamente e sem contexto de spoiler.
- [ ] Há de cinco a oito capturas/cues; o diagrama substitui qualquer rolagem longa de JSON.
- [ ] Fatos de estrutura e interpretação editorial estão visualmente separados.
- [ ] Uma tomada de jogo, se usada, é identificada como exemplo e não como prova de todas as rotas.
- [ ] O vídeo não declara Playtest, equivalência perceptível, timing ou ausência de bugs como confirmados.
