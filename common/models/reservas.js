/* eslint-disable indent */
'use strict';

module.exports = function(Reservas) {

    var mesmoInicio = null;
    var mesmoFinal = null;
    
    //console.log(Reservas.definition.properties);
    Reservas.disableRemoteMethod('deleteById', true);			// Removes (DELETE) /products/:id
    
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
            
            Reservas.find({where:{inicioEm:ctx.instance.inicioEm}}, function(err,data){
                mesmoInicio = data;
                console.log("mesmo inicio"+ JSON.stringify(mesmoInicio))}
            );
            Reservas.find({where:{fimEm:ctx.instance.fimEm}}, function(err,data){
                mesmoFinal = data;
                console.log("mesmo final" + JSON.stringify(mesmoFinal))}
            );
            
            if (duracaoMultiplo60 !== 0 || horaInteira !== 0) {
                var err = new Error();
                err.statusCode = 422;
                err.message = "tem menos de 60 min de duracao ou nao comeca em hora inteira.";
                return next(err);
            } else if (mesmoInicio !== null || mesmoFinal !== null) {
                var err = new Error();
                err.statusCode = 422;
                err.message = "Horário indisponível.";
                return next(err);
            }
            next();
        };
        });
    }
    