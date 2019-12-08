var uuid = require('uuid');
const fetch = require('node-fetch');
const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')


const encrypt = require('../encryption/encryptioninitialise')
const Usersignup = require('../models/user')
const Local_Branch_Data = require('../models/Local_Branch')
const Local_Bank_Data = require('../models/Local_Bank')
const International_Bank_Data = require('../models/International_Bank')
const Decryps = require('../models/decrypt')



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
    let userID = req.body.userID;
    let password = req.body.password;
    console.log("here")
    Usersignup.findOne({ userID : userID})
    .then(data => {
        console.log("data" , data)
        if(data.password == password)
         { 
             res.status(200).send("Logged in")
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
    let amount = req.body.amount;
    let time = Date.now();
    let transferdata = new Local_Branch_Data({
        transferID : transferID,
        transactionID : transactionID,
        amount : amount,
        time : time
    })
    let resp = await encrypt.Postdata(transferdata)
    transferdata
    .save()
    .then(transfer => {
        console.log("Data added to local branch")
        let localbanktransactiondata = new Local_Bank_Data({
            transactionID : transactionID,
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
            res.status(200).send(resp)
        }) 
        .catch(error => {
        console.log(error)
        })
        res.status(200).send(transfer)
    }) 
    .catch(error => {
    console.log(error)
    })

}

exports.get_local_bank_transfer = (req,res,next) => {
    Local_Bank_Data.find()
    .then(data => {
        console.log("data : " , data)
        res.status(200).send(data)
    })
}
exports.local_bank_transfer = async (req,res,next) => {
    let transactionID = req.body.transactionID
    let amount = req.body.amount;
    let time = req.body.time;
    let reconcileID = uuid.v1()
    let localbanktransactiondata = new International_Bank_Data({
        ReconcileID : reconcileID,
        transactionID : transactionID,
        amount : amount,
        time : time
    })
    try
     {
        let resp = await localbanktransactiondata.save()
     }
    catch(error) 
    {
    console.log(error)
    }
    await encrypt(data)
    
}

