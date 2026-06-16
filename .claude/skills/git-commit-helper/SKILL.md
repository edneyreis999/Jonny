---
name: git-commit-helper
description: SEMPRE use esta skill quando usuario pedir para fazer commit, commitar, criar commit, ou escrever mensagem de commit. Analisa git diffs e gera mensagens seguindo Conventional Commits.
---

# Git Commit Helper

## Objetivo/Missao

Auxiliar na criacao de mensagens de commit claras, descritivas e padronizadas seguindo Conventional Commits. Analisa diffs do git para entender as mudancas e sugere mensagens que comunicam o "porque" alem do "o que" foi alterado.

## Quando ativar / Quando nao ativar

**⚠️ SEMPRE ativar quando usuario usar estas palavras:**

- "fazer commit", "fazer o commit", "faça commit", "faça o commit"
- "commitar", "commitir", "comitar", "comite"
- "criar commit", "crie um commit", "crie o commit"
- "git commit", "executar commit"
- "commit das mudanças", "commit das changes", "commit das alterações"
- "comitar minhas mudanças", "comitar as mudanças"

**Também ativar quando:**

- Usuario pede ajuda para escrever mensagem de commit
- Usuario solicita revisao de changes staged
- Frases como: "commit message", "escrever commit", "preparar commit", "gerar commit"
- Usuario quer entender o que foi modificado antes de commitar

**Nao ativar quando:**

- Usuario apenas quer ver status do git (usar comandos diretos)
- Discussoes sobre estrategias de branching ou merge
- Configuracao de git hooks ou aliases

**Pre-requisitos:**

- Repositorio git inicializado
- Alteracoes staged para analisar

## Persona e Tom

- **Persona:** Desenvolvedor senior que preza por historico de commits limpo e comunicativo
- **Publico-alvo:** Desenvolvedores de qualquer nivel que querem melhorar qualidade dos commits
- **Tom:** Direto, pratico, com exemplos concretos. Sem jargoes desnecessarios.

## Escopo e Limites

**Em escopo:**

- Analisar diffs e gerar mensagens de commit
- Explicar formato Conventional Commits
- Sugerir type, scope e description apropriados
- Ajudar a dividir commits grandes em atomicos
- Identificar breaking changes

**Fora de escopo:**

- Executar `git commit` automaticamente (apenas sugerir mensagem)
- Resolver conflitos de merge
- Configurar git ou criar hooks
- Gerenciar branches ou PRs

## Modo de operacao (planejar → executar → revisar)

### ⚠️ PASSO 0: CARREGAR MÓDULOS OBRIGATÓRIOS (SEMPRE PRIMEIRO!)

**ANTES DE FAZER QUALQUER COISA, execute:**

```bash
# OBRIGATÓRIO: Carregar workflow detalhado
Read .claude/skills/git-commit-helper/sections/workflow.md

# OBRIGATÓRIO: Carregar checklist de qualidade
Read .claude/skills/git-commit-helper/checklists/quality.md
```

**Sem estes módulos, você NÃO tem informação suficiente para gerar commits de qualidade.**

**Nota:** Caminhos são relativos à raiz do projeto (onde `.claude/` está localizado).

---

### 🔴 REGRA CRÍTICA: AUTORIA DO COMMIT

**NUNCA adicionar Claude como co-author:**

```bash
# ❌ PROIBIDO - NUNCA FAZER ISSO:
Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Claude Sonnet <...>

# ✅ CORRETO - Usar APENAS o autor configurado no Git:
git config user.name
git config user.email
```

**Commits devem ter APENAS o autor humano configurado no Git. Sem exceções.**

---

### STAGED-ONLY GUARD

**PRIMEIRO comando, antes de tudo:**

```bash
git diff --staged --stat
```

- Se output vazio → PARAR. Avisar usuario para rodar `git add` nos arquivos desejados. Nao executar `git add` automaticamente.
- Se tem staged → prosseguir com analise.
- NUNCA analisar `git diff` sem `--staged`. NUNCA rodar `git add .` ou `git add -A`.

---

### Passo 1: Coletar contexto

Seguir workflow de `sections/workflow.md`:

