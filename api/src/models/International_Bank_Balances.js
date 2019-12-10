const mongoose = require('mongoose');

const IntlBalSchema = mongoose.Schema({
    accountNo : {
        type : Number,
        required : true
    },
    balance: {
        type: Number,
        required:true
    }
});

module.exports = mongoose.model('intlbal',IntlBalSchema);