const asyncWrapper = require('../middleware/async');

const loginPage = asyncWrapper(async (req, res) => {
	if(req.session.userInfo) {
    res.redirect('/');
  } else {
    res.render('login');
  }
})
const signupPage = asyncWrapper(async (req, res) => {
	if(req.session.userInfo) {
    res.redirect('/');
  } else {
    res.render('signup');
  }
})
const chat = asyncWrapper(async (req, res) => {
	if(!req.session.userInfo) {
    res.redirect('/login');
  } else {
    res.render('chat');
  }
})

module.exports = {
  loginPage, 
  signupPage, 
  chat
}