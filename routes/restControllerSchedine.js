var express = require('express');
var router = express.Router();
var dbCall = require('../dbModule/dbManagerSchedineSettimanali');
var mailManager = require('../utils/mailManager');

router.post('/getAnagraficaSchedine', function(req, res, next) {

    dbCall.getAnagraficaSchedine(req).then(function (data) { //torna una promise
      res.status(200).json(data);
    })
    .catch(error => { //gestione errore
      res.status(500).json([]);
    });  
  
});

router.post('/saveAnagraficaSchedine', function(req, res, next) {

    dbCall.saveAnagraficaSchedine(req).then(function (data) { //torna una promise
        res.status(200).json(data);
    })
    .catch(error => { //gestione errore
        res.status(500).json([]);
    });  

});

router.post('/getNewSettimanaSchedina', function(req, res, next) {

    dbCall.getNewSettimanaSchedina(req).then(function (data) { //torna una promise
        res.status(200).json(data);
    })
    .catch(error => { //gestione errore
        res.status(500).json([]);
    });  

});

router.post('/getPronosticiSettimanali', function(req, res, next) {

    dbCall.getPronosticiSettimanali(req).then(function (data) { //torna una promise
        res.status(200).json(data);
    })
    .catch(error => { //gestione errore
        res.status(500).json([]);
    });  

});


router.post('/getPronosticiSettimanaliPerClassifica', function(req, res, next) {

  dbCall.getPronosticiSettimanaliPerClassifica(req).then(function (data) { //torna una promise
      res.status(200).json(data);
  })
  .catch(error => { //gestione errore
      res.status(500).json([]);
  });  

});

/* post savePronostici */
/* salva i pronostici di un utente*/
router.post('/savePronosticiSettimanali', function(req, res, next) {

    dbCall.savePronosticiSettimanali(req).then(function(data){ //torna una promise
      mailManager.notifyInsertedProno(req.body.nickname);
      res.status(200).json('OK');
    })
    .catch(error => { //gestione errore
      res.status(500).json('KO '+ '[' + error + ']');
    });
  
});

/* Lista delle stagioni delle schedine */
router.post('/getStagioni', function(req, res, next) {

    dbCall.getStagioni().then(function (data) { //torna una promise
      res.status(200).json(data);
    })
    .catch(error => { //gestione errore
      res.status(500).json([]);
    });  
  
  });

  router.post('/getUtentiConPronosticiSettimanali', function(req, res, next) {

    dbCall.getUtentiConPronosticiSettimanali(req).then(function (data) { //torna una promise
      res.status(200).json(data);
    })
    .catch(error => { //gestione errore
      res.status(500).json([]);
    });  
  
  });

module.exports = router;