# Sistema de Usuários - PI-I-ES-2025.2

Aplicação Electron + TypeScript demonstrando uma conexão simples entre Tela (View), Controller, Serviço (Service) e Modelo (Model).

## 🏗️ Arquitetura

Este projeto implementa uma arquitetura em camadas para gerenciamento de usuários:

### 📦 Model (Modelo)
**Localização:** `src/model/User.ts`

Representa a entidade Usuário com a propriedade `name`.

```typescript
class User {
  private name: string;
  
  getName(): string
  setName(name: string): void
}
```

### 🔧 Service (Serviço)
**Localização:** `src/service/UserService.ts`

Gerencia a lógica de negócio e armazenamento dos usuários:
- `createUser(name: string)`: Cria um novo usuário
- `getAllUsers()`: Retorna todos os usuários
- `getUserByName(name: string)`: Busca usuário por nome
- `deleteUser(name: string)`: Remove um usuário

### 🎮 Controller
**Localização:** `src/controller/UserController.ts`

Faz a ponte entre a interface e o serviço:
- `handleCreateUser(name: string)`: Processa criação de usuário com validação
- `handleGetAllUsers()`: Retorna lista de usuários
- `handleGetUserByName(name: string)`: Busca usuário específico
- `handleDeleteUser(name: string)`: Remove usuário

### 🖥️ View (Tela)
**Localização:** `src/ui/renderer.ts` e `src/ui/index.html`

Interface gráfica com:
- Formulário para criar novos usuários
- Lista de usuários cadastrados
- Botões para deletar usuários

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado
- npm ou yarn

### Instalação
```bash
npm install
```

### Build
```bash
npm run build
```

### Executar Aplicação
```bash
npm start
```

### Testar Conexão (Demo)
```bash
node dist/demo.js
```

## 📋 Funcionalidades

✅ Criar usuário com nome  
✅ Listar todos os usuários  
✅ Deletar usuário  
✅ Validação de entrada (nome não pode ser vazio)  
✅ Interface gráfica responsiva  

## 🧪 Demonstração

Execute o arquivo de demonstração para verificar a conexão entre as camadas:

```bash
npm run build && node dist/demo.js
```

Isso vai demonstrar:
1. Criação de múltiplos usuários
2. Listagem de usuários
3. Busca por nome específico
4. Validação de entrada
5. Remoção de usuários

## 📁 Estrutura do Projeto

```
src/
├── model/
│   └── User.ts           # Modelo de dados
├── service/
│   └── UserService.ts    # Lógica de negócio
├── controller/
│   └── UserController.ts # Controlador
├── ui/
│   ├── index.html        # Interface HTML
│   └── renderer.ts       # Lógica da interface
├── main/
│   └── main.ts           # Electron main process
└── demo.ts               # Demonstração da conexão
```

## 🛠️ Tecnologias

- TypeScript
- Electron
- Node.js
