# Score System — Referencia Quantitativa Completa

Documento autocontendo com todas as regras numericas, tabelas de pontuacao, formulas e exemplos praticos para classificacao de skills.

---

## 1. Formula de Score

```
Score Final = [Soma(Pontos_Efeito) x 2.0] + Soma(Pontos_Tempo) + Soma(Pontos_Recurso) + Bonus_Sinergias
```

Toda skill comeca com score 0. Modificadores positivos sobem, negativos descem. O score final determina o tier.

---

## 2. Pesos por Eixo

| Eixo | Sistema | Peso | Papel |
|------|---------|------|-------|
| **Efeito** | Battle Core | **x2.0** | O que a skill FAZ. Diferenciador principal |
| **Tempo** | ATB | **x1.0** | QUANDO acontece. Custo temporario |
| **Recurso** | TP System | **x1.0** | QUANTO custa. Custo de recurso |

---

## 3. Escala de Tiers

| Score | Tier | Papel no Kit |
|-------|------|--------------|
| 1-50 | **Tier 1** | Geradores, spenders leves, utilidade basica |
| 51-100 | **Tier 2** | Spenders medios, setup, utilidade moderada |
| 101-150 | **Tier 3** | Spenders pesados, finishers, utilidade forte |
| 151-200 | **Tier 4** | Ultimates |

Skills evolucao direta mantem nome base com sufixo romano: `Consumo de Foco I` (T1) -> `Consumo de Foco II` (T2) -> `Consumo de Foco III` (T3).

---

## 4. Eixo Efeito (Battle Core) — 19 Modificadores

### 4.1 Multiplicador de Dano

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | < 0.8x | Negativo | -8 | Damage Formula (multiplicador na formula) |
| 2 | 0.8-0.9x | Negativo | -5 | Damage Formula |
| 3 | 1.0x | Neutro | 0 | Damage Formula |
| 4 | 1.1-1.4x | Positivo | +8 a +12 | Damage Formula |
| 5 | 1.5-2.0x | Positivo | +15 a +25 | Damage Formula |
| 6 | 2.1-3.0x | Positivo | +28 a +40 | Damage Formula |
| 7 | 3.0x+ | Positivo | +40 a +50 | Damage Formula |

**Tipo:** Fixo | **Referencia de tiers:** T0-1: 0.8-1.2x, T2: 1.5-2.0x, T3: 2.0-3.0x, T4: 3.0x+

---

### 4.2 Armor Penetration

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | 0% | Neutro | 0 | — |
| 2 | 1-15% | Positivo | +8 | `<Armor Pen: x%>` |
| 3 | 16-30% | Positivo | +15 | `<Armor Pen: x%>` |
| 4 | 31-50% | Positivo | +25 | `<Armor Pen: x%>` |
| 5 | > 50% | Positivo | +30 | `<Armor Pen: x%>` |

**Tipo:** Fixo

---

### 4.3 Armor Reduction (Sacrificio Proprio)

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | 0% | Neutro | 0 | — |
| 2 | 1-15% | Negativo | -5 | `<Armor Red: x%>` |
| 3 | 16-30% | Negativo | -10 | `<Armor Red: x%>` |
| 4 | > 30% | Negativo | -15 | `<Armor Red: x%>` |

**Tipo:** Fixo | Reduz propria DEF como trade-off por poder ofensivo. NAO e debuff no alvo.

---

### 4.4 Unblockable

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nao | Neutro | 0 | — |
| 2 | Sim | Positivo | +15 | `<Unblockable>` |

**Tipo:** Fixo | Uso restrito: apenas skills com custo massivo de TP e/ou cast time longo.

---

### 4.5 HIT Rate (Taxa de Acerto)

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | < 90% | Negativo | -10 | Parametro HIT do RPG Maker |
| 2 | 90-99% | Negativo | -5 | Parametro HIT |
| 3 | 100% | Neutro | 0 | Parametro HIT |
| 4 | > 100% | Positivo | +5 | Parametro HIT |

**Tipo:** Fixo | HIT Rate e CC Chance sao independentes. Prob. final = HIT Rate x CC Chance.

---

### 4.6 Chance de Critico

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Base (5-8%) | Neutro | 0 | — |
| 2 | +10-15% | Positivo | +8 | `<Modify Critical Rate: +x%>` |
| 3 | +16-25% | Positivo | +12 | `<Modify Critical Rate: +x%>` |
| 4 | > 25% | Positivo | +15 | `<Modify Critical Rate: +x%>` |

