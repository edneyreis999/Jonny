# Merge `feat/release-phase-b` → `main`

Artefato de continuidade. Ler este arquivo antes de retomar o merge quando a janela de contexto for zerada.

## Estado atual (snapshot)

- **Branches locais:** `main` (= `origin/main`), `feat/release-phase-b`.
- **Divergência:** 34 commits na main, 11 na feat, a partir do merge-base `9e07fb4`.
- **Tentativa 1 (RENUMERAR):** falhou — JSON válido mas editor RMMZ não deixa criar novos slots. Descartada.
- **Tentativa 2 (PRE-CRIAR):** pendente — usuário vai criar 5 CEs vazios na main pelo editor antes do merge.

## O que a feat adiciona (vs merge-base)

**Conteúdo novo legítimo:**
- 11 maps novos: `Map005.json` a `Map015.json`.
- 2 plugins VisuMZ: `VisuMZ_0_CoreEngine.js`, `VisuMZ_2_VNPictureBusts.js` + registro em `plugins.js`.
- Parallaxes: `Celular.png`, `CelularVazio.png`, `Estrada.png`, `Formatura.png`, `JonnyFormando.png`, `Quarto.png`.
- Pictures: `Jogador.png`, `Jonny.png`.
- 4 Common Events cutscene VN3: `Fala-ID1`, `Fala-ID2`, `Fala-ID3`, `Fala-ID4`.
- Saves: `file0.rmmzsave`, `global.rmmzsave` (provavelmente lixo — considerar `.gitignore` depois).
- Pequenas edições em `Actors.json`, `MapInfos.json`, `System.json`.

## O que só a main tem (vs merge-base)

A main reescreveu o sistema de corrida. CEs `EV_RaceOrchestrator`, `EV_UpdateHud`, `EV_RaceRenderer`, `EV_RenderSinal`, `EV_RenderCurva` (IDs 5-9) foram pesadamente refinados entre o merge-base e a main (memória [[curva-convention-inversion]] documenta a inversão da Curva em 21/06/2026).

A main também adicionou 10 CEs novos nos IDs 10-19:
- `EV_RaceTimer` (10), `EV_OnSafe` (11), `EV_OnRisk` (12), `EV_KeyInput` (13)
- `EV_ResolucaoSafe` (14), `EV_ResolucaoRiskOK` (15), `EV_HoverRiskButton` (16), `""` (17, vazio canônico)
- `EV_Crash` (18), `EV_VitoriaCorrida` (19)

## Por que dá conflito

A feat, em paralelo, adicionou 4 CEs novos nos mesmos IDs 10-13 com nomes diferentes (`Fala-ID1-4`). Colisão direta de IDs.

A feat **não tocou** em CEs 1-9 (versão dela é simplesmente stale vs main). Para CEs 1-9 a main sempre vence.

## Mapa completo de CEs

| ID | merge-base | main HEAD | feat HEAD | Decisão |
|----|---|---|---|---|
| 1 | acelerador | acelerador | acelerador | manter (igual) |
| 2 | freio | freio | freio | manter (igual) |
| 3 | EV_Preload | EV_Preload | EV_Preload | manter (igual) |
| 4 | (vazio) | (vazio) | (vazio) | manter (igual) |
| 5 | EV_RaceOrchestrator (24 cmds) | EV_RaceOrchestrator (33 cmds) | EV_RaceOrchestrator (24 cmds) | **MAIN** |
| 6 | EV_UpdateHud (2 cmds) | EV_UpdateHud (18 cmds) | EV_UpdateHud (2 cmds) | **MAIN** |
| 7 | EV_RaceRenderer (36 cmds) | EV_RaceRenderer (44 cmds) | EV_RaceRenderer (36 cmds) | **MAIN** |
| 8 | EV_RenderSinal (7 cmds) | EV_RenderSinal (13 cmds) | EV_RenderSinal (7 cmds) | **MAIN** |
| 9 | EV_RenderCurva (8 cmds) | EV_RenderCurva (15 cmds) | EV_RenderCurva (8 cmds) | **MAIN** (Curva invertida) |
| 10 | — | EV_RaceTimer | Fala-ID1 | **COLISÃO** |
| 11 | — | EV_OnSafe | Fala-ID2 | **COLISÃO** |
| 12 | — | EV_OnRisk | Fala-ID3 | **COLISÃO** |
| 13 | — | EV_KeyInput | Fala-ID4 | **COLISÃO** |
| 14-19 | — | EV_ResolucaoSafe, EV_ResolucaoRiskOK, EV_HoverRiskButton, "", EV_Crash, EV_VitoriaCorrida | (não existem) | **MAIN** |

## Por que a tentativa 1 falhou

Estratégia: pegar todos os CEs da main + os 4 da feat renumerados para IDs 20-23.

