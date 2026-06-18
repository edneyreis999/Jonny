---
status: complete
---

<task_context>
<domain>engine/assets/pictures</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>none</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 2.1: Criar 11 Pictures (Backgrounds + Botões + HUD + Overlays + Placa)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §4 (cena de Sinal), §5 (cena de Curva), §8 (Feedback Multimodal)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §1.3 (linhas 130-132), §4.1 (linhas 463-477), §9 Checklist (linhas 983-990)

## Visão Geral

Criar 11 arquivos PNG na pasta `Jhonny/img/pictures/race/` que cobrem todos os elementos visuais do minigame: backgrounds, botões clicáveis, HUD de Consciência, overlays de hover, e a placa especial da Curva do Diabo. Para protótipo visual, usar placeholders sólidos coloridos (sépia/preto/vermelho) caso a arte final não esteja disponível.

<requirements>
- Pasta `Jhonny/img/pictures/race/` criada.
- 11 arquivos PNG com as dimensões e formatos especificados abaixo.
- Fundos e botões com canal alpha onde aplicável.
- Resolução base: 816x624 (resolução do projeto, conforme `System.json`).
- Paleta sépia conforme [[Direcão de arte]].
</requirements>

## Subtarefas

- [x] 2.1.1 Criar pasta `Jhonny/img/pictures/race/`
- [x] 2.1.2 Criar `bg_sinal.png` (816x624) — fundo asfalto + sinal vermelho
- [x] 2.1.3 Criar `bg_curva.png` (816x624) — fundo asfalto + placa de curva
- [x] 2.1.4 Criar `btn_parar.png` (~160x80) — botão "Parar" (icone pedal freio)
- [x] 2.1.5 Criar `btn_furar.png` (~160x80) — botão "Furar" (icone acelerador)
- [x] 2.1.6 Criar `btn_direita.png` (~160x80) — botão "Direita" (seta curva direita)
- [x] 2.1.7 Criar `btn_esquerda.png` (~160x80) — botão "Esquerda" (seta curva esquerda)
- [x] 2.1.8 Criar `bar_consciencia_bg.png` (~200x20) — faixa sépia escura "vazia"
- [x] 2.1.9 Criar `bar_consciencia_fill.png` (~200x20) — faixa sépia clara "cheia"
- [x] 2.1.10 Criar `opala_pov.png` (transparente) — sprite do Opala em POV (primeira pessoa)
- [x] 2.1.11 Criar `timer_bar.png` (~300x6) — barra horizontal fina para o timer
- [x] 2.1.12 Criar `curva_do_diabo_placa.png` (~200x150) — placa envelhecida "CURVA DO DIABO"
- [x] 2.1.13 Criar `overlay_risk_low.png` (faixa vermelha fina, ~200x6)
- [x] 2.1.14 Criar `overlay_risk_med.png` (faixa vermelha média, ~200x12)
- [x] 2.1.15 Criar `overlay_risk_high.png` (faixa vermelha larga, ~200x20)

> **Nota de implementação (2026-06-18):** além dos assets listados acima, foram criados `sinal_red.png` e `placa_curva_dir.png`, porque a task 3.3 referencia esses arquivos explicitamente em `EV_RenderSinal` e `EV_RenderCurva`.

## Detalhes de Implementação

### Especificações por grupo

#### Backgrounds (816x624)

| Arquivo | Conteúdo | Notas |
|---------|----------|-------|
| `bg_sinal.png` | Asfalto sépia + cruzamento + sinal vermelho pulsante (posteriormente animado por opacidade) | Fundo fixo; vermelho pulsa via `Move Picture` com `opacity` em CE |
| `bg_curva.png` | Asfalto sépia + placa de curva à direita (ou esquerda) + Opala POV difuso | Indicar direção da curva visualmente |

#### Botões (~160x80)

| Arquivo | Cor base | Ícone |
|---------|----------|-------|
| `btn_parar.png` | Sépia claro | Pedal de freio estilizado (carimbo sépia) |
| `btn_furar.png` | Vermelho-sangue `#8B0000` | Pedal de acelerador estilizado |
| `btn_direita.png` | Sépia claro | Seta curva à direita (estilo placa de trânsito envelhecida) |
| `btn_esquerda.png` | Sépia escuro | Seta curva à esquerda |

#### HUD de Consciência (200x20)

