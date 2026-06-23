# Map013 Race 3 Marker Audit

## Scope

- Target file: `/Users/edney/projects/coreto/summer26/Jhonny/data/Map013.json`
- Event `1` page `1`

## Marker Counts

- Exact marker `JOGADOR VAI PARA A CORRIDA APENAS COM A OPÇÃO 1` count: `219`
- Typo marker `JOGADOR VARI PRA CORRIDA COM DUAS OPÇÕES` count: `292`

## Executable Transfer Points

- Command 7082: code `201`, indent `5`, parameters `[0, 6, 0, 0, 0, 0]`
  - Nearby 7078: code `657`, indent `5`, parameters `['Exit Easing = InSine']`
  - Nearby 7079: code `657`, indent `5`, parameters `['Flip Direction = None']`
  - Nearby 7080: code `657`, indent `5`, parameters `['Duration = 20']`
  - Nearby 7081: code `657`, indent `5`, parameters `['Auto-Erase? = true']`
  - Nearby 7082: code `201`, indent `5`, parameters `[0, 6, 0, 0, 0, 0]`
  - Nearby 7083: code `115`, indent `5`, parameters `[]`
  - Nearby 7084: code `108`, indent `5`, parameters `['NESSE FIM O JOGADOR VAI PRA CORRIDA 3, COM TODAS AS OPÇÕES POSSÍVEIS: ']`
  - Nearby 7085: code `408`, indent `5`, parameters `['1. NÃO SALVAR JONNY; 2. TENTAR SALVAR JONNY; 3. SALVAR JONNY']`
  - Nearby 7086: code `408`, indent `5`, parameters `['A DEPENDER DO QUE O JOGADOR ESCOLHE NA CORRIDA, ELE VAI PARA: ']`
- Command 7107: code `201`, indent `0`, parameters `[0, 12, 0, 0, 0, 0]`
  - Nearby 7103: code `657`, indent `0`, parameters `['Exit Easing = InSine']`
  - Nearby 7104: code `657`, indent `0`, parameters `['Flip Direction = None']`
  - Nearby 7105: code `657`, indent `0`, parameters `['Duration = 20']`
  - Nearby 7106: code `657`, indent `0`, parameters `['Auto-Erase? = true']`
  - Nearby 7107: code `201`, indent `0`, parameters `[0, 12, 0, 0, 0, 0]`
  - Nearby 7108: code `0`, indent `0`, parameters `[]`

## Findings

- The repeated comment markers are documentation only; they do not have local executable commands next to them.
- Command `7082` is a real transfer inside an indented branch that currently leads to `Map006`.
- Command `7107` is the terminal fallthrough transfer that currently leads to `Map012`.
- `Map013` currently does not set `VAR_RACE_ID` anywhere.

## Patch Strategy

- Patch the known executable transfer points first.
- Insert `VAR_RACE_ID = 3` immediately before each patched transfer.
- Keep comment-only markers unchanged and document them as non-executable.

