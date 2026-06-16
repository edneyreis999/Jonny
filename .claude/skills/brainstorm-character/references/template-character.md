# [NOME] - [CLASSE] ([ARMA])

**Classe:** [classe]
**Arma Principal:** [arma]
**Papel:** [papel principal]
**Papel Secundario:** [papel secundario]
**Referencias:** [referencias de inspiracao]
**Plugin Base:** [plugins VisuStella utilizados]

---

## Visao Geral

[2-3 frases de lore narrativa descrevendo a origem, personalidade e motivacao do personagem no mundo de Daratrine.]

---

## Estatisticas Base

| Atributo | Nivel | Descricao |
|----------|-------|-----------|
| **HP** | [Alto/Medio/Baixo] | [justificativa narrativa] |
| **MP** | [Alto/Medio/Baixo] | [justificativa narrativa] |
| **ATK** | [Alto/Medio/Baixo] | [justificativa narrativa] |
| **DEF** | [Alto/Medio/Baixo] | [justificativa narrativa] |
| **AGI** | [Alto/Medio/Baixo] | [justificativa narrativa] |
| **MAT** | [Alto/Medio/Baixo] | [justificativa narrativa] |

## Atributos Base de Combate

| Atributo | Valor | Padrao | Nota |
|----------|-------|--------|------|
| **Taxa de Acerto (HIT)** | [%] | 100% | [justificativa e dependencias] |
| **Taxa de Evasao (EVA)** | [%] | 5% | [justificativa] |
| **Taxa de Critico (CRIT)** | [%] | 5% | [justificativa] |
| **Ataque Adicional** | [+N] | 0 | [justificativa] |

**Sinergia:** [como os atributos interagem entre si e criam dependencias ou fortalezas]

---

## Sistema de Recurso: [NOME DO RECURSO]

[Descricao narrativa do recurso — o que representa na ficcao, como se manifesta no combate e qual a decisao tatica central para o jogador.]

### [Nome do Recurso] (TP)

[Como funciona, fontes de geracao ativas e passivas, decisao tatica central para o jogador. Deve explicar claramente o que o recurso representa e como o jogador interage com ele.]

---

## Configuracao do TP Mode (VisuStella Enhanced TP System)

### General

| Parametro | Valor | Justificativa |
|-----------|-------|---------------|
| **TP Mode Name** | [nome] | [justificativa narrativa/mecanica] |
| **Icon** | [icone] | [descricao do icone] |
| **MaxTP Formula** | [formula] | [justificativa da curva e cap] |
| **TCR Multiplier** | [valor] | [justificativa do multiplicador] |
| **Preserve TP** | [true/false] | [justificativa narrativa/mecanica] |

**Progressao de MaxTP por Level:**

| Level | MaxTP | Initial TP ([%]) | Notas |
|-------|-------|-------------------|-------|
| 1 | [valor] | [valor] | [nota] |
| 5 | [valor] | [valor] | [nota] |
| 10 | [valor] | [valor] | [nota] |
| 15 | [valor] | [valor] | [nota] |
| 20 | [valor] | [valor] | [nota] |
| 25 | [valor] | [valor] | [nota] |
| 30 | [valor] | [valor] | [nota] |

### TP Formulas (Geracao)

| Trigger | Formula | TP Medio | Justificativa |
|---------|---------|----------|---------------|
| **Initial TP** | [formula] | [valor] | [justificativa] |
| **Evasion** | [valor] | [valor] | [justificativa] |
| **Use Skill** | [valor] | [valor] | [justificativa] |
| **TP Regen** | [valor] | [valor] | [justificativa] |
| **Take HP Damage** | [valor] | [valor] | [justificativa] |
| **Critical Hit** | [valor] | [valor] | [justificativa] |
| **Deal HP Damage** | [valor] | [valor] | [justificativa] |
| **Enemy Death** | [valor] | [valor] | [justificativa] |
| **Deal Enemy State** | [valor] | [valor] | [justificativa] |
| **Deal Enemy Debuff** | [valor] | [valor] | [justificativa] |
| **Win Battle** | [valor] | [valor] | [justificativa] |
| **Critical HP** | [valor] | [valor] | [justificativa] |
| **Only Member** | [valor] | [valor] | [justificativa] |

### Curva de Geracao (Ritmo Esperado)

**Ciclo tipico de Build (~N acoes):**
- Acao 1: [geracao e estado]
- Acao 2: [geracao e estado]
- Acao 3: [geracao e estado]
- **Total por ciclo: [N] TP**

**Para chegar a [N]+ TP (Spenders [NIVEL]):** ~[N] ciclos = [N] acoes = [N] turnos de build ativo.

---

