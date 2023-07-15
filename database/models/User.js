const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    unique: false
  },
  lastName: {
    type: String,
    required: true,
    unique: false
  },
  password: {
    type: String,
    required: true,
    unique: false
  }, 
  signedDate: {
    type: Date,
    required: true,
    unique: false
  }
});
module.exports = mongoose.model('User', userSchema);;