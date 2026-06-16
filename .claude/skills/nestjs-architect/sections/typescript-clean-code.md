# Regras para Typescript

- Código e documentação sempre em inglês; tipagem explícita para variáveis, parâmetros e retornos; evitar
any, preferir unknown e criar tipos quando necessário.
- Preferir interface para objetos; usar type para uniões/interseções; habilitar strict no tsconfig e usar
utility types e genéricos.
- Convenções: PascalCase para classes/tipos, camelCase para variáveis/funções/métodos, kebab-case para
arquivos/pastas, UPPERCASE para env/constantes; booleanos com verbos (is/has/can); evitar abreviações
salvo API/URL/i/j/err/ctx/req/res/next.
- Funções curtas (<20 instruções), um nível de abstração, iniciando com verbo; evitar aninhamento com early
return, extração para helpers, HOFs; usar arrow functions para callbacks ou funções simples e valores
padrão para parâmetros; reduzir parâmetros/retorno via objetos tipados (RO-RO).
- Dados e classes: evitar primitivos nus; imutabilidade com readonly/as const; validação encapsulada;
classes pequenas (<200 instruções, <10 props/métodos), SOLID, composição > herança; contratos via
interfaces.
- Erros e comentários: exceções só para cenários inesperados ou para adicionar contexto; usar handler
global; comentários explicam “por quê”, não “o quê”; JSDoc em classes e métodos públicos.
- Testes: seguir Arrange–Act–Assert ou Given–When–Then; nomear variáveis de teste como input/mock/actual/
expected.
- Padrões: aplicar Builder/Factory/Repository/Module e DI; preferir async/await, type guards, discriminated
unions, Result types, overloads quando necessário; evitar type assertions desnecessárias e tratar
rejeições de Promise.
