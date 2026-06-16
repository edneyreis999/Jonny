# Tags - Actors (Fonte Canonica)

**Entidade**: Actor (personagem jogavel)
**Plugins**: VisuStella MZ Battle Core, ATB, Enhanced TP System, Battle AI, Life State Effects, Skills & States Core

> Actors e a **fonte canonica** para tags compartilhadas. Outras entidades (Classes, Enemies, Weapons, Armors, States) referenciam esta secao para documentacao completa de tags compartilhadas.

---

## Indice

| Seção | Conteudo |
|-------|----------|
| Enhanced TP System | TP Mode, Starting TP Modes, Max TP, Preserve TP, TCR Multiplier |
| ATB System | Battle Start Gauge, Hide ATB Gauge |
| Battle Core - Penetracao | Armor/Magic Penetration e Reduction |

| Battle Core - Life Steal (Passivo) | HP/MP Life Steal por hit type, Guard/Disarm/Negative |
| Battle Core - Damage | Damage Cap, Bypass, Soft Cap |
| Battle Core - JavaScript (Passivo) | JS Critical/Accuracy as User/Target |
| Battle AI - Configuracao | AI Level, AI Rating Variance |
| Battle AI - TGR Weight Influence | Influence e Bypass AI targeting |
| Life State Effects - Trait Objects | Curse HP/MP/TP, Fragile, Guts, Undead, Allow Undead Regen |
| Skills & States Core - Modificadores de Custo | type Cost (+x/-x/x%), Item/Weapon/Armor Cost |
| Skills & States Core - State Interactions | Bypass State Damage Removal, Resist State Category |
| Skills & States Core - Passive States | Passive State |
| Skills & States Core - Aura & Miasma | Aura/Miasma State, Not User Aura, Dead variants |

---

## Enhanced TP System

### `<TP Mode: name>`
- **Escopo**: Actor, Enemy
- **Descricao**: Define o modo de TP inicial do battler
- **Sintaxe**: `<TP Mode: NomeDoModo>`
- **Exemplo**: `"note": "<TP Mode: Momentum>"`
- **Observacoes**: O modo deve ser criado previamente nos parametros do plugin Enhanced TP System

### `<Starting TP Modes>`
- **Escopo**: Actor (apenas)
- **Descricao**: Define uma lista de modos de TP selecionaveis (multiplos)
- **Sintaxe**:
  ```
  <Starting TP Modes>
  Modo1
  Modo2
  </Starting TP Modes>
  ```
- **Exemplo**: `"note": "<Starting TP Modes>\nMomentum\nGuarda\nFrenesi\n</Starting TP Modes>"`
- **Observacoes**: Diferente de `<TP Mode>` que define apenas um modo inicial

### `<Max TP: formula>`
- **Escopo**: Actor, Class, Enemy, Weapon, Armor, State
- **Descricao**: Define o TP maximo usando uma formula JavaScript
- **Sintaxe**: `<Max TP: formula>`
- **Exemplos**:
  - Valor fixo: `<Max TP: 100>`
  - Baseado em nivel: `<Max TP: 50 + user.level * 10>`
  - Baseado em atributo: `<Max TP: 100 + user.atk * 2>`
  - Baseado em HP: `<Max TP: user.mhp * 0.5>`

### `<Preserve TP>`
- **Escopo**: Actor, Enemy
- **Descricao**: Preserva TP entre batalhas
- **Sintaxe**: `<Preserve TP>`

### `<TCR Multiplier: x%>`
- **Escopo**: Actor, Class, Weapon, Armor, Enemy, State
- **Descricao**: Multiplicador de ganho de TP (1.0 = normal, 1.2 = +20%)
- **Sintaxe**: `<TCR Multiplier: 1.2>`
- **Exemplos**:
  - Filena: `<TCR Multiplier: 1.2>` (+20% ganho)
  - Mhordred: `<TCR Multiplier: 1.5>` (+50% ganho)

