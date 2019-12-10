const Enc_Dec = require('./encrypt');

const fetch = require('node-fetch');
const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const Decryps = require('../models/decrypt')





exports.Postdata = async (data,identifiers) => {
    let enc = new Enc_Dec();
    let status
    const context = createContext('secp256k1')
    let privateKey = context.newRandomPrivateKey().asHex();
    // console.log("type of private key", typeof (signer));
    console.log("data : ",data)
    let stringdata= JSON.stringify(data)
    let cipherData = enc.encrypt(stringdata);
    let ciphers = cipherData.split(":");
    if(identifiers.sender == 'Local')
     {
        status = "Pending"
     }
    else
     {
        status = "Approved"
     }
    console.log("Decrypt data stored to db")
    
    const decryps = new Decryps({
        transactionID : data.transactionID,
        IV: ciphers[1],
        Key: ciphers[2],
        tag: ciphers[3],
        privk: privateKey,
        status : status
    });
    decryps
        .save()
        .then(data => {
            console.log("Decrypt data : ", data);
        })
        .catch(err => {
            console.log(err.message);
        })


    let encryp = ciphers[0]

    try {
        let action;
        if(identifiers.sender == 'Local')
         {
             action = "data-store-local"
         }
        else
         {
             action = "data-store-intl"
         }
        const payload = {
            action: action,
            identifiers : identifiers,
            payload: encryp
        }
        const resp = await fetch('http://sawtooth-client:3000/send_data_to_sawtooth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: privateKey,
                payload: payload
            })
        });
        const data = await resp.json();
        console.log(data);    
        if(resp.ok){
            console.log(data);
            let response = { message: "data recieved", data: encryp, privatekey: privateKey }
            return response;
        }
        else{
            throw res.status(500).json(data);
        }
    }
    catch (error) {
        console.log("error in fetch", error);
        let errorresponse = { message: "Internal server error"}
        return errorresponse;
       
    }

    
}


exports.getDataById = async (req, res, next) => {
    // let hnID = req.params.hnId;
    // console.log("id is : " + hnID)

    try {
        // let doc = await Decryps.findById({ _id: hnID });
        // ;
        // var geturl = 'http://sawtooth-client:3000/dataout/' + doc.privk
        // let response = await fetch(geturl, {
        //     method: 'GET',
        // })
        // let responseJson = await response.json();
        // console.log(`response -> ${responseJson}`);
        let encdata = req.body.data;
        let iv = req.body.iv;
        let key = req.body.key;
        let tag = req.body.tag;

        let dec = new Enc_Dec();
        let data = dec.decrypt(encdata, iv, key,tag)
        res.status(200).json({ data: data, message: "worked" });
    }
    catch (err) {
        console.log(err);
    }
}

exports.getdecodeddata = (data,iv,key,tag) => {
    let datareceived = data
    let ivreceived = iv
    let keyreceived = key
    let tagreceived = tag
    try {
        let dec = new Enc_Dec();
        let data = dec.decrypt(datareceived, ivreceived, keyreceived,tagreceived)
        console.log("decrypted data : ",data)
        return data;
    }
    catch (err) {
        console.log(err);
    }
}