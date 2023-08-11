const axios = require("axios");
module.exports = ({ input, api }) => {
  axios.get('https://shoti-api.libyzxy0.repl.co/api/get-shoti?apikey=shoti-1h7h3k6dmc7om459b2o').then(response => {
    api.sendMessage({ attachment: {
      url: response.data.data.url 
     } 
    }, "v-video");
  })
}