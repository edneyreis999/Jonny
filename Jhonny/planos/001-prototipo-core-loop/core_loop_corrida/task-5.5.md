---
status: pending
---

<task_context>
<domain>engine/ui/feedback</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>task-3.4, task-4.2</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 5.5: Implementar Hover Vermelho-Sangue com 3 Níveis Discretos

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §5 (mecânica de Curva — hover indica risco crescente), §10.risco (clímax visual antes do Risk)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §4.3.1 (linhas 543-570 — "Highlight vermelho-sangue no hover (3 níveis discretos)"), §4.1 (linhas 462-477 — faixas de Picture IDs, 22-24 usados para hover)

## Visão Geral

Quando o jogador passa o mouse (hover) sobre o botão **Furar** (ou **Esquerda**), o jogo deve mostrar um indicador visual **vermelho-sangue** crescente em **3 níveis discretos** baseados na `VAR_TAXA_SUCESSO` (Consciência + P_CENA clamped):

| Nível | Cor vermelho-sangue | Condição | Significado |
|-------|---------------------|----------|-------------|
| 1 (suave) | Opacidade 80, leve | `taxa ≥ 70` | "Vai dar certo, fura!" |
| 2 (médio) | Opacidade 140, pulsante | `40 ≤ taxa < 70` | "Cuidado, é 50/50" |
| 3 (intenso) | Opacidade 220, pisca | `taxa < 40` | "Você vai bater, mas fura se for corajoso" |

Esta task implementa o feedback visual de risco — diferenciando visualmente os botões Safe (sem hover) dos botões Risk (com hover que indica probabilidade).

<requirements>
- Botões Risk (Furar/Esquerda) têm overlay vermelho-sangue quando em hover.
- Botões Safe (Parar/Direita) NÃO têm hover vermelho (permanecem neutros).
- 3 níveis discretos de intensidade baseados em `VAR_TAXA_SUCESSO`.
- Overlay desaparece quando mouse sai do botão.
- Overlays usam Picture IDs 22, 23, 24 (reservados em §4.1 — hover levels 1/2/3).
- Não interfere com z-order dos botões (41-50).
- Implementação reativa ao mouse via `TouchInput` ou Plugin Command do ButtonPicture.
</requirements>

## Subtarefas

- [ ] 5.5.1 Criar/confirmar pictures `race/hover_red_l1.png`, `race/hover_red_l2.png`, `race/hover_red_l3.png` (se faltar, gerar gradientes vermelho-sangue com opacidades 80/140/220)
- [ ] 5.5.2 Decidir abordagem de detecção de hover: Plugin Command ButtonPicture `onHover` OU Script inline com `TouchInput`
- [ ] 5.5.3 Criar CE `EV_HoverRiskButton` (Trigger: Parallel, Switch: `SW_RACE_ACTIVE`)
- [ ] 5.5.4 Implementar detecção: `TouchInput.x` e `TouchInput.y` no retângulo do botão Furar
- [ ] 5.5.5 Calcular nível baseado em `VAR_TAXA_SUCESSO` (3 categorias)
- [ ] 5.5.6 Mostrar `Show Picture: 22/23/24` conforme nível (apenas 1 ativo por vez)
- [ ] 5.5.7 Quando mouse sai do botão, `Erase Picture` 22/23/24
- [ ] 5.5.8 Garantir que botões Safe (Parar/Direita) não disparam hover vermelho
- [ ] 5.5.9 Validação visual com Playtest em cenários diferentes de taxa

## Detalhes de Implementação

### Posicionamento das pictures de hover

| ID | Picture | Tamanho | Z |
|----|---------|---------|---|
| 22 | `hover_red_l1.png` | Igual ao botão Furar | Acima do botão (41-50)? **NÃO** — deve ficar **abaixo** para não bloquear clique |
| 23 | `hover_red_l2.png` | Igual | Idem |
| 24 | `hover_red_l3.png` | Igual | Idem |

