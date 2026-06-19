---
status: pending
revisado: 2026-06-19
revisao_motivo: "Switch de MZ Editor manual para script gerador (heurística F6 — TextPicture pattern validado)"
---

<task_context>
<domain>engine/ui/hud</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>low</complexity>
<dependencies>task-5.4</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 7.2: Implementar Indicador "TENTATIVA N" via TextPicture (Script Gerador)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §10.risco (tentativa N — contador de restarts)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §3.1 (linhas 349-379 — `VAR_ATTEMPT_N` ID 113), §4.1 (linhas 462-477 — faixa Picture IDs 51-60 para texto)
- Retrospectiva F6: [[fase-6-completa]] — validou que Plugin Cmd TextPicture PODE ser inserido via script (pattern code 357 + 657 + Show Picture com `name=""`)

## ⚠️ Estado herdado (NÃO refazer)

| Item | Estado atual | Ação nesta task |
|------|--------------|------------------|
| `VAR_ATTEMPT_N` (Editor ID 113) | Nomeado em System.json desde F1 | ✅ Confirmar |
| Incremento `VAR_ATTEMPT_N += 1` | **Já em CE 18 cmd 14** (`EV_Crash`) desde F6 | ✅ Confirmar — **não adicionar** |
| `EV_UpdateHud` (CE 6) com TextPicture Glória (Picture 51) | Implementado em F6 via `build_phase6_ces.py` (pattern 357+657+Show) | ✅ Estender com nova TextPicture ID 52 |
| Picture ID 52 (faixa texto) | Reservado | ✅ Usar nesta task |

### Decisão do usuário (2026-06-19)

- **Abordagem:** script gerador idempotente (`build_phase7_ces.py`), NÃO MZ Editor manual. Heurística F6 confirmou que Plugin Commands TextPicture (code 357 + 657 + Show Picture com `name=""`) são inseríveis via Python+json.
- **Incremento ATTEMPT_N:** já feito em CE 18 desde F6. Esta task só estende `EV_UpdateHud` (CE 6) com a TextPicture ID 52.

## Visão Geral

Mostrar o contador de **Tentativas** (`VAR_ATTEMPT_N`, ID 113) no canto superior central da tela como texto discreto. Atualiza a cada restart — `EV_UpdateHud` (CE 6) é chamado no INIT Orchestrator (CE 5) e após Crash (CE 18), garantindo refresh do número.

**Discreto** significa: pequeno, opacidade média, não distrai do foco principal (HUD de Consciência/Glória).

Serve tanto para **debug** (jogador vê em quantas tentativas está) quanto para **feedback narrativo** ("você já bateu 7 vezes, calma").

<requirements>
- Texto "TENTATIVA N" exibido no canto superior central durante a corrida.
- Atualiza após cada restart — via `EV_UpdateHud` (CE 6), que é chamado por CE 5 INIT e CE 18 Crash.
- Estilo discreto: fonte pequena (~22px), cor cinza (escape code `\C[7]`), opacidade 180.
- Picture ID 52 (reservado em §4.1 do Guia para texto).
- Não interfere com HUD de Consciência (20/21), Glória (51), ou Vitória (53-56).
- Desaparece fora da corrida (CE 18 limpa pictures 1-60; EV_VitoriaCorrida idem).
</requirements>

## Subtarefas

- [ ] 7.2.1 Confirmar `VAR_ATTEMPT_N` (ID 113) existe em System.json (snapshot `variables[110:120]`)
- [ ] 7.2.2 Confirmar CE 18 cmd 14 tem `ControlVar VAR_ATTEMPT_N += 1` (opType 1 = Add)
- [ ] 7.2.3 Criar `Jhonny/planos/001-prototipo-core-loop/fase7/build_phase7_ces.py` (ou estender `build_phase7_audio.py` unificado)
- [ ] 7.2.4 Implementar patch CE 6 (`EV_UpdateHud`):
  - [ ] Detectar se já tem `Show Picture: 52` (idempotência via pattern match em `pictureId=52`)
  - [ ] Se não, inserir ao final (após cmds do HUD Glória): `Plugin Cmd TextPicture.set` + `Plugin Cont "Text = ..."` + `Show Picture 52 ""` (pattern F6)
  - [ ] Texto: `"\\C[7]TENTATIVA \\V[113]"` (cinza + variável)
  - [ ] Posição: (350, 20), Picture ID 52
