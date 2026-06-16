---
title: "Roleta Paulista — Pitch v2"
gamejam: "Summer Tavern Games (Tavern Jam)"
team: Coreto
engine: "RPG Maker MZ (web-playable HTML5)"
theme_interpretation: "Let chance decide"
inspiracao_nucleo: "Música 'Dezesseis' — Legião Urbana (1986, álbum Dois)"
status: "pitch-v2-pivô-narrativo"
cronograma: "1 semana (MVP) + stretch goals"
pivo_v2: "Jogador não é mais o João — é o melhor amigo dele. VN + minigame de corrida. Final escondido = intervenção."
tags: [pitch, gamejam, tavern-jam, rpg-maker-mz, roleta-paulista, tragedia, legiao-urbana, brasilia, visual-novel, depressao, saude-mental]
---

# Roleta Paulista (v2)

> Pitch **v2** consolidado a partir de entrevista estruturada + consulta a modelos PAL (gpt-5.2, gemini-2.5-pro). **Pivô fundamental em relação à v1:** o jogador não é mais o João — é o **melhor amigo** dele. As **corridas** continuam como core loop, mas entre elas há **cenas VN** onde João dialoga com o jogador. Há um **final escondido** onde o jogador pode descobrir que o João está com depressão e **impedi-lo** de correr a última corrida.

---

## TL;DR

**Roleta Paulista v2** é uma **visual novel com minigame de corrida** inspirada na música **"Dezesseis"** do **Legião Urbana**. Você é o **melhor amigo** de **João/Johnny**, 16 anos, "rei dos pegas" de Asa Sul, dono de um **Opala azul metálico** — rocker, carismático, e **escondendo uma depressão** que ninguém (exceto você, talvez) consegue ver. Você acompanha **3 corridas** na última semana dele. Em cada corrida, você **assume o POV do João** (dissociação narrativa) e toma decisões timer-based (acelerar/frear, direita/esquerda). Entre as corridas, em cenas VN em 3 locais simbólicos, você **dialoga com ele**. Suas escolhas acumulam um **ConcernScore oculto** em 3 faixas (Baixo/Médio/Alto). Se você perceber os sinais a tempo, na corrida 3 você pode **sabotar o Opala** e impedir o racha final — evitando a morte.

- **Engine:** RPG Maker MZ (exportação HTML5 nativa → web-playable).
- **Formato:** **VN + minigame de corrida** (timer-based, não arcade steering). 3 corridas canônicas no MVP.
- **Identidade:** iluminura sepia bestiário medieval (mantém v1), pós-punk BR original, pistas ambient show-don't-tell (Opala deteriora, fita K7 muda gênero, João entrega objetos, sinais de escape químico).
- **USP para os juízes:** (1) twist "chance é o que se diz quando já se desistiu" (Ahmad — inovação temática forte); (2) direção de arte anacrônica bestiário-urbana (Pepe); (3) áudio diegético como diagnóstico (fita K7 como sintoma musical) (TK); (4) onboarding show-don't-tell binário + invisible ConcernScore (Design).

---

## 1. Visão de uma frase

> *"Você não é o João. Você é o melhor amigo dele. Você tem três corridas pra perceber que ele quer/vai morrer — e uma chance de impedir. Mas para salvar alguém que você ama, talvez seja preciso roubar a escolha dele."*

---

## 2. Identidade

| Eixo              | Decisão                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Tema-mãe**      | "Dezesseis" — Legião Urbana (1986). Tragédia adolescente de racha em Brasília.                                                |
| **Sub-ângulo**    | Roleta paulista como expressão — aposta de vida em cruzamento. Mas o verdadeiro tema é a **amizade como ato de intervenção**. |
| **Tom**           | Tragédia/crítica. Hiperação performativa (João MASCARADO de euforia) rachando até revelar o vazio.                            |
| **Twist tema**    | **Acaso é o que se diz quando já se desistiu.** O RNG das corridas é honesto; o que é desonesto é fingir que era só sorte.    |
| **Formato**       | **VN + minigame de corrida** (timer-based, POV do João dissolvido).                                                           |
| **Engine**        | RPG Maker MZ (HTML5 nativo, web-playable).                                                                                    |
| **Referências**   | *Disco Elysium* (peso moral), *Life is Strange* (intervenção adolescente), *Kentucky Route Zero* (ambient storytelling), *This War of Mine* (decisão impossível), Plebe Rude/Capital Inicial/Joy Division (trilha). |

