var dbManager = require('./dbManager');
var db = dbManager.getDb();

/* getAnagraficaCompetizioni. */ 
/* prende le competizioni filtrandole per stagione */
function getAnagraficaCompetizioni (req) {

  var queryText = 'SELECT ' +
  'id, competizione, nome_pronostico, anni_competizione, punti_esatti, punti_lista, numero_pronostici, logo, tipo_competizione ' +
  'FROM pronolegaforum.anagrafica_competizioni ' +  
  'WHERE '  + req.body.stagione + ' = ANY (anni_competizione) ' + 
  'ORDER BY id';

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

module.exports = { getAnagraficaCompetizioni, getStagioni };
