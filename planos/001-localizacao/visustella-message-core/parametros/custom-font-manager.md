# Custom Font Manager

Plugin Parameters > Custom Font Manager. Registra fonts customizadas para uso no RPG Maker MZ. Fonts precisam ser registradas aqui para funcionar, mesmo estando na pasta "fonts" do projeto.

---

## Como Funciona

O RPG Maker MZ so reconhece fonts registradas via plugin. Apos registrar, a font pode ser referenciada pelo **Font Family** em qualquer lugar que aceite font faces/families.

---

## Settings por Font

Cada entrada no Custom Font Manager possui:

| Campo | Tipo | Descricao |
|-------|------|-----------|
| Font Family | String | Nome usado para referenciar a font no jogo. **SEM** extensao de arquivo |
| Filename | String | Nome exato do arquivo da font na pasta `fonts/` do projeto, **COM** extensao |

---

## Exemplo Pratico

### Registro

- **Font Family**: `WildWords`
- **Filename**: `WildWords-Regular.ttf`

### Uso

Referenciar `"WildWords"` como font face ou font family name em:
- Plugin parameters que aceitam font names
- Text codes como `\FN[WildWords]`
- Configuracoes de Language Fonts (ver text-language-settings.md)
- Options Core para selecao de font pelo jogador

---

## Notas

- O arquivo da font deve estar na pasta `fonts/` na raiz do projeto
- O Font Family NAO inclui extensao de arquivo
- O Filename inclui a extensao (`.ttf`, `.otf`, `.woff`, etc.)
- Multiple fonts podem ser registradas para diferentes propositos
- Fonts registradas aqui ficam disponiveis para o sistema de Language Fonts
- Se a font nao carregar, verificar se o Filename esta correto (case sensitive em alguns sistemas operacionais)
