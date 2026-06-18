---
title: "Retrospectiva Técnica — Fase 2: Pipeline de Assets"
type: retrospectiva-tecnica
fase: 2
status: completa-validada
data: "2026-06-18"
destinatario: "LLM futura executando tarefa semelhante"
---

# Retrospectiva Técnica — Fase 2: Pipeline de Assets

## 1. Resumo da tarefa

**Resultado solicitado:** executar a Fase 2 do plano `core_loop_corrida/tasks`, criando o pipeline de assets do minigame de corrida no projeto RPG Maker MZ `Jhonny`.

**Resultado entregue:**

- 16 PNGs criados em `Jhonny/img/pictures/race/`.
- 3 SEs criados em `Jhonny/audio/se/`: `crash_metal.ogg`, `freada.ogg`, `pneu_cantando.ogg`.
- `EV_Preload` criado no Common Event ID 3 em `Jhonny/data/CommonEvents.json`.
- Tasks e plano atualizados como completos.
- Validação visual confirmada pelo usuário em Playtest no RPG Maker MZ.

**Critérios de conclusão:**

- PNGs existentes, abrindo corretamente e com dimensões esperadas.
- OGGs válidos e reconhecidos pelo RPG Maker.
- `EV_Preload` executando `Show Picture -> Wait 1 frame -> Erase Picture`.
- Playtest sem erro de carregamento e sem hitch perceptível.

**Restrições relevantes:**

- Pictures devem ser PNG, com alpha para botões, overlays e elementos transparentes.
- Áudio deve ser Ogg Vorbis.
- `CommonEvents.json` usa comandos nativos do RPG Maker MZ.
- O projeto tinha assets padrão de áudio em `Jhonny/audio/se/`.
- O usuário preferiu reutilizar sons padrão do RPG Maker.

## 2. Decisões técnicas e inferências

### Decisão: usar `Jhonny/planos/001-prototipo-core-loop/fase2/retrospectiva.md` para esta retrospectiva

- **Motivo:** o usuário não forneceu caminho explícito nesta solicitação, mas havia convenção observável.
- **Evidência disponível:** existia `Jhonny/planos/001-prototipo-core-loop/fase1/retrospectiva.md`; também existia diretório `fase2/`.
- **Resultado:** funcionou; o caminho era consistente com a organização do projeto.
- **Avaliação:** necessária para cumprir a instrução de não escolher silenciosamente um local ambíguo.
- **Melhoria futura:** quando houver `faseN/retrospectiva.md` em fases anteriores, tratar `fase atual/retrospectiva.md` como convenção inequívoca e informar o caminho antes de escrever.

### Decisão: criar placeholders visuais via Pillow

- **Motivo:** não havia arte final fornecida; a task aceitava placeholders sólidos/coloridos.
- **Evidência disponível:** `task-2.1.md` dizia que placeholders eram aceitáveis para protótipo rápido; `PIL` estava disponível.
- **Resultado:** funcionou; PNGs foram validados e o usuário confirmou o playtest.
- **Avaliação:** necessária para entregar assets sem depender de ferramentas gráficas externas.
- **Melhoria futura:** verificar de imediato se `PIL` existe e gerar todos os PNGs em um único script curto, sem exploração adicional.

### Decisão: criar 16 PNGs em vez de apenas a lista mínima inicial

- **Motivo:** havia inconsistência entre contagens e nomes de arquivos nas tasks.
- **Evidência disponível:** `task-2.1.md` falava em 15 arquivos, mas listava 14 nomes concretos; `task-3.3.md` referenciava `sinal_red` e `placa_curva_dir`.
- **Resultado:** funcionou; evitou erro futuro de "Image not found" na Fase 3.
- **Avaliação:** necessária, porque a Fase 3 dependia desses nomes.
- **Melhoria futura:** antes de gerar assets, buscar no plano por `race/` e nomes de pictures referenciados nas fases seguintes.

### Decisão: criar `EV_Preload` diretamente em `CommonEvents.json`

