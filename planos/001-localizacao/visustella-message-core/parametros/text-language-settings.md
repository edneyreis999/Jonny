# Text Language Settings

Plugin Parameters > Text Language Settings. Sistema de troca de idioma em tempo de execucao. Veja tambem `conceitos/text-language-switching.md` para conceitos gerais.

---

## Main Settings

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| Enable Switching? | Boolean | Habilita o sistema de troca de idioma. OFF = desativa todo o sistema |
| CSV Filename | String | Nome do arquivo CSV na pasta `/data/` que contem as traducoes |

---

## Options Menu

Configuracoes de como a opcao de idioma aparece no menu Options do jogo.

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| Add Option? | Boolean | Se ON, adiciona o comando "Text Language" ao menu Options |
| Adjust Window Height | Boolean | Se ON, ajusta automaticamente a altura da options window para acomodar o novo comando |
| Option Name | String | Nome do comando exibido no menu (ex: "Idioma do Texto", "Text Language") |

---

## Languages

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| Default Language | String | Idioma padrao do jogo. Usado quando nao ha selecao do jogador |
| Supported Languages | List | Lista de idiomas suportados. Remover idiomas que nao estao traduzidos |

---

## Language Names

Nomes de exibicao para cada idioma no menu de selecao. Estes sao os nomes que o jogador ve ao trocar de idioma.

### Idiomas Suportados

| Codigo | Idioma |
|--------|--------|
| Bengali | Bengali |
| Chinese (Simplified) | Chines Simplificado |
| Chinese (Traditional) | Chines Tradicional |
| Czech | Tcheco |
| Danish | Dinamarques |
| Dutch | Holandes |
| English | Ingles |
| Finnish | Finlands |
| French | Frances |
| German | Alemao |
| Greek | Grego |
| Hindi | Hindi |
| Hungarian | Hungaro |
| Indonesian | Indonesio |
| Italian | Italiano |
| Japanese | Japones |
| Korean | Coreano |
| Norwegian | Noruegues |
| Polish | Polones |
| Portuguese | Portugues |
| Romanian | Romeno |
| Russian | Russo |
| Slovak | Eslovaco |
| Spanish | Espanhol |
| Swedish | Sues |
| Tamil | Tamil |
| Thai | Tailandes |
| Turkish | Turco |

---

## Language Fonts

Define fonts padrao diferentes para cada idioma suportado.

### Requisitos
- As fonts DEVEM estar registradas no **Custom Font Manager** (ver custom-font-manager.md)
- Players podem override a font via **Options Core** se configurado

### Uso Tipico
Idiomas com caracteres diferentes (Japones, Coreano, Chines, Tailandes, etc.) frequentemente precisam de fonts dedicadas que suportem seus glyph ranges.

---

## Language Images

Permite usar imagens diferentes por idioma. Util para imagens com texto embutido (scrolls, signs, documents, etc.).

### Metodo 1: Folder Name

Adicione `[XX]` ao nome da folder, onde `XX` e o codigo do idioma.

- Original: `img/pictures/Scrolls[XX]/` (placeholder)
- Ingles: `img/pictures/Scrolls[EN]/image.png`
- Japones: `img/pictures/Scrolls[JP]/image.png`

### Metodo 2: Filename

Adicione `[XX]` ao nome do arquivo, antes da extensao.

- Original: `img/pictures/ReidProfile[XX].png` (placeholder)
- Ingles: `img/pictures/ReidProfile[EN].png`
- Japones: `img/pictures/ReidProfile[JP].png`

### Convert Default?

| Valor | Comportamento |
|-------|---------------|
| ON | Idioma default USA o marker convertido (ex: `image[EN].png`) |
| OFF | Idioma default USA o arquivo SEM marker (ex: `image.png`) |

**Recomendacao**: OFF evita duplicar imagens para o idioma padrao. O arquivo sem marker serve como fallback para o idioma default.

---

## Notas

- O arquivo CSV de traducoes deve estar em `/data/` com o nome configurado em CSV Filename
- Troca de idioma e feita em tempo real sem reiniciar o jogo
- Language Fonts so entram em vigor se as fonts estiverem registradas no Custom Font Manager
- Imagens sem o marker `[XX]` sao usadas como fallback para idiomas sem versao dedicada
