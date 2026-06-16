---
name: zord:catalogar-doc-tecnica
description: Cataloga documentação técnica otimizada para navegação e recuperação por LLMs
---

# Catalogar Documentação Técnica

Transforma documentação técnica em formato otimizado para navegação, recuperação e leitura por LLMs, preservando o conteúdo e melhorando a estrutura.

## Entrada

- **Caminho do documento** (obrigatório): Caminho do arquivo .md a ser catalogado
- **Nome do sistema** (opcional): Nome do plugin/sistema (extraído do documento se não fornecido)
- **Estrutura customizada** (opcional): JSON com estrutura de pastas desejada
- **Seções específicas** (opcional): Lista de seções a identificar (ex: `["notetags", "parameters"]`)

Os parâmetros podem ser:
- Fornecidos na invocação (ex.: `/zord:catalogar-doc-tecnica docs/arquivo.md "Nome Sistema"`)
- Perguntados interativamente se não fornecidos

## Passos (determinísticos)

### 1. Coletar Parâmetros

Se não fornecidos na invocação, perguntar interativamente usando `AskUserQuestion`:

```
header: "Documento"
question: "Qual o caminho do documento .md a ser catalogado?"
options:
  - "Fornecer caminho" - Usuário digita o caminho
  - "Listar disponíveis" - Lista docs em docs/rpg-maker-for-ia/docs-visustella/
```

```
header: "Nome Sistema"
question: "Qual o nome do sistema/plugin? (deixe em branco para extrair automaticamente)"
options:
  - "Extrair do documento" - Analisa o documento para encontrar o nome
  - "Fornecer nome" - Usuário digita o nome
```

### 2. Analisar Documento

Ler o documento completo e extrair:

- **Metadados**: Nome, versão, autor, requisitos, tier
- **Tipo de plugin**: Detectar automaticamente:
  - `battle-system`: Battle Core, ATB, BTB, FTB, ETB, PTB
  - `resource-system`: TP System, MP System, etc.
  - `mechanic`: Auto Skill Trigger, State Effects, etc.
  - `core`: Core Engine, Options Core, etc.
  - `generic`: Outros tipos
- **Seções existentes**: Mapear todas as seções presentes no documento
- **Estrutura interna**: Identificar como o conteúdo está organizado

### 3. Detectar Tipo e Propor Estrutura

Com base no tipo detectado, propor estrutura adaptativa:

**Battle System** (ATB, BTB, Battle Core):
```
/nome-sistema/
  index.md
  CLAUDE.md
  AGENTS.md
  llms-full.txt
  conceitos/
    visao-geral.md
    mecanica-especifica.md (ex: agilidade, BP, ATB)
  configuration/
    parametros.md
    gauge.md
    timing.md
  features/
    skills-items.md
    actors-enemies.md
    states.md
  reference/
    troubleshooting.md
    glossario.md
    compatibilidade.md
```

**Resource System** (TP, MP, etc.):
```
/nome-sistema/
  index.md
  CLAUDE.md
  AGENTS.md
  llms-full.txt
  conceitos/
    visao-geral.md
    mudancas-core.md
    modos.md
  notetags/
    gerais.md
    atores.md
    referencia-rapida.md
  comandos/
    atores.md
    inimigos.md
    sistema.md
  parametros/
    configuracao-geral.md
    modos.md
    formulas.md
  referencia/
    glossario.md
    faq.md
```

**Mechanic** (Auto Skill Trigger, etc.):
```
/nome-sistema/
  index.md
  CLAUDE.md
  AGENTS.md
  llms-full.txt
  conceitos/
    introducao.md
    funcionamento.md
  notetags/
    triggers.md
    condicoes.md
    exemplos.md
  referencia/
    compatibilidade.md
    troubleshooting.md
    glossario.md
```

### 4. Confirmar Estrutura

Apresentar a proposta usando `AskUserQuestion`:

```
header: "Estrutura"
question: "Estrutura detectada: {{TIPO}}. Pasta de saída: docs/rpg-maker-for-ia/catalogado/{{NOME_SISTEMA}}/. Confirmar?"
options:
  - "Confirmar" - Usa a estrutura proposta
  - "Customizar" - Usuário pode ajustar a estrutura
  - "Cancelar" - Interrompe o processo
```

### 5. Gerar Documentação

Executar a transformação seguindo o prompt parametrizado:

```
AGENTE: Você é um especialista em catalogar documentação técnica para LLMs.

DOCUMENTO ORIGEM: {{INPUT_PATH}}
NOME DO SISTEMA: {{SYSTEM_NAME}}
TIPO DETECTADO: {{DETECTED_TYPE}}
ESTRUTURA PROPOSTA: {{PROPOSED_STRUCTURE}}
SEÇÕES IDENTIFICADAS: {{SECTIONS_LIST}}
METADADOS: {{METADATA}}

SUA TAREFA:
Transformar o documento em uma documentação otimizada para:
1. navegação hierárquica;
2. recuperação semântica por partes;
3. leitura incremental;
4. referência cruzada entre tópicos;
5. uso futuro por LLMs.

[... usar o conteúdo do prompt original 002-prompt-escrever-guia.md ...]
```

### 6. Gerar Índices e Chunks

Após gerar os arquivos Markdown:

**index.md** deve conter:
- Visão geral da documentação
- Mapa das seções
- Links para arquivos principais
- Caminho recomendado de leitura

