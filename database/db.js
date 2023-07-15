const mongoose = require('mongoose');
const User = require('./models/User');

const newUser = (data) => {
  return new Promise((resolve, reject) => {
    const user = new User(data);
    user.save()
      .then((userData) => {
        resolve(userData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getUsers = (callback) => {
  return new Promise((resolve, reject) => {
    User.find()
      .then((users) => {
        resolve(users);
        callback(users)
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = {
  newUser, 
  getUsers
}