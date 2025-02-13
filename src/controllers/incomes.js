import { pool } from "../config/configDB.js";

const incomes = {
  getIncomes: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM receitas");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao obter receitas" });
    }
  },

  createIncome: async (req, res) => {
    const { data, descricao, valor } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO receitas (data, descricao, valor) VALUES ($1, $2, $3) RETURNING *",
        [data, descricao, valor]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar receita" });
    }
  },

  updateIncome: async (req, res) => {
    const { data, descricao, valor, id } = req.body;
    try {
      const result = await pool.query(
        "UPDATE receitas SET data = $1, descricao = $2, valor = $3 WHERE id = $4 RETURNING *",
        [data, descricao, valor, id]
      );

      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Receita não encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar receita" });
    }
  },

  deleteIncome: async (req, res) => {
    const { id } = req.body;
    try {
      const result = await pool.query(
        "DELETE FROM receitas WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rows.length > 0) {
        res.status(200).json({ message: "Receita deletado com sucesso" });
      } else {
        res.status(404).json({ error: "Receita não encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar receita" });
    }
  },
};

export default incomes;
