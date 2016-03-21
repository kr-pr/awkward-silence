var mongoose = require('mongoose');

var Record = require('../schemas/Record.js'),
    Convo = require('../schemas/Convo.js');
    
module.exports = {
  create: function(req, res, next){
    var newItem = new Record(req.body);
    return newItem.save()
    .bind({})
    .then(function(record){
      this.record = record;
      return Convo.findByIdAndUpdate(record.convo, { $push: {"records": record._id} });
    })  
    .then(function(result) { res.send(this.record); })
    .catch(function(err) { res.send(err); }); 
  },
  update: function(req, res, next){
    var field = req.body.hasOwnProperty('comments')? 'comments':'points';
    Record.findByIdAndUpdate(req.params.id, { $push: {field: req.body[field]} })
    .then(function(result) { res.send('OK'); })
    .catch(function(err) { res.send(err); }); 
  }
};