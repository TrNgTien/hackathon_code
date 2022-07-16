const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema(
  {
    postContent: { type: String },
    numberUp: { type: Number, default: 0 },
    numberDown: { type: Number, default: 0 },
    createdAt: { type: Date, default: new Date().toLocaleString() },
    userID: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    authorID: { type: Schema.Types.ObjectId, ref: 'Usser' },
    categoryID: { type: Array, ref: 'Category' },
  }, {
    timestamps: true
});


module.exports = mongoose.model('Posts', Post);