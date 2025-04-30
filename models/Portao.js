const mongoose = require('mongoose');

const portaoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  disponivel: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Portao', portaoSchema);