- **Motivo:** o plano dizia que Common Events eram manuais, mas havia slot vazio e a estrutura JSON era simples.
- **Evidência disponível:** `CommonEvents.json` tinha IDs 3 e 4 vazios; comandos MZ para `Show Picture`, `Wait` e `Erase Picture` são representáveis em JSON.
- **Resultado:** funcionou; usuário validou no RPG Maker.
- **Avaliação:** útil, mas exigia cuidado. A documentação da Fase 1 dizia "não automatizar Database/Common Events", então a decisão contrariou uma heurística anterior com base em evidência local.
- **Melhoria futura:** documentar nas tasks que Common Events simples podem ser criados por JSON quando houver slot vazio e comandos conhecidos; manter validação obrigatória no MZ.

### Decisão: inicialmente tentar gerar áudio sintético

- **Motivo:** a task pedia criar 3 SEs e mencionava fontes externas ou geração sintética como opção.
- **Evidência disponível:** havia `numpy`, mas não havia `ffmpeg`; `afconvert` listava Ogg/Vorbis.
- **Resultado:** falhou parcialmente; `afconvert` falhou ao codificar Vorbis a partir de WAV. O usuário interrompeu e pediu sons padrão.
- **Avaliação:** desnecessária. A pasta `Jhonny/audio/se/` já continha muitos sons padrão; isso deveria ter sido verificado antes.
- **Melhoria futura:** primeiro listar `Jhonny/audio/se/*.ogg` e procurar sons padrão adequados; só gerar áudio novo se não houver opção local ou se o usuário pedir.

### Decisão: reaproveitar sons padrão via cópia/alias

- **Motivo:** usuário instruiu explicitamente: "use os sons padrão que vem no RPG Maker".
- **Evidência disponível:** existiam `Crash.ogg`, `Evasion1.ogg`, `Move2.ogg` em `Jhonny/audio/se/`.
- **Resultado:** funcionou; arquivos finais são Ogg Vorbis e foram validados no MZ.
- **Avaliação:** correta após a preferência do usuário.
- **Melhoria futura:** incluir na task 2.2 um caminho preferencial: "usar sons padrão existentes quando disponíveis".

## 3. Uso de ferramentas, comandos e scripts

| Ferramenta ou comando | Objetivo | Necessidade | Resultado | Contribuiu diretamente | Abordagem mais simples | Como evitar redundância |
|---|---|---|---|---|---|---|
| `obsidian read .../tasks.md` | Ler plano da Fase 2 | Necessário | Fase 2 e critérios identificados | Sim | Não | Usar uma leitura localizada no arquivo referenciado pelo link |
| `rg --files`, `find Jhonny` | Mapear estrutura do projeto | Parcialmente necessário | Confirmou paths de planos, assets e áudio | Sim | Poderia limitar a `Jhonny/planos`, `Jhonny/img`, `Jhonny/audio` | Evitar listagem ampla de muitos assets padrão |
| Leitura completa de `task-2.1.md`, `task-2.2.md`, `task-2.3.md` | Obter requisitos detalhados | Necessário | Requisitos de PNG, OGG e preload confirmados | Sim | Não | Ler só as tasks da fase executada |
| Leitura de `fase-2-atualizada.md` e `fase2/Atualizacao.md` | Conferir atualizações da Fase 2 | Útil | Confirmou avisos e aprendizados da Fase 1 | Parcial | Bastava ler `fase-2-atualizada.md` | Não ler arquivos duplicados se um resumo já está no plano |
| `python3` com `PIL` | Gerar PNGs | Necessário | 16 PNGs criados | Sim | Script menor e mais direto | Gerar depois de confirmar todos os nomes de assets |
| `which ffmpeg`, `afconvert -hf`, testes de conversão | Tentar viabilizar áudio sintético | Desnecessário | Falha de Vorbis via `afconvert` | Não para solução final | Usar sons padrão locais | Listar sons existentes antes de explorar encoders |
| `python3 -m venv ... && pip install soundfile` | Preparar escrita direta de OGG | Desnecessário | Venv temporário criado; execução abortada pelo usuário | Não | Não instalar nada; copiar OGGs existentes | Nunca instalar dependência antes de checar assets locais |
| `find Jhonny/audio ...`, `afinfo`, `file` | Escolher e validar sons padrão | Necessário após correção | `Crash`, `Evasion1`, `Move2` escolhidos e validados | Sim | Poderia usar só `file` + nomes prováveis | Primeiro procurar `Crash.ogg`/`Evasion*.ogg`/`Move*.ogg` |
| `python3` para editar `CommonEvents.json` | Criar `EV_Preload` | Necessário | Common Event ID 3 criado | Sim | Manual via MZ, mas mais lento | Validar slot vazio antes e escrever JSON indentado desde o início |
| `rg` em planos por nomes de assets | Descobrir `sinal_red` e `placa_curva_dir` | Útil, feito tarde | Evitou falta de assets na Fase 3 | Sim | Deveria ter sido feito antes de gerar PNGs | Buscar referências `race/` como pré-passo |
| Geração de folha de contato + `view_image` | Inspeção visual dos PNGs | Útil | Confirmou coerência visual dos placeholders | Sim | Poderia abrir 1-2 PNGs críticos | Usar folha de contato apenas para múltiplos assets novos |
| `git diff`, `git status` | Auditar mudanças | Necessário | Identificou JSON minificado e arquivos não relacionados | Sim | Não | Reformatar JSON logo ao escrever |

