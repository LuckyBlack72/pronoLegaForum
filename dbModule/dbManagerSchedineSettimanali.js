var dbManager = require('./dbManager');
var db = dbManager.getDb();

/* getAnagraficaCompetizioni. */ 
/* prende le competizioni filtrandole per stagione */
function getAnagraficaSchedine (req) {

    var queryText = 'SELECT ' +
    'id, stagione, settimana, pronostici, valori_pronostici_classifica, ' +
    'date_competizione, numero_pronostici, punti_esatti, punti_lista ' +
    'FROM pronolegaforum.anagrafica_competizioni_settimanali ';
    if(req.body.stagione !=0){
      queryText += 'WHERE  stagione = ' + req.body.stagione + ' ' +
      'ORDER BY settimana';
    } else {
      queryText += 'ORDER BY stagione, settimana';
    }
  
    return db.any(queryText);
  
  }

  function saveAnagraficaSchedine(request) {

    var competizione = request.body.anagraficaSchedine;
    var tipo_ddl = request.body.tipo_ddl;
    var queryText = '';

    //costruisco la insert
    queryText = composeQueryTextAnagraficaSchedine(competizione, tipo_ddl);

    //eseguo la insert
    return db.none(queryText);
  
  }

  function getNewSettimanaSchedina(request) {
    
    var stagione = request.body.stagione;

    var queryText = 'SELECT (COUNT(*) + 1) settimana ' +
    'FROM pronolegaforum.anagrafica_competizioni_settimanali ' +
    'WHERE stagione = ' + stagione;

    return db.any(queryText);
    
  }

  /* post getPronostici. */
/* prende i record dalla tabella pronostici filtrandoli eventualmente per Stagione,id_parecipanti,id_competizione */
function getPronosticiSettimanali(req) {

  var stagione = 0;
  if(req.body.stagione){
    stagione = req.body.stagione;
  }
  
  var idPartecipanti = 0;
  if(req.body.idPartecipanti){
    idPartecipanti = req.body.idPartecipanti;
  }

  var settimana = 0;
  if(req.body.settimana){
    idCompetizione = req.body.settimana;
  }

  var nickname = 'X';
  if(req.body.nickname){
    nickname = req.body.nickname;
  }

  var queryText = ' ';
  var whereClause  = 0;

  queryText = 'SELECT ' +
  'pr.id id, ' +
  'pr.id_partecipanti id_partecipanti, ' +
  'prc.nickname nickname, ' +
  'pr.stagione stagione, ' +
  'pr.settimana settimana, ' +
  'pr.pronostici pronostici, ' +
  'pr.valori_pronostici valori_pronostici ' +
  'FROM ' +
  'pronolegaforum.pronostici_settimanali pr ' +
  'INNER JOIN pronolegaforum.anagrafica_partecipanti prc ON pr.id_partecipanti = prc.id ';
  
  if(stagione !== 0 || idPartecipanti !== 0 || settimana !== 0 || nickname !== 'X'){
    queryText = queryText + 'WHERE ';
    if(stagione !== 0){
      queryText = queryText + 'pr.stagione = ' + stagione + ' ';
      whereClause++;
    } 
    if(idPartecipanti !== 0){
      if(whereClause > 0 ){
        queryText = queryText + 'AND ';  
      }
      queryText = queryText + 'pr.id_partecipanti = ' + idPartecipanti + ' ';
      whereClause++;
    } 
    if(nickname !== 'X'){
      if(whereClause > 0 ){
        queryText = queryText + 'AND ';  
      }
      /*
      queryText = queryText + 'id_partecipanti in ' +
      '(select id from pronolegaforum.anagrafica_partecipanti where nickname = ' + '\'' + nickname + '\'' + ' ) ';
      */
     queryText = queryText + 'prc.nickname = ' + '\'' + nickname + '\'' + ' ) ';
      whereClause++;
    } 
    if(settimana !== 0){
      if(whereClause > 0 ){
        queryText = queryText + 'AND ';  
      }
      queryText = queryText + 'settimana = ' + settimana + ' ';
      whereClause++;
    } 
  }
  queryText = queryText + 'ORDER BY stagione, settimana , nickname';

  return db.any(queryText);

}

