# Word Wrap

Texto que excede a largura da janela faz wrap automaticamente para a proxima linha.

## Onde funciona

| Janela | Suporte |
|--------|---------|
| Message Window | Sim |
| Help Window | Sim |
| Choice Window | NAO - desabilitado por natureza da janela |

## 3 formas de habilitar

1. **Text code**: `<WordWrap>` para habilitar, `</WordWrap>` para desabilitar
2. **Plugin Command**: `Message: Properties > Word Wrap`
3. **Plugin Parameters** (default global)

## Restricoes

- NAO funciona junto com `<left>`, `<center>`, `<right>` - o Word Wrap e desabilitado automaticamente quando alignment codes estao presentes
- Suporta idiomas left-to-right com espacos
- A partir da v1.44: suporte para Chines e Japones (sem necessidade de espacos). Coreano so funciona com espacos

## Plugin Parameters

### Enable Word Wrap

- **Message Window**: Habilitar Word Wrap por default?
- **Help Window**: Habilitar Word Wrap por default?

### Rules

| Parametro | Descricao |
|-----------|-----------|
| **Line Break -> Space** | Converte line breaks manuais (nao tagged) em espacos. Line breaks devem usar `<br>` text code |
| **Tight Wrap** | Se face graphic esta presente, o word wrap fica mais tight para caber no espaco reduzido |
| **End Padding** | Padding extra para manter o texto wrap mais longe da borda. Default: 0 |
