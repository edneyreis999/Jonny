# Battle-Only Hard-Coded Text Codes

Text codes exclusivos de cenas de batalha do VisuStella Message Core. Funcionam apenas durante o combate (Battle Scene).

---

## Text Codes

| Text Code | Effect |
|-----------|--------|
| `<Current Battle Target>` | Nome do target atual da acao em batalha |
| `<Current Battle User>` | Nome do user ativo em batalha |
| `<Current Battle Action>` | Nome da acao atual com icon na frente |
| `<Current Battle Action Name>` | Nome da acao atual sem icon |

---

## Notas

- Se nao ha batalha ativa, target, user ou acao, retorna texto vazio
- **NÃO recomendado para Help Descriptions** de skills/items -- usar preferencialmente com Show Text event commands durante batalha
