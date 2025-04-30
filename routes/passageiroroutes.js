const express = require('express');
const router = express.Router();
const PassageiroController = require('../controllers/passageirocontroller');

//rota para criar passageiro
router.post('/', PassageiroController.create);

//rotas para listar passageiro
router.get('/', PassageiroController.getAll);

//rota para listar passageiro por id
router.get('/:id', PassageiroController.getById);

//rota para atualizar passageiro
router.put('/:id', PassageiroController.update);

router.get('/voo/:vooId', PassageiroController.listarPorVoo);

router.get('/status/:id', PassageiroController.statusSimples);

router.get('/:id', PassageiroController.getById);



module.exports = router;
    