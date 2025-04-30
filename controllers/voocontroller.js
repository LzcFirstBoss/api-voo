const Voo = require('../models/Voo');
const Portao = require('../models/Portao');
const Passageiro = require('../models/Passageiro');

module.exports = {
  async create(req, res) {
    try {
      const { numeroVoo, origem, destino, dataHoraPartida, portaoId } = req.body;

      // Validação: já existe um voo com esse portão?
      const vooExistente = await Voo.findOne({ portaoId });

      if (vooExistente) {
        return res.status(400).json({
          erro: 'Já existe um voo usando este portão. Cada portão só pode estar associado a um voo.'
        });
      }

      // Cria o voo
      const voo = await Voo.create({ numeroVoo, origem, destino, dataHoraPartida, portaoId });

      // Marca o portão como disponível
      const resultado = await Portao.findByIdAndUpdate(portaoId, { disponivel: true });

      res.status(201).json({
        voo,
        portaoAtualizado: !!resultado,
        mensagem: resultado ? 'Portão marcado como disponível.' : 'Portão não encontrado.'
      });

    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const voos = await Voo.find().populate('portaoId');
      res.json(voos);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },

  async getById(req, res) {
    try {
      const voo = await Voo.findById(req.params.id).populate('portaoId');
      if (!voo) return res.status(404).json({ erro: 'Voo não encontrado' });
      res.json(voo);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async update(req, res) {
    try {
      const atualizado = await Voo.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!atualizado) return res.status(404).json({ erro: 'Voo não encontrado' });
      res.json(atualizado);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async delete(req, res) {
    try {
      const deletado = await Voo.findByIdAndDelete(req.params.id);
      if (!deletado) return res.status(404).json({ erro: 'Voo não encontrado' });
      res.json({ mensagem: 'Voo deletado com sucesso' });
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async relatorioDoDia(req, res) {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    // Busca voos com status programado e data de hoje
    const voos = await Voo.find({
      status: 'programado',
      dataHoraPartida: { $gte: hoje, $lt: amanha }
    }).populate('portaoId');

    const relatorio = [];

    for (const voo of voos) {
      const passageiros = await Passageiro.find({ vooId: voo._id });

      relatorio.push({
        numeroVoo: voo.numeroVoo,
        origem: voo.origem,
        destino: voo.destino,
        dataHoraPartida: voo.dataHoraPartida,
        status: voo.status,
        portao: voo.portaoId?.codigo || 'Sem portão',
        passageiros: passageiros.map(p => ({
          nome: p.nome,
          cpf: p.cpf,
          statusCheckin: p.statusCheckin
        }))
      });
    }

    res.json({ data: hoje.toISOString().split('T')[0], voos: relatorio });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

};
