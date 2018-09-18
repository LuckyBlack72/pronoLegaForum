var promisePostGres = require('pg-promise')();
var connectionData = process.env.DATABASE_URL || // URI 'postgres://postgres:root@localhost:5432/postgres';
                    {
                      host : 'localhost',
                      port : 5432,
                      database : 'postgres',
                      user : 'postgres',
                      password : 'root'
                    };

var _db;

function initDb() {
    
    if (_db) {
        console.warn("Trying to init DB again!");
    }else{
        _db  =  promisePostGres(connectionData); 
    }

}

function getDb() {
    
    return _db;
}

module.exports = {
    getDb,
    initDb
};