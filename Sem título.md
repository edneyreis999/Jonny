Escreva um documento refletindo sobre essa sessão acabou de executar.

Eu quero que você escreva um documento super tecnico para outro LLM contando sobre as decisões técnicas que você tomou durante essa sessão.

Nesse documento fale sobre:
- Decisões por Inferencias que você precisou tomar que não estava explicitamente no plano inicial. Porque você precisou inferir isso? Deu certo? A inferencia resolveu o problema? 
- Scripts que você precisou rodar para encontrar para encontrar os arquivos. Porque você precisou rodar esse script? Deu certo? Ele resolveu o problema que você estava tentando resolver?
- O usuario te interrompeu em algum momento para te passar alguma instrução? Porque? O que você estava fazendo de errado?



# **Retrospectiva técnica e otimização da execução**

Analise a sessão que você acabou de concluir e produza uma retrospectiva técnica destinada a outra LLM que precise executar uma tarefa semelhante no futuro.

O objetivo não é recontar toda a conversa nem expor seu raciocínio interno detalhado. Registre apenas decisões observáveis, justificativas resumidas, evidências encontradas, erros, desperdícios e instruções reutilizáveis.

A tarefa foi concluída, mas consumiu mais tokens, ferramentas, buscas ou interações do que o necessário. Identifique como uma próxima execução poderia alcançar o mesmo resultado com maior precisão, menos tentativas e menor consumo de contexto.

## **1. Resumo da tarefa**

Descreva objetivamente:

- Qual era o resultado solicitado pelo usuário.
- Qual resultado foi efetivamente entregue.
- Quais critérios indicaram que a tarefa foi concluída com sucesso.
- Quais restrições, ferramentas, arquivos, tecnologias ou formatos eram relevantes.

Não faça uma narrativa cronológica extensa. Limite esta seção ao contexto necessário para outra LLM entender o problema.

## **2. Decisões técnicas e inferências**

Liste somente as decisões que afetaram materialmente a execução.

Para cada decisão ou inferência, informe:

- **Decisão ou inferência:** o que foi assumido ou escolhido.
- **Motivo:** qual informação estava ausente, ambígua ou insuficiente.
- **Evidência disponível:** quais fatos da sessão sustentavam a decisão.
- **Resultado:** se funcionou, falhou ou funcionou parcialmente.
- **Avaliação:** se a decisão era realmente necessária.
- **Melhoria futura:** qual informação, regra ou verificação evitaria essa inferência na próxima execução.

Não invente justificativas retrospectivas. Quando não houver evidência suficiente, declare explicitamente.

## **3. Uso de ferramentas, comandos e scripts**

Registre as ferramentas, buscas, comandos ou scripts relevantes utilizados durante a execução.

Para cada item, informe:

- **Ferramenta ou comando utilizado.**
- **Objetivo específico.**
- **Por que foi necessário.**
- **Resultado obtido.**
- **Se contribuiu diretamente para a solução.**
- **Se poderia ter sido substituído por uma abordagem mais simples.**
- **Como evitar chamadas redundantes na próxima execução.**

Destaque especialmente:

- Buscas repetidas.
- Leitura excessiva de arquivos.
- Comandos que não produziram informações úteis.
- Tentativas exploratórias que poderiam ter sido evitadas.
- Arquivos ou diretórios que deveriam ter sido conhecidos desde o início.
- Informações descobertas tardiamente que deveriam ter sido verificadas primeiro.

## **4. Intervenções e correções do usuário**

Identifique os momentos em que o usuário precisou interromper, corrigir, complementar ou redirecionar a execução.

Para cada intervenção, informe:

- **Instrução dada pelo usuário.**
- **O que estava incorreto, incompleto ou desalinhado antes da intervenção.**
- **Qual suposição ou interpretação causou o problema.**
- **Como a execução mudou depois da correção.**
- **Qual regra reutilizável pode impedir que isso aconteça novamente.**

Não atribua automaticamente toda intervenção a um erro da LLM. Diferencie:

- Correção de um erro.
- Esclarecimento de uma ambiguidade real.
- Mudança de escopo feita pelo usuário.
- Nova preferência que não havia sido informada anteriormente.

## **5. Análise de desperdício**

