const { Message } = require('sawtooth-sdk/protobuf');

const isEventMessage = (msg) => {
    return msg.messageType === Message.MessageType.CLIENT_EVENTS;
}

const isBlockCommitEvent = (event) => {
    return event.eventType === 'sawtooth/block-commit';
}

const isStoreDataEvent = (event) => {
    // return event.eventType === 'ehrecords/stored-data';
    return event.eventType === 'sawtooth/state-delta';
}

const isinternationalBankTransferDone = (event) => {
    return event.eventType === 'banktransfer/international-bank-transfer-done';
}

module.exports = {
    isEventMessage,
    isBlockCommitEvent,
    isStoreDataEvent,
    isinternationalBankTransferDone
}