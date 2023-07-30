const { Configuration, OpenAIApi } = require("openai");
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Manila');
const currentDateTime = moment();
const axios = require('axios');
module.exports = async ({ text, userInfo, location, apikey, botName }, callback) => {
  const configuration = new Configuration({
  apiKey: apikey,
});
  userInfo.firstName = userInfo.name;
  try {
    let city = location ? location : "Manila";
    let { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=57a49a207949984dc00306efe9038f8f`)
    let weather = location ? data : "";
    let { aiModel } = require('./ai-model');
    let aiBehavior = aiModel({
      userInfo, 
      location, 
      weather, 
      currentDateTime, 
      text, 
      inf: {
        name: botName
      }
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
    callback(`${err}`)
  }
}