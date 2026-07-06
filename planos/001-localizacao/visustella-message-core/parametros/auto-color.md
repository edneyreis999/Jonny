# Auto-Color Settings

Plugin Parameters > Auto-Color Settings. Coloracao automatica de texto baseada em nomes do database e palavras customizadas. Funciona em Message Window, Help Window e Choice Window.

---

## Regras do Auto-Color

### Case Sensitive
O sistema diferencia maiusculas de minusculas. "Potion" e diferente de "potion". Para cobrir ambas, adicione cada variacao separadamente na lista.

### Tamanho Exato (Idiomas Romanos)
Para idiomas baseados no alfabeto romano (Portugues, Ingles, Espanhol, etc.), o matching requer tamanho exato. "Potion" nao corresponde a "potions". Adicione todas as variacoes (singular, plural, conjugacoes) separadamente.

**Excecao**: NAO se aplica a Japones, Coreano ou Chines (idiomas onde conceitos de plural/conjugacao nao existem da mesma forma).

### Simbolos Nao Contam
Pontuacao e simbolos ao redor da palavra nao afetam o matching:
- Pontos: "Potion." combina com "Potion"
- Virgulas: "Potion," combina com "Potion"
- Aspas: `"Potion"` combina com "Potion"
- Parenteses: "(Potion)" combina com "Potion"

### Caracteres Especiais Ignorados
Nomes que contem caracteres especiais como `!`, `?`, `[`, `]`, etc. sao ignorados pelo sistema de auto-color, pois conflitam com a deteccao de text codes e marcadores especiais.

---

## Database Highlighting

Para cada tipo de dado no database, defina o numero da text color a ser usada automaticamente quando o nome aparecer no texto.

| Tipo do Database | Parametro | Valores |
|------------------|-----------|---------|
| Actors | Actor Color | Indice da text color. `0` = desativado |
| Classes | Class Color | Indice da text color. `0` = desativado |
| Skills | Skill Color | Indice da text color. `0` = desativado |
| Items | Item Color | Indice da text color. `0` = desativado |
| Weapons | Weapon Color | Indice da text color. `0` = desativado |
| Armors | Armor Color | Indice da text color. `0` = desativado |
| Enemies | Enemy Color | Indice da text color. `0` = desativado |
| States | State Color | Indice da text color. `0` = desativado |

### Como funciona

Quando o nome de um Actor, Skill, Item, etc. aparece no texto de uma mensagem, ele e automaticamente colorido com a cor configurada para aquele tipo de dado. Nao e necessario usar `\C[x]` manualmente.

---

## Word Highlighting

Listas de palavras organizadas por cor. Todas as palavras em cada lista sao automaticamente coloridas com o `\C[x]` correspondente.

### Estrutura

Para cada entrada de Word Highlighting:

| Campo | Descricao |
|-------|-----------|
| \C[x] Color | Indice da cor a ser aplicada |
| Word List | Lista de palavras separadas que recebem essa cor |

### Exemplo de Uso

Definir `\C[2]` para as palavras "fogo", "chama", "incendio" fara com que toda ocorrencia dessas palavras no texto seja automaticamente colorida com a text color 2.

### Notas

- As regras de case sensitive e tamanho exato se aplicam as word lists
- Word Highlighting e cumulativo com Database Highlighting
- Se uma palavra corresponder a ambas as regras, o comportamento pode variar
