const axios = require("axios");
module.exports = async ({ api }) => {
  let { data } = await axios.get('https://cataas.com/cat?json=true');
  let url = `https://cataas.com${data.url}`;
  api.sendMessage({ attachment: { url } }, "image");
}