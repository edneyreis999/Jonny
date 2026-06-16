---
title: "Auto da Roleta — Pitch"
gamejam: "Summer Tavern Games (Tavern Jam)"
team: Coreto
engine: "RPG Maker MZ (web-playable HTML5)"
theme_interpretation: "Let chance decide"
status: "pitch-inicial"
cronograma: "1 semana (MVP) + stretch goals"
tags: [pitch, gamejam, tavern-jam, rpg-maker-mz, roleta-russa, cordel, brasil, suassuna]
---

# Auto da Roleta

> Pitch inicial consolidado a partir de entrevista estruturada. Conceito, escopo e plano de execução para a **Summer Tavern Games (Tavern Jam)** — tema *"Let chance decide"*.

---

## TL;DR

**Auto da Roleta** é um jogo de combate por roleta russa ambientado numa farsa teatral brasileira inspirada em **Ariano Suassuna** e na **cultura de cordel**. Você é um malandro nordestino que faz um pacto com **O Bicheiro** na encruzilhada e precisa derrotar 5 arquétipos da sociedade (Coronel, Beata, Fiscal, Político, Playboy) para chegar ao pactuador. O twist sobre o tema: **"chance" é blefe** — os inimigos mentem quantas balas carregaram no tambor, e decifrar a personalidade de cada um é a verdadeira habilidade.

- **Engine:** RPG Maker MZ (exportação HTML5 nativa → web-playable).
- **Identidade:** xilogravura de cordel animada (P&B + vermelho), cordel rimado entre lutas, áudio em jornada nordeste→Rio (baião → samba de breque).
- **USP para os juízes:** (1) direção de arte BR diferenciada (Pepe), (2) twist mecânico-temático "sorte = blefe" (Ahmad), (3) áudio diegético como mecânica (TK), (4) onboarding show-don't-tell em 1 luta (Design).

---

## 1. Visão de uma frase

> *"Você aposta a vida num tambor de seis câmaras. Os outros mentem quantas balas há dentro. Você aprende a ler mentirosos — ou vira mais um folhete de cordel na parede da encruzilhada."*

---

## 2. Identidade

| Eixo            | Decisão                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Tema-mãe**    | Roda do Bicheiro — aposta mítica com entidade brasileira do jogo do bicho.                                       |
| **Sub-ângulo**  | **Auto da Malandragem** — farsa teatral inspirada em Suassuna (João Grilo como herói trapaceiro do bem).         |
| **Tom**         | Cômico-satírico com peso narrativo (comédia moral, não deboche).                                                 |
| **Twist tema**  | **Chance é blefe** — o RNG aparente é, na verdade, leitura de personagem.                                        |
| **Referências** | *O Auto da Compadecida*, *Buckshot Roulette*, *Corporate Trimming*, cordel de J. Borges, xilogravura nordestina. |

---

## 3. Mecânica Central (loop de combate)

Cada batalha é um duelo de roleta russa. O tambor tem **6 câmaras**. A cada turno, o jogador tem **duas ações principais**:

1. **Atirar no adversário** — se a câmara está carregada, causa 1 dano; se vazia, passa a vez.
2. **Atirar em si mesmo** — se a câmara está vazia, **joga de novo** (bônus de turno); se carregada, toma 1 dano.

O jogador tem **3 vidas**. Cada inimigo tem **1, 2 ou 3 vidas** conforme o arquétipo.

### Carregamento do tambor
No início de cada turno do inimigo, ele declara quantas balas (1–6) está colocando no tambor e o gira. **Mas ele pode mentir.**

### Itens consumíveis (4 no total)
| Nome temático          | Original      | Efeito                                                                       |
| ---------------------- | ------------- | ---------------------------------------------------------------------------- |
| **Espelho da Vaidade** | Espelho       | Revela se a **próxima câmara** tem bala ou não.                              |
| **Arruda**             | Aspirina/Vida | Cura 1 vida (máximo 3).                                                      |
| **Pólvora Extra**      | Bullet        | Adiciona +1 bala ao tambor e concede ação extra (joga de novo).              |
| **Ouvido de Toco**     | Estetoscópio  | **Ouça a câmara** — timbre sonoro diferente distingue câmara vazia de cheia. |

---

## 4. Twist do Tema: Chance é Blefe

