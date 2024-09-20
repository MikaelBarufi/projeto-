// Importa as bibliotecas necessárias
const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Cria uma instância do Express
const app = express();

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

// Rotas de API
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

app.post('/use-tool', async (req, res) => {
  const { ferramenta_id, funcionario_id, obra_id } = req.body;

  try {
    const result = await pool.query(
      'UPDATE ferramentas SET local = $1 WHERE id = $2 RETURNING *',
      ['Em uso', ferramenta_id]
    );

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

// Servir arquivos estáticos do diretório "public"
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = { app, pool };