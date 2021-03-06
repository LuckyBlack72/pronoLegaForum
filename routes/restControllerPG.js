var express = require('express');
var router = express.Router();
//var fs = require('fs');
var dbManager = require('../dbModule/dbManager');

//per le email con attachments
//var nodeMailer = require('nodemailer');
//var Excel = require('exceljs'); // LF 16/07/2018 per creare export Excel
//per le email con attachments

var db = dbManager.getDb();

/* post getAnagraficaCompetizioni. */ 
/* prende le competizioni filtrandole per stagione */
router.post('/getAnagraficaCompetizioni', function(req, res, next) {

  var queryText = 'SELECT ' +
  'id, competizione, nome_pronostico, anni_competizione, punti_esatti, punti_lista, numero_pronostici, logo ' +
  'FROM pronolegaforum.anagrafica_competizioni ' +  
  'WHERE '  + req.body.stagione + ' = ANY (anni_competizione) ' + 
  'ORDER BY id';

  db.any(queryText).then(function (listaCompetizioni) {

    //torno un'oggetto json
    res.status(200).json(listaCompetizioni);
  })
  .catch(error => { //gestione errore
    res.status(500).json([]);
  });

});

/* post getAnagraficaPartecipanti. */ 
/* prende i dati dei partecipanti filtrandoli eventualmente per nickname */
router.post('/getAnagraficaPartecipanti', function(req, res, next) {

  var nickname = ' ';
  if(req.body.nickname){
    nickname = req.body.nickname;
  }

  var queryText = 'SELECT ' +
  'id, nickname, email_address, password_value ' +
  'FROM pronolegaforum.anagrafica_partecipanti ';
  if(nickname !== ' '){
    queryText = queryText + 'WHERE nickname = ' + '\'' + nickname + '\'';
  } else {
    queryText = queryText + 'ORDER BY nickname';
  } 

  db.any(queryText).then(function (listaPartecipanti) {

    //torno un'oggetto json
    res.status(200).json(listaPartecipanti);
  })
  .catch(error => { //gestione errore
    res.status(500).json([]);
  });

});

router.post('/saveAnagraficaPartecipanti', function(req, res, next) {

  var nickname = req.body.anagraficaPartecipanti.nickname;
  var email_address = req.body.anagraficaPartecipanti.email_address;
  var password_value = req.body.anagraficaPartecipanti.password_value;

  var queryText = ' ';
  
  //costruisco la insert
  queryText = 'INSERT INTO pronolegaforum.anagrafica_partecipanti ' +
              '( nickname, email_address, password_value ) ' +
              'VALUES ( ' + '\'' + nickname + '\'' + ', ' + '\'' + email_address + '\'' + ', ' + '\'' + password_value + '\'' + ' )';

  //eseguo la insert
  db.none(queryText)
  .then(() => {
      // success;
      res.status(200).json('OK');
  })
  .catch(error => {
      // error;
      res.status(500).json(error);
  });    

});


/* post getValoriPronostici. */
/* prende i record dalla tabella vallri_pronostici filtrandoli eventualmente per Stagione,id_competizione */
router.post('/getValoriPronostici', function(req, res, next) {

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

  db.any(queryText).then(function (listaValoriPronostici) {
    //torno un'oggetto json
    res.status(200).json(listaValoriPronostici);
  })
  .catch(error => { //gestione errore
    res.status(500).json([]);
  });

});


