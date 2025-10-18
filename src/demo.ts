import { UserController } from "./controller/UserController";

/**
 * Simple demonstration of the Model-Service-Controller connection
 * Run this with: node dist/demo.js (after building)
 */

console.log("=== Demonstração do Sistema de Usuários ===\n");

// Create controller instance
const controller = new UserController();

// Test 1: Create users
console.log("1. Criando usuários:");
const user1 = controller.handleCreateUser("João Silva");
const user2 = controller.handleCreateUser("Maria Santos");
const user3 = controller.handleCreateUser("Pedro Oliveira");
console.log(`   ✓ ${user1?.getName()}`);
console.log(`   ✓ ${user2?.getName()}`);
console.log(`   ✓ ${user3?.getName()}`);
console.log();

// Test 2: List all users
console.log("2. Listando todos os usuários:");
const allUsers = controller.handleGetAllUsers();
allUsers.forEach((user, index) => {
  console.log(`   ${index + 1}. ${user.getName()}`);
});
console.log();

// Test 3: Get user by name
console.log("3. Buscando usuário específico:");
const foundUser = controller.handleGetUserByName("Maria Santos");
if (foundUser) {
  console.log(`   ✓ Encontrado: ${foundUser.getName()}`);
}
console.log();

// Test 4: Try to create user with empty name
console.log("4. Tentando criar usuário com nome vazio:");
const invalidUser = controller.handleCreateUser("");
console.log(`   ${!invalidUser ? '✓ Validação funcionou' : '✗ Falhou'}`);
console.log();

// Test 5: Delete a user
console.log("5. Deletando um usuário:");
const deleted = controller.handleDeleteUser("Pedro Oliveira");
console.log(`   ${deleted ? '✓' : '✗'} Pedro Oliveira deletado`);
console.log();

// Test 6: List users after deletion
console.log("6. Listando usuários após deleção:");
const remainingUsers = controller.handleGetAllUsers();
remainingUsers.forEach((user, index) => {
  console.log(`   ${index + 1}. ${user.getName()}`);
});
console.log();

console.log("=== Demonstração concluída com sucesso! ===");
