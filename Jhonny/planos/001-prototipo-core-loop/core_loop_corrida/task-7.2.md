---
status: pending
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

# Tarefa 7.2: Implementar Indicador "TENTATIVA N" via TextPicture

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §10.risco (tentativa N — contador de restarts)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §3.1 (linhas 349-379 — `VAR_ATTEMPT_N` ID 113), §4.1 (linhas 462-477 — faixa Picture IDs 51-60 para texto)

## Visão Geral

Mostrar o contador de **Tentativas** (`VAR_ATTEMPT_N`, ID 113) no canto superior central da tela como texto discreto. Atualiza a cada restart (incrementado pelo INIT Orchestrator em task-3.1).

**Discreto** significa: pequeno, opacidade média, não distrai do foco principal (HUD de Consciência/Glória).

Serve tanto para **debug** (jogador vê em quantas tentativas está) quanto para **feedback narrativo** ("você já bateu 7 vezes, calma").

<requirements>
- Texto "TENTATIVA N" exibido no canto superior central durante a corrida.
- Atualiza após cada restart (crash).
- Estilo discreto: fonte pequena (20-24px), cor cinza/branco semi-transparente.
- Picture ID 52 (reservado em §4.1 do Guia para texto).
- Não interfere com HUD de Consciência (20/21) ou Glória (51).
- Atualizado por `EV_UpdateHud` (estendido da task-5.4).
- Desaparece fora da corrida.
</requirements>

## Subtarefas

- [ ] 7.2.1 Confirmar que `VAR_ATTEMPT_N` (ID 113) existe em `System.json` (task-1.1)
- [ ] 7.2.2 Estender `EV_UpdateHud` para incluir TextPicture do indicador
- [ ] 7.2.3 Adicionar Plugin Command `TextPicture > Set Text` com template `"TENTATIVA \\V[113]"`
- [ ] 7.2.4 Adicionar Plugin Command `TextPicture > Show` na posição (350, 20), Picture ID 52
- [ ] 7.2.5 Configurar fonte: size 22, color gray (7), opacity 180
- [ ] 7.2.6 Garantir que `EV_UpdateHud` é chamado no INIT Orchestrator e após cada crash (já deve ser)
- [ ] 7.2.7 Adicionar `Erase Picture: 52` no fim da corrida e em EV_Crash
- [ ] 7.2.8 Validar com Playtest — número atualiza após crash

## Detalhes de Implementação

### Pseudo-código (extensão do `EV_UpdateHud`)

```
# EV_UpdateHud (Trigger: Call) — estendido da task-5.4

# === HUD de Consciência (task-3.4) ===
Script: $gameScreen.picture(21).move(...)
# (continua igual)

# === HUD de Glória (task-5.4) ===
Plugin Command: TextPicture > Set Text "GLÓRIA: \\V[106]"
Plugin Command: TextPicture > Show, pictureId: 51, position: (560, 20)

# === Indicador TENTATIVA N (task 7.2 — esta task) ===
Plugin Command: TextPicture > Set Text "TENTATIVA \\V[113]"
Plugin Command: TextPicture > Show
  pictureId: 52
  position: (350, 20)  # centro topo
  fontSettings: size 22, color 7 (gray), opacity 180
```

### Posição sugerida (816×624)

| Zona | Posição | Picture ID | Conteúdo |
|------|---------|-----------|----------|
| Topo-esquerda | (20, 20) | 20, 21 | Barra de Consciência (task-3.4) |
| Topo-direita | (560, 20) | 51 | "GLÓRIA: N" (task-5.4) |
| **Topo-centro** | **(350, 20)** | **52** | **"TENTATIVA N" (esta task)** |

Posição (350, 20) deixa ~120px de largura para o texto, suficiente para "TENTATIVA 999".

### Por que discreto?

Spec §10.risco menciona que a tentativa N é informação secundária — o jogador não precisa checar ativamente, mas é bom ter visível para:

- **Debug:** identificar qual tentativa produziu determinado log (task-7.3).
- **Narrativa:** após 5+ tentativas, o jogador sente a dificuldade sem precisar de popup.
- **Achievement potencial:** "vença após 10 tentativas" (v2).

Estilo:

- Fonte menor (22px vs 36px da Glória).
- Cor cinza (7) vs branco/dourado.
- Opacidade 180/255 (~70%) — visível mas não gritante.

### Atualização dinâmica — quem chama `EV_UpdateHud`?