> [!warning] Hover NÃO pode bloquear clique do botão
> Picture IDs 22-24 são **menores** que 41-50 (botões). Portanto ficam **atrás** na ordem z — bom, não interceptam clique. Hover é apenas visual.
>
> Se você usar IDs 51+ para hover, vai bloquear o botão.

### Abordagem de detecção de hover

**Opção A — Plugin Command ButtonPicture (recomendado):**

O plugin ButtonPicture (ativado em task-1.3) pode expor `onHover` callback via Plugin Command. Verificar documentação. Se sim:

```
Plugin Command: ButtonPicture > On Hover
  buttonId: 42   # botão Furar
  callCommonEvent: EV_HoverRiskButton
```

**Opção B — Script inline com `TouchInput`:**

Sem callback do plugin, usar um CE paralelo com `TouchInput.x`/`TouchInput.y`:

```javascript
// EV_HoverRiskButton (Trigger: Parallel, SW: SW_RACE_ACTIVE)
// Script inline para detectar hover no botão Furar (ID 42)

const btnX = 200;  // posição x do botão (a definir em task-4.2)
const btnY = 500;  // posição y do botão
const btnW = 100;  // largura
const btnH = 80;   // altura

const tx = TouchInput.x;
const ty = TouchInput.y;
const isHovering = (tx >= btnX && tx <= btnX + btnW && ty >= btnY && ty <= btnY + btnH);

// Taxa atual
const taxa = $gameVariables.value(107);

// Determinar nível (0 = sem hover, 1/2/3)
let nivel = 0;
if (isHovering) {
  if (taxa >= 70) nivel = 1;
  else if (taxa >= 40) nivel = 2;
  else nivel = 3;
}

$gameVariables.setValue(115, nivel);  // VAR_HOVER_LEVEL (reservar ID 115)
```

Após o Script, um `If` mostra/oculta pictures:

```
If VAR_HOVER_LEVEL == 0
  Erase Picture: 22
  Erase Picture: 23
  Erase Picture: 24
End
If VAR_HOVER_LEVEL == 1
  Erase Picture: 23, 24
  Show Picture: 22, "race/hover_red_l1", (btnX, btnY), (100%, 100%), 80, Normal
End
If VAR_HOVER_LEVEL == 2
  Erase Picture: 22, 24
  Show Picture: 23, "race/hover_red_l2", (btnX, btnY), (100%, 100%), 140, Normal
End
If VAR_HOVER_LEVEL == 3
  Erase Picture: 22, 23
  Show Picture: 24, "race/hover_red_l3", (btnX, btnY), (100%, 100%), 220, Normal
End

Wait: 1 frame
Jump to Label: start  # loop paralelo
```

### Variável `VAR_HOVER_LEVEL` (reserva ID 115)

Adicionar ao `System.json` (subtarefa similar à task-3.2.1):

| ID | Variável | Faixa | Descrição |
|----|----------|-------|-----------|
| 115 | `VAR_HOVER_LEVEL` | 0..3 | Nível atual do hover vermelho (0 = sem hover) |

> [!note] Reserva de ID 115
> Conforme tabela §3.1, IDs 101-113 estão reservados. 114 será `VAR_LAST_RENDERED_INDEX` (task-3.2.1). 115+ está livre para extensões como esta.

### Por que 3 níveis discretos e não gradiente contínuo?

Especificado pelo spec de domínio: feedback deve ser **legível e decisivo**. Gradiente contínuo (lerp de cor por taxa) seria:

- Mais difícil de perceber diferenças (vermelho 60% vs 65% é quase igual).
- Mais custoso de implementar (Script com interpolação).
- Esteticamente menos marcante.

3 níveis discretos com **cores e opacidades significativamente diferentes** dão ao jogador uma leitura instantânea: "esse nível é seguro" / "esse é 50/50" / "esse é suicídio".

### Tabela de níveis (decisão de design)

| Nível | Taxa | Opacidade | Sensação |
|-------|------|-----------|----------|
| 0 (sem hover) | — | — | Botão neutro |
| 1 (suave) | ≥ 70% | 80/255 (~31%) | "Vai lá" |
| 2 (médio) | 40-69% | 140/255 (~55%) | "Pensa bem" |
| 3 (intenso) | < 40% | 220/255 (~86%) | "Você vai morrer" |