O tema oficial "Let chance decide" é interpretado de forma **subversiva**: o jogo aparenta ser sobre sorte, mas é sobre **leitura de personagem**. Cada inimigo tem uma personalidade de blefe fixa, e a habilidade do jogador é aprender quem mente, quando mente, e calibrar o risco.

### Sistema de blefe em 3 camadas (híbrido)

1. **Tells animados** — inimigo transpira, desvia o olhar, mexe no chapéu quando mente. Pista visual sutil.
2. **Personalidade fixa** — cada arquétipo segue uma regra de blefe previsível (ver §5). Jogador aprende testando.
3. **Itens confirmam** — Espelho da Vaidade e Ouvido de Toco permitem verificar a verdade quando a leitura é incerta.

> A progressão da skill do jogador é o próprio arco de aprendizado do blefe. Começa injusto (você é enganado), termina justo (você lê mentirosos).

---

## 5. Bestiário

5 inimigos + 1 final boss. Distribuição **realista**: cada arquétipo mente conforme estereótipo social — sátira afiada e legível.

| Personagem       | Vidas | Regra de blefe                                          | Tell visual                        |
| ---------------- | ----- | ------------------------------------------------------- | ---------------------------------- |
| **O Coronel**    | 2     | Mente quando tem vantagem numérica (>50% balas)         | Ajeita o chapéu                    |
| **A Beata**      | 1     | Mente para esconder "pecado" (random, ~40%)             | Desvia o olhar, rosário            |
| **O Fiscal**     | 2     | Mente se foi "subornado" (item do jogador decide)       | Coça a mão                         |
| **O Político**   | 3     | Mente **70%** do tempo, sempre sorrindo                 | Sorriso largo forçado              |
| **O Playboy**    | 1     | Mente **50%** — inseguro, sangra suor                   | Suor na testa                      |
| **O Bicheiro**   | 3     | **NUNCA mente** — código de honra do malandro           | Olhar fixo, calma absoluta         |

> A progressão é também uma curva de dificuldade de leitura: Coronel como tutorial, Beata/Fiscal introduzem blefe intermitente, Político é constante, Playboy é aleatório, Bicheiro inverte a expectativa (você espera mentira, recebe verdade — e isso é mais perigoso).

### Final boss — O Bicheiro (humano, iniciação)
Reaparece como figura carismática. Revelação: **todo o jogo foi uma iniciação**. A jornada do herói é o próprio rito de passagem para se tornar o novo Bicheiro. Os 4+ finais (ver §7) decidem se você aceita o manto, liberta a cidade, recusa o jogo ou cai.

---

## 6. Estrutura Narrativa

**Linear com bifurcação final** — vinhetas curtas em cordel rimado entre cada luta contam o que aconteceu e antecipam o próximo oponente.

### Formato da vinheta
- **3–6 estrofes em redondilhas** (6–10 linhas), fonte cordel, P&B + vermelho.
- Tela com texto + **1 xilogravura ilustrativa**.
- Duração: 30–60 segundos. Skip habilitado.

### Jornada nordeste→Rio
- Capítulo 1–2: ambientação nordestina (sertão, encruzilhada, baião).
- Capítulo 3–4: migração para a cidade (subúrbio, samba começa a entrar).
- Capítulo 5: cidade grande (samba de breque pleno).
- Final: confronting o Bicheiro no Rio (síntese musical).

> A **migração rítmica** do baião ao samba de breque é o próprio arco narrativo. Trilha sonora é diegética do lugar onde o jogador está.

---

## 7. Finais (4+ com gradientes)

| Final             | Condição                                              | Descrição                                                                                |
| ----------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Salvação total**   | Derrota Bicheiro sem usar itens de trapaça         | Quebra o pacto, liberta a cidade. Malandro vira herói.                                   |
| **Salvação parcial** | Derrota Bicheiro mas usou itens proibidos         | Cidade livre, mas alma manchada. Sorriso amargo.                                         |
| **Queda trágica**    | Perde para Bicheiro                              | Condendado. Vira personagem do próximo cordel — o novo malandro que virá falhar.         |
| **Recusa**           | Recusa aposta final                              | Perde o jogo mas mantém a alma. Final de resistência passiva.                            |
| **Secreto**          | Condição específica (ex: nunca atirar em si mesmo) | Torna-se o novo Bicheiro. Twist final ambíguo.                                           |

