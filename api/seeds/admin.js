const config = require('../config/config');
const db = require('../config/database.json');
const mongoose = require('mongoose');
const Admin = require('../models/admin');
const uri = `mongodb+srv://${db[config.environment].user}:${db[config.environment].password}@${db[config.environment].host}/${db[config.environment].database}?retryWrites=true&w=majority`
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // reconnectTries: 60,
  // reconnectInterval: 2000,
  useCreateIndex: true,
  useFindAndModify: false
})
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        let admin = new Admin({ email: "admin@buildo.com", name: "admin", mobile: "9156156144" });
        admin.setPassword("qwerty123");
        admin.save().then(() => {
            console.log('seed exectued');
            process.exit();
        }).catch((err) => {
            console.log(err);
            process.exit();
        })
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();

    });