**Chamadas redundantes ou evitáveis principais:**

- Exploração de tool/Serena e ativação que criou `.serena/`, depois removido. Para esta tarefa, leitura de arquivos e scripts locais bastavam.
- Tentativa de pipeline de áudio sintético antes de verificar os sons padrão existentes.
- Leitura/listagem ampla de diretórios com muitos assets padrão, consumindo contexto sem necessidade.
- Minificação inicial de `CommonEvents.json`, corrigida depois com reformat.

## 4. Intervenções e correções do usuário

### Intervenção: "use os sons padrão que vem no RPG Maker. eles estão na pasta Jhonny/audio"

- **Tipo:** correção de desalinhamento com uma preferência não explicitada antes, mas inferível pelo contexto do RPG Maker.
- **Antes da intervenção:** a execução tentou gerar áudio sintético e instalar suporte para escrever OGG.
- **Suposição causadora:** interpretar "criar 3 Sound Effects" como necessidade de produzir sons novos.
- **Mudança depois da correção:** foram criados aliases/cópias de sons padrão já existentes: `Crash.ogg`, `Evasion1.ogg`, `Move2.ogg`.
- **Regra reutilizável:** em projetos RPG Maker, antes de gerar ou baixar áudio, verificar `audio/se/` e preferir assets padrão quando a qualidade de placeholder for suficiente.

### Intervenção: "Tudo funcionando! testei..."

- **Tipo:** confirmação de validação, não correção.
- **Antes da intervenção:** os arquivos estavam criados e a validação automática havia passado, mas o playtest MZ estava pendente.
- **Mudança depois da confirmação:** a documentação foi atualizada para "COMPLETA E VALIDADA".
- **Regra reutilizável:** quando a validação depende do MZ Editor/Playtest, aguardar ou registrar explicitamente a confirmação do usuário antes de marcar como validada.

## 5. Análise de desperdício

| Desperdício | Impacto estimado | Causa | Como evitar |
|---|---:|---|---|
| Pipeline de áudio sintético e tentativa de instalar `soundfile` | Alto | Não verificar primeiro `Jhonny/audio/se/` como fonte local | Primeiro listar assets padrão e criar aliases por cópia |
| Testes com `afconvert` para Ogg/Vorbis | Médio | Confiar na listagem de suporte do `afconvert` sem necessidade real | Só testar encoder se for indispensável gerar áudio novo |
| Leitura/listagem ampla de arquivos do projeto | Médio | Exploração geral antes de restringir a Fase 2 | Ler apenas `tasks.md`, `task-2.1`, `task-2.2`, `task-2.3`, `CommonEvents.json`, `audio/se` e `img/pictures/race` |
| Descobrir `sinal_red`/`placa_curva_dir` tarde | Médio | Buscar referências futuras só após criar os primeiros PNGs | Fazer `rg 'race/'` ou buscar nomes de pictures antes de gerar assets |
| Minificar `CommonEvents.json` e reformatar depois | Baixo | Uso inicial de `json.dumps(..., separators=...)` | Escrever JSON com `indent=4` desde o início |
| Criar e remover `.serena/` | Baixo | Ativação de ferramenta sem benefício material para task de assets | Para tarefas de assets/JSON simples, usar shell e leituras diretas |
| Atualizações intermediárias ao usuário mais numerosas que o necessário | Baixo | Tentativas exploratórias e correções de rota | Agrupar atualizações por etapa concluída quando a tarefa é curta |

