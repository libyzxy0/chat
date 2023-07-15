const ai = require('./ai');
function runChatbot(input, userInfo, callback) {
  console.log(input + " | " + userInfo.firstName + " " + userInfo.lastName)
  if (input.startsWith('/')) {
    let api = {
      sendMessage: function(body, type) {
        if (type == "text") {
          callback({ body, attachments: { type: "msg" } })
        } else if (type == "image") {
          callback({ body: "", attachments: {
            type: "image", 
            url: body.attachment.url
          }})
        } else if(type == "video") {
          callback({ body: "", attachments: {
            type: "video", 
            url: body.attachment.url
          }})
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
      }
    }
  } else {
    ai({ text: input, userInfo }, (text) => {
      callback({ body: text, attachments: { type: "msg" } })
    })
  }
}
module.exports = { runChatbot };