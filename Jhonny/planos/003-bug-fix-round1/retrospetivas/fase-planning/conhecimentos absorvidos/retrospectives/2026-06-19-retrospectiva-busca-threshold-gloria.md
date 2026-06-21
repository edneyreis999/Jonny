# Retrospectiva Técnica — Busca do threshold de glória

**Data:** 2026-06-19
**Tarefa:** Localizar o score mínimo de glória para passar da primeira corrida e o ponto exato onde esse valor está definido.
**Resultado:** Entregue. Threshold identificado em `Jhonny/data/CommonEvents.json:3089-3095`, dentro do Common Event ID 19 (`EV_VitoriaCorrida`).

---

## 1. Resumo da tarefa

- **Solicitado pelo usuário:**
  1. Identificar o score mínimo de glória para passar da primeira corrida.
  2. Localizar onde esse valor está setado.
  3. Identificar qual CommonEvent contém o trecho `const thresholds = { 1: 60, 2: 100, 3: 150 };`.
- **Resultado entregue:**
  - Thresholds: corrida 1 = 60, corrida 2 = 100, corrida 3 = 150, fallback = 60.
  - Script embutido em Common Event 19 (`EV_VitoriaCorrida`), comando code 355 (Script).
  - Variáveis envolvidas: 105 (`PONTOS_GLORIA`), 100 (`raceId`), 117 (`VITORIA_PASSOU`).
  - Mapeamento de IDs em `Jhonny/js/plugins/Jhonny_RaceHelper.js:124-128`.
- **Critério de conclusão:** Usuário confirmou que entendeu a localização e encaminhou discussão arquitetural sobre onde o valor deveria morar.
- **Restrições relevantes:** Projeto RPG Maker MZ (`Jhonny/`), dados em JSON read-only em runtime, CEs contêm scripts inline com `code: 355`.

---

## 2. Decisões técnicas e inferências

### 2.1 Busca textual via `grep` em `Jhonny/js/plugins/` e `Jhonny/data/`

- **Decisão:** Procurar por `glori|glory|score|threshold|pontos` antes de abrir qualquer arquivo.
- **Motivo:** Não havia indício prévio do local; glosário do projeto usa PT-BR (`glória`) e identificadores em EN (`PONTOS_GLORIA`).
- **Evidência:** Achado direto em `Jhonny/js/plugins/Jhonny_RaceHelper.js:124` (mapeamento `105: "PONTOS_GLORIA"`) e o script inline em `CommonEvents.json:3093`.
- **Resultado:** Funcionou.
- **Avaliação:** Necessária. Busca ampla inicial foi correta.
- **Melhoria:** Poderia ter sido feita com filtro mais estreito já incluindo `thresholds` desde a primeira query.

### 2.2 Inferir o ID do CE por contagem de blocos via `awk`

- **Decisão:** Para responder "qual CE", em vez de interpretar a estrutura JSON, varri o arquivo buscando o último `"id":` antes da linha 3093.
- **Motivo:** Arquivo minificado/large, sem saber se haveria campo `name` acessível.
- **Evidência:** `awk` retornou `id: 19`. Em seguida confirmei `name: "EV_VitoriaCorrida"` na linha 3441.
- **Resultado:** Funcionou, mas exigiu várias chamadas adicionais.
- **Avaliação:** Parcialmente necessária; abordagem com `python3 -c 'json.load(...)'` teria resolvido em uma única chamada e devolvido id + name + linha.
- **Melhoria:** Tratar `CommonEvents.json` como JSON estruturado (parser), não como texto.

---

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta/comando                            | Objetivo                                     | Necessário? | Contribuiu? | Observação                                                                            |
|-----------------------------------------------|----------------------------------------------|-------------|-------------|---------------------------------------------------------------------------------------|
| `find` listando arquivos                      | Visão geral do repo                          | Não         | Pouco       | Supérfluo. `grep -rn` direto seria mais econômico.                                    |
| `grep -rn -i glori\|score...`                 | Localizar referências                        | Sim         | Sim         | Teria sido mais enxuto já filtrando por `thresholds\|PONTOS_GLORIA`.                  |
| `grep -rn -i vitor\|threshold...` no helper   | Confirmar lógica de vitória                  | Sim         | Sim         | —                                                                                     |
| `grep -rn "VITORIA_PASSOU\|117"` nos eventos  | Confirmar fluxo de uso da variável           | Parcial     | Sim         | Confirmou `code: 117` recorrente; útil.                                               |
| `grep -n "const thresholds"`                  | Localizar linha do script                    | Sim         | Sim         | Poderia ter sido a primeira chamada.                                                  |
| `awk` várias invocações                       | Descobrir id/name do CE                      | Sim         | Sim         | **Redundante.** 5+ chamadas para algo que `python3 -c "json.load"` resolveria em 1.   |
| `Read` em `CommonEvents.json` (offset 1, 20)  | Confirmar estrutura                          | Não         | Pouco       | Estrutura já conhecida via CLAUDE.md.                                                 |
| `Read` final do CE 19                         | Confirmar presença do campo `name`          | Sim         | Sim         | Necessário para fechar a resposta ao usuário.                                         |

