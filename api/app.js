const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv/config');

const IndexRoutes = require('./src/routes/index')


const app = express();

const uri = 'mongodb+srv://johnnithin08:nithinjohn@cluster0-juafa.mongodb.net/test?retryWrites=true&w=majority'

app.use(bodyparser.json());

app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    })

app.use('/',IndexRoutes);
 

mongoose.connect(uri, {useNewUrlParser: true,useUnifiedTopology: true}).then(() => {
    console.log("DB Connection successful");
    app.listen(8000,() => {
      console.log(`Your port is 8000`);
    });
})
.catch(err => {
  console.log(`Unable to connect to DB!!! Restarting...`,err);
})  


module.exports = app;
