// deps
const QRCode = require('qrcode')
const fs = require('fs');

// helper functions
async function getSesameAPIURL(config) {
    const host = config.SESAME_API_HOST;
    const port = config.SESAME_API_PORT;
    if (!host || !port) {
        throw new Error(`Unable to get sesame API URL because the .env file was not configured properly. Host: ${host}. Port: ${port}.`);
    }

    return `http://${host}:${port}/`;
}

async function getSesameAPIAskEndpointURL(config) {
    const endpoint = "ask";
    return `${getSesameAPIURL(config)}${endpoint}`;
}

async function getSesameQRCodePath(config) {
    return config.SESAME_QR_CODE_PATH;
}

async function writeFileToPath(filename, data, encoding="UTF8") {
    return new Promise(function(resolve, reject) {
        fs.writeFile(filename, data, encoding, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}


// core functions
async function generateSesameQRCode(config) {
    const qrCodeContents = await getSesameAPIAskEndpointURL(config);
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeContents);
    // const qrCodePath = await getSesameQRCodePath(config);
    // const qrCodeWriteResult = await writeFileToPath(qrCodePath, qrCodeDataURL);
    return qrCodeDataURL;
}

// exports

module.exports = function (options) {
    return {
        generate: generateSesameQRCode(config)
    }
}