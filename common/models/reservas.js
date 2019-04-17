/* eslint-disable indent */
'use strict';

module.exports = function(Reservas) {
Reservas.observe('before save', function(ctx, next) {
    var fimEm = (ctx.instance.fimEm).getTime();
    var inicioEm = (ctx.instance.inicioEm).getTime();
    ctx.instance.duracao = (fimEm - inicioEm) / (1000 * 60);
    ctx.instance.valor = ctx.instance.duracao * (0.5);
    next();
});

// Reservas.observe('before delete', function(ctx, next) {
//     console.log(ctx.model.id.status);
//     ctx.model.id.status = 'cancelada';
//     next();
// });
};
