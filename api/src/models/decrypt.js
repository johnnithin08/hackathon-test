const mongoose = require('mongoose');

const DecSchema = mongoose.Schema({
    transactionID : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    },
    IV: {
        type:String,
        required:true
    },
    Key:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        required:true
    },
    privk:{
        type:String,
        required:true
    },
});

module.exports = mongoose.model('decryps',DecSchema);