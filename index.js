'use strict';

// deps
const express = require('express');
require('dotenv').config();
const SesameCode = require('./code.js');

// config
const sesameConfig = {
    SESAME_API_HOST:process.env.SESAME_API_HOST,
    SESAME_API_PORT:process.env.SESAME_API_PORT
};

console.log(`🌻 waking up with config: ${JSON.stringify(sesameConfig)}`);

// api setup
const app = express();

app.get('/', async (req, res) => {
    try {
        const qrCodeDataURL = await SesameCode.generate(sesameConfig);
        res.status(200).send(qrCodeDataURL).end();
    } catch (e) {
        res.status(500).send(e).end();
    }
});

app.get('/render', async (req, res) => {
    try {
        const qrCodeDataURL = await SesameCode.generate(sesameConfig);
        res.status(200).send(`<html><img src="${qrCodeDataURL}" /></html>`).end();
    } catch (e) {
        res.status(500).send(e).end();
    }
});

app.listen(sesameConfig.SESAME_API_PORT, () => {
  console.log(`🍩 listening on port ${sesameConfig.SESAME_API_PORT}`);
  console.log('Press Ctrl+C to quit.');
});

