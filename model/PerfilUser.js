const mongoose = require('mongoose');

const PerfilSchema = new mongoose.Schema({
    src: { type: String, required: true },  // Campo para armazenar a URL da foto
  
});

const Perfil = mongoose.model('Perfil', PerfilSchema);

module.exports = Perfil;