var express = require('express');
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet'); //security
var dbManager = require('./dbModule/dbManager');

dbManager.initDb(); //inizializzo il db

//file unico var restControllerPG = require('./routes/restControllerPG'); //PostGres SQL
var restControllerClassifica = require('./routes/restControllerClassifica'); //PostGres SQL
var restControllerPartecipanti = require('./routes/restControllerPartecipanti'); //PostGres SQL
var restControllerPronostici = require('./routes/restControllerPronostici'); //PostGres SQL

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors()); //CORS handling

app.use(helmet()); //security
app.use(compression()); //Compress all routes

app.use(function(req, res, next) {
  // IE9 doesn't set headers for cross-domain ajax requests
  if(typeof(req.headers['content-type']) === 'undefined'){
      req.headers['content-type'] = "application/json; charset=UTF-8";
  }
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('dev'));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.options('*', cors()); // include before other routes

//file unico app.use('/', restControllerPG); //solo per le richieste ajax e PortGress Sql
//indirizza le richieste a seconda di come cominciano
app.use('/classifica', restControllerClassifica); //solo per le richieste ajax e PortGress Sql
app.use('/partecipanti', restControllerPartecipanti); //solo per le richieste ajax e PortGress Sql
app.use('/pronostici', restControllerPronostici); //solo per le richieste ajax e PortGress Sql

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