| Quem chama | Quando | Por quê |
|------------|--------|---------|
| `EV_RaceOrchestrator` (3.1) | No INIT (após `VAR_ATTEMPT_N += 1`) | Mostra "TENTATIVA 1" ao começar |
| `EV_Crash` (6.1) | Após reset, antes de `EV_RenderSinal` | Mostra "TENTATIVA 2" após primeiro crash |
| `EV_OnSafe` (5.1) | Após mutação | (Glória mudou — TENTATIVA não muda, mas tudo bem) |
| `EV_OnRisk` (5.2) | Após mutação | (Idem) |

Importante: `VAR_ATTEMPT_N` só muda no INIT Orchestrator. Portanto o número só atualiza após um restart (que chama Orchestrator indiretamente via re-init).

> [!note] Task-6.1 (EV_Crash) e VAR_ATTEMPT_N
> Task-6.1 (EV_Crash) preserva `VAR_ATTEMPT_N` (não incrementa). O increment acontece em `EV_RaceOrchestrator` INIT. Se task-6.1 não re-chama Orchestrator (apenas reset direto + EV_RenderSinal), o `VAR_ATTEMPT_N` não incrementa entre tentativas.
>
> **Verificar em task-3.1:** o increment está em `EV_RaceOrchestrator` INIT? Se sim, e EV_Crash não chama Orchestrator, então `VAR_ATTEMPT_N` fica sempre 1.
>
> **Solução:** Adicionar manualmente em `EV_Crash`:
> ```
> Control Variables: VAR_ATTEMPT_N += 1
> ```
> Esta subtarefa deve ser adicionada em 6.1.7g (ou aqui como complemento).

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Picture ID 52 colidindo com overlay | Texto some atrás de flash | Reservar 30-39 para overlays, 51-60 para texto |
| Esquecer de chamar `EV_UpdateHud` após INIT Orchestrator | Indicador não aparece na primeira corrida | Chamar sempre após `VAR_ATTEMPT_N += 1` |
| Usar `\V[113]` sem escape | Texto mostra literal "\V[113]" | Usar `\\V[113]` (escape duplo) |
| Fonte muito grande (>30px) | Indicador "grita" (não discreto) | Manter 22px |
| Opacidade 255 (muito visível) | Indicador distrai | Opacidade 180 (semi-transparente) |
| Não dar `Erase Picture` no fim da corrida | Indicador fica na próxima tela | Apagar Picture 52 |
| `VAR_ATTEMPT_N` não incrementa | Indicador sempre mostra "1" | Confirmar increment em EV_RaceOrchestrator ou EV_Crash |

### Sobre TextPicture e opacidade

TextPicture aceita `opacity` (0-255) no `Show` Plugin Command:

- `255` = totalmente opaco.
- `180` = ~70% opaco (recomendado para discreto).
- `100` = ~40% opaco (muito discreto — pode ser difícil de ler).

Se TextPicture não suporta opacidade diretamente (depende da versão do plugin), usar cor mais escura (cinza escuro em vez de cinza claro).

## visual_validation

Ao concluir esta task (com 5.4, 6.1 prontos):

1. Inicie a corrida.
2. **Texto "TENTATIVA 1"** aparece no topo central, discreto (cinza, fonte menor).
3. Crash (force roll=99, clique Furar).
4. Após restart (~1s), **texto muda para "TENTATIVA 2"**.
5. Crash de novo → "TENTATIVA 3".
6. Texto permanece na mesma posição, não distrai do foco (HUD Consciência/Glória).
7. Após vitória (task-6.4), texto **some** (Picture 52 apagado).
8. Iniciar nova corrida (próxima RACE_ID): texto volta como "TENTATIVA N+1" (continua contando).
9. F12 sem erros.

## Critérios de Sucesso

- [ ] Texto "TENTATIVA N" aparece durante a corrida, topo central.
- [ ] Estilo discreto: 22px, cinza, opacidade 180.
- [ ] Número atualiza após cada restart (incrementa).
- [ ] Picture ID 52 (faixa reservada para texto).
- [ ] `EV_UpdateHud` atualiza o indicador junto com HUD Glória.
- [ ] Texto desaparece fora da corrida.
- [ ] `VAR_ATTEMPT_N` incrementa corretamente entre tentativas (validar integração com task-3.1 e task-6.1).
- [ ] Sem erros no console.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Animação ao mudar de tentativa (ex.: número piscando) — fora do MVP.
- Mensagem "TENTATIVA N — NÃO DESISTA" após N tentativas — fora do MVP.
- Reset de tentativas ao avançar de corrida — decisão de design; manter acumulado no MVP.
- Cores diferentes por faixa (1-3 verde, 4-6 amarelo, 7+ vermelho) — fora do MVP.
- Botão para resetar manualmente — fora do MVP.
- Tela de estatísticas detalhadas — fora do MVP.
