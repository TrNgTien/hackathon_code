const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Categorie = new Schema(
  {
    categoryName: { type: String },
  }, {
    timestamps: true
});


module.exports = mongoose.model('Categories', Categorie);