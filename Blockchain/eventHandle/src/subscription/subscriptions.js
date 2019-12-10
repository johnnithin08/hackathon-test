const {EventSubscription} = require('sawtooth-sdk/protobuf');

const subsriptions = [
    EventSubscription.create({
        eventType: 'sawtooth/block-commit'
      }),
    EventSubscription.create({
      eventType: 'sawtooth/state-delta'
    }),
    EventSubscription.create({
      eventType: 'banktransfer/international-bank-transfer-done'
    })
];

getSub = () => {
    return subsriptions;
}

module.exports = {
  getSub
};