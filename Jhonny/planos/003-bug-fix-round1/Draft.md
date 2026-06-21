

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
- Os assets na cena de Curva está invertido. na tela está certo, as setas, mas o da esquerda está com Risk e o da direita está com safe.
- Valor da % de consiencia está sempre em 0% zerado
- Depois da primeira tentativa, o asset que mostra a % da consiencia desaparece.
- 