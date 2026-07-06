# Text Language Switching

## O que e

O **Text Language Switching** e uma feature do VisuStella MZ Message Core (adicionada na **v1.46**, com suporte a **TSV** a partir da **v1.53**) que permite exibir texto em diferentes idiomas no jogo usando chaves de referenciação em vez de texto hardcoded.

### Importante

- **NÃO e uma ferramenta de tradução automatica**. O developer precisa inserir manualmente as traduções para cada idioma.
- Funciona como um sistema de lookup: o texto exibido e determinado pela chave referenciada e pelo idioma ativo.

## Como Habilitar

Em **Plugin Parameters**:

```
Text Language Settings > Enable Switching? = true
```

Ao habilitar, o jogador podera trocar o idioma do texto pelo menu de opcoes do jogo.

## Gerando o Arquivo CSV/TSV

O processo de geracao ocorre durante o **playtest**:

1. Inicie o playtest do projeto
2. Um popup aparecera perguntando sobre a geracao do arquivo
3. Clique em **OK**
4. O arquivo sera gerado na pasta `/data/` do projeto

### Separador do CSV

O separador do CSV gerado e **semicolon (;)** e **NAO comma (,)**.

Isso e intencional para evitar conflitos com texto que contenha virgulas.

## Estrutura do Arquivo

O arquivo CSV/TSV contem:

- Uma coluna **Key** (identificador unico do texto)
- Colunas por idioma: `English`, `Chinese`, `Japanese`, `Korean`, etc.

Exemplo de estrutura CSV (separador `;`):

```
Key;English;Portuguese;Japanese
greeting_hello;Hello!;Ola!;こんにちは!
menu_save;Save;Salvar;セーブ
```

Exemplo de estrutura TSV (separador tab):

```
Key	English	Portuguese	Japanese
greeting_hello	Hello!	Ola!	こんにちは!
menu_save	Save	Salvar	セーブ
```

## Editando o Arquivo

| Ferramenta | Observacao |
|---|---|
| **Google Sheets** | Importar com custom separator `;` para CSV. Para TSV, importacao padrao funciona |
| **VS Code** | Usar a extensao **Edit CSV** para edicao tabular. TSV pode ser editado diretamente |
| **Qualquer editor de texto** | Funciona, mas sem visualizacao tabular. Mais pratico com TSV |

## Text Codes de Referencia

Todos os text codes abaixo sao equivalentes e podem ser usados para referenciar uma chave de idioma:

```
\tl{keyName}
\translate{keyName}
\loc{keyName}
\locale{keyName}
\localize{keyName}
${keyName}
```

### Exemplo de Uso

Em um Show Text event:

```
\tl{greeting_hello}
```

Isso exibira o texto correspondente a chave `greeting_hello` no idioma ativo do jogador.

## Regras e Observacoes

### Line Breaks

Use `<br>` para quebras de linha dentro de textos localizados:

```
\tl{quest_intro}
```

No CSV:

```
quest_intro;Line one.<br>Line two.;Linha um.<br>Linha dois.
```

### Semicolons no CSV

Como o separador do CSV e semicolon, textos que precisam conter `;` devem usar substitutos:

```
<semicolon>
<semi>
<semi-colon>
```

Exemplo:

```
dialog_with_semi;This is a <semi> example;Este e um <semi> exemplo
```

### Text Codes Dentro de Texto Localizado

Text codes normais do RPG Maker e do VisuStella funcionam dentro de texto localizado:

```
dialog_color;Hello \C[2]world;Ola \C[2]mundo
```

Porem, text codes so funcionam em **janelas que suportam text codes** (message windows, choice windows, etc.). Janelas que nao processam text codes exibirao o codigo literalmente.

### Ordem de Processamento: Macros Antes de Language Switch

**Macros sao convertidos ANTES de language switches.** Isso significa que um macro pode conter uma referencia de idioma, e a referencia sera resolvida apos a expansao do macro.

### Nomes de Database como Keys Automaticas

Para **Weapon Types**, **Armor Types** e outros elementos do database, o **nome do database** e usado como key automatica. Ou seja, se um Weapon Type se chama "Sword", o sistema usara "Sword" como key para lookup de idioma.

### Key Names

- Key names **NAO sao case sensitive** (`greeting_hello` e `Greeting_Hello` sao equivalentes)
- **Trailing spaces sao removidos** automaticamente das keys
