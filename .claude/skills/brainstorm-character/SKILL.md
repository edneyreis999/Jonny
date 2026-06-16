---
name: brainstorm-character
description: "You MUST use this skill when brainstorming, designing, or creating characters, skills, or combat mechanics for the RPG Maker MZ game Daratrine — A Origem. This includes any request about character kits, skill design, TP modes, ATB integration, combat balance, team synergies, or playstyle archetypes — even if the user doesn't explicitly say 'brainstorm character'. Use it when the user says things like 'quero criar um personagem', 'design de skill', 'balancear esse ataque', 'qual TP Mode faz sentido', 'preciso de ideias pro kit do X', 'como esse personagem se encaixa no time', 'to pensando num boss que faz Y', or anything about how a character fights in Daratrine. Also use when redesigning an existing character's kit or designing boss/enemy combat mechanics. Do NOT use generic software brainstorming for game design tasks — this skill has domain-specific rules for quantitative balance and engine implementation."
---

# Brainstorm Character — Design de Personagem para Daratrine

## Use When

Design de personagem para jogos RPG é tentadoramente simples por fora — nomes de skills, números de dano, um TP Mode — mas por dentro esconde um sistema de balanceamento quantitativo com 3 eixos, 27 modificadores de score, regras de tier com mínimos de negativos, sinergias cross-character e uma integração ATB-TP que deve ser única por personagem. Sem estrutura, é fácil criar um personagem que funciona no papel mas quebra o balanceamento do jogo na prática: skills sem identidade, kits sem loop, mecânicas que não existem no motor VisuStella, ou sinergias doentias com o time existente.

Esta skill resolve isso conduzindo uma entrevista de 5 fases que garante identidade única, loop de gameplay coeso, mecânicas implementáveis no motor e balanceamento numericamente validado — do conceito narrativo ao documento final pronto para implementar no RPG Maker MZ. Cada fase constrói sobre a anterior: identidade define o recurso, o recurso define as skills, as skills definem os scores, e os scores validam o kit.

**Output:** Documento markdown completo no formato de `references/template-character.md`, salvo em `docs/GDD/6-combate/personagens/[nome].md`.

---

## Princípios Orientadores

Esta skill segue estes princípios porque cada um previne um modo de falha específico no design de personagem:

1. **Scores só depois das 5 perguntas obrigatórias** — Calcular scores sem responder "que problema essa skill resolve?" leva a números que não refletem a intenção. O modelo acaba engenharia reversa do conceito a partir da matemática, invertendo a ordem correta. As 5 perguntas estão em `references/kit-design-guide.md`.

2. **Documento final só após aprovação em cada seção** — Cada fase é um compromisso. Uma vez escrito, é psicologicamente mais difícil mudar. O usuário aprova antes de formalizar.

3. **Fases em ordem: Identidade → Loop → Ideação → Balanceamento → Validação** — Cada fase depende de decisões da anterior. A identidade (Fase 1) determina o recurso (Fase 2) que constrange as skills (Fase 3) que determinam os scores (Fase 4). Pular uma fase cria inconsistências descobertas só no final.

4. **Uma pergunta por vez** — Design de personagem envolve trade-offs. Múltiplas perguntas simultâneas forçam decisões sem ver as consequências, gerando contradições descobertas tardiamente.

5. **Respeitar configurações globais** — Os valores em `references/visustella-toolbox.md` seção 1 já estão definidos nos Plugin Parameters do projeto. Propor mecânicas que os contradizem significa criar um design que não pode ser implementado sem alterar o sistema de combate inteiro do jogo.

---

## Referências Internas

Leia estes arquivos no momento indicado. Arquivos com 300+ linhas contêm sumário interno — use-o para navegar às seções relevantes em vez de ler o arquivo inteiro de uma vez.

| Quando ler | Arquivo | Motivo | Tamanho |
|---|---|---|---|
| Ao iniciar a skill | `references/identity-rules.md` | Princípios, identidade, personagens existentes | ~300 linhas |
| Ao iniciar a skill | `references/template-character.md` | Formato do output final | ~330 linhas |
| Ao iniciar a skill | `references/visustella-toolbox.md` | Configurações globais + mecânicas disponíveis | ~130 linhas |
| Antes da Fase 2 | `references/kit-design-guide.md` | Regras de criação de skills e kits | ~330 linhas |
| Antes da Fase 3 | `references/visustella-toolbox.md` (reler seções 3-5) | Tags por função + padrões mecânicos + integração ATB-TP | — |
| Antes da Fase 4 | `references/score-system.md` | Sistema de pontuação quantitativa completo | ~610 linhas |
| Antes da Fase 5 | `references/synergy-rules.md` | Regras de sinergia entre personagens | ~130 linhas |

