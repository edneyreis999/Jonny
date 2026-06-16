# Post-Mortem: Formulas MOBA (VisuStella Battle Core)

**Data:** 2026-04-25
**Skills afetadas:** 46-55 (Filena/Classe 1)
**Severidade:** CRITICA

---

## Formula Real do VisuStella MOBA Style

### Configuracao
```
DefaultDamageStyle: "MOBA"
```

### Codigo do Plugin (VisuMZ_1_BattleCore.js)

```javascript
// Passo 1: eval(formula) -> valor numerico
let value = Math.max(eval(item.damage.formula), 0) * sign;

// Passo 2: Multiplica por parametro ofensivo
if (this.isPhysical()) {
    value *= a.atk;   // Physical: ATK
} else if (this.isMagical()) {
    value *= a.mat;   // Magical: MAT
}

// Passo 3: Mitigacao hiperbolica do defensor
if (this.isDamage() && !this.isCertainHit()) {
    let armor = this.isPhysical() ? b.def : b.mdf;
    if (armor >= 0) {
        value *= 100 / (100 + armor);
    }
}
```

### Regra

```
Dano = formula x ATK x (100 / (100 + DEF))
```

**O campo formula e multiplicado DIRETAMENTE pelo ATK. NAO existe divisao por 100.**

---

## O Erro

### Documento Incorreto

Instrucoes diziam: `ATK x (mult/100) x mit`
Implicava que campo "223" seria dividido por 100 antes de multiplicar.

### Resultado

| Campo formula | Interpretacao errada | Interpretacao correta |
|---------------|---------------------|-----------------------|
| "223" | ATK x 2.23 | 223 x ATK |
| "121" | ATK x 1.21 | 121 x ATK |

Dano ficou **100x maior** que o pretendido.

### Exemplo Skill 51 (Combo Duplo)

```
ATK Filena nv30 = 180
DEF Cristaleao = 120

ERRADO (formula "223"):
  223 x 180 x 0.4545 = 18,245 dano (61% HP boss)

CORRETO (formula "2.23"):
  2.23 x 180 x 0.4545 = 182 dano (0.6% HP boss)
```

---

## Licoes Aprendidas

### L1: Formula MOBA usa float, nao percentual inteiro

**Problema:** Documentacao interna dizia "ATK x (mult/100)" mas o plugin nao faz essa divisao.

**Regra:** Campo `damage.formula` recebe valores float como `2.23`, `6.60`, `0.78` — nunca inteiros como `223`, `660`, `78`.

| Para causar... | Campo formula (physical) |
|----------------|------------------------|
| 1x ATK bruto | `1.0` |
| 2x ATK bruto | `2.0` |
| 2.23x ATK bruto | `2.23` |
| 50% ATK bruto | `0.5` |
| 6.6x ATK bruto | `6.6` |

### L2: Sempre verifique a formula real no plugin

**Problema:** Confiou-se em documento de instrucoes sem validar contra o codigo.

**Regra:** Antes de aplicar valores em massa, extraia a formula real do plugin e calcule um caso de teste manual.

### L3: Teste com calculo manual antes de aplicar

**Exemplo que teria detectado o erro:**

```
Skill 47 (Passo de Brisa), formula = "121"
ATK Filena = 180, DEF Cristaleao = 120

Se "ATK x (121/100)": 180 x 1.21 x 0.4545 = 99 (razoavel)
Se "121 x ATK": 121 x 180 x 0.4545 = 9,896 (absurdo!)

ERRO detectado no primeiro skill.
```

### L4: Erros em massa sao silenciosos

**Problema:** Params de ATK (19→180) e formulas mudaram juntos. Teste subjetivo "dano aumentou" seria true mesmo 100x maior.

**Regra:** Aplique alteracoes incrementalmente: params PRIMEIRO, teste, depois formulas, teste novamente.

---

## Tabela de Conversao — Float Correto

| Tier | Percentual (errado) | Float (correto) |
|------|--------------------|-----------------|
| Counter | 78 | **0.78** |
| T0 Gerador | 121 | **1.21** |
| T0 Gerador | 110 | **1.10** |
| T1 Leve | 179 | **1.79** |
| T2 Medio | 223 | **2.23** |
| T3 Pesado | 372 | **3.72** |
| T4 Finisher | 660 | **6.60** |

---

## Validacao Pos-Correcao

```
Skill 51 (Combo Duplo): formula = 2.23
ATK Filena nv30 = 180, DEF Cristaleao = 120

Dano = 2.23 x 180 x (100/220)
     = 2.23 x 180 x 0.4545
     = 182.5

Com variance 20%: 146 a 219
% HP Cristaleao (30,000): 0.5-0.7%
```

Resultado correto: **~182 de dano** — consistente com target de balanceamento.
