const Enc_Dec = require('./encrypt');

const fetch = require('node-fetch');
const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const Decryps = require('../models/decrypt')





exports.Postdata = async (data) => {
    let enc = new Enc_Dec();

    const context = createContext('secp256k1')
    let privateKey = context.newRandomPrivateKey().asHex();
    // console.log("type of private key", typeof (signer));
    console.log("data : ",data)
    let stringdata= JSON.stringify(data)
    let cipherData = enc.encrypt(stringdata);
    let ciphers = cipherData.split(":");
    const decryps = new Decryps({
        IV: ciphers[1],
        Key: ciphers[2],
        tag: ciphers[3],
        privk: privateKey
    });
    decryps
        .save()
        .then(data => {
            console.log("data added");
        })
        .catch(err => {
            console.log(err.message);
        })


    let encryp = ciphers[0]

    try {
        const payload = {
            action: "data-store",
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
            let response = JSON.parse({ message: "data recieved", data: encryp, privatekey: privateKey })
            return response;
        }
        else{
            throw res.status(500).json(data);
        }
    }
    catch (error) {
        console.log("error in fetch", error);
        let errorresponse = JSON.parse({ message: "Internal server error", id: "ehrEr001"})
        return errorresponse;
       
    }

    
}


exports.getDataById = async (req, res, next) => {
    let hnID = req.params.hnId;
    console.log("id is : " + hnID)

    try {
        let doc = await Decryps.findById({ _id: hnID });
        ;
        var geturl = 'http://sawtooth-client:3000/dataout/' + doc.privk
        let response = await fetch(geturl, {
            method: 'GET',
        })
        let responseJson = await response.json();
        console.log(`response -> ${responseJson}`);

        let dec = new Enc_Dec();
        let data = dec.decrypt(responseJson.data, doc.IV, doc.Key, doc.tag)
        res.status(200).json({ data: data, message: "worked" });
    }
    catch (err) {
        logger.error(err);
    }
}