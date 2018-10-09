var dbManager = require('./dbManager');
var db = dbManager.getDb();

/* getLogAggiornamenti. */ 
/* prende i dati dell'ultimo aggiornamento delle tabelle */
function getLogAggiornamenti (req) {

  var queryText = 'SELECT ' +
  'tabella, to_char(data_aggiornamento,' + '\'' + 'DD-MM-YYYY' + '\'' + ') data_aggiornamento ' +
  'FROM pronolegaforum.log_aggiornamenti ' +
  'ORDER BY tabella';

  return db.any(queryText);

}


module.exports = { 
                    getLogAggiornamenti
                  };
