var express = require('express');
var router = express.Router();
var promisePostGres = require('pg-promise')();
var fs = require('fs');

//per le email con attachments
var nodeMailer = require('nodemailer');
var Excel = require('exceljs'); // LF 16/07/2018 per creare export Excel
//per le email con attachments


//se è definita POSTGRESQL_URI la usa altrimenti usa LocalHost
// postgresql://postgres:root@localhost:5432/postgres
var connectionData = process.env.DATABASE_URL || // URI 'postgres://postgres:root@localhost:5432/postgres';
                    {
                      host : 'localhost',
                      port : 5432,
                      database : 'postgres',
                      user : 'postgres',
                      password : 'root'
                    };

var db  =  promisePostGres(connectionData);               

/* post getAnagraficaCompetizioni. */ 
/* prende le competizioni filtrandole per stagione */
router.post('/getAnagraficaCompetizioni', function(req, res, next) {

  var queryText = 'SELECT ' +
  'id, competizione, nome_pronostico, anni_competizione, punti_esatti, punti_lista, numero_pronostici ' +
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

  var queryText = ' ';
  var whereClause  = 0;

  queryText = 'select ' +
  'id, id_partecipanti, stagione, id_competizione, pronostici ' +
  'FROM pronolegaforum.pronostici ';
  if(stagione !== 0 || idPartecipanti !== 0 || idCompetizione !== 0){
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

/* POST checkPassword */
router.post('/checkPassword', function(req, res, next) {

  var queryText = 'SELECT COUNT(*) from pronolegaforum.anagrafica_partecipanti WHERE ' +
  'nickname = ' + '\'' + req.body.nickname + '\'' + ' AND ' +
  'password_value = ' + '\'' + req.body.password + '\'';

  db.one(queryText).then(function (data) {
    
    if(parseInt(data.count) > 0){
      res.status(200).json('OK');
    }else{
      res.status(500).json('KO');
    }  
  })
  .catch(error => { //gestione errore
    res.status(500).json('KO '+ '[' + error + ']');
  });  
  
});

module.exports = router;