---

## 3. Mecânica Central

O jogo alterna entre dois modos:

### Modo A — Cenas VN (entre corridas)
- **3 locais fixos simbólicos:** Posto de gasolina (luz neon, café barato) / Quarto do João (pôsteres, violão encostado) / Beira da estrada (asfalto, estrelas, viatura ao longe).
- **Diálogo entre João e o amigo (você)**. Estilo de resposta **livre** — cada cena tem opções únicas baseadas no contexto, não arquétipos fixos.
- **Escolhas acumulam ConcernScore** (variável oculta 0–100, em 3 faixas).
- **Pistas ambientais aparecem ALEATORIAMENTE** por run — não há ordem fixa de "superfície → alerta → crítica". Cada playthrough revela sinais diferentes.

### Modo B — Corridas (minigame, POV do João)
- **3 corridas fixas na narrativa** (não procedural — arco rígido Lenda → Rachadura → Abismo).
- Cada corrida é uma **corrente de 5–8 cenas com timer** (3–5s cada).
- **Tipos de cena:**
  - **Sinal:** verde/amarelo/vermelho → Acelerar ou Frear.
  - **Curva:** Direita (safe) ou Esquerda (atalho com RNG).
- **Dissociação narrativa:** durante as corridas, **você assume o POV do João**. Você *é* ele por alguns segundos. É a forma do jogo te dar acesso íntimo à experiência dele — mas também de te **tornar cúmplice** do impulso dele (cada "esquerda" que você escolhe na corrida 3 é, em última análise, o impulso dele que você sentiu).
- **Sem itens, sem power-ups, sem upgrades.** Mecânica pura.

### Estrutura fixa de uma playthrough
1. **Prólogo curto** (vinheta em cordel + trigger warning com CVV 188).
2. **Cena VN 1** (Posto) → apresentação da amizade, João MASCARADO.
3. **Corrida 1 — "A Lenda":** exuberância performativa, "rei dos pegas",嘻.
4. **Cena VN 2** (Quarto) → João entrega algo, primeira fissura.
5. **Corrida 2 — "A Rachadura":** raiva no lugar de alegria, performance falha.
6. **Cena VN 3** (Beira da estrada) → João fala da Curva do Diabo como destino.
7. **Corrida 3 — "O Abismo":** calma aterrorizante, ritual de despedida.
   - **Se ConcernScore alto:** cena de intervenção destravada → sabotar Opala → **Final 2**.
   - **Se ConcernScore médio com falha:** intervenção malsucedida → **Final 3**.
   - **Se ConcernScore baixo:** corrida segue → Curva do Diabo → **Final 1**.

---

## 4. Twist do Tema: Acaso é o Que Se Diz Quando Já Se Desistiu

O tema oficial *"Let chance decide"* é interpretado em **duas camadas complementares**:

### Camada 1 (literal — na mecânica)
As corridas são honestas: **direita = safe, esquerda = RNG**. O "let chance decide" da jam é seguido à risca no minigame. João é um piloto talentoso; as decisões dele na pista são, em tese, calculadas.

### Camada 2 (subversão — nos finais)
A tese do jogo: **"deixar o acaso decidir é o que se diz quando já se desistiu. O amor é a recusa em deixar o acaso ter a última palavra."**

João **escolhe** a Curva do Diabo. Não é acidente. Quando o jogador também escolhe "esquerda" na corrida 3 (sob POV do João), ele está **sentindo o que o impulso suicida do João sente**. A subversão: o tema da jam é honesto na mecânica, mas o jogo argumenta que **a aceitação do acaso pode ser sintoma de depressão**. Às vezes, para salvar um amigo, é melhor roubar a escolha dele.

### Por que essa subversão funciona no tema da jam
A jam pediu "Let chance decide". A maioria dos jogos vai interpretar isso como "use RNG como mecânica central". A subversão deste jogo é usar RNG literalmente **e** questionar filosoficamente o que significa "deixar o acaso decidir" quando a vida de alguém está em jogo. É uma **provocação** ao tema, não uma recusa.

---

## 5. Protagonista — João/Johnny

