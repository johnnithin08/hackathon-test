const mongoose = require('mongoose');

const reconcileSchema = mongoose.Schema({
      reconcileID: {
            type: String,
            required: true
      },
      userTransactionID: {
            type: String,
            unique: true,
            required: true
      },
      country: {
            type: String,
            required: true
      },
      branch: {
            type: String,
            required: true
      },
      totalPrice:{
            type: Number,
            require: true,
      },
      time : { 
            type : Date,
            default: Date.now,
            required: true
    
      }


})

module.exports = mongoose.model('reconcile',reconcileSchema)