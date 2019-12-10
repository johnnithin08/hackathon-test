const io = require('socket.io-client');

var client = '';

const getCallBack = (fn) => {
    callBack = fn ;
}

const def = (msg) => {
    console.log('def',msg);
}

var callBack = def;

init = () => {
   client = io.connect('http://sawtooth-eventhandle:9000');

   client.on('international-bank-transfer-done', (msg) => {
    console.log(typeof(msg));
    callBack(msg);
});
}

module.exports = { init, getCallBack }
