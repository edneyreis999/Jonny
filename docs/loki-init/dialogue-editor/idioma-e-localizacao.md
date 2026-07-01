# Loki Init - Dialogue Editor Inventory - Idioma e localizacao

Source index: [inventory.md](inventory.md)

## Idioma e localizacao

Fatos observados:

- `docs/loki-init/project-inventory.md` registra `Jhonny/data/System.json` com
  `locale: pt_BR`.
- O documento de core loop e os docs Loki estao em portugues.
- O corpus de falas, escolhas e HUD/resultado observado nos mapas/Common Events
  esta majoritariamente em ingles.
- CE6 usa TextPicture com labels como `GLORY`, `TRIAL` e `TIMER`.
- CE19 usa TextPicture com `VICTORY!`, `DEFEAT!`, `Glory Score` e instrucao
  para pressionar `[SPACE]`.
- A spec de corrida usa termos portugueses como `Consciência`, `Pontos de
  Glória`, `Curva do Diabo`, `Parar`, `Furar`, `Direita` e `Esquerda`.
- O runtime de corrida usa botoes como imagens (`btn_parar`,
  `btn_furar`, `btn_direita`, `btn_esquerda`), mas o texto visual embutido nos
  assets nao foi auditado por OCR ou preview.

Riscos estaticos de localizacao:

- Mistura PT/EN entre locale do projeto, docs, HUD de corrida, resultado e
  falas VN.
- Drift de nomes: `Jhonny` no titulo/projeto, `Jonny` como speaker predominante
  e ocorrencias textuais de `Johnny`; o core loop tambem usa `João`.
- Drift de termos de rota/tema: `Curva do Diabo` nos docs e `Devil's Curve` ou
  `Devil’s Curve` no corpus.
- Sem glossario canonico para `Consciência`, `Glory`, `Pontos de Glória`,
  `ConcernScore`, `Chance`, `Opala`, `Curva do Diabo` e labels de resultado.
