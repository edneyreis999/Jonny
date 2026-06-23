# Defeat Retry Preload Audit

- File: `/Users/edney/projects/coreto/summer26/Jhonny/data/CommonEvents.json`
- `CE19` defeat handoff to `CE5`: [60]
- `CE5` preload call to `CE3`: [20]
- `CE5` `SW_RACE_ACTIVE ON` commands: [22]
- `CE5` attempt guard commands (`V[112] <= 1`): [19]

## CE3 preload commands

- Length: `49`
- `0`: code `231`, indent `0`, params `[1, 'race/bg_sinal', 0, 0, 0, 100, 100, 255, 0]`
- `1`: code `230`, indent `0`, params `[1]`
- `2`: code `235`, indent `0`, params `[1]`
- `48`: code `0`, indent `0`, params `[]`

## CE5 bootstrap window

- `14`: code `122`, indent `0`, params `[117, 117, 0, 0, 0]`
- `15`: code `357`, indent `0`, params `['Jhonny_RaceHelper', 'logRaceEvent', 'Log Race Event', {'type': 'RACE_INIT'}]`
- `16`: code `657`, indent `0`, params `['type = RACE_INIT']`
- `17`: code `355`, indent `0`, params `['$gameVariables.setValue(110, Math.floor(Math.random() * 1000000000));']`
- `18`: code `121`, indent `0`, params `[101, 101, 0]`
- `19`: code `111`, indent `0`, params `[1, 112, 0, 1, 2]`
- `20`: code `117`, indent `1`, params `[3]`
- `21`: code `412`, indent `0`, params `[]`
- `22`: code `121`, indent `0`, params `[100, 100, 0]`
- `23`: code `357`, indent `0`, params `['TextPicture', 'set', 'Set Text Picture', {'text': '\\V[104]%'}]`
- `24`: code `657`, indent `0`, params `['Text = \\V[104]%']`

## Interpretation

- The retry path is structurally safe only if the `CE3` preload call is guarded away from post-defeat retries.
- The intended guard for this patch is `V[112] <= 1`, which keeps preload on the cold bootstrap and skips it on retries.
- `SW_RACE_ACTIVE` must still turn on immediately after the guarded preload block.
