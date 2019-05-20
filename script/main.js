(function(win){
    var myApp = {
        constVars:{
            totalrow:            1,
            totalcolumns:        2,
            yahayganador: false
        },

        tags:{
            agregares:          $("#agregaRes"),
            tablares:           $('#restriscciones'),
            fobjetivo:          $('#fobjetivo'),
            eliminares:         $("#eliminaRes"),
            reload:             $("#reload"),
            cantidadv:          $("#cantidadv"),
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

        seleccionaGanador: function(){

        },

        winner: function(){

        },

        generawinner: function(){
            
        }
    }
    win.App = myApp;

})(window);