function getPronosticiSettimanaliPerClassifica(req) {

  var stagione = 0;
  if(req.body.stagione){
    stagione = req.body.stagione;
  }
  
  var idPartecipanti = 0;
  if(req.body.idPartecipanti){
    idPartecipanti = req.body.idPartecipanti;
  }

  var settimana = 0;
  if(req.body.settimana){
    idCompetizione = req.body.settimana;
  }

  var nickname = 'X';
  if(req.body.nickname){
    nickname = req.body.nickname;
  }

  var queryText = ' ';
  var whereClause  = 0;

  
  queryText = 'SELECT ' +
  'pr.id id, ' +
  'pr.id_partecipanti id_partecipanti, ' +
  'prc.nickname nickname, ' +
  'pr.stagione stagione, ' +
  'pr.settimana settimana, ' +
  'pr.pronostici pronostici, ' +
  'pr.valori_pronostici valori_pronostici, ' +
  'acs.valori_pronostici_classifica valori_pronostici_classifica, ' +
  'acs.punti_esatti punti_esatti ' +
  'FROM ' +
  'pronolegaforum.pronostici_settimanali pr ' +
  'INNER JOIN pronolegaforum.anagrafica_partecipanti prc ON pr.id_partecipanti = prc.id ' +
  'RIGHT JOIN pronolegaforum.anagrafica_competizioni_settimanali acs ON ( ' +
  'pr.stagione = acs.stagione AND pr.settimana = acs.settimana ) ';

/*
  queryText = 'SELECT ' +
  'acs.id id, ' +
  'pr.id_partecipanti id_partecipanti, ' +
  'prc.nickname nickname, ' +
  'acs.stagione stagione, ' +
  'acs.settimana settimana, ' +
  'acs.pronostici pronostici, ' +
  'pr.valori_pronostici valori_pronostici, ' +
  'acs.valori_pronostici_classifica valori_pronostici_classifica, ' +
  'acs.punti_esatti punti_esatti ' +
  'FROM ' +
  'pronolegaforum.anagrafica_competizioni_settimanali acs ' +
  'LEFT OUTER JOIN pronolegaforum.pronostici_settimanali pr ' +
  'ON ( pr.stagione = acs.stagione AND pr.settimana = acs.settimana ) ' +
  'LEFT OUTER JOIN pronolegaforum.anagrafica_partecipanti prc ' +
  'ON pr.id_partecipanti = prc.id ';
*/  

  if(stagione !== 0 || idPartecipanti !== 0 || settimana !== 0 || nickname !== 'X'){
    queryText = queryText + 'WHERE ';
    if(stagione !== 0){
      queryText = queryText + 'pr.stagione = ' + stagione + ' ';
      //queryText = queryText + 'acs.stagione = ' + stagione + ' ';
      whereClause++;
    } 
    if(idPartecipanti !== 0){
      if(whereClause > 0 ){
        queryText = queryText + 'AND ';  
      }
      queryText = queryText + 'pr.id_partecipanti = ' + idPartecipanti + ' ';
      whereClause++;
    } 
    if(nickname !== 'X'){
      if(whereClause > 0 ){
        queryText = queryText + 'AND ';  
      }
     queryText = queryText + 'prc.nickname = ' + '\'' + nickname + '\'' + ' ) ';
      whereClause++;
    } 
    if(settimana !== 0){
      if(whereClause > 0 ){
        queryText = queryText + 'AND ';  
      }
      queryText = queryText + 'acs.settimana = ' + settimana + ' ';
      whereClause++;
    } 
  }
  queryText = queryText + 'ORDER BY nickname, stagione, settimana';

  console.log(queryText);

  return db.any(queryText);

}

/* POST savePronostici. */
/* salva i pronostici di un partecipante sul DB */

function savePronosticiSettimanali(req) {

  var pronoToSave = req.body.pronostici;
  var id_partecipanti = req.body.id_partecipanti;
  var valueProno = ' ';

  //gestione transazionale delle insert
  return db.tx(function (t) {

    var queryText = 'DELETE FROM pronolegaforum.pronostici_settimanali ' +
    'WHERE ' + 'id_partecipanti = ' + id_partecipanti + ' AND ' + 
    'stagione = ' + pronoToSave.stagione + ' AND settimana = ' + pronoToSave.settimana;

    db.none(queryText).then(function () {
      var updates = [];
        //costruisco la insert
        queryText = '';
        if ( pronoToSave.id_partecipanti == id_partecipanti ){

          queryText = 'INSERT INTO pronolegaforum.pronostici_settimanali ' +
          '( id_partecipanti, stagione, settimana, pronostici, valori_pronostici ) ' +
          'VALUES ( ' + pronoToSave.id_partecipanti + ', ' + 
          pronoToSave.stagione + ', ' + 
          pronoToSave.settimana + ', ';
          var pronoData = '\'{';
          for (var i = 0 ; i < pronoToSave.pronostici.length ; i++){
            valueProno = pronoToSave.pronostici[i].replace("'","''");
            pronoData = pronoData + '"' + valueProno + '"'; 
            if(i < (pronoToSave.pronostici.length - 1)){
              pronoData = pronoData + ' , ';
            }else{
              pronoData = pronoData + ' ';
            }
          }
          pronoData = pronoData + '}\'' + ', ';
          queryText = queryText + pronoData;
          var valoriPronoData = '\'{';
          for (var y = 0 ; y < pronoToSave.valori_pronostici.length ; y++){
            valueProno = pronoToSave.valori_pronostici[y].replace("'","''");
            valoriPronoData = valoriPronoData + '"' + valueProno + '"'; 
            if(y < (pronoToSave.valori_pronostici.length - 1)){
              valoriPronoData = valoriPronoData + ' , ';
            }else{
              valoriPronoData = valoriPronoData + ' ';
            }
          }
          valoriPronoData = valoriPronoData + '}\'';
          queryText = queryText + valoriPronoData;
          queryText = queryText + ' )';

          updates.push(db.none(queryText));
        }

      return t.batch(updates);
    });
  });

}

