const express = require('express');
const router = express.Router();
const session = require('express-session');
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
const cookieParser = require("cookie-parser");
router.use(express.json());
router.use(cookieParser());
const {
  loginPage, 
  signupPage, 
  chat, 
  dashboardPage
} = require("../controllers/pages.js");
router.get('/chat', chat);
router.get('/login', loginPage);
router.get('/signup', signupPage);
router.get('/', dashboardPage);
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
module.exports = router;