---

## ATB System

### `<ATB Battle Start Gauge: +x%>` / `<ATB Battle Start Gauge: -x%>`
- **Escopo**: Actor, Enemy
- **Descricao**: Modificador do gauge inicial de combate
- **Sintaxe**: `<ATB Battle Start Gauge: +25%>` ou `<ATB Battle Start Gauge: -15%>`
- **Exemplo**: `"note": "<ATB Battle Start Gauge: +25%>"`
- **Observacoes**: Stack aditivamente com outros modificadores

### `<Hide ATB Gauge>`
- **Escopo**: Actor, Enemy
- **Descricao**: Oculta o gauge de ATB do battler
- **Sintaxe**: `<Hide ATB Gauge>`

---

## Battle Core - Penetracao

### `<Armor Penetration: x%>`
- **Escopo**: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State
- **Descricao**: Ignora % da DEF do alvo
- **Sintaxe**: `<Armor Penetration: 30%>`
- **Alias**: `<Armor Pen: x%>`
- **Exemplo**: `"note": "<Armor Penetration: 50%>"`
- **Observacoes**: Stack multiplicativamente com outras fontes

### `<Magic Penetration: x%>`
- **Escopo**: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State
- **Descricao**: Ignora % da MDF do alvo
- **Sintaxe**: `<Magic Penetration: 30%>`
- **Alias**: `<Magic Pen: x%>`

### `<Armor Reduction: x%>`
- **Escopo**: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State
- **Descricao**: Reduz propria DEF (sacrificio)
- **Sintaxe**: `<Armor Reduction: 20%>`
- **Alias**: `<Armor Red: x%>`
- **Observacoes**: NAO usa para debuffar alvo, reduz propria defesa

### `<Magic Reduction: x%>`
- **Escopo**: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State
- **Descricao**: Reduz propria MDF (sacrificio)
- **Sintaxe**: `<Magic Reduction: 20%>`
- **Alias**: `<Magic Red: x%>`

---

## Battle Core - Life Steal (Passivo)

### `<HP Life Steal Certain Hit: +x%>` / `<HP Life Steal Certain Hit: -x%>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: Life steal passivo para "Certain Hit" skills
- **Sintaxe**: `<HP Life Steal Certain Hit: +15%>`
- **Observacoes**: Stack aditivamente com outros trait objects

### `<HP Life Steal Physical Hit: +x%>` / `<HP Life Steal Physical Hit: -x%>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: Life steal passivo para "Physical" skills
- **Sintaxe**: `<HP Life Steal Physical Hit: +20%>`

### `<HP Life Steal Magical Hit: +x%>` / `<HP Life Steal Magical Hit: -x%>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: Life steal passivo para "Magical" skills
- **Sintaxe**: `<HP Life Steal Magical Hit: +10%>`

### `<MP Life Steal Certain Hit: +x%>` / `<MP Life Steal Certain Hit: -x%>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: MP steal passivo para "Certain Hit" skills
- **Sintaxe**: `<MP Life Steal Certain Hit: +15%>`

### `<MP Life Steal Physical Hit: +x%>` / `<MP Life Steal Physical Hit: -x%>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: MP steal passivo para "Physical" skills
- **Sintaxe**: `<MP Life Steal Physical Hit: +20%>`

### `<MP Life Steal Magical Hit: +x%>` / `<MP Life Steal Magical Hit: -x%>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: MP steal passivo para "Magical" skills
- **Sintaxe**: `<MP Life Steal Magical Hit: +10%>`

### `<Guard Life Steal>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: Protege contra Life Steal (quem tem esta tag nao sofre life steal)
- **Sintaxe**: `<Guard Life Steal>`

### `<Guard HP Life Steal>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: Previne HP Life Steal contra este battler
- **Sintaxe**: `<Guard HP Life Steal>`

