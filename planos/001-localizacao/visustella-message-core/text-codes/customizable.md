# Customizable Text Codes

Text codes editaveis via Plugin Parameters do VisuStella Message Core. Podem ser adicionados, removidos ou alterados pelo desenvolvedor.

**Aviso:** VisuStella nao se responsabiliza por erros causados por modificacoes nos text codes.

---

## Database Entries (Global)

Funcionam em qualquer janela de mensagem.

| Text Code | Effect |
|-----------|--------|
| `\Class[x]` | Icon + nome da classe x |
| `\ClassName[x]` | Nome da classe x (sem icon) |
| `\Skill[x]` | Icon + nome da skill x |
| `\SkillName[x]` | Nome da skill x (sem icon) |
| `\Item[x]` | Icon + nome do item x |
| `\ItemName[x]` | Nome do item x (sem icon) |
| `\ItemQuantity[x]` | Quantidade do item x no inventario |
| `\Weapon[x]` | Icon + nome da weapon x |
| `\WeaponName[x]` | Nome da weapon x (sem icon) |
| `\WeaponQuantity[x]` | Quantidade da weapon x no inventario |
| `\Armor[x]` | Icon + nome da armor x |
| `\ArmorName[x]` | Nome da armor x (sem icon) |
| `\ArmorQuantity[x]` | Quantidade da armor x no inventario |
| `\LastGainObj` | Icon + nome do ultimo objeto ganho pelo party |
| `\LastGainObjName` | Nome do ultimo objeto ganho (sem icon) |
| `\State[x]` | Icon + nome do state x |
| `\StateName[x]` | Nome do state x (sem icon) |
| `\Enemy[x]` | Icon + nome do enemy x |
| `\EnemyName[x]` | Nome do enemy x (sem icon) |
| `\Troop[x]` | Icon + nome da troop x |
| `\TroopName[x]` | Nome da troop x (sem icon) |
| `\TroopMember[x]` | Icon + nome do troop member x (APENAS em batalha) |

---

## Window and Display (Global)

Controlam aparencia e posicao da janela de mensagem.

| Text Code | Effect |
|-----------|--------|
| `\NormalBG` | Fundo normal (opaco com borda) |
| `\DimBG` | Fundo dim (semi-transparente escuro) |
| `\TransparentBG` | Fundo transparente |
| `\FontChange<x>` | Muda font face para x |
| `\ResetFont` | Reseta todas as font settings para o padrao |
| `\ResetColor` | Reseta cor do texto para o padrao |
| `\HexColor<x>` | Muda cor usando hex (ex: `\HexColor<#123abc>`) |
| `\OutlineColor[x]` | Muda outline color para text color index x |
| `\OutlineWidth[x]` | Muda outline width para x pixels |
| `\WindowMoveTo<?>` | Move janela para coordenadas exatas |
| `\WindowMoveBy<?>` | Move janela por valores relativos |
| `\WindowReset` | Reseta posicao da janela para o padrao |

### Formato do parametro `?` para WindowMoveTo / WindowMoveBy

```
targetX, targetY, targetWidth, targetHeight, duration, easingType
```

- **Obrigatorios:** apenas `targetX` e `targetY`
- **Opcionais:** `targetWidth`, `targetHeight`, `duration`, `easingType`
- Exemplo: `\WindowMoveTo<100, 200, 400, 150, 20, 1>`

---

## Message Window Only

Funcionam apenas na Message Window (Show Text event command).

| Text Code | Effect |
|-----------|--------|
| `\ActorFace[x]` | Insere face do actor x na Message Window |
| `\PartyFace[x]` | Insere face do party member x (index no party) |
| `\ChangeFace<x,y>` | Muda face para filename x, index y (requer face existente no projeto) |
| `\FaceIndex[x]` | Muda face index para x (mantem filename atual) |
| `\TextDelay[x>` | Delay de x frames entre cada caractere do texto |

---

## Observacoes Tecnicas

- Todos os text codes desta pagina sao **customizaveis** via Plugin Parameters
- Text codes podem ser **adicionados, removidos ou alterados** pelo desenvolvedor
- Alteracoes podem causar conflitos com outros plugins que dependem dos text codes padrao
- Sempre testar modificacoes antes de distribuir o projeto
