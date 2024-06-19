const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const upload = require('../config/multer'); 
const UserMotorista = require('../model/UserMotorista'); 
const CheckTokenM = require('../middleware/checkToken'); 


// Rota para  dados do usuário
router.get('/:id', CheckTokenM, async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const userMotorista = await UserMotorista.findById(id, '-senha');
        if (!userMotorista) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' });
        }
        res.json(userMotorista);
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para  nome do usuário
router.get('/:id/nome', CheckTokenM, async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const userMotorista = await UserMotorista.findById(id, 'nome');
        if (!userMotorista) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' });
        }
        res.json({ nome: userMotorista.nome });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para  empresa do usuário
router.get('/:id/empresa', CheckTokenM, async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const userMotorista = await UserMotorista.findById(id, 'empresa');
        if (!userMotorista) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' });
        }
        res.json({ empresa: userMotorista.empresa });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para setor do usuário
router.get('/:id/setor', CheckTokenM, async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const userMotorista = await UserMotorista.findById(id, 'setor');
        if (!userMotorista) {
            return res.status(404).json({ msg: 'Setor não encontrado!' });
        }
        res.json({ setor: userMotorista.setor });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para  placa, cor e modelo do veículo do usuário
router.get('/:id/infos', CheckTokenM, async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const userMotorista = await UserMotorista.findById(id, 'placa cor modelo');
        if (!userMotorista) {
            return res.status(404).json({ msg: 'Busca não encontrada!' });
        }
        res.json({ 
            placa: userMotorista.placa,
            cor: userMotorista.cor,
            modelo: userMotorista.modelo 
        });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});


// Rota para atualizar CNH do motorista
router.put('/:id/cnh', CheckTokenM, upload.single('cnh'), async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    // Verificação de envio
    if (!req.file) {
        return res.status(400).json({ msg: 'Arquivo de CNH não enviado!' });
    }

    try {
        const motorista = await UserMotorista.findById(id);
        if (!motorista) {
            return res.status(404).json({ msg: 'Motorista não encontrado!' });
        }

        // Remove o arquivo antigo de CNH, se existir.
        if (motorista.cnh) {
            fs.unlink(motorista.cnh, (err) => {
                if (err) {
                    console.error("Erro ao deletar o arquivo antigo de CNH:", err);
                }
            });
        }

        // Atualiza o caminho da CNH no banco de dados
        motorista.cnh = req.file.path;

        // Salva as alterações no banco de dados
        await motorista.save();

        res.json({ msg: 'CNH atualizada com sucesso!', motorista });
    } catch (error) {
        console.error("Erro ao atualizar CNH:", error);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});


// Rota para atualizar CRLV do motorista
router.put('/:id/crlv', CheckTokenM, upload.single('crlv'), async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    // Verifica se foi enviado um arquivo
    if (!req.file) {
        return res.status(400).json({ msg: 'Arquivo de CRLV não enviado!' });
    }

    try {
        const motorista = await UserMotorista.findById(id);
        if (!motorista) {
            return res.status(404).json({ msg: 'Motorista não encontrado!' });
        }

        // Remove o arquivo antigo de CRLV, se existir.
        if (motorista.crlv) {
            fs.unlink(motorista.crlv, (err) => {
                if (err) {
                    console.error("Erro ao deletar o arquivo antigo de CRLV:", err);
                }
            });
        }

        // Atualiza o caminho do CRLV no banco de dados
        motorista.crlv = req.file.path;

        // Salva as alterações no banco de dados
        await motorista.save();

        res.json({ msg: 'CRLV atualizado com sucesso!', motorista });
    } catch (error) {
        console.error("Erro ao atualizar CRLV:", error);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});



// Registro de usuário
router.post('/register', upload.fields([
    { name: 'cnh', maxCount: 1 },
    { name: 'crlv', maxCount: 1 }
]), async (req, res) => {
    const {
        nome, email, confirmarEmail, empresa, matricula, setor, logradouro, numero, bairro, cidade, uf, senha, confirmarSenha, placa, cor, modelo,
    } = req.body;

    // Validações 
    if (!nome || !email || !confirmarEmail || !empresa || !matricula || !setor || !logradouro || !numero || !bairro || !cidade || !uf || !senha || !confirmarSenha || !placa || !cor || !modelo) {
        return res.status(422).json({ msg: 'Todos os campos são obrigatórios!' });
    }

    if (email !== confirmarEmail) {
        return res.status(422).json({ msg: 'Os emails não coincidem!' });
    }

    if (senha !== confirmarSenha) {
        return res.status(422).json({ msg: 'As senhas não coincidem!' });
    }

    const userExists = await UserMotorista.findOne({ matricula });

    if (userExists) {
        return res.status(422).json({ msg: 'Essa matrícula já está cadastrada' });
    }

    // Transformando arquivo em URL
    const cnhPath = req.files['cnh'][0].path;
    const crlvPath = req.files['crlv'][0].path;

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha, salt);

    const userMotorista = new UserMotorista({
        nome, email, empresa, matricula, setor, logradouro, numero, bairro, cidade, uf, senha: passwordHash, placa, cor, modelo, cnh: cnhPath, crlv: crlvPath,
    });

    try {
        await userMotorista.save();
        res.status(201).json({ msg: 'Usuário criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
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

    const userMotorista = await UserMotorista.findOne({ matricula });

    if (!userMotorista) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    const checkPassword = await bcrypt.compare(senha, userMotorista.senha);

    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida' });
    }

    try {
        const secret = process.env.SESSION_SECRET;
        const token = jwt.sign({ id: userMotorista._id }, secret, { expiresIn: '1h' });

        res.status(200).json({ msg: 'Autenticação realizada com sucesso', token, userId: userMotorista._id });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});


module.exports = router;
