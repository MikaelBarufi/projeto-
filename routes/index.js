const express = require('express');
const router = express.Router();

// Defina suas rotas aqui
router.get('/', (req, res) => {
    res.send('Olá do arquivo de rotas!');
});

module.exports = router;