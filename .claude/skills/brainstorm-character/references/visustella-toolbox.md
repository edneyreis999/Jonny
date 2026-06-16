# VisuStella Toolbox - Referencia Rapida para Design de Personagens

> **Escopo**: Configuracoes globais (JA DEFINIDAS) vs por-personagem (configuraveis).
> **Plugins**: Battle Core, ATB, Enhanced TP, Skills & States Core, Auto Skill Trigger, Life State Effects, Battle AI.

---

## 1. Configuracoes Globais do Projeto (NAO mudam por personagem)

| Configuracao | Valor | Observacao |
|---|---|---|
| **Battle System** | ATB (Time Progress) | Database > System 1 |
| **Speed Scale** | +2000=50%, +1000=25%, +500=12.5% | Skill speed positivo afeta proximo gauge |
| **Cast Time** | Speed negativo = casting state | Gauge roxo, pode ser interrompido |
| **Damage Formula** | `(Flat + Stat x Multiplier) x Mitigacao` | Estilo MOBA, sempre calculavel |
| **Armor/Magic Pen** | Stack multiplicativamente | % da DEF/MDF ignorada |
| **Critical Base** | 5% (CRI do database) | Skills especificas modificam |
| **Synergy States** | ID 140=Marca, ID 134=Buff | Sinergias de time Filena/Thorin |
| **Gauge Visual** | Verde=Full, Roxo=Cast, Laranja=Slow, Azul=Fast | ATB colors por estado |

**TP Modes ja criados nos Plugin Parameters:**

| TP Mode | Personagem | TCR | Preserve | MaxTP | Geracao Principal |
|---|---|---|---|---|---|
| Momentum | Filena | 1.2 | ON | 100 | Evasion +12 TP, Use Skill |
| Guarda | Kilin | 1.0 | OFF | 50 | Take Damage (value/20), Ally Damage |
| Furia | Mhordred | 1.5 | OFF | 100 | Take/Deal Damage, Critical Hit +8 TP |
| Foco | Thorin | 1.0 | ON | 100 | Critical Hit +10 TP, TP Regen +2 |

**Preserve ON**: Filena, Thorin (mantem TP entre batalhas)
**Preserve OFF**: Kilin, Mhordred (TP zera ao fim da batalha)

---

## 2. Capacidades por Plugin

| Plugin | O que Habilita | Tags Mais Relevantes |
|---|---|---|
| **Battle Core** | Action Sequences, Damage Cap, Armor Pen, Critical, Life Steal, Targeting custom, Unblockable | `<Armor Penetration>`, `<Set Critical Rate>`, `<Unblockable>`, `<HP Life Steal>`, `<Repeat Hits>`, `<Always Hit>`, `<Target: x Random>` |
| **ATB** | Gauge manipulation, After Gauge (+/-), Cast/Charge Gauge, Interrupt, Field Gauge | `<ATB After Gauge: +/-x%>`, `<ATB Interrupt>`, `<ATB Cannot Be Interrupted>`, `<ATB Charge/Cast Gauge>`, `<JS ATB After Gauge>` |
| **Enhanced TP** | TP Modes, MaxTP, Preserve, TCR, Gain/Lose TP, Change/Learn TP Mode | `<TP Mode>`, `<Max TP>`, `<TCR Multiplier>`, `<Preserve TP>`, `<Gain TP: +/-x>`, `<Force TP Mode>` |
| **Skills & States Core** | Custom costs (HP/MP/Gold/Item), Passive States, Aura/Miasma, State manipulation, Slip Damage, Buff/Debuff turns | `<TP Cost: x>`, `<Passive State>`, `<Aura/Miasma State>`, `<JS HP Slip Damage>`, `<State Turns: +/-x>`, `<No Death Clear>`, `<Reapply Rules>` |
| **Auto Skill Trigger** | 60 condicoes automaticas (Battle Start, Physical Target, Death, Elemental, etc.) | `<Auto Trigger: condition>`, `<Auto Trigger x%: condition>`, `<No Auto Skill Trigger>` |
| **Life State Effects** | Auto Life, Doom, Fragile, Guts, Undead, Curse, Death Transform | `<Auto Life: x%>`, `<Doom>`, `<Guts>`, `<Fragile>`, `<Curse HP/MP/TP>`, `<Undead>` |
| **Battle AI** | AI Styles (Classic/Gambit/Casual/Random), AI Levels, Conditions (ALL/ANY), Target selection | `<AI Style>`, `<AI Level>`, `<All/Any AI Conditions>`, `<AI Target: type>`, `<Reference AI>` |

