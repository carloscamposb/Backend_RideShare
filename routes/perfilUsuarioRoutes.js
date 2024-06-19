const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const PerfilUser = require('../model/PerfilUser');
const upload = require('../config/multer');

// Rota para dados do perfil
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
        console.error(`[ERROR] Erro ao obter perfil: ${error}`);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Registro de perfil
router.post('/register', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'Arquivo não enviado!' });
    }

    const novoPerfil = new PerfilUser({
        src: req.file.path,
    });

    try {
        await novoPerfil.save();
        console.log(`[DEBUG] Novo perfil criado com caminho: ${req.file.path}`);
        res.status(201).json({ msg: 'Perfil criado com sucesso!', perfil: novoPerfil });
    } catch (error) {
        console.error(`[ERROR] Erro ao salvar perfil: ${error}`);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para atualizar perfil
router.put('/:id', upload.single('file'), async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        let perfil = await PerfilUser.findById(id);

        if (!perfil) {
            return res.status(404).json({ msg: 'Perfil não encontrado!' });
        }

        // Deleta imagem antiga caso um novo arquivo for enviado 
        if (req.file) {
            const oldPath = perfil.src;
            perfil.src = req.file.path;
            fs.unlink(oldPath, (err) => {
                if (err) {
                    console.error(`[ERROR] Erro ao deletar arquivo antigo: ${err}`);
                } else {
                    console.log(`[DEBUG] Arquivo antigo deletado: ${oldPath}`);
                }
            });
            console.log(`[DEBUG] Perfil atualizado com novo caminho: ${req.file.path}`);
        }

        await perfil.save();

        res.status(200).json({ msg: 'Perfil atualizado com sucesso!', perfil });
    } catch (error) {
        console.error(`[ERROR] Erro ao atualizar perfil: ${error}`);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

module.exports = router;
