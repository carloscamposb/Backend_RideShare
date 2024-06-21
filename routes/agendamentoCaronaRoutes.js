const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Agendamento = require('../model/AgendamentoCarona');

// Rota para obter dados do agendamento
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const agendamento = await Agendamento.findById(id);
        if (!agendamento) {
            return res.status(404).json({ msg: 'Agendamento não encontrado!' });
        }
        res.json(agendamento);
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});


// Rota para obter a data do agendamento
router.get('/:id/data', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const agendamento = await Agendamento.findById(id, 'data');
        if (!agendamento) {
            return res.status(404).json({ msg: 'Data não encontrada!' });
        }

        // Log para verificar o valor de agendamento.data
        console.log('Data do agendamento:', agendamento.data);

        // Retorna campo 'data' do documento encontrado
        res.json({ data: agendamento.data });
    } catch (error) {
        console.error('Erro ao buscar data do agendamento:', error);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});


// Rota para obter a hora do agendamento
router.get('/:id/hora', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    try {
        const agendamento = await Agendamento.findById(id, 'hora');
        if (!agendamento) {
            return res.status(404).json({ msg: 'Hora não encontrada!' });
        }
        res.json({ hora: agendamento.hora });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});


// Registro de agendamento
router.post('/register', async (req, res) => {
    const {
      partida,
      empresa,
      data,
      hora,
  
    } = req.body;
  
    console.log('Dados recebidos no backend:', req.body); // Adicione esta linha para verificar os dados recebidos
  
    if (!partida || !empresa || !data || !hora || !empresa) {
      return res.status(400).json({ msg: 'Todos os campos são obrigatórios!' });
    }
  
    const agendamento = new Agendamento({
      partida,
      empresa,
      data,
      hora,
      
    });
  
    try {
      await agendamento.save();
      res.status(201).json({ msg: 'Agendamento criado com sucesso!' });
    } catch (error) {
      res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
  });



// Rota para atualizar dados do agendamento
router.put('/:id', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ msg: 'ID inválido!' });
    }

    const { partida, empresa, data, hora } = req.body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!partida || !empresa || !data || !hora) {
        return res.status(400).json({ msg: 'Todos os campos são obrigatórios!' });
    }

    try {
        let agendamento = await Agendamento.findById(id);
        if (!agendamento) {
            return res.status(404).json({ msg: 'Agendamento não encontrado!' });
        }

        // Atualiza os campos do agendamento
        agendamento.partida = req.body.partida;
        agendamento.empresa = req.body.empresa;
        agendamento.data = req.body.data;
        agendamento.hora = req.body.hora;

        await agendamento.save();
        res.json({ msg: 'Agendamento atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        res.status(500).json({ msg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});


// Rota para deletar um agendamento
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ status: 'failure', mssg: 'ID inválido!' });
    }

    try {
        const agendamento = await Agendamento.findByIdAndDelete(id);
        if (!agendamento) {
            return res.status(404).json({ status: 'failure', mssg: 'Agendamento não encontrado!' });
        }
        res.status(200).json({ status: 'success', mssg: 'Deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        res.status(500).json({ status: 'failure', mssg: 'Erro no servidor! Tente novamente mais tarde' });
    }
});

module.exports = router;
