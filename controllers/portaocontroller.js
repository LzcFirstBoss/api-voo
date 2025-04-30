const Portao = require('../models/Portao');

module.exports = {
  async create(req, res) {
    try {
      const portao = await Portao.create(req.body);
      res.status(201).json(portao);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async getAll(req, res) {
    const portoes = await Portao.find();
    res.json(portoes);
  },

  async getById(req, res) {
    const portao = await Portao.findById(req.params.id);
    if (!portao) return res.status(404).json({ erro: 'Portão não encontrado' });
    res.json(portao);
  },

  async update(req, res) {
    try {
      const atualizado = await Portao.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!atualizado) return res.status(404).json({ erro: 'Portão não encontrado' });
      res.json(atualizado);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async delete(req, res) {
    const deletado = await Portao.findByIdAndDelete(req.params.id);
    if (!deletado) return res.status(404).json({ erro: 'Portão não encontrado' });
    res.json({ mensagem: 'Portão deletado com sucesso' });
  }
};
