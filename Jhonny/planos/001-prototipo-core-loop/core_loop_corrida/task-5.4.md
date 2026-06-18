---
status: pending
---

<task_context>
<domain>engine/ui/hud</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-5.1</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 5.4: Implementar HUD de Pontos de Glória via `TextPicture`

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §5 (Pontos de Glória — pontuação cumulativa do jogador)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §3.1 (linhas 349-379 — IDs de variáveis, `VAR_PONTOS_GLORIA` = ID 106), §4.1 (linhas 462-477 — faixa Picture IDs 51-60 para texto via TextPicture)

## Visão Geral

Mostrar o valor atual de **Pontos de Glória** (`VAR_PONTOS_GLORIA`, ID 106) no canto superior direito da tela como texto, atualizando a cada Safe (+10) ou Risk-sucesso (+P_CENA×2). Usa o plugin **TextPicture** (ativado em task-1.3) que converte um texto em picture, permitindo mostrar números dinâmicos na tela.

Esta task é a primeira das HUDs textuais; servirá de padrão para `EV_UpdateHud` e futuros textos (Tentativa N em task-7.2).

<requirements>
- Texto "GLÓRIA: X" exibido na tela, canto superior direito, durante toda a corrida.
- Atualiza em tempo real conforme `VAR_PONTOS_GLORIA` muda.
- Usa Plugin Command do TextPicture (não evento Show Picture comum).
- Picture ID na faixa 51-60 (reservada para texto na §4.1 do Guia).
- Não interfere com HUD de Consciência (Picture ID 20/21, task-3.4).
- Desaparece fora da corrida (`Erase Picture` no fim).
</requirements>

## Subtarefas

- [ ] 5.4.1 Confirmar que o plugin TextPicture está ativo (task-1.3 já deve ter feito)
- [ ] 5.4.2 Decidir o Picture ID (sugerido: ID 51) e posição (x=560, y=20 — canto superior direito da resolução 816×624)
- [ ] 5.4.3 Criar/atualizar `EV_UpdateHud` (iniciado em task-3.4) para incluir chamada TextPicture da Glória
- [ ] 5.4.4 Adicionar Plugin Command `TextPicture: Set Text` com template `"GLÓRIA: \V[106]"` (MZ usa `\V[N]` para interpolar variável)
- [ ] 5.4.5 Adicionar Plugin Command `TextPicture: Show` na posição (560, 20) com Picture ID 51
- [ ] 5.4.6 Garantir que `EV_UpdateHud` é chamado após cada Safe/Risk (já é em 5.1/5.2)
- [ ] 5.4.7 Adicionar `Erase Picture: 51` no `EV_Crash` (task-6.1) e no fim da corrida
- [ ] 5.4.8 Validar com Playtest que o número atualiza após clique Safe

## Detalhes de Implementação

### Sobre o plugin TextPicture

TextPicture é um plugin da Visustella (ou similar) que adiciona Plugin Commands para:

1. **Set Text:** define o texto a ser exibido. Aceita códigos de escape do MZ:
   - `\V[N]` → valor da variável N.
   - `\C[N]` → mudar cor (cor 0 = branco, 6 = amarelo, etc.).
   - `\I[N]` → ícone do índice N do IconSet.
2. **Show:** cria uma picture na posição (x, y) com o texto setado.
3. **Erase:** remove a picture.

Plugin Commands são acessíveis via **MZ Editor** (não automatizáveis via JSON direto sem conhecer a estrutura interna do plugin — diferente de eventos MZ puros).

### Pseudo-código (estrutura no `EV_UpdateHud`)

```
# EV_UpdateHud (Trigger: Call) — estendido da task-3.4
# Atualiza todos os elementos do HUD após mutações de estado.

# === HUD de Consciência (já existente em task-3.4) ===
# Barra bg + fill com scaleX dinâmico
Script: $gameScreen.picture(21).move(0, 0, 100, Math.max(0, $gameVariables.value(105)), 255, 6, 0, 0)
# (continua igual)

# === HUD de Glória (task 5.4 — esta task) ===
Plugin Command: TextPicture > Set Text
  text: "GLÓRIA: \\V[106]"

Plugin Command: TextPicture > Show
  pictureId: 51
  position: (560, 20)
  fontSettings: default
```

> [!note] Sobre `\\V[106]` em vez de `\V[106]`
> Em Plugin Commands e strings do MZ, `\V[106]` precisa ser escapado como `\\V[106]` para não ser resolvido antes da hora. Ver documentação do TextPicture para sintaxe exata.

### Posição sugerida (816×624)

