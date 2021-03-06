var express = require('express');
var router = express.Router();
var dbManager = require('../dbModule/dbManager');
var db = dbManager.getDb();
var dbCall = require('../dbModule/dbManagerPartecipanti');
var mailManager = require('../utils/mailManager');
var generator = require('generate-password');
//var fs = require('fs');

//indirizza le richieste a seconda di come cominciano
// le richieste qui sono tutte sotto richieste di /partecipanti

//per le email con attachments
//var nodeMailer = require('nodemailer');
//var Excel = require('exceljs'); // LF 16/07/2018 per creare export Excel
//per le email con attachments

/* post getAnagraficaPartecipanti. */ 
/* prende i dati dei partecipanti filtrandoli eventualmente per nickname */
/*
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
*/

/*
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
*/


/* POST checkPassword */
/*
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
*/

//nuova gestione 
router.post('/getAnagraficaPartecipanti', function(req, res, next) {

  dbCall.getAnagraficaPartecipanti(req).then(function (data) { //torna una promise
    res.status(200).json(data);
  })
  .catch(error => { //gestione errore
    res.status(500).json([]);
  });  

});

router.post('/saveAnagraficaPartecipanti', function(req, res, next) {

  dbCall.saveAnagraficaPartecipanti(req).then(function(data){ //torna una promise
      res.status(200).json('OK');
  })
  .catch(error => { //gestione errore
    res.status(500).json(error);
  });  
  
});

router.post('/updateAnagraficaPartecipanti', function(req, res, next) {

  dbCall.updateAnagraficaPartecipanti(req).then(function(data){ //torna una promise
      res.status(200).json('OK');
  })
  .catch(error => { //gestione errore
    res.status(500).json(error);
  });  
  
});

router.post('/checkPassword', function(req, res, next) {

  dbCall.checkPassword(req).then(function(data){ //torna una promise
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

router.post('/checkAdminPassword', function(req, res, next) {

  dbCall.checkAdminPassword(req).then(function(data){ //torna una promise
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

router.post('/recoverPassword', function(req, res, next) {

  dbCall.checkEmail(req).then(function(data){ //torna una promise
    if(parseInt(data.count) > 0){
      var dummyPassword = generator.generate({
        length: 10,
        numbers: true,
      });
      dbCall.resetPassword(data.nickname,dummyPassword).then(function(){
        mailManager.sendRecoverPasswordEmail(data.nickname, req.body.email, dummyPassword);
        res.status(200).json('OK');
      })
      .catch(error => { //gestione errore
        res.status(500).json('KO '+ '[' + error + ']');
      });  
    }else{
      res.status(500).json('KO');
    }  
  })
  .catch(error => { //gestione errore
    res.status(500).json('KO '+ '[' + error + ']');
  });  
  
});

module.exports = router;
