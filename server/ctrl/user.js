var mongoose = require('mongoose');

var User = require('../schemas/User.js');
    
module.exports = {
  create: function(auth_id){
    var newItem = new User({auth_id: auth_id});
    return newItem.save();
  }
};