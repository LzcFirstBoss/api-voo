const express = require('express');
const router = express.Router();
const VooController = require('../controllers/voocontroller');

//rota para criar um voo
router.post('/', VooController.create);

//rotas para listar, atualizar e deletar um voo
router.get('/', VooController.getAll);

//rota para listar um voo pelo id
router.get('/:id', VooController.getById);

//rota para atualizar um voo
router.put('/:id', VooController.update);

//rota para deletar um voo
router.delete('/:id', VooController.delete);


router.get('/relatorio/hoje', VooController.relatorioDoDia);

module.exports = router;
