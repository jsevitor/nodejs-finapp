import { pool } from "../config/configDB.js";

const users = {
  getUsers: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM usuarios");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao obter usuários" });
    }
  },

  createUser: async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
        [nome, email, senha]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  },

  updateUser: async (req, res) => {
    const { nome, email, senha, id } = req.body;
    try {
      const result = await pool.query(
        "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *",
        [nome, email, senha, id]
      );

      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Usuário não encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.body;
    try {
      const result = await pool.query(
        "DELETE FROM usuarios WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rows.length > 0) {
        res.status(200).json({ message: "Usuário deletado com sucesso" });
      } else {
        res.status(404).json({ error: "Usuário não encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar usuário" });
    }
  },
};

export default users;
