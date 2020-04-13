# Messenger Server

## Environment variables
To run server there are following environment variables should be set:
- JWT_SECRET - string password for HS256 jwt encoding (used if no key pairs were found)
- DB_URL - connection to database
- WEB_APP_URL - to enable CORS

## JWT Encoding

There are 2 supported JWT encryption by default: HS256 and RS256 - symmetric and asymmetric encryption.
In order, to issue and verify JWT tokens with asymmetric key pair it should be generated first. To do so, run the following script:
```
node scripts/generateKeyPair.js
```
This will create keys in server root directory which will be used to issue and verify JWT tokens.

Otherwise HS256 encoding will be used. Secret string should should be provided with `JWT_SECRET` environment variable.