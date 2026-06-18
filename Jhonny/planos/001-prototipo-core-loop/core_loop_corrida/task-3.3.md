---
status: implemented-pending-playtest
---

<task_context>
<domain>engine/gameplay/renderer</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-3.2</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 3.3: Criar `EV_RenderSinal` + `EV_RenderCurva`

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §4 (Cena de Sinal), §5 (Cena de Curva)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §4.1 (linhas 463-477), §4.2 (linhas 478-516), §5.1 (linhas 626-690)

## Visão Geral

Criar dois Common Events — `EV_RenderSinal` e `EV_RenderCurva` — que fazem o `Show Picture` dos elementos visuais específicos de cada tipo de cena. São chamados pelo `EV_RaceRenderer` (task 3.2) quando uma nova cena é detectada.

<requirements>
- Common Event `EV_RenderSinal` criado com trigger "Call".
- Common Event `EV_RenderCurva` criado com trigger "Call".
- Cada um faz `Show Picture` dos backgrounds e elementos específicos.
- Respeita as faixas de Picture IDs (Guia §4.1): fundos 1-9, elementos intermediários 10-19, HUD 20-29, overlays 30-39, botões 41-50.
- Não cria botões clicáveis (feito na task 4.2).
- Não toca áudio (feito na task 7.1).
</requirements>

## Subtarefas

- [ ] 3.3.1 **(JSON-automatizável)** Criar `EV_RenderSinal` com trigger "Call" (`trigger: 0`)
- [ ] 3.3.2 Adicionar `Show Picture: 1` (bg_sinal) + `Show Picture: 10` (opala_pov) + `Show Picture: 11` (sinal_red) — código `231`
- [ ] 3.3.3 **(JSON-automatizável)** Criar `EV_RenderCurva` com trigger "Call" (`trigger: 0`)
- [ ] 3.3.4 Adicionar `Show Picture: 1` (bg_curva) + `Show Picture: 10` (opala_pov) + `Show Picture: 11` (placa_curva_dir) + `Show Picture: 12` condicional (`curva_do_diabo_placa` se `SW_IS_CURVA_DIABO`) — código `231` + If `111`/`412`
- [ ] 3.3.5 (Opcional) Animação de fade-in dos elementos (`Move Picture` `232` com opacity 0→255 em 6 frames)
- [ ] 3.3.6 Validar JSON com `python -m json.tool`
- [ ] 3.3.7 Playtest MZ obrigatório para confirmar que todas as pictures carregam sem erro

## Automação via JSON (caso de uso ideal — validado na Fase 2)

> **Aprendizado [[fase2/retrospectiva]]:** `EV_Preload` (Fase 2) usou exclusivamente códigos `231`/`230`/`235` via Python+json com sucesso total. Esta task usa o mesmo conjunto de códigos — **automatização direta é o caminho recomendado.**

### Pré-condições já satisfeitas (não recriar)
- [x] Pictures já existem em `Jhonny/img/pictures/race/`:
  - `bg_sinal.png`, `bg_curva.png` (fundo)
  - `opala_pov.png` (elemento intermediário)
  - `sinal_red.png`, `placa_curva_dir.png` (sinal/placa)
  - `curva_do_diabo_placa.png` (curva do diabo)
- [x] Picture em subpasta usa nome sem extensão: `race/bg_sinal` (confirmado em F2)
- [x] Códigos MZ `231` (Show Picture) validados em `EV_Preload`

### Estrutura JSON — `Show Picture` (código 231)

```json
{
  "code": 231,
  "indent": 0,
  "parameters": [
    1,                    // picture ID (1-9 fundo, 10-19 intermediário)
    "race/bg_sinal",      // nome (subpasta/nome sem extensão)
    0,                    // origin: 0=Upper Left, 1=Center
    0,                    // 0=posição direta, 1=por variável
    0,                    // x
    0,                    // y
    100,                  // scaleX %
    100,                  // scaleY %
    255,                  // opacity (0-255)
    0                     // blend mode (0=Normal, 1=Add, 2=Multiply, 3=Screen)
  ]
}
```

### Snippet Python — gerar os dois CEs

