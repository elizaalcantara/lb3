/* eslint-disable indent */
'use strict';

module.exports = function(Reservas) {
    
    //console.log(Reservas.definition.properties);
    Reservas.disableRemoteMethod('deleteById', true);			// Removes (DELETE) /products/:id
    
    Reservas.beforeRemote('prototype.softDelete', async function(ctx){
        var now = new Date();
        ctx.instance.canceladaEm = now;
        var canceladaEm = now;
    //     var properties = Reservas.definition.properties;
    //     var id = ctx.instance.id;
    //     Reservas.find({where:{id:id}}, function(err,result){
    //     properties.push(canceladaEm)
    // })
        console.log(ctx.instance);  
    });
    
    Reservas.prototype.softDelete = function(next) {
        var result = {
            status: "cancelada"
        }
        next(null,result);
    };
    
    Reservas.observe('before save', function(ctx, next) {
        if (ctx.isNewInstance){
            var fimEm = (ctx.instance.fimEm).getTime();
            var inicioEm = (ctx.instance.inicioEm).getTime();
            ctx.instance.duracao = (fimEm - inicioEm) / (1000 * 60);
            ctx.instance.valor = ctx.instance.duracao * (0.5);
            if (ctx.instance.duracao < 60) {
                var err = new Error();
                err.statusCode = 422;
                err.message = "tem menos de 60 min de duracao"
                return next(err);
            }
        }
        next();
    });
    
    // Reservas.observe('before delete', (ctx, next) => {
    
    //     var now = new Date();
    //     var alterarStatus = ctx.where.id;
    //     console.log(alterarStatus);
    
    //     Reservas.findById(ctx.where.id, (err, instance) => {
    //         var err = new Error();
    //         err.statusCode = 400;
    //         err.message = "Reservas não devem ser deletadas. Alterar o status pra cancelada."
    //         instance.canceladaEm = now;
    //         if (err) {
    //             ctx.hookState.deletedModelInstance = instance;  
    //             instance.canceladaEm = now;
    //             console.log(ctx.hookState.deletedModelInstance);
    //             return next(err);
    //         }
    //         next(ctx);
    //     });
    // });
    
}
