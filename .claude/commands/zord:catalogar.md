# Catalogar Diretório

Invoca o agente catalogador para criar índices de documentação (`index.md`) em um diretório específico, com opção de catalogação recursiva em todos os subdiretórios. O processo funciona bottom-up: cataloga primeiro os diretórios folha e sobe recursivamente até o diretório raiz informado.

## Entrada

- **Caminho do diretório** (obrigatório): Caminho relativo ao diretório do projeto que será catalogado
- **Flag de recursividade** (opcional): `sim` ou `não` (padrão: `sim`)

Os parâmetros podem ser:
- Fornecidos na invocação do command (ex.: `/zord:catalogar docs/ sim`)
- Perguntados interativamente se não fornecidos

## Passos (determinísticos)

1. **Verificar parâmetros fornecidos**: Checar se caminho e flag foram passados na invocação
2. **Coletar parâmetros faltantes**: Se não fornecidos, perguntar interativamente:
   - Caminho do diretório (obrigatório)
   - Recursividade (opcional, padrão "sim")
3. **Validar caminho**:
   - Verificar que o caminho existe e é um diretório (não arquivo)
   - Validar que está dentro do diretório do projeto (não sai do workspace)
   - Sanitizar entrada (remover `../` maliciosos)
4. **Aplicar filtros de exclusão**: Ignorar automaticamente:
   - `node_modules/`, `.git/`, `dist/`, `build/`, `.next/`, `.cache/`, `.turbo/`, `coverage/`
5. **Executar catalogação**:
   - **Se recursivo = sim**:
     - Mapear árvore de diretórios até as folhas (máx. 10 níveis de profundidade)
     - Se total > 100 diretórios, abortar e exibir erro
     - Se total > 20 diretórios, pedir confirmação do usuário
     - Invocar agente `catalogador` em cada diretório folha (bottom-up)
     - Aguardar conclusão de cada agente antes de subir ao próximo nível
     - Processar recursivamente até o diretório raiz informado
   - **Se recursivo = não**:
     - Invocar agente `catalogador` apenas no diretório informado
6. **Confirmar conclusão**:
   - Validar que arquivos `index.md` foram gerados
   - Exibir resumo: número de diretórios catalogados, arquivos criados/atualizados
   - Logs resumidos (não exibir output completo de cada agente)

## Restrições e Segurança

- **Escopo restrito ao projeto**: Trabalhar apenas dentro do diretório do projeto; rejeitar caminhos absolutos externos ou uso de `../` que saia do workspace
- **Diretórios excluídos automaticamente**: `node_modules/`, `.git/`, `dist/`, `build/`, `.next/`, `.cache/`, `.turbo/`, `coverage/`
- **Validações de caminho**: Verificar que o caminho existe e é um diretório; sanitizar entrada para evitar injeção
- **Limites de recursão**:
  - Profundidade máxima: 10 níveis
  - Número máximo de diretórios: 100
  - Confirmação obrigatória se > 20 diretórios
- **Logs resumidos**: Não exibir output completo de cada invocação do agente para evitar poluição de contexto
- **Comportamento não-destrutivo**: Apenas criar ou atualizar `index.md`; avisar se `index.md` já existe antes de sobrescrever

## Saída Esperada

- **Arquivos gerados**: Um arquivo `index.md` no diretório informado (e em cada subdiretório se recursivo)
- **Formato da resposta**:
  - Confirmação de conclusão
  - Resumo: número de diretórios catalogados, arquivos criados/atualizados
  - Lista de caminhos onde `index.md` foi gerado
  - Avisos se algum `index.md` existente foi sobrescrito

## Observações

### Pré-requisitos
- Agente `catalogador` deve estar disponível em `.claude/agents/catalogador`

### Quando usar
- Para criar ou atualizar índices de navegação em documentação
- Ao organizar estruturas de diretórios com muitos arquivos
- Para facilitar navegação de LLMs em diretórios de docs

### Quando NÃO usar
- Em diretórios de código-fonte (usar apenas em documentação)
- Em diretórios já catalogados manualmente (sem necessidade de atualização)
- Em diretórios temporários ou de build

### Dependências
- Agente `catalogador` configurado e funcional
- Permissões de escrita no diretório informado

### Fluxo bottom-up
O processo de catalogação recursiva funciona de baixo para cima: primeiro cataloga as folhas da árvore de diretórios, depois sobe um nível e cataloga os diretórios pais (que já podem referenciar os `index.md` dos filhos), até chegar ao diretório raiz informado. Isso garante que cada `index.md` pode referenciar os índices dos subdiretórios.
