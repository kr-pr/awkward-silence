var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/test');

var userCtrl = require('./user'),
    Convo = require('../schemas/Convo'),
    User = require('../schemas/User'),
    Record = require('../schemas/Record'),
    TimeLine = require('./timeline');
    
module.exports = {
  create: function(req, res, next){
    var newItem = new Convo(req.body);
    return newItem.save()
    .bind({})
    .then(function(convo){
      this.convo = convo;
      return User.findByIdAndUpdate(convo.user, { $push: {"convos": convo._id} }, {new: true});
    })  
    .then(function(result) { res.send(this.convo); })
    .catch(function(err) { res.send(err); }); 
  },
  delete:  function(req, res, next){
    Convo.findById(req.params.id)
    .populate('records', '_id note')
    .exec()
    .then(function(convo){
      this.convo = convo;
      return User.findByIdAndUpdate(convo.user, { $pull: {"convos": convo._id} }, {new: true});
    })
    .then(function(result){
      return Record.remove({convo: this.convo._id});
    })
    .then(function(result){
      return Convo.remove({_id: this.convo._id});
    })  
    .then(function(result) { res.status(204).send(result); })
    .catch(function(err) { res.send(err); }); 
  },
  list: function(req, res, next){
    User.find({auth_id: req.user.sub})
    .select('-__v')
    .populate('convos', '_id note timeline')
    .exec()
    .then(function(result){
      if (!result.length) return userCtrl.create(req.user.sub); 
      else return result;
     })
    .then(function(result){ res.send(result); })
    .catch(function(err) { res.send(err);});
  },
  show: function(req, res, next){
    Convo.findById(req.params.id)
    .populate('records', '_id note')
    .exec()
    .then(function(result){ res.send(result);})
    .catch(function(err) { res.send(err);}); 
  },
    showView: function(req, res, next){
    Convo.findById(req.params.id)
    .populate('records', 'points comments')
    .exec()
    .then(function(convo){
      var newTimeLine = TimeLine.update(convo);
      console.log(newTimeLine);
      var query = Convo.findByIdAndUpdate(req.params.id, { $set: {"timeline": newTimeLine} }, {new: true});
      return query.exec();
    })
    .then(function(convo){ res.send(convo);})
    .catch(function(err) { res.send(err);}); 
  }
};