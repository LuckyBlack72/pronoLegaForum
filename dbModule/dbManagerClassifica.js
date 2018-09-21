var dbManager = require('./dbManager');
var db = dbManager.getDb();

/* getAnagraficaCompetizioni. */ 
/* prende le competizioni filtrandole per stagione */
function getAnagraficaCompetizioni (req) {

  var queryText = 'SELECT ' +
  'id, competizione, nome_pronostico, anni_competizione, punti_esatti, punti_lista, numero_pronostici, logo, tipo_competizione ' +
  'FROM pronolegaforum.anagrafica_competizioni ' +  
  'WHERE '  + req.body.stagione + ' = ANY (anni_competizione) ' + 
  'ORDER BY id';

  return db.any(queryText);

}

/* prende la lista delle stagioni in cui ci sono pronostici */

function getStagioni () {

  var queryText = 'SELECT ' +
  'DISTINCT stagione ' +
  'FROM pronolegaforum.pronostici ' +  
  'ORDER BY stagione';

  return db.any(queryText);

}

/* POST savePronostici. */
/* salva i pronostici di un partecipante sul DB */

function saveClassificaCompetizioni(req) {

  var classificaToSave = req.body.classificaCompetizioni;
  var stagione = classificaToSave[0].stagione;

  //gestione transazionale delle insert
  return db.tx(function (t) {

    var queryText = 'UPDATE pronolegaforum.valori_pronostici ' +
    'SET valori_pronostici_classifica = NULL ' +
    'WHERE ' + 
    'stagione = ' + stagione;

console.log('prima ' + queryText);    

    db.none(queryText).then(function () {
      var updates = [];
      for (var x = 0 ; x < classificaToSave.length ; x++){
        //costruisco la insert
        queryText = '';
        queryText = 'UPDATE pronolegaforum.valori_pronostici ' +
                    'SET valori_pronostici_classifica = ';
        var pronoData = '\'{';
        for (var i = 0 ; i < classificaToSave[x].pronostici.length ; i++){
          var valueProno = classificaToSave[x].pronostici[i].replace("'","''");
          pronoData = pronoData + '"' + valueProno + '"'; 
          if(i < (classificaToSave[x].pronostici.length - 1)){
            pronoData = pronoData + ' , ';
          }else{
            pronoData = pronoData + ' ';
          }
        }
        pronoData = pronoData + '}\'' + ' ';
        queryText = queryText + pronoData;
        var whereClause = 'WHERE ' +
        'stagione = ' + stagione + ' AND ' +
        'id_competizione = ' + classificaToSave[x].id_competizione;
        queryText = queryText + whereClause;

console.log('dopo ' + queryText);        

        updates.push(db.none(queryText));
      }       
      return t.batch(updates);
    });
  });

}


module.exports = { getAnagraficaCompetizioni, getStagioni, saveClassificaCompetizioni };
