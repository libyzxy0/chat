const express = require('express');
const router = express.Router();
const session = require('express-session');
const db = require("../database/firebase");
// Add session middleware
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

router.post('/login', async (req, res) => {
  let array = await db.readData('users');
  console.log(req.body);
  let { username: un, password: ps } = req.body;
  if (array.find(({ username }) => username === un)) { 
    if(array.find(({ password }) => password === ps)) {
      let user = array.find(({ password }) => password === ps);
      req.session.userInfo = user;
       res.send({ code: 200 })
    } else {
      res.send({ code: 400 })
    }
  } else {
    res.send({ code: 404 })
  }
});

router.post('/signup', async (req, res) => {
  let { username: un, firstName, lastName, password } = req.body;
  console.log(req.body)
  let array = await db.readData('users');
  if (array.find(({ username }) => username === un)) { 
    return res.status(500).send({ code: 500 })
  }
  if(!!req.body) {
    try {
    db.writeData('users', {
      username: un, 
      firstName, 
      lastName, 
      password, 
      signedDate: new Date()
    })
    .then((response) => {
      res.status(200).send({ code: 200 })
    })
    .catch((err) => {
      console.log(err)
      res.status(400).send({ code: 400 })
    })
  } catch (err) {
      console.log(err);
   }
  }
});

module.exports = router;
