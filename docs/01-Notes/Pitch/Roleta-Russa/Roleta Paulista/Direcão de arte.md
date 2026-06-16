
# Documento de Artstyle — ilustrações (v2)

  

> Objetivo: padronizar técnica e parâmetros para produzir ilustrações consistentes com os arquivos existentes em `frontend/img/pictures/Portraits/Principal`.

  

## 1) Especificações técnicas (alvo de exportação)

  

- Formato: PNG

- Fundo: transparente

- Interlacing: desativado (non‑interlaced)

  

## 2) Paleta e atmosfera

  

- Paleta: monocromática em sépia (preto + marrom)

- Linhas/traço: preto puro `#000000`

- Sombras densas: marrom escuro `#2A221B` a `#3B2F2F`

- Realces suaves/“papel”: camada de cor `#F0E2C1` a `#F5E6C8` (blend Multiply/Overlay, 20–35%)

- Contraste: alto, sombras bem marcadas, quase sem gradientes suaves

- Clima: bestiário/gravura medieval com sensação de pergaminho

  

## 3) Traço e sombreamento

  

- Linha externa (contorno principal): 8 px (4 px)

- Linhas internas (detalhes): 4 px (2 px) — use variação 3–5 px conforme área

- Hachuras (linhas paralelas):

- Ângulos preferenciais: 30°, 45°, 60°; cruzar em 90° para áreas mais escuras

- Espaçamento em 1×: 4–6 px entre linhas (em 2×: 8–12 px)

- Reserve 1–2 pixels de “respiro” entre hachura e contorno para legibilidade

- Pontilhismo: use para transições suaves em áreas pequenas (bochechas, dobras)

- Textura: sugerir desgaste/rugosidade com hachuras curtas e pontilhismo, evitando “ruído” excessivo

  

Ferramentas:

  

- Pincel duro, antialias ligado, opacidade 100% para contorno

- Pincel de textura (baixa opacidade/fluxo) apenas em camadas de sombra/efeito

  

## 5) Composição e fundo

  

- Fundo transparente; evite silhuetas irregulares recortadas no limite da imagem

- Evite texturas fortes atrás do personagem; a leitura deve ser do contorno e das hachuras

  

## 6) Fluxo de trabalho (Krita/Photoshop/GIMP)

  

1. Canvas base em 2×: 1008 × 1344 px, sRGB

2. Camadas sugeridas (de baixo para cima):

- 01‑Guia (regras/linhas de proporção, baixa opacidade)

- 02‑Rascunho (sketch)

- 03‑Linha (contorno preto)

- 04‑Sombra (hachuras/pontilhismo, marrom escuro)

- 05‑Luz (branco/borracha para abrir volume, opcional)

- 06‑Sépia (cor sólida `#F0E2C1`/`#F5E6C8`, Multiply/Overlay 20–35%)

- 07‑Ajustes (Curves/Levels para garantir contraste alto)

3. Finalização:

- Limpe vazamentos de tinta além do contorno

- Garanta “respiro” entre áreas de hachura e linhas principais

4. Redução: redimensione para 504 × 672 px

- Filtro: Bicubic Sharper/Lanczos

- Verifique não introduzir halos nas linhas

5. Exportação:

- PNG, RGBA, sRGB, non‑interlaced, fundo transparente

- Nome do arquivo conforme padrão atual

  

## 7) Padrões de consistência visual

  

- Espessura relativa do contorno e estilo de hachura iguais entre personagens

- Direção de luz idêntica em todos os ilustrações

- Mesma altura de olhos e recorte de ombros para “família visual”

- Paleta sépia uniforme (reutilize a camada 06‑Sépia como referência de opacidade)