**Tipo:** On-hit | No projeto, critico e excecao, nao regra. Maioria das skills NAO tem bonus de critico.

---

### 4.7 Always Critical

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nao | Neutro | 0 | — |
| 2 | Condicional | Positivo | +18 | `<Custom Critical Eval>` (condicional) |
| 3 | Incondicional | Positivo | +30 | `<Always Critical>` |

**Tipo:** Fixo (nao amplifica com multi-hit — a skill SEMPRE critica)

---

### 4.8 Multiplicador de Critico

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | 3.0x | Neutro | 0 | — |
| 2 | 3.1-4.0x | Positivo | +8 | `<Crit Damage Bonus>` |
| 3 | > 4.0x | Positivo | +12 | `<Crit Damage Bonus>` |

**Tipo:** Fixo | Padrao do projeto: 3.0x

---

### 4.9 Life Steal

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | 0% | Neutro | 0 | — |
| 2 | 5-10% | Positivo | +8 | `<HP Life Steal Physical Hit: +x%>` |
| 3 | 15-20% | Positivo | +12 | `<HP Life Steal Physical Hit: +x%>` |
| 4 | 25%+ | Positivo | +18 | `<HP Life Steal Physical Hit: +x%>` |

**Tipo:** On-hit | Tiers: 5-10% spender leve, 15-20% spender medio, 25%+ finisher.

---

### 4.10 Escopo / Scope (Alcance de Alvos)

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | ST (single target) | Neutro | 0 | Configuracao targeting RPG Maker |
| 2 | AoE (multiplos alvos) | Positivo | +15 | `<Modify Target>` |
| 3 | Aleatorio | Negativo | -10 | `<Modify Target>` (random) |

**Tipo:** Fixo

---

### 4.11 Quantidade de Hits (Multi-Hit)

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | 1 hit | Neutro | 0 | — |
| 2 | 2 hits | Positivo | +12 | `<Repeat Targets: 2>` |
| 3 | 3 hits | Positivo | +18 | `<Repeat Targets: 3>` |
| 4 | 4+ hits | Positivo | +22 | `<Repeat Targets: x>` |

**Tipo:** Especial | Score acima = dano total + valor base multi-hit. Efeitos on-hit multiplicados separadamente (ver Secao 9).

---

### 4.12 Crowd Control (CC)

**Score base por tipo de CC (a 100% de chance):**

| Tipo CC | Efeito | Score Base | Tag VisuStella |
|---------|--------|------------|----------------|
| Stun | Alvo nao age, gauge para/reseta | +25 | State 13 |
| Confusao | Alvo ataca aliados aleatoriamente | +15 | State com Restriction trait |
| Marcacao | +HIT e +Crit Rate para atacantes | +12 | State 140 |
| Sangramento | DoT fisico (HP Regen negativa) | +10 | State 31 (HP Regen -10%) |
| Cegueira | Reduz HIT do alvo (miss) | +10 | State 5 (HIT Rate -50%) |
| Adormecido | Alvo nao age, acorda ao levar dano | +12 | State com Remove By Damage: true |
| Slow | Gauge do alvo enche mais devagar | +8 | State com debuff de Speed |
| Poison | DoT magico/quimico | +8 | State com HP Regen negativa |

**Tipo:** On-hit (quando aplicavel por hit)

**Formula de chance de aplicacao:**
```
Score do CC = Score Base x (% Chance / 100)
```

| CC (Base) | 100% | 70% | 50% | 30% |
|-----------|------|-----|-----|-----|
| Stun (+25) | +25 | +18 | +12 | +8 |
| Confusao (+15) | +15 | +10 | +8 | +5 |
| Marcacao (+12) | +12 | +8 | +6 | +4 |
| Sangramento (+10) | +10 | +7 | +5 | +3 |
| Cegueira (+10) | +10 | +7 | +5 | +3 |
| Slow (+8) | +8 | +6 | +4 | +2 |
| Poison (+8) | +8 | +6 | +4 | +2 |

**Regras de duracao/AoE:** CC com duracao > 3 turnos = +50% no score base. CC em AoE = +50% adicional (cumulativo com duracao).

---