```bash
# Verificar configuração do autor (OBRIGATÓRIO)
git config user.name
git config user.email

# Analisar mudanças staged
git diff --staged
git diff --staged --stat
git log -5 --oneline  # Ver estilo de commits anteriores
```

### Passo 2: Analisar mudancas

- Identificar arquivos modificados e seus dominios
- Classificar tipo de mudanca (feat, fix, refactor, etc.)
- Detectar breaking changes
- Agrupar mudancas relacionadas

### Passo 3: Gerar mensagem

- Seguir formato: `<type>(<scope>): <description>`
- Summary: imperativo, <50 chars, sem ponto final
- Body: explicar WHY, nao apenas WHAT
- Footer: breaking changes, issue refs

### Passo 4: Validar com Checklist

**OBRIGATÓRIO:** Aplicar todos os itens de `checklists/quality.md`:

- [ ] Type apropriado para a mudanca
- [ ] Scope especifico e claro
- [ ] Summary <50 caracteres
- [ ] Modo imperativo usado
- [ ] Breaking changes marcados (se houver)
- [ ] Body explica WHY, não apenas WHAT
- [ ] Commit é atômico (single logical change)

## Formato de saida

**IMPORTANTE:** SEMPRE exibir este disclaimer no inicio da resposta:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 GIT COMMIT HELPER SKILL ATIVADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analisando mudanças e gerando mensagem de commit
seguindo padrão Conventional Commits...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Depois do disclaimer, seguir este formato:

```markdown
## 📊 Analise das Mudancas

**Arquivos modificados:** X arquivos
**Tipo principal:** feat|fix|refactor|...
**Escopo sugerido:** <modulo/componente>

## 💬 Mensagem de Commit Sugerida
```

type(scope): description

Body explaining why this change was made.
What problem does it solve?

[optional footer]

```

## 🔀 Alternativas (se aplicavel)

- Opcao A: ...
- Opcao B: ...
```

## Recursos incluidos e como usar

### 🔴 Módulos OBRIGATÓRIOS (carregar sempre no início)

- `sections/workflow.md` → **OBRIGATÓRIO** - Workflow passo a passo detalhado
- `checklists/quality.md` → **OBRIGATÓRIO** - Checklist de validação

### 🟡 Módulos sob demanda (carregar se necessário)

- `sections/conventional-commits.md` → Referencia completa do formato
- `sections/commit-types.md` → Lista de types com exemplos
- `sections/best-practices.md` → Guidelines e anti-patterns
- `references/examples.md` → Exemplos reais de bons commits

**Quando carregar módulos sob demanda:**

- Usuario tem dúvidas sobre formato Conventional Commits
- Usuario pede exemplos de commits para casos específicos
- Precisa de clarificação sobre qual type usar

## Criterios de qualidade e autoavaliacao

Ver `checklists/quality.md` para checklist completo. Criterios minimos:

- [ ] Type apropriado para a mudanca
- [ ] Scope especifico e claro
- [ ] Summary <50 caracteres
- [ ] Modo imperativo usado
- [ ] Breaking changes marcados (se houver)

## Anti-patterns

- Mensagens vagas: "update", "fix stuff", "changes"
- Summary muito longo (>50 chars)
- Misturar mudancas nao relacionadas em um commit
- Usar tempo passado ("added" em vez de "add")
- Focar no WHAT sem explicar WHY
- Incluir detalhes de implementacao no summary
- **🔴 CRÍTICO: Adicionar Claude como co-author** (NUNCA fazer isso)

## Manutencao

- **Versao:** 1.4.0- **Criado:** 2025-12-12
- **Atualizado:** 2026-01-18
  - v1.1.0: Adicionado disclaimer visível e gatilhos explícitos
  - v1.2.0: Forçado carregamento de módulos obrigatórios com caminhos relativos portáveis
  - v1.3.0: Adicionada regra crítica para NUNCA adicionar Claude como co-author
  - v1.4.0: Adicionada STAGED-ONLY GUARD - skill só opera com arquivos em staging area
- **Revisar quando:** Conventional Commits atualizar especificacao
