# Regras de Identidade e Balanceamento Macro

> Referencia autocontida extraida de `FUNDAMENTOS-COMBAT-SYSTEM.md`.
> Formato: regras, restricoes, tabelas-resumo. Sem exemplos longos de gameplay.

---

## 1. Os 6 Principios-Mae

Principios orientadores de **toda** decisao de combate — presente e futura.

| # | Principio | Resumo |
|---|-----------|--------|
| 1 | **Identidade e Sagrada** | Cada personagem tem alma mecanica unica (fantasia, resource, loop, skills assinatura, numeros). Nunca sacrificar identidade por conveniencia de balanceamento. |
| 2 | **Decisao Antes de Acao** | Profundidade vem de planejamento, nao reflexos. Cast times, TP costs e setups criam janelas de decisao. |
| 3 | **Todo Poder Tem Preco** | Skills poderosas exigem custo de TP, cast time, setup ou risco. Payoff proporcional ao investimento cria equilibrio natural. |
| 4 | **Clareza e Poder** | Jogador nunca deve adivinhar. Formulas deterministicas, informacoes visiveis, feedback imediato. Misterio nao e depth. |
| 5 | **Assimetria e Feature, nao Bug** | Personagens sao diferentes de proposito. Situacoes onde A brilha e B sofre sao intencionais. Evitar dominance (sempre brilha) e uselessness (nunca brilha). |
| 6 | **Inimigos Validam o Sistema** | Cada categoria de inimigo testa aspecto diferente do combat system. Mobs ensinam basics, bosses testam mastery. Inimigos devem ser fair, legiveis e superaveis por skill. |

---

## 2. As 6 Filosofias de Design

| Filosofia | Principio | O Que Impede |
|-----------|-----------|-------------|
| **Consistencia** | Mesma skill na mesma situacao gera mesmo resultado (dentro de variancia controlada). Formulas seguem logica MOBA. Cast times fixos. | Skills imprevisiveis, danos com variancia excessiva, "surpresas" mecanicas que o jogador nao pode antecipar. |
| **Legibilidade** | Estado do combate perceptivel em um glance. HP bars visiveis, TP gauges customizados, buffs/debuffs com icones e duracoes claras. | Estados ocultos, modificacoes de formula invisiveis, interacoes nao-explicadas entre skills. |
| **Previsibilidade com Drama** | O que o jogador planeja funciona; drama vem de execucao sob pressao, nao aleatoriedade. Variancia existe dentro de bandas previsiveis. | Skills que "podem ou nao funcionar", efeitos aleatorios que mudam outcome de luta, RNG que o jogador nao pode gerenciar. |
| **Recompensa por Setup** | Poder vem de coordenacao, nao spam. Sinergias exigem multiplas acoes. Spenders so sao spamados apos buildup. | Skills "melhores que todas" sem setup, rotas infinitas de dano, spam sem custo significativo. |
| **Profundidade vs Complicacao** | Adicionar complexidade so quando cria decisoes interessantes. Cada skill tem proposito claro. Mecanicas conectam com o sistema. | "Mais um recurso" sem proposito, skills que existem "so para existir", mecanicas isoladas do resto do sistema. |
| **Excecao vs Regra** | O especial e especial porque a regra e clara. Exemplos: skills sem critico (regra) vs skills assinatura com critico (excecao); cada personagem tem seu TP (regra) vs Transferencia de Ritmo (excecao). | Tudo ser excecao (caos), nada ser excecao (monotonia), excecoes desconectadas de regras estabelecidas. |

---

## 3. Os 4 Pilares do Sistema

### Pilar 1 — Identidade Forte por Personagem

| Aspecto | Detalhe |
|---------|---------|
| **Defende** | Cada personagem deve ser imediatamente reconhecivel pelo gameplay, independente de gear, nivel ou situacao. |
| **Afeta design** | Novas skills devem reforçar identidade (nunca diluir). Cross-over mecanico permitido se mantem "alma" unica. Balanceamento preserva diferencas, nao nivela ao padrao medio. |
| **Previene** | Personagens que fazem "tudo um pouco", skills genericas em todos os kits, homogeneizacao por facilidade de balanceamento. |

### Pilar 2 — Decisao Antes de Execucao

| Aspecto | Detalhe |
|---------|---------|
| **Defende** | Profundidade tatica vem de planejamento, nao reflexos. Decisao macro (buildup ou gastar?) e micro (qual spender?). |
| **Afeta design** | Cast times (speed negativo) criam janelas de decisao. TP costs tornam cada gasto significativo. Informacao disponivel antes de escolher. |
| **Previene** | Skills instantaneas sem trade-off, spam sem custo, rotinas fixas que eliminam escolha. |

