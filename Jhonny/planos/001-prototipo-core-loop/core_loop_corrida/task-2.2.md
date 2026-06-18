---
status: complete
---

<task_context>
<domain>engine/assets/audio</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>low</complexity>
<dependencies>none</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 2.2: Criar 3 Sound Effects (crash_metal, freada, pneu_cantando)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §4 (Feedback Áudio do Sinal), §5 (Feedback Áudio da Curva), §8 (Feedback Multimodal consolidado)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §9 Checklist (linha 991)

## Visão Geral

Criar 3 arquivos `.ogg` (formato Ogg Vorbis, suportado nativamente pelo RMMZ) para os principais eventos sonoros do minigame. Estes sons serão reproduzidos via `Play SE` nos handlers da Fase 7.

<requirements>
- 3 arquivos `.ogg` criados em `Jhonny/audio/se/`.
- Duração entre 0.3s e 1.0s (sons curtos para não sobrepor próxima cena).
- Volume adequado (não clipar; picar em torno de -3dB).
- Formato Ogg Vorbis (compatível com MZ HTML5 + NW.js).
</requirements>

## Subtarefas

- [x] 2.2.1 Confirmar que a pasta `Jhonny/audio/se/` existe (criar se necessário)
- [x] 2.2.2 Criar `crash_metal.ogg` (~0.5s) — impacto metálico + silêncio abrupto
- [x] 2.2.3 Criar `freada.ogg` (~0.3s) — freada curta + motor caindo RPM
- [x] 2.2.4 Criar `pneu_cantando.ogg` (~0.5s) — pneu cantando + motor subindo RPM

> **Nota de implementação (2026-06-18):** por decisão do projeto, estes SEs reaproveitam sons padrão já existentes em `Jhonny/audio/se/`: `crash_metal.ogg` = cópia de `Crash.ogg`, `freada.ogg` = cópia de `Evasion1.ogg`, `pneu_cantando.ogg` = cópia de `Move2.ogg`.

## Detalhes de Implementação

### Especificações por som

| Arquivo | Duração | Conteúdo | Eventos que usam |
|---------|---------|----------|------------------|
| `crash_metal.ogg` | ~0.5s | Impacto metálico + decaimento rápido para silêncio | Risk-falha (Sinal e Curva) |
| `freada.ogg` | ~0.3s | Freada curta de pneu + motor caindo RPM | Safe-Parar (Sinal) |
| `pneu_cantando.ogg` | ~0.5s | Pneu cantando + motor subindo RPM | Safe-Direita (Curva) e Risk-sucesso (ambos) |

> O spec §4/§5 menciona também "ronco de motor subindo RPM" no Risk-sucesso. Para o protótipo, `pneu_cantando.ogg` cobre ambos os casos (Safe-Direita e Risk-sucesso). Em polish posterior, podemos separar em sons distintos.

### Formato

- **Container:** Ogg Vorbis (`.ogg`)
- **Sample rate:** 44100 Hz
- **Channels:** Mono (suficiente para SE; economiza espaço)
- **Bitrate:** ~96 kbps

> MZ também suporta `.m4a` como fallback em alguns browsers, mas `.ogg` é o formato canônico para SE/BGM no projeto Jhonny (conforme `Jhonny/audio/se/` existente).

### Fontes para placeholder

Se não houver acesso a bibliotecas de som pagas (Freesound.org, Epidemic Sound), usar **freesound.org** (Creative Commons) com busca por:
- "car crash metal impact"
- "tire screech skid"
- "engine rev acceleration"

Ou gerar placeholders sintéticos com **sfxr/jsfxr** (https://sfxr.me/) — útil para gamejam rápido.

### Erro comum a evitar

- **Não usar MP3**: MZ suporta mas Ogg é mais estável em NW.js.
- **Não esticar duração**: sons >1s atravam a sensação de QTE. Manter sub-segundo.
- **Não usar estéreo pesado**: dobra o tamanho do arquivo sem benefício para SE curto.

## visual_validation

Ao concluir esta task:
1. Confirme que `Jhonny/audio/se/` tem os 3 arquivos `.ogg`.
2. No MZ Editor, crie um evento de teste temporário com:
   ```
   Play SE: "crash_metal", 90, 100, 0
   Wait 60 frames
   Play SE: "freada", 90, 100, 0
   Wait 60 frames
   Play SE: "pneu_cantando", 90, 100, 0
   ```
3. Rodar Playtest e ativar o evento — os 3 sons devem tocar em sequência sem clipar.

## Critérios de Sucesso

- [x] 3 arquivos `.ogg` existem em `Jhonny/audio/se/`.
- [x] Formato válido Ogg Vorbis (validado com `file`/`afinfo`).
- [x] Reaproveita áudio padrão do RPG Maker já normalizado no projeto.
- [x] `Play SE` no MZ Editor consegue localizar os arquivos via dropdown.

## Fora de Escopo

- Criar BGM (música de fundo) da corrida — fora de escopo do protótipo v1.
- Implementar os `Play SE` nos handlers (feito na task 7.1).
- Criar versões alternativas (ex.: `crash_metal_var2.ogg` para variedade).
- Sincronizar áudio com animações de resolução (feito na task 7.1).
