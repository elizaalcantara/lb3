/* eslint-disable indent */
'use strict';

module.exports = function(Reservas) {

    var caso1 = null;
    var caso2 = null;
    var caso3 = null;
    var caso4 = null;
    
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
            
            //trocar logica do where pra inicioEm<ctx.instance.inicioEm... 4 casos
            Reservas.find({where: {and: {lt: {inicioEm: ctx.instance.fimEm}, gt: {fimEm: ctx.instance.fimEm}}}}, function(err,data){
                caso1 = data;
                console.log("caso 1"+ JSON.stringify(caso1))}
            );
            Reservas.find({where: {and: {lt: {inicioEm: ctx.instance.inicioEm}, gt: {fimEm: ctx.instance.inicioEm}}}}, function(err,data){
                caso2 = data;
                console.log("caso 2"+ JSON.stringify(caso2))}
            );
            Reservas.find({where: {and: {gt: {inicioEm: ctx.instance.inicioEm}, lt: {fimEm: ctx.instance.fimEm}}}}, function(err,data){
                caso3 = data;
                console.log("caso 3"+ JSON.stringify(caso3))}
            );
            Reservas.find({where: {and: {lt: {inicioEm: ctx.instance.inicioEm}, gt: {fimEm: ctx.instance.fimEm}}}}, function(err,data){
                caso4 = data;
                console.log("caso 4"+ JSON.stringify(caso4))}
            );
            
            if (duracaoMultiplo60 !== 0 || horaInteira !== 0) {
                var err = new Error();
                err.statusCode = 422;
                err.message = "tem menos de 60 min de duracao ou nao comeca em hora inteira.";
                return next(err);
            } else if (caso1 !== null || caso2 !== null || caso3 !== null || caso4 !== null) {
                var err = new Error();
                err.statusCode = 422;
                err.message = "Horário indisponível.";
                return next(err);
            }
            next();
        };
        });
    }
    