# Tags - Enemies

**Entidade**: Enemy (inimigos e bosses)
**Plugins**: VisuStella MZ Enhanced TP System, ATB, Battle Core, Battle AI, Life State Effects, Skills & States Core

---

## Enhanced TP System

### `<TP Mode: name>`
- **Escopo**: Enemy
- Documentacao completa em `references/tags-actors.md` secao "Enhanced TP System"

### `<Max TP: formula>`
- **Escopo**: Enemy
- **Exemplos**:
  - Valor fixo: `<Max TP: 100>`
  - Baseado em parametro: `<Max TP: 100 + enemy.atk * 2>`

### `<TCR Multiplier: x%>`
- **Escopo**: Enemy
- Documentacao completa em `references/tags-actors.md` secao "Enhanced TP System"

### `<Preserve TP>`
- **Escopo**: Enemy
- **Observacoes**: Raro para enemies
- Documentacao completa em `references/tags-actors.md` secao "Enhanced TP System"

---

## ATB System

Mesmas tags de Actor: `<ATB Battle Start Gauge: +/-%>`, `<Hide ATB Gauge>`

Documentacao completa em `references/tags-actors.md` secao "ATB System"

---

## Battle Core - Popup (Exclusivo de Enemies)

### `<Popup Position: Head>` / `<Popup Position: Center>` / `<Popup Position: Base>`
- **Escopo**: Enemy (apenas)
- **Descricao**: Determina a posicao inicial do popup de dano
- **Sintaxe**: `<Popup Position: Head>`
- **Opcoes**: Head (topo), Center (centro), Base (base)

### `<Popup Offset X: +x>` / `<Popup Offset X: -x>`
- **Escopo**: Enemy (apenas)
- **Descricao**: Altera o offset horizontal do popup
- **Sintaxe**: `<Popup Offset X: +50>` ou `<Popup Offset X: -30>`
- **Observacoes**: Negativo = esquerda, Positivo = direita

### `<Popup Offset Y: +y>` / `<Popup Offset Y: -y>`
- **Escopo**: Enemy (apenas)
- **Descricao**: Altera o offset vertical do popup
- **Sintaxe**: `<Popup Offset Y: +20>` ou `<Popup Offset Y: -15>`
- **Observacoes**: Negativo = cima, Positivo = baixo

---

## Battle Core - Tags Comuns

Enemies compartilham as seguintes tags com Actors (mesma sintaxe e comportamento):

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
- Documentacao completa em `references/tags-classes.md` secao "Battle AI"

### `<AI Level: x>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- Documentacao completa em `references/tags-actors.md` secao "Battle AI"

### `<AI Rating Variance: x>`
- **Escopo**: Actor, Enemy
- **Plugin**: Battle AI
- Documentacao completa em `references/tags-actors.md` secao "Battle AI"

---

## Battle AI - TGR Weight Influence

Enemies compartilham as 10 tags de TGR Weight Influence com Actors (mesma sintaxe e comportamento):

**Influence**: AI Element Rate/EVA/MEV/PDR/MDR Influence
**Bypass**: Bypass AI Element Rate/EVA/MEV/PDR/MDR Influence

Documentacao completa em `references/tags-actors.md` secao "Battle AI - TGR Weight Influence"

---

## Life State Effects - Enemy Only

### `<Death Transform>`
- **Escopo**: Enemy (apenas)
- **Plugin**: Life State Effects
- **Descricao**: Transforma em outro enemy ao morrer, com sistema de pesos para probabilidade
- **Sintaxe**:
  ```
  <Death Transform>
  EnemyName: weight
  EnemyName: weight
  </Death Transform>
  ```
- **Exemplos**:
  - Transformacao unica: `<Death Transform>\nSlime\n</Death Transform>`
  - Com pesos: `<Death Transform>\nSlime: 75\nGoblin: 25\n</Death Transform>`
- **Observacoes**: Novo enemy aparece com HP/MP completos. States resetam. Nome deve ser exato do database.

### `<Transform Animation: x>`
- **Escopo**: Enemy (apenas)
- **Plugin**: Life State Effects
- **Descricao**: Toca animacao ao ocorrer transformacao (vai no ALVO da transformacao, nao no original)
- **Sintaxe**: `<Transform Animation: 45>`
- **Requisitos**: VisuMZ_0_CoreEngine deve estar instalado
- **Observacoes**: Notetag vai no enemy ALVO, nao no enemy original com Death Transform

---

## Life State Effects - Trait Objects

Enemies compartilham as tags de Life State Effects com Actors (mesma sintaxe e comportamento):

**Curse**: Curse HP, Curse MP, Curse TP
**Mechanics**: Fragile, Guts, Undead, Allow Undead Regen

Documentacao completa em `references/tags-actors.md` secao "Life State Effects - Trait Objects"

---

## Skills & States Core - Tags Comuns

Enemies compartilham as seguintes tags com Actors (mesma sintaxe e comportamento):

**Modificadores de Custo**: type Cost (+x/-x/x%), Item Cost modifiers, Replace Item/Weapon/Armor Cost
**State Interactions**: Bypass State Damage Removal as Attacker/Target, Resist State Category
**Passive States**: Passive State
**Aura/Miasma**: Aura State, Miasma State, Not User Aura, Allow Dead Aura/Miasma, Dead Aura/Miasma Only

Documentacao completa em `references/tags-actors.md`