**CLAUDE.md** deve conter:
- Nome do projeto/sistema
- Propósito da documentação
- Principais áreas
- Links para arquivos importantes
- Ordem sugerida de navegação

**AGENTS.md** deve ser uma cópia do **CLAUDE.md**:
- Nome do projeto/sistema
- Propósito da documentação
- Principais áreas
- Links para arquivos importantes
- Ordem sugerida de navegação

**llms-full.txt** deve conter:
- Sumário amplo
- Descrição de cada documento
- Relação entre áreas
- Links/referências internas

**chunks.json** com schema:
```json
{
  "id": "string",
  "title": "string",
  "path": "string",
  "section": "string",
  "breadcrumbs": ["string"],
  "summary": "string",
  "keywords": ["string"],
  "content": "string",
  "related_topics": ["string"],
  "source_ref": "string"
}
```

### 7. Validar e Entregar

Antes de concluir, validar:
- ✅ Nenhum arquivo ficou amplo demais ou genérico
- ✅ Títulos estão específicos
- ✅ Chunks são semanticamente úteis
- ✅ Links internos fazem sentido
- ✅ Organização final está melhor para LLM que o original

Entregar resumo:
```
+================================================================+
|              CATALOGAÇÃO CONCLUÍDA                              |
+================================================================+
| Sistema: {{SYSTEM_NAME}}                                       |
| Tipo: {{DETECTED_TYPE}}                                        |
| Pasta: docs/rpg-maker-for-ia/catalogado/{{NOME_SISTEMA}}/     |
+----------------------------------------------------------------+
| Arquivos criados: {{NUM_FILES}}                                |
| Chunks gerados: {{NUM_CHUNKS}}                                 |
+================================================================+
```

## Restrições e Segurança

- **Escopo restrito ao projeto**: Trabalhar apenas dentro de `docs/rpg-maker-for-ia/`
- **Validações de caminho**: Verificar que o caminho existe e é um arquivo .md
- **Comportamento não-destrutivo**: Avisar se estrutura já existe antes de sobrescrever
- **Limite de tamanho**: Se documento > 10.000 linhas, pedir confirmação

## Detecção Automática de Tipo

**Battle System** (contém palavras-chave):
- "Turn Battle", "ATB", "BTB", "FTB", "ETB", "PTB"
- "Action Times", "Turn Order", "Battle System"
- "Brave Points", "TPB"

**Resource System** (contém palavras-chave):
- "TP System", "MP System", "Resource"
- "TP Mode", "TP Gauge"
- "Preserve TP", "MaxTP"

**Mechanic** (contém palavras-chave):
- "Auto Trigger", "Skill Trigger"
- "State Effects", "Passive Effects"
- "Reaction Skills"

## Saída Esperada

- **Arquivos gerados**: Estrutura completa de Markdown + índices + chunks
- **Formato da resposta**:
  - Confirmação de conclusão
  - Resumo: tipo detectado, pasta de saída, arquivos criados
  - Lista de caminhos onde arquivos foram gerados
  - Avisos se algum arquivo existente foi sobrescrito

## Observações

### Pré-requisitos
- Documento .md deve existir e ser legível
- Permissões de escrita no diretório de saída

### Quando usar
- Para catalogar documentação de plugins RPG Maker MZ
- Ao organizar documentação técnica extensa
- Para criar índices otimizados para recuperação por LLM

### Quando NÃO usar
- Em documentos não-técnicos
- Em documentação já catalogada
- Em arquivos que não sejam .md

### Padrões de Nomenclatura

**Pastas**: Use kebab-case
- `visustella-enhanced-tp-system/`
- `visustella-active-turn-battle/`

**Arquivos**: Use kebab-case
- `visao-geral.md`
- `referencia-rapida.md`
- `troubleshooting.md`

**Títulos**: Use texto claro
- `# Visão Geral`
- `## Configuração de Parâmetros`
- `### Notetags para Skills`

### Exemplos de Invocação

```bash
# Básico
/zord:catalogar-doc-tecnica docs/rpg-maker-for-ia/docs-visustella/Battle_Core_VisuStella_MZ.md

# Com nome customizado
/zord:catalogar-doc-tecnica docs/arquivo.md "Meu Sistema Customizado"

# Com estrutura customizada (JSON)
/zord:catalogar-doc-tecnica docs/arquivo.md "Nome" '["introducao", "referencia", "exemplos"]'
```

## Árvore de Decisão: Tipo de Documento

```
Contém "Battle System" ou "Turn Battle"?
│
├── SIM → battle-system
│   ├── Contém "ATB" ou "Active Time"? → ATB
│   ├── Contém "BTB" ou "Brave Turn"? → BTB
│   ├── Contém "FTB" ou "Force Turn"? → FTB
│   └── Contém "Battle Core"? → Battle Core
│
├── Contém "TP System" ou "TP Mode"? → resource-system
│
├── Contém "Auto Trigger" ou "Skill Trigger"? → mechanic
│
└── Outro → generic
```

## Troubleshooting

| Problema | Solução |
|----------|----------|
| Documento não encontrado | Verifique o caminho e tente novamente |
| Tipo não detectado | Será usado "generic" - você pode customizar a estrutura |
| Estrutura já existe | Será perguntado se deseja sobrescrever |
| Documento muito grande | Será pedido confirmação antes de processar |
