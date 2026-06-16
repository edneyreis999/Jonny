# HLD Generator (High-Level Design)

Conduz entrevista estruturada para gerar um HLD (High-Level Design) técnico e acionável, cobrindo arquitetura, componentes, fluxos, dados, interfaces, escalabilidade, segurança e observabilidade. O HLD final segue template padronizado em Markdown e pode ser exportado em JSON estruturado.

## Entrada
- Nenhum parâmetro obrigatório no trigger inicial
- Pergunta preliminar 1: "Você possui algum documento de contexto (PRD, especificação, proposta) que possa ajudar a guiar esta entrevista?"
  - Se sim: solicitar caminho do arquivo e ler para guiar sugestões de respostas
  - Se não: prosseguir sem contexto adicional
- Pergunta preliminar 2: "Qual o caminho de destino onde deseja salvar o HLD gerado?" (ex: `docs/hld/`, `planos/hld/`)
  - Validar que é caminho relativo ao projeto
  - Confirmar antes de prosseguir
- Informações coletadas progressivamente através de 11 etapas de entrevista

## Passos (determinísticos)
1. Exibir mensagem inicial explicando o processo de entrevista de HLD
2. Fazer pergunta preliminar 1 sobre documento de contexto; se fornecido, ler o arquivo e armazenar para guiar sugestões
3. Fazer pergunta preliminar 2 sobre caminho de destino; validar e confirmar
4. Conduzir entrevista estruturada seguindo rigorosamente as 11 etapas definidas, uma pergunta por vez:
   - Etapa 1: Contexto e objetivo técnico
   - Etapa 2: Arquitetura geral
   - Etapa 3: Componentes e responsabilidades
   - Etapa 4: Fluxo de requisições e de dados
   - Etapa 5: Modelo de dados (alto nível)
   - Etapa 6: Interfaces públicas
   - Etapa 7: Considerações de escalabilidade e disponibilidade
   - Etapa 8: Segurança
   - Etapa 9: Observabilidade
   - Etapa 10: Riscos arquiteturais e mitigação
   - Etapa 11: ADRs associados e próximos passos
5. Após cada etapa, apresentar resumo curto (3-6 linhas) e pedir confirmação antes de prosseguir
6. Sugerir 2-3 opções plausíveis marcadas como "hipótese" quando usuário não souber responder
7. Aplicar defaults inteligentes conforme especificados (observabilidade, segurança, disponibilidade)
8. Executar checagem de consistência antes de finalizar (10 pontos de validação)
9. Gerar arquivo HLD em Markdown seguindo exatamente o template padronizado
10. Perguntar se usuário deseja exportação em JSON estruturado
11. Se sim, gerar arquivo JSON com chaves em inglês e valores em português, omitindo campos vazios

## Restrições e Segurança
- Escopo de arquivos: perguntar ao usuário o caminho de destino ANTES da entrevista; validar que é relativo ao projeto (não aceitar caminhos absolutos fora do projeto)
- Nunca sobrescrever arquivos existentes sem confirmação explícita do usuário
- Leitura de contexto: apenas ler arquivos fornecidos explicitamente pelo usuário (formatos aceitos: .md, .txt, .pdf)
- Não executar comandos shell; comando é puramente interativo (perguntas e respostas)
- Poluição de contexto: usar resumos curtos (3-6 linhas) após cada etapa; não repetir todo conteúdo coletado a cada pergunta
- Determinismo: seguir rigorosamente a ordem das 11 etapas; não pular etapas sem confirmação; não inventar respostas técnicas sem marcar explicitamente como "hipótese"
- Validação obrigatória: executar checagem de consistência (10 pontos) antes de gerar HLD final; confirmar nome do arquivo antes de criar
- Não usar travessões "—" (usar hífens simples "-")

## Saída Esperada
- Arquivo principal: `[caminho-escolhido]/hld-[nome-do-sistema].md` (obrigatório)
  - Estrutura: template padronizado com 11 seções técnicas
  - Formato: Markdown seguindo esqueleto definido
  - Conteúdo: em português, técnico e acionável
- Arquivo secundário: `[caminho-escolhido]/hld-[nome-do-sistema].json` (opcional, se solicitado)
  - Estrutura: JSON com chaves em inglês e valores em português
  - Campos vazios são omitidos
- Mensagem final ao usuário confirmando criação dos arquivos com caminhos completos

## Observações

### Pré-requisitos
- Ter conhecimento técnico do sistema ou módulo a ser documentado
- Ter acesso a documentos de contexto (opcional, mas fortemente recomendado)

### Contexto necessário
- O comando não gera código, apenas documentação técnica de arquitetura
- Espera-se que o usuário já tenha compreensão básica do sistema a ser documentado
- A entrevista pode levar de 15-30 minutos dependendo da complexidade do sistema

### Comportamento do modelo durante a entrevista
- O modelo DEVE sugerir respostas sempre que possível para facilitar a entrevista
- Baseado no documento de contexto (se fornecido), o modelo oferece opções plausíveis e fundamentadas
- Quando o usuário não souber responder, o modelo apresenta 2-3 alternativas marcadas explicitamente como "hipótese"
- Sugestões devem ser técnicas, específicas e fundamentadas no contexto fornecido ou em boas práticas
- Nunca inventar detalhes técnicos sem rotular claramente como hipótese

### Quando usar
- Após ter um PRD ou especificação de negócio pronta
- Antes de iniciar FDD (Feature Design Doc) ou LLD (Low-Level Design)
- Quando precisar documentar a arquitetura de alto nível de um sistema ou módulo
- Para alinhar decisões arquiteturais entre equipes técnicas

### Quando NÃO usar
- Para documentação de baixo nível ou implementação detalhada (use FDD ou LLD)
- Para especificação de requisitos de negócio (use PRD)
- Se ainda não houver clareza mínima sobre os componentes e arquitetura do sistema
- Para documentar APIs em detalhe (use especificação OpenAPI ou similar)

### Dependências
- Nenhuma ferramenta externa necessária
- Arquivos gerados em Markdown (obrigatório) e JSON (opcional)
- Leitura de arquivos de contexto (.md, .txt, .pdf) se fornecidos

### Defaults inteligentes aplicados automaticamente
- Observabilidade mínima: logs estruturados, métricas de erro/latência por interface, tracing distribuído ponta a ponta
- Segurança mínima: autenticação, autorização por papel, criptografia em trânsito, segredos gerenciados por vault
- Meta de disponibilidade inicial: 99.9% para interfaces externas e 99.5% para internas
- Latência de decisão em middleware crítico: p95 < 5 ms quando houver cache/armazenamento de baixa latência

### Checagens de consistência (executadas antes de gerar o HLD final)
1. Objetivo técnico está claro e não repete o PRD
2. Arquitetura geral suporta requisitos não funcionais declarados
3. Componentes têm responsabilidades e dependências explícitas
4. Fluxos de requisições e dados estão completos ponta a ponta
5. Modelo de dados nomeia entidades e relações principais com fonte de verdade
6. Interfaces públicas listadas com protocolo e exposição
7. Estratégias de escalabilidade e disponibilidade estão descritas com metas
8. Segurança e observabilidade têm políticas e práticas mensuráveis
9. Riscos têm probabilidade, impacto, mitigações e plano de contingência
10. ADRs e próximos passos indicam decisões tomadas e pendentes