Identifique os principais fatores que aumentaram desnecessariamente o custo da execução.

Considere:

- Respostas excessivamente longas.
- Repetição de informações já conhecidas.
- Planejamento maior que a complexidade da tarefa exigia.
- Uso desnecessário de ferramentas.
- Busca ampla antes de verificar caminhos óbvios.
- Leitura integral quando uma busca localizada seria suficiente.
- Tentativas feitas sem validar pré-condições.
- Falta de reutilização de resultados obtidos anteriormente.
- Perguntas ao usuário cuja resposta já estava no contexto.
- Produção de artefatos intermediários que não contribuíram para o resultado final.
- Explicações detalhadas que o usuário não solicitou.

Para cada desperdício, indique:

- **O que aconteceu.**
- **Impacto estimado:** baixo, médio ou alto.
- **Causa.**
- **Como evitar.**

Não invente números de tokens. Utilize valores exatos somente se eles estiverem disponíveis na sessão.

## **6. Caminho mínimo recomendado**

Descreva a sequência ideal para resolver novamente a mesma tarefa.

A sequência deve:

- Usar o menor número razoável de etapas.
- Validar primeiro as hipóteses de maior impacto.
- Evitar buscas e leituras redundantes.
- Reutilizar informações já presentes no contexto.
- Definir claramente quando uma ferramenta é necessária.
- Definir critérios objetivos para encerrar a execução.

Apresente o caminho como passos numerados e executáveis.

Para cada passo, informe:

- A ação.
- A informação de entrada necessária.
- A ferramenta, caso seja necessária.
- O resultado esperado.
- O critério para seguir ao próximo passo.

## **7. Conhecimento reutilizável**

Extraia somente informações que aumentariam a qualidade de uma execução futura.

Organize em:

### **Fatos confirmados**

Informações verificadas durante a sessão que podem ser tratadas como verdade em uma tarefa equivalente.

### **Preferências do usuário**

Preferências demonstradas ou explicitamente informadas pelo usuário.

### **Restrições técnicas**

Limitações de ferramentas, formatos, ambientes, bibliotecas, arquivos ou processos.

### **Armadilhas conhecidas**

Abordagens que falharam, produziram desperdício ou geraram resultados incorretos.

### **Heurísticas recomendadas**

Regras práticas que ajudariam outra LLM a decidir com maior rapidez.

Não inclua fatos temporários ou específicos demais, a menos que sejam necessários para repetir a tarefa.

## **8. Informações que deveriam estar no prompt inicial**

Crie uma lista das informações ausentes que, se estivessem presentes no início, teriam reduzido significativamente as inferências, tentativas ou consumo de tokens.

Classifique cada item como:

- **Obrigatório:** sem isso há grande risco de erro.
- **Útil:** melhora a eficiência, mas pode ser inferido ou descoberto.
- **Opcional:** apenas melhora a apresentação ou conveniência.

Não classifique como “obrigatória” uma informação que não afetaria o resultado.

## **9. Melhorias nos artefatos do fluxo

Analise se os problemas, desperdícios, inferências ou intervenções identificados nesta retrospectiva poderiam ter sido evitados por melhorias nos artefatos produzidos antes da execução.

Para cada problema relevante, determine em qual categoria ele se encaixa:

1. **Análise técnica**
2. **Plano de implementação**
3. **Tasks da fase executada**
4. **Fora do escopo desses artefatos**
5. **Não exige alteração**, pois foi uma exploração razoável ou uma condição imprevisível

Não presuma que todo problema deve gerar uma alteração na especificação. Recomende mudanças somente quando elas reduzirem concretamente ambiguidades, retrabalho, tentativas desnecessárias ou risco de erro em futuras execuções.

### **9.1 Melhorias na análise técnica**

Identifique informações que deveriam ter sido descobertas, verificadas ou documentadas durante a análise técnica, antes da criação do plano de implementação.

Considere, por exemplo:

- Dependências e limitações técnicas.
- Arquitetura existente.
- Fontes de verdade.
- Localização e responsabilidade dos componentes.
- Contratos entre módulos.
- Restrições do ambiente.
- Comportamentos existentes que precisavam ser preservados.
- Riscos técnicos previsíveis.
- Hipóteses que deveriam ter sido validadas antes do planejamento.
- Decisões arquiteturais que não deveriam ter sido deixadas para a fase de execução.

