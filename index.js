 const express = require('express');
const app = express();
const cors = require('cors');
const db = require("./database/firebase");
const port = process.env.PORT || 3000;
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

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

app.listen(port, () => console.log(`Listening on port ${port}`))