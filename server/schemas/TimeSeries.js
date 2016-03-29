var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var timeArraySchema = new Schema({
    time: {type: Number, required: true},
    cluster: {type: Number, required: true},
    records: [Number],
    props: [Number]
});

var numberSchema = new Schema({
    value: {type: Number, required: true}
});

var textSchema = new Schema({
    value: {type: String, required: true}
});

module.exports = {
  clusterPoint: timeArraySchema,
  recordPoint:  numberSchema,
  comment:      textSchema  
};