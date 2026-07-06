# Compatibilidade - VisuStella Message Core

Requisitos, dependencias e notas de compatibilidade do plugin.

## Requisitos

- **RPG Maker MZ**: NAO funciona em outras versoes (MV, VX Ace, etc.)
- **Tier 1**: Colocar ABAIXO de plugins de tier menor (0, 1, 2, 3, 4, 5) no Plugin Manager

## Dependencies em outros plugins VisuStella

### VisuMZ_0_CoreEngine

Necessario para:
- Map Name Text Codes
- Controls Button text codes
- Choice BgColor text codes

### VisuMZ_1_SkillsStatesCore

Necessario para:
- Select: Skill plugin command

## Extension Plugins

Devem ficar ABAIXO deste plugin no Plugin Manager:

| # | Plugin |
|---|--------|
| 1 | Animated Message Text Effects VisuStella MZ |
| 2 | Choice Common Events VisuStella MZ |
| 3 | Extended Message Functionality VisuStella MZ |
| 4 | Message Letter Sounds VisuStella MZ |
| 5 | Message Log VisuStella MZ |
| 6 | State Tooltips VisuStella MZ |
| 7 | Visual Text Window VisuStella MZ |
| 8 | Voice Acting Control VisuStella MZ |

## Notas de Compatibilidade

### Word Wrap
- NAO funciona em Choice Window
- NAO funciona junto com text alignment codes (`<left>`, `<center>`, `<right>`)
- Auto-Size text codes NAO funcionam com Word Wrap habilitado
- Position text codes NAO funcionam com Word Wrap habilitado

### Traducoes e Idiomas
- CSV separator e **semicolon (;)**, NAO comma (,)
- TSV (tab) suportado desde v1.53
- Language images com marker `[XX]` requer imagem anchor no RPG Maker client
- Players podem override language fonts via Options Core

### Fonts
- Custom fonts DEVEM ser registradas no Custom Font Manager (Core Engine)
- Fonts nao registradas nao aparecem para selecao
