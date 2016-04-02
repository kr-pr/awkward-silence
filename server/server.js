var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    path = require('path'),
    jwt = require('express-jwt')
    jwtSecret = require('./jwt-secret');

var convoCtrl = require('./ctrl/convo'),
    recordCtrl = require('./ctrl/record');

var app = express();

var jwtCheck = jwt(jwtSecret);

app   //Add user if valid token content is not in db yet
  .use(bodyParser.json())
  .use(cors())
  .use(express.static(path.join(__dirname, '../public')))
  .use('/deps', express.static(path.join(__dirname,'../node_modules'))) 
  .delete('/api/convo/:id', jwtCheck, convoCtrl.delete)
  .delete('/api/record/:id', jwtCheck, recordCtrl.delete)
  .post('/api/convo', jwtCheck, convoCtrl.create)
  .post('/api/record', jwtCheck, recordCtrl.create)
  .put('/api/record/:id', jwtCheck, recordCtrl.update)
  .get('/api/convos', jwtCheck, convoCtrl.list)
  .get('/api/convo/:id', jwtCheck, convoCtrl.show)
  .get('/api/view/:id', jwtCheck, convoCtrl.showView)
  .get('/*', function(req, res){ res.sendfile('/public/index.html', { root: __dirname + '/..' } ); })
  .listen(8777);