
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

- Faça uma analise nas tasks que vão ser executadas na fase atual
- Faça uma analise dos arquivos de build que foi usado nas fases anteriores
- Faça uma analise minuciosa nos arquivos de retrospectiva e extraia informações valiosas que evitarão erros na execução da fase atual.
- Faça sua própria analise com base nos aprendizados anterior. Releia arquivos implementados no jogo, revisite fontes e faça sua própria releitura dos aprendizados anteriores antes de alterar os arquivos referentes a fase atual.
- Aplique correções cirúrgicas nos arquivos `tasks.md` e `task-x.y.md`
   - **Corrigir** dados imprecisos ou inconsistências.
   - **Completar** informações faltantes que tenham causado algum bug anteriormente que afeta a execução da fase atual
   - **Adicionar** seções/linhas para fatos relevantes não contemplados.
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