### 4.13 Interrupt

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nao | Neutro | 0 | — |
| 2 | Sim | Positivo | +10 | `<ATB Interrupt>` |

**Tipo:** Fixo | Interrompe skills em casting do alvo. Counterplay ativo.

---

### 4.14 Buffs ao Usuario

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nao | Neutro | 0 | — |
| 2 | 1 stack, 1 param (+25%) | Positivo | +8 | MECH: Add Buff (Battle Core) |
| 3 | 2 stacks 1 param (+50%) ou 1 stack 2 params | Positivo | +12 | MECH: Add Buff |
| 4 | 3 stacks 1 param (+75%) ou 2+ stacks 2+ params | Positivo | +15 | MECH: Add Buff |

**Tipo:** Fixo | Cada stack = +25% no parametro. Valor fixo, configuravel via `JS: Buff/Debuff Rate` no Skills & States Core.

---

### 4.15 Debuffs ao Alvo

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nao | Neutro | 0 | — |
| 2 | 1 stack, 1 param (-25%) | Positivo | +8 | MECH: Add Debuff (Battle Core) |
| 3 | 2 stacks 1 param (-50%) ou 1 stack 2 params | Positivo | +12 | MECH: Add Debuff |
| 4 | 3 stacks 1 param (-75%) ou 2+ stacks 2+ params | Positivo | +15 | MECH: Add Debuff |
| 5 | 2+ stacks, 3+ params | Positivo | +18 | MECH: Add Debuff |

**Tipo:** Fixo | Cada stack = -25% no parametro.

---

### 4.16 Debuffs ao Usuario

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nao | Neutro | 0 | — |
| 2 | 1 stack, 1 param (-25%) | Negativo | -8 | MECH: Add Debuff (auto-aplicado) |
| 3 | 2 stacks 1 param (-50%) ou 1 stack 2 params | Negativo | -12 | MECH: Add Debuff |
| 4 | 3 stacks 1 param (-75%) ou 2+ stacks 2+ params | Negativo | -15 | MECH: Add Debuff |

**Tipo:** Fixo | Trade-off: sacrifica propria DEF por poder ofensivo.

---

### 4.17 Cura Direta / Drain

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nao | Neutro | 0 | — |
| 2 | Leve (10-20% HP) | Positivo | +12 | Mecanica Drain / formula de cura |
| 3 | Moderada (25-40% HP) | Positivo | +20 | Mecanica Drain / formula de cura |
| 4 | Forte (50%+ HP) | Positivo | +28 | Mecanica Drain / formula de cura |

**Tipo:** Fixo

---

### 4.18 Buffs para Aliados

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nao | Neutro | 0 | — |
| 2 | Individual (1 aliado) | Positivo | +15 | State com traits positivas em aliados |
| 3 | Time inteiro | Positivo | +25 | State com traits positivas em aliados |

**Tipo:** Fixo

---

### 4.19 Remocao de Debuffs / Limpeza

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nao | Neutro | 0 | — |
| 2 | 1 debuff especifico | Positivo | +10 | Mecanica de remocao de states |
| 3 | Todos (cleanse) | Positivo | +18 | Mecanica de remocao de states |

**Tipo:** Fixo

---

## 5. Eixo Tempo (ATB) — 4 Modificadores

### 5.1 Speed / Cast Time

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | > 0 (speed positivo) | Positivo | +5 a +10 | Speed parameter / ATB |
| 2 | 0 (speed zero) | Neutro | 0 | Speed parameter |
| 3 | -1 a -500 | Negativo | -5 a -12 | Speed parameter (cast curto) |
| 4 | -501 a -1000 | Negativo | -12 a -22 | Speed parameter (cast medio) |
| 5 | -1001 a -2000 | Negativo | -22 a -35 | Speed parameter (cast longo) |
| 6 | < -2000 | Negativo | -35 a -45 | Speed parameter (cast muito longo) |

**Tipo:** Fixo | Instantanea (>= 0): sem vulnerabilidade. Cast leve (-250 a -500): risco moderado. Cast medio (-750 a -1000): risco significativo. Cast longo (-1250 a -2000): risco massivo.

---

