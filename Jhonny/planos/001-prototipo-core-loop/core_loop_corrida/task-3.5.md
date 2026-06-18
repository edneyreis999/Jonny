---
status: implemented-pending-playtest
---

<task_context>
<domain>engine/infra/map</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>low</complexity>
<dependencies>task-3.1</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 3.5: Criar Mapa "Garagem" (Map001) com Event Autorun

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §12.1 (Estrutura de eventos)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §1.3 (linhas 109-135), §9 Checklist (linhas 994-996)

## Visão Geral

Configurar o Map001 (já existente no projeto Jhonny como mapa inicial) como ponto de entrada do minigame. Criar um event com trigger "Autorun" que:
1. Define `VAR_RACE_ID = 1` (Corrida 1 = 6 cenas, para teste inicial).
2. Chama `EV_RaceOrchestrator`.

Em playtest, basta iniciar o jogo (Playtest) para a corrida começar automaticamente.

<requirements>
- Map001 (ou novo mapa, se preferir separar) tem pelo menos 1 event.
- Event tem trigger "Autorun" (não "Action Button" nem "Parallel").
- Event define `VAR_RACE_ID = 1` no início.
- Event chama `EV_RaceOrchestrator`.
- Event não tem condicional (sempre dispara no playtest).
</requirements>

## Subtarefas

- [ ] 3.5.1 **(JSON-automatizável)** Ler `Jhonny/data/Map001.json` para entender estrutura atual do mapa (events array, tileset ID, dimensões)
- [ ] 3.5.2 Adicionar 1 event no array `events` com `trigger: 3` (Autorun) e `moveType: 0` (Fixed)
- [ ] 3.5.3 Adicionar `Control Variables: VAR_RACE_ID = 1` — código `122` com `parameters: [101, 101, 0, 0, 1]`
- [ ] 3.5.4 Adicionar `Call Common Event: EV_RaceOrchestrator` — código `117` com ID correspondente ao CE criado em 3.1
- [ ] 3.5.5 **(Obrigatório)** Adicionar `Erase Event` após o `Call Common Event` — código `214`. **Sem este comando, o event Autorun re-dispara a cada frame** após o fim da lista (MZ re-avalia condições do Autorun e, sem condição nem Erase, roda again). Sintoma confirmado em playtest: tela piscando preto a ~3Hz (cada ciclo re-executa o Tint Screen preto→normal do Orchestrator). Erase Event remove o event do mapa até o jogador sair e voltar — para o protótipo (autorun que só dispara na entrada do mapa), é o padrão canônico MZ.
- [ ] 3.5.6 Confirmar que `System.json` → `startMapId` aponta para `1` (Map001 — default do projeto Jhonny, já configurado)
- [ ] 3.5.7 Validar JSON com `python -m json.tool`
- [ ] 3.5.8 **MZ Editor recomendado:** abrir Map001 e confirmar que o event aparece no tile esperado
- [ ] 3.5.9 Playtest MZ obrigatório para confirmar que o event autorun dispara automaticamente ao abrir o mapa

## Automação via JSON (Map001 já existe no projeto)

> **Aprendizado [[fase1/retrospectiva]] + [[fase2/retrospectiva]]:** arquivos `data/*.json` do MZ podem ser editados via Python+json quando a estrutura é conhecida. Map files (`Map*.json`) são mais complexos que `System.json`, mas a seção `events` é um array simples — adicionar um evento é direto.
>
> **Atenção:** para edições complexas em mapa (tiles, camadas), o MZ Editor é obrigatório. Mas adicionar 1 evento com lista de comandos conhecidos é seguro via JSON.

### Pré-condições
- [x] `Map001.json` existe no projeto Jhonny (mapa inicial default)
- [x] `System.json` → `startMapId` já aponta para `1` (default Jhonny)
- [x] `EV_RaceOrchestrator` criado na task 3.1 — usar o ID correspondente no `Call Common Event`

### Estrutura JSON — evento autorun em Map001

```python
import json, pathlib
map_path = pathlib.Path("Jhonny/data/Map001.json")
m = json.loads(map_path.read_text())

# ID do CE EV_RaceOrchestrator — confirmar após task 3.1
ORCHESTRATOR_CE_ID = 5  # ajustar conforme slot usado em 3.1

new_event = {
  "id": len(m["events"]) if m["events"] else 1,
  "name": "Init Corrida",
  "note": "",
  "pages": [
    {
      "list": [
        {"code": 122, "indent": 0, "parameters": [101, 101, 0, 0, 1]},   # VAR_RACE_ID = 1
        {"code": 117, "indent": 0, "parameters": [ORCHESTRATOR_CE_ID]},   # Call EV_RaceOrchestrator
        {"code": 0, "indent": 0, "parameters": []}
      ],
      "conditions": {
        "actorId": 1, "actorValid": False,
        "itemId": 1, "itemValid": False,
        "selfSwitchCh": "A", "selfSwitchValid": False,
        "switch1Id": 1, "switch1Valid": False,
        "switch2Id": 1, "switch2Valid": False,
        "variableId": 1, "variableValid": False,
        "variableValue": 0
      },
      "directionFix": False,
      "image": {"tileId": 0, "characterName": "", "direction": 2, "pattern": 0, "characterIndex": 0},
      "moveFrequency": 3,
      "moveRoute": {"list": [{"code": 0, "parameters": []}], "repeat": False, "skippable": False, "wait": False},
      "moveSpeed": 3,
      "moveType": 0,
      "priorityType": 0,    # 0=abaixo do player, 1=mesmo nível, 2=acima
      "stepAnime": False,
      "through": True,      # atravessa obstáculos (event invisível)
      "trigger": 3,         # 3 = Autorun (0=action button, 1=player touch, 2=event touch, 3=autorun, 4=parallel)
      "walkAnime": True
    }
  ],
  "x": m.get("startX", 8),  # posição inicial do player (default Map001)
  "y": m.get("startY", 6)
}

# Anexa o evento ao array (events[0] é null por convenção do MZ — manter)
if not m["events"]:
    m["events"] = [None]
m["events"].append(new_event)

map_path.write_text(json.dumps(m, indent=4, ensure_ascii=False))
```

