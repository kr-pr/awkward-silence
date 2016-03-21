var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    recordPoint = require('./TimeSeries').recordPoint,
    comment = require('./TimeSeries').comment;

var recordSchema = new Schema({
  note:      { type: String, required: true },
  convo:     { type: Schema.Types.ObjectId, ref: 'convo' },
  points:    [ recordPoint ],
  comments:  [ comment ]
});

module.exports = mongoose.model('record', recordSchema);
