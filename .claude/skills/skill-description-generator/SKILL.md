---
name: skill-description-generator
description: "Gera descricoes tecnicas para skills (Skills.json) e TP Modes (VisuMZ_2_EnhancedTpSystem). Use PROATIVAMENTE quando: criar/editar skills de combate, campos description estiverem vazios/desatualizados, ou o usuario pedir descricoes de skills ou TP Modes. OBRIGATORIO: toda edicao do campo description de uma skill de combate deve passar por esta skill, nunca escrever descricoes manualmente. Triggers: 'descricao', 'gerar descricao', 'atualizar descricao', 'description', 'tp mode'."
---

# Skill Description Generator — Daratrine

Voce e um game designer tecnico gerando descricoes de skills para o sistema de combate ATB MOBA de Daratrine.

## Por que isso importa

A descricao e a unica informacao que o jogador tem para tomar decisoes em combate ATB em tempo real. Precisa ser tecnica, direta e completa — o jogador entende em 1 segundo e sabe exatamente o que a skill faz mecanicamente. Descricoes narrativas ou vagas = jogador toma decisao errada.

## Arquivos

- **Skills.json**: `/Users/edney/projects/coreto/projectX/frontend/data/Skills.json`
- **GDD Combate**: `/Users/edney/projects/coreto/projectX/docs/GDD/6-combate/`

## Formato Obrigatorio

- Texto corrido (sem quebras de linha, bullets ou listas)
- Maximo ~130 caracteres total
- Sem narrativa, sem adjetivos subjetivos, sem pontuacao desnecessaria
- Tecnico e direto ao ponto

## O que INCLUIR

- Scope (alvo unico, area, aliado, si mesmo)
- Cast time (se > 1s ou relevante para decisao)
- Formula de dano como multiplicador MOBA (ex: "3x ATK")
- Armor Penetration %
- Crit rate modifier (se diferente do padrao)
- Hit rate modifier (se negativo/penalidade)
- Efeitos de states aplicados (stun, blind, slow, mark, etc.)
- Mecanicas especiais: unblockable, nao interrompivel, multi-hit, alvos aleatorios
- Dano condicional (vs stunned, vs marked, escala com HP baixo)
- Life steal %
- Gera recurso (nome do recurso, SEM valor numerico)
- Self-buffs/debuffs (ATK+, DEF-, etc.)
- Cura (escopo e base da formula)

## O que NAO INCLUIR

- Valores de TP (ganho/gasto) — estao em menu separado na UI
- MP cost, ATB Cast Gauge %, Success rate, Element ID
- Variance, Common Event, Animation ID, Speed value
- Sistemas passivos (Embalo da Filena, Postura After Gauge do Mhordred)
- Detalhes de implementacao JS ou codigo
- Nome do personagem na descricao (ja visivel na UI)

---

## Tabelas de Traducao

### Scope (campo `scope`)

| Valor | Traduzir para |
|-------|--------------|
| 1 | "alvo unico" |
| 2 | "todos inimigos" ou "em area" |
| 6 | "X alvos aleatorios" |
| 7 | "aliado" |
| 8 | "todos aliados" ou "time" |
| 11 | omitir (self-buff auto-entendido pelo contexto) |

### Damage Formula (campo `damage.formula`)

| Padrao | Traduzir para |
|--------|--------------|
| Numero simples (ex: 3, 1.88) | "Xx ATK" |
| Expressao com a.def | "cura baseada em DEF" ou "baseada em DEF" |
| 0 | nao mencionar dano |

### Notetags — Extrair do campo `note`

| Notetag | Extrair como |
|---------|-------------|
| `<Cast Time: Xs>` | "cast Xs" (se > 1s ou relevante) |
| `<Armor Penetration: X%>` | "X% pen" |
| `<Armor Pen: X%>` | "X% pen" |
| `<Modify Critical Rate: +X%>` | "crit +X%" |
| `<Modify Hit Rate: -X%>` | "precisao -X%" |
| `<Unblockable>` | "imbloqueavel" |
| `<ATB Cannot Be Interrupted>` | "nao interrompivel" |
| `<ATB Interrupt>` | "interrompe conjuracao" |
| `<Repeat Hits: X>` | "X hits" |
| `<Target: X Random Enemies>` | "X alvos aleatorios" |
| `<HP Life Steal Physical Hit: +X%>` | "X% life steal" |
| `<Gain TP: +X>` | "gera [recurso]" (SEM valor numerico) |
| `<Spend TP: X>` | NAO mencionar |

Para JS Pre-Damage condicional no note, mencionar a condicao (ex: "+25% vs marcados", "+30% vs atordoados").

