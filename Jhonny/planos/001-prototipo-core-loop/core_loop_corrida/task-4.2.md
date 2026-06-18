---
status: pending
---

<task_context>
<domain>engine/gameplay/input</domain>
<type>integration</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-3.3</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 4.2: Implementar Botões Clicáveis via `ButtonPicture` (IDs 41-50)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §4 (Cena de Sinal — input), §5 (Cena de Curva — input)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §2.2 (linhas 192-247), §4.1 (linhas 463-477)

## Visão Geral

Configurar os botões clicáveis do minigame usando o plugin nativo `ButtonPicture.js`:
- **Cena de Sinal:** `btn_parar` (Picture ID 41 → `EV_OnSafe`) e `btn_furar` (Picture ID 42 → `EV_OnRisk`).
- **Cena de Curva:** `btn_direita` (Picture ID 43 → `EV_OnSafe`) e `btn_esquerda` (Picture ID 44 → `EV_OnRisk`).

Os botões são criados via `Show Picture` + `Plugin Command: ButtonPicture → Set` dentro de `EV_RenderSinal` e `EV_RenderCurva` (modificados por esta task).

<requirements>
- Pictures 41-44 (botões) criadas em `EV_RenderSinal` (41, 42) e `EV_RenderCurva` (43, 44).
- Plugin Command `ButtonPicture → Set` configurado para cada botão apontar para o Common Event correto.
- Botões desaparecem na transição entre cenas (Renderer apaga pictures da faixa 10-19 e 41-50 ao detectar mudança).
- Botões têm IDs MAIORES que overlays e HUD (z-order correto — recebem clique).
</requirements>

## Subtarefas

- [ ] 4.2.1 Modificar `EV_RenderSinal` (task 3.3) para adicionar `Show Picture: 41` (btn_parar) e `Show Picture: 42` (btn_furar)
- [ ] 4.2.2 Adicionar `Plugin Command: ButtonPicture → Set` pictureId=41, commonEventId=`EV_OnSafe`
- [ ] 4.2.3 Adicionar `Plugin Command: ButtonPicture → Set` pictureId=42, commonEventId=`EV_OnRisk`
- [ ] 4.2.4 Modificar `EV_RenderCurva` para adicionar `Show Picture: 43` (btn_direita) e `Show Picture: 44` (btn_esquerda)
- [ ] 4.2.5 Adicionar Plugin Commands equivalentes para 43→`EV_OnSafe` e 44→`EV_OnRisk`
- [ ] 4.2.6 Modificar `EV_RaceRenderer` (task 3.2) para apagar pictures 41-44 ao detectar mudança de cena
- [ ] 4.2.7 Salvar o projeto

## Detalhes de Implementação

### Modificação do `EV_RenderSinal` (task 3.3)

Adicionar após os elementos de cena:

```
# === Botões da cena de Sinal (Picture IDs 41-42) ===
Show Picture: 41, "race/btn_parar", Upper Left, (220, 500), 100%, 100%, 255, Normal
Show Picture: 42, "race/btn_furar", Upper Left, (440, 500), 100%, 100%, 255, Normal

# Configura botões clicáveis via ButtonPicture
Plugin Command: ButtonPicture → Set
  pictureId     = 41
  commonEventId = <ID do EV_OnSafe>

Plugin Command: ButtonPicture → Set
  pictureId     = 42
  commonEventId = <ID do EV_OnRisk>
```

### Modificação do `EV_RenderCurva` (task 3.3)

```
# === Botões da cena de Curva (Picture IDs 43-44) ===
Show Picture: 43, "race/btn_direita", Upper Left, (220, 500), 100%, 100%, 255, Normal
Show Picture: 44, "race/btn_esquerda", Upper Left, (440, 500), 100%, 100%, 255, Normal

Plugin Command: ButtonPicture → Set
  pictureId     = 43
  commonEventId = <ID do EV_OnSafe>   # Direita = safe

Plugin Command: ButtonPicture → Set
  pictureId     = 44
  commonEventId = <ID do EV_OnRisk>   # Esquerda = risk
```

### Modificação do `EV_RaceRenderer` (task 3.2)

Adicionar no bloco de limpeza de pictures (ao detectar mudança de cena):

```
# === Limpa pictures da cena anterior ===
Erase Picture: 10      # opala
Erase Picture: 11      # sinal/placa
Erase Picture: 12      # curva_do_diabo_placa (se existir)
Erase Picture: 41      # btn_parar
Erase Picture: 42      # btn_furar
Erase Picture: 43      # btn_direita
Erase Picture: 44      # btn_esquerda
# Preserva: HUD 20-21 (barra Consciência), 22-24 (overlays hover — controlados por CE separado)
```