| Atributo             | Valor                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------- |
| **Nome**             | João Roberto (apelido "Johnny")                                                        |
| **Idade**            | 16 anos                                                                                |
| **Cenário**          | Asa Sul, Brasília, 1986                                                                |
| **Carro**            | Opala azul metálico (V8, ronco inconfundível)                                          |
| **Identidade**       | Rocker — violão, Janis, Zeppelin, Beatles, Stones, The Smiths (fase final)             |
| **Status público**   | "Rei dos pegas", carismático, exuberante                                               |
| **Status real**      | Coração partido → depressão mascarada como hiperação performativa                      |
| **Arco**             | Lenda (corrida 1) → Rachadura (corrida 2) → Abismo (corrida 3)                         |

### Anedonia como HIPERAÇÃO PERFORMATIVA (máscara)
A depressão do João **não é tristeza silenciosa** — é uma **máscara de euforia exagerada**. Ele ri alto demais, faz brincadeiras forçadas, hyped up constante. A máscara é evidente nas entrelinhas: pausas microscópicas, olhar opaco quando ninguém está olhando, frases que terminam em "haha" mas soam ocas. Isso é **psicologicamente correto** para depressão adolescente masculina — é a apresentação que mais passa despercebida em amigos e familiares.

**Exemplos de falas:**
- Corrida 1: *"BORA CARA! BORA! HOJE A GENTE DETONA O EIXÃO! Haha!"*
- Corrida 2: *"Tá tudo massa, tá tudo perfeito, tá tudo... sabe. Bora."*
- Corrida 3: *"Essa é a última mesmo. A grande. Tô leve, tá ligado? Leve."* (a calma aterrorizante)

### Show-don't-tell — 4 pistas ambientais (variável aleatório por run)
1. **Opala deteriora entre corridas:** começa impecável. Corrida 2: cinzeiro transbordando, lixo no chão. Corrida 3: retrovisor trincado, arranhões não consertados, sujeira acumulada. **O carro é o espelho mental do João.**
2. **Fita K7 muda de gênero:** Corrida 1 toca Plebe Rude/Capital Inicial (energia). Corrida 2: The Clash/Sex Pistols (raiva). Corrida 3: Joy Division/The Smiths (resignação). **A trilha é sintoma.** (Forte para o critério TK)
3. **João entrega objetos ao amigo:** fita cassete, chaveiro do Opala, foto rasgada. Cada entrega é sinal crítico de despedida.
4. **Abuso de substância visível:** cinzeiro transbordando, garrafa de cerveja no banco de trás, olhos vermelhos nas cenas de close.

> **Aleatoriedade sem camadas fixas:** quais dessas 4 pistas aparecem em quais cenas é **embaralhado por run**. Cada jogador vai montar um quebra-cabeça diferente do estado do João. Isso reforça o tema "Let chance decide" — você também está à mercê do acaso para perceber os sinais.

---

## 6. O Amigo-Jogador (você)

| Atributo             | Valor                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------- |
| **Papel**            | Melhor amigo do João. Não nomeado (silent protagonist).                                |
| **Nas cenas VN**     | Dialoga com João. Escolhas únicas por cena (sem arquétipos fixos).                     |
| **Nas corridas**     | Assume POV do João (dissociação). Toma decisões timer-based.                           |
| **Função narrativa** | Testemunha. Único personagem com chance de perceber e intervir.                        |
| **Variável oculta**  | ConcernScore (0–100, 3 faixas).                                                        |

### Como a dissociação funciona narrativamente
Entre as corridas, você é o amigo. Nas corridas, você "vira" o João por alguns segundos. Há duas leitras complementares:
- **Leitura literal:** o amigo está tão íntimo que "vive" a corrida junto — imagens, identificação, empatia profunda.
- **Leitura psicológica:** o jogo te dá acesso ao impulso suicida do João para que você **sinta** a tentação da "esquerda" (atalho, atalho, atalho). Isso torna a intervenção final ainda mais pesada: você não apenas testemunhou a morte — você *sentiu* o desejo dela.

> A dissociação NÃO é possessão. Você não controla o João entre corridas. Você só controla o amigo (diálogo) e momentaneamente sente o que o João sente (corrida).

### O Amigo tem densidade própria?
Sim — mas não via falas (você é silencioso). Sua densidade vem do **histórico de escolhas**. Um jogador que sempre escolhe cumplicidade (joga gasolina no João) tem uma experiência diferente de um jogador que sempre confronta. O jogo rastreia isso silenciosamente e reflete nas opções que surgem.

