# VisuStella MZ Message Core - Visao Geral

## O que e

O **VisuStella MZ Message Core** e um plugin **Tier 1** para RPG Maker MZ que proporciona controle geral sobre o sistema de mensagens do jogo. Ele serve como base para todos os plugins de extensao relacionados a mensagens, diálogos, choices e text codes customizáveis.

## Tier

| Propriedade | Valor |
|---|---|
| Tier | 1 |
| Posicao no Plugin Manager | Abaixo de plugins de tier menor (0) |
| Requer outros plugins VisuStella | Nao |

## Requirements

- **RPG Maker MZ** (apenas o editor base, sem dependencias de outros plugins VisuStella)

## Features Principais

- **Controle geral de mensagens** - configuracoes avancadas para janelas de mensagem
- **Auto-Color** - coloracao automatica de texto baseada em regras configuráveis
- **Text codes customizáveis** - novos text codes alem dos nativos do RPG Maker MZ
- **Macros** - atalhos reutilizáveis para blocos de texto frequentes
- **Text Speed option** - opcao para o jogador controlar a velocidade do texto
- **Word Wrap** - quebra automatica de linha para textos longos
- **Choices extendidas** - funcionalidades avancadas para listas de escolhas

## Extension Plugins

Os seguintes plugins sao extensões do Message Core e **devem ficar ABAIXO dele** no Plugin Manager:

| Extension Plugin | Descricao |
|---|---|
| Animated Message Text Effects VisuStella MZ | Efeitos de animacao no texto das mensagens |
| Choice Common Events VisuStella MZ | Vincula Common Events a choices especificas |
| Extended Message Functionality VisuStella MZ | Funcionalidades extras para mensagens |
| Message Letter Sounds VisuStella MZ | Sons por letra ao exibir texto |
| Message Log VisuStella MZ | Log/historico de mensagens do jogo |
| State Tooltips VisuStella MZ | Tooltips para states em batalha |
| Visual Text Window VisuStella MZ | Janelas visuais avancadas de texto |
| Voice Acting Control VisuStella MZ | Controle de voice acting para diálogos |

## Major Changes

O Message Core altera comportamentos padrao do RPG Maker MZ. Estas mudancas afetam todos os projetos que utilizam o plugin.

### 1. Dim Background Extension

O background dim agora **spanna a largura inteira da tela** em vez de se limitar a largura da message window. Isso proporciona um visual mais limpo e consistente durante diálogos.

### 2. Extended Messages

O chaining de **Show Message events** agora expande a message window para acomodar mais rows de texto. Em vez de truncar ou paginar, o plugin ajusta automaticamente a altura da janela para exibir todas as linhas encadeadas.

### 3. Extended Choice Lists

O chaining de **Choice List events** estende as choices mantendo a mesma indentacao. Isso permite criar listas de escolhas maiores que o limite padrao do RPG Maker MZ sem perder a formatacao visual.
