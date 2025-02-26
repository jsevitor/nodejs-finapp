import express from "express";
import users from "../controllers/users.js";
import categories from "../controllers/categories.js";
import cards from "../controllers/cards.js";
import incomes from "../controllers/incomes.js";
import expenses from "../controllers/expenses.js";

const router = express.Router();

// Rotas de Usuários
router.get("/usuarios", users.getUsers);
router.post("/usuarios", users.createUser);
router.put("/usuarios", users.updateUser);
router.delete("/usuarios", users.deleteUser);

// Rotas de Categorias
router.get("/categorias", categories.getCategory);
router.post("/categorias", categories.createCategory);
router.put("/categorias", categories.updateCategory);
router.delete("/categorias", categories.deleteCategory);

// Rotas de Cartões
router.get("/cartoes", cards.getCards);
router.post("/cartoes", cards.createCard);  
router.put("/cartoes", cards.updateCard);   
router.delete("/cartoes", cards.deleteCard); 

// Rotas de Receitas
router.get("/receitas", incomes.getIncomes);
router.post("/receitas", incomes.createIncome);
router.put("/receitas", incomes.updateIncome);
router.delete("/receitas", incomes.deleteIncome);

// Rotas de Despesas
router.get("/despesas", expenses.getExpenses);
router.post("/despesas", expenses.createExpense);
router.put("/despesas", expenses.updateExpense);
router.delete("/despesas", expenses.deleteExpense);

export default router;