## Integracao com o ATB

[Descricao de como o recurso do personagem integra com o sistema Active Turn Battle — modificadores de After Gauge, velocidade, e dynamics especificas.]

| [Recurso] Atual | After Gauge Bonus | Efeito Pratico |
|-----------------|-------------------|----------------|
| [valor] | [%] | [efeito] |
| [valor] | [%] | [efeito] |
| [valor] | [%] | [efeito] |
| [valor] | [%] (cap [%]) | [efeito] |

**Implementacao:** [descricao de como aplicar via State permanente ou plugin command.]

### Diagrama do Loop ATB-[Recurso]

```
[Inicio do Combate]
    |
[Charging]
    |
[Ready] -> [Skill Geradora: +N TP, inicia combo]
    |
[Charging] <-- [modificador ATB ativo]
    |
[Ready] -> [Skill Geradora: +N TP, combo cresce]
    |
[Ready] -> [Spender Leve: -N TP, quebra/continua combo]
    |
[Ready] -> [Spender Pesado: -N TP, quebra combo]
    |
[Charging LENTO] <-- After Gauge negativo + TP baixo
    |
[Rebuild via geradores]
```

---

## Kit de Skills

[Descricao do tema das skills — tipo de arma, nomeclatura, restricoes tematicas.]

Todas as skills sao projetadas para terem um score final no **Tier 1 (1-50)**. A diferenca entre "Leve", "Medio" e "Pesado" nao esta no score, mas sim no **custo de [Recurso]**, no **papel tatico** (dano vs. utilidade) e nos **trade-offs** exigidos do jogador.

[Descricao da divisao tatica entre tipos de spender — ex: Leves focam em CC, Pesados focam em dano puro.]

### Passivas

#### **[N]. [Nome da Passiva]**
- **Tipo:** Passiva
- **Descricao:** [descricao narrativa e mecanica]
- **Implementacao VisuStella:** [tags especificas do motor — ex: State permanente com `<JS ATB After Gauge>`, `<Counter Control>`, etc.]

#### **[N]. [Nome da Passiva 2]**
- **Tipo:** Passiva
- **Descricao:** [descricao narrativa e mecanica]
- **Efeito:** [efeito numerico detalhado]
- **Implementacao VisuStella:** [tags especificas do motor com detalhes de trigger e efeito]

### Geradores

#### **[N]. [Nome do Gerador]**
- **Tipo:** Gerador ([subtipo — ex: Dano, Setup])
- **Descricao:** [descricao narrativa e mecanica da skill]
- **Score Breakdown:**

| Modificador | Valor | Score | Eixo |
|-------------|-------|-------|------|
| [modificador] | [valor] | [score] | [Efeito/Tempo/Recurso] |
| [modificador] | [valor] | [score] | [Eixo] |
| Ganho TP | [valor] | [score] | Recurso |

- **Subtotal Efeito:** [N] x 2 = **[N]**
- **Subtotal Tempo:** **[N]**
- **Subtotal Recurso:** **[N]**
- **Score Final: [N]** — **Tier [N]**

**[Sistema Especifico — ex: Embalo/Combo]:** [como interage com o sistema secundario do personagem]

---

### Spenders Leves (Foco em [TIPO])

#### **[N]. [Nome do Spender Leve]**
- **Tipo:** Spender Leve ([subtipo — ex: CC, Dano])
- **Descricao:** [descricao narrativa e mecanica]
- **Score Breakdown:**

| Modificador | Valor | Score | Eixo |
|-------------|-------|-------|------|
| Multiplicador Dano | [Nx] | [score] | Efeito |
| CC: [tipo] | [% chance] | [score] | Efeito |
| Custo TP | [-N] | [score] | Recurso |

- **Subtotal Efeito:** [N] x 2 = **[N]**
- **Subtotal Tempo:** **[N]**
- **Subtotal Recurso:** **[N]**
- **Score Final: [N]** — **Tier [N]**

- **Implementacao VisuStella:** [tags no Skill — ex: `<State Rate: [tipo], [chance]>`, `<JS On Use Action>`, etc.]

**[Sistema Especifico]:** [interacao com sistema secundario]

---

### Spenders Medios

#### **[N]. [Nome do Spender Medio]**
- **Tipo:** Spender Medio ([subtipo])
- **Descricao:** [descricao narrativa e mecanica]
- **Score Breakdown:**

| Modificador | Valor | Score | Eixo |
|-------------|-------|-------|------|
| [modificador] | [valor] | [score] | [Eixo] |

- **Subtotal Efeito:** [N] x 2 = **[N]**
- **Subtotal Tempo:** **[N]**
- **Subtotal Recurso:** **[N]**
- **Score Final: [N]** — **Tier [N]**

