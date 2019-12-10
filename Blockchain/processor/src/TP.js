const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding');
const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const crypto = require('crypto');

var enc = new TextEncoder('utf8')
var dec = new TextDecoder('utf8')

const GRIC= "GER678910"
const Bank_Code = 678910
FAMILY_NAME='banktransfer';
const NAMESPACE = hash(FAMILY_NAME).substring(0, 6);

function hash(pk) {
    return crypto.createHash('sha512').update(pk).digest('hex');
}

function writeToStore(context, address, msg){
    let msgBytes = enc.encode(msg);
    let entries = {
        [address]: msgBytes 
      }
    return context.setState(entries);
}

class BankHandler extends TransactionHandler{
    constructor(){
        super(FAMILY_NAME, ['1.0'], [NAMESPACE]);
    }

    async apply(transactionProcessRequest, context){
        var msg = dec.decode(transactionProcessRequest.payload);
        let header = transactionProcessRequest.header;
        this.publicKey = header.signerPublicKey
        msg = JSON.parse(msg);
        let stringmsg = JSON.stringify(msg)
        let localaddress = hash(FAMILY_NAME).substr(0, 6) + hash(msg.identifiers.from_GRIC).substr(0,20) + hash(msg.identifiers.from_branch_code).substr(0,20) + hash(stringmsg).substr(0, 24);
        let internationaladdress = hash(FAMILY_NAME).substr(0, 6) + hash(msg.identifiers.to_GRIC).substr(0,20) + hash(msg.identifiers.to_branch_code.toString()).substr(0,20) + hash(stringmsg).substr(0, 24)
        console.log("Address : ",localaddress)
        console.log();
        console.log("parsed msg",msg)
        console.log("msg ---> ",`{ msg:${msg.action}, payload:${msg.payload} }`);
        console.log();
        if( msg.action === "data-store-local")
        {
            try{
                const international_bank_state = await writeToStore(context, internationaladdress, msg.payload);
                // context.addEvent(`${FAMILY_NAME}/stored-data`, [['address', this.address]],"" );
                return trList;
            }
            catch(err){
                return err;
            }            
            
        }
        else if( msg.action === "data-store-intl")
        {
            try{
                internationaladdress = hash(FAMILY_NAME).substr(0, 6) + hash(msg.identifiers.to_GRIC).substr(0,20) + hash(msg.identifiers.to_branch_code.toString()).substr(0,20) + hash(stringmsg).substr(0, 24);
                context.addEvent(`${FAMILY_NAME}/international-bank-transfer-done`, [['address', internationaladdress]],"" );
                const international_bank_state = await writeToStore(context, internationaladdress, msg.payload);
                return trList;
            }
            catch(err){
                return err;
            }            
            
        }
        throw new InvalidTransaction("Unknown action!!!");
        ;
    }
}
module.exports = BankHandler;