### Posicionamento

| Botão | Posição (Upper Left) | Justificativa |
|-------|----------------------|---------------|
| `btn_parar` / `btn_direita` | (220, 500) | Esquerda-inferior; safe à esquerda (convenção UI) |
| `btn_furar` / `btn_esquerda` | (440, 500) | Direita-inferior; risk à direita |

Resolução do projeto: 816x624. Botões têm ~160px largura. Posicionamento:
- Esquerda: X=220 → centro do botão em 300.
- Direita: X=440 → centro do botão em 520.
- Gap central: 440-380 = 60px (suficiente para evitar touch acidental).

### Por que `ButtonPicture` e não `On Mouse Click` paralelo?

Guia Técnico §2.2.2 explica em detalhes. Resumo:
1. **Hit-test automático** via `Sprite_Clickable.isBeingTouched` (`rmmz_sprites.js:64-68`) com `worldTransform.applyInverse` do PixiJS.
2. **Anti-flood** via `$gameTemp.reserveCommonEvent(id)` que enfileira, não executa síncrono.
3. **Integração com `Scene_Map.isAnyButtonPressed`** — previne movimento do player ao clicar botão.

Implementar hit-test manual (opção paralela + `TouchInput.isTriggered` + comparar coords) duplica a lógica da engine e introduz bugs de borda.

### Plugin Command: ButtonPicture → Set

Conforme Guia §2.2, o `ButtonPicture.js:74-90` registra o comando:

```javascript
PluginManager.registerCommand(pluginName, "set", args => {
    const pictureId = Number(args.pictureId);
    const commonEventId = Number(args.commonEventId);
    const picture = $gameScreen.picture(pictureId);
    if (picture) picture.mzkp_commonEventId = commonEventId;
});
```

Após chamar este Plugin Command:
- `Sprite_Picture.isClickEnabled` retorna true (botão é clicável).
- `Sprite_Picture.onClick` chama `$gameTemp.reserveCommonEvent(commonEventId)`.

### Erro comum a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Usar Picture ID 25 (abaixo do HUD) | Botão não recebe clique (HUD intercepta) | Manter botões em 41-50 (Guia §4.1) |
| Esquecer Plugin Command `ButtonPicture → Set` | Botão aparece mas não é clicável | Sempre chamar Plugin Command após `Show Picture` |
| `Erase Picture` não limpa `mzkp_commonEventId` | Próxima picture no mesmo ID pode estar "marcada" errada | `Erase Picture` destrói o `Game_Picture`; nova `Show Picture` cria objeto novo |
| Não apagar botões da cena anterior ao trocar de cena | Botão de Sinal ainda aparece na cena de Curva | Renderer sempre apaga faixa 41-44 ao detectar mudança |
| Posicionar botão fora da tela (X > 816) | Botão invisível | Verificar coords antes de salvar |

## visual_validation

Ao concluir esta task (com 3.2, 3.3 prontos):
1. No Map001, ative o event autorun.
2. Após o fadein, a cena 1 aparece com os botões na parte inferior.
3. Se for **Sinal**: botões "Parar" (esquerda) e "Furar" (direita).
4. Se for **Curva**: botões "Direita" (esquerda) e "Esquerda" (direita).
5. Ao **passar o mouse** sobre um botão, ele destaca (cursor muda / leve glow).
6. Ao **clicar** em um botão:
   - O handler é disparado (mas como `EV_OnSafe`/`EV_OnRisk` ainda estão vazios, nada visível acontece ainda).
   - No console F12: `$gameTemp.reserveCommonEvent` foi chamado.
   - Botão fica "inativo" durante o processamento (não aceita novo clique).
7. Trocar de cena (via console `$gameVariables.setValue(102, 1)`) — botões anteriores somem, novos aparecem.

## Critérios de Sucesso

- [ ] Pictures 41-44 são mostradas em suas respectivas cenas (Sinal: 41-42; Curva: 43-44).
- [ ] Plugin Command `ButtonPicture → Set` configura o Common Event correto para cada botão.
- [ ] Renderer apaga botões ao trocar de cena.
- [ ] Botões recebem clique (sem "clique fantasma" em pictures erradas).
- [ ] `Scene_Map.isAnyButtonPressed` funciona (clique no botão não move o player).
- [ ] Z-order correto (botões acima de HUD e overlays).
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Implementar lógica dos handlers `EV_OnSafe` e `EV_OnRisk` (feito nas tasks 5.1 e 5.2).
- Implementar hover vermelho-sangue (feito na task 5.5).
- Implementar animação de "press" (escala/opacity ao clicar) — polish posterior.
- Implementar input via teclado W/S/A/D (feito na task 4.4).