### Pilar 3 — Poder com Contrapartida

| Aspecto | Detalhe |
|---------|---------|
| **Defende** | Toda acao poderosa tem custo. Nao existe "almoco gratis". Cria equilibrio natural. |
| **Afeta design** | Ao criar skill: "qual e o custo?" (cast, TP, setup, risco). Ao buffar: qual contrapartida aumenta? Ao nerfar: contrapartida ja justifica poder? |
| **Previene** | Skills "melhores em tudo" (muito dano + instantaneo + sem custo + sem risco), power creep sem trade-offs. |

**Tabela de Contrapartidas:**

| Tipo de Poder | Contrapartida |
|---------------|---------------|
| Finisher (-60 TP) | Buildup massivo necessario |
| Burst damage | Cast time longo (telegraph) |
| Unblockable | Custo TP alto ou setup especifico |
| Critical boost | Restrito a skills assinatura |
| Team utility | Sacrifica recursos pessoais |
| Furia (TCR 1.5) | Preserve OFF (rebuild constante) |
| Foco Preserve ON | Sem burst generation, regeneracao lenta |

### Pilar 4 — Clareza para o Jogador

| Aspecto | Detalhe |
|---------|---------|
| **Defende** | O sistema nunca esconde informacao necessaria para decisoes informadas. |
| **Afeta design** | Skills nunca tem efeitos ocultos. Interacoes complexas comunicadas via descricao/tooltip. Valores numericos preferiveis a descritores vagos. |
| **Previene** | Efeitos misteriosos, interacoes nao-documentadas, sistemas so entendidos apos trial-and-error exaustivo. |

---

## 4. As 5 Camadas de Identidade

Cada personagem e definido por cinco camadas interdependentes. Toda nova skill/mechanica deve reforçar pelo menos uma camada sem contradizer nenhuma.

### Camada 1 — Fantasia Central

O conceito narrativo traduzido em gameplay.

| Personagem | Fantasia Central |
|------------|-----------------|
| **Filena** | "Duelista agil que embala o combate" — Momentum + mobilidade + burst windows |
| **Kilin** | "Guardiao mentor que protege" — Guarda + sacrificio pessoal + team buffs |
| **Mhordred** | "Brutamontes sanguinario que cresce com ferimento" — Furia + risk/reward + take/deal damage |
| **Thorin** | "Atirador disciplinado que converte precisao em poder" — Foco + setup + execution |

### Camada 2 — Resource Unique (TP Mode)

O modo de TP que ninguem mais tem.

| Personagem | TP Mode | Detalhes Unicos |
|------------|---------|----------------|
| **Filena** | Momentum | Evasion gera +12 TP (maior do jogo) |
| **Kilin** | Guarda | MaxTP 50 (unica barra menor), Ally Damage gera TP |
| **Mhordred** | Furia | TCR 1.5 (50% mais rapido), Take/Deal Damage geram TP |
| **Thorin** | Foco | Preserve ON (unico mantem entre battles), Critical Hit +10 TP |

### Camada 3 — Loop de Gameplay

A sequencia otima de acoes que define o ritmo do personagem.

| Personagem | Loop |
|------------|------|
| **Filena** | Gerar rapido → burst windows → dash → repetir |
| **Kilin** | Tomar dano → proteger → sacrificar → repetir |
| **Mhordred** | Combater → encher Furia → spender massivo → repetir |
| **Thorin** | Setup → buildup → executar (com setup) → repetir |

### Camada 4 — Assinatura de Skills

Skills que so existem naquele kit — intransferiveis.

| Personagem | Skills Assinatura |
|------------|------------------|
| **Filena** | Transferencia de Ritmo (sacrificio para time), Estouro de Momentum (finisher) |
| **Kilin** | Muralha Contra Impacto (ultimate defensivo), Proteger Aliado (unico tank direto) |
| **Mhordred** | Execucao (unico life steal massivo), Grito de Guerra (sacrificio ofensivo) |
| **Thorin** | Tiro Preciso (assinatura com setup complexo), Disparo Arriscado (panic button com trade-off) |

### Camada 5 — Diferenciais Numericos

Valores unicos que reforçam identidade — tuning, nao estrutura.

