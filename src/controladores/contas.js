
const { contas, depositos, saques, transferencias } = require('../bancodedados');
const { validaCampoObrigatorio, validaCampoEspecifico } = require('../utilitarios/funcoes');
let numero_conta = 1;

const contasCadastradas = (req, res) => {
    res.status(200).json({ contas });
};

const novaConta = (req, res) => {

    const camposObrigatorios = ['nome', 'cpf', 'data_nascimento', 'telefone', 'email', 'senha'];
    const camposRecebidos = req.body;

    const validaObrigatorios = validaCampoObrigatorio(camposObrigatorios, camposRecebidos);
    const validaEspecificos = validaCampoEspecifico(camposRecebidos);

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!validaObrigatorios.camposObrigatoriosEncontrados) {
        return res.status(400).json({ mensagem: `O campo ${validaObrigatorios.campoNaoEncontrado} é obrigatório.` });
    }

    if (validaObrigatorios.possuiCamposInvalidos) {
        return res.status(400).json({ mensagem: `Existe campos inválidos para criação de 'Novo Usuario'. Informe apenas os campos: ${camposObrigatorios}.` });
    }

    if (validaEspecificos.valor) {
        return res.status(validaEspecificos.codigo).json(validaEspecificos.mensagem)
    }

    const conta = {
        numero: String(numero_conta),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    };

    contas.push(conta);
    numero_conta++;

    return res.status(201).json(conta);
};

const atualizaUsuario = (req, res) => {

    const campoRecebidoCorpo = req.body;

    const validaEspecificos = validaCampoEspecifico(campoRecebidoCorpo);

    const { numeroConta } = req.params;
    const parametrosValidos = ['nome', 'cpf', 'data_nascimento', 'telefone', 'email', 'senha'];

    const contaEncontrada = contas.find(conta => conta.numero === numeroConta);
    const encontraObjeto = Object.keys(req.body).filter(obj => parametrosValidos.includes(obj));


    if (encontraObjeto.length === 0) {
        return res.status(400).json({ mensagem: 'Informe um campo válido para atualização.' });
    }

    if (validaEspecificos.valor) {
        return res.status(validaEspecificos.codigo).json(validaEspecificos.mensagem)
    }

    const chaveCamposRecebidos = Object.keys(campoRecebidoCorpo);
    const valorCamposRecebidos = Object.values(campoRecebidoCorpo);

    for (let i = 0; i < chaveCamposRecebidos.length; i++) {
        contaEncontrada.usuario[chaveCamposRecebidos[i]] = valorCamposRecebidos[i];
    }

    res.status(201).json({ mensagem: 'Conta atualizada com sucesso!' });
}

const deletaUsuario = (req, res) => {

    const { numeroConta } = req.params;
    const contaEncontrada = contas.find(conta => conta.numero === numeroConta);

    if (contaEncontrada.saldo > 0) {
        return res.status(400).json({ mensagem: 'Não é possível excluir uma conta com saldo.' });
    }

    contas.splice(contas.indexOf(contaEncontrada), 1);

    return res.status(200).json({ mensagem: 'Conta excluída com sucesso' });
}

const depositar = (req, res) => {

    const camposObrigatorios = ['numero_conta', 'valor'];
    const camposRecebidos = req.body;

    const validaObrigatorios = validaCampoObrigatorio(camposObrigatorios, camposRecebidos);
    const validaEspecificos = validaCampoEspecifico(camposRecebidos);

    const { numero_conta, valor } = camposRecebidos;
    const contaEncontrada = contas.find(conta => conta.numero === numero_conta);

    if (!validaObrigatorios.camposObrigatoriosEncontrados) {
        return res.status(400).json({ mensagem: `O campo ${validaObrigatorios.campoNaoEncontrado} é obrigatório.` });
    }

    if (validaEspecificos.valor) {
        return res.status(validaEspecificos.codigo).json(validaEspecificos.mensagem)
    }

    const registraDeposito = {
        data: new Date(),
        numero_conta,
        valor: Number(valor)
    };

    contaEncontrada.saldo += Number(valor);

    depositos.push(registraDeposito);
    return res.status(201).json({ mensagem: 'Depósito realizado com sucesso.' })
}

const sacar = (req, res) => {

    const camposObrigatorios = ['valor'];
    const camposRecebidos = req.body;

    const validaObrigatorios = validaCampoObrigatorio(camposObrigatorios, camposRecebidos);
    const validaEspecificos = validaCampoEspecifico(camposRecebidos);

    const { numero_conta, valor } = camposRecebidos;
    const contaEncontrada = contas.find(conta => conta.numero === numero_conta);

    if (!validaObrigatorios.camposObrigatoriosEncontrados) {
        return res.status(400).json({ mensagem: `O campo ${validaObrigatorios.campoNaoEncontrado} é obrigatório.` });
    }

    if (validaEspecificos.valor) {
        return res.status(validaEspecificos.codigo).json(validaEspecificos.mensagem)
    }

    if (contaEncontrada && contaEncontrada.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente.' })
    }

    const registraSaque = {
        data: new Date(),
        numero_conta,
        valor: Number(valor)
    }

    contaEncontrada.saldo -= Number(valor);

    saques.push(registraSaque);

    return res.status(201).json({ mensagem: 'Saque realizado com sucesso.' });
}

const transferir = (req, res) => {

    const camposObrigatorios = ['valor'];
    const camposRecebidos = req.body;

    const validaObrigatorios = validaCampoObrigatorio(camposObrigatorios, camposRecebidos);
    const validaEspecificos = validaCampoEspecifico(camposRecebidos);

    const { numero_conta_origem, numero_conta_destino, valor } = camposRecebidos;

    const contaOrigem = contas.find(conta => conta.numero === numero_conta_origem);
    const contaDestino = contas.find(conta => conta.numero === numero_conta_destino);

    if (!validaObrigatorios.camposObrigatoriosEncontrados) {
        return res.status(400).json({ mensagem: `O campo ${validaObrigatorios.campoNaoEncontrado} é obrigatório.` });
    }

    if (validaEspecificos.valor) {
        return res.status(validaEspecificos.codigo).json(validaEspecificos.mensagem)
    }

    if (valor > contaOrigem.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente.' });
    }

    const registraTransferencia = {
        data: new Date(),
        numero_conta_origem,
        numero_conta_destino,
        valor: valor
    }

    contaOrigem.saldo -= Number(valor);
    contaDestino.saldo += Number(valor);

    transferencias.push(registraTransferencia);

    return res.status(201).json({ mensagem: 'Transferência realizada com sucesso' });
}

const saldo = (req, res) => {

    const { numero_conta } = req.query;

    const contaEncontrada = contas.find(conta => conta.numero === numero_conta);

    return res.status(200).json({ saldo: contaEncontrada.saldo });
}

const extrato = (req, res) => {

    const { numero_conta } = req.query;

    const depositosDaConta = depositos.filter(deposito => deposito.numero_conta === numero_conta);
    const saquesDaConta = saques.filter(saque => saque.numero_conta === numero_conta);
    const transferenciasEnviadas = transferencias.filter(transferencia => transferencia.numero_conta_origem === numero_conta);

    return res.status(200).json(
        {
            saques: saquesDaConta,
            depositos: depositosDaConta,
            transferenciasEnviadas
        }
    );

};

module.exports = {
    contasCadastradas,
    novaConta,
    atualizaUsuario,
    deletaUsuario,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}