const express = require('express');
const router = express.Router();
const session = require('express-session');

// Add session middleware
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
const {
  userInfo, 
  chat, 
  pushThread, 
  getThreadData, 
  clearThread
} = require("../controllers/api.js");

router.post('/user-info', userInfo);
router.post('/chat', chat);
router.post('/push-thread', pushThread)
router.post('/get-thread-data', getThreadData)
router.get('/clear', clearThread);

module.exports = router;