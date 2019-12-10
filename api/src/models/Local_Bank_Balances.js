const mongoose = require('mongoose');

const LocalBalSchema = mongoose.Schema({
    accountNo : {
        type : Number,
        required : true
    },
    balance: {
        type: Number,
        required:true
    }
});

module.exports = mongoose.model('localbal',LocalBalSchema);