---

## 3. Tags por Funcao de Design

| Funcao | Tags | Escopo | Exemplo de Uso |
|---|---|---|---|
| **Dano Direto** | `<Armor Penetration: x%>`, `<Modify Critical Rate>`, `<Unblockable>`, `<Modify Critical Multiplier>` | Skill | Spender pesado com 30% pen, Unblockable |
| **Dano AoE** | `<Target: x Random Enemies>`, `<Single or Multiple Select>`, `<Disperse Damage>`, `<Repeat Hits: x>` | Skill | 3 inimigos aleatorios, dano dividido |
| **CC Total** | `<Apply State: x>`, `<State x Turns>` + State com Remove by Restriction | Skill | Aplica Sleep por 3 turnos |
| **CC Parcial** | `<State x Turns: -3>`, `<param Debuff Turns: -2>`, `<Bypass State Damage Removal>` | Skill | Remove turnos de buff inimigo |
| **Buffs/Debuffs** | `<param Buff Turns: +2>`, `<Aura State>`, `<Miasma State>`, `<Passive State>` | Skill, State | Aura que da +20% ATK para aliados |
| **Resource Generation** | `<Gain TP: +x>`, `<TP Cost: -x>`, `<HP Life Steal: x%>` | Skill | Gerador: +10 TP, dano leve |
| **Resource Cost** | `<TP Cost: x>`, `<HP Cost: x>`, `<JS TP Cost>`, `<type Cost: x%>` | Skill | Spender: -25 TP, custo percentual |
| **ATB Manipulation** | `<ATB After Gauge: +/-x%>`, `<ATB Charge/Cast Gauge>`, `<ATB Interrupt>`, `<JS ATB After Gauge>` | Skill | Speed +1000 no proximo gauge |
| **Reativo/Counter** | `<Auto Trigger: Physical Target>`, `<Auto Trigger x%: condition>`, `<Guts>` | Skill, State | Counter com 50% chance ao ser atacado |
| **Passivo/Aura** | `<Passive State>`, `<Aura State>`, `<Miasma State>`, `<JS Passive Condition>` | State, Actor, Weapon | Aura de DEF para aliados quando HP < 50% |
| **Sobrevivencia** | `<Guts>`, `<Auto Life: x%>`, `<ATB Cannot Be Interrupted>`, `<Curse HP>` (inimigo) | State, Skill | Guts: sobrevive com 1 HP |
| **Multi-Hit** | `<Repeat Hits: x>`, `<Target: x Random Any>`, `<JS Targets>` | Skill | 3 hits no mesmo alvo |
| **Heal/Sustain** | `<HP Life Steal: x%>`, `<JS HP Slip Heal>`, `<Gain TP: +x>` | Skill, State | 20% life steal, regen passivo |
| **Interrupt** | `<ATB Interrupt>`, `<Doom>`, `<Cancel Life Steal>`, `<Extinct>` | Skill, State | Cancela cast inimigo, reseta gauge |

---

## 4. Padroes Mecanicos Comuns

| Padrao | Mecanica | Tags Envolvidas |
|---|---|---|
| **Gerador Padrao** | Skill barata (+TP), speed rapido, dano baixo | `<Gain TP: +8>`, speed +500/+1000 |
| **Spender com Cast** | Skill cara (-TP), cast time, dano alto | `<TP Cost: 25>`, speed -500/-1000, `<Armor Penetration: 20%>` |
| **Counter Attack** | Auto-trigger ao ser atacado, dano reativo | `<Auto Trigger: Physical Target>`, `<Auto Trigger 50%: ...>` |
| **Aura de Suporte** | Passive state que buffa aliados | `<Aura State: x>`, `<Not User Aura>`, `<Passive Condition Switch>` |
| **Risco/Recompensa** | Buff forte + debuff severo, trade-off | `<Armor Reduction: 30%>`, `<TCR Multiplier: 1.5>` (no state) |
| **Resource Trade** | Sacrifica HP/TP para efeito forte | `<HP Cost: 200>`, `<TP Cost: x%>`, `<ATB After Gauge: -x%>` |
| **Execute Finisher** | Dano massivo, custo alto, condição | `<TP Cost: 60>`, speed -1500/-2000, `<Unblockable>`, `<Always Critical>` |
| **Setup State** | Aplica state que amplifica proxima skill | `<Apply State: 140>`, `<Reapply Rules: Greater>`, `<No Death Clear>` |
| **Panic Button** | Skill instantanea de emergencia | speed 0, `<Guts>`, `<Auto Life: 50%>`, `<ATB Charge Gauge: +100%>` |
| **Sustain por Dano** | Roubo de vida ou cura ao atacar | `<HP Life Steal: 20%>`, `<JS HP Slip Heal>` |

