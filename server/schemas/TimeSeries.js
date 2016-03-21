var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var timeNumberSchema = new Schema({
    time: {type: Date, required: true, default: Date.now},
    value: {type: Number, required: true}
});

var timeTextSchema = new Schema({
    time: {type: Date, required: true, default: Date.now},
    value: {type: String, required: true}
});

module.exports = {
  clusterPoint: timeNumberSchema,
  recordPoint:  timeNumberSchema,
  comment:      timeTextSchema  
};