### `<Guard MP Life Steal>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: Previne MP Life Steal contra este battler
- **Sintaxe**: `<Guard MP Life Steal>`

### `<Disarm Life Steal>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: Battler nao pode usar HP/MP Life Steal
- **Sintaxe**: `<Disarm Life Steal>`
- **Observacoes**: Skills com innate Life Steal podem ser usadas, mas o efeito nao funciona

### `<Disarm HP Life Steal>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: Battler nao pode usar HP Life Steal
- **Sintaxe**: `<Disarm HP Life Steal>`

### `<Disarm MP Life Steal>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: Battler nao pode usar MP Life Steal
- **Sintaxe**: `<Disarm MP Life Steal>`

### `<Negative Life Steal>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: Inverte healing properties de Life Steal
- **Sintaxe**: `<Negative Life Steal>`
- **Observacoes**: Causa dano ao usuario do Life Steal em vez de curar

### `<Negative HP Life Steal>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: Inverte HP Life Steal effects
- **Sintaxe**: `<Negative HP Life Steal>`

### `<Negative MP Life Steal>`
- **Escopo**: Actor, Class, Armor, Enemy, State
- **Descricao**: Inverte MP Life Steal effects
- **Sintaxe**: `<Negative MP Life Steal>`

---

## Battle Core - Damage

### `<Damage Cap: x>`
- **Escopo**: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State
- **Descricao**: Define limite maximo de dano
- **Sintaxe**: `<Damage Cap: 9999>`
- **Exemplo**: `"note": "<Damage Cap: 9999>"`
- **Observacoes**: Se usado em trait objects, aumenta o cap da unidade afetada

### `<Bypass Damage Cap>`
- **Escopo**: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State
- **Descricao**: O dano nunca sera limitado por um cap maximo
- **Sintaxe**: `<Bypass Damage Cap>`

### `<Bypass Soft Damage Cap>`
- **Escopo**: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State
- **Descricao**: O dano nunca sera reduzido pelo soft cap
- **Sintaxe**: `<Bypass Soft Damage Cap>`

### `<Soft Damage Cap: +x%>` / `<Soft Damage Cap: -x%>`
- **Escopo**: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State
- **Descricao**: Aumenta/diminui o soft cap por x%
- **Sintaxe**: `<Soft Damage Cap: +20%>` ou `<Soft Damage Cap: -10%>`
- **Observacoes**: x% e um valor percentual do hard cap

---

## Battle Core - JavaScript (Passivo)

### `<JS Critical Rate as User>` / `<JS Critical Rate as Target>`
- **Escopo**: Actor, Class, Weapon, Armor, Enemy, State
- **Descricao**: Determina a taxa de critico via JavaScript (passivo)
- **Sintaxe**:
  ```
  <JS Critical Rate as User>
  rate = code;
  </JS Critical Rate as User>
  ```
- **Variaveis**: `rate`, `user`, `target`

### `<JS Accuracy as User>` / `<JS Accuracy as Target>`
- **Escopo**: Actor, Class, Weapon, Armor, Enemy, State
- **Descricao**: Determina a taxa de acerto via JavaScript (passivo)
- **Sintaxe**:
  ```
  <JS Accuracy as User>
  rate = code;
  </JS Accuracy as User>
  ```
- **Variaveis**: `rate`, `user`, `target`

---

## Battle AI - Configuracao

### `<AI Level: x>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- **Descricao**: Define o nivel de inteligencia da IA (0-100). Niveis mais altos = mais estritos sobre condicoes.
- **Sintaxe**: `<AI Level: 100>`
- **Exemplos**:
  - `<AI Level: 100>` — Nunca desobedece condicoes
  - `<AI Level: 50>` — Moderado
  - `<AI Level: 0>` — Praticamente ignora condicoes
- **Observacoes**: Nao afeta styles Casual e Random

