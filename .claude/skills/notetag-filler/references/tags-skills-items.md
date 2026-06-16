# Tags - Skills & Items

**Entidade**: Skill, Item
**Plugins**: VisuStella MZ Battle Core, ATB, Enhanced TP System, Auto Skill Trigger, Battle AI, Life State Effects, Skills & States Core, Coreto TP Notetags, Coreto TpEvents

> **Nota**: Todas as tags nesta secao aplicam-se a **Skills** e **Items**, exceto onde indicado. Nao ha tags exclusivas de Items.

---

## Indice

| Seção | Linha | Conteudo |
|-------|-------|----------|
| Battle Core - Damage | 10 | Damage Cap, Bypass Damage Cap, Soft Damage Cap |
| Battle Core - Critical | 30 | Set/Modify Critical Rate, Always Critical, Custom Eval, JS Critical |
| Battle Core - Penetracao | 91 | Armor/Magic Penetration e Reduction |
| Battle Core - Life Steal (Ativo) | 111 | HP/MP Life Steal, Cancel Life Steal |
| Battle Core - Targeting | 142 | Target variants, Always Hit, Repeat Hits, Disperse, JS Targets |
| Battle Core - JavaScript | 219 | JS Accuracy, JS Targets |
| Coreto HitRate | 294 | Modify Hit Rate (custom plugin) |
| Battle Core - Misc | 270 | Unblockable, Apply State |
| Auto Skill Trigger | 286 | Auto Trigger conditions |
| Battle AI - Condicoes | 312 | All/Any/No AI Conditions |
| Battle AI - Targeting | 350 | AI Target types |
| Life State Effects | 367 | Curse, Fragile, Guts, Undead |
| Skills & States Core - Gerais | 378 | Skill Type, Hide/Show/Enable/Disable |
| Skills & States Core - Custos | 407 | MP/TP/Gold costs, JS Cost |
| Skills & States Core - Item Cost | 456 | Item/Weapon/Armor costs |
| Skills & States Core - Acessibilidade | 478 | Hide/Show/Enable/Disable por switch e skill |
| Skills & States Core - Interacoes State | 559 | Bypass, Category Remove, Turns, Buff/Debuff |
| ATB System | 605 | Interrupt, Cast/Charge/After Gauge |
| ATB - JavaScript | 647 | JS ATB Cast/Charge/After |
| Enhanced TP System | 685 | Gain TP, Change/Learn/Unlock TP Mode |
| Coreto TP Notetags | 785 | Spend TP, JS Modify TP, Gain TP (sem sinal) |

---

## Battle Core - Damage

### `<Damage Cap: x>`
- **Escopo**: Todos
- Documentacao completa em `references/tags-actors.md` secao "Battle Core - Damage"

### `<Bypass Damage Cap>`
- **Escopo**: Todos
- Documentacao completa em `references/tags-actors.md` secao "Battle Core - Damage"

### `<Bypass Soft Damage Cap>`
- **Escopo**: Todos
- Documentacao completa em `references/tags-actors.md` secao "Battle Core - Damage"

### `<Soft Damage Cap: +x%>` / `<Soft Damage Cap: -x%>`
- **Escopo**: Todos
- Documentacao completa em `references/tags-actors.md` secao "Battle Core - Damage"

---

## Battle Core - Critical

### `<Set Critical Rate: x%>`
- **Escopo**: Skill, Item
- **Descricao**: Define uma chance fixa de golpe critico, ignorando o parametro CRI do usuario
- **Sintaxe**: `<Set Critical Rate: 50%>`
- **Exemplo**: `"note": "<Set Critical Rate: 50%>"`

### `<Modify Critical Rate: x%>` / `<Modify Critical Rate: +x%>` / `<Modify Critical Rate: -x%>`
- **Escopo**: Skill, Item
- **Descricao**: Modifica a taxa de critico do usuario para esta skill/item
- **Sintaxe**:
  - `x%`: Multiplica o CRI do usuario
  - `+x%`: Adiciona ao CRI do usuario
  - `-x%`: Subtrai do CRI do usuario
- **Alias**: `<Critical: x%>`, `<Critical: +x%>`, `<Critical: -x%>`
- **Exemplos**:
  - `"note": "<Modify Critical Rate: +20%>"`
  - `"note": "<Modify Critical Rate: 150%>"`
  - `"note": "<Modify Critical Rate: -10%>"`

### `<Modify Critical Multiplier: x%>` / `<Modify Critical Multiplier: +x%>` / `<Modify Critical Multiplier: -x%>`
- **Escopo**: Skill, Item
- **Descricao**: Modifica o multiplicador de dano critico
- **Sintaxe**:
  - `x%`: Define multiplicador exato
  - `+x%`: Adiciona ao multiplicador
  - `-x%`: Subtrai do multiplicador
- **Exemplos**:
  - `"note": "<Modify Critical Multiplier: 400%>"`
  - `"note": "<Modify Critical Multiplier: +50%>"`