**Tentativas evitáveis:**
- Repetidas chamadas `awk` para localizar o bloco do CE.
- Leitura inicial de cabeçalho do `CommonEvents.json` (estrutura já documentada).

---

## 4. Intervenções e correções do usuário

| # | Instrução do usuário                                            | Estado anterior                         | Causa                                      | Mudança                                              | Regra reutilizável                                                |
|---|------------------------------------------------------------------|-----------------------------------------|--------------------------------------------|------------------------------------------------------|-------------------------------------------------------------------|
| 1 | "Qual CommonEvent que tem essa info?"                            | Respondi o arquivo/linha, não o CE      | Resposta focou no path, não na identidade  | Procurar e retornar ID + nome do CE                  | Sempre responder às três dimensões: arquivo + linha + ID/name    |
| 2 | "isso deveria ficar armazenado em uma variável ou no helper"     | Apenas localizei, não propus arquitetura | Escopo implícito era "localizar"          | Proponho refator (não implemento) e pergunto formato | Oferecer observação arquitetural quando houver code smell claro  |
| 3 | "não precisa implementar agora"                                  | —                                       | Escopo explícito                           | Apenas registro a recomendação                       | Confirmar antes de implementar (instrução global já cobre)       |

**Classificação:**
- #1 — **Correção de resposta incompleta** (minha).
- #2 — **Esclarecimento de ambiguidade real** (escopo "localizar" vs "avaliar arquitetura").
- #3 — **Mudança de escopo explícita** (não implementar).

---

## 5. Análise de desperdício

| Desperdício                                                     | Impacto | Causa                                              | Como evitar                                                          |
|-----------------------------------------------------------------|---------|----------------------------------------------------|----------------------------------------------------------------------|
| Múltiplas chamadas `awk` para achar id/name do CE              | Médio   | Tratar JSON como texto                             | Usar `python3 -c "import json,sys; ..."` para localizar nó por linha |
| `find` amplo no início                                          | Baixo   | Hábito de "ver o repo" antes de grep               | Pular direto para `grep -rn` no escopo `Jhonny/`                     |
| `Read` no header do JSON                                        | Baixo   | Confirmar estrutura                                | Estrutura já documentada em `Jhonny/CLAUDE.md`                       |
| Busca ampla (`glori|glory|score|pontos`) sem `thresholds`       | Baixo   | Foco no glossário em vez da lógica                 | Incluir termo técnico `thresholds\|limiar\|mínimo` desde o início    |

---

## 6. Caminho mínimo recomendado

1. **Ação:** `grep -rn "thresholds\|PONTOS_GLORIA\|VITORIA_PASSOU" Jhonny/`
   - **Entrada:** termos prováveis.
   - **Ferramenta:** Bash/grep.
   - **Resultado esperado:** linha do script inline + mapeamento de variáveis.
   - **Critério:** pelo menos um match com `thresholds = { ... }`.
2. **Ação:** `python3` script curto para localizar o CE pai.
   - **Entrada:** linha do match, arquivo `CommonEvents.json`.
   - **Ferramenta:** Bash (python3).
   - **Resultado esperado:** `{ "id": 19, "name": "EV_VitoriaCorrida", "line": ... }`.
   - **Critério:** id e name identificados.
3. **Ação:** Resposta consolidada ao usuário com arquivo + linha + id + name + variáveis envolvidas + referência ao `Jhonny_RaceHelper.js`.
   - **Critério:** usuário confirmar localização.

Encerrar após passo 3 se não houver pedido adicional.

---

## 7. Conhecimento reutilizável

