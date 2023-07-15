const asyncWrapper = require('../middleware/async');
const { runChatbot } = require("../function/chatbot-data-flow");
const db = require('../database/firebase');

const userInfo = asyncWrapper(async (req, res) => {
  if (req.session.userInfo) {
    res.send(req.session.userInfo);
  } else {
    res.status(500).send({ message: "Please authenticate to get userinfo " })
  }
})
const chat = asyncWrapper(async (req, res) => {
  const { message } = req.body;
  if(req.session.userInfo) {
    runChatbot(message, req.session.userInfo, (data) => res.send(data))
  } else {
    res.status(500).send({ message: "Please authenticate." })
  }
})

const pushThread = asyncWrapper(async (req, res) => {
  if (req.session.userInfo) {
    db.writeData('threads', req.body).then(resp => {
      res.send(resp);
    })
  } else {
    res.status(500).send({ message: "Authentication failed" })
  }
})
const getThreadData = asyncWrapper(async (req, res) => {
  if (req.session.userInfo) {
    let data = await db.readData('threads');
    let userThreadData = [];
    for(let i = 0;i < data.length;i++) {
      if(data[i].user.userID == req.session.userInfo.username) {
        userThreadData.push(data[i]);
      } 
    }
    res.send(userThreadData);
  } else {
    res.status(500).send({ message: "Authentication failed" })
  }
})

const clearThread = asyncWrapper(async (req, res) => {
  if (req.session.userInfo) {
    let data = await db.readData('threads');
    let userThreadDataID = [];
    for(let i = 0;i < data.length;i++) {
      if(data[i].user.userID == req.session.userInfo.username) {
        userThreadDataID.push(data[i].fid);
      } 
    }
    res.redirect('/');
    for(let i = 0;i < userThreadDataID.length;i++) {
      db.removeData(`threads/${userThreadDataID[i]}`).then(res => {
        //console.log(res)
      })
    }
  } else {
    res.status(500).send({ message: "Authentication failed" })
  }
})

module.exports = { userInfo, chat, pushThread, getThreadData, clearThread };