### `<Modify Critical Bonus Damage: x%>` / `<Modify Critical Bonus Damage: +x%>` / `<Modify Critical Bonus Damage: -x%>`
- **Escopo**: Skill, Item
- **Descricao**: Modifica o bonus de dano adicionado quando um critico ocorre
- **Alias**: `<Crit Damage Bonus: +x%>`
- **Sintaxe**:
  - `x%`: Define bonus exato
  - `+x%`: Adiciona ao bonus
  - `-x%`: Subtrai do bonus
- **Exemplo**: `"note": "<Modify Critical Bonus Damage: +33%>"`

### `<Always Critical>`
- **Escopo**: Skill, Item
- **Descricao**: Sempre causa golpe critico
- **Sintaxe**: `<Always Critical>`
- **Observacoes**: Nao suporta condicoes. Para condicoes, use `<Custom Critical Eval>`

### `<Custom Critical Eval>`
- **Escopo**: Skill, Item
- **Descricao**: Avaliacao customizada para critico com JavaScript
- **Sintaxe**:
  ```
  <Custom Critical Eval>
  code
  </Custom Critical Eval>
  ```
- **Exemplo**: `"note": "<Custom Critical Eval>\nuser.hp < user.mhp * 0.3\n</Custom Critical Eval>"`

---

## Battle Core - Penetracao

### `<Armor Penetration: x%>`
- **Escopo**: Todos
- Documentacao completa em `references/tags-actors.md` secao "Battle Core - Penetracao"

### `<Magic Penetration: x%>`
- **Escopo**: Todos
- Documentacao completa em `references/tags-actors.md` secao "Battle Core - Penetracao"

### `<Armor Reduction: x%>`
- **Escopo**: Todos
- Documentacao completa em `references/tags-actors.md` secao "Battle Core - Penetracao"

### `<Magic Reduction: x%>`
- **Escopo**: Todos
- Documentacao completa em `references/tags-actors.md` secao "Battle Core - Penetracao"

---

## Battle Core - Life Steal (Ativo em Skills)

### `<HP Life Steal: x%>`
- **Escopo**: Skill, Item
- **Descricao**: Roubo de vida (% do dano causado)
- **Sintaxe**: `<HP Life Steal: 20%>`
- **Exemplo**: `"note": "<HP Life Steal: 20%>"`

### `<MP Life Steal: x%>`
- **Escopo**: Skill, Item
- **Descricao**: Roubo de mana (% do dano causado)
- **Sintaxe**: `<MP Life Steal: 15%>`
- **Exemplo**: `"note": "<MP Life Steal: 15%>"`

### `<Cancel Life Steal>`
- **Escopo**: Skill, Item
- **Descricao**: Previne Life Steal effects de ocorrerem (inclui passive life steal do usuario)
- **Sintaxe**: `<Cancel Life Steal>`

### `<Cancel HP Life Steal>`
- **Escopo**: Skill, Item
- **Descricao**: Previne HP Life Steal effects
- **Sintaxe**: `<Cancel HP Life Steal>`

### `<Cancel MP Life Steal>`
- **Escopo**: Skill, Item
- **Descricao**: Previne MP Life Steal effects
- **Sintaxe**: `<Cancel MP Life Steal>`

---

## Battle Core - Targeting

### `<Always Hit>`
- **Escopo**: Skill, Item
- **Descricao**: A acao sempre acerta
- **Sintaxe**: `<Always Hit>`

### `<Always Hit Rate: x%>`
- **Escopo**: Skill, Item
- **Descricao**: A acao sempre tem uma taxa de acerto de exatamente x%
- **Sintaxe**: `<Always Hit Rate: 75%>`

### `<Repeat Hits: x>`
- **Escopo**: Skill, Item
- **Descricao**: Altera o numero de hits que a acao produz
- **Sintaxe**: `<Repeat Hits: 3>`
- **Alias**: `<Repeat Targets: x>`

### `<Target: x Random Any>`
- **Escopo**: Skill, Item
- **Descricao**: Faz a skill escolher x alvos aleatorios (actors ou enemies)
- **Sintaxe**: `<Target: 3 Random Any>`
- **Observacoes**: Sobrescreve o scope original do database

### `<Target: x Random Enemies>`
- **Escopo**: Skill, Item
- **Descricao**: Faz a skill escolher x inimigos aleatorios
- **Sintaxe**: `<Target: 2 Random Enemies>`

### `<Target: x Random Allies>`
- **Escopo**: Skill, Item
- **Descricao**: Faz a skill escolher x aliados aleatorios
- **Sintaxe**: `<Target: 2 Random Allies>`

### `<Target: All Allies But User>`
- **Escopo**: Skill, Item
- **Descricao**: Alvos todos os aliados exceto o usuario
- **Sintaxe**: `<Target: All Allies But User>`
- **Observacoes**: Sobrescreve o scope original do database

