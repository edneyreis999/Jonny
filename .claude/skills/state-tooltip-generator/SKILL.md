---
name: state-tooltip-generator
description: "Gera tooltips tecnicos para States do RPG Maker MZ usando o plugin VisuStella State Tooltips. Use quando: criar/editar states em States.json, o usuario pedir tooltips de states, ou o campo note nao tiver <State Tooltip Description>. Triggers: 'tooltip do state', 'gerar tooltip', 'atualizar tooltip', 'state tooltip', editar campo note em States.json, ou criar novo state que precise de tooltip. Use PROATIVAMENTE quando o usuario estiver trabalhando em states de combate e o note nao tiver <State Tooltip Description>."
---

# State Tooltip Generator — Daratrine

Voce e um game designer tecnico gerando tooltips de states para o sistema de combate ATB MOBA de Daratrine, usando o plugin VisuStella State Tooltips.

## Por que isso importa

O tooltip de state aparece ao passar o mouse sobre o icone de state na HUD de batalha. E a unica informacao rapida que o jogador tem para entender o que aquele state faz mecanicamente. Precisa ser tecnico, direto e completo — o jogador entende em 1 segundo e sabe como agir. Tooltips vagos ou vazios = jogador nao entende o que esta acontecendo.

## Arquivos

- **States.json**: `projectX/frontend/data/States.json`
- **Analise do plugin**: `projectX/docs/rpg-maker-for-ia/docs-visustella/battle-plugins/visustella-state-tooltip/analise-plugin.md`

## Formato Obrigatorio

- Texto corrido (sem quebras de linha, bullets ou listas)
- Maximo ~130 caracteres total
- Sem narrativa, sem adjetivos subjetivos, sem pontuacao desnecessaria
- Tecnico e direto ao ponto
- Duracao NAO incluir — o plugin calcula automaticamente baseado em autoRemovalTiming
- Usar `<State Tooltip Description>` (nao `<Help Description>`)

## Notetag do Plugin

O tooltip e injetado no campo `note` do state via notetag:

```
<State Tooltip Description>
 texto do tooltip aqui
</State Tooltip Description>
```

States de sistema, placeholders e separadores devem receber `<Exclude From Tooltips>`.

## O que INCLUIR

- Efeito principal do state (o que faz mecanicamente)
- Valores numericos quando relevantes (porcentagens, multiplicadores)
- Stats modificados (ATK+30%, DEF-20%, etc.)
- Comportamentos especiais (contra-ataque, life steal, reflexao)
- Condicoes de ativacao (para passivos condicionais)
- Interacoes com outros sistemas (bodyguard, ATB, momentum)
- Immunities e resistances

## O que NAO INCLUIR

- Duracao em turnos/acoes — automatica pelo plugin
- Nome do state — ja visivel no tooltip
- Icon — ja visivel no tooltip
- Detalhes de implementacao JS ou codigo
- Narrativa ou lore

---

## Tabelas de Traducao

### Trait Codes → Texto de Tooltip

| Code | Grupo | dataId → Nome | Formula |
|------|-------|---------------|---------|
| 11 | Element Rate | 1=Normal, 2=Fogo, 3=Gelo, 4=Trovao, 5=Agua, 6=Terra, 7=Vento, 8=Sagrado, 9=Sombra | `(value-1)*100` → "Fogo -50%" |
| 21 | Param Rate | 0=MaxPV, 1=MaxPM, 2=ATK, 3=DEF, 4=MAT, 5=MDF, 6=AGI, 7=LUK | `(value-1)*100` → "ATK+30%" |
| 22 | XParam | 0=Precisao, 1=Evasao, 2=Critico, 3=CritDef, 4=MagEvasao, 5=MagReflexao, 6=Contra, 7=HPRegen, 8=MPRegen, 9=TPRegen | `value*100` para HIT/EVA/CRI, `value*100` para regens → "Precisao -30%", "HPRegen +10%" |
| 23 | SParam | 0=Encontro, 1=Drop, 2=Farmacia, 3=MPcost, 4=TPcharge, 5=DebuffDur, 6=Recuperacao | `value*100` → "MPcost 25%" |
| 31 | Attack Element | dataId → nome do elemento | "Ataques sao de [elemento]" |
| 32 | Attack State | dataId → nome do state | "Aplica [state] ao atacar" |
| 42 | State Resist | dataId → nome do state | "Imune a [state]" |
| 43 | State Immune | dataId → nome do state | "Imune a [state]" |
| 61 | Action Speed | value → modificador | "Velocidade +[value]" |

### Restriction Codes

| Valor | Traduzir para |
|-------|---------------|
| 0 | (nao mencionar) |
| 1 | "nao pode agir" |
| 2 | "nao pode se mover" |
| 3 | "ataca aliados" |
| 4 | "nao pode agir" |

### Notetags do SkillsStatesCore/BattleCore → Texto

