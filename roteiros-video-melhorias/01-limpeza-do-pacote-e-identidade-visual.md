---
title: "01 — Limpeza do pacote e identidade visual mais própria"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos"
spoken_word_target: "aproximadamente 754 palavras (faixa de 650–850)"
validation_status: "structural_validation; runtime_pending"
---

# Limpeza do pacote e identidade visual mais própria

## Ficha rápida

| Campo | Informação |
| --- | --- |
| Promessa | Mostrar que polimento também é retirar o visual que não conta a história de Jhonny e dar espaço a imagens próprias. |
| Antes | `main` em [`855d17f83b573bb7723dd7cba892b84680deb786`](https://github.com/edneyreis999/Jonny/tree/855d17f83b573bb7723dd7cba892b84680deb786) |
| Depois | `feat/melhorias-gerais` em [`6ca58b90c2f9f482e8ed5f6b41cf37e197d8dcd0`](https://github.com/edneyreis999/Jonny/tree/6ca58b90c2f9f482e8ed5f6b41cf37e197d8dcd0) |
| Evidência principal | [PR #7 — Melhorias Gerais](https://github.com/edneyreis999/Jonny/pull/7) |
| Fato verificável | O PR alterou `CommonEvents.json` e os mapas 005, 009, 010 e 013; atualizou retratos e imagens de celular, estrada, formatura e quarto; removeu 141 assets visuais padrão: 120 pictures e 21 parallaxes. |
| Leitura editorial | Menos elementos genéricos **pode** deixar as cenas mais coerentes com a identidade visual de Jhonny. Isto não é resultado de Playtest. |
| Tom | Bastidor honesto, visual e concreto: “polir é decidir o que não pertence”. |

## Preparação da gravação

Execute a partir de `/Users/edney/projects/coreto/summer26`. Os caminhos são intencionalmente específicos para este vídeo e deixam as versões abertas lado a lado:

```bash
git worktree add --detach ../jhonny-video-01-antes 855d17f83b573bb7723dd7cba892b84680deb786
git worktree add --detach ../jhonny-video-01-depois 6ca58b90c2f9f482e8ed5f6b41cf37e197d8dcd0
```

- Abra os dois projetos e prepare o mesmo trecho de cena em cada um; se o fluxo não chegar ao ponto desejado com segurança, grave apenas os assets e o diff.
- Deixe abertos o [snapshot antes](https://github.com/edneyreis999/Jonny/tree/855d17f83b573bb7723dd7cba892b84680deb786), o [snapshot depois](https://github.com/edneyreis999/Jonny/tree/6ca58b90c2f9f482e8ed5f6b41cf37e197d8dcd0) e a aba **Files changed** do [PR #7](https://github.com/edneyreis999/Jonny/pull/7/files).
- Use captura em 1080p, com cursor grande. Mantenha o áudio ambiente discreto; este roteiro não pressupõe que o áudio ou a execução tenham sido validados.
- Nunca mostre caminhos de save, arquivos pessoais ou spoilers de enredo. Prefira telas de imagens isoladas e enquadramentos fechados.

Depois de gravar, remova somente estes worktrees:

```bash
git worktree remove ../jhonny-video-01-antes
git worktree remove ../jhonny-video-01-depois
```

## Capturas planejadas

1. Cartela limpa: “Antes / Depois — identidade visual”, com os dois SHAs curtos.
2. [FREEZE] do PR #7 mostrando a aba de arquivos alterados e a data, sem rolar listas extensas.
3. Mosaico de quatro imagens depois: celular, estrada, formatura e quarto; use os nomes dos arquivos como legenda curta.
4. Comparação rápida de um retrato anterior e o retrato atualizado de Jonny ou Chance, sem diálogo revelador.
5. [FREEZE] de uma lista filtrada de assets padrão removidos: um grupo de `Actor`, `People` ou `SF_`, não uma parede de arquivos.
6. Trecho curto do mesmo enquadramento de cena antes/depois, se a execução local o permitir; sem afirmar que foi Playtestado.
7. [B-ROLL] do diff em `Map010.json` ou `CommonEvents.json`, só o suficiente para mostrar que as imagens foram integradas aos eventos.
8. Cartela final com “141 assets visuais padrão removidos: 120 pictures + 21 parallaxes” e a fonte PR #7.

## Roteiro cronometrado

### 0:00–0:35 — Gancho

> Quando a gente fala em melhorar a aparência de um jogo, é fácil imaginar apenas adicionar arte nova. Mas uma parte importante do polimento é fazer o oposto: olhar para o pacote e perguntar o que ainda não pertence a ele. Hoje eu vou mostrar uma mudança menos barulhenta, mas muito concreta: a limpeza de assets padrão e a troca de imagens que ajudam Jhonny a parecer mais Jhonny. É uma mudança de bastidor, mas que aparece justamente quando o jogo deixa de lembrar um pacote pronto e passa a sustentar o próprio clima.

[NA TELA] Cartela 1; entre no mosaico de imagens novas com cortes no ritmo da frase “mais Jhonny”.

[EDIÇÃO] Texto pequeno no canto: “Comparação de snapshots do repositório; comportamento em jogo depende de validação humana.”

### 0:35–1:10 — O recorte e a evidência

> O antes é o commit 855d17f, na branch main. O depois é o commit 6ca58b9, da branch feat/melhorias-gerais, documentado no pull request número 7. Não é uma impressão tirada só de uma captura: o diff registra alterações em eventos comuns e nos mapas 005, 009, 010 e 013. Ele também registra imagens atualizadas para celular, estrada, formatura e quarto. Essa é a nossa régua: não comparar versões vagas, e sim dois estados que qualquer pessoa pode abrir pelos links.

[NA TELA] Abra o PR #7, faça zoom no título e nos SHAs; corte para a lista curta de arquivos de dados.

[FREEZE] Segure por dois segundos na legenda: “Fato: eventos e mapas foram atualizados”.

### 1:10–1:55 — O que saiu

> A decisão mais interessante aqui não foi só o que entrou. Foram removidas 120 imagens padrão de personagens e 21 parallaxes padrão que não faziam parte da identidade final. Ao todo, são 141 assets visuais padrão. Esses números vêm do levantamento estrutural do PR. Arquivo removido não é automaticamente uma cena melhor; ele é evidência de que o pacote deixou de carregar uma coleção de imagens genéricas que não era usada para definir este jogo.

[NA TELA] Captura 5: filtre e mostre poucos nomes repetidos; depois, transição para um fundo escuro com “120 + 21”.

[B-ROLL] Passe por thumbnails de assets padrão por no máximo três segundos e cubra com uma máscara de saída.

### 1:55–2:45 — O que entrou no lugar

> No lugar desse ruído visual, o PR atualizou retratos de Chance e Jonny e cenas ligadas a objetos e momentos reconhecíveis: o celular, a estrada, a formatura e o quarto. Repare que a mudança não precisa explicar a história inteira para funcionar no vídeo. Um enquadramento de celular, um retrato e um cenário já mostram uma linguagem que é mais específica do que um catálogo padrão de engine. O objetivo da montagem não é decidir qual imagem é a mais bonita, e sim fazer a autoria das escolhas ficar visível.

[NA TELA] Mosaico da captura 3. Revele uma imagem por vez: celular, estrada, formatura, quarto; então o retrato.

[FREEZE] No retrato, legenda: “Fato: retratos atualizados”. Não mostre texto de diálogo nem nomes de cenas sensíveis.

### 2:45–3:35 — Antes e depois, com honestidade

> Se conseguirmos abrir o mesmo ponto nas duas versões, esta é a comparação: primeiro o snapshot anterior, depois o posterior. O que podemos afirmar é que os arquivos e os eventos mudaram. A leitura de que o conjunto fica mais próprio é editorial: imagens escolhidas para personagens, lugares e objetos do jogo podem criar uma apresentação mais coerente. Essa leitura ainda precisa de revisão da equipe e de observação em Playtest; não estamos declarando qualidade final por causa do Git. É uma distinção importante: o repositório conta o que foi integrado; a experiência de quem joga só pode ser julgada quando alguém joga.

[NA TELA] Comparação lado a lado de no máximo seis segundos por lado. Use rótulos “ANTES — snapshot” e “DEPOIS — snapshot”.

[EDIÇÃO] Sobreponha “FATO” no nome dos arquivos e “LEITURA EDITORIAL” na frase de interpretação. Não use selo de “aprovado”.

### 3:35–4:25 — A costura invisível

> E como essas imagens chegam à cena? O mesmo PR também tocou Common Events e os mapas. Não precisamos transformar o vídeo numa aula de JSON, mas vale mostrar a costura: uma imagem não vira identidade só por existir na pasta; ela precisa ser chamada no momento certo. Este pedacinho do diff mostra essa integração, sem prometer que todas as rotas, tempos de carregamento ou transições já foram testados. É a diferença entre ter uma caixa de ferramentas e de fato usar uma ferramenta no enquadramento onde ela faz sentido.

[B-ROLL] Captura 7, com destaque visual apenas nas linhas referentes à imagem; use movimento lento de câmera digital.

[NA TELA] Diagrama mínimo: `imagem própria → evento/mapa → cena`.

### 4:25–5:15 — A ideia por trás da limpeza

> Para mim, a lição deste PR é simples: identidade não é uma camada aplicada no fim. Ela aparece também nas ausências. Remover assets padrão reduz a chance de uma imagem aleatória quebrar o tom de uma cena e obriga o projeto a ser mais deliberado sobre o que mostra. Isso não prova que toda escolha visual funciona para todo mundo. Mostra uma direção de produção: trocar variedade genérica por elementos que pertencem ao universo de Jhonny. E essa direção é útil até para futuras adições, porque dá à equipe uma pergunta prática: esta imagem parece ter nascido neste jogo?

[NA TELA] Retorne ao mosaico, agora com as palavras “deliberado”, “específico” e “coerente” entrando uma a uma.

[FREEZE] Cartela: “Interpretação editorial — não resultado de Playtest”.

### 5:15–6:00 — Fecho e convite à verificação

> Então este foi o primeiro passo das melhorias pós-jam: limpar o que não conta a história e reforçar o que conta. O PR número 7 afetou 170 arquivos, incluindo mudanças binárias que a contagem de linhas não descreve bem. Por isso este vídeo prefere mostrar imagens e fontes em vez de vender números como espetáculo. Os links dos dois snapshots e do PR estão na descrição. Antes de publicar uma comparação em movimento, a equipe ainda precisa conferir a execução, a legibilidade, o timing e possíveis efeitos nas rotas. Polimento visual é escolha — e escolha boa também pede verificação. Se a comparação despertar curiosidade, a melhor continuação é abrir o diff, olhar os assets e fazer essa verificação com o jogo em mãos.

[NA TELA] Cartela final: links, SHAs curtos e “PR #7”.

[EDIÇÃO] Termine no mosaico, não em um spoiler nem em tela técnica. Deixe dois segundos de respiro para end card.

## Plano B — se a demonstração em jogo não colaborar

Não improvise uma rota, não altere saves e não anuncie Playtest. Monte uma sequência inteiramente verificável: cartela dos SHAs → PR #7 → lista curta de remoções → mosaico dos cinco assets atualizados → diff de um evento/mapa → cartela “fato versus interpretação”. Narre que a integração está presente no diff, mas que a demonstração de execução permanece pendente. Esse plano preserva a tese do vídeo sem fingir comportamento em runtime.

## Spoilers e validações pendentes

- Evite diálogos completos, decisões, acidentes, mortes, sabotagens, finais e resultados de corrida. Os assets devem aparecer isolados ou em recortes curtos sem contexto de desfecho.
- Não afirme que as imagens carregam, que transições funcionam, que retratos aparecem no momento certo, que o ritmo melhorou ou que não há regressões: essas afirmações exigem Playtest humano.
- Antes de divulgar, a equipe deve aprovar a leitura “mais própria/coerente”, confirmar se os arquivos removidos não têm referência residual e verificar em execução os mapas e Common Events tocados pelo PR.

## Checklist final de publicação

- [ ] Os links de antes, depois e PR #7 abrem e os SHAs exibidos são `855d17f` e `6ca58b9`.
- [ ] A contagem aparece como 141 assets visuais padrão: 120 pictures e 21 parallaxes.
- [ ] Há entre cinco e oito capturas úteis; listas de arquivos aparecem por poucos segundos.
- [ ] Toda fala factual corresponde ao PR ou aos snapshots; toda conclusão visual está marcada como interpretação.
- [ ] Nenhum trecho revela desfechos, acidentes, mortes, sabotagens ou resultados de corrida.
- [ ] O vídeo não usa “validado”, “sem bugs”, “mais divertido” ou qualquer declaração de Playtest.
- [ ] A gravação em runtime, se usada, foi revisada pela equipe; se não foi, o Plano B substituiu essa captura.
- [ ] A fala lida dura aproximadamente seis minutos em ritmo natural, com espaço para os freezes e a end card.