### `<Target: Ally or Enemy>`
- **Escopo**: Skill, Item
- **Descricao**: Permite selecionar allies ou enemies
- **Sintaxe**: `<Target: Ally or Enemy>`
- **Observacoes**: NAO permite selecionar dead party members. Enfase em allies primeiro. Ignorado quando usado por enemies.

### `<Target: Enemy or Ally>`
- **Escopo**: Skill, Item
- **Descricao**: Permite selecionar enemies ou allies
- **Sintaxe**: `<Target: Enemy or Ally>`
- **Observacoes**: NAO permite selecionar dead party members. Enfase em enemies primeiro. Ignorado quando usado por enemies.

### `<Single or Multiple Select>`
- **Escopo**: Skill, Item
- **Descricao**: Permite selecionar alvo unico ou multiplos
- **Sintaxe**: `<Single or Multiple Select>`
- **Observacoes**: Requer scope original que permita selecao individual. Enemy AI e Auto-battle NAO fazem uso desta habilidade.

### `<Disperse Damage>`
- **Escopo**: Skill, Item
- **Descricao**: Divide o dano igualmente entre todos os alvos
- **Sintaxe**: `<Disperse Damage>`
- **Observacoes**: Inclui repeats no calculo de divisao

### `<Cannot Target User>`
- **Escopo**: Skill, Item
- **Descricao**: Impede que o usuario seja selecionado como alvo
- **Sintaxe**: `<Cannot Target User>`
- **Observacoes**: Quando usado com "All" scopes, usuario e removido do pool

### `<Modify Target: condition>`
- **Escopo**: Skill, Item
- **Descricao**: Modifica alvo da skill
- **Sintaxe**: `<Modify Target: condition>`

---

## Battle Core - JavaScript

### `<JS Critical Rate>`
- **Escopo**: Skill, Item
- **Descricao**: Determina a taxa de critico atraves de JavaScript
- **Sintaxe**:
  ```
  <JS Critical Rate>
  rate = code;
  </JS Critical Rate>
  ```
- **Variaveis**: `rate`, `user`, `target`
- **Exemplo**: `"note": "<JS Critical Rate>\nrate = 0.5;\n</JS Critical Rate>"`

### `<JS Critical Damage>`
- **Escopo**: Skill, Item
- **Descricao**: Determina multiplicador e bonus de dano critico via JavaScript
- **Sintaxe**:
  ```
  <JS Critical Damage>
  multiplier = code;
  bonusDamage = code;
  </JS Critical Damage>
  ```
- **Variaveis**: `multiplier`, `bonusDamage`, `user`, `target`

### `<JS Accuracy>`
- **Escopo**: Skill, Item
- **Descricao**: Determina a taxa de acerto via JavaScript
- **Sintaxe**:
  ```
  <JS Accuracy>
  rate = code;
  </JS Accuracy>
  ```
- **Variaveis**: `rate`, `user`, `target`

### `<JS Targets>`
- **Escopo**: Skill, Item
- **Descricao**: Determina os alvos da acao via JavaScript
- **Sintaxe**:
  ```
  <JS Targets>
  targets = [code];
  </JS Targets>
  ```
- **Variaveis**: `targets`, `user`, `target`, `item`
- **Observacoes**: `targets` inclui o set original determinado pelo scope

---

## Coreto HitRate (Plugin Custom)

### `<Modify Hit Rate: x%>` / `<Modify Hit Rate: +x%>` / `<Modify Hit Rate: -x%>`
- **Escopo**: Skill, Item
- **Plugin**: Coreto_HitRate (custom)
- **Descricao**: Modifica a taxa de acerto (hit rate) da skill/item. Funciona com Improved Accuracy ativado.
- **Sintaxe**:
  - `x%`: Define hit rate como x% do original (multiplicador)
  - `+x%`: Aumenta hit rate em x% (multiplicador: 1 + x/100)
  - `-x%`: Reduz hit rate em x% (multiplicador: 1 - x/100)
- **Exemplos**:
  - `"note": "<Modify Hit Rate: -10%>"` → Reduz hit rate em 10%
  - `"note": "<Modify Hit Rate: +15%>"` → Aumenta hit rate em 15%
  - `"note": "<Modify Hit Rate: 80%>"` → Hit rate passa a ser 80% do original

---

## Battle Core - Misc

### `<Unblockable>`
- **Escopo**: Skill, Item
- **Descricao**: Nao pode ser bloqueado com Guard
- **Sintaxe**: `<Unblockable>`
- **Exemplo**: `"note": "<Unblockable>"`

### `<Apply State: x>`
- **Escopo**: Skill, Item
- **Descricao**: Aplica state ao alvo
- **Sintaxe**: `<Apply State: 140>`
- **Exemplo**: `"note": "<Apply State: 140>"`

---

## Auto Skill Trigger

