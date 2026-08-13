---
title: "Roteiros de vídeo — melhorias de Jhonny após a Game Jam"
type: "recording-guide"
status: "draft"
target_duration: "aproximadamente 6 minutos por vídeo"
audience: "pessoa que vai preparar o jogo, abrir a câmera e gravar"
validation_status: "cross_reviewed; runtime_pending"
---

# Roteiros de vídeo — melhorias de Jhonny após a Game Jam

Esta pasta reúne um roteiro independente para cada uma das 12 principais melhorias de Jhonny após a Tavern Jam. Cada arquivo foi pensado para reduzir o trabalho de preparação e permitir que a pessoa grave lendo a fala, seguindo as marcações de tela e capturando o “antes” e o “depois” em versões reproduzíveis do projeto.

## Como os links de versão funcionam

Cada roteiro identifica:

- a branch histórica usada antes da melhoria;
- a branch histórica que recebeu a melhoria;
- um link imutável para o snapshot de cada branch no GitHub;
- o PR ou os commits que explicam a alteração.

O link imutável usa o SHA do commit. Ele continua acessível mesmo quando a branch de feature foi removida depois do merge.

## Preparação recomendada

Para deixar as duas versões abertas ao mesmo tempo, use dois worktrees. Copie os SHAs do roteiro escolhido:

```bash
git worktree add --detach ../jhonny-video-antes <SHA_ANTES>
git worktree add --detach ../jhonny-video-depois <SHA_DEPOIS>
```

Depois da gravação, os worktrees podem ser removidos com os caminhos exatos usados na criação:

```bash
git worktree remove ../jhonny-video-antes
git worktree remove ../jhonny-video-depois
```

Também é possível baixar os dois snapshots pelos links do GitHub sem usar Git.

## Padrão dos roteiros

Cada roteiro deve oferecer:

1. objetivo e promessa do vídeo;
2. links das versões “antes” e “depois”;
3. checklist de preparação;
4. plano de capturas com telas e momentos de freeze;
5. roteiro cronometrado com fala pronta;
6. indicações de edição e B-roll;
7. plano B para demonstrar a mudança quando o Playtest não colaborar;
8. checklist final antes de publicar;
9. indicação explícita do que ainda exige validação humana.

## Regra editorial

O GitHub comprova que arquivos, mapas, plugins e configurações foram alterados. Ele não comprova sozinho qualidade, diversão, clareza, timing, mixagem, legibilidade, alcance de rotas ou ausência de bugs. Os roteiros devem preferir “adicionamos”, “implementamos” e “integramos” até que a demonstração gravada confirme o comportamento perceptível.

## Índice de gravação

| # | Roteiro | Fala estimada | Capturas | Atenção principal |
| ---: | --- | ---: | ---: | --- |
| 01 | [Limpeza do pacote e identidade visual](01-limpeza-do-pacote-e-identidade-visual.md) | 754 palavras | 8 | Comparar assets sem confundir remoção com qualidade validada |
| 02 | [Expressões durante os diálogos](02-expressoes-durante-os-dialogos.md) | 744 palavras | 7 | Cortar antes da Curva do Diabo |
| 03 | [Mensagens, menu e qualidade de vida](03-mensagens-menu-e-qualidade-de-vida.md) | 728 palavras | 8 | Demonstrar somente recursos que responderem na gravação |
| 04 | [Camada sonora da narrativa e corrida](04-camada-sonora-da-narrativa-e-corrida.md) | 657 palavras | 8 | Revisar direitos e gravar áudio em faixa separada |
| 05 | [Diálogos reutilizáveis](05-dialogos-reutilizaveis.md) | 678 palavras | 8 | Menos linhas não prova equivalência entre rotas |
| 06 | [Nova introdução visual](06-nova-introducao-visual.md) | 681 palavras | 8 | Acesso normal ao mapa e ritmo permanecem pendentes |
| 07 | [Feedback e resposta da corrida](07-feedback-e-resposta-da-corrida.md) | 742 palavras | 8 | Usar a mesma ação nos dois snapshots |
| 08 | [Resultados e escolhas visuais](08-resultados-e-escolhas-visuais.md) | 670 palavras | 8 | Alto risco de spoilers; usar tríptico mascarado |
| 09 | [Polimento de bustos, mensagens e escolhas](09-polimento-de-bustos-mensagens-e-escolhas.md) | 661 palavras | 8 | Alinhar exatamente os enquadramentos |
| 10 | [Créditos puláveis](10-creditos-pulaveis.md) | 713 palavras | 8 | Mascarar nomes e testar cada entrada separadamente |
| 11 | [Cenas e transições cinematográficas](11-cenas-e-transicoes-cinematograficas.md) | 656 palavras | 8 | Alto risco de spoilers; seguir o supercut seguro |
| 12 | [Localização em português e inglês](12-localizacao-portugues-ingles.md) | 654 palavras | 8 | LQA e layout continuam pendentes |

As contagens consideram apenas a fala dentro do roteiro cronometrado. Pausas de demonstração, freezes e B-roll completam os aproximadamente seis minutos.
