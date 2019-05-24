(function(win){
    var myApp = {
        constVars:{
            totalrow:            1,
            totalcolumns:        2,
            totvar:              0,
            totvarS:             0,
            yahayganador:        false,
            matrizvariables:     [],
            indiceColumnap:      0,
            columnaPivote:       [],
            indiceFilaPivote:    0,
            filaPivote:          [],
            totaliteracciones:   0,
            tabla:               $('<table class="result"></table>'),
            tablarow:            $('<row></row>'),
            tablacell:           $('<td></td>'),
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
                $("#appentable *").remove();
                do{
                    myApp.identificaColumnaPivote();
                    myApp.creaTabla(myApp.constVars.matrizvariables);

                    myApp.identificaFilaPivote();
                    myApp.convertFilaPivote();
                    myApp.convertrestofilas();

                    myApp.creaTabla(myApp.constVars.matrizvariables);

                } while (myApp.buscaValorNegativo());
            });


            myApp.tags.reload.click(function(e){
                e.preventDefault();
                if(myApp.tags.cantidadv.val()>0){
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
        //esta funcion carga la matrix simples para luego ser procezada

        cargaMatrizSimplex: function(){
            var cantX=0, cantY=1, cantVs=0,totx=0,totequal=0;

            cantX = parseFloat(myApp.constVars.totalcolumns)+2;

            myApp.tags.tablares.find('tr').each(function(n){
                if(n > 0){
                    cantY++;
                    if($(this).find('td.condi select').val() !== "="){
                        cantVs++;
                    }
                }
            });
            totx=cantX+cantVs;
            myApp.constVars.matrizvariables=new Array();
            for(e=0;e<cantY;e++){
                var temparrey=new Array();
                for(i=0;i<totx;i++){
                    temparrey.push(0);
                }
                myApp.constVars.matrizvariables.push(temparrey);
            }

            myApp.constVars.matrizvariables[0][0]=1;
            myApp.constVars.matrizvariables[0][myApp.constVars.matrizvariables[0].length-1]=0;

            myApp.tags.fobjetivo.find('tr').find('td').find('input').each(function(e){
                myApp.constVars.matrizvariables[0][e+1] = parseFloat(this.value);
            });

            myApp.tags.tablares.find('tr').each(function(n){
              var toxs=1,hitdes=0;
              var tempcontador=1;                                               //cuenta la cantidad de variables que se van incertando
              if (n>0){                                                         //mayor que 0 porque la primera fila es heading
                $(this).find('td').each(function(e){                            //busca todos los td
                  var tempval = $(this).find('input').eq(0).val();              //busca el valor los inputs dentros de los td
                    if(tempval){                                                //si encuentra input entra de otro modo va a l else
                      if (parseFloat(tempval) != 0){                              //si el valor es diferentes de cero lo almacena en el indice
                        myApp.constVars.matrizvariables[n][tempcontador]=parseFloat(tempval); // ALMACENA
                      }
                      tempcontador++;
                    }else{                                                      //si encuentra igualdad
                      toxs = cantX+n-totequal-2;                                //toma la cantida de variables que existen le suma la fila en la que se encuentra y le resta 2 para ir en fncion de los arreglos
                      if ($(this).find("select").val() != "="){                 // identifica si es una igualdad t la cuenta para quitarsela al contador
                        myApp.constVars.matrizvariables[n][toxs]=1;             // si no es una desigualdad guarda 1 en la pocicion de la restriccion
                      }else{
                        totequal++;                                             // aumenta si encuentra desigualdad
                      };
                      tempcontador=totx-1;                                      // como el ultimo valor que queda en solucion va a la ultima pocicion del arreglo
                    };
                });
              }
              tempcontador = 1;
              hitdes = 0;
            });
            myApp.constVars.totvar = cantX-2;
            myApp.constVars.totvarS = cantVs-totequal;
        },


        identificaColumnaPivote: function(){
          var columnapivote,indice,valor=0;
          columnapivote = myApp.constVars.matrizvariables[0];
          for(i=0; i<columnapivote.length;i++){
            if(valor>columnapivote[i]){
              valor = columnapivote[i];
              indice = i;
            }
          }
          myApp.constVars.columnaPivote = [indice,valor];
        },


        identificaFilaPivote: function(){
          var filapivote,indice,valor=100000000000000000,div=0;
          var columnapivote = myApp.constVars.matrizvariables;
          var columnsp = myApp.constVars.columnaPivote;
          for(i=0; i<columnapivote.length;i++){
            try{
              div = columnapivote[i][columnapivote[i].length-1]/columnapivote[i][columnsp[0]];
              if(div>0 && div<valor){
                valor = div;
                indice = i;
              }
            }catch(e){
               //console.log("division por 0: "+e);
            }
          }
          myApp.constVars.filaPivote = [indice,valor];
        },

        convertFilaPivote: function(){

            var fila,columna,valorpivote, columnamatriz,val;
            fila = myApp.constVars.filaPivote[0];
            columna = myApp.constVars.columnaPivote[0];
            columnamatriz = myApp.constVars.matrizvariables[fila];
            valorpivote = myApp.constVars.matrizvariables[fila][columna];

            for(i=0;i<columnamatriz.length;i++){
                try{
                    val=columnamatriz[i]/valorpivote;
                    //console.log(columnamatriz[i]+"/"+valorpivote+ "="+val);
                }catch(e){
                    val=0;
                }
                myApp.constVars.matrizvariables[fila][i]=val;
            }

        },

        convertrestofilas: function(){
            var filap,columna,valorpivote, columnamatriz,val;

            fila = myApp.constVars.filaPivote[0];
            columna = myApp.constVars.columnaPivote[0];
            columnamatriz = myApp.constVars.matrizvariables[fila];

            for(i=0;i<myApp.constVars.matrizvariables.length;i++){

                valorpivote = myApp.constVars.matrizvariables[i][columna]*(-1);

                if (i!=fila && valorpivote != 0 ){
                    for(e=0;e<myApp.constVars.matrizvariables[i].length;e++){
                        try{
                            val = myApp.constVars.matrizvariables[i][e] + (valorpivote*columnamatriz[e]);
                        }catch(e){
                            val=0;
                        }
                        myApp.constVars.matrizvariables[i][e]=val;
                    }
                }

            }
        },

        buscaValorNegativo: function(){
            var flag=false;
            for(i=0;i<myApp.constVars.matrizvariables[0].length;i++){
                if(myApp.constVars.matrizvariables[0][i]<0){
                    flag=true;
                }
            }
            return flag;
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
            }
            return best;
        },

        creaTabla: function (tableData) {
            var table = document.createElement('table');
            var tableBody = document.createElement('tbody');
            var rowhead = document.createElement('tr');
            var celltablez = document.createElement('th');
            var celltabloasol = document.createElement('th');

            celltablez.appendChild(document.createTextNode("Z"));
            rowhead.appendChild(celltablez);

            for (var i = 0; i < myApp.constVars.totvar; i++) {
              var cell = document.createElement('th');
              cell.appendChild(document.createTextNode("X"+(i+1)));
              rowhead.appendChild(cell);
            }

            for (var i = 0; i < myApp.constVars.totvarS; i++) {
              var cell = document.createElement('th');
              cell.appendChild(document.createTextNode("S"+(i+1)));
              rowhead.appendChild(cell);
            }

            celltabloasol.appendChild(document.createTextNode("Sol"));
            rowhead.appendChild(celltabloasol);
            tableBody.appendChild(rowhead);

            tableData.forEach(function(rowData) {
              var row = document.createElement('tr');
              rowData.forEach(function(cellData) {
                var cell = document.createElement('td');
                var cellinfo = myApp.decimaltoFraction(cellData,10000);
                var textemp="";
                if (cellinfo.denom!=1){
                  textemp= cellinfo.numer+"/"+cellinfo.denom
                }else{ textemp =cellinfo.numer; }
                cell.appendChild(document.createTextNode(textemp));
                row.appendChild(cell);
              });
              tableBody.appendChild(row);
            });

            table.appendChild(tableBody);

            $("#appentable").append(table);

        }
    }
    win.App = myApp;
})(window);
