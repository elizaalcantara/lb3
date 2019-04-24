/* eslint-disable indent */
'use strict';

module.exports = function(Reservas) {
    
    //console.log(Reservas.definition.properties);
    Reservas.disableRemoteMethod('deleteById', true);			// Removes (DELETE) /products/:id
    
    // Reservas.beforeRemote('softDelete', async function(ctx){
    //     var now = new Date();
    //     ctx.instance.canceladaEm = now;
    //     var canceladaEm = now;
    //     console.log(ctx.instance);  
    // });
    
    Reservas.softDelete = function(id,callback) {
        var result = {
            status: "cancelada",
            canceladaEm: new Date()
        };
        Reservas.update({'id':id},result,Reservas.findById(id, callback));
    };
    
    Reservas.observe('before save', function(ctx, next) {
        if (ctx.isNewInstance){
            var fimEm = (ctx.instance.fimEm).getTime();
            var inicioEm = (ctx.instance.inicioEm).getTime();
            ctx.instance.duracao = (fimEm - inicioEm) / (1000 * 60);
            ctx.instance.valor = ctx.instance.duracao * (0.5);
            var horaInteira = inicioEm % 10000;
            var duracaoMultiplo60 = ctx.instance.duracao % 60;
            console.log(horaInteira);
            if (duracaoMultiplo60 !== 0 || horaInteira !== 0) {
                var err = new Error();
                err.statusCode = 422;
                err.message = "tem menos de 60 min de duracao ou nao comeca em hora inteira.";
                return next(err);
            }
        }
        next();
    });
}