function getStagioni () {

  var queryText = 'SELECT ' +
  'DISTINCT stagione ' +
  'FROM pronolegaforum.anagrafica_competizioni_settimanali ' +  
  'ORDER BY stagione';

  return db.any(queryText);

}

function getUtentiConPronosticiSettimanali(request) {
    
  var stagione = request.body.stagione;

  var queryText = 'SELECT DISTINCT prc.nickname nickname ' +
  'FROM pronolegaforum.anagrafica_partecipanti prc ' +
  'INNER JOIN pronolegaforum.pronostici_settimanali ps ' +
  'ON prc.id = ps.id_partecipanti ' +
  'WHERE ps.stagione = ' + stagione + ' ' +
  'ORDER BY nickname';

  console.log(queryText);

  return db.any(queryText);
  
}

function composeQueryTextAnagraficaSchedine (competizione, tipo_ddl) {

    var queryText = ' ';
    var pronoData = ' ';
    var pronoClassificaData = ' ';
    var valueProno = ' ';
    var date_competizione = '';
    
    if (tipo_ddl === 'I') {
  
      queryText = 'INSERT INTO pronolegaforum.anagrafica_competizioni_settimanali ' +
      '( stagione, settimana, pronostici, valori_pronostici_classifica, ' +
      'date_competizione, numero_pronostici, punti_esatti, punti_lista ) ' +
      'VALUES ( ' + 
      competizione.stagione +  ', ' +

      competizione.settimana +  ', ';
      
      pronoData = '\'{ ';
      for (var i = 0 ; i < competizione.pronostici.length ; i++){
        valueProno = competizione.pronostici[i].replace("'","''"); 
        pronoData = pronoData + '"' + valueProno + '"'; 
        if(i < (competizione.pronostici.length - 1)){
          pronoData = pronoData + ' , ';
        }else{
          pronoData = pronoData + ' ';
        }
      }
      pronoData = pronoData + '}\'';
      queryText = queryText + pronoData + ', ';

      pronoClassificaData = '\'{ ';
      for (var y = 0 ; y < competizione.pronostici.length ; y++){
        valueProno = '"' + 'XXX' + '"';
        pronoClassificaData = pronoClassificaData + valueProno; 
        if(y < (competizione.pronostici.length - 1)){
          pronoClassificaData = pronoClassificaData + ' , ';
        }else{
          pronoClassificaData = pronoClassificaData + ' ';
        }
      }
      pronoClassificaData = pronoClassificaData + '}\'';
      queryText = queryText + pronoClassificaData + ', ';

      date_competizione = date_competizione + 'ARRAY [ ';
      for (var z = 0; z < competizione.date_competizione.length; z++){
        date_competizione = date_competizione + '( ' +
        competizione.date_competizione[z].stagione + ', ' +
        '\'' + competizione.date_competizione[z].data_apertura.substring(0,10) + ' 00:00:01' + '\'' + ', ' +
        '\'' + competizione.date_competizione[z].data_chiusura.substring(0,10) + ' 23:59:59' + '\'' + ', ' +
        '\'' + competizione.date_competizione[z].data_calcolo_classifica.substring(0,10) + ' 23:59:59' + '\'' + ' ' +
        ')::pronolegaforum.date_competizione ';
        if(y < (competizione.date_competizione.length - 1)){
          date_competizione = date_competizione + ', ';
        }else{
          date_competizione = date_competizione + ' ';
        }
      }
      date_competizione = date_competizione + '] ';
      queryText = queryText + date_competizione + ', ';

      queryText = queryText +
      competizione.numero_pronostici + ', ' +
      competizione.punti_esatti + ', ' +
      competizione.punti_lista;

      queryText = queryText + ')';
  
    } else {
  
      queryText = 'UPDATE pronolegaforum.anagrafica_competizioni_settimanali ' +
      'SET valori_pronostici_classifica = ';
      pronoData = '\'{ ';
      for (var x = 0 ; x < competizione.valori_pronostici_classifica.length ; x++){
        valueProno = competizione.valori_pronostici_classifica[x].replace("'","''");
        valueProno = '"' +  competizione.valori_pronostici_classifica[x] + '"';
        pronoData = pronoData + valueProno; 
        if(x < (competizione.valori_pronostici_classifica.length - 1)){
          pronoData = pronoData + ' , ';
        }else{
          pronoData = pronoData + ' ';
        }
      }
      pronoData = pronoData + '}\'';
      queryText = queryText + pronoData + ' ';
      queryText = queryText + 'WHERE id = ' + competizione.id;  
    }
  
    return queryText;
  
  }
  
  module.exports = { 
    getAnagraficaSchedine,
    saveAnagraficaSchedine,
    getNewSettimanaSchedina,
    getPronosticiSettimanali,
    savePronosticiSettimanali,
    getStagioni,
    getPronosticiSettimanaliPerClassifica,
    getUtentiConPronosticiSettimanali
  };