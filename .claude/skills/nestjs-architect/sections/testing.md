# Testes Rápidos

- Domínio: testes unitários de aggregates e VOs sem Nest.
- Use cases: mocks/fakes de repositórios; validar notification.
- Controllers: integração via TestingModule com providers reais/fakes.
- Fakes/builders: gere objetos válidos rapidamente (use skill `fakebuilder-generator`).
- Meta de cobertura: ≥80%.
Utilize a biblioteca jest para determinar os cenários de teste e as expectativas e sinon para implementar test patterns como stub, spy e mock
- Todos os testes devem ficar dentro da pasta __tests__ junto com os arquivos que estão sendo testados
- Os testes devem ter a extensão .spec.ts
- Não crie dependência entre os testes, deve ser possível rodar cada um deles de forma independente
- Siga o princípio Arrange, Act, Assert ou Given, When, Then para garantir o máximo de organização e legibilidade dentro dos testes
- Se estiver testando algum comportamento que depende de um Date, e isso for importante para o que estiver sendo testado, utilize um Mock para garantir que o teste seja repetível
- Se um teste depender de recursos externos como requisições HTTP, banco de dados, mensageria, sistema de arquivos ou API devem ficar na pasta /test separado por dominio.
- Crie testes para os endpoints HTTP, devem utilizar a biblioteca supertest e devem ser de integração. Além disso, crie esses testes somente para garantir o funcionamento do fluxo principal e alternativo (explorando principalmente os status code e a mensagem de erro), deixando a variação de testes de regras de negócio para os testes sobre os use cases
- Crie testes para todos os use cases, nesse caso, teste sempre os fluxos principais e pelo menos um fluxo alternativo, que lance exceptions. Utilize o test pattern stub para evitar utilizar APIs externas nesse nível de teste.
- Crie testes para todos o domain, teste todas as possibilidades de regras, todas as variações possíveis, sempre no nível de unidade, sem depender de nenhum recurso externo
- Foque em testar um comportamento por teste, evite escrever testes muito grandes
- Garanta que o código que está sendo escrito esteja totalmente coberto por testes
- Crie expectativas consistentes, garantindo que tudo que estiver sendo testado está de fato sendo conferido
- Sempre encerre conexões com o banco de dados ou plataformas de mensageria depois de executar os testes
- Utilize beforeEach para inicializar
- Crie testes para cada controller e para cada service.
- Crie testes end-to-end para cada módulo de API.
- Cubra cada função pública com teste unitário; use test doubles exceto quando a dependência for barata.
- Ao corrigir bugs, escreva o teste antes; inclua casos de borda e de erro.