### `<Auto Trigger: condition>`
- **Escopo**: Skill, Item
- **Plugin**: Auto Skill Trigger
- **Descricao**: Transforma a skill em Auto Trigger — sera usada automaticamente quando a condicao for atendida
- **Sintaxe**: `<Auto Trigger: condition>`
- **Variante com Chance**: `<Auto Trigger x%: condition>` (x = 0-100)
- **Exemplos**:
  - `<Auto Trigger: Battle Start>` — Triggera no inicio da batalha
  - `<Auto Trigger: Physical Target>` — Triggera quando alvo de acao fisica
  - `<Auto Trigger 50%: Attack Target>` — 50% chance de triggerar quando atacado
- **Observacoes**:
  - Skills com Auto Trigger **nao podem triggerar outros Auto Triggers** (prevencao de loop)
  - Uma mesma skill pode ter multiplos Auto Triggers (basta adicionar varias tags)
  - A skill deve ser usavel normalmente (MP/TP, cooldowns, etc.)
  - Ver `references/tags-appendices.md` secao "Apencice E" para lista completa das 60 condicoes

### `<No Auto Skill Trigger>`
- **Escopo**: Skill, Item, State
- **Plugin**: Auto Skill Trigger
- **Descricao**: Previne que Auto Skill Triggers ocorram ao usar esta skill/item ou enquanto este state estiver ativo
- **Sintaxe**: `<No Auto Skill Trigger>`

---

## Battle AI - Condicoes

### `<All AI Conditions>`
- **Escopo**: Skill
- **Plugin**: Battle AI
- **Descricao**: Define condicoes onde **todas** devem ser cumpridas para a skill ser valida
- **Sintaxe**:
  ```
  <All AI Conditions>
  condicao 1
  condicao 2
  </All AI Conditions>
  ```
- **Observacoes**: Se este notetag existe, nao usa condicoes padrao dos Plugin Parameters

### `<Any AI Conditions>`
- **Escopo**: Skill
- **Plugin**: Battle AI
- **Descricao**: Define condicoes onde **pelo menos uma** deve ser cumprida
- **Sintaxe**:
  ```
  <Any AI Conditions>
  condicao 1
  condicao 2
  </Any AI Conditions>
  ```
- **Observacoes**: Pode ser combinado com `<All AI Conditions>` (All AND Any)

### `<No AI Conditions>`
- **Escopo**: Skill
- **Plugin**: Battle AI
- **Descricao**: Remove todas as condicoes padrao ALL e ANY para esta skill
- **Sintaxe**: `<No AI Conditions>`

> **Nota**: Ver `references/tags-appendices.md` secao "Apencice G" para lista completa de condicoes disponiveis

---

## Battle AI - Targeting

### `<AI Target: type>`
- **Escopo**: Skill
- **Plugin**: Battle AI
- **Descricao**: Ignora influencia TGR em favor de escolher um alvo especifico. Nao escolhe fora do grupo de alvos validos.
- **Sintaxe**: `<AI Target: type>`
- **Exemplos**:
  - `<AI Target: Lowest HP%>` — Foca o aliado com menor % HP (cura)
  - `<AI Target: Highest ATK>` — Foca o inimigo mais forte (debuff)
  - `<AI Target: User>` — Sempre escolhe o usuario (self-buff)
- **Observacoes**: Apenas afeta skills onde o usuario deve selecionar um alvo. Ignora random e AoE.
- **Requisitos extras**: State Count types requerem VisuMZ_1_SkillsStatesCore
- Ver `references/tags-appendices.md` secao "Apencice F" para lista completa dos ~50 tipos

---

## Life State Effects - Trait Objects

Skills e Items compartilham as tags de Life State Effects com Actors (mesma sintaxe e comportamento):

**Curse**: Curse HP, Curse MP, Curse TP
**Mechanics**: Fragile, Guts, Undead, Allow Undead Regen

Documentacao completa em `references/tags-actors.md` secao "Life State Effects - Trait Objects"

---

## Skills & States Core - Skills Gerais

### `<Skill Type: x>` / `<Skill Types: x,x,x>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Marca a skill com multiplos Skill Types, aparecendo em diferentes categorias sem duplicar a skill
- **Sintaxe**: `<Skill Type: x>` ou `<Skill Types: x,x,x>` (por ID) ou `<Skill Type: name>` (por nome)
- **Exemplos**:
  - `"note": "<Skill Types: 1, 3, 5>"`
  - `"note": "<Skill Type: Magic>"`

### `<List Name: name>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Faz o nome da skill aparecer diferente na skill list
- **Sintaxe**: `<List Name: name>`
- **Exemplo**: `"note": "<List Name: \\V[42] Blade>"`
- **Observacoes**: Suporta `\V[x]` para variaveis

### `<ID Sort Priority: x>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Muda a prioridade de sorting por ID para `x`. Valores maiores = mais alto na lista.
- **Sintaxe**: `<ID Sort Priority: x>`
- **Exemplo**: `"note": "<ID Sort Priority: 100>"`
- **Observacoes**: Default: 50

---

## Skills & States Core - Custos de Recurso

