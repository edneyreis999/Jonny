---
title: "RPG Maker MZ - Debug Playtest"
tipo: "procedimento tecnico"
status: "aprovado"
tags:
  - rpg-maker-mz
  - debug
  - playtest
  - runtime
---

# RPG Maker MZ - Debug Playtest

Use este procedimento para bugs perceptíveis em RPG Maker MZ: tela preta, input travado, picture invisível, áudio ausente, plugin helper sem efeito, Common Event que parece não executar ou divergência entre console e jogo visível.

---

## Princípios

- Playtest humano é o gate final para comportamento visual, input, áudio, pictures, plugins e Common Events.
- Antes de adicionar probe, escreva o objetivo em uma frase: "provar X" ou "descartar Y".
- Debug deve ter sinal esperado e condição de parada. Log por frame sem throttle é ruído.
- F12/F9 ajudam diagnóstico, mas não substituem validação perceptível no jogo.
- Sempre que possível, use feedback perceptível simples, como `Play SE`, para confirmar caminho binário quando Picture/TextPicture pode estar invisível.

## Preflight

- Abra o jogo por servidor local quando save/load, cache ou assets estiverem envolvidos.
- Mantenha a janela do jogo visível. Em Playtest/Chromium, janela oculta ou DevTools em modo que tira visibilidade pode pausar ou desacelerar `requestAnimationFrame`.
- Se usar F12, prefira DevTools dockado lateralmente ou em posição que mantenha o canvas visível.
- Faça hard reload quando alterar plugin, `plugins.js`, data JSON ou assets cacheáveis.
- Para plugin helper, confirme que o arquivo existe em `js/plugins/` e que `js/plugins.js` contém o plugin ativo com parâmetros salvos.

## Snapshot mínimo

Para tela preta ou fluxo travado, capture antes de corrigir:

| Área | Evidência |
| --- | --- |
| Mapa | `mapId`, player position, event id ativo e se o evento foi apagado por `Erase Event`. |
| Tela | Pictures ativas, opacidade, blend, tint, fade, scene atual. |
| Corrida | `SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `SW_CRASH_FLAG`, `VAR_RACE_ID`, `VAR_SCENE_INDEX`, `VAR_RACE_N_CENAS`, `VAR_ATTEMPT_N`. |
| Resultado | `VAR_PONTOS_GLORIA`, threshold esperado, `VAR_VITORIA_PASSOU`, pictures 5/53/54/55/56. |
| Interpreter | Common Event atual, índice, child interpreter, event reservation e se o list atual existe. |
| Plugins | `plugins.js` ativo, parâmetros efetivos, namespace global preservado. |

## Probes e logs

- Filtre por CE, índice ou estado-alvo. Evite trace global de todos os comandos.
- Limite quantidade: contador máximo, throttle por tipo ou remoção automática depois de N frames.
- Em loops paralelos, logue transições de estado, não todos os ticks.
- Proteja probes contra `null`: interpreter pode existir com `_list = null`.
- Remova probes ou deixe flag explícita antes de encerrar a task.

## Quando usar F12/F9

F12 é útil para confirmar estado interno e erros JS. F9 é útil para inspeção manual de switches/variáveis. Nenhum dos dois prova que a experiência final ficou correta. Depois do diagnóstico, peça confirmação de Playtest com a janela do jogo visível e sem depender do console.

## Evidência de validação

Ao reportar validação, registre:

- ambiente usado: navegador, servidor local ou Playtest do editor;
- caminho executado pelo usuário;
- resultado perceptível esperado e observado;
- logs ou snapshots relevantes;
- o que ainda não foi validado por Playtest.

Para runtime da corrida, use também [[Corrida - Runtime e Eventos]].
