const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('../config/multer');
const User = require('../model/User');
const checkToken = require('../middleware/checkToken');

// Rota para obter dados do usuário
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

// Rota para obter o nome do usuário
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

// Rota para obter a empresa do usuário
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

// Rota para obter o setor do usuário
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



// Rota para atualizar a foto do documento
router.put('/:id/docFoto', upload.single('docFoto'), async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    // Verifica se foi enviado um arquivo
    if (!req.file) {
        return res.status(400).json({ msg: 'Arquivo de foto do documento não enviado!' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' });
        }

        // Remove o arquivo antigo se existir
        if (user.docFoto) {
            fs.unlink(user.docFoto)
                .catch(err => console.error("Erro ao excluir arquivo de foto do documento antigo:", err));
        }

        // Atualiza o caminho da foto do documento
        user.docFoto = req.file.path;

        // Salva as alterações no banco de dados
        await user.save();

        res.json({ msg: 'Foto do documento atualizada com sucesso!', userId: user._id });
    } catch (error) {
        console.error("Erro ao atualizar foto do documento:", error);
        fs.unlink(req.file.path)
            .catch(err => console.error("Erro ao excluir arquivo de foto do documento:", err));
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para registro de usuário
router.post('/register', upload.single('docFoto'), async (req, res) => {
    try {
      // Dados do formulário
      const { nome, email, empresa, matricula, logradouro, numero, bairro, cidade, uf, senha, confirmSenha } = req.body;
  
      // Verifica se todos os campos obrigatórios estão presentes
      if (!nome || !email || !empresa || !matricula || !logradouro || !numero || !bairro || !cidade || !uf || !senha || !confirmSenha || !req.file) {
        return res.status(400).json({ msg: 'Por favor, preencha todos os campos e envie a foto do documento.' });
      }
  
      // Processo adicional para salvar no MongoDB ou outro armazenamento
      const filePath = req.file.path;
      // Lógica para salvar no banco de dados ou processamento adicional
  
      res.status(200).json({ msg: 'Usuário registrado com sucesso!', filePath });
    } catch (err) {
      console.error('Erro no registro:', err);
      res.status(500).json({ msg: 'Erro ao processar o registro' });
    }
  });

// Login do usuário
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
