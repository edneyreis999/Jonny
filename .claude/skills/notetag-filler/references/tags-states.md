# Tags - States

**Entidade**: State (estados/condicoes)
**Plugins**: VisuStella MZ Enhanced TP System, Battle Core, Auto Skill Trigger, Life State Effects, Skills & States Core, Coreto TpEvents

---

## Indice

| Seção | Conteudo |
|-------|----------|
| Enhanced TP System | Force TP Mode, Max TP, TCR Multiplier |
| Battle Core - Tags Comuns | Penetracao, Critical, Life Steal, Damage (cross-ref actors) |
| Auto Skill Trigger | No Auto Skill Trigger |
| Life State Effects - State Only | Auto Life, Doom, Extinct |
| Life State Effects - Trait Objects | Curse, Fragile, Guts, Undead (cross-ref actors) |
| Skills & States Core - Remocao Especial | No Death Clear, No Recover All Clear, Group Defeat |
| Skills & States Core - Reapply Rules | Ignore, Reset, Greater, Add |
| Skills & States Core - Categorias | Positive/Negative State, Category |
| Skills & States Core - Display de Turnos | Hide State Turns, Turn Color, Max Turns |
| Skills & States Core - Remove Other | Remove Other x States |
| Skills & States Core - JS On Add/Erase/Expire | JavaScript hooks de estado |
| Skills & States Core - Passive States | Passive Stackable, Condition Class/Switch/JS |
| Skills & States Core - Slip Damage & Healing | JS Slip Damage/Heal, JS Slip Refresh |
| Skills & States Core - Aura/Miasma | Aura/Miasma variants (cross-ref actors) |

---

## Enhanced TP System

### `<Force TP Mode: name>`
- **Escopo**: State
- **Descricao**: Forca um modo de TP especifico enquanto o state esta ativo
- **Sintaxe**: `<Force TP Mode: NomeDoModo>`
- **Exemplo**: `"note": "<Force TP Mode: Furia Incontrolavel>"`
- **Observacoes**: Prevalece sobre `<TP Mode>` e `<Change TP Mode>`

### `<Max TP: formula>`
- **Escopo**: State
- **Descricao**: Modifica o TP maximo enquanto o state esta ativo
- **Sintaxe**: `<Max TP: formula>`

### `<TCR Multiplier: x%>`
- **Escopo**: State
- **Descricao**: Modifica o ganho de TP enquanto o state esta ativo
- **Sintaxe**: `<TCR Multiplier: 1.5>`

---

## Battle Core - Tags Comuns

States compartilham as seguintes tags com Actors (mesma sintaxe e comportamento):

**Penetracao**: Armor/Magic Penetration, Armor/Magic Reduction

**Life Steal**: HP/MP Life Steal por hit type (6 tags), Guard/Disarm/Negative Life Steal (9 tags)
**Damage**: Damage Cap, Bypass Damage Cap, Bypass Soft Damage Cap, Soft Damage Cap
**JavaScript**: JS Critical Rate as User/Target, JS Accuracy as User/Target

Documentacao completa em `references/tags-actors.md`

---

## Auto Skill Trigger

### `<No Auto Skill Trigger>`
- **Escopo**: Skill, Item, State
- **Plugin**: Auto Skill Trigger
- **Descricao**: Previne que Auto Skill Triggers ocorram enquanto este state estiver ativo
- **Sintaxe**: `<No Auto Skill Trigger>`

---

## Life State Effects - State Only

### `<Auto Life: x%>`
- **Escopo**: State (apenas)
- **Plugin**: Life State Effects
- **Descricao**: Quando o battler morre com este estado ativo, revive com x% do HP maximo
- **Sintaxe**: `<Auto Life: 50%>`
- **Exemplos**:
  - `<Auto Life: 50%>` — Revive com 50% HP
  - `<Auto Life: 100%>` — Revive com HP cheio
- **Observacoes**:
  - Estado se remove automaticamente apos revival
  - **Todos** os estados com Auto Life sao removidos
  - Apenas um Auto Life pode ser usado por morte
  - Porcentagens maiores de estados multiplos nao se somam

### `<Doom>`
- **Escopo**: State (apenas)
- **Plugin**: Life State Effects
- **Descricao**: Quando o timer do estado expira naturalmente, o battler morre
- **Sintaxe**: `<Doom>`
- **Observacoes**:
  - **Apenas** funciona quando expira naturalmente
  - Remover o estado manualmente previne a morte
  - Cura e outros efeitos nao removem Doom

### `<Extinct>`
- **Escopo**: State (apenas)
- **Plugin**: Life State Effects
- **Descricao**: Target nao pode mais reviver enquanto este state estiver ativo
- **Sintaxe**: `<Extinct>`
- **Observacoes**:
  - **Suprime Auto Life**: Battler permanece morto
  - **NAO suprime Death Transformations**: Inimigos ainda se transformam

---

## Life State Effects - Trait Objects

States compartilham as tags de Life State Effects com Actors (mesma sintaxe e comportamento):

**Curse**: Curse HP, Curse MP, Curse TP
**Mechanics**: Fragile, Guts, Undead, Allow Undead Regen