### `<AI Rating Variance: x>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- **Descricao**: Quantidade de variancia ao determinar acoes por rating (0-9)
- **Sintaxe**: `<AI Rating Variance: 3>`
- **Observacoes**: Apenas afeta o estilo Classic. Ratings podem variar ate X niveis abaixo do original.

---

## Battle AI - TGR Weight Influence

### `<AI Element Rate Influence: x.x>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- **Descricao**: Define quanta influencia de peso TGR e dada baseado na taxa element
- **Sintaxe**: `<AI Element Rate Influence: 1.5>`
- **Observacoes**: Quanto maior o dano elemental recebido, mais o peso TGR aumenta

### `<Bypass AI Element Rate Influence>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- **Descricao**: Nao considera taxas elementais ao calcular pesos TGR
- **Sintaxe**: `<Bypass AI Element Rate Influence>`

### `<AI EVA Influence: x.x>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- **Descricao**: Influencia de peso TGR baseado na taxa EVA (Esquiva Fisica)
- **Sintaxe**: `<AI EVA Influence: 1.0>`
- **Observacoes**: Quanto maior a esquiva fisica do alvo, menor o peso TGR

### `<Bypass AI EVA Influence>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- **Descricao**: Nao considera taxas EVA ao calcular pesos TGR
- **Sintaxe**: `<Bypass AI EVA Influence>`

### `<AI MEV Influence: x.x>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- **Descricao**: Influencia de peso TGR baseado na taxa MEV (Esquiva Magica)
- **Sintaxe**: `<AI MEV Influence: 1.0>`

### `<Bypass AI MEV Influence>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- **Descricao**: Nao considera taxas MEV ao calcular pesos TGR
- **Sintaxe**: `<Bypass AI MEV Influence>`

### `<AI PDR Influence: x.x>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- **Descricao**: Influencia de peso TGR baseado na taxa PDR (Physical Damage Rate)
- **Sintaxe**: `<AI PDR Influence: 1.0>`

### `<Bypass AI PDR Influence>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- **Descricao**: Nao considera taxas PDR ao calcular pesos TGR
- **Sintaxe**: `<Bypass AI PDR Influence>`

### `<AI MDR Influence: x.x>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- **Descricao**: Influencia de peso TGR baseado na taxa MDR (Magical Damage Rate)
- **Sintaxe**: `<AI MDR Influence: 1.0>`

### `<Bypass AI MDR Influence>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- **Descricao**: Nao considera taxas MDR ao calcular pesos TGR
- **Sintaxe**: `<Bypass AI MDR Influence>`

---

## Life State Effects - Trait Objects

### `<Curse HP>` / `<Curse MP>` / `<Curse TP>`
- **Escopo**: Actor, Class, Skill, Weapon, Armor, Enemy, State
- **Plugin**: Life State Effects
- **Descricao**: Bloqueia recuperacao de HP/MP/TP
- **Sintaxe**: `<Curse HP>` ou `<Curse MP>` ou `<Curse TP>`
- **Observacoes**: Cura visual pode aparecer mas nao recupera. Pode ser combinado (Curse HP + Curse MP).

### `<Fragile>`
- **Escopo**: Actor, Class, Skill, Weapon, Armor, Enemy, State
- **Plugin**: Life State Effects
- **Descricao**: Battler morre instantaneamente ao receber qualquer dano direto de HP
- **Sintaxe**: `<Fragile>`
- **Observacoes**: Dano de eventos, regeneracao e DoT NAO acionam Fragile. Apenas ataques fisicos/magicos/skills/items.

### `<Guts>`
- **Escopo**: Actor, Class, Skill, Weapon, Armor, Enemy, State
- **Plugin**: Life State Effects
- **Descricao**: Dano fatal e reduzido para deixar 1 HP (sobrevive)
- **Sintaxe**: `<Guts>`
- **Observacoes**: Se battler ja estiver com 1 HP, efeito nao ativa e morre normalmente

