const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    commentContent: { type: String },
    createdAt: { type: Date, default: new Date().toLocaleString() },
    userID: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  }, {
    timestamps: true
});


module.exports = mongoose.model('Comments', Comment);