### `<type Cost: x>` / `<type Cost: x%>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Define custo de um resource type. Bypassa limites do Database Editor (9,999 MP / 100 TP).
- **Sintaxe**: `<type Cost: x>` (valor fixo) ou `<type Cost: x%>` (percentual do maximo)
- **Exemplos**:
  - `"note": "<HP Cost: 500>"` — Custo fixo de 500 HP
  - `"note": "<MP Cost: 25%>"` — 25% do MP maximo
  - `"note": "<Gold Cost: 3000>"` — Custa 3000 Gold
  - `"note": "<Potion Cost: 5>"` — Custa 5 Potions
- **Observacoes**: `type` = HP, MP, TP, Gold, Potion ou custom Skill Cost Type

### `<type Cost Max: x>` / `<type Cost Min: x>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Limita custos condicionais e percentuais
- **Sintaxe**: `<HP Cost Max: 1500>` ou `<MP Cost Min: 5>`
- **Observacoes**: `type` = HP, MP, TP, Gold, Potion, etc.

### `<Custom Cost Text>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Adiciona texto customizado ao final da area de custos
- **Sintaxe**:
  ```
  <Custom Cost Text>
   text
  </Custom Cost Text>
  ```
- **Observacoes**: Suporta text codes

### `<JS type Cost>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Calcula custo via JavaScript
- **Sintaxe**:
  ```
  <JS type Cost>
   cost = code;
  </JS type Cost>
  ```
- **Variaveis**: `user` (quem vai usar a skill), `skill` (a skill), `cost` (resultado final)
- **Exemplo**: `"note": "<JS MP Cost>\ncost = user.level * 5;\n</JS MP Cost>"`
- **Observacoes**: `type` = HP, MP, TP, Gold, Potion, etc.

---

## Skills & States Core - Item Cost

### `<Item Cost: x name>` / `<Weapon Cost: x name>` / `<Armor Cost: x name>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Consome items/weapons/armors para usar a skill. Mesmo items nao-consumiveis sao consumidos.
- **Sintaxe**: `<Item Cost: x name>` ou `<Weapon Cost: x name>` ou `<Armor Cost: x name>`
- **Exemplos**:
  - `"note": "<Item Cost: 5 Magic Water>"`
  - `"note": "<Weapon Cost: 1 Short Sword>"`
  - `"note": "<Armor Cost: 3 Cloth Armor>"`
- **Observacoes**: Multiplas notetags para multiplos itens

### `<Item Cost Max: x name>` / `<Item Cost Min: x name>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Limita custo de itens por nome
- **Sintaxe**: `<Item Cost Max: 10 Magic Water>` ou `<Weapon Cost Min: 1 Short Sword>`
- **Observacoes**: Tambem disponivel para Weapon e Armor Cost Max/Min

---

## Skills & States Core - Acessibilidade

### `<Hide in Battle>` / `<Hide outside Battle>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Controla visibilidade baseada em contexto de batalha
- **Sintaxe**: `<Hide in Battle>` ou `<Hide outside Battle>`

### `<Show Switch: x>` / `<Hide Switch: x>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Controla visibilidade via switches
- **Sintaxe**:
  - `<Show Switch: x>` — Skill oculta ate switch x ON
  - `<Hide Switch: x>` — Skill oculta se switch x ON
  - `<Show All Switches: x,x,x>` — Oculta ate TODOS ON
  - `<Show Any Switches: x,x,x>` — Visivel se QUALQUER ON
  - `<Hide All Switches: x,x,x>` — Visivel ate TODOS ON
  - `<Hide Any Switches: x,x,x>` — Oculta se QUALQUER ON

### `<Show if learned Skill: x>` / `<Hide if learned Skill: x>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Controla visibilidade baseado em skills aprendidas pelo actor
- **Sintaxe**:
  - `<Show if learned Skill: x>` — Oculta ate aprender skill x
  - `<Hide if learned Skill: x>` — Oculta se ja aprendeu skill x
  - `<Show if learned All Skills: x,x,x>` — Oculta ate TODAS aprendidas
  - `<Show if learned Any Skills: x,x,x>` — Visivel se QUALQUER aprendida
- **Observacoes**: NAO se aplica a skills adicionadas por traits (equip/states) - apenas skills aprendidas diretamente

### `<Show if has Skill: x>` / `<Hide if has Skill: x>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Controla visibilidade baseado em skills disponiveis (INCLUI traits)
- **Sintaxe**: Mesmo formato de "learned", mas usa `has`/`have`
  - `<Show if has Skill: x>` — Oculta ate ter skill x (inclui traits)
  - `<Hide if has Skill: x>` — Oculta se tem skill x
  - `<Show if have All/Any Skills: x,x,x>`
- **Observacoes**: Diferente de "learned": inclui skills por traits (equip/states)

