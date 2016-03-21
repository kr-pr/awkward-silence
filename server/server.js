var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    path = require('path');

var userCtrl = require('./ctrl/user'),
    convoCtrl = require('./ctrl/convo'),
    recordCtrl = require('./ctrl/record');

var app = express();
app   //Add user if valid token content is not in db yet
  .use(bodyParser.json())
  .use(cors())
  .use(express.static(path.join(__dirname, '../public')))
  .use('/deps', express.static(path.join(__dirname,'../node_modules'))) 
  .post('/convo', convoCtrl.create)
  .post('/record', recordCtrl.create)
  .put('/record/:id', recordCtrl.update)
  .get('/convos', convoCtrl.list)
  .get('/convo/:id', convoCtrl.show)
  .get('/*', function(req, res){ res.sendFile(path.resolve(__dirname, 'index.html')); })
  .listen(8777);
