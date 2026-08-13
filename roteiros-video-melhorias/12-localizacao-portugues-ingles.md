---
title: "12 — Localização em português e inglês"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos"
spoken_word_target: "aproximadamente 654 palavras (faixa de 650–850)"
validation_status: "structural_validation; lqa_playtest_pending"
---

# Localização em português e inglês

## Ficha rápida

| Campo | Informação |
| --- | --- |
| Promessa | Mostrar a ampliação e revisão da localização PT/EN com a mesma fala em dois idiomas, distinguindo estrutura documentada de experiência ainda sujeita a LQA/Playtest. |
| Antes | `main` em [`eab148112d2026e83e2daec21ace982bd8f2858a`](https://github.com/edneyreis999/Jonny/tree/eab148112d2026e83e2daec21ace982bd8f2858a) |
| Depois | `feat/traducao` em [`b08585570aa3fb4f997f4eaa034af1aeec7226cc`](https://github.com/edneyreis999/Jonny/tree/b08585570aa3fb4f997f4eaa034af1aeec7226cc) |
| Evidência principal | [PR #19 — tradução](https://github.com/edneyreis999/Jonny/pull/19) |
| Contexto anterior | A infraestrutura começou antes: o commit [`7860664`](https://github.com/edneyreis999/Jonny/commit/7860664) criou `Languages.csv` e referências; o commit [`1e2b431`](https://github.com/edneyreis999/Jonny/commit/1e2b4317171325ff6a1b43c84a27ce185d7dc6ae) migrou a tabela para TSV. Não são os links principais desta comparação. |
| Fatos verificáveis | Message Core ativo, localização habilitada, `Portuguese` como padrão e `Portuguese`/`English` configurados. O arquivo efetivo é `data/Languages.tsv`; depois há 456 chaves, enquanto antes havia 374 linhas de dados (375 com cabeçalho). O PR adicionou 82 linhas e revisou Map016–020 e Map023–026. No estado atual: 3.531 referências `\tl{...}`, 419 chaves únicas, zero referências ausentes e nenhuma chave duplicada. |
| Limite | O PR #19 ampliou e revisou a localização; ele não criou do zero toda a infraestrutura. Troca de idioma em Options, renderização, qualidade da tradução e layout são pendências de LQA/Playtest. |

## Preparação da gravação

Execute a partir de `/Users/edney/projects/coreto/summer26` e crie os worktrees destacados específicos:

```bash
git worktree add --detach ../jhonny-video-12-antes eab148112d2026e83e2daec21ace982bd8f2858a
git worktree add --detach ../jhonny-video-12-depois b08585570aa3fb4f997f4eaa034af1aeec7226cc
```

Sirva os projetos em portas separadas:

```bash
python3 -m http.server 9201 --directory ../jhonny-video-12-antes/Jhonny
python3 -m http.server 9202 --directory ../jhonny-video-12-depois/Jhonny
```

- Abra os snapshots imutáveis [antes](https://github.com/edneyreis999/Jonny/tree/eab148112d2026e83e2daec21ace982bd8f2858a) e [depois](https://github.com/edneyreis999/Jonny/tree/b08585570aa3fb4f997f4eaa034af1aeec7226cc), além de [Files changed do PR #19](https://github.com/edneyreis999/Jonny/pull/19/files).
- Abra `http://127.0.0.1:9201` e `http://127.0.0.1:9202` em perfis separados. Comece uma sessão nova em cada snapshot e não compartilhe saves entre as versões.
- Escolha uma fala curta, neutra e sem spoiler que exista no mesmo ponto para os dois idiomas. Grave o mesmo enquadramento com Portuguese e English, no mesmo zoom, depois de a equipe confirmar que a troca pode ser demonstrada.
- Mostre a aba Options apenas como tentativa de fluxo: capture o comando de idioma e a mudança, se funcionar em revisão. Não chame isso de validado; registre se exige reinício, se há erro ou se uma língua não carrega.
- Para a tabela, mostre uma única chave e as duas colunas na `Languages.tsv`; nunca role centenas de linhas. Em edição, use fonte grande o bastante para a coluna ser lida em 1080p.
- Faça uma passagem de LQA em tela: leia a fala em voz alta e confira sentido, naturalidade, quebra, fonte, glyphs e espaço da janela. Isso é preparação de revisão, não a conclusão da revisão.

Após gravar, encerre os servidores e remova apenas esses worktrees:

```bash
git worktree remove ../jhonny-video-12-antes
git worktree remove ../jhonny-video-12-depois
```

## Capturas e cues planejados

1. Cartela: “Uma fala, duas leituras”, com `eab1481` → `b085855`.
2. [FREEZE] do PR #19: `Languages.tsv` e Map016–020, Map023–026.
3. Tabela fechada: uma chave, coluna `Portuguese` e coluna `English`.
4. O mesmo diálogo em português, com rótulo “Portuguese”; não mostrar desfecho.
5. O mesmo diálogo em inglês, mesmo quadro e rótulo “English”.
6. [FREEZE] de um contador visual: antes 374 linhas de dados / depois 456 chaves / PR +82 linhas.
7. [B-ROLL] de `\tl{chave}` apontando para uma linha da TSV e para uma caixa de diálogo ilustrativa.
8. Cartela final: “estrutura: verificada; Options, renderização e LQA: pendentes”.

## Roteiro cronometrado

### 0:00–0:35 — Gancho

> Traduzir um jogo não é apenas trocar uma palavra por outra. É decidir onde o texto mora, como uma fala encontra o idioma certo e como ela continua cabendo na tela. Nesta melhoria, Jhonny ampliou e revisou sua localização em português e inglês. Vamos acompanhar uma única fala em dois idiomas e olhar para a estrutura por trás dela — sem prometer que uma demonstração curta substitui a revisão linguística e o Playtest.

[NA TELA] Cartela 1; uma chave abstrata se divide em duas etiquetas: `Portuguese` e `English`.

[EDIÇÃO] Não use bandeiras como atalho de qualidade. Prefira nomes dos idiomas e a legenda “LQA pendente”.

### 0:35–1:15 — O recorte correto

> O antes desta comparação é o commit eab1481, na main. O depois é o b085855, da branch feat/traducao, consolidado no pull request 19. São os links principais porque enquadram a ampliação que vamos mostrar. A infraestrutura não nasceu toda nesse PR: o commit 7860664 criou Languages.csv e referências, e o commit 1e2b431 migrou a tabela para TSV. O PR 19 ampliou e revisou esse caminho existente, em vez de começar do zero.

[NA TELA] Mostre os snapshots antes/depois e o PR; os commits anteriores entram apenas como uma linha de tempo curta.

[FREEZE] “PR #19: ampliação e revisão; não origem completa da infraestrutura”.

### 1:15–2:00 — Onde o texto vive

> A configuração documentada mostra Message Core ativo, localização habilitada e Portuguese como idioma padrão. Portuguese e English aparecem como idiomas configurados. O formato efetivo é TSV, com o arquivo data/Languages.tsv. Para o público, isso pode soar técnico, então pense numa tabela de legendas: uma chave identifica a fala; cada coluna oferece sua versão. O arquivo escolhido e as colunas são evidência estrutural. Eles ainda não provam que uma frase cabe bem, soa natural ou renderiza sem problema.

[NA TELA] Captura 3: uma chave e as duas colunas. Destaque `Key`, `Portuguese`, `English`.

[B-ROLL] Captura 7: `\tl{chave}` → linha TSV → caixa de diálogo ilustrativa.

### 2:00–2:50 — Mais cobertura, sem reduzir a tradução a uma contagem

> Antes, a tabela tinha 374 linhas de dados, ou 375 contando o cabeçalho. Depois, ela contém 456 chaves. O PR 19 adicionou 82 linhas e revisou os mapas 016 a 020 e 023 a 026. Esses números mostram ampliação de cobertura e revisão de superfícies, não qualidade literária. A tradução precisa preservar sentido, voz dos personagens e leitura natural; isso não se mede por linha adicionada. A contagem orienta a auditoria. A leitura humana decide se o texto funciona.

[NA TELA] Captura 6 com contadores entrando um a um; não use gráfico de “qualidade”.

[FREEZE] “Fato: +82 linhas no PR #19; qualidade: LQA pendente”.

### 2:50–3:40 — A mesma fala, dois idiomas

> Agora vamos ver o mesmo diálogo primeiro em Portuguese e depois em English. A câmera fica no mesmo ponto, com o mesmo tamanho de janela. Esta troca é uma demonstração útil, mas limitada: ela não comprova todas as telas, todas as chaves ou todo o fluxo de Options. Observe principalmente o que a captura permite observar — a presença de texto diferente no mesmo trecho. Se a opção não carregar, se exigir reinício ou se o layout falhar, pare a demonstração e registre isso como pendência, não como detalhe para esconder.

[NA TELA] Captura 4 por quatro segundos; corte para captura 5 por quatro segundos. Sem música adicional e sem spoilers.

[EDIÇÃO] Use rótulos grandes “Portuguese” e “English”; preserve a duração equivalente e não corte uma versão para parecer mais fluida.

### 3:40–4:30 — Cobertura estrutural atual

> Há também uma verificação estrutural mais ampla no estado atual: foram encontradas 3.531 referências de tl em arquivos JSON, cobrindo 419 chaves únicas. Nenhuma dessas referências aponta para chave ausente, e a tabela não tem chaves duplicadas. Isso é uma boa notícia sobre a ligação entre referências e tabela. Ainda não é LQA: uma chave presente pode ter uma frase ruim, uma quebra de linha estranha ou um caractere sem fonte. Estrutura resolve a busca; revisão humana resolve a leitura.

[NA TELA] Três cartões: “3.531 referências”, “419 chaves únicas”, “0 ausentes / 0 duplicadas”.

[FREEZE] Rodapé: “Evidência estrutural; não substitui LQA”.

### 4:30–5:15 — O que falta testar

> Antes de chamar a localização de pronta, há uma lista concreta. Options precisa exibir e trocar o idioma como esperado. O padrão precisa abrir em Portuguese. Mensagens, escolhas e superfícies revisadas precisam renderizar em ambos os idiomas. Também é preciso conferir que não aparece uma referência tl literal, e revisar quebras, velocidade, fonte, glyphs e layout. Esse é o trabalho de LQA e Playtest: seguir o caminho do jogador, não apenas o caminho da tabela.

[NA TELA] Checklist visual com “Options”, “troca”, “renderização”, “quebras”, “fontes” e “layout”, todos marcados como pendentes.

[EDIÇÃO] Não use checks verdes nesta seção até que a equipe forneça evidência humana.

### 5:15–6:00 — Fecho

> O PR 19 aumentou e revisou a localização que já vinha sendo construída: a tabela ganhou linhas, os mapas foram revisados e a ligação de chaves pode ser auditada. O valor do vídeo está em mostrar a mesma fala ganhar duas leituras, sem esconder o que ainda precisa acontecer. Os snapshots e o PR estão na descrição. A próxima etapa responsável é LQA e Playtest: trocar idioma, ler as cenas, testar escolhas e validar a apresentação no jogo. Guardar exemplos de falhas e acertos torna essa revisão repetível para as próximas linhas. Traduzir é abrir uma porta; localizar bem é atravessá-la em cada tela.

[NA TELA] Cartela final com links e “PR #19 — estrutura ampliada; LQA/Playtest pendentes”.

[EDIÇÃO] Termine em uma tela neutra de diálogo, nunca em escolha ou cena que revele rota.

## Plano B — se a troca de idioma não estiver pronta para demonstrar

Não edite duas capturas de texto como se fossem uma troca em runtime e não esconda erro de carregamento. Faça uma versão estrutural: snapshots → contexto dos commits 7860664 e 1e2b431 → uma chave com colunas PT/EN na TSV → número de linhas e mapas revisados → contador de referências/cobertura → checklist de LQA pendente. Narre que o PR ampliou e revisou a estrutura, mas que a demonstração de Options e renderização será gravada somente após a revisão humana. Anote qualquer falha de boot, arquivo ou opção como risco separado.

## Spoilers e validações pendentes

- Use uma fala neutra e curta; oculte escolhas, nomes contextuais, acidentes, mortes, sabotagens, finais e resultados de corrida.
- Não declare Options, troca de idioma, renderização, qualidade da tradução, fluência, quebra de linha, fontes, glyph coverage ou layout como validados. Eles requerem LQA/Playtest humano.
- A checagem estrutural de 3.531 referências, 419 chaves únicas, zero ausentes e zero duplicadas descreve o estado atual analisado; não deve ser apresentada como resultado exclusivo do PR #19.
- Se uma língua exigir reinício, falhar ao carregar ou mostrar `\tl{...}` literalmente, registre a superfície e mantenha a validação aberta.

## Checklist final de publicação

- [ ] Os links de antes, depois e PR #19 abrem; os SHAs exibidos são `eab1481` e `b085855`.
- [ ] O vídeo apresenta 7860664 e 1e2b431 apenas como contexto da infraestrutura anterior, não como a comparação principal.
- [ ] Os worktrees são `../jhonny-video-12-antes` e `../jhonny-video-12-depois`.
- [ ] A fala informa corretamente TSV, `Languages.tsv`, Message Core ativo, Portuguese padrão e os idiomas Portuguese/English.
- [ ] Contagens corretas: antes 374 linhas de dados (375 com cabeçalho), depois 456 chaves, PR +82 linhas, Map016–020 e Map023–026 revisados.
- [ ] A estatística atual 3.531/419/zero ausentes/zero duplicadas está marcada como estrutural e atual, não como mérito exclusivo do PR.
- [ ] A comparação usa a mesma fala, o mesmo enquadramento e não expõe spoiler; se ela não funcionar, o Plano B foi usado.
- [ ] O vídeo deixa Options, renderização, qualidade, layout e LQA/Playtest explicitamente pendentes.
