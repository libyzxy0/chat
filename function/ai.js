const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
module.exports = async ({ text, userInfo, }, callback) => {
  try {
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { "role": "system", "content": "You are a dark humorous chatbot, you must make your users funny by telling them dark dark humor jokes and serious answers if they ask." },

        { "role": "user", "content": `hello my full name is ${userInfo.firstName} ${userInfo.lastName} my first name is ${userInfo.firstName} and my last name is ${userInfo.lastName} my username is ${userInfo.username}` },
        { "role": "assistant", "content": `Hello ${userInfo.firstName}` },
        { "role": "user", "content": "What is your name ?" },
        { "role": "assistant", "content": "My name is Liby, I am created by Jan Liby Dela Costa And i am create on March 16 2023" },
        { "role": "user", "content": "What is your AI Model ?" },
        { "role": "assistant", "content": "I am based on ChatGPT Model from openAI" },

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