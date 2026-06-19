
Faça uma analise profunda no codebase atual. use o comando /mcp__pal__thinkdeeper para te ajudar a levantar as causas raizes dos bugs/sugestões

Pontos de feedback levantados pelo usuario:

-  Mover  THRESHOLDS para Jhonny_RaceHelper.js como um objeto de config + função helper, tipo:

	// em Jhonny_RaceHelper.js
	window.JhonnyRace = {
	  THRESHOLDS: { 1: 60, 2: 100, 3: 150 },
	  DEFAULT_THRESHOLD: 60,
	  isVictory: (pontos, raceId) => pontos >= (this.THRESHOLDS[raceId] ?? this.DEFAULT_THRESHOLD),
	  ...
	};
- Alterar musica da cena de `DERROTA`. quando o jogador perde, toca a mesma musica de quando ganha. A musica atual é mais legal para uma vitoria.
- Se o Jogador ficar parado na tela de Vitoria/Derrota o contador continua rodando e jogador ganha gloria (porque quando o timer zera ele ganha 10 de gloria.) A musica de derrota só toca depois que o jogador aperta a barra de espaço.
- 



Atualize o [plano](obsidian://open?vault=summer26&file=Jhonny%2Fplanos%2F001-prototipo-core-loop%2Fcore_loop_corrida%2Ftasks) Para a versão 2 com mais um fase onde vamos corrigir os bugs da implementação e adicionar alguma escalabilidade ao código.