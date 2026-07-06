# Select Plugin Commands

Plugin: VisuMZ_0_MessageCore

## Visao Geral

Comandos de plugin para abrir janelas de selecao de itens do database (Weapons, Armors, Skills) e armazenar o resultado em uma variavel do jogo. Todas as janelas de selecao podem ser abertas simultaneamente com a Message Window aberta.

---

## Select: Weapon

Abre uma janela de selecao de weapons do database.

| Parametro | Tipo | Observacao |
|---|---|---|
| Variable ID | ID da Variavel | Recebe o ID da weapon selecionada. `0` se nenhuma for selecionada |
| Weapon Type ID | ID do Weapon Type | Filtra a lista por tipo de weapon. `0` = sem filtro, lista todas |

### Comportamento

- Apenas weapons que o actor possui no inventario sao listadas.
- Se o jogador cancelar a selecao, a variavel recebe `0`.

---

## Select: Armor

Abre uma janela de selecao de armors do database.

| Parametro | Tipo | Observacao |
|---|---|---|
| Variable ID | ID da Variavel | Recebe o ID da armor selecionada. `0` se nenhuma for selecionada |
| Armor Type ID | ID do Armor Type | Filtra a lista por tipo de armor. `0` = sem filtro |
| Equip Type ID | ID do Equip Type | Filtra a lista por tipo de equipamento. `0` = sem filtro |

### Comportamento

- Apenas armors que o actor possui no inventario sao listadas.
- Os filtros Armor Type e Equip Type podem ser combinados.
- Se o jogador cancelar a selecao, a variavel recebe `0`.

---

## Select: Skill

Abre uma janela de selecao de skills do database.

| Parametro | Tipo | Observacao |
|---|---|---|
| Variable ID | ID da Variavel | Recebe o ID da skill selecionada. `0` se nenhuma for selecionada |
| Actor ID | ID do Actor | Actor de quem obter a lista de skills. `0` = party leader |
| Skill Type ID | ID do Skill Type | Filtra a lista por tipo de skill. `0` = sem filtro |

### Requisitos

- **Requer VisuMZ_1_SkillsStatesCore** instalado e ativo.

### Regras de Listagem

| Regra | Detalhe |
|---|---|
| Skills escondidas | Skills escondidas pelo actor nao sao listadas |
| Skills sem acesso ao Skill Type | Nao sao listadas |
| Filtro por Skill Type | Quando definido, apenas skills do tipo especificado aparecem |

### Comportamento

- Se o jogador cancelar a selecao, a variavel recebe `0`.
