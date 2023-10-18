const express = require('express');
const { validaSenhaQuery, validaSenhaTransferir, validaSenhaSacar, validaSenhaBanco, validaContaParams } = require('./intermediarios');
const { contasCadastradas, novaConta, atualizaUsuario, deletaUsuario, depositar, sacar, transferir, saldo, extrato } = require('./controladores/contas');

const rotas = express();

rotas.get('/contas', validaSenhaBanco, contasCadastradas);
rotas.post('/contas', novaConta);
rotas.put('/contas/:numeroConta/usuario', validaContaParams, atualizaUsuario);
rotas.delete('/contas/:numeroConta', validaContaParams, deletaUsuario);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', validaSenhaSacar, sacar);
rotas.post('/transacoes/transferir', validaSenhaTransferir, transferir);
rotas.get('/contas/saldo', validaSenhaQuery, saldo);
rotas.get('/contas/extrato', validaSenhaQuery, extrato);


module.exports = rotas;