---

## 7. Elenco

| Personagem              | Função narrativa                                                  | Aparição                                                |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------------------------- |
| **João/Johnny**         | Protagonista narrativo. Piloto. Coração partido. Mascarado.       | Em todas as cenas. Central.                             |
| **Amigo (você)**        | Testemunha, jogador, potencial interventor. Silent protagonist.   | Em todas as cenas VN (implícito). POV nas corridas.    |
| **A Garota**            | Causa oculta do coração partido. Não nomeada, nunca aparece.      | Foto rasgada, fragmentos de fita, falas do João.        |
| **Rivais motrices**     | Outros pegas da cidade. Espelhos do João (também quebrados?).    | Curtas aparições em cenas de racha (corrida 1 e 2).     |

> **Elenco enxuto.** Cada personagem carrega **peso emocional**, não mecânico.

---

## 8. Estrutura Narrativa das 3 Corridas

### Corrida 1 — "A Lenda" (Setup)
- **Tema emocional:** **Exuberância performativa.** João é o rei dos pegas, carismático, invencível. A corrida é adrenalina.
- **Função dramática:** vender a lenda do João e a amizade. Fazer o jogador gostar dele antes de suspeitar.
- **Minigame:** escolhas heroicas, pouco RNG punitivo, faixas de áudio energetic (Plebe Rude).
- **Cena VN prévia (Posto):** João MASCARADO. Apresentação da amizade. Bravata, risadas altas.
- **Curva do Diabo:** mencionada como lenda urbana assustadora — *"Os pivete se borram só de ouvir falar."* Ainda distante.

### Corrida 2 — "A Rachadura" (Complicação)
- **Tema emocional:** **Negação agressiva.** Performance falha. Mais raiva que técnica. João quase bate, vence por um triz.
- **Função dramática:** quebrar o status quo. Mostrar que algo está errado.
- **Minigame:** decisões mais apertadas, RNG mais presente, faixas de áudio raivosas (The Clash).
- **Cena VN prévia (Quarto):** João entrega um objeto (uma fita K7). Primeira fissura visível.
- **Curva do Diabo:** mencionada com curiosidade mórbida — *"Será que o cara que se espatifou lá tava fugindo de alguma coisa também?"* João começa a se identificar com a lenda.

### Corrida 3 — "O Abismo" (Clímax)
- **Tema emocional:** **Desapego fatalista.** Apatia, calma aterrorizante. João não está mais com raiva — está apático. Direção perfeita mas sem alma.
- **Função dramática:** culminar no dilema. Aqui "let chance decide" é literal na pista.
- **Minigame:** RNG máximo. Cena final sempre **Curva do Diabo** (se o jogador não intervier).
- **Cena VN prévia (Beira da estrada):** João fala de despedida disfarçada de papo furado. Entrega outro objeto. Pode dizer *"Pra mim, já deu."*
- **Cena de intervenção (se ConcernScore Alto):** destravada — opção de **sabotar o Opala** (esvaziar pneu, esconder chave, desconectar bateria).

---

## 9. Sistema ConcernScore (variável oculta)

| Faixa         | Score    | Efeito narrativo                                                             |
| ------------- | -------- | ---------------------------------------------------------------------------- |
| **Baixo**     | 0–33     | Opções de diálogo básicas. Cena de intervenção **não aparece**. Final 1.     |
| **Médio**     | 34–66    | Algumas opções sensíveis desbloqueadas. Cena de intervenção aparece mas João não acredita em você — **intervenção falha**. Final 3. |
| **Alto**      | 67–100   | Cena de intervenção completa. Opção de sabotar Opala destravada. Final 2.    |

### Como acumular ConcernScore
- Escolhas de **escuta ativa** (+5 a +10): prestar atenção, perguntar, validar.
- Escolhas de **observação** (+3 a +7): notar pista ambiental, comentar o Opala sujo, perguntar sobre a fita.
- Escolhas de **confronto cuidadoso** (+8 a +15): desafiar João mas com cuidado.
- Escolhas de **cumplicidade** (-3 a -8): jogar gasolina, concordar com bravata.
- Escolhas de **negação** (-5 a -10): mudar de assunto, fingir que está tudo bem.

