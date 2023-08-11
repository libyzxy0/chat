const { Configuration, OpenAIApi } = require("openai");
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Manila');
const currentDateTime = moment();
const axios = require('axios');
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
module.exports = async ({ text, userInfo, userLocation }, callback) => {
  try {
    let location = userLocation ? userLocation : "";
    let city = location.address ? location.address.city : "Manila";
    let { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=57a49a207949984dc00306efe9038f8f`)
    let weather = location ? data : "";
    if(!location) {
      console.log("User location isn't available.")
    }
    let { aiModel } = require('./ai-model');
    let aiBehavior = aiModel({
      userInfo, 
      location, 
      weather, 
      currentDateTime, 
      text
    })
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: aiBehavior,
      user: userInfo.username,
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 0.5,
      frequency_penalty: 0.5,
      presence_penalty: 0.2,
    })
    callback(completion.data.choices[0].message["content"])
  } catch (err) {
    callback(`Error: ${err}`)
    console.log(err);
  }
}