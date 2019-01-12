
// deps
const twilio = require('twilio');

// core function
/*
async function askForPhoneNumber(config) {
    const accountSid = config.SESAME_TWILIO_ACCOUNT_SID;
    const authToken = config.SESAME_TWILIO_ACCOUNT_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    const serviceSID = config.SESAME_TWILIO_SERVICE_SID;
    
    client.messaging.services().fetch().then(service => {
        console.log(`Response = ${JSON.stringify(service)}`);
        return service;
    }).done();
}*/

async function sendSMSToPhoneNumber(config, body, phoneNumber) {
    return new Promise((resolve, reject) => {
        const accountSid = config.SESAME_TWILIO_ACCOUNT_SID;
        const authToken = config.SESAME_TWILIO_ACCOUNT_TOKEN;
        const client = twilio(accountSid, authToken);
    
        client.messages
        .create({from: config.SESAME_TWILIO_PHONE_NUMBER, body: body, to: phoneNumber})
        .then(message => resolve(message.sid))
        .catch(err => reject(err))
        .done();
    });
}

// exports
module.exports = {
    sendSMSToPhoneNumber: sendSMSToPhoneNumber,
};