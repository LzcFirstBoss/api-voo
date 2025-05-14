require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch((err) => console.error('Erro ao conectar:', err));

const rotasPassageiro = require('./routes/passageiroroutes');
const rotasVoo = require('./routes/vooroute');
const rotasPortao = require('./routes/portaoroutes');
const funcionarioRoutes = require('./routes/funcionarioroutes');

// Usa rotas
app.use('/passageiros', rotasPassageiro);
app.use('/voos', rotasVoo);
app.use('/portoes', rotasPortao);
app.use('/funcionarios', funcionarioRoutes);

app.get('/', (req, res) => {
  res.send('API do Aeroporto no ar!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
