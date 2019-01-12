'use strict';

// deps
const express = require('express');
var emoji = require('node-emoji')
require('dotenv').config();
const SesameCode = require('./code.js');
const SesameTwilio = require('./twilio.js');

// config
const sesameConfig = {
    SESAME_API_HOST:process.env.SESAME_API_HOST,
    SESAME_API_PORT:process.env.SESAME_API_PORT,
    SESAME_TWILIO_ACCOUNT_SID:process.env.SESAME_TWILIO_ACCOUNT_SID,
    SESAME_TWILIO_ACCOUNT_TOKEN:process.env.SESAME_TWILIO_ACCOUNT_TOKEN,
    SESAME_TWILIO_SERVICE_SID:process.env.SESAME_TWILIO_SERVICE_SID,
    SESAME_TWILIO_PHONE_NUMBER:process.env.SESAME_TWILIO_PHONE_NUMBER
};

console.log(`🌻 waking up with config: ${JSON.stringify(sesameConfig)}`);

// api setup
const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/code', async (req, res) => {
    try {
        const qrCodeDataURL = await SesameCode.generate(sesameConfig);
        res.status(200).send({
            code: qrCodeDataURL,
            message: `🌻 Handing off QR code so someone can talk to the API`,
        }).end();
    } catch (e) {
        res.status(500).send({
            error:e
        }).end();
    }
});

app.get('/code/render', async (req, res) => {
    try {
        const qrCodeDataURL = await SesameCode.generate(sesameConfig);
        res.status(200).send(`<html><img src="${qrCodeDataURL}" /></html>`).end();
    } catch (e) {
        res.status(500).send(e).end();
    }
});

// auth endpoints
var tokens = {};
app.get('/ask/:phoneNumber', (req, res) => {
    // const qrCodeDataURL = await SesameCode.generateWithContents(askTwilioPhoneNumber);
    const phoneNumber = req.params.phoneNumber;
    if (!phoneNumber || phoneNumber.length <= 0) {
        const e = new Error(`Invalid phone number provided ${phoneNumber}`);
        console.error(e);
        res.status(500).send({
            error: e
        }).end();
        return;
    }

    const lengthOfEmojiCode = 1;
    var emojiString = "";
    for (var i = 0; i < lengthOfEmojiCode; i++) {
        emojiString += emoji.random().emoji;
    }

    const authCode = emojiString;
    tokens[phoneNumber] = authCode;

    SesameTwilio.sendSMSToPhoneNumber(sesameConfig, authCode, phoneNumber).then(response => {
        res.status(200).send({
            message: `🍩 Check phone # ${phoneNumber} for an auth token.`,
            phoneNumber: phoneNumber,
            authCode: authCode
        }).end();
    }).catch(e => {
        console.error(e);
        res.status(500).send({
            error: e
        }).end();
    });
});

app.get('/tell/:phoneNumber/:authToken', (req, res) => {
    // const qrCodeDataURL = await SesameCode.generateWithContents(askTwilioPhoneNumber);
    const phoneNumber = req.params.phoneNumber;
    const authToken = req.params.authToken;

    if (!phoneNumber || phoneNumber.length <= 0 || !authToken || authToken.length <= 0) {
        res.status(500).send({
            error: new Error(`Invalid phone number or auth token provided ${phoneNumber} ${authToken}`)
        }).end();
        return;
    }

    const success = tokens[phoneNumber] === authToken;
    if (success === true) {
        res.status(200).send({
            message: `✅ ${phoneNumber} authorized!`,
            authorized: true,
            phoneNumber: phoneNumber,
            authToken: authToken
        }).end(); // authorized
    } else {
        res.status(500).send({
            error: `Invalid phone number.`
        }).end();
    }
});

app.listen(sesameConfig.SESAME_API_PORT, () => {
  console.log(`🍩 listening on port ${sesameConfig.SESAME_API_PORT}`);
  console.log('Press Ctrl+C to quit.');
});

