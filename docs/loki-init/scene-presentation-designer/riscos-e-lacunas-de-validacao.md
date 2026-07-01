# Loki Init - Scene Presentation Designer Inventory - Riscos e Lacunas de Validacao

Source index: [presentation-inventory.md](presentation-inventory.md)

## Riscos e Lacunas de Validacao

- `P_cena` aparece como TextPicture (`\V[103]%`) nos CEs de render, enquanto o spec diz que nao deve ser mostrado numericamente. Requer decisao de UX/design e Playtest.
- A Curva do Diabo esta descrita como pos-MVP, mas ha branch condicional e asset no renderer. Requer confirmar se o switch 105 deve permanecer sempre OFF no MVP.
- O spec descreve efeitos visuais/audio que nao foram confirmados nos Common Events lidos; pode ser backlog, doc-runtime drift ou implementacao em superficies nao lidas.
- A tela de resultado e baseada em TextPicture e ME; o fundo de resultado mencionado no spec nao foi confirmado como `Show Picture` nos CEs lidos.
- Input por pictures 41-44 depende de script inline e comportamento de plugin/input; inventario estatico nao valida clique/tap, hover, lock ou fila de Common Events.
- Preload confirma referencias estaticas, mas nao valida cache, decode, timing, fade-in, memoria ou tela preta.
- Nenhum timing, composicao, readability, camera, audio mix, input feel, contraste, acessibilidade ou cleanup foi validado por Playtest.
