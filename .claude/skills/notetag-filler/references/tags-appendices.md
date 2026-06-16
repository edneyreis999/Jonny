# Apencices - Referencias Complementares

---

## Apendice A: Nomes Oficiais vs Abreviados

| Abreviado (Funciona) | Oficial (Recomendado) |
|----------------------|-----------------------|
| `<Critical: x%>` | `<Modify Critical Rate: x%>` |
| `<Armor Pen: x%>` | `<Armor Penetration: x%>` |
| `<Armor Red: x%>` | `<Armor Reduction: x%>` |
| `<Magic Pen: x%>` | `<Magic Penetration: x%>` |
| `<Magic Red: x%>` | `<Magic Reduction: x%>` |
| `<Crit Damage Bonus: +x%>` | `<Modify Critical Bonus Damage: +x%>` |
| `<Repeat Targets: x>` | `<Repeat Hits: x>` |

**Recomendacao**: Usar nomes oficiais para consistencia com a documentacao VisuStella.

---

## Apendice B: Prioridade de TP Modes

Do maior para o menor impacto:

1. **`<Force TP Mode>`** (State, Weapon, Armor, Class) - Prevalece sobre tudo
2. **`<Change User/Target TP Mode>`** - Aplica mudanca temporaria
3. **`<TP Mode>`** - Modo base/inicial
4. **`<Starting TP Modes>`** - Lista de disponiveis

Exemplo de interacao:
```
Actor tem <TP Mode: Momentum>
State aplica <Force TP Mode: Furia>
Resultado: Personagem usa Furia (Force tem prioridade)
```

### Observacoes sobre TP Modes
- TP Modes sao criados nos **PARAMETROS DO PLUGIN** (Plugin Manager), nao via notetag
- As notetags apenas atribuem/modificam modos ja existentes
- Cada TP Mode consiste em: General + Gauge + TP Formulas

---

## Apendice C: Variaveis JavaScript Consolidadas

### ATB System

| Tag | Variaveis | Descricao |
|-----|-----------|-----------|
| `<JS ATB After Gauge>` | `user`, `rate` | rate = modificador pos-acao |
| `<JS ATB Charge Gauge>` | `target`, `rate` | rate = modificador de charging |
| `<JS ATB Cast Gauge>` | `target`, `rate` | rate = modificador de casting |

### Battle Core - Critical

| Tag | Variaveis | Descricao |
|-----|-----------|-----------|
| `<JS Critical Rate>` | `rate`, `user`, `target` | rate = taxa final de critico |
| `<JS Critical Rate as User/Target>` | `rate`, `user`, `target` | rate = taxa final (passivo) |
| `<JS Critical Damage>` | `multiplier`, `bonusDamage`, `user`, `target` | multiplier/bonusDamage = dano critico |

### Battle Core - Targeting

| Tag | Variaveis | Descricao |
|-----|-----------|-----------|
| `<JS Accuracy>` | `rate`, `user`, `target` | rate = taxa final de acerto |
| `<JS Accuracy as User/Target>` | `rate`, `user`, `target` | rate = taxa final (passivo) |
| `<JS Targets>` | `targets`, `user`, `target`, `item` | targets = array de alvos validos |

### Variaveis Universais

| Variavel | Tipo | Descricao |
|----------|------|-----------|
| `user` | Game_Battler | Quem esta usando a skill/item |
| `target` | Game_Battler | Quem esta recebendo o hit |
| `rate` | Number | Taxa/modificador (0.0 a 1.0 ou %) |
| `multiplier` | Number | Multiplicador de dano critico |
| `bonusDamage` | Number | Dano bonus adicional do critico |
| `targets` | Array | Container de alvos validos |
| `item` | Object | Skill/item sendo usado |

---

## Apendice E: Auto Trigger - Condicoes Disponiveis

Sintaxe: `<Auto Trigger: condition>` ou `<Auto Trigger x%: condition>`

### 60 Condicoes de Trigger

