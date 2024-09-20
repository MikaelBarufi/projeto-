// Importa as bibliotecas necessárias
const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Cria uma instância do Express


// Middleware para permitir o uso de JSON nas requisições
app.use(express.json());

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Verifica a conexão com o banco de dados
pool.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados', err);
  } else {
    console.log('Conectado ao banco de dados');
  }
});

// Defina a porta em que o servidor vai rodar
const PORT = process.env.PORT || 3000
;

// Inicia o servidor


module.exports = { app, pool };

app.post('/add-tool', async (req, res) => {
    const { nome, quantidade, local } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO ferramentas (nome, quantidade, local) VALUES ($1, $2, $3) RETURNING *',
        [nome, quantidade, local]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao adicionar ferramenta' });
    }
  });

  // Remove uma ferramenta do estoque
app.delete('/remove-tool/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM ferramentas WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Ferramenta não encontrada' });
      }
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao remover ferramenta' });
    }
  });

  // Transfere uma ferramenta para uso
app.post('/use-tool', async (req, res) => {
    const { ferramenta_id, funcionario_id, obra_id } = req.body;
  
    try {
      // Atualiza a tabela "ferramentas" para indicar que a ferramenta está em uso
      const result = await pool.query(
        'UPDATE ferramentas SET local = $1 WHERE id = $2 RETURNING *',
        ['Em uso', ferramenta_id]
      );
  
      // Insere uma nova entrada na tabela "uso_ferramentas" para registrar o uso
      const usoResult = await pool.query(
        'INSERT INTO uso_ferramentas (ferramenta_id, funcionario_id, obra_id) VALUES ($1, $2, $3) RETURNING *',
        [ferramenta_id, funcionario_id, obra_id]
      );
  
      res.status(201).json({ ferramenta: result.rows[0], uso: usoResult.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao transferir ferramenta para uso' });
    }
  });

  
  
  const toolRoutes = require('./routes'); // Importar as rotas
  
  app.use(express.json()); // Para processar JSON no corpo das requisições
  app.use('/api', toolRoutes); // Prefixo para as rotas
  
  app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
  });

  app.post('/addTool', (req, res) => {
    const { name, quantity } = req.body;
    pool.query('INSERT INTO ferramentas (nome, quantidade, status) VALUES ($1, $2, $3)', [name, quantity, 'guardada'], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).json({ status: 'success', message: 'Ferramenta adicionada.' });
    });
});

// Rota para remover ferramenta
app.post('/removeTool', (req, res) => {
    const { id } = req.body;
    pool.query('DELETE FROM ferramentas WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json({ status: 'success', message: 'Ferramenta removida.' });
    });
});

// Rota para registrar o uso de uma ferramenta
app.post('/useTool', (req, res) => {
    const { id, employee, location } = req.body;
    pool.query('UPDATE ferramentas SET status = $1, funcionario = $2, obra = $3 WHERE id = $4', ['em uso', employee, location, id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json({ status: 'success', message: 'Uso da ferramenta registrado.' });
    });
});

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Definindo a rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
