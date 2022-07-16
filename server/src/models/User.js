const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
  {
    userName: { type: String, default: '' },
    password: { type: String, default: '' },
    email: { type: String, default: '' },
    userType: { type: String, default: 'user'},
    userAvatar: { type: String, default: '' },
    userCover: { type: String, default: ''},
    biography: { type: String, default: ''},
    gender: { type: String, default: ''},
    firstName: { type: String, default: ''},
    lastName: { type: String, default: ''},
    DOB: { type: String },
    categories: { type: Array, default: [] }
  }, {
    timestamps: true
});


module.exports = mongoose.model('Users', User);