require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
require('./models/Auth');
const app = express();
const expressValidator = require('express-validator');
const routes = require('./routes/router');
const Promise = require('es6-promise');
// const router = require('./router');
const mongoose = require('mongoose');
const errorHandlers = require('./handlers/errorHandlers');

// const cors = require('cors');  Needed in the future
const port = process.env.PORT || 3090;
app.set();
app.use(bodyParser.json({type: '*/*'}));
app.use(expressValidator());
app.use(morgan('combined'));
app.use('/', routes);

// DB setuo
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});
// Import models

console.log('Server listening:',port)
app.set('port', port);
app.use(errorHandlers.notFound);
if (process.env.NODE_ENV == 'development') {

  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}
app.use(errorHandlers.productionErrors);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