Resultado técnico estava correto:
- Array JSON válido (parse OK).
- Estrutura canônica: `array[0]=null` + CEs sequenciais 1-23.
- IDs batiam com índices.
- Último comando de cada CE era terminator `{code:0, indent:0, parameters:[]}`.
- 3 schemas válidos coexistindo (mínimo, com autoErase/conditionString, com note).
- Switches 43-46 usados só por Fala-ID1-4 (sem colisão semântica).
- Maps 005/006/010/013 tiveram 871 chamadas `code:117` remapeadas (10→20, 11→21).

Mas no editor RPG Maker MZ: duplo-click em slot vazio no final da lista **não abriu** painel pra editar. Só funcionou via "Change Maximum". Usuário criou CE "teste" no slot 24 para forçar o editor a reescrever o arquivo, mas o problema permaneceu.

**Hipótese não-confirmada (e provavelmente errada):** o editor guarda o `array.length` como "maxItems" no momento do load; se o array cresce por via externa (Python), o editor não reconhece os slots novos como editáveis até reabrir o projeto. Ou seja: o editor só "aceita" slots que ele mesmo criou.

**Lição:** Não concatenar CEs em `CommonEvents.json` por script. Deixar o editor criar os slots vazios primeiro, depois só preencher via script/JSON.

## Estratégia 2 (PRE-CRIAR) — A EXECUTAR

### Pré-requisito (o usuário faz manualmente)

1. Reverter merge na main até ficar idêntica a `origin/main` (ver "Reverter para tentar de novo" abaixo).
2. Abrir o projeto no RPG Maker MZ.
3. Database → Common Events.
4. Criar 4 CEs vazios novos via "Change Maximum" + duplo-click nos slots:
   - Importante: preencher **nomes** `Fala-ID1`, `Fala-ID2`, `Fala-ID3`, `Fala-ID4`.
   - Os IDs que o editor atribuir vão ser os próximos livres após o 19 (provavelmente 20, 21, 22, 23). Anotar os IDs reais.
   - Opcional: criar 1 CE extra "teste" no final para garantir que o editor cria slot adicional.
5. Salvar o database (isso reescreve `CommonEvents.json` e `System.json` com `versionId` novo).
6. Commit na main: `feat(common-events): add slots for Fala-ID1-4 (VN3 cutscenes)`.
7. Push para `origin/main`.

### Merge (Claude executa)

```bash
git fetch origin
git checkout main
git pull origin main
git merge --no-commit --no-ff feat/release-phase-b
```

Conflitos esperados:
- `Jhonny/data/CommonEvents.json` — colisão de IDs.
- `Jhonny/data/System.json` — `versionId` (ignorar, manter main).

### Resolução do CommonEvents.json

**Verificar os IDs que o editor atribuiu** aos 4 CEs Fala-ID1-4 na main. Esperado: 20, 21, 22, 23 (mas confirmar).

```python
import json, subprocess

# IDs reais criados pelo editor (confirmar antes de rodar)
EXPECTED_FALA_IDS = {20: 'Fala-ID1', 21: 'Fala-ID2', 22: 'Fala-ID3', 23: 'Fala-ID4'}

# Carrega main (com slots pré-criados) e feat (com conteúdo real)
main_ces = json.loads(subprocess.check_output(['git', 'show', 'main:Jhonny/data/CommonEvents.json'], text=True))
feat_ces = json.loads(subprocess.check_output(['git', 'show', 'feat/release-phase-b:Jhonny/data/CommonEvents.json'], text=True))

# Mapa: nome → conteúdo da feat
feat_by_name = {c['name']: c for c in feat_ces if c and c.get('name', '').startswith('Fala-ID')}

# Para cada slot Fala-ID* na main, substituir pelo conteúdo da feat (preservando o id da main)
for c in main_ces:
    if not c: continue
    name = c.get('name', '')
    if name in feat_by_name:
        feat_ce = feat_by_name[name]
        feat_ce_copy = json.loads(json.dumps(feat_ce))  # deep copy
        feat_ce_copy['id'] = c['id']  # preserva o id real que o editor atribuiu
        main_ces[main_ces.index(c)] = feat_ce_copy

# Salvar
with open('Jhonny/data/CommonEvents.json', 'w', encoding='utf-8') as f:
    json.dump(main_ces, f, indent=4, ensure_ascii=False)
    f.write('\n')

# Validar
json.load(open('Jhonny/data/CommonEvents.json'))
```

### Resolução do System.json

Manter `versionId` da main (HEAD). O resto é auto-merge ou trivial.

```bash
# Manual: editar o arquivo para remover marcadores de conflito, manter "versionId": <valor da main>
git add Jhonny/data/System.json
```

### Remapear code:117 nos maps da feat

