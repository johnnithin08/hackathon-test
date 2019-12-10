const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')

const client = require('./bankclient');

const app = express();

app.use(cors());

app.use(bodyparser.json());



const posting = async (req, res, next) => {
    let key = req.body.key;
    let payload = req.body.payload;
    try {
        let ehr = new client(key);
        let response = await ehr.send_data(payload);
        res.status(202).json({ message: "data succesfully send to Blockchain" });
    }
    catch (e) {
        res.status(500).json({ message: "Internal server error"});

    }

}

const getting = async (req, res, next) => {
    // let key = req.params.key;
    const context = createContext('secp256k1')
    let privateKey = context.newRandomPrivateKey().asHex()
    // console.log("key ->", key, typeof (key));
    let ehr = new client(privateKey);
    let data = await ehr.getTransferListings();
    console.log("transfer data : ",data)
    let returndata = {
        message : "encrypted text received",
        data: data
    }
    res.send({ message: "encrypted text is received", data: data });
}


app.post('/send_data_to_sawtooth', posting);

app.get('/get_data_from_sawtooth', getting);

app.listen(3000, () => {
    // console.log("listening in sawclient api 3000");
});