Também leia os documentos de personagens existentes em `docs/GDD/6-combate/personagens/` para manter coerência com o time atual.

---

## Fase 1 — Identidade (~5 perguntas)

Objetivo: Definir as 5 camadas de identidade do personagem (ver `references/identity-rules.md` seção "5 Camadas de Identidade").

**Por que começar por identidade?** Cada decisão técnica posterior (TP Mode, skills, balanceamento) deve reforçar a fantasia central. Se a identidade não está clara, o kit vira uma coleção de mecânicas sem alma.

Perguntas (uma por vez, múltipla escolha quando possível):

1. **Fantasia Central:** "Qual o conceito narrativo do personagem? Como ele luta e por quê?"
   - Ofereça exemplos: Duelista Ágil, Guardião Mentor, Brutamontes Sanguinário, Atirador Disciplinado, ou conceito novo
   - A resposta deve conectar lore → gameplay

2. **Classe e Arma:** "Qual a classe e arma principal?"
   - Classes: Fighter, Guardian, Bruiser, Slinger/Sniper, Mage, Rogue, etc.
   - A arma define o tema dos nomes das skills

3. **Papel no Time:** "Qual o papel principal e secundário?"
   - Papéis: DPS físico/mágico, Tank, Suporte, Setup, Burst, Sustain
   - Papel secundário complementa mas não domina

4. **Referências:** "Quais jogos/personagens servem de inspiração?"
   - Exemplos: Samira (Style Meter), Juggernaut (Ultimate), Fiora (duelista)

5. **Validação de Identidade:** Apresente as 5 camadas preenchidas em tabela:
   | Camada | Valor |
   |--------|-------|
   | 1. Fantasia Central | [valor] |
   | 2. Resource Unique | [a definir na Fase 2] |
   | 3. Loop de Gameplay | [a definir na Fase 2] |
   | 4. Assinatura de Skills | [a definir na Fase 3] |
   | 5. Diferenciais Numéricos | [a definir na Fase 4] |
   Peça aprovação antes de avançar.

---

## Fase 2 — Loop de Gameplay (~7 perguntas)

Objetivo: Projetar o sistema de recurso (TP Mode) e integração com ATB. Leia `references/kit-design-guide.md` e `references/visustella-toolbox.md` seção 5 antes desta fase.

**Por que o recurso antes das skills?** O TP Mode define COMO o personagem joga — a cadência de gerar e gastar recurso, a relação com tempo (ATB) e o espaço tático. As skills são ferramentas que operam dentro desse sistema. Definir skills sem saber como o recurso funciona é como escolher armas sem saber se a luta é terrestre ou naval.

1. **Nome do Recurso:** "Como se chama o recurso? (ex: Momentum, Guarda, Fúria, Foco)"
   - Deve refletir a fantasia central

2. **Tipo de Geração:** "Como o recurso é gerado?"
   - Ativo (usa skills), Passivo (toma dano, regen), Reativo (evasão, counter), Híbrido
   - Explique trade-offs de cada

3. **Preserve TP:** "O recurso persiste entre combates?"
   - ON: estratégia de longo prazo (Thorin, Filena)
   - OFF: rebuild todo combate (Kilin, Mhordred)

4. **MaxTP e TCR:** "Qual o tamanho da barra e velocidade de carga?"
   - Apresente 2-3 opções com trade-offs
   - MaxTP 50 = burst rápido mas limitado; MaxTP 100 = buildup longo mas payoff massivo
   - TCR 1.0-1.5: 1.0 padrão, 1.5 muito rápido mas volátil
   - Consulte `references/visustella-toolbox.md` seção 1 para ranges usados por personagens existentes

5. **Fórmulas de Geração:** Para cada trigger (Initial TP, Use Skill, Take Damage, Evasion, Critical Hit, etc.), defina fórmula e justificativa. Proponha valores baseados no arquétipo (ver toolbox seção 5).

