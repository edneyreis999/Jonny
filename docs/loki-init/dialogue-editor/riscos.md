# Loki Init - Dialogue Editor Inventory - Riscos

Source index: [inventory.md](inventory.md)

## Riscos

| Risco | Evidencia | Proximo gate |
| --- | --- | --- |
| Map013 concentra quase todo o dialogo e branching textual. | 1.310 blocos de Show Text e 1.319 opcoes em `Estrada_VN3`. | Route matrix + leitura humana. |
| Mistura de idioma pode afetar produto e LQA. | Locale `pt_BR`, docs em portugues, falas/HUD em ingles. | Decisao de idioma + glossario. |
| Drift de nomes pode quebrar identidade de personagem. | `Jhonny`, `Jonny`, `Johnny` e `Joao/João` aparecem em superficies diferentes. | Decisao canonica de naming. |
| Conteudo sensivel requer revisao especializada. | Aviso de suicidio/depressao/perda e corpus sobre ultima corrida/despedida. | Human validation/sensitive-content review. |
| UI text pode nao caber ou conflitar com arte. | TextPicture, text codes, assets com texto embutido e tela 1280x720. | Preview/Playtest. |
