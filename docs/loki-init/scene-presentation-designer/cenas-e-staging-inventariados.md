# Loki Init - Scene Presentation Designer Inventory - Cenas e Staging Inventariados

Source index: [presentation-inventory.md](presentation-inventory.md)

## Cenas e Staging Inventariados

| Cena/superficie | Evidencia estatica | Staging atual ou previsto |
| --- | --- | --- |
| Cena de Sinal | Spec define sinal vermelho, decisoes `Parar`/`Furar`, timer de 4,0s. CE8 `EV_RenderSinal` mostra `race/bg_sinal`, `race/opala_pov`, `race/sinal_red`, barras e botoes. | Fundo full-screen, Opala em POV, sinal vermelho em `(560, 0)`, botoes `Parar` e `Furar` embaixo. |
| Cena de Curva | Spec define decisoes `Esquerda`/`Direita`, timer de 3,5s. CE9 `EV_RenderCurva` mostra `race/bg_curva`, `race/opala_pov`, barras e botoes. | Fundo full-screen, Opala em POV, botoes de curva embaixo. Placa da Curva do Diabo so aparece quando switch 105 esta ON. |
| Curva do Diabo | Spec marca como visao completa/futura e fora do MVP; `SW_IS_CURVA_DIABO` 105 reservado. CE9 tem branch condicional por switch 105 mostrando `race/curva_do_diabo_placa`. | Staging condicional com placa em `(308, 80)`. A leitura dramatica, audio diferenciado e clmax continuam pendentes de Playtest e decisao de escopo. |
| HUD da corrida | CE5 mostra barra de consciencia IDs 20/21. CE6 `EV_UpdateHud` mostra ranking, tentativa, consciencia, timer e progresso por TextPicture. | HUD sobreposto a cena: consciencia no topo/esquerda, ranking e textos de status em picture IDs altos. |
| Tela de resultado | Doc runtime declara `EV_VitoriaCorrida` como tela canonica. CE19 mostra TextPictures 53/56/54/55, toca ME e limpa pictures. | Tela textual de `VICTORY!` ou `DEFEAT!`, score e prompt de continuar. Picture 5 e apagada defensivamente, mas nenhum asset de fundo de resultado foi encontrado nos comandos lidos. |
| Crash/retry | CE18 `EV_Crash` chama CE19 e loga evento. Spec descreve crash visual com shake/fade, mas no JSON lido CE18 nao contem Show Picture/audio direto. CE15 `EV_ResolucaoRiskOK` contem shake, wait e SE para sucesso de risco. | Cleanup/restart e resultado existem como fluxo; composicao visual completa de crash descrita no spec nao foi confirmada no CommonEvent lido. |
| Preload | CE3 `EV_Preload` faz `Show Picture -> Wait 1 frame -> Erase Picture` para assets de corrida. | Aquecimento estatico de backgrounds, botoes, barras, overlays, placa e sinal. |
