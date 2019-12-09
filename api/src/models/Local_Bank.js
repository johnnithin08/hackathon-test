const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
      transactionID: {
            type: String,
            required: true
      },
      branchcode: {
            type : Number,
            required : true
      },
      status : {
            type : String,
            required : true
      },
      amount: {
            type: Number,
            required: true
      },
      time : { 
            type : Date,
            default: Date.now,
            required: true
    
      }


})

module.exports = mongoose.model('transactionSchema', transactionSchema)