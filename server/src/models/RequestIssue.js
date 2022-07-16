const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestIssue = new Schema(
  {
    requestTitle: { type: String },
    requestContent: { type: String },
    createdAt: { type: Date, default: new Date().toLocaleString() },
    isAnonymous: { type: Boolean, default: false },
    userID: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    categoryID: { type: Array, ref: 'Category' },
  }, {
    timestamps: true
});


module.exports = mongoose.model('RequestIssues', RequestIssue);