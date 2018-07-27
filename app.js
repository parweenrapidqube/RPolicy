/**
@author: Rahul M. Desai
@version: 1.0
@date: 03/02/2018
@Description: Hyperledger Fabric Blockchain sample client
**/
//this is the start of the application 
//from here the blockchain enviornment setup would start and our node js port for webservice would also start running
'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();
var cors = require('cors');

var log4js = require('log4js');
var config = require('config');
// to run project on https using my local machine ssl key and certificate.
var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync( '/home/parweenn/parween/ReadyPolicy/RPBackend/RPolicy/localhost.key' ),
    cert: fs.readFileSync( '/home/parweenn/parween/ReadyPolicy/RPBackend/RPolicy/localhost.cert' ),
    requestCert: false,
    rejectUnauthorized: false
};
var port1 = process.env.PORT || 8083;

//const log4js = require('./log4js-node/lib/log4js');
log4js.configure({
    appenders: { readypolicy: { type: 'file', filename: 'readypolicy.log' } },
    categories: { default: { appenders: ['readypolicy'], level: 'error' } }
  });
  const logger = log4js.getLogger('readypolicy');


const port = process.env.PORT || 8082;
//const port = process.env.PORT || 9595;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//app.use(loggerpac('dev'));
app.use(cors());
require('./routes')(router);
app.use('/', router);
app.listen(port);


console.log(`App Runs on ${port}`);
logger.fatal(`Server has started App is Running on Port ${port}`);


var server = https.createServer( options, app );

server.listen( port1, function () {
    console.log( 'Express server listening on https port ' + port1 );
} );