### `<Enable Switch: x>` / `<Disable Switch: x>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Controla se a skill esta **habilitada** (nao apenas visivel)
- **Sintaxe**:
  - `<Enable Switch: x>` — Desabilitada ate switch x ON
  - `<Disable Switch: x>` — Desabilitada se switch x ON
  - `<Enable All Switches: x,x,x>` — Desabilitada ate TODOS ON
  - `<Enable Any Switches: x,x,x>` — Habilitada se QUALQUER ON
  - `<Disable All Switches: x,x,x>` — Habilitada ate TODOS ON
  - `<Disable Any Switches: x,x,x>` — Desabilitada se QUALQUER ON

### `<JS Skill Visible>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Avaliacao customizada de visibilidade via JavaScript
- **Sintaxe**:
  ```
  <JS Skill Visible>
   visible = code;
  </JS Skill Visible>
  ```
- **Variaveis**: `visible` (boolean), `user`, `skill`
- **Observacoes**: Todas as outras condicoes de visibilidade devem ser atendidas primeiro

### `<JS Skill Enable>`
- **Escopo**: Skill (apenas)
- **Plugin**: Skills & States Core
- **Descricao**: Avaliacao customizada de habilitacao via JavaScript
- **Sintaxe**:
  ```
  <JS Skill Enable>
   enabled = code;
  </JS Skill Enable>
  ```
- **Variaveis**: `enabled` (boolean), `user`, `skill`
- **Observacoes**: Todas as outras condicoes de skill devem ser atendidas primeiro

---

## Skills & States Core - Interacoes State (Skill/Item)

### `<Bypass State Damage Removal: id>`
- **Escopo**: Skill, Item
- **Plugin**: Skills & States Core
- **Descricao**: Previne que o dano deste skill/item remova states com "Remove by Damage" (ex: Sleep)
- **Sintaxe**: `<Bypass State Damage Removal: id>` ou `<Bypass State Damage Removal: name>`
- **Exemplo**: `"note": "<Bypass State Damage Removal: Sleep>"`
- **Observacoes**: Permite causar dano sem acordar alvo dormindo

### `<State x Category Remove: y>`
- **Escopo**: Skill, Item
- **Plugin**: Skills & States Core
- **Descricao**: Remove `y` states da categoria `x`. `All` remove todos da categoria.
- **Sintaxe**: `<State x Category Remove: y>` ou `<State x Category Remove: All>`
- **Exemplo**: `"note": "<State Poison Category Remove: All>"`

### `<State id/name Turns: +/-x>` / `<Set State id/name Turns: x>`
- **Escopo**: Skill, Item
- **Plugin**: Skills & States Core
- **Descricao**: Modifica turnos de um state no alvo
- **Sintaxe**:
  - `<State id Turns: +x>` — Adiciona turnos
  - `<State id Turns: -x>` — Remove turnos
  - `<Set State id Turns: x>` — Define valor exato
- **Exemplos**:
  - `"note": "<State Poison Turns: -2>"` — Remove 2 turnos de Poison
  - `"note": "<Set State 9 Turns: 5>"` — Define Sleep para 5 turnos
  - `"note": "<State Haste Turns: +3>"` — Adiciona 3 turnos de Haste

### `<param Buff Turns: +/-x>` / `<Set param Buff Turns: x>`
- **Escopo**: Skill, Item
- **Plugin**: Skills & States Core
- **Descricao**: Modifica turnos de buff de parametro no alvo
- **Sintaxe**: `<ATK Buff Turns: +2>` ou `<Set DEF Buff Turns: 5>`
- **Observacoes**: `param` = MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, LUK

### `<param Debuff Turns: +/-x>` / `<Set param Debuff Turns: x>`
- **Escopo**: Skill, Item
- **Plugin**: Skills & States Core
- **Descricao**: Modifica turnos de debuff de parametro no alvo
- **Sintaxe**: `<ATK Debuff Turns: -2>` ou `<Set DEF Debuff Turns: 3>`
- **Observacoes**: Mesmo formato de Buff Turns, para debuffs

---

## ATB System

### `<ATB Interrupt>`
- **Escopo**: Skill, Item
- **Descricao**: Interrompe skills em estado de Casting
- **Sintaxe**: `<ATB Interrupt>`
- **Observacoes**: Reseta gauge do target para 0%

### `<ATB Cast Gauge: x%>` / `<ATB Cast Gauge: +x%>` / `<ATB Cast Gauge: -x%>`
- **Escopo**: Skill, Item
- **Descricao**: Modifica gauge durante estado de Casting
- **Sintaxe**: `<ATB Cast Gauge: 50%>` ou `<ATB Cast Gauge: +20%>` ou `<ATB Cast Gauge: -30%>`

### `<ATB Charge Gauge: x%>` / `<ATB Charge Gauge: +x%>` / `<ATB Charge Gauge: -x%>`
- **Escopo**: Skill, Item
- **Descricao**: Modifica gauge durante estado de Charging
- **Sintaxe**: `<ATB Charge Gauge: 100%>` ou `<ATB Charge Gauge: +30%>` ou `<ATB Charge Gauge: -25%>`

