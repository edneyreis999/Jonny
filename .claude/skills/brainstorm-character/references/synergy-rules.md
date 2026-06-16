# Regras de Sinergia do Combat System

> Referencia autocontida extraida de DIRETRIZES (Secao 3) e FUNDAMENTOS (Secoes 4-5).
> Todas as regras se aplicam ao combate de Daratrine - A Origem.

---

## 1. Principio Central

**Sinergia poderosa, mas nunca obrigatoria.**

- Cria recompensa por coordenacao (payoff visivel quando time trabalha junto)
- Nao apaga valor individual (cada personagem funciona sem sinergia)
- Aumenta profundidade sem criar dependencia absoluta

---

## 2. Sinergia Saudavel vs Doentia

### Saudavel (5 tipos)

| Tipo | Exemplo |
|------|---------|
| **Setup + Payoff** | Filena marca -> Thorin executa |
| **Marca + Execucao** | State 140 -> Tiro Preciso consome |
| **Protecao + Cast** | Kilin protege -> Mhordred casta seguro |
| **Debuff + Burst** | Vulnerabilidade no alvo -> spender pesado |
| **Geracao + Conversao** | Kilin toma dano -> gera TP -> protege aliado |

### Doentia (3 tipos)

| Tipo | Descricao |
|------|-----------|
| **Dependencia obrigatoria** | Personagem so funciona com outro especifico |
| **Combo dominante** | Invalida variacao de time |
| **Payoff sem contrapartida** | Recompensa desproporcional ao investimento |

### Teste pratico

> Remover um personagem do time **nao** deve tornar outro inutilizavel.
> Se Thorin sem Filena/Kilin perde **>50% de eficacia** -> dependencia doentia.

---

## 3. 5 Tipos de Sinergia

| Tipo | Descricao |
|------|-----------|
| **Setup** | Um personagem aplica marca/buff/debuff e outro consome em payoff direto. Custo de oportunidade claro. Ex: Filena marca -> Thorin consome com Tiro Preciso. |
| **Tempo** | Sincronizacao de ATB para combo encadeado. Personagens coordenam timing para acoes em sequencia rapida. Ex: Filena usa Transferencia de Ritmo (+50% ATB aliado). |
| **Recurso** | Cadeia de geracao cooperativa de TP. Acoes de um membro alimentam o poder de outro. Nao e transferencia direta, mas loop cooperativo. Ex: Kilin toma dano -> gera TP -> protege aliado -> aliado atacou seguro. |
| **Estado** | States ativos simultaneamente criam payoff multiplicativo. Marca + Buff + Stacks -> resultado amplificado. Ex: State 140 + State 134 -> Thorin recebe ambos. |
| **Execucao** | Burst concentrado em janela compartilhada. Personagens combinam dano no mesmo alvo em janela curta. Pode ser simultanea ou encadeada. Ex: Filena marca -> Thorin debuff -> Mhordred executa. |

---

## 4. Explicita vs Implicita

- **Explicita:** Um efeito cita ou alimenta outro diretamente. Mecanica codificada no sistema. Ex: Marca 140 -> Tiro Preciso le o state e ganha bonus.
- **Implicita:** Ritmos e funcoes se encaixam naturalmente sem mecanica codificada. Ex: Kilin tank + Filena DPS (funcoes complementares por natureza).

---

## 5. 4 Regras para Desenhar Sinergia

1. **Poderosa, mas nunca obrigatoria** -- time deve funcionar sem ela
2. **Payoff visivel** -- jogador ve recompensa da coordenacao
3. **Oportunidade de contrajogo** -- inimigo pode interferir no setup
4. **Nao tornar irrelevantes decisoes individuais** -- cada jogador ainda decide por si

---

## 6. Taxonomia de Decisoes do Jogador

### Curto prazo (dentro do turno atual)

- Qual skill usar agora? (gerador ou spender)
- Qual alvo priorizar? (boss ou adds? marcado ou nao?)
- Posicionamento necessario? (dash para safety ou manter para cast?)
- Defender ou agredir? (Kilin protege ou ataca? Filena esquiva ou counter?)

**Impacto:** Fluxo imediato do combate. Erro -> perda de resources. Acerto -> payoff tatico imediato.

### Medio prazo (proximos 2-4 turnos)

- Gastar TP agora ou guardar para finisher? (spender vs buildup)
- Usar ultimate agora ou salvar para situacao mais critica? (timing de ult)
- Setup de sinergia vale o custo? (Filena marca para Thorin = sacrificio de TP)
- Entrar/manter postura arriscada? (Postura Brutal de Mhordred = -30% DEF)

**Impacto:** Outcome de fase da luta. Acerto -> momentum vantajoso. Erro -> recovery dificultado.

### Longo prazo (luta completa)

- Qual personagem priorizar resources? (buffs/debuffs concentrados)
- Conservar recursos para proxima luta? (Preserve ON de Thorin/Filena)
- Aceitar debuff temporario por vantagem permanente? (Postura Brutal = risco continuo)
- Sacrificar um personagem para salvar time? (Mhordred sem protecao aceitando tank)

**Impacto:** Resultado final do combate. Acerto -> vitoria com margem. Erro -> derrota.

### Decisoes indesejaveis (sistema NAO deve incentivar)

- **Contradizem identidade:** Filena tankando, Kilin fazendo burst, Thorin frontline
- **Boring gameplay:** Spam apenas da skill mais forte, ignorando 80% do kit
- **False choices:** Opcao A sempre melhor que B em todas as situacoes
- **Passividade:** "Deixe o inimigo vir" melhor que "agir proativamente"
- **Punem experimentacao:** Tentar nova skill/estrategia sempre e punido severamente

---

## 7. Loop Central de Combate

```
GERACAO -> ACUMULO -> GASTO -> RECUPERACAO -> REPETICAO
   |          |        |          |
 TP+      TP Cheio  TP-     Regeneracao/
Stats    Ativo     Spender  Novo ciclo
```

### Por personagem

| Fase | Filena (Momentum) | Kilin (Guarda) | Mhordred (Furia) | Thorin (Foco) |
|------|-------------------|----------------|------------------|---------------|
| **Geracao** | Evasion (+12 TP), Geradores (+6/+10/+12 TP) | Tomar dano (value/20), Proteger (+12 TP) | Take/Deal damage, Critical Hit (+8 TP) | Critical Hit (+10 TP), Geradores (+5/+8/+10 TP) |
| **Acumulo** | TCR 1.2 (rapido), Preserve ON | MaxTP 50 (menor), Preserve OFF | TCR 1.5 (muito rapido), Preserve OFF | TP Regen +2, Preserve ON |
| **Gasto** | -20/-60 TP (burst windows) | -15/-50 TP (sacrificio) | -25/-60 TP (burst explosivo) | -25/-50 TP (execucao) |
| **Recuperacao** | Evasion multi-trigger, Enemy Death +8 TP | TP Regen +3, Ally Death +20 TP | Combatendo (take/deal), Enemy Death +15 TP | Regen lento, Preserve ON |

---

*Fontes: DIRETRIZES-DESIGN-COMBAT-SYSTEM.md (Secao 3), FUNDAMENTOS-COMBAT-SYSTEM.md (Secoes 4-5)*