### Fatos confirmados
- Thresholds de vitória por corrida: `{ 1: 60, 2: 100, 3: 150 }`, fallback `60`.
- Origem: script inline `code: 355` no Common Event **19** (`EV_VitoriaCorrida`), em `Jhonny/data/CommonEvents.json:3089-3095`.
- Variáveis envolvidas (mapeamento em `Jhonny_RaceHelper.js:124-128`):
  - `100` → `raceId` (não consta no trecho visto, mas referenciado pelo script).
  - `105` → `PONTOS_GLORIA`.
  - `117` → `VITORIA_PASSOU`.
- Identado em Common Events: campo `name` aparece **após** `list`, não no cabeçalho (MZ pattern).

### Preferências do usuário
- Querer respostas com **três dimensões**: arquivo + linha + ID/nome do evento.
- Valorizar observações arquiteturais (code smell) mesmo em tarefas "apenas localize".
- **Não** implementar sem confirmação explícita (consistente com a regra global).
- Preferência por design "easy to extend" — ver regra de negócio escondida como code smell.

### Restrições técnicas
- `Jhonny/data/*.json` é read-only em runtime; edições devem ser validadas em Playtest.
- Scripts inline em CE usam `code: 355`, parâmetros em array com `\n` separando linhas.
- Projeto segue convenção PT-BR para variáveis (`PONTOS_GLORIA`, `VITORIA_PASSOU`) e EN para identifiers internos.

### Armadilhas conhecidas
- Tratar `CommonEvents.json` como texto plano gera múltiplas chamadas `awk` para identificar o CE pai.
- Responder só com arquivo + linha sem ID/nome do CE força uma nova rodada de perguntas.

### Heurísticas recomendadas
- Para qualquer "onde está setado X" em projeto MZ: `grep -rn` primeiro, parser JSON segundo.
- Sempre cruzar com `Jhonny_RaceHelper.js` para nomes canônicos de variáveis.
- Em evento de gatilho dinâmico, confirmar `raceId` (var 100) está sendo setado antes do CE 19 rodar.

---

## 8. Informações que deveriam estar no prompt inicial

- **Útil:** termos prováveis para o threshold (`thresholds`, `limiar`, `PONTOS_GLORIA`). Teriam reduzido a primeira query.
- **Útil:** pedido explícito de retornar ID + nome do Common Event (não apenas caminho).
- **Opcional:** tipo de busca preferida (texto vs JSON parser).
- **Opcional:** se deseja observação arquitetural junto com a resposta.

Nada classificado como **obrigatório** — o pedido original estava claro o suficiente para alcançar o resultado; as omissões só impactaram eficiência.

---

## 9. Melhorias nos artefatos do fluxo

### 9.1 Análise técnica
- **Problema observado:** Threshold de vitória está embutido em script inline dentro de CE; difícil de descobrir e modificar.
- **Informação ausente:** Localização canônica da regra de negócio "score mínimo por corrida".
- **Por que pertence à análise técnica:** É uma decisão arquitetural (regra de negócio no lugar certo), não operacional.
- **Seção sugerida:** "Regras de negócio e suas fontes de verdade".
- **Texto sugerido:**
  > **Threshold de vitória por corrida:** atualmente definido inline em `CommonEvents.json` CE 19 (`EV_VitoriaCorrida`), script `code: 355`. Valores: `{ 1: 60, 2: 100, 3: 150 }`. **Recomendação:** mover para `Jhonny_RaceHelper.js` como plugin parameter ou objeto de config exposto em `window.JhonnyRace`, com o CE chamando uma função helper (`JhonnyRace.evalVictory(105, 100, 117)`). Permite adicionar corridas futuras editando uma única fonte.
- **Impacto:** Torna a regra rastreável e extensível; próximo refactor já parte da análise.

### 9.2 Plano de implementação
- **Problema:** Sem plano para o refactor da localização do threshold.
- **Deficiência:** Não há etapa de "consolidar regras de negócio no helper".
- **Etapa afetada:** Próxima fase (refactor arquitetural).
- **Alteração recomendada:** Adicionar fase de "centralização de config de corridas".
- **Texto sugerido:**
  > **Fase N — Centralização de config de corridas:** mover `THRESHOLDS` e lógica `isVictory` para `Jhonny_RaceHelper.js`, expondo via plugin parameter ou namespace `window.JhonnyRace`. Substituir o script inline do CE 19 por chamada `JhonnyRace.evalVictory(...)`. Critério: Playtest confirma que var 117 continua setada corretamente para corridas 1, 2 e 3.
- **Como reduz custo:** Evita reabrir o mesmo script inline em futuras manutenções.

### 9.3 Tasks da fase executada
Esta tarefa foi uma consulta de localização (read-only). **Nenhuma task foi executada.**

