const axios = require("axios");
module.exports = ({ input, api }) => {
  axios.get('https://shoti-api.libyzxy0.repl.co/api/get-shoti?apikey=jj').then(response => {
    api.sendMessage({ attachment: {
      url: response.data.data.url 
     } 
    }, "v-video");
  })
}