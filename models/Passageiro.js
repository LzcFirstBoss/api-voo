const mongoose = require('mongoose');

const passageiroSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{11}$/ // Aceita só 11 dígitos numéricos
  },
  vooId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voo',
    required: true
  },
  statusCheckin: {
    type: String,
    enum: ['pendente', 'realizado'],
    default: 'pendente'
  }
});

module.exports = mongoose.model('Passageiro', passageiroSchema);
