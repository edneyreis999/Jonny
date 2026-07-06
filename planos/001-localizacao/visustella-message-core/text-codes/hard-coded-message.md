# Hard-Coded Message Window Text Codes

Text codes **hard-coded** do VisuStella Message Core exclusivos da Message Window. Nao editaveis via Plugin Parameters. Funcionam **apenas** durante mensagens de dialogo.

---

## Acoes na Message Window

| Text Code | Efeito |
|-----------|--------|
| `\CommonEvent[x]` | Executa common event x quando o text code e alcançado |
| `\Wait[x]` | Espera x frames antes de continuar o texto |
| `<Next Page>` | Encerra a pagina atual da mensagem nesta linha |

> **Detalhes sobre `<Next Page>`:**
> - Usado quando o numero de rows visiveis e 5+ e as linhas nao correspondem ao esperado.
> - Linhas apos `<Next Page>` no mesmo message event sao ignoradas.
> - O restante do texto aparece na proxima pagina da mensagem.

---

## Auto-Size

**Nao funciona com Word Wrap habilitado.**

| Text Code | Efeito |
|-----------|--------|
| `<Auto>` | Redimensiona message window para caber o texto (largura + altura) |
| `<Auto Width>` | Redimensiona largura da message window para caber o texto |
| `<Auto Height>` | Redimensiona altura da message window para caber o texto |
| `<Auto Actor: x>` | Redimensiona e posiciona sobre o sprite do actor x |
| `<Auto Party: x>` | Redimensiona e posiciona sobre o sprite do party member x (posicao no grupo) |
| `<Auto Player>` | Map-Only. Redimensiona e posiciona sobre o sprite do player |
| `<Auto Event: x>` | Map-Only. Redimensiona e posiciona sobre o sprite do event x |
| `<Auto Enemy: x>` | Battle-Only. Redimensiona e posiciona sobre o sprite do enemy x |

> **Nota sobre Auto-Size:**
> - Ao usar estes text codes, as configuracoes da message window sao **resetadas** para a proxima mensagem.
> - `<Auto Player>` funciona apenas no mapa; `<Auto Enemy: x>` funciona apenas em batalha.
> - Para `<Auto Event: x>`, x e o event ID no mapa atual.

---

## Posicionamento

**Nao funciona com Word Wrap habilitado.**

| Text Code | Efeito |
|-----------|--------|
| `<Position: x, y, width, height>` | Forca coordenadas e dimensoes exatas da message window |
| `<Coordinates: x, y>` | Forca coordenadas exatas (posicao x, y) |
| `<Dimensions: width, height>` | Forca dimensoes exatas (largura x, altura y) |
| `<Offset: +x, +y>` | Ajusta offset da message window em +x, +y pixels |
| `<Offset: -x, -y>` | Valores negativos substituem offset anterior |

> **Notas sobre Posicionamento:**
> - `<Position>` define tanto posicao quanto tamanho em um unico code.
> - `<Coordinates>` e `<Dimensions>` permitem controle separado de posicao e tamanho.
> - `<Offset>` e relativo a posicao atual da janela; valores negativos **substituem** (nao subtraem) o offset anterior.
> - Todos os valores sao em pixels.
