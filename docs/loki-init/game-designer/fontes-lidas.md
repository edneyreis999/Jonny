# Loki Init - Game Designer Inventory - Fontes lidas

Source index: [inventory.md](inventory.md)

## Fontes lidas

| Fonte | Uso no inventario | Evidencia |
| --- | --- | --- |
| `docs/loki-init/project-inventory.md` | Contexto comum do init, limites de escrita e superficies sensiveis. | Documento lido; classifica `Jhonny/` como runtime RPG Maker MZ e lista docs principais. |
| `docs/loki-init/technology-context.md` | Stack, classificacao `game-dev`, plugins ativos por inventario comum e gates. | Documento lido; confirma RPG Maker MZ, projeto HTML5 1280x720 e skills tecnicas candidatas. |
| `docs/index.xml` | Catalogo navegavel para escolher menor leitura suficiente. | Documento lido; aponta `Corrida - Core Loop` e `Corrida - Runtime e Eventos` como fontes de alta prioridade. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Fonte primaria de intencao de design, regras, parametros, feedback e riscos. | Documento lido. |
| `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Fonte primaria de contratos runtime, Common Events e invariantes. | Documento lido. |
| `Jhonny/data/System.json` | IDs reais de switches, variaveis, titulo, locale e resolucao. | Parse JSON valido via `python3 -m json.tool`; campos relevantes extraidos por script read-only. |
| `Jhonny/data/CommonEvents.json` | Common Events, command codes, callers, variaveis, switches, plugin commands e scripts inline. | Parse JSON valido via `python3 -m json.tool`; CEs relevantes extraidos por script read-only. |
| Contrato de inventario do package | Cobertura universal e contrato do `game-designer`. | Lido em `/Users/edney/projects/coreto/loki-framework/docs/loki-init-inventory-contracts.md`. |
| Skill `loki-rpg-maker-mz-project-inventory` | Separacao entre evidencia estatica e comportamento pendente de runtime. | Lida com referencias `core-inventory-checklist.md` e `game-dev-domain-inventories.md`. |
