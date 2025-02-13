import { pool } from "../config/configDB.js";

const categories = {
  getCategory: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM categorias");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao obter categorias" });
    }
  },

  createCategory: async (req, res) => {
    const { nome } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO categorias (nome) VALUES ($1) RETURNING *",
        [nome]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar categoria" });
    }
  },

  updateCategory: async (req, res) => {
    const { nome, id } = req.body;
    try {
      const result = await pool.query(
        "UPDATE categorias SET nome = $1, WHERE id = $2 RETURNING *",
        [nome, id]
      );

      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Categoria não encontrada" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
  },

  deleteCategory: async (req, res) => {
    const { id } = req.body;
    try {
      const result = await pool.query(
        "DELETE FROM categorias WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rows.length > 0) {
        res.status(200).json({ message: "Categoria deletada com sucesso" });
      } else {
        res.status(404).json({ error: "Usuário não encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar categoria" });
    }
  },
};

export default categories;
