# Solucao de Otimizacao dos Dialogos do Map013

Baseado na leitura do `Map013` (`Estrada_VN3`), a melhor estrategia nao e
trocar toda a estrutura por `goto` nem transformar tudo em Common Event.
O melhor desenho e um modelo hibrido:

1. manter a navegacao principal no proprio mapa, com `Label` e retorno para um
   menu central;
2. extrair para Common Events apenas os blocos repetidos de fala/acao;
3. separar claramente os grupos que apenas continuam a conversa dos grupos que
   encerram a cena ou desviam para outra rota.

## O Que A Analise Mostrou

- O mapa tem 446 grupos de escolhas e apenas 12 grupos unicos recorrentes.
- A repeticao nao esta só no texto, mas na estrutura inteira da arvore.
- Existem grupos que:
  - avancam a conversa e voltam para a mesma “pergunta de contexto”;
  - fazem o jogador circular por subtopicos antes da decisao final;
  - encerram a cena em `Map006` ou levam ao desfecho `FIM_FALSE`.
- A liberdade do jogador de explorar opcoes antes de decidir precisa ser
  preservada. Portanto, a otimizacao precisa evitar uma arvore linear rigida.

## Solucao Recomendada

### 1. Criar Um Menu Central De Conversa

O `Map013` deve ter um ponto de entrada claro, com um menu principal do tipo:

- corrida;
- bebida;
- Curva do Diabo;
- relacao/Chance;
- decisao final.

Depois de cada subtema, o fluxo deve voltar para esse menu central enquanto a
decisao final nao for tomada.

Isso reduz duplicacao porque o jogador deixa de cair em cadeias repetidas de
`Show Text -> Show Choices -> Show Text -> Show Choices` espalhadas pelo mapa.

### 2. Usar Common Events Para Blocos Repetidos

Os Common Events devem guardar os trechos que se repetem com a mesma funcao
narrativa:

- abertura de fala do Jonny;
- reacao curta do jogador;
- transicao de busto/expressao;
- bloco de encerramento para rotas que saem da cena.

Exemplo de particionamento:

- `CE_Fala_Jonny_Base`
- `CE_Reacao_Posicao`
- `CE_Subtema_Corrida`
- `CE_Subtema_Bebida`
- `CE_Subtema_Curva`
- `CE_Encerramento_False`
- `CE_Encerramento_Sabotagem`

O mapa continua dono da navegação. O Common Event fica dono do trecho
reutilizavel.

### 3. Manter Labels Apenas Dentro Do Mesmo Mapa

`Label` e `Jump to Label` servem para retorno interno ao menu central do
`Map013`, nao para atravessar Common Events.

Use assim:

- `VN3_MENU`
- `VN3_SUB_CORRIDA`
- `VN3_SUB_BEBIDA`
- `VN3_SUB_CURVA`
- `VN3_DECISAO_FINAL`

Depois de cada bloco, o fluxo volta para `VN3_MENU` enquanto a escolha ainda
nao for terminal.

### 4. Diferenciar Três Tipos De Grupo

Para o refactor nao quebrar a feature, cada grupo precisa ser classificado em
uma destas tres categorias:

- `loop`: responde, mostra mais contexto e volta ao menu;
- `advance`: responde, abre um subgrupo novo e continua a conversa;
- `exit`: leva para `Map006`, `Map001` ou termina a cena.

Essa classificacao evita que um ramo que hoje e terminal seja movido por engano
para uma rotina reutilizavel.

## Estrutura Pratica Proposta

Fluxo alto nível:

```text
Map013
  -> Label VN3_MENU
  -> Show Choices
     -> Common Event de fala
     -> Jump VN3_MENU
  -> quando houver decisão final:
     -> Common Event de encerramento
     -> Transfer Player
     -> Exit Event Processing
```

## O Que Eu Nao Recomendo

- Nao transformar todo o branching em Common Event.
  - Isso dificulta a leitura do fluxo e não resolve o problema do menu de
    retorno.
- Nao usar `Jump to Label` entre eventos diferentes.
  - O engine procura labels dentro da mesma lista de comandos.
- Nao “compactar” a arvore final de uma vez.
  - Alguns ramos so parecem repetidos, mas na pratica carregam um desvio
    terminal diferente.

## Ordem Segura De Refatoracao

1. Mapear os 12 grupos unicos em uma tabela de rotas.
2. Marcar cada grupo como `loop`, `advance` ou `exit`.
3. Extrair os blocos textuais mais repetidos para Common Events.
4. Reorganizar o `Map013` para voltar ao menu central apos cada subtema.
5. Preservar os ramos terminais para `Map006`, `Map001` e `FIM_FALSE`.
6. Validar em Playtest que o jogador ainda pode navegar livremente antes da
   decisao final.

## Resultado Esperado

- menos duplicacao de comandos no `Map013`;
- leitura mais simples do fluxo;
- manutencao mais facil dos textos repetidos;
- mesma liberdade para o jogador explorar os topicos antes de decidir;
- risco menor de quebrar uma rota terminal.

## Resumo

A solucao correta e uma arquitetura hibrida:

- `Label` no mapa para navegação de ida e volta;
- `Common Events` para reutilizar fala e transicoes;
- classificacao clara dos grupos como `loop`, `advance` ou `exit`.

Esse desenho reduz o tamanho do `Map013` sem destruir a experiencia de
“o jogador pode navegar pelos dialogos o quanto quiser antes de tomar uma
decisao”.