## 6. Caminho mínimo recomendado

1. **Ler o plano e as tasks da Fase 2.**
   - Entrada: link ou path do plano.
   - Ferramenta: `obsidian read` ou `sed`.
   - Resultado esperado: escopo de 2.1, 2.2, 2.3 conhecido.
   - Critério: requisitos de PNG, OGG e preload identificados.

2. **Coletar todos os nomes de pictures antes de gerar assets.**
   - Entrada: `task-2.1.md`, `task-2.3.md`, `task-3.3.md`.
   - Ferramenta: `rg 'race/|sinal_red|placa_curva|overlay_risk|btn_' Jhonny/planos`.
   - Resultado esperado: lista final de assets, incluindo `sinal_red` e `placa_curva_dir`.
   - Critério: nenhum nome referenciado por fase próxima está ausente.

3. **Gerar PNGs com Pillow.**
   - Entrada: lista de filenames e dimensões.
   - Ferramenta: script Python com `PIL`.
   - Resultado esperado: PNGs em `Jhonny/img/pictures/race/`.
   - Critério: `file`/`PIL` confirma dimensões e RGBA.

4. **Criar SEs usando sons padrão.**
   - Entrada: `Jhonny/audio/se/`.
   - Ferramenta: `find`, `cp`, `file`, opcional `afinfo`.
   - Resultado esperado: `crash_metal.ogg`, `freada.ogg`, `pneu_cantando.ogg`.
   - Critério: arquivos são Ogg Vorbis e aparecem no MZ.

5. **Criar `EV_Preload` no primeiro Common Event vazio seguro.**
   - Entrada: `Jhonny/data/CommonEvents.json`.
   - Ferramenta: Python + `json`.
   - Resultado esperado: Common Event `EV_Preload`, trigger Call, comandos `231/230/235`.
   - Critério: JSON parseia e contém `Show/Wait/Erase` para todos os assets.

6. **Atualizar documentação de tasks e conclusão.**
   - Entrada: tasks da Fase 2 e arquivo de conclusão.
   - Ferramenta: `apply_patch`.
   - Resultado esperado: status completo, pendências de playtest marcadas corretamente.
   - Critério: documentação diferencia validação automática de validação MZ.

7. **Validar automaticamente.**
   - Entrada: PNGs, OGGs, `CommonEvents.json`.
   - Ferramenta: `file`, `afinfo`, Python.
   - Resultado esperado: formatos válidos e contagens corretas.
   - Critério: sem erro de parse/formato.

8. **Solicitar ou aguardar validação manual no MZ.**
   - Entrada: instruções de teste do `EV_Preload`.
   - Ferramenta: RPG Maker MZ Playtest, usuário.
   - Resultado esperado: sem hitch e sons tocando.
   - Critério: usuário confirma funcionamento; só então marcar "validada".

## 7. Conhecimento reutilizável

### Fatos confirmados

- `Jhonny/img/pictures/race/` é o diretório correto para pictures da corrida.
- `Jhonny/audio/se/` contém sons padrão do RPG Maker em Ogg Vorbis.
- `CommonEvents.json` tinha o ID 3 vazio e foi usado para `EV_Preload`.
- Comandos MZ usados:
  - `231`: Show Picture.
  - `230`: Wait.
  - `235`: Erase Picture.
