# Tags - Classes

**Entidade**: Class (classes de personagens)
**Plugins**: VisuStella MZ Enhanced TP System, ATB, Battle Core, Battle AI, Life State Effects, Skills & States Core

---

## Enhanced TP System

### `<Force TP Mode: name>`
- **Escopo**: Class, Weapon, Armor, State
- **Descricao**: Forca um modo de TP especifico para todos os Actors desta classe
- **Sintaxe**: `<Force TP Mode: NomeDoModo>`
- **Exemplo**: `"note": "<Force TP Mode: Guarda Fortificada>"`
- **Observacoes**: Prevalece sobre `<TP Mode>` do Actor

### `<Max TP: formula>`
- **Escopo**: Class
- Documentacao completa em `references/tags-actors.md` secao "Enhanced TP System"

### `<TCR Multiplier: x%>`
- **Escopo**: Class
- Documentacao completa em `references/tags-actors.md` secao "Enhanced TP System"

---

## ATB System

Mesmas tags de Actor: `<ATB Battle Start Gauge: +/-%>`, `<Hide ATB Gauge>`

Documentacao completa em `references/tags-actors.md` secao "ATB System"

---

## Battle Core - Tags Comuns

Classes compartilham as seguintes tags com Actors (mesma sintaxe e comportamento):

**Penetracao**: Armor/Magic Penetration, Armor/Magic Reduction
**Critical**: Modify Critical Rate (passivo)
**Life Steal**: HP/MP Life Steal por hit type (6 tags), Guard/Disarm/Negative Life Steal (9 tags)
**Damage**: Damage Cap, Bypass Damage Cap, Bypass Soft Damage Cap, Soft Damage Cap
**JavaScript**: JS Critical Rate as User/Target, JS Accuracy as User/Target

Documentacao completa em `references/tags-actors.md`

---

## Battle AI - Configuracao

### `<AI Style: x>`
- **Escopo**: Class, Enemy
- **Plugin**: Battle AI
- **Descricao**: Define o estilo de IA usado pela unidade
- **Sintaxe**: `<AI Style: Classic>`
- **Opcoes**: `Classic` (ratings), `Gambit` (prioridade top-down), `Casual` (condicoes apenas), `Random` (aleatorio)
- **Observacoes**: Para atores, colocar na classe associada. Requer Auto Battle trait + AI referenciada.

### `<Reference AI: Enemy id>` / `<Reference AI: name>`
- **Escopo**: Class
- **Plugin**: Battle AI
- **Descricao**: Faz atores com Auto Battle usarem padrao de ataque de um inimigo especifico
- **Sintaxe**: `<Reference AI: Enemy 5>` ou `<Reference AI: Goblin>`
- **Observacoes**: Atores so podem usar skills que ja aprenderam, com tipo de skill disponivel e recursos suficientes

### `<No Reference AI>`
- **Escopo**: Class
- **Plugin**: Battle AI
- **Descricao**: Previne a classe de usar qualquer inimigo como AI referenciado
- **Sintaxe**: `<No Reference AI>`

---

## Life State Effects - Trait Objects

Classes compartilham as tags de Life State Effects com Actors (mesma sintaxe e comportamento):

**Curse**: Curse HP, Curse MP, Curse TP
**Mechanics**: Fragile, Guts, Undead, Allow Undead Regen

Documentacao completa em `references/tags-actors.md` secao "Life State Effects - Trait Objects"

---

## Skills & States Core - Gauge Replacement (Exclusivo)

### `<Replace HP Gauge: type>` / `<Replace MP Gauge: type>` / `<Replace TP Gauge: type>`
- **Escopo**: Class (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Substitui o gauge HP (1o), MP (2o) ou TP (3o) por outro Skill Cost Type
- **Sintaxe**: `<Replace MP Gauge: Gold>` ou `<Replace TP Gauge: none>`
- **Exemplos**:
  - `"note": "<Replace MP Gauge: Gold>"` — Gauge MP vira Gold
  - `"note": "<Replace TP Gauge: none>"` — Remove gauge TP
- **Observacoes**:
  - `type` = resource type (HP, MP, TP, Gold, Potion, etc.)
  - `none` para nao exibir gauge nenhum
  - **NAO funciona** com 'Item Cost', 'Weapon Cost' ou 'Armor Cost'
  - `<Replace TP Gauge>` requer 'Display TP in Window' ON no Database > System 1

---

## Skills & States Core - Tags Comuns

Classes compartilham as seguintes tags com Actors (mesma sintaxe e comportamento):

**Modificadores de Custo**: type Cost (+x/-x/x%), Item Cost modifiers, Replace Item/Weapon/Armor Cost
**State Interactions**: Bypass State Damage Removal as Attacker/Target, Resist State Category
**Passive States**: Passive State
**Aura/Miasma**: Aura State, Miasma State, Not User Aura, Allow Dead Aura/Miasma, Dead Aura/Miasma Only

Documentacao completa em `references/tags-actors.md`
