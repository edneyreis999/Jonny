# Text Speed Option Settings

Plugin Parameters > Text Speed Option Settings. Adiciona uma opcao de velocidade de texto ao menu Options do jogo, permitindo ao jogador controlar a velocidade de exibicao dos caracteres.

---

## Parametros

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| Add Option? | Boolean | Se ON, adiciona o comando "Text Speed" ao menu Options do jogo |
| Adjust Window Height | Boolean | Se ON, ajusta automaticamente a altura da options window para acomodar o novo comando |
| Option Name | String | Nome do comando exibido no menu (ex: "Velocidade do Texto", "Text Speed") |
| Default Value | Number | Valor padrao da velocidade. Range: 1 a 10 (lento a rapido). Valor 11 = instantaneo |
| Instant Speed | String | Texto exibido para indicar velocidade instantanea quando o jogador seleciona o valor maximo |

---

## Escala de Velocidade

O valor de Text Speed define o delay entre caracteres na message window.

| Valor | Comportamento |
|-------|---------------|
| 1 | Mais lento possivel |
| 5 | Velocidade media |
| 10 | Mais rapido possivel |
| 11 | Instantaneo (sem delay) |

### Interacao com Text Delay

O parametro **Text Delay** em General Settings define o delay base em frames entre caracteres. O Text Speed option do jogador modifica esse comportamento:

- Text Delay = 0 no General Settings significa instantaneo, independentemente do Text Speed
- Valores maiores de Text Speed reduzem o delay efetivo por caractere

---

## Instant Speed

O campo **Instant Speed** define o texto que aparece no menu Options quando o jogador seleciona a velocidade maxima (valor 11). Isso permite mostrar "Instant" ou "Instantaneo" em vez do numero "11".

### Exemplo de Configuracao

- Option Name: `Velocidade do Texto`
- Default Value: `5`
- Instant Speed: `Instantaneo`

### Fluxo do Jogador

1. Jogador abre o menu Options
2. Ve o comando "Velocidade do Texto"
3. Navega entre valores 1-10 (lento a rapido)
4. Ao passar de 10, ve "Instantaneo" em vez de "11"
5. Seleciona e o novo speed e aplicado imediatamente

---

## Notas

- Se Add Option? estiver OFF, o Default Value e usado como velocidade fixa
- Adjust Window Height evita que o comando fique fora da tela visivel
- O Instant Speed e puramente visual no menu -- o comportamento e o mesmo de speed 11
