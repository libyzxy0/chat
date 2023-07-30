const axios = require("axios");
module.exports = async ({ api, event, config }) => {

  try {
    let data = event.body.split(" ");
    data.shift();
    const text = data.join(" ");

    const text1 = text.substr(0, text.indexOf(' => '));

    const text2 = text.split(" => ").pop();



    if (!text1 || !text2) {

      return api.sendMessage(`Usage: ${config.prefix}teach hi => hello`, event.threadID, event.messageID);

    }



    const response = await axios.get(`https://api.heckerman06.repl.co/api/other/simsimiteach?input=${encodeURIComponent(text1)}&output=${encodeURIComponent(text2)}`);

    api.sendMessage(`Your ask: ${text1}\Sim respond: ${text2}`, event.threadID, event.messageID);

  } catch (error) {

    console.error("An error occurred:", error);

    api.sendMessage("Oops! Something went wrong.", event.threadID, event.messageID);

  }

};