- [ ] 7.2.5 Garantir que CE 18 já apaga pictures 1-60 (já tem loop `erasePicture(1..60)` desde F6 — confirmar)
- [ ] 7.2.6 Garantir que EV_VitoriaCorrida (CE 19) já apaga pictures relevantes (já tem `erasePicture(1..60)` desde F6 — confirmar)
- [ ] 7.2.7 Refresh runtime MZ (F10 → Ctrl+S → reiniciar Playtest)
- [ ] 7.2.8 Playtest — validar que número atualiza após crash

## Detalhes de Implementação

### Pattern TextPicture (validado em F6)

Conforme [[fase-6-completa]] §CE 19 — EV_VitoriaCorrida, o padrão para inserir um TextPicture via JSON é:

```
1. Plugin Cmd TextPicture.set  (code 357)
   params: ["Jhonny_RaceHelper" ou "TextPicture", "set", "Set TextPicture", {"text": "<valor>"}]
2. Plugin Cont "Text = <valor>" (code 657)
   params: ["Text = <valor>"]
3. Show Picture com name=""     (code 231)
   params: [pictureId, "", origin, designation, x, y, scaleX, scaleY, opacity, blendMode]
```

Quando `name=""`, o plugin `TextPicture.js:66` consome o texto Set anterior em vez de carregar uma imagem.

### Pseudo-código do patch CE 6

```python
# build_phase7_ces.py — extensão do CE 6 (EV_UpdateHud)

def patch_ce6_tentativa_indicator(ce6_list):
    """Idempotente: detecta se Picture 52 já existe, se não, adiciona ao final."""
    # Detectar: Show Picture code 231 com parameters[0] == 52
    has_pic_52 = any(
        cmd["code"] == 231 and len(cmd["parameters"]) > 0 and cmd["parameters"][0] == 52
        for cmd in ce6_list
    )
    if has_pic_52:
        print("CE 6: TextPicture TENTATIVA já presente — skip")
        return ce6_list

    # Inserir 3 cmds ao final (antes do terminador code 0)
    text_value = "\\C[7]TENTATIVA \\V[113]"
    cmds_to_add = [
        # Plugin Cmd: TextPicture.set (code 357)
        {
            "code": 357, "indent": 0,
            "parameters": ["Jhonny_RaceHelper", "set", "Set TextPicture",
                          {"text": text_value}]
        },
        # Plugin Cont: Text = <valor> (code 657)
        {
            "code": 657, "indent": 0,
            "parameters": [f"Text = {text_value}"]
        },
        # Show Picture: 52, "" (consome texto Set) (code 231)
        {
            "code": 231, "indent": 0,
            "parameters": [52, "", 0, 0, 350, 20, 100, 100, 180, 0]
        },
    ]

    # Inserir antes do último cmd (code 0 terminador)
    return ce6_list[:-1] + cmds_to_add + ce6_list[-1:]
```

### Posição sugerida (816×624)

| Zona | Posição | Picture ID | Conteúdo | Origem |
|------|---------|-----------|----------|--------|
| Topo-esquerda | (20, 20) | 20, 21 | Barra de Consciência | F3 |
| Topo-direita | (560, 20) | 51 | "GLÓRIA: N" | F5/F6 |
| **Topo-centro** | **(350, 20)** | **52** | **"TENTATIVA N"** | **Esta task** |
| Vitória/Derrota | (308, 200) | 53, 56 | "VITÓRIA!"/"DERROTA!" | F6 |
| Vitória info | (258, 300) | 54 | "Pontos de Glória: N" | F6 |
| Vitória instrução | (258, 360) | 55 | "Pressione [Espaço]" | F6 |

Posição (350, 20) deixa ~120px de largura para o texto, suficiente para "TENTATIVA 999".

### Por que discreto?

Spec §10.risco menciona que a tentativa N é informação secundária — o jogador não precisa checar ativamente, mas é bom ter visível para:

- **Debug:** identificar qual tentativa produziu determinado log (task-7.3).
- **Narrativa:** após 5+ tentativas, o jogador sente a dificuldade sem precisar de popup.
- **Achievement potencial:** "vença após 10 tentativas" (v2).

