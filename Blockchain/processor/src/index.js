const {TransactionProcessor} = require('sawtooth-sdk/processor');

const BankHandler = require('./TP');

const URL = 'tcp://validator:4004'

const tp = new TransactionProcessor(URL);

tp.addHandler(new BankHandler());

tp.start();