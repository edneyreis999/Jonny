# Instrucoes - Task 1.3: Ativar Plugins no Plugin Manager

## Objetivo
Ativar 3 plugins no Plugin Manager do RPG Maker MZ:
1. TextPicture.js
2. ButtonPicture.js
3. Jhonny_RaceHelper.js

## Passo a Passo

### 1. Abrir o Projeto no MZ Editor
- Abra o RPG Maker MZ
- File > Open Project
- Selecione a pasta: `/Users/edney/projects/coreto/summer26/Jhonny/`

### 2. Abrir Plugin Manager
- Pressione `F10` ou va em Tools > Plugin Manager

### 3. Verificar Plugins Existentes
- Confirme que `TextPicture.js` e `ButtonPicture.js` aparecem na lista
- Eles ja devem estar na pasta `js/plugins/`

### 4. Adicionar Jhonny_RaceHelper.js
- Clique no botao "Add" (ou "Add >")
- Navegue para: `js/plugins/`
- Selecione `Jhonny_RaceHelper.js`
- Clique "Open"

### 5. Ativar os Plugins
- Marque a checkbox ON para cada um dos 3 plugins:
  - TextPicture.js: [ ] → [x]
  - ButtonPicture.js: [ ] → [x]
  - Jhonny_RaceHelper.js: [ ] → [x]

### 6. Configurar Parametro do Jhonny_RaceHelper
- Selecione `Jhonny_RaceHelper.js` na lista
- No campo de parametros, confirme que `EnableDebugLogs` esta marcado como `true`

### 7. Salvar o Projeto
- Pressione `Ctrl+S` (ou File > Save)
- O arquivo `js/plugins.js` sera regenerado automaticamente

### 8. Validacao (Playtest)
- Pressione `F12` para abrir o console
- Execute `Playtest` (botao na toolbar ou F5)
- No console, voce deve ver:
  ```
  [Jhonny_RaceHelper] JhonnyRace helper inicializado.
  ```
- No console, teste:
  ```javascript
  JhonnyRace.rollD100()  // Deve retornar 0..99
  JhonnyRace.rollPCena() // Deve retornar 0, 10, 20, ..., 100
  Input.keyMapper[65]    // Deve retornar "left"
  ```

## Arquivos Modificados
- `js/plugins.js` - Regenerado pelo MZ Editor apos salvar

## Validacao Final da Fase 1
Ao completar esta task:
- [x] Console mostra "[Jhonny_RaceHelper] JhonnyRace helper inicializado."
- [x] F9 (Database Debug) mostra Variables IDs 101-113 nomeados
- [x] F9 (Database Debug) mostra Switches IDs 101-106 nomeados
- [x] Nenhum erro de plugin no console
- [x] window.JhonnyRace acessivel no console