- `Show Picture` para pictures em subpasta usa nome sem extensão, por exemplo `race/bg_sinal`.
- `EV_Preload` com `Wait 1 frame` entre `Show` e `Erase` foi validado no Playtest.

### Preferências do usuário

- Preferir sons padrão do RPG Maker quando existirem na pasta do projeto.
- Validação final pode depender do usuário rodando o RPG Maker MZ.
- Registrar conclusões e validações em Markdown no plano do projeto.

### Restrições técnicas

- PNG obrigatório para pictures; alpha necessário para botões, overlays e sprites transparentes.
- Áudio final deve ser Ogg Vorbis, não MP3.
- `afconvert` pode listar Ogg/Vorbis, mas falhou ao converter WAV para Vorbis neste ambiente; não depender dele sem teste.
- Não modificar/reverter alterações não relacionadas no worktree.
- Escrever JSON do RPG Maker com indentação para reduzir diff.

### Armadilhas conhecidas

- `task-2.1.md` tinha inconsistência de contagem: título/descrição mencionavam 11/15, mas havia 14 nomes concretos.
- `task-3.3.md` referenciava assets não listados na task 2.1: `sinal_red` e `placa_curva_dir`.
- Gerar áudio novo é desperdício se os sons padrão satisfazem o protótipo.
- Criar Common Events por JSON pode funcionar para comandos simples, mas precisa de playtest.

### Heurísticas recomendadas

- Antes de criar assets, buscar todas as referências futuras por nome de arquivo.
- Para RPG Maker, preferir assets padrão locais antes de gerar ou baixar placeholders.
- Para JSON de RPG Maker, usar Python + `json`, não edição textual frágil.
- Só marcar "validado" depois de confirmação no MZ quando o critério for visual/engine.

## 8. Informações que deveriam estar no prompt inicial

| Informação ausente | Classificação | Justificativa |
|---|---|---|
| Preferência por sons padrão do RPG Maker | Útil | Teria evitado tentativa de geração sintética e instalação de dependência |
| Lista final de todos os assets referenciados pela Fase 3 | Útil | Teria evitado descoberta tardia de `sinal_red` e `placa_curva_dir` |
| Autorização para criar Common Event via JSON quando simples | Útil | O plano dizia que era manual; a execução automatizou com sucesso |
| Critério de validação manual esperado no MZ | Útil | Ajuda a separar "completa" de "validada" |
| Caminho de retrospectiva técnica | Opcional | A convenção pôde ser inferida por `fase1/retrospectiva.md` |

## 9. Melhorias nos artefatos do fluxo

### 9.1 Melhorias na análise técnica

#### Melhoria 1: documentar fonte preferencial de áudio

- **Problema observado durante a execução:** tentativa desnecessária de gerar áudio sintético.
- **Informação ausente ou incorreta:** a análise técnica não explicitava que o projeto já traz sons padrão adequados para placeholders.
- **Por que pertence à análise técnica:** é uma restrição/fonte de verdade do ambiente de assets, não detalhe de uma task específica.
- **Seção sugerida:** "Assets e formatos".
- **Texto sugerido:**

```markdown
### Fonte preferencial de Sound Effects

Para protótipo, priorizar SEs padrão já existentes em `Jhonny/audio/se/`.
Criar ou baixar áudio novo somente se não houver som padrão aceitável ou se a direção de áudio exigir asset original.
Aliases/cópias com nomes semânticos do minigame são aceitáveis, desde que permaneçam em Ogg Vorbis.
```

- **Impacto esperado:** evita exploração de encoders, geração sintética e dependências extras.

#### Melhoria 2: documentar possibilidade controlada de editar Common Events por JSON

- **Problema observado durante a execução:** a retrospectiva da Fase 1 dizia que Common Events eram manuais, mas a Fase 2 foi automatizada com sucesso.
- **Informação ausente ou incorreta:** faltava distinguir Common Events complexos no editor de Common Events simples serializáveis.
- **Por que pertence à análise técnica:** descreve capacidade/risco técnico do formato RPG Maker MZ.
- **Seção sugerida:** "Database e Common Events".
- **Texto sugerido:**

