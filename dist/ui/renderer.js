"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("../controller/UserController");
console.log("Renderer process iniciado!");
// Initialize the controller
const userController = new UserController_1.UserController();
// Create the UI
document.body.innerHTML = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
    <h1>Sistema de Usuários 👤</h1>
    
    <div style="margin-bottom: 20px; padding: 20px; background-color: #f0f0f0; border-radius: 8px;">
      <h2>Criar Usuário</h2>
      <input 
        type="text" 
        id="userName" 
        placeholder="Digite o nome do usuário"
        style="padding: 10px; width: 70%; margin-right: 10px; border: 1px solid #ccc; border-radius: 4px;"
      />
      <button 
        id="createUserBtn"
        style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        Criar
      </button>
    </div>

    <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
      <h2>Lista de Usuários</h2>
      <div id="userList" style="margin-top: 10px;"></div>
    </div>
  </div>
`;
// Function to render the user list
function renderUserList() {
    const users = userController.handleGetAllUsers();
    const userListElement = document.getElementById("userList");
    if (!userListElement)
        return;
    if (users.length === 0) {
        userListElement.innerHTML = "<p style='color: #666;'>Nenhum usuário cadastrado.</p>";
        return;
    }
    userListElement.innerHTML = users
        .map((user, index) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 5px 0; background-color: white; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <span style="font-size: 16px;">
            <strong>${index + 1}.</strong> ${user.getName()}
          </span>
          <button 
            class="deleteBtn" 
            data-name="${user.getName()}"
            style="padding: 5px 15px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            Deletar
          </button>
        </div>
      `)
        .join("");
    // Add event listeners to delete buttons
    document.querySelectorAll(".deleteBtn").forEach((button) => {
        button.addEventListener("click", (e) => {
            const target = e.target;
            const userName = target.getAttribute("data-name");
            if (userName) {
                userController.handleDeleteUser(userName);
                renderUserList();
            }
        });
    });
}
// Event listener for creating a user
const createUserBtn = document.getElementById("createUserBtn");
const userNameInput = document.getElementById("userName");
if (createUserBtn && userNameInput) {
    createUserBtn.addEventListener("click", () => {
        const name = userNameInput.value;
        const user = userController.handleCreateUser(name);
        if (user) {
            userNameInput.value = ""; // Clear the input
            renderUserList();
        }
        else {
            alert("Por favor, digite um nome válido!");
        }
    });
    // Allow pressing Enter to create a user
    userNameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            createUserBtn.click();
        }
    });
}
// Initial render
renderUserList();
