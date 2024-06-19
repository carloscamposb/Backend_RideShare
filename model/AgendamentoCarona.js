const mongoose = require('mongoose');

const AgendamentoCaronaSchema = new mongoose.Schema({
    partida: { type: String, required: true },
    destino: { type: String, required: true },
    data: { type: String, required: true },
    hora: { type: String, required: true },
});

const AgendamentoCarona = mongoose.model('AgendamentoCarona', AgendamentoCaronaSchema);

module.exports = AgendamentoCarona;
