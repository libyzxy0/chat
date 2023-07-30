const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const request = require("request");

module.exports = async ({ api, input }) => {
  const data = input.split(" ");
  if (data.length < 2) {
    api.sendMessage("Invalid use of command!", "text");
  } else {
    try {
      data.shift();
      const configuration = new Configuration({
        apiKey: process.env.OPEN_AI_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const response = await openai.createImage({
        prompt: data.join(" "),
        n: 1,
        size: "1024x1024",
      });
      let url = response.data.data[0].url;
      api.sendMessage({ attachment: { url }}, "image")
      
    } catch (err) {
      api.sendMessage(`${err}`, "text");
    }
  }
};