> **Invisível pro jogador.** Não há meter visível. O jogador só percebe que está preocupado via o jogo abrir/fechar opções organicamente.

---

## 10. Os 3 Finais

### Final 1 — "A Morte Canônica" (default)
- **Condição:** ConcernScore Baixo (0–33) na corrida 3.
- **Descrição:** João corre a Curva do Diabo. Esquerda = falha no RNG = explosão. Vinheta em cordel: *"E até hoje quem se lembra diz que não foi o caminhão..."*
- **Frase-tema:** *"Deixamos o acaso decidir. O acaso é um juiz cruel."*

### Final 2 — "Intervenção" (escondido)
- **Condição:** ConcernScore Alto (67+) na corrida 3.
- **Ação:** jogador sabota o Opala (esvazia pneu, esconde chave). João não consegue correr.
- **Reação do João:** raiva inicial — *"Sua desgraça, o que cê fez?! Cê me fodeu!"* — mas ele não corre.
- **Epílogo (anos depois, ambíguo):** uma única mensagem curta no WhatsApp: *"'valeu por ter roubado meu Opala.'"* Sem cura mágica, sem "estou curado". Só um pé deReturns.
- **Frase-tema:** *"Eu roubei a escolha dele para lhe dar uma chance de ter outras."*

> **Cuidado ético:** este final NÃO é "feliz para sempre". João ainda tem depressão. A intervenção não cura — ela só impede uma morte. O epílogo é deliberadamente curto e ambíguo: a amizade ficou machucada, talvez irrecuperável, mas ele está vivo. Isso é o melhor que a realidade oferece.

### Final 3 — "Tentativa Frustrada" (híbrido)
- **Condição:** ConcernScore Médio (34–66) na corrida 3.
- **Descrição:** Cena de intervenção aparece, mas João não acredita em você. *"Cê tá careta, véi. Tá tudo massa."* Ele pega as chaves reservas e corre de qualquer jeito.
- **Resultado:** João morre na Curva do Diabo. Epílogo: o amigo com a fita K7 na mão, sabendo que tentou.
- **Frase-tema:** *"O amor não foi rápido o suficiente."*

> **Por que 3 finais:** o final híbrido (Falha) é essencial porque respeita a verdade da depressão: às vezes você faz tudo certo e mesmo assim perde. Sem esse final, o jogo seria moralista ("se você agir direito, salva o amigo"). Com ele, o jogo é honesto: agir é melhor que não agir, mas não garante nada.

---

## 11. Direção de Arte (mantém v1 com adaptações)

### Estilo: iluminura sepia bestiário medieval (adaptado de `Direcão de arte.md`)
- **Base técnica existente:** paleta monocromática sépia, linhas pretas puras, hachuras cruzadas a 30°/45°/60°, alto contraste, sensação de pergaminho.
- **Adaptações para v2:**
  - **Conteúdo:** Opala azul metálico, João rocker com **máscara de euforia**, garotas anos 80 (aludidas), Curva do Diabo como entidade visual (placa envelhecida, cruz à beira da estrada).
  - **3 cenas VN fixas:** Posto de gasília (neon sépia), Quarto do João (pôsteres de bandas), Beira da estrada (asfalto + estrelas).
  - **Anacronismo deliberado:** carro dos anos 80 + iluminura medieval = estranhamento potente, alinhado ao twist (o jogo é um *codex póstumo* da semana de João).

### Paleta técnica
| Elemento        | Cor                                                          |
| --------------- | ------------------------------------------------------------ |
| Linha/contorno  | Preto puro `#000000`                                         |
| Sombras densas  | Marrom escuro `#2A221B` a `#3B2F2F`                          |
| Realces papel   | Sépia `#F0E2C1` a `#F5E6C8` (Multiply 20–35%)                |
| Cor de destaque | **Vermelho sangue** `#8B0000` (só em crash/foto/letra de bilhete/olhos vermelhos) |

### Composição
- Canvas 2×: 1008 × 1344 px (depois reduz pra 504 × 672 px).
- Fundo transparente, sem silhuetas recortadas.
- Personagens: mesma altura de olhos e recorte de ombros (família visual).
- UI: pergaminho como moldura; botões como carimbos a sépia.

---

## 12. Direção Sonora

