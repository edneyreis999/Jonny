---
title: "07 — A corrida ficou mais comunicativa e responsiva"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos"
spoken_word_target: "aproximadamente 742 palavras (faixa de 650–850)"
validation_status: "structural_validation; runtime_pending"
---

# A corrida ficou mais comunicativa e responsiva

## Ficha rápida

| Campo | Informação |
| --- | --- |
| Promessa | Mostrar o ciclo `ação → feedback → consequência` comparando um clique seguro idêntico antes e depois do PR #13. |
| Antes | Branch `main`, SHA [`515e55d66619f30f15ea2b1064e8793a3b40a0e4`](https://github.com/edneyreis999/Jonny/tree/515e55d66619f30f15ea2b1064e8793a3b40a0e4) |
| Depois | Branch `feat/juice-on-race`, SHA [`17a95a329ded18938f1b727a518e8f6997c02bbe`](https://github.com/edneyreis999/Jonny/tree/17a95a329ded18938f1b727a518e8f6997c02bbe) |
| Evidência principal | [PR #13 — Juice on race](https://github.com/edneyreis999/Jonny/pull/13) |
| Fatos verificáveis | `Jhonny_RaceHelper.js` recebeu 498 linhas e perdeu 2; o diff implementa HUD expandida, fila de eventos visuais, renderização de estado, pulsos de botões e integração com logs. `CommonEvents.json` e a versão do projeto em `System.json` também mudaram. |
| Ação comparada | Em uma cena de sinal, clicar uma vez em `btn_parar`, a ação segura ligada ao evento `SAFE_CLICK`. |
| Leitura editorial | Expor estado e reagir ao comando **pode** tornar a corrida mais comunicativa. Clareza, resposta percebida e diversão não estão comprovadas pelo código. |
| Status de validação | JSON e sintaxe conferidos nos snapshots; resposta, timing, clareza, balanceamento e funcionamento dos botões aguardam gravação e Playtest humano. |
| Risco de spoiler | Médio: grave somente uma decisão intermediária; não mostre colisão, vitória, derrota, resultados ou transições narrativas. |

## Preparação da gravação

Execute a partir de `/Users/edney/projects/coreto/summer26`. Use worktrees destacados para não depender do estado atual das branches:

```bash
git worktree add --detach ../jhonny-video-07-antes 515e55d66619f30f15ea2b1064e8793a3b40a0e4
git worktree add --detach ../jhonny-video-07-depois 17a95a329ded18938f1b727a518e8f6997c02bbe
```

Sirva os projetos em portas diferentes:

```bash
python3 -m http.server 8701 --directory ../jhonny-video-07-antes/Jhonny
python3 -m http.server 8702 --directory ../jhonny-video-07-depois/Jhonny
```

- Abra `http://127.0.0.1:8701` e `http://127.0.0.1:8702` em perfis separados. Grave o canvas em 1280×720, resolução configurada nos dois snapshots.
- Comece uma sessão nova em cada versão e percorra a mesma rota até a corrida. Não reutilize save entre snapshots e não edite variáveis para fabricar uma comparação.
- Espere uma cena de sinal. Imediatamente antes do clique, anote disciplina, sucesso/fracasso, timer e posição que estiverem visíveis. Clique uma vez em `btn_parar`. Se os estados não forem comparáveis, grave outra ocorrência ou use o Plano B.
- Capture de dois segundos antes do clique até três segundos depois. Mantenha cursor, escala e enquadramento iguais; o vídeo deve permitir observar a resposta sem afirmar antecipadamente que ela ocorreu.
- Para B-roll técnico, deixe prontos o diff do helper, o Common Event `EV_OnSafe` e o console filtrado por `RACE_EVENT`. Registros de navegador versionados no PR não equivalem a aprovação humana.

Depois de gravar, encerre os servidores e remova somente estes worktrees:

```bash
git worktree remove ../jhonny-video-07-antes
git worktree remove ../jhonny-video-07-depois
```

## Plano de capturas — 8 tomadas

1. Cartela `ENTRADA → FEEDBACK → CONSEQUÊNCIA`, com os SHAs curtos `515e55d` e `17a95a3`.
2. Tela dividida da mesma ação: cena de sinal, um clique em `btn_parar`, velocidade normal e sem cortar entre o toque e a resposta.
3. [FREEZE] do depois com a HUD inteira: `DISCIPLINA`, `SUCESSO/FRACASSO`, `TIMER` e `POSICOES`.
4. Close do botão seguro imediatamente antes e depois do clique; destaque qualquer pulso somente se ele estiver visível na gravação.
5. [FREEZE] nos valores antes/depois da ação segura, sem concluir que os números estão balanceados.
6. Quadro de posições; se “ULTRAPASSOU!” surgir naturalmente, capture. Não force estado para obtê-lo.
7. [B-ROLL] de `SAFE_CLICK → notifyHudEvent → _safePulse/_gloryPulse → redraw`, usando apenas pequenos recortes do diff.
8. [B-ROLL] de `RACE_EVENT: SAFE_CLICK` no console e da estatística `+498 / -2`, legendada como “tamanho do patch, não benefício”.

## Roteiro cronometrado

### 0:00–0:30 — Gancho

> A corrida já processava as decisões do jogador. O desafio era fazer cada decisão parecer recebida. Neste vídeo, vamos clicar exatamente na mesma ação segura em duas versões de Jhonny e observar o intervalo entre entrada, feedback e consequência. No antes, o sistema já tem botões e regras. No depois, uma nova camada tenta transformar os números da corrida em sinais visuais que o jogador consegue acompanhar enquanto decide.

[NA TELA] Captura 1; corte para a tela dividida no primeiro “clicar”.

[EDIÇÃO] Legenda fixa: “Comportamento perceptível aguardando validação da gravação”.

### 0:30–1:05 — Os dois pontos de comparação

> O antes é a main no commit 515e55d. O depois é a branch feat/juice-on-race no commit 17a95a3, registrada no pull request número 13. O arquivo `Jhonny_RaceHelper.js` recebeu 498 linhas e perdeu duas. Esse número mostra o tamanho do patch, não o tamanho do benefício. A evidência importante está no que foi implementado: HUD, notificações de evento, renderização de estado, integração de logs e tratamento visual da interação com os botões.

[NA TELA] Snapshots, PR #13 e captura 8.

[FREEZE] Em `+498 / -2`, sobreponha “escopo técnico”.

### 1:05–1:45 — O que já existia antes

> É importante não apagar o trabalho da versão anterior. A corrida já mostrava imagens, recebia escolhas e executava os eventos de ação segura e arriscada. O evento `SAFE_CLICK` também já era registrado. Por isso, a comparação não é “sem interface contra com interface”. O recorte correto é mais específico: o helper anterior não tinha a nova camada `Sprite_JhonnyRaceHud`, nem a fila que converte eventos da corrida em pulsos visuais. Vamos olhar para um único clique, sem usar resultado final como atalho dramático.

[NA TELA] Antes sozinho por alguns segundos; destaque apenas o botão escolhido e o estado visível.

[EDIÇÃO] Use o rótulo “ANTES — mesma ação”, nunca “sem feedback”.

### 1:45–2:35 — A mesma ação no depois

> Agora repetimos a cena de sinal e clicamos uma vez em `btn_parar`. No código do depois, a imagem 41 é classificada como ação segura. O clique envia `safe_press`; quando o Common Event registra `SAFE_CLICK`, a fila também aciona pulsos para o botão seguro e para a área de progresso. Ao mesmo tempo, a HUD redesenha o estado corrente. Se a gravação mostrar esse encadeamento, congele o quadro e acompanhe com setas: dedo ou cursor, botão, medidor, novo estado. Se não mostrar, mantenha a conclusão pendente.

[NA TELA] Capturas 2 e 4; reproduza uma vez em velocidade normal e uma em 70%.

[FREEZE] Só marque o que realmente mudou entre os frames capturados.

### 2:35–3:20 — O que a HUD tenta comunicar

> A camada nova reúne quatro leituras. À esquerda, disciplina. No centro, sucesso e fracasso, compostos a partir do poder da cena e da disciplina. No alto, o timer ganha tratamento crítico nos últimos segundos. À direita, um quadro ordena Jhonny e os rivais por posição estimada a partir da pontuação. O código também prevê brilho, interpolação dos valores e aviso de ultrapassagem. São intenções de apresentação verificáveis no arquivo; legibilidade e precisão percebida só podem ser avaliadas olhando a execução.

[NA TELA] Captura 3; revele os quatro blocos no sentido horário.

[B-ROLL] Capturas 5 e 6, sem mostrar o encerramento da corrida.

### 3:20–4:05 — Feedback não é só colocar números

> Um painel estático informa. Uma resposta temporal confirma. O helper mantém pulsos separados para progresso, risco, timer, botão seguro, botão arriscado, posição e perigo. Mudanças de valor são suavizadas entre o estado anterior e o atual, e o botão recebe uma pequena variação de escala. Essa é a diferença conceitual deste PR: não apenas exibir dados, mas reagir quando alguma coisa acontece. Ainda assim, duração, intensidade e clareza desses efeitos são decisões de sensação; 20 ou 30 frames no código não garantem uma resposta boa para quem joga.

[NA TELA] Captura 7, seguida do close do botão.

[EDIÇÃO] Use setas curtas, sem cobrir o timer ou a porcentagem.

### 4:05–4:45 — A costura com os eventos

> A camada visual não inventa um segundo sistema de corrida. Ela lê variáveis e switches já usados pelos Common Events. O logger estruturado captura o estado e, no depois, também envia o tipo do evento para a fila da HUD. Isso permite relacionar o frame do clique ao `SAFE_CLICK` no console e ao redesenho visual. O log é ferramenta de diagnóstico, não recurso para o jogador. Ele ajuda a equipe a investigar se a entrada foi registrada, mas não prova que o botão funcionou corretamente em todas as situações.

[B-ROLL] Captura 8; mostre somente um evento e o frame correspondente.

[FREEZE] Cartela: “log observado ≠ UX aprovada”.

### 4:45–5:25 — O limite da comparação

> O PR também altera números em `CommonEvents.json`, inclusive limites ligados à disciplina. Portanto, não devemos usar este vídeo para declarar que a corrida ficou melhor balanceada. A tomada tenta isolar a apresentação escolhendo a mesma ação segura e estados iniciais comparáveis, mas o snapshot posterior não é apenas uma skin do anterior. Também ficam pendentes a resposta ao toque, o clique repetido, o bloqueio de entrada, o timer sob pressão e os dois tipos de cena. Se qualquer diferença de estado afetar a comparação, ela precisa aparecer na legenda.

[NA TELA] Captura 5 com a tarja “Balanceamento fora do escopo deste vídeo”.

[EDIÇÃO] Não use placar de vencedor, nota ou selo de “mais responsivo”.

### 5:25–6:00 — Fecho

> A melhoria número 7 adicionou uma camada para tornar visíveis disciplina, risco, tempo, posição e reação aos comandos. A ideia é simples: quando o jogador age, a interface deve responder e mostrar o que mudou. O Git comprova a implementação; a gravação precisa confirmar a experiência. Os dois snapshots e o PR número 13 estão na descrição. Antes de publicar, ainda vamos revisar funcionamento dos botões, timing, clareza, balanceamento e possíveis regressões. A corrida já calculava a decisão; agora existe uma tentativa concreta de fazê-la ser sentida.

[NA TELA] Cartela final: `ação → resposta → estado`, links e “PR #13”.

[EDIÇÃO] Termine em uma decisão intermediária, antes de qualquer resultado.

## Plano B — se a demonstração em jogo não colaborar

Não altere variáveis, Common Events ou saves para simular resposta. Substitua a captura de runtime por uma comparação estática e honesta: helper antes sem `Sprite_JhonnyRaceHud` → helper depois com os quatro painéis → fluxo `btn_parar / imagem 41 → safe_press → SAFE_CLICK → pulsos → redraw` → lista dos rótulos desenhados → cartela `runtime_pending`. Mostre a mesma ação no `EV_OnSafe` dos dois snapshots e explique que os eventos estruturais existem, mas a resposta perceptível não foi confirmada. Os artefatos de Playwright versionados no PR podem aparecer como histórico técnico, nunca como aprovação de gameplay.

## Spoilers e validações pendentes

- Grave uma ação intermediária de sinal. Corte antes de colisão, vitória, derrota, tela de resultado ou transição para cenas narrativas.
- Não mostre rotas, mortes, sabotagem, acidente, finais ou o resultado acumulado da corrida.
- Permanecem pendentes até gravação/Playtest humano: clique e toque nos quatro botões, resposta a teclado, pulso visual, timing, leitura das porcentagens, timer crítico, quadro de posições, aviso de ultrapassagem, bloqueio de entrada e comportamento em diferentes resoluções.
- O balanceamento também está pendente: o PR alterou regras numéricas em `CommonEvents.json`; uma única tomada não valida probabilidades, dificuldade ou progressão.
- Os logs e registros de navegador não comprovam clareza, diversão, ausência de bugs nem cobertura de rotas.

## Checklist final de publicação

- [ ] Links, branches e SHAs correspondem a `515e55d66619f30f15ea2b1064e8793a3b40a0e4`, `17a95a329ded18938f1b727a518e8f6997c02bbe` e PR #13.
- [ ] A comparação mostra um único clique em `btn_parar` numa cena de sinal, com enquadramento e velocidade equivalentes.
- [ ] Os valores anteriores ao clique são comparáveis; qualquer diferença está declarada na tela.
- [ ] Há entre cinco e oito capturas; este plano prevê oito.
- [ ] `+498 / -2` aparece somente como dimensão do patch, nunca como benefício para o jogador.
- [ ] Nenhum efeito é marcado na edição se não estiver realmente visível nos frames gravados.
- [ ] Resposta, timing, clareza, balanceamento e funcionamento dos botões continuam pendentes até revisão humana da gravação.
- [ ] Nenhum frame revela colisão, resultado, morte, sabotagem ou final.
- [ ] O vídeo não afirma “validado”, “sem bugs”, “mais divertido”, “mais claro” ou “melhor balanceado” sem evidência humana.