/* post getPronostici. */
/* prende i record dalla tabella pronostici filtrandoli eventualmente per Stagione,id_parecipanti,id_competizione */
router.post('/getPronostici', function(req, res, next) {

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

  queryText = 'select ' +
  'id, id_partecipanti, stagione, id_competizione, pronostici ' +
  'FROM pronolegaforum.pronostici ';
  if(stagione !== 0 || idPartecipanti !== 0 || idCompetizione !== 0 || nickname !== 'X'){
    queryText = queryText + 'WHERE ';
    if(stagione !== 0){
      queryText = queryText + 'stagione = ' + stagione + ' ';
      whereClause++;
    } 
    if(idPartecipanti !== 0){
      if(whereClause > 0 ){
        queryText = queryText + 'AND ';  
      }
      queryText = queryText + 'id_partecipanti = ' + idPartecipanti + ' ';
      whereClause++;
    } 
    if(nickname !== 'X'){
      if(whereClause > 0 ){
        queryText = queryText + 'AND ';  
      }
      queryText = queryText + 'id_partecipanti in ' +
      '(select id from pronolegaforum.anagrafica_partecipanti where nickname = ' + '\'' + nickname + '\'' + ' ) ';
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
  queryText = queryText + 'ORDER BY stagione, id_partecipanti, id_competizione';

  db.any(queryText).then(function (listaPronostici) {
    //torno un'oggetto json
    res.status(200).json(listaPronostici);
  })
  .catch(error => { //gestione errore
    res.status(500).json([]);
  });

});

/* POST savePronostici. */
/* salva i pronostici di un partecipante sul DB */
/* old version 
router.post('/savePronostici', function(req, res, next) {

  var stagione = 0;
  if(req.body.stagione){
    stagione = req.body.stagione;
  }
  var idPartecipanti = 0;
  if(req.body.idPartecipanti){
    idPartecipanti = req.body.idPartecipanti;
  }

  var idCompetizione = 0;
  if(req.body.idCompetizione){
    idCompetizione = req.body.idCompetizione;
  } 

  var pronostici = req.body.pronostici;

  var queryText = ' ';
  
  //costruisco la insert
  queryText = 'INSERT INTO pronolegaforum.pronostici ' +
              '( id_partecipanti, stagione, id_competizione, pronostici ) ' +
              'VALUES ( ' + idPartecipanti + ', ' + stagione + ', ' + idCompetizione + ', ';
  var pronoData = '\'{';
  for (var i = 0 ; i < pronostici.length ; i++){
    pronoData = pronoData + '"' + pronostici[i] + '"'; 
    if(i < (pronostici.length - 1)){
      pronoData = pronoData + ' , ';
    }else{
      pronoData = pronoData + ' ';
    }
  }
  pronoData = pronoData + '}\'';
  queryText = queryText + pronoData;
  queryText = queryText + ' )';

  //eseguo la insert
  db.none(queryText)
  .then(() => {
      // success;
      res.status(200).json('OK');
  })
  .catch(error => {
      // error;
      res.status(500).json(error);
  });    

});
*/
/* POST checkPassword */
router.post('/checkPassword', function(req, res, next) {

  var queryText = 'SELECT id, COUNT(*) FROM pronolegaforum.anagrafica_partecipanti WHERE ' +
  'nickname = ' + '\'' + req.body.nickname + '\'' + ' AND ' +
  'password_value = ' + '\'' + req.body.password + '\'' + ' ' +
  'GROUP BY id';

  db.one(queryText).then(function (data) {
    
    if(parseInt(data.count) > 0){
      res.status(200).json(data.id);
    }else{
      res.status(500).json('KO');
    }  
  })
  .catch(error => { //gestione errore
    res.status(500).json('KO '+ '[' + error + ']');
  });  
  
});


router.post('/savePronostici', function(req, res, next) {

  var pronoToSave = req.body.pronostici;

  //gestione transazionale delle insert
  db.tx(function (t) {

    var queryText = 'DELETE FROM pronolegaforum.pronostici ' +
    'WHERE ' + 'id_partecipanti = ' + pronoToSave[0].id_partecipanti + ' AND ' + 
    'stagione = ' + pronoToSave[0].stagione;

    db.none(queryText).then(function () {
      var updates = [];
      for (var x = 0 ; x < pronoToSave.length ; x++){
        //costruisco la insert
        queryText = '';
        queryText = 'INSERT INTO pronolegaforum.pronostici ' +
                    '( id_partecipanti, stagione, id_competizione, pronostici ) ' +
                    'VALUES ( ' + pronoToSave[x].id_partecipanti + ', ' + 
                    pronoToSave[x].stagione + ', ' + 
                    pronoToSave[x].id_competizione + ', ';
        var pronoData = '\'{';
        for (var i = 0 ; i < pronoToSave[x].pronostici.length ; i++){
          pronoData = pronoData + '"' + pronoToSave[x].pronostici[i] + '"'; 
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
      return t.batch(updates);
    });
  })
  .then(function (data) {
    res.status(200).json('OK');
  })
  .catch(function (error) {
    res.status(500).json('KO '+ '[' + error + ']');
  });
  //----------------------------------------------------------

});

router.post('/getDatePronostici', function(req, res, next) {

  var queryText = 'SELECT ' +
  'stagione, ' +
  'TO_CHAR(data_apertura, ' + '\'' + 'YYYY-MM-DD HH24:MI:SS' +  '\'' + ') data_apertura, ' +
  'TO_CHAR(data_chiusura, ' + '\'' + 'YYYY-MM-DD HH24:MI:SS' +  '\'' + ') data_chiusura ' +
  'FROM pronolegaforum.date_pronostici ' +  
  'WHERE '  + 'stagione = ' + req.body.stagione; 

  db.any(queryText).then(function (datePronostici) {

    //torno un'oggetto json
    res.status(200).json(datePronostici);
  })
  .catch(error => { //gestione errore
    res.status(500).json([]);
  });

});

module.exports = router;
