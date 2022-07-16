const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestIssue = new Schema(
  {
    requestContent: { type: String },
    createdAt: { type: Date, default: new Date().toLocaleString() },
    isAnonymous: { type: Boolean },
    userID: { type: Array, ref: 'User' },
    categoryID: { type: Array, ref: 'Category' },
  }, {
    timestamps: true
});


module.exports = mongoose.model('RequestIssues', RequestIssue);