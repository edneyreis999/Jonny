
Faça uma analise nos mapas do jogo. Nós precisamos identificar onde o jogador deve entrar na corrida e onde, depois que ele vencer a corrida, ele deve ser telestransportado.

Eu deixei comentado no conteudo do mapa 010 e 005 onde a gente deve iniciar com a corrida.
procure por 
## Comentario 1
## Comentario 2

No mapa 013 Tem vários pontos onde devemos ir para corrida ID 3.
Ao final da corrida, devemos teletransportar o jogador para o mapa 012.

não se esqueça de analisar os efeitos colaterais de teletransportar o jogador para os mapas.
coisas como:
- imagens ou sons ou triggers indesejadas criada no pelos EV_* disparados no mapa 001. 

Trate o mapa 001 como um mini-game separado, então quando o jogador sair dele, e for teletransportado para um mapa de diálogo, não devemos deixar nada rodando em pararelo referente a corrida (mapa 001).