### `<ATB After Gauge: x%>` / `<ATB After Gauge: +x%>` / `<ATB After Gauge: -x%>`
- **Escopo**: Skill, Item
- **Descricao**: Modificador de velocidade pos-acao (afeta PROXIMO turno)
- **Sintaxe**: `<ATB After Gauge: 50%>` ou `<ATB After Gauge: +20%>` ou `<ATB After Gauge: -10%>`
- **Observacoes**: Diferente de Speed que afeta turno ATUAL

### `<ATB Cannot Be Interrupted>`
- **Escopo**: Skill, Item
- **Descricao**: Torna skill imune a interrupcoes
- **Sintaxe**: `<ATB Cannot Be Interrupted>`

### `<ATB Help>`
- **Escopo**: Skill, Item
- **Descricao**: Altera o texto de help apenas quando em modo ATB
- **Sintaxe**:
  ```
  <ATB Help>
  descricao
  </ATB Help>
  ```
- **Exemplo**: `"note": "<ATB Help>\nLanca uma bola de fogo.\nTempo de cast: 5s.\n</ATB Help>"`

---

## ATB - JavaScript

### `<JS ATB After Gauge>`
- **Escopo**: Skill, Item
- **Descricao**: Formula JavaScript customizada para After Gauge
- **Sintaxe**:
  ```
  <JS ATB After Gauge>
  code
  </JS ATB After Gauge>
  ```
- **Variaveis**: `user`, `rate`
- **Exemplo**: `"note": "<JS ATB After Gauge>\nrate = (1 - user.hp/user.mhp) * 0.4;\n</JS ATB After Gauge>"`

### `<JS ATB Charge Gauge>`
- **Escopo**: Skill, Item
- **Descricao**: Formula JavaScript customizada para Charge Gauge
- **Sintaxe**:
  ```
  <JS ATB Charge Gauge>
  code
  </JS ATB Charge Gauge>
  ```
- **Variaveis**: `target`, `rate`

### `<JS ATB Cast Gauge>`
- **Escopo**: Skill, Item
- **Descricao**: Formula JavaScript customizada para Cast Gauge
- **Sintaxe**:
  ```
  <JS ATB Cast Gauge>
  code
  </JS ATB Cast Gauge>
  ```
- **Variaveis**: `target`, `rate`

---

## Enhanced TP System

### `<Gain TP: +x>` / `<Gain TP: -x>` / `<Gain TP: x>`
- **Escopo**: Skill, Item
- **Descricao**: Ganha (+x), perde (-x) ou ganha diretamente (x) TP ao usar skill
- **Sintaxe**: `<Gain TP: +10>` ou `<Gain TP: -5>` ou `<Gain TP: 10>`
- **Exemplo**: `"note": "<Gain TP: +10>"`

### `<Change Target TP Mode: name>`
- **Escopo**: Skill, Item
- **Descricao**: Muda modo de TP do alvo (requer acertar)
- **Sintaxe**: `<Change Target TP Mode: NomeDoModo>`
- **Exemplo**: `"note": "<Change Target TP Mode: Frenesi>"`
- **Observacoes**: Nao funciona com "Certain Hit"

### `<Change User TP Mode: name>`
- **Escopo**: Skill, Item
- **Descricao**: Muda modo de TP do usuario (incondicional)
- **Sintaxe**: `<Change User TP Mode: NomeDoModo>`
- **Exemplo**: `"note": "<Change User TP Mode: Guarda Fortificada>"`

### `<Learn TP Mode: name>`
- **Escopo**: Skill, Item
- **Descricao**: Actor aprende novo modo de TP (permanentemente)
- **Sintaxe**: `<Learn TP Mode: NomeDoModo>`
- **Exemplo**: `"note": "<Learn TP Mode: Postura Avancada>"`

### `<Learn TP Modes>`
- **Escopo**: Skill, Item
- **Descricao**: Actor aprende multiplos modos de TP
- **Sintaxe**:
  ```
  <Learn TP Modes>
  Modo1
  Modo2
  Modo3
  </Learn TP Modes>
  ```

### `<Unlock TP Mode: name>`
- **Escopo**: Skill, Item
- **Descricao**: Desbloqueia modo de TP temporariamente (ate fim da batalha)
- **Sintaxe**: `<Unlock TP Mode: NomeDoModo>`
- **Exemplo**: `"note": "<Unlock TP Mode: Furia do Dragao>"`

### `<Unlock TP Modes>`
- **Escopo**: Skill, Item
- **Descricao**: Desbloqueia multiplos modos de TP temporariamente
- **Sintaxe**:
  ```
  <Unlock TP Modes>
  Modo1
  Modo2
  </Unlock TP Modes>
  ```

---

## Coreto TP Notetags (Plugin Custom)

**Plugin**: `Coreto_TpNotetags`
**Ordem de carga**: Depois de VisuMZ_2_EnhancedTpSystem

> **Nota**: Este plugin intercepta `<Gain TP>` com regex proprio que suporta a variante sem sinal. As tags `<Spend TP>` e `<JS Modify TP>` sao exclusivas deste plugin. Os hooks bypassam skillTpCost do VisuStella (que faz early return) atuando diretamente em canPaySkillCost, paySkillCost e drawSkillCost.

