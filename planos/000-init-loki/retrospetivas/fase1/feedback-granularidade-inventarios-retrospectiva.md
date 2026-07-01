# Retrospectiva Técnica - Feedback Sobre Granularidade Dos Inventários

Data: 2026-06-30
Workflow relacionado: `loki:feedback` e `loki:retrospectiva-tecnica`
Target retrospective: `planos/000-init-loki/retrospetivas/fase1/feedback-granularidade-inventarios-retrospectiva.md`

## Objetivo

Registrar o feedback humano recebido depois do `loki:init`: os arquivos e pastas
de `docs/loki-init/**` ficaram bons em conteúdo, mas os inventários por agente
ficaram concentrados em arquivos grandes demais, aumentando o custo de leitura
quando uma próxima LLM precisa recuperar uma informação pequena.

## Resultado Entregue

Retrospectiva criada. Nenhum inventário foi reestruturado nesta execução.

Critério de conclusão desta retrospectiva:

- registrar a observação do usuário;
- confirmar evidência local mínima;
- registrar decisão de escopo;
- registrar pendências e caminho mínimo para uma próxima execução corrigir os
  artefatos atuais.

## Restrições Relevantes

- `loki:feedback` é diagnóstico e não aplica correção.
- A correção desejada pelo usuário é sobre artefatos atuais em
  `docs/loki-init/**`, não sobre o contrato futuro do pacote neste momento.
- Escritas nesta execução ficaram restritas a esta retrospectiva.
- Não houve pesquisa externa.
- Não houve alteração em `docs/loki-init/**`, `docs/index.xml`, runtime,
  `Jhonny/**`, `.agents/**`, `.codex/**`, `.claude/**`, `AGENTS.md` ou
  `CLAUDE.md`.

## Artefatos Consultados

- `planos/000-init-loki/tasks.md`
- `docs/loki-init/**`
- `planos/000-init-loki/retrospetivas/fase1/**` listagem
- `skills/loki-feedback/SKILL.md`
- `skills/loki-retrospectiva-tecnica/SKILL.md`

## Evidência Local

Comando usado:

```bash
find docs/loki-init -maxdepth 2 -type f -name '*.md' -print0 | xargs -0 wc -l | sort -n
```

Resultado material:

- `docs/loki-init/**` soma 5.818 linhas Markdown.
- Inventários maiores observados:
  - `docs/loki-init/technical-implementer/inventory.md`: 405 linhas.
  - `docs/loki-init/runtime-qa/inventory.md`: 380 linhas.
  - `docs/loki-init/ux-ui-designer/inventory.md`: 376 linhas.
  - `docs/loki-init/technical-artist/inventory.md`: 367 linhas.
  - `docs/loki-init/game-designer/inventory.md`: 357 linhas.
  - `docs/loki-init/dialogue-editor/inventory.md`: 343 linhas.
  - `docs/loki-init/gameplay-engineer/inventory.md`: 319 linhas.
  - `docs/loki-init/scene-presentation-designer/presentation-inventory.md`:
    305 linhas.

Interpretação: o feedback é consistente com o estado material. O conteúdo está
útil, mas a unidade de leitura ainda é grande para consultas pontuais.

## Decisões Humanas E Pendências

Decisões humanas registradas:

- O usuário aprovou a qualidade das informações inventariadas.
- O usuário rejeitou a granularidade atual dos arquivos.
- O usuário quer tratar primeiro como correção dos artefatos atuais em
  `docs/loki-init/**`.

Pendência crítica:

- Definir o limite prático por arquivo após a quebra, por linhas ou tokens. A
  pergunta feita foi: "qual limite prático você quer por arquivo após a quebra,
  em torno de quantas linhas ou tokens por arquivo?"

## Validações Feitas

- Confirmada existência de `planos/000-init-loki/tasks.md`.
- Confirmada listagem de retrospectivas existentes em
  `planos/000-init-loki/retrospetivas/fase1/`.
- Confirmada contagem de linhas dos inventários atuais.
- Confirmado que o problema é de documentação/processo, não de runtime.

## Validações Não Feitas

- Não foi validada uma nova estrutura de arquivos.
- Não foi atualizado `docs/index.xml`.
- Não foi medido token count exato por arquivo.
- Não foi executado `loki:tech-analysis`, `loki:generate-action-plan` ou
  `loki:run-plan` para aplicar a correção.

## Atritos Materiais

### Feedback Pós-Init Revelou Unidade De Leitura Inadequada

- Category: `user-correction`
- What Happened: o usuário confirmou que o conteúdo dos inventários ficou bom,
  mas apontou que os agentes não quebraram os inventários em arquivos menores.
- Expected Behavior: inventários factuais deveriam ser bons para consulta
  incremental e de baixo custo.
- Actual Behavior: cada agente materializou uma pasta, mas muitos concentraram
  quase tudo em um único arquivo.
