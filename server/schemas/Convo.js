var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    clusterPoint = require('./TimeSeries.js').clusterPoint;

var convoSchema = new Schema({
  user:         {type: Schema.Types.ObjectId, ref: 'user', required: true},
  note:         {type: String, required: true }, 
  timeline:     [clusterPoint],
  records:      [{type: Schema.Types.ObjectId, ref: 'record'}]
});

convoSchema.pre("update", function() {
  this.update({}, {$set: {updAt: new Date()}});
});

module.exports = mongoose.model("convo", convoSchema);