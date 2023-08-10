const ai = require('./ai');
function runChatbot(input, userInfo, userLocation, callback) {
  console.log(input + " | " + userInfo.firstName + " " + userInfo.lastName)
  if (input.startsWith('/')) {
    let api = {
      sendMessage: function(body, type) {
        if (type == "text") {
          callback({ body, attachments: { type: "msg" } })
        } else if (type == "image") {
          callback({
            body: "", attachments: {
              type: "image",
              url: body.attachment.url
            }
          })
        } else if (type == "v-video") {
          callback({
            body: "", attachments: {
              type: "v-video",
              url: body.attachment.url
            }
          })
        } else if (type == "h-video") {
          callback({
            body: "", attachments: {
              type: "h-video",
              url: body.attachment.url
            }
          })
        } else if (type == "audio") {
          callback({
            body: "", attachments: {
              type: "audio",
              url: body.attachment.url
            }
          })
        }
      }
    }
    try {
      let cmd = require(`./cmds/${input.split(" ")[0]}`)
      cmd({ input, api });
    } catch (err) {
      if (err.code == "MODULE_NOT_FOUND") {
        api.sendMessage("Command not found!", "text")
      } else {
        callback({ type: "message", body: `${err}` })
        console.log(err);
      }
    }
  } else {
    ai({ text: input, userInfo, userLocation }, (text) => {
      callback({ body: text, attachments: { type: "msg" } })
    })
  }
}
module.exports = { runChatbot };