### `<Undead>`
- **Escopo**: Actor, Class, Skill, Weapon, Armor, Enemy, State
- **Plugin**: Life State Effects
- **Descricao**: Inverte cura/dano: cura causa dano, morte cura com HP cheio, drain invertido
- **Sintaxe**: `<Undead>`
- **Observacoes**: Se battler absorve elemento, ataques daquele elemento curam normalmente

### `<Allow Undead Regen>`
- **Escopo**: Actor, Class, Skill, Weapon, Armor, Enemy, State
- **Plugin**: Life State Effects
- **Descricao**: Override para Undead: permite que regeneracao cure em vez de causar dano
- **Sintaxe**: `<Allow Undead Regen>`

---

## Skills & States Core - Modificadores de Custo

### `<type Cost: +x>` / `<type Cost: -x>` / `<type Cost: x%>`
- **Escopo**: Actor, Class, Weapon, Armor, Enemy, State
- **Plugin**: Skills & States Core
- **Descricao**: Modifica custo de skills que usam o tipo de recurso especificado. `%` e aplicado ANTES de `+/-`. `+/-` e flat value aplicado DEPOIS de `%`.
- **Sintaxe**: `<HP Cost: +20>` ou `<MP Cost: -10>` ou `<Gold Cost: 50%>`
- **Exemplos**:
  - `<HP Cost: +20>` — Aumenta custo HP em 20
  - `<MP Cost: -10>` — Reduz custo MP em 10
  - `<Gold Cost: 50%>` — Custo Gold fica em 50% do original
- **Observacoes**: `type` = HP, MP, TP, Gold, Potion ou qualquer custom Skill Cost Type

### `<Item Cost: +x/-x/x% name>` / `<Weapon Cost: +x/-x/x% name>` / `<Armor Cost: +x/-x/x% name>`
- **Escopo**: Actor, Class, Weapon, Armor, Enemy, State
- **Plugin**: Skills & States Core
- **Descricao**: Modifica custo de itens/armas/armaduras de skills
- **Sintaxe**: `<Item Cost: +1 Magic Water>` ou `<Weapon Cost: 50% Short Sword>` ou `<Armor Cost: 200% Cloth Armor>`
- **Observacoes**: `%` aplicado antes de `+/-`

### `<Replace Item name1 Cost: name2>` / `<Replace Weapon name1 Cost: name2>` / `<Replace Armor name1 Cost: name2>`
- **Escopo**: Actor, Class, Weapon, Armor, Enemy, State
- **Plugin**: Skills & States Core
- **Descricao**: Redireciona consumo: em vez de `name1`, consome `name2`
- **Sintaxe**: `<Replace Item Magic Water Cost: Potion>`
- **Exemplo**: `"note": "<Replace Item Magic Water Cost: Potion>"`

---

## Skills & States Core - State Interactions

### `<Bypass State Damage Removal as Attacker: id>`
- **Escopo**: Actor, Class, Weapon, Armor, Enemy, State
- **Plugin**: Skills & States Core
- **Descricao**: O atacante com este trait nao remove o state ao atacar (bypass de "Remove by Damage")
- **Sintaxe**: `<Bypass State Damage Removal as Attacker: id>` ou `<Bypass State Damage Removal as Attacker: name>`
- **Exemplo**: `"note": "<Bypass State Damage Removal as Attacker: Sleep>"`
- **Observacoes**: Permite ataques sem remover states como Sleep

### `<Bypass State Damage Removal as Target: id>`
- **Escopo**: Actor, Class, Weapon, Armor, Enemy, State
- **Plugin**: Skills & States Core
- **Descricao**: O alvo com este trait mantem o state mesmo ao receber dano
- **Sintaxe**: `<Bypass State Damage Removal as Target: id>` ou `<Bypass State Damage Removal as Target: name>`
- **Exemplo**: `"note": "<Bypass State Damage Removal as Target: 9>"`