```markdown
### Common Events em JSON

Common Events simples podem ser criados diretamente em `Jhonny/data/CommonEvents.json` quando:
- houver slot vazio confirmado;
- os códigos de comando MZ forem conhecidos;
- a alteração for validada por parse JSON e Playtest no MZ.

Eventos com Plugin Commands complexos, escolhas aninhadas ou comandos cujo schema não foi confirmado devem ser criados ou revisados no MZ Editor.
```

- **Impacto esperado:** reduz trabalho manual sem generalizar automação arriscada.

### 9.2 Melhorias no plano de implementação

#### Melhoria 1: adicionar checkpoint de varredura de referências de assets antes da Fase 2

- **Problema observado durante a execução:** assets necessários para a Fase 3 foram descobertos depois da geração inicial.
- **Deficiência do plano:** Fase 2 não tinha checkpoint para reconciliar lista de assets com fases consumidoras.
- **Etapa afetada:** Fase 2 antes da task 2.1.
- **Alteração recomendada:** incluir passo de inventário de assets referenciados.
- **Texto sugerido:**

```markdown
Antes de iniciar a task 2.1, varrer as tasks consumidoras de pictures (especialmente 3.3, 3.4, 4.2, 5.5 e 6.2) e consolidar todos os nomes `race/...` em uma lista única. A task 2.1 deve gerar todos os assets referenciados, mesmo que algum nome esteja ausente da lista original.
```

- **Como reduz custo:** evita segunda rodada de geração e risco de erro "Image not found" em fase posterior.

#### Melhoria 2: definir estratégia de áudio padrão antes de criação

- **Problema observado durante a execução:** tentativa de geração de OGG sintético.
- **Deficiência do plano:** não priorizava assets locais antes de fontes externas/sintéticas.
- **Etapa afetada:** task 2.2.
- **Alteração recomendada:** no plano, orientar "local first".
- **Texto sugerido:**

```markdown
Para task 2.2, primeiro procurar SEs existentes em `Jhonny/audio/se/` e criar aliases com os nomes esperados. Só gerar novos sons se os sons padrão forem insuficientes após inspeção.
```

- **Como reduz custo:** elimina instalação de dependências e exploração de conversores.

### 9.3 Melhorias nas tasks da fase executada

#### Task 2.1

- **Informação ausente, ambígua ou incorreta:** contagem inconsistente de assets e ausência de `sinal_red.png`/`placa_curva_dir.png`.
- **Consequência observada:** foi necessário buscar referências em Fase 3 e gerar assets extras depois.
- **Alteração recomendada:** corrigir lista de arquivos e critério de sucesso.
- **Texto sugerido para substituir/adicionar:**

```markdown
> **Nota de consistência:** a lista concreta de pictures é a fonte de verdade. Antes de executar, reconciliar esta lista com todas as referências `race/...` nas tasks consumidoras.

Adicionar aos arquivos obrigatórios:
- `sinal_red.png` (200x150) — sinal vermelho transparente usado por `EV_RenderSinal`
- `placa_curva_dir.png` (~170x140) — placa de curva à direita usada por `EV_RenderCurva`

Critério de sucesso:
- Todos os arquivos referenciados por `task-3.3`, `task-3.4`, `task-4.2`, `task-5.5` e `task-6.2` existem em `Jhonny/img/pictures/race/`.
```

- **Como validar:** rodar `rg 'race/' Jhonny/planos/.../core_loop_corrida` e comparar com `find Jhonny/img/pictures/race -name '*.png'`.

#### Task 2.2

- **Informação ausente, ambígua ou incorreta:** a task sugeria Freesound/sfxr, mas não dizia para priorizar sons existentes.
- **Consequência observada:** tentativa desperdiçada de gerar e converter áudio.
- **Alteração recomendada:** preferir sons padrão do RPG Maker.
- **Texto sugerido para adicionar:**

