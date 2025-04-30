const Passageiro = require('../models/Passageiro');
const Voo = require('../models/Voo');

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}

module.exports = {
  async create(req, res) {
    const { nome, cpf, vooId } = req.body;

    if (!validarCPF(cpf)) {
      return res.status(400).json({ erro: 'CPF inválido' });
    }

    try {
      // Verifica se CPF já existe
      const existe = await Passageiro.findOne({ cpf });
      if (existe) {
        return res.status(400).json({ erro: 'Este CPF já está cadastrado.' });
      }

      // Busca o voo pelo ID
      const voo = await Voo.findById(vooId);
      if (!voo) {
        return res.status(404).json({ erro: 'Voo não encontrado' });
      }

      // Define o status do check-in com base no status do voo
      const statusCheckin = voo.status === 'embarque' ? 'realizado' : 'pendente';

      // Cria o passageiro com status definido
      const passageiro = await Passageiro.create({
        nome,
        cpf,
        vooId,
        statusCheckin
      });

      res.status(201).json(passageiro);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async getAll(req, res) {
    const passageiros = await Passageiro.find().populate('vooId');
    res.json(passageiros);
  },

  async getById(req, res) {
    const passageiro = await Passageiro.findById(req.params.id).populate('vooId');
    if (!passageiro) return res.status(404).json({ erro: 'Passageiro não encontrado' });
    res.json(passageiro);
  },

  async update(req, res) {
    try {
      const atualizado = await Passageiro.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!atualizado) return res.status(404).json({ erro: 'Passageiro não encontrado' });
      res.json(atualizado);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async delete(req, res) {
    const deletado = await Passageiro.findByIdAndDelete(req.params.id);
    if (!deletado) return res.status(404).json({ erro: 'Passageiro não encontrado' });
    res.json({ mensagem: 'Passageiro deletado com sucesso' });
  },

  async listarPorVoo(req, res) {
    const { vooId } = req.params;
  
    try {
      const passageiros = await Passageiro.find({ vooId }).populate('vooId');
  
      res.json({
        vooId,
        quantidade: passageiros.length,
        passageiros: passageiros.map(p => ({
          nome: p.nome,
          cpf: p.cpf,
          statusCheckin: p.statusCheckin
        }))
      });
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },
  async statusSimples(req, res) {
    try {
      const passageiro = await Passageiro.findById(req.params.id);
      if (!passageiro) {
        return res.status(404).json({ erro: 'Passageiro não encontrado' });
      }
  
      res.json({
        nome: passageiro.nome,
        statusCheckin: passageiro.statusCheckin
      });
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }
  
};
