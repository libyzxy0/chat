const mongoose = require('mongoose')

const connectDB = (url) => {
  mongoose.set("strictQuery", false);
    return mongoose.connect(url, {
    dbName: "ChatME",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB