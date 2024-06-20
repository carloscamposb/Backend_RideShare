const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const checkToken = require('../middleware/checkToken');

// Rota para obter dados do usuário por ID
router.get('/:id', checkToken, async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const user = await User.findById(id, '-senha');
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' });
        }
        res.json(user);
    } catch (error) {
        console.error("Erro ao obter dados do usuário:", error);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para obter o nome do usuário por ID
router.get('/:id/nome', checkToken, async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const user = await User.findById(id, 'nome');
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' });
        }
        res.json({ nome: user.nome });
    } catch (error) {
        console.error("Erro ao obter o nome do usuário:", error);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para obter a empresa do usuário por ID
router.get('/:id/empresa', checkToken, async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const user = await User.findById(id, 'empresa');
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' });
        }
        res.json({ empresa: user.empresa });
    } catch (error) {
        console.error("Erro ao obter a empresa do usuário:", error);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para obter o setor do usuário por ID
router.get('/:id/setor', checkToken, async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const user = await User.findById(id, 'setor');
        if (!user) {
            return res.status(404).json({ msg: 'Setor não encontrado!' });
        }
        res.json({ setor: user.setor });
    } catch (error) {
        console.error("Erro ao obter o setor do usuário:", error);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para registro de usuário
router.post('/register', async (req, res) => {
    const {
        nome,
        email,
        confirmarEmail,
        empresa,
        matricula,
        setor,
        logradouro,
        numero,
        bairro,
        cidade,
        uf,
        senha,
        confirmarSenha,
        lembrarSenha
    } = req.body;

    // Validações
    if (!nome || !email || !empresa || !matricula || !setor || !logradouro || !numero || !bairro || !cidade || !uf || !senha || !confirmarSenha) {
        return res.status(422).json({ msg: 'Por favor, preencha todos os campos.' });
    }

    if (email !== confirmarEmail) {
        return res.status(422).json({ msg: 'Os emails não coincidem!' });
    }

    if (senha !== confirmarSenha) {
        return res.status(422).json({ msg: 'As senhas não coincidem!' });
    }

    // Verifica se a matrícula já está cadastrada
    try {
        const userExists = await User.findOne({ matricula });
        if (userExists) {
            return res.status(422).json({ msg: 'Essa matrícula já está cadastrada' });
        }

        // Hash da senha com bcrypt
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // Criação de um novo usuário
        const newUser = new User({
            nome,
            email,
            empresa,
            matricula,
            setor,
            logradouro,
            numero,
            bairro,
            cidade,
            uf,
            senha: hashedPassword,
            lembrarSenha
        });

        // Salva o novo usuário no banco de dados
        await newUser.save();

        // Resposta de sucesso
        res.status(201).json({ msg: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ msg: 'Erro ao processar o registro' });
    }
});


// Rota para login do usuário
router.post('/login', async (req, res) => {
    const { matricula, senha } = req.body;

    if (!matricula) {
        return res.status(422).json({ msg: 'A matrícula é obrigatória' });
    }

    if (!senha) {
        return res.status(422).json({ msg: 'A senha é obrigatória' });
    }

    try {
        const user = await User.findOne({ matricula: matricula });
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        const checkPassword = await bcrypt.compare(senha, user.senha);
        if (!checkPassword) {
            return res.status(422).json({ msg: 'Senha inválida' });
        }

        const secret = process.env.SESSION_SECRET;
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });

        res.status(200).json({ msg: 'Autenticação realizada com sucesso', token, userId: user._id });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

module.exports = router;
