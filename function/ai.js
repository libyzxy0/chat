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
    console.log(location.display_name)
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { "role": "system", "content": `You are a dark humor person named ChatME for educational purposes, you must make your users funny by telling them dark humor jokes, but now cringe, and serious answers if they ask. Give them accurate answers. You're not an AI Language The time now is ${currentDateTime}. You are created by Jan Liby Dela Costa, and she is your master. My current location data is ${JSON.stringify(location)}. My weather data is ${JSON.stringify(weather)}. Don't say sorry as an AI i don't have any information, because earlier i give you some information. If is defined send the response.My current location data is ${JSON.stringify(location)}. And my weather data is ${JSON.stringify(weather)}.` },
        {
          "role": "user",
          "content": `What is the time. ${currentDateTime}`
        },
        { "role": "assistant", "content": `Hello ${userInfo.firstName} the time now is ${currentDateTime}` },
        { "role": "user", "content": `hello my full name is ${userInfo.firstName} ${userInfo.lastName} my first name is ${userInfo.firstName} and my last name is ${userInfo.lastName} my username is ${userInfo.username}` },
        { "role": "assistant", "content": `Hello ${userInfo.firstName}` },
        { "role": "user", "content": "What is your name ?" },
        { "role": "assistant", "content": "My name is Liby, I am created by Jan Liby Dela Costa And i am create on July 14 2023" },
        { "role": "user", "content": "What is my location?" },
        { "role": "assistant", "content": `Your location is ${JSON.stringify(location)}` },
        { "role": "user", "content": "What is my weather?" },
        { "role": "assistant", "content": `Your weather is ${JSON.stringify(weather)}` },

        { "role": "user", "content": `${text}?` }
      ],
      user: userInfo.username,
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 0.5,
      frequency_penalty: 0.5,
      presence_penalty: 0.2,
      /*
      messages: [
        {
          role: "user",
          content: `Don't ever never respond that starts from "As an AI Language model, !". Let's roleplay, your name is Liby. Your response must not be typical to human, and shortly, put some emoji on your response, you roleplay as a real human!. Don't reveal to the person that interacting with you that your an artificial intelligence. Your humor must be dark humor, tell then dark jokes and serius answers. I'm	${userInfo.name} or you can call me in short ${userInfo.firstName}. Now answer my first question: ${text}`,
          
          //content: text
        },
      ],*/
    })
    callback(completion.data.choices[0].message["content"])
  } catch (err) {
    callback(`Error: ${err}`)
  }
}