- Context: `loki:init` produziu 18 pastas de inventário de domínio e catalogou
  o layout atual em `docs/index.xml`.
- Evidence: arquivos de 300-405 linhas e total de 5.818 linhas em
  `docs/loki-init/**`.
- Cause: provável lacuna no envelope operacional do init: ele exigia pasta por
  agente e conteúdo mínimo, mas não especificava granularidade interna ou
  subíndices por tema.
- Resolution Or Outcome: feedback registrado; correção ainda não aplicada.
- Was Useful: sim.
- Waste Impact: medium.
- Reuse Guidance: quando pedir inventário por agente, exigir arquivos menores
  por eixo de consulta, além de um `index.md` de roteamento.
- Avoid Next Time: não tratar "pasta por agente" como granularidade suficiente.
- Minimum Next Step: definir limite por arquivo e gerar plano de split para os
  artefatos atuais.

### Pergunta De Granularidade Ficou Pendente

- Category: `minimum-next-path`
- What Happened: após o usuário escolher "correção dos artefatos atuais", foi
  feita uma pergunta sobre o limite prático por arquivo; o usuário invocou
  `loki:retrospectiva-tecnica` antes de responder esse limite.
- Expected Behavior: a correção precisa de um critério objetivo de tamanho para
  não trocar um problema por outro.
- Actual Behavior: a retrospectiva foi acionada com a decisão de escopo já
  clara, mas sem limite de tamanho definido.
- Context: `loki:feedback` exige uma pergunta por vez e não aplica correção.
- Evidence: pergunta aberta sobre "quantas linhas ou tokens por arquivo".
- Cause: mudança de workflow pelo usuário.
- Resolution Or Outcome: pendência registrada para retomada.
- Was Useful: sim.
- Waste Impact: low.
- Reuse Guidance: uma próxima execução pode assumir um limite conservador se o
  usuário autorizar, mas deve registrar a escolha.
- Avoid Next Time: antes de iniciar split massivo, fechar critério de tamanho e
  padrão de nomes.
- Minimum Next Step: responder o limite ou adotar um default explícito em plano
  aprovado.

## Aprendizados Reutilizáveis

### Validado Localmente

- Inventários longos em um único arquivo aumentam custo de recuperação para LLM
  mesmo quando o conteúdo é bom.
- A pasta por agente melhorou ownership, mas não resolveu navegação fina.
- `docs/index.xml` aponta para documentos, mas não substitui subíndice dentro
  de cada pasta de agente.

### Hipóteses Para Correção

Uma estrutura provável para cada `docs/loki-init/<agent>/`:

- `index.md`: roteamento, escopo, fontes e links para arquivos menores.
- `source-map.md`: fontes lidas e mapa de localização.
- `facts.md`: fatos atuais da especialidade.
- `coverage-and-gaps.md`: cobertura, lacunas, validações pendentes e gates.
- arquivos temáticos adicionais quando o domínio tiver eixos claros, como
  `runtime-surfaces.md`, `assets.md`, `routes.md`, `audio-cues.md` ou
  `text-surfaces.md`.

Essa estrutura ainda é hipótese operacional, não regra aprovada.

## Candidatos Para Melhoria Contínua

Não promover automaticamente. Candidato dependente de technical-review:

- Atualizar o workflow/contrato de `loki:init` para exigir granularidade mínima
  dentro de cada `target_inventory_dir`, com `index.md` e arquivos menores por
  eixo de consulta.

Escopo preferencial antes de promover:

1. Corrigir os artefatos atuais em `docs/loki-init/**`.
2. Validar se a nova navegação reduz leitura e mantém completude.
3. Só então avaliar melhoria no contrato do pacote.

## Caminho Mínimo Recomendado

1. Retomar com `loki:feedback` ou decisão direta do usuário para fechar o limite
   por arquivo, por exemplo linhas máximas ou tokens máximos.
2. Rodar `loki:tech-analysis` focado em reestruturação documental de
   `docs/loki-init/**`, sem runtime.
3. Gerar um plano pequeno para:
   - criar subarquivos por agente;
   - preservar conteúdo factual;
   - atualizar links e `docs/index.xml`;
   - manter `docs/loki-init/agent-fanout-summary.md` coerente;
   - registrar validação de completude e ausência de caminhos quebrados.
4. Executar com writes restritos a `docs/loki-init/**`, `docs/index.xml` e
   evidência operacional em `planos/000-init-loki/**`.

## Riscos Residuais

- Split mal planejado pode duplicar conteúdo e aumentar custo total.
- Split sem `index.md` local pode fragmentar demais e piorar navegação.
- Atualizar somente arquivos sem atualizar `docs/index.xml` criaria catálogo
  stale.
- Fazer isso como refactor manual amplo sem plano pode perder fatos ou quebrar
  rastreabilidade das fontes.

## Próximo Passo

Responder a pendência de granularidade ou autorizar um default explícito para a
próxima fase de reestruturação documental.
