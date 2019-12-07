const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
      userID: {
            type: String,
            required: true
      },
      password: {
            type: String,
            required: true
      },
      name: {
            type: String,
            required: true,
            trim: true,
      }


})

module.exports = mongoose.model('userSchema', userSchema)