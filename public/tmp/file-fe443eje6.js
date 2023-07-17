//File will be deleted in 24 hours.
module.exports.config = {
  name: "shoti",
  version: "1.0.0",
  hasPermission: 0,
  credits: "libyzxy0",
  description: "Generate a random tiktok video",
  hasPermssion: 0,
  commandCategory: "other",
  usage: "[]",
  cooldowns: 5,
  usePrefix: true
};

module.exports.run = async function({ api, event, args }) {
  try {
  api.setMessageReaction("💗", event.messageID, (err) => {
  }, true);
  api.sendTypingIndicator(event.threadID, true);
  const { messageID, threadID } = event;
  const fs = require("fs");
  const axios = require("axios");
  const request = require('request');
  const content = args.join(" ");
  if (!args[0]) api.sendMessage("Downloading...", threadID, messageID);
  let data = await axios.get('https://shoti-api.libyzxy0.repl.co/api/get-shoti?apikey=jj');
  var file = fs.createWriteStream(__dirname + '/cache/tkdl/tiktokdl.mp4');
  let url = data.data.data.url;
  var rqs = request(encodeURI(url));
  rqs.pipe(file);
  file.on('finish', () => {
    setTimeout(function() {
      return api.sendMessage({
        body: `Downloaded Successfull(y).`,
        attachment: fs.createReadStream(__dirname + '/cache/tkdl/tiktokdl.mp4')
      }, threadID, messageID)
    }, 5000)
  })
   } catch (error) {
    api.sendMessage(`Shoti CMD ERROR: ${err}`, event.threadID, event.messageID);
   }
};