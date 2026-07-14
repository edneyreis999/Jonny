---
title: "RPG Maker MZ - VisuStella Message Core Localization"
type: "plugin-localization-reference"
status: "active-reference"
tags:
  - rpg-maker-mz
  - visustella
  - message-core
  - localization
  - tsv
---

# RPG Maker MZ - VisuStella Message Core Localization

Referencia duradoura para usar o VisuStella MZ Message Core como mecanismo de
localizacao em `Jhonny/`.

Conteudo consolidado a partir da documentacao transiente da demanda de
localizacao. Os paths transientes foram omitidos de proposito: documentos em
`docs/**` nao devem depender de artefatos de plano.

## Quando Usar

Use este documento antes de:

- alterar `Jhonny/js/plugins.js` para parametros do Message Core;
- converter `Jhonny/data/Languages.csv` para TSV;
- criar ou revisar `\tl{...}` em `Jhonny/data/*.json`;
- revisar tags de controle combinadas com `\tl{...}`;
- tratar overflow em `Show Text`, Choice Window ou textos localizados;
- revisar idioma no menu Options;
- validar carregamento da tabela de idiomas;
- decidir se texto deve entrar em chave de localizacao ou continuar hardcoded.

Este documento nao substitui Playtest, LQA, revisao humana de traducao ou
validacao visual de layout.

## Estado Local Observado

Em 2026-07-06, o plugin instalado em `Jhonny/js/plugins/VisuMZ_1_MessageCore.js`
declara `Version 1.51`.

Essa versao expõe no schema local de `Localization:struct`:

- `Enable:eval`
- `CsvFilename:str`
- `AddOption:eval`
- `AdjustRect:eval`
- `Name:str`
- `DefaultLocale:str`
- `Languages:arraystr`

O schema local lido nao expõe `LangFiletype:str` nem `TsvFilename:str`. A
documentacao promovida registra suporte a TSV a partir da versao `1.53`.
Portanto, no estado atual, trocar apenas `Languages.csv` para `Languages.tsv`
seria uma migracao incompleta.

## Configuracao Minima

Para localizacao PT/EN via Message Core, o `Localization:struct` precisa manter:

- `Enable:eval`: `true`
- `AddOption:eval`: `true`, quando o jogador deve escolher idioma no Options
- `Name:str`: label visivel da opcao, por exemplo `Idioma / Language`
- `DefaultLocale:str`: `Portuguese`, quando portugues for o idioma inicial
- `Languages:arraystr`: `["Portuguese","English"]`
- arquivo de idioma efetivo em `Jhonny/data/`

Quando o plugin suporta formatos multiplos, a fonte de verdade para o formato
de runtime deve ser o campo de tipo de arquivo, nao a extensao do nome. Em
versoes com suporte TSV, planeje usar:

- `LangFiletype:str`: `tsv`
- `TsvFilename:str`: `Languages.tsv`

Se esses campos nao existirem no plugin instalado, pare a migracao TSV e trate
isso como gate de upgrade do plugin.

## Contrato Do CSV

O CSV do Message Core usa ponto e virgula como separador. Nao use virgula como
delimitador.

Formato esperado:

```csv
Key;Portuguese;English
greeting_hello;Ola!;Hello!
menu_save;Salvar;Save
```

Regras praticas:

- a primeira coluna deve ser `Key`;
- as demais colunas devem corresponder aos idiomas configurados no plugin;
- keys devem ser nao vazias e unicas ignorando caixa e espacos laterais;
- textos com quebra de linha devem usar `<br>`;
- textos que precisam conter `;` devem usar substitutos documentados pelo
  plugin, como `<semi>`.

## Contrato Do TSV

TSV usa tab como separador. E o formato preferivel para edicao tabular quando
as traducoes podem conter pontuacao comum como virgulas e ponto e virgula.

Formato esperado:

```tsv
Key	Portuguese	English
greeting_hello	Ola!	Hello!
menu_save	Salvar	Save
```

Regras adicionais:

- nao inserir tabs literais dentro de celulas;
- preservar a mesma ordem de colunas do CSV atual;
- converter aspas CSV somente quando forem delimitadores, nao quando forem
  conteudo real;
- manter `Key`, `Portuguese` e `English` exatamente como colunas de runtime,
  salvo decisao explicita de produto.

## Text Codes De Localizacao

O lookup de idioma pode ser referenciado com:

```text
\tl{keyName}
\translate{keyName}
\loc{keyName}
\locale{keyName}
\localize{keyName}
${keyName}
```

Para o projeto, prefira `\tl{key}` por ser curto e ja estar usado nos dados
alterados.

Alvos bons para `\tl{...}`:

- textos de `Show Text`;
- choices e help text de choices;
- termos de menu e sistema;
- nomes e descricoes de database quando aparecem para o jogador;
- textos de tutorial, avisos, celular, placas e scrolls;
- textos de resultado e HUD se a janela ou plugin processar text codes.

Nao converter sem evidencia:

- nomes internos de switches, variables, arquivos, assets e plugin commands;
- formulas, scripts, note tags e parametros tecnicos;
- superfícies que nao processam text codes em runtime.

## Tags De Controle Em Comandos Localizados

Quando um comando de mapa ja prefixa `\tl{...}` com uma tag VisuStella de
controle, mantenha a tag no comando de mapa e nao duplique a mesma tag na
celula localizada.