| Notetag | Extrair como |
|---------|-------------|
| `<Counter Rate: X%>` + `<Counter Skill: Y>` | "Contra-ataca automaticamente" |
| `<Counter Rate: X%>` + `<Counter Condition>` | "Contra-ataca quando [condicao]" |
| `<HP Life Steal Physical Hit: +X%>` | "Rouba X% do dano como PV" |
| `<JS HP Slip Damage>` | Ler o JS para calcular % do PV |
| `<JS Pre-Damage as Target>` | "Reduz dano recebido em X%" |
| `<Armor Penetration: X%>` | "X% penetracao de armadura" |
| `<JS Critical Rate AS USER>` | "Critico +X%" |
| `<Always Hit>` | "Nao erra" |
| `<Doom>` | "Morte apos X turnos" |
| `<Auto Life: X%>` | "Revive com X% PV ao morrer" |
| `<JS Passive Condition>` | Ler condicao para descrever requisito |
| `<ATB Cannot Be Interrupted>` | "Imune a interrupcao" |
| `<TP On Enemy Death: +X>` | "+X [recurso] ao eliminar" |
| `<TP On Battle Win: +X>` | "+X [recurso] ao vencer" |

### Recurso por Personagem (range de State IDs)

| Range | Personagem | Recurso |
|-------|-----------|---------|
| 64-74 | Filena | Momentum |
| 76-86 | Kilin | Guarda |
| 87-90 | Mhordred | Furia |
| 91-98 | Thorin | Foco |

### States de Sistema → Excluir

IDs que devem receber `<Exclude From Tooltips>`:
2, 3, 11, 14, 19, 28, 29, 30, 32-39, 40, 43-49, 50, 52-54, 55, 59, 60, 62-63, 64, 72-75, 76, 83, 87, 91, 96

---

## Padroes por Tipo de State

Use o padrao que melhor se aplica. Nao precisa seguir rigidamente — adapte ao conteudo real do state.

### CC (Crowd Control)
`[efeito]. [valor se relevante]`
> "Nao pode agir" / "Reduz precisao em 30%" / "Alvo ataca aliados"

### Buff de Stats
`[stats+/-]. [efeito extra]`
> "ATK+30%, AGI+30%, DEF-30%" / "ATK+30%, DEF-20%. Nao erra. -3% PV/turno"

### Buff Elemental
`[stats+]. Ataques sao de [elemento]. [elemento] -X%`
> "ATK+10%. Ataques sao de fogo. Fogo -50%"

### DOT (Damage Over Time)
`[dano por unidade de tempo]`
> "Causa 5% do PV maximo por turno"

### HOT (Heal Over Time)
`[cura por unidade de tempo]`
> "Regenera 10% PV por turno"

### Buff Mecanico
`[comportamento]. [detalhe]`
> "Contra-ataca automaticamente" / "Reduz todo dano recebido em 50%"

### Barreira / Protecao
`[absorcao ou reducao]. [detalhe]`
> "Reduz todo dano recebido em 50%" / "Kilin absorve 50% do dano do aliado"

### Passivo Condicional
`[efeito] com [condicao]`
> "DEF+5% com 30+ Guarda" / "30% penetracao com 76+ Foco"

### Counter
`[trigger]. [acao]`
> "Contra-ataca com Ripostar" / "Contra-ataca ao interceptar dano"

### Auto-Life / Doom
`[efeito]`
> "Revive com 100% PV ao morrer" / "Morte apos 1 turno"

### Marcacao
`[bonus contra alvo marcado]`
> "Marcado: +10% crit, +15% precisao contra"

### Passivo de Recurso
`[ganho]. [condicao]`
> "+8 Foco ao eliminar inimigo" / "+15 Foco ao vencer batalha"

---

## Fluxo de Execucao

1. Ler o state do States.json (objeto JSON completo, use o campo `id` para localizar)
2. Verificar se e um state de sistema/placeholder → se sim, adicionar `<Exclude From Tooltips>`
3. Verificar se ja tem `<State Tooltip Description>` no note → se sim, NAO sobrescrever sem confirmacao
4. Identificar a categoria do state (CC, buff, DOT, mecanico, passivo) pelos campos: traits, restriction, notetags
5. Determinar o personagem pelo range de ID para saber o nome do recurso (se aplicavel)
6. Extrair efeitos dos traits usando a tabela de trait codes
7. Extrair mecanicas das notetags usando a tabela de notetags
8. Montar o tooltip seguindo o padrao do tipo identificado
9. Validar: ~130 chars, sem duracao, tecnico, mecanicamente completo
10. Inserir `<State Tooltip Description>` no campo `note` do state — preservar notetags existentes

### Insercao no note

Adicionar a notetag ANTES das notetags existentes, separada por linha:

```
<State Tooltip Description>
 texto do tooltip aqui
</State Tooltip Description>
<notetags existentes...>
```

### Batch
Se o usuario pedir para processar multiplos states, iterar sobre cada um individualmente. Priorizar states sem `<State Tooltip Description>`. Apresentar os tooltips gerados para validacao antes de editar em batch.

### State Novo
Se estiver criando um state novo, gerar o tooltip como parte do processo, apos definir todos os campos mecanicos (traits, notetags, restriction, autoRemovalTiming).

### States que NAO precisam de tooltip
- States de sistema com `<Exclude From Tooltips>`
- Placeholders e separadores
