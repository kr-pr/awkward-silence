var mongoose = require('mongoose');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/test');

var User = require('../schemas/User.js');
    
module.exports = {
  create: function(req, res, next){
    var newItem = new User(req.body);
    newItem.save()
    .then(function(result) { console.log(result); })
    .catch(function(err) { console.log(err); }); 
  }
};