| Categoria | Condicoes | Descricao |
|-----------|-----------|-----------|
| **Battle Events** | `Battle Start`, `Battle Win`, `Death` | Eventos de batalha |
| **User Actions** | `Attack User`, `Guard User`, `Item User`, `Physical User`, `Magical User`, `Certain Hit User` | Quando o usuario realiza acao |
| **User Actions (Dynamic)** | `Skill Type {name} User`, `Element {name} User` | Quando usuario usa skill type ou elemento especifico |
| **Target Reactions** | `Attack Target`, `Guard Target`, `Item Target`, `Physical Target`, `Magical Target`, `Certain Hit Target` | Quando o usuario e alvo |
| **Target (Dynamic)** | `Skill Type {name} Target`, `Element {name} Target` | Quando e alvo de skill type/elemento |
| **Ally Reactions** | `Attack Ally`, `Guard Ally`, `Item Ally`, `Physical Ally`, `Magical Ally`, `Certain Hit Ally` | Quando e alvo E aliado do battler ativo |
| **Ally (Dynamic)** | `Skill Type {name} Ally`, `Element {name} Ally` | Idem com skill type/elemento |
| **Enemy Reactions** | `Attack Enemy`, `Guard Enemy`, `Item Enemy`, `Physical Enemy`, `Magical Enemy`, `Certain Hit Enemy` | Quando e alvo E inimigo do battler ativo |
| **Enemy (Dynamic)** | `Skill Type {name} Enemy`, `Element {name} Enemy` | Idem com skill type/elemento |
| **Friends (Team)** | `Attack Friends`, `Guard Friends`, `Item Friends`, `Physical Friends`, `Magical Friends`, `Certain Hit Friends` | Quando acao ocorre no time aliado |
| **Friends (Dynamic)** | `Skill Type {name} Friends`, `Element {name} Friends` | Idem com skill type/elemento |
| **Friends Only** | `Attack Friends Only`, `Guard Friends Only`, `Item Friends Only`, `Physical Friends Only`, `Magical Friends Only`, `Certain Hit Friends Only` | Como Friends, mas exclui o proprio usuario |
| **Friends Only (Dynamic)** | `Skill Type {name} Friends Only`, `Element {name} Friends Only` | Idem com skill type/elemento |
| **Opponents** | `Attack Opponents`, `Guard Opponents`, `Item Opponents`, `Physical Opponents`, `Magical Opponents`, `Certain Hit Opponents` | Quando acao ocorre no time opositor |
| **Opponents (Dynamic)** | `Skill Type {name} Opponents`, `Element {name} Opponents` | Idem com skill type/elemento |

### Notas Importantes

- **Ser alvo** = alvo potencial deve ser parte do **escopo original**, independentemente de Action Sequences posteriores
- **Dynamic names**: `{name}` deve ser exatamente o nome do Skill Type ou Element no database (ex: `Element Fire User`)
- **Prevencao de Loop**: Skills com Auto Trigger nao podem triggerar outros Auto Triggers
- **Multiplos Triggers**: Uma skill pode ter varias tags `<Auto Trigger>` — triggera quando QUALQUER condicao e atendida
- **Usabilidade**: A skill deve ser usavel normalmente (MP/TP, cooldowns, etc.)

---

## Apendice F: Battle AI - AI Target Types

Sintaxe: `<AI Target: type>`

### Tipos de Selecao

| Grupo | Tipos Disponiveis |
|-------|-------------------|
| **Basico** | `User`, `First`, `Last` |
| **Level** | `Highest Level`, `Lowest Level` |
| **HP** | `Highest/Lowest MaxHP`, `Highest/Lowest HP`, `Highest/Lowest HP%` |
| **MP** | `Highest/Lowest MaxMP`, `Highest/Lowest MP`, `Highest/Lowest MP%` |
| **TP** | `Highest/Lowest MaxTP`, `Highest/Lowest TP`, `Highest/Lowest TP%` |
| **Parametros Basicos** | `Highest/Lowest ATK`, `Highest/Lowest DEF`, `Highest/Lowest MAT`, `Highest/Lowest MDF`, `Highest/Lowest AGI`, `Highest/Lowest LUK` |
| **Parametros Estendidos** | `Highest/Lowest HIT`, `Highest/Lowest EVA`, `Highest/Lowest CRI`, `Highest/Lowest CEV`, `Highest/Lowest MEV`, `Highest/Lowest MRF`, `Highest/Lowest CNT`, `Highest/Lowest HRG`, `Highest/Lowest MRG`, `Highest/Lowest TRG` |
| **Parametros Especiais** | `Highest/Lowest TGR`, `Highest/Lowest GRD`, `Highest/Lowest REC`, `Highest/Lowest PHA`, `Highest/Lowest MCR`, `Highest/Lowest TCR`, `Highest/Lowest PDR`, `Highest/Lowest MDR`, `Highest/Lowest FDR`, `Highest/Lowest EXR` |
| **State Count** * | `Highest/Lowest State Count`, `Highest/Lowest Positive State Count`, `Highest/Lowest Negative State Count` |

