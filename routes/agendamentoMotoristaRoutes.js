const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AgendamentoMotorista = require('../model/AgendamentoMotorista');

// Rota para  dados do agendamento
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const agendamentoMotorista = await AgendamentoMotorista.findById(id);
        if (!agendamentoMotorista) {
            return res.status(404).json({ msg: 'Agendamento não encontrado!' });
        }
        res.json(agendamentoMotorista);
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para  data do agendamento
router.get('/:id/data', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const agendamentoMotorista = await AgendamentoMotorista.findById(id, 'data');
        if (!agendamentoMotorista) {
            return res.status(404).json({ msg: 'Data não encontrada!' });
        }
        res.json({ data: agendamentoMotorista.data });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para  hora do agendamento
router.get('/:id/hora', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const agendamentoMotorista = await AgendamentoMotorista.findById(id, 'hora');
        if (!agendamentoMotorista) {
            return res.status(404).json({ msg: 'Hora não encontrada!' });
        }
        res.json({ hora: agendamentoMotorista.hora });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para vagas do agendamento
router.get('/:id/vagas', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const agendamentoMotorista = await AgendamentoMotorista.findById(id, 'vagas');
        if (!agendamentoMotorista) {
            return res.status(404).json({ msg: 'Vagas não encontradas!' });
        }
        res.json({ vagas: agendamentoMotorista.vagas });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Registro de agendamento
router.post('/register', async (req, res) => {
    const { empresa, data, hora, vagas } = req.body;

    if (!empresa || !data || !hora || vagas == null) {
        return res.status(400).json({ msg: 'Todos os campos são obrigatórios!' });
    }

    const agendamentoMotorista = new AgendamentoMotorista({
       empresa,
        data,
        hora,
        vagas,
    });

    try {
        await agendamentoMotorista.save();
        res.status(201).json({ msg: 'Agendamento criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

// Rota para atualizar agendamento
router.put('/:id', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    const { destino, data, hora, vagas } = req.body;

     // Verifica se todos os campos obrigatórios estão presentes
     if (!destino || !data || !hora || !vagas) {
        return res.status(400).json({ msg: 'Todos os campos são obrigatórios!' });
    }

    try {
        let agendamentoMotorista = await AgendamentoMotorista.findById(id);

        if (!agendamentoMotorista) {
            return res.status(404).json({ msg: 'Agendamento não encontrado!' });
        }

        // Atualiza os campos do agendamento
        agendamentoMotorista.destino = req.body.destino;
        agendamentoMotorista.data = req.body.data;
        agendamentoMotorista.hora = req.body.hora;
        agendamentoMotorista.vagas = req.body.vagas;

        await agendamentoMotorista.save();

        res.status(200).json({ msg: 'Agendamento atualizado com sucesso!', agendamentoMotorista });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});



// Rota para deletar agendamento
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const agendamentoMotorista = await AgendamentoMotorista.findByIdAndDelete(id);

        if (!agendamentoMotorista) {
            return res.status(404).json({ msg: 'Agendamento não encontrado!' });
        }

        res.status(200).json({ msg: 'Agendamento deletado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

module.exports = router;
