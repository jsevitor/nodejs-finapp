import { pool } from "../config/configDB.js";

const expenses = {
  getExpenses: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM despesas");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao obter despesas" });
    }
  },

  createExpense: async (req, res) => {
    const {
      data,
      autor,
      descricao,
      estabelecimento,
      categoria_id,
      parcelas,
      parcela_atual,
      valor,
      cartao_id,
    } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO despesas (data, autor, descricao, estabelecimento, categoria_id, parcelas, parcela_atual, valor, cartao_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [
          data,
          autor,
          descricao,
          estabelecimento,
          categoria_id,
          parcelas,
          parcela_atual,
          valor,
          cartao_id,
        ]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar despesa" });
    }
  },

  updateExpense: async (req, res) => {
    const {
      data,
      autor,
      descricao,
      estabelecimento,
      parcelas,
      parcela_atual,
      valor,
      id,
    } = req.body;
    try {
      const result = await pool.query(
        "UPDATE despesas SET data = $1, autor = $2, descricao = $3, estabelecimento = $4, parcelas = $5, parcela_atual = $6, valor = $7  WHERE id = $8 RETURNING *",
        [
          data,
          autor,
          descricao,
          estabelecimento,
          parcelas,
          parcela_atual,
          valor,
          id,
        ]
      );

      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Despesas não encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar despesa" });
    }
  },

  deleteExpense: async (req, res) => {
    const { id } = req.body;
    try {
      const result = await pool.query(
        "DELETE FROM despesas WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rows.length > 0) {
        res.status(200).json({ message: "Despesa deletada com sucesso" });
      } else {
        res.status(404).json({ error: "Despesa não encontrada" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar despesa" });
    }
  },
};

export default expenses;
