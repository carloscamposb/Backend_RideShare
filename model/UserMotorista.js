const mongoose = require('mongoose');

const UserMotoristaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    confirmarEmail: { type: String },
    empresa: { type: String, required: true },
    matricula: { type: String, required: true },
    setor: { type: String, required: true },
    logradouro: { type: String, required: true },
    numero: { type: String, required: true },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    uf: { type: String, required: true },
    senha: { type: String, required: true },
    confirmarSenha: { type: String },
    placa: { type: String, required: true },
    cor: { type: String, required: true },
    modelo: { type: String, required: true },
   

});

const UserMotorista = mongoose.model('UserMotorista', UserMotoristaSchema);

module.exports = UserMotorista;