| Personagem | Diferenciais |
|------------|-------------|
| **Filena** | TCR 1.2 (rapido mas nao explosivo), MaxTP 100, Preserve ON |
| **Kilin** | MaxTP 50 (unica barra menor), Preserve OFF |
| **Mhordred** | TCR 1.5 (unico mais rapido), Take Damage value/5 (4x mais que Kilin) |
| **Thorin** | Preserve ON (unico mantem Foco), Critical Hit +10 TP (maior bonus) |

---

## 5. Tabela de Identidade dos Personagens Existentes

Dados completos de TP e mecanicas definidoras.

| Atributo | Filena | Kilin | Mhordred | Thorin |
|----------|--------|-------|----------|--------|
| **Identidade** | Duelista Agil | Guardiao Mentor | Brutamontes Sanguinario | Atirador Disciplinado |
| **Mecanica Definidora** | Momentum + Evasion, mobile, burst windows | Guarda (50 TP), tank tomando dano, protecao | Furia (TCR 1.5), take/deal damage, risco ao morrer | Foco (Preserve ON), precisao, setup-dependente |
| **TP Mode** | MOMENTUM | GUARDA | FURIA | FOCO |
| **TCR** | 1.2 | 1.0 | 1.5 | 1.0 |
| **MaxTP** | 100 | 50 | 100 | 100 |
| **Preserve** | ON | OFF | OFF | ON |
| **Geracao Principal** | Evasion +12 TP, Use Skill +6/+10/+12 | Take Damage (value/20), Proteger +12 | Take/Deal Damage, Crit +8 TP | Crit +10 TP, Use Skill +5/+8/+10 |
| **TP Regen** | — | +3 | — | +2 |
| **Spender Range** | -20 / -60 TP | -15 / -50 TP | -25 / -60 TP | -25 / -50 TP |
| **Recuperacao Especial** | Enemy Death +8 TP | Ally Death +20 TP | Enemy Death +15 TP | Regen lento, Preserve ON |
| **Papel no Time** | Enabler (marca, transfere) | Protector (toma dano, acelera time) | Leader ofensivo (Grito acelera todos) | Finisher dependente (requer marca + buff) |

---

## 6. O Que Descaracteriza um Kit (Armadilhas)

Um personagem **perde identidade** quando ocorre qualquer um destes 4 padroes:

### 6.1 Mecanica Contraditoria

Skill que contradiz a fantasia central do personagem.

| NAO FAZER | Por Que |
|-----------|--------|
| Filena recebendo tank skill | Quebra duelista agil |
| Kilin recebendo burst massivo | Compete com bruisers |
| Mhordred recebendo sustain sem aggression | Quebra sanguinario |
| Thorin recebendo skill sem precisao/setup | Quebra atirador disciplinado |

### 6.2 Perda de Diferencial Unico

Quando outros personagens ganham a mecanica que era exclusiva.

| NAO FAZER | Consequencia |
|-----------|-------------|
| Todos ganham Preserve ON | Thorin perde identidade |
| Todos ganham Evasion +12 TP | Filena perde identidade |
| Todos ganham TCR 1.5 | Mhordred perde identidade |
| Todos ganham Ally Damage gera TP | Kilin perde identidade |

### 6.3 Homogeneizacao de Skills

Quando custos e efeitos convergem para valores iguais.

| NAO FAZER | Consequencia |
|-----------|-------------|
| Todos spenders em -20 TP | Nao ha decisao |
| Todos geradores em +10 TP | Nao ha diferenciacao |
| Todos finishers em -60 TP | Nao ha variedade de payoff |

### 6.4 Sinergias Genericas

Quando interacoes especificas sao substituidas por versoes universais.

| NAO FAZER | Consequencia |
|-----------|-------------|
| Todos podem marcar | Filena/Thorin perdem sinergia unica |
| Todos podem buffar time | Kilin perde utilidade unica |
| Todos podem transferir recurso | Filena perde assinatura |

---

## 7. Como Expandir sem Perder Identidade

### Regra 1 — Nova skill deve reforçar fantasia existente

| Personagem | Aceitar skills de... | Rejeitar skills de... |
|------------|---------------------|----------------------|
| Filena | Mobility, burst, evasion | Tank, sustain passivo |
| Kilin | Protecao, buff defensivo, tank | Burst massivo, DPS principal |
| Mhordred | Dano explosivo, risk/reward, life steal | Sustain sem aggression, utilidade passiva |
| Thorin | Precisao, setup, execute | AoE sem precisao, frontline |

### Regra 2 — Nova mecanica deve coexistir com existentes

