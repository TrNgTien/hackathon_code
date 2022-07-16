const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    commentContent: { type: String },
    createdAt: { type: Date, default: new Date().toLocaleString() },
    userID: { type: Array, ref: 'User' },
    postID: { type: Array, ref: 'Post' },
  }, {
    timestamps: true
});


module.exports = mongoose.model('Comments', Comment);