Caso validado no projeto: `<Hide Buttons>\tl{...}` deve ficar em `Map*.json`.
A celula correspondente em `Languages.tsv` deve conter apenas o conteudo
localizado e outros text codes necessarios ao texto. Duplicar `<Hide Buttons>`
no comando e na traducao pode expor a tag como literal visivel ou tornar o
comportamento dependente da superficie de render.

## Word Wrap E Compatibilidade

Notas promovidas da referencia local:

- Message Core e plugin Tier 1 e deve ficar abaixo de plugins de tier menor no
  Plugin Manager.
- Extensoes do Message Core devem ficar abaixo dele.
- `VisuMZ_0_CoreEngine` e necessario para alguns text codes de map name,
  controls button e choice background color.
- `VisuMZ_1_SkillsStatesCore` e necessario para o plugin command `Select:
  Skill`.
- Word Wrap nao funciona na Choice Window.
- Nao trate Choice Window como superficie corrigida por Word Wrap; choices
  longas exigem revisao propria de texto, janela ou layout.
- Word Wrap nao deve ser combinado com text alignment codes como `<left>`,
  `<center>` e `<right>`.
- Auto-Size e Position text codes nao funcionam com Word Wrap habilitado.
- Para overflow pontual em `Show Text` localizado, prefira quebra manual em
  keys especificas com evidencia visual e Playtest. Nao habilite Word Wrap
  global como primeira resposta.
- Ao usar `<br>` em `Languages.tsv`, valide shape da tabela, unicidade de keys,
  cobertura de `\tl{...}` e comprimento dos segmentos apos quebra.
- Imagens localizadas com marker `[XX]` exigem imagem ancora no RPG Maker
  client.
- Fontes por idioma precisam estar registradas no Custom Font Manager.

## Plano Para Migrar De CSV Para TSV

Objetivo: trocar a solucao atual baseada em `Jhonny/data/Languages.csv` para
`Jhonny/data/Languages.tsv` sem deixar duas fontes de runtime plausiveis.

1. Fazer preflight do plugin.
   - Confirmar versao instalada do `VisuMZ_1_MessageCore`.
   - Se continuar em `1.51`, nao migrar ainda: essa versao local nao tem
     `LangFiletype:str` nem `TsvFilename:str` no schema observado.
   - Atualizar ou reinstalar Message Core para uma versao que suporte TSV
     conforme a documentacao local, no minimo `1.53`.

2. Confirmar parametros apos upgrade.
   - Abrir `Jhonny/js/plugins.js` estruturalmente.
   - Localizar todas as entradas ativas `VisuMZ_1_MessageCore`.
   - Confirmar que cada `Localization:struct` tem `LangFiletype:str`,
     `CsvFilename:str` e `TsvFilename:str`.
   - Parar se houver mais de uma entrada ativa com parametros divergentes.

3. Converter a tabela.
   - Ler `Jhonny/data/Languages.csv` como CSV separado por `;`.
   - Validar header `Key;Portuguese;English`.
   - Validar mesma quantidade de colunas por linha.
   - Validar keys unicas apos trim e lowercase.
   - Escrever `Jhonny/data/Languages.tsv` com colunas
     `Key<TAB>Portuguese<TAB>English`.
   - Rejeitar qualquer celula com tab literal.

4. Trocar a fonte de runtime.
   - Atualizar `Localization:struct` para `LangFiletype:str = tsv`.
   - Atualizar `TsvFilename:str = Languages.tsv`.
   - Manter `CsvFilename:str = Languages.csv` somente como parametro legado
     nao efetivo, se o Plugin Manager exigir o campo.
   - Renomear ou remover `Languages.csv` como runtime source depois que a
     smoke test confirmar que `Languages.tsv` e o arquivo requisitado.

5. Validar cobertura.
   - Parsear todos os `data/*.json` alterados.
   - Conferir que toda referencia `\tl{...}` em `System.json` e mapas
     alterados existe na tabela TSV.
   - Conferir que a coluna `Portuguese` existe porque ela e o locale padrao.
   - Conferir que a coluna `English` existe porque ela e idioma selecionavel.

6. Fazer browser smoke.
   - Servir `Jhonny/` localmente.
   - Abrir o jogo em browser.
   - Confirmar que `data/Languages.tsv` retorna HTTP 200.
   - Confirmar que `data/Languages.csv` nao e requisitado como fonte efetiva.
   - Registrar erros de boot ou requests separadamente.

7. Fazer Playtest e LQA humana.
   - Confirmar que `Idioma / Language` aparece em Options.
   - Confirmar default em portugues.
   - Alternar para ingles e voltar para portugues.
   - Checar amostras de `System.json`, `Map013`, escolhas e textos longos.
   - Procurar literais `\tl{...}` visiveis para o jogador.
   - Validar line breaks, word wrap, fonte, glifos e layout.

## Gates De Escrita

- `Jhonny/js/plugins.js`: requer workflow de plugin e revisao de ativacao.
- `Jhonny/data/*.json`: requer workflow de data JSON e parse estrutural.
- `Jhonny/data/Languages.tsv`: requer validacao de tabela TSV e cobertura de
  keys.
- Runtime e qualidade de traducao: permanecem pendentes ate Playtest/LQA.