6. **Integração ATB:** "O recurso afeta o After Gauge? Como?"
   - Apresente exemplos dos personagens existentes
   - After Gauge positivo = age mais rápido (trade-off: score de tempo negativo)
   - After Gauge negativo = age mais devagar (compensação: score de tempo positivo)

7. **Validação:** Apresente a tabela completa do TP Mode (General + TP Formulas) e peça aprovação.

---

## Fase 3 — Ideação de Skills (~11 skills)

Objetivo: Brainstorm criativo do kit. Ideação primeiro, contabilidade depois. A matemática fica para a Fase 4.

**Por que ideação antes de contabilidade?** Ancorar o criativo no numérico cedo demais limita o espaço de design. O melhor processo é sonhar livremente primeiro, depois verificar se os números comportam o sonho. Se a matemática não fechar, ajustam-se os modificadores — nunca o conceito.

Releia `references/visustella-toolbox.md` seções 3-5 antes desta fase. Use as tags e padrões listados como "paleta mecânica" ao propor skills.

**Kit mínimo esperado:**
- 2 passivas
- 2 geradores
- 2 spenders leves
- 2 spenders médios
- 2 spenders pesados
- 1 ultimate

**Para cada skill, perguntar (uma por vez ou em grupos de 2-3):**

1. "Qual o nome e descrição da skill?" (deve refletir o tema da arma e fantasia)
2. "Qual o tipo?" (Passiva, Gerador, Spender Leve/Médio/Pesado, Ultimate)
3. "Qual o papel tático?" (Dano, CC, Setup, Suporte, Burst, Risco/Recompensa)
4. "Que problema ela resolve no kit?"
5. "Qual decisão ela cria para o jogador?"
6. "Qual a implementação VisuStella?" — pelo menos uma tag ou mecânica concreta do motor por skill. Consulte `references/visustella-toolbox.md` seções 3-4 para tags e padrões. Cada skill DEVE incluir mecânica VisuStella concreta (notetag, sistema ou padrão do motor). Evite conceitos genéricos sem implementação direta nos plugins.

**Grounding mecânico:** Cada skill proposta DEVE incluir pelo menos uma mecânica VisuStella concreta. Respeite as **Configurações Globais** da seção 1 do toolbox — essas já estão definidas e não devem ser alteradas.

**Validação por skill (verificar internamente, comunicar se problema):**
- Responde às 5 perguntas obrigatórias de `references/kit-design-guide.md`?
- Reforça a identidade (Fase 1)?
- Não é redundante com outra skill do kit?

**Após todas as skills:** Apresente lista consolidada (nome, tipo, papel, custo TP, efeito principal, implementação VisuStella) e peça aprovação.

---

## Fase 4 — Balanceamento Quantitativo

Objetivo: Calcular o score de cada skill e validar contra os tiers. Leia `references/score-system.md`.

**Por que nunca alterar o conceito na negociação?** O conceito é o contrato com o usuário. Se o score não cabe no tier pretendido, os modificadores mudam (speed, custo TP, After Gauge) — a ideia criativa permanece intacta. Mudar o conceito para caber na matemática inverte a relação: o design deveria guiar os números, não o contrário.

**Para cada skill, execute:**

1. **Gerar Score Breakdown automático:**
   - Identifique cada modificador da skill nas tabelas de score
   - Calcule: Subtotal Efeito (soma x 2.0) + Subtotal Tempo + Subtotal Recurso + Sinergias
   - Use o checklist de `references/score-system.md` como template

2. **Apresente tabela ao usuário:**
   | Modificador | Valor | Score | Eixo |
   |-------------|-------|-------|------|
   | [modificador] | [valor] | [score] | [eixo] |

   Subtotal Efeito: [N] x 2 = [N]
   Subtotal Tempo: [N]
   Subtotal Recurso: [N]
   Score Final: [N] — **Tier [N]**

3. **Pergunte:** "Este cálculo parece correto? O score está no tier pretendido?"

4. **Negociação (se necessário):**
   - Score acima do tier: "Para reduzir, podemos adicionar After Gauge negativo, aumentar custo TP, ou adicionar speed negativo. Qual prefere?"
   - Score abaixo do tier: "Para aumentar, podemos aumentar multiplicador, adicionar armor pen, ou adicionar CC."
   - Nunca altere o conceito criativo — ajuste modificadores, não a ideia

