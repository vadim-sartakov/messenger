const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const { publicKey, privateKey } = crypto.generateKeyPairSync(
  'rsa',
  {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  }
);

fs.writeFileSync(path.resolve(__dirname, '..', 'private.key'), privateKey);
fs.writeFileSync(path.resolve(__dirname, '..', 'public.key'), publicKey);