### 5.2 After Gauge

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | > 0% (positivo) | Positivo | +5 a +8 | `<ATB After Gauge: +x%>` |
| 2 | 0% | Neutro | 0 | — |
| 3 | -1% a -20% | Negativo | -5 a -10 | `<ATB After Gauge: -x%>` |
| 4 | -21% a -40% | Negativo | -10 a -18 | `<ATB After Gauge: -x%>` |
| 5 | < -40% | Negativo | -18 a -25 | `<ATB After Gauge: -x%>` |

**Tipo:** Fixo | Controla cadencia pos-acao e janela de vulnerabilidade.

---

### 5.3 Cannot Be Interrupted

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nao | Neutro | 0 | — |
| 2 | Sim | Positivo | +10 | `<ATB Cannot Be Interrupted>` |

**Tipo:** Fixo | So faz sentido se a skill TEM cast time (speed < 0). Skills com speed >= 0 nao sao interrompiveis por definicao.

---

### 5.4 Interruptibilidade (Risco)

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nao (speed >= 0) | Neutro | 0 | Implicito pelo Speed |
| 2 | Nao (tem Cannot Be Interrupted) | Neutro | 0 | `<ATB Cannot Be Interrupted>` |
| 3 | Sim (sem protecao) | Negativo | -8 | Implicito pelo Speed < 0 |

**Tipo:** Fixo | Pode ser cancelada por `<ATB Interrupt>`.

---

## 6. Eixo Recurso (TP System) — 4 Modificadores

### 6.1 Custo de TP

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | 0 (sem custo) | Neutro | 0 | — |
| 2 | 1-15 | Negativo | -5 a -12 | Parametro TP Cost |
| 3 | 16-30 | Negativo | -12 a -22 | Parametro TP Cost |
| 4 | 31-50 | Negativo | -22 a -35 | Parametro TP Cost |
| 5 | > 50 | Negativo | -35 a -45 | Parametro TP Cost |

**Tipo:** Fixo

---

### 6.2 Ganho de TP

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | 0 | Neutro | 0 | — |
| 2 | +5-8 | Positivo | +5 | `<Gain TP: +x>` / TP Mode "Use Skill" |
| 3 | +10-12 | Positivo | +8 | `<Gain TP: +x>` |
| 4 | > 12 | Positivo | +10 | `<Gain TP: +x>` |

**Tipo:** Fixo | Geradores basicos: +5 a +8 TP. Geradores premium: +10 a +12 TP.

---

### 6.3 Condicao de Uso

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nenhuma condicao | Neutro | 0 | — |
| 2 | Condicao restritiva | Negativo | -8 a -12 | JS condicional / requisitos state/HP/TP |
| 3 | Condicao muito restritiva | Negativo | -12 a -18 | Requer multiplos setups ou condicao rara |

**Tipo:** Fixo

---

### 6.4 Consome Beneficio Proprio / Marca

| # | Faixa | Class. | Score | Tag VisuStella |
|---|-------|--------|-------|----------------|
| 1 | Nao | Neutro | 0 | — |
| 2 | Sim | Negativo | -10 | States removidos pos-uso / remocao de stacks |

**Tipo:** Fixo | O investimento previo (setup) e gasto como custo adicional.

---

## 7. Regras de Balanceamento

### 7.1 Minimo de Negativos por Tier

| Tier | Min. Negativos | Regra |
|------|----------------|-------|
| Tier 1 | **0** | Geradores podem ser puro positivo |
| Tier 2 | **1** | Pelo menos 1 negativo em qualquer eixo |
| Tier 3 | **2** | Pelo menos 2 negativos |
| Tier 4 | **3** | Pelo menos 3 negativos em eixos diferentes (nao pode ser so custo TP) |

### 7.2 Cap de Modificadores

- Maximo de **8 modificadores positivos** por skill.
- Modificadores alem do 8o contam com **x0.5** no score.

### 7.3 AoE + CC Tax

CC em AoE recebe **+50% no score do CC**. Acumulativo com duracao > 3 turnos (+50% cada).

**Exemplo:** Stun (+25) em AoE = +25 x 1.5 = +38 pts.

### 7.4 Anti-Distorcoes (5 regras)

1. **Basica melhor que spender:** Se score da basica >= score do spender, o spender e inutil. Revisar.
2. **Multi-hit subavaliado:** Multi-hit com efeitos on-hit e amplificado. Nao subestimar.
3. **CC forte com custo insuficiente:** Todo hard CC (Stun, Confusao) em Tier 2+ exige pelo menos 2 negativos em outros eixos.
4. **Combos ofensivos explosivos:** Se Multiplicador + Armor Pen + Always Crit > +80 pts no efeito, exigir pelo menos 3 negativos.
5. **Suporte injustamente fraco:** Cura, buffs de aliado e limpeza ja tem pontos base mais altos que equivalentes ofensivos leves. Nao aplicar multiplicador extra.