5. **Verifique regras por tier:**
   - Tier 1: mínimo 0 negativos
   - Tier 2: mínimo 1 negativo
   - Tier 3: mínimo 2 negativos
   - Tier 4: mínimo 3 negativos em eixos diferentes

**Após todas as skills:** Apresente tabela consolidada do kit:
| # | Nome | Tipo | Papel | TP Cost | Dano | CC/Efeito | Speed | Score | Tier |

---

## Fase 5 — Sinergias e Validação

Objetivo: Validar o kit completo contra todas as regras. Leia `references/synergy-rules.md` e os checklists de `references/kit-design-guide.md`.

**Executar checklists:**

### 5-Layer Identity Check
- [ ] Fantasy central coerente com as skills?
- [ ] Resource unique mantido?
- [ ] Loop de gameplay identificável?
- [ ] Skills assinatura presentes?
- [ ] Diferenciais numéricos preservados?

### Kit Health Check
- [ ] Tem centro? (fantasia clara)
- [ ] Tem loop? (abertura → buildup → payoff → recuperação)
- [ ] Tem assinatura? (TP Mode + ecossistema)
- [ ] Tem fraqueza? (situações onde struggle)
- [ ] Tem espaço de mastery? (fácil aprender, difícil dominar)

### Sinergias de Grupo
- Para cada personagem existente (Filena, Kilin, Mhordred, Thorin, Balastrus): defina sinergia
- Verifique contra regras de `references/synergy-rules.md`
- Verifique que não há dependência doentia (teste: remover um personagem não deve causar >50% de perda em outro)

### Anti-Pattern Scan
- Nenhuma skill "sempre correta"
- Nenhuma skill redundante
- Nenhum kit sem centro
- Nenhum balanceamento com mesma solução para tudo

**Peça aprovação final de todo o kit.**

---

## Geração do Documento

Após aprovação total:

1. Leia `references/template-character.md` para o formato exato
2. Preencha o template com todos os dados aprovados
3. Gere diagrama Mermaid do loop ATB-Resource
4. Inclua Score Breakdown completo de cada skill (com campo **Implementação VisuStella**)
5. Inclua tabela consolidada do kit
6. Inclua checklist de validação preenchido
7. Inclua sinergias de grupo
8. Salve em: `docs/GDD/6-combate/personagens/[nome-personagem].md`
9. Commite ao git

---

## Quick Reference — Anti-Padrões

| Anti-Padrão | Detecção | Correção |
|---|---|---|
| Skill sem função | Não responde "que problema resolve?" | Refinar conceito |
| Skill sempre correta | Score baixo demais em todos eixos | Adicionar trade-off |
| Skill forte demais | Score acima da banda do tier | Negociar negativos |
| Kit sem centro | Sem fantasy clara | Recomeçar Fase 1 |
| Identidade diluída | Skill contradiz fantasia | Remover ou redesenhar |
| Spam de 1 skill | Skill melhor em tudo | Rebalancear |
| Sinergia obrigatória | Remover X inviabiliza Y | Tornar bônus, não requisito |
| Mecânica sem motor | Sem tag VisuStella correspondente | Consultar toolbox seções 3-4 |

---

## Regras de Execução

Cada regra existe porque previne um anti-pattern específico:

- **Forma imperativa** ("Pergunte", "Apresente", "Calcule") — instruções diretas reduzem ambiguidade sobre o que fazer em cada momento
- **Uma pergunta por vez, múltipla escolha quando possível** — o usuário precisa processar cada trade-off antes de decidir o próximo; múltipla escolha reduz carga cognitiva em perguntas conceituais
- **YAGNI: não proponha features além do escopo** — personagens com features demais diluem identidade e complicam balanceamento; cada skill deve justificar sua existência no kit
- **Todo poder tem preço** — skills poderosas sem contrapartida viram a escolta óbvia (spam obrigatório), removendo decisão do jogador
- **Assimetria é feature** — personagens são diferentes de propósito; tentar fazer todo mundo bom em tudo gera homogeneização
- **Validação incremental** — cada fase constrói sobre a anterior; avançar sem aprovação significa construir sobre fundação que pode mudar
