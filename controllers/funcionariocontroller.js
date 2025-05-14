const Funcionario = require('../models/funcionarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  async create(req, res) {
    try {
      const { nome, email, senha, cargo } = req.body;

      // Verifica se já existe um funcionário com o mesmo e-mail
      const existente = await Funcionario.findOne({ email });
      if (existente) {
        return res.status(400).json({ erro: 'Já existe um funcionário com este e-mail.' });
      }

      // Gera o hash da senha
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);

      // Cria o funcionário com a senha criptografada
      const novoFuncionario = await Funcionario.create({
        nome,
        email,
        senha: senhaHash,
        cargo
      });

      res.status(201).json({
        _id: novoFuncionario._id,
        nome: novoFuncionario.nome,
        email: novoFuncionario.email,
        cargo: novoFuncionario.cargo
      });
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async login(req, res) {
    const { email, senha } = req.body;

    try {
      const funcionario = await Funcionario.findOne({ email });
      if (!funcionario) {
        return res.status(404).json({ erro: 'Funcionário não encontrado.' });
      }

      const senhaCorreta = await bcrypt.compare(senha, funcionario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Usuario ou senha incorreto' });
      }

      const token = jwt.sign(
        {
          _id: funcionario._id,
          nome: funcionario.nome,
          cargo: funcionario.cargo
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (err) {
      res.status(500).json({ erro: 'Erro interno no login.' });
    }
  }
};