Estilo:
- **Cor:** `\C[7]` (cinza) vs branco/dourado da Glória/Vitória.
- **Opacidade:** 180/255 (~70%) — visível mas não gritante.
- **Tamanho:** default do TextPicture (não controlável via Show Picture; user pode ajustar no MZ Editor adicionando `\{` repetidos se desejar — fora do escopo).

### Atualização dinâmica — quem chama `EV_UpdateHud`?

| Quem chama | Quando | Por quê |
|------------|--------|---------|
| `EV_RaceOrchestrator` (CE 5) | No INIT | Mostra "TENTATIVA 1" ao começar primeira corrida |
| `EV_Crash` (CE 18) | Após reset, antes de `EV_RenderSinal` | Mostra "TENTATIVA N+1" após crash — **increment já está em CE 18 cmd 14** |

> **Confirmado em F6:** CE 18 (`EV_Crash`) cmd 14 tem `ControlVar VAR_ATTEMPT_N += 1`. Não há necessidade de adicionar increment adicional.

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Picture ID 52 colidindo com overlay | Texto some atrás de flash | IDs 30-39 reservados para overlays; 51-60 para texto |
| Esquecer de chamar `EV_UpdateHud` após INIT/Crash | Indicador não atualiza | CE 5 e CE 18 já chamam (confirmar) |
| Usar `\V[113]` sem escape duplo no JSON | Texto mostra literal "\V[113]" | JSON precisa `"\\V[113]"` (escape duplo) |
| `name` não-vazio no Show Picture | Plugin carrega imagem em vez de consumir texto Set | Sempre `name=""` |
| Esquecer refresh runtime MZ | JSON atualizado mas Picture 52 não aparece | F10 → Ctrl+S → reiniciar Playtest |
| Picture 52 persistindo entre corridas | Indicador "vazando" para próxima tela | CE 18/19 já apagam 1-60 — confirmar |

### Sobre TextPicture e opacidade

TextPicture herda opacidade do `Show Picture` (code 231, parameter index 8). Valor padrão é 255; usar 180 para discreto.

Se `opacity 180` ficar muito fraco em playtest, ajustar para 200 ou 220 no `build_phase7_ces.py` e re-executar.

## visual_validation

Ao concluir esta task:

1. Inicie a corrida.
2. **Texto "TENTATIVA 1"** aparece no topo central, discreto (cinza, fonte menor, opacidade 180).
3. Crash (force roll=99, clique Furar).
4. Após restart (~1s), **texto muda para "TENTATIVA 2"**.
5. Crash de novo → "TENTATIVA 3".
6. Texto permanece na mesma posição, não distrai do foco (HUD Consciência/Glória).
7. Após vitória (task-6.4), texto **some** (CE 19 apaga pictures 1-60).
8. Iniciar nova corrida (próxima RACE_ID): texto volta como "TENTATIVA N+1" (continua contando).
9. F12 sem erros.

## Critérios de Sucesso

- [ ] Texto "TENTATIVA N" aparece durante a corrida, topo central.
- [ ] Estilo discreto: ~22px (default TextPicture), cinza (`\C[7]`), opacidade 180.
- [ ] Número atualiza após cada restart (incrementa via CE 18 cmd 14).
- [ ] Picture ID 52 (faixa reservada para texto).
- [ ] `EV_UpdateHud` (CE 6) estendido via `build_phase7_ces.py` (idempotente).
- [ ] Texto desaparece após vitória (CE 19 apaga pictures 1-60).
- [ ] Pattern TextPicture (code 357 + 657 + Show 231 com `name=""`) aplicado corretamente.
- [ ] Sem erros no console.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Animação ao mudar de tentativa (ex.: número piscando) — fora do MVP.
- Mensagem "TENTATIVA N — NÃO DESISTA" após N tentativas — fora do MVP.
- Reset de tentativas ao avançar de corrida — decisão de design; manter acumulado no MVP.
- Cores diferentes por faixa (1-3 verde, 4-6 amarelo, 7+ vermelho) — fora do MVP.
- Botão para resetar manualmente — fora do MVP.
- Tela de estatísticas detalhadas — fora do MVP.
- Tamanho de fonte customizada (maior que default TextPicture) — requer escape code `\{` no texto, fora do MVP.