- **Implementacao VisuStella:** [tags no Skill]

**[Sistema Especifico]:** [interacao com sistema secundario]

---

### Spenders Pesados (Foco em [TIPO])

#### **[N]. [Nome do Spender Pesado]**
- **Tipo:** Spender Pesado ([subtipo])
- **Descricao:** [descricao narrativa e mecanica]
- **Score Breakdown:**

| Modificador | Valor | Score | Eixo |
|-------------|-------|-------|------|
| [modificador] | [valor] | [score] | [Eixo] |

- **Subtotal Efeito:** [N] x 2 = **[N]**
- **Subtotal Tempo:** **[N]**
- **Subtotal Recurso:** **[N]**
- **Score Final: [N]** — **Tier [N]**

- **Implementacao VisuStella:** [tags no Skill]

**[Sistema Especifico]:** [interacao com sistema secundario]

---

### Ultimate

#### **[N]. [Nome da Ultimate]**
- **Tipo:** Finisher / Ultimate
- **Inspiraacao:** [referencia de inspiracao]
- **Descricao:** [descricao narrativa e mecanica completa]
- **Score Breakdown:**

| Modificador | Valor | Score | Eixo |
|-------------|-------|-------|------|
| [modificador] | [valor] | [score] | [Eixo] |

- **Subtotal Efeito:** [N] x 2 = **[N]**
- **Subtotal Tempo:** **[N]**
- **Subtotal Recurso:** **[N]**
- **Score Final: [N]** — **Tier [N]**

- **Implementacao VisuStella:** [tags no Skill — ex: `<Cannot Be Interrupted>`, action sequences, etc.]

**Nota:** [regra especial da Ultimate — ex: sempre quebra o combo, sacrificio requerido, etc.]

---

### Tabela Consolidada do Kit

| # | Nome | Tipo | Papel | TP Cost | Dano | CC/Efeito | Speed | Score | Tier |
|---|------|------|-------|---------|------|-----------|-------|-------|------|
| [N] | [nome] | [tipo] | [papel] | [custo] | [dano] | [efeito] | [speed] | [score] | [tier] |

---

## Sinergias de Grupo

- **[Personagem 1]:** [descricao da sinergia — como os kits se complementam]
- **[Personagem 2]:** [descricao da sinergia]
- **[Personagem 3]:** [descricao da sinergia]

---

## Validacao

- [ ] **[Criterio de validacao 1]:** [descricao do que foi verificado]
- [ ] **[Criterio de validacao 2]:** [descricao do que foi verificado]
- [ ] **[Criterio de validacao 3]:** [descricao do que foi verificado]

---

<!--

NOTAS PARA PREENCHIMENTO DO TEMPLATE:

1. SCORE BREAKDOWN OBRIGATORIO
   Cada skill ativa (Geradores, Spenders Leves/Medios/Pesados, Ultimate) DEVE conter
   uma tabela de Score Breakdown completa com:
   - Todos os modificadores relevantes (dano, CC, speed, custo, etc.)
   - Subtotais por eixo (Efeito x2, Tempo, Recurso)
   - Score Final dentro da banda do Tier alvo (Tier 1 = 1-50)
   Passivas nao requerem Score Breakdown, mas DEVEM ter o campo Implementacao VisuStella.

2. IMPLEMENTACAO VISUSTELLA OBRIGATORIA
   Cada skill (incluindo passivas) DEVE conter o campo **Implementacao VisuStella**
   indicando quais tags, notetags ou mecanicas do motor serao utilizadas. Exemplos:
   - `<JS ATB After Gauge>` — modificador dinamico de After Gauge
   - `<Counter Control>` — configuracao de contra-ataque
   - `<State Rate: [tipo], [chance]>` — aplicacao de estado/CC
   - `<Gain TP: +N>` — geracao de TP
   - `<JS On Use Action>` — logica customizada ao usar skill
   - `<Cannot Be Interrupted>` — protecao contra interrupcao

3. DISTINCAO DE NOTETAGS
   - TP Mode configurations (General, TP Formulas): aplicadas via NOTETAGS no Actor ou Class
   - Skill effects (CC, dano, buffs, counters): aplicadas via NOTETAGS no Skill ou State
   - Mantenha essa distincao clara no campo Implementacao VisuStella de cada skill.

4. CONVENCOES DO PROJETO
   - Idioma: pt-BR para descricoes e narrativa
   - Nomes de skills: em portugues, tematicos ao tipo de arma do personagem
   - Todos os scores devem estar no Tier 1 (1-50)
   - A diferenca entre spenders e geradores e o CUSTO e o PAPEL TATICO, nao o score

-->
