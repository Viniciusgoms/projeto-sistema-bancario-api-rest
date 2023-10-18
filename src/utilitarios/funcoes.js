const { contas, depositos, saques, transferencias } = require('../bancodedados');


const validaCampoObrigatorio = (camposObrigatorios, camposRecebidos) => {

    let camposObrigatoriosEncontrados = true;
    const chaveCamposRecebidos = Object.keys(camposRecebidos);
    const possuiCamposInvalidos = chaveCamposRecebidos.some(campo => !camposObrigatorios.includes(campo));
    let campoNaoEncontrado = "";

    for (let i = 0; i < camposObrigatorios.length; i++) {

        if (!chaveCamposRecebidos.includes(camposObrigatorios[i])) {

            campoNaoEncontrado = camposObrigatorios[i]
            camposObrigatoriosEncontrados = false;
            break;
        }
    }

    return { camposObrigatoriosEncontrados, campoNaoEncontrado, possuiCamposInvalidos };
};


function validaCampoEspecifico(camposRecebidos) {

    const chaveCamposRecebidos = Object.keys(camposRecebidos);
    const valorCamposRecebidos = Object.values(camposRecebidos);
    console.log(chaveCamposRecebidos);

    for (let i = 0; i < chaveCamposRecebidos.length; i++) {
        let campo = chaveCamposRecebidos[i]

        if (validacoes[campo]) {
            const resultado = validacoes[campo](valorCamposRecebidos[i]);
            if (resultado.valor) {

                return resultado
            }
        }
    }
    return { valor: false }
}

const validacoes = {
    nome: (valorCamposRecebidos) => {
        // implementar validacao
        return { valor: false }
    },
    cpf: (valorCamposRecebidos) => {
        const cpfUnico = contas.find(conta => conta.usuario.cpf === valorCamposRecebidos);
        if (isNaN(Number(valorCamposRecebidos))) {
            return { valor: true, codigo: 400, mensagem: 'CPF Inválido. Informe um cpf válido contendo apenas números(Sem letras e/ou caracteres especiais)' }
        }

        if (cpfUnico) {
            return { valor: true, codigo: 400, mensagem: 'CPF inválido' };
        }
        return { valor: false }
    },
    data_nascimento: (valorCamposRecebidos) => {
        // implementar validacao
        return { valor: false }
    },
    telefone: (valorCamposRecebidos) => {
        // implementar validacao
        return { valor: false }
    },
    email: (valorCamposRecebidos) => {
        const emailUnico = contas.find(conta => conta.usuario.email === valorCamposRecebidos);

        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!regex.test(valorCamposRecebidos)) {
            return { valor: true, codigo: 400, mensagem: 'E-mail inválido, verifique se o e-mail está correto.' };
        }

        if (emailUnico) {
            return { valor: true, codigo: 400, mensagem: 'E-mail inválido' };
        }
        return { valor: false }
    },
    valor: (valorCamposRecebidos) => {
        if (valorCamposRecebidos === undefined) {
            return { valor: true, codigo: 400, mensagem: 'Operação não realizada. Por favor, informe o valor.' };
        }

        if (isNaN(Number(valorCamposRecebidos))) {
            return { valor: true, codigo: 400, mensagem: 'Tente novamente. Informe o valor utilizando apenas números.' };
        }

        if (Number(valorCamposRecebidos) <= 0) {
            return { valor: true, codigo: 400, mensagem: 'Erro. Para depositar informe um valor positivo(Maior que zero).' }
        }
        return { valor: false }
    },
    numeroConta: (valorCamposRecebidos) => {
        const contaEncontrada = contas.find(conta => conta.numero === valorCamposRecebidos);

        if (!contaEncontrada) {
            return { valor: true, codigo: 404, mensagem: 'Conta inválida.' };
        }

        if (isNaN(Number(valorCamposRecebidos))) {
            return { valor: true, codigo: 400, mensagem: 'Conta inválida. Digite o número da conta sem caracteres especiais ou letras.' };
        }
        return { valor: false }
    },
    numero_conta: (valorCamposRecebidos) => {
        const contaEncontrada = contas.find(conta => conta.numero === valorCamposRecebidos);

        if (!contaEncontrada) {
            return { valor: true, codigo: 404, mensagem: 'Conta inválida.' };
        }

        if (isNaN(Number(valorCamposRecebidos))) {
            return { valor: true, codigo: 400, mensagem: 'Conta inválida. Digite o número da conta sem caracteres especiais ou letras.' };
        }
        return { valor: false }
    },
    numero_conta_origem: (valorCamposRecebidos) => {
        const contaEncontrada = contas.find(conta => conta.numero === valorCamposRecebidos);

        if (!contaEncontrada) {
            return { valor: true, codigo: 404, mensagem: 'Conta inválida.' };
        }

        if (isNaN(Number(valorCamposRecebidos))) {
            return { valor: true, codigo: 400, mensagem: 'Conta inválida. Digite o número da conta sem caracteres especiais ou letras.' };
        }
        return { valor: false }
    },
    numero_conta_destino: (valorCamposRecebidos) => {
        const contaEncontrada = contas.find(conta => conta.numero === valorCamposRecebidos);

        if (!contaEncontrada) {
            return { valor: true, codigo: 404, mensagem: 'Conta inválida.' };
        }

        if (isNaN(Number(valorCamposRecebidos))) {
            return { valor: true, codigo: 400, mensagem: 'Conta inválida. Digite o número da conta sem caracteres especiais ou letras.' };
        }
        return { valor: false }
    },
    senha: (valorCamposRecebidos) => {
        // implementar validacao

        return { valor: false }
    },
}

module.exports = {
    validaCampoObrigatorio,
    validaCampoEspecifico
}