### `<Resist State Category: name>`
- **Escopo**: Actor, Class, Weapon, Armor, Enemy, State
- **Plugin**: Skills & States Core
- **Descricao**: O battler resiste a todos os states da categoria listada
- **Sintaxe**: `<Resist State Category: name>` ou `<Resist State Categories: name, name, name>`
- **Exemplo**: `"note": "<Resist State Category: Poison>"`
- **Observacoes**: Funciona como state resistance padrao. Se o state ja estava aplicado ANTES de obter a resistencia, ele permanece

---

## Skills & States Core - Passive States

### `<Passive State: x>`
- **Escopo**: Actor, Class, Skill, Weapon, Armor, Enemy
- **Plugin**: Skills & States Core
- **Descricao**: Aplica passive state(s) ao actor/enemy relacionado
- **Sintaxe**: `<Passive State: x>` ou `<Passive States: x,x,x>` ou `<Passive State: name>`
- **Exemplos**:
  - `"note": "<Passive State: 25>"` — Por ID
  - `"note": "<Passive States: 10, 15, 20>"` — Multiplos por ID
  - `"note": "<Passive State: Paladino>"` — Por nome
- **Observacoes**: Se aplicando via skill, deve ser uma skill **aprendida** (nao via trait)

---

## Skills & States Core - Aura & Miasma

### `<Aura State: x>`
- **Escopo**: Actor, Class, Skill, Weapon, Armor, Enemy
- **Plugin**: Skills & States Core
- **Descricao**: Emite aura que afeta **aliados** com passive state(s) `x`. Apenas uma fonte necessaria para afetar todo o party.
- **Sintaxe**: `<Aura State: x>` ou `<Aura States: x,x,x>` ou `<Aura State: name>`
- **Exemplos**:
  - `"note": "<Aura State: 25>"` — Aura do State ID 25
  - `"note": "<Aura States: 10, 15>"` — Multiplas auras
- **Observacoes**: Se via skill, deve ser skill **aprendida** (nao via trait)

### `<Miasma State: x>`
- **Escopo**: Actor, Class, Skill, Weapon, Armor, Enemy
- **Plugin**: Skills & States Core
- **Descricao**: Emite miasma que afeta **oponentes** com passive state(s) `x`
- **Sintaxe**: `<Miasma State: x>` ou `<Miasma States: x,x,x>` ou `<Miasma State: name>`
- **Exemplo**: `"note": "<Miasma State: 10>"`
- **Observacoes**: **NAO aplica fora de batalha**

### `<Not User Aura>`
- **Escopo**: Actor, Class, Skill, Weapon, Armor, Enemy, State
- **Plugin**: Skills & States Core
- **Descricao**: Previne que o emissor seja afetado pela propria aura/miasma
- **Sintaxe**: `<Not User Aura>` ou `<Aura Not For User>`
- **Exemplo**: `"note": "<Aura State: 30>\n<Not User Aura>"`

### `<Allow Dead Aura>` / `<Allow Dead Miasma>`
- **Escopo**: Actor, Class, Skill, Weapon, Armor, Enemy, State
- **Plugin**: Skills & States Core
- **Descricao**: Permite aura/miasma continuar emitindo mesmo com o emissor **morto**
- **Sintaxe**: `<Allow Dead Aura>` ou `<Allow Dead Miasma>`
- **Observacoes**: Tem prioridade sobre `<Dead Aura/Miasma Only>`

### `<Dead Aura Only>` / `<Dead Miasma Only>`
- **Escopo**: Actor, Class, Skill, Weapon, Armor, Enemy, State
- **Plugin**: Skills & States Core
- **Descricao**: Aura/miasma **so emite** se o emissor esta **morto**
- **Sintaxe**: `<Dead Aura Only>` ou `<Dead Miasma Only>`
- **Exemplo**: `"note": "<Aura State: 45>\n<Dead Aura Only>"`
