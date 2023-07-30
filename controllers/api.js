const asyncWrapper = require('../middleware/async');
const { runChatbot } = require("../function/chatbot-data-flow");
const db = require('../database/firebase');
const axios = require('axios');
const aiAPI = require('../function/ai-api');
const utils = require('../utils')
const userInfo = asyncWrapper(async (req, res) => {
  if (req.session.userInfo) {
    res.send(req.session.userInfo);
  } else {
    res.status(500).send({ message: "Please authenticate to get userinfo " })
  }
})

const userLocation = asyncWrapper(async (req, res) => {
  if (req.session.userInfo) {
    let { latitude, longitude } = req.body;
    if (!latitude && !longitude) {
      req.session.userLocation = null;
      res.send("Bad")
    } else {
      const { data } = await axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`)
      req.session.userLocation = data;
      res.send('Oks')
    }
  } else {
    res.status(500).send({ message: "Please authenticate" })
  }
})

const chat = asyncWrapper(async (req, res) => {
  const { message } = req.body;
  if (req.session.userInfo) {
    runChatbot(message, req.session.userInfo, req.session.userLocation, (data) => res.send(data))
  } else {
    res.status(500).send({ message: "Please authenticate." })
  }
})

const chatAPI = asyncWrapper(async (req, res) => {

  const { message, apikey, userInfo, location, font } = req.body;
  let { firstName, name } = userInfo;
  if (!message) {
    return res.status(400).send({ message: "Parameter 'message' is not defined." })
  }

  if (!apikey) {
    return res.status(200).send({ message: "The server has requested to put apikey on request body parameters." })
  }
  if (!firstName) {
    return res.status(400).send({ message: "Parameter 'firstName' is not defined." })
  }
  if (!location) {
    return res.status(400).send({ message: "Parameter 'location' is not defined." })
  }
  aiAPI({
    text: message, userInfo: {
      firstName,
      name
    }, location, apikey, botName: req.body.botName
  }, (response) => {

    function replaceCharacters(inputString) {
      const replacedString = inputString.replace(/[A-Za-z]/g, (char) => {
        return utils.font[char] || char;
      });
      return replacedString;
    }

    let resp = replaceCharacters(response)
    if (font != "disable") {
      res.type('json').send(JSON.stringify({
        message: resp
      }, null, 2) + '\n');
    } else {
      res.type('json').send(JSON.stringify({
        message: "Under development!"//response
      }, null, 2) + '\n');
    }
  })
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
    for (let i = 0; i < data.length; i++) {
      if (data[i].user.userID == req.session.userInfo.username) {
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
    for (let i = 0; i < data.length; i++) {
      if (data[i].user.userID == req.session.userInfo.username) {
        userThreadDataID.push(data[i].fid);
      }
    }
    res.redirect('/chat');
    for (let i = 0; i < userThreadDataID.length; i++) {
      db.removeData(`threads/${userThreadDataID[i]}`).then(res => {
        //console.log(res)
      })
    }
  } else {
    res.status(500).send({ message: "Authentication failed" })
  }
})

module.exports = { userInfo, chat, pushThread, getThreadData, clearThread, userLocation, chatAPI };