> Flags rastreáveis: itens usados, tiros em si mesmo, escolhas de diálogo (se houver).

---

## 8. Direção de Arte

### Estilo: Xilogravura animada (cordel)
- **Paleta:** preto, branco e **vermelho** como cor de destaque (sangue, bala, lua, fogo).
- **Traço:** J. Borges / cordel nordestino. Linhas fortes, sem gradação.
- **Animação:** shake, slide, fade,Replacement simples. **NÃO** animação quadro-a-quadro completa (custo alto).
- **UI:** pergaminho/folhete de cordel como moldura. Botões como carimbos.

### Personagens
- 6 retratos em xilogravura (5 inimigos + Bicheiro + protagonista opcional).
- Sprites de palco simples (silhueta + prop identificando arquétipo).

---

## 9. Direção Sonora (oportunidade para o juiz TK)

### Conceito: Áudio como informação
- **Densidade do tambor audível:** ao girar, cada bala adiciona um "clack" metálico sutil. Jogador experiente percebe quantidade sem ver.
- **Timbre de câmara (via Ouvido de Toco):** vazia = seco; cheia = micro-ressonância.
- **Tensão crescente:** zunido/percussão que sobe com a probabilidade real de tiro fatal.
- **Bang:** tiro abafado + quebra de corda de viola/surdo. Tela treme. Trilha corta por 1 segundo.
- **Click seco:** recompensa — suspiro audível do personagem, breve silêncio.

### Trilha: Jornada nordeste→Rio
- **Cap. 1–2:** baião (viola caipira, zabumba, sanfona).
- **Cap. 3–4:** transição (adiciona pandeiro, cuíca).
- **Cap. 5:** samba de breque (cavaquinho, surdo, repinique).
- **Final boss:** síntese — viola + cavaquinho juntos.

---

## 10. Onboarding (critério Design)

**Show, don't tell na 1ª luta.** Sem tutorial text-heavy.

1. **Luta 1 (Coronel):** tutorial ativo. Dicas popup contextuais explicam cada ação na primeira vez que aparece. Coronel **não mente** — jogador aprende mecânica pura.
2. **Luta 2 (Beata):** introduz blefe sem aviso. Jogador é pego de surpresa na primeira mentira — momento "aha!".
3. **Itens introduzidos gradualmente:** 1 por luta nas 3 primeiras.

> Meta: qualquer juiz entende o jogo em <90 segundos de gameplay.

---

## 11. Escopo e Cronograma

### Plano MVP — **1 semana** (jam curta)

**Cortes agressivos** para caber em 7 dias (solo dev):

| Item do escopo              | MVP (1 sem)              | Stretch (2 sem)         |
| --------------------------- | ------------------------ | ----------------------- |
| Inimigos                    | **3** (Coronel, Beata, Político) | 5 + boss completo  |
| Final boss                  | Versão simplificada      | Bicheiro completo       |
| Finais                      | **2** (Vitória / Derrota) | 4+ com gradientes       |
| Tells animados              | **1 por inimigo** (suor OU olhar) | 2–3 por inimigo   |
| Vinhetas em cordel          | **3 estrofes curtas** entre lutas | 6 estrofes completas |
| Itens                       | **3** (Espelho, Arruda, Pólvora) | 4 (adiciona Ouvido) |
| Estilo visual               | Xilogravura **estática + shake/slide** | Xilo animada completa |
| Áudio diegético             | Densidade do tambor + bang/click | Adiciona timbre de câmara (Ouvido) |
| Trilha                      | 1 tema base + variações de intensidade | Jornada completa nordeste-Rio |

### Dia-a-dia sugerido (7 dias)
- **D1:** setup MZ, protótipo do loop de combate (sem inimigos, só testar mecânica).
- **D2:** Coronel + tutorial + UI básica.
- **D3:** Beata + introduzir blefe (lógica de mentira).
- **D4:** Político + itens (Espelho, Arruda).
- **D5:** Final boss simplificado + 2 finais.
- **D6:** Arte final (xilos), áudio, vinhetas em cordel.
- **D7:** Polish, balanceamento, exportação web, **gravação do vídeo de gameplay** (entregável obrigatório).