- Se Filena ganha nova geracao de TP → nao pode invalidar Evasion/Use Skill
- Se Kilin ganha nova protecao → nao pode invalidar Proteger Aliado
- Se Mhordred ganha novo burst → nao pode invalidar Execucao
- Se Thorin ganha novo setup → nao pode invalidar Tiro Preciso

### Regra 3 — Cross-over e permitido se mantem "alma"

- Filena pode ter light sustain → mas nao vira healer
- Kilin pode ter damage skill → mas nao vira DPS principal
- Mhordred pode ter utility → mas nao perde aggressiveness
- Thorin pode ter AoE → mas nao perde precisao single-target

### Regra 4 — Numeros sao tuning, identidade e estrutura

- Buffar/nerfar valores = seguro (balanceamento)
- Adicionar/remover mecanicas = perigoso (identidade)
- Sempre perguntar: *"Esta skill continua sendo reconhecivel como [personagem]?"*

---

## 8. Balanceamento Macro

### 8.1 Metricas-Alvo

| Metrica | Definicao | Target |
|---------|-----------|--------|
| **TTK (Time to Kill)** | Turnos para eliminar boss padrao | 8-12 turnos (4 chars x 2-3 spenders cada) |
| **Resource Fullness** | Vezes que personagem enche TP por combate | Filena/Mhordred: 2-3x / Kilin: 1-2x / Thorin: 1x + preserve |
| **Skill Usage Variety** | % do kit usado em combate tipico | >60% (6+ skills diferentes) |
| **Synergy Frequency** | Sinergias de time por combate | 2-4x (minimo) |
| **Death Rate** | % de combates com personagem morrendo | Kilin <5% / Mhordred 20-30% / Geral 10-20% |

### 8.2 Hierarquia de Tiers de Skills

| Tier | Custo TP | Dano (Formula) | Armor Pen | Cast Speed | Funcao |
|------|----------|----------------|-----------|------------|--------|
| **T0 — Gerador** | +5 a +12 TP | Baixo: 50 + a.atk x 1.0 | 0% | 0 ou +500/+1000 | Encher barra |
| **T1 — Spender Leve** | -8 a -15 TP | Moderado: 120-150 + a.atk x 1.2 | 0-15% | 0 ou -250 | Dano consistente |
| **T2 — Spender Medio** | -18 a -30 TP | Forte: 150-200 + a.atk x 1.5 | 15-20% | -500/-750 | Dano principal |
| **T3 — Spender Pesado** | -35 a -50 TP | Muito forte: 300-400 + a.atk x 2.2 | 30% | -1000/-1250 | Burst massivo |
| **T4 — Finisher** | -60 TP ou barra cheia | Devastador: 600+ + a.atk x 3.5 | 50% | -1500/-2000 | Climax, execucao |

### 8.3 Triade Risco-Custo-Recompensa

| Combinacao | Veredito | Tipo |
|-----------|----------|------|
| Alto risco + Alto custo + Alta recompensa | **Valido** | Finisher/Ultimate |
| Baixo risco + Baixo custo + Moderada recompensa | **Valido** | Gerador |
| Alto risco + Baixo custo + Baixa recompensa | **Invalido** | Frustrante |
| Baixo risco + Alto custo + Baixa recompensa | **Invalido** | Trap |

**Regra:** Cast longo (risco) → payoff compensador. Custo massivo (investimento) → dano/efeito proporcional. Instantaneo (sem risco) → dano moderado.

### 8.4 Assimetria Saudavel

| Metrica | Faixa Aceitavel |
|---------|----------------|
| Diferenca de performance em **situacoes diferentes** | 30-50% |
| Diferenca de performance na **mesma situacao** | <10% |

**O que e saudavel:** Cada personagem brilha em situacoes diferentes e sofre em outras.

**O que NAO e saudavel:**
- Personagem A e 2x melhor que B em 80% das situacoes
- Situacao onde personagem e literalmente inutil
- Personagem so util em 1 situacao muito especifica (niche extremo)

### 8.5 Consistencia vs Volatilidade

- **Base:** Consistencia → jogador pode planejar
- **Spikes:** Volatilidade como recompensa → setups corretos permitem spikes
- **Controle:** Cap de critico em 60-70%, variancia limitada
- **Critico base:** 5-8%, com skills especificas como excecao

---

> **Regra final:** Sempre que criar, balancear ou expandir conteudo de combate, consultar estes principios. Se uma decisao viola qualquer item acima, a decisao esta errada — nao o principio.
