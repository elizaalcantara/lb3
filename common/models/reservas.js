/* eslint-disable indent */
'use strict';

module.exports = function(Reservas) {
Reservas.observe('before save', function(ctx, next) {
    var fimEm = (ctx.instance.fimEm).getTime();
    var inicioEm = (ctx.instance.inicioEm).getTime();
    if (ctx.isNewInstance) {
    ctx.instance.duracao = (fimEm - inicioEm) / (1000 * 60);
    ctx.instance.valor = ctx.instance.duracao * (0.5);
    };
    next();
});

Reservas.observe('before delete', function naoDeletar(ctx, next) {
    var err = new Error('Nao pode deletar. Mudar status pra cancelada');
    err.statusCode = 400;
    var idDeletado = ctx.where.id;
    return {idDeletado};
    next(err);
});

console.log('testando123');

// ctx.instance.status = 'cancelada'
};
