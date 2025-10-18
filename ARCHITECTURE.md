# Diagrama da Arquitetura e Interface

## Fluxo da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        TELA (VIEW)                           │
│                     src/ui/renderer.ts                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Sistema de Usuários 👤                               │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │ Criar Usuário                                │    │  │
│  │  │ [Digite o nome]  [Criar]                     │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │ Lista de Usuários                            │    │  │
│  │  │ 1. João Silva              [Deletar]         │    │  │
│  │  │ 2. Maria Santos            [Deletar]         │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                       CONTROLLER                             │
│                 src/controller/UserController.ts             │
│                                                              │
│  • handleCreateUser(name: string)                           │
│  • handleGetAllUsers()                                       │
│  • handleGetUserByName(name: string)                        │
│  • handleDeleteUser(name: string)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE (SERVICO)                         │
│                  src/service/UserService.ts                  │
│                                                              │
│  • createUser(name: string): User                           │
│  • getAllUsers(): User[]                                     │
│  • getUserByName(name: string): User | undefined            │
│  • deleteUser(name: string): boolean                        │
│  • users: User[] (armazenamento em memória)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      MODEL (MODELO)                          │
│                      src/model/User.ts                       │
│                                                              │
│  class User {                                                │
│    private name: string                                      │
│                                                              │
│    + getName(): string                                       │
│    + setName(name: string): void                            │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

## Interação do Usuário

### Fluxo de Criação de Usuário:
```
1. Usuário digita nome no input
2. Usuário clica no botão "Criar"
   ↓
3. renderer.ts chama userController.handleCreateUser(name)
   ↓
4. UserController valida o nome
   ↓
5. UserController chama userService.createUser(name)
   ↓
6. UserService cria uma nova instância de User(name)
   ↓
7. UserService adiciona ao array de users
   ↓
8. Retorna o User criado para o Controller
   ↓
9. Controller retorna para a View
   ↓
10. View atualiza a lista de usuários na tela
```

### Fluxo de Deleção de Usuário:
```
1. Usuário clica no botão "Deletar" ao lado de um usuário
   ↓
2. renderer.ts chama userController.handleDeleteUser(name)
   ↓
3. UserController chama userService.deleteUser(name)
   ↓
4. UserService encontra e remove o usuário do array
   ↓
5. Retorna true/false indicando sucesso
   ↓
6. Controller loga o resultado
   ↓
7. View atualiza a lista de usuários na tela
```

## Características da Interface

- **Design Responsivo**: Centralizado com largura máxima de 600px
- **Estilo Moderno**: Bordas arredondadas, sombras suaves
- **Feedback Visual**: Cores diferentes para ações (verde para criar, vermelho para deletar)
- **Validação**: Não permite criar usuários com nome vazio
- **Interatividade**: Enter no input também cria o usuário
- **Lista Dinâmica**: Atualiza automaticamente após criar/deletar
