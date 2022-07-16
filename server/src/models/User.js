const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
  {
    userName: { type: String },
    password: { type: String, default: '' },
    email: { type: String, default: '' },
    userType: { type: String, default: 'user'},
    userAvatar: { type: String, default: '' },
    userCover: { type: String, default: ''},
    biography: { type: String, default: ''},
    gender: { type: String, default: ''},
    fullName: { type: String, default: ''},
    DOB: { type: String, default: ''},
    identityNumber: { type: String, default: ''},
    certificate: { type: String, default: ''},
    categories: { type: Array, default: [] }
  }, {
    timestamps: true
});


module.exports = mongoose.model('Users', User);