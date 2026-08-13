---
title: "04 — Camada sonora da narrativa e corrida"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos"
spoken_word_target: "aproximadamente 657 palavras (faixa de 650–850)"
validation_status: "structural_validation; runtime_pending"
---

# Camada sonora da narrativa e corrida

## Ficha rápida

| Campo | Informação |
| --- | --- |
| Promessa | Mostrar, com escuta guiada e comparação curta, que a atualização integrou novas músicas e efeitos à narrativa e à corrida. |
| Antes | `main` em [`34298f2bfa043857c7c94bb1f4980f9e665cafe9`](https://github.com/edneyreis999/Jonny/tree/34298f2bfa043857c7c94bb1f4980f9e665cafe9) |
| Depois | `feat/sound-and-music` em [`57e1211053c68c7519fbff3fb440a3ab126b5fa0`](https://github.com/edneyreis999/Jonny/tree/57e1211053c68c7519fbff3fb440a3ab126b5fa0) |
| Evidência principal | [PR #10 — sons e músicas](https://github.com/edneyreis999/Jonny/pull/10) |
| Fatos verificáveis | O PR adicionou 20 arquivos de áudio e atualizou Common Events e múltiplos mapas para referenciá-los. O diff inclui músicas para corrida, combate/tensão e finais feliz/triste; e efeitos de aceleração, SMS, frenagem, vidro, colisão, explosão e pneu furado. |
| Leitura editorial | Som associado a ações e cenas **pode** aumentar antecipação, impacto e identidade. Esta é uma interpretação, não resultado de Playtest nem de avaliação de mixagem. |
| Limite de publicação | Não atribuir autoria, licença ou permissão de uso de qualquer faixa/efeito. Direitos, créditos e autorização de publicação devem ser revisados pela equipe responsável. |

## Preparação de gravação e áudio

Execute a partir de `/Users/edney/projects/coreto/summer26` e crie os dois worktrees específicos deste roteiro:

```bash
git worktree add --detach ../jhonny-video-04-antes 34298f2bfa043857c7c94bb1f4980f9e665cafe9
git worktree add --detach ../jhonny-video-04-depois 57e1211053c68c7519fbff3fb440a3ab126b5fa0
```

- Abra o mesmo trecho nas duas versões. Antes de gravar, confirme no gravador que a fonte é o **áudio do jogo/sistema**, não o microfone nem o alto-falante regravado pelo ambiente.
- Grave a tela e o áudio em faixas separadas, se a ferramenta permitir. Mantenha a narração em outra faixa; durante cada comparação sonora, cale a narração e deixe o som do jogo aparecer sozinho.
- Ative os medidores de saída no gravador. Faça uma tomada curta de referência e verifique apenas se há sinal e se não há clipping aparente; isso não valida mixagem, volume final ou timing dentro do jogo.
- Edite e aprove a percepção dos trechos em headphones. Faça também uma escuta rápida em caixas comuns, mas não anuncie “mix aprovado” sem a revisão humana combinada.
- Deixe abertos o [snapshot antes](https://github.com/edneyreis999/Jonny/tree/34298f2bfa043857c7c94bb1f4980f9e665cafe9), o [snapshot depois](https://github.com/edneyreis999/Jonny/tree/57e1211053c68c7519fbff3fb440a3ab126b5fa0) e [Files changed no PR #10](https://github.com/edneyreis999/Jonny/pull/10/files).

Depois da gravação, remova apenas esses worktrees:

```bash
git worktree remove ../jhonny-video-04-antes
git worktree remove ../jhonny-video-04-depois
```

## Capturas e cues planejados

1. Cartela de abertura: “A cena também se conta pelo som”, com os dois SHAs curtos.
2. [FREEZE] do PR #10 mostrando os 20 arquivos de áudio adicionados, sem exibir uma lista inteira por muito tempo.
3. Plano de gravação com o medidor de saída ativo e o jogo em quadro; use como prova de captura, não como prova de qualidade.
4. Comparação curta de um mesmo trecho: antes por três segundos, corte seco, depois por três segundos — sem voz sobreposta.
5. [B-ROLL] de uma sequência de nomes de arquivos: `Racha1` a `Racha4`, `SMS` e `Acelerate`; sem tocar arquivos diretamente fora do jogo.
6. [FREEZE] do diff: `Map005` troca `Town3` por `Racha4`; outro trecho mostra o `SMS` em `Map010`.
7. Trecho de corrida sem revelar resultado, com legendas discretas para a ação ou o ambiente sonoro percebido.
8. Cartela final: “20 arquivos adicionados no PR #10 — direitos e Playtest pendentes de revisão”.

## Roteiro cronometrado

### 0:00–0:35 — Gancho de escuta

> Feche os olhos por um instante. Em uma corrida ou numa cena de conversa, o que faz a gente perceber que algo mudou antes mesmo da imagem explicar? Muitas vezes é o som. Nesta melhoria, o trabalho não foi só colocar uma música de fundo: o projeto recebeu arquivos de música e efeitos, e eventos e mapas foram alterados para chamá-los em momentos específicos. Vamos ouvir um antes e depois com cuidado, sem fingir que o Git sozinho mede a qualidade da experiência.

[NA TELA] Cartela 1; entre em silêncio por meio segundo antes de o som do jogo começar.

[EDIÇÃO] Legenda fixa discreta: “Comparação de snapshots; mixagem, timing e execução exigem revisão humana.”

### 0:35–1:15 — O que o PR comprova

> O antes é o commit 34298f2, da main. O depois é o 57e1211, da branch feat/sound-and-music, reunido no pull request número 10. O diff registra vinte arquivos de áudio adicionados. Há músicas nomeadas para corrida, combate ou tensão, e finais feliz e triste; há também efeitos para aceleração, SMS, frenagem, vidro, colisão, explosão e pneu furado. Estes são fatos de arquivos e referências integradas — não uma afirmação sobre autoria, licença ou aprovação de uso dessas faixas.

[NA TELA] Abra o PR, destaque título, SHA e uma seleção curta de arquivos de `audio/bgm` e `audio/se`.

[FREEZE] “Fato: 20 arquivos adicionados no PR #10”.

### 1:15–2:00 — Preparar a comparação de verdade

> Para ouvir uma mudança, a captura precisa preservar o áudio do jogo. Por isso a fonte de áudio é capturada diretamente pelo sistema, em vez de gravar o som saindo de uma caixa. Aqui os medidores só respondem a uma pergunta simples: existe sinal sem estouro aparente? Eles não confirmam que o volume está correto, que a música encaixa na cena ou que os efeitos têm o timing ideal. A checagem de percepção acontece depois, em headphones, com revisão humana.

[NA TELA] Captura 3: medidor ativo, sem mostrar notificações pessoais. Marque “fonte: áudio do jogo”.

[B-ROLL] Close rápido de headphones sobre a mesa; não use marcas como patrocínio.

### 2:00–2:50 — Primeiro trecho, sem narração

> Agora, a regra é simples: eu vou parar de falar. O primeiro trecho vem do snapshot anterior; em seguida, o mesmo recorte vem do snapshot posterior. Ouça a diferença de presença e de informação sonora por conta própria. Nós não vamos chamar esta comparação de mix validado e nem vamos estender o trecho até revelar uma consequência da história. A função aqui é dar ao público uma referência auditiva, não transformar um spoiler em demonstração técnica.

[NA TELA] Rótulo “ANTES — 3 s”; silêncio do narrador. Corte seco para “DEPOIS — 3 s”; silêncio do narrador.

[EDIÇÃO] Normalizar somente conforme a política aprovada de publicação; não aumentar seletivamente uma versão para criar vantagem. Mantenha os medidores fora deste trecho.

### 2:50–3:40 — Onde o som foi conectado

> A camada sonora não ficou isolada na pasta de áudio. O PR também alterou Common Events e vários mapas. Um exemplo verificável: o Map005 troca a música configurada de Town3 para Racha4. No Map010, a música passa de Town6 para Racha1, o ambiente de vento é configurado e um efeito antigo de item é trocado pelo SMS. São sinais claros de integração nos dados. Ainda assim, só a execução revisada pode confirmar se cada chamada dispara no instante que a cena pede.

[NA TELA] Captura 6, alternando cada trecho de diff por dois segundos. Use destaque de cor nos nomes, não em blocos inteiros de JSON.

[FREEZE] Diagrama: `arquivo de áudio → evento/mapa → momento da cena`.

### 3:40–4:30 — Corrida: ações que podem ganhar som

> É na corrida que essa ideia fica mais fácil de perceber sem explicação longa. A lista de adições inclui aceleração e frenagem, além de efeitos ligados a impactos e pneu furado. Vamos mostrar somente uma ação segura, sem tela de resultado e sem o desfecho da rota. A interpretação editorial é que ligar som a uma ação pode deixá-la mais legível e mais presente. A afirmação factual é menor, e mais segura: arquivos e referências para essa camada foram adicionados ao projeto.

[NA TELA] Captura 7. Legenda curta: “ação” e, se for audível, “efeito registrado”.

[EDIÇÃO] Não fale por cima. Se houver fala ou música de fundo externa, abaixe-a para deixar o som do jogo ser ouvido; não cubra falhas de captura com efeitos adicionados na edição.

### 4:30–5:15 — O que este vídeo não promete

> Vale separar intenção de conclusão. Mais arquivos de áudio não provam, por si só, uma mixagem equilibrada, boa legibilidade, ausência de repetição ou sincronismo perfeito. E o nome de um arquivo não comprova quem o criou nem quais direitos existem para divulgar o vídeo. Antes da publicação, a equipe precisa conferir créditos, licenças e permissões aplicáveis, além de escutar no jogo os volumes e os momentos de disparo. Transparência aqui protege tanto a narrativa quanto o trabalho de áudio.

[NA TELA] Cartela em duas colunas: “IMPLEMENTADO: arquivos e referências” / “PENDENTE: direitos, execução, mixagem e timing”.

[FREEZE] Mostre a coluna pendente por três segundos.

### 5:15–6:00 — Fecho

> O PR número 10 adicionou vinte arquivos de áudio e conectou partes deles a cenas e mapas. Este vídeo não precisa resolver tudo para tornar esse avanço perceptível: basta comparar com honestidade, deixar o trecho respirar sem narração e apontar para a fonte. Os links dos snapshots e do pull request estão na descrição. Antes de publicar, escute a edição de headphones, confira os direitos e faça a revisão em jogo. Anote qualquer diferença percebida para que a equipe possa revisá-la sem memória falha. Porque, quando a cena ganha som, ela também ganha uma nova responsabilidade de escuta.

[NA TELA] Cartela final com links, SHAs curtos e “PR #10”.

[EDIÇÃO] Após a última frase, deixe dois segundos apenas com a ambiência capturada ou silêncio limpo; não acrescente música sem autorização revisada.

## Plano B — se a execução ou a captura de áudio falhar

Não grave som pelo microfone como substituto e não use uma prévia de arquivo de áudio como se comprovasse a integração em jogo. Faça um vídeo de bastidor verificável: PR #10 → mosaico de nomes de arquivos adicionados → diff de `Map005`, `Map010` e `CommonEvents.json` → diagrama de referência → cartela de pendências. Diga que a presença e a ligação dos arquivos estão no diff, enquanto a demonstração de runtime, a mixagem e o timing permanecem pendentes. Reagende o trecho auditivo quando houver uma captura limpa do áudio do jogo.

## Spoilers, direitos e validações pendentes

- Não mostre nem descreva finais, mortes, sabotagens, acidentes, resultados de corrida ou a consequência visual de colisões. Prefira um input de corrida sem desfecho e cortes de três segundos.
- Não declare que os sons disparam corretamente, que o volume está equilibrado, que a música combina com a cena, que o timing funciona ou que não existem regressões: tudo isso requer Playtest humano e escuta de revisão.
- Não inferir autoria, titularidade, licença ou autorização de uso/publicação a partir de nomes de arquivo ou do PR. Confirme créditos, direitos e a política da plataforma antes da edição final.
- Verifique na exportação se a faixa do jogo não foi silenciada, se a narração não cobre as comparações e se nenhum medidor indica clipping na captura.

## Checklist final de publicação

- [ ] Os links de antes, depois e PR #10 abrem; os SHAs exibidos são `34298f2` e `57e1211`.
- [ ] Os dois worktrees usados são exatamente `../jhonny-video-04-antes` e `../jhonny-video-04-depois`.
- [ ] A captura usa a fonte direta do áudio do jogo/sistema; microfone e alto-falante ambiente não substituem essa fonte.
- [ ] Há de cinco a oito capturas/cues e pelo menos um comparativo curto sem narração sobreposta.
- [ ] Medidores foram usados para checar presença de sinal e clipping aparente, sem alegar validação de mixagem.
- [ ] A edição foi ouvida em headphones e a revisão de direitos/créditos/permissões foi solicitada antes da publicação.
- [ ] Não há spoilers de finais, acidentes, mortes, sabotagens ou resultados de corrida.
- [ ] O vídeo não declara Playtest, mixagem, timing, direitos ou autoria como confirmados; as pendências aparecem na tela e na descrição.
