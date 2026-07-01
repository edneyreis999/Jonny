# Loki Init - Scene Presentation Designer Inventory - Sprites, Busts, Backgrounds e CGs

Source index: [presentation-inventory.md](presentation-inventory.md)

## Sprites, Busts, Backgrounds e CGs

| Categoria | Evidencia encontrada | Status |
| --- | --- | --- |
| Sprites/busts de personagens | O contexto tecnico informa plugin ativo `VisuMZ_2_VNPictureBusts`, mas as fontes lidas para corrida nao continham busts de personagem. `MapInfos` lista mapas VN (`Estrada_VN1`, `Quarto_VN2`, `Estrada_VN3`), mas mapas nao foram deep-read por este envelope. | Parcial; fora do foco lido. |
| Veiculo/POV | `race/opala_pov` referenciado por CE8 e CE9; `race/!opala_pov` existe no listing mas nao foi referenciado por Common Events lidos. | Estaticamente presente; render/escala pendentes. |
| Backgrounds | `race/bg_sinal`, `race/bg_curva`, `race/bg-ranking` existem e sao referenciados. | Estaticamente presente. |
| CGs | Nenhum CG narrativo separado foi identificado nas fontes lidas. Tela de resultado usa TextPicture; Curva do Diabo usa placa condicional. | Nao encontrado no escopo lido. |
| Overlays | `overlay_risk_low`, `overlay_risk_med`, `overlay_risk_high` e `timer_bar` existem e sao preloaded; `overlay_flash_white` existe no listing mas nao foi referenciado por Common Events lidos. | Parcial; ownership runtime a confirmar. |