```python
import json, pathlib
ce_path = pathlib.Path("Jhonny/data/CommonEvents.json")
ces = json.loads(ce_path.read_text())

# EV_RenderSinal
ces.append({
  "id": len(ces),
  "list": [
    {"code": 231, "indent": 0, "parameters": [1, "race/bg_sinal", 0, 0, 0, 0, 100, 100, 255, 0]},
    {"code": 231, "indent": 0, "parameters": [10, "race/opala_pov", 0, 0, 0, 0, 100, 100, 255, 0]},
    {"code": 231, "indent": 0, "parameters": [11, "race/sinal_red", 0, 0, 308, 80, 100, 100, 255, 0]},
    {"code": 0, "indent": 0, "parameters": []}
  ],
  "name": "EV_RenderSinal",
  "trigger": 0,
  "switchId": 1,
  "autoErase": false,
  "conditionString": ""
})

# EV_RenderCurva
ces.append({
  "id": len(ces),
  "list": [
    {"code": 231, "indent": 0, "parameters": [1, "race/bg_curva", 0, 0, 0, 0, 100, 100, 255, 0]},
    {"code": 231, "indent": 0, "parameters": [10, "race/opala_pov", 0, 0, 0, 0, 100, 100, 255, 0]},
    {"code": 231, "indent": 0, "parameters": [11, "race/placa_curva_dir", 0, 0, 600, 100, 100, 100, 255, 0]},
    # If SW_IS_CURVA_DIABO == ON → mostrar placa especial (Picture ID 12)
    {"code": 111, "indent": 0, "parameters": [1, 106, 0]},  # type=1 switch, switchId=106 (SW_IS_CURVA_DIABO), value=ON
    {"code": 231, "indent": 1, "parameters": [12, "race/curva_do_diabo_placa", 0, 0, 308, 80, 100, 100, 255, 0]},
    {"code": 412, "indent": 0, "parameters": []},
    {"code": 0, "indent": 0, "parameters": []}
  ],
  "name": "EV_RenderCurva",
  "trigger": 0,
  "switchId": 1,
  "autoErase": false,
  "conditionString": ""
})

ce_path.write_text(json.dumps(ces, indent=4, ensure_ascii=False))
```

## Detalhes de Implementação

### Faixas de Picture IDs (Guia §4.1)

| Faixa | Uso                              | Exemplos                            |
| ----- | -------------------------------- | ----------------------------------- |
| 1-9   | Fundo de cena                    | `bg_sinal`, `bg_curva`              |
| 10-19 | Elementos intermediários         | `opala_pov`, `sinal_poste`, `placa_curva` |
| 20-29 | HUD                              | `bar_consciencia_bg`, `bar_consciencia_fill`, `timer_bar` |
| 30-39 | Overlays de feedback             | `flash_overlay`, `crash_particles`  |
| 41-50 | Botões clicáveis                 | `btn_parar`, `btn_furar`, `btn_direita`, `btn_esquerda` |
| 51-60 | Texto (via TextPicture) e ícones | `txt_pista_nome`, `icon_tentativa`  |

### Estrutura do `EV_RenderSinal`

```
# EV_RenderSinal (Trigger: Call)
# Renderiza fundo + elementos da cena de Sinal

# Fundo (asfalto + cruzamento)
Show Picture: 1, "race/bg_sinal", Upper Left, (0, 0), 100%, 100%, 255, Normal

# Opala em POV (primeira pessoa — capô + para-brisa)
Show Picture: 10, "race/opala_pov", Upper Left, (0, 0), 100%, 100%, 255, Normal

# Sinal luminoso vermelho (posteriormente pulsará via animação)
Show Picture: 11, "race/sinal_red", Upper Left, (308, 80), 100%, 100%, 255, Normal
# Posicionamento: topo central (X=308 = 816/2 - 100 largura metade)

# Placa "TENTATIVA N" via TextPicture (task 7.2) — placeholder aqui
```

### Estrutura do `EV_RenderCurva`

```
# EV_RenderCurva (Trigger: Call)
# Renderiza fundo + elementos da cena de Curva

# Fundo (asfalto + placa de curva)
Show Picture: 1, "race/bg_curva", Upper Left, (0, 0), 100%, 100%, 255, Normal

# Opala em POV
Show Picture: 10, "race/opala_pov", Upper Left, (0, 0), 100%, 100%, 255, Normal

# Placa de curva à direita (assumindo curva à direita por default)
Show Picture: 11, "race/placa_curva_dir", Upper Left, (600, 100), 100%, 100%, 255, Normal
# Posicionamento: lado direito, acima da pista

# Se for Curva do Diabo (SW_IS_CURVA_DIABO == ON), sobrepor placa especial
If SW_IS_CURVA_DIABO == ON
  Show Picture: 12, "race/curva_do_diabo_placa", Upper Left, (308, 80), 100%, 100%, 255, Normal
  # Placa central grande, mais imponente
End
```