### Trilha: pós-punk BR original (composição manual — ZERO IA)
- **Estilo referência:** Plebe Rude, Capital Inicial (anos 80), Legião Urbana instrumental, Replicantes.
- **Composição:** 1 tema base + variações conforme corrida (energia → raiva → resignação).
- **Restrição legal:** NÃO usar nenhuma gravação ou letra do Legião. Inspirar-se no gênero, compor do zero.

### Diegese seletiva (fita K7 como sintoma musical)
- **Fitas K7 mudam de gênero entre corridas** (Plebe Rude → The Clash → Joy Division).
- **Motor do Opala** roncando em diferentes RPMs conforme cena.
- **Pneus** cantando em curvas esquerdas.
- **Rádio** com estática + fragmentos instrumentais próprios.
- **Vozes:** João dublado em português (sotaque neutro BR-Brasília se possível).

### Áudio como diagnóstico (TK-friendly)
- **Timbre da Curva do Diabo:** motor engasga, baixo cai uma oitava — reconhecível antes de ver.
- **Silêncio carregado:** cena de João entregando objeto = silêncio absoluto + respiração.
- **Fita K7 em loop na corrida 3:** mesma faixa tocando repetidamente — sintoma de fixação depressiva.

---

## 13. Onboarding (critério Design)

**Show, don't tell.** Mecânica binária, dicas contextuais.

1. **Prólogo (30s):** vinheta em cordel + **trigger warning** explícito (*"Este jogo aborda suicídio adolescente, depressão e perda. Se você está em sofrimento, ligue para o CVV: 188."*).
2. **Primeira cena VN:** apresentação natural da amizade. Sem tutorial — opções aparecem organicamente.
3. **Primeira corrida:** timer aparece sem aviso. Cena de sinal verde, "Acelerar" pré-selecionado. Player aprende clicando.
4. **Primeira curva:** direita pré-selecionada. Popup sutil: *"Esquerda = atalho. Mas pode matar."*
5. **Primeira morte (se acontecer):** crash rápido, vinheta curta, restart transparente.

> Meta: juiz entende em <90 segundos. Mecânica simples o suficiente pra ser binária. ConcernScore invisível — jogador sente o peso sem ver números.

---

## 14. Escopo e Cronograma

### Plano MVP — **1 semana** (jam curta, solo dev)

| Item do escopo              | MVP (1 sem)                       | Stretch (2 sem)                  |
| --------------------------- | --------------------------------- | -------------------------------- |
| **Corridas**                | **3 fixas** (Lenda/Rachadura/Abismo) | 5 corridas com ramificações    |
| **Cenas VN**                | **3 fixas** (Posto/Quarto/Beira)  | 5 cenas + variações internas     |
| **Pistas ambientais**       | **4 tipos**, aleatorizadas por run | 6–8 tipos (cadeira, cheiro, voz) |
| **Finais**                  | **3** (morte / intervenção / falha) | 4 (+ secreto "ir junto")      |
| **Bestiário**               | **João + Amigo + Garota (aludida) + 1 rival** | + rivais extras          |
| **Trilha sonora**           | **1 tema + 3 variações** (uma por corrida) | 4–5 temas + diegese expandida |
| **Direção de arte**         | **7–9 ilustrações** (João 3 estados, 3 locais, Opala, Curva do Diabo, placa) | 12–15 cenas |
| **ConcernScore**            | **3 faixas com gating de opções** | Sistema mais granular de 5 níveis |
| **Dublagem**                | **João apenas, 1 língua (PT-BR)** | Amigo + rivais + EN option      |

### Dia-a-dia sugerido (7 dias)
- **D1:** setup MZ, protótipo do loop (1 cena VN + 1 corrida + transição), testar exportação HTML5. **Implementar ConcernScore + 3 faixas com gating.**
- **D2:** Cena VN 1 (Posto) + Corrida 1 (Lenda). João MASCARADO. Pistas ambientais (sistema de RNG).
- **D3:** Cena VN 2 (Quarto) + Corrida 2 (Rachadura). Sistema de entrega de objetos.
- **D4:** Cena VN 3 (Beira) + Corrida 3 (Abismo). Cena de intervenção (sabotar Opala).
- **D5:** Implementar 3 finais. Sistema de flags. Vinhetas em cordel entre cenas.
- **D6:** Trilha pós-punk BR original (1 tema + 3 variações). Sistema de fita K7 como sintoma. Arte final.
- **D7:** Polish, balanceamento do ConcernScore, **gravação do vídeo de gameplay** (entregável obrigatório), **trigger warning + CVV 188**.