`Nenhuma alteração recomendada para as tasks desta fase.`

### 9.4 Problemas fora do escopo dos artefatos
- **Problema:** Minhas múltiplas chamadas `awk` para localizar id/name do CE.
- **Por que fora do escopo:** Falha operacional da LLM, não deficiência de especificação. A informação de que `CommonEvents.json` é JSON estruturado já estava acessível.
- **Tratamento:** Heurística operacional (ver seção 7) — usar parser JSON em vez de `awk`.
- **Ação externa:** Nenhuma alteração em artefatos.

### 9.5 Matriz de rastreabilidade

| Problema observado                                     | Causa principal                            | Artefato responsável        | Alteração necessária                                          | Prioridade |
|--------------------------------------------------------|--------------------------------------------|-----------------------------|---------------------------------------------------------------|------------|
| Threshold escondido em script inline dentro de CE      | Decisão arquitetural não registrada        | Análise técnica             | Documentar fonte de verdade + propor `Jhonny_RaceHelper.js`  | Alta       |
| Sem plano de refactor futuro                           | Plano atual não cobre centralização        | Plano de implementação      | Adicionar fase de centralização de config                     | Média      |
| Múltiplas chamadas `awk` para id/name do CE            | Tratou JSON como texto                     | Fora do escopo              | Heurística operacional (parser JSON)                          | Baixa      |
| Resposta inicial sem ID/nome do CE                     | Foco em path em vez de identidade          | Fora do escopo              | Heurística: responder sempre com arquivo + linha + ID + name | Baixa      |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica
Adicionar seção:

```markdown
### Regras de negócio e suas fontes de verdade

**Threshold de vitória por corrida:**
- Local atual: `Jhonny/data/CommonEvents.json`, CE 19 (`EV_VitoriaCorrida`), comando `code: 355`.
- Valores: `{ 1: 60, 2: 100, 3: 150 }`, fallback `60`.
- Variáveis: `PONTOS_GLORIA` (105), `raceId` (100), `VITORIA_PASSOU` (117).
- **Débito arquitetural:** regra de negócio dentro de script inline dificulta extensão.
  Recomendado mover para `Jhonny_RaceHelper.js` (plugin parameter ou
  `window.JhonnyRace.THRESHOLDS`) e expor helper `evalVictory(pontos, raceId)`.
```

#### Patch sugerido para o plano de implementação
Adicionar fase:

```markdown
## Fase N — Centralização de config de corridas

- Mover `THRESHOLDS` e `isVictory` para `Jhonny_RaceHelper.js` (preferência: plugin
  parameter para ajuste via Plugin Manager).
- Expor `window.JhonnyRace.evalVictory(pontosVarId, raceIdVarId, outVarId)`.
- Substituir script inline do CE 19 por chamada `JhonnyRace.evalVictory(105, 100, 117)`.
- Critério de aceite: Playtest confirma var 117 setada corretamente para corridas 1/2/3.
```

#### Patch sugerido para as tasks da fase executada
`Nenhuma alteração recomendada para as tasks desta fase.`

#### Ações fora do fluxo de especificação
- Adicionar heurística operacional ao acervo da LLM: "em projeto RPG Maker MZ, ao
  precisar localizar a qual CE/Map event um trecho pertence, use parser JSON em vez
  de `awk`".
- Considerar criar atalho de skill `rpg-maker-mz-data-json` com snippet de busca
  "dado um número de linha em `data/*.json`, retorne o CE/event/objeto pai".

---

## 10. Checklist operacional (próxima execução)

- [ ] Antes de grep amplo, definir 3-5 termos (incluindo técnicos: `thresholds`, `limiar`).
- [ ] Para `data/*.json`, preferir parser JSON (`python3`) sobre `awk`/`grep` textual.
- [ ] Resposta de "onde está" deve incluir: **arquivo + linha + ID + nome** do objeto pai.
- [ ] Cruzar variáveis com `Jhonny_RaceHelper.js` para nomes canônicos.
- [ ] Em scripts inline (`code: 355`), expandir `\n` mentalmente antes de interpretar.
- [ ] Não implementar refactors sem confirmação explícita (regra global).
- [ ] Oferecer observação arquitetural quando encontrar regra de negócio em local não-ideal.
- [ ] Validar estrutura MZ: `name`/`switchId`/`trigger` aparecem **depois** de `list` no CE.
- [ ] Critério de conclusão: usuário confirmar localização e/ou redirecionar escopo.