### Mapeamento do campo `trigger` (eventos de mapa)

| Valor | Trigger MZ |
|-------|-----------|
| 0 | Action Button |
| 1 | Player Touch |
| 2 | Event Touch |
| 3 | **Autorun** (usar aqui) |
| 4 | Parallel |

### Risco: validar o `startMapId`

Após editar `Map001.json`, confirmar com:

```bash
python3 -c "import json; s=json.load(open('Jhonny/data/System.json')); print('startMapId:', s.get('startMapId'))"
```

Se retornar `1`, o Map001 é o mapa inicial — autorun dispara ao iniciar Playtest.

## Detalhes de Implementação

### Estrutura do Event

```
# Event "Init Corrida" em Map001
# Trigger: Autorun
# Condition: (nenhuma — sempre dispara quando o mapa carrega)

# Define corrida 1 para teste (Lenda — 6 cenas)
Control Variables: VAR_RACE_ID = 1

# Inicia o minigame
Call Common Event: EV_RaceOrchestrator

# Após o Orchestrator retornar (vitória ou crash restart), o event continua.
# Para o protótipo, o event "termina" aqui — o Orchestrator+Crash cuida do loop.
```

### Por que trigger "Autorun" e não "Parallel"?

- **Autorun:** dispara quando o mapa carrega e o event está na tela. Bloqueia input do player mas permite `Wait`. É o trigger correto para cutscenes e scripts init.
- **Parallel:** dispara imediatamente mas não bloqueia input; corre em paralelo com o player. Para um init único, Autorun é mais seguro.

> **Atenção:** se o Orchestrator loop infinitamente (via Crash reiniciando), o Autorun nunca "termina". Para o protótipo, isso é aceitável. Em polish, adicionar `Erase Event` após o Orchestrator (mas isso só roda se o Orchestrator retornar normalmente).

### Posição do Event

Pode ser em qualquer tile do mapa. O event não precisa ser visível — pode ficar "abaixo" do player ou fora da tela. Recomendação:
- Colocar na posição inicial do player (System.json → `startX`, `startY`).
- Usar graphic "transparente" (sem sprite) para não aparecer.

### Variações por corrida

Para testar Corrida 2 ou 3, mudar `VAR_RACE_ID` no event:
- `VAR_RACE_ID = 1` → 6 cenas (Lenda).
- `VAR_RACE_ID = 2` → 8 cenas (Rachadura).
- `VAR_RACE_ID = 3` → 10 cenas (Abismo — inclui Curva do Diabo).

Em playtest, comentar/descomentar a linha conforme a corrida a testar. Para o protótipo, manter `VAR_RACE_ID = 1`.

### Mapa "Garagem" — descrição visual

O spec menciona cena "Roleta Paulista" mas o mapa inicial do Jhonny é simples. Para o protótipo visual:
- Mapa pequeno (17x13 tiles é o default do MZ).
- Tileset: Interior ou Exterior (não importa muito — o minigame sobrepõe tudo com pictures).
- BGM: opcional (silêncio é aceitável durante o minigame).
- O player aparece e imediatamente o event autorun dispara.

### Erro comum a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Trigger "Action Button" | Event não dispara sozinho | Usar "Autorun" |
| Trigger "Parallel" + Event sem Wait | Travamento (loop infinito síncrono) | Usar "Autorun" |
| Esquecer `VAR_RACE_ID` | Default 0 → Orchestrator entra em branch undefined → bug | Sempre setar `VAR_RACE_ID` antes de chamar Orchestrator |
| Event tem Condition Switch | Não dispara se switch OFF | Deixar Condition vazia |
| `startMapId` aponta para mapa errado | Jogo abre em mapa sem event | Verificar `System.json` |

## visual_validation

Ao concluir esta task:
1. Salvar o projeto.
2. Rodar Playtest (F5 ou botão Playtest no MZ Editor).
3. O jogo abre direto no Map001 (ou no mapa configurado).
4. Após ~0.1s (tempo do event autorun disparar), o fadein começa.
5. Após 0.3s, a cena 1 do minigame aparece renderizada.
6. Pressione F9 → `VAR_RACE_ID = 1`, `VAR_RACE_N_CENAS = 6`, `VAR_SCENE_INDEX = 0`.
7. Console (F12) sem erros.

## Critérios de Sucesso

- [ ] Event com trigger "Autorun" existe em Map001 (ou novo mapa).
- [ ] Event define `VAR_RACE_ID = 1` antes de chamar Orchestrator.
- [ ] Event chama `EV_RaceOrchestrator`.
- [ ] `System.json` → `startMapId` aponta para o mapa correto.
- [ ] Ao rodar Playtest, a corrida começa automaticamente sem input do jogador.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Criar cena VN prévia (fora de escopo do protótipo — corrida inicia direto).
- Implementar variação entre corridas (feito parcialmente pela task 6.3).
- Renderizar o mapa da garagem (não relevante — pictures cobrem tudo).
- Implementar transição entre corridas (feito na task 6.4 — tela de vitória).
