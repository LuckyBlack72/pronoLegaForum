var express = require('express');
var router = express.Router();
var dbCall = require('../dbModule/dbManagerSincronizzazioneDati');
//var fs = require('fs');


//indirizza le richieste a seconda di come cominciano
// le richieste qui sono tutte sotto richieste di /classifica

// per le email con attachments
// var nodeMailer = require('nodemailer');
// var Excel = require('exceljs'); // LF 16/07/2018 per creare export Excel
// per le email con attachments

/* post getAnagraficaCompetizioni. */ 
/* prende le competizioni filtrandole per stagione */
/*
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

router.post('/getStagioni', function(req, res, next) {

  var queryText = 'SELECT ' +
  'DISTINCT stagione ' +
  'FROM pronolegaforum.pronostici ' +  
  'ORDER BY stagione';

  db.any(queryText).then(function (stagioni) {

    //torno un'oggetto json
    res.status(200).json(stagioni);
  })
  .catch(error => { //gestione errore
    res.status(500).json([]);
  });

});
*/

/* nuova gestione */
/* post getAnagraficaCompetizioni. */ 
/* prende le competizioni filtrandole per stagione */
router.post('/getLogAggiornamenti', function(req, res, next) {

  dbCall.getLogAggiornamenti(req).then(function (data) { //torna una promise
    res.status(200).json(data);
  })
  .catch(error => { //gestione errore
    res.status(500).json([]);
  });  

});

module.exports = router;
