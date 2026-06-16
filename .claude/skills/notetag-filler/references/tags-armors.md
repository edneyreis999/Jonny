# Tags - Armors

**Entidade**: Armor (armaduras)
**Plugins**: VisuStella MZ Enhanced TP System, Battle Core, Life State Effects, Skills & States Core

---

## Enhanced TP System

### `<Force TP Mode: name>`
- **Escopo**: Armor
- **Descricao**: Forca um modo de TP especifico quando equipado
- **Sintaxe**: `<Force TP Mode: NomeDoModo>`
- **Exemplo**: `"note": "<Force TP Mode: Guarda Fortificada>"`

### `<Max TP: formula>`
- **Escopo**: Armor
- **Descricao**: Modifica o TP maximo quando equipado
- **Sintaxe**: `<Max TP: formula>`

### `<TCR Multiplier: x%>`
- **Escopo**: Armor
- **Descricao**: Modifica o ganho de TP quando equipado
- **Sintaxe**: `<TCR Multiplier: 1.2>`

---

## Battle Core

### `<Armor Reduction: x%>`
- **Escopo**: Armor
- **Descricao**: Reduz propria DEF quando equipado (trade-off)
- **Sintaxe**: `<Armor Reduction: 10%>`
- **Alias**: `<Armor Red: x%>`
- **Observacoes**: Reduz DEF de quem equipa, nao do alvo

---

## Battle Core - Tags Comuns

Armors compartilham as seguintes tags com Actors (mesma sintaxe e comportamento):

**Penetracao**: Armor/Magic Penetration, Armor/Magic Reduction
**Critical**: Modify Critical Rate (passivo)
**Life Steal**: HP/MP Life Steal por hit type (6 tags), Guard/Disarm/Negative Life Steal (9 tags)
**Damage**: Damage Cap, Bypass Damage Cap, Bypass Soft Damage Cap, Soft Damage Cap
**JavaScript**: JS Critical Rate as User/Target, JS Accuracy as User/Target

Documentacao completa em `references/tags-actors.md`

---

## Life State Effects - Trait Objects

Armors compartilham as tags de Life State Effects com Actors:

**Curse**: Curse HP, Curse MP, Curse TP
**Mechanics**: Fragile, Guts, Undead, Allow Undead Regen

Documentacao completa em `references/tags-actors.md` secao "Life State Effects - Trait Objects"

---

## Skills & States Core - Tags Comuns

Armors compartilham as seguintes tags com Actors (mesma sintaxe e comportamento):

**Modificadores de Custo**: type Cost (+x/-x/x%), Item Cost modifiers, Replace Item/Weapon/Armor Cost
**State Interactions**: Bypass State Damage Removal as Attacker/Target, Resist State Category
**Passive States**: Passive State
**Aura/Miasma**: Aura State, Miasma State, Not User Aura, Allow Dead Aura/Miasma, Dead Aura/Miasma Only

Documentacao completa em `references/tags-actors.md`
