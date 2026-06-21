
# ENTRADAS

O usuário fornecerá, obrigatoriamente:

- `FASE_ATUAL` — número da fase do plano a revisar (ex.: `1`). Define quais tasks editar.
- `DIR_RETROSPECTIVAS` — caminho de filesystem para a pasta com as retrospectivas.
- `DIR_BUILDS` — caminho de filesystem o arquivo de builds anteriores.
- `TASKS_MD` — caminho de filesystem para o `tasks.md` do plano.

Todos os caminhos são **filesystem relativo ou absoluto**. Resolva os paths dentro do sistema de arquivos.

# OBJETIVO

Revisar os artefatos de planejamento da se atual com base nas retrospectivas anteriores.
Procure por aprendizados adquiridos na fase anterior que influenciam na boa execução da fase atual.
1. A análise reflita fielmente o que de fato aconteceu na execução.
2. As tasks guiem o agente implementador a não cometer os mesmos erros.

Tudo isso **sem jamais referenciar arquivos de retrospectiva** em qualquer artefato atualizado.

# WORKFLOW

## Fase 1
- Faça uma analise nas tasks que vão ser executadas na fase atual
## Fase 2
Invoke um agente em paralelo em cada um dos arquivos encontrados nos diretórios:
	- Diretório de build
	- Diretório de retrospectivas

Cada agente deve analisar o seu arquivo buscando por informações valiosas que evitarão erros na execução da fase atual. E devolver um output de menos de 1000 tokens explicando o que deve ser alterado nos arquivos da fase atual e porque. Eles também devem fazer suas próprias analises com base nos aprendizados do arquivo que ele está analisando. Relendo arquivos implementados no jogo, revisando fontes de informações e fazendo sua própria leitura dos aprendizados anteriores antes de retornar o seu output. 

## Fase 3
Faça um apanhado de todas as respostas de todos os agentes categorizando-as internamente em tópicos como:
- **Correção** dados imprecisos ou inconsistências.
- **Complementação** informações faltantes que tenham causado algum bug anteriormente que afeta a execução da fase atual
- **Adição** de seções/linhas para fatos relevantes não contemplados.

Depois de classificar, Aplique correções cirúrgicas nos arquivos `tasks.md` e `task-x.y.md`.
- Toda adição deve virar **afirmação técnica** no texto sem citar diretamente o arquivo da retrospectiva.
- Não reescreva seções que já estão corretas.

# REGRAS

## R1 — Nunca referenciar retrospectivas 
Em **nenhum** artefato editado, citar, linkar, mencionar o nome ou暗示 o arquivo de retrospectiva. A retrospectiva é fonte de leitura interna.

## R2 — Pode copiar ensinamentos, como diretriz
Aprendizados podem ser copiados, mas reescritos como regra adaptada para fase atual.
- ✅ `"Common Events nunca devem ser deletados — limpar para objeto vazio."`
- ❌ `"Como vimos na retrospectiva de 2026-06-19..."`

## R3 — Vá além do que foi aprendido anteriormente
Devido ao contexto, as vezes algum aprendizado anterior precisa de investigação extra do seu lado para se adequar corretamente ao escopo da fase atual.

## R4 — Idempotência (importantíssima)
Se os arquivos `tasks.md` e `task-x.y.md` **já refletem** o aprendizado, **não edite**. Reescrever trechos corretos é erro.

## R5 — Não forçar mudança (importantíssima)
Em caso de dúvida sobre se há aprendizado aplicável, pergunte ao usuario. 