Para cada melhoria, informe:

- **Problema observado durante a execução.**
- **Informação que estava ausente ou incorreta.**
- **Por que essa informação pertence à análise técnica.**
- **Em qual seção da análise técnica ela deveria ser adicionada ou alterada.**
- **Texto sugerido para a alteração.**
- **Impacto esperado na próxima execução.**

Não mova para a análise técnica detalhes operacionais que pertencem exclusivamente a uma task.

### **9.2 Melhorias no plano de implementação**

Identifique problemas causados pela estratégia, ordem, divisão ou dependência entre as etapas planejadas.

Considere, por exemplo:

- Ordem inadequada das fases.
- Dependências não explicitadas.
- Validações realizadas tarde demais.
- Etapas grandes ou vagas demais.
- Ausência de checkpoints.
- Falta de critérios para interromper uma abordagem que não estava funcionando.
- Trabalho executado antes de suas pré-condições estarem confirmadas.
- Decisões deixadas para a execução que deveriam ter sido resolvidas no planejamento.
- Falta de uma estratégia clara de testes ou validação.

Para cada melhoria, informe:

- **Problema observado durante a execução.**
- **Deficiência do plano de implementação.**
- **Etapa afetada.**
- **Alteração recomendada.**
- **Texto sugerido para a alteração.**
- **Como a mudança reduziria custo, risco ou retrabalho.**

Não transforme o plano de implementação em uma descrição detalhada de comandos ou alterações de código. Esses detalhes devem permanecer nas tasks quando forem específicos da execução.

### **9.3 Melhorias nas tasks da fase executada**

Identifique informações que deveriam estar explicitamente presentes nas tasks da fase que acabou de ser executada.

Considere, por exemplo:

- Arquivos ou componentes que deveriam ser modificados.
- Comportamento esperado.
- Restrições específicas da implementação.
- Dependências entre tasks.
- Pré-condições.
- Critérios de aceitação.
- Comandos obrigatórios de validação.
- Testes necessários.
- Casos-limite relevantes.
- Elementos que não deveriam ser alterados.
- Fontes que deveriam ser consultadas antes da implementação.
- Critérios objetivos para considerar a task concluída.

Para cada melhoria, informe:

- **Task afetada.**
- **Informação ausente, ambígua ou incorreta.**
- **Consequência observada durante a execução.**
- **Alteração recomendada.**
- **Texto sugerido para incluir ou substituir na task.**
- **Como validar que a nova instrução é suficiente.**

Não adicione às tasks informações globais que pertencem à análise técnica ou ao plano de implementação.

### **9.4 Problemas fora do escopo dos artefatos**

Identifique problemas que não deveriam ser resolvidos alterando a análise técnica, o plano de implementação ou as tasks.

Exemplos:

- Limitação ou falha temporária de ferramenta.
- Arquivo ausente ou corrompido.
- Ambiente diferente do documentado.
- Mudança de escopo feita durante a execução.
- Nova preferência informada pelo usuário.
- Problema externo ao projeto.
- Informação que não poderia ser conhecida antecipadamente.
- Comportamento não determinístico.
- Ineficiência causada pela própria estratégia operacional da LLM, sem relação com a qualidade da especificação.

Para cada item, informe:

- **Problema observado.**
- **Por que ele está fora do escopo dos artefatos.**
- **Como deveria ser tratado.**
- **Se exige alguma proteção operacional, automação, documentação separada ou nenhuma ação.**

Não tente corrigir falhas operacionais da LLM adicionando instruções excessivas às especificações.

### **9.5 Matriz de rastreabilidade das melhorias**

Apresente uma tabela consolidada:

|**Problema observado**|**Causa principal**|**Artefato responsável**|**Alteração necessária**|**Prioridade**|
|---|---|---|---|---|
|Descrição objetiva|Causa confirmada ou provável|Análise técnica, plano, task, fora do escopo ou nenhuma alteração|Resumo da mudança|Alta, média ou baixa|

### **9.6 Resultado final recomendado**

