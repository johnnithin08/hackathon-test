var uuid = require('uuid');
const fetch = require('node-fetch');
const { getCallBack } = require('../event/event');
const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')


const encrypt = require('../encryption/encryptioninitialise')
const Usersignup = require('../models/user')
const Local_Branch_Data = require('../models/Local_Branch')
const Local_Bank_Data = require('../models/Local_Bank')
const International_Bank_Data = require('../models/International_Bank')
const Decryps = require('../models/decrypt')
const localdata = require('../models/Local_Bank_Balances')
const intldata = require('../models/International_Bank_Balances')
let currencyexchg = 78.54;

eventCallback = (msg) => { //depreciated
    console.log('eventCallBack',msg);
}

getCallBack(eventCallback);

exports.signup = (req,res,next) => {
    console.log("Entered")
    let ID = req.body.userID;
    let pwd = req.body.password;
    let nm = req.body.name;
    try
    {
        const signupuser = new Usersignup({
            userID : ID,
            password : pwd,
            name : nm
        })
        console.log("before",signupuser)
        signupuser
        .save()
        .then(data => {
            console.log("Data added")
            res.send(data)
        }) 
        .catch(error => {
            console.log(error)
        })
    }
    catch(error)
     {
         console.log(error)
     }
    
    
    }
   



exports.login = (req,res,next) => {
    //res.render('../src/views/login.ejs',{});
    let initlocaldata = new localdata({
        accountNo : '123456789',
        balance : 100000
    },
    {
        accountNo : '12345678910',
        balance : 1000000000
    })
    initlocaldata.save();
    let initintldata = new intldata({
        accountNo : '987654321',
            balance : 5000000000
        },
        {
            accountno : '10987654321',
            balance : 60000000000
        
    })
    initintldata.save()
    let userID = req.body.userID;
    let password = req.body.password;
    console.log(userID);
    console.log(password);
    Usersignup.findOne({ userID : userID})
    .then(data => {
        console.log("data" , data)
        if(data.password == password)
         { 
             res.status(200).send("Logged in");
         }
        else
         {
             res.status(500).send("Invalid username or password")
         }
    })
    .catch(err => {
        console.log(err.message)
    })
}


exports.local_branch_transfer = async (req,res,next) => {
    let transferID = uuid.v1();
    let transactionID = uuid.v1();
    let branchcode = 12345;
    let amount = req.body.amount;
    let time = Date.now();
    let transferdata = new Local_Branch_Data({
        transferID : transferID,
        transactionID : transactionID,
        amount : amount,
        time : time
    })
    transferdata
    .save()
    .then(transfer => {
        console.log("Data added to local branch")
        let localbanktransactiondata = new Local_Bank_Data({
            transactionID : transactionID,
            branchcode : branchcode,
            status : 'Submitted',
            amount : amount,
            time : time
        })
        localbanktransactiondata
        .save()
        .then(transaction => {
            console.log("Data added to local bank")
            let resp = {
                transfer : transfer,
                transaction : transaction
            }
            res.send(resp)
        }) 
        .catch(error => {
        console.log(error)
        })
    }) 
    .catch(error => {
    console.log(error)
    })

}

exports.get_local_branch_fund = (req,res,next) => {
    localdata.find({ accountNo : '123456789'})
    .then(data => {
        console.log("Balance of local branch : ",data)
        res.status(200).send(data)
    })
}

exports.get_local_bank_fund = (req,res,next) => {
    localdata.find({ accountNo : '12345678910'})
    .then(data => {
        console.log("Balance of local bank : ",data)
        res.status(200).send(data)
    })
}

exports.get_int_bank_fund = (req,res,next) => {
    intldata.find({ accountNo : '987654321'})
    .then(data => {
        console.log("Balance of intl bank : ",data)
        res.status(200).send(data)
    })
}

exports.get_int_branch_fund = (req,res,next) => {
    intl.find({ accountNo : '10987654321'})
    .then(data => {
        console.log("Balance of intl branch : ",data)
        res.status(200).send(data)
    })
}

exports.get_local_bank_transfer = (req,res,next) => {
    Local_Bank_Data.find({ "status" : "Submitted"})
    .then(data => {
        console.log("data : " , data)
        res.status(200).send(data)
    })
}

exports.local_bank_transfer = async (req,res,next) => {
    let transactionID = req.body.transactionID
    let amountinr = req.body.amount;
    amount = amountinr/currencyexchg;
    let time = req.body.time;
    let branchcode = req.body.branchcode
    let GRICcode = req.body.GRICcode
    let reconcileID = uuid.v1()
    let transferdata = {
        ReconcileID : reconcileID,
        transactionID : transactionID,
        branchcode : branchcode,
        GRICcode : GRICcode,
        status : 'Awaiting Approval',
        amount : amount,
        time : time
    }
    let identifiers = {
        from_GRIC : "IN12345",
        from_branch_code : "12345",
        to_GRIC : "GER678910",
        to_branch_code : 678910,
        sender : 'Local'
    }
    localdata.update({},{ $inc : { balance : -amountinr }},(res) => {
        console.log("Balance update from local bank and branch : ",res)
    })
    let resp = await encrypt.Postdata(transferdata,identifiers)
    console.log("Usercontroller response : ",resp)
    Local_Bank_Data.update({transactionID : transactionID},{ $set : { status : 'Forwarded to International Bank'}},(res) => {
        console.log("Response from local bank : ",res)
    })
    
    let localbanktransactiondata = new International_Bank_Data({
        ReconcileID : reconcileID,
        transactionID : transactionID,
        status : "Submitted",
        branchcode : branchcode,
        amount : amount,
        time : time
    })
    localbanktransactiondata.save()
    .then(data => {
        console.log("Data added to  international db : ", data)
    })
    
    
    
}

exports.get_international_bank_transfers = async (req,res,next) => {
    International_Bank_Data.find({ "status" : "Submitted"})
    .then(data => {
        console.log("data : " , data)
        res.status(200).send(data)
    })
}



exports.hq_transfer = async (req,res,next) => {
    try
     {
        let geturl = 'http://sawtooth-client:3000/get_data_from_sawtooth' 
        let response = await fetch(geturl, {
            method: 'GET',
        })
        if (response.ok) 
        { 
            let jsondata = await response.json();
            console.log("Data in usercontroller : ",jsondata)
            // console.log(`response -> ${responseJson}`);
            let international_data = await Decryps.find({ status : 'Pending'})
            international_data = international_data[0]
            console.log("Data from international db : ", international_data)
            data_to_decode = international_data
            console.log("data to decode",data_to_decode)
            let data = encrypt.getdecodeddata(jsondata.data,data_to_decode.IV,data_to_decode.Key,data_to_decode.tag)
            data.status = "Approved"
            intldata.update({},{ $inc : { balance : +data.amount }},(res) => {
                console.log("Balance update from international bank and branch : ",res)
            })
            let identifiers = {
                from_GRIC : "IN12345",
                from_branch_code : "12345",
                to_GRIC : "GER678910",
                to_branch_code : 678910,
                sender : 'International'
                }
            let resp = await encrypt.Postdata(data,identifiers)
            console.log("Usercontroller response : ",resp)
            res.status(200).json({ data: data, message: "worked" });
        } 
        else 
        {
            alert("HTTP-Error: " + response.status);
        }
     }
    catch(error)
     {
         console.log(error.message)
     }
    
    
}
