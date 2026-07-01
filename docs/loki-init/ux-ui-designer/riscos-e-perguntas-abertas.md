# Loki Init - UX/UI Designer Inventory - Riscos E Perguntas Abertas

Source index: [inventory.md](inventory.md)

## Riscos E Perguntas Abertas

- `P_cena` numerico aparece no runtime estatico, contrariando a spec de que a
  tentacao nao deve ser numerica.
- Copy de resultado no runtime esta em ingles, enquanto termos do sistema e
  docs de UI estao em portugues.
- `CE16 EV_HoverRiskButton` existe, mas nao evidencia os tres niveis discretos
  de custo descritos na spec.
- `Jhonny_RaceHelper` esta com `EnableDebugLogs: true`; isso e util para
  diagnostico, mas pode ser risco de release/polish.
- `ButtonPicture` ownership nao foi confirmado por leitura de plugin file.
- A tela de resultado usa `SPACE` no texto, mas o loop verifica `Input.isPressed('ok')`;
  confirmar se isso comunica corretamente em teclado, controle e touch.
- O inventario nao prova que `Scene_Save`/`Scene_Load` restauram estado da
  corrida sem picture/input drift.
