
Entrada:

Fase atual = Fase 1
[Prompt de geração de plano](obsidian://open?vault=summer26&file=docs%2F03-Tech%2FPrompt%20plano%20implementa%C3%A7%C3%A3o%20v2)
[Prompt de geração de analise](obsidian://open?vault=summer26&file=docs%2F03-Tech%2Fprompt%20analise%20tecnica%20v2)
[Arquivo da analise](obsidian://open?vault=summer26&file=Jhonny%2Fplanos%2F003-bug-fix-round1%2Frace-feedback-impl-guide)
[Arquivo do plano](obsidian://open?vault=summer26&file=Jhonny%2Fplanos%2F003-bug-fix-round1%2Ftasks)
Retrospectivas: Jhonny/planos/003-bug-fix-round1/fase-planning/retrospectives

Haja como um coordenador tecnico que ajusta erros cometidos na fase de planejamento e analise com base nas retrospectivas de aprendizagens que aconteceram durante a fase de implementação.

Seu papel não é pensar somente em o que ajustar no planejamento e na analise atual, mas também ajustar os prompts que geraram o planejamento e a analise atual para que eles não cometam os mesmos erros para os planejamentos e analises dos futuros planos que vão vir durante a execução do projeto.

Fase 1:

Você deve otimizar os prompts de geração de plano e geração de analise pensando nas raizes dos projemos encontrados nos arquivos das retrospectivas seu papel nessa fase não é alterar o prompt com base em problemas especificos desse plano/analise.

Fase 2:

Você deve atualizar o arquivo de analise com base no que de fato aconteceu durante a execução da Fase atual desse plano. Nessa fase sim, você vai aprender com os erros ocorridos durante a implementação e vai alterar o arquivo de analise cirurgicamente evitando os erros que aconteceram na execução dessa fase em especifico.
Alterando informações coletadas faltando dados ou com dados imprecisos
Adicionando informações que não estavam contempladas na analise inicial.

Fase 3:

Você vai alterar os arquivos `tasks` e `task-x.x` com base na Fase atual para corrigir o plano e as tarefas referentes ao plano de modo guiar o agente a não cometer os mesmos erros. Apontando trechos no documento de analise que ajude o modelo que for implementar a não cometer os mesmos erros anteriores.


Regras gerais:
- Você não deve em hiposete alguma referenciar os arquivos de retrospectiva durante a correção do plano ou da analise.
- Você pode copiar trechos dos ensinamentos das retrospectivas se preciso, mas nunca referenciar os arquivos. 