var dbManager = require('./dbManager');
var db = dbManager.getDb();

/* getAnagraficaCompetizioni. */ 
/* prende le competizioni filtrandole per stagione */
function getAnagraficaCompetizioni (req) {

  var queryText = 'SELECT ' +
  'id, competizione, nome_pronostico, anni_competizione, punti_esatti, punti_lista, numero_pronostici, logo, tipo_competizione ' +
  'FROM pronolegaforum.anagrafica_competizioni ';
  if(req.body.stagione !=0){
    queryText += 'WHERE '  + req.body.stagione + ' = ANY (anni_competizione) ' + 
    'ORDER BY id';
  } else {
    queryText += 'ORDER BY competizione';
  }

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
    'stagione = ' + stagione + ' AND ' + 'id_competizione IN ( ';
    var ids = '';
    for (var i = 0; i < classificaToSave.length; i++) {
      ids = ids + classificaToSave[i].id_competizione;
      if( i < (classificaToSave.length - 1) ){
        ids = ids + ', ';
      }
    }
    queryText = queryText + ids + ' )';

// console.log('prima ' + queryText);    

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

// console.log('dopo ' + queryText);        

        updates.push(db.none(queryText));
      }       
      return t.batch(updates);
    });
  });

}

function getEmailAddressPartecipanti (stagione) {

  var queryText = 'SELECT ' +
  'DISTINCT p.email_address ' +
  'FROM ' +
  'pronolegaforum.anagrafica_partecipanti p INNER JOIN pronolegaforum.pronostici pr ON p.id = pr.id_partecipanti ' +
  'WHERE ' +
  'p.email_address IS NOT NULL ' + 'AND ' +
  'pr.stagione = ' + stagione;

  return db.any(queryText);

}

function saveAnagraficaCompetizioni(request) {

  var competizione = request.body.anagraficaCompetizioni;

  var queryText = ' ';
  var pronoData = ' ';
  var valueProno = ' ';
  
  //costruisco la insert
  if (competizione.id === 0) {

    queryText = 'INSERT INTO pronolegaforum.anagrafica_competizioni ' +
    '( competizione, nome_pronostico, anni_competizione, punti_esatti, ' +
    'punti_lista, numero_pronostici, logo, tipo_competizione ) ' +
    'VALUES ( ' + 
    '\'' + competizione.competizione + '\'' + ', ' +
    '\'' + competizione.nome_pronostico + '\'' + ', ';
    pronoData = '\'{ ';
    for (var i = 0 ; i < competizione.anni_competizione.length ; i++){
      valueProno = competizione.anni_competizione[i];
      pronoData = pronoData + valueProno; 
      if(i < (competizione.anni_competizione.length - 1)){
        pronoData = pronoData + ' , ';
      }else{
        pronoData = pronoData + ' ';
      }
    }
    pronoData = pronoData + '}\'';
    queryText = queryText + pronoData + ', ';
    queryText = queryText +
    competizione.punti_esatti + ', ' +
    competizione.punti_lista + ', ' +
    competizione.numero_pronostici + ', ' +
    '\'' + competizione.logo + '\'' + ', ' +
    '\'' + competizione.tipo_competizione + '\'' + ' ' +
    ')';

  } else {

    queryText = 'UPDATE pronolegaforum.anagrafica_competizioni ' +
    'SET anni_competizione = ';
    pronoData = '\'{ ';
    for (var x = 0 ; x < competizione.anni_competizione.length ; x++){
      valueProno = competizione.anni_competizione[x];
      pronoData = pronoData + valueProno; 
      if(x < (competizione.anni_competizione.length - 1)){
        pronoData = pronoData + ' , ';
      }else{
        pronoData = pronoData + ' ';
      }
    }
    pronoData = pronoData + '}\'';
    queryText = queryText + pronoData + ' ';
    queryText = queryText + 'WHERE id = ' + competizione.id;

  }
  //eseguo la insert

  console.log(queryText);

  return db.none(queryText);

}

function getTipoCompetizione () {

  var queryText = 'SELECT ' +
  'tipo, nome ' +
  'FROM pronolegaforum.tipo_competizione ' +  
  'ORDER BY nome';

  return db.any(queryText);

}


module.exports = { 
                    getAnagraficaCompetizioni,
                    getStagioni,
                    saveClassificaCompetizioni,
                    getEmailAddressPartecipanti,
                    saveAnagraficaCompetizioni,
                    getTipoCompetizione
                  };
