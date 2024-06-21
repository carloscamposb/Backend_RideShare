const mongoose = require('mongoose');

const AgendamentoMotoristaSchema = new mongoose.Schema({
    empresa: { type: String, required: true },
    data: { type: String, required: true },
    hora: { type: String, required: true },
    vagas: { type: Number, required: true },
});

const AgendamentoMotorista = mongoose.model('AgendamentoMotorista', AgendamentoMotoristaSchema);

module.exports = AgendamentoMotorista;