### Effects (campo `effects`)

| Code | Significado | Traduzir |
|------|------------|---------|
| 31 | Remove buff | "remove buff [stat]" |
| 32 | Add buff | "+[stat]" (ATK, DEF, etc.) |
| 33 | Add debuff no alvo | "reduz [stat] do alvo" |

O campo `effects` e um array de objetos. Cada objeto tem `code` (numero), `dataId` (stat ID) e `value1`/`value2`. Para buffs/debuffs (code 32/33), `dataId` mapeia: 0=MaxHP, 1=MaxMP, 2=ATK, 3=DEF, 4=MAT, 5=MDF, 6=AGI, 7=LUK. `value1` = turnos, `value2` = stacks.

### Recurso por Personagem (range de ID)

| Range de IDs | Personagem | Recurso |
|-------------|-----------|---------|
| 47-55 | Filena | Momentum |
| 63-73 | Kilin | Guarda |
| 75-86 | Mhordred | Furia |
| 89-99 | Thorin | Foco |

### States Comuns (para traduzir apply state)

| Efeito | Traduzir |
|--------|---------|
| Atordoamento | "atordoa" / "stun" |
| Cegueira | "cega" / "blind" |
| Slow | "lentidao" / "slow" |
| Marcacao | "marca o alvo" |
| Muralha Pessoal | "barreira no aliado" |
| Bodyguard | "intercepta ataques do aliado" |
| Postura Agressiva | "ATK+30%, DEF-20%" |
| Postura Fluida | "contra-ataca automatico" |
| Sede de Sangue | "life steal em ataques fisicos" |
| Concentracao | "concentracao absoluta" |

---

## Padroes por Tipo de Skill

Use o padrao que melhor se aplica. Nao precisa seguir rigidamente — adapte ao conteudo real da skill.

### Dano com Gerador (tem `<Gain TP>`, sem cast longo)
`[Scope] rapido — [formula]x ATK. Gera [recurso]`
> "Tiro rapido de alvo unico — 1.88x ATK. Gera Foco"

### Dano com Spender (tem `<Spend TP>`, cast medio/longo)
`[Scope] — cast Xs. [formula]x ATK [mechanics]`
> "Disparo lento (3.4s) de alvo unico — 3x ATK com crit +10%. Gera Foco"

### Dano AoE
`Todos inimigos — [formula]x ATK [mechanics]. Cast Xs`
> "Todos inimigos — 9.39x ATK. Cast 4.8s"

### Dano Multi-hit / Random
`[Scope] — [formula]x ATK [X hits / X alvos aleatorios]. Cast Xs`
> "5 alvos aleatorios — 7.51x ATK. Cast 3.4s"

### Buff/Debuff Self (scope 11, formula 0)
`[Efeito principal]. [Duracao / mecanica complementar]`
> "Postura ofensiva: ATK+30%, DEF-20%, ataques nao erram. Perde HP por turno"

### Cura Aliado
`Cura [scope] — [base da formula]. Cast Xs`
> "Cura aliado — baseada em DEF. Cast 1s"

### Protecao / Barreira
`[Efeito de protecao]. Cast Xs`
> "Barreira no aliado que absorve o proximo ataque. Cast 1s"

### Counter
`[Trigger]. Gera [recurso]`
> "Contra-ataca automaticamente ao ser atacado. Gera Furia"

---

## Fluxo de Execucao

1. Ler a skill do Skills.json (objeto JSON completo, use o campo `id` para localizar)
2. Identificar o tipo de skill (dano, buff, cura, protecao, counter) pelos campos: scope, damage.formula, note (Gain/Spend TP), effects
3. Determinar o personagem pelo range de ID para saber o nome do recurso
4. Extrair mecanicas das notetags e effects usando as tabelas acima
5. Montar a descricao seguindo o padrao do tipo identificado
6. Validar: ~130 chars, sem valores de TP, tecnica, mecanicamente completa
7. Editar APENAS o campo `description` no Skills.json — nao alterar nenhum outro campo

### Batch
Se o usuario pedir para processar multiplas skills, iterar sobre cada uma individualmente. Priorizar skills com description vazia ou desatualizada. Apresentar as descricoes geradas para validacao antes de editar em batch.

### Skill Nova
Se estiver criando uma skill nova, gerar a descricao como parte do processo, apos definir todos os campos mecanicos (formula, scope, notetags, effects).

---

## TP Mode Descriptions

Gera descricoes tecnicas para TP Modes do plugin VisuMZ_2_EnhancedTpSystem.

### Arquivo

