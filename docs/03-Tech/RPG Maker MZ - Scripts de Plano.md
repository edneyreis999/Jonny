---
title: "RPG Maker MZ - Scripts de Plano"
tipo: "procedimento tecnico"
status: "aprovado"
tags:
  - rpg-maker-mz
  - scripts
  - planos
  - data-json
---

# RPG Maker MZ - Scripts de Plano

Use este procedimento antes de reutilizar, auditar ou reaplicar scripts Python em `Jhonny/planos/`.

Scripts de plano sao evidencia historica por padrao. Eles mostram como uma fase alterou `data/*.json`, plugins, mapas ou artefatos de suporte naquele snapshot do projeto. Eles nao sao automaticamente ferramentas reexecutaveis no estado atual.

## Classificacao

Classifique o script antes de rodar qualquer coisa:

| Tipo | Regra |
| --- | --- |
| Auditoria read-only | Pode ser reexecutada se nao escreve arquivos e se a saida ainda faz sentido para o estado atual. |
| Validador read-only | Pode ser candidato a reuso, mas deve declarar o que valida e o que nao prova. |
| Script mutador | Nao reexecute sem preflight, precondicoes atuais confirmadas e autorizacao explicita. |
| Gerador historico | Trate como migracao de fase. Leia e compare; nao use como fonte canonica atual. |
| Cleanup/debug | Confirme inventario de probes, logs, Play SE diagnostico e estado esperado depois do cleanup. |

## Preflight minimo

Antes de reaplicar ou adaptar um script mutador:

1. Rode `git log --follow --stat --patch -- <script>` para reconstruir a intencao historica.
2. Abra o commit principal do script e separe arquivos co-commitados em: materialmente relevantes, contexto, ruido e supersedidos depois.
3. Leia somente tasks, summaries, retros e `interaction/` da mesma fase que expliquem a mudanca.
4. Compare a intencao historica com o estado atual usando parser estruturado.
5. Para `System.json`, confirme IDs, nomes e slots reais antes de gerar Common Events que usam variaveis ou switches.
6. Para `CommonEvents.json`, audite `code`, `parameters`, `indent`, callers `117`, branches, switches de lifecycle e scripts inline.
7. Para `Map*.json`, trate comentarios `108/408` como contexto de busca; comandos executaveis como `201`, `117` e `122` sao a fonte para roteamento.
8. Rode validadores read-only disponiveis antes de qualquer escrita.
9. Registre se a validacao e estrutural, runtime pendente ou Playtest validado.

## Escrita segura

Quando a tarefa aprovar uma escrita automatizada:

- Use parser JSON; nao substitua texto livre em arquivos de data.
- Aplique a menor mudanca estrutural possivel.
- Preserve estilo de escrita do arquivo alvo.
- Releia o JSON depois de salvar.
- Revise `git diff --stat` e diff restrito antes de prosseguir.
- Pare se o writer reformatar milhares de linhas sem necessidade.
- Nao regenere `CommonEvents.json` inteiro quando o estado atual contem Plugin Commands manuais, TextPicture, logs ou probes ativos que precisam ser preservados.
- Idempotencia deve verificar atributos esperados, nao apenas a presenca de um comando.

## Relatorio de patch

Todo script de patch deve deixar claro:

- precondicoes confirmadas;
- arquivo e IDs alterados;
- comandos inseridos, removidos ou alterados;
- parametros e `indent` esperados;
- validadores executados;
- diff esperado;
- estado de Playtest: `nao executado`, `pendente`, `falhou` ou `validado`;
- riscos residuais e rollback recomendado.

## Validacao

Validacao estrutural nao prova comportamento jogavel. `json.tool`, asserts e scripts read-only ajudam a reduzir risco, mas Playtest humano continua sendo o gate final para:

- input;
- audio;
- pictures;
- TextPicture;
- transfers;
- Common Events paralelos;
- tela de resultado;
- retry;
- lifecycle de interpreter.

Para bugs perceptiveis, use tambem [[RPG Maker MZ - Debug Playtest]].

Para regras da corrida, use [[Corrida - Core Loop]] e [[Corrida - Runtime e Eventos]].
