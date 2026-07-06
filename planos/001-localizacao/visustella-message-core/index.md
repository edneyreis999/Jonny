# VisuStella MZ - Message Core

> Documentação catalogada do plugin VisuStella Message Core para RPG Maker MZ.
> Otimizada para navegação e recuperação por LLMs.

## Visão Geral

Plugin Tier 1 que estende o sistema de mensagens do RPG Maker MZ com text codes avançados, auto-color, macros, word wrap, choice handling expandido e suporte a multi-idioma.

## Mapa de Seções

### Conceitos
- [Visão Geral](conceitos/visao-geral.md) - Features, requisitos, tier, extension plugins, major changes
- [Text Language Switching](conceitos/text-language-switching.md) - Sistema de troca de idioma via CSV/TSV

### Text Codes
- [Default MZ](text-codes/default-mz.md) - Text codes padrão do RPG Maker MZ (não editáveis)
- [Hard-Coded Global](text-codes/hard-coded-global.md) - Bold, italic, alignment, word wrap, pictures, auto-casing, controls
- [Hard-Coded Message Window](text-codes/hard-coded-message.md) - Common events, wait, auto-size, positioning
- [Hard-Coded Choice Window](text-codes/hard-coded-choice.md) - Show/hide/enable/disable, bg/fg images, shuffle, help
- [Hard-Coded Name Window](text-codes/hard-coded-name-window.md) - Posição e background do name box
- [Hard-Coded Battle](text-codes/hard-coded-battle.md) - Target, user, action text codes
- [Customizable](text-codes/customizable.md) - Database entries, window control, face, font (editáveis via Parameters)
- [Random Text Pool](text-codes/random-text-pool.md) - RNG text selection

### Comandos (Plugin Commands)
- [Message](comandos/message.md) - Properties, X/Y Offsets
- [Choice](comandos/choice.md) - Distance, Properties
- [Picture](comandos/picture.md) - Change Text, Erase Text, Refresh Text
- [Select](comandos/select.md) - Weapon, Armor, Skill selection windows

### Parâmetros (Plugin Parameters)
- [General Settings](parametros/general-settings.md) - Message Window, Name Box, Choice List, Default Text Codes
- [Auto-Color](parametros/auto-color.md) - Regras, database highlighting, word highlighting
- [Custom Font Manager](parametros/custom-font-manager.md) - Registro de fonts customizadas
- [Text Code Actions](parametros/text-code-actions.md) - Text codes que executam ações
- [Text Code Replacements](parametros/text-code-replacements.md) - Text codes que substituem texto
- [Text Macros](parametros/text-macros.md) - Substituição no formato [MacroName]
- [Text Language Settings](parametros/text-language-settings.md) - Idiomas, opções, fonts por idioma, imagens
- [Text Speed Option](parametros/text-speed-option.md) - Opção de velocidade de texto
- [Word Wrap](parametros/word-wrap.md) - Configuração de word wrap

### Referência
- [Glossário](referencia/glossario.md) - Termos e definições
- [Compatibilidade](referencia/compatibilidade.md) - Requisitos, dependencies, notas

## Ordem de Leitura Recomendada

1. `conceitos/visao-geral.md` - Entender o que o plugin faz
2. `text-codes/default-mz.md` - Base dos text codes
3. `text-codes/hard-coded-global.md` - Text codes globais do Message Core
4. `text-codes/hard-coded-message.md` - Text codes específicos da message window
5. `text-codes/hard-coded-choice.md` - Text codes de choices
6. `text-codes/customizable.md` - Text codes customizáveis
7. `comandos/` - Plugin Commands disponíveis
8. `parametros/` - Configuração via Plugin Parameters
9. `referencia/compatibilidade.md` - Requisitos e compatibilidade
