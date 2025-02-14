import { pool } from "../config/configDB.js";

const cards = {
  getCards: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM cartoes");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao obter cartões" });
    }
  },

  createCard: async (req, res) => {
    const { nome, banco, dia_venc } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO cartoes (nome, banco, dia_venc) VALUES ($1, $2, $3) RETURNING *",
        [nome, banco, dia_venc]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar cartão" });
    }
  },

  updateCard: async (req, res) => {
    const { nome, banco, dia_venc, id } = req.body;
    try {
      const result = await pool.query(
        "UPDATE usuarios SET nome = $1, banco = $2, dia_venc = $3 WHERE id = $4 RETURNING *",
        [nome, banco, dia_venc, id]
      );

      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Cartão não encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar cartão" });
    }
  },

  deleteCard: async (req, res) => {
    const { id } = req.body; 
    try {
      const result = await pool.query(
        "DELETE FROM cartoes WHERE id = $1 RETURNING *",
        [id]
      );
  
      if (result.rows.length > 0) {
        res.status(200).json({ message: "Cartão deletado com sucesso" });
      } else {
        res.status(404).json({ error: "Cartão não encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar cartão" });
    }
  }
  };

export default cards;
