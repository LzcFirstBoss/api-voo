const express = require('express');
const router = express.Router();
const PortaoController = require('../controllers/portaocontroller');

//Rota para GET
router.post('/', PortaoController.create);

//Rota para POST
router.get('/', PortaoController.getAll);
 
//Rota para GET por ID
router.get('/:id', PortaoController.getById);

//Rota para PUT
router.put('/:id', PortaoController.update);

//Rota para DELETE
router.delete('/:id', PortaoController.delete);

module.exports = router;