Os thresholds (70/40) são **calibráveis** após playtest (task-7.x).

### Por que apenas botões Risk têm hover vermelho?

- **Risk** é a ação com **variância** (pode falhar). Hover mostra a probabilidade.
- **Safe** é **determinístico** (sempre funciona). Hover não adiciona informação — apenas distrai.

Esta diferenciação visual ajuda o jogador a internalizar a economia de risco.

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Hover com Picture ID > 50 (acima dos botões) | Hover bloqueia clique | Usar IDs 22-24 (abaixo) |
| Detectar hover sem `Wait 1 frame` | Loop infinito trava o jogo | Sempre `Wait 1 frame` no CE paralelo |
| Esquecer de `Erase Picture` quando mouse sai | Overlay fica para sempre | Sempre apagar todos no `If nivel == 0` |
| Aplicar hover no botão Parar/Direita | Indicador de risco no Safe (errado) | Verificar ID do botão (41/43, não 42/44) |
| Usar gradiente contínuo | Difícil de ler | 3 níveis discretos |
| Atualizar sem checar `SW_RACE_ACTIVE` | Hover ativo fora da corrida | CE paralelo com switch `SW_RACE_ACTIVE` |
| Threshold mal calibrado (ex.: nível 3 só com taxa < 5%) | Indicador nunca aparece em níveis altos | Calibrar 70/40 conforme tabela acima |

### Performance

- CE paralelo roda 1 vez por frame (60 Hz).
- Custo por frame: 1 Script inline + 3-4 Ifs + 1-2 Show/Hide Picture = baixo.
- Acceptable para MZ. Não precisa otimizar.

## visual_validation

Ao concluir esta task (com 3.4, 4.2 prontos):

1. Inicie a corrida. Botões aparecem.
2. Passe o mouse sobre o botão **Parar** (Safe).
3. **Nenhum overlay vermelho** aparece (comportamento correto).
4. Force `VAR_TAXA_SUCESSO = 80` (alta): `$gameVariables.setValue(107, 80)` no F12.
5. Passe o mouse sobre o botão **Furar** (Risk).
6. **Overlay vermelho suave (nível 1, ~31% opacidade)** aparece sobre o botão.
7. Tire o mouse. Overlay desaparece.
8. Force `VAR_TAXA_SUCESSO = 50`: clique funciona, hover mostra **nível 2 (~55% opacidade)**.
9. Force `VAR_TAXA_SUCESSO = 20`: hover mostra **nível 3 (~86% opacidade)** — claramente perigoso.
10. Tente clicar no botão com overlay: clique **funciona** (overlay não bloqueia).
11. Após Safe/Risk (cena avança), hover recalcula com nova taxa automaticamente.
12. Console F12 sem erros.

## Critérios de Sucesso

- [ ] Hover vermelho aparece apenas no botão Furar/Esquerda (não no Parar/Direita).
- [ ] 3 níveis visivelmente distintos (suave/médio/intenso).
- [ ] Níveis seguem thresholds: ≥70 suave, 40-69 médio, <40 intenso.
- [ ] Overlay desaparece quando mouse sai do botão.
- [ ] Overlay não bloqueia cliques (Picture ID < 41).
- [ ] CE paralelo respeita `SW_RACE_ACTIVE` (não roda fora da corrida).
- [ ] `VAR_HOVER_LEVEL` (ID 115) registrada em `System.json`.
- [ ] Sem erros de sintaxe nos eventos.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo em todos os 3 níveis.

## Fora de Escopo

- Animação pulsante no nível 2/3 (fora do MVP, pode adicionar em v2).
- Som de hover (fora do escopo — áudio só em ações efetivas, task-7.1).
- Hover em touch (mobile/touch) — fora do MVP.
- Hover para outros elementos (HUD, sinal) — não necessário.
- Calibração dos thresholds via playtest (deixar para task-7.x se necessário).
