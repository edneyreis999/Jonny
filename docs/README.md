# Vault Obsidian — coreto/summer26

Este diretório é um vault do Obsidian.

## Como abrir

1. Abra o app **Obsidian**
2. **Open folder as vault** → selecione esta pasta `docs/`
3. O Obsidian cria `.obsidian/` automaticamente com as configurações

## Estrutura

```
docs/
├── Home.md              # ponto de entrada do vault
├── 00-Inbox/            # capturas rápidas — triar semanalmente
├── 01-Notes/            # notas permanentes
└── 99-Meta/
    └── templates/       # templates para novas notas
```

## Prefixos numéricos

Usados para forçar ordem alfabética no file explorer:

- `00-` alta prioridade / inbox
- `01-` a `98-` áreas temáticas
- `99-` meta (templates, config)

## Templates

Ative o core plugin **Templates** em Settings → Core plugins e aponte a pasta para `99-Meta/templates/` para usar `{{title}}` e `{{date}}` ao criar notas.