### `<Gain TP: x>` (sem sinal)
- **Escopo**: Skill, Item
- **Plugin**: Coreto_TpNotetags
- **Descricao**: Ganha x TP diretamente ao usar a skill/item. Variante sem sinal da tag do Enhanced TP System.
- **Sintaxe**: `<Gain TP: 10>`
- **Exemplo**: `"note": "<Gain TP: 10>"`
- **Observacoes**: Acumula com `<Gain TP: +x>` / `<Gain TP: -x>` do Enhanced TP e com tpGain nativo

### `<Spend TP: x>`
- **Escopo**: Skill, Item
- **Plugin**: Coreto_TpNotetags
- **Descricao**: Custo adicional de TP somado ao tpCost nativo. So aceita valores positivos. O battler precisa ter TP suficiente (tpCost + Spend TP).
- **Sintaxe**: `<Spend TP: 5>`
- **Exemplos**:
  - `"note": "<Spend TP: 5>"` → Custo total = tpCost + 5
  - `"note": "<Spend TP: 10>"` → Custo total = tpCost + 10
- **Observacoes**: Hook direto em canPaySkillCost/paySkillCost/drawSkillCost (necessario porque VisuStella intercepta skillTpCost com early return). Exibe custo no menu de skills. Combinado com `<Gain TP>`, exibe "5 → +3".

### `<JS Modify TP: code>`
- **Escopo**: Skill, Item
- **Plugin**: Coreto_TpNotetags
- **Descricao**: JavaScript que modifica o custo final de TP da skill. Executa DEPOIS de Spend TP (recebe o custo com Spend incluso). Deve retornar um numero.
- **Sintaxe**: `<JS Modify TP: return cost * 2;>`
- **Variaveis**: `user` (battler), `skill` (objeto), `cost` (custo atual com Spend TP)
- **Exemplos**:
  - `<JS Modify TP: return cost * 2;>` → Dobra o custo
  - `<JS Modify TP: return user.hp < user.mhp * 0.5 ? 0 : cost;>` → Custo 0 se HP < 50%
  - `<JS Modify TP: return cost - $gameVariables.value(1);>` → Reduz custo por variavel
- **Observacoes**: Se houver erro no eval, usa o custo anterior e loga warning. Se presente, o retorno substitui o custo calculado (incluindo Spend TP). Acesso total a `$gameVariables`, `$gameSwitches`, etc.

---

## Coreto TpEvents

Notetags para ganho de TP baseado em eventos de batalha. Funcionam em Skills E States (incluindo passive states).

### `<TP On Enemy Death: +x>`
- **Escopo**: Skill, State
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP quando qualquer inimigo morre (nao importa quem matou)
- **Sintaxe**: `<TP On Enemy Death: +8>`
- **Observacoes**: Todos os actors vivos com a tag recebem TP. Acumula com TP Mode do Enhanced TP System

### `<TP On Ally Death: +x>`
- **Escopo**: Skill, State
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP quando um aliado morre
- **Sintaxe**: `<TP On Ally Death: +10>`

### `<TP On Battle Win: +x>`
- **Escopo**: Skill, State
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao vencer a batalha
- **Sintaxe**: `<TP On Battle Win: +15>`

### `<TP On Critical Hit: +x>`
- **Escopo**: Skill, State
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao causar acerto critico
- **Sintaxe**: `<TP On Critical Hit: +10>`

### `<TP On Evasion: +x>`
- **Escopo**: Skill, State
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao esquivar de um ataque
- **Sintaxe**: `<TP On Evasion: +5>`

### `<TP On Take HP Damage: +x>`
- **Escopo**: Skill, State
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao receber dano de HP
- **Sintaxe**: `<TP On Take HP Damage: +3>`

### `<TP On Deal HP Damage: +x>`
- **Escopo**: Skill, State
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao causar dano de HP
- **Sintaxe**: `<TP On Deal HP Damage: +2>`

### `<TP On Gain Buff: +x>`
- **Escopo**: Skill, State
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao receber buff
- **Sintaxe**: `<TP On Gain Buff: +2>`

### `<TP On Gain Debuff: +x>`
- **Escopo**: Skill, State
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao receber debuff
- **Sintaxe**: `<TP On Gain Debuff: +2>`

### `<TP On Gain State: +x>`
- **Escopo**: Skill, State
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao receber state
- **Sintaxe**: `<TP On Gain State: +3>`

### `<TP On Flee Battle: +x>`
- **Escopo**: Skill, State
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao fugir da batalha com sucesso
- **Sintaxe**: `<TP On Flee Battle: +5>`

### `<TP On Lose Battle: +x>`
- **Escopo**: Skill, State
- **Plugin**: Coreto_TpEvents
- **Descricao**: Ganha +x TP ao perder a batalha
- **Sintaxe**: `<TP On Lose Battle: +5>`
