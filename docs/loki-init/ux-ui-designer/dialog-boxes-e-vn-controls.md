# Loki Init - UX/UI Designer Inventory - Dialog Boxes E VN Controls

Source index: [inventory.md](inventory.md)

## Dialog Boxes E VN Controls

Nas Common Events de corrida inspecionadas:

- Nenhum `Show Text` (`101`) foi encontrado.
- Nenhum `Show Choices` (`102`) foi encontrado.
- Nenhum `Input Number`, `Select Item` ou `Scrolling Text` foi encontrado.
- Textos de HUD e resultado sao `TextPicture`, nao janelas de dialogo
  tradicionais.

Superficie VN observada:

- `VisuMZ_2_VNPictureBusts` esta ativo em `plugins.js`.
- CEs 20-23 (`Fala-ID1` a `Fala-ID4`) existem como paralelos por switches
  43-46, mas nao foram auditados em profundidade porque o foco autorizado era
  a UI da corrida e fontes listadas.

VN controls nao encontrados nas fontes lidas: backlog/history, skip, auto mode,
text speed dedicado, quick save, quick load, nameplate customizada e controle
de overlap bust/dialog. Ausencia aqui significa "nao observado neste
inventario", nao inexistencia global.