| Arquivo | Função |
|---------|--------|
| `bar_consciencia_bg.png` | Faixa sépia escura estática (fundo da barra) |
| `bar_consciencia_fill.png` | Faixa sépia clara (preenchimento; será redimensionada via `scaleX` dinâmico) |

> **Importante:** ancorar à esquerda (`origin = Upper Left`) em todos os `Show Picture` deste par para a barra "encher da esquerda para a direita" (Guia §4.3 — `Sprite_Picture.updateOrigin` em `rmmz_sprites.js:2933-2942`).

#### POV do Opala (transparente)

| Arquivo | Função |
|---------|--------|
| `opala_pov.png` | Sprite do Opala (Chevrolet Opala) em primeira pessoa — capô + para-brisa difuso. Fundo transparente (canal alpha). |

#### Timer (300x6)

| Arquivo | Função |
|---------|--------|
| `timer_bar.png` | Barra horizontal fina (altura 6px, largura 300px). Cor sépia claro. Será escalada via `scaleX` baseada em `VAR_TIMER_FRAMES`. |

#### Overlays de hover (200x6 a 200x20)

| Arquivo | Função | Largura visual |
|---------|--------|----------------|
| `overlay_risk_low.png` | Faixa vermelha fina — destaca porção "baixa" (`P_cena` 0-30) | ~200x6 |
| `overlay_risk_med.png` | Faixa vermelha média — destaca porção "média" (`P_cena` 40-60) | ~200x12 |
| `overlay_risk_high.png` | Faixa vermelha larga — destaca porção "alta" (`P_cena` 70-100) | ~200x20 |

Cores: vermelho-sangue `#8B0000` com opacidade ~50% (semi-transparente para sobrepor a barra).

#### Placa especial

| Arquivo | Função |
|---------|--------|
| `curva_do_diabo_placa.png` | Placa envelhecida "CURVA DO DIABO" + cruz à beira da estrada. Surgirá apenas na última cena da Corrida 3 (task 6.2). |

### Placeholders aceitáveis para protótipo

Para protótipo visual rápido, todos os PNGs podem ser gerados com ferramentas como:
- Aseprite (pixel art)
- GIMP / Photoshop (raster)
- Figma (exportar PNG)
- Python PIL para placeholders sólidos

**Exemplo de placeholder Python (PIL):**
```python
from PIL import Image
# Placeholder bg_sinal
img = Image.new('RGB', (816, 624), color=(139, 69, 19))  # sépia escuro
img.save('bg_sinal.png')
```

### Erro comum a evitar

- **Não use JPEG**: o canal alpha é necessário para botões e Opala. Sempre PNG.
- **Não estique imagens**: se criar em 1024x768, redimensione para 816x624 preservando aspect ratio.
- **Não use resoluções menores que 16x16**: MZ tem dificuldade com sprites tiny.

## visual_validation

Ao concluir esta task:
1. Confirme que a pasta `Jhonny/img/pictures/race/` tem os 15 arquivos PNG (atenção: 11 grupos, mas 15 arquivos porque `overlay_risk_*` são 3 separados).
2. Abra um dos PNGs em um visualizador de imagens — deve mostrar a imagem na resolução correta com canal alpha (onde aplicável).
3. No MZ Editor, abra o Database (F9) → aba "Terms" > "Picture Test" (se disponível), ou crie um evento de teste com `Show Picture: 1, "race/bg_sinal", ...` para verificar o carregamento.

## Critérios de Sucesso

- [x] 16 arquivos PNG existem em `Jhonny/img/pictures/race/` (14 da lista concreta da task + `sinal_red` + `placa_curva_dir` para F3).
- [x] Dimensões corretas (backgrounds 816x624; botões ~160x80; HUD 200x20; etc.).
- [x] Canal alpha preservado em `opala_pov`, `btn_*`, `overlay_*`.
- [x] Paleta sépia dominante conforme [[Direcão de arte]].
- [x] Arquivos não corrompidos (validados com `file`).

## Fora de Escopo

- Pré-carregar as texturas (feito na task 2.3 via `EV_Preload`).
- Animar os elementos visualmente (feito nas tasks 3.x, 4.x, 5.x).
- Criar versões alternativa (ex.: botão "pressionado", hover state separado) — usar `Move Picture` para mudar opacidade/scale no hover.
- Criar variants de backgrounds para múltiplos biomas (sépia único no protótipo).
