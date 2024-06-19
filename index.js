require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const userMotoristaRoutes = require('./routes/userMotoristasRoutes');
const agendamentoCaronaRoutes = require('./routes/agendamentoCaronaRoutes');
const agendamentoMotoristaRoutes = require('./routes/agendamentoMotoristaRoutes');
const perfilUsuarioRoutes = require('./routes/perfilUsuarioRoutes');

const app = express();
app.use(express.json());

// Adicione cabeçalho CORS para permitir solicitações de qualquer origem
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Credenciais
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;


// Rota pública
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Aproveite nossa API" });
});

// Conexão com MongoDB
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.obonjsz.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000, () => {
            console.log('Servidor rodando na porta 3000 e banco de dados conectado!');
        });
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados', err);
    });

// Rotas
app.use('/user', userRoutes);
app.use('/userMotorista', userMotoristaRoutes);
app.use('/agendamento', agendamentoCaronaRoutes);
app.use('/agendamentoMotorista', agendamentoMotoristaRoutes);
app.use('/perfilUser', perfilUsuarioRoutes);