### Animação de entrada (opcional)

Para suavizar a transição entre cenas, animar o fade-in dos elementos com `Move Picture`:

```
# Versão animada de EV_RenderSinal
Show Picture: 1, "race/bg_sinal", Upper Left, (0, 0), 100%, 100%, 0, Normal   # opacity 0
Show Picture: 10, "race/opala_pov", Upper Left, (0, 0), 100%, 100%, 0, Normal
Show Picture: 11, "race/sinal_red", Upper Left, (308, 80), 100%, 100%, 0, Normal

# Fade-in em 6 frames (0.1s) — todos juntos
Move Picture: 1, Upper Left, (0, 0), 100%, 100%, 255, Normal, 6 frames, Linear
Move Picture: 10, Upper Left, (0, 0), 100%, 100%, 255, Normal, 6 frames, Linear
Move Picture: 11, Upper Left, (308, 80), 100%, 100%, 255, Normal, 6 frames, Linear
```

> Para o protótipo, o fade-in já é coberto pelo `Fadein Screen` do Orchestrator. Adicionar animação por picture é polish.

### Picture ID = Z-ordem

> **Importante:** no MZ, **pictures com ID maior ficam acima** (maior z-index). Os botões (ID 41-50) devem ter IDs **maiores** que o fundo (1) e HUD (20-29) para receberem o clique. Ver Guia §4.1 warning.

### Erro comum a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Usar Picture ID 25 para fundo | Botões (41) ficam acima do fundo, mas o HUD (20) também — OK, mas confuso | Manter fundo em 1-9 conforme Guia §4.1 |
| Esquecer `Erase Picture` da cena anterior no Renderer | Pictures antigas sobrepõem novas | Renderizador deve limpar faixa 10-19 (já coberto na task 3.2) |
| Usar `Center` origin em vez de `Upper Left` | Pictures centradas ficam deslocadas | Sempre `Upper Left` (origin 0) para fundos |
| Carregar áudio aqui | Mistura de responsabilidades | Audio é feito na task 7.1 |

## visual_validation

Ao concluir esta task (com 3.2 pronto):
1. No Map001, ative o event autorun que chama `EV_RaceOrchestrator`.
2. Após o fadein (0.3s), a cena 1 aparece renderizada.
3. Se for **Sinal**: deve mostrar `bg_sinal` (asfalto + sinal vermelho) + `opala_pov` (capô do Opala na parte inferior) + `sinal_red` (sinal vermelho no topo).
4. Se for **Curva**: deve mostrar `bg_curva` (asfalto + placa de curva) + `opala_pov` + `placa_curva_dir` (canto superior direito).
5. Pressione F12 → sem erros de "Image not found" no console.
6. Para forçar um tipo específico (debug): `$gameVariables.setValue(103, 0)` no console força Sinal; `$gameVariables.setValue(103, 1)` força Curva.

## Critérios de Sucesso

- [ ] `EV_RenderSinal` existe com trigger "Call".
- [ ] `EV_RenderCurva` existe com trigger "Call".
- [ ] Ambos respeitam faixas de Picture IDs (fundo 1, opala 10, placa/sinal 11).
- [ ] `EV_RenderCurva` sobrepuja `curva_do_diabo_placa` (Picture ID 12) quando `SW_IS_CURVA_DIABO == ON`.
- [ ] Todas as pictures carregam sem erro (texturas pré-carregadas pela task 2.3).
- [ ] Respeita contrato de escrita única (não escreve em variáveis — só faz `Show Picture`).
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Criar botões clicáveis (feito na task 4.2).
- Animar o sinal vermelho pulsante (polish posterior; usar `Move Picture` com opacity em CE paralelo separado).
- Renderizar HUD de Consciência (feito na task 3.4 — é permanente, não muda por cena).
- Tocar áudio da cena (feito na task 7.1).
- Mostrar indicador `P_cena` numericamente (anti-pattern — spec §8 explicitamente proíbe).
