/* eslint-disable indent */
'use strict';

module.exports = function(Reservas) {
    
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
            if (duracaoMultiplo60 !== 0 || horaInteira !== 0) {
                var err = new Error();
                err.statusCode = 422;
                err.message = "a duracao não é multiplo de 60 min ou nao comeca em hora inteira.";
                return next(err);
            }
            
            //trocar logica do where pra inicioEm<ctx.instance.inicioEm... 4 casos
            async function sobreposicaoHorario(){
                var query1 = Reservas.find(
                {
                    where: {
                        inicioEm: {lt: ctx.instance.fimEm.toISOString()},
                        fimEm: {gt: ctx.instance.fimEm.toISOString()
                    }
                }
            });
                var query2 = Reservas.find({
                    where: {
                        and: [{
                            inicioEm: {lte: ctx.instance.inicioEm.toISOString()},
                            fimEm: {gt: ctx.instance.inicioEm.toISOString()}
                        }]
                    }
                });
                var query3 = Reservas.find({
                    where: {
                        and: [{
                            inicioEm: {gt: ctx.instance.inicioEm.toISOString()},
                            fimEm: {lte: ctx.instance.fimEm.toISOString()
                            }
                        }]
                    }
                });
                var query4 = Reservas.find({
                    where: {
                        and: [{
                            inicioEm: {lt: ctx.instance.inicioEm.toISOString()},
                            fimEm: {gt: ctx.instance.fimEm.toISOString()
                            }
                        }]
                    }
                });    
                return Promise.all([query1, query2, query3, query4]);
            }
            
            async function confirmaReserva(){
                var data = await sobreposicaoHorario();
                var caso1 = data[0];
                var caso2 = data[1];
                var caso3 = data[2];
                var caso4 = data[3];
                console.log(data);
                if (caso1.length !== 0 || caso2.length !== 0 || caso3.length !== 0 || caso4.length !== 0) {
                    var err = new Error();
                    err.statusCode = 422;
                    err.message = "Horário indisponível.";
                    return next(err);
                } else {
                    next();
                }
            }
            confirmaReserva();
        };
        });
    }
    