```markdown
### Estratégia preferencial para protótipo

Antes de gerar ou baixar áudio, procurar sons padrão em `Jhonny/audio/se/`.
Para esta fase, criar os nomes esperados como cópias/aliases:
- `crash_metal.ogg`: preferir `Crash.ogg` ou `Explosion*.ogg`
- `freada.ogg`: preferir `Evasion*.ogg` ou som curto similar
- `pneu_cantando.ogg`: preferir `Move*.ogg`, `Machine.ogg` ou som de movimento similar

Não instalar dependências de áudio nem converter formatos se um `.ogg` padrão aceitável já existir.
```

- **Como validar:** `file Jhonny/audio/se/{crash_metal,freada,pneu_cantando}.ogg` mostra Ogg Vorbis e o MZ lista os arquivos em `Play SE`.

#### Task 2.3

- **Informação ausente, ambígua ou incorreta:** dizia que Common Event era manual, mas o evento simples podia ser criado por JSON.
- **Consequência observada:** a execução precisou decidir se automatizava ou não.
- **Alteração recomendada:** permitir automação controlada, mantendo playtest obrigatório.
- **Texto sugerido para substituir/adicionar:**

```markdown
### Implementação por JSON permitida

Para `EV_Preload`, é permitido editar `Jhonny/data/CommonEvents.json` diretamente se houver slot vazio.
Usar:
- `code: 231` para Show Picture
- `code: 230` para Wait
- `code: 235` para Erase Picture

Após editar:
- validar que o JSON parseia;
- abrir o MZ Editor para confirmar que o Common Event aparece corretamente;
- rodar Playtest para confirmar ausência de hitch.
```

- **Como validar:** Python confirma contagem de comandos; MZ abre o Common Event e Playtest confirma funcionamento.

### 9.4 Problemas fora do escopo dos artefatos

| Problema observado | Por que está fora do escopo | Tratamento recomendado | Proteção operacional |
|---|---|---|---|
| `afconvert` listou Vorbis, mas falhou ao codificar | Limitação/comportamento do ambiente macOS, não do projeto | Não depender dele sem necessidade | Preferir OGGs existentes; se converter for obrigatório, validar encoder em arquivo mínimo antes |
| Ativação do Serena criou `.serena/` | Ineficiência operacional da LLM, não falha do plano | Remover se criado sem necessidade | Não ativar ferramentas sem utilidade clara para task simples de assets |
| Worktree tinha mudanças não relacionadas | Estado externo do repositório | Não reverter nem alterar | Sempre conferir `git status` e mencionar apenas o que foi tocado |

### 9.5 Matriz de rastreabilidade das melhorias

| Problema observado | Causa principal | Artefato responsável | Alteração necessária | Prioridade |
|---|---|---|---|---|
| Tentativa de gerar áudio sintético | Fonte local de áudio não priorizada | Análise técnica + task 2.2 | Documentar sons padrão e estratégia local-first | Alta |
| Assets extras descobertos tarde | Lista de assets não reconciliada com consumidores | Plano + task 2.1 | Adicionar checkpoint `rg race/` e incluir `sinal_red`/`placa_curva_dir` | Alta |
| Ambiguidade sobre criar Common Event via JSON | Heurística anterior dizia "manual" de forma ampla demais | Análise técnica + task 2.3 | Permitir JSON para eventos simples com validação | Média |
| `CommonEvents.json` minificado inicialmente | Estratégia operacional da LLM | Nenhuma alteração | Usar `indent=4` ao escrever JSON | Baixa |
| Uso desnecessário de ferramenta Serena | Estratégia operacional da LLM | Fora do escopo | Evitar ativação para tarefas simples de assets | Baixa |

### 9.6 Resultado final recomendado

#### Patch sugerido para a análise técnica

```markdown
### Fonte preferencial de Sound Effects

Para protótipo, priorizar SEs padrão já existentes em `Jhonny/audio/se/`.
Criar ou baixar áudio novo somente se não houver som padrão aceitável ou se a direção de áudio exigir asset original.
Aliases/cópias com nomes semânticos do minigame são aceitáveis, desde que permaneçam em Ogg Vorbis.
```

