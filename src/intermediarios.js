const { banco, contas } = require('./bancodedados')
const { validaCampoObrigatorio, validaCampoEspecifico } = require('./utilitarios/funcoes');

const validaSenhaBanco = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória. Por favor, tente novamente.' })
    }

    if (senha_banco !== banco.senha) {
        return res.status(401).json({ mensagem: 'Senha inválida.' })
    }

    next();
};

const validaSenhaQuery = (req, res, next) => {
    const camposObrigatorios = ['numero_conta', 'senha'];
    const camposRecebidos = req.query;

    const validaObrigatorios = validaCampoObrigatorio(camposObrigatorios, camposRecebidos);
    const validaEspecificos = validaCampoEspecifico(camposRecebidos);

    if (!validaObrigatorios.camposObrigatoriosEncontrados) {
        return res.status(400).json({ mensagem: `O campo ${validaObrigatorios.campoNaoEncontrado} é obrigatório.` });
    }

    if (validaEspecificos.valor) {
        return res.status(validaEspecificos.codigo).json(validaEspecificos.mensagem)
    }

    const { numero_conta, senha } = camposRecebidos;
    const contaEncontrada = contas.find(conta => conta.numero === numero_conta);

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha inválida.' })
    }

    next();
};

const validaSenhaTransferir = (req, res, next) => {
    const camposObrigatorios = ['numero_conta_origem', 'numero_conta_destino', 'senha'];
    const camposRecebidos = req.body;

    const validaObrigatorios = validaCampoObrigatorio(camposObrigatorios, camposRecebidos);
    const validaEspecificos = validaCampoEspecifico(camposRecebidos);

    const { numero_conta_origem, numero_conta_destino, senha } = camposRecebidos;

    const contaOrigem = contas.find(conta => conta.numero === numero_conta_origem);
    const contaDestino = contas.find(conta => conta.numero === numero_conta_destino);

    if (!validaObrigatorios.camposObrigatoriosEncontrados) {
        return res.status(400).json({ mensagem: `O campo ${validaObrigatorios.campoNaoEncontrado} é obrigatório.` });
    }

    if (validaEspecificos.valor) {
        return res.status(validaEspecificos.codigo).json(validaEspecificos.mensagem)
    }

    if (contaOrigem.numero === contaDestino.numero) {
        return res.status(400).json({ mensagem: 'Informe uma conta de destino diferente da conta de origem' });
    }

    if (contaOrigem.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha inválida.' })
    }

    next();
};

const validaSenhaSacar = (req, res, next) => {
    const camposObrigatorios = ['numero_conta', 'senha'];
    const camposRecebidos = req.body;

    const validaObrigatorios = validaCampoObrigatorio(camposObrigatorios, camposRecebidos);
    const validaEspecificos = validaCampoEspecifico(camposRecebidos);

    const { numero_conta, senha } = camposRecebidos;

    const contaEncontrada = contas.find(conta => conta.numero === numero_conta);

    if (!validaObrigatorios.camposObrigatoriosEncontrados) {
        return res.status(400).json({ mensagem: `O campo ${validaObrigatorios.campoNaoEncontrado} é obrigatório.` });
    }

    if (validaEspecificos.valor) {
        return res.status(validaEspecificos.codigo).json(validaEspecificos.mensagem)
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha inválida.' })
    }

    next();
};

const validaContaParams = (req, res, next) => {
    const camposObrigatorios = ['numeroConta'];
    const camposRecebidos = req.params;

    const validaObrigatorios = validaCampoObrigatorio(camposObrigatorios, camposRecebidos);
    const validaEspecificos = validaCampoEspecifico(camposRecebidos);

    if (!validaObrigatorios.camposObrigatoriosEncontrados) {
        return res.status(400).json({ mensagem: `O campo ${validaObrigatorios.campoNaoEncontrado} é obrigatório.` });
    }

    if (validaEspecificos.valor) {
        return res.status(validaEspecificos.codigo).json(validaEspecificos.mensagem)
    }

    next();
}

module.exports = {
    validaSenhaBanco,
    validaSenhaQuery,
    validaSenhaTransferir,
    validaSenhaSacar,
    validaContaParams
}