Finalize esta seção com blocos separados contendo apenas as alterações propostas:

#### **Patch sugerido para a análise técnica**

Inclua somente os trechos que deveriam ser adicionados, removidos ou modificados.

Caso nenhuma melhoria seja necessária, escreva:

`Nenhuma alteração recomendada para a análise técnica.`

#### **Patch sugerido para o plano de implementação**

Inclua somente os trechos que deveriam ser adicionados, removidos, reordenados ou modificados.

Caso nenhuma melhoria seja necessária, escreva:

`Nenhuma alteração recomendada para o plano de implementação.`

#### **Patch sugerido para as tasks da fase executada**

Agrupe as alterações por task e apresente somente os trechos propostos.

Caso nenhuma melhoria seja necessária, escreva:

`Nenhuma alteração recomendada para as tasks desta fase.`

#### **Ações fora do fluxo de especificação**

Liste somente ações que não pertencem à análise técnica, ao plano de implementação ou às tasks.

Caso não existam, escreva:

`Nenhuma ação externa ao fluxo de especificação foi identificada.`

## **Regras de classificação**

- Coloque na **análise técnica** informações sobre o estado do sistema, arquitetura, restrições, riscos, contratos e decisões técnicas estruturais.
- Coloque no **plano de implementação** a estratégia, ordem, dependências, divisão das fases e abordagem de validação.
- Coloque nas **tasks** as instruções específicas e executáveis da fase, incluindo escopo, critérios de aceitação e verificações.
- Classifique como **fora do escopo** problemas ambientais, operacionais ou imprevisíveis que não deveriam contaminar a especificação.
- Não duplique a mesma informação em vários artefatos. Escolha o nível de abstração mais apropriado e, quando necessário, faça uma referência entre eles.
- Não proponha alterações genéricas como “ser mais claro”, “adicionar mais contexto” ou “melhorar o planejamento”. Forneça o texto concreto que deveria ser alterado.
- Não aumente a especificação apenas para documentar cada passo executado.
- Priorize mudanças que previnam erros ou eliminem exploração desnecessária.
- Diferencie a ausência de informação de uma decisão incorreta tomada apesar de a informação já estar disponível.
- Quando a especificação já continha a informação necessária, classifique o problema como falha de execução da LLM, e não como deficiência do artefato.

Escreva um novo prompt completo para executar novamente uma tarefa equivalente.

Esse prompt deve:

- Incorpororar os fatos e restrições confirmados.
- Eliminar ambiguidades encontradas nesta sessão.
- Especificar claramente o resultado esperado.
- Definir critérios de sucesso.
- Indicar arquivos, caminhos, ferramentas ou tecnologias relevantes.
- Incluir preferências do usuário que afetaram o resultado.
- Evitar instruções desnecessárias ou excessivamente específicas.
- Orientar a LLM a interromper explorações que não estejam contribuindo para a solução.
- Pedir respostas e atualizações proporcionais à complexidade da tarefa.

O prompt deve ser autossuficiente, mas não deve incluir toda a retrospectiva.

Quando alguma informação essencial ainda não for conhecida, use um marcador como:

`[INFORMAÇÃO NECESSÁRIA: descrição]`

Não invente a informação ausente.

## **10. Checklist operacional**

Finalize com um checklist curto que outra LLM possa verificar antes e durante a próxima execução.

Inclua no máximo 10 itens, priorizando:

- Pré-condições.
- Fontes de verdade.
- Validações críticas.
- Erros já conhecidos.
- Critério de conclusão.

## **Regras de qualidade**

- Seja técnico, objetivo e específico.
- Não reproduza a conversa completa.
- Não exponha raciocínio interno detalhado ou cadeia de pensamento.
- Não elogie genericamente a execução.
- Não trate sucesso como prova de eficiência.
- Diferencie fatos, inferências e recomendações.
- Não invente erros, causas, métricas ou evidências.
- Não recomende etapas adicionais sem explicar o benefício.
- Priorize aprendizados acionáveis.
- Quando duas seções contiverem a mesma informação, faça referência à seção anterior em vez de repeti-la.
- Mantenha o documento proporcional à complexidade da sessão.
- O documento deve ser menor e mais útil do que uma transcrição da execução.