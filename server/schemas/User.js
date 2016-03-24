var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  auth_id:   {type: String, unique: true, required: true, index: true},
  name:      {type: String},
  convos:    [{type: Schema.Types.ObjectId, ref: 'convo'}]
});

module.exports = mongoose.model("user", userSchema);