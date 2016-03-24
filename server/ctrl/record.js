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
    var query;
    if (req.body.hasOwnProperty('comments'))
      query = Record.findByIdAndUpdate(req.params.id, { $push: {"comments": req.body.comments} }, {new: true});
    else if (req.body.hasOwnProperty('points'))
      query = Record.findByIdAndUpdate(req.params.id, { $push: {"points": req.body.points} }, {new: true});
    else throw new Error("Required field missing in request body");
    query.exec()
    .then(function(result) { res.send({comments: result.comments.length, points: result.points.length}); })
    .catch(function(err) { res.send(err); }); 
  }
};