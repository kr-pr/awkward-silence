var mongoose = require('mongoose');

var Convo = require('../schemas/Convo.js'),
    User = require('../schemas/User.js');
    
module.exports = {
  create: function(req, res, next){
    var newItem = new Convo(req.body);
    return newItem.save()
    .bind({})
    .then(function(convo){
      this.convo = convo;
      return User.findByIdAndUpdate(convo.user, { $push: {"convos": convo._id} });
    })  
    .then(function(result) { res.send(this.convo); })
    .catch(function(err) { res.send(err); }); 
  },
  list: function(req, res, next){
    User.find({auth_id: req.user.name})
    .select('-__v')
    .populate('convos', '_id note timeline')
    .exec()
    .then(function(result){ res.send(result);})
    .catch(function(err) { res.send(err);}); 
  },
  show: function(req, res, next){
    Convo.findById(req.params.id)
    .populate('records', '_id note')
    .exec()
    .then(function(result){ res.send(result);})
    .catch(function(err) { res.send(err);}); 
  }
};