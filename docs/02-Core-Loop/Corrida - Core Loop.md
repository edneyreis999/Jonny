---
title: "Corrida — Core Loop v1"
gamejam: "Summer Tavern Games (Tavern Jam)"
team: Coreto
engine: "RPG Maker MZ (web-playable HTML5)"
pivo_v1: "Roguelite timer-based. Cada erro reinicia a corrida. Cenas geradas proceduralmente."
tipo: "spec mecânica — core loop da corrida"
status: "v1-rascunho"
cena_pai: "[[Roleta Paulista]]"
tags: [core-loop, corrida, roguelite, minigame, rpg-maker-mz, timer-based, procedural, tavern-jam]
---

# Corrida — Core Loop v1

> **TL;DR:** cada corrida é uma corrente procedural de cenas binárias com timer (==Sinal 4,0s== / ==Curva 3,5s== fixos). Há ==2 tipos de cena==: ==Sinal== (sempre vermelho → Parar/Furar) e ==Curva== (Direita/Esquerda). Toda cena tem uma ação ==safe== (Parar / Direita = +10 Consciência, +10 Pontos de Glória, avança 1 cena) e uma ação ==risk== (Furar / Esquerda = roll 0–99 contra `Consciência + P_cena`, consome `P_cena`, awards `P_cena × 2` Pontos de Glória). Sucesso se `roll < taxa`. Falha ou timer expira = crash ==reroll run== (nova seed + Consciência = 0, Pontos = 0). ==Vencer = chegar em 1º lugar== (maior pontuação). São ==3 corridas fixas na narrativa== (Lenda → Rachadura → Abismo) escalando em comprimento (6 → 8 → 10 cenas). `P_cena` é sorteada por cena em `{0,10,20,...,100}`. Sem itens, sem power-ups — Consciência (0–100, reset) + Pontos de Glória (soma cumulativa).
>
> Este doc cobre **só o core loop da corrida** (sinal + curva + Consciência + restart procedural). Cenas VN, ConcernScore, finais e direção de arte estão especificados em [[Roleta Paulista]].
>
> [!info] Consciência ≠ ConcernScore
> ==Consciência== é a barra ==visível dentro da corrida== (recurso do minigame, reset a cada corrida). ==ConcernScore== é a variável ==oculta acumulada nas cenas VN== (define qual final o jogador acessa). São ==sistemas independentes== — uma não afeta a outra diretamente.

---

## Índice