---

## 8. Regras de Sinergia

### 8.1 On-hit vs Fixo

| Tipo | Modificadores | Regra com Multi-Hit |
|------|---------------|---------------------|
| **On-hit** | Life Steal, Chance Critico, Ganho TP, CC (on-hit) | Score multiplicado por hits (ver Secao 9) |
| **Fixo** | Armor Pen, Unblockable, Armor Reduction, Buffs, Debuffs, Cura, Mult. Dano | Nao multiplicam com hits |

### 8.2 Bonus de Sinergia (Fixos)

| Combinacao | Bonus | Justificativa |
|------------|-------|---------------|
| AoE + qualquer CC | +8 pts (sobre o CC) | CC em multiplos alvos e desproporcional |
| Always Critical + Crit Mult > 3.0x | +6 pts | Dano explosivo |
| Speed < 0 + Cannot Be Interrupted | Reduz negativo de Speed em 50% | Mitiga o risco do cast |
| Condicao de uso + Consome beneficio | +5 pts (sobre o negativo) | Duplo custo de recurso |

---

## 9. Multi-Hit: Regras Especiais

### 9.1 Formula de Amplificacao On-Hit

```
Score On-Hit Amplificado = Score Base x (1 + 0.8 x (hits - 1))
```

Diminishing returns: 1o hit 100%, 2o 80%, 3o 60%, etc.

| Hits | Multiplicador Efetivo | Exemplo (Life Steal +8) |
|------|----------------------|------------------------|
| 1 | x1.0 | 8 |
| 2 | x1.8 | 14 |
| 3 | x2.6 | 21 |
| 4 | x3.4 | 27 |
| 5+ | x4.2 (cap) | 34 |

**Modificadores que amplificam (on-hit):** Life Steal, Chance Critico, Ganho TP, CC on-hit.

**Modificadores que NAO amplificam (fixo):** Armor Pen, Unblockable, Multiplicador Dano, Buffs/Debuffs fixos.

### 9.2 Interacao com a Formula

O score on-hit amplificado **SUBSTITUI** o bonus de sinergia fixo — nao soma os dois.

| Cenario | Score Life Steal 10% |
|---------|---------------------|
| Sem multi-hit | +8 |
| Com 2 hits | +8 x 1.8 = +14 |
| Com 3 hits | +8 x 2.6 = +21 |

---

## 10. Checklist de Validacao de Skill

Template obrigatorio para novas skills:

