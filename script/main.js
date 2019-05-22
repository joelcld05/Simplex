(function(win){
    var myApp = {
        constVars:{
            totalrow:            1,
            totalcolumns:        2,
            yahayganador:        false,
            matrizvariables:     [],
            indiceColumnap:      0,
            columnaPivote:       [],
            indiceFilaPivote:    0,
            filaPivote:          [],
            totaliteracciones:   0,
            tabla:               $('<table class="result"></table>'),
            tablarow:               $('<row></row>'),
            tablacell:               $('<td></td>'),
        },

        tags:{
            agregares:          $("#agregaRes"),
            tablares:           $('#restriscciones'),
            fobjetivo:          $('#fobjetivo'),
            eliminares:         $("#eliminaRes"),
            reload:             $("#reload"),
            cantidadv:          $("#cantidadv"),
            mostrarR:           $("#mostrarR"),
        },

        init:function(){
           myApp.eventsInit();
        },

        eventsInit: function(){
            myApp.eventHandlers();
        },

        eventHandlers: function(){
            myApp.tags.agregares.click(function(e){
                e.preventDefault();
                myApp.agregaFila();
            });

            myApp.tags.eliminares.click(function(e){
                e.preventDefault();
                myApp.eliminafila();
            });

            myApp.tags.mostrarR.click(function(e){
                e.preventDefault();
                myApp.cargaMatrizSimplex();
            });


            myApp.tags.reload.click(function(e){
                e.preventDefault();
                if(myApp.tags.cantidadv.val()>0){
                    console.log(myApp.tags.cantidadv.val() +' - '+ myApp.constVars.totalcolumns);
                    myApp.resertTable();
                    myApp.constVars.totalcolumns= myApp.tags.cantidadv.val();
                    for(i=1;i<myApp.constVars.totalcolumns;i++){
                        myApp.agregaColumna(i+1);
                    }
                }
            });
        },

        agregaColumna: function(label){
            myApp.tags.tablares.find('tr').each(function(n){
                if(n===0){
                    $(this).find('td.condi').eq(0).before('<td class="addedtd">X'+label+'</td>');
                }else{
                    $(this).find('td.condi').eq(0).before('<td class="addedtd"><input type="number" value="0"/></td>');
                }
            });

            myApp.tags.fobjetivo.find('tr').each(function(n){
                if(n==0){
                    $(this).find('td').last().after('<td class="addedtd">X'+label+'</td>');
                }else{
                    $(this).find('td').last().after('<td class="addedtd"><input type="number" value="0"/></td>');
                }
            });
        },

        eliminaColumna: function(){
            myApp.tags.tablares.find('tr').each(function(n){
               $(this).find('td.condi').prev().remove();
            });
        },

        resertTable: function(){
            $('.addedtd').remove();
        },

        agregaFila: function(){
            var child = myApp.tags.tablares.find('tr').last().clone();
            myApp.tags.tablares.append(child);
            myApp.constVars.totalrow++;
        },

        eliminafila: function(){
            if(myApp.constVars.totalrow > 1){
                myApp.tags.tablares.find('tr').last().remove();
                myApp.constVars.totalrow--;
            }
        },

        /**************************función simplex*****************************/

        cargaMatrizSimplex: function(){
          var cantX=0, cantY=1, cantVs=0,totx=0;

          cantX = parseInt(myApp.constVars.totalcolumns)+2;

          myApp.tags.tablares.find('tr').each(function(n){
              if(n > 0){
                cantY++;
                if($(this).find('td.condi select').val() !== "="){
                  cantVs++;
                }
              }
          });


          console.log("cantidad variables columnas: "+(cantX+cantVs));
          console.log("cantidad variables filas: "+cantY);

          totx=cantX+cantVs;
            for(i=1;i>totx;i++){
                var temparrey=[];
                for(e=1;i>(cantX+cantVs);e++){
                    temparrey.push(0);
                    console.log(1);
                }
                myApp.constVars.matrizvariables.push(temparrey);
            }

            console.table(myApp.constVars.matrizvariables);
            

            myApp.tags.fobjetivo.find('tr').each(function(n){
                if(n > 0){

                }else if(n > 0){ 
                    $(this).find('td').find('input').each(function(n){
                        console.log(this.value);
                    });
                }
            });

        },

        /*********************************************************************/

        decimaltoFraction: function(value, maxdenom){
            var best = { numer: 1, denom: 1, err: Math.abs(value - 1) }
            if (!maxdenom) maxdenom = 10000;
            for (var denom = 1; best.err > 0 && denom <= maxdenom; denom++) {
                var numer = Math.round(value * denom);
                var err = Math.abs(value - numer / denom);
                if (err >= best.err) continue;
                best.numer = numer;
                best.denom = denom;
                best.err = err;
                console.log(best.numer + "/" + best.denom + "=" + (numer/denom) + " error " + best.err);
            }
            return best;
        },


        convertf: function(){
            var value = parseFloat($("#myInput").val());
            console.clear();
            console.log("Looking up " + value);
            if (isNaN(value)) {
                $("#myResult").val("NaN");
                return;
            }
            var rational = find_rational(value, 10000);
            $("#myResult").val(rational.numer + " / " + rational.denom);
        },


    }
    win.App = myApp;

})(window);
