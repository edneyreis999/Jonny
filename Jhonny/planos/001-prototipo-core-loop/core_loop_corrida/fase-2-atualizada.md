# Atualizações da Fase 2 — Baseadas na Retrospectiva da Fase 1

**Data:** 2026-06-18
**Fonte:** [[fase1/retrospectiva]]
**Aplicado a:** [[tasks.md]]

---

## Resumo das Atualizações

### 1. Aviso de tarefa manual (task 2.3)
**Problema identificado:** Fase 1 revelou que tarefas envolvendo Database/Common Events não são automatizáveis via CLI.

**Alteração aplicada:**
```markdown
> **AVISO (task 2.3):** Requer abrir RPG Maker MZ Editor manualmente (Database → Common Events) — não automatizável via CLI.
```

**Impacto:** Define expectativa clara sobre necessidade de intervenção manual no MZ Editor.

---

### 2. Especificações de formato obrigatório
**Problema identificado:** Retrospectiva não documentava formatos obrigatórios para assets.

**Alteração aplicada:**
```markdown
> **Formato obrigatório:** Pictures em PNG (canal alpha para botões/overlays), áudio em OGG Vorbis (não MP3).
```

**Impacto:** Evita desperdício criando assets no formato errado.

---

### 3. Seção de aprendizados da Fase 1
**Novo conteúdo adicionado** ao final de `tasks.md`:

#### Restrições técnicas confirmadas
- System.json usa arrays 0-based
- Plugin MZ requer IIFE específico
- Plugin Manager só via GUI
- JSON estruturado requer Python + json

#### Heurísticas de implementação
- Implementar diretamente sem replanejamento
- Criar instruções markdown para tarefas manuais
- Validar plugins com `node -c`
- Usar markdown para rastreamento

#### Formatos de arquivo críticos
- Pictures: PNG obrigatório (canal alpha)
- Áudio: OGG Vorbis canônico
- Resolução base: 816×624

#### Caminho mínimo recomendado
Passo a passo para execução da fase 2 sem desperdício.

#### Erros comuns a evitar
- Edit tool em JSON linha única
- Automatizar Database/Common Events
- Confundir índices 0-based com IDs
- TaskCreate para rastreamento

---

## Melhorias nas Tasks Individuais (Recomendado)

### Task 2.1 — Criar Pictures
**Adicionar pré-condições:**
- Pasta `Jhonny/img/pictures/race/` criada
- Validar dimensões: 816×624 (backgrounds), ~160×80 (botões), 200×20 (HUD)

**Adicionar aviso de formato:**
```markdown
> **CRÍTICO:** Usar SEMPRE PNG — JPEG não suporta canal alpha necessário para botões/overlays.
```

### Task 2.2 — Criar Sound Effects
**Adicionar especificação técnica:**
- Container: Ogg Vorbis (`.ogg`)
- Sample rate: 44100 Hz
- Channels: Mono
- Bitrate: ~96 kbps

**Adicionar aviso:**
```markdown
> **CRÍTICO:** Não usar MP3 — OGG é mais estável em NW.js e é o formato canônico do projeto.
```

### Task 2.3 — Criar EV_Preload
**Adicionar pré-condições:**
- MZ Editor instalado e acessível
- Task 2.1 completa (pictures existem)
- Common Events acessível via F9

**Já está documentado como manual** — nenhuma alteração necessária.

---

## Caminho de Execução Otimizado (Fase 2)

### Passo 1: Leitura preparatória
- Ler `tasks.md` — seção Fase 2
- Ler tasks individuais (2.1, 2.2, 2.3)
- Ler seção "Aprendizados da Fase 1"

### Passo 2: Task 2.1 — Pictures
- Criar pasta `Jhonny/img/pictures/race/`
- Criar 15 PNGs conforme especificações (PNG obrigatório)
- Validar: abrir em visualizador para confirmar dimensões/canal alpha

### Passo 3: Task 2.2 — Áudio
- Criar 3 arquivos `.ogg` em `Jhonny/audio/se/`
- Validar: abrir em player de áudio para confirmar formato/duração

### Passo 4: Task 2.3 — Preload (manual)
- Abrir MZ Editor → Database (F9) → Common Events
- Criar `EV_Preload` com 45 comandos (3 × 15 pictures)
- Salvar projeto

### Passo 5: Validação
- Playtest MZ para verificar preload sem hitch
- Console F12 para confirmar sem erros de carregamento

### Passo 6: Documentação
- Atualizar `tasks.md` marcando fase 2 como completa
- Criar registro em `fase-2-completa.md`

---

## Critérios de Sucesso (Fase 2)

- [ ] 15 PNGs em `Jhonny/img/pictures/race/`
- [ ] 3 OGGs em `Jhonny/audio/se/`
- [ ] Common Event `EV_Preload` criado
- [ ] Playtest mostra pictures sem hitch
- [ ] Console sem erros de carregamento

---

## Próximos Passos

Após fase 2 completa, prosseguir para:
- **Fase 3**: Orchestrator + Renderização Estática
- Dependências: F1 (variáveis) + F2 (assets) ambas completas

---

## Referências

- Retrospectiva Fase 1: [[fase1/retrospectiva]]
- Plano atualizado: [[tasks.md]]
- Tasks detalhadas: [[task-2.1]], [[task-2.2]], [[task-2.3]]
