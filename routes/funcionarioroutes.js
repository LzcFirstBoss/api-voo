const express = require('express');
const router = express.Router();
const FuncionarioController = require('../controllers/funcionariocontroller');

router.post('/', FuncionarioController.create);

router.post('/login', FuncionarioController.login);

module.exports = router;