Documentacao completa em `references/tags-actors.md` secao "Life State Effects - Trait Objects"

---

## Skills & States Core - Remocao Especial

### `<No Death Clear>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Previne remocao do state ao morrer. Permite que o state seja adicionado a battlers ja mortos.
- **Sintaxe**: `<No Death Clear>`

### `<No Recover All Clear>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Previne remocao ao usar Recover All command
- **Sintaxe**: `<No Recover All Clear>`

### `<Group Defeat>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Se **todo** o party e afetado por states com esta tag, o party e considerado derrotado
- **Sintaxe**: `<Group Defeat>`
- **Observacoes**: Uso: petrificacao em grupo, frozen, etc.

---

## Skills & States Core - Reapply Rules

### `<Reapply Rules: Ignore>` / `<Reapply Rules: Reset>` / `<Reapply Rules: Greater>` / `<Reapply Rules: Add>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Define o que acontece ao reaplicar um state ja existente (afeta turnos)
- **Sintaxe**: `<Reapply Rules: Ignore>` ou `<Reapply Rules: Reset>` ou `<Reapply Rules: Greater>` ou `<Reapply Rules: Add>`
- **Observacoes**:
  - **Ignore**: Nenhuma mudanca de turnos
  - **Reset**: Recalcula turnos
  - **Greater**: Mantem o maior (atual vs. reset)
  - **Add**: Adiciona turnos ao valor atual
  - Sem notetag: usa regra do Plugin Parameters > States

---

## Skills & States Core - Categorias

### `<Positive State>` / `<Negative State>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Marca o state como positivo ou negativo. Altera cor dos turnos conforme Plugin Parameters.
- **Sintaxe**: `<Positive State>` ou `<Negative State>`

### `<Category: name>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Organiza states em categorias nomeadas
- **Sintaxe**: `<Category: name>` ou `<Category: name, name, name>`
- **Exemplo**: `"note": "<Category: Poison>"`
- **Observacoes**: Tambem aceita formato multi-linha com `<Categories>...\n</Categories>`

---

## Skills & States Core - Display de Turnos

### `<Hide State Turns>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Oculta turnos completamente, sobrepoe Plugin Parameters
- **Sintaxe**: `<Hide State Turns>`

### `<Turn Color: x>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Define cor dos turnos do state
- **Sintaxe**: `<Turn Color: x>` (window text color number) ou `<Turn Color: #rrggbb>` (hex color)
- **Observacoes**: Hex color requer VisuMZ_1_MessageCore

### `<Max Turns: x>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Limite maximo de turnos para este state
- **Sintaxe**: `<Max Turns: x>`
- **Observacoes**: Default: Plugin Parameters > State Settings

---

## Skills & States Core - Remove Other

### `<Remove Other x States>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Quando este state e adicionado, remove OUTROS states da categoria `x`
- **Sintaxe**: `<Remove Other Poison States>`
- **Observacoes**: Ideal para stances/forms (apenas um ativo por vez)

---

## Skills & States Core - JS On Add/Erase/Expire

### `<JS On Add State>` / `<JS On Erase State>` / `<JS On Expire State>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Executa codigo JavaScript quando o state e adicionado/removido/expirado
- **Sintaxe**:
  ```
  <JS On Add State>
   code
  </JS On Add State>
  ```
- **Variaveis**: `user` (active battler), `target` (battler afetado), `origin` (quem aplicou), `state` (o state)
- **Exemplo**: `"note": "<JS On Add State>\n$gameParty.gainItem($dataItems[1], 1);\n</JS On Add State>"`

---

## Skills & States Core - Passive States

### `<Passive Stackable>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Permite que o passive state seja adicionado multiplas vezes
- **Sintaxe**: `<Passive Stackable>`
- **Observacoes**: Sem esta tag, apenas uma instancia do passive state e permitida

### `<Passive Condition Class: id>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Condicao: class atual do actor deve corresponder a um dos valores
- **Sintaxe**: `<Passive Condition Class: id>` ou `<Passive Condition Classes: id, id, id>` ou por nome
- **Exemplo**: `"note": "<Passive Condition Class: Guerreiro>"`

### `<Passive Condition Multiclass: id>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Condicao: qualquer multiclass do actor deve corresponder
- **Sintaxe**: `<Passive Condition Multiclass: id>` ou por nome
- **Requisitos**: VisuMZ_2_ClassChangeSystem

### `<Passive Condition Switch ON: x>` / `<Passive Condition Switch OFF: x>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Condicao baseada em switches
- **Sintaxe**:
  - `<Passive Condition Switch ON: x>` — Switch x deve estar ON
  - `<Passive Condition All Switches ON: x,x,x>` — TODOS devem estar ON
  - `<Passive Condition Any Switch ON: x,x,x>` — QUALQUER deve estar ON
  - `<Passive Condition Switch OFF: x>` — Switch x deve estar OFF
  - `<Passive Condition All Switches OFF: x,x,x>` — TODOS devem estar OFF
  - `<Passive Condition Any Switch OFF: x,x,x>` — QUALQUER deve estar OFF

