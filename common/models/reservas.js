/* eslint-disable indent */
'use strict';

var statusId;
var atualizarId;

module.exports = function(Reservas) {
    Reservas.observe('before save', function(ctx, next) {
        if (ctx.isNewInstance){
            var fimEm = (ctx.instance.fimEm).getTime();
            var inicioEm = (ctx.instance.inicioEm).getTime();
            ctx.instance.duracao = (fimEm - inicioEm) / (1000 * 60);
            ctx.instance.valor = ctx.instance.duracao * (0.5);

            
        }
        next();
    });
    
    Reservas.observe('before delete', function naoDeletar(ctx, next) {
        var err = new Error("Não deletar. Mudar o status para 'cancelada'");
        err.statusCode = 400;
        statusId = ctx.where.id;
        console.log(statusId);
        next(err);
    });
    
}