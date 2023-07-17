const express = require('express');
const app = express();
const cors = require('cors');
const fs = require("fs");
const port = process.env.PORT || 3000;
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./database/connect');
/*
const db = require('./database/firebase');
db.readData('threads').then(res => console.log(res));
*/
/*
const db = require('./database/db');
db.getUsers(array => console.log(array))
*/

app.use(express.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use('/', require('./routes/pages'));

app.use('/auth', require('./routes/authentication'))

app.use('/api', require('./routes/api'))
app.use(notFound);
//app.use(errorHandlerMiddleware);

//Database connection
(async (uri) => {
  try {
    await connectDB(uri);
  } catch (error) {
    console.log("Error while connecting to database!\n" + error);
  }
})(process.env.MONGO_URI);


app.listen(port, () => console.log(`Listening on port ${port}`))