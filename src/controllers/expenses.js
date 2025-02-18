import { pool } from "../config/configDB.js";

const expenses = {
  getExpenses: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM despesas_completas()");
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
      parcelas,   // Número de parcelas informado pelo usuário
      valor,
      cartao_id,
      parcelada,  // Novo campo booleano para saber se a compra é parcelada
    } = req.body;
  
    try {
      // Validação dos campos obrigatórios
      if (!data || !autor || !descricao || !valor || !cartao_id) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" });
      }
  
      // Se a despesa for parcelada, ajusta o número de parcelas
      const numeroParcelas = parcelada ? parcelas : 1; // Se for parcelada, usa o número de parcelas informado, senão, usa 1
      const valorParcela = valor / numeroParcelas; // Divide o valor total pela quantidade de parcelas
  
      const dataInicial = new Date(data);
      const queries = [];
  
      // Se for parcelada, cria as parcelas
      if (parcelada) {
        for (let i = 1; i <= numeroParcelas; i++) {
          const novaData = new Date(dataInicial);
          novaData.setMonth(novaData.getMonth() + (i - 1)); // Avança 1 mês por parcela
  
          const query = pool.query(
            `INSERT INTO despesas (data, autor, descricao, estabelecimento, categoria_id, parcelas, parcela_atual, valor, cartao_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
              novaData,
              autor,
              descricao,
              estabelecimento,
              categoria_id,
              numeroParcelas,
              i, // Número da parcela atual
              valorParcela,
              cartao_id,
            ]
          );
  
          queries.push(query);
        }
      } else {
        // Se não for parcelada, cria uma única parcela
        const query = pool.query(
          `INSERT INTO despesas (data, autor, descricao, estabelecimento, categoria_id, parcelas, parcela_atual, valor, cartao_id) 
           VALUES ($1, $2, $3, $4, $5, $6, 1, $7, $8) RETURNING *`,
          [
            dataInicial,
            autor,
            descricao,
            estabelecimento,
            categoria_id,
            numeroParcelas, // Nesse caso, será 1
            valor,
            cartao_id,
          ]
        );
  
        queries.push(query);
      }
  
      // Executa as queries (caso seja parcelado, vai ser em paralelo para cada parcela)
      const results = await Promise.all(queries);
      res.status(200).json({ message: "Despesa cadastrada", parcelas: results.map(r => r.rows[0]) });
  
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
