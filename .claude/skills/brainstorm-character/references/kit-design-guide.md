# Guia de Design de Kit e Skills

**Fonte:** DIRETRIZES-DESIGN-COMBAT-SYSTEM.md v1.0
**Escopo:** Regras praticas de design para criacao e balanceamento de skills e kits de personagem.
**Este documento e AUTOCONTIDO.** Nenhuma leitura externa necessaria.

---

## Sumario

1. [Hierarquia de Decisao](#1-hierarquia-de-decisao)
2. [5 Perguntas Obrigatorias](#2-5-perguntas-obrigatorias)
3. [Tipos de Skill](#3-tipos-de-skill)
4. [Implementacao VisuStella por Tipo de Skill](#4-implementacao-visustella-por-tipo-de-skill)
5. [Funcao Tatica](#5-funcao-tatica)
6. [Hierarquia de Poder](#6-hierarquia-de-poder)
7. [Kit Saudavel](#7-kit-saudavel)
8. [Distribuicao Interna de Poder](#8-distribuicao-interna-de-poder)
9. [Tipos de Personagem](#9-tipos-de-personagem)
10. [Anti-Padroes](#10-anti-padroes)
11. [Checklists de Aprovacao](#11-checklists-de-aprovacao)

---

## 1. Hierarquia de Decisao

**Ordem obrigatoria ao criar qualquer skill:**

1. **Definir o papel** -- O que a skill faz no kit? Qual problema resolve?
2. **Definir o efeito** -- Como se manifesta mecanicamente?
3. **Escolher a ferramenta tecnica** -- Tags do Battle Core, ATB e TP System

> **Ferramenta implementa intencao, nao substitui design.**

Nunca comece pela tag. Comece pela funcao.

---

## 2. 5 Perguntas Obrigatorias

Antes de implementar QUALQUER skill, responda:

| # | Pergunta | O que valida |
|---|----------|-------------|
| 1 | **Qual problema essa skill resolve?** | Situacao especifica do combate |
| 2 | **Qual decisao ela cria?** | Jogador deve pensar antes de usar |
| 3 | **O que ela adiciona ao kit?** | Funcao que nao existe ainda |
| 4 | **Ela reforca ou dilui a identidade do personagem?** | Deve ser reconhecivel como parte do kit |
| 5 | **Por que essa skill e nao outra?** | Justificativa de existencia |

Se a skill nao passa nas 5 perguntas, reprojete.

---

## 3. Tipos de Skill

| Tipo | Funcao no Kit | Frequencia Esperada |
|------|---------------|---------------------|
| **Basica** | Gerar recurso + manter loop | Toda rodada |
| **Spender** | Converter recurso em impacto | 2-3x por combate |
| **Finisher** | Virar o rumo do combate | 0-1x por combate |
| **Setup** | Habilitar poder futuro (individual ou time) | 1-2x por combate |
| **Reativa** | Responder ao inimigo / converter adversidade | Situacional |
| **Utilitaria/Suporte** | Curar, buffar, limpar debuffs | Conforme necessidade |
| **Conversao** | Transformar recurso de um tipo em outro | Especifico do kit |

---

## 4. Implementacao VisuStella por Tipo de Skill

| Tipo | Mecanica TP | Mecanica ATB (After Gauge) | Tags VisuStella Comuns |
|------|-------------|---------------------------|------------------------|
| **Basica/Gerador** | Gera +5 a +12 TP por uso | Speed >= 0 (sem vulnerabilidade) | `<TP Gain>`, `<Battle Log>` |
| **Spender Leve** | Consome -18 a -25 TP | Speed 0 a -500 | `<TP Cost>`, `<ATB Speed>`, `<State Apply>` |
| **Spender Medio** | Consome -25 a -35 TP | Speed -500 a -750 | `<TP Cost>`, `<ATB Speed>`, multiplicador de dano |
| **Spender Pesado** | Consome -35 a -50 TP | Speed -1000 a -1250 | `<TP Cost>`, `<ATB Speed>`, `<Armor Pen>`, `<Critical Rate>` |
| **Finisher/Ultimate** | Consome -50 a -60+ TP (ou barra cheia) | Speed -1500 a -2000 + After Gauge negativo | `<TP Cost>`, `<ATB Speed>`, `<ATB After Gauge>`, Unblockable |
| **Setup** | Custo baixo (-5 a -15 TP) ou gera TP | Speed >= 0 (seguro) | `<State Apply>`, `<TP Gain>`, buffs/marcas |
| **Reativa/Counter** | Custo moderado ou gratuito | Ativacao condicional | `<ATB Interrupt>`, `<Counter>`, condicionais de HP/state |
| **Suporte** | Variavel por tier (-5 a -50) | Variavel por tier | `<State Apply>`, cura, buff de time, cleanse |
| **Passiva** | Sem custo direto | Sempre ativa ou condicional | States passive, `<TP Mode>`, auras, regen |

**Nota:** Speed positivo nao e "gratis" -- o orcamento de poder e gasto em velocidade. Skills rapidas devem ser balanceadas com dano baixo, custo alto, ou debuff ao usuario.

---

## 5. Funcao Tatica

### 5.1 Dano Consistente

- **Funcao:** Manter o loop de recurso funcionando. Dano consistente existe para que o ciclo geracao > acumulo > gasto > recuperacao nunca estagne.
- **Quando valiosa:** Entre janelas de burst (mantem pressao), quando TP esta baixo, como fallback seguro.
- **Por que nao deve dominar:** Se consistencia resolve tudo, burst perde proposito. Se geradores sao mais eficientes que spenders, o loop quebra.
- **Varia por arquétipo:** Duelista (geradores rapidos), Guardiao (protecao sustentada), Bruiser (combate agressivo), Sniper (disciplina + regen lenta).

### 5.2 Burst

- **Funcao:** Punir vulnerabilidade do inimigo -- converter recurso em dano concentrado.
- **Quando valiosa:** Inimigo exposto (HP baixo, marca ativa, debuff aplicado, janela de vulnerabilidade).
- **Por que nao deve dominar:** Burst sem setup e gasto ineficiente. Se sempre disponivel, perde identidade de payoff.
- **Risco:** Recurso acumulado e perdido se o alvo morre antes do hit ou burst falha.

### 5.3 Finisher

- **Funcao:** Virar o rumo do combate. Momento onde investimento de toda a luta converge em acao decisiva.
- **Quando valiosa:** Climax do combate (70-95% da luta), inimigo vulneravel, payoff justifica risco.
- **Por que nao deve dominar:** Precisa de custo/risco em pelo menos 2 dos 3 eixos (Efeito, Tempo, Recurso). Deve criar janela de vulnerabilidade apos uso.
- **Caracteristicas obrigatorias:** Custo massivo (-50 a -60 TP), cast time longo (-1500 a -2000 speed), after gauge negativo, efeito de alto impacto.

### 5.4 Setup

- **Funcao:** Habilitar poder futuro. Individual (habilita poder proprio) ou de time (investimento em payoff para outro).
- **Quando valioso:** Tipos: buffs, marcas, vulnerabilidades, preparacao de critico/execute/preparacao de turno futuro.
- **Por que nao deve dominar:** Setup sem payoff real e desperdicio de turno. Setup individual vs de time -- o custo de setup de time e sacrificio de recursos pessoais.

### 5.5 Reativa

- **Funcao:** Responder ao inimigo e/ou converter adversidade em vantagem.
- **Tipos:** Punicao de acao inimiga, conversao de adversidade, protecao reativa, contra-ataque, interrupcao.
- **Principio:** A skill reativa ganha poder quando algo especifico acontece no combate.

### 5.6 Utilitaria/Suporte

- **Funcao:** Suporte direto ao time -- curar conditions, curar HP, aplicar buffs, limpeza de debuffs.
- **Diferenca de reativas:** Reativas ativam SE alguma coisa acontece (gatilho automatico). Utilitarias podem ser usadas QUANDO alguma coisa acontece (decisao do jogador).
- **Podem estar em qualquer tier:** T1-2 (cura leve, buff simples), T3 (cura significativa, buff de time), T4 (protecao total da party).

---

## 6. Hierarquia de Poder

### Tabela Comparativa

| Dimensao | Basica (Tier 0-1) | Spender (Tier 2-3) | Finisher (Tier 4) |
|----------|-------------------|--------------------|--------------------|
| **Impacto** | Baixo | Moderado a alto | Devastador |
| **Custo** | Gera TP (+5 a +12) | Consome TP (-18 a -50) | Consome tudo (-50 a -60+) |
| **Frequencia** | Toda rodada | 2-3x por combate | 0-1x por combate |
| **Exigencia** | Nenhuma | Buildup previo | Setup + buildup total |
| **Risco** | Nenhum | Moderado | Alto (vulnerabilidade pos-uso) |

### Tiers por Score

| Score | Tier | Papel |
|-------|------|-------|
| 1-50 | Tier 1 | Geradores, spenders leves |
| 51-100 | Tier 2 | Spenders medios, setup |
| 101-150 | Tier 3 | Spenders pesados, finishers |
| 151-200 | Tier 4 | Ultimates |

Toda skill comeca com score 0. Modificadores positivos e negativos nos 3 eixos (Efeito, Tempo, Recurso) determinam o tier final.

### 4 Regras do que NAO Pode Acontecer

1. **Basica melhor que spender:** Se a skill basica tem mais payoff que o spender, o spender e inutil
2. **Spender mais eficiente que finisher em todo contexto:** O finisher precisa de janela onde e superior
3. **Finisher sem janela ou contrapartida:** Todo finisher precisa de risco em pelo menos 1 eixo
4. **Setup sem recompensa real:** Se o setup nao habilita payoff visivel, e desperdicio de turno

---

## 7. Kit Saudavel

### 5 Criterios de Saude

1. **Nucleo claro:** Fantasy central que orienta todas as decisoes de design
2. **Papeis distinguiveis:** Funcoes mecanas distintas (nao faz "tudo um pouco")
3. **Curva de poder coerente:** Progressao de tier logica (geradores > spenders > finisher)
4. **Cria decisoes:** Jogador escolhe entre opcoes significativas a cada turno
5. **Nao resolve tudo sozinho:** Tem fraquezas que o time cobre

### 4 Perguntas Obrigatorias do Kit

1. **Qual a fantasy do personagem?** (conceito narrativo > gameplay)
2. **Qual sua principal forma de criar valor?** (como contribui para o time)
3. **Onde esta sua recompensa?** (quais acoes geram payoff)
4. **Onde esta sua limitacao?** (quais situacoes sao dificeis)

### Loop Identificavel (4 Etapas)

Todo kit deve ter sequencia identificavel:

| Etapa | Descricao | Exemplo (Filena) |
|-------|-----------|------------------|
| **1. Abertura** | Como ele entra em combate | Passo de Brisa (gera TP + mobilidade) |
| **2. Buildup** | Como ele constroi vantagem | Acumula Momentum, aplica marcas |
| **3. Payoff** | Como ele converte vantagem | Estouro de Momentum (burst) |
| **4. Recuperacao** | Como ele se recupera depois do pico | Geradores rapidos reconstroem TP |

---

## 8. Distribuicao Interna de Poder

### Onde Colocar Cada Coisa

| Componente | Tier | Caracteristica |
|------------|------|----------------|
| **Consistencia** | T0-1 (geradores) | Base estavel, varia por arquétipo |
| **Burst** | T2-3 (spenders) | T2: -18 a -30 TP, speed -500/-750. T3: -35 a -50 TP, speed -1000/-1250 |
| **Setup** | Tier baixo | Custo acessivel, trade-off claro |
| **Utilidade** | Todos os tiers | T1-2: leve. T3: significativa. T4: protecao total |
| **Assinatura** | TP Mode + ecossistema | Assinatura real esta no LOOP, nao em skill isolada |

### 4 Coisas a Evitar

1. **Assinatura espalhada demais:** Se o ecossistema nao tem foco, o personagem e generico
2. **Forca distribuida sem foco:** Todas as skills sao "boas" mas nenhuma e memoravel
3. **Kit que so funciona quando tudo encaixa perfeitamente:** Se precisa de setup completo para ser util, falha em situacoes normais
4. **Todas as skills "boas", mas nenhuma memoravel:** Kit sem climax, sem momento "uau"

---

## 9. Tipos de Personagem

### Tabela de Arquetipos

| Tipo | Arquetipo Narrativo | Exigencias de Design | "Nao Deve" |
|------|---------------------|---------------------|------------|
| **Consistencia** | Sniper, Duelista | Geradores fortes, custo moderado, confiabilidade | Superar finishers em dano, sustentar time, tank |
| **Burst** | Bruiser, Duelista | Finishers com custo massivo, dependencia de setup, janelas dramaticas | Ter burst sempre disponivel, sustentar sem custo, tank |
| **Setup** | Duelista, Guardiao | Skills que aplicam states, custo TP moderado, habilita dano de outros | Sustentacao forte, burst independente, tank |
| **Sustain** | Bruiser | Self-sustain limitado, dependencia de causar dano para curar, trade-off TP | Ser healer completo (Daratrine NAO tem healer dedicado) |
| **Critico** | Sniper | Critico como excecao de identidade, +5% crit/stack (max +25%), mult 4.0x | Ter critico como fonte principal de DPS sem setup |
| **Hibrido** | Bruiser | Alterna entre especialidades, alternancia e decisao tatica | Ser simultaneamente tank e DPS no mesmo turno |

### 4 Regras para Hibribridos

1. **Hibrido alterna entre especialidades** -- nunca e simultaneamente tank e DPS no mesmo turno
2. **Precisa ter prioridade clara** -- Ex: Mhordred prioriza dano; tanking e consequencia
3. **Precisa pagar pela flexibilidade** -- HP baixo e risco, DEF reduzida e trade-off
4. **A alternancia e decisao do jogador** -- escolher quando tankar vs quando atacar

---

## 10. Anti-Padroes

### Anti-Padroes de Skill (6)

| Anti-Padrao | Descricao | Deteccao via Score |
|-------------|-----------|--------------------|
| Skill sem funcao clara | Nao responde "que problema resolve?" | Score ok mas falha nas perguntas obrigatorias |
| Skill redundante | Faz a mesma coisa que outra no kit | Score ok mas sobreposicao de funcao |
| Skill sempre correta | Nao ha situacao onde NAO usar | Score baixo demais (muito positiva nos 3 eixos) |
| Skill forte demais para o custo | Payoff desproporcional ao investimento | Score acima da banda do tier pretendido |
| Skill que so funciona em teoria | Edge case que nunca acontece na pratica | Score ok mas condicao irrealista |
| Skill complexa sem payoff | Mecanica elaborada sem recompensa proporcional | Score ok mas complexidade sem decisao |

### Anti-Padroes de Kit (5)

| Anti-Padrao | Descricao |
|-------------|-----------|
| Kit sem centro | Sem fantasy clara, sem loop identificavel |
| Kit completo demais | Faz tudo bem, sem fraquezas |
| Kit dependente de unica skill | Se skill X e removida, kit colapsa |
| Kit com assinatura difusa | Poderia ser de qualquer personagem |
| Kit com excesso de excecoes | Mais excecoes que regras |

### Anti-Padroes de Sinergia (4)

| Anti-Padrao | Descricao |
|-------------|-----------|
| Dependencia obrigatoria | Personagem A sem B perde >50% de eficacia |
| Combo dominante | Sinergia tao forte que invalida variacao de time |
| Payoff explosivo sem contrapartida | Setup barato com payoff desproporcional |
| Sinergia escondida demais | Interacao existe mas jogador nao descobre |

### Anti-Padroes de Inimigo (4)

| Anti-Padrao | Descricao |
|-------------|-----------|
| Boss esponja | So tem HP, sem mecanicas interessantes |
| Elite injusto | Mata sem aviso, sem counterplay |
| Inimigo que anula ferramentas sem aviso | Imune a tipo de dano sem indicacao |
| Combate que vira cheque numerico | Ganha por stats, nao por estrategia |

### Anti-Padroes de Balanceamento (5)

| Anti-Padrao | Descricao |
|-------------|-----------|
| Buffar dano como solucao padrao | Toda skill fraca recebe mais dano em vez de funcao |
| Resolver tudo com custo menor | Reduzir TP cost e a unica ferramenta usada |
| Resolver tudo com crit | Adicionar critico para consertar dano baixo |
| Resolver tudo com sustain | Curar mais em vez de resolver causa real |
| Corrigir falta de identidade com mais mecanicas | Adicionar sistemas em vez de fortalecer o nucleo |

**Deteccao de balanceamento:** Mesma solucao usada para 3+ problemas diferentes.

---

## 11. Checklists de Aprovacao

### Checklist de Skill (7 itens)

- [ ] **Tem funcao?** -- Responde "que problema resolve?"
- [ ] **Reforca identidade?** -- E reconhecivel como parte do kit
- [ ] **Cria decisao?** -- Jogador pensa antes de usar
- [ ] **Tem custo coerente?** -- Score dentro da banda do tier
- [ ] **Tem janela coerente?** -- Timing/speed proporcional ao poder
- [ ] **Tem payoff coerente?** -- Recompensa proporcional ao investimento
- [ ] **Score dentro do tier?** -- Score final encaixa no tier pretendido

### Checklist de Kit (5 itens)

- [ ] **Tem centro?** -- Fantasy central clara
- [ ] **Tem loop?** -- Sequencia identificavel de abertura/buildup/payoff/recuperacao
- [ ] **Tem assinatura?** -- TP Mode + ecossistema unicos
- [ ] **Tem fraqueza?** -- Situacoes onde o personagem struggle
- [ ] **Tem espaco de mastery?** -- Facil de aprender, dificil de dominar

### Checklist de Inimigo (4 itens)

- [ ] **Ensina ou testa algo util?** -- Valida aspecto do combat system
- [ ] **Tem contrajogo?** -- Todo ataque perigoso tem counter
- [ ] **Tem leitura?** -- Telegraphs claros, patterns aprendiveis
- [ ] **Nao invalida arbitrariamente o jogador?** -- Nao one-shot sem aviso, nao exige comp especifica

### Sinais de Retrabalho (7 itens)

| Sinal | Descricao |
|-------|-----------|
| Sobreposicao de funcao | Skills fazem a mesma coisa no kit |
| Quebra de identidade | Skill contradiz a fantasy do personagem |
| Excesso de poder | Score fora da banda do tier |
| Falta de payoff | Setup/risco sem recompensa proporcional |
| Complexidade desnecessaria | Mecanica que nao cria decisao |
| Baixa legibilidade | Efeito nao e compreensivel pelo jogador |
| Mesma solucao repetida | Balanceamento usa a mesma ferramenta para tudo |

---

## Regra de Ouro Final

**Toda skill comeca com score 0.** Nenhuma skill deve ser forte demais, rapida demais, barata demais e segura demais ao mesmo tempo. Pelo menos 1 dos 3 eixos (Efeito, Tempo, Recurso) deve ter custo quando a skill e poderosa. O score final deve estar dentro da banda do tier pretendido.
