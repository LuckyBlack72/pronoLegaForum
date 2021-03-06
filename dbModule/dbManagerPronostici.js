var dbManager = require('./dbManager');
var db = dbManager.getDb();
//var fs = require('fs');

//indirizza le richieste a seconda di come cominciano
// le richieste qui sono tutte sotto richieste di /pronostici

// per le email con attachments
// var nodeMailer = require('nodemailer');
// var Excel = require('exceljs'); // LF 16/07/2018 per creare export Excel
// per le email con attachments


/* post getValoriPronostici. */
/* prende i record dalla tabella vallri_pronostici filtrandoli eventualmente per Stagione,id_competizione */
function getValoriPronostici (req) {

  var stagione = 0;
  if(req.body.stagione){
    stagione = req.body.stagione;
  }

  var idCompetizione = 0;
  if(req.body.idCompetione){
    idCompetizione = req.body.idCompetizione;
  }

  var queryText = ' ';
  var whereClause  = 0;

  queryText = 'SELECT ' + 
  'id, stagione, id_competizione, valori_pronostici ' +
  'FROM pronolegaforum.valori_pronostici ';
  if(stagione !== 0 || idCompetizione !== 0){
    queryText = queryText + 'WHERE ';
    if(stagione !== 0){
      queryText = queryText + 'stagione = ' + stagione + ' ';
      whereClause++;
    } 
    if(idCompetizione !== 0){
      if(whereClause > 0 ){
        queryText = queryText + 'AND ';  
      }
      queryText = queryText + 'id_competizione = ' + idCompetizione + ' ';
      whereClause++;
    } 
  }
  queryText = queryText + 'ORDER BY stagione, id_competizione';

  return db.any(queryText);

}


/* post getPronostici. */
/* prende i record dalla tabella pronostici filtrandoli eventualmente per Stagione,id_parecipanti,id_competizione */
function getPronostici(req) {

  var stagione = 0;
  if(req.body.stagione){
    stagione = req.body.stagione;
  }
  var idPartecipanti = 0;
  if(req.body.idPartecipanti){
    idPartecipanti = req.body.idPartecipanti;
  }

  var idCompetizione = 0;
  if(req.body.idCompetione){
    idCompetizione = req.body.idCompetizione;
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
  'pr.id_competizione id_competizione, ' +
  'cmp.competizione competizione, ' +
  'cmp.tipo_pronostici tipo_pronostici, ' +
  'pr.pronostici pronostici ' +
  'FROM ' +
  'pronolegaforum.pronostici pr ' +
  'INNER JOIN pronolegaforum.anagrafica_competizioni cmp ON pr.id_competizione = cmp.id ' +
  'INNER JOIN pronolegaforum.anagrafica_partecipanti prc ON pr.id_partecipanti = prc.id ';
  
  if(stagione !== 0 || idPartecipanti !== 0 || idCompetizione !== 0 || nickname !== 'X'){
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
    if(idCompetizione !== 0){
      if(whereClause > 0 ){
        queryText = queryText + 'AND ';  
      }
      queryText = queryText + 'id_competizione = ' + idCompetizione + ' ';
      whereClause++;
    } 
  }
  queryText = queryText + 'ORDER BY stagione, nickname, tipo_pronostici, id_competizione';

  return db.any(queryText);

}

/* POST savePronostici. */
/* salva i pronostici di un partecipante sul DB */

function savePronostici(req) {

  var pronoToSave = req.body.pronostici;
  var id_partecipanti = req.body.id_partecipanti;

  //gestione transazionale delle insert
  return db.tx(function (t) {

    var queryText = 'DELETE FROM pronolegaforum.pronostici ' +
    'WHERE ' + 'id_partecipanti = ' + id_partecipanti + ' AND ' + 
    'stagione = ' + pronoToSave[0].stagione;

    db.none(queryText).then(function () {
      var updates = [];
      for (var x = 0 ; x < pronoToSave.length ; x++){
        //costruisco la insert
        queryText = '';
        if ( pronoToSave[x].id_partecipanti == id_partecipanti ){

          queryText = 'INSERT INTO pronolegaforum.pronostici ' +
          '( id_partecipanti, stagione, id_competizione, pronostici ) ' +
          'VALUES ( ' + pronoToSave[x].id_partecipanti + ', ' + 
          pronoToSave[x].stagione + ', ' + 
          pronoToSave[x].id_competizione + ', ';
          var pronoData = '\'{';
          for (var i = 0 ; i < pronoToSave[x].pronostici.length ; i++){
          var valueProno = pronoToSave[x].pronostici[i].replace("'","''");
          pronoData = pronoData + '"' + valueProno + '"'; 
          if(i < (pronoToSave[x].pronostici.length - 1)){
            pronoData = pronoData + ' , ';
          }else{
            pronoData = pronoData + ' ';
          }
          }
          pronoData = pronoData + '}\'';
          queryText = queryText + pronoData;
          queryText = queryText + ' )';

          updates.push(db.none(queryText));
        }
      }       
      return t.batch(updates);
    });
  });

}

function getDatePronostici(req) {

  var queryText = 'SELECT ' +
  'stagione, ' +
  'TO_CHAR(data_apertura, ' + '\'' + 'YYYY-MM-DD HH24:MI:SS' +  '\'' + ') data_apertura, ' +
  'TO_CHAR(data_chiusura, ' + '\'' + 'YYYY-MM-DD HH24:MI:SS' +  '\'' + ') data_chiusura, ' +
  'TO_CHAR(data_calcolo_classifica, ' + '\'' + 'YYYY-MM-DD HH24:MI:SS' +  '\'' + ') data_calcolo_classifica ' +
  'FROM pronolegaforum.date_pronostici ' +  
  'WHERE '  + 'stagione = ' + req.body.stagione; 

  return db.any(queryText);

}

function getValoriPronosticiCalcoloClassifica(req) {

  var stagione = req.body.stagione;
  var queryText = ' ';
  
  queryText = 'SELECT ' + 
  'vpr.id id, ' +
  'vpr.stagione stagione, ' + 
  'vpr.id_competizione id_competizione, ' +
  'vpr.valori_pronostici_classifica valori_pronostici_classifica, ' +
  'cmp.punti_esatti punti_esatti, ' +
  'cmp.punti_lista punti_lista, ' +
  'cmp.tipo_competizione tipo_competizione ' +
  'FROM ' +
  'pronolegaforum.valori_pronostici vpr INNER JOIN pronolegaforum.anagrafica_competizioni cmp ' +
  'ON vpr.id_competizione = cmp.id ' +
  'WHERE ' +
  'vpr.stagione = ' + stagione + ' ' +
  'ORDER BY vpr.id_competizione';

  return db.any(queryText);

}

module.exports = { 
                    getValoriPronostici, 
                    getPronostici, 
                    savePronostici, 
                    getDatePronostici, 
                    getValoriPronosticiCalcoloClassifica
                };
