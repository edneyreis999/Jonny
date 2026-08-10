# Ideias de devlog para Jhonny

Este arquivo transforma commits e Pull Requests do repositório em pautas de devlog. Os fatos citados vêm do histórico do projeto; títulos, ganchos e formas de contar a história são sugestões editoriais. Antes de publicar, vale capturar as duas versões em Playtest para confirmar os detalhes visuais e evitar spoilers acidentais.

## Formato recomendado para os posts

Uma estrutura curta que funciona bem para todas as ideias:

1. **Gancho:** mostre o resultado final nos primeiros segundos.
2. **Antes:** apresente a limitação, o problema ou a sensação que faltava.
3. **Decisão:** explique a intenção de design, não apenas quais arquivos mudaram.
4. **Depois:** mostre como a experiência do jogador mudou.
5. **Bastidor:** encerre com um detalhe curioso, erro, aprendizado ou comparação.

Para comparações, tente gravar o mesmo trecho, com o mesmo enquadramento e duração, nas versões anterior e posterior. Um GIF em tela dividida costuma comunicar melhor que vários parágrafos.

---

## 1. De protótipo a visual novel jogável

**Gancho possível:** “O primeiro grande PR de Jhonny adicionou quase cem mil linhas — mas o que o jogador realmente ganhou com isso?”

