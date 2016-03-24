var Convo = require('../schemas/Convo');
    
module.exports = {
  update: function(convo){
    var points = [];
    convo.records
    .forEach(function(record){
      if (record._doc.hasOwnProperty('points') && record._doc.points.length)
        points = record._doc.points
         .map(function(item) {console.log(item); return {time: item.time, value: item.value};});
        console.log('pts:', points);
    });

    return points;
  }
};