- [1. Visão Geral](#1-visão-geral)
- [2. Diagrama do Loop](#2-diagrama-do-loop)
- [3. Anatomia de uma Cena](#3-anatomia-de-uma-cena)
- [4. Mecânica — Cena de Sinal](#4-mecânica-cena-de-sinal)
- [5. Mecânica — Cena de Curva](#5-mecânica-cena-de-curva)
- [6. Geração Procedural](#6-geração-procedural)
- [7. Restart / Roguelite Loop](#7-restart-roguelite-loop)
- [8. Feedback Multimodal](#8-feedback-multimodal)
- [9. Parâmetros Globais](#9-parâmetros-globais)
- [10. Riscos de Balanceamento](#10-riscos-de-balanceamento)
- [11. Dependências](#11-dependências)
- [12. Implementação em RPG Maker MZ](#12-implementação-em-rpg-maker-mz)
- [13. Decisões em aberto](#13-decisões-em-aberto)
- [14. Referências](#14-referências)
- [15. Próximos passos](#15-próximos-passos)

---

## 1. Visão Geral

| Atributo              | Valor                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **Formato**           | ==Roguelite timer-based== de decisão binária com recurso. Não é racing steering — é QTE enfileirado. |
| **Cena (unidade)**    | Decisão binária com timer fixo (==Sinal 4,0s== / ==Curva 3,5s==). Toda cena tem 1 ação ==safe== e 1 ação ==risk==. Safe avança e dá +10 Consciência. Risk rola 0–99 contra `Consciência + P_cena`; sucesso se `roll < taxa`. |
| **Tipos de cena**     | ==Sinal== (sempre vermelho → Parar safe / Furar risk) e ==Curva== (Direita safe / Esquerda risk). |
| **Recurso central**   | ==Consciência== — barra visível 0–100. Reset a 0 no início de cada corrida e a cada restart. |
| **RNG**               | ==Por cena==. A cada cena sorteia-se `P_cena ∈ {0,10,20,...,100}` (uniforme). Fixo para aquela cena só. |
| **Geração**           | Procedural por corrida. Nova seed a cada início de corrida (incluindo restarts). Cada cena recebe tipo + `P_cena` via seed. |
| **Comprimento**       | Escalona: ==Corrida 1 = 6 cenas== · ==Corrida 2 = 8 cenas== · ==Corrida 3 = 10 cenas==.                    |
| **Final fixo**        | Última cena da Corrida 3 é sempre ==Curva do Diabo== (`P_cena = 100`, não-reseteável).        |
| **POV**               | Dissociativo — entre corridas você é o amigo; nas corridas você "vira" o João (ver [[Roleta Paulista]] §3 e §6). |
| **Condição de vitória**| Ter a ==MAIOR pontuação total== ao final da corrida. Jogador compete por Pontos de Glória, não apenas por completar. |
| **Condição de derrota**| Risk action com roll falho = ==crash== = restart imediato da corrida. Timer expira = jogada safe automática (Parar/Direita). ==Não chegar em 1º lugar ao final = derrota== = restart.   |
| **Input**             | Mouse (clique) + teclado (setas). RPG Maker MZ expõe ambos nativamente em HTML5.               |
| **Implementação MZ**  | Eventos paralelos + `Show Picture` + `Move Picture` + variáveis + timer por evento. ==Sem plugins==. |

> [!important] Princípio de design
> A mecânica é **deliberadamente rasa**. Toda a profundidade vem da **leitura contextual** (saber quando arriscar) e do **arco emocional** (cada corrida carrega um tema narrativo). Em gamejam de 1 semana, "simples de implementar, profundo de sentir" vence "complexo de implementar, raso de sentir".

> [!note] Taxa de sucesso da ação risk
> `taxa_sucesso = clamp(Consciência + P_cena, 0, 100)` · roll `0–99` · sucesso se `roll < taxa_sucesso`. Após a ação (independente do resultado), `Consciência -= P_cena` (mínimo 0).

---

## 2. Diagrama do Loop

```mermaid
flowchart TD
    Start([Início da corrida]) --> InitC[Consciência = 0]
    InitC --> Seed[Rola seed procedural]
    Seed --> Compose[Compõe sequência de N cenas + P_cena por cena]
    Compose --> Next{i < N?}
    Next -->|Sim| Scene[Apresenta cena i: tipo + P_cena]
    Scene --> Timer[Timer 3-5s]
    Timer --> Input{Jogador escolhe}
    Input -->|Safe: Parar/Direita| SafePlus["+10 Consciência<br/>i++"]
    SafePlus --> Next
    Input -->|Risk: Furar/Esquerda| Roll["taxa = C + P_cena<br/>roll d100"]
    Roll -->|d100 <= taxa| RiskOk["i++<br/>C -= P_cena"]
    RiskOk --> Next
    Roll -->|d100 > taxa| Crash((CRASH))
    Input -->|Timer expira| SafePlus["+10 Consciência<br/>i++"]
    Next -->|Não, última cena| End([Vitória da corrida])
    Crash --> Restart[Restart: nova seed, C = 0]
    Restart --> InitC
```

> [!note] Curva do Diabo
> Na Corrida 3, a cena final (`i = N-1 = 9`) é sempre a **Curva do Diabo** com `P_cena = 100` (não sorteadável, não-resetável). `taxa = clamp(C + 100, 0, 100) = 100%` → Esquerda **sempre succeede no roll**, mas `Consciência -= 100` zera a barra. Tensão é de custo, não de chance. Ver §6.4.

---

## 3. Anatomia de uma Cena

Toda cena — sinal ou curva — compartilha o mesmo esqueleto. Timer é **fixo por tipo**: Sinal = 4,0s, Curva = 3,5s. Não há variação aleatória de timer.

| Fase                 | Duração        | O que acontece                                                                                       |
| -------------------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| **1. Setup + botões**| 0,3s           | Fundo aparece (asfalto, sinal/placa, Opala em POV). **Botões Safe e Risk surgem imediatamente** (não há fase posterior de apresentação). Texto de contextualização sutil (1 linha). Barra de Consciência já visível. |
| **2. Janela input**  | 4,0s (Sinal) / 3,5s (Curva) | Timer corre. Jogador clica/seta. Se não escolher → executa **ação safe automática** (Parar/Direita, ver §4 e §5). |
| **3. Resolução**     | 0,4s           | Animação (safe: avança / risk-sucesso: avança + efeito / risk-falha: crash). Som de motor, pneu ou batida. Em caso de crash, **Consciência é reduzida visualmente antes do fade** (0,3s de hover da barra zerada/reduzida) para o jogador perceber o custo. |
| **4. Atualização C** | instantâneo    | Consciência atualizada: +10 (safe, clamp 100) ou `−P_cena` (risk, mínimo 0). Barra reflete com flash discreto. |
| **5. Transição**     | 0,2s           | Fade para próxima cena. Atualiza `current_scene_index`.                                              |

**Duração total por cena:** ~4,9s (Sinal) / ~4,4s (Curva). Uma corrida de 6 cenas dura ~28s; uma de 10 cenas dura ~47s. Restart é barato (< 1s).

---

## 4. Mecânica — Cena de Sinal

> [!summary]- Clique para expandiroverview
> Toda cena de sinal é ==vermelha== — é um sinal de parada obrigatória. O jogador escolhe entre ==Parar== (ação safe) ou ==Furar== (ação risk). Esta é a unidade de decisão moral do jogo: obedeça a lei (acumule Consciência e +10 Pontos de Glória) ou aposte (gaste Consciência por `P_cena × 2` Pontos de Glória). O `P_cena` é sorteado por cena e é o que varia a tentação.

### Overview
Toda cena de sinal é **vermelha** — é um sinal de parada obrigatória. O jogador escolhe entre **Parar** (ação safe) ou **Furar** (ação risk). Esta é a unidade de decisão moral do jogo: obedeça a lei (acumule Consciência e +10 Pontos de Glória) ou aposte (gaste Consciência por `P_cena × 2` Pontos de Glória). O `P_cena` é sorteado por cena e é o que varia a tentação.

### Input
- **Mouse:** clique no botão "Parar" ou "Furar".
- **Teclado:** `↓` Parar, `↑` Furar (também `S`/`W`).
- **Mobile (HTML5):** tap nos botões grandes na metade inferior da tela.
- **Context requirements:** cena ativa, timer não expirou, jogador não está em animação de resolução.
- **Input window:** 3–5s (ver §4.5).

### System

**Regras:**

| Ação  | Tipo | Efeito                                                                                       |
| ----- | ---- | -------------------------------------------------------------------------------------------- |
| Parar | Safe | Avança 1 cena. `Consciência += 10` (clamp 100). Sempre funciona.                           |
| Furar | Risk | `taxa = clamp(Consciência + P_cena, 0, 100)`. Roll `0–99`. Sucesso se `roll < taxa` → avança 1 cena. Senão → crash. Após roll (qualquer resultado): `Consciência -= P_cena` (mínimo 0). |

> [!important] P_cena é a tentação
> Uma cena com `P_cena = 80` é quase um "furar grátis" para quem tem Consciência moderada — mas drena 80 pontos do recurso. Uma cena com `P_cena = 0` é "furar pra morrer" (taxa = só a Consciência atual). A leitura do `P_cena` é o ==coração estratégico== do minigame #economia-de-risco.

**State changes:**
- `current_scene_index += 1` se Parar OU Furar-bem-sucedido.
- `Consciência = clamp(Consciência + 10, 0, 100)` se Parar.
- `Consciência = max(0, Consciência - P_cena)` se Furar (antes ou depois do roll? **após o roll**, mas independe do resultado).
- `crash_flag = TRUE` se Furar-falha. Timer expira = ação safe automática (Parar).

**Edge cases:**

| Situação                                | Comportamento                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| Clique antes do fim do setup (0,3s)     | Input ignorado, buffer limpo.                                                  |
| Dois cliques simultâneos (Parar + Furar)| Vence o **último** clique registrado antes do tick do timer.                   |
| Timer expira sem input                  | Executa ação safe automática (Parar): +10 Consciência, avança 1 cena.        |
| Input durante animação de resolução     | Ignorado. Buffer de input desligado nesta janela.                              |
| Furar com `Consciência = 0`             | Permitido. `taxa = P_cena`. Aposte tudo na sorte.                              |
| `P_cena = 0` na cena                    | Furar = roll contra só `Consciência`. Quase sempre falha no início da corrida. |
| `P_cena = 100` na cena                  | Furar = roll contra `Consciência + 100` clampado em 100 = sempre sucesso, mas zera a Consciência. |

### Feedback

**Visual:**
- Sinal vermelho pulsante durante toda a cena.
- Hover no botão Furar: barra de Consciência pisca em vermelho-sangue `#8B0000` (aviso visual de custo).
- Parar: flash âmbar suave (1 frame), Opala freia (zoom-out 5%). Barra de Consciência sobe (+10 destacado em sépia claro).
- Furar-sucesso: flash branco rápido, Opala acelera pelo sinal (zoom-in 8%, motion blur).
- Furar-falha: flash vermelho-sangue, Opala atravessa o sinal e bate (cross-traffic). Crash visual padrão.
- Crash: shake de tela (0,3s, 8px), partículas de fumaça sépia, fade to preto (0,4s).

**Áudio:**
- Parar: freada curta (0,3s) + motor caindo RPM.
- Furar-sucesso: ronco de motor subindo RPM + pneu cantando (0,5s).
- Furar-falha: ronco + impacto metálico + silêncio abrupto (0,5s).
- Timer ticking opcional: 3 ticks finais quando restam 1,5s (pitch sobe a cada tick).

**Haptic (nice-to-have, depende de API do browser em HTML5):**
- Mobile: vibrar 50ms no crash. Sem haptic em Parar.
- Implementação: `navigator.vibrate(50)` se disponível; silenciosamente ignorado caso contrário. Sem plugins.

**UI:**
- Botões Parar/Furar com ícones de pedal (estilo carimbo sépia, conforme [[Direcão de arte]]).
- **Barra de Consciência visível** no topo da tela durante toda a corrida (ver §8).
- Timer é uma **barra horizontal fina** acima dos botões (não número — barra = mais tenso, menos cognitivo).
- **P_cena não é mostrada numericamente** ao jogador. A tentação é visual (intensidade do vermelho do sinal poderia escalar com P_cena — [PLAYTEST]).

### Parameters

| Parâmetro                     | Default | Min  | Max   | Tuning notes                                                                                          |
| ----------------------------- | ------- | ---- | ----- | ----------------------------------------------------------------------------------------------------- |
| Timer Sinal                   | 4,0s    | 3,0s | 5,0s  | Único (não há mais variação por cor — verde/amarelo não existem).                                    |
| Duração setup visual          | 0,3s    | 0,2s | 0,5s  | Muito curto = unjust; muito longo = arrasta.                                                          |
| Duração resolução             | 0,4s    | 0,3s | 0,6s  | Inclui animação + sample de áudio antes do fade.                                                      |
| Duração transição             | 0,2s    | 0,1s | 0,3s  | Fade simples.                                                                                         |
| Ganho Consciência (Parar)     | +10     | +5   | +20   | [PLAYTEST: se corridas ficarem muito longas sem risk, aumentar pra +15.]                              |
| Custo Consciência (Furar)     | = P_cena| —    | —     | Simétrico ao ganho na média. Não é parâmetro — é derivado.                                            |
| Distribuição `P_cena`         | U{0,10,...,100} | — | — | Uniforme nos 11 valores. [PLAYTEST: talvez triangular centrada em 50 para reduzir runs extremas.]    |

### Balance notes

> 🎮 **Designer's note:** o Sinal agora carrega **toda a tensão moral**. Cada vermelho é a pergunta: *"você obedece ou aposta?"*. A `P_cena` alta (80–100) é a tentação clássica — parece grátis mas drena o recurso. A `P_cena` baixa (0–20) é o jogo te testar: *"você confiaria na sorte agora?"*. Em runs em que o jogador acumula Consciência sem nunca furar, a Curva do Diabo no final da corrida 3 se torna o momento de ruptura — ele tem 100 de Consciência mas a curva é 100% de custo.

**Comparable implementations:**
- ***Slay the Spire* card-combo com custo:** recurso gasto pra executar ação → pegamos a economia.
- ***Inscryption* apostas sacrificiais:** risco/recompensa opaco → pegamos a opacidade do `P_cena`.
- ***Reigns* (cartão binário):** decisão simples, consequências profundas → pegamos o framing minimalista.

**Riscos conhecidos:**
- Run com muitas `P_cena = 0` pode parecer "parar obrigatório" e monótona. Mitigação: jogador ainda pode furar com Consciência acumulada.
- Run com muitas `P_cena = 100` pode parecer "furar sempre" e sem estratégia. Mitigação: zera a Consciência rapidamente, alimentando o arco de queda.
- **Sem verde/amarelo**, o sinal perdeu variação visual. Mitigação: usar intensidade do vermelho (escala com `P_cena`) e texto de cenário (ex.: "cruzamento movimentado" vs "rua vazia").

---

## 5. Mecânica — Cena de Curva

> [!summary]- Clique para expandir Overview
> A segunda decisão binária. Apresenta uma curva à frente. ==Direita== = trajeto seguro (certeza, +10 Consciência, +10 Pontos de Glória). ==Esquerda== = risco com recompensa (roll `Consciência + P_cena`, consome `P_cena`, awards `P_cena × 2` Pontos de Glória). Esquerda bem-sucedida awards Pontos; Esquerda falha = crash. Espelha o Sinal (§4) com framing visual diferente. #curva #risco-recompensa

### Input
- **Mouse:** clique em "Direita" ou "Esquerda".
- **Teclado:** `→` Direita, `←` Esquerda (também `D`/`A`).
- **Context requirements:** cena ativa, timer não expirou.
- **Input window:** 3,5s (fixo neste v1).

### System

**Regras:**

| Ação    | Tipo | Efeito                                                                                                                |
| ------- | ---- | --------------------------------------------------------------------------------------------------------------------- |
| Direita | Safe | Avança 1 cena. `Consciência += 10` (clamp 100). Sempre funciona.                                                     |
| Esquerda| Risk | `taxa = clamp(Consciência + P_cena, 0, 100)`. Roll `0–99`. Sucesso se `roll < taxa` → avança 1 cena e ganha `P_cena × 2` Pontos de Glória. Senão → crash. Após roll (qualquer resultado): `Consciência -= P_cena` (mínimo 0). |

> [!important] Pontuação de Glória #pontuação #glória
> Recompensa proporcional ao risco: Esquerda-sucesso awards `P_cena × 2` ==Pontos de Glória==, enquanto Direita awards apenas +10 pontos fixos. Em uma corrida de 6 cenas, Esquerda com `P_cena = 80` awards +160 pontos — ==a diferença entre 1º e 4º lugar==.
>
> ==Pontuação = determinante da posição==. Ao final da corrida, o jogador com a MAIOR pontuação total vence. Jogador que não alcançar 1º lugar sofre derrota e restart da corrida.

**State changes:**
- `current_scene_index += 1` (tanto Direita quanto Esquerda-sucesso).
- `Consciência = clamp(Consciência + 10, 0, 100)` se Direita.
- `Consciência = max(0, Consciência - P_cena)` se Esquerda (após o roll, qualquer resultado).
- `pontos_gloria += 10` se Direita, `+= (P_cena × 2)` se Esquerda-sucesso.
- `crash_flag = TRUE` se Esquerda-falha OU timer expira sem input.

**Edge cases:**

| Situação                                              | Comportamento                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------------- |
| Input duplo (Direita + Esquerda no mesmo tick)        | Vence o último input.                                               |
| Timer expira sem input                                | Executa ação safe automática (Direita): +10 Consciência, avança 1 cena.                                                  |
| Esquerda com `Consciência = 0`                        | Permitido. `taxa = P_cena`.                                         |
| `P_cena = 0` na cena de curva                         | Esquerda = roll contra só `Consciência`. Quase sempre falha no início. |
| `P_cena = 100` na cena de curva                       | Esquerda = sempre sucesso (clamp), mas zera a Consciência. Custo alto. |

### Feedback

**Visual:**
- Direita: Opala inclina suave para a direita, asfalto curva em arco largo.
- Esquerda-sucesso: Opala faz contra-volta rápida (motion blur + partículas de pneu). Barra de Consciência desce visivelmente.
- Esquerda-falha: Opala derrapa, câmera vira 90°, fade para crash.
- Crash: igual ao §4 (visual unificado).
- O **timbre da Curva do Diabo** (corrida 3, cena final): motor engasga + baixo cai uma oitava, placa envelhecida visível. Reconhecível antes do jogador terminar de ler.

**Áudio:**
- Direita: pneu cantando suave (0,3s).
- Esquerda-sucesso: pneu gritando + motor subindo RPM (0,5s).
- Esquerda-falha: pneu gritando + impacto + silêncio.
- Curva do Diabo: motor engasga + baixo cai uma oitava (pista diegética de áudio).

**Haptic:** vibrar 80ms em Esquerda-falha (mais longo que Parar-falha no Sinal, pois a curva é mais comprometedora narrativamente).

**UI:** botões Direita/Esquerda com ícones de seta curva (estilo placa de trânsito envelhecida). Hover em Esquerda pisca Consciência em vermelho-sangue.

### Parameters

| Parâmetro                          | Default | Min   | Max   | Tuning notes                                                                                  |
| ---------------------------------- | ------- | ----- | ----- | --------------------------------------------------------------------------------------------- |
| Timer de curva                     | 3,5s    | 3,0s  | 4,5s  | Único para todas as curvas. [PLAYTEST: talvez encurtar na Corrida 3.]                         |
| `P_cena` range                     | {0,10,...,100} | — | — | Sorteio uniforme nos 11 valores por cena.                                                     |
| `P_cena` — Curva do Diabo          | 100     | 100   | 100   | Fixo. Não sortea. Custo = 100, mas clamp mantém taxa em `Consciência + 100 = 100%`. Quase sempre sucesso se tentado, mas zera a Consciência. |

### Balance notes

> 🎮 **Designer's note:** a Curva é onde o jogo **fala com o jogador sobre o tema da jam**. "Esquerda" é literalmente "let chance decide". Quando o jogador escolhe Esquerda na corrida 3 sob POV do João, ele está **sentindo o impulso do João**. O custo em Consciência (`= P_cena`) cria uma economia interna: cada Esquerda awards `P_cena × 2` Pontos de Glória, mas drena o mesmo valor de Consciência. O arco Lenda → Rachadura → Abismo emerge naturalmente do padrão de gastos do jogador — mais Risk = mais Pontos = maior chance de 1º lugar.

**Comparable implementations:**
- ***Slay the Spire* RNG de encontro:** opaco ao jogador → pegamos a opacidade do `P_cena`.
- ***Balatro* poker hands:** apostar risco por multiplicador de pontuação → pegamos a economia de "troca risco por Pontos de Glória".
- ***Hades*-room variants:** randomização dentro de constraints → pegamos a estrutura.
- **Rejeitado:** mostrar `P_cena` numericamente. Mata o drama e o tema. [Jogador sente na textura visual e na frequência de crashes.]

**Riscos conhecidos:**
- Cena com `P_cena = 0` é "Esquerda suicide" no início da corrida (0 pontos de glória). Mitigação: visivelmente diferente (sinal mais apagado, curva mais fechada). [PLAYTEST]
- Cena com `P_cena = 100` é "Esquerda grátis" se tiver Consciência. Mitigação: zera a Consciência, mas awards +200 Pontos de Glória — trade-off claro.
- Como Direita é sempre safe, jogador pode completar a corrida sem nunca arriscar Esquerda — mas **não alcançará 1º lugar** sem Pontos de Glória. Quem quer vencer precisa arriscar.

---

## 6. Geração Procedural

### 6.1 Composição da corrida

Cada corrida é uma lista indexada de `0..N-1` cenas. Para cada índice `i`, sorteam-se independentemente **tipo** e **`P_cena`**:

```
for i in 0..N-1:
    if corrida == 3 and i == N-1:
        cena[i] = { tipo: CURVA_DO_DIABO, P_cena: 100 }  # fixo, não sortea
    else:
        cena[i].tipo = sorteia(SINAL, CURVA) com pesos 60/40
        cena[i].P_cena = sorteia_uniforme({0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100})
```

**Pesos default (v1):**
- SINAL: 60%
- CURVA: 40%

> [!note] Pesos diferenciados por corrida
> Decisão de design adiada para v2: corrida 1 (Lenda) pode ter mais Sinal (70/30), corrida 3 (Abismo) mais Curva (40/60). Para v1 da gamejam, manter 60/40 fixo.

### 6.2 Sorteio de `P_cena` (por cena)

- Distribuição: **uniforme** nos 11 valores `{0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100}`.
- Sorteio **independente por cena** — não há memória entre cenas, não há "P da corrida".
- Cada cena tem seu próprio `P_cena`, válido só para aquela cena.
- [PLAYTEST: se runs extremas (todas P=0 ou todas P=100) prejudicarem experiência, trocar para distribuição triangular centrada em 50.]

### 6.3 Seed

- **Seed policy (v1):** nova seed a cada entrada de corrida. Restart = nova seed.
- A seed determina: sequência de tipos (SINAL/CURVA) + `P_cena` de cada cena.
- Implementação MZ: usar variável `VAR_SEED` inicializada com `Math.floor(Math.random() * 1e9)` no início de cada corrida.

### 6.4 Curva do Diabo (final fixo) #curva-do-diabo #clímax

> [!danger]- ⚠️ CURVA DO DIABO - O CLÍMAX FINAL
> - Apenas na **Corrida 3**
> - Sempre na ==última posição== (`i = N-1 = 9`)
> - Não é sorteadável — sobrescreve qualquer composição procedural
> - ==`P_cena = 100`== (fixo, não respeita o sorteio da §6.2)
> - **Comportamento:** `taxa_sucesso = clamp(Consciência + 100, 0, 100)` = ==sempre 100%== (sucesso garantido). MAS `Consciência -= 100` = ==zera a barra==
> - Cena **sempre apresentada como Curva** (não sinal). Direita = safe (sobrevive à corrida). Esquerda = sucesso garantido mas destrói a Consciência (zera a barra).
> - Visual diferenciado: placa envelhecida "CURVA DO DIABO", cruz à beira da estrada.
> - Áudio diferenciado: motor engasga + baixo cai uma oitava (pista diegética — jogador reconhece antes de ver).

> [!warning] Mudança v2: Curva do Diabo não é mais 95% crash
> Na v1 original, Curva do Diabo tinha `P_falha = 95%`. Na v2 com Consciência, ela tem `P_cena = 100` (sempre succeede no roll), mas **sempre zera a Consciência**. A tensão mudou de "95% de morrer" para "100% de zerar Consciência — e o que isso significa narrativamente?" [PLAYTEST: a releitura narrativa depende da conexão Consciência ↔ estado do João.]

> [!warning] Edge: intervenção (ConcernScore Alto)
> Se o ConcernScore estiver Alto (ver [[Roleta Paulista]] §9), a cena de intervenção **substitui** a Corva do Diabo — jogador sabota o Opala antes. Esse gating **não** faz parte deste core loop; está especificado no pitch. Aqui só documentamos a "pista canônica".

---

## 7. Restart / Roguelite Loop #restart #roguelite

> [!tip] Princípio do Restart
> Qualquer erro fatal → ==crash== → ==restart imediato==. Minimiza fricção: ==sem tela de game over==, ==VN não replaya== entre tentativas. Restart é ==< 1s total==.

### 7.1 Trigger de restart
- Qualquer erro fatal (Risk action com roll falho, timer expira sem input) → `EV_Crash` → restart.

### 7.2 O que é preservado entre restarts
- **ConcernScore** (acumulado nas cenas VN — não é alterado por restarts de corrida).
- **Flags narrativas** (objetos entregues, escolhas de diálogo).
- **Index da corrida atual** (1, 2 ou 3) — restart não destrava próxima corrida.

### 7.3 O que é resetado entre restarts
- **Sequência procedural de cenas** + **`P_cena` por cena** (nova seed).
- **`Consciência`** volta a **0**.
- **`current_scene_index`** volta a 0.

### 7.4 UX do restart
- Crash → vinheta curta (0,5s) → fade-in direto na cena 1 da mesma corrida.
- **Sem tela de game over intermediária.** Minimiza fricção — Restart precisa ser < 1s total.
- Cenas VN **não** replayam entre restarts (só na primeira vez da corrida). Jogador entra direto no minigame.

> [!tip] Restart sem VN é crucial
> Em playtest de gamejam, repetir a cena VN a cada restart mata o pacing. A VN só toca na **primeira entrada** da corrida. Restart = direto pro minigame.

---

## 8. Feedback Multimodal (consolidado) #feedback #multimodal

> [!info] Barra de Consciência é o HUD principal #hud
> A barra de Consciência é ==sempre visível== no topo da tela durante toda a corrida. É o único HUD além do timer. É sépia clara quando cheia, escurecendo para sépia escuro conforme esvazia.

| Evento              | Visual                                     | Áudio                              | Haptic       |
| ------------------- | ------------------------------------------ | ---------------------------------- | ------------ |
| Setup de cena       | Fade-in do fundo (0,3s)                    | —                                  | —            |
| Apresentação        | Botões Safe/Risk surgem. Barra Consciência atualizada. | —                                  | —            |
| Timer correndo      | Barra horizontal diminui                   | (opcional) 3 ticks finais          | —            |
| Hover em Risk       | Barra Consciência pisca vermelho-sangue `#8B0000` (aviso de custo) | —                                  | —            |
| Safe — Sinal Parar  | Flash âmbar + Opala freia. **Barra Consciência: +10 em sépia claro.** | Freada curta + motor cai RPM       | —            |
| Safe — Curva Direita| Opala inclina suave. **Barra Consciência: +10 em sépia claro.** | Pneu canta suave                   | —            |
| Risk — sucesso      | Flash branco + Opala accel. **Barra Consciência: −P_cena em sépia escuro.** | Motor sobe RPM + pneu grita        | —            |
| Crash               | Shake 0,3s + partículas sépia + fade preto | Impacto metálico + silêncio abrupto | 50–80ms vib. |
| Restart             | Fade-in direto cena 1. **Barra Consciência volta a 0.** | (opcional) respiração do João      | —            |
| Vitória corrida     | Fade para próxima cena VN                  | Música transita para próxima fase  | —            |

> [!important] Barra de Consciência é o HUD principal
> A barra de Consciência é **sempre visível** no topo da tela durante toda a corrida. É o único HUD além do timer. É sépia clara quando cheia, escurecendo para sépia escuro conforme esvazia.
>
> **Hover no botão Risk mostra o custo em 3 níveis discretos:** a barra pisca em vermelho-sangue `#8B0000` e a porção que seria consumida é destacada visualmente como **baixo** (`P_cena` 0–30, pequena/faixa fina), **médio** (40–60, faixa média) ou **alto** (70–100, faixa larga). **Não mostrar valor numérico** — o jogador sente a magnitude, não calcula.
>
> **Overflow feedback:** se jogador fizer Safe com Consciência já em 100, mostrar `+0` discreto em sépia claro por 0,3s (não silencioso — confirma que a ação registrou).
>
> Para detalhes de direção de arte e paleta sépia, ver [[Direcão de arte]] e §11 de [[Roleta Paulista]].

---

## 9. Parâmetros Globais (tabela única) #parâmetros #balanceamento

> [!tip] Ajustes por Corrida
> Timer pode encurtar na Corrida 3 (PLAYTEST: 3,5s → 3,0s para Curva, 4,0s → 3,5s para Sinal). ==Comprimento escalona== naturalmente (6 → 8 → 10 cenas).

| Parâmetro                             | Default             | Corrida 1 | Corrida 2 | Corrida 3 |
| ------------------------------------- | ------------------- | --------- | --------- | --------- |
| Nº de cenas                           | —                   | 6         | 8         | 10        |
| Composição SINAL/CURVA                | 60/40               | 60/40     | 60/40     | 60/40     |
| Consciência inicial                   | 0                   | 0         | 0         | 0         |
| Ganho Consciência (Safe)              | +10                 | +10       | +10       | +10       |
| Custo Consciência (Risk)              | = `P_cena` da cena  | igual     | igual     | igual     |
| Ganho Pontos Glória (Safe)            | +10                 | +10       | +10       | +10       |
| Ganho Pontos Glória (Risk-sucesso)   | = `P_cena` × 2      | igual     | igual     | igual     |
| `P_cena` distribuição                 | U{0,10,...,100}     | igual     | igual     | igual     |
| `P_cena` — Curva do Diabo             | 100 (fixo)          | —         | —         | 100 (cena 10) |
| Timer Sinal                           | 4,0s                | 4,0s      | 4,0s      | [PLAYTEST: 3,5s] |
| Timer Curva                           | 3,5s                | 3,5s      | 3,5s      | [PLAYTEST: 3,0s] |
| Cap da taxa_sucesso                   | 100%                | 100%      | 100%      | 100%      |
| Duração setup cena                    | 0,3s                | igual     | igual     | igual     |
| Duração resolução                     | 0,4s                | igual     | igual     | igual     |
| Restart total (crash → cena 1)        | < 1s                | igual     | igual     | igual     |

---

## 10. Riscos de Balanceamento

| Risco                                                                         | Prob  | Impacto | Mitigação                                                                                       |
| ----------------------------------------------------------------------------- | ----- | ------- | ----------------------------------------------------------------------------------------------- |
| Cena com `P_cena = 0` parece "Risk suicide" injusto                          | Alta  | Médio   | Visivelmente diferente (sinal apagado, curva fechada). Jogador ainda pode Safe (+10) e ignora. |
| Cena com `P_cena = 100` parece "Risk grátis" se Consciência alta              | Média | Médio   | Zera a Consciência, alimentando o arco de queda narrativo. Custo real mesmo em "sucesso".      |
| Run com sequência P_cena toda baixa = jogador nunca arrisca                   | Média | Médio   | [PLAYTEST] Considerar triangular centrada em 50 ou piso de P_cena = 20.                        |
| Run com sequência P_cena toda alta = jogador sempre arrisca, Consciência evapora | Média | Médio   | Aceitável — alinhado ao arco Lenda → Rachadura → Abismo. Torna corrida 3 brutal.              |
| Consciência inicial 0 desincentiva Risk na cena 1 (warm-up forçado)          | Média | Baixo   | Default intencional: warm-up safe é partitura da abertura narrativa. Cena 1 quase sempre safe. |
| Jogador vence sem nunca arriscar Risk (run "safe" todo em Parar/Direita)      | Alta  | Baixo   | Aceitável e planejado. O jogo recompensa cautela. Quem quer ver o final escondido precisa arriscar. |
| Restart sem VN entre tentativas confunde jogador                             | Média | Médio   | Indicador sutil "TENTATIVA N" no canto + Consciência volta a 0 de forma visível. [PLAYTEST].   |
| Timer expira = safe automático pode tornar jogo muito fácil                      | Alta  | Médio   | Timer curto (3,5-4,0s) + aviso visual/sonoro mantém tensão. Jogador perde oportunidade de Risk.            |
| Curva do Diabo agora "sempre success" perde tensão clímax                    | Alta  | Alto    | Releitura narrativa: sucesso zera Consciência. Tensão mudou para consequência, não chance. [PLAYTEST] |
| Procedural sem repetição impede o jogador de "aprender" a corrida             | Média | Médio   | Aceitável — alinhado ao tema. Cada run é única.                                                |
| Implementar QTE + timer + Consciência em RPG Maker MZ sem plugins            | Média | Alto    | Ver §12 — solução com `Show Picture` + `Move Picture` + Parallel Event + variáveis.            |

---

## 11. Dependências

**Requer:**
- Sistema de **timer por cena** (Common Event paralelo com `Wait 0,1s` loop).
- Sistema de **input de mouse + teclado** (MZ nativo via evento `On Mouse Click` + keypress).
- Sistema de **Show Picture / Move Picture** para botões e feedback visual.
- Sistema de **variáveis** (`current_race`, `current_scene_index`, `Consciência`, `P_cena`, `taxa_sucesso`, `crash_flag`, `seed`).
- **ConcernScore** (do pitch — não afeta o core loop diretamente, mas determina intervenção na corrida 3).

**Afeta:**
- **Cenas VN** (após vitória de cada corrida, transita para próxima cena VN).
- **Sistema de finais** (corrida 3 → Curva do Diabo → Final 1/2/3 conforme ConcernScore).
- **Direção sonora** (música muda por corrida conforme pitch §12).

**Conflita com:**
- **Cena VN em progresso** (não pode haver overlap; corrida só inicia após VN terminar).
- **Menu de pausa** (timer da corrida deve pausar junto — implementar via switch `is_paused`).

---

## 12. Implementação em RPG Maker MZ #implementação #rpg-maker-mz

> [!success]- ✅ Implementação Sem Plugins
> Esta solução ==não requer plugins==. É 100% eventos nativos. Em gamejam, isso reduz risco de compatibilidade e exportação HTML5. #events-nativos

> Esta seção é um **rascunho técnico** para o implementador. RPG Maker MZ não tem QTE nativo, mas o pattern abaixo é conhecido e estável.

### 12.1 Estrutura de eventos
- **1 Common Event paralelo** `EV_RaceTimer`: ticka a cada 0,1s, decrementa `timer_remaining`, verifica timeout.
- **1 Common Event paralelo** `EV_RaceRenderer`: observa `current_scene_index` e renderiza a cena correspondente via `Show Picture` + `Move Picture`.
- **1 Map event** por corrida (Corrida 1, 2, 3) que orquestra o fluxo: define `N_cenas`, rola seed, sorteia tipo + `P_cena` por cena, chama `EV_RaceRenderer`.
- **Botões** são pictures com hitbox via evento `On Mouse Click` (MZ suporta via parâmetro de picture). Teclado via evento paralelo checando `Input.isTriggered('ok')` etc.

### 12.2 Variáveis (sugestão de IDs)
```
VAR_RACE_ID             # 1, 2, ou 3
VAR_SCENE_INDEX         # 0..N-1
VAR_SCENE_TYPE          # 0 = sinal, 1 = curva, 2 = curva_do_diabo
VAR_P_CENA              # 0, 10, 20, ..., 100 (sorteado por cena)
VAR_CONSCIENCIA         # 0..100 (recurso do jogador, reset a cada corrida)
VAR_PONTOS_GLORIA        # Pontuação total (Safe: +10, Risk-sucesso: +P_cena×2)
VAR_TAXA_SUCESSO        # = clamp(CONSCIENCIA + P_CENA, 0, 100)
VAR_TIMER_REMAINING     # em décimos de segundo (40 = 4,0s)
VAR_ROLL_RESULT         # 0..99 (d100 roll)
VAR_CRASH_FLAG          # 0/1
VAR_SEED                # int aleatório por run
```

### 12.3 Switches
```
SW_RACE_ACTIVE          # ON durante corrida; off em VN/menu
SW_INPUT_LOCKED         # ON durante setup/resolução; previne input duplo
SW_PAUSED               # menu aberto
SW_LAST_ACTION_SAFE     # ON se última foi safe, OFF se risk (para feedback)
```

### 12.4 Pseudo-código do loop principal (Common Event paralelo)
```
# No início de cada corrida:
VAR_CONSCIENCIA = 0
VAR_SEED = Math.floor(Math.random() * 1e9)
# Para cada cena, sortear tipo + P_cena via seed

while SW_RACE_ACTIVE:
    if VAR_CRASH_FLAG == 1:
        Call EV_Crash       # fade, restart, nova seed, C = 0
        continue
    if VAR_TIMER_REMAINING <= 0:
        VAR_CRASH_FLAG = 1
        continue
    if SW_INPUT_LOCKED:
        Wait(0,1s)
        continue
    # input handling no On Click / keypress handler (ver 12.5)
    Wait(0,1s)
    VAR_TIMER_REMAINING -= 1
```

### 12.5 Pseudo-código do handler de input (on click/keypress)
```
on input (SAFE = Parar/Direita):
    if not SW_INPUT_LOCKED and VAR_TIMER_REMAINING > 0:
        SW_INPUT_LOCKED = ON
        VAR_CONSCIENCIA = min(100, VAR_CONSCIENCIA + 10)
        VAR_SCENE_INDEX += 1
        SW_LAST_ACTION_SAFE = ON
        VAR_PONTOS_GLORIA += 10  # Safe awards +10 pontos fixos
        Call EV_ResolucaoSafe

on input (RISK = Furar/Esquerda):
    if not SW_INPUT_LOCKED and VAR_TIMER_REMAINING > 0:
        SW_INPUT_LOCKED = ON
        VAR_TAXA_SUCESSO = min(100, VAR_CONSCIENCIA + VAR_P_CENA)
        VAR_ROLL_RESULT = Math.floor(Math.random() * 100)
        if VAR_ROLL_RESULT < VAR_TAXA_SUCESSO:
            # sucesso
            VAR_SCENE_INDEX += 1  # Tanto Risk quanto Safe avançam 1 cena
            VAR_CONSCIENCIA = max(0, VAR_CONSCIENCIA - VAR_P_CENA)
            SW_LAST_ACTION_SAFE = OFF
            VAR_PONTOS_GLORIA += (VAR_P_CENA * 2)  # Pontuação de Glória
            Call EV_ResolucaoRiskSucesso
        else:
            VAR_CONSCIENCIA = max(0, VAR_CONSCIENCIA - VAR_P_CENA)
            VAR_CRASH_FLAG = 1
            Call EV_Crash
```

> [!warning] Sem plugins
> Esta solução **não requer plugins**. É 100% eventos nativos. Em gamejam, isso reduz risco de compatibilidade e exportação HTML5. Para o playtester mais confortável com plugins (VisuStella, etc.), o mesmo pattern se mantém — só a interface muda.

---

## 13. Decisões em aberto ([PLAYTEST]) #playtest #decisões-pendentes

> [!question]- 🎮 Itens para Validar em Playtest
> Estas decisões requerem ==playtest cego== para validação. Anote os resultados e ajuste os parâmetros globalmente na §9.

Itens marcados para revisão após primeiro playtest vertical slice:

1. **Re-roll em restart?** Default v2: nova seed + novo `P_cena` por cena + Consciência reset a cada restart. Alternativa: preservar seed. Manter re-roll para alinhamento ao tema *"let chance decide"*.
2. **Pesos SINAL/CURVA diferenciados por corrida** (ex.: Corrida 1 = 70/30, Corrida 3 = 40/60). Adiar para v3.
3. **Timer de Curva encurta na Corrida 3?** Default: 3,5s. Testar 3,0s.
4. **Timer de Sinal encurta na Corrida 3?** Default: 4,0s. Testar 3,5s.
5. **Distribuição de `P_cena` uniforme vs triangular?** Default: uniforme. Se runs extremas prejudicarem, triangular centrada em 50.
6. **Tick de timer audível?** Default: opcional (3 ticks finais). Testar se é线索 útil ou clutter.
7. **Indicador de "TENTATIVA N"** na tela de corrida? Default: não. Testar se confunde ou ajuda.
8. **Curva do Diabo sempre na última cena da corrida 3?** Default: sim. Manter fixo para v2 — clímax controlado.
9. **Consciência ↔ ConcernScore cross-talk?** Default v2: **independentes**. Alternativa: bônus de ConcernScore se terminar corrida com Consciência > 70. Adiar para v3.
10. **`P_cena` mostrada visualmente?** Default: **não** numericamente. Intensidade do vermelho do sinal / "fechura" da curva poderiam escalar com P_cena. [PLAYTEST: comunicar sem revelar número].
11. **Consciência inicial = 0 deixa a primeira cena sempre "Safe"?** Default: sim, é o warm-up narrativo. Testar se cena 1感觉 monótona.
12. **Risk mesmo com Consciência = 0** permitido? Default: **sim** (aposta pura na sorte). Testar se frustra ou empolga.
13. **Curva do Diabo com P_cena = 100** = sucesso garantido mas zera Consciência — essa releitura funciona narrativamente? Default: hypothesis a validar em playtest cego.
14. **Sistema de Pontuação de Glória cria tensão suficiente para 1º lugar?** Default: hypothesis a validar em playtest — Risk precisa ser matematicamente necessário para 1º lugar, não apenas opcional.

---

## 14. Referências

- **Pitch completo:** [[Roleta Paulista]]
- **Direção de arte:** [[Direcão de arte]]
- **Inspirações:** [[Inspirações]]
- **Template de mecânica:** `game-design-document/templates/mechanics_specification_template.md`
- **Master structure GDD:** `game-design-document/templates/gdd_master_structure.md`

---

## 15. Próximos passos sugeridos #roadmap #próximos-passos

> [!checklist]- Roadmap de Implementação
> 1. [ ] Validar spec contra o pitch (consistência narrativa)
> 2. [ ] Prototipar em RPG Maker MZ: 1 corrida de 6 cenas + restart funcional (**D1 da jam**)
> 3. [ ] Playtest cego (alguém sem contexto do pitch)
> 4. [ ] Definir parâmetros após 3+ playtests
> 5. [ ] Conectar com ConcernScore para intervenção na corrida 3

1. Validar este spec contra o pitch (consistência narrativa).
2. Prototipar em RPG Maker MZ: 1 corrida de 6 cenas + restart funcional. **Este é o D1 da jam conforme cronograma do pitch.**
3. Playtest cego (alguém sem contexto do pitch) — observar se o tema "let chance decide" emerge organicamente.
4. Definir `P_falha_esquerda` range e pesos SINAL/CURVA após 3+ playtests.
5. Conectar com ConcernScore para destravar a cena de intervenção na corrida 3.
