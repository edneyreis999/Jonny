# Convenções do Projeto Daratrine

**Fonte**: `docs/GDD/6-combate/GUIA-FERRAMENTAS-COMBAT-SYSTEM.md`
**Uso**: Consulte este arquivo quando o usuario pedir para criar ou balancear skills, personagens ou bosses. Contem design intelligence especifica do projeto que nao existe nos outros arquivos de referencia.

> Toda skill e definida por 3 eixos: **Resolucao** (o que faz) + **Tempo** (quando acontece) + **Recurso** (quanto custa). Balancear os 3, nao apenas o dano.

---

## Convencoes de Dano

- **Damage Style MOBA e GLOBAL** — configurado no plugin parameters. NAO adicione `<Damage Style: MOBA>` em skills individuais.
- **Campo Damage Formula** — use multiplicador simples: `100` (1.0x), `180` (1.8x), `350` (3.5x). NAO escreva a formula MOBA completa.
- **Formula MOBA**: `(base + a.atk * X) * (100 / (100 + b.def))` — interna ao plugin, nunca repetir no JSON.
- **Hard Cap**: 9999 dano maximo por hit. **Soft Cap**: ~8000 — skills normais devem ficar abaixo.

## Tiers de Penetracao

| Tier | Penetracao | Uso tipico | Custo TP |
|------|-----------|------------|----------|
| 0% | Basica | Geradores, skills de rotina | Gera TP |
| 15% | Leve | Spenders medios | -15 a -25 |
| 30% | Pesado | Spenders fortes | -30 a -40 |
| 50% | Massiva | Finishers | -50+ |

## Modelos de Skill

Use estes perfis como referencia ao criar skills por tipo:

### Basica (Geradora)
```yaml
Efeito: mult 1.0x, 0% pen
Tempo: speed +1000 (instantanea)
Recurso: GERA +6 a +10 TP
Exemplo: Passo de Brisa (Filena)
```

### Spender
```yaml
Efeito: mult 1.5-3.0x, 15-30% pen, crit opcional
Tempo: speed -500 a -1250 (cast leve a moderado)
Recurso: CUSTA -15 a -40 TP
Exemplo: Estocada Relampago (Filena) — 20% pen, +20% crit, mult 1.5x, -20 TP
```

### Finisher
```yaml
Efeito: mult 3.0x+, 50% pen, Unblockable, life steal opcional
Tempo: speed -2000 (cast longo), after gauge -40% (vulneravel apos)
Recurso: CUSTA -50+ TP
Exemplo: Execucao (Mhordred) — 50% pen, Unblockable, 20% life steal, -50 TP
```

### Setup
```yaml
Efeito: dano baixo, aplica State/Buff/Debuff
Tempo: speed 0 (neutra)
Recurso: GERA +5 a +8 TP
Exemplo: Marca do Guardiao (Thorin) — aplica State 140 (Marca), +6 TP
```

### Reativa
```yaml
Efeito: dano moderado, trigger condicional
Tempo: instantanea
Recurso: gera TP condicional
Exemplo: Quebra de Camuflagem (Thorin) — interrupt, +8 TP se quebra stealth
```

---

## Tabela de Decisao: Intencao → Ferramenta

| Intencao | Plugin | Ferramentas |
|----------|--------|------------|
| Aumentar impacto | Battle Core | Multiplicador, Armor Pen, Critical, Unblockable |
| Mudar ritmo | ATB | Speed (cast time), After Gauge, Interrupt |
| Mudar frequencia | TP System | TP Cost, TP Generation, TP Mode, Max TP |
| Criar nuke | Combinado | Pen alta + cast longo + custo alto + Unblockable |
| Criar sustain | Combinado | Life Steal + TP gain por dano |
| Criar sniper | Combinado | Pen pesada + cast medio + After Gauge dinamico |

---

## Anti-Padroes

| Anti-padrao | Problema | Correcao |
|-------------|----------|----------|
| Skill forte + rapida + barata | Sem trade-off, quebra jogo | Todo poder exige sacrificio em pelo menos 1 eixo |
| Armor Reduction como debuff | Reduction reduz PRORIA DEF, nao do alvo | Para debuffar DEF do alvo, use State com trait |
| Unblockable banalizado | Invalida defesa sem custo | Apenas finishers com custo massivo (-50+ TP) |
| Crit como muleta | RNG conserta dano baixo | Crit como identidade, nao band-aid |
| Cast sem payoff | Skill lenta com dano baixo | Cast proporcional ao poder |
| After gauge contrario ao papel | Spender com after positivo (spam) | After gauge alinha com papel da skill |
| TP custo desalinhado | Custo maior que geracao (nunca usa) | Custo proporcional a geracao de TP |
| Penetracao excessiva | 50%+ em tudo, DEF vira inutil | Pen escalonada por tier |

---

## Hierarquia de Implementacao

Prefira nesta ordem:
1. **Parametros globais** antes de excecoes locais
2. **Tags nativas** antes de JS custom
3. **Solucao simples** antes de solucao elaborada

```
OK: <Armor Penetration: 30%> (tag nativa)
OK: <Custom Damage> para caso especial (justificado)
EVITAR: Formula JS complexa quando tag nativa resolve
```