| Zona | Posição | Picture ID | Conteúdo |
|------|---------|-----------|----------|
| Topo-esquerda | (20, 20) | 20, 21 | Barra de Consciência (task-3.4) |
| Topo-direita | (560, 20) | 51 | Texto "GLÓRIA: N" (esta task) |
| Topo-centro | (350, 20) | 52 | "TENTATIVA N" (task-7.2) |

A posição `(560, 20)` deixa ~256px de largura para o texto, suficiente para "GLÓRIA: 9999".

### Atualização dinâmica — quem chama `EV_UpdateHud`?

| Quem chama | Quando | Por quê |
|------------|--------|---------|
| `EV_OnSafe` (5.1) | Após mutar Glória +10 | HUD precisa refletir novo valor |
| `EV_OnRisk` (5.2) | Após mutar Glória no ramo sucesso | Idem |
| `EV_RaceOrchestrator` (3.1) | No INIT (antes do fadein) | Mostra "GLÓRIA: 0" ao começar |
| `EV_Crash` (6.1) | Ao reiniciar (após reset Glória=0) | Mostra "GLÓRIA: 0" na nova tentativa |

### Por que Picture ID 51 e não outro?

Faixa 51-60 está reservada para texto/ícones na §4.1 do Guia Técnico. Picture IDs maiores ficam à frente na ordem z (1 = fundo, 100 = frente). Texto de HUD precisa estar acima do fundo (1-9), intermediários (10-19), HUD de barra (20-29) e overlays (30-39), mas abaixo dos botões (41-50) para não bloquear cliques.

ID 51 é o primeiro livre dessa faixa — convenção.

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Esquecer de chamar `EV_UpdateHud` após mutação | Glória não atualiza visualmente | Sempre chamar após mudar `VAR_PONTOS_GLORIA` |
| Picture ID 51 colidindo com overlay | Texto some atrás de flash | Reservar 30-39 para overlays, 51-60 para texto |
| Usar `\V[106]` sem escape | Texto mostra literal "\V[106]" | Usar `\\V[106]` (escape duplo) |
| Posicionar texto fora da tela (ex.: x>800) | Texto invisível | Verificar 816×624 — manter x ≤ 600 |
| Não dar `Erase Picture` no fim da corrida | Texto fica na próxima cena VN | `Erase Picture 51` no fim da corrida |
| Atualizar texto sem re-chamar `Set Text` | Texto fica com valor antigo | Sempre chamar `Set Text` antes de `Show` (ou usar Plugin Command de Update) |

### Validação da estrutura do plugin TextPicture

Antes de finalizar, no MZ Editor:

1. **F10 (Plugin Manager)** → confirmar TextPicture listado e ON.
2. **Abrir `EV_UpdateHud`** → Item List → adicionar Plugin Command → selecionar categoria TextPicture → comando `Set Text` ou similar (nome exato depende da versão do plugin).
3. Se TextPicture não estiver instalado: ver task-1.3 (deveria ter ativado). Caso perdido, baixar do plugin manager da Visustella (gratuito).

## visual_validation

Ao concluir esta task (com 5.1, 5.2, 5.3 prontos):

1. Inicie a corrida.
2. **Texto "GLÓRIA: 0"** aparece no canto superior direito da tela.
3. Clique em **Parar** (Safe).
4. Texto muda para **"GLÓRIA: 10"** (imediato após flash verde de resolução).
5. Clique em **Parar** novamente.
6. Texto muda para **"GLÓRIA: 20"**.
7. Force Risk-sucesso (`$gameVariables.setValue(108, 0)` no F12) com P_CENA=50.
8. Clique em **Furar**.
9. Texto muda para **"GLÓRIA: 120"** (20 + 50×2).
10. Texto permanece na mesma posição durante toda a corrida.
11. Após crash (testar com roll=99), texto reinicia em **"GLÓRIA: 0"** na nova tentativa.
12. Console F12 sem erros.

## Critérios de Sucesso

- [ ] Texto "GLÓRIA: N" aparece durante a corrida.
- [ ] Número atualiza corretamente após Safe (+10) e Risk-sucesso (+P_CENA×2).
- [ ] Texto desaparece fora da corrida (`Erase Picture 51` em EV_Crash/fim de corrida).
- [ ] Posição no canto superior direito, não sobrepõe HUD de Consciência.
- [ ] Picture ID 51 (faixa reservada para texto).
- [ ] `EV_UpdateHud` é chamado após cada mutação de Glória.
- [ ] Sem erros de sintaxe nos eventos.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- HUD de Consciência (barra visual, feito em task-3.4).
- Indicador "TENTATIVA N" (feito em task-7.2).
- Animação de número subindo (+10 floating text) — fora do MVP.
- Cores dinâmicas baseadas em threshold (Glória > 100 fica dourado) — fora do MVP.
- Som de subida de pontuação (task-7.1 cuida apenas de Safe/Risk/Crash).