Os maps da feat chamam `code:117` (Call Common Event) com os IDs **antigos** da feat (10, 11, 12, 13). Precisamos remapear para os IDs **reais** que o editor atribuiu (provavelmente 20-23).

```python
import json

# Confirmar IDs reais antes de rodar
OLD_TO_NEW = {10: 20, 11: 21, 12: 22, 13: 23}

def remap_code117(obj):
    if isinstance(obj, dict):
        if obj.get('code') == 117 and obj.get('parameters') and obj['parameters'][0] in OLD_TO_NEW:
            obj['parameters'][0] = OLD_TO_NEW[obj['parameters'][0]]
        for v in obj.values():
            remap_code117(v)
    elif isinstance(obj, list):
        for x in obj:
            remap_code117(x)

for map_file in ['Map005.json', 'Map006.json', 'Map010.json', 'Map013.json']:
    path = f'Jhonny/data/{map_file}'
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    remap_code117(data)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        f.write('\n')
```

**Contagem esperada de remapeamentos:**
- Map005: 47 (id 10) + 20 (id 11) = 67
- Map006: 9 + 9 = 18
- Map010: 15 + 13 = 28
- Map013: 494 + 264 = 758
- **Total: 871 chamadas remapeadas.**

Maps sem `code:117`: 007, 008, 009, 011, 012, 014, 015 (não precisam de remap).

### Validação antes do commit

```bash
# 1. JSON válido em todos os arquivos modificados
for f in $(git diff --name-only --diff-filter=U; git diff --cached --name-only); do
  case "$f" in *.json) python3 -c "import json; json.load(open('$f')); print('OK $f')" || echo "INVALID $f";; esac
done

# 2. Sem marcadores de conflito
grep -rn '^<<<<<<< \|^>>>>>>> ' Jhonny/data/ && echo "CONFLITOS RESTANTES" || echo "OK sem conflitos"

# 3. Confirmar switches 43-46 (usados por Fala-ID1-4) não conflitam com main
# (já verificado: main não referencia switches 43-46 em nenhum lugar)

# 4. Pedir ao usuário para abrir no RPG Maker MZ editor e:
#    - Verificar CEs Fala-ID1-4 estão populados (não vazios)
#    - Verificar CEs 5-9 são as versões refinadas da main
#    - Verificar CE 10-19 são race system da main
#    - Abrir Map013, clicar num "Call Common Event", confirmar que mostra "Fala-ID1" ou "Fala-ID2"
```

### Commit

```
merge: integra feat/release-phase-b (VN3 cutscenes) em main

- CommonEvents.json: sobrescreve 4 slots Fala-ID1-4 (pré-criados pelo editor)
  com o conteúdo das cutscenes VN3 da feat, preservando os IDs atribuídos.
- Maps 005/006/010/013: 871 chamadas code:117 remapeadas para apontar
  para os IDs reais dos CEs Fala-ID1-4.
- Adiciona VN3: 11 maps (005-015), plugin VisuMZ_2_VNPictureBusts,
  parallaxes (Celular/Formatura/Quarto) e pictures (Jonny/Jogador).
```

## Reverter para tentar de novo

Se a tentativa atual (1) ainda estiver parcialmente aplicada e precisar voltar ao zero:

```bash
# Abortar merge in-progress
git merge --abort 2>/dev/null

# Descartar quaisquer mudanças locais e equalizar com origin/main
git fetch origin
git reset --hard origin/main
git clean -fd  # remove arquivos untracked se necessário (CUIDADO)
```

**Confirmar estado zero:**
```bash
git status           # deve mostrar "working tree clean"
git log --oneline origin/main..main   # deve ser vazio
git log --oneline main..origin/main   # deve ser vazio
```

## Arquivos relevantes

- `Jhonny/data/CommonEvents.json` — onde mora o conflito principal.
- `Jhonny/data/System.json` — conflito trivial de `versionId`.
- `Jhonny/data/Map005.json` a `Map015.json` — adicionados pela feat.
- `Jhonny/js/plugins.js` — auto-merge (adiciona VisuMZ plugins).
- `Jhonny/js/plugins/VisuMZ_0_CoreEngine.js`, `VisuMZ_2_VNPictureBusts.js` — adicionados.

## Memórias relacionadas

- [[never-delete-common-events]] — CEs devem ser objetos canônicos, nunca null.
- [[curva-convention-inversion]] — spec Curva invertida na main (21/06/2026).
- [[rmmz-textpicture-bake-timing]] — não relacionado diretamente, mas plugin patterns.

## Próxima ação

Aguardar o usuário:
1. Fazer o revert (instruções acima).
2. Criar 4 CEs vazios `Fala-ID1-4` (e opcionalmente `teste`) na main pelo editor.
3. Commit + push na main.
4. Avisar quando estiver pronto, então executar o merge conforme "Estratégia 2".