### `<JS Passive Condition>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Condicao customizada via JavaScript
- **Sintaxe**:
  ```
  <JS Passive Condition>
   condition = code;
  </JS Passive Condition>
  ```
- **Variaveis**: `condition` (boolean), `user` (afetado pelo passive), `state` (passive state)
- **Observacoes**: Todas as outras passive conditions devem ser atendidas primeiro
- **Limitacoes**: Failsafes contra loops infinitos - passive states NAO podem depender de outros passive states, traits de outros states, parametros alterados por outros states, ou equip cujo tipo vem de outro state

---

## Skills & States Core - Slip Damage & Healing

### `<JS type Slip Damage>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Dano over time customizado via JavaScript
- **Sintaxe**:
  ```
  <JS type Slip Damage>
   damage = code;
  </JS type Slip Damage>
  ```
- **Variaveis**: `user` (origem do state), `target` (unidade recebendo dano), `state` (state atual), `damage` (valor final)
- **Exemplos**:
  - Poison (5% MaxHP): `"note": "<JS HP Slip Damage>\ndamage = Math.floor(target.mhp * 0.05);\n</JS HP Slip Damage>"`
  - MP Drain variavel: `"note": "<JS MP Slip Damage>\ndamage = Math.floor(Math.random() * 21) + 10;\n</JS MP Slip Damage>"`
- **Observacoes**:
  - `type` = HP, MP, ou TP
  - States aplicados via action effects: calculo e feito **uma vez** e cached
  - **NAO inclua** game mechanics aqui - apenas calculos
  - Passive States sempre recalculam (sem cache)

### `<JS type Slip Heal>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Cura over time customizada via JavaScript
- **Sintaxe**:
  ```
  <JS type Slip Heal>
   heal = code;
  </JS type Slip Heal>
  ```
- **Variaveis**: `user`, `target`, `state`, `heal` (valor final)
- **Exemplo**: Regen (3% MaxHP): `"note": "<JS HP Slip Heal>\nheal = Math.floor(target.mhp * 0.03);\n</JS HP Slip Heal>"`
- **Observacoes**: Mesmas regras de cache do Slip Damage

### `<JS Slip Refresh>`
- **Escopo**: State (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Forca recalculo dos valores de Slip Damage/Heal a cada regeneration phase
- **Sintaxe**: `<JS Slip Refresh>`
- **Observacoes**: Permite ranges de dano dinamicos. Combina com `<JS type Slip Damage/Heal>`

---

## Skills & States Core - Aura/Miasma em States

States compartilham as tags de Aura/Miasma com Actors (mesma sintaxe e comportamento):

**Exclusao**: Not User Aura
**Morto**: Allow Dead Aura/Miasma, Dead Aura/Miasma Only

Documentacao completa em `references/tags-actors.md` secao "Skills & States Core - Aura & Miasma"

---

## Coreto TpEvents

### `<TP On Enemy Death: +x>`
- **Escopo**: State, Skill
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP quando qualquer inimigo morre (nao importa quem matou)
- **Sintaxe**: `<TP On Enemy Death: +8>`
- **Observacoes**: Todos os actors vivos com a tag recebem TP. Acumula com TP Mode do Enhanced TP System

### `<TP On Ally Death: +x>`
- **Escopo**: State, Skill
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP quando um aliado morre
- **Sintaxe**: `<TP On Ally Death: +10>`
- **Observacoes**: Todos os actors vivos recebem TP

### `<TP On Battle Win: +x>`
- **Escopo**: State, Skill
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao vencer a batalha
- **Sintaxe**: `<TP On Battle Win: +15>`
- **Observacoes**: Apenas actors vivos recebem TP

### `<TP On Critical Hit: +x>`
- **Escopo**: State, Skill
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao causar acerto critico
- **Sintaxe**: `<TP On Critical Hit: +10>`

### `<TP On Evasion: +x>`
- **Escopo**: State, Skill
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao esquivar de um ataque
- **Sintaxe**: `<TP On Evasion: +5>`

### `<TP On Take HP Damage: +x>`
- **Escopo**: State, Skill
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao receber dano de HP
- **Sintaxe**: `<TP On Take HP Damage: +3>`

### `<TP On Deal HP Damage: +x>`
- **Escopo**: State, Skill
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao causar dano de HP
- **Sintaxe**: `<TP On Deal HP Damage: +2>`

### `<TP On Gain Buff: +x>`
- **Escopo**: State, Skill
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao receber buff
- **Sintaxe**: `<TP On Gain Buff: +2>`

### `<TP On Gain Debuff: +x>`
- **Escopo**: State, Skill
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao receber debuff
- **Sintaxe**: `<TP On Gain Debuff: +2>`

### `<TP On Gain State: +x>`
- **Escopo**: State, Skill
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao receber state
- **Sintaxe**: `<TP On Gain State: +3>`

### `<TP On Flee Battle: +x>`
- **Escopo**: State, Skill
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao fugir da batalha com sucesso
- **Sintaxe**: `<TP On Flee Battle: +5>`

### `<TP On Lose Battle: +x>`
- **Escopo**: State, Skill
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao perder a batalha
- **Sintaxe**: `<TP On Lose Battle: +5>`