```
Skill: [nome]
Personagem: [nome]
Tipo: [Basica / Spender / Finisher / Setup / Reativa / Suporte / Conversao]

EIXO EFEITO (x2):
[ ] Multiplicador de Dano: [valor] -> Score: [N]
[ ] Armor Penetration: [valor] -> Score: [N]
[ ] Armor Reduction: [valor] -> Score: [N]
[ ] Unblockable: [sim/nao] -> Score: [N]
[ ] HIT Rate: [valor] -> Score: [N]
[ ] Chance Critico: [valor] -> Score: [N] (on-hit: sim/nao)
[ ] Always Critical: [sim/condicional/nao] -> Score: [N]
[ ] Mult. Critico: [valor] -> Score: [N]
[ ] Life Steal: [valor] -> Score: [N] (on-hit: sim/nao)
[ ] Escopo: [ST/AoE/Random] -> Score: [N]
[ ] Multi-Hit: [1/2/3/4+] -> Score: [N]
[ ] CC: [tipo, %chance, duracao] -> Score: [N] (on-hit: sim/nao)
[ ] Interrupt: [sim/nao] -> Score: [N]
[ ] Buffs ao Usuario: [stacks x params] -> Score: [N]
[ ] Debuffs ao Alvo: [stacks x params] -> Score: [N]
[ ] Debuffs ao Usuario: [stacks x params] -> Score: [N]
[ ] Cura Direta: [valor] -> Score: [N]
[ ] Buffs para Aliados: [tipo, alvo] -> Score: [N]
[ ] Remocao Debuffs: [tipo] -> Score: [N]

Subtotal Efeito: [N] x 2 = [N x2]

EIXO TEMPO (x1):
[ ] Speed/Cast Time: [valor] -> Score: [N]
[ ] After Gauge: [valor] -> Score: [N]
[ ] Cannot Be Interrupted: [sim/nao] -> Score: [N]
[ ] Interruptivel: [sim/nao] -> Score: [N]

Subtotal Tempo: [N]

EIXO RECURSO (x1):
[ ] Custo TP: [valor] -> Score: [N]
[ ] Ganho TP: [valor] -> Score: [N]
[ ] Condicao de Uso: [tipo] -> Score: [N]
[ ] Consome Beneficio: [sim/nao] -> Score: [N]

Subtotal Recurso: [N]

SINERGIAS:
[ ] Multi-hit x On-hit: [detalhar] -> Bonus: [N]
[ ] AoE + CC: [detalhar] -> Bonus: [N]
[ ] Always Crit + Crit Mult: [detalhar] -> Bonus: [N]
[ ] Speed < 0 + Cannot Be Interrupted: [detalhar] -> Bonus: [N]
[ ] Condicao + Consome: [detalhar] -> Bonus: [N]

Subtotal Sinergias: [N]

SCORE FINAL: [Efeito x2] + [Tempo] + [Recurso] + [Sinergias] = [TOTAL]
TIER: [1/2/3/4]

VALIDACAO:
[ ] Min. negativos por tier atendido? [sim/nao]
[ ] Max. 8 positivos? [sim/nao]
[ ] Nenhuma anti-distorcao violada? [sim/nao]
```

---

## 11. Exemplos Praticos

### 11.1 Passo de Brisa (Filena) — Tier 1, Gerador Basico

| Modificador | Valor | Class. | Score Base | Peso | Score Liq. |
|-------------|-------|--------|------------|------|------------|
| Multiplicador | 1.0x | Neutro | 0 | x2 | 0 |
| Speed | +1000 | Positivo | +8 | x1 | +8 |
| Ganho TP | +10 | Positivo | +8 | x1 | +8 |
| Escopo | ST | Neutro | 0 | x2 | 0 |
| HIT | 100% | Neutro | 0 | x2 | 0 |
| Armor Pen | 0% | Neutro | 0 | x2 | 0 |

**Calculo:** 0 + 8 + 8 + 0 + 0 + 0 = **16** | **Tier 1** (1-50) — Gerador de recurso rapido com dano padrao.

---

### 11.2 Golpe Atordoante — Tier 1, Dano + Stun

| Modificador | Valor | Class. | Score Base | Peso | Score Liq. |
|-------------|-------|--------|------------|------|------------|
| Multiplicador | 1.0x | Neutro | 0 | x2 | 0 |
| Stun | Sim, 100%, 2 turnos | Positivo | +25 | x2 | +50 |
| Speed | 0 | Neutro | 0 | x1 | 0 |
| Custo TP | 0 | Neutro | 0 | x1 | 0 |

**Calculo:** 0 + 50 + 0 + 0 = **50** | **Tier 1 alto** — Sem dano extra, sem custo. O unico poder e o Stun. Utilidade pura: o jogador escolhe entre esta skill (controle) ou um gerador (dano + TP).

**Evolucao para Tier 2:** Adicionar Mult. 1.3x (+10x2=+20) e Custo TP -15 (-10). Novo total: 50 + 20 - 10 = **60** — Tier 2.

---

### 11.3 Sopro Venenoso — Tier 1, CC com Chance Parcial

| Modificador | Valor | Class. | Score Base | Peso | Score Liq. |
|-------------|-------|--------|------------|------|------------|
| Multiplicador | 1.0x | Neutro | 0 | x2 | 0 |
| Poison | 30% chance | Positivo | +8 x 0.3 = +2 | x2 | +4 |
| Speed | 0 | Neutro | 0 | x1 | 0 |
| Custo TP | 0 | Neutro | 0 | x1 | 0 |

**Calculo:** 0 + 4 + 0 + 0 = **4** | **Tier 1 baixissimo** — Dano padrao com CC fraco e incerto. 30% de poison = utilidade marginal.

**Se Poison fosse 100% chance:** +8 x 2 = +16 total. Tier 1 medio. A diferenca de % chance e significativa no score.