- **plugins.js**: `/Users/edney/projects/coreto/projectX/frontend/js/plugins.js`
- Plugin: `VisuMZ_2_EnhancedTpSystem`
- Campo: `parameters["TpMode:arraystruct"]` — array de JSON strings (tripla serializacao: plugins.js -> JSON array -> JSON string por mode)
- Descricao fica no campo `Help:json` de cada TP Mode
- Suporta `%1` como placeholder para o nome do TP (substituido em runtime)

### Como localizar

```python
# 1. Parse plugins.js -> JSON array de plugins
# 2. Encontrar plugin "VisuMZ_2_EnhancedTpSystem"
# 3. params = plugin["parameters"]["TpMode:arraystruct"] -> JSON.parse -> array de strings
# 4. Cada string -> JSON.parse -> objeto com Name:str, Help:json, etc.
# 5. Localizar por Name:str (ex: "Momentum", "Guarda", "Furia", "Foco")
```

### TP Modes por Personagem

| Personagem | TP Mode | Indice | Recurso |
|-----------|---------|--------|---------|
| Filena | Momentum | 30 | Momentum |
| Kilin | Guarda | 31 | Guarda |
| Mhordred | Furia | 32 | Furia |
| Thorin | Foco | 33 | Foco |

### Formato Obrigatorio

- Texto corrido (pode ter `\n` para quebra, mas sem bullets ou listas)
- Maximo ~130 caracteres total
- Sem narrativa, sem adjetivos subjetivos
- Tecnico e direto ao ponto
- Usar `%1` como placeholder para o nome do recurso TP

### Tabela de Traducao — Formulas de Geracao

| Campo | Significado | Traduzir como |
|-------|------------|---------------|
| `TpRegen:str` > 0 | Regeneracao passiva por turno | "regen X/turno" ou "acumula passivamente" |
| `TakeHpDmg:str` > 0 | Ganha TP ao receber dano HP | "ganha ao receber dano" |
| `DealHpDmg:str` > 0 | Ganha TP ao causar dano HP | "ganha ao causar dano" |
| `CriticalHit:str` > 0 | Ganha TP ao critico | "ganha ao acertar critico" |
| `Evasion:str` > 0 | Ganha TP ao esquivar | "ganha ao esquivar" |
| `UseSkill:str` > 0 | Ganha TP ao usar skill | "ganha ao usar skills" |
| `Initial:str` > 0 | TP inicial no comeco da batalha | "comeca com TP" |
| `WinBattle:str` > 0 | Ganha TP ao vencer batalha | (raramente relevante p/ descricao) |

### Tabela de Traducao — Propriedades Gerais

| Campo | Traduzir |
|-------|---------|
| `Preserve:eval` = true | "persiste entre batalhas" |
| `Preserve:eval` = false | (nao mencionar, e o padrao) |
| `MaxFormula` com `Math.min(X, ...)` | "max X, escala com nivel" |
| `MaxFormula` = numero fixo | (nao mencionar se for 100, e padrao) |
| `MultiplierTCR:num` != 1.0 | "TCR Xx" |

### Padroes por Tipo de TP Mode

#### Acumulador Passivo (regen + preserve)
`%1 acumula passivamente com regen por turno. Persiste entre batalhas`
> Momentum: regen 5/turno, preserve ON

#### Defensivo (takeHpDmg principal)
`%1 acumulado ao receber dano. Regen X/turno`
> Guarda: TakeHpDmg=Math.floor(value/20), regen 3

#### Agressivo (dealHpDmg + crit)
`%1 acumulado ao causar dano e acertar criticos. Regen X/turno`
> Furia: DealHpDmg=3, CritHit=5, TakeHpDmg=Math.floor(value/10)

#### Concentracao (regen lento + crit + preserve)
`%1 acumulado lentamente com regen. Criticos geram recurso extra. Persiste entre batalhas`
> Foco: regen 2, CritHit=10, preserve ON

### Fluxo de Execucao — TP Mode

1. Parsear `plugins.js` e localizar o TP Mode pelo `Name:str`
2. Extrair todas as formulas de geracao nao-zero
3. Extrair propriedades gerais (Preserve, MaxFormula, TCR)
4. Identificar o tipo (acumulador passivo, defensivo, agressivo, concentracao)
5. Montar descricao tecnica usando o padrao correspondente
6. Validar: ~130 chars, tecnica, sem valores numericos de TP
7. Editar APENAS o campo `Help:json` — nao alterar nenhum outro campo

### Batch TP Mode
Se o usuario pedir para processar multiplos TP Modes, iterar sobre cada um individualmente. Apresentar as descricoes geradas para validacao antes de editar em batch.
