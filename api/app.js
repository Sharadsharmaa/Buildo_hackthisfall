const express = require('express');
const app = express();
const http = require('http');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');
const compression = require('compression');
const { errors } = require('celebrate');
const cors = require('cors');
const config = require('./config/config');
const db = require('./config/database.json');
const mongoose = require('mongoose');
const swagger = require('./docs/swaggerConfig');

const PORT = config.port;
const uri = `mongodb+srv://${db[config.environment].user}:${db[config.environment].password}@${db[config.environment].host}/${db[config.environment].database}?retryWrites=true&w=majority`
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // reconnectTries: 60,
  // reconnectInterval: 2000,
  useCreateIndex: true,
  useFindAndModify: false
});
console.log(uri)

mongoose.connection.on('error', (err) => console.error(err));
mongoose.connection.on('open', () => console.log("Connected"));




app.use(helmet());
app.use(logger('dev'));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: 'false' }));
app.use(express.static(path.join(__dirname, '../user/dist/user')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./routes'));
app.use(errors());
app.use("/api-docs", swagger.swaggerUI.serve, swagger.swaggerUI.setup(swagger.specs));

app.use(/^((?!(api)).)*/, (req, res) => {
  if (req.method === 'GET') {
    res.sendFile(path.join(__dirname, '../user/dist/user/index.html'));
  } else {
    res.status(500).json({
      message: req.method + ' not Allowed'
    });
  }
});

const httpServer = http.createServer(app);
httpServer.listen(PORT, (err) => {
  console.log('http server running on port ' + PORT);
});