---

## 15. Cortes Prioritários (se o tempo apertar)

**Ordem: Mecânica primeiro, depois narrativa, depois arte/áudio.**

1. **Cortar pista ambiental "abuso de substância"** — fica só com Opala deteriora + fita K7 + objetos.
2. **Cortar Final 3 (tentativa frustrada)** — fica só morte + intervenção.
3. **Cortar dublagem do João** — texto apenas.
4. **Reduzir pistas de 4 pra 2** — manter Opala deteriora + fita K7.
5. **Reduzir ConcernScore de 3 faixas pra binário** — Baixo/Alto, sem Médio.
6. **Cortar 1 local de diálogo** — fica só Posto (1 cena para todos).

> **Último recurso:** cortar o final escondido (intervenção) inteiro — vira só tragédia. NÃO recomendado, é o coração do diferencial v2.

---

## 16. Riscos e Mitigações

| Risco                                                              | Prob    | Impacto | Mitigação                                                                                                                              |
| ------------------------------------------------------------------ | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **IP / Copyright Legião Urbana**                                   | Alta    | Alto    | João, Opala azul, Curva do Diabo = uso transformative; creditar "inspirado em"; NÃO usar letra/gravação; compor música original.        |
| **Glamorização de suicídio adolescente**                           | Alta    | Alto    | Tom explicitamente trágico; final principal = morte; trigger warning no início (CVV 188); crítica, não celebração.                      |
| **"Cura mágica" da depressão no final escondido**                  | Alta    | Alto    | Epílogo é curto, ambíguo, sem agradecimento completo. João não diz "estou curado". A amizade fica machucada. Honesto, não romantizado. |
| **Tom moralista / "salvador branco" no final de intervenção**      | Média   | Alto    | Ação é sabotar Opala (íntimo), não denúncia policial. João odeia você inicialmente. Não é "bom samaritano".                            |
| **Zero IA + trilha original**                                      | Média   | Alto    | Compor manualmente (DAW + samples cleared) ou commissioned humano. Citar TODOS os assets. Sem ferramentas generativas.                  |
| **RPG Maker MZ não é racing engine**                               | Média   | Médio   | Não é racing real — é minigame timer-based via eventos + Show Picture + Move Picture + variáveis. MZ nativo pra isso.                  |
| **Sensibilidade ao tema (suicídio adolescente)**                   | Média   | Alto    | Trigger warning. Não expor detalhes gráficos. Foco no luto e na amizade, não no ato. Mensagem de prevenção.                            |
| **ConcernScore mal balanceado**                                    | Média   | Médio   | Threshold de "Alto" = 67+ (atingível em ~70% das escolhas cuidadosas). Playtest cedo com pessoas de fora.                              |
| **Replayabilidade limitada (3 corridas fixas)**                    | Média   | Médio   | Pistas ambientais aleatórias + 3 finais + diálogo ramificado em cenas VN = 3–5 playthroughs únicas no MVP.                             |
| **Vídeo de gameplay obrigatório**                                  | Baixa   | Alto    | Gravar desde D5 (versão jogável mínima).                                                                                               |

---

## 17. Entregáveis da Jam (checklist)

- [ ] Jogo exportável em HTML5 (web-playable) — **obrigatório para votação**.
- [ ] Vídeo de gameplay no YouTube/Vimeo — **obrigatório**.
- [ ] Página de submissão com créditos e **referência a 100% dos assets de terceiros**.
- [ ] **Crédito explícito:** *"Inspirado na música 'Dezesseis' do Legião Urbana. Letra e gravação originais NÃO utilizadas. Trilha composta originalmente para este jogo."*
- [ ] **Trigger warning** na tela inicial: *"Este jogo aborda suicídio adolescente, depressão e perda. Se você está em sofrimento, ligue para o CVV: 188."*
- [ ] **Recurso de saúde mental** acessível pelo menu durante todo o jogo.
- [ ] Zero uso de IA em qualquer etapa do pipeline (arte/code/música/texto).

---

## 18. Referências e Inspirações