```markdown
### Common Events em JSON

Common Events simples podem ser criados diretamente em `Jhonny/data/CommonEvents.json` quando:
- houver slot vazio confirmado;
- os códigos de comando MZ forem conhecidos;
- a alteração for validada por parse JSON e Playtest no MZ.

Eventos com Plugin Commands complexos, escolhas aninhadas ou comandos cujo schema não foi confirmado devem ser criados ou revisados no MZ Editor.
```

#### Patch sugerido para o plano de implementação

```markdown
Antes de iniciar a task 2.1, varrer as tasks consumidoras de pictures (especialmente 3.3, 3.4, 4.2, 5.5 e 6.2) e consolidar todos os nomes `race/...` em uma lista única. A task 2.1 deve gerar todos os assets referenciados, mesmo que algum nome esteja ausente da lista original.
```

```markdown
Para task 2.2, primeiro procurar SEs existentes em `Jhonny/audio/se/` e criar aliases com os nomes esperados. Só gerar novos sons se os sons padrão forem insuficientes após inspeção.
```

#### Patch sugerido para as tasks da fase executada

**Task 2.1**

```markdown
> **Nota de consistência:** a lista concreta de pictures é a fonte de verdade. Antes de executar, reconciliar esta lista com todas as referências `race/...` nas tasks consumidoras.

Adicionar aos arquivos obrigatórios:
- `sinal_red.png` (200x150) — sinal vermelho transparente usado por `EV_RenderSinal`
- `placa_curva_dir.png` (~170x140) — placa de curva à direita usada por `EV_RenderCurva`

Critério de sucesso:
- Todos os arquivos referenciados por `task-3.3`, `task-3.4`, `task-4.2`, `task-5.5` e `task-6.2` existem em `Jhonny/img/pictures/race/`.
```

**Task 2.2**

```markdown
### Estratégia preferencial para protótipo

Antes de gerar ou baixar áudio, procurar sons padrão em `Jhonny/audio/se/`.
Para esta fase, criar os nomes esperados como cópias/aliases:
- `crash_metal.ogg`: preferir `Crash.ogg` ou `Explosion*.ogg`
- `freada.ogg`: preferir `Evasion*.ogg` ou som curto similar
- `pneu_cantando.ogg`: preferir `Move*.ogg`, `Machine.ogg` ou som de movimento similar

Não instalar dependências de áudio nem converter formatos se um `.ogg` padrão aceitável já existir.
```

**Task 2.3**

```markdown
### Implementação por JSON permitida

Para `EV_Preload`, é permitido editar `Jhonny/data/CommonEvents.json` diretamente se houver slot vazio.
Usar:
- `code: 231` para Show Picture
- `code: 230` para Wait
- `code: 235` para Erase Picture

Após editar:
- validar que o JSON parseia;
- abrir o MZ Editor para confirmar que o Common Event aparece corretamente;
- rodar Playtest para confirmar ausência de hitch.
```

#### Ações fora do fluxo de especificação

- Evitar ativar ferramentas de análise sem benefício claro para tarefas simples de assets.
- Se for realmente necessário converter áudio, validar primeiro a ferramenta de conversão em um arquivo mínimo.
- Manter `git status` como verificação final para separar mudanças próprias de mudanças preexistentes.

## 10. Checklist operacional

- [ ] Ler `tasks.md` e `task-2.1`/`task-2.2`/`task-2.3` antes de executar.
- [ ] Rodar busca por referências `race/...` nas tasks consumidoras antes de criar PNGs.
- [ ] Preferir sons padrão em `Jhonny/audio/se/`; não gerar áudio novo sem necessidade.
- [ ] Criar PNGs em `Jhonny/img/pictures/race/` com formato RGBA quando houver alpha.
- [ ] Criar aliases OGG com nomes esperados pelo minigame.
- [ ] Confirmar slot vazio em `CommonEvents.json` antes de criar `EV_Preload`.
- [ ] Usar comandos MZ `231/230/235` para `Show/Wait/Erase`.
- [ ] Validar PNGs, OGGs e JSON automaticamente.
- [ ] Registrar pendência de Playtest até o usuário confirmar.
- [ ] Só marcar a fase como validada após Playtest no RPG Maker MZ.