**Base no histórico:** [PR #1 — Release phase B](https://github.com/edneyreis999/Jonny/pull/1), com novos mapas, cenas, eventos comuns, imagens de cenário e os plugins de bustos.

### Antes da alteração

Falar sobre o momento em que o projeto ainda parecia um conjunto de sistemas e ideias isoladas. Explicar quais elementos faltavam para existir uma sequência narrativa reconhecível: cenários, personagens em tela, transições entre mapas e eventos capazes de conduzir a história.

### Depois da alteração

Mostrar como a combinação de mapas, imagens e bustos converteu a base técnica em uma experiência que já podia ser percorrida como história. O ponto interessante não é o tamanho do PR, mas a passagem de “peças do jogo” para “uma jornada com começo, progressão e cenas”.

### Imagem ou GIF sugerido

- Uma montagem com três momentos: projeto inicial, primeira cena com bustos e uma sequência posterior.
- Um GIF acelerado percorrendo as miniaturas dos mapas adicionados.
- Um card com “28 arquivos alterados / 99.871 adições” e, logo depois, o resultado dentro do jogo.

---

## 2. O pequeno bug que podia interromper toda a história

**Gancho possível:** “Duas linhas separavam o prólogo de um jogador preso para sempre.”

**Base no histórico:** [PR #3 — fix prologo](https://github.com/edneyreis999/Jonny/pull/3), que alterou apenas duas linhas em `Map010.json`, além dos commits anteriores sobre correções de dead end.

### Antes da alteração

Contar como jogos narrativos dependem de uma cadeia de estados, rotas e eventos. Uma alteração minúscula pode não ter impacto visual no código, mas pode impedir a progressão e quebrar completamente a confiança do jogador.

### Depois da alteração

Mostrar o fluxo seguindo normalmente e explicar por que correções pequenas merecem devlog: elas tornam invisível um problema que antes dominava toda a experiência. É uma boa pauta para falar sobre Playtest, reprodução de bugs e verificação de rotas narrativas.

### Imagem ou GIF sugerido

- GIF “antes” terminando no ponto sem saída, seguido do “depois” avançando para a cena seguinte.
- Captura do mapa com uma seta destacando o evento responsável, sem expor o JSON inteiro.
- Um zoom dramático no diff de duas linhas e corte imediato para o trecho funcionando.

---

## 3. Quando o menu começou a contar a mesma história que o jogo

**Gancho possível:** “A identidade de um jogo começa antes de apertar Novo Jogo.”

**Base no histórico:** [PR #4 — Update/UI](https://github.com/edneyreis999/Jonny/pull/4) e [PR #9 — Novos Plugins e ajustes](https://github.com/edneyreis999/Jonny/pull/9), com correções de menu e fonte, nova tela de título, janela, tipografia, música e recursos de mensagem.

### Antes da alteração

Falar sobre o contraste entre uma história com personalidade própria e uma interface ainda próxima do padrão do RPG Maker. Explicar como fonte, contorno, janela, título e música podem parecer detalhes independentes, embora formem a primeira impressão do jogo.

### Depois da alteração

Apresentar o menu como parte do tom narrativo. Comentar como consistência audiovisual prepara o jogador para o universo de Jhonny antes mesmo da primeira fala e como plugins de mensagens estendem essa identidade às cenas.

### Imagem ou GIF sugerido

- Comparação lado a lado da tela de título antiga e da nova.
- GIF entrando pelo menu e chegando à primeira caixa de diálogo, destacando a continuidade visual.
- Vídeo curto com áudio: alguns segundos do menu antes e depois, usando fones como ícone na publicação.

---

## 4. Como dar rosto — e emoção — a uma conversa

**Gancho possível:** “O texto era o mesmo. A conversa, não.”

**Base no histórico:** [PR #7 — Melhorias Gerais](https://github.com/edneyreis999/Jonny/pull/7) e [PR #8 — Expressões de personagens](https://github.com/edneyreis999/Jonny/pull/8), com novos retratos, dez variações do jogador, nove de Jonny e integração com Message Core.

### Antes da alteração

Mostrar uma conversa com retrato estático ou pouca variação e explicar o limite disso: a fala entrega a informação, mas parte da intenção precisa ser imaginada. Também é possível comentar o desafio de sincronizar emoção, texto e ritmo sem transformar cada diálogo em trabalho manual excessivo.

### Depois da alteração

Mostrar a mesma conversa com mudanças de expressão. Falar sobre subtexto: surpresa, dúvida ou irritação podem chegar antes da próxima linha. A pauta pode explorar como retratos não servem apenas para “embelezar”, mas também para dirigir a leitura da cena.

### Imagem ou GIF sugerido

- Sprite sheet ou mosaico das expressões com rótulos bem-humorados.
- GIF da mesma fala com retrato estático e com troca de expressão.
- Sequência de três frames: fala, reação, resposta.

---

## 5. O som que fez o mundo deixar de parecer silencioso

**Gancho possível:** “Feche os olhos: você ainda consegue entender o que aconteceu na corrida?”

**Base no histórico:** [PR #10 — sons e musicas](https://github.com/edneyreis999/Jonny/pull/10), que adicionou músicas de corrida e finais, aceleração, SMS, frenagem, vidro quebrando, colisão e explosão.

### Antes da alteração

Falar sobre cenas que já funcionavam visualmente, mas ainda não tinham peso, antecipação ou consequência sonora. Explicar a diferença entre colocar uma música de fundo e desenhar uma sequência com sinais auditivos reconhecíveis.

### Depois da alteração

Usar a corrida como exemplo de narrativa sonora: acelerar cria expectativa; frear comunica decisão; colisão e vidro quebrando entregam consequência; músicas diferentes ajudam a separar tensão, vitória e derrota. Comentar como o áudio também informa quando o jogador não está olhando exatamente para o elemento visual.

### Imagem ou GIF sugerido

- Vídeo “com som / sem som” da mesma cena; neste caso, vídeo funciona melhor que GIF.
- Forma de onda dos efeitos surgindo em sincronia com a ação.
- Uma imagem do mapa com os sons posicionados como uma trilha visual: SMS → motor → freada → impacto.

---

## 6. Cortamos mais de 30 mil linhas sem cortar a história

**Gancho possível:** “O melhor commit da semana talvez tenha sido o que apagou 31.686 linhas.”

**Base no histórico:** [PR #11 — Sistematização de diálogos](https://github.com/edneyreis999/Jonny/pull/11), com reutilização de diálogos em eventos comuns e grande redução de `Map013.json`.

### Antes da alteração

Explicar, em linguagem simples, como escolhas e falas repetidas haviam crescido dentro de um mapa enorme. Cada correção podia precisar ser refeita em vários lugares, criando risco de uma rota receber a melhoria e outra ficar esquecida.

### Depois da alteração

Mostrar o conceito de diálogo reutilizável: uma fonte central pode servir a várias rotas sem mudar a experiência pretendida. Falar sobre o benefício criativo, não apenas técnico — quando a estrutura é menos frágil, sobra mais segurança para revisar texto, ritmo e escolhas.

### Imagem ou GIF sugerido

- Animação de vários blocos repetidos convergindo para um único evento comum.
- Captura “antes” do diagrama cheio e “depois” do fluxo sistematizado.
- Contador animado descendo de 31.686 linhas para um mapa muito menor.

---

## 7. Como resumir uma vida antes do jogador assumir o controle

**Gancho possível:** “Quanto da vida de um personagem cabe em uma introdução?”

**Base no histórico:** [PR #12 — Introdução](https://github.com/edneyreis999/Jonny/pull/12), com um novo mapa e imagens de escola, festa, garagem, caderno, mensagens, Opala e posições na corrida.

### Antes da alteração

Falar sobre o risco de começar uma história pedindo que o jogador se importe com pessoas e conflitos que ele ainda não conhece. Explicar a pergunta de design: como oferecer contexto sem transformar a abertura em uma exposição longa?

### Depois da alteração

Mostrar como uma montagem de cenários e momentos pode condensar relações, ambições e passagem do tempo. Comentar a escolha de imagens que funcionam como memória ou álbum, deixando o jogador construir conexões antes de entrar na ação principal.

### Imagem ou GIF sugerido

- GIF em ritmo de álbum passando por caderno, escola, festa, garagem e Opala.
- Storyboard com as imagens da introdução e uma frase sobre a função narrativa de cada uma.
- Comparação do primeiro minuto do jogo antes e depois da nova introdução.

---

## 8. “Juice” na corrida: quando apertar um botão finalmente parece uma ação

**Gancho possível:** “A corrida já calculava tudo. O problema é que o jogador não sentia nada.”

**Base no histórico:** commits `92e54e7` (`feat(race): add race juice feedback`) e [PR #13 — atualização da lógica de Jhonny](https://github.com/edneyreis999/Jonny/pull/13), que expandiu `Jhonny_RaceHelper.js` com HUD, notificações, renderização e tratamento de interação.

### Antes da alteração

Mostrar uma decisão da corrida funcionando nos bastidores, mas com resposta visual pequena ou tardia. Explicar que lógica correta não garante sensação de controle: o jogador precisa perceber que o comando foi aceito, o estado mudou e existe uma consequência em andamento.

### Depois da alteração

Mostrar notificações, mudanças de HUD e resposta dos botões. Falar sobre o ciclo “entrada → feedback → consequência” e como milissegundos de resposta visual podem tornar uma mecânica mais legível e satisfatória sem mudar sua regra central.

### Imagem ou GIF sugerido

- GIF em tela dividida com uma única ação antes e depois do feedback.
- Gráfico simples sobreposto ao vídeo: botão pressionado → HUD reage → evento acontece.
- Close apenas na região do HUD, em câmera lenta, para destacar mudanças rápidas.

---

## 9. A HUD como consciência do jogador

**Gancho possível:** “E se a interface não mostrasse apenas números, mas também o tipo de pessoa que você está escolhendo ser?”

**Base no histórico:** commits de atualização das barras e da interface da corrida, documentação sobre Disciplina e HUD (`007c245`) e imagens de consciência, sorte e níveis de risco adicionadas no [PR #17](https://github.com/edneyreis999/Jonny/pull/17).

### Antes da alteração

Falar sobre variáveis importantes que existiam no sistema, porém podiam ser abstratas demais para o jogador. Sem leitura visual, uma escolha pode parecer arbitrária e uma derrota pode parecer injusta, mesmo quando o jogo calculou tudo corretamente.

### Depois da alteração

Explorar a ideia da HUD como narradora: barras e overlays traduzem sorte, consciência e risco em tensão visível. Comentar o equilíbrio delicado entre informar o bastante para decisões conscientes e preservar incerteza suficiente para a corrida continuar emocionante.

### Imagem ou GIF sugerido

- Três capturas do overlay em risco baixo, médio e alto.
- GIF da barra reagindo a duas escolhas opostas.
- Mockup anotado da HUD explicando o que cada elemento comunica emocionalmente.

---

## 10. Trocar uma lista por imagens mudou o peso das escolhas

**Gancho possível:** “A mesma decisão parece diferente quando você vê a consequência antes de clicar.”

**Base no histórico:** [PR #14 — Pictures and choices](https://github.com/edneyreis999/Jonny/pull/14), com escolhas por imagens, novos sons do minigame e telas dedicadas de vitória, derrota e carro quebrado.

### Antes da alteração

Mostrar a escolha em formato textual e comentar suas virtudes e limites. Uma lista é clara e eficiente, mas pode fazer uma decisão dramática parecer apenas uma opção de menu.

### Depois da alteração

Mostrar escolhas visuais e explicar como composição, ícone e imagem antecipam intenção. Falar também sobre acessibilidade e legibilidade: uma boa escolha visual precisa reforçar o texto, não substituí-lo de maneira ambígua.

### Imagem ou GIF sugerido

- Comparação da mesma decisão como lista e como Picture Choice.
- GIF do cursor passando pelas opções e revelando o feedback de seleção.
- Carrossel com cada botão visual e uma nota sobre a emoção que ele deveria provocar.

---

## 11. Vitória, derrota e carro quebrado merecem finais diferentes

**Gancho possível:** “Um resultado não é só um número; é a última emoção que a corrida deixa.”

**Base no histórico:** commit `97458cd` (`route race results to dedicated maps`) e [PR #14](https://github.com/edneyreis999/Jonny/pull/14), com mapas e imagens específicas para diferentes resultados.

### Antes da alteração

Falar sobre resultados resolvidos de forma mais genérica ou concentrados no mesmo fluxo. Explicar como isso pode reduzir a sensação de consequência: o sistema sabe que os resultados são diferentes, mas a apresentação não lhes dá identidades próprias.

### Depois da alteração

Mostrar os destinos separados e comentar como cenário, música e ritmo podem oferecer uma “cauda emocional” particular para cada resultado. É também uma oportunidade para discutir por que derrota não precisa ser apenas punição — ela pode entregar história, humor, tensão ou vontade de tentar novamente.

### Imagem ou GIF sugerido

- Tríptico com Vitória, Derrota e Carro Quebrado.
- GIF com a bifurcação do resultado levando a três mapas.
- Vídeo curto alternando os primeiros segundos de cada resultado, preservando os spoilers finais.

---

## 12. A cena da batida: transformar falha em consequência dramática

**Gancho possível:** “Perder a corrida era uma condição. Depois desta mudança, virou uma cena.”

**Base no histórico:** [PR #6 — add cena batida](https://github.com/edneyreis999/Jonny/pull/6), que criou `Map016.json` e ajustou os eventos comuns.

### Antes da alteração

Explicar a diferença entre o sistema declarar uma falha e o mundo reagir a ela. Antes de uma apresentação dedicada, a batida podia ser entendida como simples troca de estado ou encerramento abrupto.

### Depois da alteração

Mostrar como uma cena específica permite dar tempo, espaço e peso ao acontecimento. Falar sobre ritmo: antecipação, impacto, silêncio e reação podem fazer a mesma regra mecânica produzir uma memória narrativa.

### Imagem ou GIF sugerido

- Sequência de quatro frames: risco, decisão, impacto e consequência.
- GIF curto da entrada na cena, cortado antes de um possível spoiler.
- Storyboard com anotações de som e duração para mostrar o trabalho por trás do momento.

---

## 13. O polimento invisível dos bustos e das mensagens

**Gancho possível:** “Se o jogador não percebe este trabalho, talvez ele tenha funcionado.”

**Base no histórico:** [PR #15 — ajuste de busto](https://github.com/edneyreis999/Jonny/pull/15), com seis rodadas de ajustes, padronização de mensagens e escolhas e documentação durável sobre diálogos repetidos.

### Antes da alteração

Mostrar pequenos desalinhamentos ou inconsistências entre cenas: posição de busto, apresentação de nomes, estilo de escolha ou ritmo da caixa de texto. Explicar como cada detalhe isolado parece tolerável, mas a repetição produz uma sensação de acabamento irregular.

### Depois da alteração

Apresentar a padronização como direção de cena. O foco do jogador deixa de ir para a interface e volta para a conversa. Também vale falar honestamente sobre as várias rodadas de ajuste: polimento raramente nasce de uma única decisão perfeita.

### Imagem ou GIF sugerido

- GIF piscando entre antes e depois para revelar deslocamentos sutis.
- Grade com quatro cenas diferentes após a padronização.
- Montagem dos commits “ajuste-1” a “ajuste-5” como capítulos de uma pequena saga de polimento.

---

## 14. Créditos puláveis e o design de respeitar o tempo do jogador

**Gancho possível:** “Adicionar conteúdo é design. Deixar o jogador pular também é.”

**Base no histórico:** [PR #16 — ajustes de mensagem e créditos](https://github.com/edneyreis999/Jonny/pull/16), que adicionou a cena de créditos e o plugin `Jhonny_CreditsSkip.js`.

### Antes da alteração

Falar sobre o dilema dos créditos: eles reconhecem quem construiu o jogo e encerram a experiência, mas podem se tornar uma barreira em replays, testes ou quando o jogador precisa sair rapidamente.

### Depois da alteração

Mostrar a cena e a opção de avançar. Explicar que respeitar a agência não diminui os créditos; dá ao jogador controle sobre o ritmo. Esta pauta também rende um bastidor sobre por que ferramentas pequenas e específicas podem resolver problemas de experiência com clareza.

### Imagem ou GIF sugerido

- GIF da indicação de pulo aparecendo e do comando funcionando.
- Captura bonita dos créditos acompanhada de um pequeno diagrama do fluxo “assistir / pular”.
- Vídeo comparando primeira conclusão e replay.

---

## 15. O commit chamado “ajuste” que virou direção cinematográfica

**Gancho possível:** “O PR se chamava apenas ‘ajuste v3-2’. Dentro dele havia uma nova linguagem visual para a corrida.”

**Base no histórico:** [PR #17 — ajuste v3-2](https://github.com/edneyreis999/Jonny/pull/17), com transições para SMS, pré e pós-corrida, pneu furado, seis novos mapas, imagens, áudio e feedback visual do minigame; seguido pelo polimento do [PR #18](https://github.com/edneyreis999/Jonny/pull/18).

### Antes da alteração

Falar sobre eventos conectados corretamente, mas ainda separados por cortes funcionais. Explicar como a falta de transições pode fazer o jogador sentir o mecanismo do jogo: terminou um evento, carregou outro, começou a próxima etapa.

### Depois da alteração

Mostrar como imagens de transição, mapas intermediários, áudio e feedback ajudam a esconder as costuras. A pauta pode defender que direção cinematográfica não depende apenas de animações caras; enquadramento, timing, som e uma boa imagem estática já transformam a continuidade.

### Imagem ou GIF sugerido

- Supercut das transições de SMS, pré-corrida, pós-corrida e pneu furado.
- Linha do tempo “cena → transição → minigame → consequência”.
- Antes/depois de um corte seco comparado à nova passagem cinematográfica.

---

## 16. Traduzir o jogo também revelou inconsistências da própria história

**Gancho possível:** “Traduzir não foi trocar palavras: foi descobrir o que o jogo realmente queria dizer.”

**Base no histórico:** [PR #19 — tradução](https://github.com/edneyreis999/Jonny/pull/19), com expansão de `Languages.tsv` e revisão de múltiplos mapas, apoiado pelo trabalho de localização dos PRs anteriores. O histórico também registra a padronização do nome do personagem de “Player” para “Chance”.

### Antes da alteração

Falar sobre textos presos diretamente às cenas, termos inconsistentes e nomes que podem variar entre mapas. Explicar por que localizar um jogo narrativo exige contexto: uma frase correta isoladamente pode estar errada para a voz do personagem ou para a situação.

### Depois da alteração

Mostrar a tabela de idiomas alimentando várias cenas e comentar como centralizar textos facilita consistência e revisão. Usar a mudança de “Player” para “Chance” como exemplo de como localização também força decisões sobre identidade, nomenclatura e continuidade.

### Imagem ou GIF sugerido

- GIF alternando o mesmo diálogo entre os idiomas disponíveis.
- Tela dividida entre uma chave na tabela e sua aparição dentro do jogo.
- Nuvem de palavras com termos que precisaram ser padronizados, evitando revelar falas importantes.

---

## 17. O devlog meta: como documentação e Playtest salvaram a corrida

**Gancho possível:** “Nem toda melhoria aparece no jogo — algumas impedem que a próxima atualização o quebre.”

**Base no histórico:** commits de retrospectivas e documentação da corrida, correção da inversão do evento de curva (`9f1d421`), refatoração de thresholds (`e984eb2`) e os registros de Playwright presentes no [PR #13](https://github.com/edneyreis999/Jonny/pull/13).

### Antes da alteração

Contar um caso em que intenção, configuração e comportamento real podiam divergir — como a associação invertida de um evento de curva. Explicar por que sistemas com variáveis, switches, eventos comuns e feedback visual são difíceis de validar olhando apenas para um arquivo.

### Depois da alteração

Mostrar o ciclo de trabalho: observar no Playtest, registrar evidência, corrigir, atualizar a documentação e testar novamente. A mensagem central é que documentação não é burocracia quando preserva uma decisão e impede a regressão do mesmo erro.

### Imagem ou GIF sugerido

- Bastidor com editor, jogo e documento lado a lado.
- GIF do comportamento incorreto e do corrigido, com legendas “evento ligado” e “evento esperado”.
- Linha do tempo de bug → diagnóstico → correção → retrospectiva.

---

## 18. Um mês de evolução em 60 segundos

**Gancho possível:** “De 16 de junho a 21 de julho: veja Jhonny ganhar rosto, voz, corrida e novos idiomas.”

**Base no histórico:** evolução do primeiro commit do workspace até os 19 PRs mesclados, passando por visual novel, corrida, finais, áudio, expressões, sistematização de diálogos, introdução, polimento e tradução.

### Antes da alteração

Abrir com o estado mais antigo que ainda seja executável e explicar em uma frase a promessa inicial do projeto. Evitar uma lista de features; mostrar o que ainda não era sentido pelo jogador.

### Depois da alteração

Fazer uma montagem cronológica na qual cada corte acrescenta uma camada: cenário, busto, expressão, som, HUD, escolha visual, consequência, transição e localização. Encerrar com o estado atual e uma pergunta sobre qual bastidor merece um devlog completo.

### Imagem ou GIF sugerido

- Timelapse com a data e o número do PR no canto.
- Tela dividida entre primeira e última versão do mesmo trecho, quando possível.
- Mosaico final com uma imagem representativa de cada PR.

---

## Três séries recorrentes que podem nascer dessas pautas

### “Antes e depois de uma sensação”

Posts curtos que não comparam apenas gráficos, mas sensações: silêncio/peso sonoro, clique/resposta, lista/decisão dramática, resultado/consequência.

### “O commit não conta a história inteira”

Escolher mensagens simples como “ajuste-3”, “polimento-2” ou “add cena batida” e revelar o trabalho de narrativa, UX e testes escondido atrás delas.

### “Autópsia de um mapa”

Em cada episódio, abrir um mapa importante e explicar uma única transformação: o prólogo, a introdução, a corrida, a batida ou um dos resultados. Use diagramas simplificados e imagens do jogo em vez de exibir grandes blocos de JSON.

## Checklist visual antes de publicar

- Capturar o “antes” a partir do commit pai ou da base do PR e o “depois” a partir do merge.
- Usar o mesmo save, trecho, resolução e volume nas duas capturas.
- Preferir GIFs de 4 a 8 segundos para UI, retratos e transições.
- Usar vídeo com áudio para música, aceleração, frenagem, colisão e ritmo de cena.
- Esconder spoilers com cortes, blur ou enquadramentos fechados.
- Colocar legendas: muita gente verá o devlog sem som.
- Mostrar diffs apenas quando forem visualmente fortes; para JSON de mapas, um diagrama costuma ser mais compreensível.
- Terminar cada post com uma pergunta específica, como “qual expressão funciona melhor?” ou “você prefere risco explícito ou mais misterioso?”.

## Ordem sugerida de publicação

Para começar com temas mais visuais e fáceis de entender, a sequência mais forte seria:

1. **Juice na corrida** — comparação imediata e chamativa.
2. **Expressões de personagens** — forte apelo visual e emocional.
3. **Som da corrida** — excelente para vídeo curto.
4. **Escolhas por imagens** — mostra uma decisão clara de UX.
5. **31 mil linhas removidas** — bastidor técnico com um número memorável.
6. **Um mês em 60 segundos** — fecha a primeira temporada e aponta para os próximos episódios.