\* **Requer**: VisuMZ_1_SkillsStatesCore

### Casos de Uso Comuns

| Cenario | Tag | Descricao |
|---------|-----|-----------|
| Cura de emergencia | `<AI Target: Lowest HP%>` | Cura o aliado com menor % HP |
| Skill de assassino | `<AI Target: Lowest HP>` | Foca alvo com menor HP (matar) |
| Anti-mago | `<AI Target: Lowest MaxMP>` | Foca alvos com pouco MP |
| Debuff de ataque | `<AI Target: Highest ATK>` | Debuffa o inimigo mais forte |
| Buff de defesa | `<AI Target: Lowest DEF>` | Buffa o aliado mais fragil |
| Remocao de debuffs | `<AI Target: Highest Negative State Count>` | Remove debuffs do mais afetado |

---

## Apendice G: Battle AI - Condicoes de Skills

Usado dentro de `<All AI Conditions>` e `<Any AI Conditions>`

### Operadores de Comparacao

`>=`, `>`, `===`, `!==`, `<`, `<=`

### Valores Possiveis

| Tipo | Exemplos | Descricao |
|------|----------|-----------|
| **Numeros** | `50`, `100`, `1000` | Valores absolutos |
| **Porcentagem** | `50%`, `0.5`, `1.0` | Valores fracionarios |
| **Variavel** | `Variable 5` | Valor da game variable |
| **HP/MP/TP Rate** | `HP%`, `MP%`, `TP%` | % do recurso do alvo |
| **Max Values** | `MaxHP`, `MaxMP`, `MaxTP` | Valores maximos |
| **Level** | `Level` | Nivel (requer CoreEngine para enemies) |
| **Parametros** | `ATK`, `DEF`, `MAT`, `MDF`, `AGI`, `LUK` | Stats base |
| **Buff Stacks** | `ATK Buff Stacks`, `DEF Buff Stacks` | Quantidade de buffs |
| **Debuff Stacks** | `ATK Debuff Stacks`, `DEF Debuff Stacks` | Quantidade de debuffs |
| **Buff/Debuff Turns** | `ATK Buff Turns`, `DEF Debuff Turns` | Turnos restantes |
| **State Turns** | `State 5 Turns`, `State Poison Turns` | Turnos de state |
| **Element Rate** | `Element 3 Rate`, `Fire Element Rate` | Taxa elemental |
| **Team Members** | `Team Alive Members`, `Team Dead Members` | Membros do time |

### Prefixo `user`

Para basear condicoes no **usuario** em vez do alvo, adicione `user` antes:
```
user hp% >= 0.50
user atk buff stacks === 2
user team alive members < 3
```

### Condicoes Especiais

| Condicao | Sintaxe | Descricao |
|----------|---------|-----------|
| Sempre valida | `Always` | Sempre verdadeiro |
| Chance | `50% Chance` | X% de chance de ser valida |
| Switch ON | `Switch 5 On` | Switch 5 esta ligada |
| Switch OFF | `Switch 10 Off` | Switch 10 esta desligada |
| Usuario e Actor | `User is Actor` | Usuario e um ator |
| Usuario e Enemy | `User is Enemy` | Usuario e um inimigo |
| Alvo e Actor | `Target is Actor` | Alvo e um ator |
| Alvo e Enemy | `Target is Enemy` | Alvo e um inimigo |
| Tem State | `User Has State 5` / `Target Has State Poison` | Tem o state |
| Nao tem State | `User Not State Burn` / `Target Not State 10` | Nao tem o state |
| Tem Buff | `User Has ATK Buff` / `Target Has DEF Debuff` | Tem buff/debuff do param |
| Nao tem Buff | `User Not MAT Buff` / `Target Not AGI Debuff` | Nao tem buff/debuff |
| Tem Max Buff | `User Has ATK Max Buff` / `Target Has DEF Max Debuff` | Buff/debuff no maximo |

### Condicoes JavaScript

Se nenhuma palavra-chave corresponder, o valor e interpretado como JavaScript. **Obrigatorio** usar operadores de comparacao.

```
$gameSwitches.value(5) === true
$gameParty.hasItem($dataItems[10]) === true
```

> **Nao funciona**: `$gameTroop.turnCount()`, `user.turnCount()`, `target.turnCount()` — use o editor de acoes do RPG Maker para condicoes de turno.