---

## 5. Integracao ATB-TP por Arquetipo

| Arquetipo | AGI/Speed | TP Generation | After Gauge | Preserve | MaxTP |
|---|---|---|---|---|---|
| **Duelista** (Filena) | Alta, speed +500/+1000 | Rapida (Evasion +12, geradores) | +0 a +30% (mobility) | ON | 100 |
| **Guardiao** (Kilin) | Baixa, speed 0/-250 | Lenta (Take Damage, Ally Damage) | -10 a +20% (posicional) | OFF | 50 |
| **Bruiser** (Mhordred) | Media, speed -500/-1000 | Muito rapida (Take/Deal, TCR 1.5) | -20 a +10% (risco) | OFF | 100 |
| **Sniper** (Thorin) | Media, speed -500/-1000 | Lenta (Crit +10, Regen +2) | -30 a +15% (setup) | ON | 100 |
| **Mago** (template) | Baixa, speed -750/-1500 | Moderada (Deal Damage, elemental) | -25 a +10% | OFF | 100 |
| **Suporte** (template) | Media-Alta, speed 0/+500 | Moderada (Ally actions, heals) | +10 a +30% (utility) | Varia | 80-100 |

### Notas sobre Trade-offs

- **After Gauge (+)**: Personagem age mais rapido no proximo turno. Ideal para duelistas (mobility) e suportes (utility). Custo: dano/efeito menor na skill atual.
- **After Gauge (-)**: Personagem age mais lento. Payoff: skill mais poderosa. Ideal para bruisers (burst) e magos (cast pesado).
- **Preserve ON**: Investimento longo prazo. TP acumulado entre batalhas. Melhor para personagens com geracao lenta (Thorin).
- **Preserve OFF**: Volatilidade. TP zera, mas geracao rapida compensa. Melhor para personagens com TCR alto (Mhordred).
- **MaxTP 50**: Barra menor = acesso mais rapido a spenders, mas reservoir limitado. Ideal para guardiao (uso frequente de skills de protecao).
- **MaxTP 100**: Reservoir grande = possibilidade de burst windows mais longas. Ideal para duelista e bruiser.

### Hierarquia de Poder (Balanceamento)

| Tier | Custo TP | Dano Base | Speed | Pen% | Exemplo |
|---|---|---|---|---|---|
| **T0 Gerador** | +5 a +12 | Baixo (50 + stat x1.0) | 0 a +1000 | 0% | Passo de Brisa |
| **T1 Spender Leve** | -8 a -15 | Moderado (120-150 + stat x1.2) | 0 a -250 | 0-15% | Investida |
| **T2 Spender Medio** | -18 a -30 | Forte (150-200 + stat x1.5) | -500/-750 | 15-20% | Estocada |
| **T3 Spender Pesado** | -35 a -50 | Muito forte (300-400 + stat x2.2) | -1000/-1250 | 30% | Extravasar |
| **T4 Finisher** | -60 ou cheio | Devastador (600+ + stat x3.5) | -1500/-2000 | 50% | Estouro de Momentum |

### Prioridade de TP Modes (Maior para Menor)

1. `<Force TP Mode>` (State/Weapon/Armor/Class) -- prevalece sobre tudo
2. `<Change User/Target TP Mode>` -- mudanca temporaria via skill
3. `<TP Mode>` -- modo base do Actor/Enemy
4. `<Starting TP Modes>` -- lista de modos disponiveis

### Escopos Rapidos (Onde cada tag funciona)

- **So Skill/Item**: ATB After/Charge/Cast/Interrupt, Targeting (Random, AoE, Disperse), Critical (Set/Modify/Multiplier/Always), Life Steal ativo, Gain TP, Auto Trigger, AI Conditions/Target, Unblockable, Custom Costs
- **So State**: Auto Life, Doom, Extinct, No Death Clear, Reapply Rules, Slip Damage/Heal, Passive Condition, Passive Stackable
- **So Enemy**: Death Transform, Popup Position/Offset
- **So Class**: Replace HP/MP/TP Gauge, AI Style, Reference AI
- **Todos (Actor/Class/Skill/Weapon/Armor/Enemy/State)**: Armor/Magic Penetration/Reduction, Modify Critical Rate (passivo), Damage Cap/Bypass, Life Steal passivo (por hit type)
