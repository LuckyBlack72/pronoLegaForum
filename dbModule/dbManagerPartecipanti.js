var dbManager = require('./dbManager');
var db = dbManager.getDb();
//var fs = require('fs');

//per le email con attachments
//var nodeMailer = require('nodemailer');
//var Excel = require('exceljs'); // LF 16/07/2018 per creare export Excel
//per le email con attachments

/* post getAnagraficaPartecipanti. */ 
/* prende i dati dei partecipanti filtrandoli eventualmente per nickname */


function getAnagraficaPartecipanti(request) {

  var nickname = ' ';
  if(request.body.nickname){
    nickname = request.body.nickname;
  }

  var queryText = 'SELECT ' +
  'id, nickname, email_address, password_value ' +
  'FROM pronolegaforum.anagrafica_partecipanti ';
  if(nickname !== ' '){
    queryText = queryText + 'WHERE nickname = ' + '\'' + nickname + '\'';
  } else {
    queryText = queryText + 'ORDER BY nickname';
  } 

  return db.any(queryText);

}


function saveAnagraficaPartecipanti(request) {

  var nickname = request.body.anagraficaPartecipanti.nickname;
  var email_address = request.body.anagraficaPartecipanti.email_address;
  var password_value = request.body.anagraficaPartecipanti.password_value;

  var queryText = ' ';
  
  //costruisco la insert
  queryText = 'INSERT INTO pronolegaforum.anagrafica_partecipanti ' +
              '( nickname, email_address, password_value ) ' +
              'VALUES ( ' + '\'' + nickname + '\'' + ', ' + '\'' + email_address + '\'' + ', ' + 'MD5(' + '\'' + password_value + '\'' + ')' + ' )';

  //eseguo la insert

  return db.none(queryText);

}

function updateAnagraficaPartecipanti(request) {

  var nickname = request.body.anagraficaPartecipanti.nickname;
  var email_address = request.body.anagraficaPartecipanti.email_address;
  var password_value = request.body.anagraficaPartecipanti.password_value;

  var queryText = ' ';
  
  //costruisco la insert
  queryText = 'UPDATE pronolegaforum.anagrafica_partecipanti ' +
              'SET ' + 
              'email_address = ' + '\'' + email_address + '\'';
  if (password_value !== 'ZYZYZY') {
    queryText = queryText + ', ' +
    'password_value = ' + 'MD5(' + '\'' + password_value + '\'' + ') ';
  }
  queryText = queryText + 'WHERE nickname = ' + '\'' + nickname + '\'';

  //eseguo update
  return db.none(queryText);

}

/* POST checkPassword */

function checkPassword(request) {

  var queryText = 'SELECT id, COUNT(*) FROM pronolegaforum.anagrafica_partecipanti WHERE ' +
  'nickname = ' + '\'' + request.body.nickname + '\'' + ' AND ' +
  'password_value = ' + 'MD5(' + '\'' + request.body.password + '\'' + ') ' + //to encrypt password
  'GROUP BY id';

    return db.one(queryText);

}

function checkAdminPassword(request) {

  var queryText = 'SELECT COUNT(*) FROM pronolegaforum.admin_password WHERE ' +
  'password = ' + 'MD5(' + '\'' + request.body.password + '\'' + ')'; //to encrypt password

  return db.one(queryText);


}

function checkEmail(request) {

  var queryText = 'SELECT nickname, COUNT(*) FROM pronolegaforum.anagrafica_partecipanti WHERE ' +
  'email_address = ' + '\'' + request.body.email + '\'' +
  'GROUP BY nickname';

  return db.one(queryText);

}

function resetPassword(nickname) {

  var queryText = ' ';
  var dummyPassword =  '1234';
  
  //costruisco la insert
  queryText = 'UPDATE pronolegaforum.anagrafica_partecipanti ' +
              'SET ' + 
              'password_value = ' + 'MD5(' + '\'' + dummyPassword + '\'' + ') ' +
              'WHERE nickname = ' + '\'' + nickname + '\'';

  //eseguo update
  return db.none(queryText);

}


module.exports = {

    getAnagraficaPartecipanti,
    saveAnagraficaPartecipanti,
    updateAnagraficaPartecipanti,
    checkPassword,
    checkAdminPassword,
    checkEmail,
    resetPassword

};
