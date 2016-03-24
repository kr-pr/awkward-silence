var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    path = require('path'),
    jwt = require('express-jwt');

var convoCtrl = require('./ctrl/convo'),
    recordCtrl = require('./ctrl/record');

var app = express();

var jwtCheck = jwt({
  secret: new Buffer('awSVKblVWIFxmjexTdjg6Lo2F-DTadrWou2tVTV8ZvG6eSDyU3GtaIcmN3UhEn4Q', 'base64'),
  audience: 'nacrIJP96MTF6yUTXredeH4fvui6AlFo'
});

app   //Add user if valid token content is not in db yet
  .use(bodyParser.json())
  .use(cors())
  .use(express.static(path.join(__dirname, '../public')))
  .use('/deps', express.static(path.join(__dirname,'../node_modules'))) 
  .post('/api/convo', jwtCheck, convoCtrl.create)
  .post('/api/record', jwtCheck, recordCtrl.create)
  .put('/api/record/:id', jwtCheck, recordCtrl.update)
  .get('/api/convos', jwtCheck, convoCtrl.list)
  .get('/api/convo/:id', jwtCheck, convoCtrl.show)
  .get('/api/view/:id', jwtCheck, convoCtrl.showView)
  .get('/*', function(req, res){ res.sendfile('/public/index.html', { root: __dirname + '/..' } ); })
  .listen(8777);