---

## 12. Cortes prioritários (se o tempo apertar)

Em ordem de "cortar primeiro":

1. **Finais 4+ → 2 finais** (maior economia de tempo/flags).
2. **5 inimigos → 3 inimigos** (Coronel + Beata + Político cobrem tutorial/blefe/sátira).
3. **Tells animados → cortar** (fica só com personalidade fixa + itens).
4. **Vinhetas em cordel → encurtar para 1 estrofe**.
5. **Ouvido de Toco → cortar item** (3 itens são suficientes).
6. **Migração rítmica → trilha única** (baião ou samba, sem jornada).

> Último recurso: cortar Bicheiro final boss e terminar no Político. Não recomendado.

---

## 13. Riscos e Mitigações

| Risco                                            | Probabilidade | Impacto | Mitigação                                                            |
| ------------------------------------------------ | ------------- | ------- | -------------------------------------------------------------------- |
| **Xilogravura animada cara em 1 semana**         | Alta          | Alto    | MVP com xilo estática + transformações simples (shake/slide).        |
| **Balanceamento do blefe sentir injusto**        | Média         | Alto    | Coronel nunca mente (tutorial claro); tells sempre presentes.        |
| **RPG Maker MZ exportação web**                  | Baixa         | Alto    | MZ exporta HTML5 nativamente. Testar exportação no D1.               |
| **Excesso de flags para 4+ finais**              | Média         | Médio   | MVP começa com 2 finais; expandir só se sobrar tempo.                |
| **"Cópia de Buckshot Roulette"**                 | Média         | Médio   | Twist de blefe + direção BR + farsa Suassuna diferenciam claramente. |
| **Tom pode virar deboche ofensivo**              | Média         | Alto    | Tratar bicheiro e arquétipos com peso de fábula (Suassuna), não caricatura grotesca. |
| **Áudio diegético falhar em web**                | Baixa         | Médio   | Testar timing de áudio em HTML5 cedo; fallback para indicador visual. |
| **Vídeo de gameplay obrigatório**                | Baixa         | Alto    | Gravar desde D5 (versão jogável mínima), não deixar para o último dia. |

---

## 14. Entregáveis da Jam (checklist)

- [ ] Jogo exportável em HTML5 (web-playable) — **obrigatório para votação**.
- [ ] Vídeo de gameplay no YouTube/Vimeo — **obrigatório**.
- [ ] Página de submissão com créditos e **referência de 100% dos assets de terceiros**.
- [ ] Zero uso de IA em qualquer etapa do pipeline (arte/code/música/texto).

---

## 15. Referências e Inspiracões

- **Mecânica:** *Buckshot Roulette* (Mike Klubnika), *Corporate Trimming* (toastytime.itch.io).
- **Farsa/teatro:** *O Auto da Compadecida* (Ariano Suassuna), *João Grilo*.
- **Visual:** Cordel de J. Borges, xilogravura nordestina, *Sweeney Todd* (estética teatral).
- **Áudio:** Jorge Ben (síntese baião-samba), Cartola, Adoniran Barbosa, *O Auto da Compadecida* (trilha original).
- **Narrativa satírica BR:** Casseta & Planeta, *O Rei do Gado*, Mia Couto (tom fabular).

---

## 16. Resumo para Decisão

**Pronto para iniciar se você confirmar:**
1. Nome: **Auto da Roleta** ✓
2. Engine: RPG Maker MZ ✓
3. Cronograma: 1 semana (MVP enxuto) ✓
4. Escopo MVP: 3 inimigos + boss simplificado + 2 finais ✓
5. Tema: Roda do Bicheiro + Auto da Malandragem ✓
6. Twist: Chance é blefe (3 camadas) ✓
7. Visual: Xilogravura (estática no MVP, animada no stretch) ✓
8. Áudio: Jornada nordeste→Rio ✓
9. Itens: Espelho da Vaidade, Arruda, Pólvora Extra (+ Ouvido de Toco) ✓

**Próximos passos sugeridos:**
- Aprovar este pitch como baseline.
- Iniciar TechSpec/GDD detalhado (próximo nível de granularidade).
- Definir assets disponíveis (arte própria? assets livres? trilha sonora commissioned?).
- Confirmar datas exatas da jam para refinar o cronograma.
