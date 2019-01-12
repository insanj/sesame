'use strict';

// deps
const express = require('express');
require('dotenv').config();
const SesameCode = require('./code.js');

// api setup
const app = express();

app.get('/', (req, res) => {
    const qrCodeDataURL = SesameCode.generateSesameQRCode({
        SESAME_API_HOST:process.env.SESAME_API_HOST,
        SESAME_API_PORT:process.env.SESAME_API_PORT
    });

    res.status(200).send(qrCodeDataURL).end();
});

app.listen(process.env.SESAME_API_PORT, () => {
  console.log(`🍩 listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

