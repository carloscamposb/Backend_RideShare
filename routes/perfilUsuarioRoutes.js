const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PerfilUser = require('../model/PerfilUser');

// Rota para obter dados do perfil
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const perfil = await PerfilUser.findById(id);
        if (!perfil) {
            return res.status(404).json({ msg: 'Perfil não encontrado!' });
        }
        res.json(perfil);
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Registro de perfil
router.post('/register', async (req, res) => {
    const { foto } = req.body;

    if (!foto) {
        return res.status(400).json({ msg: 'Campo obrigatório!' });
    }

    const novoPerfil = new PerfilUser({
        foto,
    });

    try {
        await novoPerfil.save();
        res.status(201).json({ msg: 'Perfil criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para atualizar perfil
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { foto } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        let perfil = await PerfilUser.findById(id);

        if (!perfil) {
            return res.status(404).json({ msg: 'Perfil não encontrado!' });
        }

        // Atualiza os campos do perfil
        perfil.foto = foto;

        await perfil.save();

        res.status(200).json({ msg: 'Perfil atualizado com sucesso!', perfil });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

module.exports = router;