- **Música (inspiração temática, não uso direto):** "Dezesseis" — Legião Urbana (1986, álbum *Dois*).
- **Pós-punk BR (gênero musical, compor original):** Plebe Rude, Capital Inicial, Replicantes.
- **Pós-punk UK (referência para trilha da corrida 3):** Joy Division, The Smiths, The Cure.
- **Cordel:** tradição da literatura de cordel nordestina (J. Borges, Leandro Gomes de Barros).
- **Narrativa interativa:** *Disco Elysium* (falha como narrativa), *Life is Strange* (intervenção adolescente), *Kentucky Route Zero* (ambient storytelling), *This War of Mine* (decisão impossível).
- **Cinema BR urbano anos 80:** *Cidade de Deus*, *O Homem Que Copiava*, *Bus 174*.
- **Direção de arte:** bestiários medievais (Aberdeen Bestiary), iluminuras, *Codex Manesse*, xilogravura de J. Borges.
- **Design de tragédia interativa com final escondido:** *NieR: Automata* (multi-ending), *Undertale* (intervenção ética).

---

## 19. Resumo para Decisão

**16 decisões consolidadas nesta v2:**

1. **Nome:** Roleta Paulista (alternativas: "Curva do Diabo", "A Última Noite de João", "Valeu Por Ter Roubado Meu Opala")
2. **Engine:** RPG Maker MZ (web-playable HTML5) ✓
3. **Cronograma:** 1 semana (MVP enxuto) ✓
4. **Formato:** VN + minigame de corrida (timer-based) ✓
5. **Pivô fundamental:** jogador é o **melhor amigo** do João (não o João) ✓
6. **POV nas corridas:** dissociativo — você assume o controle do João ✓
7. **Tracking:** ConcernScore linear único (3 faixas com gating de opções) ✓
8. **Estilos de diálogo:** livre (opções únicas por cena) ✓
9. **Arco 3 corridas:** Lenda → Rachadura → Abismo ✓
10. **Curva do Diabo:** antecipada como mito; destino na corrida 3 ✓
11. **A Garota:** aludida via memória e objetos ✓
12. **Locais de diálogo:** 3 fixos simbólicos (Posto / Quarto / Beira) ✓
13. **Anedonia do João:** hiperação performativa (máscara de euforia) ✓
14. **Pistas ambientais:** 4 tipos, aleatorizadas por run (Opala / Fita K7 / Objetos / Substância) ✓
15. **Finais:** 3 (morte / intervenção / tentativa frustrada) ✓
16. **Framing da intervenção:** sabotar o Opala (íntimo, sem polícia) ✓
17. **Reação do João:** epílogo a posteriori (curto, ambíguo, sem cura mágica) ✓
18. **Frase-tema:** *"Acaso é o que se diz quando já se desistiu. O amor é a recusa em deixar o acaso ter a última palavra."* ✓

**Próximos passos sugeridos:**
- Aprovar este pitch v2 como baseline.
- **Consultar advogado ou revisor da jam sobre o uso transformative de "Dezesseis"** antes de D1 (alto risco IP).
- **Consultar profissional de saúde mental** (psiquiatra/psicólogo) sobre a representação da depressão no João — especialmente o epílogo do final escondido (risco de "cura mágica").
- Iniciar TechSpec/GDD detalhado (próximo nível de granularidade — especificamente o sistema de ConcernScore e o gating de opções).
- Definir assets: composição musical própria? artista para adaptar direção de arte? dublador para o João (sotaque brasiliense)?
- Confirmar datas exatas da jam para refinar o cronograma.

---

## 

---

## 21. Notas finais sobre sensibilidade

Este jogo aborda **suicídio adolescente, depressão e perda**. Três princípios guiarão todo o desenvolvimento:

1. **A depressão não é plot twist barato.** É retratada com accurate psicológico (anedonia, máscara, deterioração visível). Consultar profissional de saúde mental antes do D1.
2. **A intervenção não é heroica.** O final escondido não celebra o amigo como salvador — mostra o custo (amizade machucada, João sem "cura mágica").
3. **O jogo é about amor, não about morte.** A tragédia está no **fracasso em perceber**, não no ato em si. A mensagem é: preste atenção nos seus amigos. CVV: 188.

> Se em qualquer momento do desenvolvimento surgir dúvida se algo é apropriado, **err do lado da sensibilidade**. Cortar uma cena vale mais que ofender um jogador vulnerável.
