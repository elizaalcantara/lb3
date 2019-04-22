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
    
    Reservas.observe('before delete', (ctx, next) => {
        Reservas.findById(ctx.where.id, (err, instance) => {

            var err = new Error();
            err.statusCode = 400;
            if (err) {
                ctx.hookState.deletedModelInstance = instance;  
                console.log(ctx.hookState.deletedModelInstance)  
                return next(err);
            }
            next(ctx);
        });

    });
}