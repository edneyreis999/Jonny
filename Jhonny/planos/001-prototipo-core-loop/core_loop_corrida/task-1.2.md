---
status: pending
---

<task_context>
<domain>engine/infra/plugin</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>low</complexity>
<dependencies>none</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 1.2: Criar Plugin `Jhonny_RaceHelper.js`

## Referências de Origem

- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §2.1.1 (linhas 165-189), §5.2-5.3 (linhas 692-733), Apêndice A (linhas 1025-1140)

## Visão Geral

Criar o plugin utilitário mínimo `Jhonny/js/plugins/Jhonny_RaceHelper.js` usando o código completo fornecido no Apêndice A do Guia Técnico. Este plugin **não implementa lógica de jogo** — apenas expõe helpers puros (RNG, clamp, extensão de `keyMapper` para W/S/A/D, logger).

<requirements>
- Arquivo criado em `Jhonny/js/plugins/Jhonny_RaceHelper.js`.
- Conteúdo idêntico ao Apêndice A do Guia Técnico (plugin IIFE com `@target MZ`, helpers em `window.JhonnyRace`).
- Extensão de `Input.keyMapper` para W/S/A/D (keycodes 87/83/65/68).
- Logger exposto em `JhonnyRace.logger` com switch de liga (`EnableDebugLogs` plugin param).
- Sem erros de sintaxe JS (validar com `node -c` ou carregar no MZ).
</requirements>

## Subtarefas

- [ ] 1.2.1 Criar arquivo `Jhonny/js/plugins/Jhonny_RaceHelper.js`
- [ ] 1.2.2 Colar o código do Apêndice A do Guia Técnico (linhas 1030-1140)
- [ ] 1.2.3 Validar sintaxe JS: `node -c Jhonny/js/plugins/Jhonny_RaceHelper.js`
- [ ] 1.2.4 Confirmar que `Input.keyMapper` é estendido sem sobrescrever (padrão `Object.assign`)

## Detalhes de Implementação

### Código-fonte

O código completo está no **Apêndice A** do Guia Técnico (linhas 1030-1140). Principais elementos:

1. **IIFE wrapper** para evitar poluição do escopo global.
2. **Plugin params** com `@param EnableDebugLogs` (boolean, default true).
3. **Logger** estilo `Coreto_Core.js:88-111` com prefix `[Jhonny_RaceHelper]`.
4. **Helpers RNG:**
   - `rollSceneType()`: retorna 0 (SINAL, 60%) ou 1 (CURVA, 40%).
   - `rollPCena()`: retorna `Math.floor(Math.random() * 11) * 10` (U{0,10,...,100}).
   - `rollD100()`: retorna `Math.floor(Math.random() * 100)` (0..99).
5. **`clamp(value, min, max)`** puro.
6. **`createPRNG(seed)`** com mulberry32 (reservado para v2, não usado em v1).
7. **Extensão `Input.keyMapper`:**
   ```javascript
   const _Input_keyMapper = Input.keyMapper;
   Input.keyMapper = Object.assign({}, _Input_keyMapper, {
       65: "left",   // A
       68: "right",  // D
       83: "down",   // S
       87: "up"      // W
   });
   ```
8. **API global** em `window.JhonnyRace` expõe `{ rollSceneType, rollPCena, rollD100, clamp, createPRNG, logger }`.

### Por que `Object.assign` em vez de mutar direto?

Mutar `Input.keyMapper` globalmente funciona mas deixa o patch invisível. Atribuir explicitamente facilita **auditoria** (você sabe quais keys foram adicionadas) e evita efeito colateral se o objeto for congelado em update futuro da engine.

### Localização

- Arquivo: `Jhonny/js/plugins/Jhonny_RaceHelper.js`
- Registro: `Jhonny/js/plugins.js` (feito na task 1.3 via MZ Plugin Manager)

## visual_validation

Após a task 1.3 (ativar plugin), ao rodar o jogo no RPG Maker MZ (Playtest):
1. Pressione **F12** para abrir o console do NW.js (ou DevTools no browser).
2. O console mostra a linha: `[Jhonny_RaceHelper] JhonnyRace helper inicializado.` (info level).
3. No console, digite `JhonnyRace.rollD100()` — retorna um inteiro 0..99.
4. No console, digite `JhonnyRace.rollPCena()` — retorna um múltiplo de 10 (0, 10, 20, ..., 100).
5. No console, digite `JhonnyRace.rollSceneType()` — retorna 0 ou 1 (~60% das vezes 0).
6. No console, digite `Input.keyMapper[65]` — retorna `"left"` (confirma extensão W/S/A/D).

## Critérios de Sucesso

- [ ] Arquivo `Jhonny/js/plugins/Jhonny_RaceHelper.js` existe e tem ~70 linhas (conforme Apêndice A).
- [ ] `node -c Jhonny/js/plugins/Jhonny_RaceHelper.js` não reporta erros de sintaxe.
- [ ] Após task 1.3, console do MZ mostra "JhonnyRace helper inicializado".
- [ ] API `window.JhonnyRace` expõe as 6 funções (rollSceneType, rollPCena, rollD100, clamp, createPRNG, logger).
- [ ] `Input.keyMapper` tem entradas 65/68/83/87 mapeadas para left/right/down/up.

## Fora de Escopo

- Registrar o plugin em `plugins.js` (feito na task 1.3).
- Adicionar plugin command `logRaceEvent` (feito na task 7.3).
- Testar a extensão W/S/A/D no fluxo de input da corrida (feito na task 4.4).
- Implementar PRNG seedável como padrão (reservado para v2; `Math.random()` é suficiente para gamejam).
